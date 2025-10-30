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
     * Generate next exercise(s) based on user progress and unit config
     * @param {number} count - Number of exercises to generate
     * @param {object} unitConfig - Unit-specific configuration {concepts, templateTypes, exerciseTypes, difficulty}
     */
    generateNext(count = 1, unitConfig = null) {
        const exercises = [];
        const userProfile = this.progress.getProfile();

        // Generate exercises with unit-specific config
        for (let i = 0; i < count; i++) {
            const exercise = unitConfig
                ? this.generateUnitExercise(userProfile, unitConfig)
                : this.generateSingleExercise(userProfile);

            if (exercise) {
                exercises.push(exercise);
            }
        }

        return count === 1 ? exercises[0] : exercises;
    }

    /**
     * Generate exercise with unit-specific configuration
     */
    generateUnitExercise(userProfile, unitConfig) {
        // 1. Determine difficulty (use unit difficulty as base, adjust by user level)
        const baseDifficulty = unitConfig.difficulty || 2;
        const userDifficultyAdjustment = this.calculateUserDifficultyAdjustment(userProfile);
        const difficulty = Math.max(1, Math.min(5, baseDifficulty + userDifficultyAdjustment));

        // 2. Select concept from unit concepts (prioritize weak concepts)
        const concept = this.selectConceptFromUnit(unitConfig.concepts, userProfile);

        // 3. Select template type from unit template types
        const templateType = unitConfig.templateTypes
            ? this.selectTemplateFromUnit(unitConfig.templateTypes, concept, userProfile)
            : concept;

        // 4. Select exercise type based on unit distribution
        const exerciseType = this.selectExerciseType(unitConfig.exerciseTypes);

        // 5. Generate exercise from template
        let exercise = this.templates.generateExercise(templateType, difficulty);

        if (!exercise) {
            console.warn(`⚠️ No exercise generated for template "${templateType}", trying fallback...`);

            // Try alternative template types
            const alternativeTemplates = this.getAlternativeTemplates(templateType, unitConfig.templateTypes);

            for (const altTemplate of alternativeTemplates) {
                exercise = this.templates.generateExercise(altTemplate, difficulty);
                if (exercise) {
                    console.log(`✅ Used alternative template: ${altTemplate}`);
                    break;
                }
            }

            // Final fallback
            if (!exercise) {
                console.error(`❌ No templates worked, using fallback exercise`);
                exercise = this.generateFallbackExercise(difficulty);
            }
        }

        // 6. Apply exercise type transformation if needed
        exercise = this.transformExerciseType(exercise, exerciseType);

        // 7. Add metadata
        exercise.metadata = {
            generatedAt: Date.now(),
            userDifficulty: difficulty,
            baseDifficulty: baseDifficulty,
            targetConcept: concept,
            templateType: templateType,
            exerciseType: exerciseType,
            isAdaptive: this.isWeakConcept(concept, userProfile),
            unitSpecific: true
        };

        return exercise;
    }

    /**
     * Select concept from unit concepts (prioritize weak ones)
     */
    selectConceptFromUnit(concepts, userProfile) {
        if (!concepts || concepts.length === 0) {
            return 'general';
        }

        // Identify weak concepts in this unit
        const conceptStrengths = {};
        concepts.forEach(concept => {
            conceptStrengths[concept] = this.getConceptStrength(concept, userProfile);
        });

        // Weighted selection (70% weak concepts, 30% variety)
        const useAdaptive = Math.random() < this.config.adaptiveWeight;

        if (useAdaptive) {
            // Select weakest concept
            const sortedConcepts = Object.keys(conceptStrengths).sort((a, b) =>
                conceptStrengths[a] - conceptStrengths[b]
            );
            return sortedConcepts[0];
        } else {
            // Random variety
            return concepts[Math.floor(Math.random() * concepts.length)];
        }
    }

    /**
     * Select template from unit templates
     */
    selectTemplateFromUnit(templateTypes, concept, userProfile) {
        if (!templateTypes || templateTypes.length === 0) {
            return concept;
        }

        // Filter templates that match the concept
        const matchingTemplates = templateTypes.filter(t =>
            t.includes(concept.split('-')[0]) || concept.includes(t.split('-')[0])
        );

        if (matchingTemplates.length > 0) {
            // Prefer matching templates
            return matchingTemplates[Math.floor(Math.random() * matchingTemplates.length)];
        }

        // Fallback: random from unit templates
        return templateTypes[Math.floor(Math.random() * templateTypes.length)];
    }

    /**
     * Select exercise type based on unit distribution
     */
    selectExerciseType(exerciseTypeDistribution) {
        if (!exerciseTypeDistribution) {
            return 'multiple-choice';
        }

        // Weighted random selection
        const rand = Math.random();
        let cumulative = 0;

        for (const [type, weight] of Object.entries(exerciseTypeDistribution)) {
            cumulative += weight;
            if (rand < cumulative) {
                return type;
            }
        }

        // Fallback
        return Object.keys(exerciseTypeDistribution)[0];
    }

    /**
     * Transform exercise to specific type
     */
    transformExerciseType(exercise, targetType) {
        // If exercise already is target type, return as-is
        if (exercise.type === targetType) {
            return exercise;
        }

        // Transform based on target type
        const transformed = { ...exercise };
        transformed.type = targetType;

        switch (targetType) {
            case 'fill-blank':
                // Remove options, make it fill-in-the-blank
                delete transformed.options;
                break;

            case 'multiple-choice':
                // Generate options if not present
                if (!transformed.options) {
                    transformed.options = this.generateOptionsForExercise(exercise);
                }
                break;

            case 'emoji-guess':
                // Transform to emoji guessing exercise
                transformed = this.transformToEmojiGuess(exercise);
                break;

            case 'matching':
                // Transform to matching pairs exercise
                transformed = this.transformToMatching(exercise);
                break;

            case 'sentence-building':
                // Transform to sentence building exercise
                transformed = this.transformToSentenceBuilding(exercise);
                break;

            case 'translation':
                // Translation is the base format, just set type
                transformed.type = 'translation';
                break;

            default:
                console.warn(`Unknown exercise type: ${targetType}`);
        }

        return transformed;
    }

    /**
     * Transform exercise to emoji-guess format
     */
    transformToEmojiGuess(exercise) {
        // Try to find emoji for the answer
        const answer = exercise.correctAnswer;
        const vocabItem = this.findVocabularyWithEmoji(answer);

        if (!vocabItem || !vocabItem.emoji) {
            // Can't transform - return original
            return exercise;
        }

        return {
            type: 'emoji-guess',
            emoji: vocabItem.emoji,
            question: `Was bedeutet ${vocabItem.emoji}?`,
            correctAnswer: vocabItem.es,
            germanTranslation: vocabItem.de,
            concept: exercise.concept || 'emoji-vocabulary',
            difficulty: exercise.difficulty || 1,
            hint: exercise.hint || `Tipp: ${vocabItem.de}`,
            options: this.generateOptionsForExercise({
                ...exercise,
                correctAnswer: vocabItem.es
            })
        };
    }

    /**
     * Transform exercise to matching format
     */
    transformToMatching(exercise) {
        // Generate 4 pairs to match
        const pairs = this.generateMatchingPairs(exercise);

        if (pairs.length < 4) {
            // Not enough pairs, return original
            return exercise;
        }

        return {
            type: 'matching',
            question: 'Ordne die spanischen Wörter ihren deutschen Übersetzungen zu:',
            pairs: pairs,
            concept: exercise.concept || 'vocabulary-matching',
            difficulty: exercise.difficulty || 2,
            hint: exercise.hint || 'Überlege dir die Bedeutung jedes Wortes'
        };
    }

    /**
     * Transform exercise to sentence-building format
     */
    transformToSentenceBuilding(exercise) {
        // Take the Spanish sentence and scramble the words
        const sentence = exercise.question.replace(/\{.*?\}/g, exercise.correctAnswer);
        const words = sentence.split(' ');

        if (words.length < 3) {
            // Sentence too short, return original
            return exercise;
        }

        return {
            type: 'sentence-building',
            question: `Bilde den Satz: ${exercise.germanTranslation || exercise.de}`,
            correctSentence: sentence,
            words: this.shuffleArray(words),
            concept: exercise.concept || 'sentence-construction',
            difficulty: (exercise.difficulty || 1) + 1, // Harder than base
            hint: exercise.hint || 'Achte auf die Wortstellung'
        };
    }

    /**
     * Find vocabulary item with emoji
     */
    findVocabularyWithEmoji(word) {
        const categories = ['nouns', 'adjectives'];

        for (const category of categories) {
            const subcategories = this.vocabularyDB.getCategories()[category];
            if (!subcategories) continue;

            for (const subcat of subcategories) {
                const items = this.vocabularyDB.getByCategory(category, subcat, 5);
                const found = items.find(item => item.es === word && item.emoji);
                if (found) return found;
            }
        }

        return null;
    }

    /**
     * Generate matching pairs for matching exercise
     */
    generateMatchingPairs(baseExercise) {
        const pairs = [];

        // Add the original pair
        if (baseExercise.correctAnswer && baseExercise.germanTranslation) {
            pairs.push({
                spanish: baseExercise.correctAnswer,
                german: baseExercise.germanTranslation
            });
        }

        // Add 3 more pairs from vocabulary
        const categories = ['nouns', 'adjectives'];
        const difficulty = baseExercise.difficulty || 2;

        for (const category of categories) {
            const subcats = this.vocabularyDB.getCategories()[category];
            if (!subcats) continue;

            for (const subcat of subcats) {
                const items = this.vocabularyDB.getByCategory(category, subcat, difficulty);
                for (const item of items) {
                    if (pairs.length >= 4) break;
                    if (!pairs.some(p => p.spanish === item.es)) {
                        pairs.push({
                            spanish: item.es,
                            german: item.de
                        });
                    }
                }
                if (pairs.length >= 4) break;
            }
            if (pairs.length >= 4) break;
        }

        return pairs;
    }

    /**
     * Calculate user difficulty adjustment (-1, 0, or +1)
     */
    calculateUserDifficultyAdjustment(userProfile) {
        const stats = userProfile.stats;

        if (!stats || !stats.total || stats.total < 5) {
            return 0; // Not enough data
        }

        const accuracy = stats.correct / stats.total;

        if (accuracy >= 0.85) return +1;  // Too easy, increase difficulty
        if (accuracy <= 0.55) return -1;  // Too hard, decrease difficulty
        return 0; // Just right
    }

    /**
     * Get concept strength (0-1, lower = weaker)
     */
    getConceptStrength(concept, userProfile) {
        const conceptStats = userProfile.conceptStats?.[concept];

        if (!conceptStats || !conceptStats.total || conceptStats.total < 3) {
            return 0.5; // Unknown, assume medium
        }

        return conceptStats.correct / conceptStats.total;
    }

    /**
     * Check if concept is weak for user
     */
    isWeakConcept(concept, userProfile) {
        return this.getConceptStrength(concept, userProfile) < 0.7;
    }

    /**
     * Generate multiple-choice options for an exercise
     */
    generateOptionsForExercise(exercise) {
        const correctAnswer = exercise.correctAnswer;
        const options = [correctAnswer];

        // Generate intelligent distractors based on exercise concept
        const distractors = this.generateIntelligentDistractors(exercise);
        options.push(...distractors);

        // Shuffle options
        return this.shuffleArray(options).map(opt => ({
            spanish: opt,
            german: `(${opt})`,
            value: opt
        }));
    }

    /**
     * Generate intelligent, context-aware distractors
     */
    generateIntelligentDistractors(exercise) {
        const distractors = [];
        const concept = exercise.concept;
        const correctAnswer = exercise.correctAnswer;

        // Strategy 1: Concept-specific distractors
        if (concept && concept.includes('ser-')) {
            distractors.push(...this.getSerEstarDistractors(correctAnswer, 'ser'));
        } else if (concept && concept.includes('estar-')) {
            distractors.push(...this.getSerEstarDistractors(correctAnswer, 'estar'));
        } else if (concept && concept.includes('tener-')) {
            distractors.push(...this.getTenerDistractors(correctAnswer));
        } else if (concept && concept.includes('pronoun')) {
            distractors.push(...this.getPronounDistractors(correctAnswer));
        }

        // Strategy 2: Vocabulary-based distractors (if not enough yet)
        if (distractors.length < 3 && exercise.variables) {
            distractors.push(...this.getVocabularyDistractors(exercise));
        }

        // Strategy 3: Generic fallback distractors
        if (distractors.length < 3) {
            distractors.push(...this.getGenericDistractors(correctAnswer));
        }

        // Return exactly 3 unique distractors
        const uniqueDistractors = [...new Set(distractors)]
            .filter(d => d !== correctAnswer && d !== null && d !== undefined)
            .slice(0, 3);

        // Fill up to 3 if needed
        while (uniqueDistractors.length < 3) {
            uniqueDistractors.push(`opción ${uniqueDistractors.length + 1}`);
        }

        return uniqueDistractors;
    }

    /**
     * Generate SER/ESTAR specific distractors (common mistakes)
     */
    getSerEstarDistractors(correctAnswer, verbType) {
        const distractors = [];

        // Common mistake: using the opposite verb
        const oppositeConjugations = {
            // SER → ESTAR mistakes
            'soy': ['estoy', 'es', 'eres'],
            'eres': ['estás', 'soy', 'es'],
            'es': ['está', 'soy', 'son'],
            'somos': ['estamos', 'son', 'sois'],
            'sois': ['estáis', 'somos', 'son'],
            'son': ['están', 'es', 'somos'],
            // ESTAR → SER mistakes
            'estoy': ['soy', 'está', 'estás'],
            'estás': ['eres', 'estoy', 'está'],
            'está': ['es', 'estoy', 'están'],
            'estamos': ['somos', 'están', 'estáis'],
            'estáis': ['sois', 'estamos', 'están'],
            'están': ['son', 'está', 'estamos']
        };

        if (oppositeConjugations[correctAnswer]) {
            distractors.push(...oppositeConjugations[correctAnswer]);
        }

        return distractors.slice(0, 3);
    }

    /**
     * Generate TENER specific distractors
     */
    getTenerDistractors(correctAnswer) {
        const tenerConjugations = ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen'];
        return tenerConjugations
            .filter(c => c !== correctAnswer)
            .slice(0, 3);
    }

    /**
     * Generate pronoun distractors
     */
    getPronounDistractors(correctAnswer) {
        const pronouns = ['yo', 'tú', 'él', 'ella', 'nosotros', 'vosotros', 'ellos', 'ellas', 'usted', 'ustedes'];
        return pronouns
            .filter(p => p !== correctAnswer)
            .slice(0, 3);
    }

    /**
     * Generate vocabulary-based distractors from same category
     */
    getVocabularyDistractors(exercise) {
        const distractors = [];

        // Try to get similar vocabulary from the database
        if (exercise.variables && exercise.variables.includes('adjective')) {
            const adjectives = this.vocabularyDB.getByCategory('adjectives', 'descriptions', 3);
            distractors.push(...adjectives.map(a => a.es).slice(0, 2));
        }

        if (exercise.variables && exercise.variables.includes('place')) {
            const places = this.vocabularyDB.getByCategory('nouns', 'places', 3);
            distractors.push(...places.map(p => p.es).slice(0, 2));
        }

        if (exercise.variables && exercise.variables.includes('profession')) {
            const people = this.vocabularyDB.getByCategory('nouns', 'people', 3);
            distractors.push(...people.map(p => p.es).slice(0, 2));
        }

        return distractors;
    }

    /**
     * Generic fallback distractors
     */
    getGenericDistractors(correctAnswer) {
        // Common Spanish words that could plausibly be wrong answers
        const genericOptions = [
            'sí', 'no', 'bien', 'mal', 'mucho', 'poco',
            'aquí', 'allí', 'ahora', 'después', 'siempre', 'nunca'
        ];

        return genericOptions
            .filter(opt => opt !== correctAnswer)
            .slice(0, 3);
    }

    /**
     * Get alternative templates to try if primary fails
     */
    getAlternativeTemplates(failedTemplate, unitTemplates) {
        const alternatives = [];

        // Try other templates from the same unit
        if (unitTemplates && Array.isArray(unitTemplates)) {
            alternatives.push(...unitTemplates.filter(t => t !== failedTemplate));
        }

        // Add common fallback templates
        const commonFallbacks = ['ser-identity', 'estar-location', 'tener-possession'];
        commonFallbacks.forEach(t => {
            if (!alternatives.includes(t) && t !== failedTemplate) {
                alternatives.push(t);
            }
        });

        return alternatives;
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
