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
    const gitignorePath = path.join(outputDir, '.gitignore');
    expect(fs.existsSync(gitignorePath)).toBe(true);
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
    const envPath = path.join(outputDir, '.env.example');
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
    const envPath = path.join(outputDir, '.env.example');
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

  describe('ORM specific generation', () => {
    it('generates Prisma schema and service when Prisma is selected', async () => {
      await compose({
        outputDir,
        context: { ...defaultContext, orm: 'prisma' },
        dryRun: false,
        skipInstall: true,
        skipGit: true,
        verbose: false,
      });

      expect(fs.existsSync(path.join(outputDir, 'prisma', 'schema.prisma'))).toBe(true);
      expect(fs.existsSync(path.join(outputDir, 'src/infrastructure/persistence/prisma'))).toBe(
        true,
      );
      // Should NOT have TypeORM files
      expect(fs.existsSync(path.join(outputDir, 'src/infrastructure/persistence/typeorm'))).toBe(
        false,
      );
    });
  });

  describe('Auth specific generation', () => {
    it('does not generate auth directory when auth is "none"', async () => {
      await compose({
        outputDir,
        context: { ...defaultContext, auth: 'none' },
        dryRun: false,
        skipInstall: true,
        skipGit: true,
        verbose: false,
      });

      expect(fs.existsSync(path.join(outputDir, 'src/infrastructure/auth'))).toBe(false);
    });
  });

  describe('Optional modules generation', () => {
    it('generates all optional components when all are selected', async () => {
      await compose({
        outputDir,
        context: {
          ...defaultContext,
          optionalModules: ['swagger', 'redis', 'bullmq', 'websockets'],
        },
        dryRun: false,
        skipInstall: true,
        skipGit: true,
        verbose: false,
      });

      // Swagger
      const mainContent = await fs.readFile(path.join(outputDir, 'src/main.ts'), 'utf-8');
      expect(mainContent).toContain('setupSwagger');

      // Redis
      expect(fs.existsSync(path.join(outputDir, 'src/infrastructure/cache'))).toBe(true);

      // BullMQ
      expect(fs.existsSync(path.join(outputDir, 'src/infrastructure/jobs'))).toBe(true);

      // WebSockets
      expect(fs.existsSync(path.join(outputDir, 'src/infrastructure/gateways'))).toBe(true);

      // Verify no <%= tags remain in ANY file
      const allFiles = await getAllFiles(outputDir);
      for (const file of allFiles) {
        const content = await fs.readFile(file, 'utf-8');
        expect(content).not.toContain('<%=');
      }
    });
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
