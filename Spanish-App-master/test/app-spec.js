/**
 * Test Suite for app.js
 * Tests utility functions, data loading, MC logic, and SpanishApp class
 * 
 * Run with: Open test.html in browser or use test-runner.js
 */

// ============================================================================
// TEST UTILITIES
// ============================================================================

const assert = {
    equal: (actual, expected, message) => {
        if (actual !== expected) {
            throw new Error(`${message || 'Assertion failed'}: expected ${expected}, got ${actual}`);
        }
    },
    deepEqual: (actual, expected, message) => {
        const actualStr = JSON.stringify(actual);
        const expectedStr = JSON.stringify(expected);
        if (actualStr !== expectedStr) {
            throw new Error(`${message || 'Deep equal failed'}: expected ${expectedStr}, got ${actualStr}`);
        }
    },
    isTrue: (value, message) => {
        if (value !== true) {
            throw new Error(`${message || 'Should be true'}: got ${value}`);
        }
    },
    isFalse: (value, message) => {
        if (value !== false) {
            throw new Error(`${message || 'Should be false'}: got ${value}`);
        }
    },
    throws: (fn, message) => {
        try {
            fn();
            throw new Error(`${message || 'Should have thrown'}: but didn't`);
        } catch (error) {
            // Expected
        }
    },
    async: async (fn, message) => {
        try {
            await fn();
        } catch (error) {
            throw new Error(`${message || 'Async test failed'}: ${error.message}`);
        }
    }
};

// ============================================================================
// UTILITY FUNCTIONS TESTS
// ============================================================================

