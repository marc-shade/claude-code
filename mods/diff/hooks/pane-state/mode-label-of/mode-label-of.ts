import type Git from '../../git'

/**
 * A requested mode's name for the base line; branch mode names its base
 * branch from the data, or says what stands in while none is known.
 *
 * @param requested the mode the person picked
 * @param source what the data on screen compares
 * @param phase `pending` while the requested mode's fetch has not landed
 * @returns the label without its pending ellipsis
 */
export function modeLabelOf(
  requested: Git.BaseMode,
  source: Git.DiffSource,
  phase: 'pending' | 'settled',
) {
  switch (requested) {
    case 'session':
      return 'this session'
    case 'uncommitted':
      return 'uncommitted (vs HEAD)'
    case 'branch':
      if (source.kind === 'branch') {
        return `branch vs ${source.baseBranch}`
      }

      return phase === 'pending' ? 'branch diff' : 'vs HEAD (no base branch)'
  }
}
