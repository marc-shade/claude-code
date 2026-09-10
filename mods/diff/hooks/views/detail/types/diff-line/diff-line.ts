import type { LineKind } from '../line-kind'

/**
 * One hunk line ready to lay out: its side, its gutter's line number, its
 * sanitized text, and the paired line's text for a word diff, if any.
 *
 * The number is the new file's for context and added lines, the old
 * file's for removed ones; a removed line pairs with its added counterpart.
 */
export type DiffLine = {
  kind: LineKind
  lineNumber: number
  text: string
  pairedText: string | null
}
