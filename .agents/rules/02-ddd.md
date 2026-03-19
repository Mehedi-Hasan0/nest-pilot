# Domain-Driven Design (DDD) Rules

These rules apply when working within DDD template directories.

## 1. Tactical Patterns

- **Aggregate Roots**: Manage consistency boundaries. Ensure member entities (like `Comment`) are only accessed via the parent Root (`Post`).
- **Value Objects**: Use immutable Value Objects (e.g., `PostTitle`, `Email`) for logic and validation that doesn't require identity.
- **Repositories**: Operate at the Aggregate level. Load/Save the entire aggregate, not individual entities.

## 2. Behavioral Patterns

- **Reconstitution**: Use static `reconstitute()` for database loads (no events) and `create()` for new domain objects (raises events).
- **CQRS**: strictly separate Commands (write) from Queries (read). Queries are allowed to bypass the domain model for performance.
- **Domain Events**: Dispatched by the Application layer _after_ successful repository persistence.
