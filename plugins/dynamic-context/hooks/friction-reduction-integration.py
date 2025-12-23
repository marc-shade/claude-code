#!/usr/bin/env python3
"""
Friction Reduction Integration - Master hook combining all optimizations.

Combines:
1. Dynamic context loading (task-scoped profiles)
2. Capability index suggestions (relevant tools)
3. Intent routing hints (optimal tool chains)
4. Telemetry-based recommendations (learned patterns)

This hook runs on UserPromptSubmit to prepare optimal context before processing.
"""

import json
import sys
import os
from pathlib import Path
from datetime import datetime

CLAUDE_HOME = Path.home() / ".claude"
CAPABILITY_INDEX = CLAUDE_HOME / "capability-index.json"
TELEMETRY_FILE = CLAUDE_HOME / "execution-telemetry.jsonl"
PROFILES_DIR = Path(__file__).parent.parent / "profiles"

# Task detection patterns (simplified for hook performance)
TASK_KEYWORDS = {
    "coding": ["edit", "write", "fix", "refactor", "implement", "bug", "error", "code"],
    "research": ["find", "search", "understand", "explain", "how", "what", "where", "why"],
    "git": ["commit", "push", "pull", "merge", "branch", "pr", "diff", "status"],
    "voice": ["speak", "say", "tell", "voice", "audio", "listen"],
    "cluster": ["cluster", "node", "distributed", "parallel", "docker", "builder"],
    "memory": ["remember", "recall", "forget", "store", "memory", "entity"],
}

def parse_hook_input() -> dict:
    """Parse hook input from stdin."""
    try:
        return json.loads(sys.stdin.read())
    except json.JSONDecodeError:
        return {}

def detect_tasks(message: str) -> list:
    """Fast task detection using keyword matching."""
    message_lower = message.lower()
    detected = []
    for task_type, keywords in TASK_KEYWORDS.items():
        if any(kw in message_lower for kw in keywords):
            detected.append(task_type)
    return detected or ["coding"]  # Default to coding

def load_capability_suggestions(tasks: list, message: str) -> list:
    """Load relevant capability suggestions from index."""
    if not CAPABILITY_INDEX.exists():
        return []

    try:
        index = json.loads(CAPABILITY_INDEX.read_text())
        capabilities = index.get("capabilities", [])

        # Simple keyword matching for suggestions
        message_lower = message.lower()
        suggestions = []

        for cap in capabilities[:50]:  # Limit search for performance
            name = cap.get("name", "").lower()
            desc = cap.get("description", "").lower()

            # Check if capability matches any task keywords
            for task in tasks:
                if task in name or task in desc:
                    suggestions.append({
                        "name": cap.get("name"),
                        "type": cap.get("type"),
                        "description": cap.get("description", "")[:100]
                    })
                    break

        return suggestions[:5]  # Top 5 suggestions
    except Exception:
        return []

def load_telemetry_insights(tasks: list) -> dict:
    """Load relevant insights from execution telemetry."""
    if not TELEMETRY_FILE.exists():
        return {}

    try:
        # Read recent telemetry (last 100 entries)
        with open(TELEMETRY_FILE, "r") as f:
            lines = f.readlines()[-100:]

        tool_stats = {}
        for line in lines:
            try:
                entry = json.loads(line)
                tool = entry.get("tool_name", "unknown")
                outcome = entry.get("outcome", "unknown")

                if tool not in tool_stats:
                    tool_stats[tool] = {"success": 0, "failure": 0}
                tool_stats[tool][outcome] = tool_stats[tool].get(outcome, 0) + 1
            except json.JSONDecodeError:
                continue

        # Calculate success rates
        insights = {}
        for tool, stats in tool_stats.items():
            total = stats.get("success", 0) + stats.get("failure", 0)
            if total >= 3:  # Only tools with sufficient usage
                success_rate = stats.get("success", 0) / total
                if success_rate < 0.7:
                    insights[tool] = f"Low success rate ({success_rate:.0%})"

        return insights
    except Exception:
        return {}

def estimate_tokens(profiles: list) -> int:
    """Estimate token count for loaded profiles."""
    total = 50  # Core context base
    for profile in profiles:
        profile_path = PROFILES_DIR / f"{profile}.md"
        if profile_path.exists():
            total += len(profile_path.read_text()) // 4
    return total

def main():
    """Run friction reduction integration."""
    hook_input = parse_hook_input()
    message = hook_input.get("message", hook_input.get("content", ""))

    if not message:
        return

    # 1. Detect task types
    tasks = detect_tasks(message)

    # 2. Estimate token savings
    token_estimate = estimate_tokens(tasks)
    full_context_tokens = 15000
    savings = ((full_context_tokens - token_estimate) / full_context_tokens) * 100

    # 3. Load capability suggestions (non-blocking)
    suggestions = load_capability_suggestions(tasks, message)

    # 4. Check telemetry insights (non-blocking)
    insights = load_telemetry_insights(tasks)

    # Output integration summary
    output = []
    output.append(f"Context: {', '.join(tasks)} (~{token_estimate} tokens, {savings:.0f}% savings)")

    if suggestions:
        tool_names = [s["name"] for s in suggestions[:3]]
        output.append(f"Suggested: {', '.join(tool_names)}")

    if insights:
        warnings = list(insights.keys())[:2]
        if warnings:
            output.append(f"Caution: {', '.join(warnings)} have low success rates")

    print(" | ".join(output))

if __name__ == "__main__":
    main()
