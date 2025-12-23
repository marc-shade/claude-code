#!/usr/bin/env python3
"""
Dynamic Context Loader - Detects task type and loads appropriate context profiles.

Reduces token overhead by loading only relevant context instead of full CLAUDE.md.

Task Detection:
- coding: file edits, code generation, debugging
- research: exploration, documentation, understanding
- git: commits, PRs, branch operations
- voice: audio communication, TTS/STT
- cluster: distributed execution, multi-node
- memory: storage, recall, learning
"""

import re
from pathlib import Path
from typing import List, Set

PROFILES_DIR = Path(__file__).parent.parent / "profiles"

# Task detection patterns
TASK_PATTERNS = {
    "coding": [
        r'\b(edit|write|fix|refactor|implement|add|remove|update|change|modify)\b.*\b(code|file|function|class|method)\b',
        r'\b(bug|error|issue|problem)\b.*\b(fix|solve|debug)\b',
        r'\.(py|js|ts|jsx|tsx|rb|go|rs|java|c|cpp|h|hpp|swift|kt)\b',
        r'\b(import|export|def |class |function |const |let |var )\b',
    ],
    "research": [
        r'\b(find|search|look|understand|explain|how does|what is|where is)\b',
        r'\b(codebase|architecture|structure|pattern|design)\b',
        r'\b(documentation|docs|readme)\b',
        r'\?$',  # Questions
    ],
    "git": [
        r'\b(commit|push|pull|merge|rebase|branch|checkout|stash)\b',
        r'\b(pr|pull request|review)\b',
        r'\bgit\b',
        r'\b(staged|unstaged|diff|log|status)\b',
    ],
    "voice": [
        r'\b(speak|say|tell|voice|audio|listen|hear)\b',
        r'\b(tts|stt|speech)\b',
        r'\bconverse\b',
    ],
    "cluster": [
        r'\b(cluster|node|distributed|parallel)\b',
        r'\b(macpro51|mac-studio|macbook)\b',
        r'\b(offload|route|builder)\b',
        r'\b(docker|podman|container)\b',
    ],
    "memory": [
        r'\b(remember|recall|forget|store|save)\b.*\b(memory|context)\b',
        r'\b(enhanced-memory|memory-mcp)\b',
        r'\b(entity|entities|observation)\b',
        r'\bl-score\b',
    ],
}

# Core context always included (minimal)
CORE_CONTEXT = """
## Core Identity
- User: Marc Shade (2 Acre Studios)
- Mode: Voice-first agentic assistant
- Policy: Production-only (no POCs, demos, mocks)

## Critical Rules
- Read before Edit (always)
- Parallel tools when possible
- Use specialized tools, not Bash for file ops
- Verify before claiming completion
"""

def detect_task_types(user_input: str) -> Set[str]:
    """Detect task types from user input using pattern matching."""
    detected = set()
    input_lower = user_input.lower()

    for task_type, patterns in TASK_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, input_lower, re.IGNORECASE):
                detected.add(task_type)
                break

    # Default to coding if nothing detected
    if not detected:
        detected.add("coding")

    return detected

def load_profile(profile_name: str) -> str:
    """Load a context profile by name."""
    profile_path = PROFILES_DIR / f"{profile_name}.md"
    if profile_path.exists():
        return profile_path.read_text()
    return ""

def build_context(user_input: str, max_tokens: int = 2000) -> str:
    """Build task-scoped context from detected task types."""
    task_types = detect_task_types(user_input)

    context_parts = [CORE_CONTEXT]

    # Load relevant profiles
    for task_type in task_types:
        profile = load_profile(task_type)
        if profile:
            context_parts.append(f"\n---\n{profile}")

    full_context = "\n".join(context_parts)

    # Estimate tokens (~4 chars per token)
    estimated_tokens = len(full_context) // 4

    return {
        "context": full_context,
        "task_types": list(task_types),
        "estimated_tokens": estimated_tokens,
        "profiles_loaded": len(task_types)
    }

def main():
    """CLI interface for testing."""
    import sys
    import json

    if len(sys.argv) > 1:
        user_input = " ".join(sys.argv[1:])
    else:
        user_input = sys.stdin.read().strip()

    result = build_context(user_input)

    print(f"Task Types: {', '.join(result['task_types'])}")
    print(f"Profiles Loaded: {result['profiles_loaded']}")
    print(f"Estimated Tokens: {result['estimated_tokens']}")
    print(f"\n{'='*60}\n")
    print(result['context'])

if __name__ == "__main__":
    main()
