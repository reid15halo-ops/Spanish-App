/**
 * Adaptive Knowledge Tracker
 *
 * Tracks student knowledge level for vocabulary, grammar, and sentence structures
 * Adapts exercise frequency based on performance:
 * - Words/grammar answered correctly often → shown less frequently
 * - Words/grammar answered incorrectly often → shown more frequently
 */

class AdaptiveKnowledgeTracker {
    constructor() {
        this.vocabularyKnowledge = {}; // itemId → knowledge stats
        this.grammarKnowledge = {};    // concept → knowledge stats
        this.sentenceKnowledge = {};   // pattern → knowledge stats

        // Thresholds for adaptive behavior
        this.masteryThreshold = 0.90;   // 90% correct → reduce frequency
        this.struggleThreshold = 0.50;  // <50% correct → increase frequency
        this.minAttempts = 3;           // Minimum attempts before adaptation
    }

    /**
     * Record a vocabulary item attempt
     */
    recordVocabularyAttempt(itemId, correct, context = {}) {
        if (!this.vocabularyKnowledge[itemId]) {
            this.vocabularyKnowledge[itemId] = {
                itemId,
                attempts: 0,
                correct: 0,
                incorrect: 0,
                lastAttempt: null,
                firstAttempt: Date.now(),
                streak: 0,
                knowledgeLevel: 'new', // new, learning, familiar, mastered, struggling
                frequency: 1.0, // 1.0 = normal, <1.0 = less often, >1.0 = more often
                contexts: []
            };
        }

        const item = this.vocabularyKnowledge[itemId];
        item.attempts++;
        item.lastAttempt = Date.now();

        if (correct) {
            item.correct++;
            item.streak++;
        } else {
            item.incorrect++;
            item.streak = 0;
        }

        // Record context
        item.contexts.push({
            timestamp: Date.now(),
            correct,
            ...context
        });

        // Keep only last 10 contexts
        if (item.contexts.length > 10) {
            item.contexts = item.contexts.slice(-10);
        }

        // Update knowledge level and frequency
        this.updateKnowledgeLevel(item);
    }

    /**
     * Record a grammar concept attempt
     */
    recordGrammarAttempt(concept, correct, context = {}) {
        if (!this.grammarKnowledge[concept]) {
            this.grammarKnowledge[concept] = {
                concept,
                attempts: 0,
                correct: 0,
                incorrect: 0,
                lastAttempt: null,
                firstAttempt: Date.now(),
                streak: 0,
                knowledgeLevel: 'new',
                frequency: 1.0,
                errorTypes: {}
            };
        }

        const grammar = this.grammarKnowledge[concept];
        grammar.attempts++;
        grammar.lastAttempt = Date.now();

        if (correct) {
            grammar.correct++;
            grammar.streak++;
        } else {
            grammar.incorrect++;
            grammar.streak = 0;

            // Track specific error type
            if (context.errorType) {
                if (!grammar.errorTypes[context.errorType]) {
                    grammar.errorTypes[context.errorType] = 0;
                }
                grammar.errorTypes[context.errorType]++;
            }
        }

        // Update knowledge level
        this.updateKnowledgeLevel(grammar);
    }

    /**
     * Record sentence structure attempt
     */
    recordSentenceAttempt(pattern, correct, context = {}) {
        if (!this.sentenceKnowledge[pattern]) {
            this.sentenceKnowledge[pattern] = {
                pattern,
                attempts: 0,
                correct: 0,
                incorrect: 0,
                lastAttempt: null,
                firstAttempt: Date.now(),
                streak: 0,
                knowledgeLevel: 'new',
                frequency: 1.0
            };
        }

        const sentence = this.sentenceKnowledge[pattern];
        sentence.attempts++;
        sentence.lastAttempt = Date.now();

        if (correct) {
            sentence.correct++;
            sentence.streak++;
        } else {
            sentence.incorrect++;
            sentence.streak = 0;
        }

        this.updateKnowledgeLevel(sentence);
    }

