# Dynamic Context Plugin

Task-scoped context loading that reduces token overhead from ~15,000 to ~400-1,200 tokens per task.

## Problem Solved

The full CLAUDE.md loads ~15,000 tokens every turn, but most tasks only need a fraction of that context. This plugin loads task-specific context profiles based on what you're actually doing.

## Token Savings

| Scenario | Tokens | Savings |
|----------|--------|---------|
| Full CLAUDE.md | ~15,000 | baseline |
| Single task profile | ~400-500 | 97% |
| Multi-profile (2) | ~800 | 95% |
| Complex workflow (3+) | ~1,200 | 92% |

## How It Works

1. **Task Detection**: Analyzes user input for task patterns
2. **Profile Loading**: Loads only relevant context sections
3. **Core Context**: Always includes minimal identity + rules (~200 tokens)

## Available Profiles

| Profile | Tokens | Use Case |
|---------|--------|----------|
| `coding` | ~400 | File editing, code generation, debugging |
| `research` | ~350 | Codebase exploration, documentation |
| `git` | ~450 | Commits, PRs, branch operations |
| `voice` | ~300 | TTS/STT, audio communication |
| `cluster` | ~350 | Distributed execution, multi-node |
| `memory` | ~400 | Storage, recall, learning |

## Task Detection Patterns

The context loader automatically detects task types:

```
"fix the bug in..." → coding
"how does X work?" → research
"commit these changes" → git
"tell me about..." → voice
"run on the builder node" → cluster
"remember this for later" → memory
```

## Commands

### `/context`
Load task-scoped context profiles:
```bash
/context                    # Auto-detect from conversation
/context coding             # Load coding profile
/context git memory         # Load multiple profiles
/context --list             # Show available profiles
/context --current          # Show currently active profiles
```

### `/context-profile`
Manage context profiles:
```bash
/context-profile list       # List all profiles
/context-profile show coding  # Show profile contents
/context-profile stats      # Token statistics
```

## Skill: Context-Aware

Auto-invokes when:
- Starting a new task type
- Switching between task domains
- Context seems insufficient for current task

## Files

```
dynamic-context/
├── .claude-plugin/
│   └── plugin.json         # Plugin metadata
├── profiles/
│   ├── coding.md           # Coding task context
│   ├── research.md         # Research task context
│   ├── git.md              # Git operations context
│   ├── voice.md            # Voice operations context
│   ├── cluster.md          # Cluster operations context
│   └── memory.md           # Memory operations context
├── scripts/
│   └── context-loader.py   # Task detection and loading
├── commands/
│   ├── context.md          # Manual context loading
│   └── context-profile.md  # Profile management
├── skills/
│   └── context-aware.md    # Auto-invocation skill
└── README.md
```

## Custom Profiles

Create new profiles in `~/.claude/plugins/dynamic-context/profiles/`:

```markdown
# Profile Name Context Profile

Loaded when: <conditions>

## Section 1
Content...

## Section 2
Content...
```

## Integration

Works with other friction reduction plugins:
- **capability-index**: Finds relevant tools for task
- **intent-router**: Routes to optimal tool chain
- **execution-telemetry**: Tracks context effectiveness
