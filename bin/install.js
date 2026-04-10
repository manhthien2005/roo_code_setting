#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { copyDirSync, removeDirSync, GLOBAL_SKILL_MAP, findOrphanSkills, cleanOrphanSkills } = require('../lib/installer');

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
const dryRunMode = args.includes('--dry-run');

// ─── Version ───
if (args.includes('--version') || args.includes('-v')) {
  const pkg = require(path.join(__dirname, '..', 'package.json'));
  console.log(pkg.version);
  process.exit(0);
}

// ─── Help ───
if (args.includes('--help') || args.includes('-h')) {
  console.log('');
  console.log(bold('Usage: npx roo-code-setting [options]'));
  console.log('');
  console.log('Options:');
  console.log('  --force, -f        Overwrite existing files');
  console.log('  --global-skills    Install 26 curated global skills to ~/.roo/');
  console.log('  --mcp              Install MCP server config (.roo/mcp.json)');
  console.log('  --clean            Detect orphan global skills (use with --force to remove)');
  console.log('  --dry-run          Preview changes without writing files');
  console.log('  --version, -v      Print version number');
  console.log('  --help, -h         Show this help message');
  console.log('');
  console.log('Examples:');
  console.log(dim('  npx roo-code-setting                          # Install project settings only'));
  console.log(dim('  npx roo-code-setting --global-skills           # Install project + global skills'));
  console.log(dim('  npx roo-code-setting --global-skills --mcp     # Full install with MCP config'));
  console.log(dim('  npx roo-code-setting --global-skills --force   # Overwrite all existing files'));
  console.log(dim('  npx roo-code-setting --clean                   # List orphan skills'));
  console.log(dim('  npx roo-code-setting --clean --force           # Remove orphan skills'));
  console.log(dim('  npx roo-code-setting --dry-run                 # Preview what would be installed'));
  console.log('');
  process.exit(0);
}

// ─── Clean Mode ───
const cleanMode = args.includes('--clean');

