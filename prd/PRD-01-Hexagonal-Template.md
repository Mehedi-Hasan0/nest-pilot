# PRD-01: Hexagonal Architecture Template

| Field              | Value                                                    |
| ------------------ | -------------------------------------------------------- |
| Document ID        | PRD-01                                                   |
| Phase              | 1 — Hexagonal Template                                   |
| Status             | Ready to Build                                           |
| Depends On         | PRD-00 (shared templates, composer engine)               |
| Blocks             | PRD-02 (CLI cannot generate a real project without this) |
| Estimated Duration | 1–2 weeks                                                |

---

## 1. Purpose

This document defines the complete specification for the Hexagonal Architecture template. It covers every file, every folder, every README, every test, and every architectural rule that must be present and correct before this phase is considered done.

This is the most important phase of the entire project. The quality bar set here becomes the standard every subsequent architecture must match. There are no shortcuts permitted. Every file must be fully implemented, not stubbed. Every README must explain both the _what_ and the _why_.

---

## 2. Architecture Overview

### 2.1 What Hexagonal Architecture Is

Hexagonal Architecture (also called Ports and Adapters, coined by Alistair Cockburn) organizes an application around a **domain core** that is completely isolated from the outside world. The core expresses what it _needs_ from the outside world through **ports** (interfaces), and the outside world communicates with the core through **adapters** (implementations of those interfaces).

The result is an application where:

- Business logic has zero framework, database, or HTTP dependencies
- Every layer is independently testable
- Swapping a database, HTTP framework, or external service requires touching only the adapter — the domain and application layers are untouched

### 2.2 The Three Layers

