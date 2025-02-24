# Insurance API Marketplace

This is a FastAPI-based Insurance API Marketplace that allows users to create and retrieve insurance policies and claims.

## Features
- Create and retrieve **Insurance Policies**
- File and track **Insurance Claims**
- RESTful API with JSON-based request/response
- Interactive API documentation via FastAPI's built-in docs

## Installation

### Prerequisites
- Python 3.8+
- pip

### Steps
```bash
# Clone the repository
git clone https://github.com/aida-solat/insurance-api-marketplace.git
cd insurance-api-marketplace

# Install dependencies
pip install -r requirements.txt

# Run the API server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

### Policies
#### Create Policy
```
POST /policy/
```
**Request Body:**
```json
{
  "customer_name": "John Doe",
  "policy_type": "Health",
  "premium": 250.0,
  "start_date": "2024-02-24T00:00:00",
  "end_date": "2025-02-24T00:00:00"
}
```
**Response:**
```json
{
  "id": "uuid-generated",
  "customer_name": "John Doe",
  "policy_type": "Health",
  "premium": 250.0,
  "start_date": "2024-02-24T00:00:00",
  "end_date": "2025-02-24T00:00:00"
}
```

#### Get Policy by ID
```
GET /policy/{policy_id}
```
**Response:**
```json
{
  "id": "uuid-generated",
  "customer_name": "John Doe",
  "policy_type": "Health",
  "premium": 250.0,
  "start_date": "2024-02-24T00:00:00",
  "end_date": "2025-02-24T00:00:00"
}
```

### Claims
#### File a Claim
```
POST /claim/
```
**Request Body:**
```json
{
  "policy_id": "uuid-generated",
  "claim_amount": 500.0,
  "filed_date": "2024-02-24T00:00:00"
}
```
**Response:**
```json
{
  "id": "uuid-generated",
  "policy_id": "uuid-generated",
  "claim_amount": 500.0,
  "status": "Pending",
  "filed_date": "2024-02-24T00:00:00"
}
```

#### Get Claim by ID
```
GET /claim/{claim_id}
```
**Response:**
```json
{
  "id": "uuid-generated",
  "policy_id": "uuid-generated",
  "claim_amount": 500.0,
  "status": "Pending",
  "filed_date": "2024-02-24T00:00:00"
}
```

## API Documentation
Access interactive API documentation at:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## License
MIT License
