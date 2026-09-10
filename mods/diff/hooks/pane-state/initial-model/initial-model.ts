import type { PaneModel } from '../pane-model'

/**
 * The pane before anything happened: session mode, nothing fetched,
 * nothing picked, the current source.
 */
export const INITIAL_MODEL: PaneModel = Object.freeze({
  isLoading: false,
  hasSettled: false,
  isOutsideRepository: false,
  data: null,
  requestedMode: 'session',
  selectedPath: null,
  isNoiseShown: false,
  isPreSessionShown: false,
  source: Object.freeze({ kind: 'current' }),
  turns: Object.freeze([]),
  body: null,
  bodyState: 'idle',
  todos: Object.freeze({ done: 0, total: 0 }),
  armedPath: null,
  isFocused: false,
})
