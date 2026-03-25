import { execSync } from 'child_process';

/**
 * Executes the package manager's installation command.
 * This is a best-effort step — if it fails, we log a warning but do not
 * fail the entire project generation.
 *
 * PRD-02 §5.4
 */
export async function installDependencies(
  outputDir: string,
  packageManager: 'npm' | 'yarn' | 'pnpm',
): Promise<void> {
  const commands: Record<string, string> = {
    npm: 'npm install',
    yarn: 'yarn install',
    pnpm: 'pnpm install',
  };

  const command = commands[packageManager];

  try {
    // We use execSync for simplicity here as it's a synchronous-looking async step in our pipeline.
    // stdio: 'pipe' ensures we don't clutter the CLI output unless there's an error.
    execSync(command, {
      cwd: outputDir,
      stdio: 'pipe',
      timeout: 300000, // 5 minutes timeout for slow networks
    });
  } catch (error) {
    // We do NOT re-throw. Generation is complete even if install fails.
    console.warn(
      `\n⚠️  Warning: Automatic dependency installation failed. Please run '${command}' manually in the project directory.`,
    );
  }
}
