# templates/hexagonal/src/application/

The **Application Layer** orchestrates business use cases. It acts as the bridge between external triggers (like HTTP controllers in the infrastructure layer) and the strictly isolated Domain Layer.

## The Prime Directive

**This layer coordinates behavior but contains NO complex business rules and NO infrastructure details.**

## What belongs here

- **Use Cases (Interactors)**: Classes with a single `execute()` method representing a specific user action (e.g., `RegisterUserUseCase`).
- **Commands/Queries**: Simple objects representing the inputs to your Use Cases.
- **DTOs (Data Transfer Objects)**: Simple objects returned by Use Cases to ensure raw Domain Entities never escape to the presentation layer.

## What is strictly forbidden here

- **No Domain Logic**: Do not write complex `if/else` checks about entity states here. The Use Case should retrieve the entity, call an entity method (e.g., `post.publish()`), and save it.
- **No HTTP Concepts**: Do not import `@nestjs/common` decorators like `@Req()`, `@Res()`, or throw `HttpException`. Use custom Domain errors; let the infrastructure layer map them to HTTP 400s or 404s.
- **No Concrete Repositories**: Always inject the abstract `Port` defined in the Domain layer (`@Inject(USER_REPOSITORY_PORT)`), never the TypeORM implementation.

## The DTO Law

**A Use Case must never return a Domain Entity.**
Always map your entity (`User`) to a DTO (`UserResponseDto`) before returning it. If you return raw entities, developers will inevitably leak TypeORM decorators or domain logic directly into JSON API responses, breaking the Hexagonal architectural boundary.