    /**
     * Update knowledge level based on performance
     */
    updateKnowledgeLevel(item) {
        if (item.attempts < this.minAttempts) {
            item.knowledgeLevel = 'new';
            item.frequency = 1.0;
            return;
        }

        const accuracy = item.correct / item.attempts;

        // MASTERED: High accuracy, good streak
        if (accuracy >= this.masteryThreshold && item.streak >= 5) {
            item.knowledgeLevel = 'mastered';
            item.frequency = 0.3; // Show 70% less often
        }
        // FAMILIAR: Good accuracy
        else if (accuracy >= 0.75 && accuracy < this.masteryThreshold) {
            item.knowledgeLevel = 'familiar';
            item.frequency = 0.6; // Show 40% less often
        }
        // STRUGGLING: Low accuracy
        else if (accuracy < this.struggleThreshold) {
            item.knowledgeLevel = 'struggling';
            item.frequency = 2.0; // Show 2x more often
        }
        // LEARNING: Still learning
        else {
            item.knowledgeLevel = 'learning';
            item.frequency = 1.0; // Normal frequency
        }

        // Extra boost for very poor performance
        if (accuracy < 0.30 && item.attempts >= 5) {
            item.knowledgeLevel = 'critical';
            item.frequency = 3.0; // Show 3x more often
        }
    }

