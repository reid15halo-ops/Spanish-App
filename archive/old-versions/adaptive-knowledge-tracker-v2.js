/**
 * Adaptive Knowledge Tracker V2 (Optimized)
 *
 * Enhanced with:
 * - Ebbinghaus Forgetting Curve for scientific review intervals
 * - Response time tracking for confidence measurement
 * - Dynamic difficulty calibration
 * - Spacing effect optimization
 * - Confidence-based frequency adjustment
 */

class AdaptiveKnowledgeTrackerV2 {
    constructor() {
        this.vocabularyKnowledge = {};
        this.grammarKnowledge = {};
        this.sentenceKnowledge = {};

        // Optimized thresholds
        this.masteryThreshold = 0.90;
        this.struggleThreshold = 0.50;
        this.minAttempts = 3;

        // Response time thresholds (in seconds)
        this.responseTimeThresholds = {
            fast: 3,      // < 3s = confident
            medium: 8,    // 3-8s = thinking
            slow: 15      // > 15s = struggling
        };

        // Ebbinghaus forgetting curve parameters
        this.forgettingCurve = {
            initialStrength: 2.5,      // Initial memory strength
            decayRate: 0.5,            // How fast memory decays (lower = faster)
            retrievalThreshold: 0.90   // When to schedule review (90% retention)
        };

        // Spacing intervals based on SuperMemo SM-2 algorithm (optimized)
        this.spacingIntervals = {
            // Intervals in days
            0: 0,        // New
            1: 0.01,     // 15 minutes
            2: 0.25,     // 6 hours
            3: 1,        // 1 day
            4: 3,        // 3 days
            5: 7,        // 1 week
            6: 14,       // 2 weeks
            7: 30,       // 1 month
            8: 60,       // 2 months
            9: 120       // 4 months
        };

        // Difficulty factors (EF in SM-2)
        this.minEaseFactor = 1.3;
        this.maxEaseFactor = 2.5;
    }

    /**
     * Record vocabulary attempt with response time
     */
    recordVocabularyAttempt(itemId, correct, responseTimeMs = null, context = {}) {
        if (!this.vocabularyKnowledge[itemId]) {
            this.vocabularyKnowledge[itemId] = this.createNewKnowledgeItem(itemId);
        }

        const item = this.vocabularyKnowledge[itemId];
        this.processAttempt(item, correct, responseTimeMs, context);
        this.updateKnowledgeLevelV2(item);
    }

    /**
     * Record grammar attempt with response time
     */
    recordGrammarAttempt(concept, correct, responseTimeMs = null, context = {}) {
        if (!this.grammarKnowledge[concept]) {
            this.grammarKnowledge[concept] = this.createNewKnowledgeItem(concept, 'grammar');
        }

        const item = this.grammarKnowledge[concept];
        this.processAttempt(item, correct, responseTimeMs, context);

        // Track specific error types for grammar
        if (!correct && context.errorType) {
            if (!item.errorTypes) item.errorTypes = {};
            item.errorTypes[context.errorType] = (item.errorTypes[context.errorType] || 0) + 1;
        }

        this.updateKnowledgeLevelV2(item);
    }

    /**
     * Record sentence attempt
     */
    recordSentenceAttempt(pattern, correct, responseTimeMs = null, context = {}) {
        if (!this.sentenceKnowledge[pattern]) {
            this.sentenceKnowledge[pattern] = this.createNewKnowledgeItem(pattern, 'sentence');
        }

        const item = this.sentenceKnowledge[pattern];
        this.processAttempt(item, correct, responseTimeMs, context);
        this.updateKnowledgeLevelV2(item);
    }

    /**
     * Create new knowledge item with V2 fields
     */
    createNewKnowledgeItem(id, type = 'vocabulary') {
        return {
            itemId: id,
            type: type,
            attempts: 0,
            correct: 0,
            incorrect: 0,
            lastAttempt: null,
            firstAttempt: Date.now(),
            streak: 0,
            knowledgeLevel: 'new',
            frequency: 1.0,

            // V2 enhancements
            easeFactor: 2.5,              // SM-2 ease factor
            interval: 0,                  // Current interval (days)
            repetitions: 0,               // Number of successful repetitions
            nextReview: Date.now(),       // When to review next

            // Response time tracking
            responseTimes: [],            // Last 10 response times
            avgResponseTime: null,
            confidence: 0.5,              // 0-1, based on response time + accuracy

            // Memory strength (Ebbinghaus)
            memoryStrength: 0,            // Current memory strength
            lastReviewDate: null,

            // Context tracking
            contexts: [],
            errorTypes: {}
        };
    }

