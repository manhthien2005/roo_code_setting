'use strict';

const fs = require('fs');
const path = require('path');

// ─── Global Skill Map (26 skills across 11 buckets) ───
const GLOBAL_SKILL_MAP = {
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

/**
 * Recursively copy a directory from src to dest.
 * @param {string} src - Source directory path
 * @param {string} dest - Destination directory path
 */
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  var entries = fs.readdirSync(src, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var srcPath = path.join(src, entry.name);
    var destPath = path.join(dest, entry.name);
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

/**
 * Scan ~/.roo/skills-{mode} dirs for orphan skills not in GLOBAL_SKILL_MAP.
 * Does NOT scan a dir named just "skills" (without hyphen suffix).
 * @param {string} homeRooDir - Path to ~/.roo
 * @returns {string[]} Array of full paths to orphan skill directories
 */
function findOrphanSkills(homeRooDir) {
  var results = [];

  if (!fs.existsSync(homeRooDir)) {
    return results;
  }

  var entries = fs.readdirSync(homeRooDir, { withFileTypes: true });

  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    if (!entry.isDirectory()) continue;

    var bucketName = entry.name;

    // Only scan dirs matching "skills-*" pattern (must have hyphen after "skills")
    if (bucketName.indexOf('skills-') !== 0) continue;

    var bucketPath = path.join(homeRooDir, bucketName);
    var knownSkills = GLOBAL_SKILL_MAP[bucketName];

    // Read skill dirs inside this bucket
    var skillEntries;
    try {
      skillEntries = fs.readdirSync(bucketPath, { withFileTypes: true });
    } catch (err) {
      continue;
    }

    for (var j = 0; j < skillEntries.length; j++) {
      var skillEntry = skillEntries[j];
      if (!skillEntry.isDirectory()) continue;

      var skillPath = path.join(bucketPath, skillEntry.name);

      if (!knownSkills) {
        // Entire bucket is unknown — all skills inside are orphans
        results.push(skillPath);
      } else if (knownSkills.indexOf(skillEntry.name) === -1) {
        // Bucket is known but this specific skill is not in the map
        results.push(skillPath);
      }
    }
  }

  return results;
}

/**
 * Clean orphan skills from ~/.roo/.
 * @param {string} homeRooDir - Path to ~/.roo
 * @param {{ dryRun?: boolean, force?: boolean }} opts - Options
 * @returns {{ removed: string[], skipped: string[] }}
 */
function cleanOrphanSkills(homeRooDir, opts) {
  var options = opts || {};
  var dryRun = !!options.dryRun;
  var force = !!options.force;

  var orphanPaths = findOrphanSkills(homeRooDir);

  if (dryRun) {
    return { removed: [], skipped: orphanPaths };
  }

  if (force) {
    for (var i = 0; i < orphanPaths.length; i++) {
      removeDirSync(orphanPaths[i]);
    }
    return { removed: orphanPaths, skipped: [] };
  }

  // Neither dryRun nor force
  return { removed: [], skipped: orphanPaths };
}

module.exports = {
  copyDirSync: copyDirSync,
  removeDirSync: removeDirSync,
  GLOBAL_SKILL_MAP: GLOBAL_SKILL_MAP,
  findOrphanSkills: findOrphanSkills,
  cleanOrphanSkills: cleanOrphanSkills
};
