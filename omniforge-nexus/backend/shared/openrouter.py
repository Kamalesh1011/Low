"""
OmniForge Nexus – OpenRouter LLM Client
Unified interface for all AI model interactions with retry logic, streaming, and cost tracking
"""
import json
import time
import asyncio
from typing import AsyncGenerator, Optional, Any
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
import structlog

from shared.config import settings

logger = structlog.get_logger(__name__)

# ── Model Registry ────────────────────────────────────────────
MODELS = {
    "gpt-4o": {
        "id": "openai/gpt-4o",
        "context": 128000,
        "cost_per_1k_input": 0.005,
        "cost_per_1k_output": 0.015,
        "strengths": ["coding", "reasoning", "architecture"],
    },
    "claude-3.5-sonnet": {
        "id": "anthropic/claude-3.5-sonnet",
        "context": 200000,
        "cost_per_1k_input": 0.003,
        "cost_per_1k_output": 0.015,
        "strengths": ["code-generation", "documentation", "analysis"],
    },
    "deepseek-r1": {
        "id": "deepseek/deepseek-r1",
        "context": 64000,
        "cost_per_1k_input": 0.0005,
        "cost_per_1k_output": 0.002,
        "strengths": ["validation", "reasoning", "math"],
    },
    "gemini-1.5-pro": {
        "id": "google/gemini-pro-1.5",
        "context": 2000000,
        "cost_per_1k_input": 0.00125,
        "cost_per_1k_output": 0.005,
        "strengths": ["large-context", "multimodal", "documents"],
    },
    "llama-3.1-70b": {
        "id": "meta-llama/llama-3.1-70b-instruct",
        "context": 128000,
        "cost_per_1k_input": 0.0009,
        "cost_per_1k_output": 0.0009,
        "strengths": ["fast", "cost-effective", "testing"],
    },
}

# ── Agent-to-Model Routing ────────────────────────────────────
AGENT_MODELS = {
    "planner": settings.PLANNER_MODEL,
    "architect": settings.ARCHITECT_MODEL,
    "builder": settings.BUILDER_MODEL,
    "validator": settings.VALIDATOR_MODEL,
    "tester": "meta-llama/llama-3.1-70b-instruct",
    "optimizer": "anthropic/claude-3.5-sonnet",
    "deployer": "openai/gpt-4o",
}


class LLMResponse:
    def __init__(self, content: str, model: str, usage: dict):
        self.content = content
        self.model = model
        self.input_tokens = usage.get("prompt_tokens", 0)
        self.output_tokens = usage.get("completion_tokens", 0)
        self.total_tokens = usage.get("total_tokens", 0)
        self.cost_usd = self._calculate_cost()

    def _calculate_cost(self) -> float:
        model_info = next(
            (m for m in MODELS.values() if m["id"] == self.model),
            {"cost_per_1k_input": 0.005, "cost_per_1k_output": 0.015}
        )
        return (
            (self.input_tokens / 1000) * model_info["cost_per_1k_input"] +
            (self.output_tokens / 1000) * model_info["cost_per_1k_output"]
        )


