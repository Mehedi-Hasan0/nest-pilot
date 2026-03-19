# ADR-003: Template Engine Selection

**Date**: 2026-03-13
**Status**: Accepted

## Context

Template generation requires a way to interpolate context variables (project name, architecture, year) into file content. The main contenders:

| Engine     | Syntax       | Logic in templates?     | npm Downloads/wk |
| ---------- | ------------ | ----------------------- | ---------------- |
| **EJS**    | `<%= var %>` | Allowed but discouraged | ~50M             |
| Handlebars | `{{ var }}`  | Partials + helpers only | ~25M             |
| Nunjucks   | `{{ var }}`  | Full Jinja2-like        | ~5M              |
| Mustache   | `{{ var }}`  | Logic-less (strict)     | ~8M              |

## Decision

Use **EJS** (`ejs@^3`).

## Rationale

- **Familiarity**: EJS tags are immediately readable to any JS developer. Templates look like the output file with a few `<%= %>` tags inserted.
- **Server-side rendering parity**: The NestJS ecosystem uses EJS in several official contexts, reducing cognitive overhead.
- **Rule enforcement**: Our project rules prohibit logic in templates. EJS allows it syntactically but our `SKILL.md` and workspace rules explicitly forbid it. Simpler template engines (Mustache) would enforce this at the syntax level, but EJS gives more escape hatches during development (e.g., for conditional whitespace) without compromising the rule.
- **Async support**: `ejs.renderFile()` supports `{ async: true }`, enabling clean `await`-based rendering in `renderFiles.ts`.

## Consequences

- All template variables must be derived in `buildContext.ts` before rendering — no expressions inside `.ejs` files.
- The `renderFiles.ts` walker must strip the `.ejs` extension from output filenames.
- Any template developer must be aware of the "no logic in templates" rule enforced by the workspace rules.
