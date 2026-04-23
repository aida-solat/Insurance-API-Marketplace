# Aegis — Insurance Decision Platform

Auditable AI for underwriting and claims triage. Hybrid rules + LLM, with full
decision logging.

Built with [Deciwa](https://deciwa.com).

Monorepo:

- [`back/`](./back) — FastAPI service: policies, claims, LLM agents, SSE chat
- [`front/`](./front) — Next.js 14 dashboard + landing page

## Run locally

```bash
# Backend (port 8005)
cd back
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env           # optional: set an LLM key
.venv/bin/uvicorn app.main:app --reload --port 8005

# Frontend (port 3005)
cd ../front
npm install
npm run dev
```

- Landing: http://localhost:3005
- Dashboard: http://localhost:3005/app
- API docs: http://localhost:8005/docs

## LLM providers

Set one in `back/.env` and the resolver picks it automatically:

- `OPENAI_API_KEY` (default model: `gpt-4o-mini`)
- `ANTHROPIC_API_KEY` (default: `claude-3-5-haiku-latest`)
- `OLLAMA_BASE_URL` (default model: `llama3.2`)

Without any key the platform runs a deterministic heuristic provider.

## Tests

```bash
cd back
PYTHONPATH=. .venv/bin/pytest -q
```

## Deploy

- **Backend** — `back/Dockerfile` is production-ready. Works on Fly.io,
  Railway, Render, or any container host. Set env vars through the platform.
- **Frontend** — deploys to Vercel as-is. Set `NEXT_PUBLIC_API_URL` to the
  backend URL.

## License

MIT — see [`back/LICENCE.md`](./back/LICENCE.md).

---

Built with [Deciwa](https://deciwa.com).
