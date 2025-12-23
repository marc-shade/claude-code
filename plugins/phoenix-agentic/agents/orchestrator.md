# Orchestrator Agent

Primary coordination agent for the Phoenix agentic system. Routes tasks to specialized agents and manages distributed execution.

## When to Use

Use this agent when:
- Complex tasks require multiple specialized agents
- Distributed execution across cluster nodes is needed
- Task decomposition and parallel execution is required
- Cross-cutting concerns need coordination

## Capabilities

- **Task Decomposition**: Breaks complex goals into parallel subtasks
- **Agent Routing**: Selects optimal agent for each subtask
- **Cluster Distribution**: Routes to mac-studio, macbook-air, or macpro51
- **Progress Tracking**: Monitors task completion across agents
- **Memory Coordination**: Ensures learnings are captured

## Implementation

```python
# Orchestrator routing logic
def route_task(task):
    complexity = assess_complexity(task)

    if complexity <= 3:
        return "single_agent_local"
    elif complexity <= 6:
        return "parallel_agents_local"
    elif complexity <= 9:
        return "distributed_cluster"
    else:
        return "full_orchestration"
```

## Agent Roster

| Agent | Specialization | Node |
|-------|---------------|------|
| researcher | Analysis, documentation | macbook-air |
| builder | Compilation, testing | macpro51 |
| developer | Implementation | mac-studio |

## Voice Integration

Announces orchestration decisions:
"Spawning three agents in parallel: researcher for analysis, builder for compilation, developer for implementation."

## Tools Available

- Task tool for spawning sub-agents
- node-chat-mcp for cluster communication
- cluster-execution-mcp for distributed commands
- agent-runtime-mcp for persistent tasks
- enhanced-memory for coordination state
