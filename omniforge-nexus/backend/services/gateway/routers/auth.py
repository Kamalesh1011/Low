"""
OmniForge Nexus – Auth Router
Register, login, refresh, me, logout
"""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import structlog

from shared.database import get_db
from shared.models.schemas import (
    LoginRequest, RegisterRequest, TokenPair, UserBase,
    APIResponse, UserRole, PlanTier
)
from shared.models.orm import User, Organization, AuditLog
from services.auth_service.jwt_handler import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token,
    get_current_user, oauth2_scheme
)
from shared.config import settings

router = APIRouter()
logger = structlog.get_logger(__name__)


# ── POST /register ────────────────────────────────────────────
@router.post("/register", response_model=APIResponse[TokenPair], status_code=201)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new user and organization."""
    # Check email not taken
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create org
    from python_slugify import slugify
    org = Organization(
        name=payload.org_name,
        slug=slugify(payload.org_name),
        plan=PlanTier.FREE,
        credits=500,
        total_credits=500,
    )
    db.add(org)
    await db.flush()

    # Create user (admin of the new org)
    user = User(
        org_id=org.id,
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=UserRole.ADMIN,
        is_verified=False,
    )
    db.add(user)
    await db.flush()

    # Audit
    db.add(AuditLog(org_id=org.id, user_id=user.id, event="user.registered"))
    await db.commit()

    # Issue tokens
    access_token = create_access_token(user.id, org.id, user.role, org.plan)
    refresh_token = create_refresh_token(user.id, org.id)

    logger.info("user.registered", user_id=user.id, email=user.email, org=org.name)
    return APIResponse.ok(
        data=TokenPair(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        ),
        message="Registration successful",
    )


# ── POST /login ───────────────────────────────────────────────
@router.post("/login", response_model=APIResponse[TokenPair])
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticate user and issue JWT token pair."""
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account suspended")

    # Load org for plan info
    org_result = await db.execute(select(Organization).where(Organization.id == user.org_id))
    org = org_result.scalar_one()

    # Update last login
    user.last_login = datetime.utcnow()
    db.add(AuditLog(org_id=org.id, user_id=user.id, event="user.login"))
    await db.commit()

    access_token = create_access_token(user.id, org.id, user.role, org.plan)
    refresh_token = create_refresh_token(user.id, org.id)

    logger.info("user.login", user_id=user.id, email=user.email)
    return APIResponse.ok(
        data=TokenPair(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )
    )


# ── POST /refresh ─────────────────────────────────────────────
@router.post("/refresh", response_model=APIResponse[TokenPair])
async def refresh_token(
    refresh_token: str,
    db: AsyncSession = Depends(get_db)
):
    """Issue a new access token using a valid refresh token."""
    payload = decode_token(refresh_token)
    if getattr(payload, "type", None) != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    result = await db.execute(select(User).where(User.id == payload.sub))
    user = result.scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found")

    org_result = await db.execute(select(Organization).where(Organization.id == user.org_id))
    org = org_result.scalar_one()

    new_access = create_access_token(user.id, org.id, user.role, org.plan)
    new_refresh = create_refresh_token(user.id, org.id)

    return APIResponse.ok(
        data=TokenPair(
            access_token=new_access,
            refresh_token=new_refresh,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )
    )


# ── GET /me ───────────────────────────────────────────────────
@router.get("/me", response_model=APIResponse[UserBase])
async def get_me(
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get the currently authenticated user's profile."""
    result = await db.execute(select(User).where(User.id == current_user.sub))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    org_result = await db.execute(select(Organization).where(Organization.id == user.org_id))
    org = org_result.scalar_one()

    return APIResponse.ok(data=UserBase(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        plan=org.plan,
        org_id=org.id,
        org_name=org.name,
        credits=org.credits,
        total_credits=org.total_credits,
        is_active=user.is_active,
        created_at=user.created_at,
    ))


# ── POST /demo-login ──────────────────────────────────────────
@router.post("/demo-login", response_model=APIResponse[TokenPair])
async def demo_login():
    """
    Demo login — returns a mock JWT for demonstration purposes.
    Uses a pre-generated token without hitting the database.
    """
    access_token = create_access_token(
        user_id="demo_user",
        org_id="demo_org",
        role=UserRole.ADMIN,
        plan=PlanTier.ENTERPRISE,
    )
    refresh_token = create_refresh_token("demo_user", "demo_org")
    return APIResponse.ok(
        data=TokenPair(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        ),
        message="Demo login successful",
    )
