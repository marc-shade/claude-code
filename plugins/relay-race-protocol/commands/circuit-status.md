# /circuit-status

Monitor circuit breaker status for agent health and failure recovery.

## Usage

```
/circuit-status [agent_id]
/circuit-status list
/circuit-status trip <agent_id> [--reason <reason>]
/circuit-status reset <agent_id>
```

## Circuit States

| State | Description | Behavior |
|-------|-------------|----------|
| CLOSED | Healthy | Normal operation |
| OPEN | Tripped | Requests blocked, using fallback |
| HALF_OPEN | Testing | Limited requests to test recovery |

## Check All Circuits

```bash
/circuit-status list
```

Output:
```
CIRCUIT BREAKER STATUS

┌────────────────┬──────────┬──────────┬────────────┐
│ Agent          │ State    │ Failures │ Fallback   │
├────────────────┼──────────┼──────────┼────────────┤
│ researcher     │ CLOSED   │ 0/5      │ generalist │
│ analyzer       │ CLOSED   │ 1/5      │ generalist │
│ synthesizer    │ HALF_OPEN│ 4/5      │ generalist │
│ validator      │ OPEN     │ 5/5      │ generalist │
│ formatter      │ CLOSED   │ 0/5      │ generalist │
└────────────────┴──────────┴──────────┴────────────┘

Open Circuits: 1 (validator)
Half-Open: 1 (synthesizer)
Last Trip: validator at 14:23 (timeout)
```

## Implementation

```python
# Check single agent
status = mcp__agent-runtime-mcp__circuit_breaker_status(
    agent_id="validator"
)

# List all circuits
all_circuits = mcp__agent-runtime-mcp__circuit_breaker_list()

# Record failure
mcp__agent-runtime-mcp__circuit_breaker_record_failure(
    agent_id="validator",
    failure_type="timeout",
    error_message="Agent did not respond within 60s"
)

# Record success (helps recovery)
mcp__agent-runtime-mcp__circuit_breaker_record_success(
    agent_id="synthesizer"
)
```

## Manual Controls

### Trip Circuit

```bash
/circuit-status trip validator --reason "Quality issues detected"
```

```python
mcp__agent-runtime-mcp__circuit_breaker_trip(
    agent_id="validator",
    reason="Quality issues detected"
)
```

### Reset Circuit

```bash
/circuit-status reset validator
```

```python
mcp__agent-runtime-mcp__circuit_breaker_reset(
    agent_id="validator"
)
```

## Configuration

```python
mcp__agent-runtime-mcp__circuit_breaker_configure(
    agent_id="validator",
    failure_threshold=5,      # Failures before trip
    window_seconds=60,        # Sliding window
    cooldown_seconds=300,     # Time before half-open
    fallback_agent="generalist"
)
```

## Failure Types

| Type | Description |
|------|-------------|
| timeout | Agent didn't respond in time |
| exception | Runtime error |
| quality_failure | Output below threshold |
| resource_exhausted | Token/memory limit |
| rate_limited | API rate limit |
| invalid_output | Malformed response |

## Voice Mode

Alerts on circuit changes:
"Warning: Validator circuit is now open. Five consecutive failures. Routing to fallback agent."
