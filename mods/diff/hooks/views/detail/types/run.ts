import type { LineKind } from './line-kind'
import type { Row } from './row'

/**
 * Consecutive rows of one kind, drawn as one Text so a long file stays far
 * under the tree's node cap.
 */
export type Run = {
  kind: LineKind
  rows: readonly Row[]
}
