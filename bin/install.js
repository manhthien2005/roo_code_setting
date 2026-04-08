#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ─── Colors ───
const green = (t) => `\x1b[32m${t}\x1b[0m`;
const yellow = (t) => `\x1b[33m${t}\x1b[0m`;
const cyan = (t) => `\x1b[36m${t}\x1b[0m`;
const bold = (t) => `\x1b[1m${t}\x1b[0m`;
const dim = (t) => `\x1b[2m${t}\x1b[0m`;

// ─── Paths ───
const targetDir = process.cwd();
const templateDir = path.join(__dirname, '..', 'templates');

console.log('');
console.log(bold('🚀 RooCode Optimized Settings Installer'));
console.log(dim('   Installs rules, modes, skills & .rooignore into your project'));
console.log('');

// ─── File map: source (in templates/) → destination (in project) ───
const fileMap = [
  // .roomodes
  { src: '.roomodes', dest: '.roomodes' },
  // .rooignore
  { src: '.rooignore', dest: '.rooignore' },
  // Global rules
  { src: '.roo/rules/core-principles.md', dest: '.roo/rules/core-principles.md' },
  { src: '.roo/rules/development-workflow.md', dest: '.roo/rules/development-workflow.md' },
  { src: '.roo/rules/error-recovery.md', dest: '.roo/rules/error-recovery.md' },
  { src: '.roo/rules/git-workflow.md', dest: '.roo/rules/git-workflow.md' },
  { src: '.roo/rules/mode-collaboration.md', dest: '.roo/rules/mode-collaboration.md' },
  { src: '.roo/rules/security-first.md', dest: '.roo/rules/security-first.md' },
  { src: '.roo/rules/skill-awareness.md', dest: '.roo/rules/skill-awareness.md' },
  // Mode-specific rules
  { src: '.roo/rules-architect/planning-discipline.md', dest: '.roo/rules-architect/planning-discipline.md' },
  { src: '.roo/rules-code/coding-standards.md', dest: '.roo/rules-code/coding-standards.md' },
  { src: '.roo/rules-code/code-review-before-done.md', dest: '.roo/rules-code/code-review-before-done.md' },
  { src: '.roo/rules-debug/systematic-debugging.md', dest: '.roo/rules-debug/systematic-debugging.md' },
  // Skills
  { src: '.roo/skills/context-checkpoint/SKILL.md', dest: '.roo/skills/context-checkpoint/SKILL.md' },
  // Settings (reference copy)
  { src: 'roo-code-settings-optimized.json', dest: 'roo-code-settings-optimized.json' },
];

let created = 0;
let skipped = 0;
let updated = 0;

const args = process.argv.slice(2);
const forceMode = args.includes('--force') || args.includes('-f');

if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: npx roo-code-setting [options]');
  console.log('');
  console.log('Options:');
  console.log('  --force, -f    Overwrite existing files');
  console.log('  --help, -h     Show this help message');
  console.log('');
  process.exit(0);
}

for (const { src, dest } of fileMap) {
  const srcPath = path.join(templateDir, src);
  const destPath = path.join(targetDir, dest);

  if (!fs.existsSync(srcPath)) {
    console.log(yellow(`  ⚠ Template missing: ${src}`));
    continue;
  }

  // Create directories
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Check if file exists
  if (fs.existsSync(destPath) && !forceMode) {
    console.log(dim(`  ○ Exists (skip): ${dest}`));
    skipped++;
    continue;
  }

  const action = fs.existsSync(destPath) ? 'overwrite' : 'create';
  fs.copyFileSync(srcPath, destPath);

  if (action === 'create') {
    console.log(green(`  ✓ Created: ${dest}`));
    created++;
  } else {
    console.log(yellow(`  ↻ Updated: ${dest}`));
    updated++;
  }
}

console.log('');
console.log(bold('─── Summary ───'));
console.log(green(`  Created: ${created}`));
if (updated > 0) console.log(yellow(`  Updated: ${updated}`));
if (skipped > 0) console.log(dim(`  Skipped: ${skipped} (use --force to overwrite)`));
console.log('');
console.log(bold('📋 Next steps:'));
console.log(cyan('  1. Import settings: RooCode → ⚙️ → Import → roo-code-settings-optimized.json'));
console.log(cyan('  2. Add your API key in RooCode settings'));
console.log(cyan('  3. Customize .rooignore for your project'));
console.log(cyan('  4. Edit .roomodes if you need project-specific mode tweaks'));
console.log('');
console.log(green(bold('✅ RooCode optimization installed successfully!')));
console.log('');
