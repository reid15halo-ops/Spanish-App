/**
 * Mock AdaptiveLearningOrchestrator
 * Simplified version for UI testing
 */

class AdaptiveLearningOrchestrator {
    constructor() {
        this.sessionActive = false;
        this.attempts = [];
    }

    startSession() {
        this.sessionActive = true;
        this.attempts = [];
        console.log('📊 Mock Adaptive Learning started');
    }

    getNextOptimizedExercise(items, unit, progress) {
        // Mock: just return items as-is
        return items;
    }

    recordExerciseAttempt(exercise, answer, correct, responseTime) {
        this.attempts.push({
            exercise: exercise.id,
            correct,
            responseTime,
            timestamp: Date.now()
        });
        console.log(`📝 Recorded attempt: ${exercise.id} - ${correct ? 'correct' : 'incorrect'}`);
    }

    getRecommendations() {
        return {
            reviewNeeded: [],
            masteryLevel: 0.75,
            suggestions: []
        };
    }

    endSession() {
        const summary = {
            totalAttempts: this.attempts.length,
            correctAttempts: this.attempts.filter(a => a.correct).length,
            averageTime: this.attempts.reduce((sum, a) => sum + a.responseTime, 0) / this.attempts.length || 0
        };
        this.sessionActive = false;
        return summary;
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.AdaptiveLearningOrchestrator = AdaptiveLearningOrchestrator;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdaptiveLearningOrchestrator };
}
