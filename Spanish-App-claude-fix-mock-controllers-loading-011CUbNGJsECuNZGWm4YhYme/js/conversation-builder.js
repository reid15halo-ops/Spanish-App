/**
 * Conversation Builder
 *
 * Generates realistic conversation exercises and dialogues
 * Adapts to user's current learning phase and proficiency
 */

class ConversationBuilder {
    constructor() {
        this.conversationTemplates = this.initializeConversationTemplates();
        this.sentencePatterns = this.initializeSentencePatterns();
        this.contextualVocabulary = this.initializeContextualVocabulary();
    }

    /**
     * Initialize conversation templates for different phases
     */
    initializeConversationTemplates() {
        return {
            phase1: [
                {
                    id: 'greeting-basic',
                    name: 'Grundlegende Begrüßung',
                    difficulty: 1,
                    context: 'informal',
                    template: [
                        { speaker: 'A', text: 'Hola', translation: 'Hallo' },
                        { speaker: 'B', text: '¿Cómo estás?', translation: 'Wie geht es dir?' },
                        { speaker: 'A', text: 'Bien, gracias. ¿Y tú?', translation: 'Gut, danke. Und dir?' },
                        { speaker: 'B', text: 'Muy bien', translation: 'Sehr gut' }
                    ]
                },
                {
                    id: 'intro-name',
                    name: 'Sich vorstellen',
                    difficulty: 1,
                    context: 'informal',
                    template: [
                        { speaker: 'A', text: '¿Cómo te llamas?', translation: 'Wie heißt du?' },
                        { speaker: 'B', text: 'Me llamo {name}. ¿Y tú?', translation: 'Ich heiße {name}. Und du?' },
                        { speaker: 'A', text: 'Yo soy {name}', translation: 'Ich bin {name}' },
                        { speaker: 'B', text: 'Mucho gusto', translation: 'Sehr erfreut' }
                    ],
                    variables: ['name']
                },
                {
                    id: 'where-from',
                    name: 'Woher kommst du?',
                    difficulty: 2,
                    context: 'informal',
                    template: [
                        { speaker: 'A', text: '¿De dónde eres?', translation: 'Woher kommst du?' },
                        { speaker: 'B', text: 'Soy de {country}. ¿Y tú?', translation: 'Ich komme aus {country}. Und du?' },
                        { speaker: 'A', text: 'Yo soy de {country}', translation: 'Ich komme aus {country}' }
                    ],
                    variables: ['country']
                }
            ],

            phase2: [
                {
                    id: 'daily-activities',
                    name: 'Tagesablauf',
                    difficulty: 2,
                    context: 'informal',
                    template: [
                        { speaker: 'A', text: '¿Qué haces normalmente por la mañana?', translation: 'Was machst du normalerweise morgens?' },
                        { speaker: 'B', text: 'Me despierto a las {time}, desayuno y luego voy a {place}',
                          translation: 'Ich wache um {time} auf, frühstücke und gehe dann zu {place}' },
                        { speaker: 'A', text: '¿Y por la tarde?', translation: 'Und nachmittags?' },
                        { speaker: 'B', text: 'Trabajo hasta las {time} y después {activity}',
                          translation: 'Ich arbeite bis {time} und danach {activity}' }
                    ],
                    variables: ['time', 'place', 'activity']
                },
                {
                    id: 'hobbies-interests',
                    name: 'Hobbys und Interessen',
                    difficulty: 2,
                    context: 'informal',
                    template: [
                        { speaker: 'A', text: '¿Qué te gusta hacer en tu tiempo libre?',
                          translation: 'Was machst du gerne in deiner Freizeit?' },
                        { speaker: 'B', text: 'Me gusta {activity}. ¿Y a ti?',
                          translation: 'Ich mag {activity}. Und du?' },
                        { speaker: 'A', text: 'A mí me gusta {activity}',
                          translation: 'Ich mag {activity}' },
                        { speaker: 'B', text: '¡Qué interesante!', translation: 'Wie interessant!' }
                    ],
                    variables: ['activity']
                },
                {
                    id: 'restaurant-order',
                    name: 'Im Restaurant bestellen',
                    difficulty: 3,
                    context: 'formal',
                    template: [
                        { speaker: 'Kellner', text: 'Buenas tardes. ¿Qué desean?',
                          translation: 'Guten Tag. Was möchten Sie?' },
                        { speaker: 'Kunde', text: 'Para mí, {dish}, por favor',
                          translation: 'Für mich {dish}, bitte' },
                        { speaker: 'Kellner', text: '¿Y para beber?',
                          translation: 'Und zum Trinken?' },
                        { speaker: 'Kunde', text: '{drink}, por favor',
                          translation: '{drink}, bitte' }
                    ],
                    variables: ['dish', 'drink']
                }
            ],

            phase3: [
                {
                    id: 'past-weekend',
                    name: 'Über das Wochenende sprechen',
                    difficulty: 3,
                    context: 'informal',
                    template: [
                        { speaker: 'A', text: '¿Qué hiciste el fin de semana?',
                          translation: 'Was hast du am Wochenende gemacht?' },
                        { speaker: 'B', text: 'El sábado fui a {place} y {activity}',
                          translation: 'Am Samstag ging ich zu {place} und {activity}' },
                        { speaker: 'A', text: '¿Te gustó?', translation: 'Hat es dir gefallen?' },
                        { speaker: 'B', text: 'Sí, fue muy {adjective}',
                          translation: 'Ja, es war sehr {adjective}' }
                    ],
                    variables: ['place', 'activity', 'adjective']
                },
                {
                    id: 'childhood-memories',
                    name: 'Kindheitserinnerungen',
                    difficulty: 4,
                    context: 'informal',
                    template: [
                        { speaker: 'A', text: '¿Cómo era tu infancia?',
                          translation: 'Wie war deine Kindheit?' },
                        { speaker: 'B', text: 'Cuando era niño, vivía en {place} y {activity}',
                          translation: 'Als ich Kind war, lebte ich in {place} und {activity}' },
                        { speaker: 'A', text: '¿Qué hacías en tu tiempo libre?',
                          translation: 'Was hast du in deiner Freizeit gemacht?' },
                        { speaker: 'B', text: 'Jugaba con {person} y {activity}',
                          translation: 'Ich spielte mit {person} und {activity}' }
                    ],
                    variables: ['place', 'activity', 'person']
                },
                {
                    id: 'travel-story',
                    name: 'Reisegeschichte',
                    difficulty: 4,
                    context: 'informal',
                    template: [
                        { speaker: 'A', text: '¿Has viajado a España?',
                          translation: 'Bist du schon nach Spanien gereist?' },
                        { speaker: 'B', text: 'Sí, hace {time} fui a {city}',
                          translation: 'Ja, vor {time} war ich in {city}' },
                        { speaker: 'A', text: '¿Qué visitaste?', translation: 'Was hast du besucht?' },
                        { speaker: 'B', text: 'Visité {place} y fue increíble',
                          translation: 'Ich besuchte {place} und es war unglaublich' }
                    ],
                    variables: ['time', 'city', 'place']
                }
            ],

            phase4: [
                {
                    id: 'future-plans',
                    name: 'Zukunftspläne',
                    difficulty: 4,
                    context: 'informal',
                    template: [
                        { speaker: 'A', text: '¿Qué vas a hacer este verano?',
                          translation: 'Was wirst du diesen Sommer machen?' },
                        { speaker: 'B', text: 'Voy a {activity} y después {activity2}',
                          translation: 'Ich werde {activity} und danach {activity2}' },
                        { speaker: 'A', text: '¿Cuánto tiempo estarás?',
                          translation: 'Wie lange wirst du bleiben?' },
                        { speaker: 'B', text: 'Estaré {duration}',
                          translation: 'Ich werde {duration} bleiben' }
                    ],
                    variables: ['activity', 'activity2', 'duration']
                },
                {
                    id: 'hotel-reservation',
                    name: 'Hotelreservierung',
                    difficulty: 4,
                    context: 'formal',
                    template: [
                        { speaker: 'Rezeption', text: 'Buenos días, ¿en qué puedo ayudarle?',
                          translation: 'Guten Tag, wie kann ich Ihnen helfen?' },
                        { speaker: 'Gast', text: 'Me gustaría reservar una habitación para {duration}',
                          translation: 'Ich würde gerne ein Zimmer für {duration} reservieren' },
                        { speaker: 'Rezeption', text: '¿Individual o doble?',
                          translation: 'Einzel- oder Doppelzimmer?' },
                        { speaker: 'Gast', text: '{room_type}, por favor',
                          translation: '{room_type}, bitte' }
                    ],
                    variables: ['duration', 'room_type']
                },
                {
                    id: 'job-interview',
                    name: 'Vorstellungsgespräch',
                    difficulty: 5,
                    context: 'formal',
                    template: [
                        { speaker: 'Interviewer', text: '¿Por qué le gustaría trabajar aquí?',
                          translation: 'Warum möchten Sie hier arbeiten?' },
                        { speaker: 'Kandidat', text: 'Me interesa mucho {reason} y creo que podría contribuir con {skill}',
                          translation: 'Ich interessiere mich sehr für {reason} und glaube, dass ich mit {skill} beitragen könnte' },
                        { speaker: 'Interviewer', text: '¿Cuándo podría empezar?',
                          translation: 'Wann könnten Sie anfangen?' },
                        { speaker: 'Kandidat', text: 'Podría empezar {timeframe}',
                          translation: 'Ich könnte {timeframe} anfangen' }
                    ],
                    variables: ['reason', 'skill', 'timeframe']
                }
            ],

            phase5: [
                {
                    id: 'express-opinion',
                    name: 'Meinung äußern',
                    difficulty: 5,
                    context: 'informal',
                    template: [
                        { speaker: 'A', text: '¿Qué opinas sobre {topic}?',
                          translation: 'Was denkst du über {topic}?' },
                        { speaker: 'B', text: 'En mi opinión, creo que {opinion}. ¿Y tú?',
                          translation: 'Meiner Meinung nach glaube ich, dass {opinion}. Und du?' },
                        { speaker: 'A', text: 'Pues, yo pienso que {counter_opinion}',
                          translation: 'Nun, ich denke, dass {counter_opinion}' },
                        { speaker: 'B', text: 'Entiendo tu punto de vista',
                          translation: 'Ich verstehe deinen Standpunkt' }
                    ],
                    variables: ['topic', 'opinion', 'counter_opinion']
                },
                {
                    id: 'give-advice',
                    name: 'Ratschläge geben',
                    difficulty: 5,
                    context: 'informal',
                    template: [
                        { speaker: 'A', text: 'Tengo un problema con {problem}',
                          translation: 'Ich habe ein Problem mit {problem}' },
                        { speaker: 'B', text: 'Te recomiendo que {advice}',
                          translation: 'Ich empfehle dir, dass du {advice}' },
                        { speaker: 'A', text: '¿Crees que eso funcionaría?',
                          translation: 'Glaubst du, das würde funktionieren?' },
                        { speaker: 'B', text: 'Sí, creo que sería una buena idea',
                          translation: 'Ja, ich glaube, das wäre eine gute Idee' }
                    ],
                    variables: ['problem', 'advice']
                },
                {
                    id: 'debate-topic',
                    name: 'Diskussion führen',
                    difficulty: 6,
                    context: 'formal',
                    template: [
                        { speaker: 'A', text: 'Aunque entiendo tu posición sobre {topic}, me parece que {argument}',
                          translation: 'Obwohl ich deine Position zu {topic} verstehe, scheint mir, dass {argument}' },
                        { speaker: 'B', text: 'Sin embargo, hay que considerar que {counter_argument}',
                          translation: 'Allerdings muss man berücksichtigen, dass {counter_argument}' },
                        { speaker: 'A', text: 'Es cierto, pero por otro lado {rebuttal}',
                          translation: 'Das stimmt, aber andererseits {rebuttal}' },
                        { speaker: 'B', text: 'Tienes razón en ese punto',
                          translation: 'Da hast du recht' }
                    ],
                    variables: ['topic', 'argument', 'counter_argument', 'rebuttal']
                }
            ]
        };
    }

