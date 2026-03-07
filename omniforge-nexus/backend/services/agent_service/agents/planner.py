"""
OmniForge Nexus – Planner Agent
Decomposes natural language into a structured execution plan.
"""
import json
from typing import Optional
import structlog

from shared.openrouter import llm, prompts

logger = structlog.get_logger(__name__)


class PlannerAgent:
    """
    Agent: PlannerBot
    Role: Parse user intent and generate a detailed JSON project plan.
    Model: GPT-4o (best at structured reasoning)
    """

    async def run(self, prompt: str, model: Optional[str] = None) -> dict:
        messages = [
            {"role": "system", "content": prompts.SYSTEM_PLANNER},
            {
                "role": "user",
                "content": f"""Generate a complete project plan for the following requirement:

USER REQUEST: {prompt}

Return a JSON object with ALL of these fields:
{{
  "project_name": "...",
  "app_type": "ERP|SaaS|CRM|API|Website|Marketplace|...",
  "description": "...",
  "target_users": "...",
  "tech_stack": {{
    "frontend": "React",
    "backend": "FastAPI",
    "database": "PostgreSQL",
    "cache": "Redis",
    "queue": "Celery",
    "deployment": "Docker/K8s"
  }},
  "features": [
    {{"name": "...", "priority": "high|medium|low", "complexity": "simple|medium|complex", "description": "..."}}
  ],
  "database_tables": ["users", "..."],
  "api_endpoints": [
    {{"method": "GET|POST|PUT|DELETE", "path": "/api/v1/...", "description": "..."}}
  ],
  "agents_needed": ["planner", "architect", "builder", "validator", "tester"],
  "estimated_build_time_seconds": 45
}}"""
            }
        ]

        try:
            result = await llm.complete_json(
                messages=messages,
                agent_type="planner",
                temperature=0.3,
            )
            logger.info("planner.success", project=result.get("project_name"))
            return result
        except Exception as e:
            logger.error("planner.failed", error=str(e))
            # Return a fallback plan based on the prompt
            return self._fallback_plan(prompt)

    def _fallback_plan(self, prompt: str) -> dict:
        """Generate a basic fallback plan when LLM is unavailable."""
        words = prompt.lower().split()
        app_type = "SaaS"
        if any(w in words for w in ["erp", "billing", "inventory", "gst"]):
            app_type = "ERP"
        elif any(w in words for w in ["crm", "customer", "sales", "leads"]):
            app_type = "CRM"
        elif any(w in words for w in ["api", "microservice", "service"]):
            app_type = "API"
        elif any(w in words for w in ["website", "landing", "portfolio"]):
            app_type = "Website"

        return {
            "project_name": " ".join(prompt.split()[:3]).title(),
            "app_type": app_type,
            "description": prompt,
            "target_users": "Business users",
            "tech_stack": {
                "frontend": "React",
                "backend": "FastAPI",
                "database": "PostgreSQL",
                "cache": "Redis",
                "queue": "Celery",
                "deployment": "Docker/K8s",
            },
            "features": [
                {"name": "User Management", "priority": "high", "complexity": "medium", "description": "Auth & RBAC"},
                {"name": "Dashboard", "priority": "high", "complexity": "medium", "description": "Main overview"},
                {"name": "REST API", "priority": "high", "complexity": "complex", "description": "Full CRUD API"},
                {"name": "Reports", "priority": "medium", "complexity": "medium", "description": "Analytics"},
            ],
            "database_tables": ["users", "organizations", "audit_logs"],
            "api_endpoints": [
                {"method": "POST", "path": "/api/v1/auth/login", "description": "User login"},
                {"method": "GET", "path": "/api/v1/dashboard", "description": "Dashboard stats"},
            ],
            "agents_needed": ["architect", "builder", "validator"],
            "estimated_build_time_seconds": 45,
        }
