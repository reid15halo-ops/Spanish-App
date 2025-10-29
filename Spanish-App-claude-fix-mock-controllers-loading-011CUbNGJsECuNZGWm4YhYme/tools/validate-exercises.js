/**
 * Exercise Validation & Analysis Tool
 * Analyzes Phase 1 exercise files for adaptive learning compatibility
 */

const fs = require('fs');
const path = require('path');

class ExerciseValidator {
    constructor(exercisesDir) {
        this.exercisesDir = exercisesDir;
        this.requiredFields = {
            // Core fields (should exist)
            core: ['id', 'type', 'difficulty', 'question', 'correctAnswer'],

            // Adaptive system fields (need to add)
            adaptive: ['concept', 'prerequisites', 'relatedConcepts'],

            // Tracker fields (need to add)
            tracker: ['estimatedResponseTime', 'memoryComplexity', 'interferenceRisk', 'spacingMultiplier'],

            // German-Spanish system fields (need to add)
            germanSpanish: ['transferType', 'falseFriendRisk', 'contrastiveElements'],

            // Interleaving fields (need to add)
            interleaving: ['discriminationPairs', 'categoryTags'],

            // Analytics fields (need to add)
            analytics: ['expectedAccuracy', 'milestone', 'certificationRequired']
        };

        this.results = {
            totalExercises: 0,
            byUnit: {},
            fieldCoverage: {},
            criticalIssues: [],
            recommendations: []
        };
    }

    /**
     * Read and parse all exercise files
     */
    async loadExercises() {
        const units = [
            'unit1-pronouns.json',
            'unit2-ser.json',
            'unit3-estar.json',
            'unit4-ser-estar-contrast.json',
            'unit5-tener.json',
            'unit6-vocabulary.json',
            'unit7-integration.json'
        ];

        const exercises = {};

        for (const unitFile of units) {
            const filePath = path.join(this.exercisesDir, unitFile);
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const data = JSON.parse(content);
                const unitId = unitFile.replace('.json', '');
                exercises[unitId] = data;
            } catch (error) {
                console.error(`Error loading ${unitFile}:`, error.message);
            }
        }

