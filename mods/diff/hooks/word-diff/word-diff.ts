import { CHANGE_THRESHOLD } from './change-threshold'
import { diffParts } from './diff-parts'
import { tokensOf } from './tokens-of'
import type { WordPart } from './word-part'

/**
 * The word-level diff of a removed line and the added line paired with it,
 * or null when the pair reads as a rewrite or is too long to compare.
 *
 * A rewrite changed more than CHANGE_THRESHOLD of its characters; the
 * caller then draws both lines plain (the engine's fallback diff rule).
 *
 * @param removed the removed line's text, marker dropped
 * @param added the added line's text, marker dropped
 * @returns the parts in order, or null
 */
export function wordDiff(removed: string, added: string): WordPart[] | null {
  const parts = diffParts(tokensOf(removed), tokensOf(added))

  if (!parts) {
    return null
  }

  const total = removed.length + added.length
  const changed = parts
    .filter(part => part.kind !== 'same')
    .reduce((sum, part) => sum + part.text.length, 0)

  return total > 0 && changed / total > CHANGE_THRESHOLD ? null : parts
}
