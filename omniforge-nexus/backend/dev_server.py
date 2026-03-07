#!/usr/bin/env python
"""
OmniForge Nexus – Backend Dev Server Startup
Runs without a database — uses in-memory fallbacks.
"""
import os
import sys

os.environ.setdefault("APP_ENV", "development")
os.environ.setdefault("DEBUG", "true")
os.environ.setdefault("DATABASE_URL", "")       # Empty = skip DB
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")
os.environ.setdefault("SECRET_KEY", "dev-secret-key-min-32-chars-here!!")
os.environ.setdefault("JWT_SECRET_KEY", "dev-jwt-secret-min-32-chars-here!!")
os.environ.setdefault("VAULT_ENCRYPTION_KEY", "dev-vault-key-32-bytes-padded!!")


sys.path.insert(0, os.path.dirname(__file__))

import uvicorn

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print(" 🔧  OmniForge Nexus Backend – Development Server")
    print("=" * 60)
    print(" 📍  API:      http://localhost:8000")
    print(" 📚  Docs:     http://localhost:8000/docs")
    print(" 💊  Health:   http://localhost:8000/health")
    print(" 🔌  WS:       ws://localhost:8000/ws/builds/{job_id}")
    print("=" * 60 + "\n")

    uvicorn.run(
        "services.gateway.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=["services", "shared"],
        log_level="info",
    )
