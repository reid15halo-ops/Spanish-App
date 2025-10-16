/**
 * Zeiten-Uebungssystem
 * Generiert spezifische Zeiten-Uebungen ohne Gamification
 * ASCII-compliant, No-Gamification
 */

class ZeitenExerciseGenerator {
    constructor(conjugator, items) {
        this.conjugator = conjugator;
        this.items = items || [];
        this.exerciseTypes = [
            'conjugate',      // Konjugiere
            'fill_gap',       // Luecke
            'identify_tense', // Finde die Zeit
            'build_sentence', // Satzbau
            'gerundio_participio' // Gerundio/Participio
        ];
        
        this.tenses = [
            'presente', 'preterito', 'imperfecto', 'futuro', 
            'condicional', 'perfecto', 'pluscuamperfecto'
        ];
        
        this.persons = ['yo', 'tu', 'el', 'nosotros', 'vosotros', 'ellos'];
        
        this.difficultyWeights = {
            regular: 1,
            stem_change: 2,
            irregular: 3,
            compound: 2
        };
    }

    /**
     * Generate exercise based on type and filters
     */
    generateExercise(type, filters = {}) {
        const { 
            tense = null, 
            tag = null, 
            difficulty = 'medium',
            person = null 
        } = filters;

        // Select exercise type
        const exerciseType = type || this.selectRandomType();

        // Generate based on type
        switch (exerciseType) {
            case 'conjugate':
                return this.generateConjugateExercise(tense, person, difficulty);
            
            case 'fill_gap':
                return this.generateFillGapExercise(tense, difficulty);
            
            case 'identify_tense':
                return this.generateIdentifyTenseExercise(difficulty);
            
            case 'build_sentence':
                return this.generateBuildSentenceExercise(tense, difficulty);
            
            case 'gerundio_participio':
                return this.generateGerundioParticicipioExercise(difficulty);
            
            default:
                return this.generateConjugateExercise(tense, person, difficulty);
        }
    }

    /**
     * Type 1: Konjugiere
     * infinitivo + tiempo + persona ? Eingabe
     */
    generateConjugateExercise(tense, person, difficulty) {
        const verb = this.selectVerb(difficulty);
        const selectedTense = tense || this.selectRandomTense();
        const selectedPerson = person || this.selectRandomPerson();

        try {
            const correctAnswer = this.conjugator.conjugate(
                verb.infinitivo, 
                selectedTense, 
                selectedPerson
            );

            return {
                type: 'conjugate',
                id: `conj_${Date.now()}_${Math.random()}`,
                verb: verb.infinitivo,
                verbTranslation: verb.traduccion,
                tense: selectedTense,
                tenseName: this.getTenseName(selectedTense),
                person: selectedPerson,
                difficulty: this.calculateDifficulty(verb, selectedTense),
                
                prompt: `Konjugiere "${verb.infinitivo}" (${verb.traduccion}) in ${this.getTenseName(selectedTense)} fuer "${selectedPerson}"`,
                
                correctAnswer: correctAnswer,
                
                validate: (userAnswer) => {
                    return this.validateConjugation(userAnswer, correctAnswer);
                },
                
                hints: [
                    `Zeitform: ${this.getTenseName(selectedTense)}`,
                    `Person: ${selectedPerson}`,
                    `Verbklasse: ${verb.clase || '-ar/-er/-ir'}`
                ]
            };
        } catch (error) {
            console.error('Error generating conjugate exercise:', error);
            // Fallback to simpler verb
            return this.generateConjugateExercise(tense, person, 'easy');
        }
    }

