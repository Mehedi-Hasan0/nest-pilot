import { spinner, note, outro } from '@clack/prompts';
import * as path from 'path';
import * as fs from 'fs-extra';
import { buildContext } from './buildContext';
import { resolveSourcePaths } from './resolveSourcePaths';
import { renderFiles } from './renderFiles';
import { gitInit } from './gitInit';

export interface ComposerContext {
  projectName: string;
  architecture: 'hexagonal' | 'ddd' | 'modular';
  packageManager: 'npm' | 'yarn' | 'pnpm';
}

export interface ComposerOptions {
  /** Absolute path to where the project will be created */
  outputDir: string;
  context: ComposerContext;
  /** If true, log what would be written without writing anything */
  dryRun?: boolean;
  skipGit?: boolean;
  verbose?: boolean;
}

/**
 * The main compose function. Orchestrates the full file generation pipeline
 * as defined in PRD-00 §6.2 (Steps 1–6).
 */
export async function compose(options: ComposerOptions): Promise<void> {
  const { outputDir, context, dryRun = false, skipGit = false, verbose = false } = options;

  // Step 1: Resolve source template paths
  const sourcePaths = resolveSourcePaths(context.architecture);

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

    // Step 6: Print success message
    if (!dryRun) {
      note(
        [
          `1. cd ${path.basename(outputDir)}`,
          `2. cp .env.example .env`,
          `3. docker-compose up -d`,
          `4. ${context.packageManager} install`,
          `5. ${context.packageManager} run start:dev`,
        ].join('\n'),
        'Next Steps',
      );
      outro(`✔ Project "${context.projectName}" created successfully!`);
    } else {
      console.log('\n[Dry Run] Complete — no files were written.');
    }
  } catch (error) {
    s?.stop('Generation failed.');
    throw error;
  }
}
