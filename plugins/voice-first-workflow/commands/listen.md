# /listen

Listen for voice input and transcribe.

## Usage

```
/listen [duration]
```

## Examples

```bash
# Default 30 seconds
/listen

# Extended listening
/listen 60

# Quick response
/listen 10
```

## Implementation

```python
# Just listen without speaking first
mcp__voice-mode__converse(
    message="",  # No TTS
    wait_for_response=True,
    listen_duration=duration
)
```

## Silence Detection

By default, listening stops after detecting silence. Override with:

```bash
# Disable silence detection for dictation
/listen --no-silence 60
```

## VAD Settings

Voice Activity Detection aggressiveness:

| Level | Description | Use Case |
|-------|-------------|----------|
| 0 | Least aggressive | Quiet room |
| 1 | Light filtering | Home office |
| 2 | Balanced (default) | Normal environment |
| 3 | Most aggressive | Noisy environment |

```bash
/listen --vad 3  # For noisy environments
```

## Output

Transcribed text is returned as the command result, which can be:
- Used as input for subsequent commands
- Stored in a variable
- Passed to another tool
