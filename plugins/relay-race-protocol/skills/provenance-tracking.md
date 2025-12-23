# Provenance Tracking Skill

Automatic L-Score calculation and provenance maintenance.

## Auto-Invocation

This skill activates when:
- Creating derived information
- Synthesizing from multiple sources
- Storing research findings
- Generating analysis outputs

## Core Principle

Every piece of derived information should have tracked provenance:

```
L = geometric_mean(confidence) × average(relevance) / depth_factor
```

## Automatic Tracking

When creating new entities from sources:

```python
# 1. Create entity with provenance
mcp__enhanced-memory__create_entity_with_provenance(
    entity_id=new_entity_id,
    source_ids=[source1_id, source2_id],
    confidence=calculate_confidence(sources),
    relevance=calculate_relevance(sources, topic),
    derivation_method="synthesis"
)

# 2. Validate L-Score
validation = mcp__enhanced-memory__validate_l_score(
    entity_id=new_entity_id,
    threshold=0.3
)

# 3. Log if below threshold
if not validation.is_valid:
    log_warning(f"Low L-Score: {validation.l_score}")
```

## Confidence Calculation

| Source Type | Base Confidence |
|-------------|-----------------|
| Official documentation | 0.95 |
| Peer-reviewed paper | 0.90 |
| Code analysis | 0.85 |
| Expert opinion | 0.80 |
| Community resource | 0.70 |
| Inferred/Synthesized | 0.60 |

## Relevance Calculation

| Relevance Factor | Weight |
|------------------|--------|
| Direct match | 1.0 |
| Same domain | 0.9 |
| Related domain | 0.7 |
| General applicability | 0.5 |
| Tangential | 0.3 |

## Depth Factor

Derivation chains reduce L-Score:
- Depth 1: factor = 1.0
- Depth 2: factor = 1.2
- Depth 3: factor = 1.5
- Depth 4+: factor = 2.0

## Chain Visualization

```python
chain = mcp__enhanced-memory__get_provenance_chain(
    entity_id=entity_id,
    max_depth=5
)
```

Output:
```
Provenance Chain for entity-789

entity-789 (L=0.72, synthesis)
├── entity-456 (L=0.85, extraction)
│   └── PostgreSQL Docs (confidence: 0.95)
└── entity-123 (L=0.80, inference)
    ├── Code Analysis (confidence: 0.85)
    └── Performance Tests (confidence: 0.82)
```

## Best Practices

1. **Always cite sources** - Never create without source_ids
2. **Honest confidence** - Don't inflate confidence scores
3. **Track depth** - Be aware of derivation chains
4. **Validate regularly** - Check L-Scores before using
5. **Document method** - Use appropriate derivation_method
