import * as path from 'path';
import * as fs from 'fs-extra';
import { resolveTemplatesDir } from '../utils/pathUtils';

/**
 * Resolves the ordered list of template source directories for a given architecture.
 *
 * In Phase 0, only the shared template directory is returned.
 * Subsequent phases will return [shared/, hexagonal/base/, hexagonal/orm/typeorm/, ...]
 *
 * PRD-00 6.2 Step 1
 */
export function resolveSourcePaths(architecture: 'hexagonal' | 'ddd' | 'modular'): string[] {
  const templatesDir = resolveTemplatesDir();
  const sharedPath = path.join(templatesDir, 'shared');

  // Phase 0: only shared templates are generated.
  // Architecture-specific paths will be layered here in Phase 2+.
  const paths: string[] = [sharedPath];

  // Architecture-specific placeholder — no templates exist yet in Phase 0.
  // This is intentionally a no-op: the directory is reserved but empty.
  const architecturePath = path.join(templatesDir, architecture);
  if (fs.existsSync(architecturePath)) {
    paths.push(architecturePath);
  }

  return paths;
}
