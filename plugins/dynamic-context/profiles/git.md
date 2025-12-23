# Git Context Profile

Loaded when: Commits, PRs, branch operations, git history

## Git Safety Protocol

- NEVER update git config
- NEVER use destructive commands (push --force, hard reset) unless explicit
- NEVER skip hooks (--no-verify) unless explicit
- NEVER force push to main/master
- Avoid git commit --amend unless specific conditions met

## Commit Protocol

1. Run `git status` and `git diff` in parallel
2. Analyze all staged changes
3. Draft concise commit message (1-2 sentences, "why" not "what")
4. Use HEREDOC format for message
5. Include footer:
   ```
   Generated with [Claude Code](https://claude.com/claude-code)
   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
   ```

## PR Protocol

1. Check git status, diff, and log in parallel
2. Analyze ALL commits on branch (not just latest)
3. Create with `gh pr create` using HEREDOC for body
4. Include Summary and Test Plan sections
5. Return PR URL when done

## Forbidden

- Interactive flags (-i)
- Amending pushed commits
- Committing without explicit request
- Committing secrets (.env, credentials)
