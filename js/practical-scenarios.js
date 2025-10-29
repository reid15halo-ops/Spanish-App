/**
 * Practical Scenarios for Real-World Communication
 *
 * Focuses on immediately useful conversations:
 * - Asking for directions
 * - Expressing feelings
 * - Simple work explanations
 * - Self-description
 * - Describing others
 */

class PracticalScenariosSystem {
    constructor() {
        this.scenarios = this.initializeScenarios();
    }

    /**
     * Initialize all practical scenarios
     */
    initializeScenarios() {
        return {
            asking_directions: this.initializeDirections(),
            expressing_feelings: this.initializeFeelings(),
            work_communication: this.initializeWork(),
            self_description: this.initializeSelfDescription(),
            describing_others: this.initializeDescribingOthers()
        };
    }

    /**
     * Asking for directions
     */
    initializeDirections() {
        return {
            id: 'asking_directions',
            name_de: 'Nach dem Weg fragen',
            name_es: 'Pedir direcciones',
            importance: 'high',
            difficulty: 1,

            key_phrases: [
                {
                    es: '¿Dónde está...?',
                    de: 'Wo ist...?',
                    usage: 'After a specific place',
                    examples: [
                        { es: '¿Dónde está el baño?', de: 'Wo ist die Toilette?' },
                        { es: '¿Dónde está la estación?', de: 'Wo ist der Bahnhof?' },
                        { es: '¿Dónde está el hotel?', de: 'Wo ist das Hotel?' }
                    ]
                },
                {
                    es: 'Estoy perdido/a',
                    de: 'Ich habe mich verlaufen / Ich bin verloren',
                    usage: 'When lost',
                    examples: [
                        { es: 'Disculpe, estoy perdido', de: 'Entschuldigung, ich habe mich verlaufen' },
                        { es: 'Estoy perdida, ¿puede ayudarme?', de: 'Ich habe mich verlaufen, können Sie mir helfen?' }
                    ]
                },
                {
                    es: '¿Cómo llego a...?',
                    de: 'Wie komme ich zu...?',
                    usage: 'Asking how to get somewhere',
                    examples: [
                        { es: '¿Cómo llego al centro?', de: 'Wie komme ich ins Zentrum?' },
                        { es: '¿Cómo llego a la plaza?', de: 'Wie komme ich zum Platz?' }
                    ]
                },
                {
                    es: '¿Está lejos?',
                    de: 'Ist es weit?',
                    usage: 'Asking about distance',
                    examples: [
                        { es: '¿Está lejos de aquí?', de: 'Ist es weit von hier?' },
                        { es: 'No, está cerca', de: 'Nein, es ist nah' }
                    ]
                }
            ],

            essential_vocabulary: [
                { es: 'derecha', de: 'rechts' },
                { es: 'izquierda', de: 'links' },
                { es: 'recto', de: 'geradeaus' },
                { es: 'cerca', de: 'nah' },
                { es: 'lejos', de: 'weit' },
                { es: 'aquí', de: 'hier' },
                { es: 'allí', de: 'dort' },
                { es: 'calle', de: 'Straße' },
                { es: 'plaza', de: 'Platz' },
                { es: 'esquina', de: 'Ecke' }
            ],

            dialogues: [
                {
                    title: 'Asking for bathroom',
                    dialogue: [
                        { speaker: 'You', es: 'Disculpe, ¿dónde está el baño?', de: 'Entschuldigung, wo ist die Toilette?' },
                        { speaker: 'Person', es: 'Está allí, a la derecha', de: 'Sie ist dort, rechts' },
                        { speaker: 'You', es: 'Gracias', de: 'Danke' },
                        { speaker: 'Person', es: 'De nada', de: 'Gern geschehen' }
                    ]
                },
                {
                    title: 'Lost in city',
                    dialogue: [
                        { speaker: 'You', es: 'Disculpe, estoy perdido', de: 'Entschuldigung, ich habe mich verlaufen' },
                        { speaker: 'Person', es: '¿Dónde quieres ir?', de: 'Wo möchtest du hin?' },
                        { speaker: 'You', es: 'Al hotel Plaza', de: 'Zum Hotel Plaza' },
                        { speaker: 'Person', es: 'Está cerca. Todo recto', de: 'Es ist nah. Immer geradeaus' }
                    ]
                },
                {
                    title: 'Asking about distance',
                    dialogue: [
                        { speaker: 'You', es: '¿Dónde está la estación?', de: 'Wo ist der Bahnhof?' },
                        { speaker: 'Person', es: 'Está allí', de: 'Er ist dort' },
                        { speaker: 'You', es: '¿Está lejos?', de: 'Ist es weit?' },
                        { speaker: 'Person', es: 'No, está muy cerca', de: 'Nein, es ist sehr nah' }
                    ]
                }
            ],

            practice_exercises: [
                {
                    type: 'fill-blank',
                    situation: 'You need to find the bathroom',
                    de: 'Entschuldigung, wo ist _____ Toilette?',
                    es: 'Disculpe, ¿dónde está _____ baño?',
                    blank: 'el',
                    hint: 'Artikel für "baño"'
                },
                {
                    type: 'translation',
                    de: 'Ich habe mich verlaufen',
                    es: 'Estoy perdido/a',
                    context: 'Lost in the city'
                },
                {
                    type: 'choice',
                    question: '¿_____ está la estación?',
                    options: ['Dónde', 'Cómo', 'Qué', 'Cuándo'],
                    correct: 'Dónde',
                    translation: 'Wo ist der Bahnhof?'
                }
            ]
        };
    }

