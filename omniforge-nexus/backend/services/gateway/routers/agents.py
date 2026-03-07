"""
OmniForge Nexus – Agent Router
CRUD for custom agents + execution endpoint.
"""
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import structlog

from shared.database import get_db
from shared.models.schemas import AgentConfig, APIResponse
from shared.models.orm import Agent
from shared.openrouter import llm, AGENT_MODELS
from services.auth_service.jwt_handler import get_current_user

router = APIRouter()
logger = structlog.get_logger(__name__)


@router.get("/", response_model=APIResponse[list])
async def list_agents(
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all agents for the current organization."""
    result = await db.execute(
        select(Agent).where(Agent.org_id == current_user.org_id)
    )
    agents = result.scalars().all()

    return APIResponse.ok(data=[
        {
            "id": a.id,
            "name": a.name,
            "type": a.agent_type,
            "model": a.model,
            "status": a.status,
            "tasks_completed": a.tasks_completed,
            "success_rate": a.success_rate,
            "created_at": a.created_at.isoformat(),
        }
        for a in agents
    ])


@router.post("/", response_model=APIResponse[dict], status_code=201)
async def create_agent(
    payload: AgentConfig,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new custom agent."""
    agent = Agent(
        org_id=current_user.org_id,
        created_by=current_user.sub,
        name=payload.name,
        agent_type=payload.type,
        model=payload.model,
        instructions=payload.instructions,
        tools=payload.tools,
        memory_enabled=payload.memory_enabled,
    )
    db.add(agent)
    await db.commit()
    await db.refresh(agent)

    logger.info("agent.created", agent_id=agent.id, name=agent.name)
    return APIResponse.ok(
        data={"id": agent.id, "name": agent.name, "status": agent.status},
        message=f"Agent '{agent.name}' created successfully",
    )


@router.get("/{agent_id}", response_model=APIResponse[dict])
async def get_agent(
    agent_id: str,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific agent by ID."""
    result = await db.execute(
        select(Agent).where(Agent.id == agent_id, Agent.org_id == current_user.org_id)
    )
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    return APIResponse.ok(data={
        "id": agent.id, "name": agent.name, "type": agent.agent_type,
        "model": agent.model, "instructions": agent.instructions,
        "status": agent.status, "tasks_completed": agent.tasks_completed,
        "success_rate": agent.success_rate, "tools": agent.tools,
    })


@router.post("/{agent_id}/run", response_model=APIResponse[dict])
async def run_agent(
    agent_id: str,
    messages: list[dict],
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Run a custom agent with the given messages."""
    result = await db.execute(
        select(Agent).where(Agent.id == agent_id, Agent.org_id == current_user.org_id)
    )
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    full_messages = [
        {"role": "system", "content": agent.instructions},
        *messages,
    ]

    try:
        response = await llm.complete(
            messages=full_messages,
            model=agent.model,
            max_tokens=4096,
        )

        # Update agent stats
        agent.tasks_completed += 1
        agent.total_tokens += response.total_tokens
        await db.commit()

        return APIResponse.ok(data={
            "agent_id": agent_id,
            "response": response.content,
            "tokens_used": response.total_tokens,
            "cost_usd": round(response.cost_usd, 6),
        })

    except Exception as e:
        logger.error("agent.run_failed", agent_id=agent_id, error=str(e))
        raise HTTPException(status_code=500, detail=f"Agent execution failed: {str(e)}")


@router.delete("/{agent_id}", status_code=204)
async def delete_agent(
    agent_id: str,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a custom agent."""
    result = await db.execute(
        select(Agent).where(Agent.id == agent_id, Agent.org_id == current_user.org_id)
    )
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    await db.delete(agent)
    await db.commit()


@router.get("/models/available", response_model=APIResponse[list])
async def available_models():
    """List all available LLM models on OpenRouter."""
    from shared.openrouter import MODELS
    return APIResponse.ok(data=[
        {
            "id": k,
            "full_id": v["id"],
            "context_length": v["context"],
            "cost_per_1k_input": v["cost_per_1k_input"],
            "cost_per_1k_output": v["cost_per_1k_output"],
            "strengths": v["strengths"],
        }
        for k, v in MODELS.items()
    ])
