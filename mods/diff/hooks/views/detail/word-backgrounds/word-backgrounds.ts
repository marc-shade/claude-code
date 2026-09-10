import type Types from '../types'

/**
 * The theme key behind a changed word of each kind (a context line never
 * carries one).
 */
export const WORD_BACKGROUNDS: Readonly<Record<Types.LineKind, string>> = {
  added: 'diffAddedWord',
  removed: 'diffRemovedWord',
  context: 'background',
}
