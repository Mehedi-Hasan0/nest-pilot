# Hexagonal Architecture Rules (Ports & Adapters)

These rules apply when working within Hexagonal Architecture template directories.

## 1. Layering Constraints

- **Domain Purity**: The `domain/` layer must be pure TypeScript. **Zero** imports from `@nestjs/*`, ORMs, or any external framework.
- **Inward-Only Imports**:
  - `infrastructure` -> `application` -> `domain`.
  - `domain` must NEVER import from `application` or `infrastructure`.
  - `application` must NEVER import from `infrastructure`.

## 2. Structural Requirements

- **Port Interfaces**: Define persistence and external system dependencies as interfaces (Ports) inside the domain layer.
- **Adapters**: Implement those interfaces in the `infrastructure` layer.
- **Isolation**: Domain business rules must be testable without starting a NestJS container or database.
