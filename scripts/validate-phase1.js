/**
 * Phase 1 Exercise Validation and Quality Enhancement
 *
 * Validates all Phase 1 exercises for production release:
 * - Content correctness
 * - Structural consistency
 * - German bridge completeness
 * - Difficulty progression
 * - Mobile UX optimization
 */

const fs = require('fs');
const path = require('path');

class Phase1Validator {
    constructor(rootDir) {
        this.rootDir = rootDir;
        this.dataDir = path.join(rootDir, 'data', 'phase1-exercises');

        this.report = {
            timestamp: new Date().toISOString(),
            totalExercises: 0,
            validExercises: 0,
            errors: [],
            warnings: [],
            improvements: [],
            germanBridges: {
                complete: 0,
                missing: 0,
                enhanced: []
            },
            difficulty: {
                byLevel: {},
                progression: []
            }
        };

        this.germanBridgeTemplates = {
            'self-introduction': '🇩🇪→🇪🇸 Deutsche Struktur ähnlich: "Ich bin" → "Yo soy"',
            'name-introduction': '🇩🇪→🇪🇸 "Ich heiße" → "Me llamo" (wörtlich: "Ich rufe mich")',
            'origin': '🇩🇪→🇪🇸 "aus Deutschland" → "de Alemania" (verwende SER)',
            'profession': '🇩🇪→🇪🇸 Beruf mit SER: "Ich bin Arzt" → "Soy médico"',
            'ser-conjugation': '🇩🇪→🇪🇸 SER = sein (Identität, Eigenschaften, Herkunft)',
            'estar-conjugation': '🇩🇪→🇪🇸 ESTAR = sein (Zustand, Ort, Gefühle)',
            'ser-vs-estar': '🇩🇪→🇪🇸 SER = permanent (Beruf), ESTAR = temporär (Zustand)',
            'location': '🇩🇪→🇪🇸 Ort mit ESTAR: "Ich bin zu Hause" → "Estoy en casa"',
            'emotion': '🇩🇪→🇪🇸 Gefühl mit ESTAR: "Ich bin müde" → "Estoy cansado"',
            'tener': '🇩🇪→🇪🇸 TENER = haben (Besitz und feste Ausdrücke)',
            'tener-expressions': '🇩🇪→🇪🇸 "Ich habe Hunger" → "Tengo hambre" (nicht mit "ser"!)'
        };
    }

    /**
     * Validate all Phase 1 units
     */
    async validateAll() {
        console.log('🔍 Starting Phase 1 Validation...\n');

        const units = [
            'unit1-pronouns.json',
            'unit2-ser.json',
            'unit3-estar.json',
            'unit4-ser-estar-contrast.json',
            'unit5-tener.json',
            'unit6-vocabulary.json',
            'unit7-integration.json'
        ];

        for (const unitFile of units) {
            await this.validateUnit(unitFile);
        }

        this.generateReport();
        this.saveReport();

        return this.report;
    }

