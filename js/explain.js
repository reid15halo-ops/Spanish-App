/**
 * Spanish Error Explanation Engine
 * Classifies errors and provides rule-based explanations
 * ASCII-compliant German UI, No-Gamification
 */

class SpanishErrorExplainer {
    constructor(conjugator) {
        this.conjugator = conjugator;
        
        // Error categories with rules and tips
        this.categories = {
            // Endungen categories (by verb class and tense)
            'endungen-presente-ar': {
                name: 'Presente Endungen -ar Verben',
                rule: 'Bei -ar Verben im Presente: -o, -as, -a, -amos, -ais, -an',
                tipp: 'Merke: yo ? -o, tu ? -as, el ? -a',
                examples: ['hablo', 'hablas', 'habla'],
                workbenchLink: '#presente'
            },
            'endungen-presente-er': {
                name: 'Presente Endungen -er Verben',
                rule: 'Bei -er Verben im Presente: -o, -es, -e, -emos, -eis, -en',
                tipp: 'Merke: yo ? -o, tu ? -es, el ? -e',
                examples: ['como', 'comes', 'come'],
                workbenchLink: '#presente'
            },
            'endungen-presente-ir': {
                name: 'Presente Endungen -ir Verben',
                rule: 'Bei -ir Verben im Presente: -o, -es, -e, -imos, -is, -en',
                tipp: 'Merke: nosotros ? -imos (mit i!), vosotros ? -is',
                examples: ['vivo', 'vives', 'vive'],
                workbenchLink: '#presente'
            },
            'endungen-preterito-ar': {
                name: 'Preterito Endungen -ar Verben',
                rule: 'Bei -ar Verben im Preterito: -e, -aste, -o, -amos, -asteis, -aron',
                tipp: 'Merke: yo ? -e (mit Akzent!), el ? -o (mit Akzent!)',
                examples: ['hable', 'hablaste', 'hablo'],
                workbenchLink: '#preterito'
            },
            'endungen-preterito-er-ir': {
                name: 'Preterito Endungen -er/-ir Verben',
                rule: 'Bei -er/-ir Verben im Preterito: -i, -iste, -io, -imos, -isteis, -ieron',
                tipp: 'Merke: yo ? -i (mit Akzent!), el ? -io (mit Akzent!)',
                examples: ['comi', 'comiste', 'comio'],
                workbenchLink: '#preterito'
            },
            'endungen-imperfecto-ar': {
                name: 'Imperfecto Endungen -ar Verben',
                rule: 'Bei -ar Verben im Imperfecto: -aba, -abas, -aba, -abamos, -abais, -aban',
                tipp: 'Merke: Alle Formen haben -aba',
                examples: ['hablaba', 'hablabas', 'hablaba'],
                workbenchLink: '#imperfecto'
            },
            'endungen-imperfecto-er-ir': {
                name: 'Imperfecto Endungen -er/-ir Verben',
                rule: 'Bei -er/-ir Verben im Imperfecto: -ia, -ias, -ia, -iamos, -iais, -ian',
                tipp: 'Merke: Alle Formen haben -ia (mit Akzent auf i!)',
                examples: ['comia', 'comias', 'comia'],
                workbenchLink: '#imperfecto'
            },
            'endungen-futuro': {
                name: 'Futuro Simple Endungen',
                rule: 'Futuro: Infinitiv + -e, -as, -a, -emos, -eis, -an',
                tipp: 'Merke: Alle Formen behalten den Infinitiv-Stamm',
                examples: ['hablare', 'hablaras', 'hablara'],
                workbenchLink: '#futuro'
            },
            'endungen-condicional': {
                name: 'Condicional Endungen',
                rule: 'Condicional: Infinitiv + -ia, -ias, -ia, -iamos, -iais, -ian',
                tipp: 'Merke: Wie Imperfecto, aber mit Infinitiv-Stamm',
                examples: ['hablaria', 'hablarias', 'hablaria'],
                workbenchLink: '#condicional'
            },
            
            // Accent/Diacritic errors
            'akzent-fehlt': {
                name: 'Fehlender Akzent',
                rule: 'Viele spanische Verbformen brauchen Akzente zur Betonung',
                tipp: 'Pruefen Sie: Preterito (hable, comio), Futuro (hablare), Imperfecto (-ia)',
                examples: ['hablé (nicht hable)', 'comió (nicht comio)', 'hablaré (nicht hablare)'],
                workbenchLink: '#akzente'
            },
            'akzent-falsch': {
                name: 'Falscher Akzent',
                rule: 'Akzente stehen auf der betonten Silbe',
                tipp: 'Preterito: Akzent auf letzter Silbe (yo, el/ella)',
                examples: ['habló (nicht háblá)', 'comí (nicht cómi)'],
                workbenchLink: '#akzente'
            },
            
            // Irregular stem errors
            'stamm-irregulär': {
                name: 'Unregelmaessiger Stamm',
                rule: 'Manche Verben aendern ihren Stamm',
                tipp: 'Beispiele: e?ie (pensar?pienso), o?ue (poder?puedo), e?i (pedir?pido)',
                examples: ['pienso (nicht penso)', 'puedo (nicht podo)', 'pido (nicht pedo)'],
                workbenchLink: '#stammaenderungen'
            },
            'stamm-preterito-irregulär': {
                name: 'Unregelmaessiger Preterito-Stamm',
                rule: 'Einige Verben haben spezielle Preterito-Staemme',
                tipp: 'Beispiele: tener?tuv-, estar?estuv-, hacer?hic-/hiz-',
                examples: ['tuve (nicht teni)', 'estuve (nicht estabe)', 'hice (nicht hace)'],
                workbenchLink: '#preterito-irregulär'
            },
            
            // Auxiliary verb errors
            'hilfsverb-haber': {
                name: 'Hilfsverb "haber" fehlt oder falsch',
                rule: 'Perfecto/Pluscuamperfecto brauchen "haber" + Partizip',
                tipp: 'Perfecto: he/has/ha + Partizip, Pluscuamperfecto: habia/habias + Partizip',
                examples: ['he hablado', 'habia comido', 'has vivido'],
                workbenchLink: '#perfecto'
            },
            'hilfsverb-estar': {
                name: 'Hilfsverb "estar" fehlt oder falsch',
                rule: 'Progresivo braucht "estar" + Gerundio',
                tipp: 'Forme: estoy/estas/esta + -ando/-iendo',
                examples: ['estoy hablando', 'estas comiendo', 'esta viviendo'],
                workbenchLink: '#progresivo'
            },
            
            // Participle errors
            'partizip-form': {
                name: 'Falsche Partizip-Form',
                rule: 'Partizip: -ar ? -ado, -er/-ir ? -ido',
                tipp: 'Unregelmaessige Partizipien merken: hecho, escrito, visto, dicho',
                examples: ['hablado', 'comido', 'vivido', 'hecho (nicht hacido)'],
                workbenchLink: '#partizip'
            },
            'gerundio-form': {
                name: 'Falsche Gerundio-Form',
                rule: 'Gerundio: -ar ? -ando, -er/-ir ? -iendo',
                tipp: 'Bei -ir Verben mit Stammaenderung: e?i, o?u',
                examples: ['hablando', 'comiendo', 'viviendo', 'pidiendo (e?i)'],
                workbenchLink: '#gerundio'
            },
            
            // Agreement errors
            'kongruenz-persona': {
                name: 'Person stimmt nicht ueberein',
                rule: 'Verbform muss zur Person passen',
                tipp: 'yo ? 1. Person Sg., nosotros ? 1. Person Pl.',
                examples: ['yo hablo (nicht hablas)', 'nosotros hablamos (nicht hablan)'],
                workbenchLink: '#personen'
            },
            'kongruenz-numerus': {
                name: 'Singular/Plural stimmt nicht',
                rule: 'Singular-Person braucht Singular-Form, Plural-Person Plural-Form',
                tipp: 'el/ella (Sg.) ? -a/-e, ellos/ellas (Pl.) ? -an/-en',
                examples: ['el habla', 'ellos hablan'],
                workbenchLink: '#numerus'
            },
            
            // Tense selection errors
            'zeitwahl-perfecto-indefinido': {
                name: 'Perfecto vs. Indefinido verwechselt',
                rule: 'Perfecto: Bezug zur Gegenwart, Indefinido: abgeschlossene Vergangenheit',
                tipp: 'Perfecto: heute/diese Woche, Indefinido: gestern/letztes Jahr',
                examples: ['Hoy he comido (Perfecto)', 'Ayer comi (Indefinido)'],
                workbenchLink: '#perfecto-vs-indefinido'
            },
            'zeitwahl-imperfecto-indefinido': {
                name: 'Imperfecto vs. Indefinido verwechselt',
                rule: 'Imperfecto: Gewohnheit/Hintergrund, Indefinido: einmalige Handlung',
                tipp: 'Imperfecto: "immer/oft", Indefinido: "einmal/plotzlich"',
                examples: ['Siempre jugaba (Imperfecto)', 'Ayer jugue (Indefinido)'],
                workbenchLink: '#imperfecto-vs-indefinido'
            },
            
            // General error
            'allgemein': {
                name: 'Allgemeiner Fehler',
                rule: 'Die Verbform stimmt nicht mit den Regeln ueberein',
                tipp: 'Pruefen Sie: Person, Zeit, Verbklasse und Stamm',
                examples: [],
                workbenchLink: '#regeln'
            }
        };
    }

