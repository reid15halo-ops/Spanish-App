/**
 * Production Build Script
 *
 * Compiles TypeScript, bundles modules, and prepares production-ready assets.
 * This script is called by `npm run build-prod`.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(message) {
  log(`\n${'='.repeat(70)}`, colors.blue);
  log(`  ${message}`, colors.bright + colors.blue);
  log('='.repeat(70), colors.blue);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

/**
 * Execute command and return output
 */
function exec(command, options = {}) {
  try {
    log(`\n▶️  ${command}`, colors.blue);
    const output = execSync(command, {
      encoding: 'utf-8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout };
  }
}

/**
 * Clean dist directory
 */
function cleanDist() {
  logSection('Cleaning dist directory');

  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    logSuccess('dist/ removed');
  }

  fs.mkdirSync('dist', { recursive: true });
  logSuccess('dist/ created');
}

/**
 * Compile TypeScript
 */
function compileTypeScript() {
  logSection('Compiling TypeScript');

  const result = exec('npm run build');

  if (!result.success) {
    logError('TypeScript compilation failed!');
    process.exit(1);
  }

  logSuccess('TypeScript compiled successfully');

  // Count compiled files
  const jsFiles = countFiles('dist', '.js');
  const dtsFiles = countFiles('dist', '.d.ts');

  log(`  📄 Generated ${jsFiles} JavaScript files`, colors.green);
  log(`  📝 Generated ${dtsFiles} type definition files`, colors.green);
}

/**
 * Run type checking (strict mode)
 */
function runTypeCheck() {
  logSection('Running Type Check (Strict Mode)');

  const result = exec('npm run type-check', { silent: true });

  if (!result.success) {
    logWarning('Type check found issues (this is expected during migration)');
    // Don't fail build - we're in gradual migration
  } else {
    logSuccess('Type check passed!');
  }
}

/**
 * Generate type definitions for JavaScript modules
 */
function generateTypeDefinitions() {
  logSection('Generating Type Definitions');

  // Create types directory in dist if it doesn't exist
  const typesDir = path.join('dist', 'types');
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }

  // Copy type definitions to dist
  if (fs.existsSync('types')) {
    copyDirectory('types', typesDir);
    logSuccess('Type definitions copied to dist/types');
  }
}

/**
 * Copy static assets to dist
 */
function copyStaticAssets() {
  logSection('Copying Static Assets');

  const assets = [
    { src: 'data', dest: 'dist/data' },
    { src: 'icons', dest: 'dist/icons' },
    { src: 'index.html', dest: 'dist/index.html' },
    { src: 'manifest.json', dest: 'dist/manifest.json' },
    { src: 'sw.js', dest: 'dist/sw.js' },
    { src: 'privacy-policy.html', dest: 'dist/privacy-policy.html' }
  ];

  assets.forEach(({ src, dest }) => {
    if (fs.existsSync(src)) {
      if (fs.statSync(src).isDirectory()) {
        copyDirectory(src, dest);
      } else {
        fs.cpSync(src, dest);
      }
      logSuccess(`Copied ${src}`);
    } else {
      logWarning(`Skipped ${src} (not found)`);
    }
  });
}

/**
 * Create production report
 */
function createReport() {
  logSection('Build Summary');

  const stats = {
    totalJsFiles: countFiles('dist', '.js'),
    totalDtsFiles: countFiles('dist', '.d.ts'),
    totalTsFiles: countFiles('js', '.ts'),
    totalJsSourceFiles: countFiles('js', '.js'),
    buildTime: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform
  };

  log(`\n📊 Build Statistics:`, colors.bright);
  log(`   Source TypeScript files: ${stats.totalTsFiles}`, colors.blue);
  log(`   Source JavaScript files: ${stats.totalJsSourceFiles}`, colors.blue);
  log(`   Compiled JavaScript files: ${stats.totalJsFiles}`, colors.green);
  log(`   Type definition files: ${stats.totalDtsFiles}`, colors.green);
  log(`   Node version: ${stats.nodeVersion}`, colors.blue);
  log(`   Platform: ${stats.platform}`, colors.blue);
  log(`   Build time: ${stats.buildTime}`, colors.blue);

  // Calculate migration progress
  const migrationPercent = Math.round(
    (stats.totalTsFiles / (stats.totalTsFiles + stats.totalJsSourceFiles)) * 100
  );

  log(`\n🚀 TypeScript Migration Progress: ${migrationPercent}%`, colors.bright + colors.blue);

  // Write report to file
  fs.writeFileSync(
    'dist/build-report.json',
    JSON.stringify(stats, null, 2)
  );

  logSuccess('Build report saved to dist/build-report.json');
}

/**
 * Utility: Count files with specific extension
 */
function countFiles(dir, ext) {
  if (!fs.existsSync(dir)) return 0;

  let count = 0;

  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);

    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith(ext)) {
        count++;
      }
    });
  }

  traverse(dir);
  return count;
}

/**
 * Utility: Copy directory recursively
 */
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);

  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.cpSync(srcPath, destPath);
    }
  });
}

// ============================================================================
// MAIN BUILD PROCESS
// ============================================================================

async function buildProduction() {
  const startTime = Date.now();

  log('\n' + colors.bright + colors.blue);
  log('╔═══════════════════════════════════════════════════════════════════╗');
  log('║         Spanish Learning App - Production Build                  ║');
  log('║         TypeScript Migration Build System                        ║');
  log('╚═══════════════════════════════════════════════════════════════════╝');
  log(colors.reset);

  try {
    // Step 1: Clean
    cleanDist();

    // Step 2: Compile TypeScript
    compileTypeScript();

    // Step 3: Type Check (informational)
    runTypeCheck();

    // Step 4: Generate type definitions
    generateTypeDefinitions();

    // Step 5: Copy static assets
    copyStaticAssets();

    // Step 6: Create report
    createReport();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    logSection('Build Complete! 🎉');
    log(`\n✨ Production build completed in ${duration}s`, colors.bright + colors.green);
    log(`📦 Output directory: ${path.resolve('dist')}`, colors.green);
    log(`\nYou can now deploy the contents of the dist/ directory.`, colors.blue);

    return true;
  } catch (error) {
    logError(`Build failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run build if called directly
if (require.main === module) {
  buildProduction();
}

module.exports = { buildProduction };