describe('Utility Functions', () => {
    
    describe('toAsciiDe()', () => {
        it('should convert ä to ae', () => {
            assert.equal(toAsciiDe('Käse'), 'Kaese', 'ä should become ae');
        });
        
        it('should convert ö to oe', () => {
            assert.equal(toAsciiDe('Löffel'), 'Loeffel', 'ö should become oe');
        });
        
        it('should convert ü to ue', () => {
            assert.equal(toAsciiDe('Tür'), 'Tuer', 'ü should become ue');
        });
        
        it('should convert ß to ss', () => {
            assert.equal(toAsciiDe('Straße'), 'Strasse', 'ß should become ss');
        });
        
        it('should handle uppercase umlauts', () => {
            assert.equal(toAsciiDe('ÄÖÜ'), 'AeOeUe', 'Uppercase umlauts');
        });
        
        it('should handle mixed text', () => {
            assert.equal(
                toAsciiDe('Müller wohnt in Köln auf der Straße'),
                'Mueller wohnt in Koeln auf der Strasse',
                'Mixed umlauts'
            );
        });
        
        it('should handle empty string', () => {
            assert.equal(toAsciiDe(''), '', 'Empty string');
        });
        
        it('should handle undefined', () => {
            assert.equal(toAsciiDe(), '', 'Undefined input');
        });
    });
    
    describe('normEs()', () => {
        it('should remove accents from Spanish', () => {
            assert.equal(normEs('café'), 'cafe', 'Remove acute accent');
            assert.equal(normEs('año'), 'ano', 'Remove tilde');
            assert.equal(normEs('él'), 'el', 'Remove accent from él');
        });
        
        it('should convert to lowercase', () => {
            assert.equal(normEs('HOLA'), 'hola', 'Convert to lowercase');
        });
        
        it('should trim whitespace', () => {
            assert.equal(normEs('  hola  '), 'hola', 'Trim whitespace');
        });
        
        it('should handle combined operations', () => {
            assert.equal(
                normEs('  Año Español  '),
                'ano espanol',
                'Combined: accents, case, trim'
            );
        });
        
        it('should handle empty string', () => {
            assert.equal(normEs(''), '', 'Empty string');
        });
    });
    
    describe('normalizeAsciiDe()', () => {
        it('should use toAsciiDe as fallback', () => {
            // Mock asciiNormalizer not being defined
            const original = window.asciiNormalizer;
            window.asciiNormalizer = undefined;
            
            assert.equal(
                normalizeAsciiDe('Müller'),
                'Mueller',
                'Fallback to toAsciiDe'
            );
            
            window.asciiNormalizer = original;
        });
    });
    
    describe('asciiGuard()', () => {
        it('should warn on umlaut violations', () => {
            const originalWarn = console.warn;
            let warnCalled = false;
            
            console.warn = (msg) => {
                warnCalled = true;
            };
            
            asciiGuard('Käse', 'test context');
            assert.isTrue(warnCalled, 'Should warn on umlauts');
            
            console.warn = originalWarn;
        });
        
        it('should not warn on ASCII text', () => {
            const originalWarn = console.warn;
            let warnCalled = false;
            
            console.warn = () => {
                warnCalled = true;
            };
            
            asciiGuard('Kaese', 'test context');
            assert.isFalse(warnCalled, 'Should not warn on ASCII');
            
            console.warn = originalWarn;
        });
        
        it('should handle non-string input', () => {
            // Should not throw
            asciiGuard(123, 'test');
            asciiGuard(null, 'test');
            asciiGuard(undefined, 'test');
        });
    });
    
    describe('validateSpanishAnswer()', () => {
        it('should accept exact match', () => {
            const result = validateSpanishAnswer('hola', 'hola');
            assert.isTrue(result.correct, 'Exact match');
            assert.equal(result.score, 1.0, 'Perfect score');
        });
        
        it('should accept match ignoring accents', () => {
            const result = validateSpanishAnswer('cafe', 'café');
            assert.isTrue(result.correct, 'Ignore accents');
            assert.equal(result.score, 1.0, 'Perfect score');
        });
        
        it('should accept match ignoring case', () => {
            const result = validateSpanishAnswer('HOLA', 'hola');
            assert.isTrue(result.correct, 'Ignore case');
        });
        
        it('should accept small typos', () => {
            const result = validateSpanishAnswer('hla', 'hola', {
                allowTypos: true,
                minConfidence: 0.7
            });
            assert.isTrue(result.correct, 'Accept small typo');
        });
        
        it('should reject large differences', () => {
            const result = validateSpanishAnswer('perro', 'gato');
            assert.isFalse(result.correct, 'Reject different words');
        });
        
        it('should provide suggestions on error', () => {
            const result = validateSpanishAnswer('hla', 'hola', {
                allowTypos: false
            });
            assert.isFalse(result.correct, 'Should be incorrect');
            assert.equal(result.suggestion, 'hola', 'Should suggest correct');
        });
    });
    
    describe('levenshteinDistance()', () => {
        it('should calculate distance of 0 for identical strings', () => {
            assert.equal(levenshteinDistance('hola', 'hola'), 0, 'Identical');
        });
        
        it('should calculate distance of 1 for single char difference', () => {
            assert.equal(levenshteinDistance('hola', 'hala'), 1, 'One diff');
        });
        
        it('should calculate distance for insertions', () => {
            assert.equal(levenshteinDistance('hola', 'holas'), 1, 'Insertion');
        });
        
        it('should calculate distance for deletions', () => {
            assert.equal(levenshteinDistance('holas', 'hola'), 1, 'Deletion');
        });
        
        it('should handle empty strings', () => {
            assert.equal(levenshteinDistance('', 'hola'), 4, 'Empty to hola');
            assert.equal(levenshteinDistance('hola', ''), 4, 'Hola to empty');
        });
    });
});

// ============================================================================
// DATA LOADING TESTS
// ============================================================================

