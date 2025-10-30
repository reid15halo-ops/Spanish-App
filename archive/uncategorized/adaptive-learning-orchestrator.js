/**
 * Adaptive Learning Orchestrator
 *
 * Central coordination system that brings together all optimized adaptive learning components:
 * - V2 Knowledge Tracker with Ebbinghaus curve
 * - Interleaved Practice System
 * - Learning Analytics
 * - Intelligent exercise selection
 * - Real-time adaptation
 *
 * This provides a simple API for the Phase1Controller to use all optimizations.
 */

class AdaptiveLearningOrchestrator {
    constructor() {
        // Core systems
        this.knowledgeTracker = new AdaptiveKnowledgeTrackerV2();
        this.interleavedPractice = new InterleavedPracticeSystem();
        this.analytics = new LearningAnalytics();

        // Session tracking
        this.currentSession = null;
        this.sessionStartTime = null;
        this.sessionExercises = [];

        // Configuration
        this.config = {
            enableInterleaving: true,
            enableAnalytics: true,
            trackResponseTime: true,
            adaptiveDifficulty: true,
            minExercisesBeforeAdaptation: 5
        };

        // Load saved data
        this.load();
    }

    /**
     * Start a new learning session
     */
    startSession(sessionConfig = {}) {
        this.currentSession = {
            id: Date.now(),
            startTime: Date.now(),
            exercises: [],
            responseTime: [],
            config: { ...this.config, ...sessionConfig }
        };

        this.sessionStartTime = Date.now();
        this.sessionExercises = [];

        return this.currentSession.id;
    }

    /**
     * Get next optimized exercise
     *
     * This is the main method that Phase1Controller will call
     */
    getNextOptimizedExercise(availableExercises, currentUnit, userProgress) {
        if (!this.currentSession) {
            this.startSession();
        }

        // If interleaving is enabled, use interleaved practice
        if (this.config.enableInterleaving && availableExercises.length > 3) {
            const interleavedSet = this.interleavedPractice.generateInterleavedSession(
                availableExercises,
                10,
                this.knowledgeTracker
            );

            // Take the first one from interleaved set
            return interleavedSet[0];
        }

        // Otherwise, use optimized practice list
        const optimized = this.knowledgeTracker.getOptimizedPracticeList(
            availableExercises,
            1,
            'vocabulary'
        );

        return optimized[0] || availableExercises[0];
    }

    /**
     * Record exercise attempt with full tracking
     */
    recordExerciseAttempt(exercise, userAnswer, isCorrect, responseTimeMs = null) {
        if (!this.currentSession) {
            this.startSession();
        }

        // Record in current session
        const attempt = {
            timestamp: Date.now(),
            exercise: exercise,
            userAnswer: userAnswer,
            isCorrect: isCorrect,
            responseTime: responseTimeMs,
            concept: exercise.concept || exercise.category || 'general'
        };

        this.sessionExercises.push(attempt);

        // Update knowledge tracker
        const itemId = exercise.id || exercise.vocabularyId || exercise.concept;
        const itemType = exercise.type === 'vocabulary-translation' ? 'vocabulary' :
                        exercise.concept ? 'grammar' : 'vocabulary';

        this.knowledgeTracker.recordAttempt(
            itemType,
            itemId,
            isCorrect,
            responseTimeMs,
            {
                unit: exercise.unit,
                difficulty: exercise.difficulty,
                direction: exercise.direction
            }
        );

        // Save progress
        this.save();

        return {
            recorded: true,
            knowledgeLevel: this.knowledgeTracker.getKnowledge(itemType, itemId)?.knowledgeLevel || 'new',
            nextReview: this.knowledgeTracker.getKnowledge(itemType, itemId)?.nextReview
        };
    }