```
┌─────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                        │
│  (NestJS, TypeORM, HTTP Controllers, JWT, Redis, etc.)   │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │               APPLICATION                       │   │
│   │  (Use Cases / Interactors, DTOs, App Ports)     │   │
│   │                                                 │   │
│   │   ┌─────────────────────────────────────────┐   │   │
│   │   │              DOMAIN                     │   │   │
│   │   │  (Entities, Value Objects, Domain Ports)│   │   │
│   │   └─────────────────────────────────────────┘   │   │
│   └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Dependency rule**: Dependencies only point inward. Infrastructure depends on Application and Domain. Application depends on Domain. Domain depends on nothing.

### 2.3 The Example Domain

All example code is built around a **Blog platform** with three entities:

- **User** — can register, log in, and author posts
- **Post** — can be created as a draft, published, and unpublished
- **Comment** — can be added to a published post by any user

---

## 3. Complete Folder Structure

The following is the initial conceptual folder and file structure that the hexagonal template produces. Every file listed here must be implemented.

> [!NOTE]
> **Per-Entity Module Grouping:** While the tree below illustrates a flat `infrastructure/persistence` structure, the generated template implements a **per-entity module grouping** (e.g., `infrastructure/user/persistence`, `infrastructure/user/http`). This is the preferred layout as it scales significantly better to per-feature NestJS Dependency Injection boundaries.

```
src/
├── domain/
│   ├── README.md                                  ← Architecture boundary documentation
│   ├── user/
│   │   ├── README.md
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── value-objects/
│   │   │   ├── email.vo.ts
│   │   │   └── user-id.vo.ts
│   │   ├── errors/
│   │   │   └── user.errors.ts
│   │   └── ports/
│   │       └── user.repository.port.ts
│   ├── post/
│   │   ├── README.md
│   │   ├── entities/
│   │   │   └── post.entity.ts
│   │   ├── value-objects/
│   │   │   ├── post-title.vo.ts
│   │   │   ├── post-content.vo.ts
│   │   │   └── post-id.vo.ts
│   │   ├── errors/
│   │   │   └── post.errors.ts
│   │   └── ports/
│   │       └── post.repository.port.ts
│   └── comment/
│       ├── entities/
│       │   └── comment.entity.ts
│       ├── value-objects/
│       │   └── comment-id.vo.ts
│       ├── errors/
│       │   └── comment.errors.ts
│       └── ports/
│           └── comment.repository.port.ts
│
├── application/
│   ├── README.md
│   ├── user/
│   │   ├── README.md
│   │   ├── use-cases/
│   │   │   ├── register-user/
│   │   │   │   ├── register-user.use-case.ts
│   │   │   │   ├── register-user.command.ts
│   │   │   │   └── register-user.use-case.spec.ts
│   │   │   └── get-user-profile/
│   │   │       ├── get-user-profile.use-case.ts
│   │   │       ├── get-user-profile.query.ts
│   │   │       └── get-user-profile.use-case.spec.ts
│   │   └── dtos/
│   │       ├── user-response.dto.ts
│   │       └── register-user.dto.ts
│   ├── post/
│   │   ├── use-cases/
│   │   │   ├── create-post/
│   │   │   │   ├── create-post.use-case.ts
│   │   │   │   ├── create-post.command.ts
│   │   │   │   └── create-post.use-case.spec.ts
│   │   │   └── publish-post/
│   │   │       ├── publish-post.use-case.ts
│   │   │       ├── publish-post.command.ts
│   │   │       └── publish-post.use-case.spec.ts
│   │   └── dtos/
│   │       └── post-response.dto.ts
│   └── comment/
│       ├── use-cases/
│       │   └── add-comment/
│       │       ├── add-comment.use-case.ts
│       │       ├── add-comment.command.ts
│       │       └── add-comment.use-case.spec.ts
│       └── dtos/
│           └── comment-response.dto.ts
│
├── infrastructure/
│   ├── README.md
│   ├── persistence/
│   │   ├── README.md
│   │   └── typeorm/                          ← Swapped for prisma/ or mikroorm/ by CLI
│   │       ├── README.md
│   │       ├── entities/
│   │       │   ├── user.orm-entity.ts
│   │       │   ├── post.orm-entity.ts
│   │       │   └── comment.orm-entity.ts
│   │       ├── repositories/
│   │       │   ├── user.repository.ts
│   │       │   ├── post.repository.ts
│   │       │   └── comment.repository.ts
│   │       └── mappers/
│   │           ├── user.mapper.ts
│   │           ├── post.mapper.ts
│   │           └── comment.mapper.ts
│   ├── auth/
│   │   ├── jwt.strategy.ts
│   │   ├── jwt-auth.guard.ts
│   │   ├── current-user.decorator.ts
│   │   └── auth.module.ts
│   ├── http/
│   │   ├── README.md
│   │   ├── controllers/
│   │   │   ├── user.controller.ts
│   │   │   ├── post.controller.ts
│   │   │   └── comment.controller.ts
│   │   ├── presenters/
│   │   │   ├── user.presenter.ts
│   │   │   ├── post.presenter.ts
│   │   │   └── comment.presenter.ts
│   │   └── filters/
│   │       └── domain-exception.filter.ts
│   ├── config/
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── auth.config.ts
│   │   └── env.validation.ts
│   └── modules/
│       ├── user.module.ts
│       ├── post.module.ts
│       └── comment.module.ts
│
├── app.module.ts
└── main.ts

