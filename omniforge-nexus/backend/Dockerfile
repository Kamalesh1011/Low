FROM python:3.12-slim

# ── System deps ────────────────────────────────────────────────
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ── Python deps (cached layer) ─────────────────────────────────
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── App code ───────────────────────────────────────────────────
COPY . .

# ── Create storage dir ─────────────────────────────────────────
RUN mkdir -p /app/storage

# ── Non-root user ──────────────────────────────────────────────
RUN useradd -m -u 1000 omniforge && chown -R omniforge:omniforge /app
USER omniforge

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "services.gateway.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
