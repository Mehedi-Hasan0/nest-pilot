# PRD-03: Domain-Driven Design Template & CLI Extension

| Field              | Value                                                           |
| ------------------ | --------------------------------------------------------------- |
| Document ID        | PRD-03                                                          |
| Phase              | 3 — DDD Template                                                |
| Status             | Ready after PRD-02 is complete                                  |
| Depends On         | PRD-02 (working CLI with Hexagonal support)                     |
| Blocks             | PRD-04 (Modular architecture builds on same CLI infrastructure) |
| Estimated Duration | 1.5–2 weeks (template) + 2 days (CLI extension)                 |

---

## 1. Purpose

This document defines all requirements for the Domain-Driven Design (DDD) architecture template and its integration into the CLI. DDD is the most conceptually rich architecture in this project — it introduces concepts not present in Hexagonal Architecture (aggregates, bounded contexts, domain events, CQRS) and requires the most careful implementation to avoid producing something that _looks_ like DDD but misses its essence.

Before writing any code, run through the **Architecture Transition Checklist** from the Master Plan. This is not optional.

---

## 2. Pre-Implementation Checklist (Architecture Transition)

The following must be completed before writing DDD code:

- [ ] **Phase 1 validation** — All Hexagonal acceptance criteria from PRD-01 are met.
- [ ] **Phase 2 validation** — All CLI MVP acceptance criteria from PRD-02 are met.
- [ ] **Learnings documented** — A `docs/decisions/ADR-001-hexagonal-learnings.md` entry is written.
- [ ] **Shared components extracted** — Any config, auth, or utility patterns from Hexagonal that belong in `templates/shared/` have been moved.
- [ ] **DDD README written first** — `templates/ddd/README.md` is written before any implementation code.
- [ ] **Domain mapping written** — The Blog domain's mapping to DDD concepts is written in prose (see Section 4).

---

## 3. Architecture Overview

### 3.1 What DDD Is (And What It Is Not)

Domain-Driven Design is a software design philosophy, not a folder structure. The folder structure is a consequence of the philosophy — tactical patterns (aggregates, value objects, domain events, repositories) implemented within strategic boundaries (bounded contexts).

DDD is appropriate when:

- The domain is complex enough that the business experts' language and the code's language should be the same (Ubiquitous Language)
- The domain has natural conceptual boundaries that benefit from being modeled separately
- The team size and project lifetime justify the additional overhead

DDD is _not_ a good choice for simple CRUD applications. The template must communicate this in its README.

### 3.2 Key Tactical Patterns the Template Must Demonstrate

| Pattern                   | Where It Lives                                        | Example in Blog Domain                               |
| ------------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| **Aggregate**             | `domain/<context>/aggregates/`                        | `Post` (root) + `Comment` (member)                   |
| **Aggregate Root**        | The root entity of an aggregate                       | `Post` — all access to `Comment` goes through `Post` |
| **Value Object**          | `domain/<context>/value-objects/`                     | `PostTitle`, `Email`, `PostStatus`                   |
| **Domain Event**          | `domain/<context>/events/`                            | `PostPublishedEvent`, `CommentAddedEvent`            |
| **Repository**            | Interface in domain, implementation in infrastructure | `PostRepository` (saves/loads entire aggregate)      |
| **Application Service**   | `application/<context>/services/`                     | `PostApplicationService`                             |
| **CQRS Commands/Queries** | `application/<context>/commands/` and `queries/`      | `CreatePostCommand`, `GetPostQuery`                  |
| **Bounded Context**       | Top-level module boundary                             | `blog` context, `identity` context                   |

### 3.3 Strategic Patterns to Demonstrate (Simplified)

For this template, we demonstrate two bounded contexts without a full context map. A comment in the relevant files explains the concept:

- **`blog` context** — Posts and Comments. Core domain.
- **`identity` context** — Users and authentication. Supporting domain.

The contexts communicate via application-level calls in this template (not via async messaging) to keep complexity manageable. A README note explains that in a production DDD system, contexts often communicate via domain events over a message bus.