test/
└── user.e2e-spec.ts
```

---

## 4. Domain Layer Specifications

### 4.1 Absolute Rules for the Domain Layer

These rules must be enforced both through convention (documented in READMEs) and tooling (ESLint boundaries rule):

1. **No NestJS imports.** Not `@nestjs/common`, not `@nestjs/core`, nothing.
2. **No ORM imports.** Not TypeORM, Prisma, MikroORM, or any database client.
3. **No infrastructure concepts.** No HTTP status codes, no request/response objects.
4. **No direct dependencies on the application or infrastructure layers.**
5. **All business rules live here**, nowhere else.
6. **Domain Errors Basis:** A shared `DomainError` base class exists in `domain/common/domain.error.ts`. All specific domain exceptions must extend this base class to allow ergonomic, unified catching at the infrastructure boundary.

### 4.2 Entity Specifications

**`user.entity.ts`**

```typescript
// Must contain:
// - Private constructor (entities are created via static factory methods)
// - Static create() factory method that validates inputs and creates entity
// - getId(), getEmail(), getName() getters returning value objects / primitives
// - changeEmail() method that validates the new email (demonstrates business method)
// - No @Column, @Entity, or any ORM decorator
// - No @Injectable() or any NestJS decorator
```

The User entity must enforce these business rules in code, not just comments:

- Email must be a valid email format (enforced by the Email value object)
- Name must be between 2 and 100 characters
- A user cannot change their email to the same email they already have (this demonstrates that business rules live in the entity, not in a service)

**`post.entity.ts`**

Must model the Post lifecycle with these states: `DRAFT`, `PUBLISHED`, `UNPUBLISHED`. State transitions must enforce:

- Only a draft post can be published
- Only a published post can be unpublished
- A published post's title cannot be changed (demonstrates state-dependent rules)

Each attempted invalid transition must throw a domain error, not a generic `Error`.

**`comment.entity.ts`**

Must associate a comment with both a post ID and an author (user ID). Must enforce a maximum comment length (500 characters). Demonstrates a simpler entity with fewer state transitions.

### 4.3 Value Object Specifications

All value objects must:

- Be **immutable** (readonly properties, no setters)
- Validate their value at construction time and throw a domain error if invalid
- Implement an `equals(other: ThisType): boolean` method
- Not extend any base class (to keep them pure TypeScript)

**`email.vo.ts`** — Validates email format via regex. Normalizes the value to lowercase at construction time to prevent structural mismatches. The regex used must be documented with a comment explaining its limitations.

**`post-title.vo.ts`** — Must be between 3 and 200 characters. Must trim whitespace at construction. Must preserve the trimmed value.

**`post-content.vo.ts`** — Must be at least 10 characters. No maximum (practical for a blog post body).

**`user-id.vo.ts`, `post-id.vo.ts`, `comment-id.vo.ts`** — UUID-based identity value objects. Must validate UUID format. Must expose a static `generate()` method using the `uuid` package.

### 4.4 Domain Error Specifications

Domain errors must be typed, not generic. The pattern:

```typescript
// user.errors.ts
export class UserNotFoundError extends Error {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`);
    this.name = 'UserNotFoundError';
  }
}

export class EmailAlreadyInUseError extends Error {
  constructor(email: string) {
    super(`Email already in use: ${email}`);
    this.name = 'EmailAlreadyInUseError';
  }
}

export class InvalidEmailError extends Error { ... }
```

This allows the exception filter in the infrastructure layer to catch specific domain errors and map them to appropriate HTTP status codes.

### 4.5 Repository Port Specifications

Ports are interfaces. They define what the domain needs from persistence. They must not reference ORM types.

**`user.repository.port.ts`**

```typescript
export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  exists(email: string): Promise<boolean>;
  delete(id: string): Promise<void>;
}

// INJECTION TOKEN — used for NestJS DI in the infrastructure layer
// Defined here so the application layer can reference it without importing infrastructure
export const USER_REPOSITORY_PORT = Symbol('UserRepositoryPort');
```

The injection token is defined alongside the port interface. This is a critical pattern — the application layer can import this symbol for use in `@Inject()` without importing anything from the infrastructure layer.

---

## 5. Application Layer Specifications

### 5.1 Absolute Rules for the Application Layer

1. **May only import from `../domain`.** Never from `../infrastructure`.
2. **Use cases coordinate domain objects.** They do not contain business logic themselves.
3. **Use cases depend on repository ports, not implementations.**
4. **One use case per file, one file per folder.** Each use case folder contains: the use case class, its command/query input type, and its unit test.

### 5.2 Use Case Pattern

Each use case must follow this structure:

```typescript
// register-user.use-case.ts

// The command (input) is a simple data object — no class-validator decorators here.
// Validation of HTTP input happens at the controller level using DTOs.
// The command represents a validated, trusted intent.

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: RegisterUserCommand): Promise<UserResponseDto> {
    // 1. Check preconditions using the repository port
    const emailExists = await this.userRepository.exists(command.email);
    if (emailExists) {
      throw new EmailAlreadyInUseError(command.email);
    }

    // 2. Create the domain entity (business rules enforced inside the entity)
    const user = User.create({
      email: command.email,
      name: command.name,
      password: command.password,
    });

    // 3. Persist via the port
    await this.userRepository.save(user);

    // 4. Return a DTO (not the domain entity)
    return UserResponseDto.fromEntity(user);
  }
}
```

**Key rules demonstrated in this pattern:**

- The use case is `@Injectable()` (application layer is allowed to use NestJS DI)
- It depends on the port interface, not the TypeORM implementation
- It returns a DTO, not a domain entity (domain entities must not leak outside the application boundary)
- It does not catch errors — errors propagate to the infrastructure layer which decides HTTP status codes

### 5.3 DTO Specifications

Response DTOs must:

- Be plain classes with public readonly properties
- Implement a static `fromEntity(entity: DomainEntity): ThisDto` factory method
- Contain no validation decorators (those belong on input DTOs at the controller level)
- Expose only what the calling layer needs — never the full entity internals

### 5.4 Use Cases to Implement

**User use cases:**

- `RegisterUserUseCase` — creates a new user, throws `EmailAlreadyInUseError` if email exists
- `GetUserProfileUseCase` — retrieves a user by ID, throws `UserNotFoundError` if not found

**Post use cases:**

- `CreatePostUseCase` — creates a draft post for a given author
- `PublishPostUseCase` — transitions a post from draft to published, enforces ownership
- `GetPostUseCase` — retrieves a post by ID with its comment count

**Comment use case:**

- `AddCommentUseCase` — adds a comment to a published post, throws if post is not published

---

## 6. Infrastructure Layer Specifications

### 6.1 Persistence Sublayer (TypeORM Variant)

#### ORM Entity Specifications

ORM entities must be **separate classes** from domain entities. This is non-negotiable. They exist in `infrastructure/persistence/typeorm/entities/`.

The `UserOrmEntity` must:

- Use TypeORM decorators (`@Entity`, `@Column`, `@PrimaryColumn`, etc.)
- Use `uuid` as the primary key type (not auto-increment integer)
- Have no business methods — it is purely a database schema representation
- Have `@CreateDateColumn()` and `@UpdateDateColumn()` for audit fields

**Why separate ORM and domain entities?** Because the shape of your database schema often diverges from your domain model. Domain entities may have value objects that map to multiple columns. They may have fields that should never be persisted. Mapping at a dedicated mapper layer keeps both models clean and independently evolvable. This must be explained in `infrastructure/persistence/typeorm/README.md`.

#### Mapper Specifications

Each mapper must implement two methods:

```typescript
export class UserMapper {
  static toDomain(ormEntity: UserOrmEntity): User { ... }
  static toPersistence(domainEntity: User): UserOrmEntity { ... }
}
```

Mappers handle the translation between the database's representation and the domain's representation. For this example domain, the main differences to demonstrate are: the `Email` value object (which maps to a plain `varchar` column) and the `PostStatus` enum (which maps to a database enum).

#### Repository Adapter Specifications

Each repository adapter must implement the corresponding domain port interface:

```typescript
@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepository: Repository<UserOrmEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    if (!ormEntity) return null;
    return UserMapper.toDomain(ormEntity);
  }
  // ... other methods
}
```

Note what this demonstrates: the adapter's public interface is typed against the domain model (`User`), not the ORM entity. The mapper is only used internally.

### 6.2 HTTP Sublayer

#### Controller Specifications

Controllers must:

- Be thin — no business logic, only input validation and use case invocation
- Use class-validator DTOs for request body validation
- Use `@Inject()` to receive use case instances (not service classes)
- Return presenter-shaped responses (never domain entities or raw ORM data)

**Example pattern for `user.controller.ts`:**

```typescript
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly getUserProfile: GetUserProfileUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Public() // Custom decorator that marks route as public (no JWT required)
  async register(@Body() dto: RegisterUserHttpDto): Promise<UserHttpResponse> {
    const result = await this.registerUser.execute({
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });
    return UserPresenter.toResponse(result);
  }
}
```

Note: The HTTP DTO (`RegisterUserHttpDto`) has class-validator decorators. The command (`RegisterUserCommand`) does not. This separation matters: HTTP validation is an infrastructure concern. Business validation is a domain concern.

#### Presenter Specifications

Presenters map application-layer DTOs to HTTP response shapes. They may reformat data (e.g., format dates as ISO strings, exclude internal fields, add HATEOAS links in the future).

```typescript
export class UserPresenter {
  static toResponse(dto: UserResponseDto): UserHttpResponse {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.name,
      createdAt: dto.createdAt.toISOString(),
    };
  }
}
```

#### Domain Exception Filter

A global exception filter must catch domain errors and map them to HTTP status codes:

```typescript
import { DomainError } from '../../domain/common/domain.error';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    // Base discrimination on exception.name:
    // UserNotFoundError, PostNotFoundError → 404
    // *AlreadyInUseError* → 409
    // InvalidEmailError, Invalid*Error → 400
    // All other errors → 500
  }
}
```

This is where the typed domain errors and unified base class pay off. The filter can elegantly catch the `DomainError` superclass and assign correct HTTP status codes dynamically.

### 6.3 Auth Sublayer

Must implement JWT-based authentication. Required files:

**`jwt.strategy.ts`** — Validates the JWT token, extracts the user ID from the payload, returns a user object attached to `req.user`.

**`jwt-auth.guard.ts`** — The default guard applied globally in `app.module.ts`. Protects all routes by default.

**`current-user.decorator.ts`** — A custom parameter decorator (`@CurrentUser()`) that extracts the authenticated user from the request.

**`@Public()` decorator** — A custom metadata decorator that marks specific routes as public, overriding the global JWT guard.

This pattern (global guard + `@Public()` opt-out) is safer than opt-in authentication and must be documented in the auth module's README explaining why.

### 6.4 Config Sublayer

**`env.validation.ts`** — Uses Zod to define and validate all required environment variables at application startup. The app must refuse to start if any required variable is missing or invalid. The validation schema must be documented with inline comments explaining each variable.

**`app.config.ts`**, **`database.config.ts`**, **`auth.config.ts`** — Typed config classes using `@nestjs/config`'s `ConfigService`. Controllers and services must never call `process.env` directly — they must use the config service.

### 6.5 Module Wiring Specifications

**`user.module.ts`** — Must wire together: the TypeORM entity, the repository adapter (as the provider for `USER_REPOSITORY_PORT`), and all user use cases. Must export the use cases for use by other modules if needed.

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [
    {
      provide: USER_REPOSITORY_PORT,
      useClass: UserRepository,
    },
    RegisterUserUseCase,
    GetUserProfileUseCase,
  ],
  controllers: [UserController],
})
export class UserModule {}
```

This is the most important wiring to get right. The `provide: USER_REPOSITORY_PORT` / `useClass: UserRepository` pattern is where Hexagonal Architecture's dependency injection is made concrete. This must be explained in a comment in this file.

### 6.6 Main Bootstrap Specifications

`main.ts` must implement a production-ready bootstrap:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'], // Pino handles logging; disable NestJS default logger
  });

  // Security
  app.use(helmet());
  app.enableCors({ origin: configService.get('APP_CORS_ORIGIN') });

  // Global pipes, filters, interceptors
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip non-whitelisted properties
      forbidNonWhitelisted: true, // Throw on non-whitelisted properties
      transform: true, // Auto-transform payloads to DTO class instances
    }),
  );
  app.useGlobalFilters(new DomainExceptionFilter());

  // Swagger (development only)
  if (process.env.NODE_ENV !== 'production') {
    // Setup Swagger UI
  }

  // Graceful shutdown
  app.enableShutdownHooks();

  await app.listen(configService.get('PORT'));
}
```

