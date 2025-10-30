/**
 * Context-Aware Difficulty Adjuster
 *
 * Adjusts learning difficulty based on contextual factors:
 * - Time of day (circadian rhythms)
 * - Session length (fatigue accumulation)
 * - Day of week (weekend vs weekday patterns)
 * - Historical performance patterns
 *
 * SCIENTIFIC BASIS:
 * - Circadian Rhythms and Learning (Gais & Born, 2004; Schmidt et al., 2007)
 * - Vigilance Decrement (Mackworth, 1948; Warm et al., 2008)
 * - Distributed Practice Effect (Cepeda et al., 2006)
 * - Time-of-Day Effects on Cognitive Performance (May & Hasher, 1998)
 *
 * KEY FINDINGS:
 * - Morning: Better for declarative memory tasks (Gais & Born, 2004)
 * - Afternoon dip: 2-4 PM performance decline (post-lunch dip)
 * - Evening: Better for procedural/pattern recognition
 * - Weekend: More relaxed learning, less time pressure
 * - Session length: Performance declines after 25-30 minutes (Mackworth, 1948)
 *
 * @references
 * - Gais, S., & Born, J. (2004). Declarative memory consolidation during sleep
 * - Schmidt, C., et al. (2007). Homeostatic sleep pressure and circadian rhythm
 * - Cepeda, N. J., et al. (2006). Distributed practice in verbal recall tasks
 * - May, C. P., & Hasher, L. (1998). Synchrony effects in inhibitory control
 */

class ContextAwareDifficultyAdjuster {
    constructor() {
        // Difficulty modifier: 0.5 = 50% easier, 1.5 = 50% harder
        this.difficultyModifier = 1.0;

        // Time-of-day performance profiles
        this.timeProfiles = {
            morning: {      // 6 AM - 12 PM
                range: [6, 12],
                modifier: 1.1,  // 10% harder (peak performance)
                bestFor: ['grammar', 'new-concepts', 'complex-rules'],
                description: 'Peak cognitive performance, ideal for challenging material'
            },
            midday: {       // 12 PM - 2 PM
                range: [12, 14],
                modifier: 1.0,
                bestFor: ['review', 'practice'],
                description: 'Stable performance, good for reinforcement'
            },
            afternoon: {    // 2 PM - 4 PM (post-lunch dip)
                range: [14, 16],
                modifier: 0.8,  // 20% easier
                bestFor: ['vocabulary', 'flashcards', 'light-review'],
                description: 'Performance dip, avoid challenging new material'
            },
            lateAfternoon: { // 4 PM - 7 PM
                range: [16, 19],
                modifier: 0.95,
                bestFor: ['practice', 'exercises'],
                description: 'Recovery period, moderate difficulty appropriate'
            },
            evening: {      // 7 PM - 10 PM
                range: [19, 22],
                modifier: 0.9,
                bestFor: ['procedural', 'patterns', 'review'],
                description: 'Pattern recognition peak, consolidation phase'
            },
            lateNight: {    // 10 PM - 6 AM
                range: [22, 6],
                modifier: 0.7,  // 30% easier
                bestFor: ['light-review', 'vocabulary'],
                description: 'Reduced cognitive capacity, light material only'
            }
        };

        // Day-of-week patterns
        this.dayPatterns = {
            monday: { modifier: 0.95, stress: 'high', description: 'Week start, moderate difficulty' },
            tuesday: { modifier: 1.0, stress: 'medium', description: 'Optimal learning day' },
            wednesday: { modifier: 1.05, stress: 'medium', description: 'Peak performance day' },
            thursday: { modifier: 1.0, stress: 'medium', description: 'Sustained performance' },
            friday: { modifier: 0.9, stress: 'medium', description: 'End-of-week fatigue' },
            saturday: { modifier: 1.1, stress: 'low', description: 'Weekend energy, high motivation' },
            sunday: { modifier: 1.0, stress: 'low', description: 'Relaxed learning pace' }
        };

        // Session fatigue curve (Mackworth vigilance decrement)
        this.fatiguePoints = [
            { minutes: 0, modifier: 1.0 },
            { minutes: 10, modifier: 1.0 },
            { minutes: 20, modifier: 0.95 },
            { minutes: 30, modifier: 0.90 },   // Significant decline
            { minutes: 40, modifier: 0.80 },
            { minutes: 50, modifier: 0.70 },
            { minutes: 60, modifier: 0.60 }    // Severe fatigue
        };

        // User's personal performance history
        this.personalPatterns = {
            bestTimeOfDay: null,
            optimalSessionLength: 25,  // Pomodoro default
            performanceByDay: {},
            performanceByHour: {}
        };

        // Session tracking
        this.sessionStart = null;
        this.sessionPerformance = [];
    }

