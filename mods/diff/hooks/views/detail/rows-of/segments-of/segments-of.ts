import { wordDiff } from '../../../../word-diff'
import type Layout from '../../../layout'
import type Types from '../../types'

/**
 * A line's content as segments: one plain segment, or, for a paired line
 * whose word diff holds, its own side's parts with the changed ones marked.
 *
 * @param line the numbered line
 * @returns the segments in order
 */
export function segmentsOf(line: Types.DiffLine): Layout.Segment[] {
  const plain = [{ text: line.text, isChanged: false }]

  if (line.pairedText === null || line.kind === 'context') {
    return plain
  }

  const isRemoved = line.kind === 'removed'
  const parts = isRemoved
    ? wordDiff(line.text, line.pairedText)
    : wordDiff(line.pairedText, line.text)
  const ownSide = isRemoved ? 'removed' : 'added'

  if (!parts) {
    return plain
  }

  return parts
    .filter(part => part.kind === 'same' || part.kind === ownSide)
    .map(part => ({ text: part.text, isChanged: part.kind === ownSide }))
}
