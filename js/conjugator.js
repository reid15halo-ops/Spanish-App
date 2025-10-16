/**
 * Spanish Verb Conjugator Engine
 * Supports regular and irregular conjugations for all major tenses
 * ASCII-compliant with German translations
 */

class SpanishConjugator {
    constructor() {
        this.verbs = [];
        this.regularPatterns = {
            '-ar': {
                presente: ['o', 'as', 'a', 'amos', 'ais', 'an'],
                preterito: ['e', 'aste', 'o', 'amos', 'asteis', 'aron'],
                imperfecto: ['aba', 'abas', 'aba', 'abamos', 'abais', 'aban'],
                futuro: ['are', 'aras', 'ara', 'aremos', 'areis', 'aran'],
                condicional: ['aria', 'arias', 'aria', 'ariamos', 'ariais', 'arian'],
                presente_subjuntivo: ['e', 'es', 'e', 'emos', 'eis', 'en'],
                imperfecto_subjuntivo: ['ara', 'aras', 'ara', 'aramos', 'arais', 'aran'],
                imperativo: ['a', 'e', 'emos', 'ad', 'en']
            },
            '-er': {
                presente: ['o', 'es', 'e', 'emos', 'eis', 'en'],
                preterito: ['i', 'iste', 'io', 'imos', 'isteis', 'ieron'],
                imperfecto: ['ia', 'ias', 'ia', 'iamos', 'iais', 'ian'],
                futuro: ['ere', 'eras', 'era', 'eremos', 'ereis', 'eran'],
                condicional: ['eria', 'erias', 'eria', 'eriamos', 'eriais', 'erian'],
                presente_subjuntivo: ['a', 'as', 'a', 'amos', 'ais', 'an'],
                imperfecto_subjuntivo: ['iera', 'ieras', 'iera', 'ieramos', 'ierais', 'ieran'],
                imperativo: ['e', 'a', 'amos', 'ed', 'an']
            },
            '-ir': {
                presente: ['o', 'es', 'e', 'imos', 'is', 'en'],
                preterito: ['i', 'iste', 'io', 'imos', 'isteis', 'ieron'],
                imperfecto: ['ia', 'ias', 'ia', 'iamos', 'iais', 'ian'],
                futuro: ['ire', 'iras', 'ira', 'iremos', 'ireis', 'iran'],
                condicional: ['iria', 'irias', 'iria', 'iriamos', 'iriais', 'irian'],
                presente_subjuntivo: ['a', 'as', 'a', 'amos', 'ais', 'an'],
                imperfecto_subjuntivo: ['iera', 'ieras', 'iera', 'ieramos', 'ierais', 'ieran'],
                imperativo: ['e', 'a', 'amos', 'id', 'an']
            }
        };

        this.pronouns = ['yo', 'tu', 'el', 'nosotros', 'vosotros', 'ellos'];
        this.pronounIndex = {
            'yo': 0, 'tu': 1, 'el': 2, 'ella': 2, 'usted': 2,
            'nosotros': 3, 'nosotras': 3,
            'vosotros': 4, 'vosotras': 4,
            'ellos': 5, 'ellas': 5, 'ustedes': 5
        };

        this.tenseNames = {
            'presente': 'Presente',
            'preterito': 'Preterito Indefinido',
            'imperfecto': 'Imperfecto',
            'futuro': 'Futuro Simple',
            'condicional': 'Condicional',
            'perfecto': 'Preterito Perfecto',
            'pluscuamperfecto': 'Pluscuamperfecto',
            'presente_subjuntivo': 'Presente Subjuntivo',
            'imperfecto_subjuntivo': 'Imperfecto Subjuntivo',
            'imperativo': 'Imperativo',
            'gerundio': 'Gerundio',
            'participio': 'Participio'
        };

        this.stemChanges = {
            'e>ie': this.applyStemChange_e_ie,
            'o>ue': this.applyStemChange_o_ue,
            'e>i': this.applyStemChange_e_i,
            'u>ue': this.applyStemChange_u_ue
        };

        this.initialized = false;
    }

    /**
     * Initialize conjugator with verb data
     */
    async initialize() {
        try {
            const response = await fetch('data/verbs.json');
            if (!response.ok) {
                throw new Error(`Failed to load verbs: ${response.status}`);
            }
            this.verbs = await response.json();
            this.initialized = true;
            console.log(`?? Conjugator initialized with ${this.verbs.length} verbs`);
        } catch (error) {
            console.error('Conjugator initialization failed:', error);
            throw error;
        }
    }

