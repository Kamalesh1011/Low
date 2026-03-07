"""
OmniForge Nexus – Shared Pydantic Models
Common request/response schemas used across all services
"""
from __future__ import annotations
import uuid
from datetime import datetime
from typing import Any, Generic, List, Optional, TypeVar
from enum import Enum
from pydantic import BaseModel, Field, EmailStr


T = TypeVar("T")

# ── Generic Response Wrappers ─────────────────────────────────
class APIResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: Optional[str] = None
    meta: Optional[dict] = None

    @classmethod
    def ok(cls, data: T = None, message: str = None, meta: dict = None):
        return cls(success=True, data=data, message=message, meta=meta)

    @classmethod
    def error(cls, message: str, data: Any = None):
        return cls(success=False, message=message, data=data)


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    per_page: int
    total_pages: int

    @classmethod
    def create(cls, items: List[T], total: int, page: int, per_page: int):
        return cls(
            items=items,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=(total + per_page - 1) // per_page,
        )


# ── Enums ─────────────────────────────────────────────────────
class UserRole(str, Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    DEVELOPER = "developer"
    VIEWER = "viewer"


class PlanTier(str, Enum):
    FREE = "free"
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"


class BuildStatus(str, Enum):
    QUEUED = "queued"
    PLANNING = "planning"
    ARCHITECTING = "architecting"
    BUILDING = "building"
    TESTING = "testing"
    VALIDATING = "validating"
    DEPLOYING = "deploying"
    DONE = "done"
    FAILED = "failed"
    CANCELLED = "cancelled"


class AgentStatus(str, Enum):
    ACTIVE = "active"
    IDLE = "idle"
    PAUSED = "paused"
    ERROR = "error"


class AppStatus(str, Enum):
    DRAFT = "draft"
    BUILDING = "building"
    TESTING = "testing"
    DEPLOYED = "deployed"
    FAILED = "failed"
    ARCHIVED = "archived"


class WorkflowStatus(str, Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    DRAFT = "draft"
    ARCHIVED = "archived"


class SecretStatus(str, Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    ROTATED = "rotated"
    REVOKED = "revoked"


class ColumnType(str, Enum):
    VARCHAR = "VARCHAR"
    TEXT = "TEXT"
    INTEGER = "INTEGER"
    BIGINT = "BIGINT"
    FLOAT = "FLOAT"
    DECIMAL = "DECIMAL"
    BOOLEAN = "BOOLEAN"
    DATE = "DATE"
    DATETIME = "DATETIME"
    TIMESTAMP = "TIMESTAMP"
    UUID = "UUID"
    JSON = "JSON"
    JSONB = "JSONB"
    ARRAY = "ARRAY"


# ── Auth Models ───────────────────────────────────────────────
class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class TokenPayload(BaseModel):
    sub: str  # user_id
    org_id: str
    role: UserRole
    plan: PlanTier
    exp: int
    iat: int


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    org_name: str = Field(..., min_length=2, max_length=100)


# ── User Models ───────────────────────────────────────────────
class UserBase(BaseModel):
    id: str
    name: str
    email: str
    role: UserRole
    plan: PlanTier
    org_id: str
    org_name: str
    credits: int
    total_credits: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ── Build Models ──────────────────────────────────────────────
class BuildRequest(BaseModel):
    prompt: str = Field(..., min_length=10, max_length=10000)
    model: Optional[str] = None
    template_id: Optional[str] = None
    options: dict = Field(default_factory=dict)


class BuildLog(BaseModel):
    timestamp: datetime
    level: str  # info | warn | error | success
    agent: str
    message: str
    metadata: Optional[dict] = None


class BuildResult(BaseModel):
    job_id: str
    status: BuildStatus
    progress: int  # 0-100
    logs: List[BuildLog] = []
    app_id: Optional[str] = None
    app_url: Optional[str] = None
    estimated_seconds: Optional[int] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error: Optional[str] = None
    artifacts: dict = Field(default_factory=dict)  # schema, code, api_spec, etc.


# ── Schema Models ─────────────────────────────────────────────
class ColumnSchema(BaseModel):
    name: str
    type: ColumnType
    nullable: bool = True
    primary_key: bool = False
    unique: bool = False
    indexed: bool = False
    default: Optional[str] = None
    foreign_key: Optional[str] = None  # "table.column"
    comment: Optional[str] = None


class TableSchema(BaseModel):
    name: str
    columns: List[ColumnSchema]
    row_count: Optional[int] = None
    comment: Optional[str] = None


class SchemaGenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=10)
    app_type: Optional[str] = None


class SchemaGenerateResponse(BaseModel):
    tables: List[TableSchema]
    sql_migration: str
    er_diagram: str  # mermaid syntax


# ── API Spec Models ───────────────────────────────────────────
class APIEndpoint(BaseModel):
    method: str  # GET POST PUT DELETE PATCH
    path: str
    summary: str
    description: Optional[str] = None
    authenticated: bool = True
    request_body: Optional[dict] = None
    response_schema: Optional[dict] = None
    tags: List[str] = []


class APIGenerateRequest(BaseModel):
    prompt: str
    schema_tables: Optional[List[str]] = None


# ── Agent Models ──────────────────────────────────────────────
class AgentConfig(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    type: str
    model: str = "openai/gpt-4o"
    instructions: str = Field(..., min_length=10)
    tools: List[str] = []
    memory_enabled: bool = True


# ── Workflow Models ───────────────────────────────────────────
class WorkflowNode(BaseModel):
    id: str
    type: str  # trigger | agent | database | api | email | webhook | filter | transform
    label: str
    config: dict = Field(default_factory=dict)
    position: dict = Field(default_factory=dict)


class WorkflowEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None


class WorkflowCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = None
    nodes: List[WorkflowNode] = []
    edges: List[WorkflowEdge] = []
    trigger_type: str = "manual"  # manual | schedule | webhook | event


# ── Secret Vault Models ───────────────────────────────────────
class SecretCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    service: str
    value: str = Field(..., min_length=1)
    environment: str = "production"  # production | staging | development
    description: Optional[str] = None


class SecretResponse(BaseModel):
    id: str
    name: str
    service: str
    environment: str
    status: SecretStatus
    masked_value: str
    last_used: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ── Pagination ────────────────────────────────────────────────
class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=20, ge=1, le=100)
    search: Optional[str] = None
    sort_by: Optional[str] = None
    sort_order: str = "desc"
