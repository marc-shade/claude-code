# /forget

Remove or archive memories that are no longer relevant.

## Usage

```
/forget <query> [--confirm] [--archive]
```

## Examples

```bash
# Forget specific memory (shows confirmation)
/forget "old API endpoint"

# Skip confirmation (dangerous)
/forget "deprecated pattern" --confirm

# Archive instead of delete (safer)
/forget "outdated decision" --archive
```

## Safety Features

### Confirmation Required
By default, shows matches and requires confirmation:

```
FORGET - Confirmation Required

Matches found:
1. [fact] "The API endpoint is /api/v1/users" (2024-01-15)
2. [fact] "Old API at /api/legacy/users" (2023-12-01)

Type 'confirm' to forget these memories, or 'cancel' to abort.
```

### Archive Option
Instead of deleting, moves to archive tier:
```python
# Create archived version
mcp__enhanced-memory__memory_branch(
    entity_name=memory_id,
    branch_name="archived",
    description="Archived by /forget command"
)
```

## Implementation

```python
# Search for matches
matches = mcp__enhanced-memory__search_nodes(query=query)

if not confirm:
    return show_confirmation(matches)

# For each match
for match in matches:
    if archive:
        # Branch to archive
        mcp__enhanced-memory__memory_branch(
            entity_name=match.name,
            branch_name="archived"
        )
    else:
        # Actually delete (if supported)
        pass  # enhanced-memory may not support delete
```

## Reversibility

Archived memories can be restored:
```python
mcp__enhanced-memory__memory_revert(
    entity_name=memory_id,
    version=last_active_version
)
```

## Voice Mode

Asks for confirmation:
"Found 2 memories about old API. Say 'confirm' to forget them, or 'cancel' to keep them."
