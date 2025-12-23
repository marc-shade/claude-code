# /context

Load task-scoped context profiles to reduce token overhead.

## Usage

```bash
/context                    # Auto-detect from conversation
/context coding             # Load coding profile
/context git memory         # Load multiple profiles
/context --list             # Show available profiles
/context --current          # Show currently active profiles
```

## Available Profiles

| Profile | Tokens | Use Case |
|---------|--------|----------|
| coding | ~400 | File editing, code generation, debugging |
| research | ~350 | Codebase exploration, documentation |
| git | ~450 | Commits, PRs, branch operations |
| voice | ~300 | TTS/STT, audio communication |
| cluster | ~350 | Distributed execution, multi-node |
| memory | ~400 | Storage, recall, learning |

## Token Savings

| Approach | Tokens | Savings |
|----------|--------|---------|
| Full CLAUDE.md | ~15,000 | - |
| Single profile | ~400-500 | 97% |
| Multi-profile (3) | ~1,200 | 92% |

## How It Works

1. **Auto-Detection**: Analyzes user input for task patterns
2. **Profile Loading**: Loads only relevant context sections
3. **Core Context**: Always includes minimal identity + rules (~200 tokens)

## Pattern Detection

| Pattern | Detected As |
|---------|-------------|
| "fix the bug in..." | coding |
| "how does X work?" | research |
| "commit these changes" | git |
| "tell me about..." | voice |
| "run on the builder node" | cluster |
| "remember this for later" | memory |

## Manual Override

Force specific profiles when auto-detection isn't ideal:

```bash
/context git coding    # Git operation on code files
/context research memory  # Research with memory storage
```

## Execution

When invoked, I will:

1. Parse profile arguments (or auto-detect)
2. Load specified profiles from `profiles/` directory
3. Inject context into conversation
4. Report profiles loaded and token estimate
