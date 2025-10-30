/**
 * Confidence Decay System
 *
 * Gradually reduces confidence for items not reviewed recently.
 * Based on Ebbinghaus Forgetting Curve.
 *
 * SCIENTIFIC BASIS:
 * - Ebbinghaus Forgetting Curve (1885)
 * - Spacing Effect (Cepeda et al., 2006)
 * - Memory Consolidation Theory (Dudai, 2004)
 *
 * DECAY FORMULA:
 * R(t) = e^(-t/S)
 * where R = retention, t = time, S = memory strength
 */

class ConfidenceDecaySystem {
    constructor() {
        // Decay constants (in days)
        this.decayRates = {
            new: 0.5,          // 50% confidence lost per day
            learning: 2,       // 50% lost every 2 days
            familiar: 5,       // 50% lost every 5 days
            mastered: 14,      // 50% lost every 2 weeks
            critical: 0.25     // Very fast decay
        };
    }

    /**
     * Calculate current confidence with decay
     */
    calculateConfidenceWithDecay(item) {
        const { confidence, lastReview, knowledgeLevel } = item;
        const daysSinceReview = (Date.now() - lastReview) / 86400000;
        const decayRate = this.decayRates[knowledgeLevel] || this.decayRates.learning;

        // Exponential decay: R(t) = R₀ * e^(-t/S)
        const currentConfidence = confidence * Math.exp(-daysSinceReview / decayRate);

        return {
            original: confidence,
            decayed: Math.max(0, Math.min(100, currentConfidence)),
            daysSinceReview,
            reviewUrgency: this.calculateReviewUrgency(currentConfidence, daysSinceReview)
        };
    }

    /**
     * Calculate review urgency (0-100)
     */
    calculateReviewUrgency(confidence, daysSinceReview) {
        if (confidence < 30) return 100;        // Critical
        if (confidence < 50) return 80;         // High
        if (confidence < 70) return 50;         // Medium
        if (daysSinceReview > 14) return 60;    // Not reviewed in 2 weeks
        return 20;                              // Low urgency
    }

    /**
     * Get items due for review
     */
    getItemsDueForReview(items, limit = 10) {
        return items
            .map(item => ({
                ...item,
                decay: this.calculateConfidenceWithDecay(item)
            }))
            .sort((a, b) => b.decay.reviewUrgency - a.decay.reviewUrgency)
            .slice(0, limit);
    }
}

if (typeof window !== 'undefined') window.ConfidenceDecaySystem = ConfidenceDecaySystem;
if (typeof module !== 'undefined' && module.exports) module.exports = { ConfidenceDecaySystem };