    /**
     * Main conjugation function
     * @param {string} infinitivo - Verb infinitive (e.g., "hablar")
     * @param {string} tiempo - Tense (e.g., "presente", "preterito")
     * @param {string} persona - Person (e.g., "yo", "tu", "el")
     * @returns {string} Conjugated form
     */
    conjugate(infinitivo, tiempo, persona) {
        if (!this.initialized) {
            throw new Error('Conjugator not initialized. Call initialize() first.');
        }

        // Find verb in database
        const verb = this.findVerb(infinitivo);
        if (!verb) {
            throw new Error(`Verb "${infinitivo}" not found in database`);
        }

        // Handle special tenses
        if (tiempo === 'gerundio') {
            return verb.gerundio;
        }
        if (tiempo === 'participio') {
            return verb.participio;
        }

        // Handle compound tenses
        if (tiempo === 'perfecto') {
            const haber = this.conjugate('haber', 'presente', persona);
            return `${haber} ${verb.participio}`;
        }
        if (tiempo === 'pluscuamperfecto') {
            const haber = this.conjugate('haber', 'imperfecto', persona);
            return `${haber} ${verb.participio}`;
        }

        // Get person index
        const personIndex = this.pronounIndex[persona];
        if (personIndex === undefined) {
            throw new Error(`Invalid person: ${persona}`);
        }

        // Check for irregular form first
        if (verb.irregularidades && verb.irregularidades[tiempo] && verb.irregularidades[tiempo][persona]) {
            return verb.irregularidades[tiempo][persona];
        }

        // Apply regular conjugation
        return this.applyRegularConjugation(verb, tiempo, personIndex);
    }

    /**
     * Find verb in database
     */
    findVerb(infinitivo) {
        return this.verbs.find(v => v.infinitivo === infinitivo);
    }

    /**
     * Apply regular conjugation patterns
     */
    applyRegularConjugation(verb, tiempo, personIndex) {
        const clase = verb.clase;
        const pattern = this.regularPatterns[clase];
        
        if (!pattern || !pattern[tiempo]) {
            throw new Error(`No pattern found for class ${clase} and tense ${tiempo}`);
        }

        let stem = this.getStem(verb.infinitivo, clase);
        const ending = pattern[tiempo][personIndex];

        // Apply stem changes for certain verb classes and tenses
        if (verb.clase !== 'irregular' && verb.clase !== '-ar' && verb.clase !== '-er' && verb.clase !== '-ir') {
            stem = this.applyStemChanges(verb, stem, tiempo, personIndex);
        }

        return stem + ending;
    }

    /**
     * Get verb stem by removing infinitive ending
     */
    getStem(infinitivo, clase) {
        if (clase === '-ar') {
            return infinitivo.slice(0, -2);
        } else if (clase === '-er' || clase === '-ir') {
            return infinitivo.slice(0, -2);
        } else {
            // For irregular verbs, try to guess stem
            return infinitivo.slice(0, -2);
        }
    }

    /**
     * Build gerundio form from infinitive
     * @param {string} infinitivo - Verb infinitive
     * @returns {string} Gerundio form
     */
    buildGerundio(infinitivo) {
        // Check if verb exists in database
        const verb = this.findVerb(infinitivo);
        if (verb && verb.gerundio) {
            return verb.gerundio;
        }
        
        // Regular gerundio formation
        if (infinitivo.endsWith('ar')) {
            const stem = infinitivo.slice(0, -2);
            return stem + 'ando';
        } else if (infinitivo.endsWith('er')) {
            const stem = infinitivo.slice(0, -2);
            return stem + 'iendo';
        } else if (infinitivo.endsWith('ir')) {
            const stem = infinitivo.slice(0, -2);
            
            // Special cases for -ir verbs
            // Check for vowel + ir (e.g., leer -> leyendo)
            if (stem.match(/[aeiou]$/)) {
                return stem + 'yendo';
            }
            
            return stem + 'iendo';
        }
        
        throw new Error(`Cannot build gerundio for: ${infinitivo}`);
    }

    /**
     * Get verb object from database
     * @param {string} infinitivo - Verb infinitive
     * @returns {Object} Verb object or null
     */
    getVerb(infinitivo) {
        return this.findVerb(infinitivo);
    }

    /**
     * Analyze a conjugated form to determine infinitive, tense, and person
     * (alias for better API naming)
     * @param {string} form - Conjugated verb form
     * @returns {Object} Single analysis result or null
     */
    analyzeForm(form) {
        const results = this.analyze(form);
        return results.length > 0 ? results[0] : null;
    }

    /**
     * Apply stem changes based on verb class
     */
    applyStemChanges(verb, stem, tiempo, personIndex) {
        const clase = verb.clase;
        
        // Stem changes typically apply to presente and some other tenses
        // Only to certain persons (not nosotros/vosotros usually)
        const affectedPersons = [0, 1, 2, 5]; // yo, tu, el, ellos
        
        if (tiempo === 'presente' && affectedPersons.includes(personIndex)) {
            if (this.stemChanges[clase]) {
                return this.stemChanges[clase].call(this, stem);
            }
        }

        // Some stem changes also apply to preterito for certain persons
        if (tiempo === 'preterito' && [2, 5].includes(personIndex)) { // el, ellos
            if (clase === 'e>i' || clase === 'o>u') {
                return this.applyStemChange_e_i(stem);
            }
        }

        return stem;
    }

    // Stem change functions
    applyStemChange_e_ie(stem) {
        return stem.replace(/e([^e]*)$/, 'ie$1');
    }

    applyStemChange_o_ue(stem) {
        return stem.replace(/o([^o]*)$/, 'ue$1');
    }

    applyStemChange_e_i(stem) {
        return stem.replace(/e([^e]*)$/, 'i$1');
    }

    applyStemChange_u_ue(stem) {
        return stem.replace(/u([^u]*)$/, 'ue$1');
    }

    /**
     * Analyze a conjugated form to determine infinitive, tense, and person
     * @param {string} form - Conjugated verb form
     * @returns {Array} Array of possible analyses {infinitivo, tiempo, persona, confianza}
     */
    analyze(form) {
        if (!this.initialized) {
            throw new Error('Conjugator not initialized. Call initialize() first.');
        }

        const results = [];
        const normalizedForm = this.normalizeSpanish(form);

        // Check all verbs and all conjugations
        for (const verb of this.verbs) {
            for (const tiempo of Object.keys(this.tenseNames)) {
                if (tiempo === 'gerundio' || tiempo === 'participio') {
                    // Check non-personal forms
                    if (tiempo === 'gerundio' && this.normalizeSpanish(verb.gerundio) === normalizedForm) {
                        results.push({
                            infinitivo: verb.infinitivo,
                            tiempo: tiempo,
                            persona: null,
                            confianza: 0.95,
                            traduccion: verb.traduccion
                        });
                    }
                    if (tiempo === 'participio' && this.normalizeSpanish(verb.participio) === normalizedForm) {
                        results.push({
                            infinitivo: verb.infinitivo,
                            tiempo: tiempo,
                            persona: null,
                            confianza: 0.95,
                            traduccion: verb.traduccion
                        });
                    }
                    continue;
                }

                for (const persona of this.pronouns) {
                    try {
                        const conjugated = this.conjugate(verb.infinitivo, tiempo, persona);
                        if (this.normalizeSpanish(conjugated) === normalizedForm) {
                            results.push({
                                infinitivo: verb.infinitivo,
                                tiempo: tiempo,
                                persona: persona,
                                confianza: 0.9,
                                traduccion: verb.traduccion
                            });
                        }
                    } catch (error) {
                        // Skip if conjugation fails
                        continue;
                    }
                }
            }
        }

        // Sort by confidence and remove duplicates
        const uniqueResults = results.filter((result, index, self) => 
            index === self.findIndex(r => 
                r.infinitivo === result.infinitivo && 
                r.tiempo === result.tiempo && 
                r.persona === result.persona
            )
        );

        return uniqueResults.sort((a, b) => b.confianza - a.confianza);
    }

    /**
     * Normalize Spanish text for comparison (preserve diacritics)
     */
    normalizeSpanish(text) {
        if (!text) return '';
        return text.toLowerCase().trim();
    }

    /**
     * Get all conjugations for a verb
     * @param {string} infinitivo - Verb infinitive
     * @returns {Object} All conjugations organized by tense
     */
    getFullConjugation(infinitivo) {
        if (!this.initialized) {
            throw new Error('Conjugator not initialized. Call initialize() first.');
        }

        const verb = this.findVerb(infinitivo);
        if (!verb) {
            throw new Error(`Verb "${infinitivo}" not found in database`);
        }

        const conjugations = {
            infinitivo: infinitivo,
            traduccion: verb.traduccion,
            clase: verb.clase,
            tipo: verb.tipo,
            frecuencia: verb.frecuencia
        };

        // Add all tenses
        for (const tiempo of Object.keys(this.tenseNames)) {
            if (tiempo === 'gerundio' || tiempo === 'participio') {
                conjugations[tiempo] = verb[tiempo];
                continue;
            }

            conjugations[tiempo] = {};
            for (const persona of this.pronouns) {
                try {
                    conjugations[tiempo][persona] = this.conjugate(infinitivo, tiempo, persona);
                } catch (error) {
                    conjugations[tiempo][persona] = null;
                }
            }
        }

        return conjugations;
    }

