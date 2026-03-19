# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-03-19

### Added

- Hexagonal Architecture template support.
- Bcrypt, Helmet, and CORS integration in the template.
- Sub-layer documentation for Hexagonal template.
- Standalone `package.json` for template verification.
- High-level architecture guide in `docs/architecture/`.

### Fixed

- CLI composer now ignores `node_modules` and `.git` directories.
- All template unit and E2E tests passed and verified.
- Downgraded `uuid` to v10 for CJS compatibility.
- Environment validation updated to use Zod.

## [0.1.0] - 2026-03-10

- Initial Project Setup (Phase 0).
- Core CLI engine (Commander + Clack).
- Template Composer with EJS support.
