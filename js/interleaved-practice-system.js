/**
 * Interleaved Practice System
 *
 * Implements research-based interleaved practice strategies:
 * - Mixing related concepts instead of blocking
 * - Spacing similar items to enhance discrimination
 * - Contextual variation for transfer learning
 * - Optimal difficulty sequencing
 *
 * Research basis:
 * - Rohrer & Taylor (2007): Interleaving improves long-term retention
 * - Kornell & Bjork (2008): Spacing effect enhances discrimination
 * - Schmidt & Bjork (1992): Variable practice for transfer
 */

class InterleavedPracticeSystem {
    constructor() {
        // Concept relationships and groups
        this.conceptGroups = {
            'ser-estar': ['ser-conjugation', 'estar-conjugation', 'ser-estar-choice', 'ser-estar-meaning'],
            'present-tense': ['ser', 'estar', 'tener', 'hacer', 'ir'],
            'pronouns': ['personal-pronouns', 'possessive-pronouns', 'object-pronouns'],
            'question-words': ['que', 'donde', 'cuando', 'como', 'por-que', 'quien'],
            'articles': ['definite-articles', 'indefinite-articles', 'article-contractions']
        };

        // Spacing rules (minimum items between similar concepts)
        this.spacingRules = {
            'same-concept': 3,        // Same exact concept: space by 3+ items
            'related-concept': 2,     // Related concepts: space by 2+ items
            'same-category': 1        // Same category: space by 1+ items
        };

        // Practice sequences (optimal ordering)
        this.practiceSequences = {
            'beginner': [
                { type: 'introduce', weight: 0.3 },
                { type: 'practice', weight: 0.5 },
                { type: 'review', weight: 0.2 }
            ],
            'intermediate': [
                { type: 'review', weight: 0.2 },
                { type: 'practice', weight: 0.4 },
                { type: 'challenge', weight: 0.3 },
                { type: 'mixed', weight: 0.1 }
            ],
            'advanced': [
                { type: 'review', weight: 0.1 },
                { type: 'challenge', weight: 0.4 },
                { type: 'mixed', weight: 0.4 },
                { type: 'novel', weight: 0.1 }
            ]
        };

        // Contextual variations for each concept
        this.contextualVariations = {};
    }

    /**
     * Generate interleaved practice session
     */
    generateInterleavedSession(items, count = 10, knowledgeTracker = null) {
        if (items.length === 0) return [];

        // Categorize items by concept
        const itemsByConcept = this.categorizeItemsByConcept(items);

        // Determine user level
        const userLevel = this.determineUserLevel(items, knowledgeTracker);

        // Get practice sequence for user level
        const sequence = this.practiceSequences[userLevel];

        // Select items according to sequence
        const selectedItems = this.selectItemsBySequence(itemsByConcept, sequence, count, knowledgeTracker);

        // Apply interleaving: mix concepts optimally
        const interleavedItems = this.applyInterleaving(selectedItems);

        // Apply spacing rules
        const spacedItems = this.applySpacing(interleavedItems);

        // Add contextual variation
        const variedItems = this.addContextualVariation(spacedItems);

        return variedItems.slice(0, count);
    }

    /**
     * Categorize items by concept/category
     */
    categorizeItemsByConcept(items) {
        const categorized = {};

        items.forEach(item => {
            const concept = item.concept || item.category || 'general';

            if (!categorized[concept]) {
                categorized[concept] = [];
            }

            categorized[concept].push(item);
        });

        return categorized;
    }

    /**
     * Determine user level based on performance
     */
    determineUserLevel(items, knowledgeTracker) {
        if (!knowledgeTracker) return 'beginner';

        const knowledge = knowledgeTracker.getKnowledgeSummary();

        if (!knowledge || !knowledge.insights || !knowledge.insights.metrics) {
            return 'beginner';
        }

        const metrics = knowledge.insights.metrics;
        const accuracy = metrics.accuracy || 0;
        const masteryRate = metrics.masteredItems / (metrics.totalItems || 1);

        if (accuracy >= 0.80 && masteryRate >= 0.60) {
            return 'advanced';
        } else if (accuracy >= 0.65 && masteryRate >= 0.30) {
            return 'intermediate';
        } else {
            return 'beginner';
        }
    }

