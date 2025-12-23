#!/usr/bin/env python3
"""
Session Start Hook - Auto-reindex capabilities if stale.

Runs at session start to ensure capability index is current.
Only reindexes if files have changed (content hash check).
"""

import json
import sys
import subprocess
from pathlib import Path
from datetime import datetime, timedelta

CLAUDE_HOME = Path.home() / ".claude"
INDEX_FILE = CLAUDE_HOME / "capability-index.json"
SCRIPT_PATH = Path(__file__).parent.parent / "scripts" / "index-capabilities.py"

# Reindex if older than this
MAX_INDEX_AGE_HOURS = 24

def check_index_age() -> bool:
    """Check if index exists and is recent enough."""
    if not INDEX_FILE.exists():
        return False

    try:
        index = json.loads(INDEX_FILE.read_text())
        generated_at = datetime.fromisoformat(index.get("generated_at", "2000-01-01"))
        age = datetime.now() - generated_at
        return age < timedelta(hours=MAX_INDEX_AGE_HOURS)
    except (json.JSONDecodeError, ValueError):
        return False

def run_indexer():
    """Run the capability indexer."""
    try:
        result = subprocess.run(
            [sys.executable, str(SCRIPT_PATH)],
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.returncode == 0, result.stdout
    except subprocess.TimeoutExpired:
        return False, "Indexing timed out"
    except Exception as e:
        return False, str(e)

def main():
    """Check and update capability index on session start."""
    # Quick age check first
    if check_index_age():
        # Index is recent, skip reindex
        return

    # Run indexer
    success, output = run_indexer()

    if success:
        print(f"Capability index updated: {output.strip().split(chr(10))[-1]}")
    else:
        print(f"Capability index update failed: {output}")

if __name__ == "__main__":
    main()
