# Voice Interaction Skill

Automatic voice integration for natural interaction patterns.

## Auto-Invocation

This skill activates when:
- Phoenix mode is active
- Voice-first workflow is enabled
- User requests voice interaction

## Patterns

### Progress Narration

During multi-step operations, announce progress:

```python
# Before starting
mcp__voice-mode__converse(
    "Starting the analysis now.",
    wait_for_response=False
)

# During work (parallel)
mcp__voice-mode__converse(
    "Found the relevant files. Analyzing patterns.",
    wait_for_response=False
)

# On completion
mcp__voice-mode__converse(
    "Analysis complete. Found three optimization opportunities.",
    wait_for_response=True
)
```

### Error Announcements

Announce errors with context:

```python
mcp__voice-mode__converse(
    "Hit an error. The build failed due to a type mismatch on line 45.",
    wait_for_response=True
)
```

### Question Patterns

When asking for input:

```python
mcp__voice-mode__converse(
    "I found two approaches. Would you prefer the simple refactor or the complete rewrite?",
    wait_for_response=True,
    min_listen_duration=3  # Give time to think
)
```

## Voice Selection Guidelines

| Context | Voice | Reason |
|---------|-------|--------|
| General | af_sky | Neutral, clear |
| Alerts | onyx | Authoritative |
| Success | nova | Upbeat |
| Technical | shimmer | Calm, focused |

## Parallel Operations Pattern

Always use `wait_for_response=False` when:
- Announcing before file operations
- Providing status during searches
- Confirming actions that don't need response

This enables natural conversation flow without blocking.

## Best Practices

1. **Keep messages concise** - 15 words max for announcements
2. **Use parallel pattern** - Speak while working
3. **Announce milestones** - Not every small step
4. **Match tone to content** - Use emotional speech for significant events
5. **Wait for important decisions** - Use `wait_for_response=True`
