"""
OmniForge Nexus – Redis Client
Async Redis with connection pooling, pub/sub, and caching utilities.
Gracefully falls back to in-memory storage when Redis is unavailable.
"""
import json
from typing import Any, Optional
import redis.asyncio as aioredis
import structlog

from shared.config import settings

logger = structlog.get_logger(__name__)

# ── In-Memory Fallback Storage ────────────────────────────────
_mem_store: dict[str, str] = {}       # key → json string
_mem_lists: dict[str, list] = {}      # key → list of strings

# ── Connection Pool ───────────────────────────────────────────
_redis_pool: Optional[aioredis.ConnectionPool] = None
_redis_client: Optional[aioredis.Redis] = None
_redis_available: bool = False


async def get_redis() -> Optional[aioredis.Redis]:
    """Get async Redis client. Returns None if Redis is unavailable."""
    global _redis_pool, _redis_client, _redis_available
    if _redis_client is not None:
        return _redis_client if _redis_available else None
    try:
        _redis_pool = aioredis.ConnectionPool.from_url(
            settings.REDIS_URL,
            max_connections=50,
            decode_responses=True,
            socket_connect_timeout=2,
        )
        _redis_client = aioredis.Redis(connection_pool=_redis_pool)
        await _redis_client.ping()
        _redis_available = True
        logger.info("redis.connected", url=settings.REDIS_URL)
        return _redis_client
    except Exception as e:
        _redis_available = False
        logger.warning("redis.unavailable", error=str(e))
        return None


async def close_redis():
    """Close Redis connection pool."""
    global _redis_client, _redis_pool
    if _redis_client:
        try:
            await _redis_client.aclose()
        except Exception:
            pass
        _redis_client = None
    if _redis_pool:
        try:
            await _redis_pool.aclose()
        except Exception:
            pass
        _redis_pool = None
    logger.info("redis.disconnected")


# ── Cache Utilities ───────────────────────────────────────────
class Cache:
    """High-level Redis caching utilities with in-memory fallback."""

    def __init__(self, prefix: str = "omniforge", default_ttl: int = 300):
        self.prefix = prefix
        self.default_ttl = default_ttl

    def _key(self, key: str) -> str:
        return f"{self.prefix}:{key}"

    async def get(self, key: str) -> Optional[Any]:
        r = await get_redis()
        fk = self._key(key)
        if r:
            data = await r.get(fk)
        else:
            data = _mem_store.get(fk)
        return json.loads(data) if data else None

    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        r = await get_redis()
        fk = self._key(key)
        serialized = json.dumps(value, default=str)
        if r:
            return await r.setex(fk, ttl or self.default_ttl, serialized)
        else:
            _mem_store[fk] = serialized
            return True

    async def delete(self, key: str) -> int:
        r = await get_redis()
        fk = self._key(key)
        if r:
            return await r.delete(fk)
        else:
            return 1 if _mem_store.pop(fk, None) is not None else 0

    async def exists(self, key: str) -> bool:
        r = await get_redis()
        fk = self._key(key)
        if r:
            return bool(await r.exists(fk))
        return fk in _mem_store

    async def invalidate_pattern(self, pattern: str) -> int:
        r = await get_redis()
        if r:
            keys = await r.keys(self._key(pattern))
            if keys:
                return await r.delete(*keys)
        else:
            prefix = self._key(pattern.replace("*", ""))
            to_del = [k for k in _mem_store if k.startswith(prefix)]
            for k in to_del:
                _mem_store.pop(k, None)
            return len(to_del)
        return 0

    async def increment(self, key: str, amount: int = 1) -> int:
        r = await get_redis()
        fk = self._key(key)
        if r:
            return await r.incrby(fk, amount)
        current = int(json.loads(_mem_store.get(fk, "0")))
        new_val = current + amount
        _mem_store[fk] = json.dumps(new_val)
        return new_val

    async def get_many(self, keys: list[str]) -> dict[str, Any]:
        r = await get_redis()
        if r:
            full_keys = [self._key(k) for k in keys]
            values = await r.mget(full_keys)
            return {k: json.loads(v) if v else None for k, v in zip(keys, values)}
        return {k: json.loads(_mem_store[self._key(k)]) if self._key(k) in _mem_store else None for k in keys}


# ── Pub/Sub ───────────────────────────────────────────────────
class PubSub:
    """Redis Pub/Sub for real-time events. No-ops when Redis is unavailable."""

    CHANNELS = {
        "builds": "omniforge:builds",
        "agents": "omniforge:agents",
        "workflows": "omniforge:workflows",
        "notifications": "omniforge:notifications",
    }

    async def publish(self, channel: str, message: dict) -> int:
        r = await get_redis()
        if not r:
            return 0  # Silently skip if Redis is unavailable
        ch = self.CHANNELS.get(channel, channel)
        try:
            return await r.publish(ch, json.dumps(message, default=str))
        except Exception:
            return 0

    async def subscribe(self, channel: str):
        r = await get_redis()
        if not r:
            return None
        ps = r.pubsub()
        ch = self.CHANNELS.get(channel, channel)
        await ps.subscribe(ch)
        return ps


# ── Rate Limiter ──────────────────────────────────────────────
async def check_rate_limit(
    identifier: str,
    limit: int = 60,
    window: int = 60
) -> tuple[bool, int, int]:
    """Token bucket rate limiter. Falls back to always-allow when Redis is down."""
    r = await get_redis()
    if not r:
        return True, limit, window  # Allow all when Redis is down
    key = f"ratelimit:{identifier}"
    try:
        pipe = r.pipeline()
        pipe.incr(key)
        pipe.ttl(key)
        count, ttl = await pipe.execute()
        if count == 1:
            await r.expire(key, window)
            ttl = window
        remaining = max(0, limit - count)
        allowed = count <= limit
        return allowed, remaining, ttl
    except Exception:
        return True, limit, window


# ── Build State Storage ───────────────────────────────────────
async def store_build_state(job_id: str, state: dict, ttl: int = 3600):
    """Store AI build job state in Redis (or in-memory fallback)."""
    r = await get_redis()
    key = f"build:{job_id}"
    serialized = json.dumps(state, default=str)
    if r:
        try:
            await r.setex(key, ttl, serialized)
            return
        except Exception:
            pass
    _mem_store[key] = serialized


async def get_build_state(job_id: str) -> Optional[dict]:
    """Get AI build job state from Redis (or in-memory fallback)."""
    r = await get_redis()
    key = f"build:{job_id}"
    if r:
        try:
            data = await r.get(key)
            return json.loads(data) if data else None
        except Exception:
            pass
    data = _mem_store.get(key)
    return json.loads(data) if data else None


async def stream_build_log(job_id: str, message: str, ttl: int = 7200):
    """Append a log line to a build stream (Redis list or in-memory list)."""
    r = await get_redis()
    key = f"build:logs:{job_id}"
    if r:
        try:
            await r.rpush(key, message)
            await r.expire(key, ttl)
            return
        except Exception:
            pass
    if key not in _mem_lists:
        _mem_lists[key] = []
    _mem_lists[key].append(message)


async def get_build_logs(job_id: str) -> list[str]:
    """Get all log lines for a build job (Redis or in-memory)."""
    r = await get_redis()
    key = f"build:logs:{job_id}"
    if r:
        try:
            return await r.lrange(key, 0, -1)
        except Exception:
            pass
    return _mem_lists.get(key, [])


# ── Singletons ────────────────────────────────────────────────
cache = Cache()
pubsub = PubSub()
