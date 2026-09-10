/**
 * What the plugin knows of its pane when `/diff` runs: whether it opened
 * it and never closed it, and whether it drew when a redraw was asked.
 */
export type PaneBelief = {
  isBelievedOpen: boolean
  wasDrawnWhenProbed: boolean
}
