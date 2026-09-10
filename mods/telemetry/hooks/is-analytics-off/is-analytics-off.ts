import type { Environment } from '../environment'
import { isEnvSet } from './is-env-set'
import { isEnvTruthy } from './is-env-truthy'

/**
 * Whether the CLI's own analytics would be off here, read off the
 * environment alone: then the plugin sends nothing either.
 *
 * Off under test, when DISABLE_TELEMETRY or the nonessential-traffic switch
 * is set at all or DO_NOT_TRACK is on, on a third-party provider the host
 * does not manage, and on a deployment with its own OAuth URL.
 *
 * @param environment the variables as read once for the session
 * @returns true when no row may be sent
 */
export function isAnalyticsOff(environment: Environment) {
  const isTest = environment.nodeEnv === 'test'
  const isPrivate =
    isEnvSet(environment.disableTelemetry) ||
    isEnvSet(environment.disableNonessentialTraffic) ||
    isEnvTruthy(environment.doNotTrack)
  const isThirdParty =
    !isEnvTruthy(environment.providerManagedByHost) &&
    [
      environment.useBedrock,
      environment.useVertex,
      environment.useFoundry,
      environment.useAnthropicAws,
      environment.useAnthropicGoogleCloud,
      environment.useMantle,
    ].some(isEnvTruthy)
  const isCustomDeployment = isEnvSet(environment.customOauthUrl?.trim())

  return isTest || isPrivate || isThirdParty || isCustomDeployment
}
