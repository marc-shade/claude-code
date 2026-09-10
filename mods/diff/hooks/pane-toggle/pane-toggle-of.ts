import type { PaneBelief } from './pane-belief'

/**
 * What `/diff` does, the one place its toggle is decided: close only when
 * the plugin opened the pane and it still draws; otherwise open, focused.
 *
 * The person's `[x]` raises nothing a plugin sees, so a pane believed
 * open is probed with a redraw first.
 *
 * @param pane the plugin's belief and the probe's answer
 * @returns `close` or `open`
 */
export const paneToggleOf = (pane: PaneBelief): 'open' | 'close' =>
  pane.isBelievedOpen && pane.wasDrawnWhenProbed ? 'close' : 'open'
