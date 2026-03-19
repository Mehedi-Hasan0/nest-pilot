# Nest-Pilot — NestJS Architecture Blueprint — Project Plan

> A planning document will be updated as decisions evolve.

---

## 1. Project Vision

This project is a **CLI-driven, architecture-aware NestJS boilerplate system**. When a developer runs the CLI, they are guided through an interactive questionnaire — choosing their architecture, tooling, database, auth strategy, and more — and the CLI generates a fully structured, deeply documented, production-ready NestJS project tailored to their selections.

The key differentiator from other boilerplates is **depth over breadth**. Each architecture variant is a first-class implementation — not a renamed folder structure, but a genuinely idiomatic representation of that architectural pattern, complete with example domain code, per-folder README files explaining the _why_, and tooling choices that are consistent with the architecture's philosophy.

The project is built in phases. Each phase produces something usable and complete in itself, so the tool has real value at every stage — not only when "finished."

---

## 2. Foundational Decisions

These decisions are made once, upfront, and govern the entire project. Changing them mid-build is expensive. Every subsequent phase depends on these being stable.

### 2.1 Repository Structure

**Decision: Single monorepo using npm workspaces.**

The repo will contain two primary workspaces: the `cli` package (the interactive tool users install and run) and the `templates` directory (the source of all generated code). Keeping them together means you can update a template and test it through the CLI in one place, without managing cross-repo dependencies or versioning.

```
nest-pilot/
├── cli/                     # The CLI tool (published to npm)
│   ├── src/
│   │   ├── commands/        # Top-level CLI commands
│   │   ├── prompts/         # Interactive questionnaire logic
│   │   ├── composer/        # Template assembly logic
│   │   └── utils/           # Shared helpers (file writing, formatting, etc.)
│   ├── package.json
│   └── tsconfig.json
├── templates/               # All architecture templates
│   ├── hexagonal/           # Hexagonal Architecture template
│   ├── ddd/                 # Domain-Driven Design template
│   ├── modular/             # Modular Architecture template
│   └── shared/              # Shared pieces (configs, base files, etc.)
├── docs/                    # Project-level documentation
├── package.json             # Root workspace config
└── README.md
```

**Why not separate repos?** Because the CLI and templates are tightly coupled — the CLI's question logic must know what templates exist and what options they support. Splitting them adds sync overhead with minimal benefit at this stage. If the community grows significantly, a split can be revisited.

### 2.2 CLI Framework

