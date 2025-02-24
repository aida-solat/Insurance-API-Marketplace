from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI()

# Mock database
policies_db = []
claims_db = []


class Policy(BaseModel):
    id: str
    customer_name: str
    policy_type: str
    premium: float
    start_date: datetime
    end_date: datetime


class PolicyCreate(BaseModel):
    customer_name: str
    policy_type: str
    premium: float
    start_date: datetime
    end_date: datetime


class Claim(BaseModel):
    id: str
    policy_id: str
    claim_amount: float
    status: str  # Pending, Approved, Rejected
    filed_date: datetime


class ClaimCreate(BaseModel):
    policy_id: str
    claim_amount: float
    filed_date: datetime


@app.post("/policy/", response_model=Policy)
def create_policy(policy: PolicyCreate):
    """Creates a new insurance policy."""
    new_policy = Policy(id=str(uuid.uuid4()), **policy.dict())
    policies_db.append(new_policy)
    return new_policy


@app.get("/policy/{policy_id}", response_model=Optional[Policy])
def get_policy(policy_id: str):
    """Retrieves an insurance policy by ID."""
    for policy in policies_db:
        if policy.id == policy_id:
            return policy
    raise HTTPException(status_code=404, detail="Policy not found")


@app.post("/claim/", response_model=Claim)
def file_claim(claim: ClaimCreate):
    """Files an insurance claim."""
    new_claim = Claim(id=str(uuid.uuid4()), status="Pending", **claim.dict())
    claims_db.append(new_claim)
    return new_claim


@app.get("/claim/{claim_id}", response_model=Optional[Claim])
def get_claim(claim_id: str):
    """Retrieves an insurance claim by ID."""
    for claim in claims_db:
        if claim.id == claim_id:
            return claim
    raise HTTPException(status_code=404, detail="Claim not found")


@app.get("/docs")
def api_docs():
    """Returns API documentation links."""
    return {"docs": "/docs", "redoc": "/redoc"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
