# PRD-00: Project Foundation & Infrastructure

| Field              | Value                                  |
| ------------------ | -------------------------------------- |
| Document ID        | PRD-00                                 |
| Phase              | 0 — Foundation                         |
| Status             | Ready to Build                         |
| Depends On         | Nothing — this is the starting point   |
| Blocks             | PRD-01, PRD-02, PRD-03, PRD-04, PRD-05 |
| Estimated Duration | 2–3 days                               |

---

## 1. Purpose

This document defines all requirements for establishing the project's infrastructure — the monorepo, the CLI skeleton, the shared template utilities, and the foundational tooling. No architecture-specific code is written in this phase.

The output of this phase is a functioning — though not yet useful — pipeline. Running `nest-pilot create my-app` will ask three questions, create a directory, and write a small set of files into it. That end-to-end proof of concept is the goal. Everything built here is the foundation every subsequent phase depends on.

**No shortcuts here. Getting this right prevents structural debt in every future phase.**

---

## 2. Goals

1. Establish a clean, maintainable monorepo structure that can hold the CLI and all architecture templates without friction.
2. Prove the full pipeline works: user input → answers object → file composition → output directory.
3. Create the shared template files that every generated project will include regardless of architecture.
4. Set up developer tooling (linting, formatting, git hooks) so the project itself follows the same quality standards it will enforce in generated projects.

---

## 3. Non-Goals

- No architecture-specific templates in this phase.
- No ORM integration.
- No authentication scaffolding.
- No npm publication.
- No documentation beyond inline code comments and this PRD.

---

## 4. Repository Structure Requirements

### 4.1 Top-Level Structure

The repository root must be structured as follows. Every directory listed here must exist after Phase 0 completes.

```
nest-pilot/
├── cli/                        # CLI package workspace
│   ├── src/
│   │   ├── commands/           # Top-level Commander command definitions
│   │   ├── prompts/            # Clack prompt flow definitions
│   │   ├── composer/           # Template assembly and file writing engine
│   │   └── utils/              # Shared helpers (path resolution, formatting, etc.)
│   ├── package.json
│   ├── tsconfig.json
│   └── tsconfig.build.json
│
├── templates/
│   ├── shared/                 # Files copied into every generated project
│   │   ├── config/             # ESLint, Prettier, commitlint, tsconfig templates
│   │   ├── docker/             # Dockerfile and docker-compose templates
│   │   ├── git/                # .gitignore, .husky templates
│   │   └── env/                # .env.example template
│   ├── hexagonal/              # Reserved — populated in Phase 1
│   ├── ddd/                    # Reserved — populated in Phase 3
│   └── modular/                # Reserved — populated in Phase 4
│
├── docs/                       # Project-level documentation and ADRs
│   └── decisions/              # Architecture Decision Records
│
├── .eslintrc.js                # Root ESLint config (governs the boilerplate project itself)
├── .prettierrc                 # Root Prettier config
├── commitlint.config.js        # Commitlint config for conventional commits
├── package.json                # Root workspace config
├── tsconfig.json               # Root TypeScript base config
└── README.md                   # Project-level README (minimal at this stage)
```

### 4.2 Workspace Configuration

The root `package.json` must declare npm workspaces:

```json
{
  "name": "nest-pilot",
  "private": true,
  "workspaces": ["cli"],
  "scripts": {
    "build": "npm run build --workspace=cli",
    "lint": "eslint . --ext .ts",
    "format": "prettier --write \"**/*.{ts,json,md}\"",
    "test": "npm run test --workspace=cli"
  }
}
```

**Note on templates workspace:** The `templates/` directory is not an npm workspace because templates are not npm packages — they are raw file trees. They are read by the CLI at runtime, not imported as modules.

---

## 5. CLI Package Requirements

### 5.1 Technology Stack

