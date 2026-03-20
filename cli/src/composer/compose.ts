import { spinner, note, outro } from '@clack/prompts';
import * as path from 'path';
import * as fs from 'fs-extra';
import { buildContext } from './buildContext';
import { resolveSourcePaths } from './resolveSourcePaths';
import { renderFiles } from './renderFiles';
import { gitInit } from './gitInit';

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
  const { outputDir, context, dryRun = false, skipGit = false, verbose = false } = options;

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
