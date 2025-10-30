/**
 * Frustration Level Detector
 *
 * Monitors behavioral indicators of frustration to prevent user dropout.
 *
 * SCIENTIFIC BASIS:
 * - Flow Theory (Csikszentmihalyi, 1990)
 * - Self-Determination Theory (Deci & Ryan, 1985, 2000)
 * - Emotional Design (Norman, 2004)
 * - Achievement Emotions (Pekrun et al., 2002)
 * - Learned Helplessness (Seligman, 1972)
 *
 * FRUSTRATION INDICATORS:
 * 1. Repeated errors on same concept (learned helplessness)
 * 2. Rapid answer submissions (giving up)
 * 3. Breaking long success streaks
 * 4. Excessive hint usage
 * 5. Rapid decline in engagement metrics
 * 6. Irregular response patterns (anxiety)
 *
 * DROPOUT RISK FACTORS:
 * - Frustration level > 70% for >10 minutes
 * - Zero progress for 5+ consecutive exercises
 * - Rapid cycling through hints without reading
 * - Abandoning exercises mid-attempt
 *
 * @references
 * - Csikszentmihalyi, M. (1990). Flow: The Psychology of Optimal Experience
 * - Deci, E. L., & Ryan, R. M. (2000). Self-determination theory
 * - Pekrun, R., et al. (2002). Academic emotions in students' self-regulated learning
 * - Seligman, M. E. P. (1972). Learned helplessness
 */

class FrustrationDetector {
    constructor() {
        // Frustration level: 0-100 (0 = calm, 100 = extreme frustration)
        this.currentFrustration = 0;
        this.frustrationHistory = [];

        // Dropout risk: low, medium, high, critical
        this.dropoutRisk = 'low';

        // Thresholds calibrated from user research
        this.thresholds = {
            repeatedErrors: 3,              // Same concept failed 3+ times
            rapidSubmission: 2000,          // <2s submission = giving up
            streakBreakFrustration: 5,      // Breaking 5+ streak = frustration spike
            excessiveHints: 3,              // >3 hints per exercise
            zeroProgressWindow: 5,          // 5 exercises without progress
            criticalFrustrationLevel: 70,   // 70+ = critical
            criticalFrustrationDuration: 600000  // 10 minutes
        };

        // Session tracking
        this.sessionMetrics = {
            attempts: [],
            errorPatterns: {},          // concept → error count
            hintUsage: [],
            successStreak: 0,
            lastSuccessTime: null,
            rapidSubmissions: 0,
            abandonments: 0,
            engagementScore: 100        // Starts at 100, declines with frustration
        };

        // Emotional state tracking (Pekrun's Achievement Emotions)
        this.emotionalState = {
            enjoyment: 50,              // 0-100
            hope: 50,
            pride: 50,
            anxiety: 50,
            shame: 50,
            hopelessness: 0,
            boredom: 0
        };

        // Flow state indicators (Csikszentmihalyi, 1990)
        this.flowState = {
            challengeLevel: 50,         // 0-100
            skillLevel: 50,             // 0-100
            inFlow: false
        };
    }

