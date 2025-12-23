# /recall

Search and retrieve information from persistent memory.

## Usage

```
/recall <query> [--type <type>] [--limit <n>]
```

## Examples

```bash
# Search by content
/recall "API endpoint"

# Search by type
/recall "authentication" --type decision

# Limit results
/recall "patterns" --limit 5

# Recent memories
/recall --recent 10
```

## Implementation

```python
results = mcp__enhanced-memory__search_nodes(
    query=query,
    limit=limit or 10
)
```

## Search Modes

### Semantic Search
Default - finds conceptually similar content:
```bash
/recall "how to handle errors"
# Finds: "Use try-catch with specific error types"
```

### Hybrid Search
Combines semantic + keyword:
```python
mcp__enhanced-memory__search_hybrid(query=query)
```

### With Reranking
Higher precision:
```python
mcp__enhanced-memory__search_with_reranking(query=query)
```

## Output Format

```
RECALL RESULTS (5 matches)

1. [decision] 2024-03-15
   "Chose SQLite for local development"
   Tags: database, local
   Relevance: 0.92

2. [pattern] 2024-03-10
   "Use repository pattern for data access"
   Tags: architecture, database
   Relevance: 0.85

3. ...
```

## Voice Mode

Reads top results:
"Found 5 memories about databases. Most relevant: 'Chose SQLite for local development' from March 15th."

## Related Commands

- `/remember` - Store new memory
- `/learn` - Store learning with context
- `/forget` - Remove memory
- `/memory-status` - System statistics
