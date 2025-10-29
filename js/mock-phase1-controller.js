/**
 * Mock Phase1Controller for UI Testing
 *
 * This is a simplified version that generates mock exercises
 * Replace with real Phase1Controller for production
 */

class Phase1Controller {
    constructor() {
        this.currentUnit = 1;
        this.currentExerciseIndex = 0;
        this.exercises = this.generateMockExercises();
        this.sessionActive = false;
    }

    /**
     * Initialize controller (optional for mock)
     */
    async initialize() {
        console.log('📚 Mock Phase1Controller initialized');
        return Promise.resolve();
    }

    /**
     * Start a learning session
     */
    startSession() {
        this.sessionActive = true;
        this.currentExerciseIndex = 0;
        console.log('🎯 Session started');
    }

    /**
     * Get next exercise
     */
    getNextExercise() {
        if (this.currentExerciseIndex >= this.exercises.length) {
            return null;
        }

        const exercise = this.exercises[this.currentExerciseIndex];
        this.currentExerciseIndex++;
        return exercise;
    }

    /**
     * Process an answer
     */
    processAnswer(exercise, userAnswer) {
        const correctAnswer = this.normalizeAnswer(exercise.correctAnswer);
        const normalizedUserAnswer = this.normalizeAnswer(userAnswer);
        const isCorrect = correctAnswer === normalizedUserAnswer;

        return {
            isCorrect,
            correctAnswer: exercise.correctAnswer,
            feedback: isCorrect
                ? '¡Muy bien! 🎉'
                : `Leider falsch. Die richtige Antwort ist: ${exercise.correctAnswer}`,
            explanation: exercise.explanation || ''
        };
    }

    /**
     * Get progress summary
     */
    getProgressSummary() {
        return {
            currentUnit: this.currentUnit,
            currentExercise: this.currentExerciseIndex,
            totalExercises: this.exercises.length,
            overallAccuracy: 0.85
        };
    }

    /**
     * End session
     */
    endSession() {
        this.sessionActive = false;
        return {
            exercisesCompleted: this.currentExerciseIndex,
            totalExercises: this.exercises.length,
            errorPatterns: []
        };
    }

    /**
     * Save progress (mock)
     */
    saveProgress() {
        console.log('💾 Progress saved');
    }

