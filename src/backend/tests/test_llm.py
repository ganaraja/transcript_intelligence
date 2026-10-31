from __future__ import annotations

import json
import sys
from types import SimpleNamespace

from pipeline.llm import PROMPT_VERSION, maybe_refine_theme_with_provenance
from pipeline.models import RawMeeting


def test_cached_refinement_returns_original_model_and_prompt_provenance(tmp_path, monkeypatch) -> None:
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    cache_dir = tmp_path / "cache"
    cache_dir.mkdir()
    (cache_dir / "m1.json").write_text(
        json.dumps(
            {
                "result": {"primary_theme": "sso_identity_failure"},
                "provenance": {
                    "source": "openai",
                    "generated_at": "2026-10-30T12:00:00+00:00",
                    "model": "gpt-test",
                    "prompt_version": PROMPT_VERSION,
                },
            }
        ),
        encoding="utf-8",
    )

    refined, provenance = maybe_refine_theme_with_provenance(
        RawMeeting(meeting_id="m1", title="Support Case"),
        cache_dir,
    )

    assert refined == {"primary_theme": "sso_identity_failure"}
    assert provenance == {
        "source": "cache",
        "generated_at": "2026-10-30T12:00:00+00:00",
        "model": "gpt-test",
        "prompt_version": PROMPT_VERSION,
    }


def test_legacy_cache_is_labeled_as_unknown_provenance(tmp_path, monkeypatch) -> None:
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    cache_dir = tmp_path / "cache"
    cache_dir.mkdir()
    (cache_dir / "m1.json").write_text(
        json.dumps({"primary_theme": "sso_identity_failure"}),
        encoding="utf-8",
    )

    refined, provenance = maybe_refine_theme_with_provenance(
        RawMeeting(meeting_id="m1", title="Support Case"),
        cache_dir,
    )

    assert refined == {"primary_theme": "sso_identity_failure"}
    assert provenance == {
        "source": "legacy_cache",
        "generated_at": "",
        "model": "",
        "prompt_version": "",
    }


def test_fresh_refinement_persists_model_prompt_and_timestamp(tmp_path, monkeypatch) -> None:
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    monkeypatch.setenv("OPENAI_MODEL", "gpt-test")

    class FakeOpenAI:
        def __init__(self, api_key: str) -> None:
            assert api_key == "test-key"
            self.chat = SimpleNamespace(
                completions=SimpleNamespace(
                    create=lambda **kwargs: SimpleNamespace(
                        choices=[
                            SimpleNamespace(
                                message=SimpleNamespace(
                                    content=json.dumps({"primary_theme": "sso_identity_failure"})
                                )
                            )
                        ]
                    )
                )
            )

    monkeypatch.setitem(sys.modules, "openai", SimpleNamespace(OpenAI=FakeOpenAI))

    refined, provenance = maybe_refine_theme_with_provenance(
        RawMeeting(meeting_id="m1", title="Support Case"),
        tmp_path / "cache",
    )
    cached = json.loads((tmp_path / "cache" / "m1.json").read_text(encoding="utf-8"))

    assert refined == {"primary_theme": "sso_identity_failure"}
    assert provenance is not None
    assert provenance["source"] == "openai"
    assert provenance["model"] == "gpt-test"
    assert provenance["prompt_version"] == PROMPT_VERSION
    assert provenance["generated_at"]
    assert cached["result"] == refined
    assert cached["provenance"] == provenance
