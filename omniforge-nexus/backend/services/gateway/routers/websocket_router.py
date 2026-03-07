"""
OmniForge Nexus – WebSocket Router
Real-time build progress, agent status, and workflow event streaming.
"""
import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import structlog

from shared.redis_client import get_build_state, get_build_logs, get_redis
from shared.models.schemas import BuildStatus

router = APIRouter()
logger = structlog.get_logger(__name__)


class ConnectionManager:
    """Manages active WebSocket connections per job_id."""

    def __init__(self):
        self.active: dict[str, list[WebSocket]] = {}

    async def connect(self, job_id: str, ws: WebSocket):
        await ws.accept()
        self.active.setdefault(job_id, []).append(ws)
        logger.info("ws.connected", job_id=job_id, total=len(self.active.get(job_id, [])))

    def disconnect(self, job_id: str, ws: WebSocket):
        if job_id in self.active:
            self.active[job_id] = [c for c in self.active[job_id] if c != ws]
            if not self.active[job_id]:
                del self.active[job_id]

    async def broadcast(self, job_id: str, message: dict):
        connections = self.active.get(job_id, [])
        dead = []
        for ws in connections:
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(job_id, ws)


manager = ConnectionManager()


@router.websocket("/ws/builds/{job_id}")
async def websocket_build_stream(ws: WebSocket, job_id: str):
    """
    WebSocket endpoint for real-time build progress.
    Client connects and receives live log lines and status updates.
    
    Messages sent:
      {type: "log", message: str, level: str, agent: str}
      {type: "progress", status: str, progress: int}
      {type: "done", app_url: str}
      {type: "error", message: str}
    """
    await manager.connect(job_id, ws)
    last_log_index = 0

    try:
        # Send initial state
        state = await get_build_state(job_id)
        if state:
            await ws.send_json({"type": "init", "state": state})
        else:
            await ws.send_json({"type": "waiting", "message": "Waiting for build to start..."})

        # Poll loop
        while True:
            state = await get_build_state(job_id)
            logs = await get_build_logs(job_id)

            # Stream new log lines
            new_logs = logs[last_log_index:]
            for log_line in new_logs:
                await ws.send_json({
                    "type": "log",
                    "message": log_line,
                    "raw": log_line,
                })
            last_log_index = len(logs)

            # Send progress update
            if state:
                await ws.send_json({
                    "type": "progress",
                    "status": state.get("status"),
                    "progress": state.get("progress", 0),
                    "updated_at": state.get("updated_at"),
                })

                # Check terminal states
                status = state.get("status")
                if status == BuildStatus.DONE.value:
                    await ws.send_json({
                        "type": "done",
                        "app_url": state.get("app_url"),
                        "artifacts": list(state.get("artifacts", {}).keys()),
                    })
                    break
                elif status == BuildStatus.FAILED.value:
                    await ws.send_json({
                        "type": "error",
                        "message": state.get("error", "Build failed"),
                    })
                    break

            # Send a heartbeat every 10 iterations (~5 seconds)
            await ws.send_json({"type": "heartbeat"})
            await asyncio.sleep(0.5)

    except WebSocketDisconnect:
        logger.info("ws.disconnected", job_id=job_id)
    except Exception as e:
        logger.error("ws.error", job_id=job_id, error=str(e))
        try:
            await ws.send_json({"type": "error", "message": str(e)})
        except Exception:
            pass
    finally:
        manager.disconnect(job_id, ws)


@router.websocket("/ws/agents/{agent_id}")
async def websocket_agent_stream(ws: WebSocket, agent_id: str):
    """WebSocket for real-time agent execution streaming."""
    await ws.accept()
    try:
        await ws.send_json({"type": "connected", "agent_id": agent_id})
        while True:
            try:
                msg = await asyncio.wait_for(ws.receive_text(), timeout=30.0)
                data = json.loads(msg)
                # Echo back for now; in production, route to agent executor
                await ws.send_json({
                    "type": "ack",
                    "message": f"Received: {data.get('message', '')[:50]}",
                })
            except asyncio.TimeoutError:
                await ws.send_json({"type": "heartbeat"})
    except WebSocketDisconnect:
        pass


@router.websocket("/ws/workflows/{wf_id}")
async def websocket_workflow_stream(ws: WebSocket, wf_id: str):
    """WebSocket for real-time workflow execution events."""
    await ws.accept()
    try:
        r = await get_redis()
        ps = r.pubsub()
        await ps.subscribe(f"omniforge:workflows")
        await ws.send_json({"type": "subscribed", "wf_id": wf_id})

        while True:
            message = await ps.get_message(ignore_subscribe_messages=True, timeout=1.0)
            if message and message["type"] == "message":
                data = json.loads(message["data"])
                if data.get("wf_id") == wf_id:
                    await ws.send_json(data)
            else:
                await ws.send_json({"type": "heartbeat"})
                await asyncio.sleep(0.5)

    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.error("ws.workflow_error", wf_id=wf_id, error=str(e))
