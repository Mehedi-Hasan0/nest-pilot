# Changelog

All notable changes to this project will be documented in this file.

### [0.2.3](https://github.com/Mehedi-Hasan0/nest-pilot/compare/v0.2.2...v0.2.3) (2026-03-25)

### Features

- introduce 'nest-pilot' cli for interactive project generation, and automation workflow ([57ffbc3](https://github.com/Mehedi-Hasan0/nest-pilot/commit/57ffbc3c7fc52bc49ed2f3cfbdb845f040c4e263))

### Documentation

- contributing guides added ([5ae6ce2](https://github.com/Mehedi-Hasan0/nest-pilot/commit/5ae6ce24952c325c5c3b470f58aca98a62edba56))

### [0.2.2](https://github.com/Mehedi-Hasan0/nest-pilot/compare/v0.2.1...v0.2.2) (2026-03-25)

### Features

- refactor base modules for dynamic ORM selection, fixes([#30](https://github.com/Mehedi-Hasan0/nest-pilot/issues/30)) ([e768b75](https://github.com/Mehedi-Hasan0/nest-pilot/commit/e768b759243025ae5358ee303fef4804444c28f0))
- add mikro-orm integration to the hexagonal architecture ([c749cf4](https://github.com/Mehedi-Hasan0/nest-pilot/commit/c749cf4dd0311e528414ee9ba9ccf898e899c4b2))
- add prisma orm template layer ([c2db6d5](https://github.com/Mehedi-Hasan0/nest-pilot/commit/c2db6d54aa6e56e4f4caa505bb22f9a421cd2de7))
- bullmq optional module added ([679edad](https://github.com/Mehedi-Hasan0/nest-pilot/commit/679edaddaedfe1f1f0e9bec459cdb03320b9daa1))
- **cli:** extend prompt flow with Phase 2 inputs ([#1](https://github.com/Mehedi-Hasan0/nest-pilot/issues/1)) ([01edc31](https://github.com/Mehedi-Hasan0/nest-pilot/commit/01edc319472156bce46db79c5ceaa07ba642ac74))
- error handling added ([c02ffd5](https://github.com/Mehedi-Hasan0/nest-pilot/commit/c02ffd5bd41c0f29eae6a80ce8ac5cabc46b3c5b))
- extend ejs context with derived vairables templates, fixes([#26](https://github.com/Mehedi-Hasan0/nest-pilot/issues/26)) ([892864b](https://github.com/Mehedi-Hasan0/nest-pilot/commit/892864b02d3b23787a56df9318e1cd4b7dd05271))
- implement template overlay resolution system for dynamic template composition, fixes ([#28](https://github.com/Mehedi-Hasan0/nest-pilot/issues/28)) ([cf0f769](https://github.com/Mehedi-Hasan0/nest-pilot/commit/cf0f769d65b6c57bbc4e092e9fb6972a7de01af7))
- jwt auth template layer added ([adfd994](https://github.com/Mehedi-Hasan0/nest-pilot/commit/adfd994054ab61fe233ed1592afafce8c2b964ff))
- none-auth variant added ([20a947d](https://github.com/Mehedi-Hasan0/nest-pilot/commit/20a947de0b5fa9cc9a7bf5d192946b508fd1427c))
- post generation, managing file generation, dependency installation and git initialization ([8bc9708](https://github.com/Mehedi-Hasan0/nest-pilot/commit/8bc9708b3b5456902fa62aec3e6038be75a54433))
- redis cache optional module added ([2234ef1](https://github.com/Mehedi-Hasan0/nest-pilot/commit/2234ef1df5cfab8846fcb3fa0215b5b802974c2e))
- session auth template-layer ([fae92d2](https://github.com/Mehedi-Hasan0/nest-pilot/commit/fae92d2b564bbcb67f45b5ca36fa427fbdf6db27))
- swagger optional module added ([6719d01](https://github.com/Mehedi-Hasan0/nest-pilot/commit/6719d0130658abbc6d5b41e0068809c1950a86b6))
- templates for hexagonal architecture with orms, and shared project config ([52f31bf](https://github.com/Mehedi-Hasan0/nest-pilot/commit/52f31bff21f1e728fa06d4580802b0195971bfb0))
- websockets optional module added ([37a1786](https://github.com/Mehedi-Hasan0/nest-pilot/commit/37a178687ffd30a43171ef90f637b63a0fd1b742))

### Bug Fixes

- docs/issues to git ignore files ([72564ec](https://github.com/Mehedi-Hasan0/nest-pilot/commit/72564ec8b964fb4c91a5a68a1a9c960b5ae246e2))
- removed unnecessary docs ([57e757d](https://github.com/Mehedi-Hasan0/nest-pilot/commit/57e757d028a685d64a565c9a689fbbea21523bce))
- security vulnerability, package mismatch ([f93f0d1](https://github.com/Mehedi-Hasan0/nest-pilot/commit/f93f0d15a13f35b64deb78d909e5a3f98fdd4f5a))

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