    /**
     * Main classification method
     * @param {Object} errorData - {input, expected, tiempo, persona, verbo}
     * @returns {Object} Classification result with category and tips
     */
    classifyError(errorData) {
        const { input, expected, tiempo, persona, verbo } = errorData;
        
        // Normalize inputs
        const inputNorm = this.normalize(input);
        const expectedNorm = this.normalize(expected);
        
        // Get verb data
        const verbData = this.conjugator ? this.conjugator.findVerb(verbo) : null;
        const verbClass = verbData ? verbData.clase : this.guessVerbClass(verbo);
        
        // Run classification checks
        const checks = [
            () => this.checkAccentError(inputNorm, expectedNorm),
            () => this.checkEndingError(inputNorm, expectedNorm, tiempo, persona, verbClass),
            () => this.checkStemError(inputNorm, expectedNorm, verbo, tiempo),
            () => this.checkAuxiliaryError(inputNorm, expectedNorm, tiempo),
            () => this.checkParticipleError(inputNorm, expectedNorm, verbo),
            () => this.checkGerundioError(inputNorm, expectedNorm, verbo),
            () => this.checkPersonError(inputNorm, expectedNorm, persona),
            () => this.checkTenseSelectionError(tiempo, input, expected)
        ];
        
        // Try each check
        for (const check of checks) {
            const result = check();
            if (result) {
                return this.formatResult(result, errorData);
            }
        }
        
        // Default: general error
        return this.formatResult('allgemein', errorData);
    }

