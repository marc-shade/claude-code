import Entries from '../entries'
import { isAnalyticsOff } from '../is-analytics-off'
import type { TelemetryDeps } from '../telemetry-deps'
import type TelemetryTypes from '../telemetry-types'

/**
 * Builds `$.telemetry`: `log` and `mark` check the entry, authorize once, build
 * the first-party row and POST it to the ingest.
 *
 * One POST per call, none batched, one attempt; a session with no credential to
 * authorize, or an ingest that refuses, rejects the caller's promise. A failed
 * authorize or environment read is not memoized, so a later call retries it.
 *
 * @param deps the calls on the nouns beneath
 * @returns the `$.telemetry` interface, `log` and `mark`, each authorizing once
 *          (memoized) before it posts
 */
export function telemetryOf(deps: TelemetryDeps): TelemetryTypes.Telemetry {
  let held: ReturnType<TelemetryDeps['authorize']> | undefined
  let read: ReturnType<TelemetryDeps['environment']> | undefined

  async function post(
    fields: Entries.Fields,
    method: TelemetryTypes.Method,
  ): Promise<void> {
    read ??= deps.environment().catch((error: unknown) => {
      read = undefined

      throw error
    })
    const environment = await read

    if (isAnalyticsOff(environment)) {
      return
    }

    if (!held) {
      held = deps.authorize().catch((error: unknown) => {
        held = undefined

        throw error
      })
    }

    const auth = await held

    if (!auth) {
      held = undefined

      throw Entries.refusal(
        'this session has no first-party credential to authorize',
        method,
      )
    }

    const body = Entries.batchOf(fields, {
      sessionId: await deps.id(),
      model: await deps.model(),
      userType: environment.userType === 'ant' ? 'ant' : 'external',
    })
    const response = await deps.fetch(Entries.INGEST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-service-name': 'claude-code',
      },
      auth: auth.handle,
      body,
    })

    if (!response.ok) {
      throw Entries.refusal(`the ingest answered ${response.status}`, method)
    }
  }

  return {
    log: async entry => post(Entries.checkedFields(entry), 'log'),
    mark: async entry => post(Entries.checkedMark(entry), 'mark'),
  }
}
