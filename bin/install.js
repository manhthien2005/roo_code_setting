#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// ─── Colors ───
const red = (t) => `\x1b[31m${t}\x1b[0m`;
const green = (t) => `\x1b[32m${t}\x1b[0m`;
const yellow = (t) => `\x1b[33m${t}\x1b[0m`;
const cyan = (t) => `\x1b[36m${t}\x1b[0m`;
const bold = (t) => `\x1b[1m${t}\x1b[0m`;
const dim = (t) => `\x1b[2m${t}\x1b[0m`;

// ─── Paths ───
const targetDir = process.cwd();
const templateDir = path.join(__dirname, '..', 'templates');

// ─── Args ───
const args = process.argv.slice(2);
const forceMode = args.includes('--force') || args.includes('-f');
const globalSkillsMode = args.includes('--global-skills');
const mcpMode = args.includes('--mcp');

// ─── Help ───
if (args.includes('--help') || args.includes('-h')) {
  console.log('');
  console.log(bold('Usage: npx roo-code-setting [options]'));
  console.log('');
  console.log('Options:');
  console.log('  --force, -f        Overwrite existing files');
  console.log('  --global-skills    Install 26 curated global skills to ~/.roo/');
  console.log('  --mcp              Install MCP server config (.roo/mcp.json)');
  console.log('  --help, -h         Show this help message');
  console.log('');
  console.log('Examples:');
  console.log(dim('  npx roo-code-setting                          # Install project settings only'));
  console.log(dim('  npx roo-code-setting --global-skills           # Install project + global skills'));
  console.log(dim('  npx roo-code-setting --global-skills --mcp     # Full install with MCP config'));
  console.log(dim('  npx roo-code-setting --global-skills --force   # Overwrite all existing files'));
  console.log('');
  process.exit(0);
}

// ─── Global Skill Map (26 skills across 11 buckets) ───
const globalSkillMap = {
  'skills': [
    'planning-with-files', 'concise-planning', 'lint-and-validate',
    'systematic-debugging', 'verification-before-completion', 'windows-shell-reliability'
  ],
  'skills-skill-writer': ['writing-skills', 'skill-check'],
  'skills-merge-resolver': ['differential-review', 'finishing-a-development-branch'],
  'skills-documentation-writer': ['api-documentation', 'readme', 'documentation-templates'],
  'skills-user-story-creator': ['product-manager', 'create-issue-gate'],
  'skills-project-research': ['wiki-qa', 'wiki-researcher'],
  'skills-security-review': ['cc-skill-security-review'],
  'skills-jest-test-engineer': ['testing-patterns', 'test-driven-development'],
  'skills-devops': ['devops-troubleshooter', 'cicd-automation-workflow-automate', 'secrets-management'],
  'skills-coding-teacher': ['tutorial-engineer'],
  'skills-google-genai-developer': ['gemini-api-dev', 'ai-agent-development']
};

// ─── Helpers ───

/**
 * Recursively copy a directory from src to dest.
 * @param {string} src - Source directory path
 * @param {string} dest - Destination directory path
 */
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Recursively remove a directory (rm -rf equivalent).
 * @param {string} dirPath - Directory to remove
 */
function removeDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  // Node 14.14+ supports fs.rmSync
  if (typeof fs.rmSync === 'function') {
    fs.rmSync(dirPath, { recursive: true, force: true });
  } else {
    // Fallback for older Node
    fs.rmdirSync(dirPath, { recursive: true });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 1: Project Skills Install
// ═══════════════════════════════════════════════════════════════════════════════

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
  { src: '.roo/rules/performance-optimization.md', dest: '.roo/rules/performance-optimization.md' },
  { src: '.roo/rules/reasoning-optimization.md', dest: '.roo/rules/reasoning-optimization.md' },
  // Mode-specific rules
  { src: '.roo/rules-architect/planning-discipline.md', dest: '.roo/rules-architect/planning-discipline.md' },
  { src: '.roo/rules-code/coding-standards.md', dest: '.roo/rules-code/coding-standards.md' },
  { src: '.roo/rules-code/code-review-before-done.md', dest: '.roo/rules-code/code-review-before-done.md' },
  { src: '.roo/rules-debug/systematic-debugging.md', dest: '.roo/rules-debug/systematic-debugging.md' },
  // Skills
  { src: '.roo/skills/context-checkpoint/SKILL.md', dest: '.roo/skills/context-checkpoint/SKILL.md' },
  { src: '.roo/skills/context-budget/SKILL.md', dest: '.roo/skills/context-budget/SKILL.md' },
  { src: '.roo/skills/coding-standards/SKILL.md', dest: '.roo/skills/coding-standards/SKILL.md' },
  { src: '.roo/skills/search-first/SKILL.md', dest: '.roo/skills/search-first/SKILL.md' },
  { src: '.roo/skills/project-context/SKILL.md', dest: '.roo/skills/project-context/SKILL.md' },
  { src: '.roo/skills/continuous-learning/SKILL.md', dest: '.roo/skills/continuous-learning/SKILL.md' },
  { src: '.roo/skills/workspace-audit/SKILL.md', dest: '.roo/skills/workspace-audit/SKILL.md' },
  // Learnings
  { src: '.roo/learnings/patterns.md', dest: '.roo/learnings/patterns.md' },
  // Skills registry
  { src: '.roo/skills-registry.md', dest: '.roo/skills-registry.md' },
  // Settings (reference copy)
  { src: 'roo-code-settings-optimized.json', dest: 'roo-code-settings-optimized.json' },
];

