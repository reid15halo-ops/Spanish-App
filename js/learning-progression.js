/**
 * Learning Progression System
 *
 * Manages the 5-phase learning progression from A1 to B1 level
 * Tracks user progress, unlocks new content, and manages phase transitions
 */

class LearningProgressionSystem {
    constructor() {
        this.currentPhase = 1;
        this.phases = this.initializePhases();
        this.userProgress = {
            phase1: { completed: false, accuracy: 0, exercisesCompleted: 0 },
            phase2: { completed: false, accuracy: 0, exercisesCompleted: 0 },
            phase3: { completed: false, accuracy: 0, exercisesCompleted: 0 },
            phase4: { completed: false, accuracy: 0, exercisesCompleted: 0 },
            phase5: { completed: false, accuracy: 0, exercisesCompleted: 0 }
        };
        this.minDaysInPhase = 7;
        this.requiredAccuracy = 0.80; // 80%
    }

    /**
     * Initialize all 5 phases with their content and requirements
     */
    initializePhases() {
        return {
            phase1: {
                id: 1,
                name: 'Fundament - Gegenwart & Sein',
                level: 'A1-Einstieg',
                duration: '2-3 Wochen',
                targetExercises: 175,

                grammar: [
                    {
                        id: 'g1-pronouns',
                        name: 'Personalpronomen',
                        concepts: ['yo', 'tú', 'él/ella/usted', 'nosotros/as', 'vosotros/as', 'ellos/ellas/ustedes'],
                        required: true
                    },
                    {
                        id: 'g1-ser',
                        name: 'Verb SER (Identität)',
                        concepts: ['ser-conjugation', 'ser-usage-identity', 'ser-usage-profession'],
                        required: true
                    },
                    {
                        id: 'g1-estar',
                        name: 'Verb ESTAR (Zustand/Ort)',
                        concepts: ['estar-conjugation', 'estar-usage-location', 'estar-usage-state'],
                        required: true
                    },
                    {
                        id: 'g1-tener',
                        name: 'Verb TENER (haben)',
                        concepts: ['tener-conjugation', 'tener-usage-possession', 'tener-usage-age'],
                        required: true
                    },
                    {
                        id: 'g1-ser-estar-contrast',
                        name: 'SER vs ESTAR Grundlagen',
                        concepts: ['ser-estar-difference', 'permanent-vs-temporary'],
                        required: true
                    }
                ],

                vocabulary: {
                    categories: [
                        {
                            id: 'v1-greetings',
                            name: 'Begrüßung & Höflichkeit',
                            words: ['hola', 'adiós', 'buenos días', 'buenas tardes', 'buenas noches',
                                   'por favor', 'gracias', 'de nada', 'perdón', 'disculpe'],
                            target: 15
                        },
                        {
                            id: 'v1-description',
                            name: 'Personenbeschreibung',
                            words: ['hombre', 'mujer', 'niño', 'niña', 'amigo', 'familia',
                                   'alto', 'bajo', 'joven', 'viejo', 'simpático', 'inteligente'],
                            target: 20
                        },
                        {
                            id: 'v1-numbers',
                            name: 'Zahlen 0-20',
                            words: ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis',
                                   'siete', 'ocho', 'nueve', 'diez'],
                            target: 21
                        },
                        {
                            id: 'v1-colors',
                            name: 'Farben',
                            words: ['rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco',
                                   'gris', 'marrón', 'naranja', 'rosa'],
                            target: 10
                        },
                        {
                            id: 'v1-basic-nouns',
                            name: 'Grundlegende Nomen',
                            words: ['casa', 'perro', 'gato', 'mesa', 'silla', 'libro', 'teléfono',
                                   'agua', 'comida', 'pan', 'leche', 'café'],
                            target: 34
                        }
                    ],
                    totalTarget: 100
                },

                sentenceStructures: [
                    {
                        id: 's1-basic',
                        pattern: 'Subjekt + Verb + Adjektiv/Nomen',
                        examples: [
                            { es: 'Yo soy profesor', de: 'Ich bin Lehrer' },
                            { es: 'Tú eres inteligente', de: 'Du bist intelligent' },
                            { es: 'Él tiene un perro', de: 'Er hat einen Hund' }
                        ]
                    },
                    {
                        id: 's1-location',
                        pattern: 'Subjekt + Verb + Ort/Zustand',
                        examples: [
                            { es: 'Yo estoy en casa', de: 'Ich bin zu Hause' },
                            { es: 'Ella está cansada', de: 'Sie ist müde' }
                        ]
                    },
                    {
                        id: 's1-negation',
                        pattern: 'NO + Verb',
                        examples: [
                            { es: 'No soy profesor', de: 'Ich bin kein Lehrer' },
                            { es: 'No tengo tiempo', de: 'Ich habe keine Zeit' }
                        ]
                    }
                ],

                completionCriteria: {
                    minAccuracy: 0.80,
                    minExercises: 150,
                    minDays: 7,
                    requiredGrammarMastery: ['g1-ser', 'g1-estar', 'g1-tener'],
                    requiredVocabulary: 80 // 80 out of 100 target words
                }
            },

            phase2: {
                id: 2,
                name: 'Aktion & Ausdruck - Regelmäßige Verben',
                level: 'A1-Vertiefung',
                duration: '3-4 Wochen',
                targetExercises: 275,

                grammar: [
                    {
                        id: 'g2-ar-verbs',
                        name: 'Regelmäßige -AR Verben',
                        concepts: ['ar-conjugation', 'ar-patterns', 'common-ar-verbs'],
                        required: true
                    },
                    {
                        id: 'g2-er-verbs',
                        name: 'Regelmäßige -ER Verben',
                        concepts: ['er-conjugation', 'er-patterns', 'common-er-verbs'],
                        required: true
                    },
                    {
                        id: 'g2-ir-verbs',
                        name: 'Regelmäßige -IR Verben',
                        concepts: ['ir-conjugation', 'ir-patterns', 'common-ir-verbs'],
                        required: true
                    },
                    {
                        id: 'g2-questions',
                        name: 'Fragebildung',
                        concepts: ['yes-no-questions', 'w-questions', 'question-words'],
                        required: true
                    }
                ],

                vocabulary: {
                    categories: [
                        {
                            id: 'v2-activities',
                            name: 'Alltagsaktivitäten',
                            words: ['trabajar', 'estudiar', 'cocinar', 'limpiar', 'dormir',
                                   'comer', 'beber', 'hablar', 'escribir', 'leer'],
                            target: 30
                        },
                        {
                            id: 'v2-hobbies',
                            name: 'Hobbys & Freizeit',
                            words: ['deportes', 'música', 'cine', 'nadar', 'correr', 'jugar', 'bailar'],
                            target: 25
                        },
                        {
                            id: 'v2-food',
                            name: 'Essen & Trinken',
                            words: ['carne', 'pescado', 'verduras', 'frutas', 'arroz', 'pasta',
                                   'vino', 'cerveza', 'zumo', 'té'],
                            target: 30
                        },
                        {
                            id: 'v2-places',
                            name: 'Orte',
                            words: ['restaurante', 'supermercado', 'parque', 'playa', 'oficina', 'escuela'],
                            target: 25
                        },
                        {
                            id: 'v2-time',
                            name: 'Zeitangaben',
                            words: ['hoy', 'mañana', 'ayer', 'ahora', 'después', 'antes', 'siempre', 'nunca'],
                            target: 20
                        },
                        {
                            id: 'v2-adjectives',
                            name: 'Adjektive',
                            words: ['bueno', 'malo', 'grande', 'pequeño', 'bonito', 'feo', 'fácil', 'difícil'],
                            target: 20
                        }
                    ],
                    totalTarget: 150,
                    cumulativeTotal: 250
                },

                sentenceStructures: [
                    {
                        id: 's2-time-subject-verb',
                        pattern: 'Zeitangabe + Subjekt + Verb + Objekt',
                        examples: [
                            { es: 'Hoy yo trabajo en casa', de: 'Heute arbeite ich zu Hause' },
                            { es: 'Mañana tú comes con nosotros', de: 'Morgen isst du mit uns' }
                        ]
                    },
                    {
                        id: 's2-prepositions',
                        pattern: 'Subjekt + Verb + Präpositionalphrase',
                        examples: [
                            { es: 'Vivo en Madrid', de: 'Ich lebe in Madrid' },
                            { es: 'Trabajo con mi hermano', de: 'Ich arbeite mit meinem Bruder' }
                        ]
                    }
                ],

                conversations: [
                    {
                        id: 'c2-intro',
                        name: 'Sich vorstellen',
                        lines: [
                            { speaker: 'A', es: 'Hola, ¿cómo te llamas?', de: 'Hallo, wie heißt du?' },
                            { speaker: 'B', es: 'Me llamo María. ¿Y tú?', de: 'Ich heiße Maria. Und du?' },
                            { speaker: 'A', es: 'Yo soy Pedro. ¿Dónde vives?', de: 'Ich bin Pedro. Wo lebst du?' },
                            { speaker: 'B', es: 'Vivo en Barcelona.', de: 'Ich lebe in Barcelona.' }
                        ]
                    },
                    {
                        id: 'c2-hobbies',
                        name: 'Über Hobbys sprechen',
                        lines: [
                            { speaker: 'A', es: '¿Qué haces en tu tiempo libre?', de: 'Was machst du in deiner Freizeit?' },
                            { speaker: 'B', es: 'Leo libros y escucho música.', de: 'Ich lese Bücher und höre Musik.' }
                        ]
                    }
                ],

                completionCriteria: {
                    minAccuracy: 0.80,
                    minExercises: 250,
                    minDays: 14,
                    requiredGrammarMastery: ['g2-ar-verbs', 'g2-er-verbs', 'g2-ir-verbs'],
                    requiredVocabulary: 200 // cumulative
                }
            },

            phase3: {
                id: 3,
                name: 'Vergangenheit - Erzählen & Berichten',
                level: 'A2-Einstieg',
                duration: '4-5 Wochen',
                targetExercises: 325,

                grammar: [
                    {
                        id: 'g3-preterito',
                        name: 'Pretérito Indefinido',
                        concepts: ['preterito-regular', 'preterito-irregular', 'preterito-usage'],
                        required: true
                    },
                    {
                        id: 'g3-imperfecto',
                        name: 'Imperfecto',
                        concepts: ['imperfecto-regular', 'imperfecto-irregular', 'imperfecto-usage'],
                        required: true
                    },
                    {
                        id: 'g3-preterito-imperfecto',
                        name: 'Pretérito vs Imperfecto',
                        concepts: ['past-tense-contrast', 'action-vs-description', 'story-telling'],
                        required: true
                    }
                ],

                vocabulary: {
                    categories: [
                        {
                            id: 'v3-past-time',
                            name: 'Zeitausdrücke Vergangenheit',
                            words: ['ayer', 'anteayer', 'la semana pasada', 'el mes pasado', 'hace un año'],
                            target: 20
                        },
                        {
                            id: 'v3-biography',
                            name: 'Biografisches',
                            words: ['nacer', 'crecer', 'estudiar', 'graduarse', 'casarse', 'mudarse'],
                            target: 30
                        },
                        {
                            id: 'v3-events',
                            name: 'Aktivitäten & Ereignisse',
                            words: ['viajar', 'visitar', 'conocer', 'descubrir', 'aprender', 'celebrar'],
                            target: 40
                        },
                        {
                            id: 'v3-descriptions',
                            name: 'Beschreibungen',
                            words: ['tranquilo', 'ruidoso', 'aburrido', 'interesante', 'antiguo', 'moderno'],
                            target: 30
                        },
                        {
                            id: 'v3-connectors',
                            name: 'Konnektoren',
                            words: ['primero', 'después', 'luego', 'entonces', 'finalmente', 'mientras', 'cuando'],
                            target: 15
                        }
                    ],
                    totalTarget: 150,
                    cumulativeTotal: 400
                },

                completionCriteria: {
                    minAccuracy: 0.80,
                    minExercises: 300,
                    minDays: 21,
                    requiredGrammarMastery: ['g3-preterito', 'g3-imperfecto', 'g3-preterito-imperfecto'],
                    requiredVocabulary: 350
                }
            },

            phase4: {
                id: 4,
                name: 'Zukunft & Möglichkeiten',
                level: 'A2-Vertiefung',
                duration: '3-4 Wochen',
                targetExercises: 275,

                grammar: [
                    {
                        id: 'g4-futuro',
                        name: 'Futuro Simple',
                        concepts: ['futuro-regular', 'futuro-irregular', 'futuro-usage'],
                        required: true
                    },
                    {
                        id: 'g4-ir-a',
                        name: 'IR A + Infinitiv',
                        concepts: ['ir-a-formation', 'near-future', 'future-plans'],
                        required: true
                    },
                    {
                        id: 'g4-condicional',
                        name: 'Condicional',
                        concepts: ['condicional-formation', 'polite-requests', 'hypothetical'],
                        required: true
                    },
                    {
                        id: 'g4-perfecto',
                        name: 'Pretérito Perfecto',
                        concepts: ['perfecto-formation', 'irregular-participles', 'recent-past'],
                        required: true
                    }
                ],

                vocabulary: {
                    categories: [
                        {
                            id: 'v4-future-plans',
                            name: 'Zukunftspläne',
                            words: ['planear', 'decidir', 'esperar', 'intentar', 'conseguir'],
                            target: 25
                        },
                        {
                            id: 'v4-politeness',
                            name: 'Höflichkeit',
                            words: ['por favor', 'podrías', 'me gustaría', 'preferiría', 'sería posible'],
                            target: 20
                        },
                        {
                            id: 'v4-travel',
                            name: 'Reisen',
                            words: ['reservar', 'volar', 'conducir', 'hotel', 'aeropuerto', 'billete'],
                            target: 30
                        },
                        {
                            id: 'v4-work',
                            name: 'Arbeit & Karriere',
                            words: ['entrevista', 'currículum', 'jefe', 'colega', 'reunión', 'proyecto'],
                            target: 25
                        },
                        {
                            id: 'v4-technology',
                            name: 'Technik',
                            words: ['ordenador', 'móvil', 'internet', 'correo electrónico', 'aplicación'],
                            target: 30
                        }
                    ],
                    totalTarget: 150,
                    cumulativeTotal: 550
                },

                completionCriteria: {
                    minAccuracy: 0.80,
                    minExercises: 250,
                    minDays: 14,
                    requiredGrammarMastery: ['g4-futuro', 'g4-ir-a', 'g4-condicional'],
                    requiredVocabulary: 500
                }
            },

            phase5: {
                id: 5,
                name: 'Konversations-Meisterschaft',
                level: 'B1-Niveau',
                duration: '5-6 Wochen',
                targetExercises: 375,

                grammar: [
                    {
                        id: 'g5-subjuntivo',
                        name: 'Subjuntivo Presente (Einführung)',
                        concepts: ['subjuntivo-formation', 'subjuntivo-weirdo', 'subjuntivo-usage'],
                        required: true
                    },
                    {
                        id: 'g5-imperativo',
                        name: 'Imperativ',
                        concepts: ['imperativo-affirmative', 'imperativo-negative', 'imperativo-formal'],
                        required: true
                    },
                    {
                        id: 'g5-ser-estar-advanced',
                        name: 'SER vs ESTAR (Fortgeschritten)',
                        concepts: ['meaning-differences', 'advanced-usage'],
                        required: true
                    },
                    {
                        id: 'g5-por-para',
                        name: 'POR vs PARA',
                        concepts: ['por-usage', 'para-usage', 'por-para-contrast'],
                        required: true
                    }
                ],

                vocabulary: {
                    categories: [
                        {
                            id: 'v5-opinions',
                            name: 'Meinungen',
                            words: ['opinar', 'creer', 'pensar', 'parecer', 'estar de acuerdo'],
                            target: 30
                        },
                        {
                            id: 'v5-emotions',
                            name: 'Gefühle',
                            words: ['alegría', 'tristeza', 'miedo', 'sorpresa', 'enfado'],
                            target: 30
                        },
                        {
                            id: 'v5-idioms',
                            name: 'Idiomatische Ausdrücke',
                            words: ['echar de menos', 'tener ganas de', 'darse cuenta', 'llevarse bien'],
                            target: 25
                        },
                        {
                            id: 'v5-connectors-advanced',
                            name: 'Konnektoren (fortgeschritten)',
                            words: ['sin embargo', 'además', 'por lo tanto', 'en conclusión'],
                            target: 20
                        },
                        {
                            id: 'v5-abstract',
                            name: 'Abstrakte Konzepte',
                            words: ['libertad', 'justicia', 'sociedad', 'cultura', 'tradición'],
                            target: 25
                        },
                        {
                            id: 'v5-fillers',
                            name: 'Konversations-Füller',
                            words: ['bueno', 'pues', 'vale', 'a ver', 'o sea', 'la verdad es que'],
                            target: 20
                        }
                    ],
                    totalTarget: 150,
                    cumulativeTotal: 700
                },

                completionCriteria: {
                    minAccuracy: 0.80,
                    minExercises: 350,
                    minDays: 28,
                    requiredGrammarMastery: ['g5-subjuntivo', 'g5-imperativo', 'g5-por-para'],
                    requiredVocabulary: 650
                }
            }
        };
    }

    /**
     * Get current phase data
     */
    getCurrentPhase() {
        return this.phases[`phase${this.currentPhase}`];
    }

    /**
     * Get phase by ID
     */
    getPhase(phaseId) {
        return this.phases[`phase${phaseId}`];
    }

    /**
     * Check if user can advance to next phase
     */
    canAdvanceToNextPhase() {
        const currentPhase = this.getCurrentPhase();
        const progress = this.userProgress[`phase${this.currentPhase}`];
        const criteria = currentPhase.completionCriteria;

        // Check all completion criteria
        const meetsAccuracy = progress.accuracy >= criteria.minAccuracy;
        const meetsExercises = progress.exercisesCompleted >= criteria.minExercises;
        const meetsDays = this.getDaysInCurrentPhase() >= criteria.minDays;

        return {
            canAdvance: meetsAccuracy && meetsExercises && meetsDays,
            criteria: {
                accuracy: { current: progress.accuracy, required: criteria.minAccuracy, met: meetsAccuracy },
                exercises: { current: progress.exercisesCompleted, required: criteria.minExercises, met: meetsExercises },
                days: { current: this.getDaysInCurrentPhase(), required: criteria.minDays, met: meetsDays }
            }
        };
    }

    /**
     * Advance to next phase
     */
    advanceToNextPhase() {
        const canAdvance = this.canAdvanceToNextPhase();

        if (!canAdvance.canAdvance) {
            return {
                success: false,
                message: 'Completion criteria not met',
                criteria: canAdvance.criteria
            };
        }

        if (this.currentPhase >= 5) {
            return {
                success: false,
                message: 'Already at final phase'
            };
        }

        // Mark current phase as completed
        this.userProgress[`phase${this.currentPhase}`].completed = true;

        // Advance to next phase
        this.currentPhase++;

        return {
            success: true,
            newPhase: this.currentPhase,
            message: `Advanced to Phase ${this.currentPhase}`
        };
    }

    /**
     * Record exercise completion
     */
    recordExerciseCompletion(correct, total) {
        const phaseKey = `phase${this.currentPhase}`;
        const progress = this.userProgress[phaseKey];

        progress.exercisesCompleted++;

        // Update rolling accuracy
        const sessionAccuracy = correct / total;
        const totalExercises = progress.exercisesCompleted;
        progress.accuracy = ((progress.accuracy * (totalExercises - 1)) + sessionAccuracy) / totalExercises;
    }

    /**
     * Get days spent in current phase
     */
    getDaysInCurrentPhase() {
        const phaseStartDate = localStorage.getItem(`phase${this.currentPhase}_startDate`);

        if (!phaseStartDate) {
            // Set start date if not exists
            localStorage.setItem(`phase${this.currentPhase}_startDate`, Date.now().toString());
            return 0;
        }

        const daysPassed = Math.floor((Date.now() - parseInt(phaseStartDate)) / (1000 * 60 * 60 * 24));
        return daysPassed;
    }

    /**
     * Get overall progress statistics
     */
    getProgressStatistics() {
        const currentPhase = this.getCurrentPhase();
        const progress = this.userProgress[`phase${this.currentPhase}`];

        return {
            currentPhase: this.currentPhase,
            phaseName: currentPhase.name,
            level: currentPhase.level,
            accuracy: (progress.accuracy * 100).toFixed(1) + '%',
            exercisesCompleted: progress.exercisesCompleted,
            targetExercises: currentPhase.targetExercises,
            daysInPhase: this.getDaysInCurrentPhase(),
            targetDays: currentPhase.completionCriteria.minDays,
            canAdvance: this.canAdvanceToNextPhase().canAdvance
        };
    }

    /**
     * Reset to Phase 1 (for testing or restart)
     */
    resetToPhaseOne() {
        this.currentPhase = 1;
        Object.keys(this.userProgress).forEach(phase => {
            this.userProgress[phase] = { completed: false, accuracy: 0, exercisesCompleted: 0 };
        });

        // Clear phase start dates
        for (let i = 1; i <= 5; i++) {
            localStorage.removeItem(`phase${i}_startDate`);
        }
    }

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        localStorage.setItem('learningProgress', JSON.stringify({
            currentPhase: this.currentPhase,
            userProgress: this.userProgress
        }));
    }

    /**
     * Load progress from localStorage
     */
    loadProgress() {
        const saved = localStorage.getItem('learningProgress');
        if (saved) {
            const data = JSON.parse(saved);
            this.currentPhase = data.currentPhase;
            this.userProgress = data.userProgress;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LearningProgressionSystem };
}
