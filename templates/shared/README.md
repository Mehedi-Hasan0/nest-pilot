# templates/shared/

Shared template files that are included in **every** generated project, regardless of the architecture chosen (Hexagonal, DDD, or Modular).

## Directory Structure

```
shared/
├── config/        ← Developer tooling config files
├── docker/        ← Multi-stage Dockerfile, docker-compose.yml, .dockerignore
├── env/           ← .env.example with all required environment variables
└── git/           ← .gitignore, Husky hooks
```

## What belongs here

- Files that are **identical across all three architectures**.
- The security baseline: Helmet, Throttler, class-validator, Zod env validation.
- The observability baseline: Pino logger, health check endpoint (`@nestjs/terminus`).
- Developer tooling: ESLint, Prettier, Commitlint, Husky, lint-staged.

## What is forbidden here

- Architecture-specific code (domain layer, ports, aggregates, modules) — that belongs in `templates/hexagonal/`, `templates/ddd/`, or `templates/modular/`.
- Hardcoded project names — use `<%= projectName %>` EJS interpolation.
- Business logic of any kind.
- `.ejs` files that contain `<% if / for / while %>` tags — all logic must live in `buildContext.ts`.

## File Naming Convention

npm strips leading dots (`.`) from files when publishing a package. To prevent this, template files that should have a leading dot in their output are stored **without** the dot and renamed at generation time:

| Template filename  | Output filename |
| ------------------ | --------------- |
| `gitignore.ejs`    | `.gitignore`    |
| `env.example.ejs`  | `.env.example`  |
| `prettierrc.ejs`   | `.prettierrc`   |
| `eslintrc.js.ejs`  | `.eslintrc.js`  |
| `dockerignore.ejs` | `.dockerignore` |

The rename mapping is maintained in `cli/src/composer/applyFilenameRenames.ts`.
