# PRD-04: Modular Architecture & CLI Extension

| Field              | Value                                                 |
| ------------------ | ----------------------------------------------------- |
| Document ID        | PRD-04                                                |
| Phase              | 4 — Modular Architecture                              |
| Status             | Ready after PRD-03 is complete                        |
| Depends On         | PRD-03 (DDD complete, CLI supports two architectures) |
| Blocks             | PRD-05 (Polish and publish)                           |
| Estimated Duration | 1 week (template) + 2 days (CLI extension)            |

---

## 1. Purpose

This document defines all requirements for the Modular Architecture template and its integration into the CLI. Modular Architecture is the most NestJS-native pattern of the three — it embraces the NestJS module system as the primary organizational unit and produces code that experienced NestJS developers will immediately recognize and feel comfortable in.

It is intentionally the least complex architecture in this project. That is not a weakness — it is its selling point. Modular Architecture has the lowest barrier to entry, the shortest time-to-productive, and is the right default choice for most projects that don't yet have evidence of a complex domain.

---

## 2. Pre-Implementation Checklist (Architecture Transition)

- [ ] **Phase 3 validation** — All DDD acceptance criteria from PRD-03 are met.
- [ ] **Learnings documented** — `docs/decisions/ADR-002-ddd-learnings.md` written.
- [ ] **Shared components extracted** — Auth, config, and utility patterns reviewed again.
- [ ] **Modular README written first** — `templates/modular/README.md` written before implementation.
- [ ] **Domain mapping written** — Blog domain mapping to Modular concepts written in prose (Section 4).

---

## 3. Architecture Overview

### 3.1 What Modular Architecture Is

Modular Architecture organizes the application into **feature modules** — self-contained vertical slices where each module owns its own controllers, services, repositories, and entities. Modules declare explicit boundaries through NestJS's `imports` and `exports` arrays, which makes the dependency graph visible and enforceable at the framework level.

It is distinct from a "flat" NestJS application (everything in one module) and distinct from Hexagonal/DDD (no strict layer separation within each module). The module boundary _is_ the architectural boundary.

### 3.2 When to Choose Modular Over the Others

The template's README must be direct about this:

| Choose Modular when...                                  | Choose Hexagonal when...                                                   | Choose DDD when...                                             |
| ------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------- |
| You're building a standard API with CRUD-heavy features | You need to swap databases or frameworks without touching business logic   | Your domain is complex with many business rules and invariants |
| Your team is new to NestJS                              | You want maximum testability of business logic in isolation                | You have rich inter-entity relationships and state machines    |
| You want to move fast with familiar patterns            | You're building a long-lived product with an unstable infrastructure layer | Your domain experts and developers need to share a language    |
| Your domain is relatively simple                        | —                                                                          | —                                                              |

### 3.3 The Key Rules That Make It "Architecture" Rather Than Just "Folders"

Modular Architecture is only as good as its boundaries are enforced. The template must communicate and demonstrate:

1. **Services do not import other modules' services directly.** They import via the module's `exports`. If a module doesn't export something, it's private.
2. **Entities belong to their module.** `UserModule` owns `UserEntity`. `PostModule` owns `PostEntity`. They don't share ORM entities.
3. **Cross-module communication goes through the module's public interface**, not by reaching into its internals.
4. **Events for loose coupling.** When `PostModule` needs to react to something that happened in `UserModule`, it uses `@nestjs/event-emitter` — not a direct import of `UserService`.

---

## 4. Domain Mapping to Modular Concepts

### 4.1 Module Breakdown

| Module          | Responsibilities                           | Exports                       |
| --------------- | ------------------------------------------ | ----------------------------- |
| `UserModule`    | User registration, authentication, profile | `UserService`, `JwtAuthGuard` |
| `PostModule`    | Post creation, publishing, listing         | `PostService`                 |
| `CommentModule` | Adding and listing comments                | `CommentService`              |
| `AuthModule`    | JWT strategy, token generation             | `JwtAuthGuard`, `AuthService` |

### 4.2 Cross-Module Dependencies

```
AppModule
├── UserModule    ← imports AuthModule for guard
├── AuthModule    ← imports UserModule for user lookup in JWT strategy
├── PostModule    ← imports UserModule (for author validation)
└── CommentModule ← imports PostModule (to verify post exists and is published)
```

The `AuthModule` ↔ `UserModule` circular dependency is a common NestJS challenge and must be resolved using `forwardRef()`. The template must demonstrate this correctly and the README must explain why it occurs and how to reason about it.

### 4.3 Cross-Module Events

The `PostModule` emits a `post.published` event when a post is published. The `CommentModule` does not listen to it in this template (no consumer needed for demonstration), but the pattern of emitting is shown. A README note explains that this is how you'd notify other modules without creating direct dependencies.

---

## 5. Complete Folder Structure

