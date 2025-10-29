/**
 * Phase 1 Exercise Generator
 *
 * Generates comprehensive exercises for Phase 1 (A1 level)
 * Covers all 7 learning units with progressive difficulty
 */

class Phase1ExerciseGenerator {
    constructor() {
        this.vocabulary = null;
        this.currentUnit = 1;
        this.units = this.initializeUnits();
    }

    /**
     * Initialize the 7 learning units of Phase 1
     */
    initializeUnits() {
        return {
            unit1: {
                id: 1,
                name: 'Personalpronomen & Grundlagen',
                duration_days: '2-3',
                concepts: ['pronouns', 'formal-informal'],
                exercises: 20
            },
            unit2: {
                id: 2,
                name: 'Verb SER - Identität & Eigenschaften',
                duration_days: '3-4',
                concepts: ['ser-conjugation', 'ser-usage', 'identity', 'profession', 'nationality'],
                exercises: 35
            },
            unit3: {
                id: 3,
                name: 'Verb ESTAR - Ort & Zustand',
                duration_days: '3-4',
                concepts: ['estar-conjugation', 'estar-usage', 'location', 'states'],
                exercises: 35
            },
            unit4: {
                id: 4,
                name: 'SER vs. ESTAR - Der große Kontrast',
                duration_days: '3-4',
                concepts: ['ser-estar-contrast', 'permanent-temporary', 'meaning-changes'],
                exercises: 40
            },
            unit5: {
                id: 5,
                name: 'Verb TENER - Besitz & Alter',
                duration_days: '2-3',
                concepts: ['tener-conjugation', 'possession', 'age', 'tener-idioms'],
                exercises: 30
            },
            unit6: {
                id: 6,
                name: 'Zahlen, Farben & Grundvokabular',
                duration_days: '3-4',
                concepts: ['numbers-0-20', 'colors', 'basic-vocabulary'],
                exercises: 35
            },
            unit7: {
                id: 7,
                name: 'Integration & Konversation',
                duration_days: '3-4',
                concepts: ['integration', 'conversation', 'all-concepts'],
                exercises: 30
            }
        };
    }

    /**
     * Load vocabulary database
     */
    async loadVocabulary() {
        try {
            const response = await fetch('/data/phase1-vocabulary.json');
            const data = await response.json();
            this.vocabulary = data;
            return data;
        } catch (error) {
            console.error('Failed to load Phase 1 vocabulary:', error);
            return null;
        }
    }

    // =========================================================================
    // UNIT 1: Personalpronomen
    // =========================================================================

    /**
     * Generate pronoun identification exercise
     */
    generatePronounIdentification() {
        const scenarios = [
            { de: 'Maria und ich (weiblich)', correct: 'nosotras', options: ['nosotros', 'nosotras', 'ellas', 'vosotras'] },
            { de: 'Mein Vater', correct: 'él', options: ['yo', 'tú', 'él', 'ellos'] },
            { de: 'Du (zu einem Freund)', correct: 'tú', options: ['tú', 'usted', 'vosotros', 'ustedes'] },
            { de: 'Sie (zu einem Professor)', correct: 'usted', options: ['tú', 'usted', 'él', 'ellos'] },
            { de: 'Lisa und Anna', correct: 'ellas', options: ['ellos', 'ellas', 'nosotras', 'vosotras'] },
            { de: 'Pedro und ich (männlich)', correct: 'nosotros', options: ['nosotros', 'nosotras', 'ellos', 'vosotros'] },
            { de: 'Ihr (in Spanien, gemischt)', correct: 'vosotros', options: ['vosotros', 'vosotras', 'ustedes', 'ellos'] },
            { de: 'Meine Mutter', correct: 'ella', options: ['yo', 'tú', 'ella', 'ellas'] }
        ];

        const selected = scenarios[Math.floor(Math.random() * scenarios.length)];

        return {
            type: 'multiple-choice',
            unit: 1,
            concept: 'pronouns',
            question: `Welches Pronomen passt? ${selected.de}`,
            options: selected.options.sort(() => Math.random() - 0.5),
            correctAnswer: selected.correct,
            explanation: `${selected.de} → ${selected.correct}`,
            difficulty: 1
        };
    }

