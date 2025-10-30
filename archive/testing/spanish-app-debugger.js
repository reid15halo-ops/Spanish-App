/**
 * Spanish App Debugger - Automated Bug Detection Tool
 *
 * Tests for all 3 bug categories:
 * 1. Options Preservation (PROMPT 1)
 * 2. Minimum Options Count (PROMPT 2)
 * 3. Navigation & Progress Saving (PROMPT 3)
 */

class SpanishAppDebugger {
    constructor(appController, mockController) {
        this.app = appController;
        this.mock = mockController;
        this.issues = [];
        this.tests = {
            optionsCount: { passed: 0, failed: 0 },
            optionsPreservation: { passed: 0, failed: 0 },
            optionsConsistency: { passed: 0, failed: 0 },
            navigation: { passed: 0, failed: 0 }
        };
    }

    /**
     * Run all tests and generate report
     */
    generateReport() {
        console.log('🔍 Starting Spanish App Debugger...\n');

        // Test 1: Options Count (PROMPT 2)
        this.testOptionsCount();

        // Test 2: Options Preservation (PROMPT 1)
        this.testOptionsPreservation();

        // Test 3: Options Format Consistency (PROMPT 1)
        this.testOptionsConsistency();

        // Test 4: Navigation & Progress (PROMPT 3)
        this.testNavigationFlow();

        // Generate formatted report
        return this.formatReport();
    }

    /**
     * TEST 1: Check all exercises have minimum 3 options
     */
    testOptionsCount() {
        console.log('📊 TEST 1: Checking options count...');

        const exercises = this.mock.exercises;

        exercises.forEach(exercise => {
            if (exercise.type === 'multiple-choice' || exercise.type === 'conjugation') {
                const optionCount = exercise.options ? exercise.options.length : 0;

                if (optionCount < 3) {
                    this.tests.optionsCount.failed++;
                    this.issues.push({
                        severity: 'error',
                        category: 'Options Count',
                        exerciseId: exercise.id,
                        problem: `Only ${optionCount} option(s) - Need at least 3`,
                        expected: '≥ 3 options',
                        actual: `${optionCount} options`,
                        fix: 'Add more options (correct + common mistake + distractor)'
                    });
                } else {
                    this.tests.optionsCount.passed++;
                }
            }
        });

        console.log(`  ✅ Passed: ${this.tests.optionsCount.passed}`);
        console.log(`  ❌ Failed: ${this.tests.optionsCount.failed}\n`);
    }

    /**
     * TEST 2: Check transformExerciseForUI preserves original options
     */
    testOptionsPreservation() {
        console.log('🔄 TEST 2: Checking options preservation...');

        const exercises = this.mock.exercises;

        exercises.forEach(exercise => {
            if ((exercise.type === 'multiple-choice' || exercise.type === 'conjugation') &&
                exercise.options && exercise.options.length > 0) {

                // Transform exercise through UI layer
                const transformed = this.app.transformExerciseForUI(exercise);

                // Check if options were preserved
                const originalCount = exercise.options.length;
                const transformedCount = transformed.options.length;

                if (originalCount !== transformedCount) {
                    this.tests.optionsPreservation.failed++;
                    this.issues.push({
                        severity: 'error',
                        category: 'Options Preservation',
                        exerciseId: exercise.id,
                        problem: `Options were modified during transform`,
                        expected: `${originalCount} options preserved`,
                        actual: `${transformedCount} options after transform`,
                        fix: 'Check transformExerciseForUI() - should preserve existing options'
                    });
                } else {
                    // Deep check: Are the actual option values preserved?
                    const originalValues = exercise.options.map(o => o.spanish || o.value || o);
                    const transformedValues = transformed.options.map(o => o.spanish || o.value || o);

                    const allPreserved = originalValues.every((val, idx) =>
                        transformedValues.includes(val)
                    );

                    if (!allPreserved) {
                        this.tests.optionsPreservation.failed++;
                        this.issues.push({
                            severity: 'warning',
                            category: 'Options Preservation',
                            exerciseId: exercise.id,
                            problem: `Option values changed during transform`,
                            expected: originalValues.join(', '),
                            actual: transformedValues.join(', '),
                            fix: 'Verify transformExerciseForUI() preserves exact option values'
                        });
                    } else {
                        this.tests.optionsPreservation.passed++;
                    }
                }
            }
        });

        console.log(`  ✅ Passed: ${this.tests.optionsPreservation.passed}`);
        console.log(`  ❌ Failed: ${this.tests.optionsPreservation.failed}\n`);
    }

