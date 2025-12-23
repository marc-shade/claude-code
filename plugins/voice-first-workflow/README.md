# Voice-First Workflow Plugin

Voice-driven development using TTS/STT for natural interaction with Phoenix.

## Overview

This plugin enables hands-free development:
- Voice conversations with Phoenix
- Progress narration during operations
- Voice commands for common tasks
- Dictation mode for extended input

## Voice Architecture

```
┌─────────────────────────────────────────────┐
│              VOICE PIPELINE                  │
├─────────────────────────────────────────────┤
│                                              │
│   ┌───────┐    ┌─────────┐    ┌─────────┐  │
│   │Whisper│ →  │ Claude  │ →  │ Kokoro/ │  │
│   │ (STT) │    │  Code   │    │ OpenAI  │  │
│   │       │    │         │    │  (TTS)  │  │
│   └───────┘    └─────────┘    └─────────┘  │
│                                              │
│   Port: 8100   Local        Port: 8880      │
│                                              │
└─────────────────────────────────────────────┘
```

## Commands

### /voice-chat

Start interactive voice conversation.

```bash
/voice-chat              # Interactive mode
/voice-chat commands     # Voice commands only
/voice-chat dictation    # Extended listening
```

### /speak

Speak a message without waiting for response.

```bash
/speak "Build complete."
/speak --voice nova "Hello!"
/speak --emotion excited "Great news!"
```

### /listen

Listen for voice input and transcribe.

```bash
/listen        # 30 seconds
/listen 60     # 1 minute
/listen --no-silence 120  # 2 min without silence detection
```

## Skills

### voice-interaction

Auto-activates for natural voice patterns:
- Progress narration
- Error announcements
- Question patterns
- Parallel operations

## Parallel Operations Pattern

Speak while working for natural flow:

```python
# Announce (non-blocking)
mcp__voice-mode__converse(
    "Searching the codebase.",
    wait_for_response=False
)

# Do work
results = Grep("pattern")

# Announce result
mcp__voice-mode__converse(
    f"Found {len(results)} matches.",
    wait_for_response=True
)
```

## Voice Providers

### TTS (Text-to-Speech)

| Provider | Port | Features |
|----------|------|----------|
| Kokoro | 8880 | Local, fast, multi-language |
| OpenAI | API | High quality, emotional |
| ElevenLabs | API | Premium quality |

### STT (Speech-to-Text)

| Provider | Port | Features |
|----------|------|----------|
| Whisper | 8100 | Local, accurate, Phoenix-aware |

## Language Support

Non-English requires specific voices:

| Language | Voice | Provider |
|----------|-------|----------|
| Spanish | ef_dora | Kokoro |
| French | ff_siwis | Kokoro |
| Chinese | zf_xiaobei | Kokoro |
| Japanese | jf_alpha | Kokoro |
| Italian | if_sara | Kokoro |

## Emotional Speech

Using OpenAI's gpt-4o-mini-tts:

```python
mcp__voice-mode__converse(
    "That's amazing!",
    tts_model="gpt-4o-mini-tts",
    tts_instructions="Sound excited and celebratory"
)
```

Emotions: excited, sad, urgent, calm, playful, serious

## Audio Configuration

Environment variables:
- `VOICEMODE_TTS_AUDIO_FORMAT` - Output format
- `VOICEMODE_VAD_AGGRESSIVENESS` - Voice detection (0-3)
- `VOICEMODE_SKIP_TTS` - Disable TTS
- `VOICEMODE_PIP_LEADING_SILENCE` - Pre-chime silence

## Author

Marc Shade <marc@2acrestudios.com>
2 Acre Studios
