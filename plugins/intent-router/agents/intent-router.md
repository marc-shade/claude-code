# Intent Router Agent

Matches user intent to optimal tool chains using capability embeddings and execution telemetry.

## When to Use

Use this agent when:
- Planning complex multi-step tasks
- Uncertain which tools are best for a task
- Optimizing execution strategy
- Learning from past successes/failures

## Capabilities

- **Intent Analysis**: Parse user request into structured intent
- **Capability Matching**: Find tools that match intent semantically
- **Chain Optimization**: Build optimal tool sequences based on telemetry
- **Success Prediction**: Estimate success probability for proposed chains
- **Parallel Detection**: Identify opportunities for parallel execution

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    INTENT ROUTING FLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User Request                                                │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────────┐                                           │
│  │ Extract      │                                           │
│  │ Intent       │                                           │
│  └──────────────┘                                           │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────────┐    ┌──────────────┐                       │
│  │ Semantic     │◄───│ Capability   │                       │
│  │ Match        │    │ Index        │                       │
│  └──────────────┘    └──────────────┘                       │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────────┐    ┌──────────────┐                       │
│  │ Build Tool   │◄───│ Execution    │                       │
│  │ Chain        │    │ Telemetry    │                       │
│  └──────────────┘    └──────────────┘                       │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────────┐                                           │
│  │ Optimize     │                                           │
│  │ (parallel?)  │                                           │
│  └──────────────┘                                           │
│       │                                                      │
│       ▼                                                      │
│  RECOMMENDED APPROACH                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Intent Categories

| Category | Example | Primary Tools |
|----------|---------|---------------|
| Search | "find all usages of X" | Grep, Glob, Read |
| Modify | "update function Y" | Read, Edit, Write |
| Create | "add new feature Z" | Read, Write, Bash |
| Debug | "why is this failing" | Read, Grep, Bash |
| Research | "understand codebase" | Task[Explore], Read |
| Deploy | "push to production" | Bash, Task |

## Output Format

```json
{
  "intent": {
    "category": "modify",
    "action": "refactor",
    "target": "authentication module",
    "constraints": ["maintain API compatibility"]
  },
  "recommended_approach": {
    "strategy": "sequential",
    "tools": [
      {"tool": "Grep", "purpose": "find all auth usages"},
      {"tool": "Read", "purpose": "understand current implementation"},
      {"tool": "Edit", "purpose": "apply refactoring"},
      {"tool": "Bash", "purpose": "run tests"}
    ],
    "estimated_success": 0.92,
    "estimated_duration_ms": 45000
  },
  "alternatives": [
    {
      "strategy": "agent-based",
      "tools": [{"tool": "Task[code-reviewer]"}],
      "estimated_success": 0.88,
      "tradeoff": "slower but more thorough"
    }
  ],
  "parallelization": {
    "opportunity": true,
    "parallel_steps": [[0, 1]],
    "savings_ms": 1200
  },
  "warnings": [
    "Previous Edit failures on this file type (67% success rate)"
  ]
}
```

## Integration Points

### Capability Index
```python
# Semantic search for matching tools
capabilities = search_capability_index(
    query=user_intent,
    limit=10
)
```

### Execution Telemetry
```python
# Get historical success rates for proposed chain
chain_stats = get_chain_success_rate(
    tools=["Grep", "Read", "Edit"]
)
```

### Enhanced Memory
```python
# Store successful routing decisions
mcp__enhanced-memory__create_entities([{
    "name": f"routing-{timestamp}",
    "entityType": "routing_decision",
    "observations": [intent, chosen_chain, outcome]
}])
```

## Tools Available

- **Read/Write/Edit/MultiEdit**: File operations
- **Bash**: Shell commands
- **Grep/Glob**: Search operations
- **Task**: Agent spawning
- **TodoWrite**: Progress tracking
- **enhanced-memory**: Learning storage
- **safla-mcp**: Embedding generation

## Learning Loop

1. **Route**: Match intent to tools
2. **Execute**: Run the tool chain
3. **Observe**: Capture telemetry
4. **Learn**: Update success predictions
5. **Improve**: Refine routing decisions

## Example Routing Decisions

### "Fix the failing test"
```
Intent: debug
Recommended: Read(test) → Read(source) → Edit(source) → Bash(run test)
Parallel: Read operations can run in parallel
Success prediction: 89%
```

### "Add logging to all API endpoints"
```
Intent: modify (batch)
Recommended: Grep(endpoints) → [Read, Edit]×N
Warning: Large batch operation - consider Task[code-reviewer] after
Success prediction: 94%
```

### "Understand how auth works"
```
Intent: research
Recommended: Task[Explore] with subagent_type=Explore
Alternative: Grep(auth) → Read(files) if quick answer needed
Success prediction: 97%
```
