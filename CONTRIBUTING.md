# Contributing to Nest-Pilot

First, thanks for being here. Whether you're fixing a typo, reporting a bug, or adding a whole new architecture, it matters.

This document is long, but you don't need to read all of it right now. Jump to the section that's relevant to what you're trying to do.

---

## Table of Contents

- [Before you start](#before-you-start)
- [Ways to contribute](#ways-to-contribute)
- [Setting up the project locally](#setting-up-the-project-locally)
- [How the project is structured](#how-the-project-is-structured)
- [Making changes](#making-changes)
  - [Changing the CLI](#changing-the-cli)
  - [Changing an existing template](#changing-an-existing-template)
  - [Adding a new ORM or auth option](#adding-a-new-orm-or-auth-option)
  - [Adding a new architecture](#adding-a-new-architecture)
- [Commit conventions](#commit-conventions)
- [Submitting a pull request](#submitting-a-pull-request)
- [What happens after you submit](#what-happens-after-you-submit)
- [Things that are out of scope](#things-that-are-out-of-scope)

---

# Before you start

A few things worth knowing upfront:

**Check if there's already an issue.** Search open issues before opening a new one or starting work. If the thing you want to do is already being discussed, join the conversation rather than starting a parallel one.

**Open an issue before large PRs.** If you're planning something significant, a new architecture, a new ORM, a meaningful CLI change, open an issue or discussion first. It's frustrating to put a week into something and then find out it doesn't align with the project's direction. A quick conversation upfront saves everyone time.

**Small PRs are easier to review.** A PR that does one thing clearly is almost always better than a PR that does five things. If you're tempted to bundle unrelated fixes together, resist it.

---

## Ways to contribute

Not all contribution is code. Everything on this list is genuinely useful:

**Reporting bugs** A clear, reproducible bug report is one of the most valuable things you can contribute. See the bug report template.

**Improving documentation** The per-folder READMEs inside each architecture template are one of the most important things about this project. If something is unclear, confusing, or out of date, that's a real problem worth fixing.

**Answering questions** If you see someone in Discussions who has a question you know the answer to, answer it. You don't need to be a maintainer to help.

**Testing on different environments** If you're on Windows or a Linux distribution that isn't Ubuntu, testing that the CLI and generated projects work correctly is genuinely useful, even if all you do is report that it works.

**Adding ORM support** Each architecture currently has TypeORM and Prisma. Adding MikroORM, or eventually Drizzle, is a well-scoped contribution.

**Adding a new architecture** The biggest possible contribution. Read the [Adding a new architecture](#adding-a-new-architecture) section carefully before starting.

---

## Setting up the project locally

You'll need Node.js 18 or later, git, and Docker (for running the e2e tests against a real database).

```bash
# Clone the repo
git clone https://github.com/Mehedi-Hasan0/nest-pilot
cd nest-pilot

# Install dependencies for all workspaces
npm install

# Build the CLI
npm run build --workspace=cli

# Run the CLI locally (without global install)
node cli/dist/index.js create test-project

# Run the test suite
npm run test --workspace=cli
```

If you want to test the full flow including e2e tests:

```bash
# Inside a generated project directory
docker-compose up -d     # Start the database
npm run test:e2e         # Run e2e tests against it
```

---

## How the project is structured

```
nest-pilot/
├── cli/                  # The CLI tool , what users install from npm
│   └── src/
│       ├── commands/     # Top-level commands (create, add, etc.)
│       ├── prompts/      # The interactive questionnaire logic
│       ├── composer/     # Assembles template files into a project
│       └── utils/        # Helpers shared across the CLI
│
└── templates/
    ├── shared/           # Files that go into every generated project
    ├── hexagonal/        # Hexagonal Architecture template
    ├── ddd/              # Domain-Driven Design template
    └── modular/          # Modular Architecture template
```

The CLI and templates are intentionally in the same repo. The composer in the CLI reads templates at runtime, they're tightly coupled, and separating them would create more problems than it solves.

Template files use `.ejs` extensions and support variable interpolation like `<%= projectName %>`. The composer strips the `.ejs` extension when writing output files. There's no logic inside templates, if you find yourself writing an `if` statement in an `.ejs` file, that logic should be in the composer instead.

---

## Making changes

### Changing the CLI

The CLI is a TypeScript project. Make your changes in `cli/src/`, then:

```bash
# Type-check and compile
npm run build --workspace=cli

# Run tests
npm run test --workspace=cli

# Test your change manually
node cli/dist/index.js create test-project
```

If your change touches the prompt flow, test every path, not just the happy path. Specifically test what happens when someone hits `Ctrl+C` at each step. It should always exit cleanly without leaving partial files on disk.

If your change affects which packages get added to the generated `package.json`, update the relevant section in `cli/src/composer/dependencies.ts`.

### Changing an existing template

Templates live in `templates/<architecture>/`. Changes here affect what every future user gets when they generate a project with that architecture.

**The standard to hit:** The generated project must compile with zero TypeScript errors, pass all tests, and lint cleanly. Run this check before submitting:

```bash
# Generate a test project
node cli/dist/index.js create my-test --defaults --skip-git

# In the generated project
cd my-test
npm install
npm run build    # must exit 0
npm run lint     # must exit 0
npm run test     # must exit 0
```

A few things that will get a template change rejected:

- Files with `// TODO` or `// FIXME` comments
- Hardcoded project names (use `<%= projectName %>`)
- Business logic that's stubbed rather than implemented
- `.ejs` extensions that make it into the generated output

If you're changing a folder's contents, check whether the folder's `README.md` needs updating too. The READMEs are part of the template, they're what a developer reads when they open the generated project for the first time.

### Adding a new ORM or auth option

This is a well-scoped contribution that doesn't require understanding the whole project.

Each architecture keeps its ORM variations in `templates/<architecture>/orm/<orm-name>/`. Only the persistence layer varies, domain and application layers are ORM-agnostic and shouldn't need to change.

Steps:

1. Create `templates/<architecture>/orm/<new-orm>/` with the persistence sublayer for that ORM
2. Add the ORM option to `cli/src/prompts/options.prompt.ts`
3. Add its package dependencies to `cli/src/composer/dependencies.ts`
4. Update the template resolver in `cli/src/composer/template-resolver.ts`
5. Add a smoke test that generates a project with the new ORM and verifies it compiles

Look at how TypeORM is implemented as the reference. Follow the same patterns, same folder structure, same mapper pattern, same repository interface contract.

### Adding a new architecture

This is the most significant kind of contribution. Before you start, please open an issue to discuss it. Not because the idea will be rejected, but because it's worth having a conversation about scope, approach, and whether there's overlap with existing architectures.

If you do go ahead, follow this sequence, in this order:

**1. Run the architecture transition checklist first.**

Before writing any code, verify that the most recently completed architecture meets all its acceptance criteria. This exists because each architecture sets the quality bar for the next one.

**2. Write the architecture README before any code.**

Create `templates/<new-architecture>/README.md` and write it fully. It should explain what the architecture is in plain language, when to use it versus the others, the rules that make it architecturally distinct (not just a different folder structure), and a map of the folder layout. If you can't write this clearly, the implementation will be muddier. Write the README first.

**3. Map the example domain to the new architecture in prose.**

Every architecture in this project uses the same example domain: a Blog with Users, Posts, and Comments. Before implementing, write out in plain English how that domain maps to the new architecture's concepts. For example: "In this architecture, Post and Comment are in the same module because they're closely related features, but they have separate services because their business logic is distinct." This exercise surfaces design questions before they become bugs.

**4. Implement it fully.**

No stubs. No TODOs. Every folder gets a `README.md`. Every layer gets tests. The architecture transition checklist below defines what "done" means:

- [ ] Every folder has a `README.md` answering: what belongs here, what doesn't, and why the boundary exists
- [ ] All three example entities (User, Post, Comment) are fully implemented with real business logic
- [ ] Unit tests cover domain and application layers
- [ ] Integration tests cover the infrastructure layer
- [ ] An e2e test exists in `test/` and passes against a real database
- [ ] The security baseline is wired: Helmet, rate limiting, global validation pipe, env validation on startup
- [ ] The observability baseline is wired: Pino logging, health check endpoint
- [ ] Docker files work: `docker-compose up -d` starts the database, `npm run start:dev` starts the app
- [ ] The generated project compiles with zero TypeScript errors
- [ ] A developer unfamiliar with the architecture can understand it from the code and READMEs alone

**5. Wire it into the CLI.**

Add the architecture to the prompt options with an accurate description (see how Hexagonal and DDD are described , be equally honest about trade-offs). Update the template resolver and the post-generation success message to reflect this architecture's specific next steps.

**6. Add a smoke test.**

A CI test that generates a project with the new architecture, installs dependencies, builds, lints, and runs tests. This protects the architecture from regressing silently in future changes.

---

## Commit conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Commitlint enforces it , your commit will be rejected if it doesn't match.

The format is: `type(scope): description`

Common types:

| Type       | When to use                                                       |
| ---------- | ----------------------------------------------------------------- |
| `feat`     | A new feature , new architecture, new ORM support, new CLI option |
| `fix`      | A bug fix                                                         |
| `docs`     | Changes to documentation only                                     |
| `test`     | Adding or fixing tests                                            |
| `refactor` | Code change that doesn't fix a bug or add a feature               |
| `chore`    | Build process, dependency updates, tooling                        |
| `ci`       | Changes to CI configuration                                       |

Examples:

```
feat(templates): add MikroORM support to hexagonal architecture
fix(cli): handle Ctrl+C gracefully during ORM selection prompt
docs(hexagonal): clarify repository port injection token pattern
test(composer): add integration test for Prisma template overlay
chore(deps): update @clack/prompts to 0.9.1
```

The scope is optional but useful. Good scopes for this project: `cli`, `composer`, `templates`, `hexagonal`, `ddd`, `modular`, `shared`.

Keep the description short (under 72 characters) and in the imperative mood , "add support" not "adds support" or "added support."

If your commit closes an issue, add `Closes #123` in the commit body, not in the subject line.

---

## Submitting a pull request

1. Fork the repo and create a branch from `main`. Name the branch after what it does: `feat/mikroorm-hexagonal`, `fix/clack-ctrl-c-crash`, `docs/ddd-readme-clarity`.

2. Make your changes. Run the relevant checks locally before pushing (the CI will catch failures, but it's faster to catch them yourself).

3. Open the PR against `main`. Fill in the PR template , the checklist items exist because they've caught real problems before.

4. If the CI fails, fix it before asking for review. Green CI is the baseline, not a bonus.

5. If you get review feedback, respond to it , even just to say "good catch, fixing it" or "I disagree because..." A PR that goes silent for two weeks gets closed.

---

## What happens after you submit

I'll try to leave an initial response within a week. For small things (docs, fixes), it'll usually be faster. For large things (new architectures), expect more back-and-forth.

Review feedback is honest. "This doesn't meet the template quality standard" with an explanation is a real answer, not a dismissal. If I ask for changes, I'll be specific about what and why.

Once a PR is merged, it'll be in the next release. I don't hold changes , once they're in `main`, they ship.

---

## Things that are out of scope

Some things won't be added to this project, and it's worth knowing upfront so you don't spend time on something that won't merge:

**Microservices architecture** This is a separate enough concern that it would be better as its own project.

**Frontend scaffolding** Nest-Pilot is a backend tool. It stops at the API layer.

**Cloud deployment configs** Kubernetes manifests, AWS CDK, Terraform, too opinionated and too maintenance-heavy. The generated project has a production-ready Dockerfile, and that's intentional.

**GraphQL as a primary architecture** GraphQL is an _option_ in the CLI (it affects the transport layer), but it's not an architectural pattern in the same sense as Hexagonal or DDD.

**Non-NestJS backends** Nest-Pilot is NestJS-specific. Express-only, Fastify-only, and similar tools have their own ecosystems.

If you're unsure whether something is in scope, open a Discussion and ask before building it. That's what Discussions is for.

---

_Thanks again for contributing. Building things in the open is better when more people are involved._