    /**
     * Type 2: Luecke
     * Satz mit __, Zielzeit vorgegeben
     */
    generateFillGapExercise(tense, difficulty) {
        const verb = this.selectVerb(difficulty);
        const selectedTense = tense || this.selectRandomTense();
        const person = this.selectRandomPerson();

        try {
            const correctAnswer = this.conjugator.conjugate(
                verb.infinitivo,
                selectedTense,
                person
            );

            // Generate sentence template
            const sentence = this.generateSentenceTemplate(verb, person, selectedTense);

            return {
                type: 'fill_gap',
                id: `gap_${Date.now()}_${Math.random()}`,
                verb: verb.infinitivo,
                verbTranslation: verb.traduccion,
                tense: selectedTense,
                tenseName: this.getTenseName(selectedTense),
                person: person,
                difficulty: this.calculateDifficulty(verb, selectedTense),
                
                prompt: `Fuellen Sie die Luecke mit der richtigen Form von "${verb.infinitivo}" in ${this.getTenseName(selectedTense)}:`,
                sentence: sentence,
                
                correctAnswer: correctAnswer,
                
                validate: (userAnswer) => {
                    return this.validateConjugation(userAnswer, correctAnswer);
                },
                
                hints: [
                    `Zeitform: ${this.getTenseName(selectedTense)}`,
                    `Person: ${person}`,
                    `Infinitiv: ${verb.infinitivo}`
                ]
            };
        } catch (error) {
            console.error('Error generating fill gap exercise:', error);
            return this.generateFillGapExercise(tense, 'easy');
        }
    }

    /**
     * Type 3: Finde die Zeit
     * Form gegeben ? Nutzer waehlt Zeit/Person
     */
    generateIdentifyTenseExercise(difficulty) {
        const verb = this.selectVerb(difficulty);
        const tense = this.selectRandomTense();
        const person = this.selectRandomPerson();

        try {
            const conjugatedForm = this.conjugator.conjugate(
                verb.infinitivo,
                tense,
                person
            );

            // Generate wrong options
            const wrongTenses = this.generateWrongTenseOptions(tense);
            const wrongPersons = this.generateWrongPersonOptions(person);

            return {
                type: 'identify_tense',
                id: `ident_${Date.now()}_${Math.random()}`,
                verb: verb.infinitivo,
                verbTranslation: verb.traduccion,
                conjugatedForm: conjugatedForm,
                difficulty: this.calculateDifficulty(verb, tense),
                
                prompt: `Welche Zeitform und Person ist "${conjugatedForm}" von "${verb.infinitivo}"?`,
                
                correctTense: tense,
                correctTenseName: this.getTenseName(tense),
                correctPerson: person,
                
                tenseOptions: [tense, ...wrongTenses].sort(() => Math.random() - 0.5),
                personOptions: [person, ...wrongPersons].sort(() => Math.random() - 0.5),
                
                validate: (userTense, userPerson) => {
                    return {
                        tenseCorrect: userTense === tense,
                        personCorrect: userPerson === person,
                        fullyCorrect: userTense === tense && userPerson === person,
                        feedback: this.generateIdentifyFeedback(userTense, tense, userPerson, person)
                    };
                },
                
                hints: [
                    `Infinitiv: ${verb.infinitivo}`,
                    `Achten Sie auf die Endung`,
                    `Achten Sie auf Signalwoerter im Kontext`
                ]
            };
        } catch (error) {
            console.error('Error generating identify tense exercise:', error);
            return this.generateIdentifyTenseExercise('easy');
        }
    }

    /**
     * Type 4: Satzbau
     * Gegebene Tokens mischen; Zielzeit soll korrekt flektiert sein
     */
    generateBuildSentenceExercise(tense, difficulty) {
        const verb = this.selectVerb(difficulty);
        const selectedTense = tense || this.selectRandomTense();
        const person = this.selectRandomPerson();

        try {
            const conjugatedVerb = this.conjugator.conjugate(
                verb.infinitivo,
                selectedTense,
                person
            );

            // Generate sentence components
            const sentenceData = this.generateSentenceComponents(
                person, 
                conjugatedVerb, 
                verb,
                selectedTense
            );

            // Shuffle tokens
            const shuffledTokens = [...sentenceData.tokens].sort(() => Math.random() - 0.5);

            return {
                type: 'build_sentence',
                id: `build_${Date.now()}_${Math.random()}`,
                verb: verb.infinitivo,
                verbTranslation: verb.traduccion,
                tense: selectedTense,
                tenseName: this.getTenseName(selectedTense),
                person: person,
                difficulty: this.calculateDifficulty(verb, selectedTense),
                
                prompt: `Bauen Sie einen korrekten Satz in ${this.getTenseName(selectedTense)} mit den gegebenen Woertern:`,
                tokens: shuffledTokens,
                
                correctSentence: sentenceData.correctSentence,
                correctOrder: sentenceData.tokens,
                
                validate: (userSentence) => {
                    return this.validateSentence(userSentence, sentenceData.correctSentence);
                },
                
                hints: [
                    `Zeitform: ${this.getTenseName(selectedTense)}`,
                    `Person: ${person}`,
                    `Die konjugierte Verbform ist: ${conjugatedVerb}`
                ]
            };
        } catch (error) {
            console.error('Error generating build sentence exercise:', error);
            return this.generateBuildSentenceExercise(tense, 'easy');
        }
    }

