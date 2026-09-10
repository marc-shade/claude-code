/* @jsxRuntime classic */
/* @jsx h */
/* @jsxFrag Fragment */
import type { RenderElement } from 'claude-code'

import type PaneState from '../../pane-state'
import type { Kit } from '../kit'
import Layout from '../layout'
import { diffStat } from './diff-stat'

/**
 * The pane's first line: `N files changed +A -R`, or the empty headline in
 * its place when there is nothing to count (ReplDiffSidebar's header).
 *
 * The headline may name a branch the repository chose, so it is drawn as
 * a name: no control or format character survives.
 *
 * @param kit the drawing's kit; its elements draw the line
 * @param headline the empty headline, or null to draw the counts
 * @param totals the header's counts
 * @returns the line
 */
export function headerView(
  kit: Kit,
  headline: string | null,
  totals: PaneState.HeaderTotals,
): RenderElement {
  const { Text } = kit.ui
  const empty = (
    <Text dimColor wrap="truncate-end">
      {Layout.sanitizeName(headline ?? '')}
    </Text>
  )
  const counts = (
    <Text wrap="truncate-end">
      <Text bold>{Layout.plural(totals.filesCount, 'file')}</Text>
      {' changed '}
      {diffStat(kit, totals.linesAdded, totals.linesRemoved)}
    </Text>
  )

  return headline === null ? counts : empty
}
