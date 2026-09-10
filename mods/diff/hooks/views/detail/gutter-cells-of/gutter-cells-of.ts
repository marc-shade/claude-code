import type Types from '../types'

/**
 * How wide the line-number gutter is for these lines: the longest number's
 * digits and one leading cell (StructuredDiff's digits + 1).
 *
 * @param lines the numbered lines
 * @returns the gutter's width in cells
 */
export const gutterCellsOf = (lines: readonly Types.DiffLine[]) =>
  String(lines.reduce((most, line) => Math.max(most, line.lineNumber), 0))
    .length + 1
