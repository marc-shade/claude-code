import type Backend from '../../backend'
import type Git from '../../git'

/**
 * A requested mode's name for the base line; branch mode names its base
 * branch from the data, or says what stands in while none is known. A
 * working-tree diff names its own base (`HEAD`, a short sha); anything
 * else falls back to the backend's word for it.
 *
 * @param requested the mode the person picked
 * @param source what the data on screen compares
 * @param phase `pending` while the requested mode's fetch has not landed
 * @param words the backend's words
 * @returns the label without its pending ellipsis
 */
export function modeLabelOf(
  requested: Git.BaseMode,
  source: Git.DiffSource,
  phase: 'pending' | 'settled',
  words: Pick<Backend.BackendWords, 'base'>,
) {
  const base = source.kind === 'working-tree' ? source.base : words.base

  switch (requested) {
    case 'session':
      return 'this session'
    case 'uncommitted':
      return `uncommitted (vs ${base})`
    case 'branch':
      if (source.kind === 'branch') {
        return `branch vs ${source.baseBranch}`
      }

      return phase === 'pending' ? 'branch diff' : `vs ${base} (no base branch)`
  }
}
