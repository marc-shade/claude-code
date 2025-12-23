# /parallel-exec

Execute multiple commands in parallel across cluster nodes.

## Usage

```
/parallel-exec <command1> | <command2> | <command3>
```

## Examples

```bash
# Run tests on all platforms
/parallel-exec "pytest tests/" | "npm test" | "cargo test"

# Parallel builds
/parallel-exec "make -C frontend" | "make -C backend" | "make -C docs"

# Multi-file analysis
/parallel-exec "grep -r 'TODO' src/" | "grep -r 'FIXME' src/" | "grep -r 'HACK' src/"
```

## Implementation

```python
commands = parse_pipe_separated(input)

results = mcp__cluster-execution-mcp__parallel_execute(
    commands=commands
)
```

## Distribution Strategy

Commands are automatically distributed based on:
1. **Node availability**: Skip overloaded nodes
2. **Command type**: Route appropriately
3. **Load balancing**: Spread across nodes

## Output Format

```
PARALLEL EXECUTION

Commands: 3
Distribution:
  - macpro51: pytest tests/
  - mac-studio: npm test
  - macbook-air: cargo test

Results:
┌────────────┬─────────────────┬──────────┬───────┐
│ Node       │ Command         │ Duration │ Exit  │
├────────────┼─────────────────┼──────────┼───────┤
│ macpro51   │ pytest tests/   │ 45.2s    │ 0     │
│ mac-studio │ npm test        │ 23.1s    │ 0     │
│ macbook-air│ cargo test      │ 12.8s    │ 0     │
└────────────┴─────────────────┴──────────┴───────┘

Total Time: 45.2s (parallel)
Sequential Would Be: 81.1s
Speedup: 1.8x

COMPLETED: All parallel commands succeeded
```

## Error Handling

If any command fails:
1. Report failure with output
2. Continue other commands
3. Summarize at end

```
PARALLEL EXECUTION - PARTIAL FAILURE

Failed: 1/3
- macpro51: pytest tests/ - Exit 1
  Error: 2 tests failed

Succeeded: 2/3
- mac-studio: npm test - Exit 0
- macbook-air: cargo test - Exit 0
```
