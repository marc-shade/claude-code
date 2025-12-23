# Cluster Orchestration Plugin

Distributed execution across the 2 Acre Studios cluster: mac-studio, macbook-air, and macpro51.

## Overview

This plugin provides commands and agents for:
- Viewing cluster status and health
- Routing commands to specific nodes
- Parallel execution across nodes
- Inter-node AI persona communication

## Cluster Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLUSTER TOPOLOGY                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ┌──────────────┐                                      │
│   │  mac-studio  │  Orchestrator                        │
│   │  (ARM64)     │  - Primary coordination              │
│   │              │  - Agent spawning                     │
│   └──────┬───────┘  - System oversight                  │
│          │                                               │
│    ┌─────┴─────┐                                        │
│    │           │                                        │
│  ┌─┴────────┐ ┌┴───────────┐                           │
│  │macbook-  │ │  macpro51  │                           │
│  │  air     │ │  (x86_64)  │                           │
│  │ (ARM64)  │ │            │                           │
│  │          │ │  Builder   │                           │
│  │Researcher│ │  - Docker  │                           │
│  │- Analysis│ │  - Builds  │                           │
│  │- Docs    │ │  - Tests   │                           │
│  └──────────┘ └────────────┘                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Commands

### /cluster-status

Display real-time status of all cluster nodes.

```bash
/cluster-status           # All nodes
/cluster-status macpro51  # Specific node
```

### /offload

Route command to specific node.

```bash
/offload macpro51 docker build -t myapp .
/offload macbook-air python analyze.py
```

### /parallel-exec

Execute commands in parallel across nodes.

```bash
/parallel-exec "pytest" | "npm test" | "cargo test"
```

### /node-chat

Inter-node AI persona communication.

```bash
/node-chat builder "Ready to start build?"
/node-chat broadcast "Starting refactor"
/node-chat history researcher
```

## Agents

### cluster-coordinator

Manages distributed execution:
- Load assessment
- Task distribution
- Failure handling
- Performance tracking

## Skills

### distributed-execution

Auto-detects commands that should be distributed:
- Linux-specific → macpro51
- Heavy computation → macpro51
- Parallelizable → multi-node

## MCP Dependencies

- `cluster-execution-mcp` - Remote command execution
- `node-chat-mcp` - Inter-node messaging

## Node Capabilities

| Node | OS | Arch | Specializations |
|------|----|------|-----------------|
| mac-studio | macOS | ARM64 | Orchestration, coordination |
| macbook-air | macOS | ARM64 | Research, analysis |
| macpro51 | Linux | x86_64 | Docker, builds, tests |

## Storage Paths

```bash
# macOS nodes
/Volumes/SSDRAID0/agentic-system/  # Hot storage
/Volumes/FILES/agentic-system/     # Cold storage (backup)

# Linux node (macpro51)
/home/marc/agentic-system/
```

## Auto-Routing

Commands are automatically routed based on:

1. **OS Requirements**: Linux commands → macpro51
2. **Resource Needs**: Heavy tasks → macpro51
3. **Current Load**: Balance across available nodes
4. **Specialization**: Match task to node role

## Author

Marc Shade <marc@2acrestudios.com>
2 Acre Studios
