/**
 * Exercise Enhancement Migration Tool
 * Automatically adds adaptive learning fields to all Phase 1 exercises
 */

const fs = require('fs');
const path = require('path');

class ExerciseEnhancer {
    constructor(exercisesDir) {
        this.exercisesDir = exercisesDir;

        // Concept hierarchy for prerequisites
        this.conceptHierarchy = {
            // Unit 1: Pronouns
            'pronoun-singular-first': [],
            'pronoun-singular-second-informal': ['pronoun-singular-first'],
            'pronoun-singular-second-formal': ['pronoun-singular-second-informal'],
            'pronoun-singular-third-masculine': ['pronoun-singular-second-formal'],
            'pronoun-singular-third-feminine': ['pronoun-singular-third-masculine'],
            'pronoun-plural-first': ['pronoun-singular-first', 'pronoun-singular-third-masculine'],
            'pronoun-plural-second-informal': ['pronoun-plural-first'],
            'pronoun-plural-third': ['pronoun-singular-third-masculine'],

            // Unit 2: SER
            'ser-conjugation-yo': ['pronoun-singular-first'],
            'ser-conjugation-tu': ['pronoun-singular-second-informal', 'ser-conjugation-yo'],
            'ser-conjugation-el': ['pronoun-singular-third-masculine', 'ser-conjugation-tu'],
            'ser-conjugation-nosotros': ['pronoun-plural-first', 'ser-conjugation-yo'],
            'ser-conjugation-ellos': ['pronoun-plural-third', 'ser-conjugation-nosotros'],
            'ser-identity': ['ser-conjugation-yo'],
            'ser-profession': ['ser-identity'],
            'ser-origin': ['ser-profession'],
            'ser-characteristics': ['ser-profession'],

            // Unit 3: ESTAR
            'estar-conjugation-yo': ['pronoun-singular-first', 'ser-conjugation-yo'],
            'estar-conjugation-tu': ['estar-conjugation-yo'],
            'estar-location-simple': ['estar-conjugation-yo'],
            'estar-emotion-happy': ['estar-location-simple'],
            'estar-temporary-state': ['estar-emotion-happy'],

            // Unit 4: SER/ESTAR Contrast
            'ser-estar-fundamental': ['ser-identity', 'estar-location-simple'],
            'ser-estar-location-person': ['ser-estar-fundamental'],
            'ser-estar-listo': ['ser-estar-fundamental'],

            // Unit 5: TENER
            'tener-conjugation-yo': ['pronoun-singular-first'],
            'tener-possession-simple': ['tener-conjugation-yo'],
            'tener-age': ['tener-conjugation-yo'],
            'tener-hunger': ['tener-possession-simple'],
            'tener-que-obligation': ['tener-possession-simple'],

            // Unit 6: Vocabulary
            'greeting-hello': [],
            'number-one': ['greeting-hello'],
            'color-red': ['number-one'],
            'day-monday': ['number-one'],

            // Unit 7: Integration
            'self-introduction': ['ser-identity', 'tener-age'],
            'describing-person': ['ser-characteristics', 'estar-temporary-state']
        };

        // Response time defaults by type (in seconds)
        this.responseTimeByType = {
            'translation': 8,
            'conjugation': 6,
            'fill-blank': 10,
            'multiple-choice': 12,
            'contrast-pair': 15,
            'meaning-change': 18,
            'conversation': 20,
            'translation-comprehensive': 25,
            'error-correction': 15,
            'practical-scenario': 20,
            'comprehensive': 30,
            'mastery-check': 40,
            'final-certification': 60
        };

        // Memory complexity mapping (difficulty to complexity)
        this.memoryComplexityMap = {
            1: 1,
            2: 2,
            3: 4,
            4: 5,
            5: 6,
            6: 7,
            7: 8,
            8: 9,
            9: 10,
            10: 10
        };

        // German interference patterns
        this.interferencePatterns = {
            // High interference
            'ser-estar': 'very-high',
            'personal-a': 'very-high',
            'tener-age': 'high',
            'estar-location': 'high',
            'ser-origin': 'medium',
            'pronoun-omission': 'medium',
            'gender-agreement': 'medium',
            'adjective-position': 'low',
            'cognates': 'very-low'
        };
    }

    /**
     * Determine interference risk for an exercise
     */
    determineInterferenceRisk(exercise, unitData) {
        const concept = exercise.concept || '';

        // Check for ser/estar contrast
        if (concept.includes('ser-estar') || concept.includes('estar') && concept.includes('ser')) {
            return 'very-high';
        }

        // Check for age with tener
        if (concept.includes('tener-age') || concept.includes('age')) {
            return 'high';
        }

        // Check for location with estar
        if (concept.includes('estar-location') || concept.includes('location')) {
            return 'high';
        }

        // Check germanChallengeNote in metadata
        if (unitData.metadata?.germanChallenge) {
            return 'high';
        }

        // Check for common mistakes mention
        if (exercise.commonMistake || exercise.warning) {
            return 'high';
        }

        // Default based on difficulty
        if (exercise.difficulty >= 7) {
            return 'high';
        } else if (exercise.difficulty >= 4) {
            return 'medium';
        }

        return 'low';
    }

    /**
     * Determine transfer type based on germanBridge
     */
    determineTransferType(exercise) {
        const bridge = exercise.germanBridge || '';

        if (bridge.includes('ähnlich') || bridge.includes('gleich') || bridge.includes('wie im Deutschen')) {
            return 'positive';
        }

        if (bridge.includes('NICHT') || bridge.includes('anders') || bridge.includes('⚠️')) {
            return 'negative';
        }

        if (bridge.includes('Unterschied') || bridge.includes('komplex')) {
            return 'negative';
        }

        return 'neutral';
    }

    /**
     * Check for false friend risk
     */
    checkFalseFriendRisk(exercise) {
        const falseFriends = [
            'embarazada',
            'constipado',
            'actual',
            'sensible',
            'largo',
            'éxito'
        ];

        const text = JSON.stringify(exercise).toLowerCase();
        return falseFriends.some(word => text.includes(word));
    }

    /**
     * Extract contrastive elements
     */
    extractContrastiveElements(exercise) {
        const elements = [];

        if (exercise.germanBridge) {
            elements.push(exercise.germanBridge);
        }

        if (exercise.contrast) {
            elements.push(exercise.contrast);
        }

        if (exercise.rule) {
            elements.push(`Rule: ${exercise.rule}`);
        }

        if (exercise.commonMistake) {
            elements.push(`Common mistake: ${exercise.commonMistake}`);
        }

        return elements.length > 0 ? elements : undefined;
    }

    /**
     * Determine expected accuracy based on difficulty
     */
    calculateExpectedAccuracy(exercise, unitData) {
        const baseAccuracy = {
            1: 0.95,
            2: 0.90,
            3: 0.85,
            4: 0.80,
            5: 0.75,
            6: 0.70,
            7: 0.65,
            8: 0.60,
            9: 0.55,
            10: 0.50
        };

        let accuracy = baseAccuracy[exercise.difficulty] || 0.70;

        // Adjust for German interference
        if (unitData.metadata?.germanChallenge) {
            accuracy -= 0.10;
        }

        // Adjust for ser/estar contrast
        if (exercise.concept && exercise.concept.includes('ser-estar')) {
            accuracy -= 0.15;
        }

        return Math.max(0.30, Math.min(0.95, accuracy));
    }

    /**
     * Determine if exercise is a milestone
     */
    isMilestone(exercise, unitData) {
        // Last exercise of unit
        const exercises = unitData.exercises || [];
        const index = exercises.indexOf(exercise);
        if (index === exercises.length - 1) {
            return true;
        }

        // High difficulty mastery exercises
        if (exercise.difficulty >= 9 && (exercise.type === 'mastery-check' || exercise.type === 'comprehensive')) {
            return true;
        }

        // Ser/estar discrimination exercises
        if (exercise.concept && exercise.concept.includes('ser-estar') && exercise.difficulty >= 6) {
            return true;
        }

        return false;
    }

    /**
     * Determine certification requirement
     */
    isCertificationRequired(exercise, unitData) {
        // Final exercises in each unit
        const exercises = unitData.exercises || [];
        const index = exercises.indexOf(exercise);

        // Last 3 exercises of each unit
        if (index >= exercises.length - 3) {
            return true;
        }

        // Final certification test
        if (exercise.type === 'final-certification') {
            return true;
        }

        // Key milestones
        if (this.isMilestone(exercise, unitData)) {
            return true;
        }

        return false;
    }

    /**
     * Generate category tags
     */
    generateCategoryTags(exercise, unitData) {
        const tags = [];

        // Unit tag
        tags.push(`unit-${unitData.metadata.unit}`);
        tags.push(`phase-${unitData.metadata.phase}`);
        tags.push(unitData.metadata.level);

        // Type tag
        tags.push(exercise.type);

        // Concept tags
        if (exercise.concept) {
            const parts = exercise.concept.split('-');
            parts.forEach(part => tags.push(part));
        }

        // Verb tags
        if (exercise.concept) {
            if (exercise.concept.includes('ser')) tags.push('verb-ser');
            if (exercise.concept.includes('estar')) tags.push('verb-estar');
            if (exercise.concept.includes('tener')) tags.push('verb-tener');
        }

        // Difficulty level tag
        if (exercise.difficulty <= 3) {
            tags.push('beginner');
        } else if (exercise.difficulty <= 6) {
            tags.push('intermediate');
        } else {
            tags.push('advanced');
        }

        // German-specific tags
        if (unitData.metadata?.germanChallenge || exercise.germanBridge) {
            tags.push('german-optimized');
        }

        return [...new Set(tags)]; // Remove duplicates
    }

    /**
     * Find discrimination pairs (similar exercises to interleave)
     */
    findDiscriminationPairs(exercise, allExercises, currentUnitId) {
        const pairs = [];

        // For ser/estar exercises, find contrasting exercise
        if (exercise.concept && exercise.concept.includes('ser')) {
            // Find estar exercise with similar structure
            for (const [unitId, unitData] of Object.entries(allExercises)) {
                for (const otherEx of (unitData.exercises || [])) {
                    if (otherEx.concept && otherEx.concept.includes('estar') &&
                        Math.abs(otherEx.difficulty - exercise.difficulty) <= 1) {
                        pairs.push(otherEx.id);
                    }
                }
            }
        }

        // For estar exercises, find ser exercise
        if (exercise.concept && exercise.concept.includes('estar') && !exercise.concept.includes('ser-estar')) {
            for (const [unitId, unitData] of Object.entries(allExercises)) {
                for (const otherEx of (unitData.exercises || [])) {
                    if (otherEx.concept && otherEx.concept.includes('ser') &&
                        Math.abs(otherEx.difficulty - exercise.difficulty) <= 1) {
                        pairs.push(otherEx.id);
                    }
                }
            }
        }

        // Limit to 3-5 pairs
        return pairs.slice(0, 5);
    }

    /**
     * Determine related concepts for interleaving
     */
    determineRelatedConcepts(exercise, unitData) {
        const related = [];
        const concept = exercise.concept || '';

        // Pronoun-related
        if (concept.includes('pronoun')) {
            related.push('verb-conjugation');
        }

        // Verb conjugation relationships
        if (concept.includes('ser')) {
            related.push('estar-conjugation', 'tener-conjugation');
        }
        if (concept.includes('estar')) {
            related.push('ser-conjugation', 'location', 'emotion');
        }
        if (concept.includes('tener')) {
            related.push('ser-conjugation', 'possession', 'age');
        }

        // Ser/estar contrast
        if (concept.includes('ser-estar')) {
            related.push('ser-identity', 'estar-location', 'meaning-change');
        }

        return related.length > 0 ? related : undefined;
    }

    /**
     * Calculate spacing multiplier based on difficulty and interference
     */
    calculateSpacingMultiplier(exercise, unitData) {
        let multiplier = 1.0;

        // High interference = longer spacing
        const interference = this.determineInterferenceRisk(exercise, unitData);
        if (interference === 'very-high') {
            multiplier = 1.5;
        } else if (interference === 'high') {
            multiplier = 1.3;
        } else if (interference === 'low') {
            multiplier = 0.8;
        }

        // High difficulty = longer spacing
        if (exercise.difficulty >= 8) {
            multiplier *= 1.2;
        } else if (exercise.difficulty <= 2) {
            multiplier *= 0.9;
        }

        return Math.round(multiplier * 10) / 10;
    }

