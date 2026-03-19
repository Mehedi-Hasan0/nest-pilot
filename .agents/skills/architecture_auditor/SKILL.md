---
name: architecture_auditor
description: Automatically audit project architecture for illegal imports and layering violations.
---

# Architecture Auditor Skill

This skill allows you to verify that architectural boundaries (Hexagonal, DDD, Modular) are respected. It specifically checks for illegal imports that cross layers incorrectly.

## When to use

- After making changes to any architecture template (`templates/hexagonal`, `templates/ddd`, `templates/modular`).
- Before finalizing a feature that involves cross-layer communication.
- During CI/CD or as a pre-commit check.

## How to use

Run the audit script located in `scripts/audit.js`.

### Hexagonal Rules

- **Domain** layer must NOT import from anything.
- **Application** layer must NOT import from **Infrastructure**.

### DDD Rules

- **Domain** layer must NOT import from anything outside its bounded context's domain.

### General Usage

```bash
node .agents/skills/architecture_auditor/scripts/audit.js [target_directory]
```

If no directory is provided, it defaults to the project root.
