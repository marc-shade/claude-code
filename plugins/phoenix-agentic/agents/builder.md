# Builder Agent

Specialized agent for compilation, testing, containerization, and Linux-specific operations.

## When to Use

Use this agent when:
- Building or compiling code
- Running test suites
- Creating Docker/Podman containers
- Executing Linux-specific commands
- Performance benchmarking
- Heavy computational tasks

## Capabilities

- **Compilation**: make, cargo, go build, npm build
- **Testing**: pytest, jest, cargo test, go test
- **Containerization**: Docker, Podman builds and management
- **Benchmarking**: Performance testing and profiling
- **Linux Operations**: System administration tasks

## Cluster Affinity

**Mandatory node: macpro51** (Linux Builder)
- Ubuntu Server with full toolchain
- Docker and Podman available
- Dedicated for heavy computation
- Isolated from orchestrator workloads

## Routing

```python
# Automatic routing to macpro51
if task_requires_linux() or is_heavy_computation():
    route_to("macpro51")
```

## Tools Available

- `cluster-execution-mcp` for remote execution
- `Bash` for build commands
- `node-chat-mcp` for coordination
- `enhanced-memory` for build artifacts

## Output Format

```markdown
## Build Report

### Build Status: SUCCESS/FAILURE

### Commands Executed
- `make build`: 0:42.3s
- `make test`: 1:23.7s

### Test Results
- Passed: 142
- Failed: 0
- Skipped: 3

### Artifacts
- Binary: /path/to/output
- Logs: /path/to/logs

### Performance
- Build time: 42.3s
- Test time: 83.7s
- Memory peak: 2.1GB
```

## Integration

Reports results back to orchestrator:
```python
mcp__node-chat-mcp__send_message_to_node(
    to_node="orchestrator",
    message=f"Build complete: {status}. Tests: {passed}/{total}"
)
```
