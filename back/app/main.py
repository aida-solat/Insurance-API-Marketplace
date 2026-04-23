from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .db import init_db
from .routers import chat, claims, decisions, policies


@asynccontextmanager
async def _lifespan(_: FastAPI):
    init_db()
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version=settings.version,
        lifespan=_lifespan,
    )

    origins = (
        ["*"] if settings.cors_origins.strip() == "*"
        else [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(policies.router)
    app.include_router(claims.router)
    app.include_router(decisions.router)
    app.include_router(chat.router)

    @app.get("/", tags=["meta"])
    def root() -> dict:
        return {
            "name": settings.app_name,
            "version": settings.version,
            "llm_provider": settings.resolved_provider(),
            "docs": "/docs",
            "built_with": "Deciwa",
            "url": "https://deciwa.com",
        }

    @app.get("/health", tags=["meta"])
    def health() -> dict:
        return {"status": "ok", "llm_provider": settings.resolved_provider()}

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8005, reload=True)
