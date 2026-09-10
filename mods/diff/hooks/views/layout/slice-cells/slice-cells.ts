import { chargedWidth } from '../charged-width'
import type { CellsSplit } from './cells-split'

/**
 * The longest head of a line that fits a cell budget, cut between code
 * points, and what is left after it.
 *
 * The budget is spent by chargedWidth, at least one cell a code point, so
 * a head never holds more code points than cells: a line of ten thousand
 * combining marks still wraps.
 *
 * @param text a sanitized line
 * @param cells the room, at least one cell
 * @returns the head that fits, the budget it spent, and the remaining tail
 */
export function sliceCells(text: string, cells: number): CellsSplit {
  let spent = 0
  let taken = 0
  const characters = [...text]

  for (const character of characters) {
    const next = spent + chargedWidth(character)

    if (next > cells && taken > 0) {
      break
    }

    spent = next
    taken += 1
  }

  return {
    head: characters.slice(0, taken).join(''),
    spent,
    tail: characters.slice(taken).join(''),
  }
}
