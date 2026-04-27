from __future__ import annotations


def test_create_and_get_policy(client):
    resp = client.post(
        "/policy/",
        json={
            "customer_name": "John Doe",
            "policy_type": "Health",
            "premium": 100.0,
            "start_date": "2023-01-01T00:00:00",
            "end_date": "2024-01-01T00:00:00",
        },
    )
    assert resp.status_code == 200, resp.text
    created = resp.json()
    assert created["customer_name"] == "John Doe"
    assert created["id"]

    got = client.get(f"/policy/{created['id']}")
    assert got.status_code == 200
    assert got.json()["id"] == created["id"]


def test_get_missing_policy_returns_404(client):
    resp = client.get("/policy/does-not-exist")
    assert resp.status_code == 404


def test_file_and_get_claim(client):
    policy = client.post(
        "/policy/",
        json={
            "customer_name": "Jane",
            "policy_type": "Auto",
            "premium": 300.0,
            "start_date": "2023-01-01T00:00:00",
            "end_date": "2024-01-01T00:00:00",
        },
    ).json()

    resp = client.post(
        "/claim/",
        json={
            "policy_id": policy["id"],
            "claim_amount": 500.0,
            "filed_date": "2023-06-01T00:00:00",
        },
    )
    assert resp.status_code == 200, resp.text
    claim = resp.json()
    assert claim["policy_id"] == policy["id"]
    assert claim["status"] == "Pending"

    got = client.get(f"/claim/{claim['id']}")
    assert got.status_code == 200
    assert got.json()["id"] == claim["id"]


def test_claim_requires_existing_policy(client):
    resp = client.post(
        "/claim/",
        json={
            "policy_id": "bogus",
            "claim_amount": 100.0,
            "filed_date": "2023-06-01T00:00:00",
        },
    )
    assert resp.status_code == 404
