# ADR-004: Optional Example Code Generation

**Date**: 2026-03-19
**Status**: Accepted

## Context

In PRD-01 (Hexagonal Template), the template defines a complex mock domain — a "Blog platform" containing `User`, `Post`, and `Comment` modules. This is explicitly designed to demonstrate complex relationships, inter-module dependencies, and proper architectural boundaries (such as how to map database enums and value-objects across layers).

However, forcing the generation of these modules into every new project creates significant friction for experienced users (or developers creating actual production applications), as they must immediately delete all the `Post` and `Comment` scaffolding to start building their own domain.

## Decision

The CLI will introduce a new prompt option immediately following the Architecture selection:
**"Include example domain code (Blog platform)?" (Yes/No)**

1.  **Template Structure**: The templates/hexagonal directory will still contain the full `Post` and `Comment` modules in `src/domain`, `src/application`, and `src/infrastructure`. We will not maintain two separate templates. We MUST maintain these example files natively so the overarching template can be E2E-tested effectively to ensure boundary rules are not violated.
2.  **Composer Engine**: The `renderFiles` phase of the Composer will utilize the `includeExampleCode: boolean` context variable to selectively ignore copying `post/` and `comment/` directories (as well as filtering them out of `app.module.ts` providers/imports via EJS) when the user opts-out. The `User` module will remain regardless, as it is fundamentally tied to the Authentication layer generation.

## Rationale

- **Developer Experience (DX)**: It prevents boilerplate fatigue for power users while still providing the heavy educational content for new users.
- **Maintainability**: Keeping the example code in the true source template ensures it does not drift out-of-sync or break, because our automated tests will validate the full template.
- **Simplicity**: The CLI engine (`renderFiles.ts`) can easily skip files/directories matching certain glob patterns at runtime rather than requiring complex AST manipulation or duplicate template folders.

## Consequences

- The `buildContext.ts` must generate an `includeExampleCode` boolean flag.
- `app.module.ts.ejs` must use EJS conditional blocks (`<% if (includeExampleCode) { ... } %>`) around the `PostModule` and `CommentModule` imports.
- The Composer (`renderFiles.ts`) must identify and skip `/post/` and `/comment/` directory paths when `includeExampleCode === false`.
