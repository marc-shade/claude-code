import type { Segment } from '../segment'
import { sliceCells } from '../slice-cells'

/**
 * A line's segments laid into rows of at most a cell budget, a segment
 * split where a row fills, so each row draws as exactly one terminal row.
 *
 * A row holds no more code points than cells (sliceCells' spending), and
 * a continuation can sit under an empty gutter.
 *
 * @param segments the line's segments in order
 * @param cells the room per row, at least one cell
 * @returns the rows; one empty row for an empty line
 */
export function wrapSegments(
  segments: readonly Segment[],
  cells: number,
): Segment[][] {
  const rows: Segment[][] = []
  let row: Segment[] = []
  let used = 0

  for (const segment of segments) {
    let rest = segment.text

    while (rest !== '') {
      const split = sliceCells(rest, Math.max(1, cells - used))
      row.push({ text: split.head, isChanged: segment.isChanged })
      used += split.spent
      rest = split.tail

      if (rest !== '' || used >= cells) {
        rows.push(row)
        row = []
        used = 0
      }
    }
  }

  const isRowPending = row.length > 0 || rows.length === 0

  return isRowPending ? [...rows, row] : rows
}
