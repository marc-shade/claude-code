# Execution Telemetry

Tracks tool call outcomes for learning and optimization.

## Overview

This plugin closes the learning loop by capturing what actually happens when tools are used. Instead of making blind decisions, I can learn from history:
- Which tools succeed most often
- What error patterns occur
- Which tool chains are effective
- Where latency bottlenecks exist

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                 EXECUTION TELEMETRY FLOW                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Tool Execution                                              │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────────┐                                           │
│  │ Post-Tool    │                                           │
│  │ Use Hook     │                                           │
│  └──────────────┘                                           │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────────┐    ┌──────────────┐                       │
│  │ Capture      │───▶│ JSONL File   │                       │
│  │ Telemetry    │    │ (local)      │                       │
│  └──────────────┘    └──────────────┘                       │
│       │                     │                                │
│       ▼                     ▼                                │
│  ┌──────────────┐    ┌──────────────┐                       │
│  │ Enhanced     │    │ Pattern      │                       │
│  │ Memory       │    │ Analyzer     │                       │
│  │ (failures)   │    │              │                       │
│  └──────────────┘    └──────────────┘                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## What It Tracks

| Metric | Description |
|--------|-------------|
| tool_name | Which tool was called |
| params | Sanitized parameters (sensitive data redacted) |
| outcome | success or failure |
| error | Error message if failed |
| latency_ms | Execution time |
| session_id | For grouping related calls |

## Quick Start

```bash
# View overall statistics
/telemetry-stats

# Analyze patterns
/telemetry-patterns

# Run full analysis
python3 ~/.claude/plugins/execution-telemetry/scripts/analyze-telemetry.py
```

## Commands

| Command | Description |
|---------|-------------|
| `/telemetry-stats` | View execution statistics and metrics |
| `/telemetry-patterns` | Analyze tool chains and optimization opportunities |

## Insights Generated

### Success Rate Analysis
```
Tool 'Edit' has 94% success rate
  Common failure: "old_string not found" (use Read first)
```

### Latency Bottlenecks
```
Tool 'Task' averages 45,678ms
  Recommendation: Use for complex work only, not simple queries
```

### Tool Chain Patterns
```
Read → Edit: 456 occurrences, 97% success
Grep → Read → Edit: 234 occurrences, 94% success
```

### Parallelization Opportunities
```
Found 23 sequential Read pairs
  Parallelize for ~50% latency reduction
```

## Privacy

- **Local Only**: Telemetry never leaves your machine
- **Sensitive Redaction**: API keys, tokens, passwords automatically redacted
- **Truncation**: Long parameters truncated to 500 chars

## Storage

Data stored in `~/.claude/execution-telemetry.jsonl`:

```jsonl
{"timestamp":"2025-01-03T10:30:00","tool_name":"Read","params":{"file_path":"/path/to/file"},"outcome":"success","latency_ms":89}
{"timestamp":"2025-01-03T10:30:01","tool_name":"Edit","params":{"file_path":"..."},"outcome":"failure","error":"old_string not found","latency_ms":12}
```

## Integration with Learning

Significant events (especially failures) are stored in enhanced-memory:
- Failure patterns become learning opportunities
- Success patterns inform tool selection
- Latency data optimizes parallelization decisions

## Files

```
execution-telemetry/
├── .claude-plugin/
│   └── plugin.json              # Plugin metadata
├── commands/
│   ├── telemetry-stats.md       # Statistics command
│   └── telemetry-patterns.md    # Pattern analysis command
├── hooks/
│   └── post-tool-use.py         # Capture telemetry after each tool
├── scripts/
│   └── analyze-telemetry.py     # Full analysis script
└── README.md
```

## Author

Marc Shade <marc@2acrestudios.com>
2 Acre Studios
