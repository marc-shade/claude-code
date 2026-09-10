import Limits from '../../../limits'
import Probes from '../../probes'
import type Types from '../../types'
import { isPastDetails } from '../is-past-details'
import { mergedResultOf } from './merged-result-of'

/**
 * A tier's rows with the untracked files merged after them, as the built-in
 * panel merges the session's untracked files.
 *
 * A path a numstat row already holds keeps that row and counts once. Past
 * MAX_FILES_FOR_DETAILS nothing is listed; a listing git withheld leaves
 * the tracked rows as they are and says so, as the built-in degrades.
 *
 * @param context the fetch
 * @param result the tier's tracked rows and totals
 * @param scope which untracked files count
 * @returns the merged rows and totals, and whether the listing was withheld
 */
export async function withUntracked(
  context: Types.FetchContext,
  result: Types.NumstatResult,
  scope: Types.UntrackedScope,
): Promise<Types.MergedResult> {
  if (isPastDetails(result)) {
    return mergedResultOf(result, { isUntrackedWithheld: false })
  }

  const tracked = new Set(result.files.map(file => file.path))
  const untracked = await Probes.untrackedFiles(context, {
    slots: Limits.MAX_FILES - result.files.length,
    scope,
  })

  if (!untracked) {
    return mergedResultOf(result, { isUntrackedWithheld: true })
  }

  const fresh = untracked.filter(file => !tracked.has(file.path))
  const filesCount = result.stats.filesCount + fresh.length
  const stats = { ...result.stats, filesCount }

  return mergedResultOf(
    { stats, files: [...result.files, ...fresh] },
    { isUntrackedWithheld: false },
  )
}
