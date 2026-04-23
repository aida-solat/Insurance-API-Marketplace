from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


_BASE_RATE = {
    "health": 0.04,
    "auto": 0.06,
    "home": 0.03,
    "life": 0.02,
    "travel": 0.08,
}

_HIGH_RISK_TYPES = {"auto", "travel"}


@dataclass
class RiskAssessment:
    risk_score: float  # 0..100
    suggested_premium: float
    factors: list[str]


def assess_policy_risk(
    policy_type: str,
    age: int | None,
    risk_profile: str | None,
    start_date: datetime,
    end_date: datetime,
    requested_premium: float | None = None,
) -> RiskAssessment:
    factors: list[str] = []
    ptype = (policy_type or "").lower()

    duration_days = max((end_date - start_date).days, 1)
    duration_years = duration_days / 365.0

    base = _BASE_RATE.get(ptype, 0.05)
    score = 35.0
    factors.append(f"Base rate for '{ptype or 'unknown'}': {base:.3f}")

    if ptype in _HIGH_RISK_TYPES:
        score += 10
        factors.append(f"Policy type '{ptype}' classified as elevated risk (+10)")

    if age is not None:
        if age < 25:
            score += 12
            factors.append(f"Young applicant (age {age}) increases risk (+12)")
        elif age >= 65:
            score += 15
            factors.append(f"Senior applicant (age {age}) increases risk (+15)")
        else:
            score -= 5
            factors.append(f"Applicant in low-risk age band (age {age}) (-5)")

    profile = (risk_profile or "").lower()
    if profile == "high":
        score += 20
        factors.append("Declared risk profile: HIGH (+20)")
    elif profile == "low":
        score -= 15
        factors.append("Declared risk profile: LOW (-15)")
    elif profile == "medium":
        factors.append("Declared risk profile: MEDIUM (no adjustment)")

    if duration_years > 2:
        score += 5
        factors.append(f"Long coverage window ({duration_years:.1f}y) (+5)")

    score = max(0.0, min(100.0, score))

    risk_multiplier = 0.6 + (score / 100.0) * 1.4
    suggested = round(base * 1000 * duration_years * risk_multiplier, 2)

    if requested_premium is not None:
        ratio = requested_premium / suggested if suggested > 0 else 1
        if ratio < 0.7:
            factors.append(
                f"Requested premium ${requested_premium:.2f} is significantly below "
                f"suggested ${suggested:.2f} (ratio {ratio:.2f})"
            )
        elif ratio > 1.3:
            factors.append(
                f"Requested premium ${requested_premium:.2f} is above suggested "
                f"${suggested:.2f} (ratio {ratio:.2f})"
            )

    return RiskAssessment(
        risk_score=round(score, 2), suggested_premium=suggested, factors=factors
    )


@dataclass
class FraudAssessment:
    fraud_score: float  # 0..100
    factors: list[str]


def assess_claim_fraud(
    claim_amount: float,
    policy_premium: float,
    policy_start: datetime,
    policy_end: datetime,
    filed_date: datetime,
    evidence_count: int,
    description: str | None,
    incident_type: str | None,
) -> FraudAssessment:
    factors: list[str] = []
    score = 20.0

    if policy_premium > 0:
        leverage = claim_amount / policy_premium
        if leverage > 50:
            score += 35
            factors.append(
                f"Claim/premium leverage extremely high ({leverage:.1f}x) (+35)"
            )
        elif leverage > 20:
            score += 20
            factors.append(f"Claim/premium leverage high ({leverage:.1f}x) (+20)")
        elif leverage > 5:
            score += 8
            factors.append(f"Claim/premium leverage moderate ({leverage:.1f}x) (+8)")

    days_since_start = (filed_date - policy_start).days
    if days_since_start < 7:
        score += 25
        factors.append(
            f"Claim filed {days_since_start} day(s) after policy start (+25)"
        )
    elif days_since_start < 30:
        score += 10
        factors.append(
            f"Claim filed {days_since_start} day(s) after policy start (+10)"
        )

    if filed_date < policy_start or filed_date > policy_end:
        score += 30
        factors.append("Claim filed OUTSIDE policy coverage window (+30)")

    if evidence_count <= 0:
        score += 10
        factors.append("No evidence attached (+10)")
    elif evidence_count >= 3:
        score -= 8
        factors.append(f"Well-documented claim ({evidence_count} evidence items) (-8)")

    text = (description or "").lower()
    suspicious = [kw for kw in ("total loss", "stolen", "untraceable", "cash only") if kw in text]
    if suspicious:
        score += 10
        factors.append(f"Suspicious keywords in description: {suspicious} (+10)")

    if incident_type and incident_type.lower() in {"theft", "arson"}:
        score += 5
        factors.append(f"Higher-fraud incident type: '{incident_type}' (+5)")

    score = max(0.0, min(100.0, score))
    return FraudAssessment(fraud_score=round(score, 2), factors=factors)
