/**
 * Phase 1 Learning Controller
 *
 * Orchestrates all Phase 1 (A1) learning components:
 * - Exercise generation
 * - Adaptive knowledge tracking
 * - SER/ESTAR contrast system
 * - Practical scenarios
 * - Error pattern detection
 * - Explanation generation
 */

class Phase1Controller {
    constructor() {
        // Initialize all Phase 1 systems
        this.exerciseGenerator = new Phase1ExerciseGenerator();
        this.knowledgeTracker = new AdaptiveKnowledgeTracker();
        this.serEstarSystem = new SerEstarContrastSystem();
        this.scenariosSystem = new PracticalScenariosSystem();
        this.errorDetector = new ErrorPatternDetector();
        this.explanationGenerator = new ExplanationGenerator();

        // Current learning state
        this.currentUnit = 1;
        this.currentSession = {
            startTime: null,
            exercisesCompleted: 0,
            correctAnswers: 0,
            errors: []
        };

        // User progress in Phase 1
        this.userProgress = this.loadProgress() || {
            units: {
                1: { completed: false, accuracy: 0, exercises: 0 },
                2: { completed: false, accuracy: 0, exercises: 0 },
                3: { completed: false, accuracy: 0, exercises: 0 },
                4: { completed: false, accuracy: 0, exercises: 0 },
                5: { completed: false, accuracy: 0, exercises: 0 },
                6: { completed: false, accuracy: 0, exercises: 0 },
                7: { completed: false, accuracy: 0, exercises: 0 }
            },
            overallAccuracy: 0,
            totalExercises: 0,
            startDate: Date.now(),
            lastSessionDate: null,
            daysActive: 0
        };

        // Unit completion requirements
        this.unitRequirements = {
            1: { minExercises: 20, minAccuracy: 0.80 },
            2: { minExercises: 35, minAccuracy: 0.75 },
            3: { minExercises: 35, minAccuracy: 0.75 },
            4: { minExercises: 40, minAccuracy: 0.70 }, // SER/ESTAR is harder
            5: { minExercises: 30, minAccuracy: 0.75 },
            6: { minExercises: 35, minAccuracy: 0.80 },
            7: { minExercises: 30, minAccuracy: 0.85 }  // Integration should be mastered
        };
    }

    /**
     * Start a new learning session
     */
    startSession() {
        this.currentSession = {
            startTime: Date.now(),
            exercisesCompleted: 0,
            correctAnswers: 0,
            errors: []
        };

        // Update last session date
        this.userProgress.lastSessionDate = Date.now();
        this.calculateDaysActive();
    }

    /**
     * Get next exercise based on current unit and adaptive knowledge
     */
    getNextExercise() {
        // Check if current unit is completed
        if (this.isUnitCompleted(this.currentUnit)) {
            if (this.currentUnit < 7) {
                this.currentUnit++;
                this.saveProgress();
            } else {
                // Phase 1 completed!
                return this.getPhaseCompletionMessage();
            }
        }

        // Generate exercise based on current unit
        let exercise;

        switch (this.currentUnit) {
            case 1:
                // Personalpronomen
                exercise = this.exerciseGenerator.generatePronounExercise();
                break;

            case 2:
                // Verb SER
                exercise = this.exerciseGenerator.generateSerConjugation();
                break;

            case 3:
                // Verb ESTAR
                exercise = this.exerciseGenerator.generateEstarConjugation();
                break;

            case 4:
                // SER vs ESTAR - Most important unit
                exercise = this.generateSerEstarContrastExercise();
                break;

            case 5:
                // Verb TENER
                exercise = this.exerciseGenerator.generateTenerExercise();
                break;

            case 6:
                // Vocabulary (numbers, colors, basic words)
                exercise = this.generateAdaptiveVocabularyExercise();
                break;

            case 7:
                // Integration & Conversation
                exercise = this.generateIntegrationExercise();
                break;

            default:
                exercise = this.exerciseGenerator.generatePronounExercise();
        }

        // Add metadata
        exercise.unit = this.currentUnit;
        exercise.sessionNumber = this.currentSession.exercisesCompleted + 1;

        return exercise;
    }

