'use strict';

var fs = require('fs');
var path = require('path');
var os = require('os');

var installer = require('../lib/installer');
var copyDirSync = installer.copyDirSync;
var removeDirSync = installer.removeDirSync;
var GLOBAL_SKILL_MAP = installer.GLOBAL_SKILL_MAP;
var findOrphanSkills = installer.findOrphanSkills;
var cleanOrphanSkills = installer.cleanOrphanSkills;

// Helper: create a fresh temp dir for each test
function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'roo-test-'));
}

// Helper: recursively remove a temp dir (cleanup)
function cleanupTempDir(dirPath) {
  if (dirPath && fs.existsSync(dirPath)) {
    if (typeof fs.rmSync === 'function') {
      fs.rmSync(dirPath, { recursive: true, force: true });
    } else {
      fs.rmdirSync(dirPath, { recursive: true });
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// copyDirSync
// ═══════════════════════════════════════════════════════════════════════════════

describe('copyDirSync', function () {
  var tmpDir;

  afterEach(function () {
    cleanupTempDir(tmpDir);
  });

  test('creates dest dir and copies files recursively', function () {
    tmpDir = createTempDir();
    var src = path.join(tmpDir, 'src');
    var dest = path.join(tmpDir, 'dest');

    fs.mkdirSync(src, { recursive: true });
    fs.writeFileSync(path.join(src, 'file1.txt'), 'hello');
    fs.writeFileSync(path.join(src, 'file2.txt'), 'world');

    copyDirSync(src, dest);

    expect(fs.existsSync(dest)).toBe(true);
    expect(fs.readFileSync(path.join(dest, 'file1.txt'), 'utf8')).toBe('hello');
    expect(fs.readFileSync(path.join(dest, 'file2.txt'), 'utf8')).toBe('world');
  });

  test('copies nested directories', function () {
    tmpDir = createTempDir();
    var src = path.join(tmpDir, 'src');
    var dest = path.join(tmpDir, 'dest');

    fs.mkdirSync(path.join(src, 'sub', 'deep'), { recursive: true });
    fs.writeFileSync(path.join(src, 'top.txt'), 'top');
    fs.writeFileSync(path.join(src, 'sub', 'mid.txt'), 'mid');
    fs.writeFileSync(path.join(src, 'sub', 'deep', 'bottom.txt'), 'bottom');

    copyDirSync(src, dest);

    expect(fs.readFileSync(path.join(dest, 'top.txt'), 'utf8')).toBe('top');
    expect(fs.readFileSync(path.join(dest, 'sub', 'mid.txt'), 'utf8')).toBe('mid');
    expect(fs.readFileSync(path.join(dest, 'sub', 'deep', 'bottom.txt'), 'utf8')).toBe('bottom');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// removeDirSync
// ═══════════════════════════════════════════════════════════════════════════════

describe('removeDirSync', function () {
  var tmpDir;

  afterEach(function () {
    cleanupTempDir(tmpDir);
  });

  test('removes dir and contents', function () {
    tmpDir = createTempDir();
    var target = path.join(tmpDir, 'to-remove');

    fs.mkdirSync(path.join(target, 'sub'), { recursive: true });
    fs.writeFileSync(path.join(target, 'file.txt'), 'data');
    fs.writeFileSync(path.join(target, 'sub', 'nested.txt'), 'nested');

    removeDirSync(target);

    expect(fs.existsSync(target)).toBe(false);
  });

  test('no-op if dir does not exist (no throw)', function () {
    tmpDir = createTempDir();
    var nonExistent = path.join(tmpDir, 'does-not-exist');

    expect(function () {
      removeDirSync(nonExistent);
    }).not.toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL_SKILL_MAP
// ═══════════════════════════════════════════════════════════════════════════════

describe('GLOBAL_SKILL_MAP', function () {
  test('has 11 buckets', function () {
    var buckets = Object.keys(GLOBAL_SKILL_MAP);
    expect(buckets.length).toBe(11);
  });

  test('total skills = 26', function () {
    var total = Object.values(GLOBAL_SKILL_MAP).reduce(function (sum, arr) {
      return sum + arr.length;
    }, 0);
    expect(total).toBe(29);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// findOrphanSkills
// ═══════════════════════════════════════════════════════════════════════════════

describe('findOrphanSkills', function () {
  var tmpDir;

  afterEach(function () {
    cleanupTempDir(tmpDir);
  });

  test('returns empty array when no orphans', function () {
    tmpDir = createTempDir();
    var homeRoo = path.join(tmpDir, '.roo');

    // Create a known bucket with a known skill
    fs.mkdirSync(path.join(homeRoo, 'skills-coding-teacher', 'tutorial-engineer'), { recursive: true });

    var result = findOrphanSkills(homeRoo);
    expect(result).toEqual([]);
  });

  test('detects orphan skill in valid bucket', function () {
    tmpDir = createTempDir();
    var homeRoo = path.join(tmpDir, '.roo');

    // Known skill
    fs.mkdirSync(path.join(homeRoo, 'skills-coding-teacher', 'tutorial-engineer'), { recursive: true });
    // Orphan skill in known bucket
    fs.mkdirSync(path.join(homeRoo, 'skills-coding-teacher', 'unknown-skill'), { recursive: true });

    var result = findOrphanSkills(homeRoo);
    expect(result.length).toBe(1);
    expect(result[0]).toContain('unknown-skill');
  });

  test('detects entire orphan bucket', function () {
    tmpDir = createTempDir();
    var homeRoo = path.join(tmpDir, '.roo');

    // Unknown bucket with skills inside
    fs.mkdirSync(path.join(homeRoo, 'skills-unknown-mode', 'some-skill'), { recursive: true });
    fs.mkdirSync(path.join(homeRoo, 'skills-unknown-mode', 'another-skill'), { recursive: true });

    var result = findOrphanSkills(homeRoo);
    expect(result.length).toBe(2);
  });

  test('ignores "skills" dir (no hyphen)', function () {
    tmpDir = createTempDir();
    var homeRoo = path.join(tmpDir, '.roo');

    // "skills" is the generic bucket — should NOT be scanned as orphan
    fs.mkdirSync(path.join(homeRoo, 'skills', 'anything-goes'), { recursive: true });

    var result = findOrphanSkills(homeRoo);
    expect(result).toEqual([]);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// cleanOrphanSkills
// ═══════════════════════════════════════════════════════════════════════════════

describe('cleanOrphanSkills', function () {
  var tmpDir;

  afterEach(function () {
    cleanupTempDir(tmpDir);
  });

  test('dryRun mode does not delete', function () {
    tmpDir = createTempDir();
    var homeRoo = path.join(tmpDir, '.roo');
    var orphanPath = path.join(homeRoo, 'skills-unknown-mode', 'orphan-skill');

    fs.mkdirSync(orphanPath, { recursive: true });
    fs.writeFileSync(path.join(orphanPath, 'SKILL.md'), 'test');

    var result = cleanOrphanSkills(homeRoo, { dryRun: true });

    expect(result.removed).toEqual([]);
    expect(result.skipped.length).toBe(1);
    // Orphan dir should still exist
    expect(fs.existsSync(orphanPath)).toBe(true);
  });

  test('force mode deletes orphans', function () {
    tmpDir = createTempDir();
    var homeRoo = path.join(tmpDir, '.roo');
    var orphanPath = path.join(homeRoo, 'skills-unknown-mode', 'orphan-skill');

    fs.mkdirSync(orphanPath, { recursive: true });
    fs.writeFileSync(path.join(orphanPath, 'SKILL.md'), 'test');

    var result = cleanOrphanSkills(homeRoo, { force: true });

    expect(result.removed.length).toBe(1);
    expect(result.skipped).toEqual([]);
    // Orphan dir should be gone
    expect(fs.existsSync(orphanPath)).toBe(false);
  });
});