if (cleanMode) {
  const homeRooDir = path.join(os.homedir(), '.roo');

  console.log('');
  console.log(bold('🧹 Cleaning orphan skills'));
  console.log('');

  const orphans = findOrphanSkills(homeRooDir);

  if (orphans.length === 0) {
    console.log(green('  No orphan skills found.'));
    console.log('');
    process.exit(0);
  }

  for (var i = 0; i < orphans.length; i++) {
    console.log(yellow('  Would remove: ' + orphans[i]));
  }
  console.log('');

  if (forceMode) {
    var result = cleanOrphanSkills(homeRooDir, { force: true });
    console.log(green('  Removed ' + result.removed.length + ' orphan skill(s).'));
  } else {
    console.log(dim('  Use --clean --force to actually remove'));
  }

  console.log('');
  process.exit(0);
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
  { src: '.roo/rules/code-graph-awareness.md', dest: '.roo/rules/code-graph-awareness.md' },
  // Mode-specific rules
  { src: '.roo/rules-architect/planning-discipline.md', dest: '.roo/rules-architect/planning-discipline.md' },
  { src: '.roo/rules-architect/graph-assisted-architecture.md', dest: '.roo/rules-architect/graph-assisted-architecture.md' },
  { src: '.roo/rules-code/coding-standards.md', dest: '.roo/rules-code/coding-standards.md' },
  { src: '.roo/rules-code/code-review-before-done.md', dest: '.roo/rules-code/code-review-before-done.md' },
  { src: '.roo/rules-code/graph-assisted-coding.md', dest: '.roo/rules-code/graph-assisted-coding.md' },
  { src: '.roo/rules-debug/systematic-debugging.md', dest: '.roo/rules-debug/systematic-debugging.md' },
  { src: '.roo/rules-debug/graph-assisted-debugging.md', dest: '.roo/rules-debug/graph-assisted-debugging.md' },
  { src: '.roo/rules-security-review/security-checklist.md', dest: '.roo/rules-security-review/security-checklist.md' },
  { src: '.roo/rules-testing/testing-standards.md', dest: '.roo/rules-testing/testing-standards.md' },
  { src: '.roo/rules-code-review/review-discipline.md', dest: '.roo/rules-code-review/review-discipline.md' },
  { src: '.roo/rules-code-review/graph-assisted-review.md', dest: '.roo/rules-code-review/graph-assisted-review.md' },
  { src: '.roo/rules-orchestrator/orchestration-protocol.md', dest: '.roo/rules-orchestrator/orchestration-protocol.md' },
  { src: '.roo/rules-devops/operations-discipline.md', dest: '.roo/rules-devops/operations-discipline.md' },
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
  try {
    const srcPath = path.join(templateDir, src);
    const destPath = path.join(targetDir, dest);

    if (!fs.existsSync(srcPath)) {
      console.log(yellow(`  ⚠ Template missing: ${src}`));
      continue;
    }

    // Create directories
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      if (!dryRunMode) {
        fs.mkdirSync(destDir, { recursive: true });
      }
    }

    // Check if file exists
    if (fs.existsSync(destPath) && !forceMode) {
      console.log(dim(`  ○ Exists (skip): ${dest}`));
      skipped++;
      continue;
    }

    const action = fs.existsSync(destPath) ? 'overwrite' : 'create';

    if (dryRunMode) {
      if (action === 'create') {
        console.log(cyan(`  → Would create: ${dest}`));
        created++;
      } else {
        console.log(cyan(`  → Would update: ${dest}`));
        updated++;
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
      if (action === 'create') {
        console.log(green(`  ✓ Created: ${dest}`));
        created++;
      } else {
        console.log(yellow(`  ↻ Updated: ${dest}`));
        updated++;
      }
    }
  } catch (error) {
    const code = error.code || '';
    if (code === 'EACCES' || code === 'EPERM') {
      console.log(red(`  ✗ Permission denied: ${dest}`));
      console.log(yellow(`    Try running with elevated permissions or check file ownership`));
    } else {
      console.log(red(`  ✗ Failed: ${dest} — ${error.message}`));
    }
    continue;
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
  for (const [bucket, skillNames] of Object.entries(GLOBAL_SKILL_MAP)) {
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

      if (dryRunMode) {
        console.log(cyan(`  → Would install: [${bucket}] ${skillName}`));
        globalInstalled++;
      } else {
        try {
          if (fs.existsSync(destSkillDir)) {
            removeDirSync(destSkillDir);
          }
          copyDirSync(srcSkillDir, destSkillDir);
          console.log(green(`  ✓ Installed: [${bucket}] ${skillName}`));
          globalInstalled++;
        } catch (error) {
            const code = error.code || '';
            if (code === 'EACCES' || code === 'EPERM') {
              console.log(red(`  ✗ Permission denied: [${bucket}] ${skillName}`));
              console.log(yellow(`    Try running with elevated permissions or check file ownership`));
            } else {
              const message = error instanceof Error ? error.message : String(error);
              console.log(red(`  ✗ Failed: [${bucket}] ${skillName} — ${message}`));
            }
            globalMissing++;
          }
      }
    }
  }

  // ─── Global Skills Summary ───
  const totalSkills = Object.values(GLOBAL_SKILL_MAP).reduce((sum, arr) => sum + arr.length, 0);
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
    if (!dryRunMode) {
      fs.mkdirSync(mcpDestDir, { recursive: true });
    }
  }

  if (fs.existsSync(mcpDestPath) && !forceMode) {
    console.log(dim('  ○ Exists (skip): .roo/mcp.json'));
  } else if (dryRunMode) {
    console.log(cyan('  → Would create: .roo/mcp.json'));
  } else {
    try {
      fs.copyFileSync(mcpTemplatePath, mcpDestPath);
      console.log(green('  ✓ Created: .roo/mcp.json'));
      console.log(yellow('  ⚠ Edit .roo/mcp.json and replace placeholder values:'));
      console.log(yellow('    github → paste-your-github-token-here    → your actual GitHub PAT'));
      console.log(yellow('    postgres → connection string              → your PostgreSQL URL'));
      console.log(yellow('    filesystem → /path/to/your/workspace     → your project path'));
      console.log('');
      console.log(dim('  📊 code-review-graph (optional, for graph-assisted code reviews):'));
      console.log(dim('    pip install code-review-graph   (requires Python 3.10+)'));
      console.log(dim('    code-review-graph build         (index your project)'));
    } catch (error) {
      const code = error.code || '';
      if (code === 'EACCES' || code === 'EPERM') {
        console.log(red('  ✗ Permission denied: .roo/mcp.json'));
        console.log(yellow('    Try running with elevated permissions or check file ownership'));
      } else {
        console.log(red(`  ✗ Failed: .roo/mcp.json — ${error.message}`));
      }
    }
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
  console.log(cyan(`  ${globalSkillsMode ? '5' : '6'}. Edit .roo/mcp.json — replace placeholder values with real credentials`));
}
console.log('');
if (dryRunMode) {
  console.log(yellow(bold('  (dry-run mode — no files were written)')));
  console.log('');
}
console.log(green(bold('✅ RooCode optimization installed successfully!')));
console.log('');