let created = 0;
let skipped = 0;
let updated = 0;

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

// ─── Project Summary ───
console.log('');
console.log(bold('─── Project Settings Summary ───'));
console.log(green(`  Created: ${created}`));
if (updated > 0) console.log(yellow(`  Updated: ${updated}`));
if (skipped > 0) console.log(dim(`  Skipped: ${skipped} (use --force to overwrite)`));

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 2: Global Skills Install (only with --global-skills)
// ═══════════════════════════════════════════════════════════════════════════════

let globalInstalled = 0;
let globalMissing = 0;
let globalSkipped = 0;

if (globalSkillsMode) {
  const globalSkillsTemplateDir = path.join(__dirname, '..', 'templates', 'global-skills');
  const homeRooDir = path.join(os.homedir(), '.roo');

  console.log('');
  console.log(bold('🌐 Installing Global Skills'));
  console.log(dim('   Source: templates/global-skills/ (pre-customized)'));
  console.log(dim(`   Target: ${homeRooDir}`));
  console.log('');

  if (!fs.existsSync(globalSkillsTemplateDir)) {
    console.log(red('  ✗ Error: templates/global-skills/ directory not found.'));
    console.log(yellow('  Package may be corrupted. Try reinstalling.'));
    process.exit(1);
  }

  // Install each skill bucket from templates
  for (const [bucket, skillNames] of Object.entries(globalSkillMap)) {
    const srcBucketDir = path.join(globalSkillsTemplateDir, bucket);
    const destBucketDir = path.join(homeRooDir, bucket);

    for (const skillName of skillNames) {
      const srcSkillDir = path.join(srcBucketDir, skillName);
      const destSkillDir = path.join(destBucketDir, skillName);

      if (!fs.existsSync(srcSkillDir)) {
        console.log(red(`  ✗ Missing template: [${bucket}] ${skillName}`));
        globalMissing++;
        continue;
      }

      if (fs.existsSync(destSkillDir) && !forceMode) {
        console.log(dim(`  ○ Exists (skip): [${bucket}] ${skillName}`));
        globalSkipped++;
        continue;
      }

      try {
        if (fs.existsSync(destSkillDir)) {
          removeDirSync(destSkillDir);
        }
        copyDirSync(srcSkillDir, destSkillDir);
        console.log(green(`  ✓ Installed: [${bucket}] ${skillName}`));
        globalInstalled++;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(red(`  ✗ Failed: [${bucket}] ${skillName} — ${message}`));
        globalMissing++;
      }
    }
  }

  // ─── Global Skills Summary ───
  const totalSkills = Object.values(globalSkillMap).reduce((sum, arr) => sum + arr.length, 0);
  console.log('');
  console.log(bold('─── Global Skills Summary ───'));
  console.log(green(`  Installed: ${globalInstalled} / ${totalSkills} skills`));
  if (globalSkipped > 0) console.log(dim(`  Skipped:   ${globalSkipped} (use --force to overwrite)`));
  if (globalMissing > 0) console.log(red(`  Missing:   ${globalMissing} skills`));
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 3: MCP Config Install (only with --mcp)
// ═══════════════════════════════════════════════════════════════════════════════

if (mcpMode) {
  console.log('');
  console.log(bold('🔌 Installing MCP Config'));
  console.log('');

  const mcpTemplatePath = path.join(__dirname, '..', 'templates', 'mcp.json');
  const mcpDestPath = path.join(targetDir, '.roo', 'mcp.json');

  if (!fs.existsSync(mcpTemplatePath)) {
    console.log(red('  ✗ Error: templates/mcp.json not found.'));
    console.log(yellow('  Package may be corrupted. Try reinstalling.'));
    process.exit(1);
  }

  const mcpDestDir = path.dirname(mcpDestPath);
  if (!fs.existsSync(mcpDestDir)) {
    fs.mkdirSync(mcpDestDir, { recursive: true });
  }

  if (fs.existsSync(mcpDestPath) && !forceMode) {
    console.log(dim('  ○ Exists (skip): .roo/mcp.json'));
  } else {
    fs.copyFileSync(mcpTemplatePath, mcpDestPath);
    console.log(green('  ✓ Created: .roo/mcp.json'));
    console.log(yellow('  ⚠ Configure environment variables:'));
    console.log(yellow('    GITHUB_TOKEN      — GitHub Personal Access Token'));
    console.log(yellow('    DATABASE_URL      — PostgreSQL connection string'));
    console.log(yellow('    WORKSPACE_PATH    — Filesystem access path'));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FINAL: Next Steps
// ═══════════════════════════════════════════════════════════════════════════════

console.log('');
console.log(bold('📋 Next steps:'));
console.log(cyan('  1. Import settings: RooCode → ⚙️ → Import → roo-code-settings-optimized.json'));
console.log(cyan('  2. Add your API key in RooCode settings'));
console.log(cyan('  3. Customize .rooignore for your project'));
console.log(cyan('  4. Edit .roomodes if you need project-specific mode tweaks'));
if (!globalSkillsMode) {
  console.log(cyan('  5. Run with --global-skills to install 26 curated skills globally'));
}
if (!mcpMode) {
  console.log(cyan(`  ${globalSkillsMode ? '5' : '6'}. Run with --mcp to install MCP server config`));
}
if (mcpMode) {
  console.log(cyan(`  ${globalSkillsMode ? '5' : '6'}. Set env vars: GITHUB_TOKEN, DATABASE_URL, WORKSPACE_PATH`));
}
console.log('');
console.log(green(bold('✅ RooCode optimization installed successfully!')));
console.log('');