    /**
     * Analyze user behavior and detect frustration
     *
     * @param {Object} interaction - User interaction data
     * @returns {Object} Frustration analysis
     */
    analyzeInteraction(interaction) {
        const {
            exerciseId,
            concept,
            correct,
            responseTime,
            hintsUsed,
            attempts,
            difficulty,
            abandoned,
            streakBroken
        } = interaction;

        // Record interaction
        this.sessionMetrics.attempts.push({
            timestamp: Date.now(),
            concept,
            correct,
            responseTime,
            hintsUsed,
            abandoned
        });

        // Update frustration indicators
        const indicators = {
            repeatedErrors: this.detectRepeatedErrors(concept, correct),
            rapidGivingUp: this.detectRapidGivingUp(responseTime, correct),
            streakBreakImpact: this.assessStreakBreakImpact(streakBroken, correct),
            excessiveHints: this.detectExcessiveHints(hintsUsed),
            zeroProgress: this.detectZeroProgress(),
            learnedHelplessness: this.detectLearnedHelplessness()
        };

        // Calculate frustration score
        const frustrationScore = this.calculateFrustrationScore(indicators);

        this.currentFrustration = frustrationScore;
        this.frustrationHistory.push({
            timestamp: Date.now(),
            frustration: frustrationScore,
            indicators
        });

        // Keep only last 50 measurements
        if (this.frustrationHistory.length > 50) {
            this.frustrationHistory.shift();
        }

        // Update emotional state
        this.updateEmotionalState(indicators, correct);

        // Assess flow state
        this.assessFlowState(difficulty, correct, responseTime);

        // Calculate dropout risk
        this.dropoutRisk = this.calculateDropoutRisk();

        // Generate interventions
        const interventions = this.generateInterventions();

        return {
            frustrationLevel: frustrationScore,
            dropoutRisk: this.dropoutRisk,
            emotionalState: this.emotionalState,
            flowState: this.flowState,
            indicators,
            interventions,
            engagementScore: this.sessionMetrics.engagementScore
        };
    }

    /**
     * Detect repeated errors on same concept
     * Strong indicator of learned helplessness (Seligman, 1972)
     */
    detectRepeatedErrors(concept, correct) {
        if (!this.sessionMetrics.errorPatterns[concept]) {
            this.sessionMetrics.errorPatterns[concept] = 0;
        }

        if (!correct) {
            this.sessionMetrics.errorPatterns[concept]++;
        } else {
            // Reset on success
            this.sessionMetrics.errorPatterns[concept] = Math.max(0, this.sessionMetrics.errorPatterns[concept] - 1);
        }

        const errorCount = this.sessionMetrics.errorPatterns[concept];

        // Score increases exponentially with repeated errors
        if (errorCount >= this.thresholds.repeatedErrors) {
            return Math.min(100, ((errorCount - 2) / 3) * 100);
        }

        return 0;
    }

    /**
     * Detect rapid submissions (giving up)
     * User submits answer very quickly after seeing exercise = not reading/trying
     */
    detectRapidGivingUp(responseTime, correct) {
        if (responseTime < this.thresholds.rapidSubmission && !correct) {
            this.sessionMetrics.rapidSubmissions++;
            return 50;  // Moderate frustration indicator
        }

        return 0;
    }

    /**
     * Assess impact of breaking success streak
     * Breaking a long streak causes frustration spike
     */
    assessStreakBreakImpact(streakBroken, correct) {
        if (streakBroken && streakBroken >= this.thresholds.streakBreakFrustration) {
            // Longer streaks = higher frustration when broken
            return Math.min(100, (streakBroken / 10) * 100);
        }

        if (correct) {
            this.sessionMetrics.successStreak++;
            this.sessionMetrics.lastSuccessTime = Date.now();
        } else {
            this.sessionMetrics.successStreak = 0;
        }

        return 0;
    }

    /**
     * Detect excessive hint usage
     * Using many hints = struggling and getting frustrated
     */
    detectExcessiveHints(hintsUsed) {
        this.sessionMetrics.hintUsage.push(hintsUsed || 0);

        // Keep last 10 exercises
        if (this.sessionMetrics.hintUsage.length > 10) {
            this.sessionMetrics.hintUsage.shift();
        }

        const avgHints = this.sessionMetrics.hintUsage.reduce((a, b) => a + b, 0) / this.sessionMetrics.hintUsage.length;

        if (avgHints > this.thresholds.excessiveHints) {
            return Math.min(100, (avgHints / this.thresholds.excessiveHints) * 50);
        }

        return 0;
    }

