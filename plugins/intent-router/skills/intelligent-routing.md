# Intelligent Routing Skill

Automatic tool chain optimization based on intent analysis.

## Auto-Invocation

This skill activates when:
- Planning multi-step tasks
- Selecting between multiple tool options
- Optimizing execution strategy
- Choosing between direct tools vs agent spawning

## Core Principle

**Before executing, route intelligently**:

1. Parse the user's intent
2. Match against capability index
3. Check execution telemetry
4. Build optimal tool chain
5. Execute with confidence

## Routing Decision Tree

```
User Request
    │
    ▼
┌─────────────────┐
│ Is it simple?   │──YES──▶ Direct Tool
│ (single step)   │         (Read/Write/Bash)
└────────┬────────┘
         │NO
         ▼
┌─────────────────┐
│ Needs research? │──YES──▶ Task[Explore]
│                 │
└────────┬────────┘
         │NO
         ▼
┌─────────────────┐
│ Multiple files? │──YES──▶ Parallel Tools
│                 │         [Read×N, Edit×N]
└────────┬────────┘
         │NO
         ▼
┌─────────────────┐
│ High complexity?│──YES──▶ Specialized Agent
│ (>5 steps)      │         Task[code-reviewer]
└────────┬────────┘
         │NO
         ▼
    Sequential Chain
```

## Telemetry-Informed Decisions

### Success Rate Thresholds

| Chain Pattern | Historical Success | Action |
|---------------|-------------------|--------|
| Read → Edit | >95% | Proceed normally |
| Edit (without Read) | 67% | Add Read first |
| Bash[npm install] | 91% | Increase timeout |
| Task[complex] | 88% | Add retry logic |

### Latency Optimization

| Pattern | Observation | Optimization |
|---------|-------------|--------------|
| Sequential Reads | Adds 50ms each | Parallelize |
| Sequential Greps | Adds 100ms each | Parallelize |
| Task spawning | 2-10s overhead | Use only for complex work |

## Capability Index Integration

When uncertain about tools:

```python
# Search for matching capabilities
results = search_capability_index("memory management")

# Returns:
# 1. /remember (command) - 0.92 match
# 2. enhanced-memory (MCP) - 0.89 match
# 3. provenance-tracking (skill) - 0.84 match
```

## Example Routing Decisions

### Simple: "Read the config file"
```
Route: Read(file_path)
Reason: Single step, direct tool optimal
```

### Medium: "Update all imports in src/"
```
Route: Grep(import) → [Read, Edit]×N (parallel)
Reason: Batch operation, parallelizable
Telemetry: Similar operations have 94% success
```

### Complex: "Refactor authentication to use OAuth"
```
Route: Task[code-architect] for planning
       → Task[code-explorer] for analysis
       → Sequential edits with validation
       → Task[code-reviewer] for quality check
Reason: High complexity (>10 steps)
Telemetry: Architect-first approach has 91% success
```

## Anti-Patterns to Avoid

| Anti-Pattern | Why | Better Approach |
|--------------|-----|-----------------|
| Edit without Read | 67% success | Always Read first |
| Task for simple search | 10s+ overhead | Use Grep directly |
| Sequential when parallel possible | Wasted time | Parallelize |
| Guessing tool names | May miss better options | Search capability index |

## Learning Integration

Store routing decisions for improvement:

```python
mcp__enhanced-memory__create_entities([{
    "name": f"routing-decision-{timestamp}",
    "entityType": "routing_decision",
    "observations": [
        f"intent: {intent}",
        f"chosen_chain: {tools}",
        f"success_prediction: {prediction}",
        f"actual_outcome: {outcome}"
    ]
}])
```

## Metrics Tracked

- Routing accuracy (predicted vs actual success)
- Latency prediction accuracy
- Parallelization opportunities detected
- Agent spawn decisions

## Best Practices

1. **Always check telemetry** before complex chains
2. **Parallelize aggressively** for independent operations
3. **Read before Edit** - reduces failures by 40%
4. **Use agents for complexity** - not for convenience
5. **Learn from failures** - update predictions
