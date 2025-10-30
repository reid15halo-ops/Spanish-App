/**
 * Enhanced Adaptive Learning Orchestrator
 *
 * Integrates all advanced cognitive and emotional detection systems:
 * - Cognitive Load Detection
 * - Frustration Detection
 * - Context-Aware Difficulty
 * - Micro-Break Suggestions
 * - Confidence Decay
 * - Learning Style Detection
 *
 * Maintains backward compatibility with existing AdaptiveLearningOrchestrator.
 */

class AdaptiveLearningOrchestratorEnhanced extends AdaptiveLearningOrchestrator {
    constructor() {
        super();

        // Enhanced systems
        this.cognitiveLoadDetector = new CognitiveLoadDetector();
        this.frustrationDetector = new FrustrationDetector();
        this.contextAwareDifficulty = new ContextAwareDifficultyAdjuster();
        this.microBreakSystem = new MicroBreakSystem();
        this.confidenceDecay = new ConfidenceDecaySystem();
        this.learningStyleDetector = new LearningStyleDetector();

        // Enhanced configuration
        this.enhancedConfig = {
            enableCognitiveLoadDetection: true,
            enableFrustrationDetection: true,
            enableContextAwareness: true,
            enableAutoBreaks: true,
            enableConfidenceDecay: true,
            enableStyleDetection: true,
            interventionThreshold: 70        // Cognitive load/frustration threshold for intervention
        };

        // Start context-aware session
        this.contextAwareDifficulty.startSession();
    }

    /**
     * Enhanced exercise recording with full cognitive/emotional analysis
     */
    recordExerciseAttempt(exercise, userAnswer, isCorrect, responseTimeMs = null, metadata = {}) {
        // Call parent method
        const parentResult = super.recordExerciseAttempt(exercise, userAnswer, isCorrect, responseTimeMs);

        // Enhanced analysis
        const sessionDuration = this.contextAwareDifficulty.getSessionDuration();

        // 1. Cognitive load analysis
        const cognitiveAnalysis = this.cognitiveLoadDetector.analyzeResponse({
            exerciseId: exercise.id,
            correct: isCorrect,
            responseTime: responseTimeMs,
            previousAttempts: metadata.attempts || 0,
            difficulty: exercise.difficulty,
            conceptComplexity: this.estimateConceptComplexity(exercise),
            hintsUsed: metadata.hintsUsed || 0,
            errorPattern: metadata.errorPattern
        });

        // 2. Frustration analysis
        const frustrationAnalysis = this.frustrationDetector.analyzeInteraction({
            exerciseId: exercise.id,
            concept: exercise.concept,
            correct: isCorrect,
            responseTime: responseTimeMs,
            hintsUsed: metadata.hintsUsed || 0,
            attempts: metadata.attempts || 1,
            difficulty: exercise.difficulty,
            abandoned: metadata.abandoned || false,
            streakBroken: metadata.streakBroken || false
        });

        // 3. Context-aware difficulty
        const difficultyContext = this.contextAwareDifficulty.calculateDifficultyModifier({
            currentTime: new Date(),
            sessionDuration,
            exerciseType: exercise.type,
            userEnergy: metadata.userEnergy,
            recentPerformance: this.getRecentPerformance()
        });

        // Record performance for pattern learning
        this.contextAwareDifficulty.recordPerformance({
            timestamp: Date.now(),
            correct: isCorrect,
            responseTime: responseTimeMs,
            difficulty: exercise.difficulty
        });

        // 4. Learning style detection
        this.learningStyleDetector.analyzeInteraction({
            exerciseType: exercise.type,
            correct: isCorrect,
            responseTime: responseTimeMs,
            hintsUsed: metadata.hintsUsed || 0,
            hasVisuals: exercise.hasVisuals || false
        });

        // 5. Check for micro-break needs
        const breakSuggestion = this.microBreakSystem.shouldSuggestBreak({
            sessionDuration,
            cognitiveLoad: cognitiveAnalysis.currentLoad,
            frustration: frustrationAnalysis.frustrationLevel,
            accuracy: this.calculateRecentAccuracy()
        });

        // 6. Generate combined interventions
        const interventions = this.generateCombinedInterventions(
            cognitiveAnalysis,
            frustrationAnalysis,
            difficultyContext,
            breakSuggestion
        );

        return {
            ...parentResult,
            cognitive: cognitiveAnalysis,
            frustration: frustrationAnalysis,
            difficultyContext,
            breakSuggestion,
            interventions,
            learningStyle: this.learningStyleDetector.getDominantPreference()
        };
    }

