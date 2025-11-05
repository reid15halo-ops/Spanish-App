/**
 * Adaptive Learning System
 *
 * Features:
 * - Performance tracking per concept
 * - Dynamic difficulty adjustment
 * - Spaced repetition for weak areas
 * - Mastery-based progression
 * - Personalized exercise selection
 */

class AdaptiveLearningSystem {
    constructor() {
        this.performanceData = this.loadPerformanceData();
        this.masteryThreshold = 0.80; // 80% correct = mastered
        this.repetitionIntervals = [1, 3, 7, 14, 30]; // days
    }

    /**
     * Load performance data from localStorage
     */
    loadPerformanceData() {
        try {
            const saved = localStorage.getItem('adaptive-performance');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            window.Logger?.error('Failed to load performance data:', e);

            // Notify user about data load failure
            if (e instanceof SyntaxError && window.ModalDialog) {
                window.ModalDialog.toast(
                    'Performance-Daten beschädigt. Starte mit leeren Statistiken.',
                    'warning',
                    4000
                );
            }
        }

        // Initialize default structure
        return {
            concepts: {},      // concept -> { attempts, correct, lastSeen, mastery }
            exercises: {},     // exerciseId -> { attempts, correct, lastSeen, nextReview }
            categories: {},    // category -> { attempts, correct }
            difficulties: {},  // difficulty -> { attempts, correct }
            units: {}          // unit -> { attempts, correct, mastered }
        };
    }

    /**
     * Save performance data to localStorage
     */
    savePerformanceData() {
        try {
            localStorage.setItem('adaptive-performance', JSON.stringify(this.performanceData));
        } catch (e) {
            window.Logger?.error('Failed to save performance data:', e);

            // Notify user about save failure
            if (e.name === 'QuotaExceededError' && window.ModalDialog) {
                window.ModalDialog.toast(
                    'Speicher voll! Performance-Daten können nicht gespeichert werden.',
                    'error',
                    5000
                );
            }
        }
    }

    /**
     * Record exercise attempt
     */
    recordAttempt(exercise, isCorrect) {
        const now = Date.now();

        // Track by concept
        const concept = exercise.concept || 'general';
        if (!this.performanceData.concepts[concept]) {
            this.performanceData.concepts[concept] = {
                attempts: 0,
                correct: 0,
                lastSeen: now,
                mastery: 0,
                difficulty: exercise.difficulty || 1
            };
        }

        const conceptData = this.performanceData.concepts[concept];
        conceptData.attempts++;
        if (isCorrect) conceptData.correct++;
        conceptData.lastSeen = now;
        conceptData.mastery = conceptData.attempts > 0 ? conceptData.correct / conceptData.attempts : 0;

        // Track by exercise ID
        const exerciseId = exercise.id || `${exercise.type}-${exercise.concept}`;
        if (!this.performanceData.exercises[exerciseId]) {
            this.performanceData.exercises[exerciseId] = {
                attempts: 0,
                correct: 0,
                lastSeen: now,
                nextReview: null
            };
        }

        const exerciseData = this.performanceData.exercises[exerciseId];
        exerciseData.attempts++;
        if (isCorrect) {
            exerciseData.correct++;
            // Schedule next review using spaced repetition
            const reviewIndex = Math.min(exerciseData.correct - 1, this.repetitionIntervals.length - 1);
            const daysUntilReview = this.repetitionIntervals[Math.max(0, reviewIndex)];
            exerciseData.nextReview = now + (daysUntilReview * 24 * 60 * 60 * 1000);
        } else {
            // Reset review schedule on incorrect
            exerciseData.nextReview = now + (this.repetitionIntervals[0] * 24 * 60 * 60 * 1000);
        }
        exerciseData.lastSeen = now;

        // Track by category
        const category = exercise.category || 'general';
        if (!this.performanceData.categories[category]) {
            this.performanceData.categories[category] = { attempts: 0, correct: 0 };
        }
        this.performanceData.categories[category].attempts++;
        if (isCorrect) this.performanceData.categories[category].correct++;

        // Track by difficulty
        const difficulty = exercise.difficulty || 1;
        if (!this.performanceData.difficulties[difficulty]) {
            this.performanceData.difficulties[difficulty] = { attempts: 0, correct: 0 };
        }
        this.performanceData.difficulties[difficulty].attempts++;
        if (isCorrect) this.performanceData.difficulties[difficulty].correct++;

        // Track by unit
        const unit = exercise.unitNumber || 1;
        if (!this.performanceData.units[unit]) {
            this.performanceData.units[unit] = { attempts: 0, correct: 0, mastered: false };
        }
        this.performanceData.units[unit].attempts++;
        if (isCorrect) this.performanceData.units[unit].correct++;

        this.savePerformanceData();
    }

