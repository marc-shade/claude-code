/* @jsxRuntime classic */
/* @jsx h */
/* @jsxFrag Fragment */
import type { RenderElement } from 'claude-code'

import type { Kit } from '../kit'
import Layout from '../layout'
import type { DetailModel } from './detail-model'
import { gutterCellsOf } from './gutter-cells-of'
import { hunkBody } from './hunk-body'
import { linesOf } from './lines-of'
import { MARKER_CELLS } from './marker-cells'
import { maxRowsOf } from './max-rows-of'
import { placeholderOf } from './placeholder-of'
import { rowsOf } from './rows-of'

/**
 * The selected file under the list: its bold path and asides (renamed
 * from, untracked, truncated) cut to the width, the ask Button, the body.
 *
 * The body is a placeholder or the hunks (cut to the rows the body's char
 * and node budgets hold, maxRowsOf), then the footer; the gutter fits the
 * largest number.
 *
 * @param kit the elements and the width
 * @param detail the selected file
 * @param onToggleAsk arms or disarms the file for the next prompt
 * @returns the detail element
 */
export function detailView(
  kit: Kit,
  detail: DetailModel,
  onToggleAsk: () => void,
): RenderElement {
  const { Box, Text, Button } = kit.ui
  const placeholder = placeholderOf(detail)
  const hunks = placeholder ? [] : (detail.body?.hunks ?? [])
  const lines = linesOf(hunks)
  const gutterCells = gutterCellsOf(lines)
  const contentCells = Math.max(1, kit.columns - gutterCells - MARKER_CELLS)
  const rows = placeholder ? [] : rowsOf(lines, contentCells)
  const cells = { gutterCells, contentCells }
  const maxRows = maxRowsOf(rows, cells)
  const isTruncated = detail.body?.isTruncated === true || rows.length > maxRows
  const nameOf = (path: string) =>
    Layout.truncateStart(Layout.sanitizeName(path), kit.columns)
  const renamedFrom =
    detail.renamedFrom === null ? null : nameOf(detail.renamedFrom)
  const asides = [
    renamedFrom === null ? null : `renamed from ${renamedFrom}`,
    detail.isUntracked ? 'untracked' : null,
    isTruncated ? 'truncated' : null,
  ].filter(word => word !== null)
  const aside = asides.length === 0 ? '' : ` (${asides.join(', ')})`
  const notes = (placeholder ?? []).map(line => (
    <Text dimColor italic wrap="wrap">
      {line}
    </Text>
  ))
  const body = placeholder
    ? notes
    : [hunkBody(kit.ui, rows.slice(0, maxRows), cells)]
  const ask = placeholder
    ? []
    : [
        <Button key="ask" onPress={onToggleAsk}>
          {detail.isArmed ? 'asked ✓' : 'ask'}
        </Button>,
      ]
  const footer = isTruncated
    ? [
        <Text dimColor italic>
          … diff truncated (exceeded 400 line limit)
        </Text>,
      ]
    : []

  const header = (
    <Box flexDirection="row">
      {[
        <Text bold wrap="truncate-start">
          {nameOf(detail.path)}
        </Text>,
        <Text dimColor>{aside}</Text>,
        <Box flexGrow={1} />,
        ...ask,
      ]}
    </Box>
  )

  return <Box flexDirection="column">{[header, ...body, ...footer]}</Box>
}
