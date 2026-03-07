"""
OmniForge Nexus – Redis Client
Async Redis with connection pooling, pub/sub, and caching utilities
"""
import json
from typing import Any, Optional
import redis.asyncio as aioredis
import structlog

from shared.config import settings

logger = structlog.get_logger(__name__)

# ── Connection Pool ───────────────────────────────────────────
_redis_pool: Optional[aioredis.ConnectionPool] = None
_redis_client: Optional[aioredis.Redis] = None


async def get_redis() -> aioredis.Redis:
    """Get async Redis client (singleton with pool)."""
    global _redis_pool, _redis_client
    if _redis_client is None:
        _redis_pool = aioredis.ConnectionPool.from_url(
            settings.REDIS_URL,
            max_connections=50,
            decode_responses=True,
        )
        _redis_client = aioredis.Redis(connection_pool=_redis_pool)
        logger.info("redis.connected", url=settings.REDIS_URL)
    return _redis_client


async def close_redis():
    """Close Redis connection pool."""
    global _redis_client, _redis_pool
    if _redis_client:
        await _redis_client.aclose()
        _redis_client = None
    if _redis_pool:
        await _redis_pool.aclose()
        _redis_pool = None
    logger.info("redis.disconnected")


# ── Cache Utilities ───────────────────────────────────────────
class Cache:
    """High-level Redis caching utilities."""

    def __init__(self, prefix: str = "omniforge", default_ttl: int = 300):
        self.prefix = prefix
        self.default_ttl = default_ttl

    def _key(self, key: str) -> str:
        return f"{self.prefix}:{key}"

    async def get(self, key: str) -> Optional[Any]:
        r = await get_redis()
        data = await r.get(self._key(key))
        if data:
            return json.loads(data)
        return None

    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        r = await get_redis()
        return await r.setex(
            self._key(key),
            ttl or self.default_ttl,
            json.dumps(value, default=str)
        )

    async def delete(self, key: str) -> int:
        r = await get_redis()
        return await r.delete(self._key(key))

    async def exists(self, key: str) -> bool:
        r = await get_redis()
        return bool(await r.exists(self._key(key)))

    async def invalidate_pattern(self, pattern: str) -> int:
        r = await get_redis()
        keys = await r.keys(self._key(pattern))
        if keys:
            return await r.delete(*keys)
        return 0

    async def increment(self, key: str, amount: int = 1) -> int:
        r = await get_redis()
        return await r.incrby(self._key(key), amount)

    async def get_many(self, keys: list[str]) -> dict[str, Any]:
        r = await get_redis()
        full_keys = [self._key(k) for k in keys]
        values = await r.mget(full_keys)
        return {
            k: json.loads(v) if v else None
            for k, v in zip(keys, values)
        }


# ── Pub/Sub ───────────────────────────────────────────────────
class PubSub:
    """Redis Pub/Sub for real-time events."""

    CHANNELS = {
        "builds": "omniforge:builds",
        "agents": "omniforge:agents",
        "workflows": "omniforge:workflows",
        "notifications": "omniforge:notifications",
    }

    async def publish(self, channel: str, message: dict) -> int:
        r = await get_redis()
        ch = self.CHANNELS.get(channel, channel)
        return await r.publish(ch, json.dumps(message, default=str))

    async def subscribe(self, channel: str):
        r = await get_redis()
        pubsub = r.pubsub()
        ch = self.CHANNELS.get(channel, channel)
        await pubsub.subscribe(ch)
        return pubsub


# ── Rate Limiter ──────────────────────────────────────────────
async def check_rate_limit(
    identifier: str,
    limit: int = 60,
    window: int = 60
) -> tuple[bool, int, int]:
    """
    Token bucket rate limiter.
    Returns (allowed, remaining, reset_after_seconds)
    """
    r = await get_redis()
    key = f"ratelimit:{identifier}"
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


# ── Session Storage ───────────────────────────────────────────
async def store_build_state(job_id: str, state: dict, ttl: int = 3600):
    """Store AI build job state in Redis."""
    r = await get_redis()
    await r.setex(f"build:{job_id}", ttl, json.dumps(state, default=str))


async def get_build_state(job_id: str) -> Optional[dict]:
    """Get AI build job state from Redis."""
    r = await get_redis()
    data = await r.get(f"build:{job_id}")
    return json.loads(data) if data else None


async def stream_build_log(job_id: str, message: str, ttl: int = 7200):
    """Append a log line to a build stream."""
    r = await get_redis()
    key = f"build:logs:{job_id}"
    await r.rpush(key, message)
    await r.expire(key, ttl)


async def get_build_logs(job_id: str) -> list[str]:
    """Get all log lines for a build job."""
    r = await get_redis()
    return await r.lrange(f"build:logs:{job_id}", 0, -1)


# ── Singletons ────────────────────────────────────────────────
cache = Cache()
pubsub = PubSub()
