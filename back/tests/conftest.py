from __future__ import annotations

import os
from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

os.environ["LLM_PROVIDER"] = "heuristic"
os.environ.pop("OPENAI_API_KEY", None)
os.environ.pop("ANTHROPIC_API_KEY", None)
os.environ.pop("OLLAMA_BASE_URL", None)


@pytest.fixture()
def client() -> Iterator[TestClient]:
    from app import db as db_module
    from app.db import get_session
    from app.main import create_app

    test_engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    from app import models  # noqa: F401

    SQLModel.metadata.create_all(test_engine)

    def _override_get_session() -> Iterator[Session]:
        with Session(test_engine) as session:
            yield session

    db_module.engine = test_engine

    app = create_app()
    app.dependency_overrides[get_session] = _override_get_session
    with TestClient(app) as c:
        yield c
