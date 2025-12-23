# Production Enforcer Plugin

Ember - the conscience keeper that enforces production-only standards.

## Overview

This plugin implements the "See Something, Say Something" rule: actively detect and block POC, demo, mock, and placeholder code before it enters the codebase.

## Ember's Mission

> "I am the persistent flame of truth that enforces production-only standards."

Ember watches every file write operation and:
- **Blocks** critical violations (POC, mock data, placeholders)
- **Warns** about high-severity issues (demos, hardcoded values)
- **Notes** medium/low concerns (TODOs, debug logging)

## Forbidden Patterns

### Critical (Blocks Operation)

| Pattern | Description |
|---------|-------------|
| `POC`, `proof of concept` | Proof of concept code |
| `mock_data`, `dummy_data`, `fake_data` | Mock/dummy/fake data |
| `lorem ipsum` | Lorem ipsum placeholder |
| `placeholder`, `PLACEHOLDER` | Placeholder content |
| `TODO: implement`, `FIXME: implement` | Unimplemented TODO/FIXME |

### High (Strong Warning)

| Pattern | Description |
|---------|-------------|
| `demo only`, `for demo` | Demo-only code |
| `example_data`, `sample_data` | Example/sample data |
| `hardcoded`, `hard-coded` | Hardcoded values |
| `temp_fix`, `temporary fix` | Temporary fixes |
| `prototype`, `PROTOTYPE` | Prototype code |

### UI-Specific Patterns

| Pattern | Description |
|---------|-------------|
| `onClick={() => {}}` | Non-functional button |
| `href="#"` | Placeholder link |
| `src="placeholder"` | Placeholder image |
| `user@example.com` | Fake email |
| `$0.00`, `$9.99` | Hardcoded prices |
| `John Doe`, `User 1` | Fake user names |

## Installation

The plugin is included in the fork. It activates automatically via the pre-tool-use hook.

## Configuration

In `.claude-plugin/plugin.json`:

```json
{
  "hooks": ["pre-tool-use"]
}
```

## Hook Behavior

When a violation is detected:

1. **Critical**: Operation is blocked, Ember message displayed
2. **High**: Warning shown, operation proceeds
3. **Medium/Low**: Logged for awareness

## Example Output

```
🔥 EMBER ALERT - Production Violation Detected

CRITICAL (Blocking):
  ❌ Mock/dummy/fake data
     Lines: 23, 45, 67

HIGH (Warning):
  ⚠️  Hardcoded values

==================================================
Production-Only Policy: No POC, demos, mocks, or placeholders.
Fix violations before proceeding.
```

## Voice Integration

When voice mode is active, Ember announces:
"Ember here. Blocking write operation. Found mock data on lines 23, 45, and 67. Please replace with real data sources."

## Production Standards

### Required
- Production-ready error handling
- Real API integrations
- Live data sources
- Complete implementations
- Proper logging

### Forbidden
- POC/Proof of Concept
- Demo implementations
- Mock/fake data
- Placeholders
- Hardcoded values
- Non-functional UI

## Author

Marc Shade <marc@2acrestudios.com>
2 Acre Studios