class OpenRouterClient:
    """Async OpenRouter client with retry logic, streaming, and cost tracking."""

    def __init__(self):
        self.base_url = settings.OPENROUTER_BASE_URL
        self.api_key = settings.OPENROUTER_API_KEY
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://omniforge.ai",
            "X-Title": "OmniForge Nexus",
        }
        self._client: Optional[httpx.AsyncClient] = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                timeout=httpx.Timeout(120.0, connect=10.0),
                limits=httpx.Limits(max_connections=50, max_keepalive_connections=20),
            )
        return self._client

    async def close(self):
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=30),
        retry=retry_if_exception_type((httpx.HTTPError, httpx.TimeoutException)),
    )
    async def complete(
        self,
        messages: list[dict],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 8192,
        response_format: Optional[dict] = None,
        agent_type: Optional[str] = None,
    ) -> LLMResponse:
        """Send a completion request to OpenRouter."""
        if agent_type and agent_type in AGENT_MODELS:
            resolved_model = AGENT_MODELS[agent_type]
        else:
            resolved_model = model or settings.DEFAULT_MODEL

        payload: dict[str, Any] = {
            "model": resolved_model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if response_format:
            payload["response_format"] = response_format

        start = time.monotonic()
        client = await self._get_client()

        response = await client.post(
            f"{self.base_url}/chat/completions",
            headers=self.headers,
            json=payload,
        )
        response.raise_for_status()

        data = response.json()
        elapsed = time.monotonic() - start

        content = data["choices"][0]["message"]["content"]
        usage = data.get("usage", {})

        result = LLMResponse(content=content, model=resolved_model, usage=usage)

        logger.info(
            "llm.completion",
            model=resolved_model,
            tokens=result.total_tokens,
            cost_usd=round(result.cost_usd, 6),
            latency_s=round(elapsed, 2),
        )
        return result

    async def stream(
        self,
        messages: list[dict],
        model: Optional[str] = None,
        agent_type: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 8192,
    ) -> AsyncGenerator[str, None]:
        """Stream completion chunks from OpenRouter."""
        if agent_type and agent_type in AGENT_MODELS:
            resolved_model = AGENT_MODELS[agent_type]
        else:
            resolved_model = model or settings.DEFAULT_MODEL

        payload = {
            "model": resolved_model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": True,
        }

        client = await self._get_client()
        async with client.stream(
            "POST",
            f"{self.base_url}/chat/completions",
            headers=self.headers,
            json=payload,
        ) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data_str = line[6:]
                    if data_str == "[DONE]":
                        break
                    try:
                        data = json.loads(data_str)
                        delta = data["choices"][0].get("delta", {})
                        if content := delta.get("content"):
                            yield content
                    except (json.JSONDecodeError, KeyError, IndexError):
                        continue

    async def complete_json(
        self,
        messages: list[dict],
        model: Optional[str] = None,
        agent_type: Optional[str] = None,
        temperature: float = 0.3,
    ) -> dict:
        """Request JSON-structured completion and parse it."""
        result = await self.complete(
            messages=messages,
            model=model,
            agent_type=agent_type,
            temperature=temperature,
        )
        content = result.content.strip()
        if content.startswith("```json"):
            content = content[7:]
        elif content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            # Try to find JSON object in text
            start = content.find('{')
            end = content.rfind('}')
            if start != -1 and end != -1:
                return json.loads(content[start:end+1])
            # Try list
            start_list = content.find('[')
            end_list = content.rfind(']')
            if start_list != -1 and end_list != -1:
                return json.loads(content[start_list:end_list+1])
            raise


# ── Prompt Templates ──────────────────────────────────────────
class Prompts:
    # ── Multi-Target System Prompts ──────────────────────────────
    TARGET_WEBSITE = """You are a master Web Designer. 
Generate a beautiful, responsive, single-page Website with HTML, CSS, and vanilla JavaScript. 
Include stunning CSS animations, glassmorphism, and modern typography.
Return ONLY valid JSON: {"files": {"index.html": "...", "styles.css": "...", "script.js": "..."}}"""

    TARGET_WEB_APP = """You are an Expert Full-Stack Developer. 
Generate a production-ready Web Application.
Backend: FastAPI (Python), Frontend: React + Tailwind CSS (Vite setup).
Return ONLY valid JSON: {"files": {"backend/main.py": "...", "frontend/src/App.jsx": "...", ...}}"""

    TARGET_MOBILE_UI = """You are an Expert Mobile UX Engineer.
Generate a React Native style UI (using standard React + Tailwind formatted to look like a mobile app screen).
Ensure it has a bottom tab bar, mobile-first responsive design (max-width: 480px), and touch-friendly targets.
Return ONLY valid JSON: {"files": {"App.jsx": "...", "components/TabBar.jsx": "..."}}"""

    TARGET_CHROME_EXT = """You are an Expert browser extension developer.
Generate a complete Manifest V3 Chrome Extension.
Include manifest.json, popup.html, popup.js, and background/content scripts if necessary.
Return ONLY valid JSON: {"files": {"manifest.json": "...", "popup.html": "...", "popup.js": "..."}}"""

    TARGET_CLI_TOOL = """You are a Senior Systems Engineer.
Generate a professional Python CLI tool using the 'click' or 'argparse' library.
Include rich terminal output (using 'rich' library), proper error handling, and a clear --help menu.
Return ONLY valid JSON: {"files": {"cli.py": "...", "requirements.txt": "...", "README.md": "..."}}"""

    # ── Core Agent Prompts ────────────────────────────────────────
    SYSTEM_PLANNER = """You are the PlannerBot agent of OmniForge Nexus, an AI-native app generation platform.
Your role: Take a user's natural language description and produce a detailed JSON execution plan.
Output a JSON object with:
- project_name: string
- app_type: string (ERP/SaaS/CRM/API/Website/etc.)
- description: string
- tech_stack: {frontend, backend, database, cache, queue, deployment}
- features: list of {name, priority, complexity, description}
- database_tables: list of table names
- api_endpoints: list of {method, path, description}
- agents_needed: list of agent types
- estimated_build_time_seconds: number
Always output valid JSON only."""

    SYSTEM_ARCHITECT = """You are the ArchitectAI agent of OmniForge Nexus.
Your role: Design the database schema and system architecture based on the project plan.
Output JSON with:
- tables: list of {name, columns: [{name, type, nullable, default, constraints}], indexes, foreign_keys}
- api_spec: OpenAPI 3.0 paths object
- architecture_diagram: mermaid syntax string
Always output valid JSON only."""

    SYSTEM_BUILDER = """You are the BuilderBot agent of OmniForge Nexus.
Your role: Generate production-ready code for the requested component.
You write clean, typed, well-commented code. Include error handling, logging, and tests.
For Python: use FastAPI, Pydantic v2, async/await, SQLAlchemy 2.0.
For TypeScript/React: use functional components, Tailwind CSS, proper typing.
Output the complete file contents only."""

    SYSTEM_VALIDATOR = """You are the ValidatorX agent of OmniForge Nexus.
Your role: Review and validate generated code for correctness, security, and quality.
Check for: SQL injection, XSS, missing auth guards, N+1 queries, missing error handling.
Output JSON: {valid: bool, score: 0-100, issues: [{severity, location, message, fix}], approved: bool}"""

    SYSTEM_TESTER = """You are the TesterPro agent of OmniForge Nexus.
Your role: Write comprehensive test suites for the generated code.
Write: unit tests, integration tests, API tests. Use pytest + httpx for Python.
Output the complete test file."""

    SYSTEM_OPTIMIZER = """You are the OptimizerAI agent of OmniForge Nexus.
Your role: Analyze and optimize the generated application for performance and cost.
Focus on: database query optimization, caching strategy, API response times, bundle sizes.
Output JSON: {optimizations: [{category, improvement, before, after, code_change}]}"""


# ── Singleton ──────────────────────────────────────────────────
llm = OpenRouterClient()
prompts = Prompts()