    /**
     * Check for accent/diacritic errors
     */
    checkAccentError(input, expected) {
        const inputNoAccent = this.removeAccents(input);
        const expectedNoAccent = this.removeAccents(expected);
        
        // Same without accents = accent error
        if (inputNoAccent === expectedNoAccent && input !== expected) {
            // Determine if missing or wrong
            const inputHasAccent = input !== inputNoAccent;
            const expectedHasAccent = expected !== expectedNoAccent;
            
            if (!inputHasAccent && expectedHasAccent) {
                return 'akzent-fehlt';
            } else if (inputHasAccent && expectedHasAccent) {
                return 'akzent-falsch';
            }
        }
        
        return null;
    }

    /**
     * Check for ending errors
     */
    checkEndingError(input, expected, tiempo, persona, verbClass) {
        // Get expected ending
        const ending = this.getExpectedEnding(tiempo, persona, verbClass);
        if (!ending) return null;
        
        // Check if input has wrong ending
        const inputEnding = this.extractEnding(input, ending.length);
        
        if (inputEnding !== ending) {
            // Determine specific category
            if (tiempo === 'presente') {
                if (verbClass === '-ar') return 'endungen-presente-ar';
                if (verbClass === '-er') return 'endungen-presente-er';
                if (verbClass === '-ir') return 'endungen-presente-ir';
            } else if (tiempo === 'preterito') {
                if (verbClass === '-ar') return 'endungen-preterito-ar';
                if (verbClass === '-er' || verbClass === '-ir') return 'endungen-preterito-er-ir';
            } else if (tiempo === 'imperfecto') {
                if (verbClass === '-ar') return 'endungen-imperfecto-ar';
                if (verbClass === '-er' || verbClass === '-ir') return 'endungen-imperfecto-er-ir';
            } else if (tiempo === 'futuro') {
                return 'endungen-futuro';
            } else if (tiempo === 'condicional') {
                return 'endungen-condicional';
            }
        }
        
        return null;
    }

