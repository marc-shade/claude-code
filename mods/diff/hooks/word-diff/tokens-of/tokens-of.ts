/**
 * A line as the tokens a word diff compares: runs of word characters, runs
 * of whitespace (kept, as diffWordsWithSpace does), other characters alone.
 *
 * @param text one line without its diff marker
 * @returns the tokens, which join back to `text`
 */
export const tokensOf = (text: string): string[] =>
  text.match(/\w+|\s+|[^\w\s]/gu) ?? []