    /**
     * Expressing feelings
     */
    initializeFeelings() {
        return {
            id: 'expressing_feelings',
            name_de: 'Gefühle mitteilen',
            name_es: 'Expresar sentimientos',
            importance: 'high',
            difficulty: 1,

            key_phrases: [
                {
                    es: 'Estoy...',
                    de: 'Ich bin... / Ich fühle mich...',
                    usage: 'Express current feeling (use ESTAR!)',
                    examples: [
                        { es: 'Estoy feliz', de: 'Ich bin glücklich' },
                        { es: 'Estoy cansado', de: 'Ich bin müde' },
                        { es: 'Estoy triste', de: 'Ich bin traurig' }
                    ]
                },
                {
                    es: 'Me siento...',
                    de: 'Ich fühle mich...',
                    usage: 'Alternative way to express feelings',
                    examples: [
                        { es: 'Me siento bien', de: 'Ich fühle mich gut' },
                        { es: 'Me siento mal', de: 'Ich fühle mich schlecht' }
                    ]
                },
                {
                    es: 'Tengo...',
                    de: 'Ich habe... / Mir ist...',
                    usage: 'Physical sensations (use TENER!)',
                    examples: [
                        { es: 'Tengo hambre', de: 'Ich habe Hunger' },
                        { es: 'Tengo sed', de: 'Ich habe Durst' },
                        { es: 'Tengo frío', de: 'Mir ist kalt' },
                        { es: 'Tengo calor', de: 'Mir ist warm' }
                    ]
                }
            ],

            essential_vocabulary: [
                // Feelings with ESTAR
                { es: 'feliz', de: 'glücklich', verb: 'estar' },
                { es: 'triste', de: 'traurig', verb: 'estar' },
                { es: 'cansado/a', de: 'müde', verb: 'estar' },
                { es: 'contento/a', de: 'zufrieden', verb: 'estar' },
                { es: 'nervioso/a', de: 'nervös', verb: 'estar' },
                { es: 'preocupado/a', de: 'besorgt', verb: 'estar' },
                { es: 'enfermo/a', de: 'krank', verb: 'estar' },
                { es: 'bien', de: 'gut', verb: 'estar' },
                { es: 'mal', de: 'schlecht', verb: 'estar' },

                // Physical sensations with TENER
                { es: 'hambre', de: 'Hunger', verb: 'tener' },
                { es: 'sed', de: 'Durst', verb: 'tener' },
                { es: 'sueño', de: 'Müdigkeit/Schlaf', verb: 'tener' },
                { es: 'frío', de: 'Kälte', verb: 'tener' },
                { es: 'calor', de: 'Wärme', verb: 'tener' },
                { es: 'miedo', de: 'Angst', verb: 'tener' }
            ],

            dialogues: [
                {
                    title: 'Checking on someone',
                    dialogue: [
                        { speaker: 'Friend', es: '¿Cómo estás?', de: 'Wie geht es dir?' },
                        { speaker: 'You', es: 'Estoy bien, gracias', de: 'Mir geht es gut, danke' },
                        { speaker: 'Friend', es: '¿Y tú?', de: 'Und dir?' },
                        { speaker: 'You', es: 'Estoy un poco cansado', de: 'Ich bin ein bisschen müde' }
                    ]
                },
                {
                    title: 'Expressing physical needs',
                    dialogue: [
                        { speaker: 'Friend', es: '¿Tienes hambre?', de: 'Hast du Hunger?' },
                        { speaker: 'You', es: 'Sí, tengo mucha hambre', de: 'Ja, ich habe sehr viel Hunger' },
                        { speaker: 'Friend', es: '¿Vamos a comer?', de: 'Wollen wir essen gehen?' },
                        { speaker: 'You', es: 'Sí, buena idea', de: 'Ja, gute Idee' }
                    ]
                },
                {
                    title: 'Not feeling well',
                    dialogue: [
                        { speaker: 'Friend', es: '¿Estás bien?', de: 'Geht es dir gut?' },
                        { speaker: 'You', es: 'No, estoy enfermo', de: 'Nein, ich bin krank' },
                        { speaker: 'Friend', es: 'Lo siento. ¿Necesitas algo?', de: 'Das tut mir leid. Brauchst du etwas?' },
                        { speaker: 'You', es: 'No, gracias', de: 'Nein, danke' }
                    ]
                }
            ],

            practice_exercises: [
                {
                    type: 'verb-choice',
                    question: 'Yo _____ feliz',
                    options: ['soy', 'estoy', 'tengo'],
                    correct: 'estoy',
                    explanation: 'Gefühle sind temporär → ESTAR'
                },
                {
                    type: 'translation',
                    de: 'Ich habe Hunger',
                    es: 'Tengo hambre',
                    reminder: 'Körperliche Empfindungen mit TENER!'
                },
                {
                    type: 'fill-blank',
                    es: '_____ cansado',
                    correct: 'Estoy',
                    de: 'Ich bin müde',
                    hint: 'Temporärer Zustand → ESTAR'
                }
            ]
        };
    }

