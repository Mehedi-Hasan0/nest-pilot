// Manual mock for @clack/prompts — returns no-op stubs.
// Needed because @clack/prompts is ESM-only and Jest runs in CommonJS mode.
// Integration tests care about file generation, not CLI output.

const noop = () => {};
const asyncNoop = async () => {};

const spinner = () => ({
  start: noop,
  stop: noop,
  message: noop,
});

module.exports = {
  intro: noop,
  outro: noop,
  note: noop,
  cancel: noop,
  spinner,
  text: asyncNoop,
  select: asyncNoop,
  confirm: async () => true,
  isCancel: () => false,
  multiselect: asyncNoop,
};
