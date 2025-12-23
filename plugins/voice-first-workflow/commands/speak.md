# /speak

Speak a message without waiting for response.

## Usage

```
/speak <message>
```

## Examples

```bash
# Simple announcement
/speak "Build complete. All tests passing."

# Status update
/speak "Starting deployment to staging environment."

# Error notification
/speak "Warning: Found 3 type errors in the build."
```

## Implementation

```python
mcp__voice-mode__converse(
    message=message,
    wait_for_response=False
)
```

## Options

```bash
# With specific voice
/speak --voice nova "Build complete."

# With emotional tone (requires OpenAI)
/speak --emotion excited "We did it!"

# Slower speech
/speak --speed 0.8 "Important announcement."
```

## Integration

This command is useful for:
- Progress announcements during long operations
- Error notifications
- Completion confirmations
- Status updates

## Voice Selection

| Voice | Provider | Best For |
|-------|----------|----------|
| af_sky | Kokoro | General |
| nova | OpenAI | Conversational |
| shimmer | OpenAI | Friendly |
| onyx | OpenAI | Authoritative |
