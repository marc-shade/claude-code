# Context-Aware Skill

Automatic task-scoped context loading for optimal token efficiency.

## Auto-Invocation

This skill activates when:
- Starting a new task type
- Switching between task domains
- Context seems insufficient for current task
- User asks about capabilities

## Detection Patterns

### Coding Tasks
```
Triggers: edit, write, fix, refactor, implement, bug, error
Loads: coding profile (~400 tokens)
```

### Research Tasks
```
Triggers: find, search, understand, explain, how does, what is
Loads: research profile (~350 tokens)
```

### Git Tasks
```
Triggers: commit, push, pull, merge, PR, branch
Loads: git profile (~450 tokens)
```

### Voice Tasks
```
Triggers: speak, say, tell, voice, listen, audio
Loads: voice profile (~300 tokens)
```

### Cluster Tasks
```
Triggers: cluster, node, distributed, parallel, docker
Loads: cluster profile (~350 tokens)
```

### Memory Tasks
```
Triggers: remember, recall, forget, store, entity, l-score
Loads: memory profile (~400 tokens)
```

## Multi-Profile Loading

Complex tasks may need multiple profiles:

| Task | Profiles |
|------|----------|
| "Commit my code changes" | git + coding |
| "Find and fix the auth bug" | research + coding |
| "Tell me about the cluster status" | voice + cluster |
| "Remember this code pattern" | memory + coding |

## Token Budget

| Scenario | Profiles | Tokens | vs Full |
|----------|----------|--------|---------|
| Single task | 1 | ~400 | 97% savings |
| Related tasks | 2 | ~800 | 95% savings |
| Complex workflow | 3+ | ~1,200 | 92% savings |
| Full CLAUDE.md | all | ~15,000 | baseline |

## Best Practices

1. **Start minimal**: Single profile for focused tasks
2. **Add as needed**: Load additional profiles when scope expands
3. **Trust detection**: Auto-detection works for most cases
4. **Override rarely**: Use `/context` only when detection fails

## Integration

Works with:
- **capability-index**: Finds relevant tools for task
- **intent-router**: Routes to optimal tool chain
- **execution-telemetry**: Tracks context effectiveness
