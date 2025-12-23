# /cluster-status

Display real-time status of all cluster nodes with load metrics and availability.

## Usage

```
/cluster-status [node]
```

## Nodes

| Node | Role | OS | Specialization |
|------|------|-----|----------------|
| mac-studio | Orchestrator | macOS ARM64 | Coordination, primary agent |
| macbook-air | Researcher | macOS ARM64 | Analysis, documentation |
| macpro51 | Builder | Linux x86_64 | Docker, compilation, testing |

## Implementation

1. **Query cluster-execution-mcp**
   ```python
   status = mcp__cluster-execution-mcp__cluster_status()
   ```

2. **Parse node metrics**
   For each node:
   - CPU usage percentage
   - Memory usage percentage
   - 1-minute load average
   - Active task count
   - Health status

3. **Query node-chat-mcp for awareness**
   ```python
   awareness = mcp__node-chat-mcp__get_cluster_awareness()
   ```

4. **Display conversation state**
   - Active conversations between nodes
   - Recent messages
   - Pending coordination tasks

## Output Format

```
CLUSTER STATUS

┌─────────────┬──────────────┬─────┬─────┬───────┬────────┐
│ Node        │ Role         │ CPU │ MEM │ Load  │ Status │
├─────────────┼──────────────┼─────┼─────┼───────┼────────┤
│ mac-studio  │ Orchestrator │ 23% │ 45% │ 1.2   │ ✓ OK   │
│ macbook-air │ Researcher   │ 12% │ 32% │ 0.8   │ ✓ OK   │
│ macpro51    │ Builder      │ 45% │ 67% │ 2.4   │ ✓ OK   │
└─────────────┴──────────────┴─────┴─────┴───────┴────────┘

Active Tasks: 3
- macpro51: Running pytest (2m 34s)
- macbook-air: Research analysis (idle)

Conversations: 2 active
- orchestrator ↔ builder: Build coordination
- orchestrator ↔ researcher: Context gathering
```

## Voice Mode

Announces summary:
"Cluster healthy. Three nodes online. Mac Pro running tests at 45% CPU. Two active conversations."