### 3.4 How DDD Differs From Hexagonal in This Template

| Aspect                 | Hexagonal                                      | DDD                                                                    |
| ---------------------- | ---------------------------------------------- | ---------------------------------------------------------------------- |
| Organization           | By layer (domain, application, infrastructure) | By bounded context, then by layer within                               |
| Persistence unit       | Individual entity                              | Entire aggregate                                                       |
| Cross-entity logic     | Use case coordinates entities via ports        | Aggregate root enforces its own invariants internally                  |
| Events                 | Not present in the Hexagonal template          | Domain events raised by aggregates, dispatched by application services |
| CQRS                   | Not present                                    | Commands and queries separated at the application layer                |
| Repository granularity | One repository per entity                      | One repository per aggregate root                                      |

---

## 4. Domain Mapping (Must Be Written Before Code)

This section documents how the Blog domain maps to DDD concepts. Writing this prose first prevents architectural confusion during implementation.

### 4.1 Bounded Contexts

**Blog Context** (Core Domain)

- Responsible for: creating and managing blog posts, adding comments to posts
- Owns: `Post` aggregate (root + `Comment` members), post-related value objects
- Ubiquitous Language terms: _draft_, _publish_, _unpublish_, _comment_, _author_

**Identity Context** (Supporting Domain)

- Responsible for: user registration, authentication, profile management
- Owns: `User` aggregate (root only — users have no child entities)
- Ubiquitous Language terms: _register_, _authenticate_, _profile_

### 4.2 The Post Aggregate

`Post` is an aggregate root because:

- It owns `Comment` entities. Comments cannot exist without a post.
- It enforces invariants that span its members: "A comment can only be added to a published post" is a rule that the `Post` aggregate root enforces, not a comment or a service.
- It is the natural transaction boundary: when you save a post, you save all its comments together.

`Comment` is a member of the Post aggregate because:

- It has no meaningful existence outside of a Post.
- It is never loaded or modified independently of its owning Post (in this domain).
- It cannot enforce its own invariants — it needs context from its parent Post.

### 4.3 Domain Events

Domain events are facts — things that happened in the domain. They are raised by aggregate roots and dispatched by application services.

| Event                | Raised By           | Consumed By                                                               |
| -------------------- | ------------------- | ------------------------------------------------------------------------- |
| `PostCreatedEvent`   | `Post.create()`     | Could be used for analytics (not implemented in template, but dispatched) |
| `PostPublishedEvent` | `Post.publish()`    | Demonstrates event pattern — no consumer in this template                 |
| `CommentAddedEvent`  | `Post.addComment()` | Demonstrates cross-context potential                                      |

The template demonstrates raising and dispatching events even without a consumer, because the _pattern_ is the lesson. A README explains that in production, `@nestjs/event-emitter` or a message broker would handle consumption.

---

## 5. Complete Folder Structure

