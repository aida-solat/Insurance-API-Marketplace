from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Policy
from ..schemas import PolicyCreate, PolicyRead

router = APIRouter(prefix="/policy", tags=["policies"])


@router.post("/", response_model=PolicyRead)
def create_policy(payload: PolicyCreate, session: Session = Depends(get_session)) -> Policy:
    policy = Policy(**payload.model_dump())
    session.add(policy)
    session.commit()
    session.refresh(policy)
    return policy


@router.get("/", response_model=list[PolicyRead])
def list_policies(session: Session = Depends(get_session)) -> list[Policy]:
    return list(session.exec(select(Policy).order_by(Policy.created_at.desc())).all())


@router.get("/{policy_id}", response_model=PolicyRead)
def get_policy(policy_id: str, session: Session = Depends(get_session)) -> Policy:
    policy = session.get(Policy, policy_id)
    if policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy
