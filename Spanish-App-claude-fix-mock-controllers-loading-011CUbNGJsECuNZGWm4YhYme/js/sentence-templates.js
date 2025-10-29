/**
 * Sentence Template Engine
 *
 * Generates dynamic exercises from templates with variables
 * Supports: {verb}, {subject}, {noun}, {adjective}, {place}, etc.
 */

class SentenceTemplateEngine {
    constructor(vocabularyDatabase) {
        this.vocab = vocabularyDatabase;
        this.templates = this.initializeTemplates();
    }

    initializeTemplates() {
        return {
            // SER templates (identity, description, origin)
            'ser-identity': [
                {
                    es: 'Yo soy {profession}',
                    de: 'Ich bin {profession_de}',
                    variables: ['profession'],
                    concept: 'ser-identity',
                    difficulty: 1,
                    hint: 'Beruf = SER (DOCTOR Regel: Occupation)'
                },
                {
                    es: '{subject} {verb_ser} {profession}',
                    de: '{subject_de} ist {profession_de}',
                    variables: ['subject', 'profession'],
                    concept: 'ser-identity',
                    difficulty: 2,
                    hint: 'Beruf ist eine dauerhafte Eigenschaft → SER'
                }
            ],

            'ser-description': [
                {
                    es: 'Yo soy {adjective}',
                    de: 'Ich bin {adjective_de}',
                    variables: ['adjective'],
                    concept: 'ser-description',
                    difficulty: 1,
                    hint: 'Dauerhafte Eigenschaft = SER (DOCTOR Regel: Description)'
                },
                {
                    es: 'El {noun} es {adjective}',
                    de: 'Der/Die {noun_de} ist {adjective_de}',
                    variables: ['noun', 'adjective'],
                    concept: 'ser-description',
                    difficulty: 2,
                    hint: 'Objektbeschreibung mit SER'
                },
                {
                    es: 'Mi {noun} es {adjective} y {adjective2}',
                    de: 'Mein {noun_de} ist {adjective_de} und {adjective2_de}',
                    variables: ['noun', 'adjective', 'adjective2'],
                    concept: 'ser-description',
                    difficulty: 3,
                    hint: 'Mehrere Eigenschaften mit SER'
                }
            ],

            'ser-origin': [
                {
                    es: 'Yo soy de {country}',
                    de: 'Ich bin aus {country_de}',
                    variables: ['country'],
                    concept: 'ser-origin',
                    difficulty: 1,
                    hint: 'Herkunft = SER (DOCTOR Regel: Origin)'
                },
                {
                    es: '{subject} {verb_ser} de {city}',
                    de: '{subject_de} ist aus {city_de}',
                    variables: ['subject', 'city'],
                    concept: 'ser-origin',
                    difficulty: 2,
                    hint: 'Herkunftsangabe mit SER'
                }
            ],

            // ESTAR templates (location, emotion, temporary state)
            'estar-location': [
                {
                    es: 'Yo estoy en {place}',
                    de: 'Ich bin in/im {place_de}',
                    variables: ['place'],
                    concept: 'estar-location',
                    difficulty: 1,
                    hint: 'Ort = ESTAR (LECH Regel: Location)'
                },
                {
                    es: '{subject} {verb_estar} en la {place}',
                    de: '{subject_de} ist in/im {place_de}',
                    variables: ['subject', 'place'],
                    concept: 'estar-location',
                    difficulty: 2,
                    hint: 'Ortsangabe mit ESTAR'
                },
                {
                    es: 'Mi {noun} está en la {place}',
                    de: 'Mein {noun_de} ist in/im {place_de}',
                    variables: ['noun', 'place'],
                    concept: 'estar-location',
                    difficulty: 2,
                    hint: 'Position eines Objekts mit ESTAR'
                }
            ],

            'estar-emotion': [
                {
                    es: 'Yo estoy {emotion}',
                    de: 'Ich bin {emotion_de}',
                    variables: ['emotion'],
                    concept: 'estar-emotion',
                    difficulty: 1,
                    hint: 'Gefühle = ESTAR (LECH Regel: Emotion)'
                },
                {
                    es: 'Hoy estoy {emotion}',
                    de: 'Heute bin ich {emotion_de}',
                    variables: ['emotion'],
                    concept: 'estar-emotion',
                    difficulty: 1,
                    hint: 'Vorübergehende Gefühle mit ESTAR'
                },
                {
                    es: '{subject} {verb_estar} {emotion} hoy',
                    de: '{subject_de} ist heute {emotion_de}',
                    variables: ['subject', 'emotion'],
                    concept: 'estar-emotion',
                    difficulty: 2,
                    hint: 'Emotionale Zustände sind vorübergehend → ESTAR'
                }
            ],

            // TENER templates (possession, age, expressions)
            'tener-possession': [
                {
                    es: 'Yo tengo un {noun}',
                    de: 'Ich habe einen/eine {noun_de}',
                    variables: ['noun'],
                    concept: 'tener-possession',
                    difficulty: 1,
                    hint: 'Besitz = TENER (haben)'
                },
                {
                    es: 'Tengo {number} {noun_plural}',
                    de: 'Ich habe {number_de} {noun_plural_de}',
                    variables: ['number', 'noun_plural'],
                    concept: 'tener-possession',
                    difficulty: 2,
                    hint: 'TENER für Besitz verwenden'
                }
            ],

            'tener-age': [
                {
                    es: 'Yo tengo {age} años',
                    de: 'Ich bin {age} Jahre alt',
                    variables: ['age'],
                    concept: 'tener-age',
                    difficulty: 1,
                    hint: '⚠️ Im Spanischen: TENER für Alter, nicht SER!'
                },
                {
                    es: 'Mi {family_member} tiene {age} años',
                    de: 'Mein/e {family_member_de} ist {age} Jahre alt',
                    variables: ['family_member', 'age'],
                    concept: 'tener-age',
                    difficulty: 2,
                    hint: 'Alter immer mit TENER ausdrücken'
                }
            ],

            // Action verbs with objects
            'action-food': [
                {
                    es: 'Yo {verb_comer} {food}',
                    de: 'Ich esse {food_de}',
                    variables: ['food'],
                    concept: 'action-food',
                    difficulty: 1,
                    hint: 'Regelmäßiges -er Verb: comer'
                },
                {
                    es: 'Quiero comer {food_emoji}',
                    de: 'Ich möchte {food_de} essen',
                    variables: ['food_emoji'],
                    concept: 'action-food-emoji',
                    difficulty: 2,
                    hint: 'Was bedeutet das Emoji?',
                    type: 'emoji-fill'
                }
            ],

            'action-location': [
                {
                    es: 'Yo {verb_ir} a la {place}',
                    de: 'Ich gehe zu/ins {place_de}',
                    variables: ['place'],
                    concept: 'action-location',
                    difficulty: 2,
                    hint: 'IR (gehen) ist unregelmäßig: voy, vas, va...'
                },
                {
                    es: 'Voy a la {place_emoji}',
                    de: 'Ich gehe zu/ins {place_de}',
                    variables: ['place_emoji'],
                    concept: 'action-location-emoji',
                    difficulty: 2,
                    hint: 'Was bedeutet das Emoji?',
                    type: 'emoji-fill'
                }
            ],

            // SER/ESTAR contrast (tricky for Germans!)
            'ser-estar-contrast': [
                {
                    es: 'Yo {verb_choice} estudiante',
                    de: 'Ich bin Student',
                    variables: [],
                    correctVerb: 'soy',
                    wrongVerb: 'estoy',
                    concept: 'ser-estar-fundamental',
                    difficulty: 3,
                    hint: '⚠️ Beruf = dauerhaft → SER!',
                    explanation: 'Häufiger Fehler! Beruf mit SER, nicht ESTAR.'
                },
                {
                    es: 'Yo {verb_choice} en Madrid',
                    de: 'Ich bin in Madrid',
                    variables: [],
                    correctVerb: 'estoy',
                    wrongVerb: 'soy',
                    concept: 'ser-estar-fundamental',
                    difficulty: 3,
                    hint: '⚠️ Ort = vorübergehend → ESTAR!',
                    explanation: 'Ortsangaben immer mit ESTAR.'
                },
                {
                    es: 'Yo {verb_choice} {emotion}',
                    de: 'Ich bin {emotion_de}',
                    variables: ['emotion'],
                    correctVerb: 'estoy',
                    wrongVerb: 'soy',
                    concept: 'ser-estar-emotion',
                    difficulty: 4,
                    hint: 'Gefühle sind vorübergehend → ESTAR',
                    explanation: 'Emotionale Zustände mit ESTAR, nicht SER.'
                }
            ],

            // Emoji-based templates
            'emoji-guess': [
                {
                    emoji: '{emoji}',
                    answer: '{word}',
                    de: '{word_de}',
                    category: '{category}',
                    difficulty: 1,
                    concept: 'emoji-vocabulary',
                    hint: 'Was bedeutet dieses Emoji auf Spanisch?',
                    type: 'emoji-guess'
                }
            ],

            'emoji-sentence': [
                {
                    es: 'Quiero comer una {emoji}',
                    answer: '{food}',
                    de: 'Ich möchte eine/n {food_de} essen',
                    difficulty: 2,
                    concept: 'emoji-fill',
                    hint: 'Setze das spanische Wort für das Emoji ein',
                    type: 'emoji-fill'
                }
            ]
        };
    }

