/**
 * The pane's word for a fetch whose untracked listing the backend did not
 * give whole: the tracked rows stand, the new files are not counted.
 *
 * @param lister the program that lists untracked files (BackendWords)
 * @returns the note
 */
export const untrackedWithheldTextOf = (lister: string) =>
  `Untracked files unavailable (${lister} could not list them); not counted`
