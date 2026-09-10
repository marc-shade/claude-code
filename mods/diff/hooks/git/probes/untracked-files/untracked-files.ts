import Limits from '../../../limits'
import Argv from '../../argv'
import GitParse from '../../parse'
import type Types from '../../types'
import { datingsOf } from '../datings-of'
import type { UntrackedPlace } from '../untracked-place'

/**
 * The untracked, unignored files as 0/0 rows: the session's own first,
 * then, when the scope asks, the tagged pre-session ones, up to the slots.
 *
 * At most MAX_UNTRACKED_PROBES are dated; a file past that or past the
 * listing budget reads as pre-session, an undatable one as the session's
 * (the built-in panel's rule). A listing not given whole: no answer.
 *
 * @param context the fetch: its pinned git, stamp probe and session start
 * @param place the free row slots and the scope
 * @returns the rows to merge after the tracked ones, or null when the
 * `-z` listing failed, timed out or was cut
 */
export async function untrackedFiles(
  context: Pick<Types.FetchContext, 'run' | 'deps' | 'stamps'>,
  place: UntrackedPlace,
): Promise<readonly Types.FileStat[] | null> {
  if (place.slots <= 0) {
    return []
  }

  const listing = await context.run([
    Argv.NO_OPTIONAL_LOCKS,
    'ls-files',
    '-z',
    '--others',
    '--exclude-standard',
    '--full-name',
  ])

  if (!GitParse.isWholeAnswer(listing)) {
    return null
  }

  const paths = listing.stdout.split('\0').filter(path => path !== '')
  const probedPaths = paths.slice(0, Limits.MAX_UNTRACKED_PROBES)
  const datings = await datingsOf(
    context.stamps,
    context.deps.sessionStartMs,
    probedPaths,
  )
  const probed = probedPaths.map(path => ({
    path,
    isPreSession: datings.get(path) !== 'session',
  }))
  const isWithPreSession = place.scope === 'with-pre-session'
  const earlier = isWithPreSession
    ? [
        ...probed.filter(file => file.isPreSession),
        ...paths
          .slice(Limits.MAX_UNTRACKED_PROBES)
          .map(path => ({ path, isPreSession: true })),
      ]
    : []
  const ordered = [...probed.filter(file => !file.isPreSession), ...earlier]

  return ordered.slice(0, place.slots).map(file => ({
    path: file.path,
    renamedFrom: null,
    added: 0,
    removed: 0,
    isBinary: false,
    isUntracked: true,
    isPreSession: file.isPreSession,
  }))
}
