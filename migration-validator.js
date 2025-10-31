"use strict";
/**
 * TypeScript Migration Validator
 *
 * Validates the migration progress, checks for type errors,
 * and ensures functionality is preserved.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationValidator = void 0;
var fs = require("fs");
var path = require("path");
var child_process_1 = require("child_process");
// ============================================================================
// COLORS FOR TERMINAL OUTPUT
// ============================================================================
var colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};
function log(message, color) {
    if (color === void 0) { color = colors.reset; }
    console.log("".concat(color).concat(message).concat(colors.reset));
}
function logSection(message) {
    log("\n".concat('='.repeat(70)), colors.blue);
    log("  ".concat(message), colors.bright + colors.blue);
    log('='.repeat(70), colors.blue);
}
// ============================================================================
// MIGRATION VALIDATOR CLASS
// ============================================================================
var MigrationValidator = /** @class */ (function () {
    function MigrationValidator() {
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
    MigrationValidator.prototype.validateMigration = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logSection('TypeScript Migration Validation');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        // Step 1: Count files and calculate progress
                        return [4 /*yield*/, this.calculateMigrationProgress()];
                    case 2:
                        // Step 1: Count files and calculate progress
                        _a.sent();
                        // Step 2: Check for type errors
                        return [4 /*yield*/, this.checkTypeErrors()];
                    case 3:
                        // Step 2: Check for type errors
                        _a.sent();
                        // Step 3: Test core functionality
                        return [4 /*yield*/, this.testCoreFunctionality()];
                    case 4:
                        // Step 3: Test core functionality
                        _a.sent();
                        // Step 4: Measure performance impact
                        return [4 /*yield*/, this.measurePerformanceImpact()];
                    case 5:
                        // Step 4: Measure performance impact
                        _a.sent();
                        // Determine overall success
                        this.report.success =
                            this.report.typeErrors.filter(function (e) { return e.severity === 'error'; }).length === 0 &&
                                this.report.functionalityTests.every(function (t) { return t.passed; }) &&
                                this.report.performanceTests.every(function (t) { return t.acceptable; });
                        // Print summary
                        this.printSummary();
                        // Save report
                        this.saveReport();
                        return [2 /*return*/, this.report];
                    case 6:
                        error_1 = _a.sent();
                        log("\u274C Validation failed: ".concat(error_1.message), colors.red);
                        throw error_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Calculate migration progress
     */
    MigrationValidator.prototype.calculateMigrationProgress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var jsDir, files;
            return __generator(this, function (_a) {
                logSection('Calculating Migration Progress');
                jsDir = 'js';
                files = this.getFilesRecursively(jsDir);
                this.report.jsFiles = files.filter(function (f) { return f.endsWith('.js'); }).length;
                this.report.tsFiles = files.filter(function (f) { return f.endsWith('.ts'); }).length;
                this.report.totalFiles = this.report.jsFiles + this.report.tsFiles;
                this.report.migrationProgress = Math.round((this.report.tsFiles / this.report.totalFiles) * 100);
                log("\uD83D\uDCCA Total files: ".concat(this.report.totalFiles), colors.blue);
                log("   JavaScript: ".concat(this.report.jsFiles), colors.yellow);
                log("   TypeScript: ".concat(this.report.tsFiles), colors.green);
                log("   Migration progress: ".concat(this.report.migrationProgress, "%"), this.report.migrationProgress >= 50 ? colors.green : colors.yellow);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Check for TypeScript errors
     */
    MigrationValidator.prototype.checkTypeErrors = function () {
        return __awaiter(this, void 0, void 0, function () {
            var output, errorLines, errorCount, warningCount;
            var _this = this;
            return __generator(this, function (_a) {
                logSection('Checking TypeScript Errors');
                try {
                    // Run tsc --noEmit to check for errors without generating output
                    (0, child_process_1.execSync)('npx tsc --noEmit', { encoding: 'utf-8', stdio: 'pipe' });
                    log('✅ No type errors found!', colors.green);
                }
                catch (error) {
                    output = error.stdout || error.message;
                    errorLines = output.split('\n');
                    errorLines.forEach(function (line) {
                        var match = line.match(/(.+\.ts)\((\d+),(\d+)\): (error|warning) TS\d+: (.+)/);
                        if (match) {
                            _this.report.typeErrors.push({
                                file: match[1],
                                line: parseInt(match[2]),
                                column: parseInt(match[3]),
                                severity: match[4],
                                message: match[5]
                            });
                        }
                    });
                    errorCount = this.report.typeErrors.filter(function (e) { return e.severity === 'error'; }).length;
                    warningCount = this.report.typeErrors.filter(function (e) { return e.severity === 'warning'; }).length;
                    if (errorCount > 0) {
                        log("\u274C Found ".concat(errorCount, " type errors"), colors.red);
                    }
                    if (warningCount > 0) {
                        log("\u26A0\uFE0F  Found ".concat(warningCount, " type warnings"), colors.yellow);
                    }
                    // Show first 5 errors
                    this.report.typeErrors.slice(0, 5).forEach(function (err) {
                        var color = err.severity === 'error' ? colors.red : colors.yellow;
                        log("   ".concat(err.file, ":").concat(err.line, ":").concat(err.column), color);
                        log("   ".concat(err.message), color);
                    });
                    if (this.report.typeErrors.length > 5) {
                        log("   ... and ".concat(this.report.typeErrors.length - 5, " more"), colors.yellow);
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Test core functionality
     */
    MigrationValidator.prototype.testCoreFunctionality = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        logSection('Testing Core Functionality');
                        // Test 1: Check if dist files exist and are valid
                        _b = (_a = this.report.functionalityTests).push;
                        return [4 /*yield*/, this.testDistFilesExist()];
                    case 1:
                        // Test 1: Check if dist files exist and are valid
                        _b.apply(_a, [_g.sent()]);
                        // Test 2: Check if normalize-es module works
                        _d = (_c = this.report.functionalityTests).push;
                        return [4 /*yield*/, this.testNormalizeEs()];
                    case 2:
                        // Test 2: Check if normalize-es module works
                        _d.apply(_c, [_g.sent()]);
                        // Test 3: Check if types are accessible
                        _f = (_e = this.report.functionalityTests).push;
                        return [4 /*yield*/, this.testTypesAccessible()];
                    case 3:
                        // Test 3: Check if types are accessible
                        _f.apply(_e, [_g.sent()]);
                        // Print results
                        this.report.functionalityTests.forEach(function (test) {
                            var icon = test.passed ? '✅' : '❌';
                            var color = test.passed ? colors.green : colors.red;
                            log("".concat(icon, " ").concat(test.name), color);
                            if (test.details) {
                                log("   ".concat(test.details), color);
                            }
                            if (test.error) {
                                log("   Error: ".concat(test.error), colors.red);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Test if dist files exist
     */
    MigrationValidator.prototype.testDistFilesExist = function () {
        return __awaiter(this, void 0, void 0, function () {
            var distExists, distJsExists, files, jsFiles, dtsFiles;
            return __generator(this, function (_a) {
                try {
                    distExists = fs.existsSync('dist');
                    distJsExists = fs.existsSync('dist/js');
                    if (!distExists || !distJsExists) {
                        return [2 /*return*/, {
                                name: 'Dist files exist',
                                passed: false,
                                details: 'dist/ or dist/js/ directory not found',
                                error: 'Run npm run build first'
                            }];
                    }
                    files = fs.readdirSync('dist/js');
                    jsFiles = files.filter(function (f) { return f.endsWith('.js'); }).length;
                    dtsFiles = files.filter(function (f) { return f.endsWith('.d.ts'); }).length;
                    return [2 /*return*/, {
                            name: 'Dist files exist',
                            passed: true,
                            details: "".concat(jsFiles, " JS files, ").concat(dtsFiles, " .d.ts files")
                        }];
                }
                catch (error) {
                    return [2 /*return*/, {
                            name: 'Dist files exist',
                            passed: false,
                            details: 'Failed to check dist files',
                            error: error.message
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Test normalize-es module
     */
    MigrationValidator.prototype.testNormalizeEs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var normalizeEsPath, fileSize;
            return __generator(this, function (_a) {
                try {
                    normalizeEsPath = 'dist/js/normalize-es.js';
                    if (!fs.existsSync(normalizeEsPath)) {
                        return [2 /*return*/, {
                                name: 'normalize-es module',
                                passed: false,
                                details: 'normalize-es.js not found in dist',
                                error: 'Module not compiled'
                            }];
                    }
                    fileSize = fs.statSync(normalizeEsPath).size;
                    if (fileSize === 0) {
                        return [2 /*return*/, {
                                name: 'normalize-es module',
                                passed: false,
                                details: 'normalize-es.js is empty'
                            }];
                    }
                    return [2 /*return*/, {
                            name: 'normalize-es module',
                            passed: true,
                            details: "Compiled successfully (".concat(fileSize, " bytes)")
                        }];
                }
                catch (error) {
                    return [2 /*return*/, {
                            name: 'normalize-es module',
                            passed: false,
                            details: 'Failed to validate module',
                            error: error.message
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Test if types are accessible
     */
    MigrationValidator.prototype.testTypesAccessible = function () {
        return __awaiter(this, void 0, void 0, function () {
            var coreTypesPath, distCoreTypesPath, content, hasExports;
            return __generator(this, function (_a) {
                try {
                    coreTypesPath = 'types/core.ts';
                    distCoreTypesPath = 'dist/types/core.d.ts';
                    if (!fs.existsSync(coreTypesPath)) {
                        return [2 /*return*/, {
                                name: 'Type definitions',
                                passed: false,
                                details: 'types/core.ts not found'
                            }];
                    }
                    if (!fs.existsSync(distCoreTypesPath)) {
                        return [2 /*return*/, {
                                name: 'Type definitions',
                                passed: false,
                                details: 'dist/types/core.d.ts not found'
                            }];
                    }
                    content = fs.readFileSync(coreTypesPath, 'utf-8');
                    hasExports = content.includes('export');
                    return [2 /*return*/, {
                            name: 'Type definitions',
                            passed: hasExports,
                            details: hasExports ? 'Types are properly exported' : 'No exports found'
                        }];
                }
                catch (error) {
                    return [2 /*return*/, {
                            name: 'Type definitions',
                            passed: false,
                            details: 'Failed to validate types',
                            error: error.message
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Measure performance impact
     */
    MigrationValidator.prototype.measurePerformanceImpact = function () {
        return __awaiter(this, void 0, void 0, function () {
            var buildTimeTest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logSection('Measuring Performance Impact');
                        return [4 /*yield*/, this.measureBuildTime()];
                    case 1:
                        buildTimeTest = _a.sent();
                        this.report.performanceTests.push(buildTimeTest);
                        // Print results
                        this.report.performanceTests.forEach(function (test) {
                            var icon = test.acceptable ? '✅' : '⚠️';
                            var color = test.acceptable ? colors.green : colors.yellow;
                            log("".concat(icon, " ").concat(test.name, ": ").concat(test.current.toFixed(2), "s (").concat(test.percentChange >= 0 ? '+' : '').concat(test.percentChange.toFixed(1), "%)"), color);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Measure build time
     */
    MigrationValidator.prototype.measureBuildTime = function () {
        return __awaiter(this, void 0, void 0, function () {
            var start, duration, baseline, percentChange, acceptable;
            return __generator(this, function (_a) {
                start = Date.now();
                try {
                    (0, child_process_1.execSync)('npm run build', { stdio: 'pipe' });
                    duration = (Date.now() - start) / 1000;
                    baseline = 2.0;
                    percentChange = ((duration - baseline) / baseline) * 100;
                    acceptable = duration <= baseline * 1.5;
                    return [2 /*return*/, {
                            name: 'Build time',
                            baseline: baseline,
                            current: duration,
                            acceptable: acceptable,
                            percentChange: percentChange
                        }];
                }
                catch (error) {
                    return [2 /*return*/, {
                            name: 'Build time',
                            baseline: 2.0,
                            current: 0,
                            acceptable: false,
                            percentChange: 0
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Print validation summary
     */
    MigrationValidator.prototype.printSummary = function () {
        logSection('Validation Summary');
        log('\n📋 Migration Status:', colors.bright);
        log("   Progress: ".concat(this.report.migrationProgress, "%"), colors.blue);
        log("   TypeScript files: ".concat(this.report.tsFiles, "/").concat(this.report.totalFiles), colors.blue);
        log('\n🔍 Type Safety:', colors.bright);
        var errorCount = this.report.typeErrors.filter(function (e) { return e.severity === 'error'; }).length;
        var warningCount = this.report.typeErrors.filter(function (e) { return e.severity === 'warning'; }).length;
        log("   Errors: ".concat(errorCount), errorCount === 0 ? colors.green : colors.red);
        log("   Warnings: ".concat(warningCount), warningCount === 0 ? colors.green : colors.yellow);
        log('\n✅ Functionality Tests:', colors.bright);
        var passedTests = this.report.functionalityTests.filter(function (t) { return t.passed; }).length;
        var totalTests = this.report.functionalityTests.length;
        log("   Passed: ".concat(passedTests, "/").concat(totalTests), passedTests === totalTests ? colors.green : colors.red);
        log('\n⚡ Performance:', colors.bright);
        var acceptablePerf = this.report.performanceTests.filter(function (t) { return t.acceptable; }).length;
        var totalPerf = this.report.performanceTests.length;
        log("   Acceptable: ".concat(acceptablePerf, "/").concat(totalPerf), acceptablePerf === totalPerf ? colors.green : colors.yellow);
        log("\n".concat(this.report.success ? '✅' : '❌', " Overall: ").concat(this.report.success ? 'PASSED' : 'FAILED'), this.report.success ? colors.bright + colors.green : colors.bright + colors.red);
    };
    /**
     * Save validation report to file
     */
    MigrationValidator.prototype.saveReport = function () {
        var reportPath = 'migration-report.json';
        fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));
        log("\n\uD83D\uDCBE Report saved to ".concat(reportPath), colors.cyan);
    };
    /**
     * Get all files recursively from a directory
     */
    MigrationValidator.prototype.getFilesRecursively = function (dir) {
        var _this = this;
        var results = [];
        if (!fs.existsSync(dir)) {
            return results;
        }
        var items = fs.readdirSync(dir);
        items.forEach(function (item) {
            var fullPath = path.join(dir, item);
            var stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                results.push.apply(results, _this.getFilesRecursively(fullPath));
            }
            else {
                results.push(fullPath);
            }
        });
        return results;
    };
    return MigrationValidator;
}());
exports.MigrationValidator = MigrationValidator;
// ============================================================================
// MAIN
// ============================================================================
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var validator, report;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    validator = new MigrationValidator();
                    return [4 /*yield*/, validator.validateMigration()];
                case 1:
                    report = _a.sent();
                    // Exit with error code if validation failed
                    if (!report.success) {
                        process.exit(1);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// Run if called directly
if (require.main === module) {
    main().catch(function (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}
exports.default = MigrationValidator;
