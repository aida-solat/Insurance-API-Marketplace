"""Tests for the AI decision endpoints (heuristic provider, fully offline)."""
from __future__ import annotations


def test_underwrite_low_risk_approves(client):
    resp = client.post(
        "/decide/underwrite",
        json={
            "customer_name": "Alice",
            "policy_type": "home",
            "start_date": "2024-01-01T00:00:00",
            "end_date": "2025-01-01T00:00:00",
            "age": 40,
            "risk_profile": "low",
        },
    )
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["decision"] == "APPROVE"
    assert data["risk_score"] < 55
    assert data["suggested_premium"] > 0
    assert data["model"] == "heuristic"
    assert len(data["reasoning"]) >= 1


def test_underwrite_high_risk_rejects_or_reviews(client):
    resp = client.post(
        "/decide/underwrite",
        json={
            "customer_name": "Bob",
            "policy_type": "auto",
            "start_date": "2024-01-01T00:00:00",
            "end_date": "2027-01-01T00:00:00",
            "age": 19,
            "risk_profile": "high",
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["decision"] in {"REJECT", "REVIEW"}
    assert data["risk_score"] >= 55


def test_claim_triage_flags_high_leverage(client):
    policy = client.post(
        "/policy/",
        json={
            "customer_name": "Carol",
            "policy_type": "auto",
            "premium": 50.0,
            "start_date": "2024-01-01T00:00:00",
            "end_date": "2025-01-01T00:00:00",
        },
    ).json()
    claim = client.post(
        "/claim/",
        json={
            "policy_id": policy["id"],
            "claim_amount": 50000.0,
            "filed_date": "2024-01-03T00:00:00",
            "evidence_count": 0,
            "description": "total loss, cash only please",
        },
    ).json()

    resp = client.post(f"/decide/claim/{claim['id']}")
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["decision"] in {"FLAG", "REJECT"}
    assert data["fraud_score"] >= 70

    # Claim status is mirrored from the decision.
    got = client.get(f"/claim/{claim['id']}").json()
    assert got["status"] in {"Flagged", "Rejected"}


def test_claim_triage_rejects_out_of_window(client):
    policy = client.post(
        "/policy/",
        json={
            "customer_name": "Dan",
            "policy_type": "home",
            "premium": 500.0,
            "start_date": "2024-01-01T00:00:00",
            "end_date": "2024-06-01T00:00:00",
        },
    ).json()
    claim = client.post(
        "/claim/",
        json={
            "policy_id": policy["id"],
            "claim_amount": 1000.0,
            "filed_date": "2024-08-01T00:00:00",  # after end_date
            "evidence_count": 3,
        },
    ).json()
    resp = client.post(f"/decide/claim/{claim['id']}")
    assert resp.status_code == 200
    assert resp.json()["decision"] == "REJECT"


def test_audit_log_lists_decisions(client):
    client.post(
        "/decide/underwrite",
        json={
            "customer_name": "Eve",
            "policy_type": "travel",
            "start_date": "2024-01-01T00:00:00",
            "end_date": "2024-02-01T00:00:00",
            "age": 30,
        },
    )
    resp = client.get("/decisions")
    assert resp.status_code == 200
    body = resp.json()
    assert len(body) >= 1
    assert body[0]["kind"] == "underwrite"
    assert body[0]["model"] == "heuristic"


def test_root_and_health(client):
    assert client.get("/").json()["llm_provider"] == "heuristic"
    assert client.get("/health").json()["status"] == "ok"


def test_chat_streams_tokens(client):
    with client.stream(
        "POST",
        "/chat",
        json={"messages": [{"role": "user", "content": "hello"}]},
    ) as r:
        assert r.status_code == 200
        body = b"".join(r.iter_bytes())
    text = body.decode()
    assert "data: " in text
    assert "[DONE]" in text
