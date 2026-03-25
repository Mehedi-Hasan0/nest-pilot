import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { compose, ComposerContext } from '../compose';

// The templates root, relative to this test file's location in the monorepo.
// Path: __tests__/ -> composer/ -> src/ -> cli/ -> nest-pilot/
// That is 4 levels up from __dirname, then into 'templates/'.
const TEMPLATES_ROOT = path.resolve(__dirname, '..', '..', '..', '..', 'templates');

// Override the resolveTemplatesDir util so compose() finds templates during tests
jest.mock('../../utils/pathUtils', () => ({
  resolveTemplatesDir: () => TEMPLATES_ROOT,
  resolveOutputDir: (name: string) => path.join(os.tmpdir(), name),
}));

/** Minimal default Phase 2 context — keeps existing tests passing. */
const defaultContext: ComposerContext = {
  projectName: 'test-project',
  architecture: 'hexagonal',
  packageManager: 'npm',
  orm: 'typeorm',
  database: 'postgresql',
  auth: 'jwt',
  optionalModules: [],
  includeExampleCode: true,
};

describe('compose() — integration test', () => {
  let outputDir: string;

  beforeEach(async () => {
    outputDir = path.join(os.tmpdir(), `nest-pilot-test-${Date.now()}`);
  });

  afterEach(async () => {
    if (fs.existsSync(outputDir)) {
      await fs.remove(outputDir);
    }
  });

  it('creates the output directory', async () => {
    await compose({
      outputDir,
      context: defaultContext,
      dryRun: false,
      skipInstall: true,
      skipGit: true,
      verbose: false,
    });
    expect(fs.existsSync(outputDir)).toBe(true);
  });

  it('generates the .gitignore file (renamed from gitignore)', async () => {
    await compose({
      outputDir,
      context: defaultContext,
      dryRun: false,
      skipInstall: true,
      skipGit: true,
      verbose: false,
    });
    const gitignorePath = path.join(outputDir, 'git', '.gitignore');
    // Could also be at root level depending on template structure
    const gitignoreAlternate = path.join(outputDir, '.gitignore');
    expect(fs.existsSync(gitignorePath) || fs.existsSync(gitignoreAlternate)).toBe(true);
  });

  it('generates the .env.example file (renamed from env.example)', async () => {
    await compose({
      outputDir,
      context: defaultContext,
      dryRun: false,
      skipInstall: true,
      skipGit: true,
      verbose: false,
    });
    // env.example is in templates/shared/env/ → output dir will be env/.env.example
    const envDir = path.join(outputDir, 'env');
    const envPath = path.join(envDir, '.env.example');
    expect(fs.existsSync(envPath)).toBe(true);
  });

  it('removes .ejs extension from output files', async () => {
    await compose({
      outputDir,
      context: defaultContext,
      dryRun: false,
      skipInstall: true,
      skipGit: true,
      verbose: false,
    });
    const allFiles = await getAllFiles(outputDir);
    const ejsFiles = allFiles.filter((f) => f.endsWith('.ejs'));
    expect(ejsFiles).toHaveLength(0);
  });

  it('interpolates projectName in env/.env.example', async () => {
    await compose({
      outputDir,
      context: { ...defaultContext, projectName: 'my-test-app' },
      dryRun: false,
      skipInstall: true,
      skipGit: true,
      verbose: false,
    });
    const envPath = path.join(outputDir, 'env', '.env.example');
    const content = await fs.readFile(envPath, 'utf-8');
    expect(content).toContain('APP_NAME=my-test-app');
    expect(content).toContain('DATABASE_NAME=my-test-app_dev');
  });

  it('does not write any files in dry run mode', async () => {
    await compose({
      outputDir,
      context: defaultContext,
      dryRun: true,
      skipInstall: true,
      skipGit: true,
      verbose: false,
    });
    expect(fs.existsSync(outputDir)).toBe(false);
  });
});

async function getAllFiles(dir: string): Promise<string[]> {
  const results: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      results.push(...(await getAllFiles(full)));
    } else {
      results.push(full);
    }
  }
  return results;
}