    /**
     * Enhanced exercise selection with cognitive/emotional awareness
     */
    getNextOptimizedExercise(availableExercises, currentUnit, userProgress) {
        // Get base selection from parent
        let selectedExercise = super.getNextOptimizedExercise(availableExercises, currentUnit, userProgress);

        // Apply confidence decay filter
        if (this.enhancedConfig.enableConfidenceDecay) {
            const itemsNeedingReview = this.confidenceDecay.getItemsDueForReview(availableExercises, 10);
            if (itemsNeedingReview.length > 0 && Math.random() < 0.3) {
                // 30% chance to prioritize review
                selectedExercise = itemsNeedingReview[0];
            }
        }

        // Apply context-aware difficulty adjustment
        if (this.enhancedConfig.enableContextAwareness) {
            const sessionDuration = this.contextAwareDifficulty.getSessionDuration();
            const difficultyContext = this.contextAwareDifficulty.calculateDifficultyModifier({
                currentTime: new Date(),
                sessionDuration,
                exerciseType: selectedExercise.type
            });

            // Adjust difficulty based on context
            if (difficultyContext.modifier < 0.8) {
                // Low energy period - select easier exercise
                const easierExercises = availableExercises.filter(e =>
                    (e.difficulty || 50) < (selectedExercise.difficulty || 50)
                );
                if (easierExercises.length > 0) {
                    selectedExercise = easierExercises[0];
                }
            }
        }

        // Apply cognitive load considerations
        const cognitiveLoadLevel = this.cognitiveLoadDetector.categorizeLoadLevel(
            this.cognitiveLoadDetector.currentLoad
        );

        if (cognitiveLoadLevel === 'high') {
            // Select simpler exercises
            const simpleExercises = availableExercises.filter(e =>
                e.type === 'vocabulary' || e.type === 'review'
            );
            if (simpleExercises.length > 0) {
                selectedExercise = simpleExercises[0];
            }
        }

        return selectedExercise;
    }

    /**
     * Generate combined interventions from all systems
     */
    generateCombinedInterventions(cognitive, frustration, difficultyContext, breakSuggestion) {
        const interventions = [];

        // Critical: High cognitive load + high frustration
        if (cognitive.currentLoad >= 70 && frustration.frustrationLevel >= 70) {
            interventions.push({
                type: 'critical_intervention',
                priority: 'critical',
                message: '⚠️ Zeit für eine Pause! Du arbeitest seit längerem sehr konzentriert.',
                actions: ['force_break', 'reduce_difficulty', 'show_encouragement'],
                reason: 'Combined high cognitive load and frustration'
            });
        }

        // Cognitive load recommendations
        cognitive.recommendations.forEach(rec => interventions.push(rec));

        // Frustration interventions
        frustration.interventions.forEach(int => interventions.push(int));

        // Context-based recommendations
        difficultyContext.recommendations.forEach(rec => interventions.push(rec));

        // Break suggestion
        if (breakSuggestion.suggest) {
            const breakType = this.microBreakSystem.breakTypes[breakSuggestion.type];
            interventions.push({
                type: 'break_suggested',
                priority: 'high',
                message: `${breakType.icon} ${breakSuggestion.reason}. Pause empfohlen: ${breakType.label}`,
                action: 'suggest_break',
                breakDuration: breakType.duration,
                activities: this.microBreakSystem.getBreakActivities(breakSuggestion.type)
            });
        }

        // Sort by priority
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
        interventions.sort((a, b) =>
            (priorityOrder[a.priority] || 5) - (priorityOrder[b.priority] || 5)
        );

        return interventions;
    }

    /**
     * Estimate concept complexity for cognitive load calculation
     */
    estimateConceptComplexity(exercise) {
        const complexityMap = {
            'vocabulary': { chunks: 1 },
            'ser-conjugation': { chunks: 2 },
            'estar-conjugation': { chunks: 2 },
            'ser-estar-contrast': { chunks: 4 },
            'tener': { chunks: 2 },
            'integration': { chunks: 5 }
        };

        return complexityMap[exercise.concept] || { chunks: 2 };
    }

    /**
     * Calculate recent accuracy
     */
    calculateRecentAccuracy() {
        const recent = this.sessionExercises.slice(-10);
        if (recent.length === 0) return 1.0;

        const correct = recent.filter(e => e.isCorrect).length;
        return correct / recent.length;
    }

    /**
     * Get recent performance for context
     */
    getRecentPerformance() {
        return {
            accuracy: this.calculateRecentAccuracy(),
            exerciseCount: this.sessionExercises.length
        };
    }

    /**
     * Enhanced session end with full analysis
     */
    endSession() {
        const baseSummary = super.endSession();

        // Enhanced summaries
        const enhancedSummary = {
            ...baseSummary,
            cognitiveLoad: this.cognitiveLoadDetector.getSummary(),
            frustration: this.frustrationDetector.getSummary(),
            contextAwareness: this.contextAwareDifficulty.getSummary(),
            learningStyle: this.learningStyleDetector.getDominantPreference(),
            recommendations: this.generateSessionRecommendations()
        };

        return enhancedSummary;
    }

    /**
     * Generate end-of-session recommendations
     */
    generateSessionRecommendations() {
        const recommendations = [];

        // Optimal learning time
        const optimalTime = this.contextAwareDifficulty.detectOptimalLearningTime();
        if (optimalTime.bestHour !== null) {
            recommendations.push({
                type: 'optimal_time',
                message: optimalTime.recommendation
            });
        }

        // Learning style recommendations
        const styleRecs = this.learningStyleDetector.getRecommendations();
        styleRecs.forEach(rec => recommendations.push({
            type: 'learning_style',
            message: rec
        }));

        // Flow state achievement
        if (this.frustrationDetector.flowState.inFlow) {
            recommendations.push({
                type: 'flow_achieved',
                message: '✨ Du hast den Flow-Zustand erreicht! Versuche, diese Bedingungen zu wiederholen.'
            });
        }

        return recommendations;
    }
}

// Export
if (typeof window !== 'undefined') {
    window.AdaptiveLearningOrchestratorEnhanced = AdaptiveLearningOrchestratorEnhanced;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdaptiveLearningOrchestratorEnhanced };
}
