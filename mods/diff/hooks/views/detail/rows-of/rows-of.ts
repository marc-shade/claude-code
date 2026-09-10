import { countOf } from '../../../count-of'
import Layout from '../../layout'
import type Types from '../types'
import { MAX_HIGHLIGHTS } from './max-highlights'
import { segmentsOf } from './segments-of'

/**
 * Numbered lines laid into terminal rows: a long line wraps onto
 * continuation rows with an empty gutter.
 *
 * Word highlights stop once MAX_HIGHLIGHTS are spent, keeping the tree
 * under its node cap.
 *
 * @param lines the numbered lines
 * @param cells the content's room per row after gutter and marker, one at
 *   least
 * @returns the rows in drawing order
 */
export function rowsOf(
  lines: readonly Types.DiffLine[],
  cells: number,
): Types.Row[] {
  const rows: Types.Row[] = []
  let highlights = 0

  for (const line of lines) {
    const marked = segmentsOf(line)
    const wanted = countOf(marked, segment => segment.isChanged)
    const isAffordable = highlights + wanted <= MAX_HIGHLIGHTS
    highlights += isAffordable ? wanted : 0
    const segments = isAffordable
      ? marked
      : [{ text: line.text, isChanged: false }]
    const marker =
      line.kind === 'added' ? '+' : line.kind === 'removed' ? '-' : ' '

    Layout.wrapSegments(segments, cells).forEach((wrapped, at) => {
      rows.push({
        kind: line.kind,
        gutter: at === 0 ? String(line.lineNumber) : '',
        marker: at === 0 ? marker : ' ',
        segments: wrapped,
      })
    })
  }

  return rows
}
