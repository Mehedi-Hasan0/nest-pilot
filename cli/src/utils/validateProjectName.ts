/**
 * Validates that a project name meets npm package name requirements.
 * Must be lowercase, start with a letter, and contain only letters, numbers, and hyphens.
 *
 * @returns An error message string if invalid, undefined if valid.
 */
export function validateProjectName(name: string): string | undefined {
  if (!name || !name.trim()) {
    return 'Project name is required.';
  }

  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    return 'Project name must be lowercase with hyphens only (e.g., my-app).';
  }

  // Reserved npm package names
  const reserved = [
    'node_modules',
    'favicon.ico',
    'test',
    'dist',
    'src',
    'public',
    'assets',
    'static',
  ];
  if (reserved.includes(name)) {
    return `"${name}" is a reserved name. Please choose another.`;
  }

  return undefined;
}
