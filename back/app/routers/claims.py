from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Claim, Policy
from ..schemas import ClaimCreate, ClaimRead

router = APIRouter(prefix="/claim", tags=["claims"])


@router.post("/", response_model=ClaimRead)
def file_claim(payload: ClaimCreate, session: Session = Depends(get_session)) -> Claim:
    if session.get(Policy, payload.policy_id) is None:
        raise HTTPException(status_code=404, detail="Policy not found for claim")
    claim = Claim(**payload.model_dump(), status="Pending")
    session.add(claim)
    session.commit()
    session.refresh(claim)
    return claim


@router.get("/", response_model=list[ClaimRead])
def list_claims(session: Session = Depends(get_session)) -> list[Claim]:
    return list(session.exec(select(Claim).order_by(Claim.created_at.desc())).all())


@router.get("/{claim_id}", response_model=ClaimRead)
def get_claim(claim_id: str, session: Session = Depends(get_session)) -> Claim:
    claim = session.get(Claim, claim_id)
    if claim is None:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim
