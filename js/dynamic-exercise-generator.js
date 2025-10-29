/**
 * Dynamic Exercise Generator
 *
 * Generates adaptive exercises based on:
 * - User progress and weaknesses
 * - Current difficulty level
 * - Practiced concepts
 * - ML-based personalization
 */

class DynamicExerciseGenerator {
    constructor(vocabularyDatabase, templateEngine, progressTracker) {
        this.vocab = vocabularyDatabase;
        this.templates = templateEngine;
        this.progress = progressTracker;

        this.config = {
            minDifficulty: 1,
            maxDifficulty: 5,
            adaptiveWeight: 0.7,  // How much to prioritize weak concepts
            varietyWeight: 0.3    // How much to prioritize variety
        };
    }

    /**
     * Generate next exercise based on user progress
     */
    generateNext(count = 1) {
        const exercises = [];
        const userProfile = this.progress.getProfile();

        for (let i = 0; i < count; i++) {
            const exercise = this.generateSingleExercise(userProfile);
            if (exercise) {
                exercises.push(exercise);
            }
        }

        return count === 1 ? exercises[0] : exercises;
    }

    /**
     * Generate a single adaptive exercise
     */
    generateSingleExercise(userProfile) {
        // 1. Calculate user difficulty level
        const difficulty = this.calculateUserDifficulty(userProfile);

        // 2. Identify weak concepts
        const weakConcepts = this.identifyWeakConcepts(userProfile);

        // 3. Select template type (adaptive or variety)
        const templateType = this.selectTemplateType(weakConcepts, userProfile);

        // 4. Generate exercise from template
        const exercise = this.templates.generateExercise(templateType, difficulty);

        if (!exercise) {
            // Fallback to random exercise
            return this.generateFallbackExercise(difficulty);
        }

        // 5. Add metadata
        exercise.metadata = {
            generatedAt: Date.now(),
            userDifficulty: difficulty,
            targetConcept: templateType,
            isAdaptive: weakConcepts.includes(templateType)
        };

        return exercise;
    }

    /**
     * Calculate user difficulty level (1-5)
     * Based on: accuracy, consistency, time, concepts mastered
     */
    calculateUserDifficulty(userProfile) {
        const stats = userProfile.stats;

        if (!stats || stats.total === 0) {
            return 1; // Start at level 1
        }

        // Factors:
        const accuracy = stats.correct / stats.total;
        const consistency = this.calculateConsistency(userProfile.recentAttempts);
        const conceptsMastered = userProfile.masteredConcepts?.length || 0;
        const avgTime = stats.avgResponseTime || 5000;

        // Difficulty score (0-1)
        const accuracyScore = accuracy; // 0-1
        const consistencyScore = consistency; // 0-1
        const conceptScore = Math.min(conceptsMastered / 20, 1); // 0-1 (mastered 20 concepts = max)
        const speedScore = Math.max(0, 1 - (avgTime / 10000)); // Faster = higher (max 10s)

        // Weighted average
        const difficultyScore = (
            accuracyScore * 0.4 +
            consistencyScore * 0.3 +
            conceptScore * 0.2 +
            speedScore * 0.1
        );

        // Map to 1-5 scale
        if (difficultyScore < 0.3) return 1;
        if (difficultyScore < 0.5) return 2;
        if (difficultyScore < 0.7) return 3;
        if (difficultyScore < 0.85) return 4;
        return 5;
    }

    /**
     * Calculate consistency from recent attempts
     */
    calculateConsistency(recentAttempts = []) {
        if (recentAttempts.length < 5) return 0.5; // Not enough data

        // Look at last 10 attempts
        const last10 = recentAttempts.slice(-10);
        const correct = last10.filter(a => a.correct).length;

        return correct / last10.length;
    }

    /**
     * Identify weak concepts that need practice
     */
    identifyWeakConcepts(userProfile) {
        const conceptStats = userProfile.conceptStats || {};
        const weak = [];

        // Find concepts with < 70% accuracy or < 3 attempts
        for (const concept in conceptStats) {
            const stats = conceptStats[concept];
            const accuracy = stats.correct / stats.total;

            if (stats.total < 3 || accuracy < 0.7) {
                weak.push({
                    concept,
                    priority: this.calculatePriority(stats, accuracy)
                });
            }
        }

        // Sort by priority (highest first)
        weak.sort((a, b) => b.priority - a.priority);

        return weak.map(w => w.concept);
    }

    /**
     * Calculate priority for a weak concept
     */
    calculatePriority(stats, accuracy) {
        // Higher priority for:
        // - Lower accuracy
        // - Recent mistakes
        // - Fundamental concepts (ser, estar, tener)

        const accuracyFactor = 1 - accuracy; // 0-1, higher = weaker
        const recencyFactor = stats.lastAttempt ?
            Math.exp(-(Date.now() - stats.lastAttempt) / (7 * 24 * 60 * 60 * 1000)) : // Decay over 7 days
            0.5;
        const fundamentalFactor = stats.concept?.includes('ser') ||
                                 stats.concept?.includes('estar') ||
                                 stats.concept?.includes('tener') ? 1.5 : 1.0;

        return accuracyFactor * 0.5 + recencyFactor * 0.3 + (fundamentalFactor * 0.2);
    }