    /**
     * Get mastery level for a concept (0-1)
     */
    getConceptMastery(concept) {
        const data = this.performanceData.concepts[concept];
        if (!data || data.attempts === 0) return 0;
        return data.mastery;
    }

    /**
     * Check if concept is mastered
     */
    isConceptMastered(concept) {
        return this.getConceptMastery(concept) >= this.masteryThreshold;
    }

    /**
     * Get weak concepts (below mastery threshold)
     */
    getWeakConcepts() {
        return Object.entries(this.performanceData.concepts)
            .filter(([_, data]) => data.attempts > 0 && data.mastery < this.masteryThreshold)
            .sort((a, b) => a[1].mastery - b[1].mastery)
            .map(([concept, data]) => ({
                concept,
                mastery: data.mastery,
                attempts: data.attempts,
                correct: data.correct
            }));
    }

    /**
     * Get exercises that need review (spaced repetition)
     */
    getExercisesForReview() {
        const now = Date.now();
        return Object.entries(this.performanceData.exercises)
            .filter(([_, data]) => data.nextReview && data.nextReview <= now)
            .map(([id, data]) => ({ id, ...data }));
    }

    /**
     * Select next exercise adaptively
     */
    selectNextExercise(availableExercises, currentDifficulty = 1) {
        if (!availableExercises || availableExercises.length === 0) {
            return null;
        }

        // 1. Check for exercises due for review (spaced repetition)
        const reviewExercises = this.getExercisesForReview();
        if (reviewExercises.length > 0) {
            const reviewIds = reviewExercises.map(r => r.id);
            const reviewable = availableExercises.filter(ex =>
                reviewIds.includes(ex.id || `${ex.type}-${ex.concept}`)
            );
            if (reviewable.length > 0) {
                return this.selectRandom(reviewable);
            }
        }

        // 2. Focus on weak concepts (40% of time)
        if (Math.random() < 0.4) {
            const weakConcepts = this.getWeakConcepts();
            if (weakConcepts.length > 0) {
                const weakConcept = weakConcepts[0].concept;
                const weakExercises = availableExercises.filter(ex => ex.concept === weakConcept);
                if (weakExercises.length > 0) {
                    return this.selectRandom(weakExercises);
                }
            }
        }

        // 3. Select based on difficulty progression
        const targetDifficulty = this.getRecommendedDifficulty(currentDifficulty);
        const suitableExercises = availableExercises.filter(ex =>
            (ex.difficulty || 1) === targetDifficulty
        );

        if (suitableExercises.length > 0) {
            return this.selectRandom(suitableExercises);
        }

        // 4. Fallback: random from available
        return this.selectRandom(availableExercises);
    }

    /**
     * Get recommended difficulty based on performance
     */
    getRecommendedDifficulty(currentDifficulty) {
        // Get performance at current difficulty
        const diffData = this.performanceData.difficulties[currentDifficulty];

        if (!diffData || diffData.attempts < 3) {
            // Not enough data, stay at current difficulty
            return currentDifficulty;
        }

        const successRate = diffData.correct / diffData.attempts;

        // If doing well (>85%), increase difficulty
        if (successRate > 0.85 && currentDifficulty < 5) {
            return currentDifficulty + 1;
        }

        // If struggling (<60%), decrease difficulty
        if (successRate < 0.60 && currentDifficulty > 1) {
            return currentDifficulty - 1;
        }

        // Otherwise stay at current difficulty
        return currentDifficulty;
    }

