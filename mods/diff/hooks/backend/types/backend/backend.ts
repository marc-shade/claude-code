import type Git from '../../../git'
import type { BackendWords } from '../backend-words'

/**
 * The version-control system behind the pane, pinned once per session:
 * where its working tree is, which comparisons it offers, how it words
 * them, and the three reads the pane makes of it.
 *
 * Git is the plugin's own backend; a host may install probes for others,
 * consulted where no git working tree holds the directory (backendOf).
 */
export type Backend = {
  /**
   * The working tree's top; every row's path is relative to it.
   */
  repository: Pick<Git.Repository, 'toplevel'>

  /**
   * The base modes the picker offers, in picker order.
   */
  baseModes: readonly Git.BaseMode[]

  /**
   * The pane's words for what this backend compares and runs.
   */
  words: BackendWords

  /**
   * One fetch of the working tree against the mode's base (Git.fetchDiff).
   */
  fetchDiff: (mode: Git.BaseMode) => Promise<Git.FetchOutcome>

  /**
   * One row's hunks against the base its fetch read (Git.fetchFileHunks).
   */
  fetchFileHunks: (
    data: Git.DiffData,
    file: Git.FileStat,
  ) => Promise<Git.FileHunks | null>

  /**
   * A string that changes when the checked-out commit moves
   * (Git.headKeyOf); empty when it cannot be read this tick.
   */
  headKeyOf: () => Promise<string>
}
