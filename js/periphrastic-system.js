/**
 * Periphrastic Tenses System
 * Handles compound verbal constructions in Spanish
 * - ir a + infinitivo (near future)
 * - estar + gerundio (progressive)
 * - acabar de + infinitivo (recent past)
 * ASCII-compliant, No-Gamification
 */

class PeriphrasticSystem {
    constructor(conjugator) {
        this.conjugator = conjugator;
        
        // Define periphrastic patterns
        this.patterns = {
            'ir-a-infinitivo': {
                name: 'Ir a + Infinitivo',
                nameDE: 'Futur Nahe',
                auxiliary: 'ir',
                preposition: 'a',
                form: 'infinitivo',
                tenses: ['presente', 'imperfecto', 'preterito'],
                description: 'Nahe Zukunft (going to)',
                example: 'voy a hablar'
            },
            'estar-gerundio': {
                name: 'Estar + Gerundio',
                nameDE: 'Verlaufsform',
                auxiliary: 'estar',
                preposition: null,
                form: 'gerundio',
                tenses: ['presente', 'imperfecto', 'preterito', 'futuro'],
                description: 'Progressive form (be -ing)',
                example: 'estoy hablando'
            },
            'acabar-de-infinitivo': {
                name: 'Acabar de + Infinitivo',
                nameDE: 'Gerade getan',
                auxiliary: 'acabar',
                preposition: 'de',
                form: 'infinitivo',
                tenses: ['presente', 'imperfecto', 'preterito'],
                description: 'Recent past (just did)',
                example: 'acabo de hablar'
            }
        };
    }

    /**
     * Build a periphrastic construction
     * @param {string} infinitivo - Main verb infinitive
     * @param {string} pattern - Pattern name (ir-a-infinitivo, estar-gerundio, acabar-de-infinitivo)
     * @param {string} persona - Person (yo, tu, el, nosotros, vosotros, ellos)
     * @param {string} tiempo - Tense for auxiliary (presente, imperfecto, preterito, futuro)
     * @returns {string} Complete periphrastic form
     */
    buildPeriphrasis(infinitivo, pattern, persona, tiempo = 'presente') {
        const patternDef = this.patterns[pattern];
        
        if (!patternDef) {
            throw new Error(`Unknown pattern: ${pattern}`);
        }
        
        // Check if tense is valid for this pattern
        if (!patternDef.tenses.includes(tiempo)) {
            throw new Error(`Tense ${tiempo} not valid for pattern ${pattern}`);
        }
        
        try {
            // 1. Conjugate auxiliary verb
            const auxiliary = this.conjugator.conjugate(
                patternDef.auxiliary,
                tiempo,
                persona
            );
            
            // 2. Get the required form of main verb
            let mainForm;
            if (patternDef.form === 'infinitivo') {
                mainForm = infinitivo;
            } else if (patternDef.form === 'gerundio') {
                const verb = this.conjugator.getVerb(infinitivo);
                mainForm = verb?.gerundio || this.conjugator.buildGerundio(infinitivo);
            } else {
                throw new Error(`Unknown form: ${patternDef.form}`);
            }
            
            // 3. Build complete construction
            let result = auxiliary;
            
            if (patternDef.preposition) {
                result += ' ' + patternDef.preposition;
            }
            
            result += ' ' + mainForm;
            
            return result;
            
        } catch (error) {
            throw new Error(`Failed to build periphrasis: ${error.message}`);
        }
    }

    /**
     * Analyze a periphrastic construction
     * @param {string} sentence - Sentence to analyze
     * @returns {Object} Analysis result
     */
    analyzePeriphrasis(sentence) {
        const normalized = sentence.toLowerCase().trim();
        const tokens = normalized.split(/\s+/);
        
        const results = [];
        
        // Check for each pattern
        for (const [patternName, patternDef] of Object.entries(this.patterns)) {
            const match = this.matchPattern(tokens, patternDef, patternName);
            if (match) {
                results.push(match);
            }
        }
        
        return {
            sentence: sentence,
            normalized: normalized,
            detected: results.length > 0,
            constructions: results
        };
    }

