import type { PaneActions } from '../pane-actions'
import type { Ui } from './ui'

/**
 * What every part of one drawing is handed: the surface's elements, the
 * controls' handlers, and the body's width (`props.bodyColumns`).
 */
export type Kit = {
  ui: Ui
  actions: PaneActions
  columns: number
}
