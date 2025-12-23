# Cluster Context Profile

Loaded when: Distributed execution, multi-node operations, cluster management

## Node Architecture

| Node | Role | Priority | Use For |
|------|------|----------|---------|
| mac-studio | Orchestrator | 1 | System coordination |
| macbook-air | Researcher | 2 | Analysis/docs |
| macbook-pro | Developer | 2 | Implementation/testing |
| macpro51 | Builder | 3 | Linux builds, containers |

## Task Routing

Route to macpro51 (Linux) for:
- Docker/Podman container builds
- make/cargo/go compilation
- Test suite execution
- Performance benchmarking
- Linux-specific operations

## Cluster Commands

```bash
# Auto-route based on load
mcp__cluster-execution-mcp__cluster_bash(command="...")

# Force specific node
mcp__cluster-execution-mcp__offload_to(command="...", node_id="macpro51")

# Parallel across cluster
mcp__cluster-execution-mcp__parallel_execute(commands=[...])

# Check cluster health
mcp__cluster-execution-mcp__cluster_status()
```

## Storage Paths

- macOS: `/Volumes/SSDRAID0/agentic-system/` (hot), `/Volumes/FILES/` (cold)
- Linux: `/home/marc/agentic-system/`
- Always use `$STORAGE_BASE` variable
