# Changelog

All notable changes to this project will be documented in this file.

### [0.2.1](https://github.com/Mehedi-Hasan0/nest-pilot/compare/v0.2.0...v0.2.1) (2026-03-20)

### Features

- add bootstrap with security, validation, and swagger documentation, fixes ([#11](https://github.com/Mehedi-Hasan0/nest-pilot/issues/11)) ([9edc06b](https://github.com/Mehedi-Hasan0/nest-pilot/commit/9edc06bb8ec058c2cad6fc77b949db8d54223ffa))
- add domain exception filter, fixes ([#7](https://github.com/Mehedi-Hasan0/nest-pilot/issues/7)) ([b674614](https://github.com/Mehedi-Hasan0/nest-pilot/commit/b67461407d5b0bd5052fdbb6a3061ce894033d95))
- add prd-01 detailing the complete specification, fixes ([#13](https://github.com/Mehedi-Hasan0/nest-pilot/issues/13)) ([5fa969a](https://github.com/Mehedi-Hasan0/nest-pilot/commit/5fa969ab064c88b1c87118a2fcd55c12f06e2fc5))
- hexagonal architecture template with tests and configuration, fixes ([#8](https://github.com/Mehedi-Hasan0/nest-pilot/issues/8)) ([8a967a4](https://github.com/Mehedi-Hasan0/nest-pilot/commit/8a967a461b1533d2e62976dff669da439bc739f6))
- implement post publishing functionality and user profile retrieval, fixes ([#9](https://github.com/Mehedi-Hasan0/nest-pilot/issues/9)) ([22bb2a4](https://github.com/Mehedi-Hasan0/nest-pilot/commit/22bb2a445c87f3aaab88b19ea7e6371b8b24b8ea))
- implemented configuration, authentication, and entity http layers, fixes ([#6](https://github.com/Mehedi-Hasan0/nest-pilot/issues/6)) ([ad53ffa](https://github.com/Mehedi-Hasan0/nest-pilot/commit/ad53ffa5d4b10b8e3da2d4d0f3d4c4ededecca27))
- introduce standard-version for automated release and changelog management ([c7547bc](https://github.com/Mehedi-Hasan0/nest-pilot/commit/c7547bce558e87c641935eca7d680236908ba89e))

### Bug Fixes

- environment variable jwt expires increase from 1h to 7d, fixes ([#12](https://github.com/Mehedi-Hasan0/nest-pilot/issues/12)) ([de1fdf3](https://github.com/Mehedi-Hasan0/nest-pilot/commit/de1fdf310bef70f2edd43325974d1ee2f18a911b))

### Documentation

- add radme detailing the http, persistence, post, and user domain layers, fixes ([#10](https://github.com/Mehedi-Hasan0/nest-pilot/issues/10)) ([44dc40a](https://github.com/Mehedi-Hasan0/nest-pilot/commit/44dc40a02b2a897eab94231197acf249c2c78577))

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
