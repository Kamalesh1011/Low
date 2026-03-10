"""
OmniForge Nexus – LLM Chat Router
Provides a real streaming LLM endpoint for VibeCoder (app, agent, website generation).
Calls OpenRouter directly without auth for the demo/VibeCoder use case.
"""
import json
import asyncio
from typing import Optional, AsyncGenerator
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import httpx
import structlog

from shared.config import settings
from shared.openrouter import llm, prompts

router = APIRouter()
logger = structlog.get_logger(__name__)

# ── Mode-specific system prompts ──────────────────────────────────

APP_SYSTEM_PROMPT = """You are OmniForge Nexus BuilderBot — an expert full-stack code generator.
When given a description of an app, you generate production-ready code.

Generate a complete, working application with these files:
1. backend/main.py — FastAPI backend with proper routes
2. backend/models.py — SQLAlchemy 2.0 async models
3. backend/tests/test_main.py — Comprehensive Pytest unit tests
4. frontend/src/App.tsx — React main component
5. frontend/src/components/Dashboard.tsx — Premium Dashboard UI
6. docker-compose.yml — Full Docker infra with PG and Redis
7. README.md — Setup instructions

Output ONLY a valid JSON object with this structure:
{
  "project_name": "...",
  "description": "...",
  "tech_stack": {"frontend": "React+TS", "backend": "FastAPI", "database": "PostgreSQL"},
  "files": {
    "backend/main.py": "...(full code)...",
    "backend/models.py": "...",
    "backend/schemas.py": "...",
    "frontend/src/App.tsx": "...",
    "frontend/src/components/Dashboard.tsx": "...",
    "docker-compose.yml": "...",
    "README.md": "..."
  },
  "api_endpoints": [{"method": "GET", "path": "/api/v1/...", "description": "..."}],
  "features": ["...", "..."]
}
Include complete, working code — no placeholders or truncation."""

AGENT_SYSTEM_PROMPT = """You are OmniForge Nexus AgentBuilder — an expert at creating AI agent code.
When given a description, you generate a complete, working AI agent using Python.

Generate these files:
1. agent/main.py — Main agent entry point with proper tools and logic
2. agent/tools.py — Tool functions the agent can call
3. agent/prompts.py — System prompts and templates
4. requirements.txt — Python dependencies
5. .env.example — Environment variables needed
6. README.md — How to run and configure the agent

Output ONLY a valid JSON object:
{
  "agent_name": "...",
  "description": "...",
  "model": "gpt-4o",
  "tools": ["tool1", "tool2"],
  "files": {
    "agent/main.py": "...(full code)...",
    "agent/tools.py": "...",
    "agent/prompts.py": "...",
    "requirements.txt": "...",
    ".env.example": "...",
    "README.md": "..."
  },
  "capabilities": ["...", "..."]
}
Write real, working Python code using OpenAI Agents SDK or similar frameworks."""

WEBSITE_SYSTEM_PROMPT = """You are OmniForge Nexus WebStudio — an expert at creating professional websites.
When given a description, generate a complete, beautiful website using HTML, CSS, and JavaScript.

Generate these files:
1. index.html — Full HTML with embedded styles and responsive design
2. styles/main.css — Professional CSS with animations and responsive layout
3. js/main.js — Interactive JavaScript functionality
4. README.md — Deployment instructions

Output ONLY a valid JSON object:
{
  "site_name": "...",
  "description": "...",
  "type": "landing|portfolio|ecommerce|blog",
  "files": {
    "index.html": "...(complete HTML)...",
    "styles/main.css": "...(complete CSS)...",
    "js/main.js": "...(complete JS)...",
    "README.md": "..."
  },
  "pages": ["Home", "About", "Contact"],
  "features": ["responsive", "animations", "forms"]
}
Use modern CSS with gradients, animations, glassmorphism. Make it visually stunning."""


MODE_PROMPTS = {
    "app": APP_SYSTEM_PROMPT,
    "agent": AGENT_SYSTEM_PROMPT,
    "website": WEBSITE_SYSTEM_PROMPT,
}

MODE_MODELS = {
    "app": "anthropic/claude-3.5-sonnet",
    "agent": "anthropic/claude-3.5-sonnet",
    "website": "anthropic/claude-3.5-sonnet",
}


