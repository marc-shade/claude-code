/**
 * The feature names the plugin marks, kept as the built-in panel's so the
 * feature surface keeps one series across the swap.
 *
 * `read` per fetch round, `tabSwitch` per open or close, `baseSwitch` per
 * base pick, `baseResolve` once a session.
 */
export const FEATURES = {
  read: 'repl_diff_read',
  tabSwitch: 'repl_tab_switch',
  baseSwitch: 'repl_diff_base_switch',
  baseResolve: 'diff_base_resolve',
} as const