**Decision: [Clack](https://github.com/natemoo-re/clack) for prompts + [Commander.js](https://github.com/tj/commander.js) for command parsing.**

Clack is the modern standard for interactive CLI prompts — it's what the Astro, SvelteKit, and other prominent CLIs use. It produces clean, beautiful terminal output with minimal boilerplate. Commander.js handles the top-level command structure (`nest-pilot create`, `nest-pilot add`, etc.) and is the most battle-tested CLI framework in the Node ecosystem.

Together they cover everything: the interactive experience (Clack) and the programmatic command surface (Commander).

```
npm install @clack/prompts commander
```

### 2.3 Template Engine

**Decision: [EJS](https://ejs.co/) for parameterized templates.**

Template files are stored as `.ejs` files and compiled to their final form when the CLI runs. EJS is simple, readable, and widely understood — it uses `<%= projectName %>` style interpolation, which is easy to reason about when writing templates.

The alternative (Handlebars) is more powerful but introduces logic complexity that isn't needed here. Simple variable injection is sufficient for most cases. For conditional file inclusion (e.g., include `auth.module.ts` only if the user chose JWT), the composer layer handles that at the file selection level — not inside the template itself. This keeps templates clean and readable.

### 2.4 The Example Domain

**Decision: A Blog platform — Users, Posts, and Comments.**

This domain is used consistently across **every** architecture. This is critical. The only way to meaningfully compare how Hexagonal vs DDD handles the same problem is if they're solving the exact same problem.

The domain is intentionally simple enough to be readable at a glance, but rich enough to demonstrate real patterns:

- **User** entity — registration, authentication, profile
- **Post** entity — create draft, publish, unpublish, delete
- **Comment** entity — add comment to post, delete comment

This gives us: entity relationships, ownership rules (only the author can publish their post), state transitions (draft → published → unpublished), and meaningful use cases that require cross-entity logic. That's enough to demonstrate aggregates, value objects, ports/adapters, use case classes, and domain events — all the things each architecture cares about differently.

### 2.5 Shared Conventions (Applies to All Architectures)

These are the non-negotiable standards that every generated project will have, regardless of architecture choice. They represent the "professional kitchen" baseline.

**Security baseline (always included, not optional):**

- `@nestjs/helmet` — HTTP security headers
- `@nestjs/throttler` — rate limiting with configurable defaults
- CORS configured with environment-aware origins
- Input validation via `class-validator` and `class-transformer` with a global validation pipe
- Environment variable validation using `Joi` on startup (the app refuses to start with missing/invalid env)
- No secrets in code — `.env.example` provided, `.env` gitignored

**Code quality (always included):**

- ESLint with `@typescript-eslint` rules
- Prettier with consistent config
- Husky + lint-staged for pre-commit hooks
- Commitlint for conventional commit enforcement

**Testing baseline (always included):**

- Jest configured with separate unit and e2e test configs
- At least one example test per layer of the chosen architecture
- A `test/` directory at root for e2e tests using Supertest

**Configuration management (always included):**

- `@nestjs/config` with a typed, validated config service
- Separate config files for app, database, auth — not a single flat `.env` blob
- A `ConfigModule` that is globally available

**Observability (always included):**

- Structured logging via [Pino](https://getpino.io) with `nestjs-pino`
- A request/response logging interceptor
- A basic health check endpoint via `@nestjs/terminus`

**Docker (always included):**

- `Dockerfile` (multi-stage: builder + production)
- `docker-compose.yml` with the app, database, and Redis (if applicable)
- `.dockerignore`

### 2.6 Tooling Options (CLI Choices)

These are the options the CLI will ask about. Not all are asked for every architecture — some are inferred from the architecture choice (see Section 5).

| Category              | Options                                   |
| --------------------- | ----------------------------------------- |
| ORM / Database Client | TypeORM, Prisma, MikroORM                 |
| Database              | PostgreSQL (default), MySQL, MongoDB      |
| Authentication        | JWT (default), Session-based, None        |
| Cache                 | Redis (via `@nestjs/cache-manager`), None |
| Queue                 | BullMQ, None                              |
| API Style             | REST only, GraphQL only, Both             |
| Package Manager       | npm, yarn, pnpm                           |

### 2.7 Package Naming and CLI Command

The CLI will be published to npm as `@mehedi-hasan0/nest-pilot` (placeholder — decide a name before Phase 2). The user experience will be:

```bash
# Install globally
npm install -g @mehedi-hasan0/nest-pilot

# Create a new project
nest-pilot create my-app

# This starts the interactive prompt
```

---

## 3. Phase Overview

The project is structured into five phases. Each phase has a clear input, output, and "done" criteria so you always know when you're ready to move forward.

| Phase | Name                   | Output                                                   | Done When...                                                     |
| ----- | ---------------------- | -------------------------------------------------------- | ---------------------------------------------------------------- |
| 0     | Foundation             | Repo scaffolding, CLI skeleton, shared utilities         | CLI runs, asks dummy questions, writes a test file               |
| 1     | Hexagonal Template     | Complete hexagonal architecture reference implementation | All layers, READMEs, example domain, tests done                  |
| 2     | CLI MVP                | Working CLI that generates the hexagonal template        | Running `nest-pilot create` produces a working hexagonal project |
| 3     | DDD Template + CLI     | DDD architecture added to CLI options                    | CLI can generate both Hexagonal and DDD projects                 |
| 4     | Modular Template + CLI | Modular architecture added to CLI options                | CLI can generate all three architectures                         |
| 5     | Polish & Publish       | npm-published CLI, community documentation               | Package published, README complete, changelog started            |

---

## 4. Phase 0 — Foundation & Infrastructure

**Goal:** Set up the monorepo, the CLI skeleton, and the shared utilities that all future phases depend on. Nothing architectural yet — this is purely infrastructure.

**Duration estimate:** 2–3 days.

### 4.1 Repo Initialization

Initialize the monorepo with npm workspaces. Set up the top-level `package.json` with workspace declarations. Initialize TypeScript at the root with a base `tsconfig.json` that both workspaces extend.

```bash
# Root package.json workspaces field
"workspaces": ["cli", "templates/*"]
```

Set up the root-level tooling: ESLint, Prettier, Husky, lint-staged, and Commitlint. These tools govern the boilerplate project itself, not the generated output.

### 4.2 CLI Skeleton

Create the `cli/` workspace with Commander and Clack installed. Implement the top-level `create` command that does nothing useful yet — it just runs through a placeholder prompt flow and writes a test file to disk. The goal is to prove the pipeline works end-to-end before any real templates exist.

The prompt flow skeleton should ask:

1. Project name (text input)
2. Architecture (select — options stubbed, not wired yet)
3. Package manager (select)

Then write a `README.md` to a new directory using the answers. This proves the Clack → answers → file write pipeline works.

### 4.3 Composer Skeleton

Create the `composer/` module inside the CLI. The composer's job is to take the user's answers and decide which template files to copy and how to parameterize them. For now, implement a minimal version: given a source template directory and a context object (the user's answers), copy all `.ejs` files to the output directory with basic interpolation applied.

This is the core engine — getting it right now means Phase 1 can focus entirely on template content.

### 4.4 Shared Template Utilities

Inside `templates/shared/`, create the files that every generated project will include regardless of architecture:

- `.eslintrc.js` template
- `.prettierrc` template
- `Dockerfile` template
- `docker-compose.yml` template (parameterized for database choice)
- `.env.example` template
- `commitlint.config.js` template
- `.husky/` pre-commit hook template

These are written once and reused by every architecture. The composer will merge them with architecture-specific files when generating a project.

**Phase 0 done criteria:** `nest-pilot create my-app` runs, asks three questions, creates a `my-app/` directory with a populated `README.md` and the shared files listed above.

---

## 5. Phase 1 — Hexagonal Architecture Reference Implementation

**Goal:** Build the complete, deeply documented hexagonal architecture template. No CLI integration yet — this is purely about getting the architecture right.

**Duration estimate:** 1–2 weeks.

**This is the most important phase.** The quality of thought invested here sets the standard for every phase that follows. Take the time to get it right.

### 5.1 Folder Structure

The generated hexagonal project will have this structure:

```
src/
├── domain/                          # Pure business logic. Zero framework dependencies.
│   ├── user/
│   │   ├── entities/
│   │   │   └── user.entity.ts       # Entity with identity and business methods
│   │   ├── value-objects/
│   │   │   ├── email.vo.ts          # Email value object with validation
│   │   │   └── password.vo.ts       # Password value object (hashing concern lives here)
│   │   ├── errors/
│   │   │   └── user.errors.ts       # Domain-specific error types
│   │   └── ports/
│   │       └── user.repository.port.ts   # Interface — what the domain needs from persistence
│   ├── post/
│   │   └── ...                      # Same structure as user
│   └── comment/
│       └── ...
│
├── application/                     # Orchestration layer. Depends on domain only.
│   ├── user/
│   │   ├── use-cases/
│   │   │   ├── register-user.use-case.ts
│   │   │   └── get-user-profile.use-case.ts
│   │   ├── dtos/
│   │   │   ├── register-user.dto.ts
│   │   │   └── user-profile.dto.ts
│   │   └── ports/
│   │       └── user-service.port.ts       # What the infrastructure needs from application
│   └── post/
│       └── ...
│
├── infrastructure/                  # Everything that touches the outside world.
│   ├── persistence/
│   │   ├── typeorm/                 # (or prisma/ depending on user's choice)
│   │   │   ├── entities/
│   │   │   │   └── user.orm-entity.ts    # ORM entity — separate from domain entity
│   │   │   ├── repositories/
│   │   │   │   └── user.repository.ts   # Implements user.repository.port.ts
│   │   │   └── mappers/
│   │   │       └── user.mapper.ts       # Maps between domain entity and ORM entity
│   ├── auth/
│   │   ├── jwt.strategy.ts
│   │   ├── jwt-auth.guard.ts
│   │   └── auth.module.ts
│   ├── http/
│   │   ├── controllers/
│   │   │   └── user.controller.ts
│   │   └── presenters/
│   │       └── user.presenter.ts        # Maps use case output to HTTP response shape
│   └── config/
│       ├── database.config.ts
│       └── app.config.ts
│
├── app.module.ts                    # Root NestJS module, wires everything together
└── main.ts                          # Bootstrap with security middleware
```

### 5.2 The Critical Rule: No Cross-Layer Imports Going Inward

This must be enforced visually in the code, not just stated in a README. The way to communicate it in code is through what is _absent_: the `domain/` folder must contain zero NestJS imports. You can verify this with a simple ESLint rule using `eslint-plugin-boundaries`, which will be included in the template.

### 5.3 Per-Folder README Files

Every major folder gets a `README.md` that answers three questions: what goes here, what is forbidden here, and why this boundary exists. These are not long essays — they are concise, precise, and written for someone who has a general idea of the architecture but needs the specific rule.

**Example: `src/domain/README.md`**

```markdown
## Domain Layer

This is the heart of the application. Everything here represents your
business problem in pure TypeScript — no frameworks, no databases, no HTTP.

**What belongs here:**

- Entities (objects with identity that encapsulate business rules)
- Value Objects (immutable objects defined by their value, not identity)
- Domain errors (typed errors that represent business rule violations)
- Repository ports (interfaces describing what persistence operations the domain needs)

**What is forbidden here:**

- Any import from `@nestjs/*`
- Any import from `typeorm`, `prisma`, or any ORM
- Any import from `../infrastructure` or `../application`

**Why this boundary exists:**
Your domain logic should be testable in complete isolation — no database,
no HTTP server, nothing. If you can spin up your entire domain in a unit test
with no mocks except for the repository interface, you've done this correctly.
This also means your business logic is portable. If you ever swap NestJS for
Fastify or Express, or PostgreSQL for MongoDB, your domain is untouched.
```

Write this quality of README for: `domain/`, `domain/user/`, `domain/user/ports/`, `application/`, `application/user/use-cases/`, `infrastructure/`, `infrastructure/persistence/`, `infrastructure/http/controllers/`.

### 5.4 Example Code Quality Standards

Every file in the template must be:

1. **Fully implemented, not stubbed.** No `// TODO: implement this` comments. If it's in the template, it works.
2. **Annotated with explanatory comments for non-obvious decisions.** Not every line, but every architectural decision that might confuse a reader.
3. **Consistent with the architecture's rules.** No shortcuts that violate the pattern just to save a few lines.

**Example of the right comment style:**

```typescript
// user.repository.port.ts
// This is a PORT — an interface defined by the DOMAIN expressing what it needs
// from the outside world. The domain doesn't know or care how persistence is
// implemented. It only knows what operations it needs.
// The ADAPTER (infrastructure/persistence/.../user.repository.ts) implements this.
export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
```

### 5.5 Testing Structure for Hexagonal

The testing setup for Hexagonal is one of the most valuable things to demonstrate correctly, because this is where the architecture's benefit is most visible.

```
src/
├── domain/user/
│   └── __tests__/
│       └── user.entity.spec.ts       # Pure unit test — no mocks, no DI, just new User()
├── application/user/
│   └── __tests__/
│       └── register-user.use-case.spec.ts  # Mocks the repository PORT, not the ORM
└── infrastructure/http/
    └── __tests__/
        └── user.controller.spec.ts   # Integration test with NestJS test module

test/
└── user.e2e-spec.ts                  # Full e2e using Supertest, real database in Docker
```

The key insight to demonstrate: the application layer use case test mocks `UserRepositoryPort` (the interface), not `UserRepository` (the TypeORM class). This means the test doesn't care how persistence is implemented — it only cares that the use case orchestrates the domain correctly. This is port/adapter in action.

### 5.6 Security Hardening in the Infrastructure Layer

For the `main.ts` bootstrap file, demonstrate production-ready setup:

- Helmet enabled
- Global validation pipe with `whitelist: true, forbidNonWhitelisted: true, transform: true`
- Global rate limiting via Throttler
- CORS configured from environment variable
- Swagger enabled in non-production environments only
- Graceful shutdown hooks

**Phase 1 done criteria:** The hexagonal template directory contains all folders, all files are fully implemented, every README is written, all tests pass when you run the template as a standalone NestJS project, and a reviewer with hexagonal architecture knowledge would find nothing shallow or incorrect.

---

## 6. Phase 2 — CLI MVP (Hexagonal)

**Goal:** Wire the hexagonal template into the CLI so that running `nest-pilot create my-app` and selecting Hexagonal Architecture produces a working, runnable NestJS project.

**Duration estimate:** 3–5 days.

### 6.1 Prompt Flow Design

The prompts are ordered from most to least architectural impact, because early answers constrain later options.

```
Step 1: Project name           (text input)
Step 2: Architecture           (select: Hexagonal | DDD | Modular)  [only Hexagonal works in this phase]
Step 3: ORM                    (select: TypeORM | Prisma | MikroORM)
Step 4: Database               (select: PostgreSQL | MySQL | MongoDB)  [MongoDB disabled if TypeORM chosen]
Step 5: Authentication         (select: JWT | Session | None)
Step 6: API Style              (select: REST | GraphQL | Both)
Step 7: Optional modules       (multiselect: Redis Cache | BullMQ Queue | WebSockets)
Step 8: Package manager        (select: npm | yarn | pnpm)

--- Summary screen showing all choices ---
Step 9: Confirm and generate   (confirm)
```

The summary screen before confirmation is important — it lets the user review their choices before anything is written to disk. Clack supports this naturally.

### 6.2 Composer Logic

The composer receives the answers object and executes the following steps in order:

1. **Resolve template paths** — determine which template directory to use (hexagonal) and which optional template files to include (auth module, cache module, etc.) based on answers.
2. **Build the context object** — a flat key-value map of all variables that EJS templates will interpolate (project name, ORM class names, database driver package, etc.).
3. **Copy and render files** — walk the resolved template paths, run each `.ejs` file through EJS with the context object, write the output to the destination directory with the `.ejs` extension removed.
4. **Post-generation steps** — initialize a git repo, run `npm install` (or `yarn` / `pnpm` based on choice), print a styled success message with next steps.

### 6.3 ORM Variation Strategy

Rather than maintaining three separate copies of the entire template (one per ORM), only the `infrastructure/persistence/` subtree varies by ORM choice. The composer will have three versions of that subtree and copy only the selected one. Everything else — domain, application, HTTP infrastructure — is ORM-agnostic and copied once.

This keeps the template surface area manageable. Adding a new ORM in the future means adding only a new `infrastructure/persistence/typeorm/`, `infrastructure/persistence/prisma/`, etc. — not duplicating the whole template.

### 6.4 Post-Generation Output

After generation, the CLI prints a styled summary using Clack's `outro` and `note` utilities:

```
✔ Project created successfully!

  Next steps:

  cd my-app
  cp .env.example .env      ← fill in your database credentials
  docker-compose up -d      ← start the database
  npm run start:dev         ← start the app

  Documentation:
  Read src/domain/README.md to understand the architecture boundaries.
  Read src/application/README.md to understand use case patterns.
```

**Phase 2 done criteria:** `nest-pilot create my-app` with Hexagonal Architecture selected produces a project that compiles with `tsc`, passes all tests, and starts successfully with a database running.

---

## 7. Phase 3 — DDD Template + CLI Extension

**Goal:** Add Domain-Driven Design as a fully supported second architecture in the CLI.

**Duration estimate:** 1.5–2 weeks for the template, 2 days for CLI integration.

### 7.1 How Phase 3 Follows Phase 1

Before writing any DDD code, run through the **Architecture Transition Checklist** (Section 9 of this document). This ensures consistency and prevents the second architecture from being shallower than the first.

The key question to answer before starting: how does this architecture _differ_ from Hexagonal in how it handles the Blog domain? Write the answer in prose before writing any code. This forces clarity on what makes DDD distinct — not just in structure but in philosophy.

**The core DDD-specific concepts that must appear in the template:**

- **Aggregates and Aggregate Roots** — `Post` is an aggregate root; `Comment` is part of the Post aggregate and cannot be accessed except through its root.
- **Value Objects** — `PostTitle`, `PostContent`, `Email` are value objects with invariant enforcement.
- **Domain Events** — publishing a post raises a `PostPublishedEvent` that other parts of the system can react to.
- **Repositories at the Aggregate level** — you save/load the entire Post aggregate (including its comments), not individual entities.
- **Application Services** — similar to use cases in Hexagonal, but named and organized around aggregates.

### 7.2 DDD Folder Structure

```
src/
├── modules/
│   ├── blog/                        # Bounded context: Blog
│   │   ├── domain/
│   │   │   ├── aggregates/
│   │   │   │   └── post/
│   │   │   │       ├── post.aggregate.ts
│   │   │   │       ├── post.events.ts        # PostPublishedEvent, PostCreatedEvent
│   │   │   │       └── comment.entity.ts     # Part of Post aggregate
│   │   │   ├── value-objects/
│   │   │   │   ├── post-title.vo.ts
│   │   │   │   └── post-content.vo.ts
│   │   │   └── repositories/
│   │   │       └── post.repository.interface.ts
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   ├── create-post.command.ts
│   │   │   │   └── publish-post.command.ts
│   │   │   ├── queries/
│   │   │   │   └── get-post.query.ts
│   │   │   └── handlers/            # CQRS handlers for commands and queries
│   │   └── infrastructure/
│   │       └── ...
│   └── identity/                    # Bounded context: User Identity
│       └── ...
```

### 7.3 CLI Changes for DDD

The DDD prompt flow is mostly the same as Hexagonal, but two additional questions become relevant: whether to include CQRS (using `@nestjs/cqrs`) and whether to use the EventBus for domain events. These are natural extensions of DDD that don't apply to Hexagonal.

**Phase 3 done criteria:** `nest-pilot create my-app --architecture ddd` (or selecting DDD interactively) produces a working DDD project. Both architectures remain fully functional in the CLI.

---

## 8. Phase 4 — Modular Architecture + CLI Extension

**Goal:** Add Modular Architecture as the third supported pattern.

**Duration estimate:** 1 week for the template, 2 days for CLI integration.

Modular Architecture is the most NestJS-native of the three patterns — it leans into NestJS modules as the primary unit of organization. This makes it the most approachable for developers new to architectural patterns, and a great "default" recommendation.

The template should demonstrate proper module boundaries (modules expose only what other modules need via their `exports` array), lazy loading for performance-sensitive contexts, and the use of NestJS's built-in `@nestjs/event-emitter` for cross-module communication without tight coupling.

**Phase 4 done criteria:** All three architectures are fully supported in the CLI. Each generates a working project. The CLI's architecture selection screen briefly describes each option so the user can make an informed choice.

---

## 9. Architecture Transition Blueprint

This checklist is run every time you complete one architecture and begin the next. It ensures consistency across the entire project and prevents later architectures from being second-class implementations.

### Step 1: Validate the Completed Architecture

Before moving on, confirm the completed architecture meets all standards:

- [ ] All layers have `README.md` files answering: what belongs here, what is forbidden, why
- [ ] All example domain code (User, Post, Comment) is fully implemented — no stubs
- [ ] Unit tests exist for domain and application layers
- [ ] Integration tests exist for the infrastructure layer
- [ ] E2e test exists and passes against Docker database
- [ ] Security baseline is fully wired (Helmet, Throttler, validation pipe, env validation)
- [ ] Observability baseline is fully wired (structured logging, health check)
- [ ] Docker files are present and the `docker-compose up` flow works
- [ ] The generated project compiles with zero TypeScript errors
- [ ] A fresh reviewer can read the code and READMEs and understand the architecture without external resources

### Step 2: Extract Learnings

Write a short section in your personal notes (or a `DECISIONS.md` in the repo) answering:

- What took longer than expected, and why?
- Were there any architectural decisions that felt wrong mid-implementation? How were they resolved?
- What parts of the template are you most uncertain about? (These deserve a second review before the next architecture begins.)
- Are there any shared patterns (base classes, utility types, config patterns) that should be moved to `templates/shared/`?

### Step 3: Identify Shared Components

Compare the completed template against `templates/shared/`. Move anything that is genuinely architecture-agnostic into shared. Common candidates after Phase 1 → Phase 3 transition: the `ConfigModule` setup, the auth module's JWT strategy, the health controller, and the Pino logger configuration.

### Step 4: Write the Architecture README Before the Code

For the new architecture, write `templates/<architecture>/README.md` first. This document explains: what the architecture is, what problems it solves, when to use it vs the others, the core rules/boundaries, and a folder map. Writing this first forces you to be clear about what you're building before you build it.

### Step 5: Map the Example Domain to the New Architecture

Write (in prose, not code) how the Blog domain maps to the new architecture's concepts. For example, before writing DDD code, write: "In DDD, Post is an aggregate root because it owns Comment objects and enforces invariants like 'a published post cannot have its title changed.' Comment is not an aggregate root — it is only accessible through Post." This mapping exercise will surface ambiguities before they become bugs in the template.

### Step 6: Build the Template

Follow the same quality standards established in Phase 1. Every folder gets a README. Every file is fully implemented. Tests exist at every layer.

### Step 7: Wire into the CLI

Extend the composer to support the new architecture. Add the new option to the architecture prompt. Ensure the summary screen and post-generation message reflect the new architecture's specific next steps.

---

## 10. Phase 5 — Polish & Community Preparation

**Goal:** Prepare the project for public use if you decide to share it.

**Duration estimate:** 1 week.

### 10.1 Root-Level README

The root README is the project's front door. It must answer, in under two minutes of reading: what this is, why it exists, how to install and use it, what architectures are supported and how to choose between them, and how to contribute.

Include an architecture comparison table:

| Factor               | Hexagonal                       | DDD                              | Modular                               |
| -------------------- | ------------------------------- | -------------------------------- | ------------------------------------- |
| Learning curve       | Medium                          | High                             | Low                                   |
| Best for             | Domain complexity + testability | Rich domain model + event-driven | Standard CRUD apps, rapid development |
| Framework coupling   | Very low                        | Low                              | High                                  |
| Boilerplate overhead | High                            | Very high                        | Low                                   |

### 10.2 npm Publication

Before publishing, decide on: package name, semantic versioning strategy, and whether to use a GitHub Action for automated releases.

The `cli/package.json` should have a `bin` field pointing to the compiled CLI entry point, and `files` should include only the compiled `dist/` and the `templates/` directory.

### 10.3 Changelog

Start a `CHANGELOG.md` from day one of Phase 5. Use [Conventional Commits](https://www.conventionalcommits.org/) format, which Commitlint (set up in Phase 0) will enforce.

---

## 11. Decision Log

This section records key decisions and their rationale. Update it whenever a significant decision is made. This is invaluable when you return to the project after time away and can't remember why something was done a certain way.

| Decision                       | Alternatives Considered  | Why This Choice                                                                |
| ------------------------------ | ------------------------ | ------------------------------------------------------------------------------ |
| Monorepo                       | Separate repos           | CLI and templates are too tightly coupled to split until the project matures   |
| Clack for prompts              | Inquirer, Enquirer       | Clack is the modern standard; better aesthetics, simpler API                   |
| EJS for templates              | Handlebars, Mustache     | Simpler, no logic in templates (logic belongs in the composer)                 |
| Blog as example domain         | E-commerce, Task Manager | Right complexity level; relationships without overwhelming detail              |
| class-validator for validation | Zod                      | Native to NestJS ecosystem; less friction for NestJS developers                |
| Pino for logging               | Winston                  | Better performance, structured JSON output by default                          |
| TypeORM as default ORM         | Prisma                   | More NestJS-native; Prisma is offered as an option                             |
| Hexagonal first                | DDD, Modular             | Author's strongest architecture; best foundation for project quality standards |

---

## 12. What's Not in Scope (For Now)

Explicitly tracking what is out of scope prevents scope creep.

- **GraphQL-first templates** — GraphQL is an _option_ in the CLI, but not a primary architecture concern
- **Microservices architecture** — too much additional complexity; deserves its own project
- **Non-NestJS backends** — this is a NestJS-specific tool
- **Frontend scaffolding** — out of scope; this is a backend boilerplate
- **Database migrations in the template** — scaffolded but not pre-populated; too project-specific
- **Cloud deployment configs** (Kubernetes, AWS CDK, etc.) — too opinionated for a community tool; may revisit

---

_Last updated: Initial planning session._
_Next action: Begin Phase 0 — monorepo initialization and CLI skeleton._
