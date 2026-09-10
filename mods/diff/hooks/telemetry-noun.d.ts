/**
 * The `$.telemetry` noun as this plugin calls it, declared for a build of
 * this folder on its own; no module imports it.
 *
 * The telemetry plugin adds the noun in the engine.create fold on internal
 * builds and nowhere else: where no plugin provides it the calls throw and
 * record/ drops the row. The engine's repository leaves this file out.
 *
 * @entry
 */
declare module 'claude-code' {
  /**
   * How one use of a feature went: as hoped, degraded, or failed outright.
   */
  type DiffTelemetryMarkKind = 'ok' | 'sad' | 'bad'

  /**
   * A string property: the value and the list it is chosen from.
   */
  type DiffTelemetryChoice = { value: string; of: readonly string[] }

  /**
   * One property value a row may carry.
   */
  type DiffTelemetryProp = number | boolean | DiffTelemetryChoice

  /**
   * What `$.telemetry.log` takes: the event's name after the prefix, and
   * its properties by snake_case key.
   */
  type DiffTelemetryLogEntry = {
    event: string
    props?: Readonly<Record<string, DiffTelemetryProp>>
  }

  /**
   * What `$.telemetry.mark` takes: the feature, how it went, and why when
   * not ok.
   */
  type DiffTelemetryMarkEntry = {
    feature: string
    kind: DiffTelemetryMarkKind
    reason?: string
  }

  interface EngineInterface {
    /**
     * A plugin's analytics, one first-party row per call; present only
     * where the telemetry plugin is seated.
     */
    telemetry: {
      log: (entry: DiffTelemetryLogEntry) => Promise<void>
      mark: (entry: DiffTelemetryMarkEntry) => Promise<void>
    }
  }
}
