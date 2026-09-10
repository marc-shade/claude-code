/**
 * One run of a word-level diff between a removed line and the added line
 * that replaced it: text both share, or text on one side only.
 */
export type WordPart = {
  text: string
  kind: 'same' | 'added' | 'removed'
}
