import type { MarkKind } from '../mark-kind'

/**
 * What `$.telemetry.mark` takes: the feature, how it went, and why when not
 * ok.
 */
export type MarkEntry = {
  feature: string
  kind: MarkKind
  reason?: string
}
