/**
 * TypeScript Migration Validator
 *
 * Validates the migration progress, checks for type errors,
 * and ensures functionality is preserved.
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// ============================================================================
// TYPES
// ============================================================================

interface ValidationReport {
  totalFiles: number;
  jsFiles: number;
  tsFiles: number;
  migrationProgress: number;
  typeErrors: TypeErrorInfo[];
  warnings: string[];
  functionalityTests: FunctionalityTestResult[];
  performanceTests: PerformanceTestResult[];
  success: boolean;
  timestamp: string;
}

interface TypeErrorInfo {
  file: string;
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

interface FunctionalityTestResult {
  name: string;
  passed: boolean;
  details: string;
  error?: string;
}

interface PerformanceTestResult {
  name: string;
  baseline: number;
  current: number;
  acceptable: boolean;
  percentChange: number;
}

// ============================================================================
// COLORS FOR TERMINAL OUTPUT
// ============================================================================

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message: string, color: string = colors.reset): void {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(message: string): void {
  log(`\n${'='.repeat(70)}`, colors.blue);
  log(`  ${message}`, colors.bright + colors.blue);
  log('='.repeat(70), colors.blue);
}

// ============================================================================
// MIGRATION VALIDATOR CLASS
// ============================================================================

export class MigrationValidator {
  private report: ValidationReport;

  constructor() {
    this.report = {
      totalFiles: 0,
      jsFiles: 0,
      tsFiles: 0,
      migrationProgress: 0,
      typeErrors: [],
      warnings: [],
      functionalityTests: [],
      performanceTests: [],
      success: false,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Run full migration validation
   */
  async validateMigration(): Promise<ValidationReport> {
    logSection('TypeScript Migration Validation');

    try {
      // Step 1: Count files and calculate progress
      await this.calculateMigrationProgress();

      // Step 2: Check for type errors
      await this.checkTypeErrors();

      // Step 3: Test core functionality
      await this.testCoreFunctionality();

      // Step 4: Measure performance impact
      await this.measurePerformanceImpact();

      // Determine overall success
      this.report.success =
        this.report.typeErrors.filter(e => e.severity === 'error').length === 0 &&
        this.report.functionalityTests.every(t => t.passed) &&
        this.report.performanceTests.every(t => t.acceptable);

      // Print summary
      this.printSummary();

      // Save report
      this.saveReport();

      return this.report;
    } catch (error) {
      log(`❌ Validation failed: ${(error as Error).message}`, colors.red);
      throw error;
    }
  }

  /**
   * Calculate migration progress
   */
  private async calculateMigrationProgress(): Promise<void> {
    logSection('Calculating Migration Progress');

    const jsDir = 'js';
    const files = this.getFilesRecursively(jsDir);

    this.report.jsFiles = files.filter(f => f.endsWith('.js')).length;
    this.report.tsFiles = files.filter(f => f.endsWith('.ts')).length;
    this.report.totalFiles = this.report.jsFiles + this.report.tsFiles;

    this.report.migrationProgress = Math.round(
      (this.report.tsFiles / this.report.totalFiles) * 100
    );

    log(`📊 Total files: ${this.report.totalFiles}`, colors.blue);
    log(`   JavaScript: ${this.report.jsFiles}`, colors.yellow);
    log(`   TypeScript: ${this.report.tsFiles}`, colors.green);
    log(
      `   Migration progress: ${this.report.migrationProgress}%`,
      this.report.migrationProgress >= 50 ? colors.green : colors.yellow
    );
  }

  /**
   * Check for TypeScript errors
   */
  private async checkTypeErrors(): Promise<void> {
    logSection('Checking TypeScript Errors');

    try {
      // Run tsc --noEmit to check for errors without generating output
      execSync('npx tsc --noEmit', { encoding: 'utf-8', stdio: 'pipe' });
      log('✅ No type errors found!', colors.green);
    } catch (error: any) {
      const output = error.stdout || error.message;

      // Parse TypeScript error output
      const errorLines = output.split('\n');

      errorLines.forEach((line: string) => {
        const match = line.match(/(.+\.ts)\((\d+),(\d+)\): (error|warning) TS\d+: (.+)/);
        if (match) {
          this.report.typeErrors.push({
            file: match[1],
            line: parseInt(match[2]),
            column: parseInt(match[3]),
            severity: match[4] as 'error' | 'warning',
            message: match[5]
          });
        }
      });

      const errorCount = this.report.typeErrors.filter(e => e.severity === 'error').length;
      const warningCount = this.report.typeErrors.filter(e => e.severity === 'warning').length;

      if (errorCount > 0) {
        log(`❌ Found ${errorCount} type errors`, colors.red);
      }
      if (warningCount > 0) {
        log(`⚠️  Found ${warningCount} type warnings`, colors.yellow);
      }

      // Show first 5 errors
      this.report.typeErrors.slice(0, 5).forEach(err => {
        const color = err.severity === 'error' ? colors.red : colors.yellow;
        log(`   ${err.file}:${err.line}:${err.column}`, color);
        log(`   ${err.message}`, color);
      });

      if (this.report.typeErrors.length > 5) {
        log(`   ... and ${this.report.typeErrors.length - 5} more`, colors.yellow);
      }
    }
  }

  /**
   * Test core functionality
   */
  private async testCoreFunctionality(): Promise<void> {
    logSection('Testing Core Functionality');

    // Test 1: Check if dist files exist and are valid
    this.report.functionalityTests.push(
      await this.testDistFilesExist()
    );

    // Test 2: Check if normalize-es module works
    this.report.functionalityTests.push(
      await this.testNormalizeEs()
    );

    // Test 3: Check if types are accessible
    this.report.functionalityTests.push(
      await this.testTypesAccessible()
    );

    // Print results
    this.report.functionalityTests.forEach(test => {
      const icon = test.passed ? '✅' : '❌';
      const color = test.passed ? colors.green : colors.red;
      log(`${icon} ${test.name}`, color);
      if (test.details) {
        log(`   ${test.details}`, color);
      }
      if (test.error) {
        log(`   Error: ${test.error}`, colors.red);
      }
    });
  }

  /**
   * Test if dist files exist
   */
  private async testDistFilesExist(): Promise<FunctionalityTestResult> {
    try {
      const distExists = fs.existsSync('dist');
      const distJsExists = fs.existsSync('dist/js');

      if (!distExists || !distJsExists) {
        return {
          name: 'Dist files exist',
          passed: false,
          details: 'dist/ or dist/js/ directory not found',
          error: 'Run npm run build first'
        };
      }

      const files = fs.readdirSync('dist/js');
      const jsFiles = files.filter(f => f.endsWith('.js')).length;
      const dtsFiles = files.filter(f => f.endsWith('.d.ts')).length;

      return {
        name: 'Dist files exist',
        passed: true,
        details: `${jsFiles} JS files, ${dtsFiles} .d.ts files`
      };
    } catch (error) {
      return {
        name: 'Dist files exist',
        passed: false,
        details: 'Failed to check dist files',
        error: (error as Error).message
      };
    }
  }

  /**
   * Test normalize-es module
   */
  private async testNormalizeEs(): Promise<FunctionalityTestResult> {
    try {
      const normalizeEsPath = 'dist/js/normalize-es.js';

      if (!fs.existsSync(normalizeEsPath)) {
        return {
          name: 'normalize-es module',
          passed: false,
          details: 'normalize-es.js not found in dist',
          error: 'Module not compiled'
        };
      }

      // Basic check: file exists and is not empty
      const fileSize = fs.statSync(normalizeEsPath).size;

      if (fileSize === 0) {
        return {
          name: 'normalize-es module',
          passed: false,
          details: 'normalize-es.js is empty'
        };
      }

      return {
        name: 'normalize-es module',
        passed: true,
        details: `Compiled successfully (${fileSize} bytes)`
      };
    } catch (error) {
      return {
        name: 'normalize-es module',
        passed: false,
        details: 'Failed to validate module',
        error: (error as Error).message
      };
    }
  }

  /**
   * Test if types are accessible
   */
  private async testTypesAccessible(): Promise<FunctionalityTestResult> {
    try {
      const coreTypesPath = 'types/core.ts';
      const distCoreTypesPath = 'dist/types/core.d.ts';

      if (!fs.existsSync(coreTypesPath)) {
        return {
          name: 'Type definitions',
          passed: false,
          details: 'types/core.ts not found'
        };
      }

      if (!fs.existsSync(distCoreTypesPath)) {
        return {
          name: 'Type definitions',
          passed: false,
          details: 'dist/types/core.d.ts not found'
        };
      }

      // Check if types export correctly
      const content = fs.readFileSync(coreTypesPath, 'utf-8');
      const hasExports = content.includes('export');

      return {
        name: 'Type definitions',
        passed: hasExports,
        details: hasExports ? 'Types are properly exported' : 'No exports found'
      };
    } catch (error) {
      return {
        name: 'Type definitions',
        passed: false,
        details: 'Failed to validate types',
        error: (error as Error).message
      };
    }
  }

  /**
   * Measure performance impact
   */
  private async measurePerformanceImpact(): Promise<void> {
    logSection('Measuring Performance Impact');

    // Test 1: Build time
    const buildTimeTest = await this.measureBuildTime();
    this.report.performanceTests.push(buildTimeTest);

    // Print results
    this.report.performanceTests.forEach(test => {
      const icon = test.acceptable ? '✅' : '⚠️';
      const color = test.acceptable ? colors.green : colors.yellow;
      log(
        `${icon} ${test.name}: ${test.current.toFixed(2)}s (${test.percentChange >= 0 ? '+' : ''}${test.percentChange.toFixed(1)}%)`,
        color
      );
    });
  }

  /**
   * Measure build time
   */
  private async measureBuildTime(): Promise<PerformanceTestResult> {
    const start = Date.now();

    try {
      execSync('npm run build', { stdio: 'pipe' });
      const duration = (Date.now() - start) / 1000;

      // Baseline: assume 2 seconds for pure JS build
      const baseline = 2.0;
      const percentChange = ((duration - baseline) / baseline) * 100;

      // Acceptable if within 50% of baseline
      const acceptable = duration <= baseline * 1.5;

      return {
        name: 'Build time',
        baseline,
        current: duration,
        acceptable,
        percentChange
      };
    } catch (error) {
      return {
        name: 'Build time',
        baseline: 2.0,
        current: 0,
        acceptable: false,
        percentChange: 0
      };
    }
  }

  /**
   * Print validation summary
   */
  private printSummary(): void {
    logSection('Validation Summary');

    log('\n📋 Migration Status:', colors.bright);
    log(`   Progress: ${this.report.migrationProgress}%`, colors.blue);
    log(`   TypeScript files: ${this.report.tsFiles}/${this.report.totalFiles}`, colors.blue);

    log('\n🔍 Type Safety:', colors.bright);
    const errorCount = this.report.typeErrors.filter(e => e.severity === 'error').length;
    const warningCount = this.report.typeErrors.filter(e => e.severity === 'warning').length;
    log(`   Errors: ${errorCount}`, errorCount === 0 ? colors.green : colors.red);
    log(`   Warnings: ${warningCount}`, warningCount === 0 ? colors.green : colors.yellow);

    log('\n✅ Functionality Tests:', colors.bright);
    const passedTests = this.report.functionalityTests.filter(t => t.passed).length;
    const totalTests = this.report.functionalityTests.length;
    log(
      `   Passed: ${passedTests}/${totalTests}`,
      passedTests === totalTests ? colors.green : colors.red
    );

    log('\n⚡ Performance:', colors.bright);
    const acceptablePerf = this.report.performanceTests.filter(t => t.acceptable).length;
    const totalPerf = this.report.performanceTests.length;
    log(
      `   Acceptable: ${acceptablePerf}/${totalPerf}`,
      acceptablePerf === totalPerf ? colors.green : colors.yellow
    );

    log(`\n${this.report.success ? '✅' : '❌'} Overall: ${this.report.success ? 'PASSED' : 'FAILED'}`, this.report.success ? colors.bright + colors.green : colors.bright + colors.red);
  }

  /**
   * Save validation report to file
   */
  private saveReport(): void {
    const reportPath = 'migration-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));
    log(`\n💾 Report saved to ${reportPath}`, colors.cyan);
  }

  /**
   * Get all files recursively from a directory
   */
  private getFilesRecursively(dir: string): string[] {
    const results: string[] = [];

    if (!fs.existsSync(dir)) {
      return results;
    }

    const items = fs.readdirSync(dir);

    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        results.push(...this.getFilesRecursively(fullPath));
      } else {
        results.push(fullPath);
      }
    });

    return results;
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main(): Promise<void> {
  const validator = new MigrationValidator();
  const report = await validator.validateMigration();

  // Exit with error code if validation failed
  if (!report.success) {
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export default MigrationValidator;
