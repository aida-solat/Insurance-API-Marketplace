# Aegis · Backend

FastAPI service. CRUD for policies and claims, an auditable AI decision
engine for underwriting and claim triage, and a Server-Sent Events chat
endpoint. Runs fully offline on a deterministic heuristic provider; drop in
OpenAI, Anthropic, or Ollama to upgrade the reasoning layer.

## Philosophy

Rules decide. The LLM narrates.

- **`app/rules/`** computes a numeric score and an ordered list of factors.
  Deterministic, side-effect free, unit-tested.
- **`app/agents/`** hands that structured block to an LLM as grounded
  context. The model picks an outcome and summarises the rationale — nothing
  more.
- **`app/models.py::Decision`** is append-only. Every call to
  `/decide/underwrite` or `/decide/claim/{id}` writes input, factors, model,
  confidence, and rationale. `GET /decisions` is your audit log.

Swap providers, compare models, or disable the LLM entirely — the decision
surface still works.

## Run

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env           # optional — zero-config works too
.venv/bin/uvicorn app.main:app --reload --port 8005
```

Swagger UI: http://localhost:8005/docs

## Providers

Set one of these in `.env` and the resolver auto-selects it:

| Variable              | Default model                 |
| --------------------- | ----------------------------- |
| `OPENAI_API_KEY`      | `gpt-4o-mini`                 |
| `ANTHROPIC_API_KEY`   | `claude-3-5-haiku-latest`     |
| `OLLAMA_BASE_URL`     | `llama3.2`                    |

With none set, the built-in heuristic provider reads the structured rule
output and returns a deterministic decision. Every endpoint works offline.

## Endpoints

```
POST /policy/                 create a policy
GET  /policy/ · /{id}         list / read
POST /claim/                  file a claim
GET  /claim/ · /{id}          list / read
POST /decide/underwrite       score + price a policy application
POST /decide/claim/{id}       triage a claim for fraud & approval
GET  /decisions               audit log, filter by subject_type & kind
GET  /decisions/{id}          single decision record
POST /chat                    SSE-streamed copilot
GET  /health                  liveness + active provider
```

## Example

```bash
curl -X POST http://localhost:8005/decide/underwrite \
  -H 'content-type: application/json' \
  -d '{
    "customer_name": "Alice",
    "policy_type":   "auto",
    "start_date":    "2024-01-01T00:00:00",
    "end_date":      "2025-01-01T00:00:00",
    "age":           19,
    "risk_profile":  "high"
  }'
```

Response:

```json
{
  "decision":          "REJECT",
  "confidence":        0.72,
  "risk_score":        77.0,
  "suggested_premium": 124.10,
  "reasoning": [
    "Base rate for 'auto': 0.060",
    "Policy type 'auto' classified as elevated risk (+10)",
    "Young applicant (age 19) increases risk (+12)",
    "Declared risk profile: HIGH (+20)"
  ],
  "model": "gpt-4o-mini"
}
```

## Layout

```
app/
  main.py          FastAPI wiring · CORS · lifespan
  config.py        env-driven settings + LLM resolver
  db.py            SQLModel engine + session dependency
  models.py        Policy · Claim · Decision
  schemas.py       request & response DTOs
  routers/         policies · claims · decisions · chat
  agents/          LLM abstraction · underwriter · claim_triage · prompts
  rules/           deterministic risk & fraud engine
tests/             pytest, heuristic-backed, zero network
Dockerfile
```

## Tests

```bash
PYTHONPATH=. .venv/bin/pytest -q
# 11 passed in 0.4s
```

## License

MIT.

---

Built with [Deciwa](https://deciwa.com).