```
src/
├── modules/
│   │
│   ├── user/
│   │   ├── README.md
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── user-response.dto.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts           ← TypeORM entity (no separation from domain)
│   │   ├── interfaces/
│   │   │   └── user.interface.ts        ← TypeScript interface for the User shape
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.service.spec.ts
│   │   └── user.module.ts
│   │
│   ├── auth/
│   │   ├── README.md
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── auth-response.dto.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── local-auth.guard.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── local.strategy.ts
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.service.spec.ts
│   │   └── auth.module.ts
│   │
│   ├── post/
│   │   ├── README.md
│   │   ├── dto/
│   │   │   ├── create-post.dto.ts
│   │   │   ├── update-post.dto.ts
│   │   │   └── post-response.dto.ts
│   │   ├── entities/
│   │   │   └── post.entity.ts
│   │   ├── enums/
│   │   │   └── post-status.enum.ts
│   │   ├── post.controller.ts
│   │   ├── post.service.ts
│   │   ├── post.service.spec.ts
│   │   └── post.module.ts
│   │
│   └── comment/
│       ├── README.md
│       ├── dto/
│       │   ├── create-comment.dto.ts
│       │   └── comment-response.dto.ts
│       ├── entities/
│       │   └── comment.entity.ts
│       ├── comment.controller.ts
│       ├── comment.service.ts
│       ├── comment.service.spec.ts
│       └── comment.module.ts
│
├── common/
│   ├── README.md                         ← What belongs in common vs in a module
│   ├── decorators/
│   │   └── api-paginated-response.decorator.ts
│   ├── dto/
│   │   ├── pagination.dto.ts
│   │   └── paginated-response.dto.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   └── response-transform.interceptor.ts
│   └── pipes/
│       └── parse-positive-int.pipe.ts
│
├── config/
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── auth.config.ts
│   └── env.validation.ts
│
├── app.module.ts
└── main.ts

test/
└── post.e2e-spec.ts
```

---

## 6. Module-Level Specifications

### 6.1 UserModule

**`user.entity.ts`** — TypeORM entity class. In Modular Architecture, the ORM entity IS the domain model (no separation). This is deliberately different from Hexagonal and DDD — and the README must acknowledge this trade-off:

> In Modular Architecture, we use TypeORM entities directly as our data model. This is simpler and faster to develop with. The trade-off is that your domain logic is coupled to your persistence framework. For most apps, this trade-off is acceptable — and you can always refactor to Hexagonal later if the domain grows complex enough to warrant it.

**`user.service.ts`** — Must demonstrate:

- `create(dto)` — Hashes password with bcrypt, saves user, returns response DTO
- `findById(id)` — Returns user or throws `NotFoundException` (NestJS built-in — no custom domain errors)
- `findByEmail(email)` — Used by the JWT strategy
- All methods properly typed with `Promise<UserResponseDto>` return types

**`user.module.ts`** — Must demonstrate:

- `TypeOrmModule.forFeature([UserEntity])` import
- `UserService` as a provider
- `UserService` in `exports` (other modules can use it)
- `UserController` registered

### 6.2 AuthModule

The auth module is more involved than in the other templates because it demonstrates the `forwardRef()` circular dependency pattern.

**`auth.module.ts`**:

```typescript
@Module({
  imports: [
    // forwardRef breaks the circular dependency cycle:
    // AuthModule imports UserModule (for UserService in JWT strategy)
    // UserModule imports AuthModule (for JwtAuthGuard)
    forwardRef(() => UserModule),
    JwtModule.registerAsync({ ... }),
    PassportModule,
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [JwtAuthGuard, AuthService],
})
export class AuthModule {}
```

A comment block in this file must explain the circular dependency: what caused it, why `forwardRef()` resolves it, and whether there's a cleaner design alternative (moving the guard to a shared module).

**`auth.controller.ts`** — Must expose:

- `POST /auth/login` — local strategy, returns JWT token
- `POST /auth/refresh` — stub (documents pattern for refresh tokens)
- `GET /auth/me` — returns current user profile

### 6.3 PostModule

**`post.service.ts`** — Must demonstrate:

- `create(authorId, dto)` — Creates draft post
- `publish(id, requesterId)` — Publishes post, enforces ownership (requester must be the author), emits `post.published` event
- `findAll(options)` — Returns paginated list of published posts
- `findById(id)` — Returns single post

The `publish()` method demonstrates business rule enforcement inside a service (not a domain entity). The README must acknowledge this:

> In Modular Architecture, business rules typically live in service methods. This is simpler to read and write than domain entities with private constructors, but the trade-off is that the rules are less discoverable and easier to bypass by calling the repository directly. For simple rules on simple domains, this trade-off is reasonable.

**`post.module.ts`** — Must demonstrate:

- Importing `UserModule` for author validation
- Importing `EventEmitterModule` for cross-module events
- Exporting `PostService` for `CommentModule`

### 6.4 CommentModule

**`comment.service.ts`** — Must demonstrate:

- `create(postId, authorId, dto)` — Calls `PostService.findById()` to verify the post exists and is published before creating a comment
- `findByPostId(postId)` — Returns all comments for a post