    /**
     * Get weighted list of vocabulary items to practice
     */
    getVocabularyPracticeList(allItems, count = 10) {
        const weightedList = [];

        allItems.forEach(item => {
            const knowledge = this.vocabularyKnowledge[item.id];
            const frequency = knowledge ? knowledge.frequency : 1.0;

            // Add item multiple times based on frequency
            const repeatCount = Math.ceil(frequency * 10);
            for (let i = 0; i < repeatCount; i++) {
                weightedList.push(item);
            }
        });

        // Shuffle and select
        const shuffled = weightedList.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    /**
     * Get weighted list of grammar concepts to practice
     */
    getGrammarPracticeList(allConcepts, count = 10) {
        const weightedList = [];

        allConcepts.forEach(concept => {
            const knowledge = this.grammarKnowledge[concept];
            const frequency = knowledge ? knowledge.frequency : 1.0;

            const repeatCount = Math.ceil(frequency * 10);
            for (let i = 0; i < repeatCount; i++) {
                weightedList.push(concept);
            }
        });

        const shuffled = weightedList.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    /**
     * Get struggling items (need focused practice)
     */
    getStrugglingItems(type = 'vocabulary') {
        const knowledge = type === 'vocabulary' ? this.vocabularyKnowledge :
                         type === 'grammar' ? this.grammarKnowledge :
                         this.sentenceKnowledge;

        return Object.values(knowledge)
            .filter(item => item.knowledgeLevel === 'struggling' || item.knowledgeLevel === 'critical')
            .sort((a, b) => {
                const aAccuracy = a.correct / a.attempts;
                const bAccuracy = b.correct / b.attempts;
                return aAccuracy - bAccuracy; // Lowest accuracy first
            });
    }

    /**
     * Get mastered items (can review less)
     */
    getMasteredItems(type = 'vocabulary') {
        const knowledge = type === 'vocabulary' ? this.vocabularyKnowledge :
                         type === 'grammar' ? this.grammarKnowledge :
                         this.sentenceKnowledge;

        return Object.values(knowledge)
            .filter(item => item.knowledgeLevel === 'mastered')
            .sort((a, b) => b.streak - a.streak); // Best streak first
    }

    /**
     * Get knowledge summary
     */
    getKnowledgeSummary() {
        const vocabStats = this.getTypeStats(this.vocabularyKnowledge);
        const grammarStats = this.getTypeStats(this.grammarKnowledge);
        const sentenceStats = this.getTypeStats(this.sentenceKnowledge);

        return {
            vocabulary: vocabStats,
            grammar: grammarStats,
            sentences: sentenceStats,
            overall: {
                totalItems: vocabStats.total + grammarStats.total + sentenceStats.total,
                masteryRate: this.calculateOverallMastery(),
                strugglingCount: vocabStats.struggling + grammarStats.struggling + sentenceStats.struggling
            }
        };
    }

    /**
     * Get statistics for a knowledge type
     */
    getTypeStats(knowledge) {
        const items = Object.values(knowledge);

        return {
            total: items.length,
            new: items.filter(i => i.knowledgeLevel === 'new').length,
            learning: items.filter(i => i.knowledgeLevel === 'learning').length,
            familiar: items.filter(i => i.knowledgeLevel === 'familiar').length,
            mastered: items.filter(i => i.knowledgeLevel === 'mastered').length,
            struggling: items.filter(i => i.knowledgeLevel === 'struggling' || i.knowledgeLevel === 'critical').length,
            averageAccuracy: this.calculateAverageAccuracy(items)
        };
    }

    /**
     * Calculate average accuracy
     */
    calculateAverageAccuracy(items) {
        if (items.length === 0) return 0;

        const totalAccuracy = items.reduce((sum, item) => {
            if (item.attempts === 0) return sum;
            return sum + (item.correct / item.attempts);
        }, 0);

        return totalAccuracy / items.length;
    }

    /**
     * Calculate overall mastery percentage
     */
    calculateOverallMastery() {
        const allItems = [
            ...Object.values(this.vocabularyKnowledge),
            ...Object.values(this.grammarKnowledge),
            ...Object.values(this.sentenceKnowledge)
        ];

        if (allItems.length === 0) return 0;

        const masteredCount = allItems.filter(
            i => i.knowledgeLevel === 'mastered' || i.knowledgeLevel === 'familiar'
        ).length;

        return (masteredCount / allItems.length) * 100;
    }

    /**
     * Get recommended focus areas
     */
    getRecommendedFocus() {
        const struggling = {
            vocabulary: this.getStrugglingItems('vocabulary'),
            grammar: this.getStrugglingItems('grammar'),
            sentences: this.getStrugglingItems('sentences')
        };

        const recommendations = [];

        // Vocabulary recommendations
        if (struggling.vocabulary.length > 0) {
            const topVocab = struggling.vocabulary.slice(0, 5);
            recommendations.push({
                type: 'vocabulary',
                priority: 'high',
                count: struggling.vocabulary.length,
                message: `Du hast Schwierigkeiten mit ${struggling.vocabulary.length} Vokabeln. Fokussiere dich darauf!`,
                items: topVocab.map(v => v.itemId)
            });
        }

        // Grammar recommendations
        if (struggling.grammar.length > 0) {
            const topGrammar = struggling.grammar.slice(0, 3);
            recommendations.push({
                type: 'grammar',
                priority: 'high',
                count: struggling.grammar.length,
                message: `Du brauchst mehr Übung bei ${struggling.grammar.length} Grammatik-Konzepten.`,
                concepts: topGrammar.map(g => g.concept)
            });
        }

        // Sentence patterns
        if (struggling.sentences.length > 0) {
            recommendations.push({
                type: 'sentences',
                priority: 'medium',
                count: struggling.sentences.length,
                message: `Übe Satzstrukturen mehr.`,
                patterns: struggling.sentences.slice(0, 3).map(s => s.pattern)
            });
        }

        return recommendations;
    }

    /**
     * Should review this item? (based on time since last attempt)
     */
    shouldReview(itemId, type = 'vocabulary') {
        const knowledge = type === 'vocabulary' ? this.vocabularyKnowledge :
                         type === 'grammar' ? this.grammarKnowledge :
                         this.sentenceKnowledge;

        const item = knowledge[itemId];
        if (!item || !item.lastAttempt) return true;

        const timeSinceLastAttempt = Date.now() - item.lastAttempt;
        const hoursSince = timeSinceLastAttempt / (1000 * 60 * 60);

        // Review intervals based on knowledge level
        const intervals = {
            new: 0,          // Immediate
            learning: 4,     // 4 hours
            familiar: 24,    // 1 day
            mastered: 72,    // 3 days
            struggling: 1,   // 1 hour
            critical: 0.5    // 30 minutes
        };

        const requiredInterval = intervals[item.knowledgeLevel] || 4;
        return hoursSince >= requiredInterval;
    }

    /**
     * Get items due for review
     */
    getDueForReview(allItems, type = 'vocabulary', count = 10) {
        const dueItems = allItems.filter(item =>
            this.shouldReview(item.id || item, type)
        );

        // Weighted by frequency
        return this.getVocabularyPracticeList(dueItems, count);
    }

    /**
     * Save knowledge tracking data
     */
    save() {
        localStorage.setItem('knowledgeTracker_vocabulary', JSON.stringify(this.vocabularyKnowledge));
        localStorage.setItem('knowledgeTracker_grammar', JSON.stringify(this.grammarKnowledge));
        localStorage.setItem('knowledgeTracker_sentences', JSON.stringify(this.sentenceKnowledge));
    }

    /**
     * Load knowledge tracking data
     */
    load() {
        const vocab = localStorage.getItem('knowledgeTracker_vocabulary');
        const grammar = localStorage.getItem('knowledgeTracker_grammar');
        const sentences = localStorage.getItem('knowledgeTracker_sentences');

        if (vocab) this.vocabularyKnowledge = JSON.parse(vocab);
        if (grammar) this.grammarKnowledge = JSON.parse(grammar);
        if (sentences) this.sentenceKnowledge = JSON.parse(sentences);
    }

    /**
     * Reset all tracking data
     */
    reset() {
        this.vocabularyKnowledge = {};
        this.grammarKnowledge = {};
        this.sentenceKnowledge = {};
        this.save();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdaptiveKnowledgeTracker };
}
