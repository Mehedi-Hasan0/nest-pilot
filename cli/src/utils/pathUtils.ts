import * as path from 'path';

/**
 * Resolves the absolute path to the templates directory.
 *
 * At runtime (after `npm install -g`), the templates are bundled alongside
 * the distributed CLI. We resolve from __dirname relative to the compiled
 * entry point (dist/index.js → ../templates/).
 *
 * Decision OQ-4: Resolving from __dirname relative to the compiled entry.
 */
export function resolveTemplatesDir(): string {
  // src/utils/pathUtils.ts compiles to dist/utils/pathUtils.js
  // From dist/utils/, we need: .. (dist) -> .. (cli) -> .. (root) -> templates/
  return path.resolve(__dirname, '..', '..', '..', 'templates');
}

/**
 * Resolves the absolute output directory for a generated project.
 * Always relative to the user's current working directory.
 */
export function resolveOutputDir(projectName: string): string {
  return path.resolve(process.cwd(), projectName);
}
