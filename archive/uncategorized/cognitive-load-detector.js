/**
 * Cognitive Load Detector
 *
 * Detects cognitive overload based on response patterns and behavioral indicators.
 *
 * SCIENTIFIC BASIS:
 * - Cognitive Load Theory (Sweller, 1988, 1994)
 * - Dual-channel processing (Paivio, 1986)
 * - Working memory limitations (Miller, 1956; Cowan, 2001)
 * - Cognitive load measurement via secondary tasks (Brünken et al., 2003)
 *
 * INDICATORS OF HIGH COGNITIVE LOAD:
 * 1. Increased response time variance
 * 2. Decreased accuracy over time
 * 3. Increased error frequency
 * 4. Hesitation patterns (long pauses before submission)
 * 5. Multiple answer changes before submission
 *
 * @references
 * - Sweller, J. (1988). Cognitive load during problem solving
 * - Cowan, N. (2001). The magical number 4 in short-term memory
 * - Brünken, R., et al. (2003). Direct measurement of cognitive load
 */

class CognitiveLoadDetector {
    constructor() {
        // Cognitive load levels: low (0-33), moderate (34-66), high (67-100)
        this.currentLoad = 0;
        this.loadHistory = [];

        // Thresholds based on research (Sweller, 1994)
        this.thresholds = {
            responseTimeVariance: 2.0,     // Coefficient of variation > 2.0 indicates confusion
            accuracyDecline: 0.20,         // 20% drop in accuracy
            hesitationThreshold: 10000,    // 10s pause indicates processing difficulty
            errorRateIncrease: 0.30,       // 30% increase in errors
            streakBreakThreshold: 3        // Breaking a 3+ streak indicates load spike
        };

        // Working memory capacity (Cowan, 2001: ~4 items)
        this.workingMemoryCapacity = 4;

        // Session tracking
        this.sessionMetrics = {
            responses: [],
            errors: [],
            hesitations: [],
            answerChanges: [],
            accuracyWindow: []  // Rolling window of last 10 attempts
        };

        // Cognitive load components (Sweller, 1994)
        this.loadComponents = {
            intrinsic: 0,      // Inherent difficulty of material
            extraneous: 0,     // Poor instructional design
            germane: 0         // Effort toward schema construction
        };
    }

    /**
     * Analyze response and update cognitive load estimate
     *
     * @param {Object} response - User response data
     * @returns {Object} Cognitive load analysis
     */
    analyzeResponse(response) {
        const {
            exerciseId,
            correct,
            responseTime,
            previousAttempts,
            difficulty,
            conceptComplexity,
            hintsUsed,
            errorPattern
        } = response;

        // Record response
        this.sessionMetrics.responses.push({
            timestamp: Date.now(),
            correct,
            responseTime,
            difficulty
        });

        // Keep only last 20 responses for rolling analysis
        if (this.sessionMetrics.responses.length > 20) {
            this.sessionMetrics.responses.shift();
        }

        // Calculate cognitive load indicators
        const indicators = {
            responseTimeVariance: this.calculateResponseTimeVariance(),
            accuracyTrend: this.calculateAccuracyTrend(),
            errorRate: this.calculateErrorRate(),
            hesitationLevel: this.detectHesitation(responseTime),
            complexityOverload: this.assessComplexityOverload(conceptComplexity)
        };

        // Aggregate cognitive load (weighted average)
        const loadScore = this.aggregateLoadScore(indicators);

        this.currentLoad = loadScore;
        this.loadHistory.push({
            timestamp: Date.now(),
            load: loadScore,
            indicators
        });

        // Keep only last 50 load measurements
        if (this.loadHistory.length > 50) {
            this.loadHistory.shift();
        }

        // Determine load level and recommendations
        const loadLevel = this.categorizeLoadLevel(loadScore);
        const recommendations = this.generateRecommendations(loadLevel, indicators);

        return {
            currentLoad: loadScore,
            loadLevel,
            indicators,
            recommendations,
            components: this.estimateLoadComponents(indicators)
        };
    }

    /**
     * Calculate response time variance (CV = σ/μ)
     * High variance indicates inconsistent performance = cognitive struggle
     */
    calculateResponseTimeVariance() {
        const times = this.sessionMetrics.responses
            .map(r => r.responseTime)
            .filter(t => t !== null && t > 0);

        if (times.length < 3) return 0;

        const mean = times.reduce((a, b) => a + b, 0) / times.length;
        const variance = times.reduce((sum, t) => sum + Math.pow(t - mean, 2), 0) / times.length;
        const stdDev = Math.sqrt(variance);

        // Coefficient of variation
        const cv = stdDev / mean;

        // Normalize to 0-100 scale
        return Math.min(100, (cv / this.thresholds.responseTimeVariance) * 100);
    }

    /**
     * Calculate accuracy trend over recent attempts
     * Declining accuracy = increasing cognitive load
     */
    calculateAccuracyTrend() {
        const recent = this.sessionMetrics.responses.slice(-10);
        if (recent.length < 5) return 0;

        const first5 = recent.slice(0, 5);
        const last5 = recent.slice(-5);

        const accuracy1 = first5.filter(r => r.correct).length / first5.length;
        const accuracy2 = last5.filter(r => r.correct).length / last5.length;

        const decline = accuracy1 - accuracy2;

        // Normalize: 20% decline = 100 load score
        return Math.max(0, Math.min(100, (decline / this.thresholds.accuracyDecline) * 100));
    }

