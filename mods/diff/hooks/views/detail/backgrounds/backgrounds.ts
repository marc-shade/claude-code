import type Types from '../types'

/**
 * The theme key behind a run of each kind: the diff's added and removed
 * bands, the plain background behind context.
 */
export const BACKGROUNDS: Readonly<Record<Types.LineKind, string>> = {
  added: 'diffAdded',
  removed: 'diffRemoved',
  context: 'background',
}
