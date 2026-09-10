import { CHOICES_LIMIT } from '../choices-limit'
import { isRecord } from '../is-record'
import { refusal } from '../refusal'
import { TOKEN } from '../token'

/**
 * One property's value as it goes into the metadata: a finite number, a
 * boolean, or a Choice's value chosen from its token list.
 *
 * A bare string is refused: free text never reaches the row.
 *
 * @param key the property's key, named in a refusal
 * @param value what the caller passed under it
 * @returns the value as stored: the boolean or finite number unchanged, or the
 *          chosen member when value is a Choice
 */
export function checkedValue(
  key: string,
  value: unknown,
): string | number | boolean {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    if (Number.isFinite(value)) {
      return value
    }

    throw refusal(`props.${key}: a number is finite`)
  }

  if (typeof value === 'string') {
    throw refusal(
      `props.${key}: free text is refused; a string is a Choice, ` +
        `{ value, of: [...] }`,
    )
  }

  if (!isRecord(value) || !Array.isArray(value.of)) {
    throw refusal(
      `props.${key}: a value is a finite number, a boolean, or a Choice, ` +
        `{ value, of: [...] }`,
    )
  }

  const members = value.of
  const chosen = value.value
  const isTokenList =
    members.length > 0 &&
    members.length <= CHOICES_LIMIT &&
    members.every(member => typeof member === 'string' && TOKEN.test(member))

  if (!isTokenList) {
    throw refusal(
      `props.${key}.of: a list of 1 to ${CHOICES_LIMIT} ` + `snake_case tokens`,
    )
  }

  if (typeof chosen !== 'string' || !members.includes(chosen)) {
    throw refusal(`props.${key}.value: one of the members of \`of\``)
  }

  return chosen
}