    /**
     * Select items according to practice sequence
     */
    selectItemsBySequence(itemsByConcept, sequence, count, knowledgeTracker) {
        const selected = [];
        const concepts = Object.keys(itemsByConcept);

        // Calculate how many items of each type
        const typeCounts = {};
        sequence.forEach(seq => {
            typeCounts[seq.type] = Math.round(count * seq.weight);
        });

        // Select items for each type
        sequence.forEach(seq => {
            const typeCount = typeCounts[seq.type];
            const typeItems = this.selectItemsByType(itemsByConcept, seq.type, typeCount, knowledgeTracker);
            selected.push(...typeItems);
        });

        return selected;
    }

    /**
     * Select items by practice type
     */
    selectItemsByType(itemsByConcept, type, count, knowledgeTracker) {
        const allItems = Object.values(itemsByConcept).flat();

        switch (type) {
            case 'introduce':
                // New items the user hasn't seen
                return this.selectNewItems(allItems, count, knowledgeTracker);

            case 'practice':
                // Items currently being learned
                return this.selectPracticeItems(allItems, count, knowledgeTracker);

            case 'review':
                // Items that need review
                return this.selectReviewItems(allItems, count, knowledgeTracker);

            case 'challenge':
                // Difficult items or error-prone
                return this.selectChallengeItems(allItems, count, knowledgeTracker);

            case 'mixed':
                // Mix of everything
                return this.selectMixedItems(allItems, count, knowledgeTracker);

            case 'novel':
                // Novel contexts or advanced applications
                return this.selectNovelItems(allItems, count, knowledgeTracker);

            default:
                return this.shuffle(allItems).slice(0, count);
        }
    }

    /**
     * Select new items
     */
    selectNewItems(items, count, knowledgeTracker) {
        if (!knowledgeTracker) {
            return this.shuffle(items).slice(0, count);
        }

        const newItems = items.filter(item => {
            const knowledge = knowledgeTracker.getKnowledge('vocabulary', item.id || item);
            return !knowledge || knowledge.knowledgeLevel === 'new';
        });

        return this.shuffle(newItems).slice(0, count);
    }

    /**
     * Select practice items (currently learning)
     */
    selectPracticeItems(items, count, knowledgeTracker) {
        if (!knowledgeTracker) {
            return this.shuffle(items).slice(0, count);
        }

        const practiceItems = items.filter(item => {
            const knowledge = knowledgeTracker.getKnowledge('vocabulary', item.id || item);
            return knowledge && (knowledge.knowledgeLevel === 'learning' || knowledge.knowledgeLevel === 'familiar');
        });

        return this.shuffle(practiceItems).slice(0, count);
    }

    /**
     * Select review items
     */
    selectReviewItems(items, count, knowledgeTracker) {
        if (!knowledgeTracker) {
            return this.shuffle(items).slice(0, count);
        }

        // Use knowledge tracker's optimized review selection
        if (knowledgeTracker.getItemsDueForReview) {
            return knowledgeTracker.getItemsDueForReview(items, 'vocabulary', count);
        }

        return this.shuffle(items).slice(0, count);
    }

    /**
     * Select challenge items (difficult/error-prone)
     */
    selectChallengeItems(items, count, knowledgeTracker) {
        if (!knowledgeTracker) {
            return this.shuffle(items).slice(0, count);
        }

        const challengeItems = items.filter(item => {
            const knowledge = knowledgeTracker.getKnowledge('vocabulary', item.id || item);
            return knowledge && (knowledge.knowledgeLevel === 'struggling' || knowledge.knowledgeLevel === 'critical');
        });

        // Sort by difficulty (lowest accuracy first)
        challengeItems.sort((a, b) => {
            const aKnow = knowledgeTracker.getKnowledge('vocabulary', a.id || a);
            const bKnow = knowledgeTracker.getKnowledge('vocabulary', b.id || b);

            const aAcc = aKnow ? aKnow.correct / (aKnow.attempts || 1) : 0;
            const bAcc = bKnow ? bKnow.correct / (bKnow.attempts || 1) : 0;

            return aAcc - bAcc;
        });

        return challengeItems.slice(0, count);
    }

