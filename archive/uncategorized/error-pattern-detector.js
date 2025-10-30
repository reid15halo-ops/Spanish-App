/**
 * Error Pattern Detector
 *
 * Analyzes user errors to identify patterns and problematic areas
 * Provides targeted feedback and intervention recommendations
 */

class ErrorPatternDetector {
    constructor() {
        // Error type classifications
        this.errorTypes = {
            // Conjugation errors
            'conjugation-person': 'Falsche Person (yo/tú/él usw.)',
            'conjugation-tense': 'Falsche Zeitform',
            'conjugation-irregular': 'Unregelmäßige Form vergessen',
            'conjugation-ending': 'Falsche Endung',

            // Ser/Estar confusion
            'ser-estar-location': 'SER statt ESTAR bei Orten',
            'ser-estar-condition': 'SER statt ESTAR bei Zuständen',
            'ser-estar-identity': 'ESTAR statt SER bei Identität',

            // Tense confusion
            'preterito-imperfecto': 'Pretérito/Imperfecto verwechselt',
            'present-past': 'Gegenwart statt Vergangenheit',
            'future-present': 'Zukunft statt Gegenwart',

            // Vocabulary
            'vocabulary-unknown': 'Wort unbekannt',
            'vocabulary-confused': 'Wort verwechselt',
            'vocabulary-gender': 'Falsches Geschlecht (el/la)',

            // Prepositions
            'preposition-por-para': 'POR/PARA verwechselt',
            'preposition-missing': 'Präposition fehlt',
            'preposition-wrong': 'Falsche Präposition',

            // Sentence structure
            'word-order': 'Falsche Wortstellung',
            'missing-subject': 'Subjekt fehlt',
            'double-negative': 'Doppelte Verneinung falsch',

            // Articles
            'article-gender': 'Artikel-Geschlecht falsch',
            'article-missing': 'Artikel fehlt',

            // Subjuntivo
            'subjuntivo-missing': 'Subjuntivo fehlt (nach que)',
            'subjuntivo-wrong-form': 'Falsche Subjuntivo-Form',

            // Accents
            'accent-missing': 'Akzent fehlt',
            'accent-wrong': 'Falscher Akzent',

            // General
            'typo': 'Tippfehler',
            'general': 'Allgemeiner Fehler'
        };

        // Error patterns detected for each user
        this.detectedPatterns = {};
    }

    /**
     * Detect error type from user answer
     */
    detectErrorType(userAnswer, correctAnswer, context = {}) {
        const errors = [];

        // Normalize answers for comparison
        const userNorm = this.normalize(userAnswer);
        const correctNorm = this.normalize(correctAnswer);

        // Check for typos (Levenshtein distance)
        if (this.isLikelyTypo(userNorm, correctNorm)) {
            errors.push({ type: 'typo', confidence: 0.8 });
        }

        // Detect conjugation errors
        if (context.type === 'verb-conjugation') {
            const conjugationError = this.detectConjugationError(userAnswer, correctAnswer, context);
            if (conjugationError) {
                errors.push(conjugationError);
            }
        }

        // Detect ser/estar confusion
        if (this.containsSerEstar(userAnswer) || this.containsSerEstar(correctAnswer)) {
            const serEstarError = this.detectSerEstarError(userAnswer, correctAnswer, context);
            if (serEstarError) {
                errors.push(serEstarError);
            }
        }

        // Detect tense confusion
        if (context.type === 'tense-selection') {
            const tenseError = this.detectTenseError(userAnswer, correctAnswer, context);
            if (tenseError) {
                errors.push(tenseError);
            }
        }

        // Detect preposition errors
        const prepositionError = this.detectPrepositionError(userAnswer, correctAnswer);
        if (prepositionError) {
            errors.push(prepositionError);
        }

        // Detect accent errors
        const accentError = this.detectAccentError(userAnswer, correctAnswer);
        if (accentError) {
            errors.push(accentError);
        }

        // If no specific error detected, mark as general
        if (errors.length === 0) {
            errors.push({ type: 'general', confidence: 0.5 });
        }

        return errors;
    }