    /**
     * TEST 3: Check options format consistency (no mixing sentences with single words)
     */
    testOptionsConsistency() {
        console.log('📝 TEST 3: Checking options format consistency...');

        const exercises = this.mock.exercises;

        exercises.forEach(exercise => {
            if ((exercise.type === 'multiple-choice' || exercise.type === 'conjugation') &&
                exercise.options && exercise.options.length > 1) {

                const optionTexts = exercise.options.map(o => o.spanish || o.value || o);

                // Check if mixing full sentences with single words
                const hasSentences = optionTexts.some(text =>
                    text.includes(' ') && text.split(' ').length > 2
                );
                const hasSingleWords = optionTexts.some(text =>
                    !text.includes(' ') || text.split(' ').length === 1
                );

                if (hasSentences && hasSingleWords) {
                    this.tests.optionsConsistency.failed++;
                    this.issues.push({
                        severity: 'error',
                        category: 'Format Consistency',
                        exerciseId: exercise.id,
                        problem: `Mixing full sentences with single words - Too obvious!`,
                        expected: 'All same format (all sentences OR all single words)',
                        actual: optionTexts.join(' | '),
                        fix: 'Use fill-in-the-blank format with single words only'
                    });
                } else {
                    this.tests.optionsConsistency.passed++;
                }
            }
        });

        console.log(`  ✅ Passed: ${this.tests.optionsConsistency.passed}`);
        console.log(`  ❌ Failed: ${this.tests.optionsConsistency.failed}\n`);
    }

    /**
     * TEST 4: Check navigation flow and progress saving
     */
    testNavigationFlow() {
        console.log('🧭 TEST 4: Checking navigation & progress saving...');

        // Test if saveProgress exists and is callable
        if (typeof this.app.saveProgress !== 'function') {
            this.tests.navigation.failed++;
            this.issues.push({
                severity: 'error',
                category: 'Navigation',
                exerciseId: 'N/A',
                problem: 'saveProgress() method not found',
                expected: 'saveProgress() function exists',
                actual: 'Function missing',
                fix: 'Add saveProgress() method to AppController'
            });
        } else {
            this.tests.navigation.passed++;
        }

        // Test if loadNextUnit exists and has saveProgress call
        if (typeof this.app.loadNextUnit !== 'function') {
            this.tests.navigation.failed++;
            this.issues.push({
                severity: 'error',
                category: 'Navigation',
                exerciseId: 'N/A',
                problem: 'loadNextUnit() method not found',
                expected: 'loadNextUnit() function exists',
                actual: 'Function missing',
                fix: 'Add loadNextUnit() method to AppController'
            });
        } else {
            // Check if loadNextUnit calls saveProgress
            const funcString = this.app.loadNextUnit.toString();
            if (!funcString.includes('saveProgress')) {
                this.tests.navigation.failed++;
                this.issues.push({
                    severity: 'warning',
                    category: 'Navigation',
                    exerciseId: 'N/A',
                    problem: 'loadNextUnit() does not call saveProgress()',
                    expected: 'saveProgress() called after loading new unit',
                    actual: 'saveProgress() not found in function',
                    fix: 'Add this.saveProgress() call in loadNextUnit() after loadUnit()'
                });
            } else {
                this.tests.navigation.passed++;
            }
        }

        console.log(`  ✅ Passed: ${this.tests.navigation.passed}`);
        console.log(`  ❌ Failed: ${this.tests.navigation.failed}\n`);
    }

