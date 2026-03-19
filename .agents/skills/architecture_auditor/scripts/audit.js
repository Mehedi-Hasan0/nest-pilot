const fs = require("fs");
const path = require("path");

// Define architectural rules
// Format: { "path_segment": ["list of forbidden strings in imports"] }
const RULES = {
  "/domain/": [
    "@nestjs/",
    "/infrastructure/",
    "/application/",
    "from 'typeorm'",
    "from 'prisma'",
  ],
  "/application/": ["/infrastructure/"],
};

function auditFile(filePath) {
  const violations = [];
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, i) => {
      if (line.includes("import ") || line.includes("from ")) {
        for (const [segment, forbidden] of Object.entries(RULES)) {
          if (filePath.replace(/\\/g, "/").includes(segment)) {
            forbidden.forEach((fStr) => {
              if (line.includes(fStr)) {
                violations.push(`Line ${i + 1}: Illegal import '${fStr}'`);
              }
            });
          }
        }
      }
    });
  } catch (e) {
    console.error(`Error reading ${filePath}: ${e}`);
  }
  return violations;
}

function runAudit(targetDir) {
  console.log(`--- Starting Architecture Audit in: ${targetDir} ---`);
  let totalViolations = 0;

  function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (file !== "node_modules" && file !== ".git") {
          walk(fullPath);
        }
      } else if (file.endsWith(".ts") || file.endsWith(".ejs")) {
        const violations = auditFile(fullPath);
        if (violations.length > 0) {
          console.log(
            `\n[VIOLATION] in ${path.relative(targetDir, fullPath)}:`,
          );
          violations.forEach((v) => console.log(`  - ${v}`));
          totalViolations += violations.length;
        }
      }
    });
  }

  walk(targetDir);
  console.log(
    `\n--- Audit Finished. Total violations found: ${totalViolations} ---`,
  );
  return totalViolations;
}

const target = process.argv[2] || process.cwd();
const exitCode = runAudit(target);
process.exit(exitCode > 0 ? 1 : 0);
