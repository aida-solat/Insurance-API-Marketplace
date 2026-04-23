from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import JSON, Column
from sqlmodel import Field, SQLModel


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc)


class Policy(SQLModel, table=True):
    id: str = Field(default_factory=_uuid, primary_key=True)
    customer_name: str
    policy_type: str
    premium: float
    start_date: datetime
    end_date: datetime
    age: int | None = None
    risk_profile: str | None = None
    metadata_json: dict[str, Any] = Field(
        default_factory=dict, sa_column=Column("metadata_json", JSON)
    )
    created_at: datetime = Field(default_factory=_now)


class Claim(SQLModel, table=True):
    id: str = Field(default_factory=_uuid, primary_key=True)
    policy_id: str = Field(foreign_key="policy.id", index=True)
    claim_amount: float
    status: str = "Pending"
    filed_date: datetime
    description: str | None = None
    incident_type: str | None = None
    evidence_count: int = 0
    created_at: datetime = Field(default_factory=_now)


class Decision(SQLModel, table=True):
    id: str = Field(default_factory=_uuid, primary_key=True)
    subject_type: str = Field(index=True)
    subject_id: str | None = Field(default=None, index=True)
    kind: str = Field(index=True)
    decision: str
    confidence: float = 0.0
    risk_score: float = 0.0
    fraud_score: float | None = None
    suggested_premium: float | None = None
    reasoning: list[str] = Field(
        default_factory=list, sa_column=Column("reasoning", JSON)
    )
    input_payload: dict[str, Any] = Field(
        default_factory=dict, sa_column=Column("input_payload", JSON)
    )
    model: str = "heuristic"
    created_at: datetime = Field(default_factory=_now, index=True)
