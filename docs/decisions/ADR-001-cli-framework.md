# ADR-001: CLI Framework Selection

**Date**: 2026-03-13
**Status**: Accepted

## Context

The CLI tool requires two distinct concerns: command parsing (flags, arguments, subcommands) and interactive user experience (prompts, spinners, progress). Common options are:

| Option            | Parsing                   | Prompting                 |
| ----------------- | ------------------------- | ------------------------- |
| Commander + Clack | Mature, widely adopted | Modern, opinionated UX |
| Oclif             | Full framework         | Built-in prompting     |
| Inquirer.js       | Not a parser           | Classic, feature-rich  |
| Vorpal            | Abandoned              | —                         |

## Decision

Use **Commander.js** for command parsing and **@clack/prompts** for interactive prompts.

## Rationale

- **Commander**: Zero-magic API, tiny footprint, no opinion on prompting. The de-facto standard for NestJS CLI and other popular CLIs.
- **Clack**: Purpose-built for "install wizard" style CLIs. Ships a beautiful default TUI without any styling code. Handles Ctrl+C gracefully via `isCancel()`. The project-plan document explicitly lists it.
- **Separation of concerns**: Parsing and prompting are separate responsibilities. Using two focused tools is better than one monolithic framework (like Oclif) when we want full control over template generation.

## Consequences

- Tests must mock `@clack/prompts` because it is ESM-only (see ADR-002).
- The `--defaults` flag bypasses prompts entirely, enabling non-interactive generation (useful for CI and smoke tests).
