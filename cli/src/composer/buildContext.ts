import { ComposerContext } from './compose';

export interface EjsContext extends Record<string, string> {
  projectName: string;
  projectNamePascalCase: string;
  projectNameConstant: string;
  packageManager: string;
  architecture: string;
  year: string;
}

/**
 * Derives all EJS template variables from the raw user answers.
 *
 * This is the single source of truth for template variable derivation.
 * No logic is allowed inside .ejs templates — only variable references.
 *
 * PRD-00 6.2 Step 2
 */
export function buildContext(answers: ComposerContext): EjsContext {
  return {
    projectName: answers.projectName,
    projectNamePascalCase: toPascalCase(answers.projectName),
    projectNameConstant: toConstantCase(answers.projectName),
    packageManager: answers.packageManager,
    architecture: answers.architecture,
    year: new Date().getFullYear().toString(),
  };
}

/**
 * Converts a kebab-case project name to PascalCase.
 * Example: "my-cool-app" → "MyCoolApp"
 */
export function toPascalCase(name: string): string {
  return name
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
}

/**
 * Converts a kebab-case project name to CONSTANT_CASE.
 * Example: "my-cool-app" → "MY_COOL_APP"
 */
export function toConstantCase(name: string): string {
  return name.toUpperCase().replace(/-/g, '_');
}