    /**
     * Generate SER/ESTAR contrast exercise using specialized system
     */
    generateSerEstarContrastExercise() {
        // Mix different types of SER/ESTAR exercises
        const types = ['choice', 'contrast-pair', 'meaning-change', 'rule-application'];
        const type = types[Math.floor(Math.random() * types.length)];

        switch (type) {
            case 'choice':
                return this.exerciseGenerator.generateSerEstarChoice();

            case 'contrast-pair':
                return this.serEstarSystem.generateContrastPairExercise();

            case 'meaning-change':
                return this.serEstarSystem.generateMeaningChangeExercise();

            case 'rule-application':
                return this.serEstarSystem.generateRuleApplicationExercise();

            default:
                return this.exerciseGenerator.generateSerEstarChoice();
        }
    }

    /**
     * Generate adaptive vocabulary exercise based on knowledge tracking
     */
    generateAdaptiveVocabularyExercise() {
        // Get vocabulary items that need practice
        const vocabularyItems = this.knowledgeTracker.getVocabularyPracticeList(
            this.getUnit6Vocabulary(),
            10
        );

        // Generate exercise from selected items
        const item = vocabularyItems[Math.floor(Math.random() * vocabularyItems.length)];

        const direction = Math.random() > 0.5 ? 'es-to-de' : 'de-to-es';

        return {
            type: 'vocabulary-translation',
            unit: 6,
            concept: 'vocabulary-basic',
            vocabularyId: item.id,
            direction: direction,
            question: direction === 'es-to-de'
                ? `Was bedeutet "${item.es}" auf Deutsch?`
                : `Wie sagt man "${item.de}" auf Spanisch?`,
            correctAnswer: direction === 'es-to-de' ? item.de : item.es,
            alternativeAnswers: item.alternatives || [],
            category: item.category,
            hint: item.hint || ''
        };
    }

    /**
     * Generate integration exercise combining multiple concepts
     */
    generateIntegrationExercise() {
        // Mix practical scenarios with conversation exercises
        const types = ['scenario', 'conversation', 'comprehensive'];
        const type = types[Math.floor(Math.random() * types.length)];

        switch (type) {
            case 'scenario':
                return this.scenariosSystem.generateScenarioExercise(
                    this.selectRandomScenario()
                );

            case 'conversation':
                return this.scenariosSystem.generateConversationExercise();

            case 'comprehensive':
                return this.generateComprehensiveExercise();

            default:
                return this.scenariosSystem.generateScenarioExercise('asking_directions');
        }
    }

    /**
     * Select random practical scenario
     */
    selectRandomScenario() {
        const scenarios = [
            'asking_directions',
            'expressing_feelings',
            'work_communication',
            'self_description',
            'describing_others'
        ];
        return scenarios[Math.floor(Math.random() * scenarios.length)];
    }

    /**
     * Generate comprehensive exercise combining all Phase 1 concepts
     */
    generateComprehensiveExercise() {
        const templates = [
            {
                es: 'Yo _____ (SER) profesor y _____ (ESTAR) en la escuela.',
                correct: ['soy', 'estoy'],
                explanation: 'SER für Beruf (permanent), ESTAR für Ort (temporär)'
            },
            {
                es: 'Tú _____ (TENER) 25 años y _____ (SER) de Alemania.',
                correct: ['tienes', 'eres'],
                explanation: 'TENER für Alter, SER für Herkunft'
            },
            {
                es: 'Ella _____ (ESTAR) feliz porque _____ (TENER) un gato.',
                correct: ['está', 'tiene'],
                explanation: 'ESTAR für Emotionen, TENER für Besitz'
            }
        ];

        const template = templates[Math.floor(Math.random() * templates.length)];

        return {
            type: 'fill-multiple-blanks',
            unit: 7,
            concept: 'integration-comprehensive',
            question: template.es,
            correctAnswers: template.correct,
            explanation: template.explanation,
            difficulty: 'advanced'
        };
    }

