# /remember

Store information in persistent memory for future recall.

## Usage

```
/remember <what> [--type <type>] [--tags <tags>]
```

## Types

| Type | Description | Example |
|------|-------------|---------|
| `fact` | Factual information | API endpoints, configs |
| `pattern` | Code patterns | Design patterns, idioms |
| `decision` | Decisions made | Architecture choices |
| `learning` | Lessons learned | Problem solutions |
| `preference` | User preferences | Style, tools |

## Examples

```bash
# Remember a fact
/remember "The API endpoint is /api/v2/users"

# Remember with type
/remember "Use dependency injection for services" --type pattern

# Remember with tags
/remember "Marc prefers Tailwind over CSS modules" --type preference --tags ui,styling

# Remember a decision
/remember "Chose SQLite over PostgreSQL for local dev" --type decision
```

## Implementation

```python
mcp__enhanced-memory__create_entities([{
    "name": f"memory-{generate_id()}",
    "entityType": type or "memory",
    "observations": [
        f"content: {what}",
        f"tags: {tags}",
        f"timestamp: {now()}"
    ]
}])
```

## Memory Structure

Each memory is stored with:
- **Content**: The actual information
- **Type**: Category for retrieval
- **Tags**: Additional classification
- **Timestamp**: When remembered
- **Context**: Current project/session

## Versioning

Memories are automatically versioned:
```python
# Memory updated? New version created
mcp__enhanced-memory__memory_commit(
    entity_name=memory_id,
    message="Updated memory content"
)
```

## Voice Mode

Confirms storage:
"Remembered. Stored as a pattern about dependency injection."
