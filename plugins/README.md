# Claude Code Plugins

Anthropic's plugins are developed in [claude-plugins-official](https://github.com/anthropics/claude-plugins-official). The `claude-code-plugins` marketplace in this repository still lists them, and installs them from there. The `claude-opus-4-5-migration` plugin has been retired.

## What are Claude Code Plugins?

Claude Code plugins are extensions that enhance Claude Code with custom slash commands, specialized agents, hooks, and MCP servers. Plugins can be shared across projects and teams, providing consistent tooling and workflows.

Learn more in the [official plugins documentation](https://docs.claude.com/en/docs/claude-code/plugins).

## Installation

To use plugins in your own projects:

1. Install Claude Code globally:
```bash
npm install -g @anthropic-ai/claude-code
```

2. Navigate to your project and run Claude Code:
```bash
claude
```

3. Use the `/plugin` command to install plugins from marketplaces, or configure them in your project's `.claude/settings.json`.

For detailed plugin installation and configuration, see the [official documentation](https://docs.claude.com/en/docs/claude-code/plugins).

## 2 Acre Studios Agentic System Plugins

These plugins implement the Phoenix 24/7 Autonomous Agentic System - a comprehensive framework for AI-powered development workflows with voice integration, distributed cluster execution, and production-quality enforcement.

| Name | Description | Contents |
|------|-------------|----------|
| [phoenix-agentic](./phoenix-agentic/) | Core Phoenix agentic system with MCP integration and personality calibration | **Commands:** `/system-status`, `/phoenix-mode`, `/ember-check`<br>**Agents:** `orchestrator`, `researcher`, `builder`<br>**Skills:** `CORE` context bootloader<br>**Hooks:** Session start, pre/post tool use |
| [cluster-orchestration](./cluster-orchestration/) | Distributed execution across multi-node cluster with intelligent task routing | **Commands:** `/cluster-status`, `/offload`, `/parallel-exec`, `/node-chat`<br>**Agent:** `cluster-coordinator`<br>**Skill:** `distributed-execution` |
| [production-enforcer](./production-enforcer/) | Ember conscience keeper - enforces production-only policy, blocks POC/demo code | **Hook:** PreToolUse - Critical enforcement of production standards |
| [voice-first-workflow](./voice-first-workflow/) | Voice-driven development with TTS/STT integration | **Commands:** `/voice-chat`, `/speak`, `/listen`<br>**Skill:** `voice-interaction` |
| [memory-commands](./memory-commands/) | Intuitive memory interface wrapping enhanced-memory MCP | **Commands:** `/remember`, `/recall`, `/learn`, `/forget`, `/memory-status` |
| [relay-race-protocol](./relay-race-protocol/) | God Agent implementation with L-Score provenance and circuit breakers | **Commands:** `/relay-race`, `/l-score`, `/circuit-status`<br>**Agents:** `relay-coordinator`, `validator-agent`<br>**Skill:** `provenance-tracking` |

## Friction Reduction Plugins

These plugins optimize Claude Code's tool selection and execution by providing semantic capability discovery, execution telemetry, and intelligent routing.

| Name | Description | Contents |
|------|-------------|----------|
| [capability-index](./capability-index/) | Semantic search across all Claude Code capabilities using SAFLA embeddings | **Commands:** `/capability-search`, `/capability-reindex`<br>**Hook:** Session start auto-reindexing<br>**Script:** Crawls commands, agents, skills, and MCP tools |
| [execution-telemetry](./execution-telemetry/) | Tracks tool call outcomes for learning and optimization | **Commands:** `/telemetry-stats`, `/telemetry-patterns`<br>**Hook:** Post-tool-use telemetry capture<br>**Script:** Pattern analysis and recommendations |
| [intent-router](./intent-router/) | Matches user intent to optimal tool chains using embeddings and telemetry | **Agent:** `intent-router` - Spawnable for complex routing decisions<br>**Skill:** `intelligent-routing` - Auto-invoked during planning |
| [dynamic-context](./dynamic-context/) | Task-scoped context loading reducing tokens from ~15K to ~400-1200 per task | **Commands:** `/context`, `/context-profile`<br>**Skill:** `context-aware` - Auto-invoked for task detection<br>**Profiles:** coding, research, git, voice, cluster, memory |

## Plugin Structure

Each plugin follows the standard Claude Code plugin structure:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json          # Plugin metadata
├── commands/                # Slash commands (optional)
├── agents/                  # Specialized agents (optional)
├── skills/                  # Agent Skills (optional)
├── hooks/                   # Event handlers (optional)
├── .mcp.json                # External tool configuration (optional)
└── README.md                # Plugin documentation
```

## Contributing

New plugins belong in [claude-plugins-official](https://github.com/anthropics/claude-plugins-official).

## Learn More

- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code/overview)
- [Plugin System Documentation](https://docs.claude.com/en/docs/claude-code/plugins)
- [Agent SDK Documentation](https://docs.claude.com/en/api/agent-sdk/overview)
