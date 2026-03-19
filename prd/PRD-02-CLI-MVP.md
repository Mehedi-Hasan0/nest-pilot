# PRD-02: CLI MVP — Hexagonal Architecture Generation

| Field              | Value                                                       |
| ------------------ | ----------------------------------------------------------- |
| Document ID        | PRD-02                                                      |
| Phase              | 2 — CLI MVP                                                 |
| Status             | Ready to Build                                              |
| Depends On         | PRD-00 (CLI skeleton), PRD-01 (Hexagonal template complete) |
| Blocks             | PRD-03 (DDD must be added on top of a working CLI)          |
| Estimated Duration | 3–5 days                                                    |

---

## 1. Purpose

This document defines all requirements for the first fully functional version of the CLI. By the end of this phase, running `nest-pilot create my-app` and selecting Hexagonal Architecture must produce a complete, runnable, production-ready NestJS project — not a stub, not a skeleton, but something you could `git push` and deploy.

The goal of Phase 2 is to connect the engine (Phase 0's composer) to the content (Phase 1's template) and prove that the full system works together. It also introduces ORM and auth variation — the user can choose TypeORM or Prisma, and the CLI generates the right persistence layer.

---

## 2. Goals

1. The full prompt flow from "what is your project name?" to "project generated" must work end-to-end.
2. The composer must correctly assemble the hexagonal template with the user's chosen ORM and auth strategy.
3. The generated project must compile with zero TypeScript errors.
4. The generated project must pass all tests when run against a Docker database.
5. Post-generation messaging must give the user exactly what they need to run the app — no guesswork.

---

## 3. Non-Goals

- No DDD or Modular architecture in this phase.
- No `nest-pilot add` command (feature addition to existing projects).
- No npm publication yet.
- No CI/CD pipeline for the boilerplate project itself.

---

## 4. Full Prompt Flow Specification

### 4.1 Flow Design Principles

- **Each question must be necessary.** If the answer can be reasonably inferred from a previous answer, infer it — don't ask.
- **Questions are ordered by impact.** Architecture first (most structural), then persistence, then auth, then optional modules, then DX preferences.
- **Every option has a visible description.** The user should be able to make informed choices without consulting external docs.
- **The summary step is mandatory.** Before writing anything to disk, show a full review of choices.

### 4.2 Complete Prompt Sequence

```
┌─────────────────────────────────────────────────────┐
│          NestJS Pilot — Project Generator           │
│                      v0.2.0                         │
└─────────────────────────────────────────────────────┘

Step 1: Project Setup
─────────────────────
◇  What is your project name?
   (Used for directory name, package.json name, and .env APP_NAME)
│  my-app

◇  What architecture do you want to use?
   ●  Hexagonal (Ports & Adapters)
      Isolates business logic from frameworks and databases.
      Best for: complex domains, high testability requirements.
   ○  Domain-Driven Design (DDD)          [coming in v0.3]
   ○  Modular Architecture                [coming in v0.4]
│  Hexagonal

Step 2: Database & ORM
──────────────────────
◇  Which ORM would you like to use?
   ●  TypeORM   — NestJS-native, decorator-based, widely used
   ○  Prisma    — Schema-first, excellent DX, generated client
   ○  MikroORM  — Unit-of-work pattern, flexible
│  TypeORM

◇  Which database?
   ●  PostgreSQL  (recommended)
   ○  MySQL
   ○  MongoDB     (available only with Prisma or MikroORM)
│  PostgreSQL

Step 3: Authentication
──────────────────────
◇  What authentication strategy do you want?
   ●  JWT (Bearer token)    — Stateless, standard for APIs
   ○  Session-based         — Stateful, requires Redis
   ○  None                  — I'll add auth later
│  JWT

Step 4: Optional Modules
────────────────────────
◇  Which optional modules do you want to include?
   (Use space to select, enter to confirm)
   [ ]  Redis Cache         (@nestjs/cache-manager + ioredis)
   [ ]  BullMQ Queues       (background job processing)
   [ ]  WebSockets          (@nestjs/websockets + socket.io)
   [ ]  Swagger / OpenAPI   (API documentation UI)
│  Swagger selected

Step 5: Developer Experience
─────────────────────────────
◇  Which package manager do you prefer?
   ●  npm
   ○  yarn
   ○  pnpm
│  npm

─────────────────────────────
Review your selections:

  Project name    my-app
  Architecture    Hexagonal (Ports & Adapters)
  ORM             TypeORM
  Database        PostgreSQL
  Auth            JWT
  Optional        Swagger / OpenAPI
  Package mgr     npm

◇  Generate project?
   ●  Yes, create my-app
   ○  No, go back and change something
│  Yes

◆  Creating project structure...
◆  Configuring TypeORM + PostgreSQL...
◆  Setting up JWT authentication...
◆  Installing Swagger...
◆  Initializing git repository...
◆  Done!

└────────────────────────────────────────────────────
  Project created at ./my-app

  Next steps:
    cd my-app
    cp .env.example .env
    ← open .env and fill in your database credentials

    docker-compose up -d      (start the database)
    npm install               (install dependencies)
    npm run start:dev         (start the app)

  App will be available at: http://localhost:3000
  Swagger UI (dev only) at:  http://localhost:3000/api

  Read src/domain/README.md to understand architecture boundaries.
────────────────────────────────────────────────────
```

