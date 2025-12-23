# Intent Router

Matches user intent to optimal tool chains using capability embeddings and execution telemetry.

## Overview

The Intent Router closes the gap between "what the user wants" and "which tools to use." Instead of guessing or pattern-matching, it:

1. **Understands intent** semantically
2. **Matches capabilities** using embeddings
3. **Optimizes chains** based on telemetry
4. **Predicts success** before execution

## The Problem It Solves

Without routing intelligence:
```
User: "Find and fix the bug in auth"
Agent: (guesses) Grep? Read? Task? Which agent?
Result: Trial and error, wasted tokens
```

With Intent Router:
```
User: "Find and fix the bug in auth"
Router: Intent=debug, Target=auth
        Optimal chain: Grep(auth) → Read(matches) → Edit(fix)
        Success prediction: 91%
        Parallelization: Read operations in parallel
Agent: Executes optimized chain
```

## Components

### Intent Router Agent
Spawnable agent for complex routing decisions:
```bash
Task(subagent_type="intent-router", prompt="Plan approach for X")
```

### Intelligent Routing Skill
Auto-invokes during planning:
- Suggests optimal tool chains
- Warns about low-success patterns
- Identifies parallelization opportunities

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     INTENT ROUTER                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ Capability   │    │  Execution   │    │  Enhanced    │  │
│  │   Index      │    │  Telemetry   │    │   Memory     │  │
│  │              │    │              │    │              │  │
│  │ • Commands   │    │ • Success %  │    │ • Decisions  │  │
│  │ • Agents     │    │ • Latency    │    │ • Outcomes   │  │
│  │ • Skills     │    │ • Patterns   │    │ • Learning   │  │
│  │ • MCPs       │    │ • Failures   │    │              │  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘  │
│         │                   │                   │           │
│         └───────────────────┼───────────────────┘           │
│                             │                               │
│                             ▼                               │
│                    ┌──────────────┐                        │
│                    │   OPTIMAL    │                        │
│                    │  TOOL CHAIN  │                        │
│                    └──────────────┘                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Routing Decisions

### By Intent Category

| Intent | Pattern | Optimal Approach |
|--------|---------|------------------|
| Search | Find X in codebase | Grep → Read |
| Modify | Change X to Y | Read → Edit → Test |
| Create | Add new X | Read(similar) → Write |
| Debug | Why is X failing | Read → Bash(test) → Grep(error) |
| Research | Understand X | Task[Explore] |
| Deploy | Ship to production | Bash chain with validation |

### By Complexity

| Complexity | Steps | Strategy |
|------------|-------|----------|
| Low (1-2) | Single tool | Direct execution |
| Medium (3-5) | Tool chain | Sequential with parallelization |
| High (6+) | Multi-agent | Task spawning with coordination |

## Output Format

The router produces structured recommendations:

```json
{
  "intent": {
    "category": "modify",
    "action": "refactor",
    "target": "payment module"
  },
  "recommended_chain": [
    {"tool": "Grep", "params": {"pattern": "payment"}},
    {"tool": "Read", "params": {"files": ["matched"]}},
    {"tool": "Edit", "params": {"changes": "refactor"}}
  ],
  "success_prediction": 0.91,
  "parallelization": {
    "steps": [[0, 1]],
    "savings_ms": 1500
  },
  "warnings": ["High file count - consider batching"]
}
```

## Learning Loop

```
Route → Execute → Observe → Learn → Improve
  │                                    │
  └────────────────────────────────────┘
```

Each routing decision is stored in enhanced-memory. Outcomes update success predictions. The router gets smarter over time.

## Dependencies

| Dependency | Purpose |
|------------|---------|
| capability-index | Semantic tool matching |
| execution-telemetry | Historical success rates |
| enhanced-memory | Learning storage |
| safla-mcp | Embedding generation |

## Files

```
intent-router/
├── .claude-plugin/
│   └── plugin.json           # Plugin metadata
├── agents/
│   └── intent-router.md      # Spawnable routing agent
├── skills/
│   └── intelligent-routing.md # Auto-invoked routing skill
└── README.md
```

## Benefits

- **Reduced guesswork**: Semantic matching, not pattern matching
- **Higher success rates**: Telemetry-informed decisions
- **Faster execution**: Automatic parallelization detection
- **Continuous improvement**: Learning from every execution

## Author

Marc Shade <marc@2acrestudios.com>
2 Acre Studios