---

## 7. README Specifications

Each README must answer three questions: what belongs here, what is forbidden, and why the boundary exists. Below are the required READMEs and their minimum required content.

### `src/domain/README.md`

Must cover:

- Definition: the domain layer is the core of the application, isolated from all external concerns
- What belongs: entities, value objects, domain errors, repository port interfaces
- What is forbidden: any NestJS import, any ORM import, any import from application or infrastructure
- Why: framework-independence, testability, portability
- Include a note on how to verify the rule: "If you can run all tests in this folder with no database and no NestJS running, the boundary is healthy"

### `src/application/README.md`

Must cover:

- Definition: orchestration layer — coordinates domain objects to fulfill use cases
- What belongs: use case classes, command/query input types, response DTOs
- What is forbidden: direct import from infrastructure, direct database calls
- The use case structure: one folder per use case containing the use case class, input type, and test
- Why use cases return DTOs and not domain entities

### `src/infrastructure/README.md`

Must cover:

- Definition: everything that touches the outside world lives here
- The three sublayers: persistence, HTTP, config
- What belongs: ORM entities, repository adapters, controllers, auth strategies, config
- The mapper pattern: why we don't pass ORM entities to the application layer
- Why this layer is the only one that can depend on NestJS modules

### `src/infrastructure/persistence/typeorm/README.md`

