/**
 * One stretch of a drawn diff row: its text and whether the word diff
 * marks it as changed.
 */
export type Segment = {
  text: string
  isChanged: boolean
}