    /**
     * Process user answer and provide feedback
     */
    processAnswer(exercise, userAnswer) {
        const isCorrect = this.checkAnswer(exercise, userAnswer);

        // Update session stats
        this.currentSession.exercisesCompleted++;
        if (isCorrect) {
            this.currentSession.correctAnswers++;
        }

        // Update unit progress
        const unitProgress = this.userProgress.units[this.currentUnit];
        unitProgress.exercises++;
        unitProgress.accuracy = this.calculateUnitAccuracy(this.currentUnit);

        // Update overall progress
        this.userProgress.totalExercises++;
        this.userProgress.overallAccuracy = this.calculateOverallAccuracy();

        // Generate feedback
        const feedback = this.generateFeedback(exercise, userAnswer, isCorrect);

        // If incorrect, detect error patterns and update knowledge
        if (!isCorrect) {
            const errors = this.errorDetector.detectErrorType(
                userAnswer,
                exercise.correctAnswer,
                {
                    type: exercise.concept,
                    unit: exercise.unit,
                    direction: exercise.direction
                }
            );

            this.currentSession.errors.push({
                exercise: exercise,
                userAnswer: userAnswer,
                errors: errors,
                timestamp: Date.now()
            });

            // Track error patterns
            errors.forEach(error => {
                this.errorDetector.aggregatePatterns('default_user', error.type, {
                    unit: exercise.unit,
                    concept: exercise.concept
                });
            });

            // Update knowledge tracker for vocabulary/grammar items
            if (exercise.vocabularyId) {
                this.knowledgeTracker.recordAttempt(
                    'vocabulary',
                    exercise.vocabularyId,
                    false
                );
            } else if (exercise.concept) {
                this.knowledgeTracker.recordAttempt(
                    'grammar',
                    exercise.concept,
                    false
                );
            }
        } else {
            // Update knowledge tracker for correct answers
            if (exercise.vocabularyId) {
                this.knowledgeTracker.recordAttempt(
                    'vocabulary',
                    exercise.vocabularyId,
                    true
                );
            } else if (exercise.concept) {
                this.knowledgeTracker.recordAttempt(
                    'grammar',
                    exercise.concept,
                    true
                );
            }
        }

        this.saveProgress();

        return {
            isCorrect: isCorrect,
            feedback: feedback,
            correctAnswer: exercise.correctAnswer,
            errors: isCorrect ? [] : errors,
            progress: this.getProgressSummary()
        };
    }

    /**
     * Check if answer is correct
     */
    checkAnswer(exercise, userAnswer) {
        const normalize = (str) => str.toLowerCase().trim()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const userNorm = normalize(userAnswer);
        const correctNorm = normalize(exercise.correctAnswer);

        // Check exact match
        if (userNorm === correctNorm) {
            return true;
        }

        // Check alternative answers
        if (exercise.alternativeAnswers && exercise.alternativeAnswers.length > 0) {
            return exercise.alternativeAnswers.some(alt =>
                normalize(alt) === userNorm
            );
        }

        // Check for multiple blanks
        if (exercise.type === 'fill-multiple-blanks' && Array.isArray(exercise.correctAnswers)) {
            const userAnswers = userAnswer.split(',').map(a => normalize(a.trim()));
            return userAnswers.length === exercise.correctAnswers.length &&
                   userAnswers.every((ans, idx) =>
                       normalize(exercise.correctAnswers[idx]) === ans
                   );
        }

        return false;
    }

    /**
     * Generate feedback for user answer
     */
    generateFeedback(exercise, userAnswer, isCorrect) {
        if (isCorrect) {
            const encouragements = [
                '¡Muy bien! 🎉',
                '¡Perfecto! ✓',
                '¡Excelente! 👏',
                '¡Correcto! ✓',
                'Richtig! 👍'
            ];
            const feedback = encouragements[Math.floor(Math.random() * encouragements.length)];

            return {
                message: feedback,
                explanation: exercise.explanation || '',
                type: 'success'
            };
        } else {
            // Generate detailed explanation for incorrect answer
            const errors = this.errorDetector.detectErrorType(
                userAnswer,
                exercise.correctAnswer,
                {
                    type: exercise.concept,
                    unit: exercise.unit
                }
            );

            let explanationText = '';
            if (errors.length > 0) {
                const primaryError = errors[0];
                explanationText = this.explanationGenerator.generateExplanation(
                    primaryError.type,
                    primaryError.details || {},
                    'detailed'
                );
            } else if (exercise.explanation) {
                explanationText = exercise.explanation;
            }

            return {
                message: 'Nicht ganz richtig.',
                correctAnswer: exercise.correctAnswer,
                explanation: explanationText,
                type: 'error',
                errors: errors
            };
        }
    }