    /**
     * Initialize sentence patterns for generation
     */
    initializeSentencePatterns() {
        return {
            phase1: [
                { pattern: '{subject} {ser} {adjective}', example: 'Yo soy feliz' },
                { pattern: '{subject} {estar} {location}', example: 'Tú estás en casa' },
                { pattern: '{subject} {tener} {noun}', example: 'Él tiene un perro' }
            ],
            phase2: [
                { pattern: '{subject} {verb-ar} {object}', example: 'Yo hablo español' },
                { pattern: '{time} {subject} {verb-er} {object}', example: 'Hoy yo como pizza' },
                { pattern: '{subject} {verb-ir} en {place}', example: 'Nosotros vivimos en Madrid' }
            ],
            phase3: [
                { pattern: '{time-past} {subject} {preterito} {object}', example: 'Ayer yo comí pizza' },
                { pattern: 'Cuando {subject} {imperfecto}, {subject} {preterito}',
                  example: 'Cuando era niño, viajé a España' }
            ],
            phase4: [
                { pattern: '{subject} {ir-a} {infinitive} {time-future}', example: 'Voy a viajar mañana' },
                { pattern: '{subject} {futuro} {object} {time-future}', example: 'Estudiaré español el próximo año' },
                { pattern: 'Me gustaría {infinitive}', example: 'Me gustaría viajar a España' }
            ],
            phase5: [
                { pattern: 'Espero que {subject} {subjuntivo}', example: 'Espero que vengas pronto' },
                { pattern: 'Es importante que {subject} {subjuntivo}', example: 'Es importante que estudies' },
                { pattern: 'Aunque {indicative}, {main-clause}', example: 'Aunque llueve, voy a salir' }
            ]
        };
    }