    /**
     * Select mixed items
     */
    selectMixedItems(items, count, knowledgeTracker) {
        const mixed = [];
        const third = Math.ceil(count / 3);

        mixed.push(...this.selectPracticeItems(items, third, knowledgeTracker));
        mixed.push(...this.selectReviewItems(items, third, knowledgeTracker));
        mixed.push(...this.selectChallengeItems(items, count - mixed.length, knowledgeTracker));

        return this.shuffle(mixed);
    }

    /**
     * Select novel items (advanced applications)
     */
    selectNovelItems(items, count, knowledgeTracker) {
        // For novel contexts, select mastered items and add variation
        if (!knowledgeTracker) {
            return this.shuffle(items).slice(0, count);
        }

        const masteredItems = items.filter(item => {
            const knowledge = knowledgeTracker.getKnowledge('vocabulary', item.id || item);
            return knowledge && knowledge.knowledgeLevel === 'mastered';
        });

        return this.shuffle(masteredItems).slice(0, count);
    }

    /**
     * Apply interleaving: mix related concepts optimally
     */
    applyInterleaving(items) {
        if (items.length <= 2) return items;

        // Group items by concept
        const groups = {};
        items.forEach(item => {
            const concept = item.concept || 'general';
            if (!groups[concept]) groups[concept] = [];
            groups[concept].push(item);
        });

        // Interleave groups
        const interleaved = [];
        const groupKeys = Object.keys(groups);
        let groupIndex = 0;

        while (Object.keys(groups).some(key => groups[key].length > 0)) {
            const currentGroup = groupKeys[groupIndex % groupKeys.length];

            if (groups[currentGroup] && groups[currentGroup].length > 0) {
                interleaved.push(groups[currentGroup].shift());
            }

            groupIndex++;
        }

        return interleaved;
    }

    /**
     * Apply spacing rules to avoid similar items too close together
     */
    applySpacing(items) {
        if (items.length <= 3) return items;

        const spaced = [];
        const recentConcepts = [];

        items.forEach(item => {
            const concept = item.concept || 'general';

            // Check if we need to space this item
            const recentIndex = recentConcepts.indexOf(concept);

            if (recentIndex !== -1 && recentIndex < this.spacingRules['same-concept']) {
                // Too close, move to later position
                const insertPosition = Math.min(
                    spaced.length,
                    recentIndex + this.spacingRules['same-concept']
                );
                spaced.splice(insertPosition, 0, item);
            } else {
                spaced.push(item);
            }

            // Update recent concepts
            recentConcepts.unshift(concept);
            if (recentConcepts.length > 5) {
                recentConcepts.pop();
            }
        });

        return spaced;
    }

    /**
     * Add contextual variation to items
     */
    addContextualVariation(items) {
        return items.map(item => {
            // Clone item to avoid mutation
            const variedItem = { ...item };

            // Add context variation if available
            const concept = item.concept || item.category;
            const variations = this.getContextualVariations(concept);

            if (variations && variations.length > 0) {
                const variation = variations[Math.floor(Math.random() * variations.length)];
                variedItem.context = variation;
            }

            return variedItem;
        });
    }

    /**
     * Get contextual variations for a concept
     */
    getContextualVariations(concept) {
        // Define contextual variations for common concepts
        const defaultVariations = {
            'ser-conjugation': [
                { setting: 'introduction', example: 'Yo soy María' },
                { setting: 'description', example: 'Ella es alta' },
                { setting: 'profession', example: 'Él es profesor' },
                { setting: 'nationality', example: 'Nosotros somos alemanes' }
            ],
            'estar-conjugation': [
                { setting: 'location', example: 'Estoy en casa' },
                { setting: 'emotion', example: 'Estás feliz' },
                { setting: 'condition', example: 'Está cansado' },
                { setting: 'progressive', example: 'Estamos estudiando' }
            ],
            'tener': [
                { setting: 'possession', example: 'Tengo un gato' },
                { setting: 'age', example: 'Tengo 25 años' },
                { setting: 'idiom', example: 'Tengo hambre' },
                { setting: 'obligation', example: 'Tengo que estudiar' }
            ]
        };

        return this.contextualVariations[concept] || defaultVariations[concept] || [];
    }