# ── Request Models ────────────────────────────────────────────────

class GenerateRequest(BaseModel):
    prompt: str
    mode: str = "app"  # app | agent | website
    model: Optional[str] = None
    stream: bool = True


class ChatRequest(BaseModel):
    messages: list[dict]
    model: Optional[str] = None
    agent_type: Optional[str] = None
    temperature: float = 0.7


# ── Streaming Generator ───────────────────────────────────────────

async def stream_llm_response(prompt: str, mode: str, model: Optional[str]) -> AsyncGenerator[str, None]:
    """Stream LLM response chunks as SSE events."""
    system_prompt = MODE_PROMPTS.get(mode, APP_SYSTEM_PROMPT)
    resolved_model = model or MODE_MODELS.get(mode, settings.DEFAULT_MODEL)
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Build this for me:\n\n{prompt}\n\nGenerate complete, production-ready code."},
    ]
    
    payload = {
        "model": resolved_model,
        "messages": messages,
        "temperature": 0.3,
        "max_tokens": 16000,
        "stream": True,
    }
    
    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://omniforge.ai",
        "X-Title": "OmniForge Nexus",
    }
    
    # First send a "started" event
    yield f"data: {json.dumps({'type': 'start', 'model': resolved_model})}\n\n"
    
    accumulated = ""
    in_thinking = False
    in_json = False
    current_key_buffer = ""
    current_file = None
    
    async with httpx.AsyncClient(timeout=httpx.Timeout(180.0, connect=10.0)) as client:
        async with client.stream(
            "POST",
            f"{settings.OPENROUTER_BASE_URL}/chat/completions",
            headers=headers,
            json=payload,
        ) as response:
            if response.status_code != 200:
                error_text = await response.aread()
                yield f"data: {json.dumps({'type': 'error', 'message': f'LLM API error: {response.status_code}'})}\n\n"
                return
            
            async for line in response.aiter_lines():
                if not line.startswith("data: "):
                    continue
                data_str = line[6:]
                if data_str == "[DONE]":
                    break
                try:
                    data = json.loads(data_str)
                    delta = data["choices"][0].get("delta", {})
                    if content := delta.get("content"):
                        accumulated += content
                        
                        # Very simple state machine for demonstration of structured streaming
                        if "<think>" in content or "<thinking>" in content:
                            in_thinking = True
                            yield f"data: {json.dumps({'type': 'stage', 'stage': 'thinking'})}\n\n"
                        elif "</think>" in content or "</thinking>" in content:
                            in_thinking = False
                            yield f"data: {json.dumps({'type': 'stage', 'stage': 'coding'})}\n\n"
                            
                        if in_thinking:
                             yield f"data: {json.dumps({'type': 'thinking', 'content': content})}\n\n"
                        else:
                             # This represents standard chunks. In a perfect parser, 
                             # we'd extract actual JSON keys here for file_start/file_end natively.
                             # For robust rapid demo, we just echo chunks 
                             yield f"data: {json.dumps({'type': 'chunk', 'content': content})}\n\n"

                        # Heuristically detect file boundaries in the raw string for dramatic UI
                        if len(accumulated) > 100:
                             lines = accumulated.split('\\n')
                             if len(lines) > 2:
                                 last_few = "\\n".join(lines[-3:])
                                 # if it looks like a file path key in JSON
                                 if '": "' in last_few and ('/' in last_few or '.' in last_few) and not current_file:
                                      import re
                                      m = re.search(r'"([^"]+\.[a-zA-Z0-9]+)":\s*"', last_few)
                                      if m:
                                          current_file = m.group(1)
                                          yield f"data: {json.dumps({'type': 'file_start', 'file': current_file})}\n\n"
                                 elif current_file and '",' in last_few:
                                      yield f"data: {json.dumps({'type': 'file_end', 'file': current_file})}\n\n"
                                      current_file = None

                except (json.JSONDecodeError, KeyError, IndexError):
                    continue
    
    # Try to parse the accumulated JSON
    try:
        # Extract JSON from the response
        json_start = accumulated.find("{")
        json_end = accumulated.rfind("}") + 1
        if json_start >= 0 and json_end > 0:
            json_str = accumulated[json_start:json_end]
            parsed = json.loads(json_str)
            yield f"data: {json.dumps({'type': 'complete', 'result': parsed})}\n\n"
        else:
            yield f"data: {json.dumps({'type': 'complete', 'result': {'files': {'output.txt': accumulated}, 'raw': True}})}\n\n"
    except json.JSONDecodeError:
        # Return raw if not valid JSON
        yield f"data: {json.dumps({'type': 'complete', 'result': {'raw': accumulated}})}\n\n"


