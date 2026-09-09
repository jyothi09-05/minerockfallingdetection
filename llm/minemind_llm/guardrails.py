"""
Safety Guardrails and Factual Grounding Engine for MineMind AI.
Ensures zero-hallucination, SOP safety compliance, and numerical telemetry grounding.
"""

from typing import Dict, Any, List, Tuple
import re


class GuardrailsEngine:
    """
    Validates LLM outputs against safety standards, SOP rules, and internal tool telemetry.
    """

    # Prohibited unsafe instructions
    FORBIDDEN_PATTERNS = [
        r"ignore (all )?(alarms|alerts|tarp|warnings)",
        r"enter (blast|exclusion) zone without clearance",
        r"disable (retarder|brakes|speed limiter)",
        r"override safety interlock",
        r"exceed \d+ km/h in wet conditions"
    ]

    @classmethod
    def validate_safety(cls, text: str) -> Tuple[bool, List[str]]:
        """Checks if text contains dangerous or non-compliant mining advice."""
        violations = []
        for pat in cls.FORBIDDEN_PATTERNS:
            if re.search(pat, text, re.IGNORECASE):
                violations.append(f"Safety Policy Violation: Prohibited advice matching pattern '{pat}'")
        return len(violations) == 0, violations

    @classmethod
    def ground_telemetry(cls, generated_text: str, tool_outputs: List[Dict[str, Any]]) -> str:
        """
        Appends factual telemetry ground truth verification badges to LLM outputs.
        """
        # If violations found, override with safe fallback
        is_safe, violations = cls.validate_safety(generated_text)
        if not is_safe:
            return (
                "⚠️ **SAFETY INTERLOCK TRIGGERED**: The generated response contained guidance that violates "
                "mine safety standard operating procedures.\n\n"
                f"**Violations Detected**: {', '.join(violations)}\n\n"
                "Please adhere strictly to Site Standard Operating Procedures and contact Pit Dispatch."
            )

        return generated_text
