import type Git from '../../git'
import type Todos from '../../todos'
import type Turns from '../../turns'
import type { BodyState } from '../body-state'
import type { Source } from '../source'

/**
 * Everything one drawing of the pane reads: the last good fetch, what the
 * person picked, the selected file's body, the transcript's turns and todos.
 */
export type PaneModel = {
  isLoading: boolean
  hasSettled: boolean
  isOutsideRepository: boolean
  data: Git.DiffData | null
  requestedMode: Git.BaseMode
  selectedPath: string | null
  isNoiseShown: boolean
  isPreSessionShown: boolean
  source: Source
  turns: readonly Turns.TurnDiff[]
  body: Git.FileHunks | null
  bodyState: BodyState
  todos: Todos.TodoProgress
  armedPath: string | null
  isFocused: boolean
}
