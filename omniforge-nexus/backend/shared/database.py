"""
OmniForge Nexus – Async PostgreSQL Database
SQLAlchemy 2.0 async engine with connection pooling.
Gracefully degrades when DATABASE_URL is not set (dev mode).
"""
from typing import AsyncGenerator, Optional
from sqlalchemy.ext.asyncio import (
    AsyncSession, AsyncEngine,
    async_sessionmaker, create_async_engine
)
from sqlalchemy.orm import DeclarativeBase
import structlog

from shared.config import settings

logger = structlog.get_logger(__name__)

# ── Base Model ────────────────────────────────────────────────
class Base(DeclarativeBase):
    """Base class for all SQLAlchemy ORM models."""
    pass


# ── Engine (lazy — only initialised when DATABASE_URL is set) ─
engine: Optional[AsyncEngine] = None
AsyncSessionLocal: Optional[async_sessionmaker] = None


def _init_engine():
    global engine, AsyncSessionLocal
    if engine is not None:
        return  # Already initialised

    db_url = settings.DATABASE_URL
    if not db_url or db_url in ("", "sqlite:///:memory:"):
        logger.warning("database.no_url", msg="DATABASE_URL not set — DB features disabled")
        return

    engine = create_async_engine(
        db_url,
        pool_size=settings.DATABASE_POOL_SIZE,
        max_overflow=settings.DATABASE_MAX_OVERFLOW,
        pool_pre_ping=True,
        pool_recycle=3600,
        echo=settings.DEBUG,
    )
    AsyncSessionLocal = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
        autocommit=False,
    )
    logger.info("database.engine_created", url=db_url.split("@")[-1])


# Init at import time (silently no-ops if no URL)
_init_engine()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency to get an async DB session."""
    if AsyncSessionLocal is None:
        raise RuntimeError(
            "Database not configured. Set DATABASE_URL in your .env file. "
            "See backend/.env for configuration."
        )
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def create_tables():
    """Create all database tables (called on startup)."""
    if engine is None:
        logger.warning("database.create_tables_skipped", reason="No database URL configured")
        return
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("database.tables_created")


async def drop_tables():
    """Drop all tables (dev/test only)."""
    if engine is None:
        return
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    logger.info("database.tables_dropped")
