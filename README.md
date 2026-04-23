<div align="center">

# Aegis

**An auditable, rules-first AI platform for insurance underwriting and claims.**

Because regulators don't accept _"the model said so."_

[**Live demo →**](https://insurance.deciwa.com) &nbsp;·&nbsp; [Backend](./back) &nbsp;·&nbsp; [Frontend](./front)

[![CI](https://github.com/aida-solat/Insurance-API-Marketplace/actions/workflows/ci.yml/badge.svg)](https://github.com/aida-solat/Insurance-API-Marketplace/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
![Python](https://img.shields.io/badge/python-3.10%20%7C%203.11%20%7C%203.12-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
[![Sponsor](https://img.shields.io/badge/Sponsor-ea4aaa?logo=githubsponsors&logoColor=white)](https://github.com/sponsors/aida-solat)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Buy%20me%20a%20coffee-ff5e5b?logo=ko-fi&logoColor=white)](https://ko-fi.com/aidasolat)

</div>

---

## The problem

Most "AI for insurance" demos wrap a single LLM call and call it a day. That
works in a pitch deck. It does not work in a regulated market where every
decision must be explainable, reproducible, and defensible five years after
the fact.

Aegis is built the other way around.

1. A **deterministic rule engine** computes a risk or fraud score from
   structured inputs, producing an ordered list of factors with their weights.
2. That structured assessment is handed to an **LLM as grounded context**, not
   as open-ended prose. The model's only job is to pick an outcome and
   summarise the rationale.
3. Every decision — inputs, factors, model, confidence, rationale — is written
   to an **append-only audit log** (`GET /decisions`).

Swap the LLM, compare models, or disable it entirely — the rules still decide.

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        FastAPI (app/)                            │
│                                                                  │
│   POST /policy   /claim          ◀── CRUD                        │
│   POST /decide/underwrite        ◀── score + decide              │
│   POST /decide/claim/{id}        ◀── triage + fraud              │
│   GET  /decisions                ◀── append-only audit log       │
│   POST /chat                     ◀── SSE copilot                 │
└────────────────┬────────────────────────────────┬────────────────┘
                 │                                │
                 ▼                                ▼
       ┌───────────────────┐           ┌───────────────────────┐
       │   Rule engine     │─grounded─▶│    LLM abstraction    │
       │   risk.py         │  context  │    OpenAI / Anthropic │
       │   fraud.py        │           │    Ollama / Heuristic │
       └─────────┬─────────┘           └───────────┬───────────┘
                 │                                 │
                 └──────────────┬──────────────────┘
                                ▼
                     ┌─────────────────────┐
                     │  SQLModel · Decision│
                     │  append-only · JSON │
                     └─────────────────────┘
```

## A real underwriting decision

```bash
curl -X POST https://insurance.deciwa.com/api/decide/underwrite \
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

```json
{
  "decision": "REJECT",
  "confidence": 0.72,
  "risk_score": 77.0,
  "suggested_premium": 124.1,
  "reasoning": [
    "Base rate for 'auto': 0.060",
    "Policy type 'auto' classified as elevated risk (+10)",
    "Young applicant (age 19) increases risk (+12)",
    "Declared risk profile: HIGH (+20)"
  ],
  "model": "gpt-4o-mini"
}
```

Every field is directly traceable back to either the rule engine or the LLM
response. Nothing is hallucinated into existence.

## Stack

| Layer    | Tech                                                     |
| -------- | -------------------------------------------------------- |
| Backend  | Python 3.11 · FastAPI · SQLModel · SSE                   |
| LLM      | OpenAI · Anthropic · Ollama · deterministic fallback     |
| Frontend | Next.js 15 · React 18 · Tailwind · Radix · Framer Motion |
| Infra    | Docker · GitHub Actions · Vercel · Render                |

## Quickstart

```bash
git clone https://github.com/aida-solat/Insurance-API-Marketplace.git
cd Insurance-API-Marketplace

# Backend — port 8005
cd back
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --port 8005

# Frontend — port 3005
cd ../front
npm install && npm run dev
```

Open [`localhost:3005`](http://localhost:3005). No API key required — the
heuristic provider makes the full surface usable offline. Drop an
`OPENAI_API_KEY` in `back/.env` to upgrade the reasoning layer.

## Layout

```
back/                FastAPI service
  app/
    main.py          app wiring · CORS · lifespan
    config.py        env-driven settings + LLM resolver
    models.py        Policy · Claim · Decision (SQLModel)
    schemas.py       request & response DTOs
    routers/         policies · claims · decisions · chat
    agents/          LLM abstraction · underwriter · claim_triage
    rules/           deterministic risk & fraud engine
  tests/             11 tests · heuristic-backed · zero network
  Dockerfile

 front/               Next.js 15 dashboard + landing
  app/
    page.tsx         marketing landing
    app/             authenticated dashboard (underwrite · claims · decisions · chat)
  components/        ui · sidebar · decision card · logo
  lib/               api client · types · tiny swr-like hook

.github/workflows/   CI: pytest matrix · next build · docker buildx
render.yaml          one-click backend deploy
```

## Tests

```bash
cd back
PYTHONPATH=. .venv/bin/pytest -q
# 11 passed in 0.4s
```

CI runs the suite on Python 3.10, 3.11, and 3.12, plus a production Next.js
build and a Docker build for the backend. Green is green.

## Deploy

| Target                | How                                                    |
| --------------------- | ------------------------------------------------------ |
| **Frontend · Vercel** | Import repo, root = `front`, set `NEXT_PUBLIC_API_URL` |
| **Backend · Render**  | Blueprint from `render.yaml`, set LLM + CORS secrets   |
| **Self-host**         | `docker build back/ && docker run -p 8005:8005 …`      |

## Project health

- [Security policy](./SECURITY.md)
- [Contributing guide](./CONTRIBUTING.md)
- [Code of conduct](./CODE_OF_CONDUCT.md)
- [Roadmap](./ROADMAP.md)
- [Dependabot config](./.github/dependabot.yml)

## Support

If Aegis saves you work, consider sponsoring — it keeps the project
independent and its decision logic explainable and open.

<p align="center">
  <a href="https://github.com/sponsors/aida-solat">
    <img src="https://img.shields.io/badge/Sponsor%20on%20GitHub-ea4aaa?style=for-the-badge&logo=githubsponsors&logoColor=white" alt="GitHub Sponsors" />
  </a>
  &nbsp;
  <a href="https://ko-fi.com/aidasolat">
    <img src="https://img.shields.io/badge/Buy%20me%20a%20Ko--fi-ff5e5b?style=for-the-badge&logo=ko-fi&logoColor=white" alt="Ko-fi" />
  </a>
</p>

## License

MIT — see [`LICENSE`](./LICENSE).

<div align="center">

Built with [**Deciwa**](https://deciwa.com).

</div>