```
src/
├── modules/
│   │
│   ├── blog/                              ← Bounded Context: Blog
│   │   ├── README.md                      ← Context description + ubiquitous language glossary
│   │   ├── domain/
│   │   │   ├── README.md
│   │   │   ├── aggregates/
│   │   │   │   └── post/
│   │   │   │       ├── README.md          ← Explains aggregate root + member pattern
│   │   │   │       ├── post.aggregate.ts  ← The aggregate root
│   │   │   │       └── comment.entity.ts  ← Aggregate member
│   │   │   ├── value-objects/
│   │   │   │   ├── post-id.vo.ts
│   │   │   │   ├── post-title.vo.ts
│   │   │   │   ├── post-content.vo.ts
│   │   │   │   └── post-status.vo.ts
│   │   │   ├── events/
│   │   │   │   ├── README.md              ← What domain events are and why they matter
│   │   │   │   ├── post-created.event.ts
│   │   │   │   ├── post-published.event.ts
│   │   │   │   └── comment-added.event.ts
│   │   │   ├── errors/
│   │   │   │   └── post.errors.ts
│   │   │   └── repositories/
│   │   │       └── post.repository.interface.ts   ← Repository interface for the aggregate
│   │   │
│   │   ├── application/
│   │   │   ├── README.md
│   │   │   ├── commands/
│   │   │   │   ├── create-post.command.ts
│   │   │   │   ├── create-post.handler.ts
│   │   │   │   ├── create-post.handler.spec.ts
│   │   │   │   ├── publish-post.command.ts
│   │   │   │   ├── publish-post.handler.ts
│   │   │   │   └── publish-post.handler.spec.ts
│   │   │   ├── queries/
│   │   │   │   ├── get-post.query.ts
│   │   │   │   ├── get-post.handler.ts
│   │   │   │   └── get-post.handler.spec.ts
│   │   │   └── dtos/
│   │   │       └── post-response.dto.ts
│   │   │
│   │   └── infrastructure/
│   │       ├── persistence/
│   │       │   └── typeorm/
│   │       │       ├── post.orm-entity.ts
│   │       │       ├── comment.orm-entity.ts
│   │       │       ├── post.repository.ts
│   │       │       └── post.mapper.ts    ← Maps entire aggregate (root + members)
│   │       ├── http/
│   │       │   ├── post.controller.ts
│   │       │   └── post.presenter.ts
│   │       └── blog.module.ts
│   │
│   └── identity/                          ← Bounded Context: Identity
│       ├── README.md
│       ├── domain/
│       │   ├── aggregates/
│       │   │   └── user/
│       │   │       └── user.aggregate.ts
│       │   ├── value-objects/
│       │   │   ├── user-id.vo.ts
│       │   │   └── email.vo.ts
│       │   ├── events/
│       │   │   └── user-registered.event.ts
│       │   ├── errors/
│       │   │   └── user.errors.ts
│       │   └── repositories/
│       │       └── user.repository.interface.ts
│       ├── application/
│       │   ├── commands/
│       │   │   ├── register-user.command.ts
│       │   │   ├── register-user.handler.ts
│       │   │   └── register-user.handler.spec.ts
│       │   └── dtos/
│       │       └── user-response.dto.ts
│       └── infrastructure/
│           ├── persistence/
│           │   └── typeorm/
│           │       ├── user.orm-entity.ts
│           │       ├── user.repository.ts
│           │       └── user.mapper.ts
│           ├── auth/
│           │   ├── jwt.strategy.ts
│           │   ├── jwt-auth.guard.ts
│           │   └── current-user.decorator.ts
│           ├── http/
│           │   ├── user.controller.ts
│           │   └── user.presenter.ts
│           └── identity.module.ts
│
├── shared/
│   ├── README.md                          ← What "shared kernel" means in DDD
│   ├── domain/
│   │   └── base-aggregate.ts             ← Base class with domain event collection
│   └── infrastructure/
│       └── event-dispatcher.ts           ← Dispatches collected domain events after save
│
├── app.module.ts
└── main.ts

test/
└── post.e2e-spec.ts
```

---

## 6. Domain Layer Specifications

### 6.1 Base Aggregate Root

The `shared/domain/base-aggregate.ts` is the only class shared across bounded contexts:

```typescript
export abstract class AggregateRoot<TId> {
  private _domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  public pullDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }

  abstract get id(): TId;
}
```

Every aggregate root extends this class. This is the mechanism by which aggregates communicate what happened without coupling directly to the event bus.

### 6.2 Post Aggregate Specifications

`post.aggregate.ts` is the most important file in the template. It must demonstrate:

**Private constructor + static factory method:**

```typescript
export class Post extends AggregateRoot<PostId> {
  private constructor(
    private readonly _id: PostId,
    private _title: PostTitle,
    private _content: PostContent,
    private _status: PostStatus,
    private readonly _authorId: UserId,
    private _comments: Comment[],
    private readonly _createdAt: Date,
  ) {
    super();
  }

  static create(props: CreatePostProps): Post {
    const post = new Post(
      PostId.generate(),
      new PostTitle(props.title),
      new PostContent(props.content),
      PostStatus.DRAFT,
      new UserId(props.authorId),
      [],
      new Date(),
    );
    post.addDomainEvent(
      new PostCreatedEvent(post.id.value, post._authorId.value),
    );
    return post;
  }
}
```

