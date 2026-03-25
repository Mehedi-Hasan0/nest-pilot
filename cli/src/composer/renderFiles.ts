import * as path from 'path';
import * as fs from 'fs-extra';
import * as ejs from 'ejs';
import { applyFilenameRenames } from './applyFilenameRenames';

export interface RenderFilesOptions {
  sourcePaths: string[];
  outputDir: string;
  context: Record<string, unknown>;
  dryRun: boolean;
  verbose: boolean;
}

/**
 * Walks the resolved source paths, renders EJS templates, and writes to outputDir.
 *
 * PRD-00 6.2 Step 3:
 * - .ejs files → render through EJS → write without .ejs extension
 * - Other files → copy unchanged
 * - Directory structure is preserved relative to source root
 *
 * PRD-00 6.2 Step 4:
 * - Apply filename renames (gitignore → .gitignore, etc.)
 */
export async function renderFiles(options: RenderFilesOptions): Promise<void> {
  const { sourcePaths, outputDir, context, dryRun, verbose } = options;

  for (const sourcePath of sourcePaths) {
    if (!fs.existsSync(sourcePath)) continue;
    await walkAndRender(sourcePath, sourcePath, outputDir, context, dryRun, verbose);
  }
}

async function walkAndRender(
  rootSourcePath: string,
  currentPath: string,
  outputDir: string,
  context: Record<string, unknown>,
  dryRun: boolean,
  verbose: boolean,
): Promise<void> {
  const stat = await fs.stat(currentPath);

  if (stat.isDirectory()) {
    const entries = await fs.readdir(currentPath);
    for (const entry of entries) {
      if (entry === 'node_modules' || entry === '.git') {
        continue;
      }

      await walkAndRender(
        rootSourcePath,
        path.join(currentPath, entry),
        outputDir,
        context,
        dryRun,
        verbose,
      );
    }
    return;
  }

  // It's a file
  const relativePath = path.relative(rootSourcePath, currentPath);
  const parts = relativePath.split(path.sep);

  // Apply renames to each path segment (e.g., rename "gitignore" directory or file)
  const renamedParts = parts.map((part, index) => {
    const isLastPart = index === parts.length - 1;
    if (!isLastPart) return part;

    // Strip .ejs extension for output
    const withoutEjs = part.endsWith('.ejs') ? part.slice(0, -4) : part;
    return applyFilenameRenames(withoutEjs);
  });

  const outputRelativePath = path.join(...renamedParts);
  const outputFilePath = path.join(outputDir, outputRelativePath);

  if (verbose) {
    console.log(`  ${path.relative(process.cwd(), currentPath)} → ${outputFilePath}`);
  }

  if (dryRun) return;

  await fs.ensureDir(path.dirname(outputFilePath));

  if (currentPath.endsWith('.ejs')) {
    // Render EJS template
    try {
      const rendered = await ejs.renderFile(currentPath, context as ejs.Data, { async: true });
      await fs.writeFile(outputFilePath, rendered, 'utf-8');
    } catch (error: any) {
      const message = `Template error in "${relativePath}": ${error.message}`;
      if (verbose) {
        console.error(message, error);
      } else {
        console.error(
          `${message}\nPlease report this at https://github.com/Mehedi-Hasan0/nest-pilot/issues`,
        );
      }
      throw error;
    }
  } else {
    // Copy unchanged
    await fs.copy(currentPath, outputFilePath);
  }
}
