"""
OmniForge Nexus – Shared Configuration
"""
from functools import lru_cache
from typing import List
from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── App ───────────────────────────────────────────────────
    APP_NAME: str = "OmniForge Nexus"
    APP_ENV: str = "development"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    SECRET_KEY: str = "change-me-in-production-must-be-32-chars-minimum"

    # ── Database ──────────────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://omniforge:omniforge123@localhost:5432/omniforge_nexus"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 40

    # ── Redis ─────────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # ── AI / LLM ──────────────────────────────────────────────
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    DEFAULT_MODEL: str = "openai/gpt-4o"
    PLANNER_MODEL: str = "openai/gpt-4o"
    ARCHITECT_MODEL: str = "anthropic/claude-3.5-sonnet"
    BUILDER_MODEL: str = "openai/gpt-4o"
    VALIDATOR_MODEL: str = "deepseek/deepseek-r1"
    MAX_TOKENS: int = 128000
    TEMPERATURE: float = 0.7

    # ── Auth ──────────────────────────────────────────────────
    JWT_SECRET_KEY: str = "change-me-jwt-secret-must-be-32-chars-minimum!!"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── Vault ─────────────────────────────────────────────────
    VAULT_ENCRYPTION_KEY: str = "change-me-32-byte-encryption-key"

    # ── Kafka ─────────────────────────────────────────────────
    KAFKA_BOOTSTRAP_SERVERS: str = "localhost:9092"
    KAFKA_BUILD_TOPIC: str = "omniforge.builds"
    KAFKA_AGENT_TOPIC: str = "omniforge.agents"
    KAFKA_WORKFLOW_TOPIC: str = "omniforge.workflows"

    # ── CORS ──────────────────────────────────────────────────
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # ── Rate Limiting ─────────────────────────────────────────
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_BURST: int = 100

    # ── Storage ───────────────────────────────────────────────
    STORAGE_BACKEND: str = "local"
    LOCAL_STORAGE_PATH: str = "./storage"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_S3_BUCKET: str = "omniforge-nexus"
    AWS_REGION: str = "ap-south-1"

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Silently ignore unknown env vars


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
