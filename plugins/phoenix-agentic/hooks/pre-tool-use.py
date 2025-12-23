#!/usr/bin/env python3
"""
Phoenix Agentic System - Pre-Tool-Use Hook
Integrates security, voice announcements, and quality enforcement.
"""

import json
import os
import re
import sys
from typing import Any, Dict, Optional

# Sensitive patterns to redact
SENSITIVE_PATTERNS = [
    (r'(?i)(api[_-]?key|apikey)\s*[=:]\s*["\']?([a-zA-Z0-9_-]{20,})', r'\1=***REDACTED***'),
    (r'(?i)(secret|password|token|credential)\s*[=:]\s*["\']?([^\s"\']+)', r'\1=***REDACTED***'),
    (r'sk-[a-zA-Z0-9]{48,}', '***API_KEY_REDACTED***'),
    (r'ghp_[a-zA-Z0-9]{36,}', '***GITHUB_TOKEN_REDACTED***'),
    (r'xoxb-[a-zA-Z0-9-]+', '***SLACK_TOKEN_REDACTED***'),
]

# Production-only forbidden patterns (Ember's checks)
FORBIDDEN_PATTERNS = [
    (r'\b(TODO|FIXME|HACK|XXX)\b', "Incomplete code marker"),
    (r'mock[_-]?data|dummy[_-]?data|fake[_-]?data', "Mock/dummy/fake data"),
    (r'placeholder|lorem\s*ipsum', "Placeholder content"),
    (r'\bPOC\b|\bproof\s*of\s*concept\b', "POC/proof of concept"),
    (r'\bdemo\b.*\bonly\b|\bfor\s*demo\b', "Demo-only code"),
    (r'hardcoded|hard[_-]coded', "Hardcoded values"),
]

def redact_sensitive(content: str) -> str:
    """Redact sensitive information from content."""
    result = content
    for pattern, replacement in SENSITIVE_PATTERNS:
        result = re.sub(pattern, replacement, result)
    return result

def check_production_violations(content: str) -> list:
    """Check for production-only policy violations."""
    violations = []
    for pattern, description in FORBIDDEN_PATTERNS:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            violations.append({
                "pattern": pattern,
                "description": description,
                "matches": matches[:3],  # Limit to first 3 matches
            })
    return violations

def should_announce(tool_name: str, params: Dict) -> Optional[str]:
    """Determine if this tool use should be announced via voice."""
    # Significant actions worth announcing
    announcements = {
        "Write": lambda p: f"Creating file {os.path.basename(p.get('file_path', 'unknown'))}",
        "Edit": lambda p: f"Editing {os.path.basename(p.get('file_path', 'unknown'))}",
        "Task": lambda p: f"Spawning {p.get('subagent_type', 'agent')} agent",
        "Bash": lambda p: None,  # Too noisy
        "WebFetch": lambda p: f"Fetching from {p.get('url', 'web')[:50]}",
    }

    if tool_name in announcements:
        generator = announcements[tool_name]
        return generator(params)
    return None

def process_hook(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """Process the pre-tool-use hook."""
    tool_name = input_data.get("tool_name", "unknown")
    tool_input = input_data.get("tool_input", {})

    result = {
        "allow": True,
        "modified_input": tool_input,
        "warnings": [],
        "announcements": [],
    }

    # Redact sensitive content in parameters
    for key, value in tool_input.items():
        if isinstance(value, str):
            redacted = redact_sensitive(value)
            if redacted != value:
                result["modified_input"][key] = redacted
                result["warnings"].append(f"Redacted sensitive content in {key}")

    # Check for production violations in Write/Edit operations
    if tool_name in ["Write", "Edit", "MultiEdit"]:
        content = tool_input.get("content", "") or tool_input.get("new_string", "")
        violations = check_production_violations(content)
        if violations:
            for v in violations:
                result["warnings"].append(f"Ember warning: {v['description']}")

    # Generate voice announcement if applicable
    announcement = should_announce(tool_name, tool_input)
    if announcement and os.environ.get("PHOENIX_MODE") == "active":
        result["announcements"].append(announcement)

    # Check orchestrator mode delegation
    if os.environ.get("ORCHESTRATOR_MODE") == "true":
        if tool_name in ["Write", "Edit", "MultiEdit"]:
            result["warnings"].append(
                "Orchestrator mode: Consider delegating file modifications to specialized agent"
            )

    return result

def main():
    """Main entry point for hook."""
    try:
        # Read input from stdin
        input_text = sys.stdin.read()
        input_data = json.loads(input_text) if input_text else {}

        # Process hook
        result = process_hook(input_data)

        # Output result
        print(json.dumps(result))

        return 0
    except Exception as e:
        error_result = {
            "allow": True,  # Don't block on hook errors
            "error": str(e),
        }
        print(json.dumps(error_result))
        return 1

if __name__ == "__main__":
    sys.exit(main())
