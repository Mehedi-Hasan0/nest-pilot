import { spinner, note, outro } from '@clack/prompts';
import chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs-extra';
import { buildContext } from './buildContext';
import { resolveSourcePaths } from './resolveSourcePaths';
import { renderFiles } from './renderFiles';
import { gitInit } from './gitInit';
import { installDependencies } from './installDependencies';

export interface ComposerContext {
  // Phase 0 fields
  projectName: string;
  architecture: 'hexagonal' | 'ddd' | 'modular';
  packageManager: 'npm' | 'yarn' | 'pnpm';

  // Phase 2 additions (Issue #2 will fully extend buildContext to use these)
  orm: 'typeorm' | 'prisma' | 'mikroorm';
  database: 'postgresql' | 'mysql' | 'mongodb';
  auth: 'jwt' | 'session' | 'none';
  optionalModules: Array<'swagger' | 'redis' | 'bullmq' | 'websockets'>;
  includeExampleCode: boolean;
}

export interface ComposerOptions {
  /** Absolute path to where the project will be created */
  outputDir: string;
  context: ComposerContext;
  /** If true, log what would be written without writing anything */
  dryRun?: boolean;
  /** If true, skip the npm install step */
  skipInstall?: boolean;
  skipGit?: boolean;
  verbose?: boolean;
}

/**
 * The main compose function. Orchestrates the full file generation pipeline.
 * Phase 2 extends this with ORM, auth, and optional module layers.
 * PRD-02 §5.1–5.5
 */
export async function compose(options: ComposerOptions): Promise<void> {
  const {
    outputDir,
    context,
    dryRun = false,
    skipInstall = false,
    skipGit = false,
    verbose = false,
  } = options;

  // Step 1: Resolve source template paths
  const sourcePaths = resolveSourcePaths(context);

  // Step 2: Build the EJS context object
  const ejsContext = buildContext(context);

  if (dryRun) {
    console.log('\n[Dry Run] Context object:');
    console.log(JSON.stringify(ejsContext, null, 2));
    console.log('\n[Dry Run] Files that would be written:');
  }

  // Step 3 & 4: Walk, render, rename, and write files
  const s = dryRun ? null : spinner();
  s?.start('Generating project structure...');

  const cleanupOnInterrupt = () => {
    if (fs.existsSync(outputDir) && !dryRun) {
      fs.removeSync(outputDir);
    }
    console.log(chalk.yellow('\n\n⚠  Generation cancelled — cleaning up...'));
    process.exit(0);
  };

  process.on('SIGINT', cleanupOnInterrupt);

  try {
    if (!dryRun) {
      await fs.ensureDir(outputDir);
    }

    await renderFiles({
      sourcePaths,
      outputDir,
      context: ejsContext,
      dryRun,
      verbose,
    });

    s?.stop('Project structure generated.');

    // Step 5: Initialize git repository
    if (!skipGit && !dryRun) {
      const gitS = spinner();
      gitS.start('Initializing git repository...');
      await gitInit(outputDir);
      gitS.stop('Git repository initialized.');
    }

    // Step 5.5: Install dependencies
    if (!skipInstall && !dryRun) {
      const iS = spinner();
      iS.start(`Installing dependencies using ${context.packageManager}...`);
      await installDependencies(outputDir, context.packageManager);
      iS.stop('Dependencies installed.');
    }

    // Step 6: Print success message
    if (!dryRun) {
      const projectName = path.basename(outputDir);
      const lines: string[] = [
        `1. cd ${projectName}`,
        `2. cp env/.env.example .env  ← fill in your credentials`,
        `3. docker-compose up -d  ← start infrastructure`,
      ];

      if (!skipInstall) {
        lines.push(`4. ${context.packageManager} run start:dev`);
      } else {
        lines.push(`4. ${context.packageManager} install`);
        lines.push(`5. ${context.packageManager} run start:dev`);
      }

      lines.push('');
      lines.push(chalk.cyan('Resources:'));
      lines.push(`  API:     http://localhost:3000`);

      if (ejsContext.hasSwagger) {
        lines.push(`  Swagger: http://localhost:3000/api/docs  (non-production only)`);
      }

      lines.push('');
      lines.push(
        chalk.gray('📖 Read src/domain/README.md to understand the architecture boundaries.'),
      );

      note(lines.join('\n'), 'Next Steps');
      outro(chalk.green(`✔ Project "${context.projectName}" created successfully!`));
    } else {
      console.log('\n[Dry Run] Complete — no files were written.');
    }

    process.removeListener('SIGINT', cleanupOnInterrupt);
  } catch (error) {
    s?.stop('Generation failed.');

    // Cleanup on failure (but not in dry run)
    if (fs.existsSync(outputDir) && !dryRun) {
      fs.removeSync(outputDir);
    }

    process.removeListener('SIGINT', cleanupOnInterrupt);
    throw error;
  }
}