Must cover:

- Why ORM entities are separate from domain entities
- The three-file pattern: ORM entity + repository adapter + mapper
- How the `provide: PORT / useClass: ADAPTER` pattern wires the layers together

### `src/infrastructure/http/README.md`

Must cover:

- The flow: HTTP request → Controller DTO validation → Use case command → Presenter → HTTP response
- Why controllers should be thin
- The difference between HTTP DTOs (with class-validator) and application commands (without)
- The global guard + `@Public()` opt-out pattern

---

## 8. Testing Specifications

### 8.1 Domain Layer Tests

Domain tests must have **zero mocks, zero NestJS test utilities, zero database**. They test pure TypeScript classes.

**`user.entity.spec.ts`** — must test:

- `User.create()` with valid inputs succeeds
- `User.create()` with invalid email throws `InvalidEmailError`
- `User.create()` with name too short throws a domain error
- `user.changeEmail()` with a new valid email updates the email
- `user.changeEmail()` with the same email throws a domain error

**`email.vo.spec.ts`** — must test:

- Valid emails create a value object successfully
- Invalid email format throws an error
- `equals()` returns true for same email, false for different
- Value is stored as-is (not normalized unless the spec requires it)

### 8.2 Application Layer Tests

Application layer tests must:

- Mock the repository port (the interface), not the TypeORM implementation
- Use Jest's manual mock factory: `jest.fn()` on each port method
- Using NestJS's `Test.createTestingModule` is acceptable to inject the use case, provided the test does not spin up a real database or HTTP server

