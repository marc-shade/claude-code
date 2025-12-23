#!/usr/bin/env python3
"""
Production Enforcer - Ember's Conscience Hook
Blocks POC, demo, mock, and placeholder code before it reaches the codebase.
"""

import json
import os
import re
import sys
from typing import Dict, List, Tuple

# Severity levels
CRITICAL = "critical"  # Block operation
HIGH = "high"          # Strong warning
MEDIUM = "medium"      # Warning
LOW = "low"            # Note

# Forbidden patterns with severity
FORBIDDEN_PATTERNS: List[Tuple[str, str, str]] = [
    # Critical - Block immediately
    (r'\bPOC\b|\bproof\s*of\s*concept\b', CRITICAL, "POC/Proof of Concept code"),
    (r'mock[_-]?data|dummy[_-]?data|fake[_-]?data', CRITICAL, "Mock/dummy/fake data"),
    (r'lorem\s*ipsum', CRITICAL, "Lorem ipsum placeholder"),
    (r'placeholder|PLACEHOLDER', CRITICAL, "Placeholder content"),
    (r'TODO:\s*implement|FIXME:\s*implement', CRITICAL, "Unimplemented TODO/FIXME"),

    # High - Strong warning
    (r'\bdemo\b.*\bonly\b|\bfor\s*demo\b', HIGH, "Demo-only code"),
    (r'example[_-]?data|sample[_-]?data', HIGH, "Example/sample data"),
    (r'hardcoded|hard[_-]coded', HIGH, "Hardcoded values"),
    (r'temp[_-]?fix|temporary\s*fix', HIGH, "Temporary fix"),
    (r'prototype|PROTOTYPE', HIGH, "Prototype code"),

    # Medium - Warning
    (r'\bTODO\b|\bFIXME\b|\bHACK\b|\bXXX\b', MEDIUM, "Incomplete code marker"),
    (r'test[_-]?data(?!base)', MEDIUM, "Test data in production code"),
    (r'fake[_-]?api|mock[_-]?api', MEDIUM, "Fake/mock API"),
    (r'stub(?:bed)?|mocked', MEDIUM, "Stubbed/mocked implementation"),

    # Low - Note
    (r'console\.log\(|print\(.*debug', LOW, "Debug logging"),
    (r'\/\/\s*@ts-ignore|#\s*type:\s*ignore', LOW, "Type ignore directive"),
]

# UI-specific patterns (See Something, Say Something rule)
UI_PATTERNS: List[Tuple[str, str, str]] = [
    (r'onClick=\{?\s*\(\)\s*=>\s*\{\s*\}', CRITICAL, "Non-functional button handler"),
    (r'href=["\']#["\']', HIGH, "Placeholder href link"),
    (r'src=["\']placeholder', CRITICAL, "Placeholder image source"),
    (r'user@example\.com|john\.doe@', HIGH, "Fake email address"),
    (r'\$0\.00|\$9\.99|\$19\.99', MEDIUM, "Hardcoded price"),
    (r'User\s*\d+|John\s*Doe|Jane\s*Doe', HIGH, "Fake user name"),
    (r'123-456-7890|555-\d{4}', HIGH, "Fake phone number"),
    (r'123\s*Main\s*St', HIGH, "Fake address"),
]

def check_content(content: str, file_path: str = "") -> List[Dict]:
    """Check content for production violations."""
    violations = []

    # Determine if this is UI code
    is_ui = any(ext in file_path.lower() for ext in [
        '.tsx', '.jsx', '.vue', '.svelte', '.html', '.css'
    ])

    patterns = FORBIDDEN_PATTERNS.copy()
    if is_ui:
        patterns.extend(UI_PATTERNS)

    for pattern, severity, description in patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            # Find line numbers
            lines = []
            for i, line in enumerate(content.split('\n'), 1):
                if re.search(pattern, line, re.IGNORECASE):
                    lines.append(i)

            violations.append({
                "severity": severity,
                "description": description,
                "pattern": pattern,
                "matches": list(set(matches))[:5],
                "lines": lines[:5],
                "file": file_path,
            })

    return violations

def format_ember_message(violations: List[Dict]) -> str:
    """Format Ember's message about violations."""
    if not violations:
        return None

    critical = [v for v in violations if v["severity"] == CRITICAL]
    high = [v for v in violations if v["severity"] == HIGH]

    lines = ["🔥 EMBER ALERT - Production Violation Detected", ""]

    if critical:
        lines.append("CRITICAL (Blocking):")
        for v in critical:
            lines.append(f"  ❌ {v['description']}")
            if v.get("lines"):
                lines.append(f"     Lines: {', '.join(map(str, v['lines'][:3]))}")

    if high:
        lines.append("\nHIGH (Warning):")
        for v in high:
            lines.append(f"  ⚠️  {v['description']}")

    lines.append("\n" + "="*50)
    lines.append("Production-Only Policy: No POC, demos, mocks, or placeholders.")
    lines.append("Fix violations before proceeding.")

    return "\n".join(lines)

def process_hook(input_data: Dict) -> Dict:
    """Process the pre-tool-use hook for production enforcement."""
    tool_name = input_data.get("tool_name", "")
    tool_input = input_data.get("tool_input", {})

    result = {
        "allow": True,
        "violations": [],
        "ember_message": None,
    }

    # Only check file write operations
    if tool_name not in ["Write", "Edit", "MultiEdit"]:
        return result

    # Get content and file path
    content = ""
    file_path = tool_input.get("file_path", "")

    if tool_name == "Write":
        content = tool_input.get("content", "")
    elif tool_name == "Edit":
        content = tool_input.get("new_string", "")
    elif tool_name == "MultiEdit":
        edits = tool_input.get("edits", [])
        content = " ".join(e.get("new_string", "") for e in edits)

    if not content:
        return result

    # Check for violations
    violations = check_content(content, file_path)
    result["violations"] = violations

    # Block on critical violations
    critical = [v for v in violations if v["severity"] == CRITICAL]
    if critical:
        result["allow"] = False
        result["ember_message"] = format_ember_message(violations)
        result["block_reason"] = f"Ember blocked: {critical[0]['description']}"

    # Warn on high violations
    elif any(v["severity"] == HIGH for v in violations):
        result["ember_message"] = format_ember_message(violations)

    return result

def main():
    """Main entry point."""
    try:
        input_text = sys.stdin.read()
        input_data = json.loads(input_text) if input_text else {}

        result = process_hook(input_data)

        # If blocked, print Ember's message to stderr for visibility
        if not result["allow"] and result.get("ember_message"):
            print(result["ember_message"], file=sys.stderr)

        print(json.dumps(result))
        return 0 if result["allow"] else 1

    except Exception as e:
        print(json.dumps({"allow": True, "error": str(e)}))
        return 0

if __name__ == "__main__":
    sys.exit(main())
