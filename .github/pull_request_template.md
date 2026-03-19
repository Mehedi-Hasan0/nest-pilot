## What does this PR do?

<!-- One paragraph. If you can't summarize it in a paragraph, it might be too large.
     Consider splitting it. -->

---

## Why?

<!-- Link to the issue this resolves, or explain the motivation if there's no issue.
     "Fixes #123" will auto-close the issue when this merges. -->

Fixes #

---

## Type of change

- [ ] Bug fix
- [ ] New feature (new architecture, ORM, optional module, etc.)
- [ ] Template change (modifies generated output)
- [ ] CLI change (modifies the prompt flow or composer)
- [ ] Documentation
- [ ] Refactor (no behavior change)
- [ ] Tests only

---

## Checklist

These aren't box-ticking, each one exists because something broke without it before.

**If you changed the CLI:**

- [ ] `npm run build --workspace=cli` passes with zero TypeScript errors
- [ ] `npm run test --workspace=cli` passes
- [ ] `nest-pilot --help` output still looks right
- [ ] Cancelling mid-prompt with `Ctrl+C` exits cleanly

**If you changed a template:**

- [ ] The generated project compiles (`npm run build` in the generated output)
- [ ] The generated project passes linting (`npm run lint`)
- [ ] The generated project's tests pass (`npm run test`)
- [ ] No `.ejs` extension leaks into the generated output
- [ ] No hardcoded project names, everything uses `<%= projectName %>` or equivalent
- [ ] No secrets or credentials in any template file

**If you added a new architecture or ORM:**

- [ ] Every folder has a `README.md` that explains what belongs there and why
- [ ] All example domain code (User, Post, Comment) is fully implemented, no stubs or TODOs
- [ ] Unit tests exist at the domain and application layers
- [ ] An e2e test exists in `test/`
- [ ] The architecture transition checklist in `CONTRIBUTING.md` was followed

**Always:**

- [ ] I've read `CONTRIBUTING.md` (or I wrote it, in which case this is awkward)
- [ ] My commits follow the [Conventional Commits](https://www.conventionalcommits.org/) format
- [ ] I haven't introduced any `console.log` calls I don't mean to keep
- [ ] I haven't committed `.env` or any real credentials

---

## How to test this

<!-- Tell the reviewer exactly how to verify your change works.
     Don't make them figure it out, spell it out. -->

```bash
# exact commands to test this PR
```

---

## Screenshots / recordings (if relevant)

<!-- If you changed the CLI prompt flow or output, a screenshot or terminal recording
     (vhs is great for this) helps a lot during review. -->

---

## Anything the reviewer should know?

<!-- Trade-offs you made, things you're unsure about, follow-up work you're planning,
     context that isn't obvious from the code. This is where you can be honest. -->
