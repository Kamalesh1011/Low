"""
OmniForge Nexus – Templates & Marketplace Routers
"""
from fastapi import APIRouter, Query
from typing import Optional
from shared.models.schemas import APIResponse

# ── Templates Router ──────────────────────────────────────────
router = APIRouter()

TEMPLATES = [
    {"id": "t01", "name": "GST ERP", "icon": "📊", "category": "ERP", "desc": "Complete GST billing & compliance system", "color": "#6366f1", "tech": ["FastAPI", "React", "PostgreSQL"], "popular": True, "time": "45s", "downloads": 1240},
    {"id": "t02", "name": "Inventory Manager", "icon": "📦", "category": "Inventory", "desc": "Multi-warehouse inventory with AI reorder", "color": "#06b6d4", "tech": ["FastAPI", "React", "Redis"], "popular": True, "time": "38s", "downloads": 980},
    {"id": "t03", "name": "CRM Platform", "icon": "🤝", "category": "CRM", "desc": "Smart customer relationship management", "color": "#8b5cf6", "tech": ["FastAPI", "React", "PostgreSQL"], "popular": True, "time": "42s", "downloads": 860},
    {"id": "t04", "name": "HR Payroll", "icon": "💰", "category": "HR", "desc": "Payroll with ESI, PF & compliance", "color": "#10b981", "tech": ["FastAPI", "React", "PostgreSQL"], "popular": False, "time": "55s", "downloads": 620},
    {"id": "t05", "name": "Retail POS", "icon": "🏪", "category": "Retail", "desc": "Point-of-sale with inventory sync", "color": "#f59e0b", "tech": ["FastAPI", "React", "SQLite"], "popular": True, "time": "35s", "downloads": 1100},
    {"id": "t06", "name": "Manufacturing Tracker", "icon": "🏭", "category": "Manufacturing", "desc": "Production workflow & QC system", "color": "#ef4444", "tech": ["FastAPI", "React", "PostgreSQL"], "popular": False, "time": "60s", "downloads": 340},
    {"id": "t07", "name": "Textile ERP", "icon": "🧵", "category": "ERP", "desc": "Textile-specific ERP with GST", "color": "#ec4899", "tech": ["FastAPI", "React", "PostgreSQL"], "popular": True, "time": "48s", "downloads": 720},
    {"id": "t08", "name": "Restaurant System", "icon": "🍽️", "category": "F&B", "desc": "POS + menu + kitchen + billing", "color": "#f97316", "tech": ["FastAPI", "React", "Redis"], "popular": False, "time": "40s", "downloads": 480},
    {"id": "t09", "name": "Supplier Portal", "icon": "🔗", "category": "Supply Chain", "desc": "Supplier network & procurement", "color": "#06b6d4", "tech": ["FastAPI", "React", "PostgreSQL"], "popular": False, "time": "52s", "downloads": 290},
    {"id": "t10", "name": "Healthcare CRM", "icon": "🏥", "category": "Healthcare", "desc": "Patient management & appointment booking", "color": "#10b981", "tech": ["FastAPI", "React", "PostgreSQL"], "popular": True, "time": "50s", "downloads": 810},
    {"id": "t11", "name": "E-Commerce Store", "icon": "🛍️", "category": "E-Commerce", "desc": "Full-featured online store with payments", "color": "#6366f1", "tech": ["FastAPI", "React", "PostgreSQL", "Stripe"], "popular": True, "time": "65s", "downloads": 1480},
    {"id": "t12", "name": "School ERP", "icon": "🎓", "category": "Education", "desc": "Student, teacher & exam management", "color": "#8b5cf6", "tech": ["FastAPI", "React", "PostgreSQL"], "popular": False, "time": "58s", "downloads": 420},
]


@router.get("/", response_model=APIResponse[list])
async def list_templates(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    popular_only: bool = Query(False),
):
    """List all available project templates."""
    items = TEMPLATES[:]
    if category and category != "All":
        items = [t for t in items if t["category"] == category]
    if search:
        items = [t for t in items if search.lower() in t["name"].lower() or search.lower() in t["desc"].lower()]
    if popular_only:
        items = [t for t in items if t["popular"]]
    return APIResponse.ok(data=items, meta={"total": len(items)})


@router.get("/categories", response_model=APIResponse[list])
async def list_categories():
    cats = list(set(t["category"] for t in TEMPLATES))
    return APIResponse.ok(data=["All"] + sorted(cats))


@router.get("/{template_id}", response_model=APIResponse[dict])
async def get_template(template_id: str):
    tmpl = next((t for t in TEMPLATES if t["id"] == template_id), None)
    if not tmpl:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Template not found")
    return APIResponse.ok(data=tmpl)
