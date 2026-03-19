---
name: Bug report
about: Something broke. Let's fix it.
labels: bug
---

<!--
  Thanks for taking the time to report this. The more detail you give,
  the faster I can reproduce and fix it. Please fill out everything below —
  vague reports are genuinely hard to action.

  Delete any section that truly doesn't apply.
-->

## What happened?

<!-- A clear description of what went wrong. "It doesn't work" isn't enough —
     tell me what you expected to see vs what you actually got. -->

**What I expected:**

**What actually happened:**

---

## Steps to reproduce

<!-- The exact commands you ran, in order. If I can't reproduce it, I can't fix it. -->

```bash
# paste the exact commands here
```

---

## Environment

| Field                 | Value                                                     |
| --------------------- | --------------------------------------------------------- |
| Nest-Pilot version    | <!-- run: nest-pilot --version -->                        |
| Node version          | <!-- run: node --version -->                              |
| npm/yarn/pnpm version | <!-- run: npm --version -->                               |
| OS                    | <!-- e.g. macOS 14.2, Ubuntu 22.04, Windows 11 + WSL2 --> |

---

## What you selected in the CLI

<!-- Tick everything that applies to the project you were generating -->

**Architecture:**

- [ ] Hexagonal
- [ ] DDD
- [ ] Modular

**ORM:**

- [ ] TypeORM
- [ ] Prisma
- [ ] MikroORM

**Database:**

- [ ] PostgreSQL
- [ ] MySQL
- [ ] MongoDB

**Auth:**

- [ ] JWT
- [ ] Session
- [ ] None

**Optional modules selected:**

- [ ] Swagger
- [ ] Redis
- [ ] BullMQ
- [ ] WebSockets
- [ ] None

---

## Error output

<!-- Paste the full error message or stack trace. Don't truncate it. -->

```
paste error output here
```

---

## Generated project (if relevant)

<!-- If the bug is in the generated code rather than the CLI itself,
     paste the relevant file(s) or describe what's wrong with them. -->

---

## Anything else?

<!-- Workarounds you tried, related issues, gut feelings about what's wrong — anything helps. -->
