import type Types from '../types'

/**
 * The theme key behind a run of each kind: the added and removed bands, and
 * none behind context, which draws on the terminal's own background.
 *
 * The theme's `background` key is the background-task accent, a cyan.
 */
export const BACKGROUNDS: Readonly<Record<Types.LineKind, string | undefined>> =
  {
    added: 'diffAdded',
    removed: 'diffRemoved',
    context: undefined,
  }
