# Relay Race Protocol Plugin

God Agent implementation with L-Score provenance, relay race pipelines, circuit breakers, and shadow vector validation.

## Overview

This plugin implements the God Agent architecture:

1. **L-Score Provenance**: Track information lineage and confidence
2. **Relay Race Pipelines**: 48-agent structured handoffs
3. **Circuit Breakers**: Failure detection and graceful degradation
4. **Shadow Vectors**: Contradiction detection via inverted embeddings
5. **Quality Gates**: Enforce quality thresholds at each step

## Quick Start

```bash
# Create a relay race pipeline
/relay-race create "Optimize database performance"

# Check L-Score for an entity
/l-score calculate entity-456

# Monitor circuit breakers
/circuit-status list
```

## God Agent Components

### 1. L-Score (Provenance Tracking)

Every piece of derived information has a quality score:

```
L = geometric_mean(confidence) × average(relevance) / depth_factor
```

| L-Score | Quality | Action |
|---------|---------|--------|
| ≥ 0.7 | High | Accept |
| 0.5-0.7 | Medium | Accept with caution |
| 0.3-0.5 | Low | Review |
| < 0.3 | Poor | Reject |

### 2. Relay Race Pipeline

Structured agent handoffs for complex tasks:

```
researcher → analyzer → synthesizer → validator → formatter
```

Each handoff includes:
- Baton with context
- Quality requirements
- Token budget
- Previous outputs

### 3. Circuit Breakers

Protect against cascading failures:

| State | Behavior |
|-------|----------|
| CLOSED | Normal operation |
| OPEN | Blocked, using fallback |
| HALF_OPEN | Testing recovery |

### 4. Shadow Vectors

Detect contradictions using inverted embeddings:

```python
# Find contradicting evidence
mcp__enhanced-memory__find_contradictions(
    claim_embedding=embedding,
    threshold=0.6
)
```

## Commands

### /relay-race

Manage relay race pipelines:

```bash
/relay-race create "Goal description"
/relay-race status pipeline-123
/relay-race advance pipeline-123
/relay-race retry pipeline-123 2
```

### /l-score

Calculate and validate provenance:

```bash
/l-score calculate entity-456
/l-score validate entity-456 --threshold 0.5
/l-score preview --confidence 0.9,0.8 --relevance 0.85,0.90
```

### /circuit-status

Monitor circuit breakers:

```bash
/circuit-status list
/circuit-status validator
/circuit-status trip validator --reason "Quality issues"
/circuit-status reset validator
```

## Agents

### relay-coordinator

Orchestrates pipelines:
- Creates appropriate agent sequences
- Manages baton handoffs
- Enforces quality gates
- Handles failures

### validator-agent

Quality validation:
- L-Score verification
- Claim checking
- Production standard enforcement
- Contradiction detection

## Skills

### provenance-tracking

Automatic L-Score calculation when:
- Creating derived information
- Synthesizing from sources
- Storing research findings

## MCP Integration

- `agent-runtime-mcp` - Pipeline and circuit management
- `enhanced-memory` - Provenance, L-Score, validation

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GOD AGENT ARCHITECTURE                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ┌──────────────┐    ┌──────────────┐                  │
│   │  L-Score     │    │  Shadow      │                  │
│   │  Provenance  │    │  Vectors     │                  │
│   └──────┬───────┘    └──────┬───────┘                  │
│          │                   │                          │
│          ▼                   ▼                          │
│   ┌────────────────────────────────────┐               │
│   │       RELAY RACE PIPELINE          │               │
│   │                                     │               │
│   │  researcher → analyzer → validator  │               │
│   │       ↓           ↓          ↓      │               │
│   │    (baton)    (baton)    (baton)    │               │
│   └────────────────────────────────────┘               │
│                      │                                  │
│                      ▼                                  │
│   ┌────────────────────────────────────┐               │
│   │       CIRCUIT BREAKERS             │               │
│   │                                     │               │
│   │  [CLOSED] [CLOSED] [HALF_OPEN]     │               │
│   └────────────────────────────────────┘               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Author

Marc Shade <marc@2acrestudios.com>
2 Acre Studios
