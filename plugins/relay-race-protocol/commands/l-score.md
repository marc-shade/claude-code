# /l-score

Calculate and validate L-Score (provenance quality) for information.

## Usage

```
/l-score calculate <entity_id>
/l-score validate <entity_id> [--threshold <0-1>]
/l-score preview --confidence <values> --relevance <values>
```

## What is L-Score?

L-Score measures the provenance quality of derived information:

```
L = geometric_mean(confidence) × average(relevance) / depth_factor
```

Where:
- **Confidence**: How certain are the sources?
- **Relevance**: How applicable are the sources?
- **Depth**: How many derivation steps from original?

## Thresholds

| L-Score | Quality | Action |
|---------|---------|--------|
| ≥ 0.7 | High | Accept confidently |
| 0.5-0.7 | Medium | Accept with note |
| 0.3-0.5 | Low | Review recommended |
| < 0.3 | Poor | Reject or verify |

## Calculate L-Score

```bash
/l-score calculate entity-456
```

Output:
```
L-SCORE ANALYSIS

Entity: entity-456
Content: "Database queries should use indexes"

Sources:
  1. PostgreSQL Documentation (confidence: 0.95, relevance: 0.90)
  2. Performance Analysis (confidence: 0.85, relevance: 0.88)
  3. Code Review Notes (confidence: 0.75, relevance: 0.92)

Calculation:
  Geometric Mean (confidence): 0.85
  Average (relevance): 0.90
  Depth Factor: 1.2

L-Score: 0.74 (HIGH QUALITY)

Recommendation: Accept confidently
```

## Implementation

```python
# Get provenance chain
chain = mcp__enhanced-memory__get_provenance_chain(
    entity_id=entity_id,
    max_depth=5
)

# Validate L-Score
validation = mcp__enhanced-memory__validate_l_score(
    entity_id=entity_id,
    threshold=0.3
)

# Preview calculation
preview = mcp__enhanced-memory__calculate_l_score_preview(
    confidence_scores=[0.95, 0.85, 0.75],
    relevance_scores=[0.90, 0.88, 0.92],
    depth=2
)
```

## Creating Provenance

When deriving new information:

```python
mcp__enhanced-memory__create_entity_with_provenance(
    entity_id=new_entity_id,
    source_ids=[source1, source2, source3],
    confidence=0.85,
    relevance=0.90,
    derivation_method="synthesis"
)
```

## Derivation Methods

| Method | Description | Typical Confidence |
|--------|-------------|-------------------|
| inference | Logical derivation | 0.7-0.9 |
| extraction | Direct extraction | 0.8-0.95 |
| synthesis | Combined sources | 0.6-0.85 |
| citation | Referenced source | 0.9-1.0 |

## Voice Mode

Announces result:
"L-Score is point-seven-four, high quality. Three sources with good confidence and relevance. Safe to accept."
