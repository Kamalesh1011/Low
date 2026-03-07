"""
OmniForge Nexus – Marketplace Router
Plugin discovery, install, and management.
"""
from fastapi import APIRouter, Query
from typing import Optional
from shared.models.schemas import APIResponse

router = APIRouter()

PLUGINS = [
    {"id": "p01", "name": "Razorpay Gateway", "category": "Payments", "icon": "💳", "version": "2.1.0", "rating": 4.9, "downloads": 8420, "verified": True, "price": "free", "description": "Full Razorpay integration with webhooks and refunds", "tags": ["payments", "india", "upi"]},
    {"id": "p02", "name": "WhatsApp Notifier", "category": "Messaging", "icon": "💬", "version": "1.4.0", "rating": 4.8, "downloads": 6100, "verified": True, "price": "free", "description": "Send WhatsApp messages and notifications via Twilio", "tags": ["messaging", "notifications", "whatsapp"]},
    {"id": "p03", "name": "GST Filing Suite", "category": "Compliance", "icon": "📋", "version": "3.0.1", "rating": 4.7, "downloads": 5300, "verified": True, "price": "₹999/mo", "description": "Automated GST return filing and reconciliation", "tags": ["gst", "compliance", "india"]},
    {"id": "p04", "name": "AI Analytics", "category": "Analytics", "icon": "📊", "version": "1.2.0", "rating": 4.6, "downloads": 4200, "verified": True, "price": "free", "description": "AI-powered insights and anomaly detection on your data", "tags": ["ai", "analytics", "ml"]},
    {"id": "p05", "name": "AWS S3 Storage", "category": "Storage", "icon": "☁️", "version": "1.0.3", "rating": 4.9, "downloads": 7800, "verified": True, "price": "free", "description": "Direct S3 integration for file uploads and CDN", "tags": ["storage", "aws", "cdn"]},
    {"id": "p06", "name": "SendGrid Email", "category": "Email", "icon": "📧", "version": "2.0.0", "rating": 4.7, "downloads": 5900, "verified": True, "price": "free", "description": "Transactional email with templates and analytics", "tags": ["email", "sendgrid", "transactional"]},
    {"id": "p07", "name": "Slack Integration", "category": "Messaging", "icon": "💼", "version": "1.3.0", "rating": 4.5, "downloads": 3400, "verified": True, "price": "free", "description": "Send alerts and notifications to Slack channels", "tags": ["slack", "notifications", "team"]},
    {"id": "p08", "name": "Firebase Auth", "category": "Auth", "icon": "🔐", "version": "1.1.0", "rating": 4.6, "downloads": 2900, "verified": False, "price": "free", "description": "Google Firebase authentication integration", "tags": ["auth", "firebase", "google"]},
    {"id": "p09", "name": "Elasticsearch Search", "category": "Search", "icon": "🔍", "version": "2.2.0", "rating": 4.8, "downloads": 4600, "verified": True, "price": "free", "description": "Full-text search and analytics with Elasticsearch", "tags": ["search", "elasticsearch", "analytics"]},
    {"id": "p10", "name": "Kafka Event Bus", "category": "Messaging", "icon": "⚡", "version": "1.5.0", "rating": 4.7, "downloads": 3100, "verified": True, "price": "free", "description": "Event streaming with Apache Kafka", "tags": ["kafka", "events", "streaming"]},
    {"id": "p11", "name": "Stripe Billing", "category": "Payments", "icon": "💰", "version": "3.1.0", "rating": 4.9, "downloads": 6700, "verified": True, "price": "free", "description": "Global subscription billing and invoicing", "tags": ["payments", "stripe", "billing"]},
    {"id": "p12", "name": "OpenAI GPT", "category": "AI", "icon": "🤖", "version": "1.0.0", "rating": 4.8, "downloads": 9200, "verified": True, "price": "free", "description": "Direct OpenAI API integration for your apps", "tags": ["ai", "openai", "gpt"]},
]


@router.get("/", response_model=APIResponse[list])
async def list_plugins(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    verified_only: bool = Query(False),
    sort_by: str = Query("downloads"),
):
    items = PLUGINS[:]
    if category and category != "All":
        items = [p for p in items if p["category"] == category]
    if search:
        q = search.lower()
        items = [p for p in items if q in p["name"].lower() or q in p["description"].lower() or any(q in t for t in p.get("tags", []))]
    if verified_only:
        items = [p for p in items if p["verified"]]
    if sort_by == "downloads":
        items.sort(key=lambda x: x["downloads"], reverse=True)
    elif sort_by == "rating":
        items.sort(key=lambda x: x["rating"], reverse=True)
    return APIResponse.ok(data=items, meta={"total": len(items)})


@router.get("/categories", response_model=APIResponse[list])
async def list_categories():
    cats = list(set(p["category"] for p in PLUGINS))
    return APIResponse.ok(data=["All"] + sorted(cats))


@router.get("/{plugin_id}", response_model=APIResponse[dict])
async def get_plugin(plugin_id: str):
    plugin = next((p for p in PLUGINS if p["id"] == plugin_id), None)
    if not plugin:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Plugin not found")
    return APIResponse.ok(data=plugin)


@router.post("/{plugin_id}/install", response_model=APIResponse[dict])
async def install_plugin(plugin_id: str):
    plugin = next((p for p in PLUGINS if p["id"] == plugin_id), None)
    if not plugin:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Plugin not found")
    return APIResponse.ok(
        data={"plugin_id": plugin_id, "status": "installed"},
        message=f"'{plugin['name']}' installed successfully",
    )