        return exercises;
    }

    /**
     * Validate a single exercise
     */
    validateExercise(exercise, unitId) {
        const issues = [];
        const coverage = {
            core: 0,
            adaptive: 0,
            tracker: 0,
            germanSpanish: 0,
            interleaving: 0,
            analytics: 0
        };

        // Check each field category
        for (const [category, fields] of Object.entries(this.requiredFields)) {
            for (const field of fields) {
                if (exercise[field] !== undefined) {
                    coverage[category]++;
                } else {
                    issues.push({
                        field: field,
                        category: category,
                        severity: category === 'core' ? 'critical' : 'warning'
                    });
                }
            }
        }

        return { coverage, issues };
    }

    /**
     * Analyze all exercises
     */
    async analyze() {
        const exercises = await this.loadExercises();

        let totalExercises = 0;
        const allFieldCounts = {};

        // Initialize field coverage tracking
        Object.values(this.requiredFields).flat().forEach(field => {
            allFieldCounts[field] = { present: 0, missing: 0 };
        });

        // Analyze each unit
        for (const [unitId, unitData] of Object.entries(exercises)) {
            const unitExercises = unitData.exercises || [];
            totalExercises += unitExercises.length;

            const unitResults = {
                exercises: unitExercises.length,
                adaptiveReady: 0,
                needsEnhancement: 0,
                criticalIssues: [],
                coverage: {
                    core: 0,
                    adaptive: 0,
                    tracker: 0,
                    germanSpanish: 0,
                    interleaving: 0,
                    analytics: 0
                }
            };

            // Validate each exercise
            for (const exercise of unitExercises) {
                const validation = this.validateExercise(exercise, unitId);

                // Track field coverage
                Object.values(this.requiredFields).flat().forEach(field => {
                    if (exercise[field] !== undefined) {
                        allFieldCounts[field].present++;
                    } else {
                        allFieldCounts[field].missing++;
                    }
                });

                // Aggregate coverage
                Object.keys(validation.coverage).forEach(category => {
                    unitResults.coverage[category] += validation.coverage[category];
                });

                // Check if exercise is adaptive-ready
                const hasAllAdaptive = validation.coverage.adaptive === this.requiredFields.adaptive.length &&
                                      validation.coverage.tracker >= 2;

                if (hasAllAdaptive) {
                    unitResults.adaptiveReady++;
                } else {
                    unitResults.needsEnhancement++;
                }

                // Track critical issues
                const criticalIssues = validation.issues.filter(i => i.severity === 'critical');
                if (criticalIssues.length > 0) {
                    unitResults.criticalIssues.push({
                        exerciseId: exercise.id,
                        issues: criticalIssues
                    });
                }
            }

            // Calculate percentage coverage
            Object.keys(unitResults.coverage).forEach(category => {
                const totalFields = this.requiredFields[category].length * unitExercises.length;
                unitResults.coverage[category] = Math.round((unitResults.coverage[category] / totalFields) * 100);
            });

            this.results.byUnit[unitId] = unitResults;
        }

        // Calculate overall field coverage
        Object.entries(allFieldCounts).forEach(([field, counts]) => {
            const total = counts.present + counts.missing;
            this.results.fieldCoverage[field] = total > 0
                ? `${Math.round((counts.present / total) * 100)}%`
                : '0%';
        });

        // Calculate adaptive compatibility score
        const avgAdaptiveReady = Object.values(this.results.byUnit)
            .reduce((sum, unit) => sum + unit.adaptiveReady, 0);
        const adaptiveCompatibility = Math.round((avgAdaptiveReady / totalExercises) * 100);

        // Generate recommendations
        this.generateRecommendations(adaptiveCompatibility);

        // Set summary
        this.results.summary = {
            totalExercises: totalExercises,
            adaptiveCompatibility: `${adaptiveCompatibility}%`,
            missingFields: Object.entries(allFieldCounts)
                .filter(([field, counts]) => counts.missing > 0)
                .map(([field]) => field),
            criticalIssues: Object.values(this.results.byUnit)
                .flatMap(unit => unit.criticalIssues),
            recommendations: this.results.recommendations
        };

        return this.results;
    }

    /**
     * Generate recommendations based on analysis
     */
    generateRecommendations(compatibilityScore) {
        if (compatibilityScore < 20) {
            this.results.recommendations.push({
                priority: 'CRITICAL',
                message: 'Less than 20% adaptive compatibility. Run migration script immediately.',
                action: 'Execute enhance-exercises-migration.js'
            });
        } else if (compatibilityScore < 50) {
            this.results.recommendations.push({
                priority: 'HIGH',
                message: 'Moderate adaptive compatibility. Enhancement needed for optimal performance.',
                action: 'Run migration script and test with AdaptiveOrchestrator'
            });
        }

        // Check for missing critical fields
        const missingAdaptive = this.results.summary?.missingFields?.filter(f =>
            this.requiredFields.adaptive.includes(f)
        ) || [];

        if (missingAdaptive.length > 0) {
            this.results.recommendations.push({
                priority: 'HIGH',
                message: `Critical adaptive fields missing: ${missingAdaptive.join(', ')}`,
                action: 'These fields are essential for adaptive learning algorithm'
            });
        }

        // Check for German-Spanish system integration
        const missingGS = this.results.summary?.missingFields?.filter(f =>
            this.requiredFields.germanSpanish.includes(f)
        ) || [];

        if (missingGS.length > 0) {
            this.results.recommendations.push({
                priority: 'MEDIUM',
                message: 'German-Spanish contrastive fields missing. This reduces German learner optimization.',
                action: 'Add transferType, falseFriendRisk, and contrastiveElements'
            });
        }

        // Interleaving recommendation
        this.results.recommendations.push({
            priority: 'MEDIUM',
            message: 'Discrimination pairs needed for intelligent interleaving of SER/ESTAR exercises',
            action: 'Link similar exercises across units for contrastive practice'
        });

        // Milestone tracking
        this.results.recommendations.push({
            priority: 'LOW',
            message: 'Milestone and certification tracking will improve motivation',
            action: 'Mark key exercises as milestones and certification requirements'
        });
    }

    /**
     * Generate HTML report
     */
    generateHTMLReport() {
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Exercise Validation Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #2c3e50; }
        h2 { color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        .summary { background: #ecf0f1; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .metric { display: inline-block; margin: 10px 20px; }
        .metric-label { font-weight: bold; color: #7f8c8d; }
        .metric-value { font-size: 24px; color: #2c3e50; }
        .unit-card { background: #fff; border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .coverage-bar { background: #ecf0f1; height: 20px; border-radius: 10px; overflow: hidden; margin: 5px 0; }
        .coverage-fill { background: #3498db; height: 100%; transition: width 0.3s; }
        .recommendations { margin: 20px 0; }
        .recommendation { padding: 10px; margin: 10px 0; border-left: 4px solid #3498db; background: #f8f9fa; }
        .priority-critical { border-color: #e74c3c; }
        .priority-high { border-color: #e67e22; }
        .priority-medium { border-color: #f39c12; }
        .priority-low { border-color: #95a5a6; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #34495e; color: white; }
        .status-good { color: #27ae60; font-weight: bold; }
        .status-warning { color: #e67e22; font-weight: bold; }
        .status-critical { color: #e74c3c; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Exercise Validation Report - Phase 1</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>

        <div class="summary">
            <h2>Summary</h2>
            <div class="metric">
                <div class="metric-label">Total Exercises</div>
                <div class="metric-value">${this.results.summary.totalExercises}</div>
            </div>
            <div class="metric">
                <div class="metric-label">Adaptive Compatibility</div>
                <div class="metric-value ${this.getCompatibilityClass(this.results.summary.adaptiveCompatibility)}">${this.results.summary.adaptiveCompatibility}</div>
            </div>
            <div class="metric">
                <div class="metric-label">Critical Issues</div>
                <div class="metric-value status-critical">${this.results.summary.criticalIssues.length}</div>
            </div>
        </div>

        <h2>📋 Recommendations</h2>
        <div class="recommendations">
            ${this.results.recommendations.map(rec => `
                <div class="recommendation priority-${rec.priority.toLowerCase()}">
                    <strong>[${rec.priority}]</strong> ${rec.message}<br>
                    <em>Action: ${rec.action}</em>
                </div>
            `).join('')}
        </div>

        <h2>📁 By Unit Analysis</h2>
        ${Object.entries(this.results.byUnit).map(([unitId, unit]) => `
            <div class="unit-card">
                <h3>${unitId.replace(/-/g, ' ').toUpperCase()}</h3>
                <p>
                    Total Exercises: ${unit.exercises} |
                    <span class="status-good">Adaptive Ready: ${unit.adaptiveReady}</span> |
                    <span class="status-warning">Needs Enhancement: ${unit.needsEnhancement}</span>
                </p>
                <div>
                    <strong>Coverage:</strong><br>
                    Core: <div class="coverage-bar"><div class="coverage-fill" style="width: ${unit.coverage.core}%"></div></div> ${unit.coverage.core}%<br>
                    Adaptive: <div class="coverage-bar"><div class="coverage-fill" style="width: ${unit.coverage.adaptive}%"></div></div> ${unit.coverage.adaptive}%<br>
                    Tracker: <div class="coverage-bar"><div class="coverage-fill" style="width: ${unit.coverage.tracker}%"></div></div> ${unit.coverage.tracker}%<br>
                    German-Spanish: <div class="coverage-bar"><div class="coverage-fill" style="width: ${unit.coverage.germanSpanish}%"></div></div> ${unit.coverage.germanSpanish}%<br>
                </div>
            </div>
        `).join('')}

        <h2>🔍 Field Coverage</h2>
        <table>
            <tr><th>Field</th><th>Coverage</th><th>Status</th></tr>
            ${Object.entries(this.results.fieldCoverage).map(([field, coverage]) => `
                <tr>
                    <td>${field}</td>
                    <td>${coverage}</td>
                    <td class="${this.getFieldStatusClass(coverage)}">${this.getFieldStatus(coverage)}</td>
                </tr>
            `).join('')}
        </table>
    </div>
</body>
</html>`;

        return html;
    }

    getCompatibilityClass(percentage) {
        const num = parseInt(percentage);
        if (num >= 80) return 'status-good';
        if (num >= 50) return 'status-warning';
        return 'status-critical';
    }

    getFieldStatus(coverage) {
        const num = parseInt(coverage);
        if (num === 100) return '✅ Complete';
        if (num >= 50) return '⚠️ Partial';
        if (num > 0) return '❌ Minimal';
        return '❌ Missing';
    }

    getFieldStatusClass(coverage) {
        const num = parseInt(coverage);
        if (num === 100) return 'status-good';
        if (num >= 50) return 'status-warning';
        return 'status-critical';
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ExerciseValidator };
}

// CLI execution
if (require.main === module) {
    const exercisesDir = path.join(__dirname, '..', 'data', 'phase1-exercises');
    const validator = new ExerciseValidator(exercisesDir);

    validator.analyze().then(results => {
        // Output JSON report
        console.log('=== JSON REPORT ===');
        console.log(JSON.stringify(results, null, 2));

        // Save HTML report
        const html = validator.generateHTMLReport();
        const reportPath = path.join(__dirname, '..', 'EXERCISE-VALIDATION-REPORT.html');
        fs.writeFileSync(reportPath, html);
        console.log(`\n✅ HTML report saved to: ${reportPath}`);

        // Save JSON report
        const jsonPath = path.join(__dirname, '..', 'EXERCISE-VALIDATION-REPORT.json');
        fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
        console.log(`✅ JSON report saved to: ${jsonPath}`);
    }).catch(error => {
        console.error('❌ Validation error:', error);
        process.exit(1);
    });
}