The dependency on `PostService` (from `PostModule`) is the key cross-module dependency to demonstrate. It must come through the NestJS module system — not by importing the class file directly.

### 6.5 The `common/` Directory

The `common/` directory is for code shared across modules that is:

- Not specific to any one business feature
- Reusable infrastructure (decorators, pipes, interceptors, filters)
- Not a NestJS module itself

**`logging.interceptor.ts`** — Logs all incoming requests and outgoing responses with timing. Demonstrates an application-wide interceptor pattern.

**`response-transform.interceptor.ts`** — Wraps all successful responses in a consistent envelope:

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

**`pagination.dto.ts` and `paginated-response.dto.ts`** — Standard pagination input and output DTOs. Demonstrates reusable DTOs that all list endpoints use.

The `common/README.md` must explain the rule: "If code is shared across more than two modules AND it's not a business feature, it belongs in `common/`. If you find yourself wanting to put business logic in `common/`, that's a sign it should be its own module."

---

## 7. README Specifications

### `templates/modular/README.md` (Top-Level)

Must cover:

- What Modular Architecture is
- The comparison table (when to use Modular vs Hexagonal vs DDD)
- The three rules that make it architecture (Section 3.3)
- How to add a new feature module (step by step)
- How the module system enforces boundaries

### `src/modules/user/README.md`

Must cover:

- What this module owns
- What it exports and why
- How to add a new field to the User entity (migration-aware guidance)

### `src/modules/auth/README.md`

Must cover:

- The global guard + `@Public()` opt-out pattern (same as Hexagonal)
- The `forwardRef()` circular dependency and why it exists
- How JWT refresh tokens would be added (documented pattern, not implemented)

### `src/modules/post/README.md`

Must cover:

- How cross-module dependencies work via imports/exports
- The `post.published` event emission and how another module would consume it
- The business rule enforcement approach (in the service) and its trade-offs

### `src/common/README.md`

Must cover:

- The rule for what belongs in `common/` vs in a module
- How to register a new interceptor or filter globally
- The response envelope format and why it's useful

---

## 8. Testing Specifications

### 8.1 Service Unit Tests

All service unit tests must mock the TypeORM `Repository` using NestJS's `getRepositoryToken()` utility.

**`user.service.spec.ts`** — must test:

- `create()` with valid DTO hashes password and saves user
- `findById()` with existing ID returns user DTO
- `findById()` with non-existent ID throws `NotFoundException`

**`post.service.spec.ts`** — must test:

- `publish()` by the post's author succeeds and emits `post.published` event
- `publish()` by a different user throws `ForbiddenException`
- `publish()` of an already-published post throws `BadRequestException`

### 8.2 End-to-End Test

**`test/post.e2e-spec.ts`** — same behavioral coverage as DDD e2e test:

- POST /posts — creates draft
- POST /posts/:id/publish — publishes
- POST /posts/:id/comments — adds comment
- POST /posts/:id/comments on draft — returns 400

---

## 9. CLI Extension Requirements

### 9.1 Prompt Flow Changes

No additional questions are needed for Modular Architecture beyond the standard flow. The architecture is simpler and makes fewer structural decisions.

The architecture selection prompt must update its description for Modular:

```
○  Modular Architecture
   NestJS-native feature modules. Fast to build, easy to understand.
   Best for: standard APIs, teams new to NestJS, projects without complex domains.
```

### 9.2 Architecture Selection Screen Enhancement

By Phase 4, all three architectures are available. The selection screen must present all three with descriptions that help the user make an informed choice:

```
◇  Which architecture do you want to use?

   ●  Hexagonal (Ports & Adapters)
      Framework-agnostic core. Maximum testability.
      Best for: complex domains, long-lived products.

   ○  Domain-Driven Design (DDD)
      Aggregates, bounded contexts, domain events.
      Best for: rich domains with complex business rules.

   ○  Modular Architecture
      NestJS-native feature modules.
      Best for: standard APIs, rapid development.
```

---

## 10. Acceptance Criteria

Phase 4 is complete when **all** of the following are true:

- [ ] All items from the Pre-Implementation Checklist (Section 2) are checked.
- [ ] Every file in Section 5's folder structure exists and is fully implemented.
- [ ] The `forwardRef()` circular dependency between `UserModule` and `AuthModule` is correctly implemented and documented.
- [ ] The `post.published` event is emitted from `PostService.publish()`.
- [ ] `CommentService.create()` calls `PostService.findById()` via the NestJS module system (not a direct class import).
- [ ] The response transform interceptor wraps all responses in the standard envelope.
- [ ] All three architectures are selectable in `nest-pilot create` with accurate descriptions.
- [ ] Selecting Modular Architecture generates a project that compiles, lints, and all tests pass.
- [ ] Hexagonal and DDD generation remain fully functional (no regression).
- [ ] All READMEs listed in Section 7 are written.

---

_PRD-04 complete. Next: PRD-05 — Polish & Community Preparation._
