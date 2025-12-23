# Memory Commands Plugin

Intuitive memory commands wrapping the enhanced-memory MCP for persistent knowledge management.

## Overview

Simple, memorable commands for interacting with the memory system:

| Command | Purpose |
|---------|---------|
| `/remember` | Store information |
| `/recall` | Search and retrieve |
| `/learn` | Store learnings with context |
| `/forget` | Remove or archive |
| `/memory-status` | System statistics |

## Quick Start

```bash
# Store a fact
/remember "The main config is at ~/.config/app.json"

# Search memories
/recall "config location"

# Store a learning
/learn "Always validate input before processing"

# Check system status
/memory-status
```

## Memory Architecture

```
┌─────────────────────────────────────────────────┐
│              MEMORY HIERARCHY                    │
├─────────────────────────────────────────────────┤
│                                                  │
│   Working Memory (volatile, active context)      │
│         ↓ promotion                              │
│   Episodic Memory (experiences, events)          │
│         ↓ consolidation                          │
│   Semantic Memory (concepts, facts)              │
│         ↓ skill extraction                       │
│   Procedural Memory (skills, procedures)         │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Memory Types

| Type | Description | Auto-Consolidation |
|------|-------------|-------------------|
| fact | Factual information | → Semantic |
| pattern | Code patterns | → Semantic |
| decision | Decisions made | → Semantic |
| learning | Lessons learned | → Semantic/Procedural |
| preference | User preferences | → Semantic |

## Advanced Features

### Versioning

Every memory is versioned:
```bash
# View history
mcp__enhanced-memory__memory_diff(entity_name="memory-123")

# Revert to previous
mcp__enhanced-memory__memory_revert(entity_name="memory-123", version=2)
```

### Branching

Experimental memory branches:
```bash
# Create branch
mcp__enhanced-memory__memory_branch(
    entity_name="memory-123",
    branch_name="experiment"
)
```

### Consolidation

Periodic consolidation promotes memories:
```bash
# Manual consolidation
mcp__enhanced-memory__run_full_consolidation(time_window_hours=24)
```

## Search Modes

| Mode | Tool | Use Case |
|------|------|----------|
| Semantic | `search_nodes` | Conceptual similarity |
| Hybrid | `search_hybrid` | Semantic + keyword |
| Reranked | `search_with_reranking` | High precision |
| Expanded | `search_with_query_expansion` | Broad coverage |

## Memory Tiers (75/15 Rule)

Optimal distribution based on research:
- **75%** Reasoning-centric (code, logic, patterns)
- **15%** Visual content (diagrams, layouts)
- **10%** General knowledge

## MCP Integration

Wraps enhanced-memory MCP tools:
- `create_entities` - Store memories
- `search_nodes` - Search memories
- `memory_diff` - Version comparison
- `memory_revert` - Restore versions
- `memory_branch` - Create branches
- `get_memory_status` - System stats

## Author

Marc Shade <marc@2acrestudios.com>
2 Acre Studios