    /**
     * Process attempt and update statistics
     */
    processAttempt(item, correct, responseTimeMs, context) {
        item.attempts++;
        item.lastAttempt = Date.now();

        // Update response time tracking
        if (responseTimeMs !== null) {
            const responseTimeSec = responseTimeMs / 1000;
            item.responseTimes.push(responseTimeSec);

            // Keep only last 10 response times
            if (item.responseTimes.length > 10) {
                item.responseTimes.shift();
            }

            // Calculate average response time
            item.avgResponseTime = item.responseTimes.reduce((a, b) => a + b, 0) / item.responseTimes.length;
        }

        if (correct) {
            item.correct++;
            item.streak++;
            item.repetitions++;

            // Update memory strength (successful retrieval strengthens memory)
            this.updateMemoryStrength(item, true);

            // Update ease factor (SM-2 algorithm)
            this.updateEaseFactor(item, 5); // Quality 5 = perfect recall

            // Calculate confidence based on response time
            if (responseTimeMs !== null) {
                item.confidence = this.calculateConfidence(item, true, responseTimeMs);
            }
        } else {
            item.incorrect++;
            item.streak = 0;
            item.repetitions = 0; // Reset repetitions on failure

            // Update memory strength (failure weakens memory)
            this.updateMemoryStrength(item, false);

            // Update ease factor (lower quality)
            this.updateEaseFactor(item, 0); // Quality 0 = complete blackout

            // Lower confidence
            if (responseTimeMs !== null) {
                item.confidence = this.calculateConfidence(item, false, responseTimeMs);
            }
        }

        // Record context
        if (Object.keys(context).length > 0) {
            item.contexts.push({
                timestamp: Date.now(),
                correct,
                responseTime: responseTimeMs,
                ...context
            });

            // Keep only last 10 contexts
            if (item.contexts.length > 10) {
                item.contexts = item.contexts.slice(-10);
            }
        }

        // Calculate next review date using optimized spacing
        this.calculateNextReview(item, correct);
    }

    /**
     * Update memory strength using Ebbinghaus forgetting curve
     */
    updateMemoryStrength(item, correct) {
        const now = Date.now();

        if (item.lastReviewDate) {
            // Calculate how much was forgotten since last review
            const daysSinceReview = (now - item.lastReviewDate) / (1000 * 60 * 60 * 24);
            const forgottenAmount = this.calculateForgetting(item.memoryStrength, daysSinceReview);
            item.memoryStrength -= forgottenAmount;
        }

        if (correct) {
            // Successful retrieval strengthens memory
            // Boost based on current strength (spacing effect)
            const boost = this.forgettingCurve.initialStrength * (1 - item.memoryStrength / 10);
            item.memoryStrength = Math.min(10, item.memoryStrength + boost);
        } else {
            // Failure significantly weakens memory
            item.memoryStrength = Math.max(0, item.memoryStrength * 0.5);
        }

        item.lastReviewDate = now;
    }

    /**
     * Calculate forgetting using Ebbinghaus curve
     * R(t) = e^(-t/S) where R = retention, t = time, S = memory strength
     */
    calculateForgetting(strength, daysSinceReview) {
        if (strength === 0) return 0;

        // Retention percentage after time t
        const retention = Math.exp(-daysSinceReview / (strength * this.forgettingCurve.decayRate));

        // Amount forgotten is 1 - retention, scaled by current strength
        return strength * (1 - retention);
    }

    /**
     * Calculate optimal review time using forgetting curve
     */
    calculateOptimalReviewTime(item) {
        if (item.memoryStrength === 0) return 0;

        // Calculate when retention will drop to threshold (default 90%)
        const S = item.memoryStrength * this.forgettingCurve.decayRate;
        const daysUntilReview = -S * Math.log(this.forgettingCurve.retrievalThreshold);

        return Math.max(0, daysUntilReview);
    }

