# CLI Tool & Engine Rules

These rules apply to the `cli/` package development and the template engine.

## 1. CLI Standards

- **Parsing**: Use `commander` for command definitions and help text.
- **Interaction**: Use `@clack/prompts` for all interactive flows (prompts, spinners, notes).
- **Persistence**: File writing must be handled reliably (e.g., `fs-extra`).

## 2. Template Composer Engine

- **Engine**: EJS is the non-negotiable template engine.
- **Renaming**: The composer must handle system-reserved files (e.g., `gitignore` -> `.gitignore`) to prevent npm from stripping them.
- **Persistence Variation**: Every architecture must support TypeORM, Prisma, and MikroORM by swapping the `infrastructure/persistence` layer during generation.
