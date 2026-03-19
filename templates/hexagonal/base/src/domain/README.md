# templates/hexagonal/src/domain/

The **Domain Layer** is the absolute core of the application. It contains the business rules, entities, and strictly defined interfaces (Ports) that dictate what the domain needs from the outside world.

## The Prime Directive

**This layer must be completely isolated from external dependencies.**

## What belongs here

- **Entities**: Domain objects with identity and lifecycle (e.g., `User`, `Post`). They encapsulate state and related business logic.
- **Value Objects (VOs)**: Immutable domain objects defined only by their attributes (e.g., `Email`, `UserId`). They validate themselves upon creation.
- **Domain Errors**: Strongly-typed custom errors (e.g., `InvalidEmailError`). Never throw generic `Error`s.
- **Repository Ports**: Iterfaces that define the contracts for persistence (e.g., `UserRepositoryPort`).

## What is strictly forbidden here

- **No NestJS imports**: You may not import `@nestjs/common`, `@nestjs/core`, `@Injectable()`, etc.
- **No ORM imports**: You may not import `typeorm`, `prisma`, `@Entity()`, `@Column()`, etc.
- **No Infrastructure concepts**: No HTTP Request/Response objects, no HTTP status codes.
- **No dependencies on outer layers**: Never import anything from `../application` or `../infrastructure`.

## How to verify the boundary

If you can compile the `.ts` files in this folder and run their unit tests without spinning up NestJS and without a database connection, your boundary is healthy.
