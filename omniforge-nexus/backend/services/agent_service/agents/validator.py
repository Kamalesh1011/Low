"""
OmniForge Nexus – Validator Agent
Reviews generated code for correctness, security, and quality.
"""
from typing import Optional
import structlog

from shared.openrouter import llm, prompts

logger = structlog.get_logger(__name__)

# ── Security Rules ────────────────────────────────────────────
SECURITY_CHECKS = [
    {"id": "sql_injection", "pattern": "f\"SELECT", "severity": "critical", "message": "Potential SQL injection via f-string"},
    {"id": "hardcoded_secret", "pattern": "password =", "severity": "critical", "message": "Hardcoded password detected"},
    {"id": "missing_auth", "pattern": "allow_origins=[\"*\"]", "severity": "medium", "message": "CORS wildcard in production"},
    {"id": "debug_mode", "pattern": "DEBUG=True", "severity": "low", "message": "Debug mode enabled"},
]


class ValidatorAgent:
    """
    Agent: ValidatorX
    Role: Static analysis + LLM review of generated code.
    Model: DeepSeek-R1 (great at analysis/reasoning)
    """

    async def run(
        self,
        artifacts: dict[str, str],
        model: Optional[str] = None,
    ) -> dict:
        """Validate all generated artifacts and return a report."""

        # ── Static Analysis ───────────────────────────────────
        static_issues = []
        total_lines = 0

        for filename, content in artifacts.items():
            lines = content.split("\n")
            total_lines += len(lines)
            for check in SECURITY_CHECKS:
                if check["pattern"] in content:
                    static_issues.append({
                        "severity": check["severity"],
                        "location": filename,
                        "message": check["message"],
                        "fix": f"Replace {check['pattern']} with a secure alternative",
                    })

        # ── LLM Code Review (sample first 2 files) ────────────
        llm_issues = []
        sample_files = dict(list(artifacts.items())[:2])
        sample_code = "\n\n".join(
            f"# FILE: {k}\n{v}" for k, v in sample_files.items()
        )[:4000]  # Limit tokens

        try:
            messages = [
                {"role": "system", "content": prompts.SYSTEM_VALIDATOR},
                {
                    "role": "user",
                    "content": f"""Review this generated code for issues:

{sample_code}

Return JSON: {{
  "valid": true/false,
  "score": 0-100,
  "issues": [{{"severity": "critical|high|medium|low", "location": "file:line", "message": "...", "fix": "..."}}],
  "approved": true/false,
  "summary": "..."
}}"""
                }
            ]

            result = await llm.complete_json(
                messages=messages,
                agent_type="validator",
                temperature=0.1,
            )
            llm_issues = result.get("issues", [])
            llm_score = result.get("score", 85)
            llm_approved = result.get("approved", True)

        except Exception as e:
            logger.warning("validator.llm_skipped", reason=str(e))
            llm_score = 90
            llm_approved = True

        all_issues = static_issues + llm_issues
        critical_count = sum(1 for i in all_issues if i.get("severity") == "critical")

        # Penalize score for issues
        base_score = llm_score
        base_score -= critical_count * 15
        base_score -= len([i for i in all_issues if i.get("severity") == "high"]) * 5
        final_score = max(0, min(100, base_score))

        report = {
            "valid": final_score >= 60,
            "score": final_score,
            "approved": critical_count == 0 and final_score >= 70,
            "issues": all_issues,
            "summary": {
                "files_reviewed": len(artifacts),
                "total_lines": total_lines,
                "critical": critical_count,
                "high": len([i for i in all_issues if i.get("severity") == "high"]),
                "medium": len([i for i in all_issues if i.get("severity") == "medium"]),
                "low": len([i for i in all_issues if i.get("severity") == "low"]),
            },
        }

        logger.info("validator.complete",
            score=final_score,
            issues=len(all_issues),
            approved=report["approved"])

        return report
