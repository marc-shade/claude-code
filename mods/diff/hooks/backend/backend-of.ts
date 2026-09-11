import Git from '../git'
import type { Backend, BackendHost, BackendProbe } from './types'

/**
 * The backend holding the session's directory: the first of `probes` that
 * answers one, else git when a git working tree holds it, else none. The
 * probes go first so a probe may claim a working copy by its own rule
 * (the nearer of two markers, say); a probe answers null wherever git
 * should govern.
 *
 * @param host the bound host's runner and probes
 * @param probes probes for other version-control systems, in order
 * (INSTALLED_BACKEND_PROBES at the pane; none as published)
 * @returns the pinned backend, or null outside any working tree
 */
export async function backendOf(
  host: BackendHost,
  probes: Iterable<BackendProbe>,
): Promise<Backend | null> {
  for (const probe of probes) {
    const backend = await probe(host)

    if (backend) {
      return backend
    }
  }

  return Git.gitBackendOf(host)
}