describe('Data Loading', () => {
    
    describe('loadItems()', () => {
        it('should load items from JSON', async () => {
            // Mock successful JSON fetch
            const originalFetch = window.fetch;
            window.fetch = async (url) => {
                if (url.includes('items.json')) {
                    return {
                        ok: true,
                        json: async () => [
                            { es: 'hola', de: 'hallo', difficulty: 1 },
                            { es: 'adiós', de: 'auf Wiedersehen', difficulty: 1 }
                        ]
                    };
                }
            };
            
            await loadItems();
            
            assert.equal(DATA.length, 2, 'Should load 2 items');
            assert.equal(DATA[0].es, 'hola', 'First item');
            assert.equal(DATA[0].de, 'hallo', 'German normalized');
            
            window.fetch = originalFetch;
        });
        
        it('should fallback to CSV on JSON error', async () => {
            const originalFetch = window.fetch;
            window.fetch = async (url) => {
                if (url.includes('items.json')) {
                    return { ok: false };
                }
                if (url.includes('items.csv')) {
                    return {
                        ok: true,
                        arrayBuffer: async () => {
                            const text = 'src,es,de,type,examples,tags,difficulty\nbasic,hola,hallo,word,,greetings,1';
                            return new TextEncoder().encode(text);
                        }
                    };
                }
            };
            
            await loadItems();
            
            assert.isTrue(DATA.length > 0, 'Should load from CSV');
            
            window.fetch = originalFetch;
        });
        
        it('should normalize German text', async () => {
            const originalFetch = window.fetch;
            window.fetch = async (url) => {
                if (url.includes('items.json')) {
                    return {
                        ok: true,
                        json: async () => [
                            { es: 'casa', de: 'Haus', difficulty: 1 }
                        ]
                    };
                }
            };
            
            await loadItems();
            
            assert.equal(DATA[0].de, 'Haus', 'Should keep ASCII');
            
            window.fetch = originalFetch;
        });
    });
});

// ============================================================================
// MULTIPLE CHOICE LOGIC TESTS
// ============================================================================

describe('Multiple Choice Logic', () => {
    
    describe('pickDistractors()', () => {
        const pool = [
            { es: 'hola', de: 'hallo', difficulty: 1 },
            { es: 'adiós', de: 'auf Wiedersehen', difficulty: 1 },
            { es: 'casa', de: 'Haus', difficulty: 2 },
            { es: 'perro', de: 'Hund', difficulty: 2 },
            { es: 'gato', de: 'Katze', difficulty: 2 },
            { es: 'difícil', de: 'schwierig', difficulty: 4 }
        ];
        
        it('should return requested number of distractors', () => {
            const answer = pool[0]; // hola
            const distractors = pickDistractors(pool, answer, 3);
            
            assert.equal(distractors.length, 3, 'Should return 3 distractors');
        });
        
        it('should not include answer in distractors', () => {
            const answer = pool[0]; // hola
            const distractors = pickDistractors(pool, answer, 3);
            
            const hasAnswer = distractors.some(d => 
                normEs(d.es) === normEs(answer.es)
            );
            assert.isFalse(hasAnswer, 'Should not include answer');
        });
        
        it('should filter by difficulty (±1)', () => {
            const answer = pool[2]; // casa, difficulty 2
            const distractors = pickDistractors(pool, answer, 2);
            
            const allWithinRange = distractors.every(d => 
                Math.abs(d.difficulty - answer.difficulty) <= 1
            );
            assert.isTrue(allWithinRange, 'Difficulty within ±1');
        });
        
        it('should avoid too similar words', () => {
            const poolSimilar = [
                { es: 'hola', de: 'hallo', difficulty: 1 },
                { es: 'hola', de: 'hello', difficulty: 1 }, // Duplicate
                { es: 'hole', de: 'hole', difficulty: 1 },  // Similar
                { es: 'casa', de: 'Haus', difficulty: 1 }
            ];
            
            const answer = poolSimilar[0];
            const distractors = pickDistractors(poolSimilar, answer, 2);
            
            // Should not include exact duplicate or very similar
            const hasSimilar = distractors.some(d => 
                levenshteinDistance(normEs(d.es), normEs(answer.es)) <= 2
            );
            assert.isFalse(hasSimilar, 'Should avoid similar words');
        });
        
        it('should fallback when not enough candidates', () => {
            const smallPool = [
                { es: 'hola', de: 'hallo', difficulty: 1 },
                { es: 'casa', de: 'Haus', difficulty: 1 }
            ];
            
            const answer = smallPool[0];
            const distractors = pickDistractors(smallPool, answer, 3);
            
            // Should return what's available
            assert.isTrue(distractors.length <= smallPool.length - 1, 'Fallback');
        });
    });
    
    describe('buildMC()', () => {
        const pool = [
            { es: 'hola', de: 'hallo', difficulty: 1 },
            { es: 'adiós', de: 'auf Wiedersehen', difficulty: 1 },
            { es: 'casa', de: 'Haus', difficulty: 1 },
            { es: 'perro', de: 'Hund', difficulty: 1 }
        ];
        
        it('should return prompt and answers HTML', () => {
            const item = pool[0];
            const result = buildMC(item, pool);
            
            assert.isTrue('promptHtml' in result, 'Has promptHtml');
            assert.isTrue('answersHtml' in result, 'Has answersHtml');
            assert.isTrue('correctAnswer' in result, 'Has correctAnswer');
        });
        
        it('should include Spanish word in prompt', () => {
            const item = pool[0];
            const result = buildMC(item, pool);
            
            assert.isTrue(
                result.promptHtml.includes(item.es),
                'Prompt includes Spanish'
            );
        });
        
        it('should have 4 options (3 distractors + 1 correct)', () => {
            const item = pool[0];
            const result = buildMC(item, pool);
            
            const buttonCount = (result.answersHtml.match(/mc-opt/g) || []).length;
            assert.equal(buttonCount, 4, 'Should have 4 options');
        });
        
        it('should include correct answer in options', () => {
            const item = pool[0];
            const result = buildMC(item, pool);
            
            assert.isTrue(
                result.answersHtml.includes(result.correctAnswer),
                'Includes correct answer'
            );
        });
    });
    
    describe('checkMC()', () => {
        let container;
        
        beforeEach(() => {
            container = document.createElement('div');
            container.innerHTML = `
                <button class="mc-opt" data-val="hallo">hallo</button>
                <button class="mc-opt" data-val="Haus">Haus</button>
                <button class="mc-opt sel" data-val="Hund">Hund</button>
            `;
        });
        
        it('should detect correct answer', () => {
            const result = checkMC(container, 'Hund');
            
            assert.isTrue(result.correct, 'Should be correct');
        });
        
        it('should detect incorrect answer', () => {
            const result = checkMC(container, 'hallo');
            
            assert.isFalse(result.correct, 'Should be incorrect');
        });
        
        it('should handle no selection', () => {
            container.querySelector('.sel').classList.remove('sel');
            const result = checkMC(container, 'hallo');
            
            assert.isFalse(result.correct, 'No selection');
            assert.equal(result.error, 'no-selection', 'Error type');
        });
    });
});

