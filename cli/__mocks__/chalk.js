// Manual mock for chalk — returns strings unchanged.
// Needed because chalk@5 is ESM-only and Jest runs in CommonJS mode.
const handler = {
  get: (target, prop) => {
    if (prop === 'default') return module.exports;
    return (str) => str;
  },
  apply: (target, thisArg, args) => args[0],
};

const chalk = new Proxy(function (str) {
  return str;
}, handler);

// Add all chalk methods as pass-through functions
['red', 'green', 'yellow', 'blue', 'cyan', 'white', 'gray', 'bold', 'dim'].forEach((method) => {
  chalk[method] = (str) => str;
});

module.exports = chalk;
module.exports.default = chalk;