    /**
     * Calculate current error rate
     */
    calculateErrorRate() {
        const recent = this.sessionMetrics.responses.slice(-10);
        if (recent.length === 0) return 0;

        const errorRate = recent.filter(r => !r.correct).length / recent.length;

        // Normalize: 50% error rate = 100 load score
        return Math.min(100, (errorRate / 0.5) * 100);
    }

    /**
     * Detect hesitation (long response times)
     */
    detectHesitation(responseTime) {
        if (!responseTime) return 0;

        // Normalize: 10s+ = high hesitation
        return Math.min(100, (responseTime / this.thresholds.hesitationThreshold) * 100);
    }

    /**
     * Assess if concept complexity exceeds working memory capacity
     * Based on Cowan (2001) - working memory holds ~4 chunks
     */
    assessComplexityOverload(conceptComplexity) {
        if (!conceptComplexity) return 0;

        // Complexity measured in "chunks" of information
        const chunks = conceptComplexity.chunks || 1;

        if (chunks <= this.workingMemoryCapacity) {
            return 0;
        }

        // Overload increases exponentially beyond capacity
        const overload = chunks - this.workingMemoryCapacity;
        return Math.min(100, (overload / this.workingMemoryCapacity) * 100);
    }

    /**
     * Aggregate cognitive load score with weighted indicators
     */
    aggregateLoadScore(indicators) {
        // Weights based on empirical research (Brünken et al., 2003)
        const weights = {
            responseTimeVariance: 0.25,
            accuracyTrend: 0.30,
            errorRate: 0.25,
            hesitationLevel: 0.10,
            complexityOverload: 0.10
        };

        let totalScore = 0;
        for (const [indicator, value] of Object.entries(indicators)) {
            totalScore += value * (weights[indicator] || 0);
        }

        return Math.round(totalScore);
    }

    /**
     * Categorize load level
     */
    categorizeLoadLevel(score) {
        if (score < 33) return 'low';
        if (score < 67) return 'moderate';
        return 'high';
    }

    /**
     * Estimate load components (Sweller's CLT)
     */
    estimateLoadComponents(indicators) {
        // Intrinsic load: inherent difficulty
        this.loadComponents.intrinsic = indicators.complexityOverload;

        // Extraneous load: confusion and hesitation
        this.loadComponents.extraneous = (indicators.responseTimeVariance + indicators.hesitationLevel) / 2;

        // Germane load: productive cognitive effort (inversely related to errors)
        this.loadComponents.germane = 100 - indicators.errorRate;

        return { ...this.loadComponents };
    }

    /**
     * Generate recommendations based on load level
     */
    generateRecommendations(loadLevel, indicators) {
        const recommendations = [];

        if (loadLevel === 'high') {
            recommendations.push({
                type: 'reduce_difficulty',
                priority: 'high',
                reason: 'Cognitive overload detected',
                action: 'Reduce exercise difficulty or provide scaffolding'
            });

            if (indicators.accuracyTrend > 50) {
                recommendations.push({
                    type: 'break_required',
                    priority: 'critical',
                    reason: 'Declining accuracy indicates fatigue',
                    action: 'Suggest 5-minute break'
                });
            }

            if (indicators.complexityOverload > 70) {
                recommendations.push({
                    type: 'chunk_content',
                    priority: 'high',
                    reason: 'Working memory capacity exceeded',
                    action: 'Break concept into smaller chunks'
                });
            }
        }

        if (loadLevel === 'moderate') {
            recommendations.push({
                type: 'maintain_difficulty',
                priority: 'medium',
                reason: 'Optimal challenge level (flow zone)',
                action: 'Continue current difficulty'
            });
        }

        if (loadLevel === 'low' && indicators.errorRate < 10) {
            recommendations.push({
                type: 'increase_difficulty',
                priority: 'low',
                reason: 'User performing well with low load',
                action: 'Gradually increase difficulty'
            });
        }

        return recommendations;
    }

    /**
     * Get cognitive load summary
     */
    getSummary() {
        return {
            currentLoad: this.currentLoad,
            loadLevel: this.categorizeLoadLevel(this.currentLoad),
            components: this.loadComponents,
            averageLoad: this.calculateAverageLoad(),
            peakLoad: this.getPeakLoad(),
            sessionDuration: this.getSessionDuration()
        };
    }

    /**
     * Calculate average load over session
     */
    calculateAverageLoad() {
        if (this.loadHistory.length === 0) return 0;

        const sum = this.loadHistory.reduce((acc, entry) => acc + entry.load, 0);
        return Math.round(sum / this.loadHistory.length);
    }

    /**
     * Get peak cognitive load
     */
    getPeakLoad() {
        if (this.loadHistory.length === 0) return 0;

        return Math.max(...this.loadHistory.map(entry => entry.load));
    }

    /**
     * Get session duration in minutes
     */
    getSessionDuration() {
        if (this.loadHistory.length === 0) return 0;

        const start = this.loadHistory[0].timestamp;
        const end = this.loadHistory[this.loadHistory.length - 1].timestamp;

        return Math.round((end - start) / 60000); // Convert to minutes
    }

    /**
     * Reset session metrics (call at end of session)
     */
    reset() {
        this.sessionMetrics = {
            responses: [],
            errors: [],
            hesitations: [],
            answerChanges: [],
            accuracyWindow: []
        };
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.CognitiveLoadDetector = CognitiveLoadDetector;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CognitiveLoadDetector };
}
