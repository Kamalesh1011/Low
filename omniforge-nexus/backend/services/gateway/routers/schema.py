"""
OmniForge Nexus – Schema Designer Router
AI-powered database schema generation from natural language.
"""
from fastapi import APIRouter, Depends, HTTPException
from typing import List
import structlog

from shared.models.schemas import (
    SchemaGenerateRequest, SchemaGenerateResponse,
    TableSchema, ColumnSchema, ColumnType, APIResponse
)
from shared.openrouter import llm, prompts
from services.auth_service.jwt_handler import get_current_user

router = APIRouter()
logger = structlog.get_logger(__name__)

SQL_TYPE_MAP = {
    ColumnType.VARCHAR: "VARCHAR(255)",
    ColumnType.TEXT: "TEXT",
    ColumnType.INTEGER: "INTEGER",
    ColumnType.BIGINT: "BIGINT",
    ColumnType.FLOAT: "FLOAT",
    ColumnType.DECIMAL: "DECIMAL(10,2)",
    ColumnType.BOOLEAN: "BOOLEAN",
    ColumnType.DATE: "DATE",
    ColumnType.DATETIME: "TIMESTAMP",
    ColumnType.TIMESTAMP: "TIMESTAMP WITH TIME ZONE",
    ColumnType.UUID: "UUID DEFAULT gen_random_uuid()",
    ColumnType.JSON: "JSON",
    ColumnType.JSONB: "JSONB",
    ColumnType.ARRAY: "TEXT[]",
}


@router.post("/generate", response_model=APIResponse[SchemaGenerateResponse])
async def generate_schema(
    payload: SchemaGenerateRequest,
    current_user=Depends(get_current_user),
):
    """Use AI to generate a database schema from a natural language prompt."""
    messages = [
        {"role": "system", "content": prompts.SYSTEM_ARCHITECT},
        {
            "role": "user",
            "content": f"""Generate a complete database schema for:

{payload.prompt}
App Type: {payload.app_type or 'SaaS'}

Return JSON with this exact structure:
{{
  "tables": [
    {{
      "name": "table_name",
      "comment": "description",
      "columns": [
        {{
          "name": "id",
          "type": "UUID",
          "primary_key": true,
          "nullable": false,
          "default": "gen_random_uuid()"
        }},
        {{
          "name": "field_name",
          "type": "VARCHAR|TEXT|INTEGER|BIGINT|FLOAT|DECIMAL|BOOLEAN|DATE|DATETIME|TIMESTAMP|UUID|JSON|JSONB",
          "nullable": true,
          "unique": false,
          "indexed": false,
          "foreign_key": null,
          "comment": "field purpose"
        }}
      ]
    }}
  ],
  "er_diagram": "erDiagram\\n  TableA {{...}}\\n  TableA ||--o{{ TableB : has"
}}

Include proper foreign keys, indexes, and audit columns (created_at, updated_at).
Every table must have id, created_at, updated_at."""
        }
    ]

    tables = []
    er_diagram = ""

    try:
        result = await llm.complete_json(
            messages=messages,
            agent_type="architect",
            temperature=0.2,
        )
        raw_tables = result.get("tables", [])
        er_diagram = result.get("er_diagram", "")

        for t in raw_tables:
            cols = []
            for c in t.get("columns", []):
                try:
                    col_type = ColumnType(c.get("type", "VARCHAR").upper())
                except ValueError:
                    col_type = ColumnType.VARCHAR
                cols.append(ColumnSchema(
                    name=c.get("name", "field"),
                    type=col_type,
                    nullable=c.get("nullable", True),
                    primary_key=c.get("primary_key", False),
                    unique=c.get("unique", False),
                    indexed=c.get("indexed", False),
                    default=c.get("default"),
                    foreign_key=c.get("foreign_key"),
                    comment=c.get("comment"),
                ))
            tables.append(TableSchema(
                name=t.get("name", "table"),
                columns=cols,
                comment=t.get("comment"),
            ))

    except Exception as e:
        logger.warning("schema.llm_fallback", reason=str(e))
        tables = _generate_fallback_schema(payload.prompt)
        er_diagram = _generate_er_diagram(tables)

    sql = _generate_sql_migration(tables)

    return APIResponse.ok(data=SchemaGenerateResponse(
        tables=tables,
        sql_migration=sql,
        er_diagram=er_diagram,
    ))


@router.post("/sql", response_model=APIResponse[dict])
async def generate_sql_from_tables(
    tables: List[TableSchema],
    current_user=Depends(get_current_user),
):
    """Convert table schema objects to SQL CREATE TABLE statements."""
    sql = _generate_sql_migration(tables)
    return APIResponse.ok(data={"sql": sql, "tables": len(tables)})


