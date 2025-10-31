/**
 * Spanish Text Normalization Utilities
 *
 * Provides functions for normalizing Spanish text for comparison and validation.
 * Used by answer validation, search, and other text processing modules.
 */

import type { NormalizationOptions } from '../types/core';

/**
 * Default normalization options
 */
const DEFAULT_OPTIONS: Required<NormalizationOptions> = {
  removeAccents: true,
  removePunctuation: true,
  toLowerCase: true,
  normalizeWhitespace: true
};

/**
 * Normalize Spanish text according to specified options
 *
 * @param text - The Spanish text to normalize
 * @param options - Normalization options
 * @returns Normalized text
 *
 * @example
 * ```typescript
 * normalizeSpanish('¡Hola, María!') // 'hola maria'
 * normalizeSpanish('¡Hola, María!', { removeAccents: false }) // 'hola maría'
 * ```
 */
export function normalizeSpanish(
  text: string,
  options: NormalizationOptions = {}
): string {
  // Merge with defaults
  const opts: Required<NormalizationOptions> = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  let result = text;

  // 1. Convert to lowercase (usually first for consistency)
  if (opts.toLowerCase) {
    result = result.toLowerCase();
  }

  // 2. Remove accents (á → a, é → e, etc.)
  if (opts.removeAccents) {
    result = result
      .replace(/[áàâäã]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i')
      .replace(/[óòôöõ]/g, 'o')
      .replace(/[úùûü]/g, 'u')
      .replace(/ñ/g, 'n');
  }

  // 3. Remove punctuation
  if (opts.removePunctuation) {
    result = result.replace(/[¿¡.,;:!?'"()¬\-–—]/g, '');
  }

  // 4. Normalize whitespace (collapse multiple spaces, trim)
  if (opts.normalizeWhitespace) {
    result = result.replace(/\s+/g, ' ').trim();
  }

  return result;
}

/**
 * Check if two Spanish texts are equivalent (ignoring accents, punctuation, etc.)
 *
 * @param text1 - First text
 * @param text2 - Second text
 * @param options - Normalization options
 * @returns True if texts are equivalent
 *
 * @example
 * ```typescript
 * areTextsEquivalent('¡Hola!', 'hola') // true
 * areTextsEquivalent('María', 'maria') // true
 * areTextsEquivalent('Soy médico', 'Soy doctor') // false
 * ```
 */
export function areTextsEquivalent(
  text1: string,
  text2: string,
  options: NormalizationOptions = {}
): boolean {
  const normalized1 = normalizeSpanish(text1, options);
  const normalized2 = normalizeSpanish(text2, options);
  return normalized1 === normalized2;
}

/**
 * Normalize for strict comparison (all normalization enabled)
 *
 * @param text - Text to normalize
 * @returns Normalized text
 */
export function normalizeStrict(text: string): string {
  return normalizeSpanish(text, DEFAULT_OPTIONS);
}

/**
 * Normalize for lenient comparison (keep accents, remove rest)
 *
 * @param text - Text to normalize
 * @returns Normalized text
 */
export function normalizeLenient(text: string): string {
  return normalizeSpanish(text, {
    removeAccents: false,
    removePunctuation: true,
    toLowerCase: true,
    normalizeWhitespace: true
  });
}

/**
 * Extract words from Spanish text (removes punctuation, splits on whitespace)
 *
 * @param text - Text to extract words from
 * @returns Array of words
 *
 * @example
 * ```typescript
 * extractWords('¡Hola, cómo estás?') // ['hola', 'como', 'estas']
 * ```
 */
export function extractWords(text: string): string[] {
  const normalized = normalizeSpanish(text);
  return normalized.split(/\s+/).filter(word => word.length > 0);
}

/**
 * Calculate similarity between two Spanish texts (0-1 score)
 * Uses Levenshtein distance algorithm
 *
 * @param text1 - First text
 * @param text2 - Second text
 * @returns Similarity score (0 = completely different, 1 = identical)
 *
 * @example
 * ```typescript
 * calculateSimilarity('hola', 'hola') // 1.0
 * calculateSimilarity('hola', 'hole') // 0.75
 * calculateSimilarity('hola', 'adios') // 0.0
 * ```
 */
export function calculateSimilarity(text1: string, text2: string): number {
  const normalized1 = normalizeSpanish(text1);
  const normalized2 = normalizeSpanish(text2);

  // If texts are identical, return 1
  if (normalized1 === normalized2) {
    return 1.0;
  }

  // Calculate Levenshtein distance
  const distance = levenshteinDistance(normalized1, normalized2);
  const maxLength = Math.max(normalized1.length, normalized2.length);

  // Convert distance to similarity (0-1)
  return maxLength === 0 ? 1.0 : 1 - distance / maxLength;
}

/**
 * Calculate Levenshtein distance between two strings
 * (minimum number of single-character edits required to change one into the other)
 *
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Levenshtein distance
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;

  // Create 2D array for dynamic programming
  const matrix: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));

  // Initialize first row and column
  for (let i = 0; i <= len1; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix using dynamic programming
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // Deletion
        matrix[i][j - 1] + 1,      // Insertion
        matrix[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Check if text contains a specific word (accent-insensitive)
 *
 * @param text - Text to search in
 * @param word - Word to search for
 * @returns True if word is found
 */
export function containsWord(text: string, word: string): boolean {
  const words = extractWords(text);
  const normalizedWord = normalizeSpanish(word);
  return words.includes(normalizedWord);
}

/**
 * Count occurrences of a word in text
 *
 * @param text - Text to search in
 * @param word - Word to count
 * @returns Number of occurrences
 */
export function countWordOccurrences(text: string, word: string): number {
  const words = extractWords(text);
  const normalizedWord = normalizeSpanish(word);
  return words.filter(w => w === normalizedWord).length;
}

/**
 * Remove specific accents from text (for testing purposes)
 *
 * @param text - Text to process
 * @returns Text with accents removed
 */
export function removeAccents(text: string): string {
  return normalizeSpanish(text, {
    removeAccents: true,
    removePunctuation: false,
    toLowerCase: false,
    normalizeWhitespace: false
  });
}

/**
 * Remove punctuation from text (for testing purposes)
 *
 * @param text - Text to process
 * @returns Text with punctuation removed
 */
export function removePunctuation(text: string): string {
  return normalizeSpanish(text, {
    removeAccents: false,
    removePunctuation: true,
    toLowerCase: false,
    normalizeWhitespace: false
  });
}

// ============================================================================
// GLOBAL EXPORTS (for backward compatibility with existing JavaScript code)
// ============================================================================

// Make functions available globally if running in browser
if (typeof window !== 'undefined') {
  (window as any).normalizeSpanish = normalizeSpanish;
  (window as any).areTextsEquivalent = areTextsEquivalent;
  (window as any).normalizeStrict = normalizeStrict;
  (window as any).normalizeLenient = normalizeLenient;
  (window as any).extractWords = extractWords;
  (window as any).calculateSimilarity = calculateSimilarity;
  (window as any).containsWord = containsWord;
  (window as any).countWordOccurrences = countWordOccurrences;
  (window as any).removeAccents = removeAccents;
  (window as any).removePunctuation = removePunctuation;
}
