import { Command } from 'commander';
import { runCreatePrompts } from '../prompts/create.prompt';
import { compose } from '../composer/compose';
import { validateProjectName } from '../utils/validateProjectName';
import { resolveOutputDir } from '../utils/pathUtils';
import * as fs from 'fs-extra';
import chalk from 'chalk';

export function createCommand(): Command {
  const command = new Command('create');

  command
    .description('Create a new NestJS project')
    .argument('[project-name]', 'Name of the project to create')
    .option('--dry-run', 'Preview what will be generated without writing to disk')
    .option('--skip-install', 'Skip the npm install step')
    .option('--skip-git', 'Skip the git init step')
    .option(
      '--defaults',
      'Skip all prompts and use sensible defaults (Hexagonal, TypeORM, PostgreSQL, JWT, npm)',
    )
    .option('--verbose', 'Print each file path as it is written')
    .action(async (projectNameArg: string | undefined, options) => {
      try {
        const answers = await runCreatePrompts(projectNameArg, options.defaults);

        if (!answers) {
          // User cancelled — exit 0 (it's a choice, not an error)
          process.exit(0);
        }

        const {
          projectName,
          architecture,
          includeExampleCode,
          orm,
          database,
          auth,
          optionalModules,
          packageManager,
        } = answers;

        // Validate project name
        const nameError = validateProjectName(projectName);
        if (nameError) {
          console.error(chalk.red(`✖ ${nameError}`));
          process.exit(1);
        }

        const outputDir = resolveOutputDir(projectName);

        // Check if directory already exists
        if (fs.existsSync(outputDir) && !options.defaults) {
          const { confirm } = await import('@clack/prompts');
          const shouldOverwrite = await confirm({
            message: `A directory named "${projectName}" already exists. Overwrite?`,
            initialValue: false,
          });
          if (!shouldOverwrite) {
            console.log(chalk.yellow('Cancelled.'));
            process.exit(0);
          }
        }

        await compose({
          outputDir,
          context: {
            projectName,
            architecture,
            includeExampleCode,
            orm,
            database,
            auth,
            optionalModules,
            packageManager,
          },
          dryRun: options.dryRun ?? false,
          skipInstall: options.skipInstall ?? false,
          skipGit: options.skipGit ?? false,
          verbose: options.verbose ?? false,
        });
      } catch (error) {
        console.error(chalk.red('An unexpected error occurred:'), error);
        process.exit(1);
      }
    });

  return command;
}
