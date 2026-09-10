/**
 * A string property: the value and the list it is chosen from, declared
 * beside it, so no free text reaches the row.
 *
 * Every member of `of` is a snake_case token, at most CHOICES_LIMIT of
 * them; `value` is one of them.
 */
export type Choice = { value: string; of: readonly string[] }
