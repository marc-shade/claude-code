# /context-profile

View and manage context profiles.

## Usage

```bash
/context-profile list              # List all profiles
/context-profile show coding       # Show profile contents
/context-profile stats             # Token statistics
```

## Actions

### list
Shows all available context profiles with descriptions.

### show <profile>
Displays the full contents of a specific profile.

### stats
Shows token usage statistics:
- Per-profile token counts
- Comparison to full CLAUDE.md
- Savings percentages

## Example Output

```
CONTEXT PROFILES

Profile       Tokens   Description
-----------   ------   -----------
coding        ~400     File editing, code generation
research      ~350     Codebase exploration
git           ~450     Commits, PRs, branches
voice         ~300     TTS/STT communication
cluster       ~350     Distributed execution
memory        ~400     Storage and recall

TOTAL (all):  ~2,250   vs CLAUDE.md: ~15,000 (85% reduction)
```

## Custom Profiles

Create new profiles in:
```
~/.claude/plugins/dynamic-context/profiles/
```

Profile format:
```markdown
# Profile Name Context Profile

Loaded when: <conditions>

## Section 1
Content...

## Section 2
Content...
```
