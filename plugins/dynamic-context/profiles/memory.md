# Memory Context Profile

Loaded when: Memory operations, knowledge storage, learning, recall

## Memory Hierarchy

| Tier | Purpose | TTL | Auto-Promotion |
|------|---------|-----|----------------|
| Working | Active context | 60min | → Episodic (high access) |
| Episodic | Experiences | Days | → Semantic (patterns) |
| Semantic | Concepts | Long | Stable knowledge |
| Procedural | Skills | Long | Success tracking |

## Core Operations

```python
# Store information
mcp__enhanced-memory__create_entities([{
    "name": "entity-name",
    "entityType": "type",
    "observations": ["fact1", "fact2"]
}])

# Search
mcp__enhanced-memory__search_nodes(query="...", limit=10)

# Version control
mcp__enhanced-memory__memory_commit(entity_name="...", message="...")
mcp__enhanced-memory__memory_branch(entity_name="...", branch_name="...")
```

## L-Score Provenance

Track information quality:
```
L = geometric_mean(confidence) × average(relevance) / depth_factor
```

| L-Score | Quality | Action |
|---------|---------|--------|
| ≥ 0.7 | High | Accept |
| 0.3-0.7 | Medium | Accept with caution |
| < 0.3 | Low | Review/Reject |

## Best Practices

- Always cite source_ids when creating derived entities
- Search before creating (avoid duplicates)
- Use appropriate entity types for organization
- Run consolidation periodically for cleanup
