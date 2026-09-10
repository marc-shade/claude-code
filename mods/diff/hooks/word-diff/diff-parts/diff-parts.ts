import { MAX_LCS_CELLS } from '../max-lcs-cells'
import type { WordPart } from '../word-part'

/**
 * The parts of a longest-common-subsequence diff of two token lists, in
 * order, adjacent parts of one kind merged.
 *
 * Null when the table would pass MAX_LCS_CELLS.
 *
 * @param before the removed line's tokens
 * @param after the added line's tokens
 * @returns the parts, or null for lines too long to compare
 */
export function diffParts(
  before: readonly string[],
  after: readonly string[],
): WordPart[] | null {
  const columns = after.length + 1

  if ((before.length + 1) * columns > MAX_LCS_CELLS) {
    return null
  }

  const lengths = new Uint32Array((before.length + 1) * columns)
  const at = (i: number, j: number) => lengths[i * columns + j] ?? 0

  for (let i = before.length - 1; i >= 0; i--) {
    for (let j = after.length - 1; j >= 0; j--) {
      const isMatch = before[i] === after[j]
      lengths[i * columns + j] = isMatch
        ? at(i + 1, j + 1) + 1
        : Math.max(at(i + 1, j), at(i, j + 1))
    }
  }

  const parts: WordPart[] = []

  function emit(text: string, kind: WordPart['kind']) {
    const last = parts.at(-1)

    if (last?.kind === kind) {
      last.text += text

      return
    }

    parts.push({ text, kind })
  }

  let i = 0
  let j = 0

  while (i < before.length || j < after.length) {
    const old = before[i]
    const fresh = after[j]
    const isSame = old !== undefined && old === fresh
    const isRemoved =
      !isSame &&
      old !== undefined &&
      (fresh === undefined || at(i + 1, j) >= at(i, j + 1))

    if (isSame) {
      emit(old, 'same')
      i += 1
      j += 1
    } else if (isRemoved) {
      emit(old, 'removed')
      i += 1
    } else if (fresh !== undefined) {
      emit(fresh, 'added')
      j += 1
    }
  }

  return parts
}
