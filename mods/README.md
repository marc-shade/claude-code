# Mods

A mod is a Claude Code plugin whose behaviour lives in a hooks module: one
`register(on, options)` entry that hooks the engine's events as functions
`($, e, next)`. These three ship inside Claude Code; this folder is their
source, published as it is built into the binary.

| Mod | What it does | Seated |
| --- | --- | --- |
| [`sec-default`](sec-default) | Keeps an organization's classic hooks, prompt content, managed settings and tool policy out of reach of the plugins a person installs; adds no policy of its own. | Outermost, on a machine with managed settings or for a Team or Enterprise organization, unless managed `prependPlugins` says otherwise |
| [`diff`](diff) | `/diff`: the session's uncommitted changes in a pane beside the transcript, file by file with their hunks, refreshed as Claude edits files and runs commands. | Built in |
| [`telemetry`](telemetry) | Adds `$.telemetry` (`log`, `mark`) in the `engine.create` fold so a plugin can record an event as a first-party analytics row; sends nothing wherever Claude Code's analytics are off. | Built in |

Each folder is a complete plugin: `.claude-plugin/plugin.json`, a
`hooks/hooks.json` naming the module, and TypeScript under `hooks/` typed
against the declarations `/plugin-types` writes (`import type … from
'claude-code'`). To read one running from source:

    claude --plugin-dir mods/diff

Early access: hooks modules load only where function hooks are enabled, and
the API these mods are written against may change between releases without
notice. They are not listed in this repository's marketplace; the copies that
matter are the ones already in your Claude Code.
