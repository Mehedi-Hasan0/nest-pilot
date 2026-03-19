# Hexagonal Architecture Implementation

This project implements a strict Hexagonal (Ports and Adapters) Architecture for NestJS.

## Layer Boundaries

### 1. Domain Layer (`src/domain/`)

- **Core Entities**: Pure business objects (e.g., `User`, `Post`).
- **Value Objects**: Immutable domain concepts with validation (e.g., `Email`, `UserId`).
- **Ports**: Interfaces defining what the domain needs (e.g., `UserRepositoryPort`).
- **Errors**: Domain-specific exceptions.
- **NO dependencies** on frameworks, libraries (except small utils), or the application layer.

### 2. Application Layer (`src/application/`)

- **Use Cases**: Orchestra business logic flows (e.g., `RegisterUser`).
- **DTOs**: Simple data transfer objects for inputs and outputs.
- **Errors**: Application-level exceptions.
- **Depends** on the Domain layer.

### 3. Infrastructure Layer (`src/infrastructure/`)

- **Adapters**: Concrete implementations of Domain Ports.
  - **HTTP (Primary)**: NestJS Controllers, Guards, and Pipes.
  - **Persistence (Secondary)**: TypeORM Repositories and Entities.
- **Common Components**: Shared infrastructure logic like configuration and global filters.
- **Depends** on Application and Domain layers.

## Key Principles

1. **Dependency Direction**: All dependencies point inwards (Infrastructure -> Application -> Domain).
2. **Isolation**: Use Cases should never know if they are being called by a REST API, a message queue, or a CLI.
3. **Purity**: The Domain layer is "ignorant" of the outside world, making it highly testable and robust.

## Standalone Testing

The template is configured to be testable independently:

```bash
cd templates/hexagonal/base
npm install
npm run test
```