**Business methods that enforce invariants:**

```typescript
publish(): void {
  if (!this._status.isDraft()) {
    throw new PostCannotBePublishedError(this._id.value, this._status.value);
  }
  this._status = PostStatus.PUBLISHED;
  this.addDomainEvent(new PostPublishedEvent(this._id.value, new Date()));
}

addComment(authorId: string, content: string): Comment {
  if (!this._status.isPublished()) {
    throw new CommentNotAllowedError('Comments can only be added to published posts');
  }
  const comment = Comment.create({ postId: this._id.value, authorId, content });
  this._comments.push(comment);
  this.addDomainEvent(new CommentAddedEvent(this._id.value, comment.id.value));
  return comment;
}
```

**The key lesson demonstrated by `addComment()` on the aggregate root:**
The method is on `Post`, not on a service. This is the aggregate root pattern — the root controls all modifications to its members and enforces cross-member invariants. A README comment and a `README.md` entry must explain this explicitly.

### 6.3 Domain Event Specifications

Domain events must be immutable data objects with a timestamp and a meaningful name:

```typescript
// post-published.event.ts
export class PostPublishedEvent implements DomainEvent {
  public readonly occurredOn: Date;

  constructor(
    public readonly postId: string,
    public readonly publishedAt: Date,
  ) {
    this.occurredOn = new Date();
  }
}

// base
export interface DomainEvent {
  occurredOn: Date;
}
```

### 6.4 Repository Interface (Aggregate-Level)

The key difference from Hexagonal: DDD repositories operate at the aggregate level. You load the entire Post (with its Comments). You save the entire Post (with its Comments).

```typescript
export interface PostRepositoryInterface {
  findById(id: PostId): Promise<Post | null>;
  findAll(options?: FindAllPostsOptions): Promise<Post[]>;
  save(post: Post): Promise<void>; // Handles both insert and update
  delete(id: PostId): Promise<void>;
}
```

There is no `CommentRepository`. Comments are saved through the `PostRepository`.

---

## 7. Application Layer Specifications

### 7.1 CQRS Pattern

The template uses NestJS's `@nestjs/cqrs` module for command/query separation. This is a deliberate choice: CQRS is a natural fit for DDD because the write side (commands) operates on aggregates, and the read side (queries) can use optimized queries that bypass the domain model entirely.

**Command Handler pattern:**

```typescript
// create-post.handler.ts
@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepositoryInterface,
    private readonly eventDispatcher: EventDispatcher,
  ) {}

  async execute(command: CreatePostCommand): Promise<string> {
    const post = Post.create({
      title: command.title,
      content: command.content,
      authorId: command.authorId,
    });

    await this.postRepository.save(post);

    // Dispatch domain events AFTER successful persistence
    await this.eventDispatcher.dispatch(post.pullDomainEvents());

    return post.id.value;
  }
}
```

**Why events are dispatched after save (not inside the aggregate):**
The aggregate collects events during its operations. The application layer dispatches them only after the repository save succeeds. If the save fails, events are never dispatched. This transactional consistency rule must be documented in `application/README.md`.

**Query Handler pattern (read-side bypasses domain model):**

```typescript
// get-post.handler.ts
@QueryHandler(GetPostQuery)
export class GetPostQueryHandler implements IQueryHandler<GetPostQuery> {
  constructor(
    // Queries can use the ORM directly for efficiency — no domain model overhead
    @InjectRepository(PostOrmEntity)
    private readonly postOrmRepository: Repository<PostOrmEntity>,
  ) {}

  async execute(query: GetPostQuery): Promise<PostResponseDto> {
    const post = await this.postOrmRepository.findOne({
      where: { id: query.postId },
      relations: ["comments"],
    });
    if (!post) throw new PostNotFoundError(query.postId);
    return PostResponseDto.fromOrmEntity(post);
  }
}
```