**`register-user.use-case.spec.ts`** — must test:

- Happy path: `execute()` with valid inputs calls `userRepository.exists()`, then `userRepository.save()`, returns a DTO
- Email already exists: `userRepository.exists()` returns `true`, throws `EmailAlreadyInUseError`
- Repository failure: `userRepository.save()` throws, error propagates out

The key educational value in these tests: the `userRepository` mock is typed as `UserRepositoryPort` (the interface) — not `UserRepository` (the TypeORM class). This must be commented in the test file to make the pattern explicit.

### 8.3 Infrastructure Layer Tests

Infrastructure tests use NestJS's `TestingModule` to spin up the relevant module in isolation.

**`user.controller.spec.ts`** — must test the HTTP layer with the use cases mocked:

- POST /users/register with valid body returns 201
- POST /users/register with missing fields returns 400 (validation pipe)
- POST /users/register when `RegisterUserUseCase` throws `EmailAlreadyInUseError` returns 409

### 8.4 End-to-End Test

**`test/user.e2e-spec.ts`** — must test the complete stack against a real database:

- Spin up the full NestJS application in test mode
- Use a test database (via docker-compose or environment variable override)
- POST /users/register creates a user and returns 201
- POST /users/register with duplicate email returns 409
- GET /users/:id without auth token returns 401
- GET /users/:id with valid auth token returns the user profile

