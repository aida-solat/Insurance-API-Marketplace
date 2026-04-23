from __future__ import annotations

import json
from dataclasses import asdict

from ..rules.risk import assess_policy_risk
from ..schemas import UnderwriteRequest
from .llm import LLMProvider, get_provider
from .prompts import UNDERWRITER_SYSTEM


def run_underwriter(
    req: UnderwriteRequest, provider: LLMProvider | None = None
) -> dict:
    provider = provider or get_provider()

    risk = assess_policy_risk(
        policy_type=req.policy_type,
        age=req.age,
        risk_profile=req.risk_profile,
        start_date=req.start_date,
        end_date=req.end_date,
        requested_premium=req.requested_premium,
    )

    user_payload = {
        "application": req.model_dump(mode="json"),
        "risk_assessment": asdict(risk),
    }
    user_msg = json.dumps(user_payload, default=str, indent=2)

    try:
        raw = provider.complete_json(UNDERWRITER_SYSTEM, user_msg)
    except Exception as exc:
        from .llm import HeuristicProvider

        raw = HeuristicProvider().complete_json(UNDERWRITER_SYSTEM, user_msg)
        raw.setdefault("reasoning", []).append(
            f"(LLM provider '{provider.name}' failed: {type(exc).__name__}; used heuristic fallback)"
        )

    decision = (raw.get("decision") or "REVIEW").upper()
    if decision not in {"APPROVE", "REJECT", "REVIEW"}:
        decision = "REVIEW"

    suggested = raw.get("suggested_premium")
    try:
        suggested = float(suggested) if suggested is not None else risk.suggested_premium
    except (TypeError, ValueError):
        suggested = risk.suggested_premium

    return {
        "decision": decision,
        "confidence": _clamp(raw.get("confidence", 0.5)),
        "risk_score": risk.risk_score,
        "suggested_premium": round(suggested, 2),
        "reasoning": list(raw.get("reasoning") or risk.factors),
        "model": provider.name,
        "input_payload": user_payload,
    }


def _clamp(value) -> float:
    try:
        v = float(value)
    except (TypeError, ValueError):
        return 0.5
    return max(0.0, min(1.0, v))