    /**
     * Get random verb for practice
     * @param {number} maxFrecuencia - Maximum frequency level (1=most common, 3=less common)
     * @returns {Object} Random verb object
     */
    getRandomVerb(maxFrecuencia = 2) {
        const filteredVerbs = this.verbs.filter(v => v.frecuencia <= maxFrecuencia);
        return filteredVerbs[Math.floor(Math.random() * filteredVerbs.length)];
    }

    /**
     * Get verbs by category
     * @param {string} tipo - Verb type (e.g., "accion", "movimiento")
     * @returns {Array} Array of verbs matching the type
     */
    getVerbsByType(tipo) {
        return this.verbs.filter(v => v.tipo === tipo);
    }

    /**
     * Validate conjugation answer
     * @param {string} userAnswer - User's answer
     * @param {string} correctAnswer - Correct conjugation
     * @returns {Object} Validation result with score and feedback
     */
    validateAnswer(userAnswer, correctAnswer) {
        const normalizedUser = this.normalizeSpanish(userAnswer);
        const normalizedCorrect = this.normalizeSpanish(correctAnswer);
        
        if (normalizedUser === normalizedCorrect) {
            return {
                correct: true,
                score: 1.0,
                feedback: 'Perfecto!'
            };
        }

        // Check for minor errors (accents, capitalization)
        const userNoAccents = this.removeAccents(normalizedUser);
        const correctNoAccents = this.removeAccents(normalizedCorrect);
        
        if (userNoAccents === correctNoAccents) {
            return {
                correct: true,
                score: 0.9,
                feedback: 'Correcto, pero falta acento'
            };
        }

        // Check Levenshtein distance for partial credit
        const distance = this.levenshteinDistance(normalizedUser, normalizedCorrect);
        const maxLen = Math.max(normalizedUser.length, normalizedCorrect.length);
        const similarity = 1 - (distance / maxLen);

        if (similarity >= 0.8) {
            return {
                correct: false,
                score: similarity * 0.5, // Partial credit
                feedback: 'Casi correcto, revisa la ortografia'
            };
        }

        return {
            correct: false,
            score: 0,
            feedback: 'Incorrecto'
        };
    }

    /**
     * Remove accents for comparison
     */
    removeAccents(text) {
        return text
            .replace(/[באהג]/g, 'a')
            .replace(/[יטכך]/g, 'e')
            .replace(/[םלןמ]/g, 'i')
            .replace(/[ףעצפ]/g, 'o')
            .replace(/[תשüû]/g, 'u')
            .replace(/ס/g, 'n');
    }

    /**
     * Calculate Levenshtein distance
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
     * Generate conjugation exercise
     * @param {Object} options - Exercise options
     * @returns {Object} Exercise object
     */
    generateExercise(options = {}) {
        const {
            verbFilter = () => true,
            tenseFilter = ['presente', 'preterito', 'imperfecto'],
            personFilter = this.pronouns,
            maxFrecuencia = 2
        } = options;

        const availableVerbs = this.verbs.filter(v => 
            v.frecuencia <= maxFrecuencia && verbFilter(v)
        );
        
        if (availableVerbs.length === 0) {
            throw new Error('No verbs match the given filters');
        }

        const verb = availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
        const tiempo = tenseFilter[Math.floor(Math.random() * tenseFilter.length)];
        const persona = personFilter[Math.floor(Math.random() * personFilter.length)];

        const correctAnswer = this.conjugate(verb.infinitivo, tiempo, persona);

        return {
            infinitivo: verb.infinitivo,
            traduccion: verb.traduccion,
            tiempo: tiempo,
            tiempoName: this.tenseNames[tiempo],
            persona: persona,
            correctAnswer: correctAnswer,
            tipo: verb.tipo,
            clase: verb.clase,
            prompt: `Conjugar "${verb.infinitivo}" (${verb.traduccion}) en ${this.tenseNames[tiempo]} para "${persona}"`
        };
    }

    /**
     * Get conjugator statistics
     */
    getStats() {
        if (!this.initialized) {
            return { error: 'Not initialized' };
        }

        const verbsByClass = {};
        const verbsByType = {};
        const verbsByFrequency = {};

        this.verbs.forEach(verb => {
            // By class
            verbsByClass[verb.clase] = (verbsByClass[verb.clase] || 0) + 1;
            
            // By type
            verbsByType[verb.tipo] = (verbsByType[verb.tipo] || 0) + 1;
            
            // By frequency
            verbsByFrequency[verb.frecuencia] = (verbsByFrequency[verb.frecuencia] || 0) + 1;
        });

        return {
            totalVerbs: this.verbs.length,
            verbsByClass,
            verbsByType,
            verbsByFrequency,
            supportedTenses: Object.keys(this.tenseNames),
            supportedPersons: this.pronouns
        };
    }
}

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpanishConjugator;
} else {
    window.SpanishConjugator = SpanishConjugator;
}