    /**
     * Generate exercise from template
     */
    generateExercise(templateType, userDifficulty = 1) {
        const templates = this.templates[templateType];
        if (!templates || templates.length === 0) {
            return null;
        }

        // Filter by difficulty
        const suitable = templates.filter(t => t.difficulty <= userDifficulty + 1);
        if (suitable.length === 0) return null;

        // Pick random template
        const template = suitable[Math.floor(Math.random() * suitable.length)];

        // Fill variables
        return this.fillTemplate(template, templateType);
    }

    /**
     * Fill template with vocabulary
     */
    fillTemplate(template, templateType) {
        let exercise = {
            id: `dynamic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: template.type || this.getExerciseType(templateType),
            concept: template.concept,
            difficulty: template.difficulty,
            question: template.es,
            germanBridge: template.hint || '',
            explanation: template.explanation || '',
            correctAnswer: '',
            options: []
        };

        // Special handling for emoji exercises
        if (template.type === 'emoji-guess' || template.type === 'emoji-fill') {
            return this.fillEmojiTemplate(template, exercise);
        }

        // Fill variables
        const filled = this.replaceVariables(template.es, template.variables || []);
        exercise.question = filled.question;
        exercise.correctAnswer = filled.correctAnswer;
        exercise.german = template.de ? this.replaceVariables(template.de, template.variables || []).question : '';

        // Generate options based on type
        if (template.correctVerb) {
            // SER/ESTAR contrast
            exercise.type = 'multiple-choice';
            exercise.correctAnswer = template.correctVerb;
            exercise.question = template.es.replace('{verb_choice}', '___');
            exercise.options = [
                { spanish: template.correctVerb, german: '(richtig)', value: template.correctVerb },
                { spanish: template.wrongVerb, german: '(falsch)', value: template.wrongVerb }
            ];
        } else if (exercise.type === 'translation') {
            // Text input - no options needed
            exercise.options = [];
        } else {
            // Multiple choice - generate distractors
            exercise.options = this.generateOptions(exercise.correctAnswer, templateType);
        }

        return exercise;
    }

    /**
     * Fill emoji-based template
     */
    fillEmojiTemplate(template, exercise) {
        const emojiItems = this.vocab.getWithEmoji(exercise.difficulty + 1);
        if (emojiItems.length === 0) return null;

        const item = emojiItems[Math.floor(Math.random() * emojiItems.length)];

        if (template.type === 'emoji-guess') {
            exercise.question = `Was bedeutet: ${item.emoji} ?`;
            exercise.correctAnswer = item.es;
            exercise.german = item.de;
            exercise.type = 'translation';
        } else if (template.type === 'emoji-fill') {
            exercise.question = `Vervollständige: "Quiero comer una ${item.emoji}"`;
            exercise.correctAnswer = item.es;
            exercise.german = `Ich möchte ${item.de} essen`;
            exercise.type = 'translation';
        }

        return exercise;
    }

    /**
     * Replace variables in template
     */
    replaceVariables(text, variables) {
        let result = text;
        let correctAnswer = '';

        for (const varName of variables) {
            const value = this.getVariableValue(varName);
            if (!value) continue;

            // Replace in Spanish text
            result = result.replace(`{${varName}}`, value.es || value);
            result = result.replace(`{${varName}_emoji}`, value.emoji || value.es);

            // Store correct answer if this is the blank
            if (text.includes(`{${varName}}`)) {
                correctAnswer = value.es || value;
            }
        }

        // Replace verb conjugations
        result = this.replaceVerbConjugations(result);

        return { question: result, correctAnswer };
    }

    /**
     * Get value for a variable
     */
    getVariableValue(varName) {
        const mapping = {
            'profession': () => this.vocab.getRandomFrom('nouns', 'people', 1)[0],
            'adjective': () => this.vocab.getRandomFrom('adjectives', 'descriptions', 1)[0],
            'adjective2': () => this.vocab.getRandomFrom('adjectives', 'descriptions', 1)[0],
            'emotion': () => this.vocab.getRandomFrom('adjectives', 'emotions', 1)[0],
            'place': () => this.vocab.getRandomFrom('nouns', 'places', 1)[0],
            'noun': () => {
                const categories = ['food', 'places', 'animals'];
                const cat = categories[Math.floor(Math.random() * categories.length)];
                return this.vocab.getRandomFrom('nouns', cat, 1)[0];
            },
            'food': () => this.vocab.getRandomFrom('nouns', 'food', 1)[0],
            'food_emoji': () => this.vocab.getRandomFrom('nouns', 'food', 1)[0],
            'place_emoji': () => this.vocab.getRandomFrom('nouns', 'places', 1)[0],
            'country': () => this.vocab.getRandomFrom('geography', 'countries', 1)[0],
            'city': () => this.vocab.getRandomFrom('geography', 'cities', 1)[0],
            'age': () => ({ es: String(18 + Math.floor(Math.random() * 40)), de: String(18 + Math.floor(Math.random() * 40)) }),
            'number': () => this.vocab.getByCategory('numbers')[Math.floor(Math.random() * 5)],
            'subject': () => {
                const subjects = ['Yo', 'Tú', 'Él', 'Ella'];
                return { es: subjects[Math.floor(Math.random() * subjects.length)] };
            }
        };

        const getter = mapping[varName];
        return getter ? getter() : null;
    }

    /**
     * Replace verb conjugations
     */
    replaceVerbConjugations(text) {
        // Extract person from context (default yo)
        const person = text.includes('Yo') ? 'yo' :
                      text.includes('Tú') ? 'tu' :
                      text.includes('Él') || text.includes('Ella') ? 'el' : 'yo';

        text = text.replace('{verb_ser}', this.vocab.getVerb('ser', person).conjugated);
        text = text.replace('{verb_estar}', this.vocab.getVerb('estar', person).conjugated);
        text = text.replace('{verb_tener}', this.vocab.getVerb('tener', person).conjugated);
        text = text.replace('{verb_ir}', this.vocab.getVerb('ir', person).conjugated);
        text = text.replace('{verb_comer}', this.vocab.getVerb('comer', person).conjugated);

        return text;
    }

    /**
     * Generate answer options
     */
    generateOptions(correctAnswer, templateType) {
        // TODO: Generate intelligent distractors based on template type
        return [
            { spanish: correctAnswer, german: '(richtig)', value: correctAnswer }
        ];
    }

    /**
     * Get exercise type from template type
     */
    getExerciseType(templateType) {
        if (templateType.includes('emoji')) return 'translation';
        if (templateType.includes('contrast')) return 'multiple-choice';
        return 'translation';
    }

    /**
     * Get all available template types
     */
    getAvailableTypes() {
        return Object.keys(this.templates);
    }

    /**
     * Get templates by concept
     */
    getByChapter(concept) {
        const result = [];
        for (const type in this.templates) {
            this.templates[type].forEach(template => {
                if (template.concept.includes(concept)) {
                    result.push({ ...template, type });
                }
            });
        }
        return result;
    }
}

// Export
if (typeof window !== 'undefined') {
    window.SentenceTemplateEngine = SentenceTemplateEngine;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SentenceTemplateEngine };
}