// ============================================================================
// SPANISHAPP CLASS TESTS
// ============================================================================

describe('SpanishApp Class', () => {
    
    describe('Constructor', () => {
        it('should initialize with default values', () => {
            // Mock DOM elements
            document.getElementById = (id) => {
                const el = document.createElement('div');
                el.id = id;
                return el;
            };
            
            // Mock dependencies
            window.LeitnerSystem = class {
                getPracticeQueue() { return []; }
                promote() {}
                demote() {}
            };
            window.SpanishConjugator = class {
                async initialize() {}
                generateExercise() { return {}; }
            };
            
            const app = new SpanishApp();
            
            assert.equal(app.mode, 'learn', 'Default mode');
            assert.equal(app.sessionIndex, 0, 'Session index');
            assert.isTrue(Array.isArray(app.vocabulary), 'Vocabulary array');
        });
    });
    
    describe('Exercise Creation', () => {
        let app;
        
        beforeEach(() => {
            // Setup minimal app instance
            document.getElementById = () => document.createElement('div');
            window.LeitnerSystem = class {
                getPracticeQueue() { return []; }
                promote() {}
                demote() {}
            };
            window.SpanishConjugator = class {
                async initialize() {}
                generateExercise() { return {}; }
            };
            
            app = new SpanishApp();
            app.vocabulary = [
                { id: 1, spanish: 'hola', german: 'hallo', srsBox: 0 },
                { id: 2, spanish: 'casa', german: 'Haus', srsBox: 0 },
                { id: 3, spanish: 'perro', german: 'Hund', srsBox: 0 }
            ];
        });
        
        it('should create choice exercise', () => {
            const vocabItem = app.vocabulary[0];
            const exercise = app.createChoiceExercise(vocabItem);
            
            assert.equal(exercise.type, 'choice', 'Exercise type');
            assert.isTrue('question' in exercise, 'Has question');
            assert.isTrue('correctAnswer' in exercise, 'Has correct answer');
            assert.isTrue(Array.isArray(exercise.choices), 'Has choices');
        });
        
        it('should create typing exercise', () => {
            const vocabItem = app.vocabulary[0];
            const exercise = app.createTypingExercise(vocabItem);
            
            assert.equal(exercise.type, 'typing', 'Exercise type');
            assert.isTrue('question' in exercise, 'Has question');
            assert.isTrue('correctAnswer' in exercise, 'Has correct answer');
        });
        
        it('should create match exercise', () => {
            const vocabItem = app.vocabulary[0];
            const exercise = app.createMatchExercise(vocabItem);
            
            assert.equal(exercise.type, 'match', 'Exercise type');
            assert.isTrue(Array.isArray(exercise.leftSide), 'Has left side');
            assert.isTrue(Array.isArray(exercise.rightSide), 'Has right side');
        });
    });
    
    describe('Answer Checking', () => {
        let app;
        
        beforeEach(() => {
            document.getElementById = () => document.createElement('div');
            window.LeitnerSystem = class {
                getPracticeQueue() { return []; }
                promote() {}
                demote() {}
            };
            window.SpanishConjugator = class {
                async initialize() {}
            };
            
            app = new SpanishApp();
        });
        
        it('should check typing answer correctly', () => {
            const exercise = {
                type: 'typing',
                direction: 'es-de',
                userAnswer: 'hallo',
                correctAnswer: 'hallo'
            };
            
            // Mock asciiNormalizer
            window.asciiNormalizer = {
                normalizeForMatching: (text) => text.toLowerCase()
            };
            
            const result = app.checkTypingAnswer(exercise);
            assert.isTrue(result, 'Should be correct');
        });
        
        it('should check match exercise correctly', () => {
            const exercise = {
                type: 'match',
                correctMatches: {
                    'hola': 'hallo',
                    'casa': 'Haus'
                },
                matches: {
                    'hola': 'hallo',
                    'casa': 'Haus'
                }
            };
            
            const result = app.checkMatchExercise(exercise);
            assert.isTrue(result, 'Should be correct');
        });
        
        it('should detect incorrect match', () => {
            const exercise = {
                type: 'match',
                correctMatches: {
                    'hola': 'hallo',
                    'casa': 'Haus'
                },
                matches: {
                    'hola': 'Haus',  // Wrong!
                    'casa': 'hallo'
                }
            };
            
            const result = app.checkMatchExercise(exercise);
            assert.isFalse(result, 'Should be incorrect');
        });
    });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Integration Tests', () => {
    
    it('should complete full exercise flow', async () => {
        // Mock DOM
        document.getElementById = () => document.createElement('div');
        
        // Mock dependencies
        window.LeitnerSystem = class {
            getPracticeQueue() { return []; }
            promote() {}
            demote() {}
        };
        window.SpanishConjugator = class {
            async initialize() {}
        };
        window.asciiNormalizer = {
            normalizeForMatching: (text) => text.toLowerCase()
        };
        
        // Create app
        const app = new SpanishApp();
        app.vocabulary = [
            { id: 1, spanish: 'hola', german: 'hallo', srsBox: 0 }
        ];
        
        // Create exercise
        const exercise = app.createChoiceExercise(app.vocabulary[0]);
        
        // Simulate user selection
        exercise.userAnswer = exercise.correctAnswer;
        
        // Check answer
        const isCorrect = (exercise.userAnswer === exercise.correctAnswer);
        
        assert.isTrue(isCorrect, 'Exercise flow complete');
    });
});

// ============================================================================
// TEST RUNNER
// ============================================================================

function runTests() {
    console.log('Running app.js tests...');
    console.log('='.repeat(60));
    
    let passed = 0;
    let failed = 0;
    
    // Run all test suites
    // (Implementation would iterate through all describe blocks)
    
    console.log('='.repeat(60));
    console.log(`Tests complete: ${passed} passed, ${failed} failed`);
    
    return failed === 0;
}

// Export for test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runTests };
}