    /**
     * Generate formal/informal exercise
     */
    generateFormalInformalExercise() {
        const scenarios = [
            { situation: 'Mit deinem kleinen Bruder', correct: 'tú', formal: false },
            { situation: 'Mit einem Arzt', correct: 'usted', formal: true },
            { situation: 'Mit deiner Lehrerin (höflich)', correct: 'usted', formal: true },
            { situation: 'Mit deinem besten Freund', correct: 'tú', formal: false },
            { situation: 'Mit einer Gruppe Kinder', correct: 'vosotros/ustedes', formal: false },
            { situation: 'Mit dem Chef', correct: 'usted', formal: true },
            { situation: 'Mit deiner Oma', correct: 'tú/usted', formal: 'both' }
        ];

        const selected = scenarios[Math.floor(Math.random() * scenarios.length)];

        return {
            type: 'multiple-choice',
            unit: 1,
            concept: 'formal-informal',
            question: `Welches Pronomen verwendest du? ${selected.situation}`,
            options: ['tú', 'usted', 'vosotros', 'ustedes'],
            correctAnswer: selected.correct,
            explanation: selected.formal ? 'Formelle Situation → usted' : 'Informelle Situation → tú',
            difficulty: 2
        };
    }

    // =========================================================================
    // UNIT 2: Verb SER
    // =========================================================================

    /**
     * Generate SER conjugation drill
     */
    generateSerConjugation() {
        const pronouns = [
            { es: 'yo', form: 'soy', de: 'ich bin' },
            { es: 'tú', form: 'eres', de: 'du bist' },
            { es: 'él', form: 'es', de: 'er ist' },
            { es: 'ella', form: 'es', de: 'sie ist' },
            { es: 'usted', form: 'es', de: 'Sie sind' },
            { es: 'nosotros', form: 'somos', de: 'wir sind' },
            { es: 'nosotras', form: 'somos', de: 'wir sind' },
            { es: 'vosotros', form: 'sois', de: 'ihr seid' },
            { es: 'ellos', form: 'son', de: 'sie sind' },
            { es: 'ellas', form: 'son', de: 'sie sind' },
            { es: 'ustedes', form: 'son', de: 'Sie sind' }
        ];

        const selected = pronouns[Math.floor(Math.random() * pronouns.length)];
        const adjectives = ['profesor', 'estudiante', 'alemán', 'español', 'alto', 'inteligente'];
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];

