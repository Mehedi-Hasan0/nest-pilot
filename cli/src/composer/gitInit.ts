import { execSync } from 'child_process';
import chalk from 'chalk';

/**
 * Initializes a git repository in the output directory.
 *
 * PRD-00 6.2 Step 5:
 * - Runs `git init` in the output directory.
 * - If git is not available, prints a warning and continues — does NOT fail.
 */
export async function gitInit(outputDir: string): Promise<void> {
  try {
    execSync('git init', { cwd: outputDir, stdio: 'pipe' });
  } catch (_error) {
    console.warn(
      chalk.yellow(
        '⚠  git not found — skipping repository initialization. Install git and run `git init` manually.',
      ),
    );
  }
}
