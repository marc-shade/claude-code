# /system-status

Complete environmental awareness and system health check for the Phoenix agentic system.

## Usage

```
/system-status [component]
```

## Components

- `all` - Complete system status (default)
- `mcp` - MCP server health
- `voice` - Voice mode status
- `memory` - Memory system stats
- `cluster` - Distributed cluster status
- `tasks` - Active tasks and goals

## Implementation

When this command is invoked:

1. **Check MCP Server Health**
   - Query each active MCP server for status
   - Report connection state and capabilities
   - Flag any servers that are unreachable

2. **Voice System Status**
   - Check TTS providers (Kokoro, OpenAI, ElevenLabs)
   - Check STT (Whisper)
   - Report LiveKit room status if applicable

3. **Memory System Stats**
   - Query enhanced-memory for entity counts
   - Report compression statistics
   - Show recent version history

4. **Cluster Status** (if cluster-enabled)
   - Query node-chat-mcp for node awareness
   - Show mac-studio, macbook-air, macpro51 status
   - Report active conversations

5. **Task Status**
   - Query agent-runtime-mcp for active goals
   - Show pending/in-progress tasks
   - Report relay pipeline status

## Output Format

```
SUMMARY: System health check completed

ANALYSIS:
- MCP Servers: 6/6 healthy
- Voice: Kokoro active, Whisper ready
- Memory: 1,247 entities, 89% compression
- Cluster: 3/3 nodes online
- Tasks: 2 active goals, 5 pending tasks

STATUS: All systems operational

NEXT: Ready for commands
```

## Voice Announcement

After gathering status, announce via voice-mode:
"Phoenix systems nominal. Six MCP servers active. Voice ready. Memory at twelve hundred entities. All cluster nodes online."