---

## 9. Security Requirements

In addition to the shared security baseline (Helmet, Throttler, ValidationPipe), the hexagonal template must demonstrate:

- **Password hashing**: Passwords must be hashed using `bcrypt` with a salt rounds constant of 12. The hashing must happen inside the domain (in the `Password` value object or `User` entity). The domain should not know _how_ bcrypt works — it should call an interface — but this example keeps it simple: bcrypt is called directly as it is a pure computation, not an infrastructure concern.
- **JWT payload minimalism**: The JWT payload must contain only `{ sub: userId }`. No email, no roles, nothing else. Additional user data is fetched from the database on each request by the JWT strategy.
- **Token expiry**: Must be configurable via environment variable, defaulting to `7d`.
- **Route protection by default**: All routes are protected by the global `JwtAuthGuard` unless explicitly decorated with `@Public()`.

---

## 10. Acceptance Criteria

Phase 1 is complete when **all** of the following are true:

- [ ] Every file listed in Section 3's folder structure exists and is fully implemented (no `// TODO` comments).
- [ ] `npm run build` compiles the template as a standalone NestJS project with zero TypeScript errors.
- [ ] `npm run test` runs all unit and integration tests with 100% pass rate.
- [ ] `npm run test:e2e` runs e2e tests against a Dockerized database with 100% pass rate.
- [ ] `npm run lint` produces zero errors.
- [ ] Every README listed in Section 7 is written and covers all required points.
- [ ] The domain layer has zero NestJS or ORM imports (verified by running the ESLint boundaries rule).
- [ ] The application layer has zero infrastructure imports (same verification).
- [ ] All domain errors are typed (no raw `throw new Error()`).
- [ ] The `USER_REPOSITORY_PORT`, `POST_REPOSITORY_PORT`, and `COMMENT_REPOSITORY_PORT` injection tokens are defined in the domain layer and used correctly in the module wiring.
- [ ] The `main.ts` bootstrap includes all security middleware listed in Section 6.6.
- [ ] A knowledgeable reviewer can read the codebase and understand the hexagonal architecture boundaries without consulting external resources.

---

## 11. Open Questions

| #    | Question                                                                                                                                                                                                     | Impact                                | Status                                                                                                           |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| OQ-1 | Should password hashing live in the domain layer (simple bcrypt call in entity) or behind a port interface (`HashingPort`)? The port approach is more "pure" but adds significant complexity for an example. | Domain purity vs template readability | Recommend: **bcrypt directly in domain** with a comment explaining the trade-off                                 |
| OQ-2 | Should Post and Comment be in the same module or separate modules?                                                                                                                                           | Module wiring complexity              | Recommend: **separate modules** to show inter-module dependency patterns                                         |
| OQ-3 | Should we include Swagger decorators (`@ApiProperty`) on the HTTP DTOs?                                                                                                                                      | Template completeness vs noise        | Recommend: **yes, include Swagger** — it's expected in production NestJS                                         |
| OQ-4 | Should the Prisma variant be built in Phase 1 or only the TypeORM variant?                                                                                                                                   | Phase scope                           | Recommend: **TypeORM only in Phase 1** — Prisma variant added when CLI composer handles ORM selection in Phase 2 |

---

_PRD-01 complete. Next: PRD-02 — CLI MVP._
