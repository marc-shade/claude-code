import type TelemetryTypes from '../../telemetry-types'
import { FEATURE_PREFIX } from '../feature-prefix'
import type { Fields } from '../fields'

/**
 * One checked mark as its fields: the CLI's own feature event,
 * `tengu_feature_<kind>` with `feature_name`, and `error_code` when given.
 *
 * @param kind how the feature went
 * @param feature the feature marked
 * @param reason why, on a sad or bad mark; absent on ok
 * @returns the event's name and props, ready to log
 */
export const markFieldsOf = (
  kind: TelemetryTypes.MarkKind,
  feature: string,
  reason?: string,
): Fields => ({
  name: FEATURE_PREFIX + kind,
  props:
    reason === undefined
      ? { feature_name: feature }
      : { feature_name: feature, error_code: reason },
})