        return {
            type: 'fill-blank',
            unit: 2,
            concept: 'ser-conjugation',
            question: `${selected.es.charAt(0).toUpperCase() + selected.es.slice(1)} _______ ${adj}.`,
            correctAnswer: selected.form,
            hint: selected.de,
            explanation: `Bei "${selected.es}" verwendest du "${selected.form}": ${selected.es} ${selected.form} ${adj}`,
            difficulty: selected.es === 'yo' || selected.es === 'tú' ? 1 : 2
        };
    }

    /**
     * Generate SER usage exercise (identity/profession/nationality)
     */
    generateSerUsageExercise() {
        const exercises = [
            {
                de: 'Ich bin Lehrer',
                es: 'Yo soy profesor',
                category: 'profession'
            },
            {
                de: 'Du bist Deutsche',
                es: 'Tú eres alemana',
                category: 'nationality'
            },
            {
                de: 'Er ist intelligent',
                es: 'Él es inteligente',
                category: 'characteristic'
            },
            {
                de: 'Wir sind Studenten',
                es: 'Nosotros somos estudiantes',
                category: 'profession'
            },
            {
                de: 'Sie (plural) sind jung',
                es: 'Ellos son jóvenes',
                category: 'characteristic'
            },
            {
                de: 'Ich bin Maria',
                es: 'Yo soy Maria',
                category: 'identity'
            }
        ];

        const selected = exercises[Math.floor(Math.random() * exercises.length)];

        return {
            type: 'translation',
            unit: 2,
            concept: 'ser-usage',
            direction: 'de-es',
            question: selected.de,
            correctAnswer: selected.es,
            explanation: `SER wird für ${selected.category === 'profession' ? 'Berufe' : selected.category === 'nationality' ? 'Nationalitäten' : selected.category === 'identity' ? 'Identität' : 'permanente Eigenschaften'} verwendet.`,
            difficulty: 2
        };
    }

    /**
     * Generate SER error correction exercise
     */
    generateSerErrorCorrection() {
        const errors = [
            { wrong: 'Yo es profesor', correct: 'Yo soy profesor', error: 'Falsche Form bei "yo"' },
            { wrong: 'Tú soy alemán', correct: 'Tú eres alemán', error: 'Falsche Form bei "tú"' },
            { wrong: 'Él eres alto', correct: 'Él es alto', error: 'Falsche Form bei "él"' },
            { wrong: 'Ellos es estudiantes', correct: 'Ellos son estudiantes', error: 'Falsche Form bei "ellos"' },
            { wrong: 'Nosotros sois amigos', correct: 'Nosotros somos amigos', error: 'Falsche Form bei "nosotros"' }
        ];

        const selected = errors[Math.floor(Math.random() * errors.length)];

        return {
            type: 'error-correction',
            unit: 2,
            concept: 'ser-conjugation',
            question: `Korrigiere den Fehler: ${selected.wrong}`,
            correctAnswer: selected.correct,
            explanation: selected.error,
            difficulty: 2
        };
    }

    // =========================================================================
    // UNIT 3: Verb ESTAR
    // =========================================================================

    /**
     * Generate ESTAR conjugation drill
     */
    generateEstarConjugation() {
        const pronouns = [
            { es: 'yo', form: 'estoy', de: 'ich bin' },
            { es: 'tú', form: 'estás', de: 'du bist' },
            { es: 'él', form: 'está', de: 'er ist' },
            { es: 'ella', form: 'está', de: 'sie ist' },
            { es: 'nosotros', form: 'estamos', de: 'wir sind' },
            { es: 'vosotros', form: 'estáis', de: 'ihr seid' },
            { es: 'ellos', form: 'están', de: 'sie sind' }
        ];

        const selected = pronouns[Math.floor(Math.random() * pronouns.length)];
        const locations = ['en casa', 'en Madrid', 'aquí', 'en el parque', 'allí'];
        const states = ['cansado', 'feliz', 'triste', 'ocupado', 'enfermo'];
        const useLocation = Math.random() > 0.5;
        const complement = useLocation
            ? locations[Math.floor(Math.random() * locations.length)]
            : states[Math.floor(Math.random() * states.length)];

        return {
            type: 'fill-blank',
            unit: 3,
            concept: 'estar-conjugation',
            question: `${selected.es.charAt(0).toUpperCase() + selected.es.slice(1)} _______ ${complement}.`,
            correctAnswer: selected.form,
            hint: selected.de,
            explanation: `Bei "${selected.es}" verwendest du "${selected.form}": ${selected.es} ${selected.form} ${complement}`,
            difficulty: selected.es === 'yo' || selected.es === 'tú' ? 1 : 2
        };
    }

    /**
     * Generate ESTAR with location exercise
     */
    generateEstarLocationExercise() {
        const exercises = [
            { de: 'Ich bin zu Hause', es: 'Yo estoy en casa' },
            { de: 'Du bist in Madrid', es: 'Tú estás en Madrid' },
            { de: 'Er ist im Park', es: 'Él está en el parque' },
            { de: 'Wir sind hier', es: 'Nosotros estamos aquí' },
            { de: 'Sie (plural) sind dort', es: 'Ellos están allí' },
            { de: 'Sie (formell) sind in der Schule', es: 'Usted está en la escuela' }
        ];

        const selected = exercises[Math.floor(Math.random() * exercises.length)];

        return {
            type: 'translation',
            unit: 3,
            concept: 'estar-location',
            direction: 'de-es',
            question: selected.de,
            correctAnswer: selected.es,
            explanation: 'ESTAR wird für Ortsangaben verwendet.',
            difficulty: 2
        };
    }

    /**
     * Generate ESTAR accent exercise
     */
    generateEstarAccentExercise() {
        const exercises = [
            { question: 'Tu estas cansado', correct: 'Tú estás cansado', missing: 'Akzente bei "Tú" und "estás"' },
            { question: 'El esta en casa', correct: 'Él está en casa', missing: 'Akzent bei "está"' },
            { question: 'Ellos estan aqui', correct: 'Ellos están aquí', missing: 'Akzente bei "están" und "aquí"' }
        ];

        const selected = exercises[Math.floor(Math.random() * exercises.length)];

        return {
            type: 'accent-correction',
            unit: 3,
            concept: 'estar-accents',
            question: `Setze die fehlenden Akzente: ${selected.question}`,
            correctAnswer: selected.correct,
            explanation: selected.missing,
            difficulty: 2
        };
    }

    // =========================================================================
    // UNIT 4: SER vs. ESTAR Contrast
    // =========================================================================

    /**
     * Generate SER vs ESTAR choice exercise
     */
    generateSerEstarChoice() {
        const exercises = [
            { sentence: 'Yo _____ profesor', correct: 'soy', reason: 'Beruf → SER', wrongOption: 'estoy' },
            { sentence: 'Tú _____ en casa', correct: 'estás', reason: 'Ort → ESTAR', wrongOption: 'eres' },
            { sentence: 'Él _____ cansado hoy', correct: 'está', reason: 'Temporärer Zustand → ESTAR', wrongOption: 'es' },
            { sentence: 'Nosotros _____ alemanes', correct: 'somos', reason: 'Nationalität → SER', wrongOption: 'estamos' },
            { sentence: 'Ella _____ muy inteligente', correct: 'es', reason: 'Permanente Eigenschaft → SER', wrongOption: 'está' },
            { sentence: 'Ellos _____ en Madrid', correct: 'están', reason: 'Ort → ESTAR', wrongOption: 'son' },
            { sentence: 'La mesa _____ de madera', correct: 'es', reason: 'Material → SER', wrongOption: 'está' },
            { sentence: 'Yo _____ feliz ahora', correct: 'estoy', reason: 'Temporärer Zustand → ESTAR', wrongOption: 'soy' },
            { sentence: '_____ las tres', correct: 'Son', reason: 'Uhrzeit → SER', wrongOption: 'Están' },
            { sentence: 'Vosotros _____ estudiantes', correct: 'sois', reason: 'Identität → SER', wrongOption: 'estáis' }
        ];

        const selected = exercises[Math.floor(Math.random() * exercises.length)];

        return {
            type: 'multiple-choice',
            unit: 4,
            concept: 'ser-estar-contrast',
            question: selected.sentence,
            options: [selected.correct, selected.wrongOption].sort(() => Math.random() - 0.5),
            correctAnswer: selected.correct,
            explanation: selected.reason,
            difficulty: 3
        };
    }

    /**
     * Generate meaning-change exercise (ser listo vs estar listo)
     */
    generateMeaningChangeExercise() {
        const pairs = [
            {
                ser: { es: 'Él es listo', de: 'Er ist schlau/intelligent', meaning: 'schlau' },
                estar: { es: 'Él está listo', de: 'Er ist bereit', meaning: 'bereit' }
            },
            {
                ser: { es: 'La sopa es buena', de: 'Die Suppe ist gut (Qualität)', meaning: 'gut (Qualität)' },
                estar: { es: 'La sopa está buena', de: 'Die Suppe schmeckt gut', meaning: 'lecker' }
            },
            {
                ser: { es: 'Soy aburrido', de: 'Ich bin langweilig (Person)', meaning: 'langweilig' },
                estar: { es: 'Estoy aburrido', de: 'Ich bin gelangweilt', meaning: 'gelangweilt' }
            },
            {
                ser: { es: 'Es rico', de: 'Er ist reich', meaning: 'reich' },
                estar: { es: 'Está rico', de: 'Es schmeckt lecker', meaning: 'lecker' }
            }
        ];

        const selected = pairs[Math.floor(Math.random() * pairs.length)];
        const useSer = Math.random() > 0.5;
        const sentence = useSer ? selected.ser : selected.estar;

        return {
            type: 'meaning-interpretation',
            unit: 4,
            concept: 'meaning-changes',
            question: `Was bedeutet: "${sentence.es}"?`,
            options: [sentence.de, useSer ? selected.estar.de : selected.ser.de].sort(() => Math.random() - 0.5),
            correctAnswer: sentence.de,
            explanation: `${sentence.meaning}`,
            difficulty: 4
        };
    }

    /**
     * Generate SER/ESTAR error correction
     */
    generateSerEstarErrorCorrection() {
        const errors = [
            { wrong: 'Yo soy en casa', correct: 'Yo estoy en casa', error: 'Ort → ESTAR' },
            { wrong: 'Tú estás profesor', correct: 'Tú eres profesor', error: 'Beruf → SER' },
            { wrong: 'Nosotros estamos alemanes', correct: 'Nosotros somos alemanes', error: 'Nationalität → SER' },
            { wrong: 'Ella es en Madrid', correct: 'Ella está en Madrid', error: 'Ort → ESTAR' },
            { wrong: 'Ellos están estudiantes', correct: 'Ellos son estudiantes', error: 'Beruf → SER' }
        ];

        const selected = errors[Math.floor(Math.random() * errors.length)];

        return {
            type: 'error-correction',
            unit: 4,
            concept: 'ser-estar-contrast',
            question: `Korrigiere: ${selected.wrong}`,
            correctAnswer: selected.correct,
            explanation: selected.error,
            difficulty: 3
        };
    }

    // =========================================================================
    // UNIT 5: Verb TENER
    // =========================================================================

    /**
     * Generate TENER conjugation drill
     */
    generateTenerConjugation() {
        const pronouns = [
            { es: 'yo', form: 'tengo', de: 'ich habe' },
            { es: 'tú', form: 'tienes', de: 'du hast' },
            { es: 'él', form: 'tiene', de: 'er hat' },
            { es: 'nosotros', form: 'tenemos', de: 'wir haben' },
            { es: 'ellos', form: 'tienen', de: 'sie haben' }
        ];

        const selected = pronouns[Math.floor(Math.random() * pronouns.length)];
        const objects = ['un perro', 'un gato', 'una casa', 'dos hermanos', 'un coche'];
        const obj = objects[Math.floor(Math.random() * objects.length)];

        return {
            type: 'fill-blank',
            unit: 5,
            concept: 'tener-conjugation',
            question: `${selected.es.charAt(0).toUpperCase() + selected.es.slice(1)} _______ ${obj}.`,
            correctAnswer: selected.form,
            hint: selected.de,
            explanation: `Bei "${selected.es}" verwendest du "${selected.form}"`,
            difficulty: 1
        };
    }

    /**
     * Generate age expression exercise
     */
    generateAgeExercise() {
        const ages = [15, 18, 20, 25, 30, 35, 40, 45, 50];
        const age = ages[Math.floor(Math.random() * ages.length)];
        const pronouns = [
            { es: 'yo', form: 'tengo', de: 'Ich bin' },
            { es: 'tú', form: 'tienes', de: 'Du bist' },
            { es: 'él', form: 'tiene', de: 'Er ist' },
            { es: 'ella', form: 'tiene', de: 'Sie ist' }
        ];

        const selected = pronouns[Math.floor(Math.random() * pronouns.length)];

        return {
            type: 'translation',
            unit: 5,
            concept: 'age-expression',
            direction: 'de-es',
            question: `${selected.de} ${age} Jahre alt.`,
            correctAnswer: `${selected.es.charAt(0).toUpperCase() + selected.es.slice(1)} ${selected.form} ${age} años.`,
            explanation: 'Im Spanischen "hat" man sein Alter, man "ist" es nicht!',
            difficulty: 2
        };
    }

    /**
     * Generate TENER idiom exercise
     */
    generateTenerIdiomExercise() {
        const idioms = [
            { idiom: 'tengo hambre', de: 'Ich habe Hunger / bin hungrig', type: 'hunger' },
            { idiom: 'tengo sed', de: 'Ich habe Durst / bin durstig', type: 'thirst' },
            { idiom: 'tengo frío', de: 'Mir ist kalt', type: 'cold' },
            { idiom: 'tengo calor', de: 'Mir ist warm', type: 'hot' },
            { idiom: 'tengo sueño', de: 'Ich bin müde/schläfrig', type: 'sleepy' },
            { idiom: 'tengo miedo', de: 'Ich habe Angst', type: 'fear' }
        ];

        const selected = idioms[Math.floor(Math.random() * idioms.length)];

        return {
            type: 'translation',
            unit: 5,
            concept: 'tener-idioms',
            direction: 'de-es',
            question: selected.de,
            correctAnswer: selected.idiom.charAt(0).toUpperCase() + selected.idiom.slice(1),
            explanation: `Körperliche Empfindungen werden mit TENER ausgedrückt`,
            difficulty: 2
        };
    }

    /**
     * Generate SER/ESTAR/TENER mixed exercise
     */
    generateMixedVerbExercise() {
        const exercises = [
            { sentence: 'Yo _____ 25 años', correct: 'tengo', verb: 'tener', reason: 'Alter → TENER' },
            { sentence: 'Tú _____ en casa', correct: 'estás', verb: 'estar', reason: 'Ort → ESTAR' },
            { sentence: 'Él _____ profesor', correct: 'es', verb: 'ser', reason: 'Beruf → SER' },
            { sentence: 'Nosotros _____ hambre', correct: 'tenemos', verb: 'tener', reason: 'Körperliche Empfindung → TENER' },
            { sentence: 'Ella _____ cansada', correct: 'está', verb: 'estar', reason: 'Zustand → ESTAR' },
            { sentence: 'Ellos _____ un perro', correct: 'tienen', verb: 'tener', reason: 'Besitz → TENER' },
            { sentence: 'Yo _____ alemán', correct: 'soy', verb: 'ser', reason: 'Nationalität → SER' }
        ];

        const selected = exercises[Math.floor(Math.random() * exercises.length)];

        return {
            type: 'fill-blank',
            unit: 5,
            concept: 'mixed-verbs',
            question: selected.sentence,
            correctAnswer: selected.correct,
            explanation: selected.reason,
            difficulty: 3
        };
    }

    // =========================================================================
    // UNIT 6: Numbers, Colors, Vocabulary
    // =========================================================================

    /**
     * Generate number recognition exercise
     */
    generateNumberExercise() {
        const number = Math.floor(Math.random() * 21); // 0-20
        const numbers = {
            0: 'cero', 1: 'uno', 2: 'dos', 3: 'tres', 4: 'cuatro',
            5: 'cinco', 6: 'seis', 7: 'siete', 8: 'ocho', 9: 'nueve',
            10: 'diez', 11: 'once', 12: 'doce', 13: 'trece', 14: 'catorce',
            15: 'quince', 16: 'dieciséis', 17: 'diecisiete', 18: 'dieciocho',
            19: 'diecinueve', 20: 'veinte'
        };

        const useNumberToWord = Math.random() > 0.5;

        if (useNumberToWord) {
            return {
                type: 'translation',
                unit: 6,
                concept: 'numbers',
                direction: 'number-word',
                question: `Schreibe die Zahl in Worten: ${number}`,
                correctAnswer: numbers[number],
                difficulty: number <= 10 ? 1 : 2
            };
        } else {
            return {
                type: 'translation',
                unit: 6,
                concept: 'numbers',
                direction: 'word-number',
                question: `Welche Zahl ist das? ${numbers[number]}`,
                correctAnswer: number.toString(),
                difficulty: number <= 10 ? 1 : 2
            };
        }
    }

    /**
     * Generate color agreement exercise
     */
    generateColorExercise() {
        const nouns = [
            { es: 'el coche', gender: 'm', de: 'das Auto' },
            { es: 'la casa', gender: 'f', de: 'das Haus' },
            { es: 'los libros', gender: 'm', plural: true, de: 'die Bücher' },
            { es: 'las flores', gender: 'f', plural: true, de: 'die Blumen' }
        ];

        const colors = [
            { base: 'rojo', m: 'rojo', f: 'roja', mp: 'rojos', fp: 'rojas' },
            { base: 'azul', m: 'azul', f: 'azul', mp: 'azules', fp: 'azules' },
            { base: 'negro', m: 'negro', f: 'negra', mp: 'negros', fp: 'negras' },
            { base: 'blanco', m: 'blanco', f: 'blanca', mp: 'blancos', fp: 'blancas' },
            { base: 'verde', m: 'verde', f: 'verde', mp: 'verdes', fp: 'verdes' }
        ];

        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];

        let correctForm;
        if (noun.plural && noun.gender === 'm') correctForm = color.mp;
        else if (noun.plural && noun.gender === 'f') correctForm = color.fp;
        else if (noun.gender === 'm') correctForm = color.m;
        else correctForm = color.f;

        return {
            type: 'fill-blank',
            unit: 6,
            concept: 'color-agreement',
            question: `${noun.es} _____ (${color.base})`,
            correctAnswer: correctForm,
            explanation: `Farben passen sich an Geschlecht und Zahl an (außer naranja, rosa)`,
            difficulty: 2
        };
    }

    /**
     * Generate vocabulary matching exercise
     */
    generateVocabularyMatching() {
        if (!this.vocabulary) return null;

        const categories = Object.keys(this.vocabulary.categories);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const category = this.vocabulary.categories[randomCategory];
        const words = category.words.slice(0, 5);

        const shuffledTranslations = words.map(w => w.de).sort(() => Math.random() - 0.5);

        return {
            type: 'matching',
            unit: 6,
            concept: 'vocabulary',
            category: category.name_de,
            words: words.map(w => ({ es: w.es, de: w.de })),
            shuffledTranslations,
            difficulty: 2
        };
    }

    // =========================================================================
    // UNIT 7: Integration & Conversation
    // =========================================================================

    /**
     * Generate conversation completion exercise
     */
    generateConversationExercise() {
        const conversations = [
            {
                dialogue: [
                    { speaker: 'A', text: '¡Hola! ¿Cómo te llamas?' },
                    { speaker: 'B', text: 'Me llamo Maria. ¿Y tú?', blank: false },
                    { speaker: 'A', text: 'Yo _____ Pedro.', blank: true, answer: 'soy' },
                    { speaker: 'B', text: 'Mucho gusto.' }
                ],
                concept: 'introduction'
            },
            {
                dialogue: [
                    { speaker: 'A', text: '¿De dónde eres?' },
                    { speaker: 'B', text: '_____ de Alemania.', blank: true, answer: 'Soy' },
                    { speaker: 'A', text: 'Yo soy de España.' },
                    { speaker: 'B', text: '¡Qué bien!' }
                ],
                concept: 'origin'
            },
            {
                dialogue: [
                    { speaker: 'A', text: '¿Cómo estás?' },
                    { speaker: 'B', text: '_____ bien, gracias.', blank: true, answer: 'Estoy' },
                    { speaker: 'A', text: 'Yo estoy cansado.' },
                    { speaker: 'B', text: '¿Por qué?', blank: false },
                    { speaker: 'A', text: '_____ mucho trabajo.', blank: true, answer: 'Tengo' }
                ],
                concept: 'wellbeing'
            }
        ];

        const selected = conversations[Math.floor(Math.random() * conversations.length)];

        return {
            type: 'conversation-completion',
            unit: 7,
            concept: 'conversation',
            dialogue: selected.dialogue,
            difficulty: 3
        };
    }

    /**
     * Generate integrated sentence building
     */
    generateIntegratedSentence() {
        const prompts = [
            { de: 'Stell dich vor (Name und Herkunft)', hint: 'Yo soy... / Soy de...' },
            { de: 'Sag, wo du gerade bist und wie du dich fühlst', hint: 'Estoy en... / Estoy...' },
            { de: 'Sag, was du hast (z.B. Haustier, Auto)', hint: 'Tengo...' },
            { de: 'Beschreibe eine Person (Name, Eigenschaften)', hint: 'Es... / Es muy...' }
        ];

        const selected = prompts[Math.floor(Math.random() * prompts.length)];

        return {
            type: 'free-production',
            unit: 7,
            concept: 'integration',
            prompt: selected.de,
            hint: selected.hint,
            difficulty: 4
        };
    }

    // =========================================================================
    // Exercise Selection & Management
    // =========================================================================

    /**
     * Generate exercise for specific unit
     */
    generateExerciseForUnit(unitId) {
        const exercises = [];

        switch (unitId) {
            case 1:
                exercises.push(
                    () => this.generatePronounIdentification(),
                    () => this.generateFormalInformalExercise()
                );
                break;

            case 2:
                exercises.push(
                    () => this.generateSerConjugation(),
                    () => this.generateSerUsageExercise(),
                    () => this.generateSerErrorCorrection()
                );
                break;

            case 3:
                exercises.push(
                    () => this.generateEstarConjugation(),
                    () => this.generateEstarLocationExercise(),
                    () => this.generateEstarAccentExercise()
                );
                break;

            case 4:
                exercises.push(
                    () => this.generateSerEstarChoice(),
                    () => this.generateMeaningChangeExercise(),
                    () => this.generateSerEstarErrorCorrection()
                );
                break;

            case 5:
                exercises.push(
                    () => this.generateTenerConjugation(),
                    () => this.generateAgeExercise(),
                    () => this.generateTenerIdiomExercise(),
                    () => this.generateMixedVerbExercise()
                );
                break;

            case 6:
                exercises.push(
                    () => this.generateNumberExercise(),
                    () => this.generateColorExercise(),
                    () => this.generateVocabularyMatching()
                );
                break;

            case 7:
                exercises.push(
                    () => this.generateConversationExercise(),
                    () => this.generateIntegratedSentence()
                );
                break;
        }

        const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
        return randomExercise();
    }

    /**
     * Generate a set of exercises for Phase 1
     */
    generateExerciseSet(count = 10, unitId = null) {
        const exercises = [];

        for (let i = 0; i < count; i++) {
            const unit = unitId || Math.floor(Math.random() * 7) + 1;
            const exercise = this.generateExerciseForUnit(unit);
            if (exercise) {
                exercises.push(exercise);
            }
        }

        return exercises;
    }

    /**
     * Get unit information
     */
    getUnitInfo(unitId) {
        return this.units[`unit${unitId}`];
    }

    /**
     * Get all units
     */
    getAllUnits() {
        return this.units;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Phase1ExerciseGenerator };
}