    /**
     * Detect zero progress (no correct answers in recent attempts)
     * Strong indicator of frustration and dropout risk
     */
    detectZeroProgress() {
        const recent = this.sessionMetrics.attempts.slice(-this.thresholds.zeroProgressWindow);

        if (recent.length < this.thresholds.zeroProgressWindow) {
            return 0;
        }

        const anyCorrect = recent.some(attempt => attempt.correct);

        if (!anyCorrect) {
            return 100;  // Critical frustration indicator
        }

        return 0;
    }

    /**
     * Detect learned helplessness
     * Multiple concepts failing, rapid submissions, high hint usage = giving up
     */
    detectLearnedHelplessness() {
        const failingConcepts = Object.values(this.sessionMetrics.errorPatterns).filter(count => count >= 3).length;
        const rapidSubmissions = this.sessionMetrics.rapidSubmissions;

        if (failingConcepts >= 2 && rapidSubmissions >= 3) {
            return 100;  // Critical: learned helplessness detected
        }

        return 0;
    }

    /**
     * Calculate overall frustration score
     */
    calculateFrustrationScore(indicators) {
        // Weights based on empirical impact on dropout
        const weights = {
            repeatedErrors: 0.25,
            rapidGivingUp: 0.15,
            streakBreakImpact: 0.10,
            excessiveHints: 0.15,
            zeroProgress: 0.25,
            learnedHelplessness: 0.10
        };

        let score = 0;
        for (const [indicator, value] of Object.entries(indicators)) {
            score += value * (weights[indicator] || 0);
        }

        // Decay previous frustration slightly (recovery over time)
        const decayedPrevious = this.currentFrustration * 0.7;
        const blended = (score * 0.5) + (decayedPrevious * 0.5);

        return Math.round(Math.min(100, blended));
    }

    /**
     * Update emotional state based on Achievement Emotions theory (Pekrun et al., 2002)
     */
    updateEmotionalState(indicators, correct) {
        // Positive emotions increase with success
        if (correct) {
            this.emotionalState.enjoyment = Math.min(100, this.emotionalState.enjoyment + 5);
            this.emotionalState.hope = Math.min(100, this.emotionalState.hope + 3);
            this.emotionalState.pride = Math.min(100, this.emotionalState.pride + 5);
            this.emotionalState.anxiety = Math.max(0, this.emotionalState.anxiety - 5);
        } else {
            // Negative emotions increase with failure
            this.emotionalState.enjoyment = Math.max(0, this.emotionalState.enjoyment - 5);
            this.emotionalState.anxiety = Math.min(100, this.emotionalState.anxiety + 5);

            if (indicators.repeatedErrors > 50) {
                this.emotionalState.hopelessness = Math.min(100, this.emotionalState.hopelessness + 10);
                this.emotionalState.shame = Math.min(100, this.emotionalState.shame + 5);
            }
        }

        // Boredom increases if too easy (low difficulty + high success)
        if (this.sessionMetrics.successStreak > 10) {
            this.emotionalState.boredom = Math.min(100, this.emotionalState.boredom + 5);
        }
    }

    /**
     * Assess flow state (Csikszentmihalyi, 1990)
     * Flow occurs when challenge matches skill level
     */
    assessFlowState(difficulty, correct, responseTime) {
        // Estimate skill from recent performance
        const recent = this.sessionMetrics.attempts.slice(-10);
        const accuracy = recent.filter(a => a.correct).length / Math.max(1, recent.length);

        this.flowState.skillLevel = Math.round(accuracy * 100);
        this.flowState.challengeLevel = difficulty || 50;

        // Flow state when challenge ≈ skill (within 20 points)
        const difference = Math.abs(this.flowState.challengeLevel - this.flowState.skillLevel);

        this.flowState.inFlow = difference < 20 && accuracy > 0.6 && accuracy < 0.9;

        return this.flowState;
    }

