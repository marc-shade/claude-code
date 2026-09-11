import type Backend from '../backend'
import type Git from '../git'
import { modeLabelOf } from './mode-label-of'

/**
 * The dim line under the header naming what the diff compares against
 * (ReplDiffSidebar diffBaseLabel), or null for none.
 *
 * Hidden in settled session mode and before any fetch; the requested mode
 * with an ellipsis while its fetch is pending; on an unborn HEAD with
 * rows, what the rows are instead.
 *
 * @param requested the mode the person picked
 * @param data the last good fetch
 * @param filesCount the header's session file count
 * @param words the backend's words
 * @returns the line, or null
 */
export function baseLabelOf(
  requested: Git.BaseMode,
  data: Git.DiffData | null,
  filesCount: number,
  words: Pick<Backend.BackendWords, 'base'>,
): string | null {
  if (!data) {
    return null
  }

  if (data.isUnborn) {
    const hasRows = filesCount > 0

    return hasRows ? 'no commits yet — showing staged and new files' : null
  }

  const isPending = requested !== data.mode
  const isSettledSession = !isPending && requested === 'session'

  if (isSettledSession) {
    return null
  }

  const phase = isPending ? 'pending' : 'settled'
  const label = modeLabelOf(requested, data.source, phase, words)

  return isPending ? `${label}…` : label
}
