/**
 * Adaptive Repetition System
 *
 * Extends the basic SRS system with intelligent error pattern detection
 * and adaptive intervention strategies
 */

class AdaptiveRepetitionSystem {
    constructor() {
        // Basic SRS boxes (Leitner System)
        this.boxes = [
            { id: 0, interval: 0, name: 'New' },           // New items
            { id: 1, interval: 1, name: 'Learning' },       // 1 day
            { id: 2, interval: 3, name: 'Familiar' },       // 3 days
            { id: 3, interval: 7, name: 'Known' },          // 7 days
            { id: 4, interval: 14, name: 'Mastered' },      // 14 days
            { id: 5, interval: 30, name: 'Expert' }         // 30 days
        ];

        // Error tracking
        this.errorPatterns = {};
        this.interventionHistory = [];

        // Thresholds for intervention
        this.thresholds = {
            gentle: 0.20,      // 20% error rate → gentle repetition
            moderate: 0.40,    // 40% error rate → intensive repetition
            severe: 0.60       // 60% error rate → phase regression
        };

        // Repetition schedules for different error types
        this.errorRepetitionSchedule = {
            immediate: [0, 0.016, 0.25, 1, 3],  // 0min, 1min, 15min, 1day, 3days (in days)
            short: [0, 0.041, 1, 3, 7],         // 0min, 1hour, 1day, 3days, 7days
            standard: [1, 3, 7, 14, 30]         // Standard SRS schedule
        };
    }

    /**
     * Promote item to next box (correct answer)
     */
    promote(item) {
        if (item.srsBox < 5) {
            item.srsBox++;
        }

        const box = this.boxes[item.srsBox];
        item.nextReview = Date.now() + (box.interval * 24 * 60 * 60 * 1000);

        // Clear error patterns for this item if promoted to box 4+
        if (item.srsBox >= 4 && this.errorPatterns[item.id]) {
            this.errorPatterns[item.id].errorCount = 0;
        }

        return item;
    }

    /**
     * Demote item (incorrect answer) with error pattern tracking
     */
    demote(item, errorType = 'general') {
        // Track error
        this.trackError(item.id, errorType);

        // Demote based on error severity
        const errorPattern = this.errorPatterns[item.id];
        const errorRate = this.calculateErrorRate(item.id);

        if (errorRate > 0.60) {
            // Severe errors: reset to box 0
            item.srsBox = 0;
        } else if (errorRate > 0.40) {
            // Moderate errors: demote by 2
            item.srsBox = Math.max(0, item.srsBox - 2);
        } else {
            // Mild errors: demote by 1
            item.srsBox = Math.max(0, item.srsBox - 1);
        }

        // Set next review based on error type
        const schedule = this.getRepetitionSchedule(errorType, errorRate);
        item.nextReview = Date.now() + (schedule[0] * 24 * 60 * 60 * 1000);

        return item;
    }

    /**
     * Track error for an item
     */
    trackError(itemId, errorType) {
        if (!this.errorPatterns[itemId]) {
            this.errorPatterns[itemId] = {
                itemId,
                errorCount: 0,
                correctCount: 0,
                errorTypes: {},
                lastError: null,
                firstError: Date.now()
            };
        }

        const pattern = this.errorPatterns[itemId];
        pattern.errorCount++;
        pattern.lastError = Date.now();

        // Track error type
        if (!pattern.errorTypes[errorType]) {
            pattern.errorTypes[errorType] = 0;
        }
        pattern.errorTypes[errorType]++;
    }

    /**
     * Track correct answer for an item
     */
    trackCorrect(itemId) {
        if (!this.errorPatterns[itemId]) {
            this.errorPatterns[itemId] = {
                itemId,
                errorCount: 0,
                correctCount: 0,
                errorTypes: {},
                lastError: null,
                firstError: null
            };
        }

        this.errorPatterns[itemId].correctCount++;
    }

    /**
     * Calculate error rate for an item
     */
    calculateErrorRate(itemId) {
        const pattern = this.errorPatterns[itemId];
        if (!pattern) return 0;

        const total = pattern.errorCount + pattern.correctCount;
        if (total === 0) return 0;

        return pattern.errorCount / total;
    }

