"""
OmniForge Nexus – Auth Service
JWT authentication, RBAC, and multi-tenant isolation
"""
from datetime import datetime, timedelta
from typing import Optional
import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import structlog

from shared.config import settings
from shared.database import get_db
from shared.models.schemas import TokenPayload, UserRole, PlanTier

logger = structlog.get_logger(__name__)

# ── Password Hashing ──────────────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ── OAuth2 Scheme ─────────────────────────────────────────────
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ── Token Generation ──────────────────────────────────────────
def create_access_token(
    user_id: str,
    org_id: str,
    role: str,
    plan: str,
    expires_delta: Optional[timedelta] = None,
) -> str:
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload = {
        "sub": user_id,
        "org_id": org_id,
        "role": role,
        "plan": plan,
        "exp": expire,
        "iat": datetime.utcnow(),
        "jti": str(uuid.uuid4()),
        "type": "access",
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(user_id: str, org_id: str) -> str:
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": user_id,
        "org_id": org_id,
        "exp": expire,
        "iat": datetime.utcnow(),
        "jti": str(uuid.uuid4()),
        "type": "refresh",
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> TokenPayload:
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return TokenPayload(**payload)
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ── Current User Dependency ───────────────────────────────────
async def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenPayload:
    """Extract and validate the JWT token from Authorization header."""
    return decode_token(token)


async def require_admin(current_user: TokenPayload = Depends(get_current_user)) -> TokenPayload:
    """Require admin or super_admin role."""
    if current_user.role not in (UserRole.ADMIN, UserRole.SUPER_ADMIN):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin role required",
        )
    return current_user


async def require_developer(current_user: TokenPayload = Depends(get_current_user)) -> TokenPayload:
    """Require at least developer role."""
    if current_user.role == UserRole.VIEWER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Developer role required",
        )
    return current_user


# ── RBAC Permissions ──────────────────────────────────────────
ROLE_PERMISSIONS = {
    UserRole.SUPER_ADMIN: {"*"},
    UserRole.ADMIN: {
        "apps:*", "agents:*", "workflows:*", "schema:*",
        "api:*", "vault:*", "users:read", "analytics:*",
    },
    UserRole.DEVELOPER: {
        "apps:read", "apps:create", "apps:update",
        "agents:read", "agents:create",
        "workflows:read", "workflows:create",
        "schema:*", "api:*",
        "vault:read", "vault:create",
    },
    UserRole.VIEWER: {
        "apps:read", "agents:read", "workflows:read",
        "analytics:read",
    },
}


def has_permission(role: UserRole, permission: str) -> bool:
    perms = ROLE_PERMISSIONS.get(role, set())
    if "*" in perms:
        return True
    if permission in perms:
        return True
    # Check wildcard like "apps:*"
    prefix = permission.split(":")[0] + ":*"
    return prefix in perms


def require_permission(permission: str):
    """Decorator-style dependency factory for permission checks."""
    async def _check(current_user: TokenPayload = Depends(get_current_user)):
        if not has_permission(current_user.role, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied: {permission}",
            )
        return current_user
    return _check
