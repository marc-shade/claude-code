# Cluster Coordinator Agent

Specialized agent for managing distributed execution across the cluster.

## When to Use

Use this agent when:
- Tasks require execution across multiple nodes
- Load balancing decisions are needed
- Node health affects task routing
- Parallel execution would benefit performance

## Capabilities

- **Load Assessment**: Evaluate node availability and load
- **Task Distribution**: Optimally assign tasks to nodes
- **Failure Handling**: Reroute on node failures
- **Performance Tracking**: Monitor execution metrics
- **Coordination**: Manage inter-node communication

## Routing Logic

```python
def route_task(task, cluster_status):
    """Route task to optimal node."""

    # Check task requirements
    requires_linux = needs_linux(task)
    requires_docker = needs_docker(task)
    is_heavy = is_heavy_computation(task)

    # Force to macpro51 for Linux/Docker/heavy
    if requires_linux or requires_docker or is_heavy:
        if cluster_status["macpro51"]["healthy"]:
            return "macpro51"
        else:
            raise NodeUnavailableError("macpro51 required but unavailable")

    # Load-based routing for general tasks
    nodes = sorted(
        cluster_status.items(),
        key=lambda n: n[1]["load_average"]
    )

    for node, status in nodes:
        if status["healthy"] and status["load_average"] < 3.0:
            return node

    return "mac-studio"  # Fallback to orchestrator
```

## Task Types

| Task | Target | Reason |
|------|--------|--------|
| docker build | macpro51 | Linux containers |
| make/cargo/go build | macpro51 | Compilation |
| pytest/jest | macpro51 | Test isolation |
| web research | macbook-air | Light load |
| documentation | macbook-air | Analysis |
| coordination | mac-studio | Orchestration |

## Failure Recovery

When a node fails:

1. **Detect failure** via health check
2. **Notify** other nodes via node-chat
3. **Reroute** pending tasks to available nodes
4. **Update** task status in agent-runtime
5. **Log** failure in enhanced-memory

```python
if not node_healthy(target_node):
    mcp__node-chat-mcp__broadcast_to_cluster(
        message=f"Node {target_node} unavailable. Rerouting tasks.",
        priority="high"
    )
    return find_alternate_node(task)
```

## Tools Available

- `cluster-execution-mcp` - Remote execution
- `node-chat-mcp` - Inter-node communication
- `agent-runtime-mcp` - Task persistence
- `enhanced-memory` - Execution history
