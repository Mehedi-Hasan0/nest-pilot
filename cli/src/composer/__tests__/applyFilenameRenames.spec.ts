import { applyFilenameRenames } from '../applyFilenameRenames';

describe('applyFilenameRenames()', () => {
  it('renames gitignore to .gitignore', () => {
    expect(applyFilenameRenames('gitignore')).toBe('.gitignore');
  });

  it('renames env.example to .env.example', () => {
    expect(applyFilenameRenames('env.example')).toBe('.env.example');
  });

  it('renames prettierrc to .prettierrc', () => {
    expect(applyFilenameRenames('prettierrc')).toBe('.prettierrc');
  });

  it('renames eslintrc.js to .eslintrc.js', () => {
    expect(applyFilenameRenames('eslintrc.js')).toBe('.eslintrc.js');
  });

  it('renames dockerignore to .dockerignore', () => {
    expect(applyFilenameRenames('dockerignore')).toBe('.dockerignore');
  });

  it('passes through non-renamed filenames unchanged', () => {
    expect(applyFilenameRenames('package.json')).toBe('package.json');
    expect(applyFilenameRenames('tsconfig.json')).toBe('tsconfig.json');
    expect(applyFilenameRenames('Dockerfile')).toBe('Dockerfile');
  });
});
