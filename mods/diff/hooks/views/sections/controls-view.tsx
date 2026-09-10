/* @jsxRuntime classic */
/* @jsx h */
/* @jsxFrag Fragment */
import type { RenderElement } from 'claude-code'

import type PaneState from '../../pane-state'
import type { Kit } from '../kit'
import { present } from './present'

/**
 * The pickers under the header: the source (`Current`, then `T<n>` per
 * turn with edits, newest first) and, for the current source, the base.
 *
 * The source picker draws only when a turn exists, as DiffDialog hides its
 * tabs; the base picker is the built-in's ctrl+x b cycle as a Select.
 *
 * @param kit the elements and the handlers
 * @param model what is picked now and the turns to pick from
 * @returns the row, or null when neither picker applies
 */
export function controlsView(
  kit: Kit,
  model: Pick<PaneState.PaneModel, 'source' | 'requestedMode' | 'turns'>,
): RenderElement | null {
  const { Box, Select } = kit.ui
  const { source, turns } = model
  const hasTurns = turns.length > 0
  const sourcePicker = hasTurns ? (
    <Select
      key="source"
      label="source"
      options={[
        { value: 'current', label: 'Current' },
        ...turns.map(turn => ({
          value: String(turn.index),
          label: `T${turn.index}`,
        })),
      ]}
      value={source.kind === 'current' ? 'current' : String(source.index)}
      onSelect={value => kit.actions.chooseSource(value)}
    />
  ) : null
  const isCurrent = source.kind === 'current'
  const basePicker = isCurrent ? (
    <Select
      key="base"
      label="base"
      options={[
        { value: 'session', label: 'this session' },
        { value: 'uncommitted', label: 'uncommitted (vs HEAD)' },
        { value: 'branch', label: 'branch' },
      ]}
      value={model.requestedMode}
      onSelect={value => kit.actions.chooseBase(value)}
    />
  ) : null
  const pickers = present([sourcePicker, basePicker])
  const row = (
    <Box flexDirection="row" gap={2}>
      {pickers}
    </Box>
  )

  return pickers.length === 0 ? null : row
}
