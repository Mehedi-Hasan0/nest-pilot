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
    .option('--skip-git', 'Skip the git init step')
    .option('--defaults', 'Skip prompts and use default options')
    .option('--verbose', 'Print each file path as it is written')
    .action(async (projectNameArg: string | undefined, options) => {
      try {
        const answers = await runCreatePrompts(projectNameArg, options.defaults);

        if (!answers) {
          // User cancelled
          process.exit(0);
        }

        const { projectName, architecture, packageManager } = answers;

        // Validate
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
            message: `Directory "${projectName}" already exists. Overwrite?`,
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
            packageManager,
          },
          dryRun: options.dryRun ?? false,
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
