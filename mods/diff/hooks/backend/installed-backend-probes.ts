import type { BackendProbe } from './types'

/**
 * Where a host adds backends to the plugin: probes for version-control systems
 * other than git, consulted in insertion order before git (backendOf); a
 * probe answers null wherever git should govern. Empty as shipped, so the
 * plugin reads git alone. A host
 * that compiles the module in may add a probe once, before the plugin
 * registers; the module runs natively, so that probe is what
 * `session.start` sees. The module contract offers no other channel: the
 * options `register` receives are the manifest's userConfig, and the
 * shipped scan requires `register` itself to be a plain exported function.
 */
// module-state-allow: module-evaluation code wiring — a compiling host adds its probe functions (code references, not runtime input) once before registration and never removes or rebinds them; tests pass probes to backendOf directly; a per-Host copy would hold the same functions
export const INSTALLED_BACKEND_PROBES = new Set<BackendProbe>()