    /**
     * Update ease factor using SM-2 algorithm
     * Quality: 0-5 (0=complete failure, 5=perfect recall)
     */
    updateEaseFactor(item, quality) {
        // SM-2 formula: EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
        const newEF = item.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

        // Clamp between min and max
        item.easeFactor = Math.max(this.minEaseFactor, Math.min(this.maxEaseFactor, newEF));
    }

    /**
     * Calculate next review date using optimized spacing
     */
    calculateNextReview(item, correct) {
        if (!correct) {
            // Reset to beginning if incorrect
            item.interval = 0;
            item.nextReview = Date.now() + (15 * 60 * 1000); // 15 minutes
            return;
        }

        if (item.repetitions === 1) {
            item.interval = 1; // 1 day
        } else if (item.repetitions === 2) {
            item.interval = 3; // 3 days
        } else {
            // After 2nd successful repetition, use ease factor
            item.interval = Math.round(item.interval * item.easeFactor);
        }

        // Also consider Ebbinghaus optimal review time
        const optimalDays = this.calculateOptimalReviewTime(item);

        // Use the minimum of SM-2 interval and Ebbinghaus optimal time
        // This combines both algorithms for best results
        const finalInterval = Math.min(item.interval, optimalDays);

        // Convert to milliseconds and set next review
        item.nextReview = Date.now() + (finalInterval * 24 * 60 * 60 * 1000);
    }

    /**
     * Calculate confidence score (0-1) based on response time and accuracy
     */
    calculateConfidence(item, correct, responseTimeMs) {
        const responseTimeSec = responseTimeMs / 1000;

        // Base confidence on accuracy
        const accuracy = item.attempts > 0 ? item.correct / item.attempts : 0;
        let confidence = accuracy;

        // Adjust based on response time
        if (correct) {
            if (responseTimeSec < this.responseTimeThresholds.fast) {
                confidence = Math.min(1.0, confidence + 0.1); // Fast = confident
            } else if (responseTimeSec > this.responseTimeThresholds.slow) {
                confidence = Math.max(0, confidence - 0.1); // Slow = uncertain
            }
        } else {
            // Incorrect answer reduces confidence more
            confidence = Math.max(0, confidence - 0.2);
        }

        // Smooth with previous confidence (70% new, 30% old)
        return confidence * 0.7 + (item.confidence || 0.5) * 0.3;
    }

    /**
     * Update knowledge level with V2 enhancements
     */
    updateKnowledgeLevelV2(item) {
        if (item.attempts < this.minAttempts) {
            item.knowledgeLevel = 'new';
            item.frequency = 1.0;
            return;
        }

        const accuracy = item.correct / item.attempts;
        const confidence = item.confidence || 0.5;
        const memoryStrength = item.memoryStrength || 0;

        // Combined scoring (accuracy 50%, confidence 30%, memory 20%)
        const combinedScore = (accuracy * 0.5) + (confidence * 0.3) + (Math.min(memoryStrength / 10, 1.0) * 0.2);

        // MASTERED: High combined score, good streak, high ease factor
        if (combinedScore >= 0.85 && item.streak >= 5 && item.easeFactor >= 2.3) {
            item.knowledgeLevel = 'mastered';
            item.frequency = 0.2; // Show 80% less often
        }
        // FAMILIAR: Good combined score
        else if (combinedScore >= 0.70 && item.streak >= 3) {
            item.knowledgeLevel = 'familiar';
            item.frequency = 0.5; // Show 50% less often
        }
        // STRUGGLING: Low accuracy or confidence
        else if (accuracy < this.struggleThreshold || confidence < 0.3) {
            item.knowledgeLevel = 'struggling';
            item.frequency = 2.5; // Show 2.5x more often
        }
        // CRITICAL: Very poor performance
        else if (accuracy < 0.30 || (confidence < 0.2 && item.attempts >= 5)) {
            item.knowledgeLevel = 'critical';
            item.frequency = 4.0; // Show 4x more often
        }
        // LEARNING: Still in progress
        else {
            item.knowledgeLevel = 'learning';
            item.frequency = 1.2; // Show slightly more often
        }

        // Further adjust frequency based on memory strength
        if (memoryStrength < 2 && item.knowledgeLevel !== 'new') {
            item.frequency *= 1.3; // Weak memory = more practice
        } else if (memoryStrength > 7) {
            item.frequency *= 0.8; // Strong memory = less practice
        }
    }

