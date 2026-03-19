# Modular Architecture Rules

These rules apply when working within Modular Architecture template directories.

## 1. Feature Isolation

- **Module Boundaries**: Organize code into self-contained feature modules (e.g., `UserModule`, `PostModule`).
- **Encapsulation**: Only export what other modules absolutely need to interact with.
- **Decoupling**: Prefer cross-module events via `@nestjs/event-emitter` over direct service coupling where appropriate.

## 2. Dependencies

- **Explicit Imports**: Always import the module, not just the service file, to maintain NestJS DI integrity.
- **Circular Deps**: Use `forwardRef()` as a last resort and document the architectural reason for the cycle.