    /**
     * Detect conjugation-specific errors
     */
    detectConjugationError(userAnswer, correctAnswer, context) {
        const user = userAnswer.toLowerCase();
        const correct = correctAnswer.toLowerCase();

        // Check for person confusion
        if (context.person && context.expectedForm) {
            const personEndings = {
                'yo': ['o', 'é', 'í', 'ía'],
                'tú': ['as', 'es', 'aste', 'iste', 'ías'],
                'él': ['a', 'e', 'ó', 'ió', 'ía'],
                'nosotros': ['amos', 'emos', 'imos', 'ábamos', 'íamos'],
                'vosotros': ['áis', 'éis', 'ís', 'abais', 'íais'],
                'ellos': ['an', 'en', 'aron', 'ieron', 'ían']
            };

            // Check if wrong person ending
            const correctPerson = context.person;
            const wrongPersons = Object.keys(personEndings).filter(p => p !== correctPerson);

            for (const wrongPerson of wrongPersons) {
                const endings = personEndings[wrongPerson];
                if (endings.some(ending => user.endsWith(ending))) {
                    return {
                        type: 'conjugation-person',
                        confidence: 0.9,
                        details: {
                            expectedPerson: correctPerson,
                            detectedPerson: wrongPerson
                        }
                    };
                }
            }
        }

        // Check for irregular verb mistakes
        if (context.verb && this.isIrregularVerb(context.verb)) {
            return {
                type: 'conjugation-irregular',
                confidence: 0.7,
                details: {
                    verb: context.verb,
                    expectedForm: correct
                }
            };
        }

        // Check for wrong ending
        if (user.length > 2 && correct.length > 2) {
            const userEnding = user.slice(-2);
            const correctEnding = correct.slice(-2);

            if (userEnding !== correctEnding) {
                return {
                    type: 'conjugation-ending',
                    confidence: 0.8,
                    details: {
                        userEnding,
                        correctEnding
                    }
                };
            }
        }

        return null;
    }

    /**
     * Detect ser/estar confusion
     */
    detectSerEstarError(userAnswer, correctAnswer, context) {
        const user = userAnswer.toLowerCase();
        const correct = correctAnswer.toLowerCase();

        const serForms = ['soy', 'eres', 'es', 'somos', 'sois', 'son', 'era', 'eras', 'éramos', 'erais', 'eran'];
        const estarForms = ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están', 'estaba', 'estabas', 'estábamos', 'estabais', 'estaban'];

        const userHasSer = serForms.some(form => user.includes(form));
        const userHasEstar = estarForms.some(form => user.includes(form));
        const correctHasSer = serForms.some(form => correct.includes(form));
        const correctHasEstar = estarForms.some(form => correct.includes(form));

        // User used SER, should be ESTAR
        if (userHasSer && correctHasEstar) {
            // Check context
            if (context.isLocation || user.includes(' en ')) {
                return {
                    type: 'ser-estar-location',
                    confidence: 0.95,
                    details: {
                        rule: 'Bei Ortsangaben verwendet man ESTAR, nicht SER'
                    }
                };
            } else if (context.isCondition) {
                return {
                    type: 'ser-estar-condition',
                    confidence: 0.9,
                    details: {
                        rule: 'Bei temporären Zuständen verwendet man ESTAR, nicht SER'
                    }
                };
            }
        }

        // User used ESTAR, should be SER
        if (userHasEstar && correctHasSer) {
            if (context.isIdentity || context.isProfession) {
                return {
                    type: 'ser-estar-identity',
                    confidence: 0.95,
                    details: {
                        rule: 'Bei Identität/Beruf verwendet man SER, nicht ESTAR'
                    }
                };
            }
        }

        return null;
    }

    /**
     * Detect tense confusion
     */
    detectTenseError(userAnswer, correctAnswer, context) {
        // Simplified tense detection based on verb endings and context
        const preteritoEndings = ['é', 'ó', 'aste', 'ó', 'amos', 'asteis', 'aron', 'ieron'];
        const imperfectoEndings = ['aba', 'ía', 'abas', 'ías', 'ábamos', 'íamos'];
        const presentEndings = ['o', 'as', 'a', 'amos', 'áis', 'an'];

        const user = userAnswer.toLowerCase();
        const correct = correctAnswer.toLowerCase();

        // Check for preterito/imperfecto confusion
        if (context.expectedTense === 'preterito' && imperfectoEndings.some(e => user.endsWith(e))) {
            return {
                type: 'preterito-imperfecto',
                confidence: 0.85,
                details: {
                    expected: 'Pretérito',
                    used: 'Imperfecto',
                    hint: 'Für abgeschlossene Handlungen nutze Pretérito'
                }
            };
        }

        if (context.expectedTense === 'imperfecto' && preteritoEndings.some(e => user.endsWith(e))) {
            return {
                type: 'preterito-imperfecto',
                confidence: 0.85,
                details: {
                    expected: 'Imperfecto',
                    used: 'Pretérito',
                    hint: 'Für Gewohnheiten und Beschreibungen nutze Imperfecto'
                }
            };
        }

        // Present instead of past
        if (context.expectedTense !== 'presente' && presentEndings.some(e => user.endsWith(e))) {
            return {
                type: 'present-past',
                confidence: 0.8,
                details: {
                    hint: 'Achte auf die Zeitform - hier ist Vergangenheit gefordert'
                }
            };
        }

        return null;
    }

