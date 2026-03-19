import { resolveSourcePaths } from '../resolveSourcePaths';
import * as path from 'path';

describe('resolveSourcePaths()', () => {
  it('always includes the shared templates path', () => {
    const paths = resolveSourcePaths('hexagonal');
    expect(paths.some((p) => p.includes('shared'))).toBe(true);
  });

  it('returns the shared path for every architecture variant', () => {
    const architectures = ['hexagonal', 'ddd', 'modular'] as const;
    for (const arch of architectures) {
      const paths = resolveSourcePaths(arch);
      expect(paths.length).toBeGreaterThanOrEqual(1);
      expect(paths[0]).toContain('shared');
    }
  });

  it('shared path is always the first in the list (lowest priority, applied first)', () => {
    const paths = resolveSourcePaths('hexagonal');
    expect(path.basename(paths[0])).toBe('shared');
  });
});
