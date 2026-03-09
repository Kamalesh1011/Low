"""
OmniForge Nexus – Builder Agent
Generates production-ready full-stack code from plan + architecture.
"""
from typing import Optional
import structlog

from shared.openrouter import llm, prompts

logger = structlog.get_logger(__name__)

class BuilderAgent:
    """
    Agent: BuilderBot
    Role: Generate complete, runnable code files from architecture.
    Model: GPT-4o (best for code generation)
    """

    async def run(
        self,
        plan: dict,
        architecture: dict,
        model: Optional[str] = None
    ) -> dict[str, str]:
        """Generate all code artifacts using LLM logic."""
        artifacts = {}
        project_name = plan.get("project_name", "GeneratedApp")
        tables = architecture.get("tables", [])
        endpoints = architecture.get("api_endpoints", [])
        tech_stack = plan.get("tech_stack", {})

        # ── 1. Backend: Base Setup ────────────────────────────
        # Generate main.py with all routers registered
        router_imports = [f"from routers import {t['name']}" for t in tables]
        router_includes = [f"app.include_router({t['name']}.router)" for t in tables]
        
        main_prompt = f"""
        Generate a professional main.py for a FastAPI project named '{project_name}'.
        Include lifespan for logging, CORS for all origins, and health check.
        Register these routers: {', '.join([t['name'] for t in tables])}.
        """
        
        main_res = await llm.complete(
            messages=[{"role": "user", "content": main_prompt}],
            agent_type="builder"
        )
        artifacts["backend/main.py"] = main_res.content

        # ── 2. Backend: Models & Routers ──────────────────────
        for table in tables:
            t_name = table['name']
            # Models
            model_prompt = f"Generate Pydantic models for table '{t_name}' based on columns: {table['columns']}. Include Base, Create, and Response models."
            model_res = await llm.complete(messages=[{"role": "user", "content": model_prompt}], agent_type="builder")
            artifacts[f"backend/models/{t_name}.py"] = model_res.content
            
            # Routers
            router_prompt = f"Generate a FastAPI router for '{t_name}' with CRUD operations using SQLAlchemy async. Table columns: {table['columns']}."
            router_res = await llm.complete(messages=[{"role": "user", "content": router_prompt}], agent_type="builder")
            artifacts[f"backend/routers/{t_name}.py"] = router_res.content

        # ── 3. Frontend: React + Tailwind ──────────────────────
        # Generate App.jsx
        app_jsx_prompt = f"""
        Generate a React App.jsx using Tailwind CSS for '{project_name}'.
        Create a modern, clean dashboard with a sidebar navigation for these features: {', '.join([t['name'] for t in tables])}.
        Use Lucide-React for icons.
        """
        app_jsx_res = await llm.complete(messages=[{"role": "user", "content": app_jsx_prompt}], agent_type="builder")
        artifacts["frontend/src/App.jsx"] = app_jsx_res.content

        # Generate a page for each table
        for table in tables:
            t_name = table['name']
            page_prompt = f"""
            Generate a React page component 'pages/{t_name.title()}.jsx' for managing {t_name}.
            Include a table to display data and a form to add new items.
            Use Tailwind CSS and fetch from '/api/v1/{t_name}'.
            """
            page_res = await llm.complete(messages=[{"role": "user", "content": page_prompt}], agent_type="builder")
            artifacts[f"frontend/src/pages/{t_name.title()}.jsx"] = page_res.content

        # ── 4. Infra ──────────────────────────────────────────
        artifacts["requirements.txt"] = "fastapi\nuvicorn\nsqlalchemy\nasyncpg\npydantic\nstructlog\npython-jose\n"
        artifacts["package.json"] = f'{{"name": "{project_name.lower().replace(" ","-")}", "dependencies": {{"react": "^18", "lucide-react": "^0.400.0", "axios": "^1.7.0"}}}}'
        artifacts["docker-compose.yml"] = self._gen_docker_compose(project_name)

        return artifacts

        # Generate a requirements.txt
        artifacts["requirements.txt"] = (
            "fastapi==0.115.6\nuvicorn[standard]==0.32.1\n"
            "sqlalchemy==2.0.36\nasyncpg==0.30.0\npydantic==2.10.3\n"
            "python-jose[cryptography]==3.3.0\npasslib[bcrypt]==1.7.4\n"
            "redis==5.2.1\nstructlog==24.4.0\n"
        )

        # Generate docker-compose.yml
        artifacts["docker-compose.yml"] = self._gen_docker_compose(project_name)

        # Use LLM to generate any complex business logic if API key is available
        try:
            complex_features = [
                f for f in plan.get("features", [])
                if f.get("complexity") == "complex"
            ][:2]

            for feature in complex_features:
                messages = [
                    {"role": "system", "content": prompts.SYSTEM_BUILDER},
                    {"role": "user", "content": f"""Generate a FastAPI service module for this feature:
Feature: {feature['name']}
Description: {feature['description']}
Project: {project_name}
Database: PostgreSQL with SQLAlchemy async

Write the complete Python module with proper typing, error handling, and docstrings."""}
                ]
                result = await llm.complete(
                    messages=messages,
                    agent_type="builder",
                    max_tokens=2000,
                    temperature=0.3,
                )
                safe_name = feature["name"].lower().replace(" ", "_")
                artifacts[f"services/{safe_name}.py"] = result.content

        except Exception as e:
            logger.warning("builder.llm_skipped", reason=str(e))

        logger.info("builder.success", files=len(artifacts), project=project_name)
        return artifacts

    def _to_python_type(self, sql_type: str) -> str:
        mapping = {
            "VARCHAR": "str", "TEXT": "str", "STRING": "str",
            "INTEGER": "int", "INT": "int", "BIGINT": "int",
            "FLOAT": "float", "DECIMAL": "float", "NUMERIC": "float",
            "BOOLEAN": "bool", "BOOL": "bool",
            "DATE": "date", "DATETIME": "datetime", "TIMESTAMP": "datetime",
            "UUID": "str", "JSON": "dict", "JSONB": "dict",
            "ARRAY": "list",
        }
        return mapping.get(sql_type.upper(), "str")

    def _gen_docker_compose(self, project_name: str) -> str:
        slug = project_name.lower().replace(" ", "-")
        return f"""version: "3.9"
services:
  api:
    build: .
    image: {slug}:latest
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://app:secret@db:5432/{slug}
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: {slug}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
"""
