from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass


@dataclass(frozen=True)
class Settings:
    app_name: str = "Aegis Insurance Decision Platform"
    version: str = "0.2.0"

    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./data.db")
    cors_origins: str = os.getenv("CORS_ORIGINS", "*")
    llm_provider: str = os.getenv("LLM_PROVIDER", "auto").lower()

    openai_api_key: str | None = os.getenv("OPENAI_API_KEY")
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    openai_base_url: str = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")

    anthropic_api_key: str | None = os.getenv("ANTHROPIC_API_KEY")
    anthropic_model: str = os.getenv("ANTHROPIC_MODEL", "claude-3-5-haiku-latest")

    ollama_base_url: str | None = os.getenv("OLLAMA_BASE_URL")
    ollama_model: str = os.getenv("OLLAMA_MODEL", "llama3.2")

    llm_timeout_seconds: float = float(os.getenv("LLM_TIMEOUT", "30"))

    def resolved_provider(self) -> str:
        if self.llm_provider != "auto":
            return self.llm_provider
        if self.openai_api_key:
            return "openai"
        if self.anthropic_api_key:
            return "anthropic"
        if self.ollama_base_url:
            return "ollama"
        return "heuristic"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