    /**
     * Simple work communication
     */
    initializeWork() {
        return {
            id: 'work_communication',
            name_de: 'Einfache Erklärungen auf der Arbeit',
            name_es: 'Comunicación simple en el trabajo',
            importance: 'medium',
            difficulty: 2,

            key_phrases: [
                {
                    es: 'Estoy ocupado/a',
                    de: 'Ich bin beschäftigt',
                    usage: 'When busy at work',
                    examples: [
                        { es: 'Lo siento, estoy ocupado', de: 'Entschuldigung, ich bin beschäftigt' }
                    ]
                },
                {
                    es: 'Trabajo en...',
                    de: 'Ich arbeite bei/in...',
                    usage: 'Explaining where you work',
                    examples: [
                        { es: 'Trabajo en una oficina', de: 'Ich arbeite in einem Büro' },
                        { es: 'Trabajo en un hospital', de: 'Ich arbeite in einem Krankenhaus' }
                    ]
                },
                {
                    es: 'Soy...',
                    de: 'Ich bin... (Beruf)',
                    usage: 'Your profession',
                    examples: [
                        { es: 'Soy profesor', de: 'Ich bin Lehrer' },
                        { es: 'Soy doctor', de: 'Ich bin Arzt' },
                        { es: 'Soy ingeniero', de: 'Ich bin Ingenieur' }
                    ]
                },
                {
                    es: 'Tengo una reunión',
                    de: 'Ich habe ein Meeting',
                    usage: 'Work appointments',
                    examples: [
                        { es: 'Tengo una reunión a las tres', de: 'Ich habe um drei ein Meeting' }
                    ]
                }
            ],

            essential_vocabulary: [
                { es: 'trabajo', de: 'Arbeit' },
                { es: 'oficina', de: 'Büro' },
                { es: 'reunión', de: 'Meeting/Besprechung' },
                { es: 'proyecto', de: 'Projekt' },
                { es: 'ocupado/a', de: 'beschäftigt' },
                { es: 'jefe/a', de: 'Chef/in' },
                { es: 'colega', de: 'Kollege/in' },
                { es: 'cliente', de: 'Kunde' },
                { es: 'documento', de: 'Dokument' },
                { es: 'correo', de: 'E-Mail/Post' }
            ],

            dialogues: [
                {
                    title: 'Introducing yourself at work',
                    dialogue: [
                        { speaker: 'Colleague', es: 'Hola, ¿cómo te llamas?', de: 'Hallo, wie heißt du?' },
                        { speaker: 'You', es: 'Me llamo Ana. Soy la nueva ingeniera', de: 'Ich heiße Ana. Ich bin die neue Ingenieurin' },
                        { speaker: 'Colleague', es: 'Mucho gusto, Ana', de: 'Sehr erfreut, Ana' },
                        { speaker: 'You', es: 'Igualmente', de: 'Ebenfalls' }
                    ]
                },
                {
                    title: 'Explaining you are busy',
                    dialogue: [
                        { speaker: 'Colleague', es: '¿Tienes tiempo ahora?', de: 'Hast du jetzt Zeit?' },
                        { speaker: 'You', es: 'Lo siento, estoy ocupado', de: 'Entschuldigung, ich bin beschäftigt' },
                        { speaker: 'Colleague', es: '¿Cuándo estás libre?', de: 'Wann bist du frei?' },
                        { speaker: 'You', es: 'Estoy libre a las tres', de: 'Ich bin um drei frei' }
                    ]
                },
                {
                    title: 'About a meeting',
                    dialogue: [
                        { speaker: 'Boss', es: '¿Dónde está el documento?', de: 'Wo ist das Dokument?' },
                        { speaker: 'You', es: 'Está en mi oficina', de: 'Es ist in meinem Büro' },
                        { speaker: 'Boss', es: 'Tenemos una reunión en 10 minutos', de: 'Wir haben in 10 Minuten ein Meeting' },
                        { speaker: 'You', es: 'Sí, estoy listo', de: 'Ja, ich bin bereit' }
                    ]
                }
            ]
        };
    }

