#!/usr/bin/env python3
"""
User Prompt Submit Hook - Dynamic context loading based on task detection.

Analyzes user input and injects task-scoped context profiles before processing.
Reduces token overhead from ~15K to ~400-1200 by loading only relevant context.
"""

import json
import sys
import os
from pathlib import Path

# Import context loader
sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))
from context_loader import detect_task_types, load_profile, CORE_CONTEXT

CLAUDE_HOME = Path.home() / ".claude"
CONTEXT_CACHE_FILE = CLAUDE_HOME / ".active-context-profiles"

def parse_hook_input() -> dict:
    """Parse hook input from stdin."""
    try:
        return json.loads(sys.stdin.read())
    except json.JSONDecodeError:
        return {}

def get_user_message(hook_input: dict) -> str:
    """Extract user message from hook input."""
    # Handle different hook input formats
    if "message" in hook_input:
        return hook_input["message"]
    if "content" in hook_input:
        return hook_input["content"]
    if "user_input" in hook_input:
        return hook_input["user_input"]
    return ""

def cache_active_profiles(profiles: list):
    """Cache active profiles for reference by other hooks."""
    try:
        CONTEXT_CACHE_FILE.write_text(json.dumps({
            "profiles": profiles,
            "timestamp": __import__("datetime").datetime.now().isoformat()
        }))
    except Exception:
        pass

def main():
    """Detect task type and output context injection."""
    hook_input = parse_hook_input()
    user_message = get_user_message(hook_input)

    if not user_message:
        # No message to analyze, pass through
        return

    # Detect task types from user input
    task_types = detect_task_types(user_message)

    # Load relevant profiles
    context_parts = []
    loaded_profiles = []

    for task_type in task_types:
        profile = load_profile(task_type)
        if profile:
            context_parts.append(profile)
            loaded_profiles.append(task_type)

    # Cache active profiles
    cache_active_profiles(loaded_profiles)

    # Output context notification (will be shown to user)
    if loaded_profiles:
        token_estimate = sum(len(p) // 4 for p in context_parts) + len(CORE_CONTEXT) // 4
        print(f"Context loaded: {', '.join(loaded_profiles)} (~{token_estimate} tokens)")

if __name__ == "__main__":
    main()