    /**
     * Get optimized practice list using multiple factors
     */
    getOptimizedPracticeList(allItems, count = 10, type = 'vocabulary') {
        const now = Date.now();
        const knowledge = type === 'vocabulary' ? this.vocabularyKnowledge :
                         type === 'grammar' ? this.grammarKnowledge :
                         this.sentenceKnowledge;

        // Score each item for practice priority
        const scoredItems = allItems.map(item => {
            const itemId = item.id || item;
            const k = knowledge[itemId];

            if (!k) {
                // New items get medium priority
                return { item, score: 50, reason: 'new' };
            }

            let score = 0;
            let reason = '';

            // Factor 1: Due for review (highest priority)
            if (k.nextReview <= now) {
                const hoursOverdue = (now - k.nextReview) / (1000 * 60 * 60);
                score += Math.min(100, 50 + hoursOverdue * 5);
                reason = 'overdue';
            }

            // Factor 2: Low confidence/accuracy
            if (k.confidence < 0.4 || (k.attempts > 0 && k.correct / k.attempts < 0.5)) {
                score += 40;
                reason = reason || 'struggling';
            }

            // Factor 3: Weak memory strength
            if (k.memoryStrength < 3) {
                score += 30;
                reason = reason || 'weak-memory';
            }

            // Factor 4: Recent errors (last 24h)
            if (k.lastAttempt && !k.streak && (now - k.lastAttempt < 24 * 60 * 60 * 1000)) {
                score += 35;
                reason = reason || 'recent-error';
            }

            // Factor 5: Frequency multiplier
            score *= k.frequency;

            // Factor 6: Spacing effect - items not reviewed recently get boost
            if (k.lastAttempt) {
                const daysSinceReview = (now - k.lastAttempt) / (1000 * 60 * 60 * 24);
                if (daysSinceReview > 7) {
                    score += 20;
                }
            }

            return { item, score, reason: reason || 'practice', knowledge: k };
        });

        // Sort by score (highest first)
        scoredItems.sort((a, b) => b.score - a.score);

        // Return top items with diversity
        return this.ensureDiversity(scoredItems, count);
    }

    /**
     * Ensure diversity in practice list (avoid too many similar items)
     */
    ensureDiversity(scoredItems, count) {
        const selected = [];
        const categories = new Set();

        for (const item of scoredItems) {
            if (selected.length >= count) break;

            // Try to ensure variety in categories
            const category = item.item.category || 'general';

            if (selected.length < count * 0.7 || !categories.has(category) || categories.size < 3) {
                selected.push(item.item);
                categories.add(category);
            }
        }

        // If not enough diverse items, fill with remaining highest scores
        if (selected.length < count) {
            for (const item of scoredItems) {
                if (selected.length >= count) break;
                if (!selected.includes(item.item)) {
                    selected.push(item.item);
                }
            }
        }

        return selected;
    }

    /**
     * Get items due for review (using optimized scheduling)
     */
    getItemsDueForReview(allItems, type = 'vocabulary', count = 10) {
        const now = Date.now();
        const knowledge = type === 'vocabulary' ? this.vocabularyKnowledge :
                         type === 'grammar' ? this.grammarKnowledge :
                         this.sentenceKnowledge;

        const dueItems = allItems.filter(item => {
            const itemId = item.id || item;
            const k = knowledge[itemId];

            // New items are always due
            if (!k) return true;

            // Check if due based on next review date
            return k.nextReview <= now;
        });

        return this.getOptimizedPracticeList(dueItems, count, type);
    }

