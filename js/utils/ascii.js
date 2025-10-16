/**
 * ASCII Normalization Utilities
 * Converts German umlauts and ß to ASCII-only equivalents
 * IMPORTANT: Spanish diacritics (á, é, í, ó, ú, ñ) remain unchanged
 */

class AsciiNormalizer {
    constructor() {
        // German umlaut mapping to ASCII
        this.germanMapping = {
            'ä': 'ae', 'Ä': 'Ae',
            'ö': 'oe', 'Ö': 'Oe', 
            'ü': 'ue', 'Ü': 'Ue',
            'ß': 'ss'
        };
        
        // Pattern to detect remaining German umlauts/ß
        this.germanPattern = /[äöüÄÖÜß]/g;
        
        // Pattern to detect any non-ASCII characters (except allowed Spanish)
        this.allowedSpanishPattern = /[áéíóúñÁÉÍÓÚÑ]/g;
    }

    /**
     * Normalizes German text to ASCII-only
     * @param {string} text - Input text containing German umlauts/ß
     * @returns {string} ASCII-normalized text
     */
    normalizeAsciiDe(text) {
        if (!text || typeof text !== 'string') return text;
        
        let normalized = text;
        
        // Replace German umlauts and ß
        for (const [umlaut, ascii] of Object.entries(this.germanMapping)) {
            normalized = normalized.replace(new RegExp(umlaut, 'g'), ascii);
        }
        
        return normalized;
    }

    /**
     * Guards against remaining German umlauts/ß in text
     * @param {string} text - Text to check
     * @param {string} context - Context for error message
     * @throws {Error} If German umlauts/ß are found
     */
    asciiGuard(text, context = '') {
        if (!text || typeof text !== 'string') return;
        
        const violations = text.match(this.germanPattern);
        if (violations && violations.length > 0) {
            const contextMsg = context ? ` in ${context}` : '';
            throw new Error(`German umlauts/ß found${contextMsg}: ${violations.join(', ')} in "${text}"`);
        }
    }

    /**
     * Normalizes text for fuzzy matching (German only)
     * Used for input comparison
     * @param {string} text - Input text
     * @returns {string} Normalized text for comparison
     */
    normalizeForMatching(text) {
        if (!text || typeof text !== 'string') return '';
        
        return this.normalizeAsciiDe(text)
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' '); // Normalize whitespace
    }

    /**
     * Checks if text contains only ASCII characters (allows Spanish diacritics)
     * @param {string} text - Text to check
     * @returns {boolean} True if ASCII-compliant
     */
    isAsciiCompliant(text) {
        if (!text || typeof text !== 'string') return true;
        
        // Remove allowed Spanish characters temporarily
        const withoutSpanish = text.replace(this.allowedSpanishPattern, '');
        
        // Check if remaining text is ASCII
        return /^[\x00-\x7F]*$/.test(withoutSpanish);
    }

    /**
     * Scans text for German umlauts/ß violations
     * @param {string} text - Text to scan
     * @returns {Array} Array of found violations
     */
    scanForViolations(text) {
        if (!text || typeof text !== 'string') return [];
        
        const matches = text.match(this.germanPattern);
        return matches ? [...new Set(matches)] : [];
    }

    /**
     * Batch normalizes an object's German text fields
     * @param {Object} obj - Object containing text fields
     * @param {Array} germanFields - Array of field names containing German text
     * @returns {Object} Object with normalized German fields
     */
    normalizeObjectFields(obj, germanFields = ['de', 'german']) {
        const normalized = { ...obj };
        
        for (const field of germanFields) {
            if (normalized[field]) {
                normalized[field] = this.normalizeAsciiDe(normalized[field]);
            }
        }
        
        return normalized;
    }

    /**
     * Validates and reports ASCII compliance for entire dataset
     * @param {Array} items - Array of vocabulary items
     * @returns {Object} Validation report
     */
    validateDataset(items) {
        const report = {
            totalItems: items.length,
            violations: [],
            germanFieldsNormalized: 0,
            spanishFieldsUntouched: 0,
            valid: true
        };

        items.forEach((item, index) => {
            // Check German fields
            if (item.de || item.german) {
                const germanText = item.de || item.german;
                const violations = this.scanForViolations(germanText);
                
                if (violations.length > 0) {
                    report.violations.push({
                        index,
                        id: item.id,
                        field: item.de ? 'de' : 'german',
                        text: germanText,
                        violations
                    });
                    report.valid = false;
                } else {
                    report.germanFieldsNormalized++;
                }
            }

            // Count Spanish fields (should remain untouched)
            if (item.es || item.spanish) {
                report.spanishFieldsUntouched++;
            }
        });

        return report;
    }

    /**
     * Static file scanner for umlauts/ß
     * @param {string} content - File content to scan
     * @param {string} filePath - File path for reporting
     * @returns {Object} Scan result
     */
    scanFileContent(content, filePath) {
        const violations = this.scanForViolations(content);
        
        return {
            filePath,
            violations,
            violationCount: violations.length,
            clean: violations.length === 0,
            lines: violations.length > 0 ? this.findViolationLines(content, violations) : []
        };
    }

    /**
     * Finds line numbers for violations
     * @param {string} content - File content
     * @param {Array} violations - Array of violation characters
     * @returns {Array} Array of line information
     */
    findViolationLines(content, violations) {
        const lines = content.split('\n');
        const violationLines = [];

        lines.forEach((line, index) => {
            for (const violation of violations) {
                if (line.includes(violation)) {
                    violationLines.push({
                        lineNumber: index + 1,
                        line: line.trim(),
                        violation,
                        column: line.indexOf(violation) + 1
                    });
                }
            }
        });

        return violationLines;
    }
}

// Create global instance
const asciiNormalizer = new AsciiNormalizer();

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AsciiNormalizer, asciiNormalizer };
} else {
    window.AsciiNormalizer = AsciiNormalizer;
    window.asciiNormalizer = asciiNormalizer;
    
    // Global convenience functions
    window.normalizeAsciiDe = (text) => asciiNormalizer.normalizeAsciiDe(text);
    window.asciiGuard = (text, context) => asciiNormalizer.asciiGuard(text, context);
}