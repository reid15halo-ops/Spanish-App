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
            // Use custom feedback if available
            if (exercise.feedbackCorrect) {
                return {
                    message: exercise.feedbackCorrect,
                    explanation: ''
                };
            }

            return {
                message: '¡Muy bien! 🎉',
                explanation: ''
            };
        }

        // Use custom feedback if available
        if (exercise.feedbackIncorrect) {
            return {
                message: `${exercise.feedbackIncorrect} Die richtige Antwort ist: <strong>${exercise.correctAnswer}</strong>`,
                explanation: exercise.explanation || ''
            };
        }

        // Generate context-specific German-optimized feedback
        let message = `Nicht ganz richtig. Die richtige Antwort ist: <strong>${exercise.correctAnswer}</strong>`;
        let explanation = '';

        if (exercise.concept && exercise.concept.includes('ser-estar')) {
            message = '⚠️ Häufiger Fehler bei SER/ESTAR!';
            explanation = `
                <p><strong>Für Deutsche besonders schwierig:</strong></p>
                <p>Im Deutschen gibt es nur ein Wort: <strong>"sein"</strong></p>
                <p>Im Spanischen gibt es zwei: <strong>SER</strong> (dauerhaft) und <strong>ESTAR</strong> (vorübergehend)</p>
                <p>Die richtige Antwort hier ist: <strong>${exercise.correctAnswer}</strong></p>
            `;
        } else if (exercise.concept && exercise.concept.includes('ser') && exercise.concept.includes('conjugation')) {
            message = 'Die SER-Konjugation ist unregelmäßig.';
            explanation = `
                <p><strong>SER</strong> ist eines der wichtigsten, aber auch unregelmäßigsten Verben!</p>
                <p>Die richtige Form ist: <strong>${exercise.correctAnswer}</strong></p>
            `;
        } else if (exercise.concept && exercise.concept.includes('estar') && exercise.concept.includes('conjugation')) {
            message = 'Die ESTAR-Konjugation ist unregelmäßig.';
            explanation = `
                <p><strong>ESTAR</strong> ist unregelmäßig - achte auf die Akzente!</p>
                <p>Die richtige Form ist: <strong>${exercise.correctAnswer}</strong></p>
            `;
        } else if (exercise.concept && exercise.concept.includes('tener')) {
            message = '⚠️ Achtung: TENER, nicht SER!';
            explanation = `
                <p><strong>Häufiger Fehler für Deutsche:</strong></p>
                <p>🇩🇪 Deutsch: "Ich <strong>bin</strong> 25 Jahre alt"</p>
                <p>🇪🇸 Spanisch: "Yo <strong>tengo</strong> 25 años" (wörtlich: Ich <em>habe</em> 25 Jahre)</p>
                <p>Die richtige Antwort ist: <strong>${exercise.correctAnswer}</strong></p>
            `;
        }

        return {
            message: message,
            explanation: explanation || exercise.explanation || ''
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
