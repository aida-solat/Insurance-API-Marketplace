from __future__ import annotations

import json
from dataclasses import asdict

from ..models import Claim, Policy
from ..rules.risk import assess_claim_fraud
from .llm import LLMProvider, get_provider
from .prompts import CLAIM_TRIAGE_SYSTEM


def run_claim_triage(
    claim: Claim, policy: Policy, provider: LLMProvider | None = None
) -> dict:
    provider = provider or get_provider()

    fraud = assess_claim_fraud(
        claim_amount=claim.claim_amount,
        policy_premium=policy.premium,
        policy_start=policy.start_date,
        policy_end=policy.end_date,
        filed_date=claim.filed_date,
        evidence_count=claim.evidence_count,
        description=claim.description,
        incident_type=claim.incident_type,
    )

    user_payload = {
        "claim": {
            "id": claim.id,
            "policy_id": claim.policy_id,
            "claim_amount": claim.claim_amount,
            "filed_date": claim.filed_date.isoformat(),
            "description": claim.description,
            "incident_type": claim.incident_type,
            "evidence_count": claim.evidence_count,
        },
        "policy": {
            "id": policy.id,
            "customer_name": policy.customer_name,
            "policy_type": policy.policy_type,
            "premium": policy.premium,
            "start_date": policy.start_date.isoformat(),
            "end_date": policy.end_date.isoformat(),
        },
        "fraud_assessment": asdict(fraud),
    }
    user_msg = json.dumps(user_payload, default=str, indent=2)

    try:
        raw = provider.complete_json(CLAIM_TRIAGE_SYSTEM, user_msg)
    except Exception as exc:
        from .llm import HeuristicProvider

        raw = HeuristicProvider().complete_json(CLAIM_TRIAGE_SYSTEM, user_msg)
        raw.setdefault("reasoning", []).append(
            f"(LLM provider '{provider.name}' failed: {type(exc).__name__}; used heuristic fallback)"
        )

    decision = (raw.get("decision") or "REVIEW").upper()
    if decision not in {"APPROVE", "REJECT", "FLAG", "REVIEW"}:
        decision = "REVIEW"

    return {
        "decision": decision,
        "confidence": _clamp(raw.get("confidence", 0.5)),
        "fraud_score": fraud.fraud_score,
        "risk_score": fraud.fraud_score,
        "reasoning": list(raw.get("reasoning") or fraud.factors),
        "model": provider.name,
        "input_payload": user_payload,
    }


def _clamp(value) -> float:
    try:
        v = float(value)
    except (TypeError, ValueError):
        return 0.5
    return max(0.0, min(1.0, v))