    /**
     * Match a specific pattern in tokens
     */
    matchPattern(tokens, patternDef, patternName) {
        for (let i = 0; i < tokens.length; i++) {
            // Try to find auxiliary verb
            const auxResult = this.conjugator.analyzeForm(tokens[i]);
            
            if (auxResult && auxResult.infinitivo === patternDef.auxiliary) {
                // Found auxiliary, check for preposition and main form
                let nextIndex = i + 1;
                
                // Check for preposition
                if (patternDef.preposition) {
                    if (tokens[nextIndex] === patternDef.preposition) {
                        nextIndex++;
                    } else {
                        continue; // Preposition missing
                    }
                }
                
                // Check for main verb form
                if (nextIndex < tokens.length) {
                    const mainForm = tokens[nextIndex];
                    
                    // Validate form type
                    if (patternDef.form === 'infinitivo' && mainForm.match(/[aei]r$/)) {
                        return {
                            pattern: patternName,
                            patternName: patternDef.name,
                            auxiliary: tokens[i],
                            auxiliaryInf: auxResult.infinitivo,
                            tiempo: auxResult.tiempo,
                            persona: auxResult.persona,
                            preposition: patternDef.preposition,
                            mainVerb: mainForm,
                            position: i,
                            length: nextIndex - i + 1,
                            complete: tokens.slice(i, nextIndex + 1).join(' ')
                        };
                    } else if (patternDef.form === 'gerundio' && mainForm.match(/(ando|iendo|yendo)$/)) {
                        return {
                            pattern: patternName,
                            patternName: patternDef.name,
                            auxiliary: tokens[i],
                            auxiliaryInf: auxResult.infinitivo,
                            tiempo: auxResult.tiempo,
                            persona: auxResult.persona,
                            preposition: null,
                            mainVerb: mainForm,
                            position: i,
                            length: nextIndex - i + 1,
                            complete: tokens.slice(i, nextIndex + 1).join(' ')
                        };
                    }
                }
            }
        }
        
        return null;
    }

    /**
     * Validate a periphrastic construction
     * @param {string} userAnswer - User's answer
     * @param {string} correctAnswer - Correct answer
     * @param {Object} context - Exercise context
     * @returns {Object} Validation result
     */
    validatePeriphrasis(userAnswer, correctAnswer, context = {}) {
        const userNorm = userAnswer.toLowerCase().trim();
        const correctNorm = correctAnswer.toLowerCase().trim();
        
        // Simple comparison first
        if (userNorm === correctNorm) {
            return {
                correct: true,
                message: 'Korrekt!',
                userAnswer: userAnswer,
                correctAnswer: correctAnswer
            };
        }
        
        // Analyze both
        const userAnalysis = this.analyzePeriphrasis(userAnswer);
        const correctAnalysis = this.analyzePeriphrasis(correctAnswer);
        
        const result = {
            correct: false,
            userAnswer: userAnswer,
            correctAnswer: correctAnswer,
            userAnalysis: userAnalysis,
            correctAnalysis: correctAnalysis,
            errors: []
        };
        
        // Check if user used a periphrastic construction
        if (!userAnalysis.detected && correctAnalysis.detected) {
            result.errors.push({
                type: 'missing-construction',
                message: 'Periphrastische Konstruktion nicht erkannt',
                hint: `Erwartete Konstruktion: ${correctAnalysis.constructions[0].patternName}`
            });
            return result;
        }
        
        if (userAnalysis.detected && correctAnalysis.detected) {
            const userConstr = userAnalysis.constructions[0];
            const correctConstr = correctAnalysis.constructions[0];
            
            // Check pattern
            if (userConstr.pattern !== correctConstr.pattern) {
                result.errors.push({
                    type: 'wrong-pattern',
                    message: 'Falsche Konstruktion',
                    expected: correctConstr.patternName,
                    actual: userConstr.patternName
                });
            }
            
            // Check auxiliary conjugation
            if (userConstr.auxiliary !== correctConstr.auxiliary) {
                result.errors.push({
                    type: 'auxiliary-conjugation',
                    message: 'Falsches Hilfsverb',
                    expected: correctConstr.auxiliary,
                    actual: userConstr.auxiliary,
                    verb: correctConstr.auxiliaryInf,
                    tiempo: correctConstr.tiempo,
                    persona: correctConstr.persona
                });
            }
            
            // Check preposition
            if (correctConstr.preposition && userConstr.preposition !== correctConstr.preposition) {
                result.errors.push({
                    type: 'wrong-preposition',
                    message: 'Falsche Praeposition',
                    expected: correctConstr.preposition,
                    actual: userConstr.preposition
                });
            }
            
            // Check main verb form
            if (userConstr.mainVerb !== correctConstr.mainVerb) {
                result.errors.push({
                    type: 'main-verb-form',
                    message: `Falsches ${correctConstr.pattern.includes('gerundio') ? 'Gerundio' : 'Infinitiv'}`,
                    expected: correctConstr.mainVerb,
                    actual: userConstr.mainVerb
                });
            }
        }
        
        return result;
    }