    /**
     * End current session and generate summary
     */
    endSession() {
        if (!this.currentSession) {
            return null;
        }

        const sessionDuration = Date.now() - this.sessionStartTime;
        const correctCount = this.sessionExercises.filter(e => e.isCorrect).length;
        const totalExercises = this.sessionExercises.length;

        // Group exercises by concept
        const conceptStats = {};
        this.sessionExercises.forEach(attempt => {
            const concept = attempt.concept;
            if (!conceptStats[concept]) {
                conceptStats[concept] = {
                    name: concept,
                    attempts: 0,
                    correct: 0,
                    totalResponseTime: 0,
                    accuracy: 0,
                    avgResponseTime: 0
                };
            }

            conceptStats[concept].attempts++;
            if (attempt.isCorrect) conceptStats[concept].correct++;
            if (attempt.responseTime) conceptStats[concept].totalResponseTime += attempt.responseTime;
        });

        // Calculate concept stats
        Object.values(conceptStats).forEach(stat => {
            stat.accuracy = stat.correct / stat.attempts;
            stat.avgResponseTime = stat.totalResponseTime / stat.attempts;
        });

        // Session summary
        const sessionSummary = {
            sessionId: this.currentSession.id,
            duration: sessionDuration,
            exercisesCompleted: totalExercises,
            correctAnswers: correctCount,
            accuracy: totalExercises > 0 ? correctCount / totalExercises : 0,
            concepts: Object.values(conceptStats),
            avgResponseTime: this.sessionExercises
                .filter(e => e.responseTime)
                .reduce((sum, e) => sum + e.responseTime, 0) / this.sessionExercises.length || 0,
            errors: this.sessionExercises.filter(e => !e.isCorrect)
        };

        // Record in analytics
        if (this.config.enableAnalytics) {
            this.analytics.recordSession(sessionSummary);
        }

        // Analyze session effectiveness if interleaving was used
        let interleavingAnalysis = null;
        if (this.config.enableInterleaving) {
            interleavingAnalysis = this.interleavedPractice.analyzeSessionEffectiveness(
                this.sessionExercises
            );
        }

        // Clear current session
        this.currentSession = null;
        this.sessionExercises = [];

        // Save all progress
        this.save();

        return {
            summary: sessionSummary,
            interleavingAnalysis: interleavingAnalysis,
            newMilestones: this.analytics.milestones.slice(-3) // Last 3 milestones
        };
    }

    /**
     * Get comprehensive learning insights
     */
    getLearningInsights() {
        return {
            knowledgeSummary: this.knowledgeTracker.getKnowledgeSummary(),
            learningVelocity: this.analytics.getLearningVelocity(),
            strengthsWeaknesses: this.analytics.analyzeStrengthsWeaknesses(this.knowledgeTracker),
            milestones: this.analytics.milestones.slice(-5),
            recommendations: this.generateRecommendations()
        };
    }

