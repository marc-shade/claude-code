# telemetry

Plugin analytics as a plugin: one `engine.create` step adds `$.telemetry`
to the engine interface every plugin above it is handed, built over the
`$.session` and `$.http` nouns beneath. `$.telemetry.log({ event, props })`
sends one event as one first-party row, `tengu_plugin_<event>`;
`$.telemetry.mark({ feature, kind, reason? })` marks one use of a feature as
the CLI's own feature events do, `tengu_feature_<kind>` with a
`feature_name`. Each call is one POST to the event-logging ingest with the
session's own credential (`$.session.authorize()`, resolved once and held),
one attempt, nothing batched; a session with no first-party credential, or
an ingest that refuses, rejects the caller's promise.

It sends nothing wherever the CLI's own analytics are off: under
`DISABLE_TELEMETRY`, `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` or
`DO_NOT_TRACK`, on a third-party provider (Bedrock, Vertex, Foundry and
kin, unless the host manages the provider), on a deployment with its own
OAuth URL, and under test; each read through `$.env` once a session. The
row's `user_type` is `ant` when `USER_TYPE` says so, else `external`.

Nothing free-form reaches a row. An event name and every property key is a
snake_case token; a value is a finite number, a boolean, or a Choice (a
string named together with the list it is chosen from); `mark` takes `ok`,
`sad` or `bad`, with a `reason` required on the last two and refused on the
first. An entry that breaks a rule is refused before anything is sent.

`hooks/register.ts` is the module; `hooks/telemetry-types/` is the noun's
type as a caller sees it.

## What it hooks

`engine.create`: `{ ...await next(e), telemetry }`, so the noun is added and
nothing beneath is replaced.

## What it calls on `$`

`session.authorize`, `session.id`, `session.model`, `http.fetch`, `env.get`
(the switches above and `USER_TYPE`, by literal name), each on the
interface the fold handed it.

## Where it runs

This plugin is seated by the CLI itself, on internal builds whose own
analytics are on, and nowhere else: `session.authorize` exists only there,
and the rows it writes join tables only the CLI's own events reach. It is
not meant to be installed or loaded with `--plugin-dir`; the folder has a
manifest so it reads like every other plugin, not so it can stand alone. A
plugin that calls `$.telemetry` where this one is absent finds no such noun
and should treat that as "no analytics here".
