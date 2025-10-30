/**
 * Learning Style Detector
 *
 * Detects user's preferred learning modalities.
 *
 * NOTE: Learning styles theory (VARK) is controversial and lacks strong
 * empirical support (Pashler et al., 2008). However, learner preferences
 * exist and can inform content presentation.
 *
 * DETECTED PREFERENCES:
 * - Visual: Prefers images, diagrams, spatial organization
 * - Verbal: Prefers text, reading, written explanations
 * - Interactive: Prefers hands-on, typing exercises
 * - Audio: Prefers listening, pronunciation (future feature)
 *
 * @references
 * - Pashler, H., et al. (2008). Learning Styles: Concepts and Evidence
 * - Willingham, D. T., et al. (2015). The Scientific Status of Learning Styles
 */

class LearningStyleDetector {
    constructor() {
        this.preferences = {
            visual: 0,      // Images, emojis, colors
            verbal: 0,      // Text explanations
            interactive: 0, // Typing, clicking
            pattern: 0      // Pattern recognition
        };

        this.interactions = [];
    }

    /**
     * Analyze interaction and infer preference
     */
    analyzeInteraction(interaction) {
        const { exerciseType, correct, responseTime, hintsUsed, hasVisuals } = interaction;

        // Track performance by modality
        if (hasVisuals && correct) {
            this.preferences.visual += 1;
        }

        if (exerciseType === 'text' && correct && responseTime < 5000) {
            this.preferences.verbal += 1;
        }

        if (exerciseType === 'typing' && correct) {
            this.preferences.interactive += 1;
        }

        if (exerciseType.includes('pattern') && correct) {
            this.preferences.pattern += 1;
        }

        this.interactions.push(interaction);
    }

    /**
     * Get dominant learning preference
     */
    getDominantPreference() {
        const total = Object.values(this.preferences).reduce((a, b) => a + b, 0);
        if (total < 10) return null; // Not enough data

        let dominant = 'visual';
        let maxScore = 0;

        for (const [style, score] of Object.entries(this.preferences)) {
            if (score > maxScore) {
                maxScore = score;
                dominant = style;
            }
        }

        return {
            dominant,
            score: maxScore,
            distribution: this.getDistribution(),
            confidence: maxScore / total
        };
    }

    /**
     * Get distribution of preferences
     */
    getDistribution() {
        const total = Object.values(this.preferences).reduce((a, b) => a + b, 0);
        const dist = {};

        for (const [style, score] of Object.entries(this.preferences)) {
            dist[style] = total > 0 ? score / total : 0;
        }

        return dist;
    }

    /**
     * Get content recommendations
     */
    getRecommendations() {
        const pref = this.getDominantPreference();
        if (!pref) return ['More exercises needed to determine preference'];

        const recommendations = {
            visual: [
                'Use emoji-based exercises',
                'Include diagrams and visual aids',
                'Color-code grammar rules'
            ],
            verbal: [
                'Provide detailed text explanations',
                'Include reading comprehension',
                'Written grammar guides'
            ],
            interactive: [
                'More typing exercises',
                'Sentence building activities',
                'Interactive games'
            ],
            pattern: [
                'Pattern recognition exercises',
                'Rule-based learning',
                'Systematic grammar drills'
            ]
        };

        return recommendations[pref.dominant] || [];
    }
}

if (typeof window !== 'undefined') window.LearningStyleDetector = LearningStyleDetector;
if (typeof module !== 'undefined' && module.exports) module.exports = { LearningStyleDetector };