    /**
     * Generate personalized recommendations
     */
    generateRecommendations() {
        const recommendations = [];

        // Get knowledge summary
        const knowledge = this.knowledgeTracker.getKnowledgeSummary();

        // Velocity-based recommendations
        const velocity = this.analytics.getLearningVelocity();
        if (velocity.trend === 'declining') {
            recommendations.push({
                type: 'consistency',
                priority: 'high',
                message: 'Dein Lernfortschritt verlangsamt sich.',
                suggestion: 'Versuche, täglich zu üben, auch wenn es nur 10 Minuten sind.',
                action: 'increase-frequency'
            });
        } else if (velocity.trend === 'improving') {
            recommendations.push({
                type: 'motivation',
                priority: 'low',
                message: 'Großartig! Dein Lerntempo verbessert sich!',
                suggestion: 'Behalte diesen Rhythmus bei!',
                action: 'continue'
            });
        }

        // Knowledge-based recommendations
        if (knowledge.vocabulary) {
            const vocabMastery = knowledge.vocabulary.mastered / (knowledge.vocabulary.total || 1);

            if (vocabMastery < 0.30 && knowledge.vocabulary.total > 20) {
                recommendations.push({
                    type: 'focus',
                    priority: 'high',
                    message: 'Viele Vokabeln noch nicht gemeistert.',
                    suggestion: 'Konzentriere dich auf Wiederholung statt neue Wörter.',
                    action: 'focus-review'
                });
            }

            if (knowledge.vocabulary.struggling > 5) {
                recommendations.push({
                    type: 'intervention',
                    priority: 'high',
                    message: `${knowledge.vocabulary.struggling} Vokabeln bereiten Schwierigkeiten.`,
                    suggestion: 'Nutze Eselsbrücken oder visuelle Hilfen für schwierige Wörter.',
                    action: 'use-mnemonics'
                });
            }
        }

        // Grammar recommendations
        if (knowledge.grammar) {
            const strugglingGrammar = this.knowledgeTracker.getStrugglingItems('grammar');

            if (strugglingGrammar.length > 0) {
                const topStruggle = strugglingGrammar[0];
                recommendations.push({
                    type: 'focus',
                    priority: 'high',
                    message: `Grammatik-Konzept "${topStruggle.concept || topStruggle.itemId}" braucht mehr Übung.`,
                    suggestion: 'Wiederhole die Regel und mache Kontrastübungen.',
                    action: 'grammar-drill',
                    concept: topStruggle.concept || topStruggle.itemId
                });
            }
        }

        // Confidence-based recommendations
        if (knowledge.insights && knowledge.insights.metrics) {
            const avgConfidence = knowledge.insights.metrics.confidence || 0;

            if (avgConfidence < 0.40) {
                recommendations.push({
                    type: 'strategy',
                    priority: 'medium',
                    message: 'Du scheinst oft unsicher zu sein.',
                    suggestion: 'Nimm dir Zeit, die Regeln zu verstehen. Qualität vor Geschwindigkeit!',
                    action: 'slow-down'
                });
            }
        }

        // Session frequency recommendations
        if (this.analytics.sessionHistory.length > 0) {
            const last7Days = Date.now() - (7 * 24 * 60 * 60 * 1000);
            const sessionsLast7Days = this.analytics.sessionHistory.filter(
                s => s.timestamp >= last7Days
            ).length;

            if (sessionsLast7Days < 3) {
                recommendations.push({
                    type: 'consistency',
                    priority: 'medium',
                    message: 'Du hast diese Woche wenig geübt.',
                    suggestion: 'Versuche, mindestens 3-4 Mal pro Woche zu üben.',
                    action: 'increase-frequency'
                });
            } else if (sessionsLast7Days >= 7) {
                recommendations.push({
                    type: 'motivation',
                    priority: 'low',
                    message: 'Fantastische Konsistenz! 🔥',
                    suggestion: 'Achte darauf, dich nicht zu überfordern. Pausen sind auch wichtig!',
                    action: 'continue'
                });
            }
        }

        return recommendations.sort((a, b) => {
            const priority = { high: 3, medium: 2, low: 1 };
            return priority[b.priority] - priority[a.priority];
        });
    }

    /**
     * Get practice plan for next session
     */
    getPracticePlan(availableItems, targetExercises = 20) {
        const plan = {
            exercises: [],
            focus: [],
            estimatedTime: 0,
            difficulty: 'balanced'
        };

        // Determine focus areas
        const strugglingItems = this.knowledgeTracker.getStrugglingItems('vocabulary');
        const strugglingGrammar = this.knowledgeTracker.getStrugglingItems('grammar');

        if (strugglingItems.length > 0) {
            plan.focus.push({
                area: 'vocabulary',
                items: strugglingItems.slice(0, 5).map(i => i.itemId)
            });
        }

        if (strugglingGrammar.length > 0) {
            plan.focus.push({
                area: 'grammar',
                concepts: strugglingGrammar.slice(0, 3).map(g => g.concept || g.itemId)
            });
        }

        // Get optimized exercise list
        if (this.config.enableInterleaving) {
            plan.exercises = this.interleavedPractice.generateInterleavedSession(
                availableItems,
                targetExercises,
                this.knowledgeTracker
            );
        } else {
            plan.exercises = this.knowledgeTracker.getOptimizedPracticeList(
                availableItems,
                targetExercises,
                'vocabulary'
            );
        }

        // Estimate time (1.5 min per exercise average)
        plan.estimatedTime = plan.exercises.length * 1.5;

        // Determine difficulty
        const avgKnowledgeLevel = plan.exercises.reduce((sum, ex) => {
            const knowledge = this.knowledgeTracker.getKnowledge('vocabulary', ex.id || ex);
            const levelScore = {
                'new': 1,
                'learning': 2,
                'familiar': 3,
                'mastered': 4,
                'struggling': 1.5,
                'critical': 1
            };
            return sum + (levelScore[knowledge?.knowledgeLevel] || 2);
        }, 0) / plan.exercises.length;

        if (avgKnowledgeLevel < 2) {
            plan.difficulty = 'challenging';
        } else if (avgKnowledgeLevel > 3) {
            plan.difficulty = 'easy';
        } else {
            plan.difficulty = 'balanced';
        }

        return plan;
    }

