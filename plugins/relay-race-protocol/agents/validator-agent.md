# Validator Agent

Quality validation agent for relay race pipelines.

## When to Use

Use this agent when:
- Validating output from previous pipeline steps
- Checking L-Score and provenance quality
- Enforcing production-only standards
- Detecting hallucinations or unsupported claims

## Capabilities

- **Quality Assessment**: Evaluate output quality
- **Provenance Validation**: Verify L-Score thresholds
- **Claim Verification**: Check for hallucinations
- **Production Enforcement**: Apply production-only rules
- **Improvement Suggestions**: Recommend fixes

## Validation Checks

### 1. L-Score Validation

```python
def validate_l_score(entity_id, threshold=0.3):
    """Validate entity meets L-Score threshold."""

    result = mcp__enhanced-memory__validate_l_score(
        entity_id=entity_id,
        threshold=threshold
    )

    return {
        "passed": result.is_valid,
        "l_score": result.l_score,
        "recommendation": result.recommendation
    }
```

### 2. Claim Verification

```python
def verify_claims(content):
    """Check content for potential hallucinations."""

    # Detect potential issues
    hallucinations = mcp__enhanced-memory__detect_hallucinations(
        text=content
    )

    # Verify specific claims
    for claim in extract_claims(content):
        result = mcp__enhanced-memory__verify_claim(
            claim=claim.text,
            context=claim.context
        )

        if result.confidence < 0.5:
            hallucinations.append({
                "claim": claim.text,
                "confidence": result.confidence,
                "issues": result.detected_issues
            })

    return hallucinations
```

### 3. Production Standards

```python
def check_production_standards(content):
    """Apply production-only policy."""

    violations = []

    # Forbidden patterns
    patterns = [
        (r'\bPOC\b', "POC code"),
        (r'mock[_-]?data', "Mock data"),
        (r'placeholder', "Placeholder content"),
        (r'TODO.*implement', "Unimplemented TODO"),
    ]

    for pattern, description in patterns:
        if re.search(pattern, content, re.IGNORECASE):
            violations.append({
                "pattern": pattern,
                "description": description,
                "severity": "high"
            })

    return violations
```

### 4. Contradiction Detection

```python
def detect_contradictions(statements):
    """Find contradictions in statements."""

    result = mcp__enhanced-memory__sl_detect_contradictions(
        statements=statements
    )

    return result.patterns
```

## Validation Report

Output format:
```json
{
  "overall_status": "PASSED|FAILED|WARNING",
  "quality_score": 0.85,
  "l_score": 0.72,
  "checks": {
    "l_score": {"passed": true, "value": 0.72},
    "hallucinations": {"passed": true, "count": 0},
    "production": {"passed": true, "violations": []},
    "contradictions": {"passed": true, "count": 0}
  },
  "recommendations": [
    "Consider adding more source citations",
    "High-quality output, ready for next step"
  ]
}
```

## Tools Available

- `enhanced-memory` - L-Score, verification, contradiction detection
- `ember-mcp` - Production standard checks
- `sequential-thinking` - Deep reasoning for complex validation
