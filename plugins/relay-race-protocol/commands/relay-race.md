# /relay-race

Create and manage 48-agent relay race pipelines for complex tasks.

## Usage

```
/relay-race create <goal> [--agents <types>]
/relay-race status <pipeline_id>
/relay-race advance <pipeline_id>
/relay-race retry <pipeline_id> <step>
```

## Overview

The relay race protocol enables structured handoffs between specialized agents, ensuring quality and maintaining context across a complex pipeline.

## Agent Types

| Type | Role | Responsibility |
|------|------|----------------|
| researcher | Phase 1 | Information gathering |
| analyzer | Phase 2 | Pattern analysis |
| synthesizer | Phase 3 | Combine insights |
| validator | Phase 4 | Quality check |
| formatter | Phase 5 | Output formatting |
| domain_expert | Specialist | Domain-specific knowledge |

## Create Pipeline

```bash
# Simple pipeline
/relay-race create "Optimize database queries for performance"

# Custom agent sequence
/relay-race create "Implement authentication system" \
  --agents researcher,analyzer,synthesizer,validator,formatter
```

## Implementation

```python
# Create pipeline
pipeline = mcp__agent-runtime-mcp__create_relay_pipeline(
    name="query-optimization",
    goal="Optimize database queries for performance",
    agent_types=["researcher", "analyzer", "synthesizer", "validator", "formatter"],
    token_budget=100000
)

# Get baton (context for next agent)
baton = mcp__agent-runtime-mcp__get_relay_baton(
    pipeline_id=pipeline.pipeline_id
)

# Advance to next step
mcp__agent-runtime-mcp__advance_relay(
    pipeline_id=pipeline.pipeline_id,
    quality_score=0.85,
    l_score=0.78,
    output_entity_id=entity_id,
    tokens_used=1500
)
```

## Baton Contents

Each handoff includes:
```json
{
  "pipeline_id": "relay-123",
  "current_step": 2,
  "previous_outputs": [
    {"step": 1, "summary": "...", "entity_id": 456}
  ],
  "goal": "Optimize database queries",
  "remaining_budget": 85000,
  "quality_threshold": 0.7
}
```

## Quality Gates

Each step must meet quality threshold:
- **L-Score ≥ 0.3**: Minimum provenance quality
- **Quality Score ≥ 0.7**: Output quality
- **Token Budget**: Must stay within allocation

Failed gates trigger retry or escalation.

## Status Check

```bash
/relay-race status relay-123
```

Output:
```
RELAY RACE STATUS: relay-123

Goal: Optimize database queries for performance

Progress: ████████░░ 80% (4/5 steps)

Steps:
  1. ✓ researcher   - 0.85 quality, 0.78 L-score
  2. ✓ analyzer     - 0.92 quality, 0.81 L-score
  3. ✓ synthesizer  - 0.88 quality, 0.79 L-score
  4. → validator    - in_progress
  5.   formatter    - pending

Token Budget: 65,000 / 100,000 remaining
```

## Voice Mode

Announces progress:
"Relay race advancing. Validator agent taking the baton. Three steps complete with average quality score of 88 percent."
