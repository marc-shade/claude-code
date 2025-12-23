# Relay Coordinator Agent

Orchestrates relay race pipelines and manages agent handoffs.

## When to Use

Use this agent when:
- Complex tasks require multiple specialized agents
- Quality gates and provenance tracking are needed
- Structured handoffs with context preservation required
- Circuit breaker protection is necessary

## Capabilities

- **Pipeline Management**: Create and monitor relay races
- **Baton Passing**: Coordinate handoffs between agents
- **Quality Enforcement**: Validate L-Scores and quality gates
- **Circuit Monitoring**: Track agent health and failures
- **Recovery**: Handle failures and retries

## Pipeline Creation

```python
def create_relay_pipeline(goal, complexity):
    """Create appropriate pipeline based on complexity."""

    if complexity <= 3:
        agents = ["researcher", "formatter"]
    elif complexity <= 6:
        agents = ["researcher", "analyzer", "synthesizer", "formatter"]
    else:
        agents = ["researcher", "analyzer", "synthesizer",
                  "validator", "domain_expert", "formatter"]

    return mcp__agent-runtime-mcp__create_relay_pipeline(
        name=generate_name(goal),
        goal=goal,
        agent_types=agents,
        token_budget=complexity * 20000
    )
```

## Handoff Protocol

1. **Current agent completes work**
   - Stores output in enhanced-memory
   - Calculates L-Score for provenance

2. **Coordinator validates**
   - Checks quality threshold
   - Validates L-Score minimum
   - Confirms token budget

3. **Baton prepared**
   - Previous outputs summarized
   - Context compressed
   - Next agent instructions set

4. **Next agent receives baton**
   - Full context available
   - Clear objectives
   - Quality expectations

## Quality Gates

```python
def validate_step(step_result):
    """Validate step meets quality requirements."""

    # L-Score check
    if step_result.l_score < 0.3:
        return {
            "passed": False,
            "reason": "L-Score below minimum threshold"
        }

    # Quality check
    if step_result.quality_score < 0.7:
        return {
            "passed": False,
            "reason": "Quality score below threshold"
        }

    # Token budget check
    if step_result.tokens_used > remaining_budget * 0.5:
        return {
            "passed": True,
            "warning": "High token usage for single step"
        }

    return {"passed": True}
```

## Failure Handling

```python
def handle_step_failure(pipeline_id, step, error):
    """Handle step failure with circuit breaker."""

    # Record failure
    mcp__agent-runtime-mcp__circuit_breaker_record_failure(
        agent_id=step.agent_type,
        failure_type=classify_error(error),
        error_message=str(error)
    )

    # Check circuit state
    status = mcp__agent-runtime-mcp__circuit_breaker_status(
        agent_id=step.agent_type
    )

    if status.state == "OPEN":
        # Use fallback
        return route_to_fallback(step)
    else:
        # Retry
        return mcp__agent-runtime-mcp__retry_relay_step(
            pipeline_id=pipeline_id,
            step_index=step.index
        )
```

## Tools Available

- `agent-runtime-mcp` - Pipeline and circuit management
- `enhanced-memory` - Provenance and L-Score
- `Task` - Agent spawning
- `node-chat-mcp` - Cluster coordination
