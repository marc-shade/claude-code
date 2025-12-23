#!/usr/bin/env python3
"""
Post-Tool-Use Hook - Captures execution telemetry for learning.

Records:
- Tool name and parameters
- Execution outcome (success/failure)
- Latency metrics
- Error patterns
- Usage frequency

Stores telemetry in enhanced-memory for pattern analysis.
"""

import json
import sys
import os
from datetime import datetime
from pathlib import Path

TELEMETRY_FILE = Path.home() / ".claude" / "execution-telemetry.jsonl"
MAX_PARAM_LENGTH = 500  # Truncate long parameters

def sanitize_params(params: dict) -> dict:
    """Sanitize and truncate parameters for storage."""
    sanitized = {}
    sensitive_keys = {'api_key', 'token', 'password', 'secret', 'credential'}

    for key, value in params.items():
        # Redact sensitive values
        if any(s in key.lower() for s in sensitive_keys):
            sanitized[key] = "[REDACTED]"
        elif isinstance(value, str) and len(value) > MAX_PARAM_LENGTH:
            sanitized[key] = value[:MAX_PARAM_LENGTH] + "...[truncated]"
        else:
            sanitized[key] = value

    return sanitized

def parse_hook_input() -> dict:
    """Parse the hook input from stdin."""
    try:
        input_data = sys.stdin.read()
        return json.loads(input_data)
    except json.JSONDecodeError:
        return {}

def determine_outcome(result: dict) -> tuple:
    """Determine if the tool execution was successful."""
    # Check for explicit error indicators
    if result.get("error"):
        return "failure", result.get("error")

    # Check for common failure patterns in output
    output = str(result.get("output", ""))
    if any(pattern in output.lower() for pattern in ["error:", "failed:", "exception:", "traceback"]):
        return "failure", output[:200]

    return "success", None

def record_telemetry(data: dict):
    """Append telemetry record to JSONL file."""
    try:
        with open(TELEMETRY_FILE, "a") as f:
            f.write(json.dumps(data) + "\n")
    except Exception as e:
        # Silently fail - don't break tool execution
        pass

def main():
    """Capture and record execution telemetry."""
    hook_input = parse_hook_input()

    tool_name = hook_input.get("tool_name", "unknown")
    tool_params = hook_input.get("tool_input", {})
    result = hook_input.get("tool_result", {})
    execution_time_ms = hook_input.get("execution_time_ms", 0)

    # Determine outcome
    outcome, error_message = determine_outcome(result)

    # Build telemetry record
    telemetry = {
        "timestamp": datetime.now().isoformat(),
        "tool_name": tool_name,
        "params": sanitize_params(tool_params) if isinstance(tool_params, dict) else {},
        "outcome": outcome,
        "error": error_message,
        "latency_ms": execution_time_ms,
        "session_id": os.environ.get("CLAUDE_SESSION_ID", "unknown")
    }

    # Record telemetry
    record_telemetry(telemetry)

    # Also store significant events in enhanced-memory
    if outcome == "failure":
        # Store failure pattern for learning
        try:
            # Would call enhanced-memory here in production
            pass
        except Exception:
            pass

if __name__ == "__main__":
    main()
