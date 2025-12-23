# Voice Context Profile

Loaded when: Voice communication, TTS/STT operations, audio interactions

## Voice-First Pattern

Always use voice to communicate with Marc:
```python
mcp__voice-mode__converse(message, wait_for_response=True/False)
```

## Parallel Operations Pattern

For actions that don't need confirmation:
```python
# Speak while acting
mcp__voice-mode__converse("Searching for that file", wait_for_response=False)
# Tool executes in parallel
```

## Language Support

Non-English requires voice + provider specification:
- Spanish: `voice="ef_dora", tts_provider="kokoro"`
- French: `voice="ff_siwis", tts_provider="kokoro"`
- Chinese: `voice="zf_xiaobei", tts_provider="kokoro"`

## Audio Feedback

- Chimes for start/stop listening
- Use `audio_feedback=True` for status indicators
- `pip_leading_silence` for Bluetooth delay compensation

## Response Format

Keep spoken responses:
- Concise (12 words max for COMPLETED line)
- Clear and direct
- No complex technical details in speech
- Follow up with text for details
