import type Layout from '../../../layout'
import type { LineKind } from '../line-kind'

/**
 * One terminal row of a file's body: the gutter's text (the line number,
 * or nothing on a continuation), the marker, and the content's segments.
 */
export type Row = {
  kind: LineKind
  gutter: string
  marker: string
  segments: readonly Layout.Segment[]
}