    /**
     * Check if unit is completed
     */
    isUnitCompleted(unitNumber) {
        const progress = this.userProgress.units[unitNumber];
        const requirements = this.unitRequirements[unitNumber];

        if (!progress || !requirements) {
            return false;
        }

        return progress.exercises >= requirements.minExercises &&
               progress.accuracy >= requirements.minAccuracy;
    }

    /**
     * Calculate unit accuracy
     */
    calculateUnitAccuracy(unitNumber) {
        // This would be calculated from stored exercise results
        // For now, simplified calculation
        const progress = this.userProgress.units[unitNumber];
        if (!progress || progress.exercises === 0) {
            return 0;
        }

        // Estimate based on current session if in this unit
        if (unitNumber === this.currentUnit && this.currentSession.exercisesCompleted > 0) {
            return this.currentSession.correctAnswers / this.currentSession.exercisesCompleted;
        }

        return progress.accuracy;
    }

    /**
     * Calculate overall accuracy
     */
    calculateOverallAccuracy() {
        const totalExercises = Object.values(this.userProgress.units)
            .reduce((sum, unit) => sum + unit.exercises, 0);

        if (totalExercises === 0) {
            return 0;
        }

        const weightedAccuracy = Object.values(this.userProgress.units)
            .reduce((sum, unit) => sum + (unit.accuracy * unit.exercises), 0);

        return weightedAccuracy / totalExercises;
    }

    /**
     * Calculate days active
     */
    calculateDaysActive() {
        if (!this.userProgress.startDate) {
            this.userProgress.daysActive = 0;
            return;
        }

        const daysSinceStart = Math.floor(
            (Date.now() - this.userProgress.startDate) / (1000 * 60 * 60 * 24)
        );

        this.userProgress.daysActive = daysSinceStart;
    }

    /**
     * Get progress summary
     */
    getProgressSummary() {
        return {
            currentUnit: this.currentUnit,
            unitsCompleted: Object.values(this.userProgress.units)
                .filter(u => u.completed).length,
            totalUnits: 7,
            overallAccuracy: this.userProgress.overallAccuracy,
            totalExercises: this.userProgress.totalExercises,
            currentSessionExercises: this.currentSession.exercisesCompleted,
            currentSessionAccuracy: this.currentSession.exercisesCompleted > 0
                ? this.currentSession.correctAnswers / this.currentSession.exercisesCompleted
                : 0,
            daysActive: this.userProgress.daysActive,
            unitProgress: this.getUnitProgressDetails()
        };
    }

    /**
     * Get detailed unit progress
     */
    getUnitProgressDetails() {
        return Object.entries(this.userProgress.units).map(([unitNum, progress]) => {
            const requirements = this.unitRequirements[unitNum];
            return {
                unit: parseInt(unitNum),
                completed: progress.completed,
                exercises: progress.exercises,
                requiredExercises: requirements.minExercises,
                accuracy: progress.accuracy,
                requiredAccuracy: requirements.minAccuracy,
                progressPercentage: Math.min(100,
                    (progress.exercises / requirements.minExercises) * 100
                )
            };
        });
    }

    /**
     * Get Phase 1 completion message
     */
    getPhaseCompletionMessage() {
        return {
            type: 'phase-completion',
            phase: 1,
            message: '¡Felicidades! Du hast Phase 1 (A1) abgeschlossen! 🎉',
            summary: {
                totalExercises: this.userProgress.totalExercises,
                overallAccuracy: this.userProgress.overallAccuracy,
                daysActive: this.userProgress.daysActive,
                unitsCompleted: 7
            },
            nextSteps: 'Du bist bereit für Phase 2 (A1-Vertiefung) - Regelmäßige Verben!',
            achievements: this.calculateAchievements()
        };
    }

    /**
     * Calculate achievements earned
     */
    calculateAchievements() {
        const achievements = [];

        if (this.userProgress.overallAccuracy >= 0.90) {
            achievements.push({
                id: 'perfectionist',
                name: 'Perfektionist',
                description: 'Über 90% Genauigkeit in Phase 1'
            });
        }

        if (this.userProgress.totalExercises >= 225) {
            achievements.push({
                id: 'dedicated',
                name: 'Engagiert',
                description: 'Alle empfohlenen Übungen abgeschlossen'
            });
        }

        if (this.userProgress.daysActive <= 21) {
            achievements.push({
                id: 'fast-learner',
                name: 'Schnelllerner',
                description: 'Phase 1 in unter 3 Wochen abgeschlossen'
            });
        }

        return achievements;
    }

