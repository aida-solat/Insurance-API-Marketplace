from __future__ import annotations

import json
import re
from collections.abc import Iterable, Iterator
from typing import Any

import httpx

from ..config import Settings, get_settings


class LLMProvider:
    name: str = "base"

    def complete_json(self, system: str, user: str) -> dict[str, Any]:
        raise NotImplementedError

    def stream_chat(self, messages: list[dict[str, str]]) -> Iterator[str]:
        raise NotImplementedError


class HeuristicProvider(LLMProvider):
    name = "heuristic"

    def complete_json(self, system: str, user: str) -> dict[str, Any]:
        payload = _extract_json_block(user) or {}

        if "risk_assessment" in payload:
            ra = payload["risk_assessment"]
            score = float(ra.get("risk_score", 50))
            if score >= 75:
                decision = "REJECT"
            elif score >= 55:
                decision = "REVIEW"
            else:
                decision = "APPROVE"
            return {
                "decision": decision,
                "confidence": 0.72,
                "suggested_premium": ra.get("suggested_premium"),
                "reasoning": ra.get("factors", []),
            }

        if "fraud_assessment" in payload:
            fa = payload["fraud_assessment"]
            score = float(fa.get("fraud_score", 50))
            outside_window = any(
                "OUTSIDE policy coverage window" in f for f in fa.get("factors", [])
            )
            if outside_window:
                decision = "REJECT"
            elif score >= 70:
                decision = "FLAG"
            elif score >= 40:
                decision = "REVIEW"
            else:
                decision = "APPROVE"
            return {
                "decision": decision,
                "confidence": 0.7,
                "reasoning": fa.get("factors", []),
            }

        return {"decision": "REVIEW", "confidence": 0.3, "reasoning": ["No structured context available."]}

    def stream_chat(self, messages: list[dict[str, str]]) -> Iterator[str]:
        last_user = next(
            (m["content"] for m in reversed(messages) if m["role"] == "user"), ""
        )
        reply = (
            "I'm running in offline heuristic mode (no LLM API key configured). "
            "You asked: " + last_user[:200] + "\n\n"
            "Configure OPENAI_API_KEY, ANTHROPIC_API_KEY, or OLLAMA_BASE_URL to "
            "enable full natural-language reasoning."
        )
        for token in reply.split(" "):
            yield token + " "


class OpenAIProvider(LLMProvider):
    name = "openai"

    def __init__(self, settings: Settings):
        self._settings = settings
        self._client = httpx.Client(
            base_url=settings.openai_base_url,
            headers={"Authorization": f"Bearer {settings.openai_api_key}"},
            timeout=settings.llm_timeout_seconds,
        )
        self._model = settings.openai_model

    def complete_json(self, system: str, user: str) -> dict[str, Any]:
        r = self._client.post(
            "/chat/completions",
            json={
                "model": self._model,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                "response_format": {"type": "json_object"},
                "temperature": 0.2,
            },
        )
        r.raise_for_status()
        content = r.json()["choices"][0]["message"]["content"]
        return json.loads(content)

    def stream_chat(self, messages: list[dict[str, str]]) -> Iterator[str]:
        with self._client.stream(
            "POST",
            "/chat/completions",
            json={"model": self._model, "messages": messages, "stream": True},
        ) as r:
            for line in r.iter_lines():
                if not line or not line.startswith("data: "):
                    continue
                data = line[len("data: ") :]
                if data.strip() == "[DONE]":
                    break
                try:
                    chunk = json.loads(data)
                    delta = chunk["choices"][0]["delta"].get("content")
                    if delta:
                        yield delta
                except json.JSONDecodeError:
                    continue


