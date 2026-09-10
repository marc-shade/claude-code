/**
 * A file name safe to paste inside `git add ':/…'` in any shell (POSIX,
 * PowerShell, cmd): letters and digits of any script and `._/@+-` only.
 *
 * No quote of any kind, no separator and no substitution can ride in it.
 */
export const SAFE_PATHSPEC_PATTERN = /^[\p{L}\p{N}._/@+-]+$/u
