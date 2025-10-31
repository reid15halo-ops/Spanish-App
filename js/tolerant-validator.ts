/**
 * @fileoverview Tolerant Answer Validator
 *
 * Provides two-stage validation:
 * 1. Core validation (words, grammar, structure) - determines correct/incorrect
 * 2. Style feedback (accents, punctuation) - informative, non-blocking
 *
 * This allows learners to progress without being blocked by accent perfection,
 * while still learning proper Spanish orthography.
 */

import type {
  Exercise,
  ValidationResult,
  StyleImprovement,
  ValidationFeedback
} from '../types/core.js';

// ============================================================================
// Type Definitions
// ============================================================================

interface CoreError {
  type: 'word_count' | 'word_error';
  message: string;
  severity: 'error' | 'warning';
  position?: number;
  userWord?: string;
  correctWord?: string;
}

// ============================================================================
// Tolerant Answer Validator Class
// ============================================================================

class TolerantAnswerValidator {
  /**
   * Validate user answer with tolerance for accents and punctuation
   */
  validateAnswer(
    userAnswer: string,
    correctAnswer: string,
    exercise?: Exercise
  ): ValidationResult {
    const result: ValidationResult = {
      isCorrect: false,          // Core validation (words + grammar)
      isAcceptable: false,        // Tolerant validation
      coreErrors: [],             // Serious errors (blocking)
      styleImprovements: [],      // Improvement suggestions (non-blocking)
      feedback: {
        primary: '',            // Main feedback (correct/incorrect)
        secondary: '',          // Style feedback (accents/punctuation)
        severity: 'info'        // 'error', 'warning', 'info'
      },
      correctAnswer: correctAnswer
    };

    // Handle empty answers
    if (!userAnswer || userAnswer.trim() === '') {
      result.feedback.primary = 'Bitte gib eine Antwort ein.';
      result.feedback.severity = 'error';
      return result;
    }

    // 1. Normalize both answers for core comparison
    const normalizedUser = this.normalizeForCore(userAnswer);
    const normalizedCorrect = this.normalizeForCore(correctAnswer);

    // 2. Core validation (decisive for progression)
    result.isCorrect = this.validateCore(normalizedUser, normalizedCorrect);

    // 3. If core is correct → check style aspects
    if (result.isCorrect) {
      result.isAcceptable = true;
      result.styleImprovements = this.findStyleImprovements(userAnswer, correctAnswer);
      result.feedback = this.generatePositiveFeedback(result.styleImprovements);
    } else {
      // 4. If core is wrong → detailed error analysis
      const errors = this.analyzeCoreErrors(normalizedUser, normalizedCorrect, userAnswer, correctAnswer);
      result.coreErrors = errors.map(e => e.message);
      result.feedback = this.generateErrorFeedback(errors);
    }

    return result;
  }

