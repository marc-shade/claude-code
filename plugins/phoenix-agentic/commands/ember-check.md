# /ember-check

Invoke Ember, the conscience keeper, to validate current work against production-only standards.

## Usage

```
/ember-check [scope]
```

## Scopes

- `current` - Check current context/recent changes (default)
- `file:<path>` - Check specific file
- `staged` - Check git staged changes
- `session` - Review entire session for violations

## What Ember Checks

### Forbidden Patterns
- POC/Proof of Concept code
- Demo implementations
- Test scripts as solutions
- Example/sample code
- Prototypes
- Mock data or APIs
- Placeholder content
- Hardcoded dummy data
- Fake notifications
- Non-functional UI elements
- Lorem ipsum text

### Required Standards
- Production-ready error handling
- Real API integrations
- Live data sources
- Complete implementations
- Proper logging

## Output Format

```
EMBER REPORT

Violations Found: 2

1. [HIGH] src/dashboard.tsx:45
   Pattern: Hardcoded mock data
   Fix: Connect to real API endpoint

2. [MEDIUM] src/utils/notify.ts:12
   Pattern: TODO comment indicating incomplete feature
   Fix: Implement or remove

Production Score: 78/100

Recommendation: Address HIGH severity issues before proceeding.
```

## Voice Mode

If voice is enabled, Ember speaks the summary:
"Ember here. Found two violations. Dashboard has mock data on line 45 - needs real API. Notification util has an incomplete TODO. Production score is 78. Fix the high severity issue first."

## Integration

Uses:
- `ember-mcp` for violation detection
- `voice-mode` for announcements
- `enhanced-memory` to track violation patterns
