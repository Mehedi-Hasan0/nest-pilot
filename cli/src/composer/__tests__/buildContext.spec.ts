import { buildContext, toPascalCase, toConstantCase } from '../buildContext';

describe('buildContext()', () => {
  it('passes projectName through unchanged', () => {
    const ctx = buildContext({
      projectName: 'my-app',
      architecture: 'hexagonal',
      packageManager: 'npm',
    });
    expect(ctx.projectName).toBe('my-app');
  });

  it('derives projectNamePascalCase correctly', () => {
    const ctx = buildContext({
      projectName: 'my-cool-app',
      architecture: 'hexagonal',
      packageManager: 'npm',
    });
    expect(ctx.projectNamePascalCase).toBe('MyCoolApp');
  });

  it('derives projectNameConstant correctly', () => {
    const ctx = buildContext({
      projectName: 'my-cool-app',
      architecture: 'hexagonal',
      packageManager: 'npm',
    });
    expect(ctx.projectNameConstant).toBe('MY_COOL_APP');
  });

  it('includes the current year', () => {
    const ctx = buildContext({
      projectName: 'app',
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