    /**
     * Calculate context-aware difficulty modifier
     *
     * @param {Object} context - Current context
     * @returns {Object} Difficulty adjustment
     */
    calculateDifficultyModifier(context = {}) {
        const {
            currentTime = new Date(),
            sessionDuration = 0,  // in minutes
            exerciseType = 'general',
            userEnergy = null,    // optional user-reported energy (1-5)
            recentPerformance = null
        } = context;

        // Get individual modifiers
        const timeModifier = this.getTimeOfDayModifier(currentTime);
        const dayModifier = this.getDayOfWeekModifier(currentTime);
        const fatigueModifier = this.getFatigueModifier(sessionDuration);
        const personalModifier = this.getPersonalPatternModifier(currentTime);

        // Combine modifiers (multiplicative)
        const combinedModifier = timeModifier.modifier *
                                dayModifier.modifier *
                                fatigueModifier.modifier *
                                personalModifier;

        // Energy override (if user reports low energy)
        let finalModifier = combinedModifier;
        if (userEnergy !== null && userEnergy <= 2) {
            finalModifier = Math.min(combinedModifier, 0.7);  // Cap at 70% difficulty
        }

        this.difficultyModifier = finalModifier;

        return {
            modifier: finalModifier,
            components: {
                timeOfDay: timeModifier,
                dayOfWeek: dayModifier,
                sessionFatigue: fatigueModifier,
                personalPattern: personalModifier
            },
            recommendations: this.generateRecommendations(timeModifier, dayModifier, fatigueModifier),
            optimalExerciseTypes: timeModifier.bestFor
        };
    }

    /**
     * Get time-of-day modifier based on circadian rhythms
     */
    getTimeOfDayModifier(currentTime) {
        const hour = currentTime.getHours();

        for (const [period, profile] of Object.entries(this.timeProfiles)) {
            const [start, end] = profile.range;

            // Handle overnight range (22-6)
            if (start > end) {
                if (hour >= start || hour < end) {
                    return profile;
                }
            } else {
                if (hour >= start && hour < end) {
                    return profile;
                }
            }
        }

        return this.timeProfiles.midday;  // Default
    }

    /**
     * Get day-of-week modifier
     */
    getDayOfWeekModifier(currentTime) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = days[currentTime.getDay()];

