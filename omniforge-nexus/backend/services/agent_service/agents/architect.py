"""
OmniForge Nexus – Architect Agent
Designs database schema and system architecture from a project plan.
"""
from typing import Optional
import structlog

from shared.openrouter import llm, prompts

logger = structlog.get_logger(__name__)


class ArchitectAgent:
    """
    Agent: ArchitectAI
    Role: Generate database schema, API spec, and architecture diagram.
    Model: Claude 3.5 Sonnet (excellent at structured design)
    """

    async def run(self, plan: dict, model: Optional[str] = None) -> dict:
        project_name = plan.get("project_name", "App")
        tables = plan.get("database_tables", ["users"])
        features = plan.get("features", [])
        tech_stack = plan.get("tech_stack", {})

        messages = [
            {"role": "system", "content": prompts.SYSTEM_ARCHITECT},
            {
                "role": "user",
                "content": f"""Design the complete database schema and architecture for:

PROJECT: {project_name}
APP TYPE: {plan.get('app_type', 'SaaS')}
FEATURES: {[f['name'] for f in features]}
TABLES NEEDED: {tables}
TECH STACK: {tech_stack}

Return JSON with:
{{
  "tables": [
    {{
      "name": "users",
      "columns": [
        {{"name": "id", "type": "UUID", "primary_key": true, "nullable": false}},
        {{"name": "email", "type": "VARCHAR", "unique": true, "nullable": false}},
        {{"name": "created_at", "type": "TIMESTAMP", "default": "now()"}}
      ],
      "indexes": ["email"],
      "comment": "Platform users"
    }}
  ],
  "api_endpoints": [
    {{"method": "POST", "path": "/api/v1/auth/login", "description": "Login", "authenticated": false}},
    {{"method": "GET", "path": "/api/v1/users/me", "description": "Get current user", "authenticated": true}}
  ],
  "architecture_diagram": "mermaid graph TD\\n  A[Client] --> B[API Gateway]\\n  ...",
  "er_diagram": "mermaid erDiagram\\n  users {{...}}"
}}"""
            }
        ]

        try:
            result = await llm.complete_json(
                messages=messages,
                agent_type="architect",
                temperature=0.2,
            )
            logger.info("architect.success",
                tables=len(result.get("tables", [])),
                endpoints=len(result.get("api_endpoints", [])))
            return result
        except Exception as e:
            logger.error("architect.failed", error=str(e))
            return self._fallback_architecture(plan)

    def _fallback_architecture(self, plan: dict) -> dict:
        tables = []
        for table_name in plan.get("database_tables", ["users", "organizations"]):
            tables.append({
                "name": table_name,
                "columns": [
                    {"name": "id", "type": "UUID", "primary_key": True, "nullable": False},
                    {"name": "created_at", "type": "TIMESTAMP", "default": "now()", "nullable": False},
                    {"name": "updated_at", "type": "TIMESTAMP", "default": "now()", "nullable": False},
                ],
                "indexes": [],
                "comment": f"{table_name.title()} table",
            })

        return {
            "tables": tables,
            "api_endpoints": plan.get("api_endpoints", []),
            "architecture_diagram": "graph TD\n  Client --> Gateway\n  Gateway --> API\n  API --> DB",
            "er_diagram": "erDiagram\n  users {\n    uuid id PK\n    string email\n  }",
        }
