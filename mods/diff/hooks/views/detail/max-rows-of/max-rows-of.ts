import Layout from '../../layout'
import type { BodyCells } from '../hunk-body/body-cells'
import { MARKER_CELLS } from '../marker-cells'
import { MAX_BODY_CHARS } from '../max-body-chars'
import { MAX_BODY_NODES } from '../max-body-nodes'
import { MAX_RUN_CHARS } from '../max-run-chars'
import type Types from '../types'
import { FRAME_NODES } from './frame-nodes'
import { HIGHLIGHT_NODES } from './highlight-nodes'
import { RUN_NODES } from './run-nodes'

/**
 * How many of these rows the body may draw under MAX_BODY_CHARS and
 * MAX_BODY_NODES, counted as the host counts what hunkBody draws.
 *
 * A row costs its gutter, marker, segments and padding in UTF-16 units (an
 * astral letter costs two); a change of kind opens a run (a Text and its
 * string), a highlight is three nodes, the gutter and long runs split.
 *
 * @param rows the laid-out rows, in order
 * @param cells the gutter's and the content's widths
 * @returns the count of leading rows whose drawn tree fits both budgets
 */
export function maxRowsOf(rows: readonly Types.Row[], cells: BodyCells) {
  let chars = 0
  let nodes = FRAME_NODES
  let kept = 0
  let kind: Types.LineKind | undefined

  for (const row of rows) {
    let units = 0
    let charged = 0
    let highlights = 0

    for (const segment of row.segments) {
      units += segment.text.length
      charged += Layout.chargedWidth(segment.text)
      highlights += segment.isChanged ? 1 : 0
    }

    chars +=
      cells.gutterCells +
      2 +
      MARKER_CELLS +
      units +
      Math.max(0, cells.contentCells - charged)
    nodes += (row.kind === kind ? 0 : RUN_NODES) + highlights * HIGHLIGHT_NODES
    kind = row.kind
    const splits = Math.ceil((2 * chars) / MAX_RUN_CHARS)

    if (chars > MAX_BODY_CHARS || nodes + splits > MAX_BODY_NODES) {
      return kept
    }

    kept += 1
  }

  return kept
}
