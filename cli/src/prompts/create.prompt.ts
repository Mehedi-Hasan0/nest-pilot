import { intro, text, select, outro, cancel, isCancel } from '@clack/prompts';

export interface CreateAnswers {
  projectName: string;
  architecture: 'hexagonal' | 'ddd' | 'modular';
  packageManager: 'npm' | 'yarn' | 'pnpm';
}

/**
 * Runs the Phase 0 prompt flow.
 *
 * In Phase 0, this is a minimal stub that proves the pipeline works.
 * Architecture options are shown but only the selection is recorded —
 * the generated output is shared template files only in this phase.
 */
export async function runCreatePrompts(
  projectNameArg: string | undefined,
  useDefaults: boolean,
): Promise<CreateAnswers | null> {
  intro('Nest Pilot — NestJS Project Generator');

  // --- Project Name ---
  let projectName: string;
  if (projectNameArg) {
    projectName = projectNameArg;
  } else {
    const result = await text({
      message: 'What is your project name?',
      placeholder: 'my-app',
      validate: (value) => {
        if (!value.trim()) return 'Project name is required.';
        if (!/^[a-z][a-z0-9-]*$/.test(value.trim())) {
          return 'Project name must be lowercase with hyphens only (e.g., my-app).';
        }
      },
    });

    if (isCancel(result)) {
      cancel('Operation cancelled.');
      return null;
    }
    projectName = (result as string).trim();
  }

  if (useDefaults) {
    outro(`Using defaults for "${projectName}".`);
    return { projectName, architecture: 'hexagonal', packageManager: 'npm' };
  }

  // --- Architecture ---
  const architectureResult = await select({
    message: 'Which architecture do you want to use?',
    options: [
      {
        value: 'hexagonal',
        label: 'Hexagonal Architecture',
        hint: 'coming soon — will be available in v0.2',
      },
      { value: 'ddd', label: 'Domain-Driven Design', hint: 'coming soon' },
      { value: 'modular', label: 'Modular Architecture', hint: 'coming soon' },
    ],
  });

  if (isCancel(architectureResult)) {
    cancel('Operation cancelled.');
    return null;
  }

  // --- Package Manager ---
  const packageManagerResult = await select({
    message: 'Which package manager do you prefer?',
    options: [
      { value: 'npm', label: 'npm' },
      { value: 'yarn', label: 'yarn' },
      { value: 'pnpm', label: 'pnpm' },
    ],
  });

  if (isCancel(packageManagerResult)) {
    cancel('Operation cancelled.');
    return null;
  }

  outro(`Ready to generate "${projectName}"...`);

  return {
    projectName,
    architecture: architectureResult as 'hexagonal' | 'ddd' | 'modular',
    packageManager: packageManagerResult as 'npm' | 'yarn' | 'pnpm',
  };
}
