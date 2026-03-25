const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'templates');
const destDir = path.join(__dirname, 'dist', 'templates');

console.log(`Copying templates from ${sourceDir} to ${destDir}...`);

try {
  fs.copySync(sourceDir, destDir, { overwrite: true });
  console.log('Templates copied successfully.');
} catch (err) {
  console.error('Error copying templates:', err);
  process.exit(1);
}