    /**
     * Self-description
     */
    initializeSelfDescription() {
        return {
            id: 'self_description',
            name_de: 'Selbstbeschreibung',
            name_es: 'Autodescripción',
            importance: 'high',
            difficulty: 1,

            key_phrases: [
                {
                    es: 'Me llamo... / Soy...',
                    de: 'Ich heiße... / Ich bin...',
                    usage: 'Introducing yourself',
                    examples: [
                        { es: 'Me llamo María', de: 'Ich heiße Maria' },
                        { es: 'Soy Pedro', de: 'Ich bin Pedro' }
                    ]
                },
                {
                    es: 'Soy de...',
                    de: 'Ich komme aus...',
                    usage: 'Where you are from',
                    examples: [
                        { es: 'Soy de Alemania', de: 'Ich komme aus Deutschland' },
                        { es: 'Soy de España', de: 'Ich komme aus Spanien' }
                    ]
                },
                {
                    es: 'Tengo... años',
                    de: 'Ich bin... Jahre alt',
                    usage: 'Your age',
                    examples: [
                        { es: 'Tengo 25 años', de: 'Ich bin 25 Jahre alt' },
                        { es: 'Tengo 30 años', de: 'Ich bin 30 Jahre alt' }
                    ]
                },
                {
                    es: 'Soy...',
                    de: 'Ich bin... (Eigenschaft/Beruf)',
                    usage: 'Describing yourself',
                    examples: [
                        { es: 'Soy alto', de: 'Ich bin groß' },
                        { es: 'Soy simpático', de: 'Ich bin nett' },
                        { es: 'Soy profesor', de: 'Ich bin Lehrer' }
                    ]
                }
            ],

            template_introduction: [
                { es: 'Hola, me llamo [NAME]', de: 'Hallo, ich heiße [NAME]' },
                { es: 'Soy de [COUNTRY]', de: 'Ich komme aus [COUNTRY]' },
                { es: 'Tengo [AGE] años', de: 'Ich bin [AGE] Jahre alt' },
                { es: 'Soy [PROFESSION]', de: 'Ich bin [PROFESSION]' },
                { es: 'Soy [ADJECTIVE]', de: 'Ich bin [ADJECTIVE]' }
            ],

            practice_exercises: [
                {
                    type: 'fill-blank',
                    prompt: 'Introduce yourself with your name',
                    template: '_____ llamo María',
                    correct: 'Me',
                    translation: 'Ich heiße Maria'
                },
                {
                    type: 'fill-blank',
                    prompt: 'Say where you are from',
                    template: '_____ de Alemania',
                    correct: 'Soy',
                    translation: 'Ich komme aus Deutschland'
                },
                {
                    type: 'fill-blank',
                    prompt: 'Say your age (25)',
                    template: '_____ 25 años',
                    correct: 'Tengo',
                    translation: 'Ich bin 25 Jahre alt'
                },
                {
                    type: 'complete-introduction',
                    prompt: 'Create a complete self-introduction',
                    hints: ['Name', 'Herkunft', 'Alter', 'Beruf']
                }
            ]
        };
    }

