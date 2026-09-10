import type Git from '../../../git'
import Layout from '../../layout'
import type Types from '../types'

/**
 * A file's hunks as numbered lines, hunk after hunk: context and added
 * lines count the new file's lines, removed ones the old file's.
 *
 * Each run of removed lines is paired index by index with the added run
 * right after it, for the word diff, as the engine's fallback diff pairs.
 *
 * @param hunks the parsed hunks
 * @returns the lines in drawing order
 */
export function linesOf(hunks: readonly Git.Hunk[]): Types.DiffLine[] {
  const lines: Types.DiffLine[] = []

  for (const hunk of hunks) {
    let oldNumber = hunk.oldStart
    let newNumber = hunk.newStart
    let removedRun: Types.DiffLine[] = []
    let pairing = 0

    for (const raw of hunk.lines) {
      const text = Layout.sanitizeLine(raw.slice(1))
      const kind: Types.LineKind = raw.startsWith('+')
        ? 'added'
        : raw.startsWith('-')
          ? 'removed'
          : 'context'

      if (kind === 'removed') {
        const isNewRun = pairing > 0

        if (isNewRun) {
          removedRun = []
          pairing = 0
        }

        const line = { kind, lineNumber: oldNumber, text, pairedText: null }
        removedRun.push(line)
        lines.push(line)
        oldNumber += 1
        continue
      }

      if (kind === 'added') {
        const partner = removedRun[pairing]

        if (partner) {
          partner.pairedText = text
          pairing += 1
        }

        lines.push({
          kind,
          lineNumber: newNumber,
          text,
          pairedText: partner ? partner.text : null,
        })
        newNumber += 1
        continue
      }

      removedRun = []
      pairing = 0
      lines.push({ kind, lineNumber: newNumber, text, pairedText: null })
      oldNumber += 1
      newNumber += 1
    }
  }

  return lines
}
