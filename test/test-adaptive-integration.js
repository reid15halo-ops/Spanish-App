/**
 * Integration Test: Enhanced Exercises with Adaptive Learning Systems
 * Tests compatibility of enhanced exercise database with all adaptive systems
 */

const fs = require('fs');
const path = require('path');

// Mock the adaptive systems if they're not available as Node modules
// In production, these would be actual imports

class AdaptiveIntegrationTest {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            totalTests: 0,
            passed: 0,
            failed: 0,
            tests: []
        };
    }

    /**
     * Load enhanced exercises
     */
    loadExercises() {
        const exercisesDir = path.join(__dirname, '..', 'data', 'phase1-exercises');
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
            const filePath = path.join(exercisesDir, unitFile);
            const content = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);
            const unitId = unitFile.replace('.json', '');
            exercises[unitId] = data;
        }

        return exercises;
    }

    /**
     * Test helper
     */
    test(name, testFn) {
        this.results.totalTests++;
        try {
            testFn();
            this.results.passed++;
            this.results.tests.push({ name, status: 'PASS', error: null });
            console.log(`✅ PASS: ${name}`);
        } catch (error) {
            this.results.failed++;
            this.results.tests.push({ name, status: 'FAIL', error: error.message });
            console.log(`❌ FAIL: ${name}`);
            console.log(`   Error: ${error.message}`);
        }
    }

    /**
     * Assertion helper
     */
    assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }

    /**
     * Test 1: All exercises have required adaptive fields
     */
    testRequiredFieldsPresent(exercises) {
        const requiredFields = [
            'id', 'type', 'difficulty', 'concept',
            'prerequisites', 'relatedConcepts', 'discriminationPairs', 'categoryTags',
            'estimatedResponseTime', 'memoryComplexity', 'interferenceRisk', 'spacingMultiplier',
            'transferType', 'falseFriendRisk', 'contrastiveElements',
            'expectedAccuracy', 'milestone', 'certificationRequired'
        ];

        let totalExercises = 0;
        let completeExercises = 0;

        for (const [unitId, unitData] of Object.entries(exercises)) {
            for (const exercise of unitData.exercises) {
                totalExercises++;
                const missingFields = requiredFields.filter(field => exercise[field] === undefined);
                if (missingFields.length === 0) {
                    completeExercises++;
                }
            }
        }

        this.test('All exercises have required fields', () => {
            this.assert(
                completeExercises === totalExercises,
                `Only ${completeExercises}/${totalExercises} exercises have all required fields`
            );
        });
    }

    /**
     * Test 2: Prerequisites form valid dependency graph
     */
    testPrerequisitesValid(exercises) {
        const allConcepts = new Set();
        const allPrereqs = new Set();

        // Collect all concepts and prerequisites
        for (const [unitId, unitData] of Object.entries(exercises)) {
            for (const exercise of unitData.exercises) {
                if (exercise.concept) {
                    allConcepts.add(exercise.concept);
                }
                if (exercise.prerequisites) {
                    exercise.prerequisites.forEach(prereq => allPrereqs.add(prereq));
                }
            }
        }

        this.test('Prerequisites reference valid concepts', () => {
            const invalidPrereqs = [...allPrereqs].filter(prereq => !allConcepts.has(prereq));
            this.assert(
                invalidPrereqs.length === 0,
                `Found ${invalidPrereqs.length} invalid prerequisites: ${invalidPrereqs.slice(0, 5).join(', ')}`
            );
        });
    }

    /**
     * Test 3: Discrimination pairs reference valid exercise IDs
     */
    testDiscriminationPairsValid(exercises) {
        const allExerciseIds = new Set();

        // Collect all exercise IDs
        for (const [unitId, unitData] of Object.entries(exercises)) {
            for (const exercise of unitData.exercises) {
                allExerciseIds.add(exercise.id);
            }
        }

        let invalidPairs = 0;
        for (const [unitId, unitData] of Object.entries(exercises)) {
            for (const exercise of unitData.exercises) {
                if (exercise.discriminationPairs) {
                    exercise.discriminationPairs.forEach(pairId => {
                        if (!allExerciseIds.has(pairId)) {
                            invalidPairs++;
                        }
                    });
                }
            }
        }

        this.test('Discrimination pairs reference valid exercise IDs', () => {
            this.assert(
                invalidPairs === 0,
                `Found ${invalidPairs} invalid discrimination pair references`
            );
        });
    }

    /**
     * Test 4: Memory complexity matches difficulty range
     */
    testMemoryComplexityValid(exercises) {
        let outOfRange = 0;

        for (const [unitId, unitData] of Object.entries(exercises)) {
            for (const exercise of unitData.exercises) {
                if (exercise.memoryComplexity < 1 || exercise.memoryComplexity > 10) {
                    outOfRange++;
                }
            }
        }

        this.test('Memory complexity in valid range (1-10)', () => {
            this.assert(
                outOfRange === 0,
                `Found ${outOfRange} exercises with invalid memory complexity`
            );
        });
    }

    /**
     * Test 5: Interference risk has valid values
     */
    testInterferenceRiskValid(exercises) {
        const validRisks = ['very-low', 'low', 'medium', 'high', 'very-high'];
        let invalidRisks = 0;

        for (const [unitId, unitData] of Object.entries(exercises)) {
            for (const exercise of unitData.exercises) {
                if (!validRisks.includes(exercise.interferenceRisk)) {
                    invalidRisks++;
                }
            }
        }

        this.test('Interference risk has valid values', () => {
            this.assert(
                invalidRisks === 0,
                `Found ${invalidRisks} exercises with invalid interference risk`
            );
        });
    }

    /**
     * Test 6: Transfer type has valid values
     */
    testTransferTypeValid(exercises) {
        const validTypes = ['positive', 'negative', 'neutral'];
        let invalidTypes = 0;

        for (const [unitId, unitData] of Object.entries(exercises)) {
            for (const exercise of unitData.exercises) {
                if (!validTypes.includes(exercise.transferType)) {
                    invalidTypes++;
                }
            }
        }

        this.test('Transfer type has valid values', () => {
            this.assert(
                invalidTypes === 0,
                `Found ${invalidTypes} exercises with invalid transfer type`
            );
        });
    }

    /**
     * Test 7: Expected accuracy in valid range
     */
    testExpectedAccuracyValid(exercises) {
        let outOfRange = 0;

        for (const [unitId, unitData] of Object.entries(exercises)) {
            for (const exercise of unitData.exercises) {
                if (exercise.expectedAccuracy < 0 || exercise.expectedAccuracy > 1) {
                    outOfRange++;
                }
            }
        }

        this.test('Expected accuracy in valid range (0-1)', () => {
            this.assert(
                outOfRange === 0,
                `Found ${outOfRange} exercises with invalid expected accuracy`
            );
        });
    }

    /**
     * Test 8: SER/ESTAR exercises have discrimination pairs
     */
    testSerEstarHasDiscriminationPairs(exercises) {
        let serEstarWithoutPairs = 0;

        for (const [unitId, unitData] of Object.entries(exercises)) {
            for (const exercise of unitData.exercises) {
                if (exercise.concept &&
                    (exercise.concept.includes('ser-estar') ||
                     (exercise.concept.includes('ser') && !exercise.concept.includes('estar')) ||
                     (exercise.concept.includes('estar') && !exercise.concept.includes('ser')))) {
                    if (!exercise.discriminationPairs || exercise.discriminationPairs.length === 0) {
                        serEstarWithoutPairs++;
                    }
                }
            }
        }

        this.test('SER/ESTAR exercises have discrimination pairs', () => {
            this.assert(
                serEstarWithoutPairs === 0,
                `Found ${serEstarWithoutPairs} SER/ESTAR exercises without discrimination pairs`
            );
        });
    }

    /**
     * Test 9: High interference exercises have longer spacing
     */
    testInterferenceCorrelatesWithSpacing(exercises) {
        let violations = 0;

        for (const [unitId, unitData] of Object.entries(exercises)) {
            for (const exercise of unitData.exercises) {
                if (exercise.interferenceRisk === 'very-high' && exercise.spacingMultiplier < 1.0) {
                    violations++;
                }
                if (exercise.interferenceRisk === 'low' && exercise.spacingMultiplier > 1.0) {
                    violations++;
                }
            }
        }

        this.test('High interference correlates with longer spacing', () => {
            this.assert(
                violations < 10,
                `Found ${violations} exercises with inconsistent interference/spacing correlation`
            );
        });
    }

    /**
     * Test 10: Category tags are consistent
     */
    testCategoryTagsConsistent(exercises) {
        let inconsistent = 0;

        for (const [unitId, unitData] of Object.entries(exercises)) {
            const unitNumber = unitData.metadata.unit;
            for (const exercise of unitData.exercises) {
                if (!exercise.categoryTags.includes(`unit-${unitNumber}`)) {
                    inconsistent++;
                }
                if (!exercise.categoryTags.includes('phase-1')) {
                    inconsistent++;
                }
            }
        }

        this.test('Category tags are consistent with unit metadata', () => {
            this.assert(
                inconsistent === 0,
                `Found ${inconsistent} exercises with inconsistent category tags`
            );
        });
    }

    /**
     * Test 11: Milestone exercises are properly flagged
     */
    testMilestonesProperlyFlagged(exercises) {
        let totalMilestones = 0;

        for (const [unitId, unitData] of Object.entries(exercises)) {
            for (const exercise of unitData.exercises) {
                if (exercise.milestone) {
                    totalMilestones++;
                }
            }
        }

        this.test('Milestone exercises are properly flagged', () => {
            this.assert(
                totalMilestones >= 20 && totalMilestones <= 60,
                `Expected 20-60 milestones, found ${totalMilestones}`
            );
        });
    }

    /**
     * Test 12: Certification requirements are set
     */
    testCertificationRequirementsSet(exercises) {
        let totalCertificationExercises = 0;

        for (const [unitId, unitData] of Object.entries(exercises)) {
            for (const exercise of unitData.exercises) {
                if (exercise.certificationRequired) {
                    totalCertificationExercises++;
                }
            }
        }

        this.test('Certification requirements are properly set', () => {
            this.assert(
                totalCertificationExercises >= 30 && totalCertificationExercises <= 80,
                `Expected 30-80 certification exercises, found ${totalCertificationExercises}`
            );
        });
    }

    /**
     * Test 13: Response times are reasonable
     */
    testResponseTimesReasonable(exercises) {
        let unreasonable = 0;

        for (const [unitId, unitData] of Object.entries(exercises)) {
            for (const exercise of unitData.exercises) {
                if (exercise.estimatedResponseTime < 2 || exercise.estimatedResponseTime > 120) {
                    unreasonable++;
                }
            }
        }

        this.test('Response times are reasonable (2-120 seconds)', () => {
            this.assert(
                unreasonable === 0,
                `Found ${unreasonable} exercises with unreasonable response times`
            );
        });
    }

    /**
     * Test 14: Simulate AdaptiveKnowledgeTrackerV2 integration
     */
    testAdaptiveKnowledgeTrackerIntegration(exercises) {
        this.test('AdaptiveKnowledgeTrackerV2 integration', () => {
            let ex = exercises['unit2-ser'].exercises[0];

            // Test that all required fields for tracker are present
            this.assert(ex.memoryComplexity !== undefined, 'memoryComplexity missing');
            this.assert(ex.interferenceRisk !== undefined, 'interferenceRisk missing');
            this.assert(ex.spacingMultiplier !== undefined, 'spacingMultiplier missing');
            this.assert(ex.expectedAccuracy !== undefined, 'expectedAccuracy missing');

            // Simulate spacing calculation
            const baseInterval = 1; // 1 day
            const nextInterval = baseInterval * ex.spacingMultiplier;
            this.assert(nextInterval > 0, 'Invalid spacing calculation');
        });
    }

    /**
     * Test 15: Simulate InterleavedPracticeSystem integration
     */
    testInterleavedPracticeIntegration(exercises) {
        this.test('InterleavedPracticeSystem integration', () => {
            let serExercise = exercises['unit2-ser'].exercises[0];
            let estarExercise = exercises['unit3-estar'].exercises[0];

            // Test discrimination pairs exist
            this.assert(
                serExercise.discriminationPairs && serExercise.discriminationPairs.length > 0,
                'SER exercise missing discrimination pairs'
            );

            // Test category tags enable batching
            this.assert(
                serExercise.categoryTags && serExercise.categoryTags.includes('verb-ser'),
                'SER exercise missing category tags'
            );
        });
    }

    /**
     * Test 16: Simulate GermanSpanishContrastiveSystem integration
     */
    testGermanSpanishContrastiveIntegration(exercises) {
        this.test('GermanSpanishContrastiveSystem integration', () => {
            let ex = exercises['unit4-ser-estar-contrast'].exercises[0];

            // Test German-specific fields
            this.assert(ex.transferType !== undefined, 'transferType missing');
            this.assert(ex.falseFriendRisk !== undefined, 'falseFriendRisk missing');
            this.assert(ex.contrastiveElements !== undefined, 'contrastiveElements missing');
            this.assert(ex.interferenceRisk !== undefined, 'interferenceRisk missing');

            // High interference should exist for ser-estar
            this.assert(
                ex.interferenceRisk === 'high' || ex.interferenceRisk === 'very-high',
                'SER/ESTAR should have high interference risk'
            );
        });
    }

    /**
     * Test 17: Simulate LearningAnalytics integration
     */
    testLearningAnalyticsIntegration(exercises) {
        this.test('LearningAnalytics integration', () => {
            let ex = exercises['unit7-integration'].exercises[0];

            // Test analytics fields
            this.assert(ex.expectedAccuracy !== undefined, 'expectedAccuracy missing');
            this.assert(ex.milestone !== undefined, 'milestone missing');
            this.assert(ex.estimatedResponseTime !== undefined, 'estimatedResponseTime missing');

            // Simulate progress calculation
            const simulatedAccuracy = 0.75;
            const progress = simulatedAccuracy - ex.expectedAccuracy;
            this.assert(typeof progress === 'number', 'Progress calculation failed');
        });
    }

    /**
     * Run all tests
     */
    runAll() {
        console.log('🧪 Running Adaptive Integration Tests...\n');

        const exercises = this.loadExercises();

        // Field validation tests
        this.testRequiredFieldsPresent(exercises);
        this.testPrerequisitesValid(exercises);
        this.testDiscriminationPairsValid(exercises);
        this.testMemoryComplexityValid(exercises);
        this.testInterferenceRiskValid(exercises);
        this.testTransferTypeValid(exercises);
        this.testExpectedAccuracyValid(exercises);
        this.testResponseTimesReasonable(exercises);

        // Logic tests
        this.testSerEstarHasDiscriminationPairs(exercises);
        this.testInterferenceCorrelatesWithSpacing(exercises);
        this.testCategoryTagsConsistent(exercises);
        this.testMilestonesProperlyFlagged(exercises);
        this.testCertificationRequirementsSet(exercises);

        // Integration tests
        this.testAdaptiveKnowledgeTrackerIntegration(exercises);
        this.testInterleavedPracticeIntegration(exercises);
        this.testGermanSpanishContrastiveIntegration(exercises);
        this.testLearningAnalyticsIntegration(exercises);

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log(`📊 Test Results: ${this.results.passed}/${this.results.totalTests} passed`);
        if (this.results.failed > 0) {
            console.log(`❌ ${this.results.failed} tests failed`);
        } else {
            console.log('✅ All tests passed!');
        }
        console.log('='.repeat(60));

        return this.results;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdaptiveIntegrationTest };
}

// CLI execution
if (require.main === module) {
    const tester = new AdaptiveIntegrationTest();
    const results = tester.runAll();

    // Save results
    const reportPath = path.join(__dirname, '..', 'ADAPTIVE-INTEGRATION-TEST-RESULTS.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 Full results saved to: ${reportPath}`);

    // Exit with appropriate code
    process.exit(results.failed > 0 ? 1 : 0);
}
