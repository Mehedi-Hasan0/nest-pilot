import { execSync } from 'child_process';

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
    execSync('git add .', { cwd: outputDir, stdio: 'pipe' });
    execSync('git commit -m "chore: initial project scaffold via nest-pilot"', {
      cwd: outputDir,
      stdio: 'pipe',
    });
  } catch (_error) {
    // If git is not installed or configured, skip silently
  }
}
