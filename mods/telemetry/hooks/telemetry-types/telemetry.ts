import type { LogEntry } from './log-entry'
import type { MarkEntry } from './mark-entry'

/**
 * A plugin's analytics, sent one event at a time through `$.telemetry`.
 *
 * Internal builds alone: the telemetry built-in adds the noun in the
 * engine.create fold, so a plugin on an external build, or one where the
 * built-in is off, finds no `$.telemetry`.
 */
export type Telemetry = {
  /**
   * Sends one event, `tengu_plugin_<event>`, as one first-party row;
   * resolves once the ingest accepted it.
   *
   * The noun cannot see its caller, so the calling built-in names itself in
   * `event` and this adds the prefix. A value is a finite number, a boolean
   * or a Choice; free text is refused. One input, as every op on `$` takes.
   *
   * @param entry the event's name after the prefix, a snake_case token, and
   *   its properties by snake_case key
   * @example
   * await $.telemetry.log({
   *   event: "suggest_learning_survey_answered",
   *   props: {
   *     answer: 2,
   *     page: { value: "ready", of: ["ready", "later"] },
   *   },
   * })
   */
  log: (entry: LogEntry) => Promise<void>

  /**
   * Marks one use of a feature as the CLI's own feature events do, one
   * `tengu_feature_<kind>` row; resolves once the ingest accepted it.
   *
   * The row carries `feature_name`, and `error_code` on a sad or bad one; it
   * joins the product-wide feature surface (queried by `feature_name`), so
   * no plugin prefix. `reason` is required on sad and bad, refused on ok.
   *
   * @param entry the feature, how it went, and why when not ok
   * @example
   * await $.telemetry.mark({ feature: "learn_page", kind: "ok" })
   * await $.telemetry.mark({
   *   feature: "learn_page",
   *   kind: "sad",
   *   reason: "blocked",
   * })
   */
  mark: (entry: MarkEntry) => Promise<void>
}
