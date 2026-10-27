from __future__ import annotations

from pathlib import Path


def repo_root() -> Path:
    here = Path(__file__).resolve()
    # src/backend/pipeline/paths.py -> repo root
    return here.parents[3]


def dataset_dir() -> Path:
    return repo_root() / "dataset"


def processed_dir() -> Path:
    return repo_root() / "data" / "processed"


def cache_dir() -> Path:
    return repo_root() / "data" / "cache" / "llm"
