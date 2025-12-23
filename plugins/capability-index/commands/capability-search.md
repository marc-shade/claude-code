# /capability-search

Search across all Claude Code capabilities using semantic matching.

## Usage

```bash
/capability-search "what can help me with memory"
/capability-search "agent for code review"
/capability-search "how to track tasks"
```

## What It Searches

- **Commands**: All `/command` files in ~/.claude/commands/
- **Agents**: All agent definitions in ~/.claude/agents/
- **Skills**: All skill definitions in ~/.claude/skills/
- **MCP Tools**: All MCP servers from ~/.claude.json and .mcp.json

## How It Works

1. Loads the capability index from ~/.claude/capability-index.json
2. Uses SAFLA embeddings for semantic similarity matching
3. Returns ranked results with relevance scores
4. Shows usage examples for top matches

## Search Execution

When this command is invoked, I will:

1. **Load Index**: Read ~/.claude/capability-index.json
2. **Generate Query Embedding**: Use SAFLA to embed the search query
3. **Semantic Search**: Find capabilities with similar embeddings
4. **Rank Results**: Sort by relevance score
5. **Display**: Show top 5-10 matches with descriptions

## Example Output

```
Searching for: "memory management"

TOP MATCHES:

1. [Command] /remember (0.92)
   Store information in enhanced-memory for later recall
   Usage: /remember "important context to save"

2. [MCP Server] enhanced-memory (0.89)
   Memory storage and retrieval, versioning, compression
   Tools: create_entities, search_nodes, memory_commit

3. [Skill] provenance-tracking (0.84)
   Automatic L-Score calculation for derived information
   Triggers: creating derived info, synthesizing sources

4. [Command] /recall (0.81)
   Retrieve previously stored information from memory
   Usage: /recall "search query"
```

## Reindexing

To force a reindex of all capabilities:

```bash
python3 ~/.claude/plugins/capability-index/scripts/index-capabilities.py
```

The index auto-updates on session start if older than 24 hours.
