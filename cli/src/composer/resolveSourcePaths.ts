import * as path from 'path';
import * as fs from 'fs-extra';
import { resolveTemplatesDir } from '../utils/pathUtils';
import { ComposerContext } from './compose';

/**
 * Resolves the ordered list of template source directories for a given architecture.
 *
 * Implements the 5-layer overlay system:
 * Layer 1: Shared templates
 * Layer 2: Architecture-specific base
 * Layer 3: ORM-specific overlay
 * Layer 4: Auth-specific overlay
 * Layer 5: Optional module overlays
 *
 * PRD-02 §5.1, §5.2
 */
export function resolveSourcePaths(context: ComposerContext): string[] {
  const templatesDir = resolveTemplatesDir();
  const paths: string[] = [];

  // Layer 1: Always included
  paths.push(path.join(templatesDir, 'shared'));

  // Layer 2: Architecture-specific base
  const archBase = path.join(templatesDir, context.architecture, 'base');
  if (fs.existsSync(archBase)) paths.push(archBase);

  // Layer 3: ORM-specific overlay
  const ormPath = path.join(templatesDir, context.architecture, 'orm', context.orm);
  if (fs.existsSync(ormPath)) paths.push(ormPath);

  // Layer 4: Auth-specific overlay
  if (context.auth !== 'none') {
    const authPath = path.join(templatesDir, context.architecture, 'auth', context.auth);
    if (fs.existsSync(authPath)) paths.push(authPath);
  }

  // Layer 5: Optional module overlays
  for (const mod of context.optionalModules || []) {
    const modPath = path.join(templatesDir, context.architecture, 'optional', mod);
    if (fs.existsSync(modPath)) paths.push(modPath);
  }

  return paths;
}
