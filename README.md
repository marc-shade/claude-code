# Claude Code - 2 Acre Studios Fork

![](https://img.shields.io/badge/Node.js-18%2B-brightgreen?style=flat-square) [![npm]](https://www.npmjs.com/package/@anthropic-ai/claude-code) ![](https://img.shields.io/badge/Fork-2%20Acre%20Studios-blue?style=flat-square)

[npm]: https://img.shields.io/npm/v/@anthropic-ai/claude-code.svg?style=flat-square

This is the **2 Acre Studios fork** of Claude Code with enhanced plugins for agentic system integration. It auto-syncs daily with the [upstream Anthropic repository](https://github.com/anthropics/claude-code).

## ⚡ Hyperthink Mode

Steve Jobs-inspired deep thinking methodology - the highest level in the thinking hierarchy:

```
hyperthink (64K) > ultrathink (32K) > think harder (16K) > think (8K)
```

**Visual Identity**: Electric Blue Pulse (`#00d4ff` → `#00ffff`)

**Activate**: `/hyperthink` command or `HYPERTHINK_MODE=true`

## Custom Plugins (2 Acre Studios)

| Plugin | Description |
|--------|-------------|
| **phoenix-agentic** | Core agentic system - MCP servers, voice mode, memory, hyperthink |
| **cluster-orchestration** | Multi-node distributed execution |
| **relay-race-protocol** | 48-agent relay pipelines with quality gates |
| **voice-first-workflow** | TTS/STT integration for voice-first AI |
| **production-enforcer** | Ember policy enforcement |
| **memory-commands** | Enhanced memory management |
| **intent-router** | Intelligent task routing |
| **execution-telemetry** | Performance monitoring |

## Quick Install

```bash
# Clone this fork
git clone https://github.com/marc-shade/claude-code.git
cd claude-code

# Install plugins to Claude Code
./scripts/install-plugins.sh
```

## Auto-Sync with Upstream

This fork automatically syncs with Anthropic's official repo via GitHub Actions (daily at 2 AM UTC). Custom plugins are preserved during merge.

---

## Original Claude Code

Claude Code is an agentic coding tool that lives in your terminal, understands your codebase, and helps you code faster by executing routine tasks, explaining complex code, and handling git workflows -- all through natural language commands.

**Learn more in the [official documentation](https://docs.anthropic.com/en/docs/claude-code/overview)**.

<img src="./demo.gif" />

## Get started

1. Install Claude Code:

**MacOS/Linux:**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Homebrew (MacOS):**
```bash
brew install --cask claude-code
```

**Windows:**
```powershell
irm https://claude.ai/install.ps1 | iex
```

**NPM:**
```bash
npm install -g @anthropic-ai/claude-code
```

NOTE: If installing with NPM, you also need to install [Node.js 18+](https://nodejs.org/en/download/)

2. Navigate to your project directory and run `claude`.

## Plugins

This repository includes several Claude Code plugins that extend functionality with custom commands and agents. See the [plugins directory](./plugins/README.md) for detailed documentation on available plugins.

## Reporting Bugs

We welcome your feedback. Use the `/bug` command to report issues directly within Claude Code, or file a [GitHub issue](https://github.com/anthropics/claude-code/issues).

## Connect on Discord

Join the [Claude Developers Discord](https://anthropic.com/discord) to connect with other developers using Claude Code. Get help, share feedback, and discuss your projects with the community.

## Data collection, usage, and retention

When you use Claude Code, we collect feedback, which includes usage data (such as code acceptance or rejections), associated conversation data, and user feedback submitted via the `/bug` command.

### How we use your data

See our [data usage policies](https://docs.anthropic.com/en/docs/claude-code/data-usage).

### Privacy safeguards

We have implemented several safeguards to protect your data, including limited retention periods for sensitive information, restricted access to user session data, and clear policies against using feedback for model training.

For full details, please review our [Commercial Terms of Service](https://www.anthropic.com/legal/commercial-terms) and [Privacy Policy](https://www.anthropic.com/legal/privacy).