This demonstrates a crucial DDD/CQRS pattern: the read side doesn't need to go through the domain model. It can query the database directly for performance. The README must explain this as a feature, not a shortcut.

### 7.2 Commands and Queries to Implement

**Blog context — Commands:**

- `CreatePostCommand` / `CreatePostCommandHandler`
- `PublishPostCommand` / `PublishPostCommandHandler`
- `AddCommentCommand` / `AddCommentCommandHandler`

**Blog context — Queries:**

- `GetPostQuery` / `GetPostQueryHandler`
- `GetPublishedPostsQuery` / `GetPublishedPostsQueryHandler`

**Identity context — Commands:**

- `RegisterUserCommand` / `RegisterUserCommandHandler`

---

## 8. Infrastructure Layer Specifications

### 8.1 Aggregate Mapper

The most complex mapper in this template: mapping a `Post` with its `Comment[]` members to/from ORM entities.

```typescript
export class PostMapper {
  static toDomain(ormPost: PostOrmEntity): Post {
    // Must use a special reconstitution factory method on Post
    // (different from Post.create() — this doesn't raise domain events)
    return Post.reconstitute({
      id: new PostId(ormPost.id),
      title: new PostTitle(ormPost.title),
      content: new PostContent(ormPost.content),
      status: PostStatus.fromString(ormPost.status),
      authorId: new UserId(ormPost.authorId),
      comments: ormPost.comments.map(CommentMapper.toDomain),
      createdAt: ormPost.createdAt,
    });
  }

  static toPersistence(post: Post): {
    post: PostOrmEntity;
    comments: CommentOrmEntity[];
  } {
    // Returns both ORM entities — the repository saves them
  }
}
```

The `Post.reconstitute()` static method is important — it creates a Post from existing data (database) without raising `PostCreatedEvent`. The template must have both `Post.create()` (raises events) and `Post.reconstitute()` (does not raise events). This distinction must be documented.

### 8.2 Event Dispatcher

```typescript
// shared/infrastructure/event-dispatcher.ts
@Injectable()
export class EventDispatcher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async dispatch(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.eventEmitter.emitAsync(event.constructor.name, event);
    }
  }
}
```

Uses `@nestjs/event-emitter` (EventEmitter2) under the hood. The README explains that this can be replaced with a message broker adapter (RabbitMQ, Kafka) without touching any domain code.

### 8.3 Module Structure

Each bounded context has its own NestJS module registered with `CqrsModule`:

```typescript
// blog.module.ts
@Module({
  imports: [
    CqrsModule,
    EventEmitterModule,
    TypeOrmModule.forFeature([PostOrmEntity, CommentOrmEntity]),
  ],
  providers: [
    // Repository
    { provide: POST_REPOSITORY, useClass: PostRepository },
    // Event infrastructure
    EventDispatcher,
    // Command handlers
    CreatePostCommandHandler,
    PublishPostCommandHandler,
    AddCommentCommandHandler,
    // Query handlers
    GetPostQueryHandler,
    GetPublishedPostsQueryHandler,
  ],
  controllers: [PostController],
})
export class BlogModule {}
```

---

## 9. README Specifications

### `templates/ddd/README.md` (Top-Level)

Must cover:

- What DDD is and the problems it solves
- When to use DDD vs Hexagonal vs Modular (a comparison table)
- The two bounded contexts in this template and why they exist
- The ubiquitous language glossary for the Blog context
- How to navigate the codebase

### `src/modules/blog/README.md`

Must cover:

- The Blog bounded context's responsibilities
- The ubiquitous language terms specific to this context
- The aggregate boundary (Post owns Comment)
- How to add a new use case (step by step)

### `src/modules/blog/domain/aggregates/post/README.md`

Must cover:

- What an aggregate root is and the rule that justifies it
- Why Comment is accessed through Post and not directly
- The `create()` vs `reconstitute()` distinction
- Why business methods raise domain events

### `src/modules/blog/domain/events/README.md`

Must cover:

