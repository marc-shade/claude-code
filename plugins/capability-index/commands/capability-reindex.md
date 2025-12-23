# /capability-reindex

Force reindex of all Claude Code capabilities.

## Usage

```bash
/capability-reindex
```

## What It Does

1. Crawls all capability sources:
   - ~/.claude/commands/*.md
   - ~/.claude/agents/*.md
   - ~/.claude/skills/*/SKILL.md
   - ~/.claude.json (MCP servers)
   - .mcp.json (project MCP servers)

2. Extracts descriptions and searchable text
3. Generates embeddings via SAFLA
4. Saves index to ~/.claude/capability-index.json

## When to Use

- After installing new plugins
- After adding custom commands/agents/skills
- After modifying MCP server configuration
- If search results seem stale

## Execution

When this command is invoked, I will run:

```bash
python3 ~/.claude/plugins/capability-index/scripts/index-capabilities.py
```

And report the results showing:
- Total capabilities indexed
- Breakdown by type (commands, agents, skills, MCP servers)
- Any parsing errors encountered
