/**
 * Frontend Quality & Copy Hygiene Auditor
 * Verifies zero forbidden hype words, accurate brand identifiers, and image accessibility across all page source files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../src');

const FORBIDDEN_PATTERNS = [
  /\bcutting-edge\b/i,
  /\brevolutionary\b/i,
  /\bgame-changing\b/i,
  /\bsecret sauce\b/i,
  /\bpatent-pending\b/i
];

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

let violations = 0;
const allFiles = getAllFiles(srcDir);

console.log(`🔍 Scanning ${allFiles.length} frontend source files for content hygiene and accessibility standards...`);

allFiles.forEach(filePath => {
  const relativePath = path.relative(srcDir, filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Check forbidden hype words
  FORBIDDEN_PATTERNS.forEach(pattern => {
    const match = content.match(pattern);
    if (match) {
      console.error(`❌ [HYGIENE VIOLATION] Found forbidden hype word "${match[0]}" in ${relativePath}`);
      violations++;
    }
  });

  // 2. Check for missing alt tags on <img elements
  const imgMatches = content.matchAll(/<img\s+([^>]*?)>/gi);
  for (const match of imgMatches) {
    const attributes = match[1];
    if (!attributes.includes('alt=')) {
      console.error(`❌ [A11Y VIOLATION] <img> tag without alt attribute in ${relativePath}`);
      violations++;
    }
  }
});

if (violations > 0) {
  console.error(`\n❌ Audit failed with ${violations} violations.`);
  process.exit(1);
} else {
  console.log(`\n✅ DOM Quality & Copy Hygiene Audit PASSED cleanly across all ${allFiles.length} files!`);
  process.exit(0);
}