    /**
     * Check for stem errors
     */
    checkStemError(input, expected, verbo, tiempo) {
        // Get stems
        const verbStem = verbo.slice(0, -2); // Remove -ar/-er/-ir
        const inputStem = input.slice(0, -2); // Approximate
        const expectedStem = expected.slice(0, -2);
        
        // If stems differ significantly, it's a stem error
        if (inputStem !== expectedStem) {
            // Check if it's a known stem-changing verb
            const stemChangePatterns = ['e>ie', 'o>ue', 'e>i', 'u>ue'];
            const hasPattern = stemChangePatterns.some(p => 
                expectedStem.includes(p.split('>')[1].slice(0, 2))
            );
            
            if (hasPattern && tiempo === 'presente') {
                return 'stamm-irregulär';
            }
            
            if (tiempo === 'preterito') {
                return 'stamm-preterito-irregulär';
            }
            
            return 'stamm-irregulär';
        }
        
        return null;
    }

    /**
     * Check for auxiliary verb errors
     */
    checkAuxiliaryError(input, expected, tiempo) {
        // Check for compound tenses
        if (tiempo === 'perfecto' || tiempo === 'pluscuamperfecto') {
            const hasHaber = /^(he|has|ha|hemos|habeis|han|habia|habias|habiamos|habiais|habian)\s/.test(expected);
            const inputHasHaber = /^(he|has|ha|hemos|habeis|han|habia|habias|habiamos|habiais|habian)\s/.test(input);
            
            if (hasHaber && !inputHasHaber) {
                return 'hilfsverb-haber';
            }
        }
        
        // Check for progressive (estar + gerundio)
        if (expected.includes('estoy') || expected.includes('estas') || expected.includes('esta')) {
            const hasEstar = /^(estoy|estas|esta|estamos|estais|estan)\s/.test(expected);
            const inputHasEstar = /^(estoy|estas|esta|estamos|estais|estan)\s/.test(input);
            
            if (hasEstar && !inputHasEstar) {
                return 'hilfsverb-estar';
            }
        }
        
        return null;
    }

    /**
     * Check for participle errors
     */
    checkParticipleError(input, expected, verbo) {
        // Check if expected is a participle
        if (expected.endsWith('ado') || expected.endsWith('ido')) {
            const verbStem = verbo.slice(0, -2);
            
            // Check if input has wrong participle ending
            if (input.startsWith(verbStem)) {
                const inputEnding = input.slice(verbStem.length);
                const expectedEnding = expected.slice(verbStem.length);
                
                if (inputEnding !== expectedEnding) {
                    return 'partizip-form';
                }
            }
        }
        
        return null;
    }

    /**
     * Check for gerundio errors
     */
    checkGerundioError(input, expected, verbo) {
        // Check if expected is a gerundio
        if (expected.endsWith('ando') || expected.endsWith('iendo')) {
            const verbStem = verbo.slice(0, -2);
            
            // Check if input has wrong gerundio ending
            if (input.startsWith(verbStem.slice(0, -1))) { // Approximate stem
                const inputEnding = input.slice(-5); // Last 5 chars
                const expectedEnding = expected.slice(-5);
                
                if (!inputEnding.includes('ando') && !inputEnding.includes('iendo')) {
                    return 'gerundio-form';
                }
            }
        }
        
        return null;
    }

    /**
     * Check for person agreement errors
     */
    checkPersonError(input, expected, persona) {
        // This is tricky without full parsing, check ending patterns
        const personEndings = {
            'yo': ['o', 'é', 'í'],
            'tu': ['as', 'es', 'aste', 'iste'],
            'el': ['a', 'e', 'ó', 'ió'],
            'nosotros': ['amos', 'emos', 'imos'],
            'vosotros': ['ais', 'eis', 'is', 'asteis', 'isteis'],
            'ellos': ['an', 'en', 'aron', 'ieron']
        };
        
        const expectedEndings = personEndings[persona] || [];
        const hasCorrectEnding = expectedEndings.some(ending => expected.endsWith(ending));
        const inputHasCorrectEnding = expectedEndings.some(ending => input.endsWith(ending));
        
        if (hasCorrectEnding && !inputHasCorrectEnding) {
            return 'kongruenz-persona';
        }
        
        return null;
    }