    /**
     * Get Unit 6 vocabulary for adaptive practice
     */
    getUnit6Vocabulary() {
        // Load vocabulary from cache if available
        if (this.vocabularyCache) {
            return this.vocabularyCache;
        }

        // Return empty array if vocabulary not loaded yet
        // Vocabulary will be loaded asynchronously via loadVocabulary()
        return [];
    }

    /**
     * Load vocabulary from phase1-vocabulary.json
     */
    async loadVocabulary() {
        try {
            const response = await fetch('data/phase1-vocabulary.json');
            const data = await response.json();

            // Flatten all vocabulary words from all categories into a single array
            this.vocabularyCache = [];

            for (const categoryKey in data.categories) {
                const category = data.categories[categoryKey];
                if (category.words && Array.isArray(category.words)) {
                    this.vocabularyCache.push(...category.words);
                }
            }

            console.log(`✅ Loaded ${this.vocabularyCache.length} vocabulary words`);
            return this.vocabularyCache;
        } catch (error) {
            console.error('Failed to load vocabulary:', error);
            this.vocabularyCache = [];
            return [];
        }
    }

    /**
     * End current session
     */
    endSession() {
        const sessionSummary = {
            duration: Date.now() - this.currentSession.startTime,
            exercisesCompleted: this.currentSession.exercisesCompleted,
            correctAnswers: this.currentSession.correctAnswers,
            accuracy: this.currentSession.exercisesCompleted > 0
                ? this.currentSession.correctAnswers / this.currentSession.exercisesCompleted
                : 0,
            errors: this.currentSession.errors,
            errorPatterns: this.getSessionErrorPatterns()
        };

        this.saveProgress();
        this.knowledgeTracker.saveKnowledge();
        this.errorDetector.savePatterns();

        return sessionSummary;
    }

    /**
     * Get error patterns from current session
     */
    getSessionErrorPatterns() {
        const patterns = {};

        this.currentSession.errors.forEach(error => {
            error.errors.forEach(err => {
                if (!patterns[err.type]) {
                    patterns[err.type] = {
                        count: 0,
                        examples: []
                    };
                }
                patterns[err.type].count++;
                patterns[err.type].examples.push({
                    userAnswer: error.userAnswer,
                    correctAnswer: error.exercise.correctAnswer
                });
            });
        });

        return Object.entries(patterns)
            .map(([type, data]) => ({
                errorType: type,
                description: this.errorDetector.errorTypes[type] || type,
                count: data.count,
                examples: data.examples.slice(0, 3) // Show max 3 examples
            }))
            .sort((a, b) => b.count - a.count);
    }

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        localStorage.setItem('phase1_progress', JSON.stringify(this.userProgress));
        localStorage.setItem('phase1_currentUnit', this.currentUnit.toString());
    }

    /**
     * Load progress from localStorage
     */
    loadProgress() {
        const saved = localStorage.getItem('phase1_progress');
        if (saved) {
            const progress = JSON.parse(saved);

            // Load current unit
            const savedUnit = localStorage.getItem('phase1_currentUnit');
            if (savedUnit) {
                this.currentUnit = parseInt(savedUnit);
            }

            return progress;
        }
        return null;
    }

    /**
     * Reset progress (for testing or restart)
     */
    resetProgress() {
        this.currentUnit = 1;
        this.userProgress = {
            units: {
                1: { completed: false, accuracy: 0, exercises: 0 },
                2: { completed: false, accuracy: 0, exercises: 0 },
                3: { completed: false, accuracy: 0, exercises: 0 },
                4: { completed: false, accuracy: 0, exercises: 0 },
                5: { completed: false, accuracy: 0, exercises: 0 },
                6: { completed: false, accuracy: 0, exercises: 0 },
                7: { completed: false, accuracy: 0, exercises: 0 }
            },
            overallAccuracy: 0,
            totalExercises: 0,
            startDate: Date.now(),
            lastSessionDate: null,
            daysActive: 0
        };

        this.saveProgress();
        this.knowledgeTracker.resetKnowledge();
        this.errorDetector.detectedPatterns = {};
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Phase1Controller };
}