    /**
     * Select template type (adaptive vs variety)
     */
    selectTemplateType(weakConcepts, userProfile) {
        const random = Math.random();

        // Adaptive: focus on weak concepts
        if (random < this.config.adaptiveWeight && weakConcepts.length > 0) {
            return this.selectFromWeakConcepts(weakConcepts);
        }

        // Variety: introduce new concepts or reinforce strong ones
        return this.selectForVariety(userProfile);
    }

    /**
     * Select from weak concepts
     */
    selectFromWeakConcepts(weakConcepts) {
        // Weighted random: prioritize first few weak concepts
        const weights = weakConcepts.map((_, i) => Math.exp(-i * 0.3));
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);

        let random = Math.random() * totalWeight;
        for (let i = 0; i < weakConcepts.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return weakConcepts[i];
            }
        }

        return weakConcepts[0];
    }

    /**
     * Select for variety
     */
    selectForVariety(userProfile) {
        const allTypes = this.templates.getAvailableTypes();
        const practiced = new Set(Object.keys(userProfile.conceptStats || {}));

        // Prefer unpracticed concepts
        const unpracticed = allTypes.filter(type => !practiced.has(type));

        if (unpracticed.length > 0 && Math.random() < 0.6) {
            return unpracticed[Math.floor(Math.random() * unpracticed.length)];
        }

        // Random from all
        return allTypes[Math.floor(Math.random() * allTypes.length)];
    }

    /**
     * Generate fallback exercise if template fails
     */
    generateFallbackExercise(difficulty) {
        // Simple SER conjugation as fallback
        const persons = ['yo', 'tu', 'el'];
        const person = persons[Math.floor(Math.random() * persons.length)];
        const verb = this.vocab.getVerb('ser', person);

        return {
            id: `fallback_${Date.now()}`,
            type: 'translation',
            concept: 'ser-conjugation',
            difficulty: difficulty,
            question: `Konjugiere SER für "${person}"`,
            correctAnswer: verb.conjugated,
            german: verb.german,
            germanBridge: '💡 SER ist unregelmäßig!',
            hints: [
                'SER = dauerhaft sein (DOCTOR)',
                `Die Form für "${person}" ist unregelmäßig`,
                `Die richtige Antwort ist: ${verb.conjugated}`
            ],
            metadata: {
                isFallback: true,
                generatedAt: Date.now()
            }
        };
    }

    /**
     * Generate exercise for specific concept
     */
    generateForConcept(concept, difficulty = null) {
        difficulty = difficulty || this.config.minDifficulty;

        const exercise = this.templates.generateExercise(concept, difficulty);

        if (!exercise) {
            console.warn(`Could not generate exercise for concept: ${concept}`);
            return this.generateFallbackExercise(difficulty);
        }

        exercise.metadata = {
            generatedAt: Date.now(),
            targetConcept: concept,
            requestedDifficulty: difficulty
        };

        return exercise;
    }

    /**
     * Generate exercise batch for a session
     */
    generateSession(exerciseCount = 10) {
        const userProfile = this.progress.getProfile();
        const difficulty = this.calculateUserDifficulty(userProfile);
        const weakConcepts = this.identifyWeakConcepts(userProfile);

        const session = {
            id: `session_${Date.now()}`,
            createdAt: Date.now(),
            targetDifficulty: difficulty,
            weakConcepts: weakConcepts.slice(0, 5),
            exercises: []
        };

        // Generate mix: 70% weak concepts, 30% variety
        const weakCount = Math.floor(exerciseCount * 0.7);
        const varietyCount = exerciseCount - weakCount;

        // Weak concepts
        for (let i = 0; i < weakCount && i < weakConcepts.length; i++) {
            const exercise = this.generateForConcept(weakConcepts[i % weakConcepts.length], difficulty);
            if (exercise) {
                session.exercises.push(exercise);
            }
        }

        // Variety
        for (let i = 0; i < varietyCount; i++) {
            const exercise = this.generateNext();
            if (exercise) {
                session.exercises.push(exercise);
            }
        }

        // Shuffle to avoid pattern
        session.exercises = this.shuffleArray(session.exercises);

        return session;
    }

    /**
     * Shuffle array helper
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Get statistics about generation
     */
    getGenerationStats(userProfile) {
        const difficulty = this.calculateUserDifficulty(userProfile);
        const weakConcepts = this.identifyWeakConcepts(userProfile);

        return {
            currentDifficulty: difficulty,
            totalConcepts: Object.keys(userProfile.conceptStats || {}).length,
            weakConceptsCount: weakConcepts.length,
            weakConcepts: weakConcepts.slice(0, 5),
            masteredConcepts: userProfile.masteredConcepts?.length || 0,
            overallAccuracy: userProfile.stats.total > 0 ?
                userProfile.stats.correct / userProfile.stats.total : 0,
            recommendedExercises: this.getRecommendations(weakConcepts, difficulty)
        };
    }

    /**
     * Get exercise recommendations
     */
    getRecommendations(weakConcepts, difficulty) {
        const recommendations = [];

        // Add weak concepts
        weakConcepts.slice(0, 3).forEach(concept => {
            recommendations.push({
                type: concept,
                reason: 'Needs practice',
                priority: 'high',
                difficulty: difficulty
            });
        });

        // Add progression exercises
        if (difficulty < this.config.maxDifficulty) {
            recommendations.push({
                type: 'challenge',
                reason: 'Ready for harder exercises',
                priority: 'medium',
                difficulty: difficulty + 1
            });
        }

        return recommendations;
    }
}