    /**
     * Initialize contextual vocabulary
     */
    initializeContextualVocabulary() {
        return {
            greetings: ['hola', 'buenos días', 'buenas tardes', 'buenas noches'],
            places: ['casa', 'trabajo', 'escuela', 'parque', 'restaurante', 'playa'],
            activities: ['estudiar', 'trabajar', 'cocinar', 'leer', 'viajar', 'nadar'],
            adjectives: ['feliz', 'triste', 'cansado', 'emocionado', 'interesante', 'aburrido'],
            time_expressions: ['hoy', 'mañana', 'ayer', 'la semana pasada', 'el año próximo'],
            countries: ['España', 'México', 'Argentina', 'Colombia', 'Alemania'],
            foods: ['pizza', 'paella', 'tortilla', 'ensalada', 'pescado', 'carne']
        };
    }

    /**
     * Generate a conversation for a specific phase
     */
    generateConversation(phase, conversationId = null) {
        const templates = this.conversationTemplates[`phase${phase}`];

        if (!templates) {
            throw new Error(`No templates found for phase ${phase}`);
        }

        let template;
        if (conversationId) {
            template = templates.find(t => t.id === conversationId);
        } else {
            // Random template from this phase
            template = templates[Math.floor(Math.random() * templates.length)];
        }

        if (!template) {
            throw new Error(`Template ${conversationId} not found in phase ${phase}`);
        }

        // Fill in variables if needed
        const conversation = this.fillConversationVariables(template);

        return {
            id: template.id,
            name: template.name,
            difficulty: template.difficulty,
            context: template.context,
            dialogue: conversation
        };
    }