### 4.3 Validation Rules

| Input             | Validation Rule                          | Error Message                                                     |
| ----------------- | ---------------------------------------- | ----------------------------------------------------------------- |
| Project name      | Must match `/^[a-z][a-z0-9-]*$/`         | "Project name must be lowercase with hyphens only (e.g., my-app)" |
| Project name      | Must not be an existing directory in cwd | "A directory named '{name}' already exists. Overwrite? (y/N)"     |
| Project name      | Must not be a reserved npm package name  | "'{name}' is a reserved name. Please choose another."             |
| MongoDB + TypeORM | Invalid combination                      | MongoDB option is disabled/greyed out when TypeORM is selected    |

### 4.4 Cancellation Handling

At any point in the prompt flow, pressing `Ctrl+C` must:

1. Print a clean cancellation message using Clack's `cancel()` utility.
2. Clean up any partially created files (if generation had started).
3. Exit with code `0` (not `1` — this is a user choice, not an error).

---

## 5. Composer Extension Requirements

The Phase 0 composer skeleton must be extended to support architecture-specific and option-specific template composition.

### 5.1 Template Resolution Strategy

The composer must resolve templates in layers, with later layers able to override earlier ones:

```
Layer 1: templates/shared/              ← Always included
Layer 2: templates/hexagonal/           ← Architecture-specific
Layer 3: templates/hexagonal/orm/typeorm/   ← ORM-specific (overwrites Layer 2 persistence files)
Layer 4: templates/hexagonal/auth/jwt/      ← Auth-specific (adds auth files)
Layer 5: templates/hexagonal/optional/swagger/  ← Optional module files (additive)
```

If the same relative file path exists in multiple layers, the later layer wins (overlay pattern).

This strategy means the hexagonal template's base files only need to be written once. ORM and auth variations only contain the files that _differ_. There is no full copy of the template per ORM combination.

### 5.2 Template Directory Layout for Hexagonal

```
templates/hexagonal/
├── base/                          ← Core hexagonal structure (ORM-agnostic)
│   ├── src/
│   │   ├── domain/                ← Complete (doesn't change per ORM)
│   │   ├── application/           ← Complete (doesn't change per ORM)
│   │   ├── infrastructure/
│   │   │   ├── auth/              ← Populated by auth layer
│   │   │   ├── config/            ← Complete
│   │   │   ├── http/              ← Complete
│   │   │   ├── modules/           ← Template — contains placeholder for repository provider
│   │   │   └── persistence/       ← Empty — filled by ORM layer
│   │   ├── app.module.ts.ejs
│   │   └── main.ts.ejs
│   └── test/
│
├── orm/
│   ├── typeorm/                   ← Fills infrastructure/persistence/typeorm/
│   │   ├── entities/
│   │   ├── repositories/
│   │   ├── mappers/
│   │   └── README.md.ejs
│   ├── prisma/                    ← Fills infrastructure/persistence/prisma/
│   │   ├── schema.prisma.ejs
│   │   ├── repositories/
│   │   └── README.md.ejs
│   └── mikroorm/
│       └── ...
│
├── auth/
│   ├── jwt/                       ← Fills infrastructure/auth/
│   │   ├── jwt.strategy.ts.ejs
│   │   ├── jwt-auth.guard.ts.ejs
│   │   ├── current-user.decorator.ts.ejs
│   │   └── auth.module.ts.ejs
│   ├── session/
│   │   └── ...
│   └── none/                      ← Empty — no auth files added
│
└── optional/
    ├── swagger/
    │   └── swagger.setup.ts.ejs   ← Added to main.ts setup call
    ├── redis/
    │   └── ...
    └── bullmq/
        └── ...
```