/**
 * User Progress Tracker
 * Stores progress in LocalStorage
 */
class UserProgressTracker {
    constructor() {
        this.storageKey = 'spanish-app-user-progress';
        this.profile = this.load();
    }

    /**
     * Load profile from LocalStorage
     */
    load() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.warn('Could not load progress:', error);
        }

        // Default profile
        return this.createDefaultProfile();
    }

    /**
     * Create default profile
     */
    createDefaultProfile() {
        return {
            version: '1.0',
            createdAt: Date.now(),
            lastActive: Date.now(),
            stats: {
                total: 0,
                correct: 0,
                wrong: 0,
                avgResponseTime: 0,
                totalTime: 0
            },
            conceptStats: {},
            recentAttempts: [],
            masteredConcepts: [],
            currentStreak: 0,
            longestStreak: 0
        };
    }

    /**
     * Save profile to LocalStorage
     */
    save() {
        try {
            this.profile.lastActive = Date.now();
            localStorage.setItem(this.storageKey, JSON.stringify(this.profile));
            return true;
        } catch (error) {
            console.error('Could not save progress:', error);
            return false;
        }
    }

    /**
     * Record an exercise attempt
     */
    recordAttempt(exercise, userAnswer, isCorrect, responseTime) {
        // Update overall stats
        this.profile.stats.total++;
        if (isCorrect) {
            this.profile.stats.correct++;
            this.profile.currentStreak++;
            if (this.profile.currentStreak > this.profile.longestStreak) {
                this.profile.longestStreak = this.profile.currentStreak;
            }
        } else {
            this.profile.stats.wrong++;
            this.profile.currentStreak = 0;
        }

        this.profile.stats.totalTime += responseTime;
        this.profile.stats.avgResponseTime = this.profile.stats.totalTime / this.profile.stats.total;

        // Update concept stats
        const concept = exercise.concept;
        if (!this.profile.conceptStats[concept]) {
            this.profile.conceptStats[concept] = {
                total: 0,
                correct: 0,
                wrong: 0,
                avgTime: 0,
                firstAttempt: Date.now(),
                lastAttempt: Date.now()
            };
        }

        const conceptStats = this.profile.conceptStats[concept];
        conceptStats.total++;
        if (isCorrect) {
            conceptStats.correct++;
        } else {
            conceptStats.wrong++;
        }
        conceptStats.lastAttempt = Date.now();
        conceptStats.avgTime = ((conceptStats.avgTime * (conceptStats.total - 1)) + responseTime) / conceptStats.total;

        // Check if mastered (>= 80% accuracy, >= 5 attempts)
        if (conceptStats.total >= 5 && conceptStats.correct / conceptStats.total >= 0.8) {
            if (!this.profile.masteredConcepts.includes(concept)) {
                this.profile.masteredConcepts.push(concept);
            }
        }

        // Add to recent attempts (keep last 20)
        this.profile.recentAttempts.push({
            exerciseId: exercise.id,
            concept: concept,
            correct: isCorrect,
            responseTime: responseTime,
            timestamp: Date.now()
        });

        if (this.profile.recentAttempts.length > 20) {
            this.profile.recentAttempts = this.profile.recentAttempts.slice(-20);
        }

        // Save
        this.save();
    }

    /**
     * Get user profile
     */
    getProfile() {
        return this.profile;
    }

    /**
     * Get statistics
     */
    getStats() {
        return {
            ...this.profile.stats,
            accuracy: this.profile.stats.total > 0 ?
                this.profile.stats.correct / this.profile.stats.total : 0,
            conceptsLearned: Object.keys(this.profile.conceptStats).length,
            conceptsMastered: this.profile.masteredConcepts.length,
            currentStreak: this.profile.currentStreak,
            longestStreak: this.profile.longestStreak
        };
    }

    /**
     * Reset progress
     */
    reset() {
        this.profile = this.createDefaultProfile();
        this.save();
    }

    /**
     * Export progress
     */
    export() {
        return JSON.stringify(this.profile, null, 2);
    }

    /**
     * Import progress
     */
    import(data) {
        try {
            const imported = JSON.parse(data);
            this.profile = imported;
            this.save();
            return true;
        } catch (error) {
            console.error('Could not import progress:', error);
            return false;
        }
    }
}

// Export
if (typeof window !== 'undefined') {
    window.DynamicExerciseGenerator = DynamicExerciseGenerator;
    window.UserProgressTracker = UserProgressTracker;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DynamicExerciseGenerator, UserProgressTracker };
}
