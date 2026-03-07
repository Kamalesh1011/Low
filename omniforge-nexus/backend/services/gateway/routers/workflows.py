"""
OmniForge Nexus – Workflow Router
CRUD for n8n-style automation workflows with execution engine.
"""
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import structlog

from shared.database import get_db
from shared.models.schemas import WorkflowCreate, WorkflowStatus, APIResponse
from shared.models.orm import Workflow, AuditLog
from services.auth_service.jwt_handler import get_current_user
from shared.redis_client import pubsub

router = APIRouter()
logger = structlog.get_logger(__name__)


@router.get("/", response_model=APIResponse[list])
async def list_workflows(
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Workflow).where(Workflow.org_id == current_user.org_id)
        .order_by(Workflow.created_at.desc())
    )
    wfs = result.scalars().all()
    return APIResponse.ok(data=[
        {
            "id": w.id, "name": w.name, "description": w.description,
            "status": w.status, "trigger_type": w.trigger_type,
            "node_count": len(w.nodes), "run_count": w.run_count,
            "last_run": w.last_run.isoformat() if w.last_run else None,
            "created_at": w.created_at.isoformat(),
        }
        for w in wfs
    ])


@router.post("/", response_model=APIResponse[dict], status_code=201)
async def create_workflow(
    payload: WorkflowCreate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    wf = Workflow(
        org_id=current_user.org_id,
        created_by=current_user.sub,
        name=payload.name,
        description=payload.description,
        nodes=[n.model_dump() for n in payload.nodes],
        edges=[e.model_dump() for e in payload.edges],
        trigger_type=payload.trigger_type,
    )
    db.add(wf)
    await db.commit()
    await db.refresh(wf)
    logger.info("workflow.created", wf_id=wf.id, name=wf.name)
    return APIResponse.ok(
        data={"id": wf.id, "name": wf.name},
        message="Workflow created",
    )


@router.get("/{wf_id}", response_model=APIResponse[dict])
async def get_workflow(
    wf_id: str,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Workflow).where(Workflow.id == wf_id, Workflow.org_id == current_user.org_id)
    )
    wf = result.scalar_one_or_none()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return APIResponse.ok(data={
        "id": wf.id, "name": wf.name, "nodes": wf.nodes,
        "edges": wf.edges, "status": wf.status,
        "trigger_type": wf.trigger_type, "trigger_config": wf.trigger_config,
    })


@router.post("/{wf_id}/run", response_model=APIResponse[dict])
async def run_workflow(
    wf_id: str,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Trigger a manual workflow run."""
    result = await db.execute(
        select(Workflow).where(Workflow.id == wf_id, Workflow.org_id == current_user.org_id)
    )
    wf = result.scalar_one_or_none()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")

    run_id = str(uuid.uuid4())
    wf.run_count += 1
    wf.last_run = datetime.utcnow()
    await db.commit()

    # In production, dispatch to Celery worker
    background_tasks.add_task(_execute_workflow, wf_id, run_id, wf.nodes, wf.edges)

    return APIResponse.ok(data={"run_id": run_id, "status": "running"})


async def _execute_workflow(wf_id: str, run_id: str, nodes: list, edges: list):
    """Simplified workflow executor — processes nodes sequentially."""
    logger.info("workflow.executing", wf_id=wf_id, run_id=run_id, nodes=len(nodes))
    for node in nodes:
        node_type = node.get("type")
        await pubsub.publish("workflows", {
            "wf_id": wf_id,
            "run_id": run_id,
            "node": node.get("id"),
            "type": node_type,
            "status": "running",
        })
        # Each node type would have its own executor in production
        import asyncio
        await asyncio.sleep(0.1)
        await pubsub.publish("workflows", {
            "wf_id": wf_id,
            "run_id": run_id,
            "node": node.get("id"),
            "status": "done",
        })

    await pubsub.publish("workflows", {"wf_id": wf_id, "run_id": run_id, "status": "completed"})
    logger.info("workflow.completed", wf_id=wf_id, run_id=run_id)


@router.patch("/{wf_id}/toggle", response_model=APIResponse[dict])
async def toggle_workflow(
    wf_id: str,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Toggle a workflow between active and paused."""
    result = await db.execute(
        select(Workflow).where(Workflow.id == wf_id, Workflow.org_id == current_user.org_id)
    )
    wf = result.scalar_one_or_none()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")

    wf.status = WorkflowStatus.PAUSED if wf.status == WorkflowStatus.ACTIVE.value else WorkflowStatus.ACTIVE
    await db.commit()
    return APIResponse.ok(data={"id": wf.id, "status": wf.status})