    /**
     * Describing others
     */
    initializeDescribingOthers() {
        return {
            id: 'describing_others',
            name_de: 'Andere beschreiben',
            name_es: 'Describir a otros',
            importance: 'medium',
            difficulty: 2,

            key_phrases: [
                {
                    es: 'Él/Ella es...',
                    de: 'Er/Sie ist...',
                    usage: 'Describing someone',
                    examples: [
                        { es: 'Él es alto', de: 'Er ist groß' },
                        { es: 'Ella es simpática', de: 'Sie ist nett' },
                        { es: 'Él es mi amigo', de: 'Er ist mein Freund' }
                    ]
                },
                {
                    es: 'Él/Ella está...',
                    de: 'Er/Sie ist... (Zustand)',
                    usage: 'Current state',
                    examples: [
                        { es: 'Él está cansado', de: 'Er ist müde' },
                        { es: 'Ella está en casa', de: 'Sie ist zu Hause' },
                        { es: 'Él está ocupado', de: 'Er ist beschäftigt' }
                    ]
                },
                {
                    es: 'Él/Ella tiene...',
                    de: 'Er/Sie hat...',
                    usage: 'What they have',
                    examples: [
                        { es: 'Él tiene 25 años', de: 'Er ist 25 Jahre alt' },
                        { es: 'Ella tiene un perro', de: 'Sie hat einen Hund' }
                    ]
                }
            ],

            essential_vocabulary: [
                // People
                { es: 'amigo/a', de: 'Freund/in' },
                { es: 'hermano/a', de: 'Bruder/Schwester' },
                { es: 'padre', de: 'Vater' },
                { es: 'madre', de: 'Mutter' },
                { es: 'jefe/a', de: 'Chef/in' },

                // Characteristics
                { es: 'alto/a', de: 'groß' },
                { es: 'bajo/a', de: 'klein' },
                { es: 'joven', de: 'jung' },
                { es: 'viejo/a', de: 'alt' },
                { es: 'simpático/a', de: 'nett' },
                { es: 'inteligente', de: 'intelligent' },
                { es: 'guapo/a', de: 'hübsch' }
            ],

            dialogues: [
                {
                    title: 'Describing a friend',
                    dialogue: [
                        { speaker: 'A', es: '¿Quién es?', de: 'Wer ist das?' },
                        { speaker: 'You', es: 'Es mi amigo Pedro', de: 'Das ist mein Freund Pedro' },
                        { speaker: 'A', es: '¿Cómo es?', de: 'Wie ist er?' },
                        { speaker: 'You', es: 'Es muy simpático', de: 'Er ist sehr nett' }
                    ]
                },
                {
                    title: 'Describing family',
                    dialogue: [
                        { speaker: 'Friend', es: '¿Tienes hermanos?', de: 'Hast du Geschwister?' },
                        { speaker: 'You', es: 'Sí, tengo una hermana', de: 'Ja, ich habe eine Schwester' },
                        { speaker: 'Friend', es: '¿Cómo es ella?', de: 'Wie ist sie?' },
                        { speaker: 'You', es: 'Es joven e inteligente', de: 'Sie ist jung und intelligent' }
                    ]
                }
            ],

            practice_exercises: [
                {
                    type: 'verb-choice',
                    question: 'Mi amigo _____ profesor',
                    options: ['es', 'está', 'tiene'],
                    correct: 'es',
                    explanation: 'Beruf → SER'
                },
                {
                    type: 'translation',
                    de: 'Sie ist nett',
                    es: 'Ella es simpática',
                    note: 'Permanente Eigenschaft → SER'
                },
                {
                    type: 'fill-blank',
                    es: 'Mi hermana _____ 20 años',
                    correct: 'tiene',
                    de: 'Meine Schwester ist 20 Jahre alt',
                    hint: 'Alter → TENER'
                }
            ]
        };
    }

