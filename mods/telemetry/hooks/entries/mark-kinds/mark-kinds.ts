import type TelemetryTypes from '../../telemetry-types'

/**
 * The three kinds a mark may be, in the order the feature events name them.
 */
export const MARK_KINDS: readonly TelemetryTypes.MarkKind[] = [
  'ok',
  'sad',
  'bad',
]
