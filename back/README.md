# Aegis — Backend

FastAPI service for insurance decisions. CRUD for policies and claims, an
auditable AI decision engine for underwriting and claim triage, and a
Server-Sent Events chat endpoint.

## Run

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env     # optional: set an LLM key
.venv/bin/uvicorn app.main:app --reload --port 8005
```

Open http://localhost:8005/docs for Swagger.

## Providers

`.env` → set one of:

| Variable            | Default model             |
| ------------------- | ------------------------- |
| `OPENAI_API_KEY`    | `gpt-4o-mini`             |
| `ANTHROPIC_API_KEY` | `claude-3-5-haiku-latest` |
| `OLLAMA_BASE_URL`   | `llama3.2`                |

With none set the service uses a deterministic heuristic provider so the
full API surface still works offline.

## Endpoints

```
POST /policy/                 Create policy
GET  /policy/                 List / get policies
GET  /claim/                  List / get claims
POST /claim/                  File a claim
POST /decide/underwrite       Score application + recommend premium
POST /decide/claim/{id}       Triage a filed claim for fraud/approval
GET  /decisions               Audit log (filter by subject_type, kind)
GET  /decisions/{id}          Single decision record
POST /chat                    SSE stream of the copilot
GET  /health                  Status + active provider
```

### Example

```bash
curl -X POST http://localhost:8005/decide/underwrite \
  -H 'Content-Type: application/json' \
  -d '{
    "customer_name": "Alice",
    "policy_type": "auto",
    "start_date": "2024-01-01T00:00:00",
    "end_date":   "2025-01-01T00:00:00",
    "age": 19,
    "risk_profile": "high"
  }'
```

## Layout

```
app/
  main.py          FastAPI wiring
  config.py        env-driven settings + provider resolver
  db.py            SQLModel engine
  models.py        Policy / Claim / Decision
  schemas.py       request & response DTOs
  routers/         policies · claims · decisions · chat
  agents/          LLM abstraction + underwriter + claim_triage
  rules/           risk & fraud heuristics
tests/
Dockerfile
```

## Tests

```bash
PYTHONPATH=. .venv/bin/pytest -q
```

## License

MIT.

---

Built with [Deciwa](https://deciwa.com).
