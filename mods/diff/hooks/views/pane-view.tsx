/* @jsxRuntime classic */
/* @jsx h */
/* @jsxFrag Fragment */
import type { RenderElement } from 'claude-code'

import PaneState from '../pane-state'
import { currentPane } from './current-pane'
import type { Kit } from './kit'
import { turnPane } from './turn-pane'

/**
 * The diff pane's body for one `ui.render`: the repository's diff now, or
 * the picked turn's edits while that turn still exists (a rewind drops it).
 *
 * @param kit the elements, the handlers, the width
 * @param model the pane's state
 * @returns the tree
 */
export function paneView(kit: Kit, model: PaneState.PaneModel): RenderElement {
  const turn = PaneState.pickedTurnOf(model)
  const isCurrent = turn === undefined

  return isCurrent ? currentPane(kit, model) : turnPane(kit, model, turn)
}
