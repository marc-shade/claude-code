import type { Host } from '../host'
import type { Recorder } from './recorder'
import { safely } from './safely'
import { SHOWN_TRIGGERS } from './shown-triggers'
import { WIDTH_BUCKETS } from './width-buckets'

/**
 * The plugin's Recorder over the host: each row goes through the telemetry
 * built-in's `$.telemetry`; a missing noun or a refused row is dropped.
 *
 * @param host the engine as session.start bound it
 * @returns the recorder
 */
export const recorderOf = (host: Host): Recorder => ({
  mark: (feature, outcome) => safely(() => host.mark({ feature, ...outcome })),
  shown: (trigger, bucket) =>
    safely(() =>
      host.log({
        event: 'diff_pane_shown',
        props: {
          trigger: { value: trigger, of: SHOWN_TRIGGERS },
          width_bucket: { value: bucket, of: WIDTH_BUCKETS },
        },
      }),
    ),
  asked: lines =>
    safely(() => host.log({ event: 'diff_ask_attach', props: { lines } })),
})
