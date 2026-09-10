import type Git from '../../../git'
import type PaneState from '../../../pane-state'

/**
 * The selected file as its body draws it: the path, what kind of row it is,
 * its hunks once read, and whether it is armed for the next prompt.
 */
export type DetailModel = {
  path: string
  renamedFrom: string | null
  isUntracked: boolean
  isBinary: boolean
  body: Git.FileHunks | null
  bodyState: PaneState.BodyState
  isArmed: boolean
}