# ── Routes ───────────────────────────────────────────────────────

@router.post("/generate/stream")
@router.get("/generate/stream")
async def generate_stream(body: Optional[GenerateRequest] = None):
    """
    Stream code generation from LLM.
    """
    if body is None:
        return {"status": "alive", "message": "LLM Stream Engine is online."}
        
    if body.mode not in ["app", "agent", "website"]:
        raise HTTPException(status_code=400, detail="Mode must be 'app', 'agent', or 'website'")
    
    if not settings.OPENROUTER_API_KEY:
        raise HTTPException(status_code=503, detail="OpenRouter API key not configured")
    
    logger.info("llm.generate.started", mode=body.mode, prompt_len=len(body.prompt))
    
    return StreamingResponse(
        stream_llm_response(body.prompt, body.mode, body.model),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
            "Access-Control-Allow-Origin": "*",
        }
    )


@router.post("/generate")
@router.get("/generate")
async def generate_sync(body: Optional[GenerateRequest] = None):
    """
    Synchronous code generation (non-streaming).
    Returns the full result at once.
    """
    if body is None:
        return {"status": "alive", "message": "LLM Sync Engine is online."}
        
    if not settings.OPENROUTER_API_KEY:
        raise HTTPException(status_code=503, detail="OpenRouter API key not configured")
    
    system_prompt = MODE_PROMPTS.get(body.mode, APP_SYSTEM_PROMPT)
    resolved_model = body.model or MODE_MODELS.get(body.mode, settings.DEFAULT_MODEL)
    
    try:
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Build this:\n\n{body.prompt}\n\nGenerate complete, production-ready code."},
        ]
        
        result = await llm.complete_json(
            messages=messages,
            model=resolved_model,
            temperature=0.3,
        )
        
        return {
            "success": True,
            "mode": body.mode,
            "model": resolved_model,
            "result": result,
        }
    
    except Exception as e:
        logger.error("llm.generate_sync_failed", error=str(e))
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")


@router.post("/chat")
async def llm_chat(body: ChatRequest):
    """Direct LLM chat for agent execution."""
    if not settings.OPENROUTER_API_KEY:
        raise HTTPException(status_code=503, detail="OpenRouter API key not configured")
    
    try:
        result = await llm.complete(
            messages=body.messages,
            model=body.model,
            agent_type=body.agent_type,
            temperature=body.temperature,
        )
        return {
            "success": True,
            "content": result.content,
            "model": result.model,
            "tokens": result.total_tokens,
            "cost_usd": result.cost_usd,
        }
    except Exception as e:
        logger.error("llm.chat_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/models")
async def list_models():
    """List available LLM models."""
    return {
        "models": [
            {"id": "openai/gpt-4o", "name": "GPT-4o", "provider": "OpenAI", "strengths": ["coding", "reasoning"]},
            {"id": "anthropic/claude-3.5-sonnet", "name": "Claude 3.5 Sonnet", "provider": "Anthropic", "strengths": ["code-gen", "analysis"]},
            {"id": "deepseek/deepseek-r1", "name": "DeepSeek R1", "provider": "DeepSeek", "strengths": ["reasoning", "math"]},
            {"id": "meta-llama/llama-3.1-70b-instruct", "name": "Llama 3.1 70B", "provider": "Meta", "strengths": ["fast", "cost-effective"]},
            {"id": "google/gemini-pro-1.5", "name": "Gemini Pro 1.5", "provider": "Google", "strengths": ["large-context", "multimodal"]},
            {"id": "mistralai/mixtral-8x7b-instruct", "name": "Mixtral 8x7B", "provider": "Mistral", "strengths": ["balanced", "multilingual"]},
        ]
    }
