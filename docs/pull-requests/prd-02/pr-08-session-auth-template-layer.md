## What does this PR do?

Implements the **Session-Based Auth Template Layer** (Issue #8). This adds support for stateful session authentication using Passport's local strategy and a Redis-backed session store.

---

## Why?

Fixes #8 — While JWT is the modern standard for APIs, many applications still require traditional session management for security (server-side invalidation) or architectural reasons (SSR, admin panels). This PR enables the CLI to generate a production-ready session stack.

---

## Type of change

- [x] New feature (Session Auth overlay layer)
- [x] Refactoring (Converted `main.ts` to EJS for middleware injection)

---

## Checklist

**If you changed the CLI:**

- [x] `npm run build --workspace=cli` passes with zero TypeScript errors
- [x] `npm run test --workspace=cli` passes
- [x] `buildContext.ts` now ensures `hasRedis: true` when `auth === "session"`

**Template Verification:**

- [x] Created `templates/hexagonal/auth/session/` with strategies, guards, and serializers.
- [x] Converted `main.ts` to `main.ts.ejs` in the base template.
- [x] Injected `express-session` and `passport.session()` middleware conditionally in `main.ts.ejs`.
- [x] Configured `RedisStore` to handle session persistence via `ioredis`.
- [x] Updated `package.json.ejs` to include session dependencies and their `@types`.

---

## Changes Made

| File                                                                                             | Change                                                           |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `templates/hexagonal/auth/session/src/infrastructure/auth/auth.module.ts.ejs`                    | Configures Passport with `session: true`.                        |
| `templates/hexagonal/auth/session/src/infrastructure/auth/strategies/local.strategy.ts.ejs`      | Implements `passport-local` for username/password login.         |
| `templates/hexagonal/auth/session/src/infrastructure/auth/guards/local-auth.guard.ts.ejs`        | Triggers the session login flow on success.                      |
| `templates/hexagonal/auth/session/src/infrastructure/auth/guards/authenticated.guard.ts.ejs`     | Guard for protecting routes via `req.isAuthenticated()`.         |
| `templates/hexagonal/auth/session/src/infrastructure/auth/serializers/session.serializer.ts.ejs` | Handles user serialization/deserialization into the session.     |
| `templates/hexagonal/base/src/main.ts.ejs`                                                       | Dynamically imports and uses `express-session` and `RedisStore`. |
| `templates/shared/config/package.json.ejs`                                                       | Injects `express-session`, `connect-redis`, and `ioredis`.       |
| `cli/src/composer/buildContext.ts`                                                               | Added logic to force `hasRedis: true` for session auth projects. |

---

## Anything the reviewer should know?

- Session auth explicitly requires Redis. Even if the user doesn't select the Redis optional module, the project will now include it to support the session store.
- The `LocalStrategy` includes a placeholder validation logic that should be replaced with a real database lookup in the generated project.