| Dependency        | Version Constraint | Purpose                                                 |
| ----------------- | ------------------ | ------------------------------------------------------- |
| `commander`       | `^12.x`            | Top-level command parsing and help text                 |
| `@clack/prompts`  | `^0.9.x`           | Interactive terminal prompts                            |
| `ejs`             | `^3.x`             | Template file rendering                                 |
| `fs-extra`        | `^11.x`            | Extended file system operations (copy, ensureDir, etc.) |
| `chalk`           | `^5.x`             | Terminal color output for non-Clack output              |
| `typescript`      | `^5.x`             | Language                                                |
| `tsx`             | `^4.x`             | TypeScript execution for development                    |
| `@types/node`     | `^20.x`            | Node type definitions                                   |
| `@types/ejs`      | `^3.x`             | EJS type definitions                                    |
| `@types/fs-extra` | `^11.x`            | fs-extra type definitions                               |

### 5.2 CLI Entry Point

The CLI must be invocable as `nest-pilot` after global installation. The `package.json` in `cli/` must declare:

```json
{
  "name": "@yourhandle/nest-pilot",
  "version": "0.1.0",
  "bin": {
    "nest-pilot": "./dist/index.js"
  },
  "files": ["dist", "../templates"],
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "dev": "tsx src/index.ts",
    "test": "jest"
  }
}
```

### 5.3 Command Structure

The CLI must support the following command structure at the end of Phase 0. Only `create` needs to work functionally. The others are registered but can print "coming soon" stubs.

```
nest-pilot create [project-name]    # Main command — create a new project
nest-pilot add [feature]            # Future: add a feature to an existing project (stub)
nest-pilot --version                # Print version number
nest-pilot --help                   # Print help text
```

### 5.4 The `create` Command — Phase 0 Scope

In Phase 0, the `create` command must:

1. Accept an optional `[project-name]` positional argument.
2. If no project name is provided via argument, prompt for one interactively.
3. Validate the project name: must be a valid npm package name (lowercase, hyphens allowed, no spaces). If invalid, show an error message and re-prompt.
4. Check if a directory with that name already exists in the current working directory. If it does, prompt the user to confirm overwrite or cancel.
5. Run the Phase 0 prompt flow (see Section 5.5).
6. Invoke the composer (see Section 6) with the collected answers.
7. Display a success message with next steps.

### 5.5 Phase 0 Prompt Flow

The interactive prompt flow for Phase 0 is a minimal stub. It proves the pipeline works but does not yet generate a meaningful project.

```
┌  Nest Pilot — NestJS Project Generator
│
◇  What is your project name?
│  my-app
│
◇  Which architecture do you want to use?
│  ● Hexagonal Architecture  (coming soon — will be available in v0.2)
│  ○ Domain-Driven Design    (coming soon)
│  ○ Modular Architecture    (coming soon)
│
◇  Which package manager do you prefer?
│  ● npm
│  ○ yarn
│  ○ pnpm
│
◇  Ready to generate your project?
│  Creating my-app with Hexagonal Architecture...
│
└  Project created! Run: cd my-app && npm install
```

**In Phase 0, only the prompt collection needs to work. The generated output is the shared template files only** — the architecture-specific files are not generated yet because the templates don't exist.

---

## 6. Composer Requirements

The composer is the core engine of the CLI. It receives the answers object from the prompt flow and produces a directory of files on disk.

### 6.1 Composer Interface

The composer must expose a single primary function with the following signature:

```typescript
interface ComposerContext {
  projectName: string;
  architecture: "hexagonal" | "ddd" | "modular";
  packageManager: "npm" | "yarn" | "pnpm";
  // Additional fields added in future phases
}

interface ComposerOptions {
  outputDir: string; // Absolute path to where the project will be created
  context: ComposerContext;
  dryRun?: boolean; // If true, log what would be written without writing anything
}

async function compose(options: ComposerOptions): Promise<void>;
```

### 6.2 File Resolution Pipeline

The composer must execute the following steps in order:

**Step 1: Resolve source paths**
Determine which directories to copy from. In Phase 0, this is only `templates/shared/`. In future phases, it will also include the architecture-specific template directory.

