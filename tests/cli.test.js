'use strict';

var path = require('path');
var childProcess = require('child_process');
var fs = require('fs');
var os = require('os');

var CLI_PATH = path.join(__dirname, '..', 'bin', 'install.js');

// Helper: run CLI with given args, return { stdout, stderr, status }
function runCLI(args, env) {
  var options = {
    encoding: 'utf8',
    timeout: 10000
  };
  if (env) {
    options.env = Object.assign({}, process.env, env);
  }
  try {
    var stdout = childProcess.execFileSync(process.execPath, [CLI_PATH].concat(args), options);
    return { stdout: stdout, stderr: '', status: 0 };
  } catch (err) {
    return {
      stdout: err.stdout || '',
      stderr: err.stderr || '',
      status: err.status || 1
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLI Integration Tests
// ═══════════════════════════════════════════════════════════════════════════════

describe('CLI: --version', function () {
  test('output matches package.json version', function () {
    var pkg = require('../package.json');
    var result = runCLI(['--version']);

    expect(result.stdout.trim()).toBe(pkg.version);
  });
});

describe('CLI: --help', function () {
  test('contains "Usage:"', function () {
    var result = runCLI(['--help']);

    expect(result.stdout).toContain('Usage:');
  });

  test('contains "--clean"', function () {
    var result = runCLI(['--help']);

    expect(result.stdout).toContain('--clean');
  });
});

describe('CLI: --clean', function () {
  // Helper: create temp HOME dir with empty .roo
  function createTempHome() {
    var tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'roo-cli-test-'));
    var rooDir = path.join(tmpHome, '.roo');
    fs.mkdirSync(rooDir, { recursive: true });
    return tmpHome;
  }

  function cleanupTempDir(dirPath) {
    if (dirPath && fs.existsSync(dirPath)) {
      if (typeof fs.rmSync === 'function') {
        fs.rmSync(dirPath, { recursive: true, force: true });
      } else {
        fs.rmdirSync(dirPath, { recursive: true });
      }
    }
  }

  // TODO: This test requires overriding HOME env var so findOrphanSkills
  // reads from temp dir. On Windows, HOME/USERPROFILE/HOMEDRIVE+HOMEPATH
  // varies. Marking as conditional.
  var isWindows = os.platform() === 'win32';

  test('with empty ~/.roo/ prints "No orphan skills found"', function () {
    if (isWindows) {
      // On Windows, os.homedir() uses USERPROFILE
      var tmpHome = createTempHome();
      try {
        var result = runCLI(['--clean'], {
          USERPROFILE: tmpHome,
          HOME: tmpHome,
          HOMEDRIVE: '',
          HOMEPATH: ''
        });
        expect(result.stdout).toContain('No orphan skills found');
      } finally {
        cleanupTempDir(tmpHome);
      }
    } else {
      var tmpHome2 = createTempHome();
      try {
        var result2 = runCLI(['--clean'], { HOME: tmpHome2 });
        expect(result2.stdout).toContain('No orphan skills found');
      } finally {
        cleanupTempDir(tmpHome2);
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL_SKILL_MAP Consistency Tests
// ═══════════════════════════════════════════════════════════════════════════════

describe('GLOBAL_SKILL_MAP consistency', function () {
  var installer = require('../lib/installer');
  var map = installer.GLOBAL_SKILL_MAP;

  test('total skill count matches expected 29', function () {
    var total = Object.keys(map).reduce(function (sum, key) {
      return sum + map[key].length;
    }, 0);

    expect(total).toBe(29);
    // If this fails: GLOBAL_SKILL_MAP count changed — update docs!
    // Files to update: lib/installer.js comment, README.md, docs/getting-started.md
  });
});
