from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


class PolicyCreate(BaseModel):
    customer_name: str
    policy_type: str
    premium: float
    start_date: datetime
    end_date: datetime
    age: int | None = None
    risk_profile: Literal["low", "medium", "high"] | None = None
    metadata_json: dict[str, Any] = Field(default_factory=dict)


class PolicyRead(PolicyCreate):
    id: str
    created_at: datetime


class ClaimCreate(BaseModel):
    policy_id: str
    claim_amount: float
    filed_date: datetime
    description: str | None = None
    incident_type: str | None = None
    evidence_count: int = 0


class ClaimRead(ClaimCreate):
    id: str
    status: str
    created_at: datetime


DecisionOutcome = Literal["APPROVE", "REJECT", "REVIEW", "FLAG"]


class UnderwriteRequest(BaseModel):
    customer_name: str
    policy_type: str
    requested_premium: float | None = None
    start_date: datetime
    end_date: datetime
    age: int | None = None
    risk_profile: Literal["low", "medium", "high"] | None = None
    notes: str | None = None


class DecisionRead(BaseModel):
    id: str
    subject_type: str
    subject_id: str | None
    kind: str
    decision: DecisionOutcome
    confidence: float
    risk_score: float
    fraud_score: float | None
    suggested_premium: float | None
    reasoning: list[str]
    model: str
    created_at: datetime


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    stream: bool = True
