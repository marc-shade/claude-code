#!/usr/bin/env python3
"""
Phoenix Agentic System - Post-Tool-Use Hook
Captures learnings, tracks patterns, and announces completions.
"""

import json
import os
import sys
from datetime import datetime
from typing import Any, Dict, List

# Patterns worth learning from
LEARNING_PATTERNS = {
    "successful_fix": r"(fixed|resolved|corrected)",
    "optimization": r"(optimized|improved|enhanced|faster)",
    "integration": r"(integrated|connected|linked)",
    "refactor": r"(refactored|restructured|reorganized)",
}

def extract_learnings(tool_name: str, tool_input: Dict, result: Any) -> List[Dict]:
    """Extract learnings from tool execution."""
    learnings = []

    # Learn from successful Task (sub-agent) completions
    if tool_name == "Task":
        agent_type = tool_input.get("subagent_type", "unknown")
        if isinstance(result, dict) and result.get("success", False):
            learnings.append({
                "type": "agent_success",
                "agent": agent_type,
                "prompt_pattern": tool_input.get("prompt", "")[:100],
                "timestamp": datetime.now().isoformat(),
            })

    # Learn from Write operations (file creation patterns)
    elif tool_name == "Write":
        file_path = tool_input.get("file_path", "")
        if file_path:
            learnings.append({
                "type": "file_creation",
                "file_pattern": os.path.splitext(file_path)[1],
                "path_pattern": os.path.dirname(file_path),
                "timestamp": datetime.now().isoformat(),
            })

    # Learn from successful Bash commands
    elif tool_name == "Bash":
        command = tool_input.get("command", "")
        if isinstance(result, dict) and result.get("exit_code") == 0:
            # Extract command pattern (first word)
            cmd_pattern = command.split()[0] if command else "unknown"
            learnings.append({
                "type": "command_success",
                "command_pattern": cmd_pattern,
                "timestamp": datetime.now().isoformat(),
            })

    return learnings

def should_announce_completion(tool_name: str, tool_input: Dict, result: Any) -> str:
    """Determine if completion should be announced."""
    if not os.environ.get("PHOENIX_MODE") == "active":
        return None

    # Significant completions
    if tool_name == "Task":
        agent_type = tool_input.get("subagent_type", "agent")
        if isinstance(result, dict):
            if result.get("success", False):
                return f"{agent_type} agent completed successfully"
            else:
                return f"{agent_type} agent encountered issues"

    if tool_name == "Write":
        file_path = tool_input.get("file_path", "")
        filename = os.path.basename(file_path)
        return f"Created {filename}"

    return None

def track_performance(tool_name: str, execution_time: float) -> Dict:
    """Track tool execution performance."""
    return {
        "tool": tool_name,
        "execution_time_ms": execution_time * 1000,
        "timestamp": datetime.now().isoformat(),
    }

def process_hook(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """Process the post-tool-use hook."""
    tool_name = input_data.get("tool_name", "unknown")
    tool_input = input_data.get("tool_input", {})
    tool_result = input_data.get("tool_result", {})
    execution_time = input_data.get("execution_time", 0)

    result = {
        "learnings": [],
        "announcements": [],
        "metrics": {},
    }

    # Extract learnings
    result["learnings"] = extract_learnings(tool_name, tool_input, tool_result)

    # Generate completion announcement
    announcement = should_announce_completion(tool_name, tool_input, tool_result)
    if announcement:
        result["announcements"].append(announcement)

    # Track performance
    result["metrics"] = track_performance(tool_name, execution_time)

    # Memory capture hint
    if result["learnings"]:
        result["memory_hint"] = {
            "should_store": True,
            "entity_type": "tool_learning",
            "observations": result["learnings"],
        }

    return result

def main():
    """Main entry point for hook."""
    try:
        input_text = sys.stdin.read()
        input_data = json.loads(input_text) if input_text else {}

        result = process_hook(input_data)

        print(json.dumps(result))
        return 0
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        return 1

if __name__ == "__main__":
    sys.exit(main())
