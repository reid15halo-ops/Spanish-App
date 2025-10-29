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
                germanBridge: '⚠️ Häufiger Fehler! Beruf/Identität = SER (nicht ESTAR)',
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
                question: 'Wie sagt man "Ich bin in Madrid" auf Spanisch?',
                correctAnswer: 'Yo estoy en Madrid',
                german: 'Ich bin in Madrid',
                germanBridge: '💡 Ort/Location = ESTAR',
                options: [
                    { spanish: 'Yo estoy en Madrid', german: '(ich bin in Madrid)', value: 'Yo estoy en Madrid' },
                    { spanish: 'Yo soy en Madrid', german: '(falsch)', value: 'Yo soy en Madrid' },
                    { spanish: 'Yo tengo en Madrid', german: '(falsch)', value: 'Yo tengo en Madrid' }
                ],
                hints: [
                    'Ortangaben verwenden immer ESTAR!',
                    'LECH Regel: L = Location',
                    'Die richtige Antwort ist "Yo estoy en Madrid".'
                ],
                explanation: '<p>Bei <strong>Ortsangaben</strong> verwendet man immer <strong>ESTAR</strong>.</p>'
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
                germanBridge: '⚠️ Achtung! Beruf = SER (dauerhaft), nicht ESTAR',
                options: [
                    { spanish: 'soy', german: '(SER - Beruf)', value: 'soy' },
                    { spanish: 'estoy', german: '(ESTAR - falsch hier)', value: 'estoy' }
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
                germanBridge: '💡 "heute" = vorübergehend → ESTAR',
                options: [
                    { spanish: 'estoy', german: '(ESTAR - vorübergehend)', value: 'estoy' },
                    { spanish: 'soy', german: '(SER - dauerhaft)', value: 'soy' }
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
                germanBridge: '⚠️ Häufiger Fehler! Deutsch: "Ich BIN alt" → Spanisch: "Yo TENGO años"',
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
                germanBridge: '💡 Name ist eine Identität → SER (dauerhaft)',
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
                germanBridge: '💡 Ort/Location → ESTAR (nicht SER!)',
                options: [
                    { spanish: 'estoy', german: '(bin - am Ort)', value: 'estoy' },
                    { spanish: 'soy', german: '(bin - dauerhaft)', value: 'soy' }
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