    /**
     * Get repetition schedule based on error type and rate
     */
    getRepetitionSchedule(errorType, errorRate) {
        if (errorRate > 0.60) {
            return this.errorRepetitionSchedule.immediate;
        } else if (errorRate > 0.40) {
            return this.errorRepetitionSchedule.short;
        } else {
            return this.errorRepetitionSchedule.standard;
        }
    }

    /**
     * Get category-level error analysis
     */
    analyzeCategoryErrors(items, category) {
        const categoryItems = items.filter(item => item.category === category);
        let totalErrors = 0;
        let totalAttempts = 0;

        categoryItems.forEach(item => {
            const pattern = this.errorPatterns[item.id];
            if (pattern) {
                totalErrors += pattern.errorCount;
                totalAttempts += pattern.errorCount + pattern.correctCount;
            }
        });

        const errorRate = totalAttempts > 0 ? totalErrors / totalAttempts : 0;

        return {
            category,
            errorRate,
            totalErrors,
            totalAttempts,
            interventionLevel: this.determineInterventionLevel(errorRate)
        };
    }

    /**
     * Determine intervention level based on error rate
     */
    determineInterventionLevel(errorRate) {
        if (errorRate >= this.thresholds.severe) {
            return 'severe'; // Phase regression, basic review
        } else if (errorRate >= this.thresholds.moderate) {
            return 'moderate'; // Intensive repetition
        } else if (errorRate >= this.thresholds.gentle) {
            return 'gentle'; // Additional exercises
        } else {
            return 'none'; // No intervention needed
        }
    }

    /**
     * Get items that need intervention
     */
    getItemsNeedingIntervention(items) {
        const needsIntervention = [];

        items.forEach(item => {
            const errorRate = this.calculateErrorRate(item.id);
            const interventionLevel = this.determineInterventionLevel(errorRate);

            if (interventionLevel !== 'none') {
                needsIntervention.push({
                    item,
                    errorRate,
                    interventionLevel,
                    errorPattern: this.errorPatterns[item.id]
                });
            }
        });

        // Sort by error rate (highest first)
        needsIntervention.sort((a, b) => b.errorRate - a.errorRate);

        return needsIntervention;
    }

    /**
     * Get practice queue with adaptive prioritization
     */
    getPracticeQueue(items, limit = 10) {
        const now = Date.now();

        // Get due items
        const dueItems = items.filter(item => item.nextReview <= now);

        // Prioritize items with errors
        const prioritized = dueItems.map(item => {
            const errorRate = this.calculateErrorRate(item.id);
            const timeSinceLastError = this.errorPatterns[item.id]?.lastError
                ? now - this.errorPatterns[item.id].lastError
                : Infinity;

            // Calculate priority score
            // Higher score = higher priority
            let priority = 0;

            // Recent errors get high priority
            if (timeSinceLastError < 24 * 60 * 60 * 1000) { // Last 24 hours
                priority += 100;
            }

            // High error rate gets priority
            priority += errorRate * 50;

            // Lower box items get priority (still learning)
            priority += (5 - item.srsBox) * 10;

            return {
                ...item,
                priority
            };
        });

        // Sort by priority (highest first)
        prioritized.sort((a, b) => b.priority - a.priority);

        return prioritized.slice(0, limit);
    }

    /**
     * Create intervention plan for a category
     */
    createInterventionPlan(category, errorAnalysis) {
        const plan = {
            category,
            interventionLevel: errorAnalysis.interventionLevel,
            actions: [],
            recommendedExercises: []
        };

        switch (errorAnalysis.interventionLevel) {
            case 'severe':
                plan.actions.push('Phase regression: Review basic concepts');
                plan.actions.push('Provide alternative explanations');
                plan.actions.push('Use visual aids and examples');
                plan.recommendedExercises.push('drill-basic');
                plan.recommendedExercises.push('explanation-review');
                plan.recommendedExercises.push('visual-matching');
                break;

            case 'moderate':
                plan.actions.push('Intensive repetition with varied contexts');
                plan.actions.push('Contrastive exercises (correct vs incorrect)');
                plan.actions.push('Focus on error patterns');
                plan.recommendedExercises.push('drill-intensive');
                plan.recommendedExercises.push('contrastive-pairs');
                plan.recommendedExercises.push('error-correction');
                break;

            case 'gentle':
                plan.actions.push('Additional practice exercises');
                plan.actions.push('Mixed review with related concepts');
                plan.recommendedExercises.push('mixed-review');
                plan.recommendedExercises.push('contextual-practice');
                break;

            default:
                plan.actions.push('Continue regular practice');
                plan.recommendedExercises.push('standard-review');
        }

        // Record intervention
        this.interventionHistory.push({
            timestamp: Date.now(),
            category,
            errorRate: errorAnalysis.errorRate,
            interventionLevel: errorAnalysis.interventionLevel,
            plan
        });

        return plan;
    }

