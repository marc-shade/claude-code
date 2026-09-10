import type { MarkOutcome } from '../mark-outcome'
import type { SHOWN_TRIGGERS } from '../shown-triggers'
import type { WIDTH_BUCKETS } from '../width-buckets'

/**
 * The plugin's telemetry as its hooks call it; every method swallows a
 * missing `$.telemetry` and a refused row, so recording never disturbs.
 */
export type Recorder = {
  /**
   * One `tengu_feature_<kind>` row.
   */
  mark: (feature: string, outcome: MarkOutcome) => void

  /**
   * `tengu_plugin_diff_pane_shown`, once a session.
   */
  shown: (
    trigger: (typeof SHOWN_TRIGGERS)[number],
    bucket: (typeof WIDTH_BUCKETS)[number],
  ) => void

  /**
   * `tengu_plugin_diff_ask_attach`: a file's diff rode the next prompt.
   */
  asked: (lines: number) => void
}
