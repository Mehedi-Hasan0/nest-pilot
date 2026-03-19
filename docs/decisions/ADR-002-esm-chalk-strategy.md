# ADR-002: ESM-Only Dependencies Strategy

**Date**: 2026-03-13
**Status**: Accepted

## Context

The CLI is compiled using `tsc` to CommonJS (`"module": "commonjs"`). Several modern Node.js packages have dropped CommonJS support and are now **ESM-only**. Two that affect this project are:

| Package          | Version | Status   |
| ---------------- | ------- | -------- |
| `chalk`          | v5+     | ESM-only |
| `@clack/prompts` | v0.9+   | ESM-only |

At runtime, `require()`-ing an ESM-only package throws:

```
Error [ERR_REQUIRE_ESM]: require() of ES Module ... not supported.
```

## Decision

1. **chalk**: Downgrade to `v4.1.2`, which ships CommonJS and is API-identical for our usage.
2. **@clack/prompts**: Keep the latest version. Avoid `require()`-ing it in any path exercised by unit/integration tests by providing a **manual CommonJS mock** in `cli/__mocks__/@clack/prompts.js`.

## Alternatives Considered

| Option                                        | Why Rejected                                                                                                 |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Convert the CLI to ESM (`"module": "esnext"`) | Requires `"type": "module"` in package.json, breaks compatibility with most CommonJS Jest setups and ts-jest |
| Use `babel-jest` + `transformIgnorePatterns`  | Adds Babel as a dev dep; increases complexity for marginal gain                                              |
| Dynamic `import()` for clack                  | Complicates the call sites; would require async bootstrapping in Commander action handlers                   |

## Consequences

- `cli/__mocks__/chalk.js` and `cli/__mocks__/@clack/prompts.js` must be kept in sync with their respective package APIs.
- When upgrading `@clack/prompts`, verify no new method is called in production code that is absent from the mock.
- If the CLI is ever migrated to full ESM, both mocks can be deleted and chalk can be upgraded to v5.
