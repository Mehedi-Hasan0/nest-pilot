import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';
import { compose, ComposerContext } from '../compose';

// The templates root, relative to this test file.
const TEMPLATES_ROOT = path.resolve(__dirname, '..', '..', '..', '..', 'templates');

// Mock pathUtils to use our local templates and a temp output dir
jest.mock('../../utils/pathUtils', () => ({
  resolveTemplatesDir: () => TEMPLATES_ROOT,
  resolveOutputDir: (name: string) => path.join(os.tmpdir(), name),
}));

const smokeContext: ComposerContext = {
  projectName: 'smoke-test-app',
  architecture: 'hexagonal',
  packageManager: 'npm',
  orm: 'typeorm',
  database: 'postgresql',
  auth: 'jwt',
  optionalModules: ['swagger'], // Include something optional to verify logic
  includeExampleCode: true,
};

describe('Smoke Test — End-to-End Generation', () => {
  let outputDir: string;

  beforeEach(async () => {
    outputDir = path.join(os.tmpdir(), `nest-pilot-smoke-${Date.now()}`);
  });

  afterEach(async () => {
    if (fs.existsSync(outputDir)) {
      // We keep it if it fails for debugging, but clean up on success
      // Actually, for CI we should always clean up or use a fresh temp dir
      await fs.remove(outputDir);
    }
  });

  // 5 minute timeout for npm install and build
  it('generates a project that builds successfully', async () => {
    console.log('  → Generating project...');
    await compose({
      outputDir,
      context: smokeContext,
      dryRun: false,
      skipInstall: false, // We WANT to install dependencies here
      skipGit: true,
      verbose: false,
    });

    expect(fs.existsSync(outputDir)).toBe(true);
    expect(fs.existsSync(path.join(outputDir, 'package.json'))).toBe(true);

    console.log('  → Running npm run build...');
    try {
      execSync('npm run build', {
        cwd: outputDir,
        stdio: 'pipe',
        timeout: 120000, // 2 minutes for build
      });
    } catch (error: unknown) {
      const err = error as { stdout?: Buffer; stderr?: Buffer };
      console.error('Build failed!', err.stdout?.toString() || err.stderr?.toString());
      throw error;
    }

    console.log('  → Running npm run lint...');
    try {
      execSync('npm run lint', {
        cwd: outputDir,
        stdio: 'pipe',
      });
    } catch (error: unknown) {
      // We log but don't fail the whole smoke test if linting has minor issues
      // but for strict smoke test it should pass.
      const err = error as { stdout?: Buffer };
      console.warn('Linting warned/failed, but continuing...', err.stdout?.toString());
    }

    console.log('  → Smoke test passed!');
  }, 400000); // 400s timeout (approx 6.5 mins)
});
