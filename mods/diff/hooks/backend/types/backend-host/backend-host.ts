import type Git from '../../../git'
import type Host from '../../../host'

/**
 * What pinning a backend takes from the bound host: the raw process
 * runner (each backend names its own program, argv lead, environment and
 * timeout), the file probes, the engine's clock, the session's start as it
 * stands at each fetch (a later `session.start` moves it), and the
 * branch-base listener.
 */
export type BackendHost = Pick<Host.Host, 'run' | 'readFile'> &
  Pick<Git.GitDeps, 'mtimeOf' | 'entryKindsOf' | 'onBranchBase'> & {
    /**
     * The engine's clock, in milliseconds (`$.clock.now`).
     */
    nowMs: () => number

    /**
     * When the current session began, read at each fetch.
     */
    sessionStartMsOf: () => number
  }
