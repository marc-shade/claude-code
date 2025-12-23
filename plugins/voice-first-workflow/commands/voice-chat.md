# /voice-chat

Start an interactive voice conversation session with Phoenix.

## Usage

```
/voice-chat [mode]
```

## Modes

- `interactive` - Full conversation mode (default)
- `commands` - Voice commands only, minimal responses
- `dictation` - Extended listening for dictation

## Implementation

```python
# Start voice conversation
mcp__voice-mode__converse(
    message="Phoenix ready. What would you like to work on?",
    wait_for_response=True,
    listen_duration=120,
    min_listen_duration=2.0
)
```

## Voice Providers

Priority order:
1. **Kokoro** (local) - Fast, privacy-preserving
2. **OpenAI TTS** - High quality, emotional range
3. **ElevenLabs** - Premium quality (if configured)

STT:
- **Whisper** (local) - Primary transcription

## Conversation Flow

```
Phoenix: "Phoenix ready. What would you like to work on?"

[User speaks]

Phoenix: "I'll start working on that. Let me search the codebase..."

[Actions happen]

Phoenix: "Found the relevant files. Here's what I'm planning..."
```

## Parallel Operations

Use `wait_for_response=False` for narration during operations:

```python
# Announce while doing
mcp__voice-mode__converse(
    "Searching the codebase now.",
    wait_for_response=False
)

# Do the work
Grep("pattern", path="src/")

# Announce result
mcp__voice-mode__converse(
    "Found 15 matches across 8 files.",
    wait_for_response=True
)
```

## Language Support

For non-English:
```python
# Spanish
mcp__voice-mode__converse(
    "¿Cómo estás?",
    voice="ef_dora",
    tts_provider="kokoro"
)

# French
mcp__voice-mode__converse(
    "Bonjour!",
    voice="ff_siwis",
    tts_provider="kokoro"
)
```

## Emotional Speech

Using OpenAI gpt-4o-mini-tts:
```python
mcp__voice-mode__converse(
    "That's fantastic news!",
    tts_model="gpt-4o-mini-tts",
    tts_instructions="Sound excited and celebratory"
)
```