    /**
     * Validate a single unit
     */
    async validateUnit(filename) {
        const filePath = path.join(this.dataDir, filename);

        if (!fs.existsSync(filePath)) {
            this.report.errors.push({
                unit: filename,
                error: 'File not found',
                severity: 'critical'
            });
            return;
        }

        console.log(`📚 Validating ${filename}...`);

        let data;
        try {
            data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (error) {
            this.report.errors.push({
                unit: filename,
                error: `JSON parse error: ${error.message}`,
                severity: 'critical'
            });
            return;
        }

        // Validate metadata
        this.validateMetadata(data, filename);

        // Validate each exercise
        if (data.exercises && Array.isArray(data.exercises)) {
            data.exercises.forEach((exercise, index) => {
                this.validateExercise(exercise, filename, index);
            });
        } else {
            this.report.errors.push({
                unit: filename,
                error: 'No exercises array found',
                severity: 'critical'
            });
        }
    }

    /**
     * Validate unit metadata
     */
    validateMetadata(data, filename) {
        const required = ['metadata', 'learningPhases', 'exercises'];

        required.forEach(field => {
            if (!data[field]) {
                this.report.warnings.push({
                    unit: filename,
                    warning: `Missing ${field}`,
                    severity: 'medium'
                });
            }
        });

        if (data.metadata) {
            const metaRequired = ['unit', 'phase', 'level', 'totalExercises'];
            metaRequired.forEach(field => {
                if (!data.metadata[field]) {
                    this.report.warnings.push({
                        unit: filename,
                        warning: `Missing metadata.${field}`,
                        severity: 'low'
                    });
                }
            });
        }
    }

    /**
     * Validate a single exercise
     */
    validateExercise(exercise, unit, index) {
        this.report.totalExercises++;

        let isValid = true;

        // 1. Check required fields
        const requiredFields = ['id', 'type', 'difficulty'];
        requiredFields.forEach(field => {
            if (!exercise[field]) {
                this.report.errors.push({
                    unit,
                    exercise: index + 1,
                    id: exercise.id,
                    error: `Missing required field: ${field}`,
                    severity: 'high'
                });
                isValid = false;
            }
        });

        // 2. Validate question/content
        this.validateQuestionContent(exercise, unit, index);

        // 3. Validate answer structure
        this.validateAnswers(exercise, unit, index);

        // 4. Check German bridge
        this.validateGermanBridge(exercise, unit, index);

        // 5. Validate difficulty
        this.validateDifficulty(exercise, unit, index);

        // 6. Check mobile-friendliness
        this.checkMobileUX(exercise, unit, index);

        if (isValid) {
            this.report.validExercises++;
        }
    }

    /**
     * Validate question content
     */
    validateQuestionContent(exercise, unit, index) {
        // Check if question exists for interactive exercises
        const interactiveTypes = ['fill-blank', 'multiple-choice', 'translation', 'sentence-building'];

        if (interactiveTypes.includes(exercise.type) && !exercise.question) {
            this.report.warnings.push({
                unit,
                exercise: index + 1,
                id: exercise.id,
                warning: 'Interactive exercise missing question',
                severity: 'medium'
            });
        }

        // Check question length (cognitive load)
        if (exercise.question && exercise.question.length > 100) {
            this.report.improvements.push({
                unit,
                exercise: index + 1,
                id: exercise.id,
                suggestion: `Question too long (${exercise.question.length} chars). Consider splitting for better cognitive load.`,
                type: 'cognitive-load'
            });
        }

        // Check for German umlauts in Spanish content
        const spanishFields = ['correctAnswer', 'word'];
        spanishFields.forEach(field => {
            if (exercise[field] && /[äöüÄÖÜß]/.test(exercise[field])) {
                this.report.warnings.push({
                    unit,
                    exercise: index + 1,
                    id: exercise.id,
                    warning: `German umlauts in Spanish content (${field})`,
                    severity: 'medium'
                });
            }
        });
    }

    /**
     * Validate answer structure
     */
    validateAnswers(exercise, unit, index) {
        switch (exercise.type) {
            case 'multiple-choice':
                this.validateMultipleChoice(exercise, unit, index);
                break;

            case 'fill-blank':
            case 'translation':
                this.validateTextInput(exercise, unit, index);
                break;

            case 'reading-comprehension':
                this.validateReadingComprehension(exercise, unit, index);
                break;
        }
    }

    /**
     * Validate multiple choice structure
     */
    validateMultipleChoice(exercise, unit, index) {
        if (!exercise.options || !Array.isArray(exercise.options)) {
            this.report.errors.push({
                unit,
                exercise: index + 1,
                id: exercise.id,
                error: 'Multiple choice missing options array',
                severity: 'high'
            });
            return;
        }

        if (exercise.options.length < 2) {
            this.report.warnings.push({
                unit,
                exercise: index + 1,
                id: exercise.id,
                warning: 'Multiple choice has less than 2 options',
                severity: 'high'
            });
        }

        if (exercise.options.length > 6) {
            this.report.improvements.push({
                unit,
                exercise: index + 1,
                id: exercise.id,
                suggestion: 'Too many options (>6) may overwhelm learners',
                type: 'cognitive-load'
            });
        }

        // Check if correct answer is in options
        if (exercise.correctAnswer && !exercise.options.includes(exercise.correctAnswer)) {
            this.report.errors.push({
                unit,
                exercise: index + 1,
                id: exercise.id,
                error: 'Correct answer not found in options',
                severity: 'critical'
            });
        }

        // Check for duplicate options
        const uniqueOptions = new Set(exercise.options);
        if (uniqueOptions.size !== exercise.options.length) {
            this.report.warnings.push({
                unit,
                exercise: index + 1,
                id: exercise.id,
                warning: 'Duplicate options detected',
                severity: 'medium'
            });
        }
    }

    /**
     * Validate text input exercises
     */
    validateTextInput(exercise, unit, index) {
        if (!exercise.correctAnswer) {
            this.report.errors.push({
                unit,
                exercise: index + 1,
                id: exercise.id,
                error: 'Missing correct answer',
                severity: 'critical'
            });
        }

        // Check if alternative answers exist (good practice)
        if (!exercise.alternativeAnswers && exercise.type === 'translation') {
            this.report.improvements.push({
                unit,
                exercise: index + 1,
                id: exercise.id,
                suggestion: 'Consider adding alternative correct answers for flexibility',
                type: 'flexibility'
            });
        }
    }

    /**
     * Validate reading comprehension
     */
    validateReadingComprehension(exercise, unit, index) {
        if (!exercise.dialog || !Array.isArray(exercise.dialog)) {
            this.report.errors.push({
                unit,
                exercise: index + 1,
                id: exercise.id,
                error: 'Reading comprehension missing dialog',
                severity: 'high'
            });
        }

        if (!exercise.comprehensionCheck) {
            this.report.errors.push({
                unit,
                exercise: index + 1,
                id: exercise.id,
                error: 'Reading comprehension missing comprehensionCheck',
                severity: 'high'
            });
        } else {
            this.validateMultipleChoice({
                ...exercise,
                options: exercise.comprehensionCheck.options,
                correctAnswer: exercise.comprehensionCheck.correctAnswer
            }, unit, index);
        }
    }

    /**
     * Validate German bridge explanation
     */
    validateGermanBridge(exercise, unit, index) {
        if (exercise.germanBridge) {
            this.report.germanBridges.complete++;

            // Check quality
            if (exercise.germanBridge.length < 10) {
                this.report.improvements.push({
                    unit,
                    exercise: index + 1,
                    id: exercise.id,
                    suggestion: 'German bridge too short - consider adding more explanation',
                    type: 'german-bridge'
                });
            }
        } else {
            this.report.germanBridges.missing++;

            // Suggest German bridge based on concept
            const suggested = this.suggestGermanBridge(exercise);
            if (suggested) {
                this.report.germanBridges.enhanced.push({
                    unit,
                    exercise: index + 1,
                    id: exercise.id,
                    concept: exercise.concept,
                    suggested
                });
            }
        }
    }

    /**
     * Suggest German bridge based on concept
     */
    suggestGermanBridge(exercise) {
        const concept = exercise.concept || '';

        for (const [key, template] of Object.entries(this.germanBridgeTemplates)) {
            if (concept.includes(key)) {
                return template;
            }
        }

        // Fallback based on type
        if (exercise.type === 'vocabulary-card' && exercise.word) {
            return `🇩🇪→🇪🇸 ${exercise.translation || 'Deutsche Bedeutung'} → ${exercise.word}`;
        }

        return null;
    }

    /**
     * Validate difficulty level
     */
    validateDifficulty(exercise, unit, index) {
        const difficulty = exercise.difficulty;

        if (difficulty < 1 || difficulty > 5) {
            this.report.warnings.push({
                unit,
                exercise: index + 1,
                id: exercise.id,
                warning: `Difficulty ${difficulty} outside expected range (1-5)`,
                severity: 'low'
            });
        }

        // Track difficulty distribution
        this.report.difficulty.byLevel[difficulty] =
            (this.report.difficulty.byLevel[difficulty] || 0) + 1;
    }

    /**
     * Check mobile UX considerations
     */
    checkMobileUX(exercise, unit, index) {
        // Check if options are too long for mobile
        if (exercise.options) {
            exercise.options.forEach((option, optIndex) => {
                if (option.length > 80) {
                    this.report.improvements.push({
                        unit,
                        exercise: index + 1,
                        id: exercise.id,
                        suggestion: `Option ${optIndex + 1} too long for mobile (${option.length} chars)`,
                        type: 'mobile-ux'
                    });
                }
            });
        }

        // Check if question is too long for mobile
        if (exercise.question && exercise.question.length > 120) {
            this.report.improvements.push({
                unit,
                exercise: index + 1,
                id: exercise.id,
                suggestion: 'Question may be too long for mobile screens',
                type: 'mobile-ux'
            });
        }
    }

    /**
     * Generate summary statistics
     */
    generateReport() {
        console.log('\n📊 Generating Validation Report...\n');

        this.report.summary = {
            totalExercises: this.report.totalExercises,
            validExercises: this.report.validExercises,
            validPercentage: Math.round((this.report.validExercises / this.report.totalExercises) * 100),

            issues: {
                critical: this.report.errors.filter(e => e.severity === 'critical').length,
                high: this.report.errors.filter(e => e.severity === 'high').length,
                medium: this.report.warnings.filter(w => w.severity === 'medium').length,
                low: this.report.warnings.filter(w => w.severity === 'low').length
            },

            improvements: {
                total: this.report.improvements.length,
                byType: this.groupBy(this.report.improvements, 'type')
            },

            germanBridges: {
                completionRate: Math.round((this.report.germanBridges.complete / this.report.totalExercises) * 100) + '%',
                complete: this.report.germanBridges.complete,
                missing: this.report.germanBridges.missing,
                enhanced: this.report.germanBridges.enhanced.length
            },

            difficulty: {
                distribution: this.report.difficulty.byLevel,
                balance: this.assessDifficultyBalance()
            }
        };

        // Print summary
        console.log('='.repeat(60));
        console.log('PHASE 1 VALIDATION SUMMARY');
        console.log('='.repeat(60));
        console.log(`\n📚 Exercises: ${this.report.totalExercises}`);
        console.log(`✅ Valid: ${this.report.validExercises} (${this.report.summary.validPercentage}%)`);

        console.log(`\n🐛 Issues Found:`);
        console.log(`   Critical: ${this.report.summary.issues.critical}`);
        console.log(`   High: ${this.report.summary.issues.high}`);
        console.log(`   Medium: ${this.report.summary.issues.medium}`);
        console.log(`   Low: ${this.report.summary.issues.low}`);

        console.log(`\n💡 Improvements Suggested: ${this.report.improvements.length}`);

        console.log(`\n🇩🇪 German Bridges:`);
        console.log(`   Completion: ${this.report.summary.germanBridges.completionRate}`);
        console.log(`   Complete: ${this.report.germanBridges.complete}`);
        console.log(`   Missing: ${this.report.germanBridges.missing}`);
        console.log(`   Enhanced: ${this.report.germanBridges.enhanced.length}`);

        console.log(`\n📊 Difficulty Distribution:`);
        Object.entries(this.report.difficulty.byLevel).forEach(([level, count]) => {
            const percentage = Math.round((count / this.report.totalExercises) * 100);
            console.log(`   Level ${level}: ${count} (${percentage}%)`);
        });
    }

    /**
     * Assess difficulty balance
     */
    assessDifficultyBalance() {
        const total = this.report.totalExercises;
        const dist = this.report.difficulty.byLevel;

        // Ideal distribution: progressive increase
        // Level 1: 40%, Level 2: 30%, Level 3: 20%, Level 4: 8%, Level 5: 2%
        const ideal = { 1: 0.40, 2: 0.30, 3: 0.20, 4: 0.08, 5: 0.02 };

        let balance = 'good';
        let reasons = [];

        Object.entries(ideal).forEach(([level, expectedPct]) => {
            const actualCount = dist[level] || 0;
            const actualPct = actualCount / total;
            const diff = Math.abs(actualPct - expectedPct);

            if (diff > 0.15) {
                balance = 'needs-adjustment';
                reasons.push(`Level ${level}: ${Math.round(actualPct * 100)}% (expected ${Math.round(expectedPct * 100)}%)`);
            }
        });

        return { status: balance, reasons };
    }

    /**
     * Group items by property
     */
    groupBy(items, property) {
        return items.reduce((acc, item) => {
            const key = item[property] || 'other';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
    }

    /**
     * Save report to file
     */
    saveReport() {
        const reportPath = path.join(this.rootDir, 'validation-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2), 'utf-8');
        console.log(`\n✅ Report saved to: validation-report.json\n`);
    }
}

// Run validation
if (require.main === module) {
    const validator = new Phase1Validator(process.cwd());

    validator.validateAll()
        .then(() => {
            console.log('✅ Validation complete!');
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Validation failed:', error);
            process.exit(1);
        });
}

module.exports = Phase1Validator;