**Step 2: Build the context object**
The context object is a flat key-value map used for EJS template interpolation. At Phase 0, it contains:

```typescript
{
  projectName: 'my-app',
  projectNamePascalCase: 'MyApp',    // For class names
  projectNameConstant: 'MY_APP',     // For constants/env vars
  packageManager: 'npm',
  year: '2025',                       // For license files, etc.
}
```

Include a `buildContext(answers: ComposerContext): Record<string, string>` utility function that derives all derived fields (PascalCase, etc.) from the raw answers. This function must have unit tests.

**Step 3: Walk and render files**
Walk the resolved source paths. For each file:

- If the file has a `.ejs` extension: render it through EJS with the context object, write the output to the destination path with the `.ejs` extension stripped.
- If the file does not have a `.ejs` extension: copy it to the destination path unchanged.
- Preserve directory structure relative to the source root.

**Step 4: Handle special filenames**
Some files must be renamed during copying because their original names would cause issues in a git repo or npm ecosystem. The following renames must be applied:

| Source filename | Output filename | Reason                             |
| --------------- | --------------- | ---------------------------------- |
| `gitignore`     | `.gitignore`    | npm strips leading dots on publish |
| `env.example`   | `.env.example`  | Same reason                        |
| `prettierrc`    | `.prettierrc`   | Same reason                        |
| `eslintrc.js`   | `.eslintrc.js`  | Same reason                        |

**Step 5: Initialize git repository**
After all files are written, run `git init` in the output directory. If git is not available on the system, skip this step and print a warning rather than failing.

**Step 6: Print success message**
Use Clack's `outro` to print a styled success message with next steps (see Section 5.4 post-generation output requirements in the Master Plan).

### 6.3 Dry Run Mode

The composer must support a `--dry-run` flag on the `create` command. When dry run is active:

- Print each file that _would_ be written (source path → destination path).
- Do not write any files to disk.
- Do not initialize a git repo.
- Print a summary of the context object that would be used.

This is essential for debugging template issues without cluttering the filesystem.

### 6.4 Error Handling

The composer must handle and communicate the following error conditions clearly:

| Error Condition                                   | Behavior                                                                   |
| ------------------------------------------------- | -------------------------------------------------------------------------- |
| Output directory already exists                   | Prompt for overwrite confirmation before the compose step, not during      |
| EJS render error (syntax error in template)       | Print the template file path and the EJS error message, then exit non-zero |
| File system write error (permissions, disk space) | Print the failed path and OS error message, then exit non-zero             |
| `git init` failure                                | Print a warning, skip git init, continue — do not fail the whole operation |

---

## 7. Shared Template Requirements

These are the files that every generated project will contain, regardless of architecture. They must be fully implemented in Phase 0 — not stubs.

### 7.1 TypeScript Configuration

**File: `templates/shared/config/tsconfig.json.ejs`**

Must produce a `tsconfig.json` with the following settings as a baseline:

- `target`: `ES2021`
- `module`: `commonjs`
- `lib`: `["ES2021"]`
- `strict`: `true`
- `esModuleInterop`: `true`
- `skipLibCheck`: `true`
- `forceConsistentCasingInFileNames`: `true`
- `experimentalDecorators`: `true`
- `emitDecoratorMetadata`: `true`
- `sourceMap`: `true`
- `outDir`: `./dist`
- `rootDir`: `./src`
- `paths`: (empty — to be populated by architecture-specific config)

**File: `templates/shared/config/tsconfig.build.json.ejs`**

Extends `tsconfig.json` and excludes test files and node_modules from compilation:

```json
{
  "extends": "./tsconfig.json",
  "exclude": [
    "node_modules",
    "dist",
    "**/*.spec.ts",
    "**/*.e2e-spec.ts",
    "test"
  ]
}
```

### 7.2 ESLint Configuration

**File: `templates/shared/config/eslintrc.js.ejs`**

