"""
OmniForge Nexus – Build Router
Trigger AI builds, stream progress, get results.
"""
import asyncio
import uuid
import zipfile
import io
from typing import Dict
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
import structlog

from shared.models.schemas import BuildRequest, BuildResult, BuildStatus, APIResponse, PaginatedResponse
from shared.redis_client import get_build_state, get_build_logs, cache
from services.auth_service.jwt_handler import get_current_user
from services.agent_service.orchestrator import orchestrator

router = APIRouter()
logger = structlog.get_logger(__name__)


# ── POST / – Start a Build ────────────────────────────────────
@router.post("/", response_model=APIResponse[dict], status_code=202)
async def start_build(
    payload: BuildRequest,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
):
    """
    Trigger an AI build. Returns a job_id immediately;
    client polls GET /builds/{job_id} or uses WebSocket for live updates.
    """
    job_id = str(uuid.uuid4())

    background_tasks.add_task(
        orchestrator.run,
        prompt=payload.prompt,
        job_id=job_id,
        org_id=current_user.org_id,
        user_id=current_user.sub,
        model=payload.model,
        options=payload.options,
    )

    logger.info("build.started", job_id=job_id, user=current_user.sub)

    return APIResponse.ok(
        data={
            "job_id": job_id,
            "status": BuildStatus.QUEUED.value,
            "message": "Build queued. Poll status at /api/v1/builds/{job_id}",
            "ws_url": f"ws://localhost:8000/ws/builds/{job_id}",
        },
        message="Build started successfully",
    )


# ── GET /demo – Start a Demo Build (no auth) ──────────────────
@router.post("/demo", response_model=APIResponse[dict], status_code=202)
async def demo_build(
    payload: BuildRequest,
    background_tasks: BackgroundTasks,
):
    """Demo build endpoint — no authentication required."""
    job_id = str(uuid.uuid4())
    background_tasks.add_task(
        orchestrator.run,
        prompt=payload.prompt,
        job_id=job_id,
        org_id="demo_org",
        user_id="demo_user",
        model=payload.model,
        options=payload.options,
    )
    return APIResponse.ok(data={"job_id": job_id, "status": "queued"})


# ── GET /{job_id} – Poll Build Status ────────────────────────
@router.get("/{job_id}", response_model=APIResponse[dict])
async def get_build_status(job_id: str):
    """Poll build job status and progress."""
    state = await get_build_state(job_id)
    if not state:
        raise HTTPException(status_code=404, detail=f"Build job {job_id} not found")
    return APIResponse.ok(data=state)


# ── GET /{job_id}/logs – Get Build Logs ──────────────────────
@router.get("/{job_id}/logs")
async def get_build_logs_endpoint(
    job_id: str,
    since: int = Query(0, description="Return logs after this line index"),
):
    """Get all log lines for a build job."""
    logs = await get_build_logs(job_id)
    if not logs:
        raise HTTPException(status_code=404, detail=f"No logs for job {job_id}")
    return APIResponse.ok(data={
        "job_id": job_id,
        "logs": logs[since:],
        "total": len(logs),
    })


# ── GET /{job_id}/stream – SSE Stream ────────────────────────
@router.get("/{job_id}/stream")
async def stream_build(job_id: str):
    """
    Server-Sent Events stream for real-time build logs.
    Connect with EventSource('/api/v1/builds/{job_id}/stream')
    """
    async def event_generator():
        last_index = 0
        while True:
            state = await get_build_state(job_id)
            if not state:
                yield f"data: {{\"error\": \"Job not found\"}}\n\n"
                break

            logs = await get_build_logs(job_id)
            new_logs = logs[last_index:]
            for log in new_logs:
                yield f"data: {log}\n\n"
            last_index = len(logs)

            status = state.get("status")
            if status in (BuildStatus.DONE.value, BuildStatus.FAILED.value, BuildStatus.CANCELLED.value):
                yield f"data: {{\"status\": \"{status}\", \"done\": true}}\n\n"
                break

            await asyncio.sleep(0.5)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )


# ── GET / – List Recent Builds ────────────────────────────────
@router.get("/", response_model=APIResponse[list])
async def list_builds(current_user=Depends(get_current_user)):
    """List recent builds for the current user's org (mock data)."""
    # In production, query BuildJob table from DB
    mock_builds = [
        {
            "job_id": "build_001",
            "prompt": "GST billing ERP with multi-branch support",
            "status": "done",
            "progress": 100,
            "app_url": "https://textilegst.omniforge.ai",
            "created_at": "2026-02-25T12:00:00Z",
        },
        {
            "job_id": "build_002",
            "prompt": "AI inventory management with demand forecasting",
            "status": "building",
            "progress": 65,
            "app_url": None,
            "created_at": "2026-02-25T14:00:00Z",
        },
    ]
    return APIResponse.ok(data=mock_builds)


class DownloadRequest(BaseModel):
    project_name: str = "omniforge_project"
    files: Dict[str, str]

# ── POST /download – Download Project as ZIP ────────────────
@router.post("/download")
async def download_project(payload: DownloadRequest):
    """Generates a ZIP file from a dictionary of files and returns it for download."""
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED, False) as zip_file:
        for file_path, file_content in payload.files.items():
            # Add files to the zip archive, supporting subdirectories based on the path
            zip_file.writestr(f"{payload.project_name}/{file_path}", file_content)
    
    zip_buffer.seek(0)
    
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={
            "Content-Disposition": f"attachment; filename={payload.project_name}.zip"
        }
    )

