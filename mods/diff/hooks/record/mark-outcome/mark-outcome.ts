/**
 * How a marked feature went: fine, or degraded for a reason (the pane never
 * marks `bad`: a failed fetch keeps the last good diff on screen).
 */
export type MarkOutcome = { kind: 'ok' } | { kind: 'sad'; reason: string }