    /**
     * Enhance a single exercise
     */
    enhanceExercise(exercise, unitData, allExercises, currentUnitId) {
        const enhanced = { ...exercise };

        // Add prerequisites (if concept exists in hierarchy)
        if (!enhanced.prerequisites && exercise.concept) {
            enhanced.prerequisites = this.conceptHierarchy[exercise.concept] || [];
        }

        // Add related concepts
        if (!enhanced.relatedConcepts) {
            enhanced.relatedConcepts = this.determineRelatedConcepts(exercise, unitData);
        }

        // Add discrimination pairs
        if (!enhanced.discriminationPairs) {
            enhanced.discriminationPairs = this.findDiscriminationPairs(exercise, allExercises, currentUnitId);
        }

        // Add category tags
        if (!enhanced.categoryTags) {
            enhanced.categoryTags = this.generateCategoryTags(exercise, unitData);
        }

        // Add estimated response time
        if (!enhanced.estimatedResponseTime) {
            const baseTime = this.responseTimeByType[exercise.type] || 10;
            // Adjust for difficulty
            const difficultyMultiplier = 1 + (exercise.difficulty - 5) * 0.1;
            enhanced.estimatedResponseTime = Math.round(baseTime * difficultyMultiplier);
        }

        // Add memory complexity
        if (!enhanced.memoryComplexity) {
            enhanced.memoryComplexity = this.memoryComplexityMap[exercise.difficulty] || 5;
        }

        // Add interference risk
        if (!enhanced.interferenceRisk) {
            enhanced.interferenceRisk = this.determineInterferenceRisk(exercise, unitData);
        }

        // Add spacing multiplier
        if (!enhanced.spacingMultiplier) {
            enhanced.spacingMultiplier = this.calculateSpacingMultiplier(exercise, unitData);
        }

        // Add transfer type
        if (!enhanced.transferType) {
            enhanced.transferType = this.determineTransferType(exercise);
        }

        // Add false friend risk
        if (!enhanced.falseFriendRisk) {
            enhanced.falseFriendRisk = this.checkFalseFriendRisk(exercise);
        }

        // Add contrastive elements
        if (!enhanced.contrastiveElements) {
            enhanced.contrastiveElements = this.extractContrastiveElements(exercise);
        }

        // Add expected accuracy
        if (!enhanced.expectedAccuracy) {
            enhanced.expectedAccuracy = this.calculateExpectedAccuracy(exercise, unitData);
        }

        // Add milestone flag
        if (enhanced.milestone === undefined) {
            enhanced.milestone = this.isMilestone(exercise, unitData);
        }

        // Add certification requirement
        if (enhanced.certificationRequired === undefined) {
            enhanced.certificationRequired = this.isCertificationRequired(exercise, unitData);
        }

        return enhanced;
    }

    /**
     * Process all exercise files
     */
    async enhance() {
        const units = [
            'unit1-pronouns.json',
            'unit2-ser.json',
            'unit3-estar.json',
            'unit4-ser-estar-contrast.json',
            'unit5-tener.json',
            'unit6-vocabulary.json',
            'unit7-integration.json'
        ];

        // First pass: load all exercises
        const allExercises = {};
        for (const unitFile of units) {
            const filePath = path.join(this.exercisesDir, unitFile);
            const content = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);
            const unitId = unitFile.replace('.json', '');
            allExercises[unitId] = data;
        }

        // Second pass: enhance all exercises
        const enhanced = {};
        let totalEnhanced = 0;

        for (const [unitId, unitData] of Object.entries(allExercises)) {
            const enhancedUnit = { ...unitData };
            enhancedUnit.exercises = unitData.exercises.map(exercise => {
                totalEnhanced++;
                return this.enhanceExercise(exercise, unitData, allExercises, unitId);
            });
            enhanced[unitId] = enhancedUnit;
        }

        // Third pass: write enhanced files
        for (const [unitId, unitData] of Object.entries(enhanced)) {
            const filePath = path.join(this.exercisesDir, `${unitId}.json`);
            fs.writeFileSync(filePath, JSON.stringify(unitData, null, 2));
            console.log(`✅ Enhanced ${unitId}: ${unitData.exercises.length} exercises`);
        }

        console.log(`\n🎉 Total exercises enhanced: ${totalEnhanced}`);
        return { totalEnhanced, enhanced };
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ExerciseEnhancer };
}

// CLI execution
if (require.main === module) {
    const exercisesDir = path.join(__dirname, '..', 'data', 'phase1-exercises');
    const enhancer = new ExerciseEnhancer(exercisesDir);

    console.log('🚀 Starting exercise enhancement migration...\n');

    enhancer.enhance().then(result => {
        console.log('\n✅ Enhancement complete!');
        console.log(`📊 ${result.totalEnhanced} exercises now adaptive-ready`);
        console.log('\n🔍 Run validate-exercises.js to verify improvements');
    }).catch(error => {
        console.error('❌ Enhancement error:', error);
        process.exit(1);
    });
}
