import Limits from '../../../limits'
import { isUnderUtf8Ceiling } from './is-under-utf8-ceiling'
import { MOST_UTF8_BYTES } from './most-utf8-bytes'

/**
 * Whether a `-z` listing arrived whole: every record NUL-terminated and
 * the text short of the host's output cap, so no record was cut or lost.
 *
 * A cut inside a multi-byte character costs the decoded text up to
 * MOST_UTF8_BYTES, hence the margin under the cap.
 *
 * @param stdout the listing as `$.process.run` returned it
 * @returns whether it can be parsed as the whole answer
 */
export const isWholeListing = (stdout: string) =>
  (stdout === '' || stdout.endsWith('\0')) &&
  isUnderUtf8Ceiling(stdout, Limits.HOST_OUTPUT_CAP_BYTES - MOST_UTF8_BYTES)
