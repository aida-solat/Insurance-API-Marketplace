from fastapi.testclient import TestClient
from insurance import app, policies_db, claims_db

client = TestClient(app)


def test_create_policy():
    response = client.post(
        "/policy/",
        json={
            "customer_name": "John Doe",
            "policy_type": "Health",
            "premium": 100.0,
            "start_date": "2023-01-01T00:00:00",
            "end_date": "2024-01-01T00:00:00",
        },
    )
    assert response.status_code == 200
    assert response.json()["customer_name"] == "John Doe"


def test_get_policy():
    policy_id = policies_db[0].id
    response = client.get(f"/policy/{policy_id}")
    assert response.status_code == 200
    assert response.json()["id"] == policy_id


def test_file_claim():
    policy_id = policies_db[0].id
    response = client.post(
        "/claim/",
        json={
            "policy_id": policy_id,
            "claim_amount": 500.0,
            "status": "Pending",
            "filed_date": "2023-01-15T00:00:00",
        },
    )
    assert response.status_code == 200
    assert response.json()["policy_id"] == policy_id


def test_get_claim():
    claim_id = claims_db[0].id
    response = client.get(f"/claim/{claim_id}")
    assert response.status_code == 200
    assert response.json()["id"] == claim_id
