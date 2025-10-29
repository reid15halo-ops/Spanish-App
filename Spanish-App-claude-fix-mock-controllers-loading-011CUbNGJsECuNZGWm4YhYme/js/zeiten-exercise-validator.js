/**
 * Zeiten Exercise Validator
 * Tests 100+ generated exercises to ensure quality
 * No-Gamification compliant
 */

class ZeitenExerciseValidator {
    constructor(generator) {
        this.generator = generator;
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            errors: [],
            byType: {},
            byDifficulty: {}
        };
    }

    /**
     * Run comprehensive validation
     */
    async runFullValidation(count = 100) {
        console.log(`?? Starting validation of ${count} exercises...`);
        console.log('???????????????????????????????????????');
        
        const startTime = Date.now();
        
        // Test each exercise type
        await this.testExerciseTypes();
        
        // Generate and validate batch
        await this.validateBatch(count);
        
        // Test specific scenarios
        await this.testEdgeCases();
        
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        
        console.log('???????????????????????????????????????');
        console.log(`? Validation complete in ${duration}s`);
        
        this.printSummary();
        
        return this.results;
    }

    /**
     * Test all exercise types
     */
    async testExerciseTypes() {
        console.log('\n?? Testing Exercise Types...');
        
        const types = [
            'conjugate',
            'fill_gap',
            'identify_tense',
            'build_sentence',
            'gerundio_participio'
        ];

        for (const type of types) {
            console.log(`  Testing: ${type}`);
            
            try {
                const exercise = this.generator.generateExercise(type);
                const validation = this.validateExerciseStructure(exercise, type);
                
                if (validation.valid) {
                    console.log(`    ? ${type}: Structure valid`);
                    this.results.passed++;
                } else {
                    console.error(`    ? ${type}: ${validation.errors.join(', ')}`);
                    this.results.failed++;
                    this.results.errors.push({
                        type: type,
                        errors: validation.errors
                    });
                }
                
                this.results.total++;
                
                // Track by type
                if (!this.results.byType[type]) {
                    this.results.byType[type] = { passed: 0, failed: 0 };
                }
                
                if (validation.valid) {
                    this.results.byType[type].passed++;
                } else {
                    this.results.byType[type].failed++;
                }
                
            } catch (error) {
                console.error(`    ? ${type}: Exception - ${error.message}`);
                this.results.failed++;
                this.results.total++;
                this.results.errors.push({
                    type: type,
                    error: error.message
                });
            }
        }
    }

    /**
     * Validate batch of exercises
     */
    async validateBatch(count) {
        console.log(`\n?? Validating batch of ${count} exercises...`);
        
        const difficulties = ['easy', 'medium', 'hard'];
        const exercisesPerDifficulty = Math.floor(count / difficulties.length);
        
        for (const difficulty of difficulties) {
            console.log(`  Difficulty: ${difficulty}`);
            
            const filters = { difficulty: difficulty };
            const batch = this.generator.generateBatch(exercisesPerDifficulty, filters);
            
            console.log(`    Generated: ${batch.length} exercises`);
            
            for (let i = 0; i < batch.length; i++) {
                const exercise = batch[i];
                const validation = this.validateExerciseStructure(exercise);
                
                this.results.total++;
                
                if (validation.valid) {
                    this.results.passed++;
                } else {
                    this.results.failed++;
                    this.results.errors.push({
                        difficulty: difficulty,
                        index: i,
                        type: exercise.type,
                        errors: validation.errors
                    });
                }
                
                // Track by difficulty
                if (!this.results.byDifficulty[difficulty]) {
                    this.results.byDifficulty[difficulty] = { passed: 0, failed: 0 };
                }
                
                if (validation.valid) {
                    this.results.byDifficulty[difficulty].passed++;
                } else {
                    this.results.byDifficulty[difficulty].failed++;
                }
            }
            
            const diffStats = this.results.byDifficulty[difficulty];
            const diffRate = ((diffStats.passed / (diffStats.passed + diffStats.failed)) * 100).toFixed(1);
            console.log(`    Success rate: ${diffRate}%`);
        }
    }

    /**
     * Test edge cases
     */
    async testEdgeCases() {
        console.log('\n?? Testing Edge Cases...');
        
        // Test 1: All tenses
        console.log('  Test 1: All tenses');
        const tenses = ['presente', 'preterito', 'imperfecto', 'futuro', 'condicional', 'perfecto', 'pluscuamperfecto'];
        
        for (const tense of tenses) {
            try {
                const exercise = this.generator.generateExercise('conjugate', { tense: tense });
                if (exercise.tense === tense) {
                    console.log(`    ? ${tense}: Generated correctly`);
                } else {
                    console.error(`    ? ${tense}: Wrong tense generated`);
                }
            } catch (error) {
                console.error(`    ? ${tense}: Error - ${error.message}`);
            }
        }

        // Test 2: All persons
        console.log('  Test 2: All persons');
        const persons = ['yo', 'tu', 'el', 'nosotros', 'vosotros', 'ellos'];
        
        for (const person of persons) {
            try {
                const exercise = this.generator.generateExercise('conjugate', { person: person });
                if (exercise.person === person) {
                    console.log(`    ? ${person}: Generated correctly`);
                } else {
                    console.error(`    ? ${person}: Wrong person generated`);
                }
            } catch (error) {
                console.error(`    ? ${person}: Error - ${error.message}`);
            }
        }

        // Test 3: Validation functions
        console.log('  Test 3: Validation functions');
        
        const testCases = [
            { input: 'hablo', correct: 'hablo', expected: true },
            { input: 'háblá', correct: 'habla', expected: false }, // Wrong accents
            { input: 'habla', correct: 'habla', expected: true },
            { input: 'hablamos', correct: 'hablamos', expected: true },
            { input: 'como', correct: 'como', expected: true },
            { input: 'comió', correct: 'comio', expected: true }, // Accent-tolerant
        ];

        for (const test of testCases) {
            const result = this.generator.validateConjugation(test.input, test.correct);
            const passed = result.correct === test.expected;
            
            if (passed) {
                console.log(`    ? Validation: "${test.input}" vs "${test.correct}"`);
            } else {
                console.error(`    ? Validation: "${test.input}" vs "${test.correct}" - Expected ${test.expected}, got ${result.correct}`);
            }
        }
    }

    /**
     * Validate exercise structure
     */
    validateExerciseStructure(exercise, expectedType = null) {
        const errors = [];
        
        // Check required fields
        if (!exercise.type) errors.push('Missing type');
        if (!exercise.id) errors.push('Missing id');
        if (!exercise.prompt) errors.push('Missing prompt');
        if (!exercise.correctAnswer && exercise.type !== 'identify_tense') errors.push('Missing correctAnswer');
        if (typeof exercise.validate !== 'function') errors.push('Missing validate function');
        if (!exercise.hints || !Array.isArray(exercise.hints)) errors.push('Missing or invalid hints');
        
        // Check type-specific fields
        if (expectedType && exercise.type !== expectedType) {
            errors.push(`Wrong type: expected ${expectedType}, got ${exercise.type}`);
        }
        
        switch (exercise.type) {
            case 'conjugate':
                if (!exercise.verb) errors.push('Missing verb');
                if (!exercise.tense) errors.push('Missing tense');
                if (!exercise.person) errors.push('Missing person');
                break;
                
            case 'fill_gap':
                if (!exercise.sentence) errors.push('Missing sentence');
                if (!exercise.verb) errors.push('Missing verb');
                if (!exercise.tense) errors.push('Missing tense');
                break;
                
            case 'identify_tense':
                if (!exercise.conjugatedForm) errors.push('Missing conjugatedForm');
                if (!exercise.correctTense) errors.push('Missing correctTense');
                if (!exercise.correctPerson) errors.push('Missing correctPerson');
                if (!exercise.tenseOptions) errors.push('Missing tenseOptions');
                if (!exercise.personOptions) errors.push('Missing personOptions');
                break;
                
            case 'build_sentence':
                if (!exercise.tokens || !Array.isArray(exercise.tokens)) errors.push('Missing or invalid tokens');
                if (!exercise.correctSentence) errors.push('Missing correctSentence');
                break;
                
            case 'gerundio_participio':
                if (!exercise.formType) errors.push('Missing formType');
                if (!exercise.verb) errors.push('Missing verb');
                if (!exercise.context) errors.push('Missing context');
                break;
        }
        
        // Check difficulty
        if (exercise.difficulty && !['easy', 'medium', 'hard'].includes(exercise.difficulty)) {
            errors.push('Invalid difficulty level');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Print validation summary
     */
    printSummary() {
        console.log('\n???????????????????????????????????????');
        console.log('?? VALIDATION SUMMARY');
        console.log('???????????????????????????????????????');
        console.log(`Total Exercises: ${this.results.total}`);
        console.log(`Passed: ${this.results.passed} (${((this.results.passed / this.results.total) * 100).toFixed(1)}%)`);
        console.log(`Failed: ${this.results.failed} (${((this.results.failed / this.results.total) * 100).toFixed(1)}%)`);
        
        console.log('\n?? By Exercise Type:');
        Object.keys(this.results.byType).forEach(type => {
            const stats = this.results.byType[type];
            const total = stats.passed + stats.failed;
            const rate = ((stats.passed / total) * 100).toFixed(1);
            console.log(`  ${type}: ${stats.passed}/${total} (${rate}%)`);
        });
        
        console.log('\n?? By Difficulty:');
        Object.keys(this.results.byDifficulty).forEach(difficulty => {
            const stats = this.results.byDifficulty[difficulty];
            const total = stats.passed + stats.failed;
            const rate = ((stats.passed / total) * 100).toFixed(1);
            console.log(`  ${difficulty}: ${stats.passed}/${total} (${rate}%)`);
        });
        
        if (this.results.errors.length > 0) {
            console.log('\n? Errors:');
            this.results.errors.slice(0, 10).forEach((error, index) => {
                console.log(`  ${index + 1}. ${JSON.stringify(error)}`);
            });
            
            if (this.results.errors.length > 10) {
                console.log(`  ... and ${this.results.errors.length - 10} more errors`);
            }
        }
        
        console.log('\n???????????????????????????????????????');
        
        const overallSuccess = this.results.passed >= (this.results.total * 0.95); // 95% threshold
        
        if (overallSuccess) {
            console.log('? VALIDATION PASSED: Exercise system is ready for production!');
        } else {
            console.log('?? VALIDATION WARNING: Some exercises failed. Review errors above.');
        }
        
        console.log('???????????????????????????????????????\n');
    }

    /**
     * Export results to JSON
     */
    exportResults() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.results.total,
                passed: this.results.passed,
                failed: this.results.failed,
                successRate: ((this.results.passed / this.results.total) * 100).toFixed(2) + '%'
            },
            byType: this.results.byType,
            byDifficulty: this.results.byDifficulty,
            errors: this.results.errors
        };
        
        // Save to localStorage
        try {
            localStorage.setItem('zeiten-exercise-validation-report', JSON.stringify(report));
            console.log('?? Report saved to localStorage');
        } catch (error) {
            console.warn('Could not save report to localStorage:', error);
        }
        
        return report;
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.ZeitenExerciseValidator = ZeitenExerciseValidator;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZeitenExerciseValidator;
}