    /**
     * Normalize answer for comparison
     */
    normalizeAnswer(answer) {
        if (!answer) return '';
        return answer
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    /**
     * Generate mock exercises for testing
     */
    generateMockExercises() {
        return [
            // SER Exercises - TEXT INPUT (schwieriger!)
            {
                id: 'mock_ser_1',
                type: 'translation',
                concept: 'ser-conjugation-yo',
                difficulty: 1,
                question: 'Konjugiere SER für "yo" (ich). Schreibe nur das konjugierte Verb.',
                correctAnswer: 'soy',
                german: 'ich bin',
                germanBridge: '💡 Im Deutschen: "ich bin" → auf Spanisch: "yo ___"',
                hints: [
                    'Denk an die DOCTOR-Regel! SER für dauerhafte Eigenschaften.',
                    'SER ist unregelmäßig. Die Form für "yo" endet auf -oy.',
                    'Die richtige Form ist: <strong>soy</strong>'
                ],
                explanation: `
                    <p><strong>SER</strong> wird verwendet für dauerhafte Eigenschaften (DOCTOR-Regel):</p>
                    <ul>
                        <li><strong>D</strong>escription (Beschreibung)</li>
                        <li><strong>O</strong>ccupation (Beruf)</li>
                        <li><strong>C</strong>haracteristic (Eigenschaft)</li>
                        <li><strong>T</strong>ime (Zeit)</li>
                        <li><strong>O</strong>rigin (Herkunft)</li>
                        <li><strong>R</strong>elationship (Beziehung)</li>
                    </ul>
                    <p>Die Konjugation für "yo" ist: <strong>soy</strong></p>
                `,
                feedbackCorrect: 'Perfekt! Die yo-Form von SER ist "soy".',
                feedbackIncorrect: 'Nicht ganz. Die yo-Form von SER ist unregelmäßig und endet auf -oy.'
            },
            {
                id: 'mock_ser_2',
                type: 'translation',
                concept: 'ser-conjugation-tu',
                difficulty: 2,
                question: 'Konjugiere SER für "tú" (du). Schreibe nur das konjugierte Verb.',
                correctAnswer: 'eres',
                german: 'du bist',
                germanBridge: '💡 Im Deutschen: "du bist" → auf Spanisch: "tú ___"',
                hints: [
                    'Die zweite Person Singular von SER ist unregelmäßig.',
                    'SER für dauerhafte Eigenschaften. Die Form beginnt mit "e".',
                    'Die richtige Form ist: <strong>eres</strong>'
                ],
                explanation: '<p>Die Konjugation für "tú" ist: <strong>eres</strong></p><p>SER ist unregelmäßig: yo soy, tú eres, él/ella es...</p>',
                feedbackCorrect: 'Excelente! Die tú-Form von SER ist "eres".',
                feedbackIncorrect: 'Nicht ganz. Die tú-Form von SER ist unregelmäßig: "eres".'
            },
            {
                id: 'mock_ser_3',
                type: 'multiple-choice',
                concept: 'ser-identity',
                difficulty: 3,
                question: 'Vervollständige: "Yo ___ estudiante" (Ich bin Student)',
                correctAnswer: 'soy',
                german: 'Ich bin Student',
                germanBridge: '⚠️ Häufiger Fehler! Beruf ist eine dauerhafte Eigenschaft',
                options: [
                    { spanish: 'soy', german: '(bin - dauerhaft)', value: 'soy' },
                    { spanish: 'estoy', german: '(bin - vorübergehend)', value: 'estoy' },
                    { spanish: 'tengo', german: '(habe)', value: 'tengo' }
                ],
                hints: [
                    'Beruf und Identität sind dauerhafte Eigenschaften.',
                    'DOCTOR Regel: O = Occupation → Verwende SER!',
                    'Die richtige Antwort ist: <strong>soy</strong> (Yo soy estudiante)'
                ],
                explanation: '<p><strong>Häufiger Fehler für Deutsche:</strong></p><p>Bei <strong>Berufen und Identität</strong> verwendet man immer <strong>SER</strong>, weil das eine dauerhafte Eigenschaft ist.</p><p>✅ Yo <strong>soy</strong> estudiante (richtig)</p><p>❌ Yo estoy estudiante (falsch)</p>',
                feedbackCorrect: '¡Perfecto! Berufe verwendet man mit SER.',
                feedbackIncorrect: 'Beruf ist eine dauerhafte Eigenschaft. Im Deutschen sagen wir "ich bin Student", im Spanischen mit SER: "soy estudiante".'
            },

            // ESTAR Exercises
            {
                id: 'mock_estar_1',
                type: 'conjugation',
                concept: 'estar-conjugation-yo',
                difficulty: 2,
                question: 'Konjugiere ESTAR für "yo" (ich)',
                correctAnswer: 'estoy',
                german: 'ich bin (vorübergehend)',
                germanBridge: '💡 ESTAR für Ort und vorübergehende Zustände',
                options: [
                    { spanish: 'estoy', german: '(ich bin)', value: 'estoy' },
                    { spanish: 'soy', german: '(ich bin - dauerhaft)', value: 'soy' },
                    { spanish: 'tengo', german: '(ich habe)', value: 'tengo' }
                ],
                hints: [
                    'Denk an LECH: Location, Emotion, Condition, Health',
                    'ESTAR für vorübergehende Zustände',
                    'Die richtige Form für "yo" ist "estoy".'
                ],
                explanation: `
                    <p><strong>ESTAR</strong> wird verwendet für:</p>
                    <ul>
                        <li><strong>L</strong>ocation (Ort)</li>
                        <li><strong>E</strong>motion (Gefühl)</li>
                        <li><strong>C</strong>ondition (Zustand)</li>
                        <li><strong>H</strong>ealth (Gesundheit)</li>
                    </ul>
                `
            },
            {
                id: 'mock_estar_2',
                type: 'multiple-choice',
                concept: 'estar-location',
                difficulty: 3,
                question: 'Vervollständige: "Yo ___ en Madrid" (Ich bin in Madrid)',
                correctAnswer: 'estoy',
                german: 'Ich bin in Madrid',
                germanBridge: '💡 Achtung! Hier geht es um einen Ort (Location)',
                options: [
                    { spanish: 'estoy', german: '(bin - am Ort)', value: 'estoy' },
                    { spanish: 'soy', german: '(bin - dauerhaft)', value: 'soy' },
                    { spanish: 'tengo', german: '(habe)', value: 'tengo' }
                ],
                hints: [
                    'Ortangaben verwenden immer ESTAR!',
                    'LECH Regel: L = Location',
                    'Die richtige Antwort ist: <strong>estoy</strong>'
                ],
                explanation: '<p>Bei <strong>Ortsangaben</strong> verwendet man immer <strong>ESTAR</strong>.</p><p>✅ Yo <strong>estoy</strong> en Madrid (richtig)</p><p>❌ Yo <strong>soy</strong> en Madrid (falsch)</p>',
                feedbackCorrect: 'Perfekt! Orte verwendet man mit ESTAR.',
                feedbackIncorrect: 'Ortangaben verwenden ESTAR (nicht SER).'
            },

            // SER/ESTAR Contrast
            {
                id: 'mock_contrast_1',
                type: 'multiple-choice',
                concept: 'ser-estar-fundamental',
                difficulty: 5,
                question: 'Wähle die richtige Form: "Yo ___ profesor" (Ich bin Lehrer)',
                correctAnswer: 'soy',
                german: 'Ich bin Lehrer (Beruf)',
                germanBridge: '⚠️ Achtung! Beruf ist eine dauerhafte Eigenschaft',
                options: [
                    { spanish: 'soy', german: '(SER - Beruf)', value: 'soy' },
                    { spanish: 'estoy', german: '(ESTAR - falsch hier)', value: 'estoy' },
                    { spanish: 'tengo', german: '(TENER - haben)', value: 'tengo' }
                ],
                hints: [
                    'Beruf ist eine dauerhafte Eigenschaft!',
                    'DOCTOR Regel: O = Occupation → SER',
                    'Die richtige Antwort ist "soy".'
                ],
                explanation: `
                    <p>Dies ist ein häufiger Fehler für deutsche Lernende!</p>
                    <p><strong>Beruf</strong> ist eine relativ <strong>dauerhafte Eigenschaft</strong>, daher:</p>
                    <p>✅ Yo <strong>soy</strong> profesor (richtig)</p>
                    <p>❌ Yo <strong>estoy</strong> profesor (falsch)</p>
                `
            },
            {
                id: 'mock_contrast_2',
                type: 'multiple-choice',
                concept: 'ser-estar-emotion',
                difficulty: 5,
                question: 'Wähle die richtige Form: "Yo ___ feliz hoy" (Ich bin heute glücklich)',
                correctAnswer: 'estoy',
                german: 'Ich bin heute glücklich',
                germanBridge: '💡 Achtung! "heute" signalisiert einen vorübergehenden Zustand',
                options: [
                    { spanish: 'estoy', german: '(ESTAR - vorübergehend)', value: 'estoy' },
                    { spanish: 'soy', german: '(SER - dauerhaft)', value: 'soy' },
                    { spanish: 'tengo', german: '(TENER - haben)', value: 'tengo' }
                ],
                hints: [
                    'Gefühle sind vorübergehende Zustände!',
                    'LECH Regel: E = Emotion → ESTAR',
                    'Die richtige Antwort ist "estoy".'
                ],
                explanation: `
                    <p>Gefühle und Emotionen sind <strong>vorübergehende Zustände</strong>:</p>
                    <p>✅ Yo <strong>estoy</strong> feliz hoy (richtig - heute glücklich)</p>
                    <p>❌ Yo <strong>soy</strong> feliz (würde bedeuten: Ich bin immer glücklich)</p>
                `
            },

            // TENER Exercise - FIXED: Consistent format!
            {
                id: 'mock_tener_1',
                type: 'multiple-choice',
                concept: 'tener-age',
                difficulty: 4,
                question: 'Vervollständige: "Yo ___ 25 años" (Ich bin 25 Jahre alt)',
                correctAnswer: 'tengo',
                german: 'Ich bin 25 Jahre alt',
                germanBridge: '⚠️ Häufiger Fehler! Für Alter wird ein anderes Verb verwendet (nicht "sein"!)',
                options: [
                    { spanish: 'tengo', german: '(habe - richtig!)', value: 'tengo' },
                    { spanish: 'soy', german: '(bin - falsch!)', value: 'soy' },
                    { spanish: 'estoy', german: '(bin - falsch!)', value: 'estoy' }
                ],
                hints: [
                    'Im Spanischen "hat" man sein Alter, man "ist" es nicht!',
                    'TENER wird für Alter verwendet, nicht SER oder ESTAR.',
                    'Die richtige Antwort ist: <strong>tengo</strong> (Yo tengo 25 años)'
                ],
                explanation: `
                    <p><strong>Häufiger Fehler für Deutsche!</strong></p>
                    <p>🇩🇪 Deutsch: "Ich <strong>bin</strong> 25 Jahre alt"</p>
                    <p>🇪🇸 Spanisch: "Yo <strong>tengo</strong> 25 años" (wörtlich: Ich <em>habe</em> 25 Jahre)</p>
                    <p>✅ Yo <strong>tengo</strong> 25 años (richtig)</p>
                    <p>❌ Yo <strong>soy</strong> 25 años (falsch)</p>
                    <p>❌ Yo <strong>estoy</strong> 25 años (falsch)</p>
                    <p><em>Im Spanischen besitzt man sein Alter, man ist es nicht!</em></p>
                `,
                feedbackCorrect: 'Perfekt! Im Spanischen verwendet man TENER für das Alter.',
                feedbackIncorrect: 'Achtung! Für Alter verwendet man TENER (haben), nicht SER/ESTAR (sein).'
            },

            // Integration Exercise - FIXED: Better difficulty progression
            {
                id: 'mock_integration_1',
                type: 'translation',
                concept: 'integration-comprehensive',
                difficulty: 7,
                question: 'Vervollständige den ersten Teil: "Yo ___ María" (Ich bin María - Name)',
                correctAnswer: 'soy',
                german: 'Ich bin María',
                germanBridge: '💡 Name ist eine Identität (dauerhafte Eigenschaft)',
                hints: [
                    'Name ist eine dauerhafte Eigenschaft.',
                    'DOCTOR Regel: Identity → SER',
                    'Die richtige Antwort ist: <strong>soy</strong>'
                ],
                explanation: `
                    <p><strong>Namen und Identität verwenden SER:</strong></p>
                    <p>✅ Yo <strong>soy</strong> María (richtig)</p>
                    <p>❌ Yo <strong>estoy</strong> María (falsch)</p>
                    <p>SER = dauerhafte Eigenschaften, Identität</p>
                `,
                feedbackCorrect: 'Perfekt! Namen verwendet man mit SER.',
                feedbackIncorrect: 'Namen sind dauerhaft → Verwende SER (nicht ESTAR).'
            },
            {
                id: 'mock_integration_2',
                type: 'multiple-choice',
                concept: 'integration-location',
                difficulty: 7,
                question: 'Vervollständige: "Yo ___ en Barcelona" (Ich bin in Barcelona)',
                correctAnswer: 'estoy',
                german: 'Ich bin in Barcelona',
                germanBridge: '💡 Achtung! Hier geht es um einen Ort (Location)',
                options: [
                    { spanish: 'estoy', german: '(bin - am Ort)', value: 'estoy' },
                    { spanish: 'soy', german: '(bin - dauerhaft)', value: 'soy' },
                    { spanish: 'tengo', german: '(habe)', value: 'tengo' }
                ],
                hints: [
                    'Ortsangaben verwenden ESTAR.',
                    'LECH Regel: L = Location → ESTAR',
                    'Die richtige Antwort ist: <strong>estoy</strong>'
                ],
                explanation: `
                    <p><strong>Ortsangaben immer mit ESTAR:</strong></p>
                    <p>✅ Yo <strong>estoy</strong> en Barcelona (richtig)</p>
                    <p>❌ Yo <strong>soy</strong> en Barcelona (falsch)</p>
                    <p>ESTAR = Ort, vorübergehende Position</p>
                `,
                feedbackCorrect: 'Excelente! Orte verwendet man mit ESTAR.',
                feedbackIncorrect: 'Ort = ESTAR (LECH Regel: Location), nicht SER!'
            },

            // NEW: Sentence Building - Wortstellung üben
            {
                id: 'mock_sentence_1',
                type: 'sentence-building',
                concept: 'word-order',
                difficulty: 4,
                question: 'Bringe die Wörter in die richtige Reihenfolge (Deutsch: "Ich bin glücklich")',
                correctAnswer: 'Yo estoy feliz',
                german: 'Ich bin glücklich',
                germanBridge: '💡 Subjekt - Verb - Adjektiv',
                words: ['Yo', 'estoy', 'feliz'],
                hints: [
                    'Spanische Wortstellung ist ähnlich wie im Deutschen',
                    'Pronomen + ESTAR + Adjektiv',
                    'Die richtige Reihenfolge ist: Yo estoy feliz'
                ],
                explanation: '<p>Spanische Grundwortstellung: <strong>Subjekt + Verb + Ergänzung</strong></p><p>✅ Yo estoy feliz (richtig)</p>',
                feedbackCorrect: '¡Perfecto! Die Wortstellung ist korrekt.',
                feedbackIncorrect: 'Achte auf die Grundwortstellung: Subjekt + Verb + Adjektiv'
            },

            // NEW: Error Correction - Fehler finden
            {
                id: 'mock_error_1',
                type: 'error-correction',
                concept: 'ser-estar-error',
                difficulty: 5,
                question: 'Korrigiere den Fehler in diesem Satz:',
                incorrectSentence: 'Yo soy en Madrid',
                correctAnswer: 'Yo estoy en Madrid',
                errorCount: 1,
                errorType: 'SER/ESTAR Verwechslung',
                german: 'Ich bin in Madrid',
                germanBridge: '⚠️ Dieser Satz ist fehlerhaft! Was muss geändert werden?',
                hints: [
                    'Ortsangaben verwenden immer ESTAR',
                    'Das Verb muss gewechselt werden',
                    'Die richtige Form ist: Yo estoy en Madrid'
                ],
                explanation: '<p>Bei Ortsangaben verwendet man <strong>ESTAR</strong>, nicht SER!</p><p>❌ Yo <strong>soy</strong> en Madrid (falsch)</p><p>✅ Yo <strong>estoy</strong> en Madrid (richtig)</p>',
                feedbackCorrect: 'Genau! "soy" muss zu "estoy" geändert werden.',
                feedbackIncorrect: 'Der Fehler liegt beim Verb. Bei Ortsangaben verwendet man ESTAR.'
            },

            // NEW: True/False - Satz bewerten
            {
                id: 'mock_truefalse_1',
                type: 'true-false',
                concept: 'ser-profession',
                difficulty: 3,
                question: 'Ist dieser Satz grammatikalisch korrekt?',
                statement: 'Yo soy profesor',
                correctAnswer: 'true',
                german: 'Ich bin Lehrer',
                germanBridge: '💡 Denk an die DOCTOR-Regel für SER',
                hints: [
                    'Beruf ist eine dauerhafte Eigenschaft',
                    'DOCTOR Regel: O = Occupation → SER',
                    'Dieser Satz ist korrekt!'
                ],
                explanation: '<p>Dieser Satz ist <strong>korrekt</strong>!</p><p>Berufe sind dauerhafte Eigenschaften und verwenden deshalb <strong>SER</strong>.</p><p>✅ Yo soy profesor (richtig)</p>',
                feedbackCorrect: 'Richtig! Berufe verwenden SER.',
                feedbackIncorrect: 'Dieser Satz ist tatsächlich korrekt. Berufe verwenden SER.'
            },

            // NEW: True/False - Fehlerhafter Satz
            {
                id: 'mock_truefalse_2',
                type: 'true-false',
                concept: 'estar-location-error',
                difficulty: 4,
                question: 'Ist dieser Satz grammatikalisch korrekt?',
                statement: 'Yo soy en casa',
                correctAnswer: 'false',
                german: 'Ich bin zu Hause',
                germanBridge: '⚠️ Prüfe genau: Passt das Verb zur Bedeutung?',
                hints: [
                    'Dies ist eine Ortsangabe',
                    'Orte verwenden ESTAR, nicht SER',
                    'Dieser Satz ist falsch! Es muss "estoy" heißen.'
                ],
                explanation: '<p>Dieser Satz ist <strong>falsch</strong>!</p><p>Bei Ortsangaben verwendet man <strong>ESTAR</strong>, nicht SER.</p><p>❌ Yo <strong>soy</strong> en casa (falsch)</p><p>✅ Yo <strong>estoy</strong> en casa (richtig)</p>',
                feedbackCorrect: 'Genau! Bei Ortsangaben braucht man ESTAR.',
                feedbackIncorrect: 'Dieser Satz enthält einen Fehler. Orte brauchen ESTAR, nicht SER.'
            },

            // NEW: Fill Multiple - Mehrere Lücken
            {
                id: 'mock_fill_multiple_1',
                type: 'fill-multiple',
                concept: 'ser-estar-mixed',
                difficulty: 6,
                question: 'Fülle beide Lücken korrekt aus:',
                template: 'Yo ___ profesor y ___ en Madrid',
                correctAnswer: '["soy","estoy"]',
                german: 'Ich bin Lehrer und ich bin in Madrid',
                germanBridge: '💡 Beruf vs. Ort - welches Verb passt wo?',
                blanks: [
                    { label: '1. Lücke (Beruf)', hint: 'ser oder estar?' },
                    { label: '2. Lücke (Ort)', hint: 'ser oder estar?' }
                ],
                hints: [
                    'Beruf = dauerhafte Eigenschaft → SER',
                    'Ort = vorübergehende Position → ESTAR',
                    'Die richtigen Antworten sind: soy, estoy'
                ],
                explanation: '<p><strong>Zwei verschiedene Situationen:</strong></p><p>1. "profesor" = Beruf → SER (dauerhafte Eigenschaft)</p><p>2. "en Madrid" = Ort → ESTAR (Position)</p><p>✅ Yo <strong>soy</strong> profesor y <strong>estoy</strong> en Madrid</p>',
                feedbackCorrect: 'Perfekt! Du hast beide Verben richtig gewählt.',
                feedbackIncorrect: 'Denk dran: Beruf = SER (dauerhaft), Ort = ESTAR (Position)'
            },

            // NEW: Dialogue Completion - Dialog vervollständigen
            {
                id: 'mock_dialogue_1',
                type: 'dialogue-completion',
                concept: 'greeting-response',
                difficulty: 2,
                question: 'Vervollständige den Dialog:',
                dialogue: [
                    { speaker: 'A', text: '¡Hola! ¿Cómo estás?' },
                    { speaker: 'B', text: '___' }
                ],
                correctAnswer: 'Bien, gracias',
                german: 'Gut, danke',
                germanBridge: '💡 Wie antwortet man auf "Wie geht\'s"?',
                contextHint: 'Person A fragt, wie es dir geht',
                responseIcon: '👤',
                options: [
                    { spanish: 'Bien, gracias', german: '(Gut, danke)', value: 'Bien, gracias' },
                    { spanish: 'Soy María', german: '(Ich bin María)', value: 'Soy María' },
                    { spanish: 'En Madrid', german: '(In Madrid)', value: 'En Madrid' }
                ],
                hints: [
                    'Die Frage war "Wie geht es dir?"',
                    '"Bien" bedeutet "gut"',
                    'Die richtige Antwort ist: Bien, gracias'
                ],
                explanation: '<p><strong>Standardantwort auf "¿Cómo estás?":</strong></p><p>✅ <strong>Bien, gracias</strong> (Gut, danke)</p><p>Alternative: "Muy bien" (sehr gut), "Regular" (so lala)</p>',
                feedbackCorrect: '¡Perfecto! Eine höfliche Antwort.',
                feedbackIncorrect: 'Auf "¿Cómo estás?" antwortet man mit "Bien, gracias"'
            },

            // NEW: Sentence Building - Komplexer Satz
            {
                id: 'mock_sentence_2',
                type: 'sentence-building',
                concept: 'complex-sentence',
                difficulty: 6,
                question: 'Bilde einen korrekten Satz (Deutsch: "Ich bin Lehrer in Barcelona")',
                correctAnswer: 'Yo soy profesor en Barcelona',
                german: 'Ich bin Lehrer in Barcelona',
                germanBridge: '💡 Achtung: Nur EIN Verb verwenden!',
                words: ['Yo', 'soy', 'profesor', 'en', 'Barcelona'],
                hints: [
                    'Die Hauptinformation ist der Beruf, nicht der Ort',
                    'Das Verb richtet sich nach dem Beruf (SER)',
                    'Struktur: Subjekt + Verb + Beruf + Ort'
                ],
                explanation: '<p><strong>Bei Beruf + Ort:</strong></p><p>Das Verb richtet sich nach der Hauptinformation (Beruf = dauerhafte Eigenschaft).</p><p>✅ Yo soy profesor en Barcelona</p><p>Nicht verwechseln mit: "Yo estoy en Barcelona" (nur Ortsangabe)</p>',
                feedbackCorrect: '¡Excelente! Richtige Wortstellung und Verb.',
                feedbackIncorrect: 'Das Verb richtet sich nach dem Beruf: SER'
            },

            // NEW: Error Correction - TENER Fehler
            {
                id: 'mock_error_2',
                type: 'error-correction',
                concept: 'tener-age-error',
                difficulty: 5,
                question: 'Korrigiere den Fehler in diesem Satz:',
                incorrectSentence: 'Yo soy 25 años',
                correctAnswer: 'Yo tengo 25 años',
                errorCount: 1,
                errorType: 'Verb-Wahl (Alter)',
                german: 'Ich bin 25 Jahre alt',
                germanBridge: '⚠️ Im Spanischen "hat" man sein Alter!',
                hints: [
                    'Für Alter verwendet man TENER, nicht SER',
                    'Im Spanischen "besitzt" man Jahre',
                    'Die richtige Form ist: Yo tengo 25 años'
                ],
                explanation: '<p><strong>Häufiger Fehler!</strong></p><p>🇩🇪 Deutsch: Ich <strong>bin</strong> 25 Jahre alt</p><p>🇪🇸 Spanisch: Yo <strong>tengo</strong> 25 años (Ich <em>habe</em> 25 Jahre)</p><p>✅ Yo <strong>tengo</strong> 25 años (richtig)</p><p>❌ Yo <strong>soy</strong> 25 años (falsch)</p>',
                feedbackCorrect: 'Perfekt! Alter verwendet TENER, nicht SER.',
                feedbackIncorrect: 'Im Spanischen "hat" man sein Alter: TENER'
            },

            // NEW: Dialogue Completion - Name vorstellen
            {
                id: 'mock_dialogue_2',
                type: 'dialogue-completion',
                concept: 'introduction-name',
                difficulty: 3,
                question: 'Was antwortet María?',
                dialogue: [
                    { speaker: 'A', text: '¿Cómo te llamas?' },
                    { speaker: 'B', text: '___' }
                ],
                correctAnswer: 'Me llamo María',
                german: 'Ich heiße María',
                germanBridge: '💡 Nach deinem Namen wird gefragt',
                contextHint: 'Person A fragt nach deinem Namen',
                responseIcon: '👤',
                options: [
                    { spanish: 'Me llamo María', german: '(Ich heiße María)', value: 'Me llamo María' },
                    { spanish: 'Tengo 25 años', german: '(Ich bin 25 Jahre alt)', value: 'Tengo 25 años' },
                    { spanish: 'Estoy bien', german: '(Mir geht es gut)', value: 'Estoy bien' }
                ],
                hints: [
                    'Die Frage war nach deinem Namen',
                    '"Me llamo" bedeutet "Ich heiße"',
                    'Die richtige Antwort ist: Me llamo María'
                ],
                explanation: '<p><strong>"¿Cómo te llamas?" = Wie heißt du?</strong></p><p>Antwort: <strong>Me llamo [Name]</strong></p><p>Wörtlich: "Ich rufe mich [Name]"</p>',
                feedbackCorrect: '¡Muy bien! Korrekte Vorstellung.',
                feedbackIncorrect: 'Auf "¿Cómo te llamas?" antwortet man mit "Me llamo..."'
            },

            // NEW: Fill Multiple - Vollständiger Vorstellungssatz
            {
                id: 'mock_fill_multiple_2',
                type: 'fill-multiple',
                concept: 'introduction-complete',
                difficulty: 7,
                question: 'Vervollständige die Vorstellung:',
                template: 'Yo ___ María, ___ 28 años y ___ profesora',
                correctAnswer: '["soy","tengo","soy"]',
                german: 'Ich bin María, ich bin 28 Jahre alt und ich bin Lehrerin',
                germanBridge: '💡 Name = SER, Alter = TENER, Beruf = SER',
                blanks: [
                    { label: 'Name', hint: 'Identität...' },
                    { label: 'Alter', hint: 'Besitzen...' },
                    { label: 'Beruf', hint: 'Dauerhafte Eigenschaft...' }
                ],
                hints: [
                    'Name/Identität → SER',
                    'Alter → TENER (man "besitzt" Jahre)',
                    'Beruf → SER (dauerhafte Eigenschaft)'
                ],
                explanation: '<p><strong>Vollständige Vorstellung:</strong></p><ul><li>Name: <strong>soy</strong> (Identität)</li><li>Alter: <strong>tengo</strong> (besitzen)</li><li>Beruf: <strong>soy</strong> (dauerhafte Eigenschaft)</li></ul>',
                feedbackCorrect: '¡Perfecto! Alle drei Verben richtig gewählt.',
                feedbackIncorrect: 'Denk an die Regeln: Name/Beruf = SER, Alter = TENER'
            },

            // NEW: True/False - TENER Alter
            {
                id: 'mock_truefalse_3',
                type: 'true-false',
                concept: 'tener-age-correct',
                difficulty: 3,
                question: 'Ist dieser Satz grammatikalisch korrekt?',
                statement: 'Yo tengo 30 años',
                correctAnswer: 'true',
                german: 'Ich bin 30 Jahre alt',
                germanBridge: '💡 Denk an die Besonderheit beim Alter',
                hints: [
                    'Im Spanischen "hat" man Jahre',
                    'TENER wird für Alter verwendet',
                    'Dieser Satz ist korrekt!'
                ],
                explanation: '<p>Dieser Satz ist <strong>korrekt</strong>!</p><p>Im Spanischen verwendet man <strong>TENER</strong> (haben) für das Alter.</p><p>✅ Yo tengo 30 años (richtig)</p><p>❌ Yo soy 30 años (falsch)</p>',
                feedbackCorrect: 'Richtig! TENER ist korrekt für Alter.',
                feedbackIncorrect: 'Dieser Satz ist korrekt. Man "hat" Jahre im Spanischen.'
            },

            // NEW: Sentence Building - Mit Gefühl
            {
                id: 'mock_sentence_3',
                type: 'sentence-building',
                concept: 'estar-emotion',
                difficulty: 5,
                question: 'Bilde den Satz (Deutsch: "Heute bin ich traurig")',
                correctAnswer: 'Hoy estoy triste',
                german: 'Heute bin ich traurig',
                germanBridge: '💡 Gefühle sind vorübergehende Zustände',
                words: ['Hoy', 'estoy', 'triste'],
                hints: [
                    'Gefühle verwenden ESTAR (vorübergehend)',
                    'LECH Regel: E = Emotion',
                    'Zeitangabe + Verb + Adjektiv'
                ],
                explanation: '<p>Gefühle sind <strong>vorübergehende Zustände</strong> → ESTAR</p><p>✅ Hoy estoy triste (heute traurig)</p><p>vs. "Yo soy triste" würde bedeuten: Ich bin immer/generell eine traurige Person</p>',
                feedbackCorrect: '¡Perfecto! Gefühle verwenden ESTAR.',
                feedbackIncorrect: 'Gefühle sind vorübergehend → ESTAR'
            },

            // NEW: Error Correction - Adjektiv-Fehler
            {
                id: 'mock_error_3',
                type: 'error-correction',
                concept: 'ser-estar-adjective',
                difficulty: 6,
                question: 'Korrigiere den Fehler:',
                incorrectSentence: 'María es cansada',
                correctAnswer: 'María está cansada',
                errorCount: 1,
                errorType: 'SER/ESTAR bei Zuständen',
                german: 'María ist müde',
                germanBridge: '⚠️ Müdigkeit ist ein vorübergehender Zustand!',
                hints: [
                    'Müdigkeit ist ein aktueller Zustand, nicht dauerhaft',
                    'Zustände und Gesundheit → ESTAR',
                    'Die richtige Form ist: María está cansada'
                ],
                explanation: '<p><strong>"cansada" (müde) = aktueller Zustand</strong></p><p>Zustände verwenden <strong>ESTAR</strong>, nicht SER!</p><p>✅ María <strong>está</strong> cansada (sie ist gerade müde)</p><p>❌ María <strong>es</strong> cansada (würde bedeuten: sie ist charakterlich eine müde Person)</p>',
                feedbackCorrect: 'Genau! Zustände verwenden ESTAR.',
                feedbackIncorrect: 'Müdigkeit ist ein Zustand → ESTAR, nicht SER'
            },

            // NEW: Dialogue Completion - Befinden
            {
                id: 'mock_dialogue_3',
                type: 'dialogue-completion',
                concept: 'estar-health',
                difficulty: 4,
                question: 'Pedro ist krank. Was sagt er?',
                dialogue: [
                    { speaker: 'A', text: '¿Cómo estás, Pedro?' },
                    { speaker: 'B', text: '___' }
                ],
                correctAnswer: 'Estoy enfermo',
                german: 'Ich bin krank',
                germanBridge: '💡 Gesundheitszustand = ESTAR',
                contextHint: 'Pedro fühlt sich nicht gut',
                responseIcon: '🤒',
                options: [
                    { spanish: 'Estoy enfermo', german: '(Ich bin krank)', value: 'Estoy enfermo' },
                    { spanish: 'Soy enfermo', german: '(Falsch! SER passt nicht)', value: 'Soy enfermo' },
                    { spanish: 'Tengo enfermo', german: '(Falsch! TENER passt nicht)', value: 'Tengo enfermo' }
                ],
                hints: [
                    'Gesundheitszustand ist vorübergehend',
                    'LECH Regel: H = Health → ESTAR',
                    'Die richtige Antwort ist: Estoy enfermo'
                ],
                explanation: '<p><strong>Gesundheit = vorübergehender Zustand</strong></p><p>LECH Regel: <strong>H</strong>ealth → ESTAR</p><p>✅ Estoy enfermo (ich bin krank)</p><p>❌ Soy enfermo (grammatikalisch falsch)</p>',
                feedbackCorrect: '¡Muy bien! Gesundheit verwendet ESTAR.',
                feedbackIncorrect: 'Krankheit ist ein Zustand → ESTAR'
            }
        ];
    }
}

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.Phase1Controller = Phase1Controller;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Phase1Controller };
}
