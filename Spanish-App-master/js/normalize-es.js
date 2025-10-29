/**
 * Spanish Text Normalization Utilities
 * Handles accent normalization for input matching while preserving Spanish diacritics
 */

class SpanishNormalizer {
    constructor() {
        // Spanish diacritics mapping for flexible input matching
        this.accentMap = {
            'á': 'a', 'à': 'a', 'ä': 'a', 'â': 'a',
            'é': 'e', 'è': 'e', 'ë': 'e', 'ê': 'e',
            'í': 'i', 'ì': 'i', 'ï': 'i', 'î': 'i',
            'ó': 'o', 'ò': 'o', 'ö': 'o', 'ô': 'o',
            'ú': 'u', 'ù': 'u', 'ü': 'u', 'û': 'u',
            'ñ': 'n',
            'Á': 'A', 'À': 'A', 'Ä': 'A', 'Â': 'A',
            'É': 'E', 'È': 'E', 'Ë': 'E', 'Ê': 'E',
            'Í': 'I', 'Ì': 'I', 'Ï': 'I', 'Î': 'I',
            'Ó': 'O', 'Ò': 'O', 'Ö': 'O', 'Ô': 'O',
            'Ú': 'U', 'Ù': 'U', 'Ü': 'U', 'Û': 'U',
            'Ñ': 'N'
        };

        // Common Spanish spelling variations
        this.spellingVariations = {
            'qu': 'k', // que -> ke (phonetic)
            'ck': 'k',  // check -> chek
            'ph': 'f',  // phone -> fone
        };

        // Patterns for common input errors
        this.commonErrors = [
            { pattern: /bv/g, replacement: 'b' },    // b/v confusion
            { pattern: /vb/g, replacement: 'b' },
            { pattern: /ll/g, replacement: 'y' },    // ll/y confusion in some regions
            { pattern: /y([aeiou])/g, replacement: 'll$1' },
            { pattern: /j/g, replacement: 'h' },     // j/h confusion
            { pattern: /h/g, replacement: 'j' },
            { pattern: /s$/g, replacement: '' },     // Final -s dropping
            { pattern: /z/g, replacement: 's' },     // z/s seseo
            { pattern: /c([ei])/g, replacement: 's$1' } // c/s before e,i
        ];
    }

    /**
     * Normalize Spanish text for exact matching (preserves all Spanish features)
     * @param {string} text - Input text
     * @returns {string} Normalized text
     */
    normalizeExact(text) {
        if (!text || typeof text !== 'string') return '';
        
        return text
            .trim()
            .replace(/\s+/g, ' ') // Normalize whitespace
            .toLowerCase();
    }

    /**
     * Normalize Spanish text for flexible matching (removes accents but preserves ñ)
     * @param {string} text - Input text  
     * @returns {string} Normalized text
     */
    normalizeFlexible(text) {
        if (!text || typeof text !== 'string') return '';
        
        let normalized = text.toLowerCase().trim();
        
        // Remove accents but keep ñ
        normalized = normalized.replace(/[áàäâ]/g, 'a')
                              .replace(/[éèëê]/g, 'e')
                              .replace(/[íìïî]/g, 'i')
                              .replace(/[óòöô]/g, 'o')
                              .replace(/[úùüû]/g, 'u');
        
        // Normalize whitespace
        normalized = normalized.replace(/\s+/g, ' ');
        
        return normalized;
    }

    /**
     * Aggressive normalization for very flexible matching
     * @param {string} text - Input text
     * @returns {string} Heavily normalized text
     */
    normalizeAggressive(text) {
        if (!text || typeof text !== 'string') return '';
        
        let normalized = this.normalizeFlexible(text);
        
        // Apply common error patterns
        for (const error of this.commonErrors) {
            normalized = normalized.replace(error.pattern, error.replacement);
        }
        
        // Remove punctuation and special characters
        normalized = normalized.replace(/[^\w\s]/g, '');
        
        // Normalize whitespace again
        normalized = normalized.replace(/\s+/g, ' ').trim();
        
        return normalized;
    }

