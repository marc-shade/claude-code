import type Types from '../types'

/**
 * Rows grouped into runs of one kind, in order.
 *
 * @param rows the laid-out rows
 * @returns the runs
 */
export function runsOf(rows: readonly Types.Row[]): Types.Run[] {
  const runs: Types.Run[] = []
  let start = 0

  rows.forEach((row, at) => {
    const isRunEnd = rows[at + 1]?.kind !== row.kind

    if (isRunEnd) {
      runs.push({ kind: row.kind, rows: rows.slice(start, at + 1) })
      start = at + 1
    }
  })

  return runs
}