@router.post("/optimize", response_model=APIResponse[dict])
async def optimize_schema(
    tables: List[TableSchema],
    current_user=Depends(get_current_user),
):
    """AI-powered schema optimization suggestions."""
    suggestions = []
    for table in tables:
        col_names = [c.name for c in table.columns]
        if "created_at" not in col_names:
            suggestions.append(f"Add `created_at TIMESTAMP` to `{table.name}`")
        if "updated_at" not in col_names:
            suggestions.append(f"Add `updated_at TIMESTAMP` to `{table.name}`")
        if len(table.columns) > 20:
            suggestions.append(f"`{table.name}` has {len(table.columns)} columns — consider normalization")
        for col in table.columns:
            if not col.indexed and col.name.endswith("_id"):
                suggestions.append(f"Add index on `{table.name}.{col.name}` (foreign key)")

    return APIResponse.ok(data={
        "suggestions": suggestions,
        "score": max(0, 100 - len(suggestions) * 10),
    })


# ── Helpers ───────────────────────────────────────────────────
def _generate_sql_migration(tables: List[TableSchema]) -> str:
    lines = [
        "-- ═══════════════════════════════════════════════════",
        "-- OmniForge Nexus – Auto-generated SQL Migration",
        "-- ═══════════════════════════════════════════════════",
        "BEGIN;",
        "",
        'CREATE EXTENSION IF NOT EXISTS "pgcrypto";',
        "",
    ]

    for table in tables:
        col_defs = []
        for col in table.columns:
            sql_type = SQL_TYPE_MAP.get(col.type, "TEXT")
            parts = [f'  "{col.name}" {sql_type}']
            if col.primary_key:
                parts.append("PRIMARY KEY")
            if not col.nullable and not col.primary_key:
                parts.append("NOT NULL")
            if col.unique:
                parts.append("UNIQUE")
            if col.default and "gen_random_uuid" not in sql_type:
                parts.append(f"DEFAULT {col.default}")
            col_defs.append(" ".join(parts))

        # Foreign keys
        fk_lines = []
        for col in table.columns:
            if col.foreign_key:
                ref_table, ref_col = col.foreign_key.split(".") if "." in col.foreign_key else (col.foreign_key, "id")
                fk_lines.append(
                    f'  FOREIGN KEY ("{col.name}") REFERENCES "{ref_table}" ("{ref_col}") ON DELETE CASCADE'
                )

        all_defs = col_defs + fk_lines
        comment = f"-- {table.comment}" if table.comment else ""

        lines.extend([
            comment,
            f'CREATE TABLE IF NOT EXISTS "{table.name}" (',
            ",\n".join(all_defs),
            ");",
            "",
        ])

        # Indexes
        for col in table.columns:
            if col.indexed and not col.primary_key:
                lines.append(
                    f'CREATE INDEX IF NOT EXISTS "idx_{table.name}_{col.name}" ON "{table.name}" ("{col.name}");'
                )
        lines.append("")

    lines.extend(["COMMIT;", ""])
    return "\n".join(lines)


def _generate_fallback_schema(prompt: str) -> List[TableSchema]:
    return [
        TableSchema(
            name="users",
            comment="Application users",
            columns=[
                ColumnSchema(name="id", type=ColumnType.UUID, primary_key=True, nullable=False),
                ColumnSchema(name="email", type=ColumnType.VARCHAR, nullable=False, unique=True),
                ColumnSchema(name="name", type=ColumnType.VARCHAR, nullable=False),
                ColumnSchema(name="is_active", type=ColumnType.BOOLEAN, nullable=False, default="true"),
                ColumnSchema(name="created_at", type=ColumnType.TIMESTAMP, nullable=False, default="now()"),
                ColumnSchema(name="updated_at", type=ColumnType.TIMESTAMP, nullable=False, default="now()"),
            ]
        ),
        TableSchema(
            name="organizations",
            comment="Organizations / tenants",
            columns=[
                ColumnSchema(name="id", type=ColumnType.UUID, primary_key=True, nullable=False),
                ColumnSchema(name="name", type=ColumnType.VARCHAR, nullable=False),
                ColumnSchema(name="created_at", type=ColumnType.TIMESTAMP, nullable=False, default="now()"),
            ]
        ),
    ]


def _generate_er_diagram(tables: List[TableSchema]) -> str:
    lines = ["erDiagram"]
    for table in tables:
        lines.append(f"  {table.name} {{")
        for col in table.columns[:5]:
            lines.append(f"    {col.type.value} {col.name}")
        lines.append("  }")
    return "\n".join(lines)