    /**
     * Fill conversation variables with contextual vocabulary
     */
    fillConversationVariables(template) {
        if (!template.variables) {
            return template.template;
        }

        const filledDialogue = template.template.map(line => {
            let text = line.text;
            let translation = line.translation;

            template.variables.forEach(variable => {
                const placeholder = `{${variable}}`;
                if (text.includes(placeholder)) {
                    const replacement = this.getRandomValueForVariable(variable);
                    text = text.replace(placeholder, replacement.es);
                    translation = translation.replace(placeholder, replacement.de);
                }
            });

            return {
                speaker: line.speaker,
                text,
                translation
            };
        });

        return filledDialogue;
    }

    /**
     * Get random value for a variable
     */
    getRandomValueForVariable(variable) {
        const values = {
            name: [
                { es: 'María', de: 'Maria' },
                { es: 'Juan', de: 'Juan' },
                { es: 'Ana', de: 'Ana' },
                { es: 'Carlos', de: 'Carlos' }
            ],
            country: [
                { es: 'España', de: 'Spanien' },
                { es: 'México', de: 'Mexiko' },
                { es: 'Alemania', de: 'Deutschland' },
                { es: 'Argentina', de: 'Argentinien' }
            ],
            time: [
                { es: '7:00', de: '7:00 Uhr' },
                { es: '8:30', de: '8:30 Uhr' },
                { es: '9:00', de: '9:00 Uhr' }
            ],
            place: [
                { es: 'el trabajo', de: 'die Arbeit' },
                { es: 'la escuela', de: 'die Schule' },
                { es: 'el gimnasio', de: 'das Fitnessstudio' }
            ],
            activity: [
                { es: 'leo un libro', de: 'ich lese ein Buch' },
                { es: 'veo televisión', de: 'ich sehe fern' },
                { es: 'hago ejercicio', de: 'ich mache Sport' }
            ],
            dish: [
                { es: 'la paella', de: 'die Paella' },
                { es: 'el bistec', de: 'das Steak' },
                { es: 'la ensalada', de: 'der Salat' }
            ],
            drink: [
                { es: 'agua', de: 'Wasser' },
                { es: 'vino tinto', de: 'Rotwein' },
                { es: 'cerveza', de: 'Bier' }
            ],
            adjective: [
                { es: 'divertido', de: 'lustig' },
                { es: 'interesante', de: 'interessant' },
                { es: 'emocionante', de: 'aufregend' }
            ],
            person: [
                { es: 'mis amigos', de: 'meinen Freunden' },
                { es: 'mi hermano', de: 'meinem Bruder' },
                { es: 'mis primos', de: 'meinen Cousins' }
            ],
            city: [
                { es: 'Barcelona', de: 'Barcelona' },
                { es: 'Madrid', de: 'Madrid' },
                { es: 'Sevilla', de: 'Sevilla' }
            ],
            duration: [
                { es: 'dos semanas', de: 'zwei Wochen' },
                { es: 'un mes', de: 'einen Monat' },
                { es: 'tres días', de: 'drei Tage' }
            ],
            room_type: [
                { es: 'Individual', de: 'Einzelzimmer' },
                { es: 'Doble', de: 'Doppelzimmer' }
            ]
        };

        const options = values[variable];
        if (!options) {
            return { es: `{${variable}}`, de: `{${variable}}` };
        }

        return options[Math.floor(Math.random() * options.length)];
    }

