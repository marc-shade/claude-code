# Phoenix Agentic Plugin

Core plugin for the 2 Acre Studios agentic system. Integrates MCP servers, voice mode, memory management, and distributed cluster execution.

## Overview

Phoenix is a 24/7 autonomous agentic system built on Claude Code. This plugin provides:

- **Voice-First Interaction**: TTS/STT via Kokoro, Whisper, LiveKit
- **Enhanced Memory**: Persistent knowledge with versioning
- **Distributed Execution**: Cluster across mac-studio, macbook-air, macpro51
- **Production Enforcement**: Ember conscience keeper
- **God Agent Protocols**: L-Score, relay race, circuit breaker

## Installation

This plugin is included in the marc-shade/claude-code fork. To use:

```bash
# Clone the fork
git clone https://github.com/marc-shade/claude-code.git

# The plugin is at plugins/phoenix-agentic
```

## Commands

### /system-status

Complete environmental awareness check.

```bash
/system-status        # Full system check
/system-status mcp    # MCP servers only
/system-status voice  # Voice services only
/system-status cluster # Cluster nodes only
```

### /phoenix-mode

Activate full Phoenix persona with voice-first interaction.

```bash
/phoenix-mode on      # Activate
/phoenix-mode off     # Deactivate
/phoenix-mode status  # Check status
```

### /ember-check

Invoke Ember conscience keeper to validate production standards.

```bash
/ember-check          # Check current context
/ember-check staged   # Check git staged changes
/ember-check session  # Review entire session
```

## Agents

### Orchestrator

Primary coordination agent. Routes tasks to specialists, manages distributed execution.

- Complexity 1-3: Single agent local
- Complexity 4-6: Parallel agents local
- Complexity 7-9: Distributed cluster
- Complexity 10: Full orchestration

### Researcher

Analysis and documentation agent. Preferred node: macbook-air.

- Codebase exploration
- Documentation research
- Pattern recognition
- Context gathering

### Builder

Compilation and testing agent. Mandatory node: macpro51 (Linux).

- make, cargo, go builds
- Test suite execution
- Docker/Podman containers
- Performance benchmarking

## Skills

### CORE

System context bootloader. Auto-loads at session start.

- System identity and personality
- God Agent components
- Response format requirements
- Production-only policy

## Hooks

### session-start.py

Environmental awareness on session initialization:
- MCP server health
- Voice service availability
- Cluster node status
- Storage mount verification

### pre-tool-use.py

Security and quality enforcement:
- Sensitive data redaction
- Production violation detection
- Voice announcements
- Orchestrator delegation hints

### post-tool-use.py

Learning and metrics capture:
- Pattern extraction
- Completion announcements
- Performance tracking
- Memory storage hints

## MCP Integration

Required servers:
- `enhanced-memory` - Persistent knowledge
- `voice-mode` - TTS/STT
- `agent-runtime-mcp` - Task persistence
- `sequential-thinking` - Deep reasoning
- `safla-mcp` - Vector embeddings

## Configuration

Plugin settings in `.claude-plugin/plugin.json`:

```json
{
  "settings": {
    "voiceEnabled": true,
    "memoryEnabled": true,
    "clusterEnabled": true,
    "productionOnly": true
  }
}
```

## Author

Marc Shade <marc@2acrestudios.com>
2 Acre Studios

## License

MIT
