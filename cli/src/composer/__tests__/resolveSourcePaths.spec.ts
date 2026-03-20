import { resolveSourcePaths } from '../resolveSourcePaths';
import * as path from 'path';
import * as fs from 'fs-extra';
import { ComposerContext } from '../compose';

jest.mock('fs-extra', () => ({
  existsSync: jest.fn(),
}));

const mockContext: ComposerContext = {
  projectName: 'test',
  architecture: 'hexagonal',
  packageManager: 'npm',
  orm: 'typeorm',
  database: 'postgresql',
  auth: 'jwt',
  optionalModules: ['redis', 'swagger'],
  includeExampleCode: true,
};

describe('resolveSourcePaths()', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('always includes the shared templates path as the first element', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false); // No other layers exist

    const paths = resolveSourcePaths(mockContext);
    expect(paths).toHaveLength(1);
    expect(path.basename(paths[0])).toBe('shared');
  });

  it('layers architecture base, ORM, Auth, and Optional modules in the correct order', () => {
    // Treat all paths as existing
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    const paths = resolveSourcePaths(mockContext);

    // Total layers for this context:
    // 1 (shared) + 1 (base) + 1 (orm) + 1 (auth) + 2 (optional) = 6 layers
    expect(paths).toHaveLength(6);

    // Verify correct order (overlay pattern)
    expect(paths[0]).toContain('shared');
    expect(paths[1]).toContain(path.normalize('hexagonal/base'));
    expect(paths[2]).toContain(path.normalize('hexagonal/orm/typeorm'));
    expect(paths[3]).toContain(path.normalize('hexagonal/auth/jwt'));
    expect(paths[4]).toContain(path.normalize('hexagonal/optional/redis'));
    expect(paths[5]).toContain(path.normalize('hexagonal/optional/swagger'));
  });

  it('does not include layers that do not exist', () => {
    (fs.existsSync as jest.Mock).mockImplementation((p: string) => {
      // Only pretend base and auth exist
      return p.includes('base') || p.includes('auth');
    });

    const paths = resolveSourcePaths(mockContext);

    expect(paths).toHaveLength(3);
    expect(paths[0]).toContain('shared');
    expect(paths[1]).toContain(path.normalize('hexagonal/base'));
    expect(paths[2]).toContain(path.normalize('hexagonal/auth/jwt'));
  });
});