  /**
   * Normalize text for core comparison (remove accents, punctuation)
   */
  private normalizeForCore(text: string): string {
    if (!text) return '';

    return text
      .toLowerCase()
      .trim()
      // Remove accents for core comparison
      .replace(/[áàâäãå]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i')
      .replace(/[óòôöõø]/g, 'o')
      .replace(/[úùûü]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/ç/g, 'c')
      // Remove punctuation for core comparison
      .replace(/[¿¡.,;:!?'"()\-–—]/g, '')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Core validation - checks words, grammar, structure
   */
  private validateCore(userNormalized: string, correctNormalized: string): boolean {
    // Exact match
    if (userNormalized === correctNormalized) {
      return true;
    }

    // Word-by-word comparison (for word order tolerance)
    const userWords = userNormalized.split(' ').filter(w => w.length > 0);
    const correctWords = correctNormalized.split(' ').filter(w => w.length > 0);

    // Must have same word count
    if (userWords.length !== correctWords.length) {
      return false;
    }

    // 90% of words must be correct (allows for minor typos)
    const correctWordCount = userWords.filter((word, index) =>
      this.isWordSimilar(word, correctWords[index])
    ).length;

    return (correctWordCount / correctWords.length) >= 0.9;
  }

  /**
   * Check if two words are similar (handles typos)
   */
  private isWordSimilar(word1: string, word2: string): boolean {
    // Exact match
    if (word1 === word2) return true;

    // Very short words must match exactly
    if (word1.length <= 2 || word2.length <= 2) {
      return word1 === word2;
    }

    // For longer words, allow small Levenshtein distance
    const maxDistance = Math.floor(Math.max(word1.length, word2.length) * 0.2);
    return this.levenshteinDistance(word1, word2) <= maxDistance;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix: number[][] = [];

    // Initialize matrix
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        if (str1.charAt(i - 1) === str2.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    return matrix[len1][len2];
  }

  /**
   * Find style improvements (accents, punctuation, capitalization)
   */
  private findStyleImprovements(userAnswer: string, correctAnswer: string): StyleImprovement[] {
    const improvements: StyleImprovement[] = [];

    // 1. Accent improvements
    const accentImprovements = this.findAccentDifferences(userAnswer, correctAnswer);
    improvements.push(...accentImprovements);

    // 2. Punctuation improvements
    const punctuationImprovements = this.findPunctuationDifferences(userAnswer, correctAnswer);
    improvements.push(...punctuationImprovements);

    // 3. Capitalization improvements
    const capitalizationImprovements = this.findCapitalizationDifferences(userAnswer, correctAnswer);
    improvements.push(...capitalizationImprovements);

    return improvements;
  }

  /**
   * Find words with accent differences
   */
  private findAccentDifferences(userAnswer: string, correctAnswer: string): StyleImprovement[] {
    const improvements: StyleImprovement[] = [];

    // Split into words
    const userWords = userAnswer.toLowerCase().split(/\s+/);
    const correctWords = correctAnswer.toLowerCase().split(/\s+/);

    userWords.forEach((userWord, index) => {
      if (index < correctWords.length) {
        const correctWord = correctWords[index];

        // Normalize both to check if they're the same word
        const userNormalized = this.normalizeForCore(userWord);
        const correctNormalized = this.normalizeForCore(correctWord);

        // Same word but different accents
        if (userNormalized === correctNormalized && userWord !== correctWord) {
          improvements.push({
            type: 'accent',
            userVersion: userWord,
            correctVersion: correctWord,
            explanation: `"${correctWord}" schreibt man mit Akzent`,
            severity: 'info'
          });
        }
      }
    });

    return improvements;
  }

  /**
   * Find punctuation differences
   */
  private findPunctuationDifferences(userAnswer: string, correctAnswer: string): StyleImprovement[] {
    const improvements: StyleImprovement[] = [];

    // Check for missing opening question/exclamation marks
    if (correctAnswer.includes('¿') && !userAnswer.includes('¿')) {
      improvements.push({
        type: 'punctuation',
        userVersion: userAnswer.charAt(0),
        correctVersion: '¿',
        explanation: 'Spanische Fragen beginnen mit ¿',
        severity: 'info'
      });
    }

    if (correctAnswer.includes('¡') && !userAnswer.includes('¡')) {
      improvements.push({
        type: 'punctuation',
        userVersion: userAnswer.charAt(0),
        correctVersion: '¡',
        explanation: 'Spanische Ausrufe beginnen mit ¡',
        severity: 'info'
      });
    }

    return improvements;
  }

  /**
   * Extract punctuation from text
   */
  private extractPunctuation(text: string): string {
    return (text.match(/[¿¡.,;:!?'"()\-–—]/g) || []).join('');
  }

  /**
   * Find capitalization differences
   */
  private findCapitalizationDifferences(userAnswer: string, correctAnswer: string): StyleImprovement[] {
    const improvements: StyleImprovement[] = [];

    // Check if first letter should be capitalized
    if (userAnswer.length > 0 && correctAnswer.length > 0) {
      const userFirst = userAnswer.charAt(0);
      const correctFirst = correctAnswer.charAt(0);

      if (userFirst.toLowerCase() === correctFirst.toLowerCase() &&
          userFirst !== correctFirst &&
          correctFirst === correctFirst.toUpperCase()) {
        improvements.push({
          type: 'capitalization',
          userVersion: userFirst,
          correctVersion: correctFirst,
          explanation: 'Satzanfang wird großgeschrieben',
          severity: 'info'
        });
      }
    }

    return improvements;
  }

  /**
   * Analyze core errors (word errors, grammar errors)
   */
  private analyzeCoreErrors(
    userNormalized: string,
    correctNormalized: string,
    userOriginal: string,
    correctOriginal: string
  ): CoreError[] {
    const errors: CoreError[] = [];

    const userWords = userNormalized.split(' ').filter(w => w.length > 0);
    const correctWords = correctNormalized.split(' ').filter(w => w.length > 0);

    // Word count mismatch
    if (userWords.length !== correctWords.length) {
      errors.push({
        type: 'word_count',
        message: `Du hast ${userWords.length} Wörter, richtig wären ${correctWords.length} Wörter`,
        severity: 'error'
      });
    }

    // Find incorrect words
    const maxLength = Math.max(userWords.length, correctWords.length);
    for (let i = 0; i < maxLength; i++) {
      const userWord = userWords[i] || '';
      const correctWord = correctWords[i] || '';

      if (!this.isWordSimilar(userWord, correctWord)) {
        errors.push({
          type: 'word_error',
          position: i + 1,
          userWord: userWord,
          correctWord: correctWord,
          message: `Wort ${i + 1}: "${userWord}" sollte "${correctWord}" sein`,
          severity: 'error'
        });
      }
    }

    return errors;
  }

  /**
   * Generate positive feedback for correct answers
   */
  private generatePositiveFeedback(styleImprovements: StyleImprovement[]): ValidationFeedback {
    const feedback: ValidationFeedback = {
      primary: 'Sehr gut!',
      secondary: '',
      severity: 'success'
    };

    if (styleImprovements.length === 0) {
      feedback.primary = '✅ Perfekt! Alles richtig!';
    } else if (styleImprovements.length === 1) {
      feedback.primary = '✅ Richtig! Kleine Verbesserung möglich:';
    } else {
      feedback.primary = '✅ Richtig! Ein paar kleine Verbesserungen:';
    }

    return feedback;
  }

  /**
   * Generate error feedback for incorrect answers
   */
  private generateErrorFeedback(coreErrors: CoreError[]): ValidationFeedback {
    const feedback: ValidationFeedback = {
      primary: 'Noch nicht ganz richtig.',
      secondary: '',
      severity: 'error'
    };

    if (coreErrors.length > 0) {
      const firstError = coreErrors[0];
      if (firstError.type === 'word_count') {
        feedback.secondary = firstError.message;
      } else if (firstError.type === 'word_error') {
        feedback.secondary = 'Prüfe die Wörter und die Reihenfolge.';
      }
    }

    return feedback;
  }
}

// ============================================================================
// Exports
// ============================================================================

// Export class
export { TolerantAnswerValidator };

// Export singleton instance
export const validator = new TolerantAnswerValidator();

// Default export for backward compatibility
export default TolerantAnswerValidator;

// Make available globally for backward compatibility
declare global {
  interface Window {
    TolerantAnswerValidator: typeof TolerantAnswerValidator;
  }
}

if (typeof window !== 'undefined') {
  window.TolerantAnswerValidator = TolerantAnswerValidator;
}