    /**
     * Calculate dropout risk
     */
    calculateDropoutRisk() {
        // Critical: High frustration sustained over time
        const criticalFrustrationPeriod = this.frustrationHistory
            .slice(-10)
            .filter(entry => entry.frustration >= this.thresholds.criticalFrustrationLevel);

        if (criticalFrustrationPeriod.length >= 8) {  // 8 out of last 10
            return 'critical';
        }

        // High: Learned helplessness or zero progress
        if (this.emotionalState.hopelessness > 70) {
            return 'high';
        }

        // Medium: Moderate sustained frustration
        if (this.currentFrustration >= 50) {
            return 'medium';
        }

        return 'low';
    }

    /**
     * Generate interventions based on frustration level and risk
     */
    generateInterventions() {
        const interventions = [];

        // Critical dropout risk
        if (this.dropoutRisk === 'critical') {
            interventions.push({
                type: 'break_required',
                priority: 'critical',
                message: 'Du arbeitest sehr hart! Zeit für eine kurze Pause. ☕',
                action: 'force_break',
                duration: 300000  // 5 minutes
            });

            interventions.push({
                type: 'reduce_difficulty',
                priority: 'critical',
                message: 'Lass uns einen Schritt zurückgehen und das nochmal üben.',
                action: 'difficulty_down'
            });
        }

        // High frustration
        if (this.currentFrustration >= 70) {
            interventions.push({
                type: 'encouragement',
                priority: 'high',
                message: '💪 Du machst das toll! Lernen ist ein Prozess. Bleib dran!',
                action: 'show_encouragement'
            });

            interventions.push({
                type: 'easier_exercises',
                priority: 'high',
                message: 'Lass uns mit etwas Einfacherem anfangen.',
                action: 'filter_easy_exercises'
            });
        }

        // Learned helplessness detected
        if (this.emotionalState.hopelessness > 70) {
            interventions.push({
                type: 'success_experience',
                priority: 'critical',
                message: 'Hier ist eine Übung, die du schaffst! 🎯',
                action: 'provide_easy_success'
            });

            interventions.push({
                type: 'explain_concept',
                priority: 'high',
                message: 'Lass mich das nochmal erklären.',
                action: 'show_detailed_explanation'
            });
        }

        // Moderate frustration
        if (this.currentFrustration >= 40 && this.currentFrustration < 70) {
            interventions.push({
                type: 'hint_suggestion',
                priority: 'medium',
                message: 'Brauchst du einen Hinweis? 💡',
                action: 'offer_hint'
            });
        }

        // In flow state - maintain it!
        if (this.flowState.inFlow) {
            interventions.push({
                type: 'maintain_flow',
                priority: 'low',
                message: '✨ Du bist im Flow! Weiter so!',
                action: 'maintain_difficulty'
            });
        }

        // Boredom detected
        if (this.emotionalState.boredom > 60) {
            interventions.push({
                type: 'increase_challenge',
                priority: 'medium',
                message: 'Bereit für eine größere Herausforderung? 🚀',
                action: 'difficulty_up'
            });
        }

        return interventions;
    }

    /**
     * Get frustration summary
     */
    getSummary() {
        return {
            currentFrustration: this.currentFrustration,
            dropoutRisk: this.dropoutRisk,
            emotionalState: this.emotionalState,
            flowState: this.flowState,
            engagementScore: this.sessionMetrics.engagementScore,
            averageFrustration: this.calculateAverageFrustration()
        };
    }

    /**
     * Calculate average frustration
     */
    calculateAverageFrustration() {
        if (this.frustrationHistory.length === 0) return 0;

        const sum = this.frustrationHistory.reduce((acc, entry) => acc + entry.frustration, 0);
        return Math.round(sum / this.frustrationHistory.length);
    }

    /**
     * Reset session
     */
    reset() {
        this.currentFrustration = 0;
        this.sessionMetrics = {
            attempts: [],
            errorPatterns: {},
            hintUsage: [],
            successStreak: 0,
            lastSuccessTime: null,
            rapidSubmissions: 0,
            abandonments: 0,
            engagementScore: 100
        };
    }
}

// Export
if (typeof window !== 'undefined') {
    window.FrustrationDetector = FrustrationDetector;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FrustrationDetector };
}