    /**
     * Type 5: Gerundio/Participio
     * Formen bilden und einsetzen
     */
    generateGerundioParticicipioExercise(difficulty) {
        const verb = this.selectVerb(difficulty);
        const formType = Math.random() > 0.5 ? 'gerundio' : 'participio';

        try {
            const verbData = this.conjugator.findVerb(verb.infinitivo);
            const correctAnswer = verbData[formType];

            // Generate sentence context
            const sentenceContext = this.generateGerundioParticicipioContext(
                verb,
                formType,
                correctAnswer
            );

            return {
                type: 'gerundio_participio',
                id: `gerpar_${Date.now()}_${Math.random()}`,
                verb: verb.infinitivo,
                verbTranslation: verb.traduccion,
                formType: formType,
                formTypeName: formType === 'gerundio' ? 'Gerundium' : 'Partizip',
                difficulty: this.calculateDifficulty(verb, 'special_form'),
                
                prompt: `Bilden Sie das ${formType === 'gerundio' ? 'Gerundium' : 'Partizip'} von "${verb.infinitivo}" (${verb.traduccion}):`,
                context: sentenceContext,
                
                correctAnswer: correctAnswer,
                
                validate: (userAnswer) => {
                    return this.validateConjugation(userAnswer, correctAnswer);
                },
                
                hints: [
                    `Infinitiv: ${verb.infinitivo}`,
                    `Form: ${formType === 'gerundio' ? 'Gerundium (-ando/-iendo)' : 'Partizip (-ado/-ido)'}`,
                    `Achten Sie auf Irregularitaeten`
                ]
            };
        } catch (error) {
            console.error('Error generating gerundio/participio exercise:', error);
            return this.generateGerundioParticicipioExercise('easy');
        }
    }

    /**
     * Helper: Select verb based on difficulty
     */
    selectVerb(difficulty) {
        const verbs = this.conjugator.verbs;
        
        let filteredVerbs;
        switch (difficulty) {
            case 'easy':
                filteredVerbs = verbs.filter(v => 
                    v.frecuencia <= 1 && 
                    (v.clase === '-ar' || v.clase === '-er' || v.clase === '-ir')
                );
                break;
            
            case 'medium':
                filteredVerbs = verbs.filter(v => v.frecuencia <= 2);
                break;
            
            case 'hard':
                filteredVerbs = verbs;
                break;
            
            default:
                filteredVerbs = verbs.filter(v => v.frecuencia <= 2);
        }

        if (filteredVerbs.length === 0) {
            filteredVerbs = verbs;
        }

        return filteredVerbs[Math.floor(Math.random() * filteredVerbs.length)];
    }

    /**
     * Helper: Select random tense
     */
    selectRandomTense() {
        return this.tenses[Math.floor(Math.random() * this.tenses.length)];
    }

    /**
     * Helper: Select random person
     */
    selectRandomPerson() {
        return this.persons[Math.floor(Math.random() * this.persons.length)];
    }

    /**
     * Helper: Select random exercise type
     */
    selectRandomType() {
        return this.exerciseTypes[Math.floor(Math.random() * this.exerciseTypes.length)];
    }

    /**
     * Helper: Get tense display name
     */
    getTenseName(tense) {
        const names = {
            'presente': 'Presente',
            'preterito': 'PretÈrito Indefinido',
            'imperfecto': 'Imperfecto',
            'futuro': 'Futuro Simple',
            'condicional': 'Condicional',
            'perfecto': 'PretÈrito Perfecto',
            'pluscuamperfecto': 'Pluscuamperfecto'
        };
        return names[tense] || tense;
    }

