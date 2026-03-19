# cli/src/composer/

The **Composer Engine** — the heart of Nest-Pilot. Transforms user answers and EJS templates into a complete, ready-to-run NestJS project.

## The 6-Step Pipeline (`compose.ts`)

```
User Answers
     │
     ▼
1. resolveSourcePaths()   → Ordered list of template directories to layer
     │
     ▼
2. buildContext()          → Derives all EJS variables (PascalCase, CONSTANT_CASE, year…)
     │
     ▼
3. renderFiles()           → Walks each source path, renders .ejs, copies plain files
     │
     ▼
4. applyFilenameRenames()  → gitignore → .gitignore, env.example → .env.example, etc.
     │
     ▼
5. gitInit()               → git init (graceful skip if git not found)
     │
     ▼
6. Clack outro message     → Next steps printed to terminal
```

## Module Responsibilities

| File                      | Responsibility                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| `compose.ts`              | Orchestrator. Calls other modules in sequence. Owns dryRun / skipGit / verbose flags.    |
| `buildContext.ts`         | **Single source of truth** for EJS template variables. No variable derivation elsewhere. |
| `resolveSourcePaths.ts`   | Returns ordered `[shared/, architecture/]` path list. Phase 0: shared only.              |
| `renderFiles.ts`          | Recursive directory walker. Renders `.ejs`, copies other files, preserves structure.     |
| `applyFilenameRenames.ts` | Handles the npm-strips-dots problem. Maps `gitignore → .gitignore` etc.                  |
| `gitInit.ts`              | `execSync('git init')`. Prints a warning and continues if git is absent.                 |

## What belongs here

- Pure filesystem transformation logic.
- Template variable derivation (`buildContext.ts`).

## What is forbidden here

- User prompts / Clack UI calls — those belong in `src/prompts/`.
- Commander option parsing — that belongs in `src/commands/`.
- Logic inside EJS templates — all logic must be in `buildContext.ts`.
- Architecture-specific file generation — that belongs in `resolveSourcePaths.ts` returning the correct layer path.

## Testing

All modules have unit tests in `__tests__/`. The integration test (`compose.integration.spec.ts`) runs a full end-to-end compose into `os.tmpdir()` and asserts on the generated file tree.
