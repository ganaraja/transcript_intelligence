"""Optional LLM theme extraction.

The default pipeline is hybrid rules + provided topics so the demo runs without
an API key. If OPENAI_API_KEY is set, this module can refine primary_theme.
Results are cached under data/cache/llm/.
"""

from __future__ import annotations

import json
import os
from pathlib import Path

from pipeline.models import RawMeeting


def maybe_refine_theme(raw: RawMeeting, cache_dir: Path) -> dict | None:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None
    cache_dir.mkdir(parents=True, exist_ok=True)
    cache_path = cache_dir / f"{raw.meeting_id}.json"
    if cache_path.exists():
        return json.loads(cache_path.read_text(encoding="utf-8"))
    try:
        from openai import OpenAI
    except ImportError:
        return None

    client = OpenAI(api_key=api_key)
    excerpt = " ".join(u.sentence for u in raw.utterances[:25])[:4000]
    prompt = {
        "title": raw.title,
        "summary": raw.summary,
        "topics": raw.provided_topics,
        "excerpt": excerpt,
    }
    completion = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        temperature=0,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "Classify an Aegis Cloud Security call. Return JSON with keys "
                    "primary_theme, secondary_themes, product_modules, rationale, example_quote. "
                    "primary_theme must be one of: detect_outage, sso_identity_failure, "
                    "comply_launch_audit, protect_backup, renewal_commercial, competitive_evaluation, "
                    "onboarding_adoption, incident_communication, product_roadmap, engineering_ops, other."
                ),
            },
            {"role": "user", "content": json.dumps(prompt)},
        ],
    )
    content = completion.choices[0].message.content or "{}"
    data = json.loads(content)
    cache_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    return data