    /**
     * Helper: Calculate exercise difficulty
     */
    calculateDifficulty(verb, tense) {
        let score = 0;

        // Verb class weight
        if (verb.clase === '-ar') score += 1;
        else if (verb.clase === '-er' || verb.clase === '-ir') score += 2;
        else score += 3; // irregular or stem-changing

        // Tense complexity
        if (tense === 'presente') score += 1;
        else if (tense === 'preterito' || tense === 'imperfecto') score += 2;
        else if (tense === 'perfecto' || tense === 'pluscuamperfecto') score += 3;
        else score += 2;

        // Frequency
        score += verb.frecuencia || 1;

        if (score <= 4) return 'easy';
        if (score <= 7) return 'medium';
        return 'hard';
    }

    /**
     * Validation: Conjugation with fuzzy matching (accent-tolerant)
     */
    validateConjugation(userAnswer, correctAnswer) {
        const normalized1 = this.normalizeForComparison(userAnswer);
        const normalized2 = this.normalizeForComparison(correctAnswer);

        // Exact match
        if (normalized1 === normalized2) {
            return {
                correct: true,
                score: 1.0,
                feedback: 'Perfekt!',
                exactMatch: true
            };
        }

        // Accent-tolerant match
        const noAccent1 = this.removeAccents(normalized1);
        const noAccent2 = this.removeAccents(normalized2);

        if (noAccent1 === noAccent2) {
            return {
                correct: true,
                score: 0.95,
                feedback: 'Richtig, aber Akzent fehlt oder falsch',
                exactMatch: false,
                missingAccent: true
            };
        }

        // Partial credit for close answers
        const similarity = this.calculateSimilarity(normalized1, normalized2);
        if (similarity >= 0.8) {
            return {
                correct: false,
                score: similarity * 0.5,
                feedback: 'Fast richtig, pruefen Sie die Rechtschreibung',
                partialCredit: true,
                similarity: similarity
            };
        }

        return {
            correct: false,
            score: 0,
            feedback: `Falsch. Die richtige Antwort ist: ${correctAnswer}`,
            exactMatch: false
        };
    }

    /**
     * Helper: Normalize for comparison
     */
    normalizeForComparison(text) {
        return text.toLowerCase().trim();
    }

    /**
     * Helper: Remove accents
     */
    removeAccents(text) {
        return text
            .replace(/[·‡‰‚]/g, 'a')
            .replace(/[ÈËÎÍ]/g, 'e')
            .replace(/[ÌÏÔÓ]/g, 'i')
            .replace(/[ÛÚˆÙ]/g, 'o')
            .replace(/[˙˘¸˚]/g, 'u')
            .replace(/Ò/g, 'n');
    }

    /**
     * Helper: Calculate string similarity (Levenshtein-based)
     */
    calculateSimilarity(str1, str2) {
        const distance = this.levenshteinDistance(str1, str2);
        const maxLen = Math.max(str1.length, str2.length);
        return 1 - (distance / maxLen);
    }