    /**
     * Check if two Spanish texts match with different normalization levels
     * @param {string} text1 - First text
     * @param {string} text2 - Second text
     * @returns {Object} Match result with confidence level
     */
    checkMatch(text1, text2) {
        const exact1 = this.normalizeExact(text1);
        const exact2 = this.normalizeExact(text2);
        
        // Exact match
        if (exact1 === exact2) {
            return {
                matches: true,
                confidence: 1.0,
                level: 'exact',
                message: 'Perfecto!'
            };
        }
        
        const flexible1 = this.normalizeFlexible(text1);
        const flexible2 = this.normalizeFlexible(text2);
        
        // Flexible match (missing accents)
        if (flexible1 === flexible2) {
            return {
                matches: true,
                confidence: 0.9,
                level: 'flexible',
                message: 'Correcto, pero faltan acentos'
            };
        }
        
        const aggressive1 = this.normalizeAggressive(text1);
        const aggressive2 = this.normalizeAggressive(text2);
        
        // Aggressive match (spelling errors)
        if (aggressive1 === aggressive2) {
            return {
                matches: true,
                confidence: 0.7,
                level: 'aggressive',
                message: 'Casi correcto, revisa la ortografia'
            };
        }
        
        // Check similarity with Levenshtein distance
        const similarity = this.calculateSimilarity(flexible1, flexible2);
        
        if (similarity >= 0.8) {
            return {
                matches: true,
                confidence: similarity * 0.6,
                level: 'similar',
                message: 'Parecido, pero no exacto'
            };
        }
        
        return {
            matches: false,
            confidence: similarity,
            level: 'none',
            message: 'Incorrecto'
        };
    }

    /**
     * Calculate text similarity using Levenshtein distance
     * @param {string} str1 - First string
     * @param {string} str2 - Second string
     * @returns {number} Similarity score (0-1)
     */
    calculateSimilarity(str1, str2) {
        const distance = this.levenshteinDistance(str1, str2);
        const maxLength = Math.max(str1.length, str2.length);
        
        if (maxLength === 0) return 1;
        
        return 1 - (distance / maxLength);
    }

    /**
     * Levenshtein distance algorithm
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];
        const len1 = str1.length;
        const len2 = str2.length;

        for (let i = 0; i <= len2; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= len1; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= len2; i++) {
            for (let j = 1; j <= len1; j++) {
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

        return matrix[len2][len1];
    }

    /**
     * Suggest corrections for Spanish text
     * @param {string} input - User input
     * @param {Array} candidates - Array of possible correct answers
     * @returns {Array} Sorted suggestions with confidence scores
     */
    suggestCorrections(input, candidates) {
        const suggestions = [];
        
        for (const candidate of candidates) {
            const match = this.checkMatch(input, candidate);
            
            if (match.confidence > 0.3) {
                suggestions.push({
                    text: candidate,
                    confidence: match.confidence,
                    level: match.level,
                    message: match.message
                });
            }
        }
        
        return suggestions.sort((a, b) => b.confidence - a.confidence);
    }

    /**
     * Validate Spanish text input for conjugation exercises
     * @param {string} userInput - User's answer
     * @param {string} correctAnswer - Expected answer
     * @param {Object} options - Validation options
     * @returns {Object} Validation result
     */
    validateSpanishInput(userInput, correctAnswer, options = {}) {
        const {
            strictAccents = false,
            allowTypos = true,
            minConfidence = 0.7
        } = options;
        
        const match = this.checkMatch(userInput, correctAnswer);
        
        // Apply options
        if (strictAccents && match.level !== 'exact') {
            return {
                correct: false,
                score: 0,
                feedback: 'Se requieren acentos exactos',
                suggestion: correctAnswer
            };
        }
        
        if (!allowTypos && match.level === 'aggressive') {
            return {
                correct: false,
                score: 0,
                feedback: 'Revisa la ortografia',
                suggestion: correctAnswer
            };
        }
        
        if (match.confidence < minConfidence) {
            return {
                correct: false,
                score: 0,
                feedback: match.message,
                suggestion: correctAnswer
            };
        }
        
        return {
            correct: match.matches,
            score: match.confidence,
            feedback: match.message,
            level: match.level,
            suggestion: match.matches ? null : correctAnswer
        };
    }