### 5.3 Context Object Extension

The context object must be extended for Phase 2 with all variables needed to parameterize the hexagonal template:

```typescript
interface ComposerContext {
  // Phase 0 fields
  projectName: string;
  projectNamePascalCase: string;
  projectNameConstant: string;
  packageManager: "npm" | "yarn" | "pnpm";
  year: string;

  // Phase 2 additions
  architecture: "hexagonal" | "ddd" | "modular";
  orm: "typeorm" | "prisma" | "mikroorm";
  database: "postgresql" | "mysql" | "mongodb";
  auth: "jwt" | "session" | "none";
  optionalModules: Array<"swagger" | "redis" | "bullmq" | "websockets">;

  // Derived fields for template use
  databaseDriver: string; // e.g., 'pg' for postgresql
  databasePort: number; // e.g., 5432 for postgresql
  ormPackages: string[]; // npm package names to install
  authPackages: string[]; // npm package names to install
  hasSwagger: boolean; // Shorthand booleans for EJS conditionals
  hasRedis: boolean;
  hasBullMQ: boolean;
}
```

All derived fields must be computed in the `buildContext()` function, not in templates. Templates must be kept logic-free — they only reference context variables, they do not compute values.

### 5.4 Dependency Installation

After files are written, the composer must run the package manager's install command:

```typescript
async function installDependencies(
  outputDir: string,
  packageManager: string,
): Promise<void> {
  const commands = {
    npm: "npm install",
    yarn: "yarn install",
    pnpm: "pnpm install",
  };
  // Run with a spinner showing "Installing dependencies..."
  // If install fails, print the error output and a message:
  // "Dependencies could not be installed automatically. Run '<command>' manually."
  // Do NOT fail the whole generation — the files are already written.
}
```

The install step is best-effort. If it fails (e.g., no internet connection), the generated project is still complete — the user just needs to run install manually.

### 5.5 Spinner and Progress Feedback

The composer must show progress during generation using Clack spinners. Each major step gets its own spinner message:

```
◆  Generating project structure...     ← File copying and rendering
◆  Configuring TypeORM...              ← ORM layer overlay
◆  Setting up JWT authentication...    ← Auth layer overlay
◆  Adding optional modules...          ← Optional overlay
◆  Installing dependencies...          ← npm/yarn/pnpm install
◆  Initializing git repository...      ← git init + initial commit
```

---

## 6. ORM Variation Specifications

### 6.1 TypeORM Variant

The TypeORM variant is the default and was built in Phase 1. The CLI must:

- Copy `templates/hexagonal/orm/typeorm/` into `src/infrastructure/persistence/typeorm/`
- Add the following to the generated `package.json` dependencies:
  - `typeorm`, `@nestjs/typeorm`
  - `pg` (for PostgreSQL) or `mysql2` (for MySQL)
  - `uuid` (already a peer dependency, but must be explicit)
- Generate a `src/infrastructure/config/database.config.ts` that wires TypeORM using environment variables

**`app.module.ts` for TypeORM** must include:

```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: "postgres", // or 'mysql' — injected via EJS
    host: configService.get("DATABASE_HOST"),
    port: configService.get("DATABASE_PORT"),
    username: configService.get("DATABASE_USER"),
    password: configService.get("DATABASE_PASSWORD"),
    database: configService.get("DATABASE_NAME"),
    entities: [__dirname + "/**/*.orm-entity{.ts,.js}"],
    synchronize: configService.get("NODE_ENV") !== "production", // NEVER sync in production
    logging: configService.get("NODE_ENV") === "development",
  }),
  inject: [ConfigService],
});
```

The `synchronize: false in production` rule must be documented with a comment in the generated file.

### 6.2 Prisma Variant

When the user selects Prisma, the persistence layer is fundamentally different. Instead of ORM entity classes, there is a `schema.prisma` file. The CLI must:

- Copy `templates/hexagonal/orm/prisma/` into `src/infrastructure/persistence/prisma/`
- Generate a `prisma/schema.prisma` file at the project root with the User, Post, and Comment models
- Add the following to `package.json`:
  - `@prisma/client` (runtime dependency)
  - `prisma` (dev dependency for CLI)
- Add `prisma generate` to the `postinstall` script
- Generate a `PrismaService` that extends `PrismaClient` and implements `OnModuleInit`

The repository implementations for Prisma use the Prisma client directly (via `PrismaService`) rather than the `@InjectRepository()` pattern.

### 6.3 MikroORM Variant

When the user selects MikroORM:

- Copy `templates/hexagonal/orm/mikroorm/`
- Add `@mikro-orm/core`, `@mikro-orm/nestjs`, and the appropriate driver package
- Generate a `mikro-orm.config.ts` at the project root
- Repository implementations use MikroORM's `EntityManager` and `EntityRepository` pattern

---

## 7. Auth Variation Specifications

### 7.1 JWT Variant (Built in Phase 1)

The CLI must:

- Copy `templates/hexagonal/auth/jwt/` into `src/infrastructure/auth/`
- Add to `package.json`: `@nestjs/passport`, `passport`, `passport-jwt`, `@nestjs/jwt`, `bcrypt`
- Add to dev dependencies: `@types/passport-jwt`, `@types/bcrypt`

### 7.2 Session-Based Variant

The session variant requires Redis for session storage. The CLI must:

- Only offer Session auth as an option if Redis was selected in optional modules (or automatically add Redis when session is selected)
- Copy `templates/hexagonal/auth/session/` into `src/infrastructure/auth/`
- Add `express-session`, `passport-local`, `connect-redis`, `ioredis`
- Generate a session middleware configuration in `main.ts`

### 7.3 None Variant

When the user selects "None":

- The `src/infrastructure/auth/` directory is not created
- No auth-related packages are added
- All controllers are generated without `@UseGuards(JwtAuthGuard)`
- A comment is added to `app.module.ts` noting where to add authentication later

---

## 8. Optional Module Specifications

### 8.1 Swagger

When selected:

- Add `@nestjs/swagger` and `swagger-ui-express` to `package.json`
- Generate `src/infrastructure/http/swagger.setup.ts` with a setup function
- Call the setup function in `main.ts` (inside the `NODE_ENV !== 'production'` block)
- All controller files must be generated with `@ApiTags()`, `@ApiOperation()`, and `@ApiResponse()` decorators
- All HTTP DTOs must include `@ApiProperty()` decorators

### 8.2 Redis Cache

When selected:

- Add `@nestjs/cache-manager`, `cache-manager`, `ioredis`, `cache-manager-ioredis-yet`
- Add a Redis service to `docker-compose.yml`
- Add `REDIS_HOST` and `REDIS_PORT` to `.env.example`
- Generate a `CacheModule` configuration in `app.module.ts`

### 8.3 BullMQ

When selected:

- Add `@nestjs/bullmq`, `bullmq`
- Automatically includes Redis (same as above — BullMQ requires Redis)
- Generate an example job processor in `src/infrastructure/jobs/example-job/` with processor class and queue name constant
- Add a `QueueModule` to `app.module.ts`

### 8.4 WebSockets

When selected:

- Add `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`
- Generate an example gateway in `src/infrastructure/gateways/example.gateway.ts`
- Document that WebSocket gateways live in the infrastructure layer (they are adapters)

---

## 9. Post-Generation Steps

After all files are written and dependencies installed, the CLI must perform these steps:

### 9.1 Git Initialization

```bash
git init
git add .
git commit -m "chore: initial project scaffold via nest-pilot"
```

The initial commit message must follow conventional commits format. If git is not available, skip silently.

### 9.2 Success Message

The success message must be structured with Clack's `note()` and `outro()`:

```
┌─ Next Steps ──────────────────────────────────────────┐
│                                                       │
│  1. cd my-app                                         │
│  2. cp .env.example .env  ← fill in your credentials  │
│  3. docker-compose up -d  ← start database            │
│  4. npm run start:dev     ← start the app             │
│                                                       │
│  App:     http://localhost:3000                       │
│  Swagger: http://localhost:3000/api  (dev only)       │
│                                                       │
│  📖 Read src/domain/README.md to understand           │
│     the architecture boundaries.                     │
└───────────────────────────────────────────────────────┘

✔  Done! Happy building.
```