    /**
     * Helper: Levenshtein distance
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
     * Generate sentence template for fill gap exercise
     */
    generateSentenceTemplate(verb, person, tense) {
        const templates = {
            'yo': {
                'presente': `Yo ___ ${verb.infinitivo === 'hablar' ? 'espaÒol' : 'mucho'}.`,
                'preterito': `Ayer yo ___ ${verb.infinitivo === 'comer' ? 'paella' : 'algo'}.`,
                'imperfecto': `Cuando era joven, yo ___ ${verb.infinitivo === 'jugar' ? 'f˙tbol' : 'mucho'}.`,
                'futuro': `MaÒana yo ___ ${verb.infinitivo === 'ir' ? 'al cine' : 'eso'}.`,
                'condicional': `Yo ___ ${verb.infinitivo === 'gustar' ? 'viajar' : 'hacerlo'}.`
            },
            'tu': {
                'presente': `T˙ ___ ${verb.infinitivo === 'vivir' ? 'en Madrid' : 'mucho'}.`,
                'preterito': `Ayer t˙ ___ ${verb.infinitivo === 'ver' ? 'la pelÌcula' : 'algo'}.`,
                'imperfecto': `Antes t˙ ___ ${verb.infinitivo === 'estudiar' ? 'mucho' : 'eso'}.`,
                'futuro': `MaÒana t˙ ___ ${verb.infinitivo === 'venir' ? 'a mi casa' : 'eso'}.`,
                'condicional': `T˙ ___ ${verb.infinitivo === 'poder' ? 'hacerlo' : 'eso'}.`
            },
            'el': {
                'presente': `…l ___ ${verb.infinitivo === 'trabajar' ? 'aquÌ' : 'mucho'}.`,
                'preterito': `Ayer Èl ___ ${verb.infinitivo === 'hacer' ? 'la tarea' : 'algo'}.`,
                'imperfecto': `Antes Èl ___ ${verb.infinitivo === 'ser' ? 'profesor' : 'feliz'}.`,
                'futuro': `MaÒana Èl ___ ${verb.infinitivo === 'salir' ? 'temprano' : 'eso'}.`,
                'condicional': `…l ___ ${verb.infinitivo === 'deber' ? 'estudiar' : 'hacerlo'}.`
            },
            'nosotros': {
                'presente': `Nosotros ___ ${verb.infinitivo === 'comer' ? 'juntos' : 'mucho'}.`,
                'preterito': `Ayer nosotros ___ ${verb.infinitivo === 'ir' ? 'al parque' : 'algo'}.`,
                'imperfecto': `Antes nosotros ___ ${verb.infinitivo === 'vivir' ? 'en Barcelona' : 'felices'}.`,
                'futuro': `MaÒana nosotros ___ ${verb.infinitivo === 'viajar' ? 'a Madrid' : 'eso'}.`,
                'condicional': `Nosotros ___ ${verb.infinitivo === 'querer' ? 'ayudar' : 'hacerlo'}.`
            },
            'vosotros': {
                'presente': `Vosotros ___ ${verb.infinitivo === 'hablar' ? 'espaÒol' : 'mucho'}.`,
                'preterito': `Ayer vosotros ___ ${verb.infinitivo === 'comprar' ? 'pan' : 'algo'}.`,
                'imperfecto': `Antes vosotros ___ ${verb.infinitivo === 'jugar' ? 'f˙tbol' : 'mucho'}.`,
                'futuro': `MaÒana vosotros ___ ${verb.infinitivo === 'venir' ? 'aquÌ' : 'eso'}.`,
                'condicional': `Vosotros ___ ${verb.infinitivo === 'poder' ? 'hacerlo' : 'eso'}.`
            },
            'ellos': {
                'presente': `Ellos ___ ${verb.infinitivo === 'estudiar' ? 'mucho' : 'bien'}.`,
                'preterito': `Ayer ellos ___ ${verb.infinitivo === 'llegar' ? 'tarde' : 'algo'}.`,
                'imperfecto': `Antes ellos ___ ${verb.infinitivo === 'tener' ? 'un coche' : 'eso'}.`,
                'futuro': `MaÒana ellos ___ ${verb.infinitivo === 'hacer' ? 'la tarea' : 'eso'}.`,
                'condicional': `Ellos ___ ${verb.infinitivo === 'gustar' ? 'venir' : 'hacerlo'}.`
            }
        };

        return templates[person]?.[tense] || `___ (${person}, ${tense}).`;
    }

    /**
     * Generate wrong tense options for identify exercise
     */
    generateWrongTenseOptions(correctTense) {
        const otherTenses = this.tenses.filter(t => t !== correctTense);
        const shuffled = otherTenses.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
    }

    /**
     * Generate wrong person options for identify exercise
     */
    generateWrongPersonOptions(correctPerson) {
        const otherPersons = this.persons.filter(p => p !== correctPerson);
        const shuffled = otherPersons.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
    }