    /**
     * Get learning insights and analytics
     */
    getLearningInsights() {
        const allItems = [
            ...Object.values(this.vocabularyKnowledge),
            ...Object.values(this.grammarKnowledge),
            ...Object.values(this.sentenceKnowledge)
        ];

        if (allItems.length === 0) {
            return { message: 'Not enough data yet', items: [] };
        }

        // Calculate various metrics
        const avgAccuracy = allItems.reduce((sum, i) =>
            sum + (i.attempts > 0 ? i.correct / i.attempts : 0), 0) / allItems.length;

        const avgConfidence = allItems.reduce((sum, i) => sum + (i.confidence || 0), 0) / allItems.length;

        const avgMemoryStrength = allItems.reduce((sum, i) => sum + i.memoryStrength, 0) / allItems.length;

        const avgResponseTime = allItems
            .filter(i => i.avgResponseTime)
            .reduce((sum, i) => sum + i.avgResponseTime, 0) / allItems.filter(i => i.avgResponseTime).length || 0;

        // Identify patterns
        const insights = [];

        if (avgAccuracy < 0.60) {
            insights.push({
                type: 'concern',
                message: 'Deine Genauigkeit ist unter 60%. Fokussiere dich auf die Grundlagen.',
                recommendation: 'Wiederhole schwierige Konzepte häufiger.'
            });
        }

        if (avgConfidence < 0.40) {
            insights.push({
                type: 'concern',
                message: 'Du scheinst unsicher zu sein. Nimm dir mehr Zeit zum Nachdenken.',
                recommendation: 'Versuche, die Regeln zu verstehen, nicht nur auswendig zu lernen.'
            });
        }

        if (avgResponseTime > 12) {
            insights.push({
                type: 'info',
                message: 'Du brauchst viel Zeit zum Antworten. Das ist normal beim Lernen.',
                recommendation: 'Mit mehr Übung wirst du schneller und sicherer.'
            });
        }

        if (avgMemoryStrength < 3) {
            insights.push({
                type: 'concern',
                message: 'Deine Gedächtnisstärke ist niedrig. Regelmäßige Wiederholung hilft!',
                recommendation: 'Übe jeden Tag ein bisschen, statt viel auf einmal.'
            });
        }

        if (avgAccuracy > 0.85 && avgConfidence > 0.7) {
            insights.push({
                type: 'success',
                message: 'Hervorragend! Du machst große Fortschritte!',
                recommendation: 'Du bist bereit für schwierigere Inhalte.'
            });
        }

        return {
            metrics: {
                accuracy: avgAccuracy,
                confidence: avgConfidence,
                memoryStrength: avgMemoryStrength,
                responseTime: avgResponseTime,
                totalItems: allItems.length,
                masteredItems: allItems.filter(i => i.knowledgeLevel === 'mastered').length,
                strugglingItems: allItems.filter(i => i.knowledgeLevel === 'struggling' || i.knowledgeLevel === 'critical').length
            },
            insights: insights
        };
    }

    /**
     * Get generic knowledge (for backward compatibility)
     */
    getKnowledge(type, id) {
        const knowledge = type === 'vocabulary' ? this.vocabularyKnowledge :
                         type === 'grammar' ? this.grammarKnowledge :
                         this.sentenceKnowledge;
        return knowledge[id];
    }

    /**
     * Record attempt (generic, for backward compatibility)
     */
    recordAttempt(type, id, correct, responseTimeMs = null, context = {}) {
        if (type === 'vocabulary') {
            this.recordVocabularyAttempt(id, correct, responseTimeMs, context);
        } else if (type === 'grammar') {
            this.recordGrammarAttempt(id, correct, responseTimeMs, context);
        } else {
            this.recordSentenceAttempt(id, correct, responseTimeMs, context);
        }
    }

    // Backward compatibility methods
    getVocabularyPracticeList(allItems, count = 10) {
        return this.getOptimizedPracticeList(allItems, count, 'vocabulary');
    }

    getGrammarPracticeList(allConcepts, count = 10) {
        return this.getOptimizedPracticeList(allConcepts, count, 'grammar');
    }

    getStrugglingItems(type = 'vocabulary') {
        const knowledge = type === 'vocabulary' ? this.vocabularyKnowledge :
                         type === 'grammar' ? this.grammarKnowledge :
                         this.sentenceKnowledge;

        return Object.values(knowledge)
            .filter(item => item.knowledgeLevel === 'struggling' || item.knowledgeLevel === 'critical')
            .sort((a, b) => {
                const aScore = (a.correct / a.attempts) * a.confidence;
                const bScore = (b.correct / b.attempts) * b.confidence;
                return aScore - bScore;
            });
    }

    getMasteredItems(type = 'vocabulary') {
        const knowledge = type === 'vocabulary' ? this.vocabularyKnowledge :
                         type === 'grammar' ? this.grammarKnowledge :
                         this.sentenceKnowledge;

        return Object.values(knowledge)
            .filter(item => item.knowledgeLevel === 'mastered')
            .sort((a, b) => b.memoryStrength - a.memoryStrength);
    }

