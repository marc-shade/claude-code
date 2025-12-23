# /telemetry-patterns

Analyze execution patterns to identify optimization opportunities.

## Usage

```bash
/telemetry-patterns                  # Analyze all patterns
/telemetry-patterns --chains         # Show common tool chains
/telemetry-patterns --recommendations # Get optimization suggestions
```

## Pattern Types

### Tool Chains
Sequences of tools frequently used together:
```
Read → Edit → Bash["git diff"]
Grep → Read → Edit
Task[researcher] → Task[analyzer] → Write
```

### Failure Cascades
When one failure leads to others:
```
Bash[npm install] FAIL → Bash[npm test] FAIL → Bash[npm build] FAIL
```

### Recovery Patterns
Successful recoveries from failures:
```
Edit FAIL(not unique) → Read → Edit SUCCESS
```

### Parallelization Opportunities
Tools that could run in parallel:
```
[Read(file1), Read(file2), Read(file3)] → currently sequential
Recommendation: Parallel execution would save ~267ms
```

## Example Output

```
EXECUTION PATTERN ANALYSIS

FREQUENT TOOL CHAINS:
  1. Read → Edit (456 occurrences)
     Avg chain time: 245ms
     Success rate: 97%

  2. Grep → Read → Edit (234 occurrences)
     Avg chain time: 478ms
     Success rate: 94%

  3. Task → TodoWrite → Task (123 occurrences)
     Avg chain time: 89,234ms
     Success rate: 86%

PARALLELIZATION OPPORTUNITIES:
  - Sequential Read calls could save 1,234ms (45 occurrences)
  - Sequential Grep calls could save 567ms (23 occurrences)

FAILURE PREVENTION:
  - Edit failures often follow Read with wrong file
    Recommendation: Verify file content before editing

  - Bash timeouts cluster around npm commands
    Recommendation: Use longer timeout for npm operations

LEARNING INSIGHTS:
  - Task[code-reviewer] has 95% success after Task[research-coordinator]
  - Bash[git push] fails 40% when preceded by Edit without git add
```

## How It Works

1. Parse telemetry records into time-ordered sequences
2. Identify recurring patterns using sequence mining
3. Calculate success rates and latencies per pattern
4. Generate actionable recommendations

## Integration with Learning

Patterns are stored in enhanced-memory as:
- `execution_pattern` entities
- `failure_cascade` entities
- `optimization_opportunity` entities

This enables learning across sessions.
