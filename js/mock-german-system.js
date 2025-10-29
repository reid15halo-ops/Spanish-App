/**
 * Mock GermanSpanishLearningSystem
 * Simplified version for UI testing
 */

class GermanSpanishLearningSystem {
    constructor() {
        console.log('🇩🇪🇪🇸 Mock German-Spanish System initialized');
    }

    analyzeExerciseForGermans(exercise, userAnswer, correctAnswer) {
        return {
            transferType: 'neutral',
            interferenceRisk: 'medium',
            falseFriendDetected: false
        };
    }

    generateGermanOptimizedFeedback(exercise, userAnswer, isCorrect) {
        if (isCorrect) {
            return {
                message: '¡Muy bien! 🎉',
                explanation: ''
            };
        }

        // Generate German-specific feedback
        let explanation = '<p>Das war leider nicht richtig.</p>';

        if (exercise.concept && exercise.concept.includes('ser-estar')) {
            explanation += `
                <p><strong>Häufiger Fehler für Deutsche:</strong></p>
                <p>Im Deutschen gibt es nur "sein", im Spanischen aber SER und ESTAR.</p>
            `;
        } else if (exercise.concept && exercise.concept.includes('tener-age')) {
            explanation += `
                <p><strong>Häufiger Fehler für Deutsche:</strong></p>
                <p>🇩🇪 Deutsch: "Ich <strong>bin</strong> 25 Jahre alt"</p>
                <p>🇪🇸 Spanisch: "Yo <strong>tengo</strong> 25 años"</p>
            `;
        }

        return {
            message: `Leider falsch. Die richtige Antwort ist: ${exercise.correctAnswer}`,
            explanation: explanation
        };
    }

    getGermanBridge(exercise) {
        return exercise.germanBridge || exercise.german || '';
    }

    optimizeExerciseSequenceForGermans(exercises, userProgress) {
        // Mock: return exercises as-is
        return exercises;
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.GermanSpanishLearningSystem = GermanSpanishLearningSystem;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GermanSpanishLearningSystem };
}
