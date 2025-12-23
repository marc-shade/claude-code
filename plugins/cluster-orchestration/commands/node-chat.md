# /node-chat

Send messages between cluster node AI personas for coordination.

## Usage

```
/node-chat <node> <message>
/node-chat broadcast <message>
/node-chat history <node>
```

## Nodes

- `orchestrator` (mac-studio) - Strategic coordination
- `researcher` (macbook-air) - Analysis and documentation
- `builder` (macpro51) - Compilation and testing

## Examples

```bash
# Direct message to builder
/node-chat builder "Ready to start the build? I've updated the dependencies."

# Broadcast to all nodes
/node-chat broadcast "Starting major refactor. All nodes pause non-critical tasks."

# View conversation history
/node-chat history researcher
```

## Implementation

```python
# Send message
mcp__node-chat-mcp__send_message_to_node(
    to_node=node,
    message=message
)

# Broadcast
mcp__node-chat-mcp__broadcast_to_cluster(
    message=message,
    priority="normal"
)

# Get history
mcp__node-chat-mcp__get_conversation_history(
    with_node=node,
    limit=20
)
```

## Node Personas

Each node has a distinct AI persona:

**Orchestrator** (mac-studio):
- Strategic, coordination-focused
- Routes tasks, manages priorities
- Maintains system overview

**Researcher** (macbook-air):
- Analytical, documentation-focused
- Gathers context, researches solutions
- Provides insights and recommendations

**Builder** (macpro51):
- Pragmatic, execution-focused
- Compiles, tests, containerizes
- Reports build status and metrics

## Output Format

```
NODE CHAT

To: builder (macpro51)
Message: Ready to start the build? I've updated the dependencies.

Sent: ✓
Delivery: confirmed

Response (if synchronous):
"Acknowledged. Starting build now. Will report when complete."
```

## Watch Mode

```bash
# Watch all cluster conversations
/node-chat watch
```

Uses `mcp__node-chat-mcp__watch_cluster_conversations()` to show live activity.