    /**
     * Get all available patterns
     */
    getPatterns() {
        return Object.keys(this.patterns);
    }

    /**
     * Get pattern information
     */
    getPatternInfo(pattern) {
        return this.patterns[pattern] || null;
    }

    /**
     * Generate random exercises
     */
    generateExercises(count = 30, options = {}) {
        const exercises = [];
        
        const patterns = options.patterns || this.getPatterns();
        const verbs = options.verbs || [
            'hablar', 'comer', 'vivir', 'estudiar', 'trabajar',
            'hacer', 'tener', 'ir', 'ser', 'estar',
            'decir', 'poder', 'querer', 'venir', 'salir'
        ];
        const personas = options.personas || ['yo', 'tu', 'el', 'nosotros', 'vosotros', 'ellos'];
        
        for (let i = 0; i < count; i++) {
            // Random selections
            const pattern = patterns[Math.floor(Math.random() * patterns.length)];
            const infinitivo = verbs[Math.floor(Math.random() * verbs.length)];
            const persona = personas[Math.floor(Math.random() * personas.length)];
            
            const patternDef = this.patterns[pattern];
            const tiempo = patternDef.tenses[Math.floor(Math.random() * patternDef.tenses.length)];
            
            try {
                const answer = this.buildPeriphrasis(infinitivo, pattern, persona, tiempo);
                
                exercises.push({
                    id: i + 1,
                    infinitivo: infinitivo,
                    pattern: pattern,
                    patternName: patternDef.name,
                    patternNameDE: patternDef.nameDE,
                    persona: persona,
                    tiempo: tiempo,
                    answer: answer,
                    description: patternDef.description
                });
            } catch (error) {
                // Skip if construction fails
                i--;
            }
        }
        
        return exercises;
    }

    /**
     * Generate formatted question text
     */
    generateQuestionText(exercise) {
        return `${exercise.infinitivo} (${exercise.patternNameDE}, ${exercise.tiempo}, ${exercise.persona})`;
    }

    /**
     * Get hint for exercise
     */
    getHint(exercise) {
        const patternDef = this.patterns[exercise.pattern];
        
        let hint = `Verwende: ${patternDef.nameDE}\n`;
        hint += `Hilfsverb: ${patternDef.auxiliary} (${exercise.tiempo}, ${exercise.persona})\n`;
        
        if (patternDef.preposition) {
            hint += `+ Praeposition: ${patternDef.preposition}\n`;
        }
        
        hint += `+ ${exercise.infinitivo} (${patternDef.form === 'gerundio' ? 'Gerundio' : 'Infinitiv'})`;
        
        return hint;
    }

    /**
     * Generate detailed explanation
     */
    generateExplanation(exercise, userAnswer = null) {
        const patternDef = this.patterns[exercise.pattern];
        
        let explanation = `## ${patternDef.nameDE} (${patternDef.name})\n\n`;
        explanation += `**Beschreibung**: ${patternDef.description}\n\n`;
        explanation += `**Aufbau**:\n`;
        explanation += `1. Hilfsverb "${patternDef.auxiliary}" konjugieren (${exercise.tiempo}, ${exercise.persona})\n`;
        
        if (patternDef.preposition) {
            explanation += `2. Praeposition "${patternDef.preposition}" hinzufuegen\n`;
            explanation += `3. Hauptverb im Infinitiv\n`;
        } else {
            explanation += `2. Hauptverb im Gerundio\n`;
        }
        
        explanation += `\n**Loesung**: ${exercise.answer}\n`;
        
        if (userAnswer) {
            const validation = this.validatePeriphrasis(userAnswer, exercise.answer, exercise);
            
            if (!validation.correct) {
                explanation += `\n**Deine Antwort**: ${userAnswer}\n`;
                explanation += `\n**Fehler**:\n`;
                
                validation.errors.forEach((error, i) => {
                    explanation += `${i + 1}. ${error.message}`;
                    if (error.expected && error.actual) {
                        explanation += ` (Erwartet: "${error.expected}", Deine Antwort: "${error.actual}")`;
                    }
                    explanation += `\n`;
                });
            }
        }
        
        return explanation;
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.PeriphrasticSystem = PeriphrasticSystem;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PeriphrasticSystem;
}