- What domain events represent (facts, not commands)
- The collect-then-dispatch pattern and why events are dispatched after save
- How to add a new event handler
- The relationship between domain events and eventual consistency

### `src/modules/blog/application/README.md`

Must cover:

- The CQRS split: commands modify state, queries read state
- Why queries can bypass the domain model
- How command handlers use the aggregate and the repository
- The transactional boundary: event dispatch happens after successful save

---

## 10. Testing Specifications

### 10.1 Domain Tests

**`post.aggregate.spec.ts`** — must test:

- `Post.create()` creates a post in DRAFT status and raises `PostCreatedEvent`
- `post.publish()` from DRAFT status succeeds, raises `PostPublishedEvent`, post is now PUBLISHED
- `post.publish()` from PUBLISHED status throws `PostCannotBePublishedError`
- `post.addComment()` on a PUBLISHED post creates a comment and raises `CommentAddedEvent`
- `post.addComment()` on a DRAFT post throws `CommentNotAllowedError`
- `post.pullDomainEvents()` returns all raised events and clears the internal list

### 10.2 Application Tests

**`create-post.handler.spec.ts`** — must test:

- Happy path: handler calls `Post.create()`, calls `postRepository.save()`, dispatches events
- Verifies that `pullDomainEvents()` is called before dispatch (not the aggregate's internal list)
- Repository failure: save throws, event dispatch is never called

The test must explicitly verify that events are dispatched only after a successful save — this is the key behavioral contract.

### 10.3 End-to-End Test

**`test/post.e2e-spec.ts`** — must test:

- POST /posts — creates a draft post
- POST /posts/:id/publish — publishes a draft post
- POST /posts/:id/comments — adds a comment to a published post
- POST /posts/:id/comments on a draft post — returns 400
- GET /posts/:id — returns the post with its comments

---

## 11. CLI Extension Requirements

### 11.1 Prompt Flow Changes

When the user selects DDD, two additional questions appear after the ORM selection:

```
◇  Include CQRS (Command/Query Responsibility Segregation)?
   ●  Yes — use @nestjs/cqrs for command and query handlers (recommended for DDD)
   ○  No  — use simple application services instead
│  Yes

◇  How should domain events be dispatched?
   ●  In-process (EventEmitter2)  — simple, no extra infrastructure
   ○  Message broker (stub)       — generates adapter interface for future Kafka/RabbitMQ wiring
│  In-process
```

### 11.2 Template Layer Resolution

The DDD template follows the same overlay pattern as Hexagonal:

```
Layer 1: templates/shared/
Layer 2: templates/ddd/base/
Layer 3: templates/ddd/orm/<selected>/
Layer 4: templates/ddd/auth/<selected>/
Layer 5: templates/ddd/optional/<selected>/
```

### 11.3 Additional Package Dependencies

When DDD is selected, add to `package.json`:

- `@nestjs/cqrs` (if CQRS is selected)
- `@nestjs/event-emitter` and `eventemitter2` (always for DDD)

---

## 12. Acceptance Criteria

Phase 3 is complete when **all** of the following are true:

- [ ] All items from the Pre-Implementation Checklist (Section 2) are checked.
- [ ] Every file listed in Section 5's folder structure exists and is fully implemented.
- [ ] `Post.create()` raises `PostCreatedEvent` and the handler dispatches it after save.
- [ ] `post.addComment()` on a draft post throws an error — verified by unit test.
- [ ] `Post.reconstitute()` does not raise domain events — verified by unit test.
- [ ] The read-side query handler uses the ORM directly without loading the domain aggregate.
- [ ] `npm run build` compiles the DDD template as a standalone project with zero errors.
- [ ] All unit, integration, and e2e tests pass.
- [ ] All READMEs listed in Section 9 are written.
- [ ] `nest-pilot create my-app` with DDD selected generates a working project.
- [ ] Hexagonal architecture generation remains fully functional (no regression).
- [ ] The architecture selection prompt's description for DDD is accurate and helpful.

---

_PRD-03 complete. Next: PRD-04 — Modular Architecture & CLI Extension._
