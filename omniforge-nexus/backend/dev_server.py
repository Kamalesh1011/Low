#!/usr/bin/env python
"""
OmniForge Nexus – Backend Dev Server Startup
Zero-dependency dev mode: no PostgreSQL, no Redis required.
Uses in-memory fallbacks for all external services.
"""
import os
import sys

# ── Dev environment overrides ────────────────────────────────────
os.environ["APP_ENV"] = "development"
os.environ["DEBUG"] = "true"
os.environ["DATABASE_URL"] = ""    # Empty → skip DB, use in-memory
os.environ["REDIS_URL"] = ""       # Empty → skip Redis, use in-memory
os.environ.setdefault("SECRET_KEY", "dev-secret-key-min-32-chars-here!!")
os.environ.setdefault("JWT_SECRET_KEY", "dev-jwt-secret-min-32-chars-here!!")
os.environ.setdefault("VAULT_ENCRYPTION_KEY", "dev-vault-key-32-bytes-padded!!")

sys.path.insert(0, os.path.dirname(__file__))

import uvicorn

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print(" 🚀  OmniForge Nexus Backend – Dev Mode (No-Dependency)")
    print("=" * 60)
    print(" 📍  API:      http://localhost:8000")
    print(" 📚  Docs:     http://localhost:8000/docs")
    print(" 💊  Health:   http://localhost:8000/health")
    print(" 🔌  WS:       ws://localhost:8000/ws/builds/{job_id}")
    print(" ℹ️   DB/Redis: in-memory fallback (no external services)")
    print("=" * 60 + "\n")

    uvicorn.run(
        "services.gateway.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=["services", "shared"],
        log_level="info",
    )