    /**
     * Format report with colors and emojis
     */
    formatReport() {
        const totalTests = Object.values(this.tests).reduce((sum, test) =>
            sum + test.passed + test.failed, 0
        );
        const totalPassed = Object.values(this.tests).reduce((sum, test) =>
            sum + test.passed, 0
        );
        const totalFailed = Object.values(this.tests).reduce((sum, test) =>
            sum + test.failed, 0
        );

        let report = '\n';
        report += '═══════════════════════════════════════════════════════\n';
        report += '          SPANISH APP DEBUGGER REPORT\n';
        report += '═══════════════════════════════════════════════════════\n\n';

        // Summary
        if (this.issues.length === 0) {
            report += '✅✅✅ ALLE BUGS BEHOBEN! ✅✅✅\n\n';
            report += `✅ ${totalPassed}/${totalTests} Tests passed\n`;
            report += '🎉 No issues found!\n\n';
        } else {
            report += `⚠️  ${this.issues.length} ISSUE${this.issues.length > 1 ? 'S' : ''} GEFUNDEN\n\n`;
            report += `✅ ${totalPassed}/${totalTests} Tests passed\n`;
            report += `❌ ${totalFailed}/${totalTests} Tests failed\n\n`;
        }

        // Test breakdown
        report += '📊 TEST RESULTS:\n';
        report += '─────────────────────────────────────────────────────\n';

        Object.entries(this.tests).forEach(([testName, results]) => {
            const status = results.failed === 0 ? '✅' : '❌';
            const name = testName.replace(/([A-Z])/g, ' $1').trim();
            report += `${status} ${name}: ${results.passed} passed, ${results.failed} failed\n`;
        });

        // Detailed issues
        if (this.issues.length > 0) {
            report += '\n📋 DETAILED ISSUES:\n';
            report += '─────────────────────────────────────────────────────\n';

            this.issues.forEach((issue, index) => {
                const icon = issue.severity === 'error' ? '❌' : '⚠️';
                report += `\n${icon} Issue #${index + 1}: ${issue.category}\n`;
                report += `   Exercise: ${issue.exerciseId}\n`;
                report += `   Problem: ${issue.problem}\n`;
                report += `   Expected: ${issue.expected}\n`;
                report += `   Actual: ${issue.actual}\n`;
                report += `   Fix: ${issue.fix}\n`;
            });
        }

        // Recommendations
        if (this.issues.length > 0) {
            report += '\n💡 EMPFEHLUNGEN:\n';
            report += '─────────────────────────────────────────────────────\n';

            const errorCount = this.issues.filter(i => i.severity === 'error').length;
            const warningCount = this.issues.filter(i => i.severity === 'warning').length;

            if (errorCount > 0) {
                report += `❌ ${errorCount} kritische Fehler müssen behoben werden\n`;
            }
            if (warningCount > 0) {
                report += `⚠️  ${warningCount} Warnungen sollten überprüft werden\n`;
            }

            // Category-specific recommendations
            const categories = [...new Set(this.issues.map(i => i.category))];
            categories.forEach(category => {
                const categoryIssues = this.issues.filter(i => i.category === category);
                report += `\n🔧 ${category}: ${categoryIssues.length} issue(s)\n`;

                // Unique fixes for this category
                const fixes = [...new Set(categoryIssues.map(i => i.fix))];
                fixes.forEach(fix => {
                    report += `   • ${fix}\n`;
                });
            });
        }

        report += '\n═══════════════════════════════════════════════════════\n';
        report += `Generated: ${new Date().toLocaleString('de-DE')}\n`;
        report += '═══════════════════════════════════════════════════════\n';

        return report;
    }

    /**
     * Get issues as JSON for programmatic use
     */
    getIssuesJSON() {
        return {
            summary: {
                totalIssues: this.issues.length,
                errors: this.issues.filter(i => i.severity === 'error').length,
                warnings: this.issues.filter(i => i.severity === 'warning').length
            },
            tests: this.tests,
            issues: this.issues,
            timestamp: Date.now()
        };
    }
}

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpanishAppDebugger;
}
