/**
 * What a fetched diff compares: the working tree against HEAD, or against
 * the merge-base with the default branch (`baseRef` the ref git was handed).
 */
export type DiffSource =
  | { kind: 'working-tree' }
  | { kind: 'branch'; baseBranch: string; baseRef: string }
