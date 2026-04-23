from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from ..agents.claim_triage import run_claim_triage
from ..agents.underwriter import run_underwriter
from ..db import get_session
from ..models import Claim, Decision, Policy
from ..schemas import DecisionRead, UnderwriteRequest

router = APIRouter(tags=["decisions"])


@router.post("/decide/underwrite", response_model=DecisionRead)
def decide_underwrite(
    req: UnderwriteRequest, session: Session = Depends(get_session)
) -> Decision:
    result = run_underwriter(req)

    policy_id: str | None = None
    if result["decision"] != "REJECT":
        policy = Policy(
            customer_name=req.customer_name,
            policy_type=req.policy_type,
            premium=result["suggested_premium"] or (req.requested_premium or 0.0),
            start_date=req.start_date,
            end_date=req.end_date,
            age=req.age,
            risk_profile=req.risk_profile,
        )
        session.add(policy)
        session.flush()
        policy_id = policy.id

    decision = Decision(
        subject_type="policy",
        subject_id=policy_id,
        kind="underwrite",
        decision=result["decision"],
        confidence=result["confidence"],
        risk_score=result["risk_score"],
        suggested_premium=result["suggested_premium"],
        reasoning=result["reasoning"],
        input_payload=result["input_payload"],
        model=result["model"],
    )
    session.add(decision)
    session.commit()
    session.refresh(decision)
    return decision


@router.post("/decide/claim/{claim_id}", response_model=DecisionRead)
def decide_claim(
    claim_id: str, session: Session = Depends(get_session)
) -> Decision:
    claim = session.get(Claim, claim_id)
    if claim is None:
        raise HTTPException(status_code=404, detail="Claim not found")
    policy = session.get(Policy, claim.policy_id)
    if policy is None:
        raise HTTPException(status_code=404, detail="Parent policy not found")

    result = run_claim_triage(claim, policy)

    status_map = {
        "APPROVE": "Approved",
        "REJECT": "Rejected",
        "FLAG": "Flagged",
        "REVIEW": "Pending",
    }
    claim.status = status_map.get(result["decision"], "Pending")
    session.add(claim)

    decision = Decision(
        subject_type="claim",
        subject_id=claim.id,
        kind="claim_triage",
        decision=result["decision"],
        confidence=result["confidence"],
        risk_score=result["risk_score"],
        fraud_score=result["fraud_score"],
        reasoning=result["reasoning"],
        input_payload=result["input_payload"],
        model=result["model"],
    )
    session.add(decision)
    session.commit()
    session.refresh(decision)
    return decision


@router.get("/decisions", response_model=list[DecisionRead])
def list_decisions(
    subject_type: str | None = Query(default=None, pattern="^(policy|claim)$"),
    kind: str | None = Query(default=None),
    limit: int = Query(default=50, ge=1, le=500),
    session: Session = Depends(get_session),
) -> list[Decision]:
    stmt = select(Decision).order_by(Decision.created_at.desc()).limit(limit)
    if subject_type:
        stmt = stmt.where(Decision.subject_type == subject_type)
    if kind:
        stmt = stmt.where(Decision.kind == kind)
    return list(session.exec(stmt).all())


@router.get("/decisions/{decision_id}", response_model=DecisionRead)
def get_decision(decision_id: str, session: Session = Depends(get_session)) -> Decision:
    d = session.get(Decision, decision_id)
    if d is None:
        raise HTTPException(status_code=404, detail="Decision not found")
    return d