class AnthropicProvider(LLMProvider):
    name = "anthropic"

    def __init__(self, settings: Settings):
        self._settings = settings
        self._client = httpx.Client(
            base_url="https://api.anthropic.com/v1",
            headers={
                "x-api-key": settings.anthropic_api_key or "",
                "anthropic-version": "2023-06-01",
            },
            timeout=settings.llm_timeout_seconds,
        )
        self._model = settings.anthropic_model

    def complete_json(self, system: str, user: str) -> dict[str, Any]:
        r = self._client.post(
            "/messages",
            json={
                "model": self._model,
                "max_tokens": 1024,
                "system": system
                + "\n\nRespond with a single JSON object only, no markdown fences.",
                "messages": [{"role": "user", "content": user}],
            },
        )
        r.raise_for_status()
        text = r.json()["content"][0]["text"]
        return json.loads(_strip_code_fences(text))

    def stream_chat(self, messages: list[dict[str, str]]) -> Iterator[str]:
        system = next((m["content"] for m in messages if m["role"] == "system"), "")
        convo = [m for m in messages if m["role"] != "system"]
        with self._client.stream(
            "POST",
            "/messages",
            json={
                "model": self._model,
                "max_tokens": 1024,
                "system": system,
                "messages": convo,
                "stream": True,
            },
        ) as r:
            for line in r.iter_lines():
                if not line or not line.startswith("data: "):
                    continue
                try:
                    evt = json.loads(line[len("data: ") :])
                except json.JSONDecodeError:
                    continue
                if evt.get("type") == "content_block_delta":
                    delta = evt.get("delta", {}).get("text")
                    if delta:
                        yield delta


class OllamaProvider(LLMProvider):
    name = "ollama"

    def __init__(self, settings: Settings):
        self._settings = settings
        self._client = httpx.Client(
            base_url=settings.ollama_base_url or "http://localhost:11434",
            timeout=settings.llm_timeout_seconds,
        )
        self._model = settings.ollama_model

    def complete_json(self, system: str, user: str) -> dict[str, Any]:
        r = self._client.post(
            "/api/chat",
            json={
                "model": self._model,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                "format": "json",
                "stream": False,
            },
        )
        r.raise_for_status()
        return json.loads(r.json()["message"]["content"])

    def stream_chat(self, messages: list[dict[str, str]]) -> Iterator[str]:
        with self._client.stream(
            "POST",
            "/api/chat",
            json={"model": self._model, "messages": messages, "stream": True},
        ) as r:
            for line in r.iter_lines():
                if not line:
                    continue
                try:
                    evt = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if evt.get("done"):
                    break
                delta = evt.get("message", {}).get("content")
                if delta:
                    yield delta


_PROVIDER_CACHE: dict[str, LLMProvider] = {}


def get_provider(settings: Settings | None = None) -> LLMProvider:
    settings = settings or get_settings()
    name = settings.resolved_provider()
    if name in _PROVIDER_CACHE:
        return _PROVIDER_CACHE[name]

    try:
        if name == "openai":
            provider: LLMProvider = OpenAIProvider(settings)
        elif name == "anthropic":
            provider = AnthropicProvider(settings)
        elif name == "ollama":
            provider = OllamaProvider(settings)
        else:
            provider = HeuristicProvider()
    except Exception:
        provider = HeuristicProvider()

    _PROVIDER_CACHE[name] = provider
    return provider


_JSON_OBJECT_RE = re.compile(r"\{.*\}", re.DOTALL)


def _extract_json_block(text: str) -> dict[str, Any] | None:
    match = _JSON_OBJECT_RE.search(text)
    if not match:
        return None
    try:
        return json.loads(match.group(0))
    except json.JSONDecodeError:
        return None


def _strip_code_fences(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?", "", text).rstrip("`").strip()
    return text


def format_messages(system: str, messages: Iterable[dict[str, str]]) -> list[dict[str, str]]:
    result: list[dict[str, str]] = [{"role": "system", "content": system}]
    for m in messages:
        if m.get("role") == "system":
            continue
        result.append({"role": m["role"], "content": m["content"]})
    return result
