# Capability Embeddings Index

Semantic search across all Claude Code capabilities using SAFLA embeddings.

## Overview

This plugin solves a critical friction point: **tool discovery**. Instead of pattern-matching or guessing which tool to use, it enables semantic search across all 200+ capabilities.

## What It Indexes

| Source | Location | Count |
|--------|----------|-------|
| Commands | ~/.claude/commands/*.md | ~100+ |
| Agents | ~/.claude/agents/*.md | ~50+ |
| Skills | ~/.claude/skills/*/SKILL.md | ~20+ |
| MCP Servers | ~/.claude.json, .mcp.json | ~40+ |

## Quick Start

```bash
# Search for capabilities
/capability-search "what can help me with memory management"

# Force reindex after installing new tools
/capability-reindex
```

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                 CAPABILITY INDEX FLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Session Start                                               │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────────┐    Stale?    ┌──────────────┐            │
│  │ Check Index  │───────────────│ Crawl All   │            │
│  │    Age       │     YES       │ Capabilities│            │
│  └──────────────┘               └──────────────┘            │
│       │ NO                            │                      │
│       ▼                               ▼                      │
│  ┌──────────────┐              ┌──────────────┐            │
│  │ Use Existing │              │   Generate   │            │
│  │    Index     │              │  Embeddings  │            │
│  └──────────────┘              └──────────────┘            │
│                                       │                      │
│                                       ▼                      │
│                                ┌──────────────┐            │
│                                │ Save Index   │            │
│                                │    JSON      │            │
│                                └──────────────┘            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Semantic Search

When searching, queries are matched semantically, not just by keywords:

| Query | Finds |
|-------|-------|
| "save information for later" | /remember, enhanced-memory, memory-commands |
| "review code changes" | /code-review, code-reviewer agent, pr-review-toolkit |
| "talk to user" | voice-mode, /voice-chat, /speak |
| "run on linux" | cluster-bash, offload-to, macpro51 routing |

## Index Format

The index is stored at `~/.claude/capability-index.json`:

```json
{
  "version": "1.0.0",
  "generated_at": "2025-01-03T10:30:00",
  "content_hash": "a1b2c3d4e5f6",
  "capability_count": 215,
  "by_type": {
    "commands": 98,
    "agents": 52,
    "skills": 23,
    "mcp_servers": 42
  },
  "capabilities": [
    {
      "type": "command",
      "name": "remember",
      "path": "/Users/marc/.claude/commands/remember.md",
      "description": "Store information in enhanced-memory...",
      "searchable_text": "command remember store memory...",
      "embedding_status": "generated"
    }
  ]
}
```

## Auto-Reindexing

The session-start hook automatically reindexes if:
- Index file doesn't exist
- Index is older than 24 hours
- Content hash has changed (files modified)

## Integration with SAFLA

Uses SAFLA MCP for high-performance embedding generation:

```python
# Generate query embedding
mcp__safla-mcp__generate_embeddings(texts=["search query"])

# Compare with indexed embeddings
# Returns ranked results by cosine similarity
```

## Commands

| Command | Description |
|---------|-------------|
| `/capability-search` | Semantic search across all capabilities |
| `/capability-reindex` | Force full reindex of all capabilities |

## Files

```
capability-index/
├── .claude-plugin/
│   └── plugin.json          # Plugin metadata
├── commands/
│   ├── capability-search.md # Search command
│   └── capability-reindex.md # Reindex command
├── hooks/
│   └── session-start.py     # Auto-reindex on session start
├── scripts/
│   └── index-capabilities.py # Main indexing script
└── README.md
```

## Benefits

- **Zero Guesswork**: Find the right tool for any task
- **Semantic Matching**: Understands intent, not just keywords
- **Always Current**: Auto-reindexes when files change
- **Fast**: Uses content hashing to skip unnecessary work
- **Comprehensive**: Covers commands, agents, skills, and MCP tools

## Author

Marc Shade <marc@2acrestudios.com>
2 Acre Studios