Must configure:

- `@typescript-eslint/recommended` rules
- Prettier integration via `eslint-config-prettier` (disables conflicting rules)
- A rule disabling `@typescript-eslint/no-explicit-any` to warning rather than error (useful during initial development)
- Parser: `@typescript-eslint/parser` with `project: true` for type-aware linting

### 7.3 Prettier Configuration

**File: `templates/shared/config/prettierrc.ejs`**

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true
}
```

### 7.4 Commitlint Configuration

**File: `templates/shared/config/commitlint.config.js.ejs`**

Must enforce conventional commits (`feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `perf`, `ci`).

### 7.5 Git Configuration

**File: `templates/shared/git/gitignore.ejs`**

Must include: `node_modules/`, `dist/`, `.env`, `*.log`, `coverage/`, `.DS_Store`.

**File: `templates/shared/git/husky/pre-commit.ejs`**

Must run `npx lint-staged` as the pre-commit hook.

**File: `templates/shared/config/lint-staged.config.js.ejs`**

Must configure lint-staged to run ESLint and Prettier on staged `.ts` files.

### 7.6 Environment File

**File: `templates/shared/env/env.example.ejs`**

Must include the following variables with placeholder values and inline comments:

```bash
# Application
NODE_ENV=development
PORT=3000
APP_NAME=<%= projectName %>

# Database — fill in before running the app
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=changeme
DATABASE_NAME=<%= projectName %>_dev

# Auth — generate a secure random string for production
JWT_SECRET=changeme_use_a_long_random_string_in_production
JWT_EXPIRES_IN=7d
```

### 7.7 Docker Files

**File: `templates/shared/docker/Dockerfile.ejs`**

Must be a multi-stage Dockerfile:

- **Stage 1 (`builder`)**: Install all dependencies, copy source, compile TypeScript.
- **Stage 2 (`production`)**: Start from a clean Node image, copy only `dist/` and production `node_modules`, run as a non-root user.

Must include a `USER node` directive in the production stage to avoid running as root.

**File: `templates/shared/docker/docker-compose.yml.ejs`**

Must include:

- The application service (building from the Dockerfile)
- A PostgreSQL service with persistent volume
- Health check on the database service
- Environment variables read from `.env` (not hardcoded)
- A named network connecting app and database

**File: `templates/shared/docker/dockerignore.ejs`**

Must exclude: `node_modules/`, `dist/`, `.env`, `.git/`, `coverage/`.

### 7.8 Root Package.json

**File: `templates/shared/config/package.json.ejs`**

The generated project's root `package.json` must be pre-populated with:

- All shared dev dependencies (ESLint, Prettier, Husky, lint-staged, Commitlint, Jest, TypeScript, and all type packages)
- Standard NestJS dependencies: `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`, `reflect-metadata`, `rxjs`
- Standard scripts: `start`, `start:dev`, `start:debug`, `start:prod`, `build`, `lint`, `format`, `test`, `test:watch`, `test:e2e`, `test:cov`
- `jest` configuration block pointing to separate unit and e2e test configs

---

## 8. Developer Tooling Requirements (For the Boilerplate Project Itself)

These tools govern the development of `nest-pilot` — not the generated output.

### 8.1 ESLint

ESLint must be configured at the root level with `@typescript-eslint/recommended`. All `.ts` files in `cli/src/` and any future template TypeScript files must pass lint with zero errors before any commit.

### 8.2 Prettier

Prettier must be configured at the root level. The same `.prettierrc` used for the project governs the generated output — eating your own cooking.

### 8.3 Husky + lint-staged

Pre-commit hook must run ESLint and Prettier on all staged TypeScript and JSON files. Pre-push hook must run the test suite. No commit should pass if linting fails or tests fail.

### 8.4 Commitlint

All commits to this repo must follow the conventional commits format. The CI pipeline (if set up) must enforce this. For now, Husky's `commit-msg` hook is sufficient.

