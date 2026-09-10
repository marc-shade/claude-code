/* @jsxRuntime classic */
/* @jsx h */
/* @jsxFrag Fragment */
import type { RenderElement } from 'claude-code'

import type Git from '../../git'
import Names from '../../names'
import PaneState from '../../pane-state'
import Detail from '../detail'
import type { Kit } from '../kit'
import Layout from '../layout'
import Sections from '../sections'
import { fileRowOf } from './file-row-of'
import { listBodyOf } from './list-body-of'

/**
 * The pane over the repository's diff now (ReplDiffSidebarBody, one file's
 * body at a time): header, base line, todo bar, pickers, rows, detail.
 *
 * The tests-and-generated toggle sits above the rows; the elision count, the
 * withheld-untracked note, the pre-session line and rows below them; the
 * selected file last.
 *
 * @param kit the elements, the handlers, the width
 * @param model the pane's state
 * @returns the pane's tree
 */
export function currentPane(
  kit: Kit,
  model: PaneState.PaneModel,
): RenderElement {
  const { Box } = kit.ui
  const { data } = model

  if (model.isOutsideRepository) {
    return <Box>{Sections.dimNote(kit, Names.NOT_IN_REPOSITORY_TEXT)}</Box>
  }

  if (!data && !model.hasSettled) {
    return <Box>{Sections.dimNote(kit, 'Loading diff…')}</Box>
  }

  const noise = model.isNoiseShown ? 'shown' : 'hidden'
  const preSession = model.isPreSessionShown ? 'shown' : 'hidden'
  const partition = PaneState.partitionOf(data?.files ?? [], noise)
  const totals = data
    ? PaneState.headerTotalsOf(data, partition)
    : PaneState.ZERO_TOTALS
  const empty = PaneState.emptyStateOf(data, totals.filesCount)
  const baseLabel = PaneState.baseLabelOf(
    model.requestedMode,
    data,
    totals.filesCount,
  )
  const selected = PaneState.selectionOf(
    PaneState.listedOf(partition, preSession),
    model.selectedPath,
  )
  const rowOf = (file: Git.FileStat): RenderElement =>
    Sections.fileRow(kit, fileRowOf(file, selected?.path ?? null), () =>
      kit.actions.selectFile(file.path),
    )
  const noteOf = (text: string | null): RenderElement | null =>
    text === null ? null : Sections.dimNote(kit, Layout.sanitizeName(text))
  const noiseFace = model.isNoiseShown ? 'hide' : 'show'
  const noiseCount = Layout.plural(partition.noiseCount, 'test')
  const hasNoise = partition.noiseCount > 0
  const noiseToggle = hasNoise
    ? Sections.toggleRow(kit, 'noise', {
        label: `${noiseCount}/generated (${noiseFace})`,
        onPress: kit.actions.toggleNoise,
      })
    : null
  const earlierFace = model.isPreSessionShown ? 'hide' : 'show'
  const earlierCount = Layout.plural(partition.preSession.length, 'file')
  const hasEarlier = partition.preSession.length > 0
  const earlierToggle = hasEarlier
    ? Sections.toggleRow(kit, 'presession', {
        label: `+${earlierCount} edited before this session (${earlierFace})`,
        onPress: kit.actions.togglePreSession,
      })
    : null
  const earlierRows = model.isPreSessionShown ? partition.preSession : []
  const isUntrackedNoted = data?.isUntrackedWithheld === true && !empty
  const listed = listBodyOf(kit, { data, partition, totals, empty })
  const detail = selected
    ? [
        Sections.divider(kit),
        Detail.detailView(
          kit,
          {
            path: selected.path,
            renamedFrom: selected.renamedFrom,
            isUntracked: selected.isUntracked,
            isBinary: selected.isBinary,
            body: model.body,
            bodyState: model.bodyState,
            isArmed: model.armedPath === selected.path,
          },
          () => kit.actions.toggleAsk(selected.path),
        ),
      ]
    : []

  return (
    <Box flexDirection="column">
      {Sections.present([
        Sections.headerView(kit, empty?.headline ?? null, totals),
        noteOf(baseLabel),
        Sections.todoBar(kit, model.todos),
        Sections.controlsView(kit, model),
        noiseToggle,
        ...listed.map(line =>
          typeof line === 'string' ? noteOf(line) : rowOf(line),
        ),
        noteOf(totals.notShown > 0 ? `${totals.notShown} not shown` : null),
        noteOf(isUntrackedNoted ? Names.UNTRACKED_WITHHELD_TEXT : null),
        earlierToggle,
        ...earlierRows.map(rowOf),
        ...detail,
      ])}
    </Box>
  )
}
