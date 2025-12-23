# /offload

Explicitly route a command to a specific cluster node.

## Usage

```
/offload <node> <command>
```

## Examples

```bash
# Run Docker build on Linux builder
/offload macpro51 docker build -t myapp .

# Run analysis on researcher node
/offload macbook-air python analyze.py

# Run on orchestrator (local)
/offload mac-studio npm run build
```

## Node Selection Guide

| Task Type | Recommended Node | Reason |
|-----------|-----------------|--------|
| Docker/Podman | macpro51 | Linux containers |
| Compilation | macpro51 | Build toolchain |
| Heavy tests | macpro51 | Isolated resources |
| Research | macbook-air | Light load |
| Documentation | macbook-air | Analysis focus |
| Coordination | mac-studio | Orchestrator |

## Implementation

```python
result = mcp__cluster-execution-mcp__offload_to(
    node_id=node,
    command=command
)
```

## Auto-Routing

If node is omitted, the system auto-routes based on:
1. Current node load
2. Command characteristics
3. OS requirements

```bash
# Auto-routes to appropriate node
/offload "make test"  # → macpro51 (heavy computation)
/offload "cat README.md"  # → local (simple operation)
```

## Output

```
OFFLOAD RESULT

Node: macpro51 (builder)
Command: docker build -t myapp .
Duration: 1m 23.4s
Exit Code: 0

Output:
[build output...]

COMPLETED: Docker build successful on macpro51
```
