/**
 * What a fetched diff compares: the working tree against its checked-out
 * commit (`base` names it as the pane should: `HEAD`, or a short sha where
 * the backend has no such word), or against the merge-base with the default
 * branch (`baseRef` the ref git was handed).
 */
export type DiffSource =
  | { kind: 'working-tree'; base: string }
  | { kind: 'branch'; baseBranch: string; baseRef: string }