    /**
     * Get scenario by ID
     */
    getScenario(scenarioId) {
        return this.scenarios[scenarioId];
    }

    /**
     * Get all scenarios
     */
    getAllScenarios() {
        return Object.values(this.scenarios);
    }

    /**
     * Get scenarios by importance
     */
    getScenariosByImportance(importance = 'high') {
        return Object.values(this.scenarios)
            .filter(s => s.importance === importance)
            .sort((a, b) => a.difficulty - b.difficulty);
    }

    /**
     * Get scenarios by difficulty
     */
    getScenariosByDifficulty(maxDifficulty = 2) {
        return Object.values(this.scenarios)
            .filter(s => s.difficulty <= maxDifficulty)
            .sort((a, b) => a.difficulty - b.difficulty);
    }

    /**
     * Generate practice exercise from scenario
     */
    generatePracticeFromScenario(scenarioId) {
        const scenario = this.scenarios[scenarioId];
        if (!scenario || !scenario.practice_exercises) return null;

        const exercises = scenario.practice_exercises;
        return exercises[Math.floor(Math.random() * exercises.length)];
    }

    /**
     * Get dialogue from scenario
     */
    getDialogue(scenarioId, dialogueIndex = null) {
        const scenario = this.scenarios[scenarioId];
        if (!scenario || !scenario.dialogues) return null;

        if (dialogueIndex !== null) {
            return scenario.dialogues[dialogueIndex];
        }

        // Random dialogue
        return scenario.dialogues[Math.floor(Math.random() * scenario.dialogues.length)];
    }

    /**
     * Get all essential vocabulary from a scenario
     */
    getScenarioVocabulary(scenarioId) {
        const scenario = this.scenarios[scenarioId];
        if (!scenario) return [];

        return scenario.essential_vocabulary || [];
    }

    /**
     * Get learning path (ordered scenarios)
     */
    getLearningPath() {
        return [
            { id: 'self_description', priority: 1, reason: 'Start with yourself' },
            { id: 'expressing_feelings', priority: 2, reason: 'Basic communication' },
            { id: 'asking_directions', priority: 3, reason: 'Practical survival skill' },
            { id: 'describing_others', priority: 4, reason: 'Expand vocabulary' },
            { id: 'work_communication', priority: 5, reason: 'Professional context' }
        ];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PracticalScenariosSystem };
}
