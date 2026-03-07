"""
OmniForge Nexus – Backend Entry Point
Run with: python run.py  (or uvicorn services.gateway.main:app)
"""
import uvicorn
from shared.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "services.gateway.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        reload_dirs=["services", "shared"],
        log_level="info",
        access_log=True,
        workers=1 if settings.DEBUG else 4,
    )
