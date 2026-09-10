import type { Prop } from '../prop'

/**
 * What `$.telemetry.log` takes: the event's name after the prefix, and its
 * properties by snake_case key.
 */
export type LogEntry = {
  event: string
  props?: Readonly<Record<string, Prop>>
}
