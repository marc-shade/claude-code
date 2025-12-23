# /telemetry-stats

View execution telemetry statistics and performance metrics.

## Usage

```bash
/telemetry-stats              # Show overall stats
/telemetry-stats --tool Read  # Stats for specific tool
/telemetry-stats --failures   # Show failure patterns
/telemetry-stats --slow       # Show slowest operations
```

## What It Shows

### Overall Statistics
- Total tool calls
- Success rate percentage
- Average latency
- Most used tools
- Failure hotspots

### Per-Tool Metrics
- Call count
- Success/failure ratio
- Average/p50/p95 latency
- Common error patterns

### Pattern Analysis
- Frequently failing tool combinations
- Slow tool chains
- Recovery patterns after failures

## Example Output

```
EXECUTION TELEMETRY STATISTICS

Period: Last 7 days
Total Calls: 2,847

OVERALL:
  Success Rate: 94.2%
  Avg Latency: 342ms
  P95 Latency: 1,247ms

TOP TOOLS BY USAGE:
  1. Read          (823 calls, 98% success, 89ms avg)
  2. Bash          (612 calls, 91% success, 1,203ms avg)
  3. Write         (445 calls, 99% success, 156ms avg)
  4. Grep          (398 calls, 96% success, 234ms avg)
  5. Task          (287 calls, 88% success, 45,678ms avg)

FAILURE HOTSPOTS:
  1. Bash: "command not found" (23 occurrences)
  2. Task: "agent timeout" (18 occurrences)
  3. Edit: "old_string not found" (12 occurrences)

SLOW OPERATIONS (>5s):
  1. Task[research-coordinator]: 89,234ms
  2. Bash[npm install]: 34,567ms
  3. WebFetch[large-page]: 12,456ms
```

## Data Source

Telemetry is stored in `~/.claude/execution-telemetry.jsonl`

Each record contains:
- timestamp
- tool_name
- params (sanitized)
- outcome (success/failure)
- error message (if failed)
- latency_ms
- session_id

## Execution

When this command is invoked, I will:

1. Read telemetry from ~/.claude/execution-telemetry.jsonl
2. Aggregate statistics by tool and time period
3. Identify patterns and anomalies
4. Present actionable insights

## Privacy

- Sensitive parameters (API keys, tokens) are redacted
- Long parameters are truncated
- Telemetry stays local (never transmitted)