    /**
     * Predict mastery for item
     */
    predictMastery(itemId, itemType = 'vocabulary') {
        return this.analytics.predictMasteryTimeline(itemId, this.knowledgeTracker);
    }

    /**
     * Get full analytics report
     */
    getAnalyticsReport() {
        return this.analytics.generateReport(this.knowledgeTracker);
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        this.save();
    }

    /**
     * Get current statistics
     */
    getStatistics() {
        const knowledge = this.knowledgeTracker.getKnowledgeSummary();
        const velocity = this.analytics.getLearningVelocity();

        return {
            vocabulary: {
                total: knowledge.vocabulary?.total || 0,
                mastered: knowledge.vocabulary?.mastered || 0,
                struggling: knowledge.vocabulary?.struggling || 0,
                averageAccuracy: knowledge.vocabulary?.averageAccuracy || 0,
                averageConfidence: knowledge.vocabulary?.averageConfidence || 0
            },
            grammar: {
                total: knowledge.grammar?.total || 0,
                mastered: knowledge.grammar?.mastered || 0,
                struggling: knowledge.grammar?.struggling || 0,
                averageAccuracy: knowledge.grammar?.averageAccuracy || 0
            },
            overall: {
                totalItems: (knowledge.vocabulary?.total || 0) + (knowledge.grammar?.total || 0),
                masteryRate: ((knowledge.vocabulary?.mastered || 0) + (knowledge.grammar?.mastered || 0)) /
                            ((knowledge.vocabulary?.total || 0) + (knowledge.grammar?.total || 0) || 1),
                learningVelocity: velocity.velocity,
                velocityTrend: velocity.trend,
                totalSessions: this.analytics.sessionHistory.length,
                milestonesAchieved: this.analytics.milestones.length
            }
        };
    }

    /**
     * Save all data
     */
    save() {
        this.knowledgeTracker.save();
        this.analytics.save();
        localStorage.setItem('adaptive_orchestrator_config', JSON.stringify(this.config));
    }

    /**
     * Load all data
     */
    load() {
        this.knowledgeTracker.load();
        this.analytics.load();

        const config = localStorage.getItem('adaptive_orchestrator_config');
        if (config) {
            this.config = JSON.parse(config);
        }
    }

    /**
     * Reset all data
     */
    reset() {
        this.knowledgeTracker.reset();
        this.analytics.reset();
        this.currentSession = null;
        this.sessionExercises = [];
        localStorage.removeItem('adaptive_orchestrator_config');
    }

    /**
     * Export data for backup
     */
    exportData() {
        return {
            knowledge: {
                vocabulary: this.knowledgeTracker.vocabularyKnowledge,
                grammar: this.knowledgeTracker.grammarKnowledge,
                sentences: this.knowledgeTracker.sentenceKnowledge
            },
            analytics: {
                sessions: this.analytics.sessionHistory,
                performance: this.analytics.performanceHistory,
                milestones: this.analytics.milestones
            },
            config: this.config,
            exportDate: Date.now()
        };
    }

    /**
     * Import data from backup
     */
    importData(data) {
        if (data.knowledge) {
            this.knowledgeTracker.vocabularyKnowledge = data.knowledge.vocabulary || {};
            this.knowledgeTracker.grammarKnowledge = data.knowledge.grammar || {};
            this.knowledgeTracker.sentenceKnowledge = data.knowledge.sentences || {};
        }

        if (data.analytics) {
            this.analytics.sessionHistory = data.analytics.sessions || [];
            this.analytics.performanceHistory = data.analytics.performance || {};
            this.analytics.milestones = data.analytics.milestones || [];
        }

        if (data.config) {
            this.config = data.config;
        }

        this.save();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdaptiveLearningOrchestrator };
}
