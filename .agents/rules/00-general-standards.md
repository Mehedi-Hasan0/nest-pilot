# General Standards & Quality Mandates

You are working on **Nest-Pilot**. Every contribution must meet these foundational quality and security standards.

## 1. Quality Mandates

- **No Stubs**: Every file must be fully implemented. `// TODO` or shallow implementations are forbidden.
- **Documentation First**: Every major directory must have a `README.md` explaining:
  - What belongs here.
  - What is forbidden here.
  - Why this boundary exists.
- **Test-Driven**: Unit tests for domain/application logic, Integration tests for infrastructure/persistence, and E2E tests for the full pipeline are required.

## 2. Technical Standards

- **Naming**: `PascalCase` for classes, `camelCase` for variables/functions.
- **Clean Code**: No hardcoded secrets, passwords, or magic numbers. Use a `constants/` or `config/` layer.
- **Typing**: Strict TypeScript enforcement. Avoid `any` at all costs.

## 3. Security & Infrastructure

- **Security Baseline**: Always include Helmet, Throttler, and ValidationPipe.
- **Environment**: All environment variables must be validated (e.g., using Zod) on startup.
- **Docker**: Every template project must have a multi-stage `Dockerfile` (builder + production) and `docker-compose.yml`.
- **Git**: Automated `git init` and initial commit for every generated project.