    /**
     * Get most problematic error types
     */
    getMostProblematicErrorTypes(limit = 5) {
        const errorTypeCount = {};

        // Aggregate error types across all items
        Object.values(this.errorPatterns).forEach(pattern => {
            Object.entries(pattern.errorTypes).forEach(([type, count]) => {
                if (!errorTypeCount[type]) {
                    errorTypeCount[type] = 0;
                }
                errorTypeCount[type] += count;
            });
        });

        // Sort by count
        const sorted = Object.entries(errorTypeCount)
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => b.count - a.count);

        return sorted.slice(0, limit);
    }

    /**
     * Get items by specific error type
     */
    getItemsByErrorType(items, errorType) {
        return items.filter(item => {
            const pattern = this.errorPatterns[item.id];
            return pattern && pattern.errorTypes[errorType] > 0;
        }).sort((a, b) => {
            const aCount = this.errorPatterns[a.id].errorTypes[errorType] || 0;
            const bCount = this.errorPatterns[b.id].errorTypes[errorType] || 0;
            return bCount - aCount;
        });
    }

    /**
     * Generate focused practice session based on errors
     */
    generateFocusedSession(items, errorType, limit = 10) {
        const relevantItems = this.getItemsByErrorType(items, errorType);

        // Include some correct items for comparison
        const correctItems = items.filter(item => {
            const errorRate = this.calculateErrorRate(item.id);
            return errorRate < 0.20;
        });

        // Mix: 70% error-prone, 30% correct items
        const errorCount = Math.floor(limit * 0.7);
        const correctCount = limit - errorCount;

        const session = [
            ...relevantItems.slice(0, errorCount),
            ...correctItems.sort(() => Math.random() - 0.5).slice(0, correctCount)
        ];

        // Shuffle
        return session.sort(() => Math.random() - 0.5);
    }

    /**
     * Get weekly error report
     */
    getWeeklyErrorReport() {
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const recentErrors = Object.values(this.errorPatterns).filter(
            pattern => pattern.lastError && pattern.lastError > oneWeekAgo
        );

        const totalErrors = recentErrors.reduce((sum, p) => sum + p.errorCount, 0);
        const totalCorrect = recentErrors.reduce((sum, p) => sum + p.correctCount, 0);
        const errorRate = totalErrors / (totalErrors + totalCorrect);

        return {
            period: '7 days',
            totalErrors,
            totalCorrect,
            errorRate,
            mostProblematicTypes: this.getMostProblematicErrorTypes(5),
            interventionsApplied: this.interventionHistory.filter(
                i => i.timestamp > oneWeekAgo
            ).length
        };
    }

    /**
     * Reset error tracking for an item (when mastered)
     */
    resetErrorTracking(itemId) {
        delete this.errorPatterns[itemId];
    }

    /**
     * Save error patterns to localStorage
     */
    saveErrorPatterns() {
        localStorage.setItem('errorPatterns', JSON.stringify(this.errorPatterns));
        localStorage.setItem('interventionHistory', JSON.stringify(this.interventionHistory));
    }

    /**
     * Load error patterns from localStorage
     */
    loadErrorPatterns() {
        const patterns = localStorage.getItem('errorPatterns');
        const history = localStorage.getItem('interventionHistory');

        if (patterns) {
            this.errorPatterns = JSON.parse(patterns);
        }

        if (history) {
            this.interventionHistory = JSON.parse(history);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdaptiveRepetitionSystem };
}