    /**
     * Generate feedback for identify exercise
     */
    generateIdentifyFeedback(userTense, correctTense, userPerson, correctPerson) {
        if (userTense === correctTense && userPerson === correctPerson) {
            return 'Perfekt! Beides richtig!';
        }
        
        if (userTense === correctTense) {
            return `Zeitform richtig, aber falsche Person. Richtig: ${correctPerson}`;
        }
        
        if (userPerson === correctPerson) {
            return `Person richtig, aber falsche Zeitform. Richtig: ${this.getTenseName(correctTense)}`;
        }
        
        return `Beides falsch. Richtig: ${this.getTenseName(correctTense)}, ${correctPerson}`;
    }

    /**
     * Generate sentence components for build sentence exercise
     */
    generateSentenceComponents(person, conjugatedVerb, verb, tense) {
        const pronounWord = person;
        const verbWord = conjugatedVerb;
        
        // Generate additional words based on verb type
        const additionalWords = this.getAdditionalWords(verb, tense);
        
        const tokens = [pronounWord, verbWord, ...additionalWords];
        const correctSentence = tokens.join(' ') + '.';
        
        return {
            tokens: tokens,
            correctSentence: correctSentence
        };
    }

    /**
     * Get additional words for sentence
     */
    getAdditionalWords(verb, tense) {
        const wordSets = {
            'hablar': ['espaÒol', 'con', 'mi', 'amigo'],
            'comer': ['paella', 'en', 'un', 'restaurante'],
            'vivir': ['en', 'Madrid'],
            'trabajar': ['en', 'una', 'oficina'],
            'estudiar': ['espaÒol', 'cada', 'dÌa'],
            'default': ['mucho']
        };

        const words = wordSets[verb.infinitivo] || wordSets['default'];
        return words.slice(0, Math.floor(Math.random() * 2) + 2);
    }

    /**
     * Validate sentence construction
     */
    validateSentence(userSentence, correctSentence) {
        const normalized1 = this.normalizeForComparison(userSentence.replace(/\./g, ''));
        const normalized2 = this.normalizeForComparison(correctSentence.replace(/\./g, ''));

        if (normalized1 === normalized2) {
            return {
                correct: true,
                score: 1.0,
                feedback: 'Perfekt! Satz korrekt gebaut!'
            };
        }

        // Check if all words are present
        const words1 = normalized1.split(/\s+/).sort();
        const words2 = normalized2.split(/\s+/).sort();
        
        const allWordsPresent = words1.length === words2.length && 
                                words1.every((word, i) => word === words2[i]);

        if (allWordsPresent) {
            return {
                correct: true,
                score: 0.9,
                feedback: 'Alle Woerter vorhanden, aber Reihenfolge nicht optimal'
            };
        }

        return {
            correct: false,
            score: 0,
            feedback: `Nicht korrekt. Richtiger Satz: ${correctSentence}`
        };
    }

    /**
     * Generate context for gerundio/participio exercise
     */
    generateGerundioParticicipioContext(verb, formType, correctAnswer) {
        if (formType === 'gerundio') {
            return `Estoy ___ (${verb.infinitivo}).`;
        } else {
            return `He ___ (${verb.infinitivo}).`;
        }
    }

    /**
     * Generate batch of exercises
     */
    generateBatch(count = 10, filters = {}) {
        const exercises = [];
        
        for (let i = 0; i < count; i++) {
            try {
                const exercise = this.generateExercise(null, filters);
                exercises.push(exercise);
            } catch (error) {
                console.error(`Error generating exercise ${i}:`, error);
            }
        }
        
        return exercises;
    }

    /**
     * Validate all exercise types work
     */
    validateAllTypes() {
        const results = {
            total: 0,
            successful: 0,
            failed: 0,
            errors: []
        };

        this.exerciseTypes.forEach(type => {
            try {
                results.total++;
                const exercise = this.generateExercise(type);
                
                if (exercise && exercise.type === type && exercise.correctAnswer) {
                    results.successful++;
                } else {
                    results.failed++;
                    results.errors.push({
                        type: type,
                        error: 'Invalid exercise structure'
                    });
                }
            } catch (error) {
                results.failed++;
                results.errors.push({
                    type: type,
                    error: error.message
                });
            }
        });

        return results;
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.ZeitenExerciseGenerator = ZeitenExerciseGenerator;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZeitenExerciseGenerator;
}