    getKnowledgeSummary() {
        return {
            vocabulary: this.getTypeStats(this.vocabularyKnowledge),
            grammar: this.getTypeStats(this.grammarKnowledge),
            sentences: this.getTypeStats(this.sentenceKnowledge),
            insights: this.getLearningInsights()
        };
    }

    getTypeStats(knowledge) {
        const items = Object.values(knowledge);

        return {
            total: items.length,
            new: items.filter(i => i.knowledgeLevel === 'new').length,
            learning: items.filter(i => i.knowledgeLevel === 'learning').length,
            familiar: items.filter(i => i.knowledgeLevel === 'familiar').length,
            mastered: items.filter(i => i.knowledgeLevel === 'mastered').length,
            struggling: items.filter(i => i.knowledgeLevel === 'struggling' || i.knowledgeLevel === 'critical').length,
            averageAccuracy: items.reduce((sum, i) => sum + (i.attempts > 0 ? i.correct / i.attempts : 0), 0) / (items.length || 1),
            averageConfidence: items.reduce((sum, i) => sum + (i.confidence || 0), 0) / (items.length || 1),
            averageMemoryStrength: items.reduce((sum, i) => sum + i.memoryStrength, 0) / (items.length || 1)
        };
    }

    // Save/Load methods
    save() {
        localStorage.setItem('knowledgeTrackerV2_vocabulary', JSON.stringify(this.vocabularyKnowledge));
        localStorage.setItem('knowledgeTrackerV2_grammar', JSON.stringify(this.grammarKnowledge));
        localStorage.setItem('knowledgeTrackerV2_sentences', JSON.stringify(this.sentenceKnowledge));
    }

    load() {
        const vocab = localStorage.getItem('knowledgeTrackerV2_vocabulary');
        const grammar = localStorage.getItem('knowledgeTrackerV2_grammar');
        const sentences = localStorage.getItem('knowledgeTrackerV2_sentences');

        if (vocab) this.vocabularyKnowledge = JSON.parse(vocab);
        if (grammar) this.grammarKnowledge = JSON.parse(grammar);
        if (sentences) this.sentenceKnowledge = JSON.parse(sentences);
    }

    reset() {
        this.vocabularyKnowledge = {};
        this.grammarKnowledge = {};
        this.sentenceKnowledge = {};
        this.save();
    }

    /**
     * Migrate from V1 to V2
     */
    migrateFromV1(v1Tracker) {
        // Migrate vocabulary
        Object.entries(v1Tracker.vocabularyKnowledge || {}).forEach(([id, oldItem]) => {
            const newItem = this.createNewKnowledgeItem(id, 'vocabulary');
            Object.assign(newItem, oldItem);
            // Set defaults for new V2 fields
            newItem.easeFactor = newItem.easeFactor || 2.5;
            newItem.memoryStrength = newItem.memoryStrength || (oldItem.streak * 0.5);
            newItem.confidence = newItem.confidence || (oldItem.correct / oldItem.attempts || 0.5);
            this.vocabularyKnowledge[id] = newItem;
        });

        // Migrate grammar
        Object.entries(v1Tracker.grammarKnowledge || {}).forEach(([id, oldItem]) => {
            const newItem = this.createNewKnowledgeItem(id, 'grammar');
            Object.assign(newItem, oldItem);
            newItem.easeFactor = newItem.easeFactor || 2.5;
            newItem.memoryStrength = newItem.memoryStrength || (oldItem.streak * 0.5);
            newItem.confidence = newItem.confidence || (oldItem.correct / oldItem.attempts || 0.5);
            this.grammarKnowledge[id] = newItem;
        });

        // Migrate sentences
        Object.entries(v1Tracker.sentenceKnowledge || {}).forEach(([id, oldItem]) => {
            const newItem = this.createNewKnowledgeItem(id, 'sentence');
            Object.assign(newItem, oldItem);
            newItem.easeFactor = newItem.easeFactor || 2.5;
            newItem.memoryStrength = newItem.memoryStrength || (oldItem.streak * 0.5);
            newItem.confidence = newItem.confidence || (oldItem.correct / oldItem.attempts || 0.5);
            this.sentenceKnowledge[id] = newItem;
        });

        this.save();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdaptiveKnowledgeTrackerV2 };
}
