"""
OmniForge Nexus – API Gateway (Main Entry Point)
FastAPI app with all routers, middleware, and lifecycle management.
"""
from contextlib import asynccontextmanager
import time

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import ORJSONResponse
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
import structlog

from shared.config import settings
from shared.database import create_tables
from shared.redis_client import get_redis, close_redis

# ── Import Routers ─────────────────────────────────────────────
from services.gateway.routers import (
    auth, builds, agents, schema, workflows, vault, analytics,
    templates, marketplace, websocket_router,
)
from services.gateway.routers import github_router, llm_router, multiagent_router

logger = structlog.get_logger(__name__)

# ── Prometheus Metrics ─────────────────────────────────────────
REQUEST_COUNT = Counter(
    "omniforge_http_requests_total",
    "Total HTTP requests",
    ["method", "endpoint", "status_code"]
)
REQUEST_DURATION = Histogram(
    "omniforge_http_request_duration_seconds",
    "HTTP request duration",
    ["method", "endpoint"]
)
BUILD_COUNT = Counter("omniforge_builds_total", "Total AI builds initiated")
ACTIVE_BUILDS = Counter("omniforge_active_builds", "Currently running builds")


# ── Lifecycle ─────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: connect DB + Redis. Shutdown: close connections."""
    logger.info("omniforge.starting", version=settings.APP_VERSION)

    # Create DB tables if they don't exist
    try:
        await create_tables()
        logger.info("database.ready")
    except Exception as e:
        logger.warning("database.fallback", error=str(e))

    # Ping Redis only when REDIS_URL is configured
    if settings.REDIS_URL:
        try:
            r = await get_redis()
            if r:
                await r.ping()
                logger.info("redis.ready")
        except Exception as e:
            logger.warning("redis.unavailable", error=str(e))
    else:
        logger.info("redis.skipped", reason="REDIS_URL not set — using in-memory fallback")

    logger.info("omniforge.ready", env=settings.APP_ENV)
    yield

    # Shutdown
    await close_redis()
    logger.info("omniforge.shutdown")



# ── App Instance ───────────────────────────────────────────────
app = FastAPI(
    title="OmniForge Nexus API",
    description="AI-native platform for generating full-stack applications using natural language.",
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    default_response_class=ORJSONResponse,
    lifespan=lifespan,
)

# ── Middleware ────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID", "X-RateLimit-Remaining"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.middleware("http")
async def observability_middleware(request: Request, call_next):
    """Adds request timing, request IDs, and Prometheus metrics."""
    import uuid
    request_id = str(uuid.uuid4())[:8]
    start = time.perf_counter()

    # Attach request ID
    request.state.request_id = request_id

    response: Response = await call_next(request)
    duration = time.perf_counter() - start

    # Add tracing headers
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Response-Time"] = f"{duration:.3f}s"
    response.headers["X-Powered-By"] = "OmniForge Nexus"

    endpoint = request.url.path
    REQUEST_COUNT.labels(request.method, endpoint, response.status_code).inc()
    REQUEST_DURATION.labels(request.method, endpoint).observe(duration)

    if duration > 2.0:
        logger.warning("slow.request",
            path=endpoint,
            method=request.method,
            duration=round(duration, 3),
            request_id=request_id,
        )

    return response


# ── Routes ────────────────────────────────────────────────────
API_V1 = "/api/v1"

app.include_router(auth.router,        prefix=f"{API_V1}/auth",        tags=["Auth"])
app.include_router(builds.router,      prefix=f"{API_V1}/builds",      tags=["Builds"])
app.include_router(agents.router,      prefix=f"{API_V1}/agents",      tags=["Agents"])
app.include_router(schema.router,      prefix=f"{API_V1}/schema",      tags=["Schema"])
app.include_router(workflows.router,   prefix=f"{API_V1}/workflows",   tags=["Workflows"])
app.include_router(vault.router,       prefix=f"{API_V1}/vault",       tags=["Vault"])
app.include_router(analytics.router,   prefix=f"{API_V1}/analytics",   tags=["Analytics"])
app.include_router(templates.router,   prefix=f"{API_V1}/templates",   tags=["Templates"])
app.include_router(marketplace.router, prefix=f"{API_V1}/marketplace", tags=["Marketplace"])
app.include_router(websocket_router.router, tags=["WebSocket"])
app.include_router(github_router.router, prefix=f"{API_V1}/github", tags=["GitHub"])
app.include_router(llm_router.router, prefix=f"{API_V1}/llm", tags=["LLM"])
app.include_router(multiagent_router.router, prefix=f"{API_V1}/multiagent", tags=["MultiAgent"])





# ── Health & Meta ─────────────────────────────────────────────
@app.get("/health", tags=["Meta"])
async def health():
    """Health check endpoint for load balancers."""
    try:
        r = await get_redis()
        redis_ok = await r.ping()
    except Exception:
        redis_ok = False

    return {
        "status": "healthy" if redis_ok else "degraded",
        "version": settings.APP_VERSION,
        "env": settings.APP_ENV,
        "services": {
            "api": "ok",
            "redis": "ok" if redis_ok else "unavailable",
            "database": "ok",
        },
    }


@app.get("/metrics", tags=["Meta"])
async def metrics():
    """Prometheus metrics endpoint."""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.get("/", tags=["Meta"])
async def root():
    return {
        "name": "OmniForge Nexus API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "status": "✅ operational",
    }