    /**
     * Register custom contextual variations
     */
    registerContextualVariations(concept, variations) {
        this.contextualVariations[concept] = variations;
    }

    /**
     * Analyze practice session effectiveness
     */
    analyzeSessionEffectiveness(sessionResults) {
        const concepts = {};

        sessionResults.forEach(result => {
            const concept = result.exercise.concept || 'general';

            if (!concepts[concept]) {
                concepts[concept] = {
                    attempts: 0,
                    correct: 0,
                    avgResponseTime: 0,
                    contexts: []
                };
            }

            concepts[concept].attempts++;
            if (result.isCorrect) concepts[concept].correct++;
            if (result.responseTime) {
                concepts[concept].avgResponseTime =
                    (concepts[concept].avgResponseTime * (concepts[concept].attempts - 1) + result.responseTime) /
                    concepts[concept].attempts;
            }
            if (result.exercise.context) {
                concepts[concept].contexts.push(result.exercise.context);
            }
        });

        // Calculate discrimination (how well user can distinguish between similar concepts)
        const discrimination = this.calculateDiscrimination(sessionResults);

        return {
            conceptPerformance: concepts,
            discrimination: discrimination,
            recommendation: this.generateRecommendation(concepts, discrimination)
        };
    }

    /**
     * Calculate discrimination between similar concepts
     */
    calculateDiscrimination(sessionResults) {
        // Find pairs of similar concepts that were practiced
        const conceptPairs = this.findSimilarConceptPairs(sessionResults);

        if (conceptPairs.length === 0) return null;

        const discriminationScores = conceptPairs.map(pair => {
            const [concept1, concept2] = pair;

            const results1 = sessionResults.filter(r => r.exercise.concept === concept1);
            const results2 = sessionResults.filter(r => r.exercise.concept === concept2);

            const acc1 = results1.filter(r => r.isCorrect).length / results1.length;
            const acc2 = results2.filter(r => r.isCorrect).length / results2.length;

            // High discrimination = both concepts well understood
            // Low discrimination = confusion between concepts
            return (acc1 + acc2) / 2;
        });

        return discriminationScores.reduce((a, b) => a + b, 0) / discriminationScores.length;
    }

    /**
     * Find pairs of similar concepts in session
     */
    findSimilarConceptPairs(sessionResults) {
        const concepts = [...new Set(sessionResults.map(r => r.exercise.concept))];
        const pairs = [];

        // Check concept groups for related concepts
        Object.entries(this.conceptGroups).forEach(([group, groupConcepts]) => {
            const presentConcepts = concepts.filter(c => groupConcepts.includes(c));

            if (presentConcepts.length >= 2) {
                for (let i = 0; i < presentConcepts.length - 1; i++) {
                    for (let j = i + 1; j < presentConcepts.length; j++) {
                        pairs.push([presentConcepts[i], presentConcepts[j]]);
                    }
                }
            }
        });

        return pairs;
    }

    /**
     * Generate recommendation based on analysis
     */
    generateRecommendation(concepts, discrimination) {
        const recommendations = [];

        // Check individual concept performance
        Object.entries(concepts).forEach(([concept, stats]) => {
            const accuracy = stats.correct / stats.attempts;

            if (accuracy < 0.50) {
                recommendations.push({
                    type: 'focus',
                    concept: concept,
                    message: `Fokussiere dich mehr auf ${concept}. Genauigkeit: ${(accuracy * 100).toFixed(0)}%`
                });
            }
        });

        // Check discrimination
        if (discrimination !== null && discrimination < 0.65) {
            recommendations.push({
                type: 'discrimination',
                message: 'Du verwechselst ähnliche Konzepte. Übe Kontrastpaare!',
                suggestion: 'Versuche, die Unterschiede bewusst zu erkennen.'
            });
        }

        // Check if more interleaving needed
        const conceptCount = Object.keys(concepts).length;
        if (conceptCount < 3) {
            recommendations.push({
                type: 'variety',
                message: 'Übe mehr verschiedene Konzepte gleichzeitig für bessere Retention.',
                suggestion: 'Interleaved practice verbessert das Langzeitgedächtnis.'
            });
        }

        return recommendations;
    }

    /**
     * Shuffle array utility
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InterleavedPracticeSystem };
}
