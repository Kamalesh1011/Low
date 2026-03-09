print("Importing shared.config...")
from shared.config import settings
print("Importing shared.database...")
from shared.database import create_tables
print("Importing shared.redis_client...")
from shared.redis_client import get_redis
print("Importing routers...")
from services.gateway.routers import (
    auth, builds, agents, schema, workflows, vault, analytics,
    templates, marketplace, websocket_router, github_router, llm_router, multiagent_router
)
print("All imports successful!")
