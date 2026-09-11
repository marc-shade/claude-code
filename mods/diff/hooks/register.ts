import type { On, ResultOf, SessionMessage, Timer } from 'claude-code'

import Ask from './ask'
import Backend from './backend'
import { COMMAND_SPEC } from './command-spec'
import { entryKindsOf } from './entry-kinds-of'
import type Git from './git'
import type { Host } from './host'
import { isOnPaneSurface } from './is-on-pane-surface'
import Limits from './limits'
import { messageOf } from './message-of'
import { mtimeOf } from './mtime-of'
import Names from './names'
import PaneState from './pane-state'
import PaneToggle from './pane-toggle'
import Record from './record'
import Tools from './tools'
import Views from './views'

/**
 * Registers the diff pane: `/diff` once the built-in stands down, the
 * pane's drawing and refresh, its opening on Claude's first edit, the ask.
 *
 * `session.start` binds the engine once, registers the command (refused
 * because the built-in holds it, the plugin does nothing) and pins the
 * backend holding the session's directory (probed again on `/diff` and
 * first edit until found): what an installed backend probe finds, else git
 * (backendOf).
 *
 * @param on the engine's registrar
 */
export function register(on: On) {
  let host: Host | null = null
  let backend: Backend.Backend | null = null
  let sessionStartMs = 0
  let isPaneOpen = false
  let hasAutoOpened = false
  let columns: number | null = null
  let hasShownOnce = false
  let wasDrawnSinceProbe = false
  let armed: Ask.ArmedAsk | null = null
  let isRefreshing = false
  let isRefreshQueued = false
  let generation = 0
  let bodyKey: string | null = null
  const polled = { toplevel: '', headKey: '' }
  let model: PaneState.PaneModel = PaneState.INITIAL_MODEL
  const timers = new Map<'refresh' | 'redraw' | 'poll', Timer>()
  const loggedBaseKinds = new Set<'ok' | 'sad'>()

  // The bound host once bind() has run (it sets `host` before pinning), so a
  // backend pinned under one session.start keeps reading through whatever
  // host a later session.start bound; `engine` only before that.
  const currentOf = (engine: Host): Host => host ?? engine

  const backendHostOf = (engine: Host): Backend.BackendHost => ({
    run: (argv, init) => currentOf(engine).run(argv, init),
    readFile: path => currentOf(engine).readFile(path),
    mtimeOf: path => mtimeOf(currentOf(engine))(path),
    entryKindsOf: dir => entryKindsOf(currentOf(engine))(dir),
    nowMs: () => currentOf(engine).now(),
    sessionStartMsOf: () => sessionStartMs,
    onBranchBase: base => {
      const isError = base.kind === 'error'
      const outcome: Record.MarkOutcome = isError
        ? { kind: 'sad', reason: base.reason }
        : { kind: 'ok' }

      if (!loggedBaseKinds.has(outcome.kind)) {
        loggedBaseKinds.add(outcome.kind)
        Record.recorderOf(currentOf(engine)).mark(
          Record.FEATURES.baseResolve,
          outcome,
        )
      }
    },
  })

  async function pinBackend(engine: Host): Promise<void> {
    if (backend) {
      return
    }

    const probed = await Backend.backendOf(
      backendHostOf(engine),
      Backend.INSTALLED_BACKEND_PROBES,
    )
    backend ??= probed

    if (!probed || backend !== probed) {
      return
    }

    const stored = PaneState.baseModeOf(
      await engine
        .storeGet(Names.baseStoreKeyOf(probed.repository.toplevel))
        .catch(() => undefined),
    )
    const mode = stored && probed.baseModes.includes(stored) ? stored : null
    model = {
      ...model,
      words: probed.words,
      baseModes: probed.baseModes,
      ...(mode && { requestedMode: mode }),
    }
  }

  function redraw(engine: Host) {
    if (timers.has('redraw')) {
      return
    }

    timers.set(
      'redraw',
      engine.after(Limits.REDRAW_COALESCE_MS, () => {
        timers.delete('redraw')
        engine.invalidate()
      }),
    )
  }

  const selectedOf = (): Git.FileStat | null =>
    PaneState.selectionOf(
      PaneState.listedOf(
        PaneState.partitionOf(
          model.data?.files ?? [],
          model.isNoiseShown ? 'shown' : 'hidden',
        ),
        model.isPreSessionShown ? 'shown' : 'hidden',
      ),
      model.selectedPath,
    )

  async function loadBody(engine: Host): Promise<void> {
    const { data } = model
    const selected = selectedOf()

    if (!data || !selected || !backend) {
      bodyKey = null
      model = { ...model, body: null, bodyState: 'idle' }

      return
    }

    const key = `${generation}|${data.baseRef}|${selected.path}`

    if (key === bodyKey) {
      return
    }

    bodyKey = key
    model = { ...model, body: null, bodyState: 'loading' }
    redraw(engine)
    const body = await backend.fetchFileHunks(data, selected)

    if (bodyKey !== key) {
      return
    }

    model = { ...model, body, bodyState: body ? 'ready' : 'failed' }
    redraw(engine)
  }

  function startPoll(engine: Host, pinned: Backend.Backend) {
    const readHeadKey = () => pinned.headKeyOf().catch(() => '')

    if (polled.toplevel === pinned.repository.toplevel) {
      return
    }

    timers.get('poll')?.cancel()
    polled.toplevel = pinned.repository.toplevel
    polled.headKey = ''
    timers.set(
      'poll',
      engine.every(Limits.HEAD_POLL_MS, () => {
        if (!isPaneOpen) {
          return
        }

        void readHeadKey().then(key => {
          const hasMoved = polled.headKey !== '' && key !== polled.headKey
          polled.headKey = key

          if (hasMoved) {
            scheduleRefresh(engine)
          }
        })
      }),
    )
  }

  async function refresh(engine: Host): Promise<void> {
    if (isRefreshing) {
      isRefreshQueued = true

      return
    }

    isRefreshing = true
    const record = Record.recorderOf(engine)
    const pinned = backend
    const fetched = (): Promise<Git.FetchOutcome> =>
      pinned
        ? pinned.fetchDiff(model.requestedMode)
        : Promise.resolve({ kind: 'no-repository' })

    try {
      model = { ...model, isLoading: model.data === null }
      const [outcome, messages] = await Promise.all([
        fetched(),
        engine.messages().catch((): SessionMessage[] => []),
      ])
      model = PaneState.afterFetch(model, { outcome, messages })

      switch (outcome.kind) {
        case 'no-repository':
          break
        case 'unavailable':
          record.mark(Record.FEATURES.read, {
            kind: 'sad',
            reason: 'git_diff_failed',
          })
          break
        case 'data':
          record.mark(Record.FEATURES.read, { kind: 'ok' })
          generation += 1

          if (pinned) {
            startPoll(engine, pinned)
          }

          break
      }

      await loadBody(engine)
    } finally {
      isRefreshing = false
      redraw(engine)

      if (isRefreshQueued) {
        isRefreshQueued = false
        scheduleRefresh(engine)
      }
    }
  }

  function scheduleRefresh(engine: Host): void {
    timers.get('refresh')?.cancel()
    timers.set(
      'refresh',
      engine.after(Limits.REFRESH_DEBOUNCE_MS, () => {
        timers.delete('refresh')
        void refresh(engine)
      }),
    )
  }

  async function openPane(
    engine: Host,
    trigger: (typeof Record.SHOWN_TRIGGERS)[number],
  ): Promise<void> {
    const pane = { id: Names.PANE_ID, title: Names.PANE_TITLE }
    const isManual = trigger === 'manual'
    await engine.openPane(isManual ? { ...pane, ...Names.FOCUSED_PANE } : pane)
    isPaneOpen = true
    const record = Record.recorderOf(engine)
    record.mark(Record.FEATURES.tabSwitch, { kind: 'ok' })

    if (!hasShownOnce) {
      hasShownOnce = true
      record.shown(trigger, Record.widthBucketOf(columns))
    }

    void refresh(engine)
  }

  async function closePane(engine: Host): Promise<void> {
    await engine.closePane({ id: Names.PANE_ID })
    isPaneOpen = false
    Record.recorderOf(engine).mark(Record.FEATURES.tabSwitch, { kind: 'ok' })
  }

  async function wasDrawnWhenProbed(engine: Host): Promise<boolean> {
    wasDrawnSinceProbe = false
    engine.invalidate()
    await engine.sleep(Limits.OPEN_PROBE_MS)

    return wasDrawnSinceProbe
  }

  async function openOnFirstEdit(engine: Host): Promise<void> {
    const isTaken = () => isPaneOpen || hasAutoOpened

    if (isTaken()) {
      return
    }

    const preference = await engine.storeGet(Names.STORE_OPEN_KEY)
    await pinBackend(engine)
    const isKeptOpen = preference === true
    const floor = isKeptOpen
      ? Limits.OPEN_MIN_COLUMNS
      : Limits.AUTO_OPEN_MIN_COLUMNS
    const isEligible =
      preference !== false &&
      columns !== null &&
      columns >= floor &&
      backend !== null

    if (!isEligible || isTaken()) {
      return
    }

    hasAutoOpened = true
    await openPane(engine, 'auto_open')
  }

  function disarm(engine: Host) {
    armed = null
    model = { ...model, armedPath: null }
    engine.status(undefined)
  }

  const actionsOf = (engine: Host): Views.PaneActions => ({
    selectFile: path => {
      model = { ...model, selectedPath: path }
      void loadBody(engine)
      redraw(engine)
    },
    toggleNoise: () => {
      model = { ...model, isNoiseShown: !model.isNoiseShown }
      void loadBody(engine)
      redraw(engine)
    },
    togglePreSession: () => {
      model = { ...model, isPreSessionShown: !model.isPreSessionShown }
      void loadBody(engine)
      redraw(engine)
    },
    chooseBase: value => {
      const mode = PaneState.baseModeOf(value)

      if (!mode || mode === model.requestedMode) {
        return
      }

      bodyKey = null
      model = { ...model, requestedMode: mode, body: null, bodyState: 'idle' }
      Record.recorderOf(engine).mark(Record.FEATURES.baseSwitch, {
        kind: 'ok',
      })
      const toplevel = model.data?.repository.toplevel

      if (toplevel !== undefined) {
        void engine
          .storeSet(Names.baseStoreKeyOf(toplevel), mode)
          .catch(() => undefined)
      }

      void refresh(engine)
      redraw(engine)
    },
    chooseSource: value => {
      const index = Number(value)
      const isTurn = value !== 'current' && Number.isInteger(index)
      const source: PaneState.Source = isTurn
        ? { kind: 'turn', index }
        : { kind: 'current' }
      model = { ...model, source, selectedPath: null }
      void loadBody(engine)
      redraw(engine)
    },
    toggleAsk: path => {
      if (armed?.path === path) {
        disarm(engine)
        redraw(engine)

        return
      }

      arm(engine, path)
    },
  })

  function arm(engine: Host, path: string) {
    armed = Ask.armedAskOf(
      path,
      PaneState.pickedTurnOf(model)?.files.find(file => file.path === path)
        ?.hunks ??
        model.body?.hunks ??
        [],
    )
    model = { ...model, armedPath: path }
    engine.status(
      `${Views.sanitizeName(path)} rides your next prompt (press ` +
        `asked ✓ to drop it)`,
    )
    redraw(engine)
  }

  async function bind(engine: Host): Promise<void> {
    sessionStartMs = engine.now()

    try {
      await engine.registerCommand(COMMAND_SPEC)
      host = engine
    } catch (error) {
      const reason = messageOf(error)

      if (!Names.BUILTIN_HOLDS_PATTERN.test(reason)) {
        engine.uiLog(Names.registerFailedTextOf(Views.sanitizeName(reason)))
      }

      return
    }

    await pinBackend(engine)
  }

  on('session.start', async ($, e, next) => {
    await bind({
      now: () => $.clock.now(),
      after: (ms, fn) => $.clock.after(ms, fn),
      every: (ms, fn) => $.clock.every(ms, fn),
      sleep: ms => $.clock.sleep(ms),
      run: (argv, init) => $.process.run(argv, init),
      stat: path => $.fs.stat(path),
      listDir: path => $.fs.list(path),
      readFile: path => $.fs.read(path),
      storeGet: key => $.store.get(key),
      storeSet: (key, value) => $.store.set(key, value),
      messages: () => $.session.messages(),
      invalidate: () => $.ui.invalidate('ui.render'),
      status: text => $.ui.status(text),
      uiLog: text => $.ui.log(text),
      openPane: pane => $.ui.open(pane),
      closePane: pane => $.ui.close(pane),
      registerCommand: spec => $.command.register(spec),
      mark: entry => $.telemetry.mark(entry),
      log: entry => $.telemetry.log(entry),
    })

    return next(e)
  })

  on('ui.render', { component: 'PromptHint' }, ($, e, next) => {
    if (isOnPaneSurface(e)) {
      columns = e.viewport?.columns ?? columns
    }

    return next(e)
  })

  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (e.requestId !== Names.PANE_ID || !host || !isOnPaneSurface(e)) {
      return next(e)
    }

    const { Box, Text, Button, Select } = await $.ui.resolve(e)
    wasDrawnSinceProbe = true
    columns = e.viewport?.columns ?? columns
    model = { ...model, isFocused: e.props.isFocused }

    return Views.paneView(
      {
        ui: { Box, Text, Button, Select },
        actions: actionsOf(host),
        columns: e.props.bodyColumns,
      },
      model,
    )
  })

  on('command.run', { command: Names.COMMAND_NAME }, async ($, e, next) => {
    if (!host) {
      return next(e)
    }

    await pinBackend(host)

    if (!backend) {
      return { text: Names.NOT_IN_REPOSITORY_TEXT }
    }

    const isOpening =
      PaneToggle.paneToggleOf({
        isBelievedOpen: isPaneOpen,
        wasDrawnWhenProbed: isPaneOpen && (await wasDrawnWhenProbed(host)),
      }) === 'open'
    await (isOpening ? openPane(host, 'manual') : closePane(host))
    await host.storeSet(Names.STORE_OPEN_KEY, isOpening).catch(() => undefined)

    return {}
  })

  on('command.run', { command: ['clear', 'resume'] }, async ($, e, next) => {
    const result = await next(e)

    if (host) {
      if (isPaneOpen) {
        await closePane(host).catch(() => undefined)
      }

      hasAutoOpened = false
      bodyKey = null
      disarm(host)
      model = PaneState.afterNewSession(model)
    }

    return result
  })

  on('tool.call', { tool: [...Tools.EDITING_TOOLS] }, async ($, e, next) => {
    let result: ResultOf['tool.call'] | undefined

    try {
      result = await next(e)

      return result
    } finally {
      if (host) {
        if (isPaneOpen) {
          scheduleRefresh(host)
        }

        const isEditDone = result !== undefined && !('deny' in result)

        if (isEditDone) {
          void openOnFirstEdit(host).catch(() => undefined)
        }
      }
    }
  })

  on('tool.call', { tool: [...Tools.SHELL_TOOLS] }, async ($, e, next) => {
    try {
      return await next(e)
    } finally {
      if (host && isPaneOpen) {
        scheduleRefresh(host)
      }
    }
  })

  on('turn.complete', ($, e, next) => {
    if (host && isPaneOpen) {
      scheduleRefresh(host)
    }

    return next(e)
  })

  on('prompt.submit', async ($, e, next) => {
    const result = await next(e)
    const asked = armed

    if (!host || !asked || result.drop !== undefined) {
      return result
    }

    disarm(host)
    redraw(host)
    Record.recorderOf(host).asked(asked.lines)

    return { ...result, context: [...(result.context ?? []), asked.text] }
  })
}