    /**
     * Generate a conversation exercise (fill in the blanks)
     */
    generateConversationExercise(phase, conversationId = null) {
        const conversation = this.generateConversation(phase, conversationId);

        // Randomly remove 2-3 words for the user to fill in
        const numBlanks = Math.floor(Math.random() * 2) + 2; // 2-3 blanks
        const dialogue = conversation.dialogue;
        const blanks = [];

        // Select random lines to create blanks
        const eligibleLines = dialogue.filter((line, idx) => idx > 0); // Skip first line
        const selectedIndices = [];

        for (let i = 0; i < numBlanks && i < eligibleLines.length; i++) {
            let randomIdx;
            do {
                randomIdx = Math.floor(Math.random() * eligibleLines.length) + 1;
            } while (selectedIndices.includes(randomIdx));
            selectedIndices.push(randomIdx);

            const line = dialogue[randomIdx];
            const words = line.text.split(' ');
            const wordIdx = Math.floor(Math.random() * words.length);
            const blankWord = words[wordIdx];

            // Replace word with blank
            words[wordIdx] = '______';
            dialogue[randomIdx].text = words.join(' ');

            blanks.push({
                lineIndex: randomIdx,
                correctAnswer: blankWord,
                hint: line.translation
            });
        }

        return {
            ...conversation,
            dialogue,
            blanks
        };
    }

    /**
     * Validate conversation exercise answer
     */
    validateConversationAnswer(blanks, userAnswers) {
        const results = [];

        blanks.forEach((blank, index) => {
            const userAnswer = userAnswers[index];
            const correct = this.normalize(userAnswer) === this.normalize(blank.correctAnswer);

            results.push({
                index,
                correct,
                userAnswer,
                correctAnswer: blank.correctAnswer,
                hint: blank.hint
            });
        });

        const totalCorrect = results.filter(r => r.correct).length;
        const accuracy = totalCorrect / blanks.length;

        return {
            results,
            accuracy,
            passed: accuracy >= 0.8
        };
    }

    /**
     * Normalize for comparison
     */
    normalize(str) {
        return str.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    /**
     * Get all conversations for a phase
     */
    getPhaseConversations(phase) {
        return this.conversationTemplates[`phase${phase}`] || [];
    }

    /**
     * Get conversation by difficulty
     */
    getConversationsByDifficulty(phase, minDifficulty, maxDifficulty) {
        const conversations = this.getPhaseConversations(phase);
        return conversations.filter(c =>
            c.difficulty >= minDifficulty && c.difficulty <= maxDifficulty
        );
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ConversationBuilder };
}
