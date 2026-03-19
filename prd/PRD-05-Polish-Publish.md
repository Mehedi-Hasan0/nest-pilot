# PRD-05: Polish & Community Preparation

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Document ID        | PRD-05                                                       |
| Phase              | 5 — Polish & Publish                                         |
| Status             | Ready after PRD-04 is complete                               |
| Depends On         | PRD-04 (all three architectures complete and working in CLI) |
| Blocks             | Nothing — this is the final phase                            |
| Estimated Duration | 1 week                                                       |

---

## 1. Purpose

This document defines the requirements for making the project ready for public use. All the architecture templates exist and the CLI works — this phase is about the experience layer that determines whether a stranger picking up the project can understand, use, and trust it.

It covers: the root-level documentation, the npm publication, CI/CD for the boilerplate project itself, versioning strategy, and a contribution guide. This phase is explicitly lower in engineering complexity than the previous phases. It demands care for details and user empathy over architectural depth.

---

## 2. Goals

1. A developer who has never seen this project can install the CLI, run it, and have a working project in under five minutes.
2. A developer who wants to understand what the CLI generated can navigate the codebase and its READMEs without external resources.
3. The project is published to npm with a stable initial version.
4. A CI pipeline ensures that the templates never silently break.
5. The project is positioned for community contributions without becoming a maintenance burden.

---

## 3. Root-Level README Specification

The root README is the single most-read file in the project. Every word must earn its place.

### 3.1 Structure

```markdown
# Nest-Pilot — NestJS Architecture Boilerplate

[One-line description of what it does and why it's different]

[Animated GIF or screenshot of the CLI prompt flow — optional but high-impact]

## Quick Start

[Minimal install + create commands — visible above the fold]

## What You Get

[Brief description of each architecture with a link to its detailed README]

## Architecture Comparison

[The comparison table from the master plan]

## Requirements

[Node version, supported OS]

## Documentation

[Links to per-architecture READMEs]

## Contributing

[Link to CONTRIBUTING.md]

## License

[MIT]
```

### 3.2 Quick Start Section

This must be the first substantive content after the tagline. Three commands to a working project:

```bash
npm install -g @mehedi-hasan0/nest-pilot
nest-pilot create my-app
cd my-app && cp .env.example .env
# Follow the prompts — you'll have a running app in minutes
```

### 3.3 Architecture Comparison Table

This table must be in the root README. It is the most important decision-support tool for new users:

|                          | Hexagonal                                 | DDD                                             | Modular                            |
| ------------------------ | ----------------------------------------- | ----------------------------------------------- | ---------------------------------- |
| **Learning curve**       | Medium                                    | High                                            | Low                                |
| **Boilerplate overhead** | High                                      | Very high                                       | Low                                |
| **Best for**             | Framework independence, testability       | Rich domains, complex business rules            | Standard APIs, rapid development   |
| **Framework coupling**   | Very low (domain is pure TS)              | Low                                             | High (NestJS-native)               |
| **When to choose**       | Long-lived product, complex domain        | Domain experts + developers must share language | Most projects starting out         |
| **Example companies**    | Products expecting infrastructure changes | Fintech, healthcare, complex e-commerce         | Majority of standard SaaS products |

### 3.4 Requirements Section

Must clearly state:

- Node.js >= 18 (LTS recommended)
- npm >= 9 / yarn >= 3 / pnpm >= 8
- Docker (for running the generated project's database)
- git (recommended, for the init step)
- Supported on: macOS, Linux, Windows (with WSL2 recommended)

---

## 4. Per-Architecture Documentation

Each architecture template's top-level README (already written in Phases 1–4) must be reviewed for cross-references, consistency of tone, and completeness. Run through the following checklist for each:

- [ ] The README explains what the architecture is in plain language (no assumed prior knowledge)
- [ ] The README explains _when_ to use this architecture vs the others
- [ ] The README has a folder map with one-line descriptions of each folder
- [ ] The README explains how to add a new feature (step-by-step guide)
- [ ] All links between READMEs are correct
- [ ] The language is consistent (same terms used across all three READMEs for equivalent concepts)

---

## 5. CHANGELOG Specification

`CHANGELOG.md` must be initialized at the root with the v1.0.0 release entry. Format follows [Keep a Changelog](https://keepachangelog.com/):

```markdown
# Changelog

## [1.0.0] - YYYY-MM-DD

### Added

- `nest-pilot create` command with interactive project generation
- Hexagonal Architecture template with TypeORM, Prisma, and MikroORM support
- Domain-Driven Design template with CQRS and domain events
- Modular Architecture template
- JWT and session-based authentication support
- Optional modules: Swagger, Redis, BullMQ, WebSockets
- Per-folder README documentation for all architecture templates
- Docker multi-stage build and docker-compose setup
- Security baseline: Helmet, rate limiting, global validation pipe, env validation
- Structured logging with Pino
- Health check endpoint
```

---

## 6. CONTRIBUTING.md Specification

The contributing guide must define exactly how someone contributes without requiring a conversation with you. Sections:

### 6.1 Development Setup

Step-by-step instructions for running the CLI from source:

```bash
git clone https://github.com/mehedi-hasan0/nest-pilot
cd nest-pilot
npm install
cd cli && npm run dev -- create test-project
```

### 6.2 How to Add a New Architecture

A numbered guide for adding a new architecture template:

1. Create `templates/<architecture>/` directory
2. Write `templates/<architecture>/README.md` first (before any code)
3. Implement the full template following the quality standards in this CONTRIBUTING guide
4. Add the architecture to `cli/src/prompts/architecture.prompt.ts`
5. Add the architecture to `cli/src/composer/template-resolver.ts`
6. Write the smoke test in `cli/tests/smoke/<architecture>.test.ts`
7. Submit a PR with the full checklist completed

### 6.3 Template Quality Standards

This section documents the non-negotiable standards every template must meet:

- Every file must be fully implemented — no `// TODO` comments
- Every major directory must have a `README.md`
- Unit tests must cover all domain/business logic
- The generated project must compile with zero TypeScript errors
- The generated project must pass all tests
- All business rules must be demonstrated by a test that verifies the failure case

### 6.4 Commit Convention

All commits must follow Conventional Commits. The CI pipeline will reject PRs that don't.

### 6.5 Issue Templates

Two issue templates must be created in `.github/ISSUE_TEMPLATE/`:

**`bug_report.md`** — Fields: Nest-Pilot version, Node version, OS, architecture selected, ORM selected, steps to reproduce, expected behavior, actual behavior.

**`feature_request.md`** — Fields: What problem does this solve, who would use it, proposed solution, alternatives considered.

---

## 7. npm Publication Requirements

### 7.1 Package Configuration

The `cli/package.json` must be finalized before publication:

```json
{
  "name": "@mehedi-hasan0/nest-pilot",
  "version": "1.0.0",
  "description": "Interactive CLI for generating NestJS projects with Hexagonal, DDD, or Modular architecture",
  "keywords": ["nestjs", "boilerplate", "cli", "hexagonal", "ddd", "architecture"],
  "homepage": "https://github.com/mehedi-hasan0/nest-pilot",
  "bugs": "https://github.com/mehedi-hasan0/nest-pilot/issues",
  "repository": { "type": "git", "url": "..." },
  "license": "MIT",
  "engines": { "node": ">=18" },
  "bin": { "nest-pilot": "./dist/index.js" },
  "files": ["dist/", "../templates/"]
}
```

### 7.2 Pre-Publication Verification

Before running `npm publish`, the following must be verified manually:

- [ ] `npm pack --dry-run` shows that `dist/` and `templates/` are included and nothing sensitive (`.env`, test outputs, etc.) is included
- [ ] `npm install -g .` from the `cli/` directory installs successfully and `nest-pilot --version` returns the correct version
- [ ] Running `nest-pilot create test-project` after global install generates a valid project (templates are resolved correctly from the installed location)
- [ ] All three architecture options produce working projects

### 7.3 Versioning Strategy

Semantic versioning (semver) is used: `MAJOR.MINOR.PATCH`.

| Change Type          | Version Bump | Examples                                                                                 |
| -------------------- | ------------ | ---------------------------------------------------------------------------------------- |
| Breaking CLI changes | MAJOR        | Renaming commands, removing options, changing generated file structure in a breaking way |
| New features         | MINOR        | New architecture, new optional module, new ORM support                                   |
| Bug fixes            | PATCH        | Fixing a template bug, fixing a CLI prompt behavior                                      |

---

## 8. CI/CD Pipeline Specification

A GitHub Actions workflow must be set up. Two workflows are required:

### 8.1 CI Workflow (`.github/workflows/ci.yml`)

Triggered on: every push to `main`, every pull request to `main`.

Jobs:

**`lint-and-type-check`**

- `npm run lint`
- `npm run build --workspace=cli`

**`test`**

- `npm run test --workspace=cli`

**`smoke-test`** (matrix: `node-version: [18, 20, 22]`)

- Build the CLI
- Run `nest-pilot create smoke-test --defaults --skip-install --skip-git`
- Run `npm install` in the generated project
- Run `npm run build` in the generated project
- Run `npm run lint` in the generated project
- Run `npm run test` in the generated project

The smoke test running on three Node versions is important — it catches Node version-specific incompatibilities that would otherwise only be discovered by users.

### 8.2 Release Workflow (`.github/workflows/release.yml`)

Triggered on: push of a `v*.*.*` tag (e.g., `v1.0.0`).

Jobs:

**`publish`**

- Run the full CI suite
- Build the CLI
- `npm publish --workspace=cli --access public`
- Create a GitHub Release with the CHANGELOG section for this version

---

## 9. Final Cross-Architecture Review

Before publishing, run a final review across all three templates to check for consistency:

### 9.1 Consistency Checklist

- [ ] All three templates use the same example domain (Blog: User, Post, Comment)
- [ ] All three templates implement the same HTTP endpoints (POST /users/register, POST /posts, POST /posts/:id/publish, POST /posts/:id/comments)
- [ ] All three templates have the same security baseline (Helmet, Throttler, ValidationPipe, env validation)
- [ ] All three templates have the same observability baseline (Pino logging, health check)
- [ ] All three templates produce projects that respond to the same API calls with equivalent behavior
- [ ] All three templates' READMEs use consistent terminology for equivalent concepts
- [ ] The architecture comparison table in the root README accurately reflects each template's actual approach

### 9.2 Security Audit

Run through this checklist against each generated project:

- [ ] No secrets in any template file (no hardcoded passwords, JWT secrets, or API keys)
- [ ] `.env` is in `.gitignore`
- [ ] The Dockerfile does not run as root in production stage
- [ ] `synchronize: true` (TypeORM) is disabled in production
- [ ] Rate limiting is configured with sensible defaults (not disabled)
- [ ] Passwords are hashed — never stored in plaintext
- [ ] JWT payloads contain only `sub` (user ID) — no sensitive data in the token

### 9.3 Generated Project Health Check

For each architecture, run this sequence from scratch:

```bash
nest-pilot create health-check-<arch> --defaults
cd health-check-<arch>
cp .env.example .env
# Fill in real database credentials
docker-compose up -d
npm install
npm run build        # Must exit 0
npm run lint         # Must exit 0
npm run test         # Must exit 0
npm run test:e2e     # Must exit 0
npm run start:prod   # Must start without errors
curl http://localhost:3000/health  # Must return {"status":"ok"}
```

All three architectures must pass this sequence before v1.0.0 is tagged.

---

## 10. Post-Launch Maintenance Guide

This section is written for your future self — the document you'll read six months after launch when you've forgotten some decisions.

### 10.1 How to Update a Template

When a dependency has a security update or a template bug is found:

1. Update the relevant `.ejs` file in the template directory
2. Run the smoke test to verify the generated project still works
3. Bump the patch version
4. Update the CHANGELOG
5. Push a new tag to trigger the release workflow

### 10.2 How to Add a New ORM

1. Create `templates/<architecture>/orm/<new-orm>/` for each architecture that should support it
2. Implement the persistence layer following the existing ORM patterns
3. Add the ORM option to `cli/src/prompts/orm.prompt.ts`
4. Add the dependency list to `cli/src/composer/dependencies.ts`
5. Add a smoke test
6. Update the root README's tooling options table

### 10.3 How to Add a New Architecture

Follow the Architecture Transition Nest-Pilot from the Master Plan document. It applies unchanged to any new architecture added after Phase 4.

### 10.4 Deprecation Policy

When removing a feature or changing CLI behavior in a breaking way:

1. Emit a deprecation warning in the CLI for one minor version cycle before removing
2. Document the deprecation in the CHANGELOG under "Deprecated"
3. Remove in the next major version bump
4. Document the migration path in the CHANGELOG entry for the major version

---

## 11. Acceptance Criteria

Phase 5 is complete when **all** of the following are true:

- [ ] `npm install -g @mehedi-hasan0/nest-pilot` works from the published npm package.
- [ ] Running `nest-pilot create my-app` from a clean machine (no local repo) generates a working project.
- [ ] The root README's Quick Start section works exactly as written — no extra steps.
- [ ] The architecture comparison table accurately reflects all three templates.
- [ ] `CHANGELOG.md` has a complete v1.0.0 entry.
- [ ] `CONTRIBUTING.md` is present and covers all sections in Section 6.
- [ ] The CI workflow runs on every PR and covers lint, type check, tests, and smoke tests on Node 18/20/22.
- [ ] The release workflow successfully published to npm when a version tag is pushed.
- [ ] All three templates pass the Final Cross-Architecture Review (Section 9).
- [ ] All three generated projects pass the Generated Project Health Check sequence (Section 9.3).
- [ ] No hardcoded secrets exist in any template file.

---

## 12. What Comes After v1.0.0

This section is not a commitment — it is a list of directions the project could grow if v1.0.0 demonstrates real value. Nothing here is planned for this release.

| Feature                             | Rationale                                                         |
| ----------------------------------- | ----------------------------------------------------------------- |
| `nest-pilot add <module>` command   | Add a feature module to an existing project                       |
| Microservices architecture template | Most-requested architecture not in v1.0.0                         |
| Clean Architecture template         | Overlaps with Hexagonal but has distinct conventions              |
| GraphQL-first templates             | Current templates treat GraphQL as an option, not an architecture |
| More ORM options (Drizzle)          | Drizzle is gaining adoption rapidly                               |
| Cloud deployment scaffolding        | Dockerfile + compose is not enough for many teams                 |
| VS Code extension                   | An alternative to the CLI for IDE users                           |

---

_PRD-05 complete. All five PRDs are finished._
_The full planning suite covers Phase 0 through Phase 5 with complete specifications._
