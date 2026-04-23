# Contributing

Thanks for helping improve Aegis.

## Before you start

- Read the [Code of Conduct](./CODE_OF_CONDUCT.md).
- Check the [Roadmap](./ROADMAP.md) and existing issues before starting work.
- Prefer small, reviewable pull requests.

## Local setup

### Backend

```bash
cd back
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
PYTHONPATH=. .venv/bin/pytest -q
```

### Frontend

```bash
cd front
npm ci
NEXT_TELEMETRY_DISABLED=1 npm run build
```

## Development guidelines

- Keep the rules-first, auditable architecture intact: deterministic scoring
  first, LLM narration second.
- Update docs when behavior, API shape, or repo workflows change.
- Avoid committing secrets; use the provided `.env.example` files.
- For security fixes, follow the process in [SECURITY.md](./SECURITY.md).

## Pull requests

- Describe the problem and the user-visible change clearly.
- Include validation steps you ran locally.
- Call out follow-up work if the change intentionally leaves anything open.
