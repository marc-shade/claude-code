# /memory-status

Display memory system statistics and health.

## Usage

```
/memory-status [component]
```

## Components

- `all` - Full status (default)
- `entities` - Entity counts and types
- `tiers` - Memory tier distribution
- `cache` - Cache hit rates
- `consolidation` - Consolidation stats

## Implementation

```python
status = mcp__enhanced-memory__get_memory_status()
```

## Output Format

```
MEMORY SYSTEM STATUS

Entities: 1,247 total
  - fact: 423
  - pattern: 312
  - decision: 189
  - learning: 201
  - preference: 122

Memory Tiers:
  - Working: 45 items (active context)
  - Episodic: 892 items (recent experiences)
  - Semantic: 287 items (consolidated concepts)
  - Procedural: 23 items (learned skills)

Compression: 89% ratio
Versions: 3,421 total (avg 2.7 per entity)

Cache:
  - Hit rate: 78%
  - Entries: 156
  - Last cleanup: 2h ago

Consolidation:
  - Last run: 6h ago
  - Patterns found: 12
  - Promotions: 8
  - Forgotten: 3

Health: ✓ Healthy
```

## Tier Analysis

Shows distribution vs optimal 75/15 rule:
```python
analysis = mcp__enhanced-memory__analyze_memory_distribution()
```

```
Distribution Analysis (75/15 Rule)

Current:
  - Reasoning-centric: 68% (target: 75%)
  - Visual content: 12% (target: 15%)
  - General: 20% (target: 10%)

Recommendation: Increase reasoning content storage
```

## Voice Mode

Summarizes key stats:
"Memory healthy. Twelve hundred entities across four tiers. Cache hitting at 78 percent. Last consolidation 6 hours ago."

## Related Commands

- `/remember` - Store memory
- `/recall` - Search memory
- `/learn` - Store learning
- `/forget` - Remove memory
