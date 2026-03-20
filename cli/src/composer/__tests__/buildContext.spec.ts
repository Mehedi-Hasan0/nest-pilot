import { buildContext, toPascalCase, toConstantCase } from '../buildContext';
import { ComposerContext } from '../compose';

/** Minimal Phase 2 context to satisfy the full ComposerContext interface. */
const baseContext: ComposerContext = {
  projectName: 'my-app',
  architecture: 'hexagonal',
  packageManager: 'npm',
  orm: 'typeorm',
  database: 'postgresql',
  auth: 'jwt',
  optionalModules: [],
  includeExampleCode: true,
};

describe('buildContext()', () => {
  it('passes projectName through unchanged', () => {
    const ctx = buildContext(baseContext);
    expect(ctx.projectName).toBe('my-app');
  });

  it('derives projectNamePascalCase correctly', () => {
    const ctx = buildContext({ ...baseContext, projectName: 'my-cool-app' });
    expect(ctx.projectNamePascalCase).toBe('MyCoolApp');
  });

  it('derives projectNameConstant correctly', () => {
    const ctx = buildContext({ ...baseContext, projectName: 'my-cool-app' });
    expect(ctx.projectNameConstant).toBe('MY_COOL_APP');
  });

  it('includes the current year', () => {
    const ctx = buildContext({
      ...baseContext,
      architecture: 'modular',
      packageManager: 'pnpm',
    });
    expect(ctx.year).toBe(new Date().getFullYear().toString());
  });
});

describe('toPascalCase()', () => {
  it('converts single word', () => expect(toPascalCase('app')).toBe('App'));
  it('converts hyphenated name', () => expect(toPascalCase('my-app')).toBe('MyApp'));
  it('converts multi-part name', () => expect(toPascalCase('my-cool-app')).toBe('MyCoolApp'));
});

describe('toConstantCase()', () => {
  it('converts single word', () => expect(toConstantCase('app')).toBe('APP'));
  it('converts hyphenated name', () => expect(toConstantCase('my-app')).toBe('MY_APP'));
  it('converts multi-part name', () => expect(toConstantCase('my-cool-app')).toBe('MY_COOL_APP'));
});
