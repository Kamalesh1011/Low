"""
OmniForge Nexus – SQLAlchemy ORM Models
"""
import uuid
from datetime import datetime
from sqlalchemy import (
    String, Text, Integer, BigInteger, Boolean, Float,
    DateTime, ForeignKey, JSON, Enum as SAEnum, Index
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB

from shared.database import Base
from shared.models.schemas import (
    UserRole, PlanTier, BuildStatus, AgentStatus,
    AppStatus, WorkflowStatus, SecretStatus
)


def gen_id() -> str:
    return str(uuid.uuid4())


now = datetime.utcnow


# ── Organization ──────────────────────────────────────────────
class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_id)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    plan: Mapped[str] = mapped_column(SAEnum(PlanTier), default=PlanTier.FREE)
    credits: Mapped[int] = mapped_column(Integer, default=1000)
    total_credits: Mapped[int] = mapped_column(Integer, default=1000)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    org_settings: Mapped[dict] = mapped_column("settings", JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=now, onupdate=now)

    users: Mapped[list["User"]] = relationship("User", back_populates="organization")
    apps: Mapped[list["GeneratedApp"]] = relationship("GeneratedApp", back_populates="organization")
    agents: Mapped[list["Agent"]] = relationship("Agent", back_populates="organization")


# ── User ──────────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_id)
    org_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(320), unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(200), nullable=False)
    role: Mapped[str] = mapped_column(SAEnum(UserRole), default=UserRole.DEVELOPER)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    avatar_url: Mapped[str] = mapped_column(String(500), nullable=True)
    last_login: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=now, onupdate=now)

    organization: Mapped["Organization"] = relationship("Organization", back_populates="users")

    __table_args__ = (
        Index("ix_users_org_email", "org_id", "email"),
    )


# ── Generated Application ─────────────────────────────────────
class GeneratedApp(Base):
    __tablename__ = "generated_apps"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_id)
    org_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id"), nullable=False)
    created_by: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    app_type: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(SAEnum(AppStatus), default=AppStatus.DRAFT)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    tech_stack: Mapped[dict] = mapped_column(JSONB, default=dict)
    schema_data: Mapped[dict] = mapped_column(JSONB, default=dict)
    api_spec: Mapped[dict] = mapped_column(JSONB, default=dict)
    ui_config: Mapped[dict] = mapped_column(JSONB, default=dict)
    deployment_url: Mapped[str] = mapped_column(String(500), nullable=True)
    deployment_region: Mapped[str] = mapped_column(String(100), nullable=True)
    build_time_seconds: Mapped[int] = mapped_column(Integer, nullable=True)
    icon: Mapped[str] = mapped_column(String(10), default="🚀")
    color: Mapped[str] = mapped_column(String(20), default="#6366f1")
    tags: Mapped[list] = mapped_column(JSONB, default=list)
    credits_used: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=now, onupdate=now)

    organization: Mapped["Organization"] = relationship("Organization", back_populates="apps")
    build_jobs: Mapped[list["BuildJob"]] = relationship("BuildJob", back_populates="app")


# ── Build Job ─────────────────────────────────────────────────
class BuildJob(Base):
    __tablename__ = "build_jobs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_id)
    app_id: Mapped[str] = mapped_column(String(36), ForeignKey("generated_apps.id"), nullable=True)
    org_id: Mapped[str] = mapped_column(String(36), nullable=False)
    user_id: Mapped[str] = mapped_column(String(36), nullable=False)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(SAEnum(BuildStatus), default=BuildStatus.QUEUED)
    progress: Mapped[int] = mapped_column(Integer, default=0)
    model_used: Mapped[str] = mapped_column(String(100), nullable=True)
    tokens_used: Mapped[int] = mapped_column(Integer, default=0)
    cost_usd: Mapped[float] = mapped_column(Float, default=0.0)
    credits_charged: Mapped[int] = mapped_column(Integer, default=0)
    plan_json: Mapped[dict] = mapped_column(JSONB, default=dict)
    artifacts: Mapped[dict] = mapped_column(JSONB, default=dict)
    error_message: Mapped[str] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    completed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=now)

    app: Mapped["GeneratedApp"] = relationship("GeneratedApp", back_populates="build_jobs")


# ── Agent ─────────────────────────────────────────────────────
class Agent(Base):
    __tablename__ = "agents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_id)
    org_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id"), nullable=False)
    created_by: Mapped[str] = mapped_column(String(36), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    agent_type: Mapped[str] = mapped_column(String(100), nullable=False)
    model: Mapped[str] = mapped_column(String(200), nullable=False)
    instructions: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(SAEnum(AgentStatus), default=AgentStatus.IDLE)
    tools: Mapped[list] = mapped_column(JSONB, default=list)
    memory_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    tasks_completed: Mapped[int] = mapped_column(Integer, default=0)
    success_rate: Mapped[float] = mapped_column(Float, default=100.0)
    total_tokens: Mapped[int] = mapped_column(BigInteger, default=0)
    config: Mapped[dict] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=now, onupdate=now)

    organization: Mapped["Organization"] = relationship("Organization", back_populates="agents")


# ── Workflow ──────────────────────────────────────────────────
class Workflow(Base):
    __tablename__ = "workflows"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_id)
    org_id: Mapped[str] = mapped_column(String(36), nullable=False)
    created_by: Mapped[str] = mapped_column(String(36), nullable=False)
    name: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(SAEnum(WorkflowStatus), default=WorkflowStatus.DRAFT)
    nodes: Mapped[list] = mapped_column(JSONB, default=list)
    edges: Mapped[list] = mapped_column(JSONB, default=list)
    trigger_type: Mapped[str] = mapped_column(String(50), default="manual")
    trigger_config: Mapped[dict] = mapped_column(JSONB, default=dict)
    run_count: Mapped[int] = mapped_column(Integer, default=0)
    last_run: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=now, onupdate=now)


# ── Secret ────────────────────────────────────────────────────
class Secret(Base):
    __tablename__ = "secrets"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_id)
    org_id: Mapped[str] = mapped_column(String(36), nullable=False)
    name: Mapped[str] = mapped_column(String(300), nullable=False)
    service: Mapped[str] = mapped_column(String(100), nullable=False)
    environment: Mapped[str] = mapped_column(String(50), default="production")
    description: Mapped[str] = mapped_column(Text, nullable=True)
    encrypted_value: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(SAEnum(SecretStatus), default=SecretStatus.ACTIVE)
    last_used: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    rotation_due: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=now, onupdate=now)

    __table_args__ = (
        Index("ix_secrets_org_env", "org_id", "environment"),
    )


# ── Audit Log ─────────────────────────────────────────────────
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_id)
    org_id: Mapped[str] = mapped_column(String(36), nullable=False)
    user_id: Mapped[str] = mapped_column(String(36), nullable=True)
    event: Mapped[str] = mapped_column(String(200), nullable=False)
    resource_type: Mapped[str] = mapped_column(String(100), nullable=True)
    resource_id: Mapped[str] = mapped_column(String(36), nullable=True)
    ip_address: Mapped[str] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[str] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="success")  # success | failed
    meta: Mapped[dict] = mapped_column("metadata", JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=now)

    __table_args__ = (
        Index("ix_audit_org_created", "org_id", "created_at"),
    )
