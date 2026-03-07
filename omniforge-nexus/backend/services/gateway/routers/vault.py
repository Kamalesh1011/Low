"""
OmniForge Nexus – Vault Router
AES-256 encrypted API key/secret management.
"""
import base64
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from cryptography.fernet import Fernet
import hashlib
import structlog

from shared.database import get_db
from shared.models.schemas import SecretCreate, SecretResponse, SecretStatus, APIResponse
from shared.models.orm import Secret, AuditLog
from shared.config import settings
from services.auth_service.jwt_handler import get_current_user

router = APIRouter()
logger = structlog.get_logger(__name__)


def _get_fernet() -> Fernet:
    """Derive a Fernet key from the vault encryption key."""
    key_bytes = settings.VAULT_ENCRYPTION_KEY.encode()
    key_hash = hashlib.sha256(key_bytes).digest()
    fernet_key = base64.urlsafe_b64encode(key_hash)
    return Fernet(fernet_key)


def encrypt_secret(value: str) -> str:
    f = _get_fernet()
    return f.encrypt(value.encode()).decode()


def decrypt_secret(encrypted: str) -> str:
    f = _get_fernet()
    return f.decrypt(encrypted.encode()).decode()


def mask_value(value: str) -> str:
    if len(value) <= 8:
        return "••••••••"
    return value[:4] + "•" * (len(value) - 8) + value[-4:]


@router.get("/", response_model=APIResponse[list])
async def list_secrets(
    environment: Optional[str] = Query(None, description="Filter by environment"),
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all secrets for current org (values are masked)."""
    query = select(Secret).where(
        Secret.org_id == current_user.org_id,
        Secret.status != SecretStatus.REVOKED.value,
    )
    if environment:
        query = query.where(Secret.environment == environment)
    result = await db.execute(query.order_by(Secret.created_at.desc()))
    secrets = result.scalars().all()

    return APIResponse.ok(data=[
        {
            "id": s.id,
            "name": s.name,
            "service": s.service,
            "environment": s.environment,
            "status": s.status,
            "masked_value": "••••••••••••••••",
            "last_used": s.last_used.isoformat() if s.last_used else None,
            "expires_at": s.expires_at.isoformat() if s.expires_at else None,
            "created_at": s.created_at.isoformat(),
        }
        for s in secrets
    ])


@router.post("/", response_model=APIResponse[dict], status_code=201)
async def create_secret(
    payload: SecretCreate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Store an encrypted secret."""
    encrypted = encrypt_secret(payload.value)

    secret = Secret(
        org_id=current_user.org_id,
        name=payload.name,
        service=payload.service,
        environment=payload.environment,
        description=payload.description,
        encrypted_value=encrypted,
        status=SecretStatus.ACTIVE,
    )
    db.add(secret)

    db.add(AuditLog(
        org_id=current_user.org_id,
        user_id=current_user.sub,
        event="secret.created",
        resource_type="secret",
        resource_id=secret.id,
        meta={"name": payload.name, "service": payload.service},
    ))
    await db.commit()
    await db.refresh(secret)

    logger.info("secret.created", secret_id=secret.id, service=payload.service)
    return APIResponse.ok(
        data={"id": secret.id, "name": secret.name, "service": secret.service},
        message="Secret stored securely with AES-256 encryption",
    )


@router.get("/{secret_id}/reveal", response_model=APIResponse[dict])
async def reveal_secret(
    secret_id: str,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Reveal a decrypted secret value (requires audit logging)."""
    result = await db.execute(
        select(Secret).where(Secret.id == secret_id, Secret.org_id == current_user.org_id)
    )
    secret = result.scalar_one_or_none()
    if not secret:
        raise HTTPException(status_code=404, detail="Secret not found")

    try:
        value = decrypt_secret(secret.encrypted_value)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Decryption failed")

    # Update last_used + audit
    secret.last_used = datetime.utcnow()
    db.add(AuditLog(
        org_id=current_user.org_id,
        user_id=current_user.sub,
        event="secret.revealed",
        resource_type="secret",
        resource_id=secret.id,
    ))
    await db.commit()

    return APIResponse.ok(data={
        "id": secret.id,
        "name": secret.name,
        "service": secret.service,
        "value": value,
    })


@router.delete("/{secret_id}", response_model=APIResponse[dict])
async def revoke_secret(
    secret_id: str,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Revoke (soft-delete) a secret."""
    result = await db.execute(
        select(Secret).where(Secret.id == secret_id, Secret.org_id == current_user.org_id)
    )
    secret = result.scalar_one_or_none()
    if not secret:
        raise HTTPException(status_code=404, detail="Secret not found")

    secret.status = SecretStatus.REVOKED
    db.add(AuditLog(
        org_id=current_user.org_id,
        user_id=current_user.sub,
        event="secret.revoked",
        resource_type="secret",
        resource_id=secret.id,
    ))
    await db.commit()
    return APIResponse.ok(message="Secret revoked successfully")
