# Nest-Pilot

A CLI-driven, architecture-aware NestJS boilerplate system.

Instead of cloning a generic starter repository and manually deleting hundreds of lines of code to fit your chosen architecture (Hexagonal, DDD, or Modular), `nest-pilot` asks how you want to build and generates exactly what you need.

## Current Status

**Phase 0 (Foundation): Complete**
The core CLI composer engine and shared infrastructure templates are complete. The architecture-specific templates are being actively developed in subsequent phases.

## Local Development

```bash
# Install dependencies
npm install

# Build the CLI
npm run build

# Run the test suite
npm run test

# Run the CLI locally without compiling (prompts for config)
npm run dev --workspace=cli -- create my-new-app
```

## Documentation

- [Architecture Decision Records (ADRs)](./docs/decisions/)
- [Project PRDs](./prd/)
- [CLI Package Documentation](./cli/README.md)