        return this.dayPatterns[dayName] || this.dayPatterns.tuesday;
    }

    /**
     * Get fatigue modifier based on session duration
     * Based on Mackworth's vigilance decrement research
     */
    getFatigueModifier(sessionDuration) {
        // Find the appropriate fatigue point
        for (let i = this.fatiguePoints.length - 1; i >= 0; i--) {
            if (sessionDuration >= this.fatiguePoints[i].minutes) {
                return this.fatiguePoints[i];
            }
        }

        return { minutes: 0, modifier: 1.0 };
    }

    /**
     * Get personal pattern modifier based on user's historical performance
     */
    getPersonalPatternModifier(currentTime) {
        const hour = currentTime.getHours();
        const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][currentTime.getDay()];

        // Check if we have enough data
        if (this.personalPatterns.performanceByHour[hour]) {
            const personalPerf = this.personalPatterns.performanceByHour[hour];

            // If user consistently performs better/worse at this hour, adjust
            if (personalPerf.accuracy > 0.85) {
                return 1.1;  // Can handle harder
            } else if (personalPerf.accuracy < 0.60) {
                return 0.85;  // Needs easier
            }
        }

        return 1.0;  // No adjustment
    }

    /**
     * Record performance for pattern learning
     */
    recordPerformance(performance) {
        const { timestamp, correct, responseTime, difficulty } = performance;
        const date = new Date(timestamp);
        const hour = date.getHours();
        const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];

        // Initialize if needed
        if (!this.personalPatterns.performanceByHour[hour]) {
            this.personalPatterns.performanceByHour[hour] = {
                attempts: 0,
                correct: 0,
                accuracy: 0,
                avgResponseTime: 0
            };
        }

        if (!this.personalPatterns.performanceByDay[dayName]) {
            this.personalPatterns.performanceByDay[dayName] = {
                attempts: 0,
                correct: 0,
                accuracy: 0
            };
        }

        // Update hourly stats
        const hourStats = this.personalPatterns.performanceByHour[hour];
        hourStats.attempts++;
        if (correct) hourStats.correct++;
        hourStats.accuracy = hourStats.correct / hourStats.attempts;

        // Update daily stats
        const dayStats = this.personalPatterns.performanceByDay[dayName];
        dayStats.attempts++;
        if (correct) dayStats.correct++;
        dayStats.accuracy = dayStats.correct / dayStats.attempts;

        // Update session performance
        this.sessionPerformance.push(performance);
    }

    /**
     * Detect user's optimal learning time
     */
    detectOptimalLearningTime() {
        const hourlyPerf = this.personalPatterns.performanceByHour;
        let bestHour = null;
        let bestAccuracy = 0;

        for (const [hour, stats] of Object.entries(hourlyPerf)) {
            if (stats.attempts >= 10 && stats.accuracy > bestAccuracy) {
                bestAccuracy = stats.accuracy;
                bestHour = parseInt(hour);
            }
        }

        if (bestHour !== null) {
            this.personalPatterns.bestTimeOfDay = bestHour;
        }

        return {
            bestHour: bestHour,
            accuracy: bestAccuracy,
            recommendation: this.getHourRecommendation(bestHour)
        };
    }

    /**
     * Get recommendation for best hour
     */
    getHourRecommendation(hour) {
        if (hour === null) return 'Not enough data yet';

        if (hour >= 6 && hour < 12) {
            return 'Du lernst am besten morgens! 🌅';
        } else if (hour >= 14 && hour < 18) {
            return 'Nachmittags läuft es bei dir am besten! ☀️';
        } else if (hour >= 19 && hour < 23) {
            return 'Abends bist du am produktivsten! 🌙';
        }

        return 'Deine beste Lernzeit: ' + hour + ':00 Uhr';
    }

    /**
     * Generate contextual recommendations
     */
    generateRecommendations(timeProfile, dayProfile, fatigueProfile) {
        const recommendations = [];

        // Time-based recommendations
        if (timeProfile.modifier < 0.9) {
            recommendations.push({
                type: 'time_warning',
                message: `${timeProfile.description}. Konzentriere dich auf leichtere Übungen.`,
                severity: 'medium'
            });
        }

        // Fatigue recommendations
        if (fatigueProfile.modifier < 0.8) {
            recommendations.push({
                type: 'fatigue_warning',
                message: `Du lernst seit ${fatigueProfile.minutes} Minuten. Zeit für eine Pause! ☕`,
                severity: 'high',
                action: 'suggest_break'
            });
        }

        // Optimal session length reached
        if (fatigueProfile.minutes >= this.personalPatterns.optimalSessionLength) {
            recommendations.push({
                type: 'session_complete',
                message: 'Gute Arbeit! Du hast dein Tagesziel erreicht. 🎯',
                severity: 'info',
                action: 'end_session'
            });
        }

        // Day-based recommendations
        if (dayProfile.stress === 'high') {
            recommendations.push({
                type: 'stress_notice',
                message: 'Montag kann stressig sein. Nimm es ruhig an! 🧘',
                severity: 'low'
            });
        }

        return recommendations;
    }

    /**
     * Suggest optimal session duration based on time and context
     */
    suggestSessionDuration() {
        const now = new Date();
        const timeProfile = this.getTimeOfDayModifier(now);

        // Morning: Longer sessions OK (high cognitive capacity)
        if (timeProfile.modifier >= 1.1) {
            return {
                recommended: 40,
                min: 25,
                max: 60,
                reason: 'Peak cognitive performance - longer sessions beneficial'
            };
        }

        // Afternoon dip: Shorter sessions
        if (timeProfile.modifier <= 0.8) {
            return {
                recommended: 15,
                min: 10,
                max: 25,
                reason: 'Natural energy dip - keep sessions short and focused'
            };
        }

        // Default: Pomodoro technique (25 minutes)
        return {
            recommended: 25,
            min: 20,
            max: 30,
            reason: 'Optimal balance based on Pomodoro technique'
        };
    }

    /**
     * Start session tracking
     */
    startSession() {
        this.sessionStart = Date.now();
        this.sessionPerformance = [];
    }

    /**
     * Get session duration in minutes
     */
    getSessionDuration() {
        if (!this.sessionStart) return 0;

        return Math.floor((Date.now() - this.sessionStart) / 60000);
    }

    /**
     * Get summary
     */
    getSummary() {
        const now = new Date();

        return {
            currentModifier: this.difficultyModifier,
            sessionDuration: this.getSessionDuration(),
            timeOfDay: this.getTimeOfDayModifier(now),
            dayOfWeek: this.getDayOfWeekModifier(now),
            optimalLearningTime: this.detectOptimalLearningTime(),
            recommendedSessionDuration: this.suggestSessionDuration()
        };
    }
}

// Export
if (typeof window !== 'undefined') {
    window.ContextAwareDifficultyAdjuster = ContextAwareDifficultyAdjuster;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ContextAwareDifficultyAdjuster };
}