### 8.5 TypeScript Compilation

The CLI source in `cli/src/` must compile with zero TypeScript errors using `strict: true`. No use of `any` except with explicit justification comments.

---

## 9. Testing Requirements

### 9.1 Composer Unit Tests

The following functions in the composer must have unit tests:

| Function                           | What to Test                                                                                              |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `buildContext(answers)`            | Correct derivation of PascalCase and CONSTANT_CASE from project name; correct passthrough of other fields |
| `resolveSourcePaths(architecture)` | Returns correct paths for each architecture value; returns shared path for all architectures              |
| `applyFilenameRenames(filename)`   | All four rename cases produce correct output; non-renamed filenames pass through unchanged                |

### 9.2 Integration Test

A single integration test must verify the complete pipeline end-to-end:

1. Call `compose()` with a test context (project name: `test-project`, architecture: `hexagonal`, dryRun: false).
2. Assert that the output directory was created.
3. Assert that each expected shared file exists in the output directory.
4. Assert that `.ejs` extensions are removed in the output.
5. Assert that `gitignore` was renamed to `.gitignore` in the output.
6. Assert that `projectName` interpolation worked (check one file's content).
7. Clean up the output directory after the test.

---

## 10. Acceptance Criteria

Phase 0 is complete when **all** of the following are true:

- [ ] `git clone` + `npm install` at the repo root installs all dependencies without errors.
- [ ] `npm run lint` at the repo root completes with zero errors or warnings.
- [ ] `npm run build --workspace=cli` compiles the CLI with zero TypeScript errors.
- [ ] `npm run test --workspace=cli` runs and all tests pass.
- [ ] Running `node cli/dist/index.js create test-project` (before global install) prompts for architecture and package manager, then creates a `test-project/` directory in the current location.
- [ ] The `test-project/` directory contains all shared template files listed in Section 7.
- [ ] All `.ejs` extensions are removed in the generated output.
- [ ] All filename renames (`.gitignore`, `.env.example`, etc.) are applied correctly.
- [ ] Project name interpolation is correct in all shared template files.
- [ ] The `git init` step initializes a git repo in the generated project directory.
- [ ] Running with `--dry-run` prints expected output and writes nothing to disk.
- [ ] Running `nest-pilot create existing-dir` where `existing-dir` already exists prompts for confirmation before proceeding.

---

## 11. Open Questions

These must be answered before or during Phase 0 work. Document the decision and rationale in `docs/decisions/` when resolved.

| #    | Question                                                                                                                   | Impact                                                             | Status                                                                                         |
| ---- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| OQ-1 | What will the npm package name be? (`@yourhandle/nest-pilot` is a placeholder)                                             | Affects `package.json`, README, npm publish step                   | Unresolved                                                                                     |
| OQ-2 | Should the CLI be written in ESM or CommonJS? ESM is the future but CommonJS has fewer edge cases with Node tooling today. | Affects all import/export syntax in CLI source                     | Unresolved — **recommend CommonJS for now** to avoid ESM + `tsx` + Jest interop headaches      |
| OQ-3 | Should template files use `.ejs` extension or a custom extension like `.tmpl`?                                             | Affects all template files and the composer's file detection logic | Unresolved — **recommend `.ejs`** for editor support                                           |
| OQ-4 | Where should the CLI look for templates at runtime — relative to the installed package or via an absolute path?            | Critical for npm global install to work correctly                  | Unresolved — **recommend resolving from `__dirname`** relative to the compiled CLI entry point |

---

## 12. Dependencies to Install

### CLI Dependencies

```bash
# Runtime
npm install commander @clack/prompts ejs fs-extra chalk

# Dev
npm install -D typescript tsx @types/node @types/ejs @types/fs-extra \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint eslint-config-prettier prettier \
  jest @types/jest ts-jest \
  husky lint-staged @commitlint/cli @commitlint/config-conventional
```

---

_PRD-00 complete. Next: PRD-01 — Hexagonal Architecture Template._
