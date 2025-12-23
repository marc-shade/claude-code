# Distributed Execution Skill

Automatic skill for optimizing command execution across the cluster.

## Auto-Invocation

This skill activates when:
- Heavy computational tasks are detected
- Linux-specific commands are needed
- Docker/container operations are requested
- Multiple independent commands can run in parallel

## Detection Patterns

### Linux Required
```
docker|podman|apt|yum|systemctl|journalctl
```

### Heavy Computation
```
make|cargo build|go build|npm run build|pytest|jest|gradle
```

### Parallelizable
```
Multiple file operations
Independent test suites
Batch processing
```

## Routing Decision Tree

```
Is command Linux-specific?
├─ YES → Route to macpro51
└─ NO → Is it heavy computation?
    ├─ YES → Route to macpro51
    └─ NO → Is current node overloaded?
        ├─ YES → Route to least loaded node
        └─ NO → Execute locally
```

## Implementation

```python
def should_distribute(command):
    """Determine if command should be distributed."""

    linux_patterns = [
        r'\bdocker\b', r'\bpodman\b', r'\bapt\b',
        r'\bsystemctl\b', r'\bjournalctl\b'
    ]

    heavy_patterns = [
        r'\bmake\b', r'\bcargo\s+build\b', r'\bgo\s+build\b',
        r'\bnpm\s+run\s+build\b', r'\bpytest\b', r'\bjest\b'
    ]

    for pattern in linux_patterns:
        if re.search(pattern, command):
            return True, "macpro51", "linux_required"

    for pattern in heavy_patterns:
        if re.search(pattern, command):
            return True, "macpro51", "heavy_computation"

    return False, None, None
```

## Parallel Detection

When multiple commands are requested:

```python
def can_parallelize(commands):
    """Check if commands can run in parallel."""

    # No dependencies between commands
    # No shared file writes
    # Different target directories

    for i, cmd1 in enumerate(commands):
        for cmd2 in commands[i+1:]:
            if has_dependency(cmd1, cmd2):
                return False
    return True
```

## Voice Announcements

When distributing:
"Routing build to Mac Pro for Docker execution."
"Running three test suites in parallel across the cluster."
"Heavy compilation detected, offloading to builder node."
