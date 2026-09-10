/* @jsxRuntime classic */
/* @jsx h */
/* @jsxFrag Fragment */
import type { RenderElement, RenderNode } from 'claude-code'

import type Kit from '../../kit'
import Layout from '../../layout'
import { BACKGROUNDS } from '../backgrounds'
import { MARKER_CELLS } from '../marker-cells'
import { MAX_RUN_CHARS } from '../max-run-chars'
import { runsOf } from '../runs-of'
import type Types from '../types'
import { WORD_BACKGROUNDS } from '../word-backgrounds'
import type { BodyCells } from './body-cells'

/**
 * A file's rows drawn as StructuredDiff's fallback draws them, in few
 * nodes: one dim gutter Text beside a column of one Text per run.
 *
 * Added and removed runs sit on their theme bands, changed words on the
 * word bands, every row is padded to the band's width less its text's
 * chargedWidth; a run's text and the gutter split at MAX_RUN_CHARS a string.
 *
 * @param ui the surface's elements
 * @param rows the laid-out rows (rowsOf), each exactly one terminal row
 * @param cells the gutter's and the content's widths
 * @returns the body element
 */
export function hunkBody(
  ui: Kit.Ui,
  rows: readonly Types.Row[],
  cells: BodyCells,
): RenderElement {
  const { Box, Text } = ui
  const bandCells = MARKER_CELLS + cells.contentCells

  function gutterChildren(): string[] {
    const children: string[] = []
    let pending = ''

    rows.forEach((row, at) => {
      const label = row.gutter.padStart(cells.gutterCells)
      const text = `${at === 0 ? '' : '\n'}${label}`

      if (pending.length + text.length > MAX_RUN_CHARS) {
        children.push(pending)
        pending = ''
      }

      pending += text
    })

    return pending === '' ? children : [...children, pending]
  }

  function runChildren(run: Types.Run): RenderNode[] {
    const children: RenderNode[] = []
    let pending = ''

    function flush() {
      if (pending !== '') {
        children.push(pending)
        pending = ''
      }
    }

    function plain(text: string) {
      if (pending.length + text.length > MAX_RUN_CHARS) {
        flush()
      }

      pending += text
    }

    function marked(text: string) {
      flush()
      children.push(
        <Text backgroundColor={WORD_BACKGROUNDS[run.kind]}>{text}</Text>,
      )
    }

    run.rows.forEach((row, at) => {
      const used = row.segments.reduce(
        (sum, segment) => sum + Layout.chargedWidth(segment.text),
        MARKER_CELLS,
      )
      plain(`${at === 0 ? '' : '\n'} ${row.marker} `)

      for (const segment of row.segments) {
        ;(segment.isChanged ? marked : plain)(segment.text)
      }

      plain(' '.repeat(Math.max(0, bandCells - used)))
    })
    flush()

    return children
  }

  return (
    <Box flexDirection="row">
      <Text dimColor wrap="truncate-end">
        {gutterChildren()}
      </Text>
      <Box flexDirection="column" flexShrink={0} width={bandCells}>
        {runsOf(rows).map(run => (
          <Text backgroundColor={BACKGROUNDS[run.kind]} wrap="truncate-end">
            {runChildren(run)}
          </Text>
        ))}
      </Box>
    </Box>
  )
}
