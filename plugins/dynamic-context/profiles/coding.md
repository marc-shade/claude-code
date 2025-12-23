# Coding Context Profile

Loaded when: File editing, code generation, debugging, refactoring

## Core Standards

- Production-ready code only (no POCs, demos, mocks)
- Proper error handling with specific exception types
- Follow existing patterns in the codebase
- Be explicit about incomplete work

## Tool Priorities

1. **Read** before Edit (always)
2. **Parallel reads** when multiple files needed
3. **Task[Explore]** for codebase understanding
4. **Grep/Glob** for search, not Bash

## Anti-Patterns

- Edit without Read (67% success rate)
- Sequential reads when parallel possible
- Agent spawning for simple operations
- Guessing file paths

## Quality Gates

- Test before claiming completion
- Verify with actual execution
- Check logs for errors
- Validate output correctness
