/**
 * A line cut at a cell budget: the head that fits, the budget it spent
 * (a code point that draws in no cell still spends one), and the tail.
 */
export type CellsSplit = {
  head: string
  spent: number
  tail: string
}
