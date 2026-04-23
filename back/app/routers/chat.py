from __future__ import annotations

import json
from collections.abc import Iterator

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select

from ..agents.llm import format_messages, get_provider
from ..agents.prompts import CHAT_SYSTEM
from ..db import get_session
from ..models import Claim, Decision, Policy
from ..schemas import ChatRequest

router = APIRouter(prefix="/chat", tags=["chat"])


def _build_context(session: Session) -> str:
    policies = session.exec(select(Policy).order_by(Policy.created_at.desc()).limit(5)).all()
    claims = session.exec(select(Claim).order_by(Claim.created_at.desc()).limit(5)).all()
    decisions = session.exec(
        select(Decision).order_by(Decision.created_at.desc()).limit(5)
    ).all()
    summary = {
        "recent_policies": [
            {"id": p.id, "type": p.policy_type, "premium": p.premium} for p in policies
        ],
        "recent_claims": [
            {"id": c.id, "policy_id": c.policy_id, "amount": c.claim_amount, "status": c.status}
            for c in claims
        ],
        "recent_decisions": [
            {"id": d.id, "kind": d.kind, "decision": d.decision, "model": d.model}
            for d in decisions
        ],
    }
    return "Platform context:\n" + json.dumps(summary, indent=2)


@router.post("")
def chat(req: ChatRequest, session: Session = Depends(get_session)) -> StreamingResponse:
    provider = get_provider()
    context = _build_context(session)
    system = CHAT_SYSTEM + "\n\n" + context
    messages = format_messages(system, (m.model_dump() for m in req.messages))

    def event_stream() -> Iterator[bytes]:
        try:
            for token in provider.stream_chat(messages):
                yield f"data: {json.dumps(token)}\n\n".encode()
        except Exception as exc:
            err = f"[error from provider '{provider.name}': {type(exc).__name__}]"
            yield f"data: {json.dumps(err)}\n\n".encode()
        yield b"data: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