    /**
     * Detect preposition errors
     */
    detectPrepositionError(userAnswer, correctAnswer) {
        const user = userAnswer.toLowerCase();
        const correct = correctAnswer.toLowerCase();

        // Check for por/para confusion
        if (user.includes('por') && correct.includes('para')) {
            return {
                type: 'preposition-por-para',
                confidence: 0.9,
                details: {
                    used: 'por',
                    expected: 'para',
                    hint: 'PARA = Zweck/Ziel, POR = Grund/Ursache'
                }
            };
        }

        if (user.includes('para') && correct.includes('por')) {
            return {
                type: 'preposition-por-para',
                confidence: 0.9,
                details: {
                    used: 'para',
                    expected: 'por',
                    hint: 'POR = Grund/Ursache, PARA = Zweck/Ziel'
                }
            };
        }

        // Check for common preposition patterns
        const prepositions = ['a', 'de', 'en', 'con', 'sin', 'sobre', 'entre'];
        for (const prep of prepositions) {
            const userHasPrep = new RegExp(`\\b${prep}\\b`).test(user);
            const correctHasPrep = new RegExp(`\\b${prep}\\b`).test(correct);

            if (userHasPrep !== correctHasPrep) {
                return {
                    type: 'preposition-wrong',
                    confidence: 0.7,
                    details: {
                        preposition: prep
                    }
                };
            }
        }

        return null;
    }

    /**
     * Detect accent errors
     */
    detectAccentError(userAnswer, correctAnswer) {
        const withoutAccents = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const userNoAccent = withoutAccents(userAnswer);
        const correctNoAccent = withoutAccents(correctAnswer);

        // If same without accents, it's an accent error
        if (userNoAccent.toLowerCase() === correctNoAccent.toLowerCase() &&
            userAnswer !== correctAnswer) {
            return {
                type: 'accent-missing',
                confidence: 1.0,
                details: {
                    correctForm: correctAnswer,
                    hint: 'Achte auf Akzente! Sie verändern oft die Bedeutung.'
                }
            };
        }

        return null;
    }

    /**
     * Check if likely a typo (Levenshtein distance)
     */
    isLikelyTypo(str1, str2) {
        const distance = this.levenshteinDistance(str1, str2);
        const maxLength = Math.max(str1.length, str2.length);

        // If distance is very small relative to length, likely a typo
        return distance <= 2 && distance < maxLength * 0.25;
    }

    /**
     * Levenshtein distance calculation
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    }

    /**
     * Normalize string for comparison
     */
    normalize(str) {
        return str.toLowerCase().trim();
    }

    /**
     * Check if contains ser/estar
     */
    containsSerEstar(str) {
        const forms = ['soy', 'eres', 'es', 'somos', 'sois', 'son', 'estoy', 'estás', 'está', 'estamos', 'están'];
        const lower = str.toLowerCase();
        return forms.some(form => lower.includes(form));
    }

    /**
     * Check if verb is irregular
     */
    isIrregularVerb(verb) {
        const irregularVerbs = [
            'ser', 'estar', 'ir', 'hacer', 'tener', 'decir', 'poder',
            'poner', 'venir', 'saber', 'dar', 'ver', 'salir', 'traer'
        ];
        return irregularVerbs.includes(verb);
    }

    /**
     * Aggregate error patterns over time
     */
    aggregatePatterns(userId, errorType, context = {}) {
        if (!this.detectedPatterns[userId]) {
            this.detectedPatterns[userId] = {};
        }

        if (!this.detectedPatterns[userId][errorType]) {
            this.detectedPatterns[userId][errorType] = {
                count: 0,
                firstOccurrence: Date.now(),
                lastOccurrence: null,
                contexts: []
            };
        }

        const pattern = this.detectedPatterns[userId][errorType];
        pattern.count++;
        pattern.lastOccurrence = Date.now();
        pattern.contexts.push({
            timestamp: Date.now(),
            ...context
        });

        // Keep only last 10 contexts
        if (pattern.contexts.length > 10) {
            pattern.contexts = pattern.contexts.slice(-10);
        }
    }

    /**
     * Get user's most frequent error patterns
     */
    getMostFrequentErrors(userId, limit = 5) {
        if (!this.detectedPatterns[userId]) {
            return [];
        }

        return Object.entries(this.detectedPatterns[userId])
            .map(([type, data]) => ({
                errorType: type,
                description: this.errorTypes[type] || type,
                count: data.count,
                lastOccurrence: data.lastOccurrence
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }

    /**
     * Check if user has persistent pattern with an error type
     */
    hasPersistentPattern(userId, errorType, threshold = 3) {
        if (!this.detectedPatterns[userId] || !this.detectedPatterns[userId][errorType]) {
            return false;
        }

        return this.detectedPatterns[userId][errorType].count >= threshold;
    }

    /**
     * Save patterns to localStorage
     */
    savePatterns() {
        localStorage.setItem('errorPatterns_detected', JSON.stringify(this.detectedPatterns));
    }

    /**
     * Load patterns from localStorage
     */
    loadPatterns() {
        const saved = localStorage.getItem('errorPatterns_detected');
        if (saved) {
            this.detectedPatterns = JSON.parse(saved);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ErrorPatternDetector };
}
