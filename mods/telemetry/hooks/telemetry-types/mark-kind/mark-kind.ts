/**
 * How a feature went, as the CLI's own feature events count it.
 *
 * `ok`: used, the person got what they asked. `sad`: degraded, a fallback
 * or a partial, the person still got something. `bad`: failed, the person
 * got nothing.
 */
export type MarkKind = 'ok' | 'sad' | 'bad'