---

## 10. CLI Flags and Options

The `create` command must support these flags, all optional:

| Flag             | Type    | Default | Description                                                                        |
| ---------------- | ------- | ------- | ---------------------------------------------------------------------------------- |
| `--dry-run`      | boolean | false   | Preview what will be generated without writing to disk                             |
| `--skip-install` | boolean | false   | Skip the `npm install` step                                                        |
| `--skip-git`     | boolean | false   | Skip the `git init` step                                                           |
| `--defaults`     | boolean | false   | Skip all prompts, use sensible defaults (Hexagonal, TypeORM, PostgreSQL, JWT, npm) |
| `--verbose`      | boolean | false   | Print each file path as it is written                                              |

---

## 11. Error Handling Requirements

The CLI must handle all failure modes gracefully. No stack traces should be shown to the user unless `--verbose` is active.

| Failure Scenario                      | CLI Behavior                                                                         |
| ------------------------------------- | ------------------------------------------------------------------------------------ |
| Output directory already exists       | Prompt for overwrite confirmation                                                    |
| EJS render error                      | Print: "Template error in [file]: [message]. Please report this at [issues URL]."    |
| npm install fails                     | Print: "Dependencies could not be installed. Run 'npm install' manually." Continue.  |
| git not found                         | Print: "git not found — skipping repository initialization." Continue.               |
| Disk write permission denied          | Print: "Cannot write to [path]. Check folder permissions." Exit non-zero.            |
| User presses Ctrl+C during generation | Clean up partial output directory. Print: "Cancelled." Exit 0.                       |
| Node version too old                  | Check Node version at startup. Require >=18. If older: print clear message and exit. |

---

## 12. Testing Requirements

### 12.1 Prompt Flow Tests

Unit tests must verify:

- `buildContext()` correctly derives all fields for each ORM/auth/database combination
- `resolveTemplateLayers()` returns the correct ordered list of template paths for each option combination
- `applyFilenameRenames()` handles all documented renames

### 12.2 Composer Integration Tests

Integration tests must verify the complete generation output for the most common combinations:

| Test                 | Options                           | Verifies                                                                                      |
| -------------------- | --------------------------------- | --------------------------------------------------------------------------------------------- |
| Default generation   | TypeORM, PostgreSQL, JWT, Swagger | All expected files exist, no `.ejs` extensions remain, all `projectName` occurrences replaced |
| Prisma generation    | Prisma, PostgreSQL, JWT, None     | `prisma/schema.prisma` exists, TypeORM files absent, `PrismaService` present                  |
| No auth              | TypeORM, PostgreSQL, None, None   | No `src/infrastructure/auth/` directory, no guard decorators in controllers                   |
| All optional modules | TypeORM, PostgreSQL, JWT, all     | Redis config, BullMQ processor, WebSocket gateway all present                                 |

### 12.3 Generated Project Smoke Test

A CI-level test must:

1. Run `nest-pilot create smoke-test --defaults --skip-install --skip-git`
2. Run `npm install` in the generated directory
3. Run `npm run build` — must exit 0
4. Run `npm run lint` — must exit 0
5. Run `npm run test` — must exit 0

This test is the gatekeeper for merging any changes to the templates.

---

## 13. Acceptance Criteria

Phase 2 is complete when **all** of the following are true:

- [ ] `nest-pilot create my-app` runs the complete prompt flow without errors.
- [ ] Selecting Hexagonal + TypeORM + PostgreSQL + JWT generates a project that compiles, lints, and tests pass.
- [ ] Selecting Hexagonal + Prisma + PostgreSQL + JWT generates a project that compiles, lints, and tests pass.
- [ ] The `--dry-run` flag prints all expected file paths without writing anything.
- [ ] The `--defaults` flag skips all prompts and generates a project with default options.
- [ ] `Ctrl+C` at any prompt exits cleanly without leaving partial files on disk.
- [ ] The generated project's `docker-compose up -d && npm run start:dev` flow works without manual intervention beyond filling in `.env`.
- [ ] The success message is correct and actionable for each architecture/ORM combination.
- [ ] All composer unit tests and integration tests pass.
- [ ] The generated project smoke test passes in CI.

---

_PRD-02 complete. Next: PRD-03 — DDD Template & CLI Extension._
