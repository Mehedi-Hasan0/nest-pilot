/**
 * Maps source template filenames to their output filenames.
 *
 * npm strips leading dots when publishing, so we store these files
 * without dots in the templates/ directory and rename on copy.
 *
 * PRD-00 6.2 Step 4
 */
const RENAMES: Record<string, string> = {
  gitignore: '.gitignore',
  'env.example': '.env.example',
  prettierrc: '.prettierrc',
  'eslintrc.js': '.eslintrc.js',
  dockerignore: '.dockerignore',
  huskyrc: '.huskyrc',
};

/**
 * Returns the correct output filename for a given source filename.
 * If no rename is needed, returns the original filename unchanged.
 */
export function applyFilenameRenames(filename: string): string {
  return RENAMES[filename] ?? filename;
}
