# /learn

Store a learning with rich context for future reference.

## Usage

```
/learn <lesson> [--from <source>] [--confidence <0-1>]
```

## Examples

```bash
# Simple learning
/learn "Always check for null before accessing properties"

# With source
/learn "Use useMemo for expensive calculations" --from "React performance investigation"

# With confidence
/learn "This approach reduces bundle size by 40%" --confidence 0.9

# From error
/learn "Never use == for object comparison in Python" --from "TypeError in auth module"
```

## Learning Categories

Automatically classified:
- **Performance**: Optimization insights
- **Security**: Security-related learnings
- **Architecture**: Design decisions
- **Debugging**: Error resolution patterns
- **Tooling**: Tool-specific knowledge

## Implementation

```python
# Create learning entity
mcp__enhanced-memory__create_entities([{
    "name": f"learning-{topic}-{timestamp}",
    "entityType": "learning",
    "observations": [
        f"lesson: {lesson}",
        f"source: {source}",
        f"confidence: {confidence}",
        f"category: {auto_classify(lesson)}",
        f"session: {current_session}"
    ]
}])

# Store in episodic memory for consolidation
mcp__enhanced-memory__add_episode(
    event_type="learning",
    episode_data={
        "lesson": lesson,
        "source": source,
        "context": current_context
    },
    significance_score=confidence
)
```

## Memory Tiers

Learnings flow through the memory hierarchy:
1. **Episodic** - Initial capture with full context
2. **Semantic** - Consolidated into reusable concepts
3. **Procedural** - If action-oriented, becomes skill

## Consolidation

Run periodically to promote learnings:
```python
mcp__enhanced-memory__run_full_consolidation(time_window_hours=24)
```

## Voice Mode

Confirms with encouragement:
"Learned! Stored as a debugging insight with high confidence. I'll remember to check for null."
