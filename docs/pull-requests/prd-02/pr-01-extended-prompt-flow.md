## What does this PR do?

Extends the CLI prompt flow from Phase 0's 3 questions to Phase 2's full 5-step interactive flow. Users can now select ORM, database engine, authentication strategy, optional modules, and include/exclude example domain code. A confirmation summary is shown before generation begins.

---

## Why?

Fixes #1 — the Phase 0 prompt flow lacked the inputs required to drive architecture-specific template generation and option-specific package installation.

---

## Type of change

- [x] New feature (new architecture, ORM, optional module, etc.)
- [x] CLI change (modifies the prompt flow or composer)

---

## Checklist

**If you changed the CLI:**

- [x] `npm run build --workspace=cli` passes with zero TypeScript errors
- [x] `npm run test --workspace=cli` passes (25/25 tests)
- [x] `nest-pilot --help` output still looks right
- [x] Cancelling mid-prompt with `Ctrl+C` exits cleanly

**Always:**

- [x] I've read `CONTRIBUTING.md`
- [x] My commits follow the [Conventional Commits](https://www.conventionalcommits.org/) format
- [x] I haven't introduced any `console.log` calls I don't mean to keep
- [x] I haven't committed `.env` or any real credentials

---

## How to test this

```bash
# Build and run the CLI interactively
npm run build --workspace=cli
node cli/dist/index.js create my-test-app

# Expected: 5-step prompt flow with ORM, database, auth, optional modules,
# package manager selection, and a confirmation summary table.

# Test --defaults skips all prompts:
node cli/dist/index.js create my-default-app --defaults --dry-run

# Test cancellation:
node cli/dist/index.js create my-app
# Press Ctrl+C at any prompt — should exit cleanly with code 0
```

---

## Changes Made

| File                                                     | Change                                                                                     |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `cli/src/prompts/create.prompt.ts`                       | Full 5-step prompt flow with `CreateAnswers` interface extended to 8 fields                |
| `cli/src/commands/create.command.ts`                     | Added `--skip-install` flag, passes all new fields to `compose()`                          |
| `cli/src/composer/compose.ts`                            | Extended `ComposerContext` with 5 Phase 2 fields, added `skipInstall` to `ComposerOptions` |
| `cli/src/composer/__tests__/buildContext.spec.ts`        | Added `baseContext` with full Phase 2 fields so tests compile                              |
| `cli/src/composer/__tests__/compose.integration.spec.ts` | Added `defaultContext` with full Phase 2 fields                                            |

---

## Anything the reviewer should know?

- MongoDB is filtered out of the database options when TypeORM is selected (PRD §4.3)
- Redis is auto-injected into `optionalModules` when Session auth or BullMQ is selected
- The `hint` property is not supported on Clack's `text()` prompt (only on `select`) — discovered during build and fixed
- `ComposerContext` now requires all Phase 2 fields, but `buildContext()` and `resolveSourcePaths()` don't yet use them — that's Issues #2 and #3
