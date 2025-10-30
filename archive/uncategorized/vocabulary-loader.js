/**
 * Vocabulary Loader
 *
 * Loads and manages vocabulary from JSON files
 * Provides search, filtering, and retrieval capabilities
 */

class VocabularyLoader {
    constructor() {
        this.vocabularyData = null;
        this.loadedPhases = new Set();
    }

    /**
     * Load vocabulary for a specific phase
     */
    async loadPhaseVocabulary(phase) {
        try {
            const response = await fetch(`../data/phase${phase}-vocabulary.json`);
            if (!response.ok) {
                throw new Error(`Failed to load vocabulary for phase ${phase}`);
            }

            const data = await response.json();
            this.vocabularyData = data;
            this.loadedPhases.add(phase);

            return data;
        } catch (error) {
            console.error('Error loading vocabulary:', error);
            return null;
        }
    }

    /**
     * Load vocabulary synchronously (for Node.js or pre-loaded data)
     */
    loadPhaseVocabularySync(phase, data) {
        this.vocabularyData = data;
        this.loadedPhases.add(phase);
        return data;
    }

    /**
     * Get all vocabulary words
     */
    getAllWords() {
        if (!this.vocabularyData || !this.vocabularyData.categories) {
            return [];
        }

        const allWords = [];
        Object.values(this.vocabularyData.categories).forEach(category => {
            if (category.words) {
                allWords.push(...category.words);
            }
        });

        return allWords;
    }

    /**
     * Get vocabulary by category
     */
    getWordsByCategory(categoryName) {
        if (!this.vocabularyData || !this.vocabularyData.categories) {
            return [];
        }

        const category = this.vocabularyData.categories[categoryName];
        return category ? category.words : [];
    }

    /**
     * Get all categories
     */
    getCategories() {
        if (!this.vocabularyData || !this.vocabularyData.categories) {
            return [];
        }

        return Object.keys(this.vocabularyData.categories);
    }

    /**
     * Get category info
     */
    getCategoryInfo(categoryName) {
        if (!this.vocabularyData || !this.vocabularyData.categories) {
            return null;
        }

        const category = this.vocabularyData.categories[categoryName];
        if (!category) {
            return null;
        }

        return {
            name: categoryName,
            description: category.description || '',
            wordCount: category.words ? category.words.length : 0,
            words: category.words || []
        };
    }

    /**
     * Get words by difficulty level
     */
    getWordsByDifficulty(difficulty) {
        const allWords = this.getAllWords();
        return allWords.filter(word => word.difficulty === difficulty);
    }

    /**
     * Get words by type (noun, verb, adjective, etc.)
     */
    getWordsByType(type) {
        const allWords = this.getAllWords();
        return allWords.filter(word => word.type === type);
    }

    /**
     * Search vocabulary (Spanish or German)
     */
    searchVocabulary(searchTerm) {
        const allWords = this.getAllWords();
        const term = searchTerm.toLowerCase().trim();

        return allWords.filter(word =>
            word.es.toLowerCase().includes(term) ||
            word.de.toLowerCase().includes(term)
        );
    }

    /**
     * Get word by ID
     */
    getWordById(wordId) {
        const allWords = this.getAllWords();
        return allWords.find(word => word.id === wordId);
    }

    /**
     * Get random words
     */
    getRandomWords(count = 10, options = {}) {
        let words = this.getAllWords();

        // Filter by options
        if (options.category) {
            words = this.getWordsByCategory(options.category);
        }

        if (options.difficulty) {
            words = words.filter(w => w.difficulty === options.difficulty);
        }

        if (options.type) {
            words = words.filter(w => w.type === options.type);
        }

        // Shuffle and return
        const shuffled = this.shuffleArray([...words]);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    /**
     * Get words for practice (excluding mastered ones if knowledge tracker provided)
     */
    getWordsForPractice(count = 10, knowledgeTracker = null, options = {}) {
        let words = this.getAllWords();

        // Filter by options
        if (options.category) {
            words = this.getWordsByCategory(options.category);
        }

        if (knowledgeTracker) {
            // Prioritize words that need practice
            words = words.map(word => {
                const knowledge = knowledgeTracker.getKnowledge('vocabulary', word.id);
                return {
                    ...word,
                    priority: knowledge ? this.calculatePriority(knowledge) : 1.0
                };
            });

            // Sort by priority (highest first)
            words.sort((a, b) => b.priority - a.priority);

            // Take top words based on priority
            return words.slice(0, count);
        } else {
            // Random selection
            return this.getRandomWords(count, options);
        }
    }

    /**
     * Calculate practice priority based on knowledge level
     */
    calculatePriority(knowledge) {
        // Higher priority = needs more practice
        const levelPriorities = {
            'new': 1.5,
            'learning': 1.3,
            'familiar': 0.8,
            'mastered': 0.3,
            'struggling': 2.0,
            'critical': 3.0
        };

        let priority = levelPriorities[knowledge.knowledgeLevel] || 1.0;

        // Adjust by accuracy
        if (knowledge.attempts > 0) {
            const accuracy = knowledge.correct / knowledge.attempts;
            if (accuracy < 0.5) {
                priority *= 1.5;
            } else if (accuracy > 0.9) {
                priority *= 0.7;
            }
        }

        // Adjust by time since last review
        if (knowledge.lastReview) {
            const daysSinceReview = (Date.now() - knowledge.lastReview) / (1000 * 60 * 60 * 24);
            if (daysSinceReview > 7) {
                priority *= 1.2; // Needs review
            }
        }

        return priority;
    }

    /**
     * Get vocabulary statistics
     */
    getStatistics() {
        if (!this.vocabularyData) {
            return null;
        }

        const allWords = this.getAllWords();

        // Count by type
        const typeCount = {};
        allWords.forEach(word => {
            typeCount[word.type] = (typeCount[word.type] || 0) + 1;
        });

        // Count by difficulty
        const difficultyCount = {};
        allWords.forEach(word => {
            difficultyCount[word.difficulty] = (difficultyCount[word.difficulty] || 0) + 1;
        });

        // Count by category
        const categoryCount = {};
        Object.entries(this.vocabularyData.categories).forEach(([name, category]) => {
            categoryCount[name] = category.words ? category.words.length : 0;
        });

        return {
            totalWords: allWords.length,
            totalCategories: Object.keys(this.vocabularyData.categories).length,
            byType: typeCount,
            byDifficulty: difficultyCount,
            byCategory: categoryCount,
            phase: this.vocabularyData.metadata?.phase || null,
            level: this.vocabularyData.metadata?.level || null
        };
    }

    /**
     * Create flashcard set from vocabulary
     */
    createFlashcardSet(wordIds = null, options = {}) {
        let words;

        if (wordIds && Array.isArray(wordIds)) {
            words = wordIds.map(id => this.getWordById(id)).filter(w => w !== undefined);
        } else {
            words = this.getRandomWords(options.count || 20, options);
        }

        return words.map(word => ({
            id: word.id,
            front: options.direction === 'de-to-es' ? word.de : word.es,
            back: options.direction === 'de-to-es' ? word.es : word.de,
            hint: word.hint || '',
            examples: word.examples || [],
            type: word.type,
            category: word.category
        }));
    }

    /**
     * Shuffle array
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
     * Get vocabulary metadata
     */
    getMetadata() {
        return this.vocabularyData?.metadata || null;
    }

    /**
     * Check if vocabulary is loaded
     */
    isLoaded() {
        return this.vocabularyData !== null;
    }

    /**
     * Get loaded phases
     */
    getLoadedPhases() {
        return Array.from(this.loadedPhases);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VocabularyLoader };
}