    /**
     * Create adaptive exercise sequence
     */
    createAdaptiveSequence(allExercises, length = 50) {
        const sequence = [];
        const available = [...allExercises];
        let currentDifficulty = 1;

        while (sequence.length < length && available.length > 0) {
            const next = this.selectNextExercise(available, currentDifficulty);
            if (!next) break;

            sequence.push(next);
            currentDifficulty = next.difficulty || currentDifficulty;

            // Remove from available (optional - can allow repeats)
            const index = available.findIndex(ex => ex === next);
            if (index >= 0) {
                available.splice(index, 1);
            }
        }

        return sequence;
    }

    /**
     * Get personalized recommendations
     */
    getRecommendations() {
        const recommendations = {
            weakConcepts: [],
            reviewExercises: [],
            nextDifficulty: 1,
            unitProgress: {},
            overallMastery: 0
        };

        // Weak concepts
        recommendations.weakConcepts = this.getWeakConcepts().slice(0, 5);

        // Review exercises
        recommendations.reviewExercises = this.getExercisesForReview().slice(0, 10);

        // Next difficulty
        const difficultyLevels = Object.keys(this.performanceData.difficulties)
            .map(Number)
            .sort((a, b) => b - a);

        for (const diff of difficultyLevels) {
            const data = this.performanceData.difficulties[diff];
            if (data.attempts >= 3) {
                const successRate = data.correct / data.attempts;
                if (successRate > 0.85 && diff < 5) {
                    recommendations.nextDifficulty = diff + 1;
                } else {
                    recommendations.nextDifficulty = diff;
                }
                break;
            }
        }

        // Unit progress
        Object.entries(this.performanceData.units).forEach(([unit, data]) => {
            const mastery = data.attempts > 0 ? data.correct / data.attempts : 0;
            recommendations.unitProgress[unit] = {
                mastery,
                attempts: data.attempts,
                correct: data.correct,
                mastered: mastery >= this.masteryThreshold
            };
        });

        // Overall mastery
        const totalAttempts = Object.values(this.performanceData.concepts)
            .reduce((sum, c) => sum + c.attempts, 0);
        const totalCorrect = Object.values(this.performanceData.concepts)
            .reduce((sum, c) => sum + c.correct, 0);
        recommendations.overallMastery = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;

        return recommendations;
    }

    /**
     * Reset performance data (for testing or restart)
     */
    reset() {
        this.performanceData = {
            concepts: {},
            exercises: {},
            categories: {},
            difficulties: {},
            units: {}
        };
        this.savePerformanceData();
    }

    /**
     * Export performance data
     */
    exportData() {
        return JSON.stringify(this.performanceData, null, 2);
    }

    /**
     * Helper: Select random item from array
     */
    selectRandom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Get statistics summary
     */
    getStatistics() {
        const stats = {
            totalAttempts: 0,
            totalCorrect: 0,
            conceptsMastered: 0,
            conceptsInProgress: 0,
            averageMastery: 0,
            strengthsByCategory: {},
            weaknessesByCategory: {}
        };

        // Concept stats
        Object.values(this.performanceData.concepts).forEach(data => {
            stats.totalAttempts += data.attempts;
            stats.totalCorrect += data.correct;
            if (data.mastery >= this.masteryThreshold) {
                stats.conceptsMastered++;
            } else if (data.attempts > 0) {
                stats.conceptsInProgress++;
            }
        });

        const conceptCount = Object.keys(this.performanceData.concepts).length;
        if (conceptCount > 0) {
            const totalMastery = Object.values(this.performanceData.concepts)
                .reduce((sum, c) => sum + (c.mastery || 0), 0);
            stats.averageMastery = totalMastery / conceptCount;
        }

        // Category analysis
        Object.entries(this.performanceData.categories).forEach(([category, data]) => {
            const mastery = data.attempts > 0 ? data.correct / data.attempts : 0;
            if (mastery >= 0.8) {
                stats.strengthsByCategory[category] = mastery;
            } else if (data.attempts > 0) {
                stats.weaknessesByCategory[category] = mastery;
            }
        });

        return stats;
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.AdaptiveLearningSystem = AdaptiveLearningSystem;
}