    /**
     * Check for tense selection errors
     */
    checkTenseSelectionError(tiempo, input, expected) {
        // This would require more context about the sentence
        // For now, return null (would need sentence analysis)
        return null;
    }

    /**
     * Format result with full explanation
     */
    formatResult(categoria, errorData) {
        const category = this.categories[categoria] || this.categories['allgemein'];
        const { input, expected, tiempo, persona, verbo } = errorData;
        
        return {
            categoria: categoria,
            name: category.name,
            rule: category.rule,
            tipp: category.tipp,
            examples: category.examples,
            workbenchLink: category.workbenchLink,
            
            // Error details
            errorDetails: {
                eingabe: input,
                erwartet: expected,
                zeitform: tiempo,
                person: persona,
                verb: verbo
            },
            
            // Formatted explanation
            explanation: this.generateExplanation(category, errorData)
        };
    }

    /**
     * Generate human-readable explanation
     */
    generateExplanation(category, errorData) {
        const { input, expected, tiempo, persona, verbo } = errorData;
        
        let explanation = `${category.name}\n\n`;
        explanation += `Ihre Eingabe: "${input}"\n`;
        explanation += `Richtig waere: "${expected}"\n\n`;
        explanation += `Regel: ${category.rule}\n`;
        explanation += `Tipp: ${category.tipp}\n`;
        
        if (category.examples.length > 0) {
            explanation += `\nBeispiele: ${category.examples.join(', ')}`;
        }
        
        return explanation;
    }

    /**
     * Helper: Get expected ending for tense/person/class
     */
    getExpectedEnding(tiempo, persona, verbClass) {
        const patterns = {
            'presente': {
                '-ar': { yo: 'o', tu: 'as', el: 'a', nosotros: 'amos', vosotros: 'ais', ellos: 'an' },
                '-er': { yo: 'o', tu: 'es', el: 'e', nosotros: 'emos', vosotros: 'eis', ellos: 'en' },
                '-ir': { yo: 'o', tu: 'es', el: 'e', nosotros: 'imos', vosotros: 'is', ellos: 'en' }
            },
            'preterito': {
                '-ar': { yo: 'é', tu: 'aste', el: 'ó', nosotros: 'amos', vosotros: 'asteis', ellos: 'aron' },
                '-er': { yo: 'í', tu: 'iste', el: 'ió', nosotros: 'imos', vosotros: 'isteis', ellos: 'ieron' },
                '-ir': { yo: 'í', tu: 'iste', el: 'ió', nosotros: 'imos', vosotros: 'isteis', ellos: 'ieron' }
            }
        };
        
        return patterns[tiempo]?.[verbClass]?.[persona];
    }

    /**
     * Helper: Extract ending from word
     */
    extractEnding(word, length) {
        return word.slice(-length);
    }

    /**
     * Helper: Guess verb class from infinitive
     */
    guessVerbClass(verbo) {
        if (verbo.endsWith('ar')) return '-ar';
        if (verbo.endsWith('er')) return '-er';
        if (verbo.endsWith('ir')) return '-ir';
        return 'unknown';
    }

    /**
     * Helper: Normalize string
     */
    normalize(str) {
        return str.toLowerCase().trim();
    }

    /**
     * Helper: Remove accents
     */
    removeAccents(text) {
        return text
            .replace(/[áàäâ]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöô]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/ñ/g, 'n');
    }

    /**
     * Get all categories
     */
    getAllCategories() {
        return Object.keys(this.categories).map(key => ({
            id: key,
            ...this.categories[key]
        }));
    }

    /**
     * Test classification with multiple examples
     */
    testClassification(testCases) {
        const results = {
            total: testCases.length,
            correct: 0,
            incorrect: 0,
            details: []
        };

        testCases.forEach(testCase => {
            const result = this.classifyError(testCase.error);
            const isCorrect = result.categoria === testCase.expectedCategory;
            
            if (isCorrect) {
                results.correct++;
            } else {
                results.incorrect++;
            }
            
            results.details.push({
                input: testCase.error.input,
                expected: testCase.error.expected,
                expectedCategory: testCase.expectedCategory,
                actualCategory: result.categoria,
                correct: isCorrect
            });
        });

        results.accuracy = (results.correct / results.total) * 100;
        
        return results;
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.SpanishErrorExplainer = SpanishErrorExplainer;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpanishErrorExplainer;
}