    /**
     * Extract potential Spanish words from mixed text
     * @param {string} text - Mixed text
     * @returns {Array} Array of Spanish word candidates
     */
    extractSpanishWords(text) {
        if (!text) return [];
        
        // Basic Spanish word pattern (letters + Spanish diacritics)
        const spanishWordPattern = /[a-zA-ZáéíóúñÁÉÍÓÚÑ]+/g;
        const words = text.match(spanishWordPattern) || [];
        
        return words.filter(word => {
            // Filter out very short words and obvious non-Spanish
            if (word.length < 2) return false;
            
            // Spanish words often end in vowels or specific consonants
            const lastChar = word.toLowerCase().slice(-1);
            const spanishEndings = ['a', 'e', 'i', 'o', 'u', 'n', 's', 'r', 'l', 'z'];
            
            return spanishEndings.includes(lastChar);
        });
    }

    /**
     * Convert text to phonetic representation for pronunciation matching
     * @param {string} text - Spanish text
     * @returns {string} Phonetic representation
     */
    toPhonetic(text) {
        if (!text) return '';
        
        let phonetic = this.normalizeFlexible(text);
        
        // Spanish phonetic rules
        phonetic = phonetic
            .replace(/ch/g, 'Ç')      // ch sound
            .replace(/ll/g, 'Ÿ')      // ll sound  
            .replace(/rr/g, 'R')      // rr sound
            .replace(/qu([ei])/g, 'k$1')  // qu before e,i
            .replace(/gu([ei])/g, 'g$1')  // gu before e,i
            .replace(/c([ei])/g, '?$1')   // c before e,i (Spain)
            .replace(/z/g, '?')       // z sound (Spain)
            .replace(/j/g, 'x')       // j sound
            .replace(/g([ei])/g, 'x$1')   // g before e,i
            .replace(/h/g, '')        // silent h
            .replace(/v/g, 'b')       // v = b in Spanish
            .replace(/y([aeiou])/g, 'Ÿ$1'); // y at start of syllable
        
        return phonetic;
    }

    /**
     * Get statistics about text complexity
     * @param {string} text - Spanish text
     * @returns {Object} Text statistics
     */
    getTextStats(text) {
        if (!text) return { error: 'No text provided' };
        
        const words = this.extractSpanishWords(text);
        const chars = text.length;
        const accents = (text.match(/[áéíóúñÁÉÍÓÚÑ]/g) || []).length;
        
        return {
            originalLength: chars,
            wordCount: words.length,
            accentCount: accents,
            averageWordLength: words.length > 0 ? words.reduce((sum, word) => sum + word.length, 0) / words.length : 0,
            hasAccents: accents > 0,
            complexity: this.assessComplexity(text),
            extractedWords: words
        };
    }

    /**
     * Assess text complexity for Spanish learners
     */
    assessComplexity(text) {
        const stats = {
            simple: 0,
            medium: 0,
            complex: 0
        };
        
        // Check for complex features
        if (text.includes('rr') || text.includes('ll')) stats.medium++;
        if (text.includes('ñ')) stats.medium++;
        if (/[áéíóú]/.test(text)) stats.medium++;
        if (text.includes('ch') || text.includes('qu')) stats.medium++;
        if (text.length > 10) stats.medium++;
        if (/[xyz]/.test(text)) stats.complex++;
        if (text.split(' ').length > 3) stats.complex++;
        
        const total = stats.simple + stats.medium + stats.complex;
        
        if (stats.complex > stats.medium) return 'complex';
        if (stats.medium > 0) return 'medium';
        return 'simple';
    }
}

// Create global instance
const spanishNormalizer = new SpanishNormalizer();

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SpanishNormalizer, spanishNormalizer };
} else {
    window.SpanishNormalizer = SpanishNormalizer;
    window.spanishNormalizer = spanishNormalizer;
    
    // Global convenience functions  
    window.normalizeSpanish = (text, level = 'flexible') => {
        switch (level) {
            case 'exact': return spanishNormalizer.normalizeExact(text);
            case 'flexible': return spanishNormalizer.normalizeFlexible(text);
            case 'aggressive': return spanishNormalizer.normalizeAggressive(text);
            default: return spanishNormalizer.normalizeFlexible(text);
        }
    };
    
    window.validateSpanishAnswer = (userInput, correctAnswer, options) => {
        return spanishNormalizer.validateSpanishInput(userInput, correctAnswer, options);
    };
}