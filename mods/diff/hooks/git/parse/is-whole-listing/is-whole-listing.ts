import Limits from '../../../limits'
import { isUnderUtf8Ceiling } from './is-under-utf8-ceiling'
import { MOST_UTF8_BYTES } from './most-utf8-bytes'

/**
 * Whether a listing arrived whole: every record terminated (NUL for git's
 * `-z` listings, a newline for line records) and the text short of the
 * host's output cap, so no record was cut or lost.
 *
 * A cut inside a multi-byte character costs the decoded text up to
 * MOST_UTF8_BYTES, hence the margin under the cap.
 *
 * @param stdout the listing as `$.process.run` returned it
 * @param terminator what ends every record; NUL when absent
 * @returns whether it can be parsed as the whole answer
 */
export const isWholeListing = (stdout: string, terminator = '\0') =>
  (stdout === '' || stdout.endsWith(terminator)) &&
  isUnderUtf8Ceiling(stdout, Limits.HOST_OUTPUT_CAP_BYTES - MOST_UTF8_BYTES)
