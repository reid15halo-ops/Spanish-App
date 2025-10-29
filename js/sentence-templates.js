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
                    es: 'Tú eres {profession}',
                    de: 'Du bist {profession_de}',
                    variables: ['profession'],
                    concept: 'ser-identity',
                    difficulty: 1,
                    hint: 'Beruf = SER'
                },
                {
                    es: 'Mi padre es {profession}',
                    de: 'Mein Vater ist {profession_de}',
                    variables: ['profession'],
                    concept: 'ser-identity',
                    difficulty: 1,
                    hint: 'Beruf = SER'
                },
                {
                    es: 'Mi madre es {profession}',
                    de: 'Meine Mutter ist {profession_de}',
                    variables: ['profession'],
                    concept: 'ser-identity',
                    difficulty: 1,
                    hint: 'Beruf = SER'
                },
                {
                    es: '{subject} {verb_ser} {profession}',
                    de: '{subject_de} ist {profession_de}',
                    variables: ['subject', 'profession'],
                    concept: 'ser-identity',
                    difficulty: 2,
                    hint: 'Beruf ist eine dauerhafte Eigenschaft → SER'
                },
                {
                    es: 'Nosotros somos {profession_plural}',
                    de: 'Wir sind {profession_de}',
                    variables: ['profession'],
                    concept: 'ser-identity',
                    difficulty: 2,
                    hint: 'Beruf (Plural) = SER'
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
                    es: 'Tú eres {adjective}',
                    de: 'Du bist {adjective_de}',
                    variables: ['adjective'],
                    concept: 'ser-description',
                    difficulty: 1,
                    hint: 'Dauerhafte Eigenschaft = SER'
                },
                {
                    es: 'Él es {adjective}',
                    de: 'Er ist {adjective_de}',
                    variables: ['adjective'],
                    concept: 'ser-description',
                    difficulty: 1,
                    hint: 'Dauerhafte Eigenschaft = SER'
                },
                {
                    es: 'Ella es {adjective}',
                    de: 'Sie ist {adjective_de}',
                    variables: ['adjective'],
                    concept: 'ser-description',
                    difficulty: 1,
                    hint: 'Dauerhafte Eigenschaft = SER'
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
                    es: 'La casa es {adjective}',
                    de: 'Das Haus ist {adjective_de}',
                    variables: ['adjective'],
                    concept: 'ser-description',
                    difficulty: 2,
                    hint: 'Objektbeschreibung: Haus ist immer so → SER'
                },
                {
                    es: 'Mi coche es {adjective}',
                    de: 'Mein Auto ist {adjective_de}',
                    variables: ['adjective'],
                    concept: 'ser-description',
                    difficulty: 2,
                    hint: 'Dauerhafte Eigenschaft des Autos → SER'
                },
                {
                    es: 'Este libro es {adjective}',
                    de: 'Dieses Buch ist {adjective_de}',
                    variables: ['adjective'],
                    concept: 'ser-description',
                    difficulty: 2,
                    hint: 'Dauerhafte Eigenschaft → SER'
                },
                {
                    es: 'Mi familia es {adjective}',
                    de: 'Meine Familie ist {adjective_de}',
                    variables: ['adjective'],
                    concept: 'ser-description',
                    difficulty: 2,
                    hint: 'Charakteristik der Familie → SER'
                },
                {
                    es: 'Mi {noun} es {adjective} y {adjective2}',
                    de: 'Mein {noun_de} ist {adjective_de} und {adjective2_de}',
                    variables: ['noun', 'adjective', 'adjective2'],
                    concept: 'ser-description',
                    difficulty: 3,
                    hint: 'Mehrere Eigenschaften mit SER'
                },
                {
                    es: 'Los perros son {adjective_plural}',
                    de: 'Die Hunde sind {adjective_de}',
                    variables: ['adjective'],
                    concept: 'ser-description',
                    difficulty: 2,
                    hint: 'Dauerhafte Eigenschaft (Plural) → SER'
                },
                {
                    es: 'Mis amigos son {adjective_plural}',
                    de: 'Meine Freunde sind {adjective_de}',
                    variables: ['adjective'],
                    concept: 'ser-description',
                    difficulty: 2,
                    hint: 'Charaktereigenschaft → SER'
                },
                {
                    es: 'Nosotros somos {adjective_plural}',
                    de: 'Wir sind {adjective_de}',
                    variables: ['adjective'],
                    concept: 'ser-description',
                    difficulty: 2,
                    hint: 'Dauerhafte Eigenschaft → SER'
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
                    es: 'Yo estoy en casa',
                    de: 'Ich bin zu Hause',
                    variables: [],
                    concept: 'estar-location',
                    difficulty: 1,
                    hint: 'Konkrete Ortsangabe → ESTAR'
                },
                {
                    es: 'Tú estás en {place}',
                    de: 'Du bist in/im {place_de}',
                    variables: ['place'],
                    concept: 'estar-location',
                    difficulty: 1,
                    hint: 'Ortsangabe mit ESTAR (2. Person)'
                },
                {
                    es: 'Él está en Madrid',
                    de: 'Er ist in Madrid',
                    variables: [],
                    concept: 'estar-location',
                    difficulty: 1,
                    hint: 'Stadt = Ort → ESTAR'
                },
                {
                    es: 'Ella está en la escuela',
                    de: 'Sie ist in der Schule',
                    variables: [],
                    concept: 'estar-location',
                    difficulty: 1,
                    hint: 'Ort (Schule) → ESTAR'
                },
                {
                    es: 'Nosotros estamos en el trabajo',
                    de: 'Wir sind bei der Arbeit',
                    variables: [],
                    concept: 'estar-location',
                    difficulty: 2,
                    hint: 'Position/Ort → ESTAR (1. Person Plural)'
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
                },
                {
                    es: 'Mis padres están en el restaurante',
                    de: 'Meine Eltern sind im Restaurant',
                    variables: [],
                    concept: 'estar-location',
                    difficulty: 2,
                    hint: 'Plural: Ortsangabe → ESTAR'
                },
                {
                    es: 'El libro está en la mesa',
                    de: 'Das Buch ist auf dem Tisch',
                    variables: [],
                    concept: 'estar-location',
                    difficulty: 2,
                    hint: 'Position eines Objekts → ESTAR'
                },
                {
                    es: 'Los niños están en el parque',
                    de: 'Die Kinder sind im Park',
                    variables: [],
                    concept: 'estar-location',
                    difficulty: 2,
                    hint: 'Plural + Ortsangabe → ESTAR'
                },
                {
                    es: '¿Dónde estás?',
                    de: 'Wo bist du?',
                    variables: [],
                    concept: 'estar-location',
                    difficulty: 2,
                    hint: 'Frage nach Ort → ESTAR mit dónde'
                },
                {
                    es: '¿Dónde está tu {noun}?',
                    de: 'Wo ist dein {noun_de}?',
                    variables: ['noun'],
                    concept: 'estar-location',
                    difficulty: 2,
                    hint: 'Frage nach Position → ESTAR'
                },
                {
                    es: 'Mi familia está en la playa',
                    de: 'Meine Familie ist am Strand',
                    variables: [],
                    concept: 'estar-location',
                    difficulty: 2,
                    hint: 'Familie am Ort → ESTAR'
                },
                {
                    es: 'Estamos en el centro de la ciudad',
                    de: 'Wir sind im Stadtzentrum',
                    variables: [],
                    concept: 'estar-location',
                    difficulty: 3,
                    hint: 'Präzise Ortsangabe → ESTAR'
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
                    es: 'Estoy feliz',
                    de: 'Ich bin glücklich',
                    variables: [],
                    concept: 'estar-emotion',
                    difficulty: 1,
                    hint: 'Aktuelles Gefühl → ESTAR'
                },
                {
                    es: 'Tú estás triste',
                    de: 'Du bist traurig',
                    variables: [],
                    concept: 'estar-emotion',
                    difficulty: 1,
                    hint: 'Momentane Emotion → ESTAR'
                },
                {
                    es: 'Él está cansado',
                    de: 'Er ist müde',
                    variables: [],
                    concept: 'estar-emotion',
                    difficulty: 1,
                    hint: 'Temporärer Zustand (müde) → ESTAR'
                },
                {
                    es: 'Ella está enferma',
                    de: 'Sie ist krank',
                    variables: [],
                    concept: 'estar-emotion',
                    difficulty: 1,
                    hint: 'Vorübergehender Zustand (krank) → ESTAR'
                },
                {
                    es: 'Estamos contentos',
                    de: 'Wir sind zufrieden',
                    variables: [],
                    concept: 'estar-emotion',
                    difficulty: 2,
                    hint: 'Plural + Emotion → ESTAR'
                },
                {
                    es: '{subject} {verb_estar} {emotion} hoy',
                    de: '{subject_de} ist heute {emotion_de}',
                    variables: ['subject', 'emotion'],
                    concept: 'estar-emotion',
                    difficulty: 2,
                    hint: 'Emotionale Zustände sind vorübergehend → ESTAR'
                },
                {
                    es: 'Mi madre está preocupada',
                    de: 'Meine Mutter ist besorgt',
                    variables: [],
                    concept: 'estar-emotion',
                    difficulty: 2,
                    hint: 'Aktueller emotionaler Zustand → ESTAR'
                },
                {
                    es: 'Los estudiantes están nerviosos',
                    de: 'Die Studenten sind nervös',
                    variables: [],
                    concept: 'estar-emotion',
                    difficulty: 2,
                    hint: 'Plural + vorübergehende Emotion → ESTAR'
                },
                {
                    es: '¿Estás bien?',
                    de: 'Geht es dir gut?',
                    variables: [],
                    concept: 'estar-emotion',
                    difficulty: 2,
                    hint: 'Frage nach Befinden → ESTAR'
                },
                {
                    es: 'Estoy aburrido',
                    de: 'Mir ist langweilig',
                    variables: [],
                    concept: 'estar-emotion',
                    difficulty: 2,
                    hint: 'Momentaner Zustand (gelangweilt) → ESTAR'
                },
                {
                    es: 'Mi hermano está enfadado porque perdió el partido',
                    de: 'Mein Bruder ist wütend, weil er das Spiel verloren hat',
                    variables: [],
                    concept: 'estar-emotion',
                    difficulty: 3,
                    hint: 'Emotion mit Begründung → ESTAR'
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
                },
                {
                    es: 'Mi padre {verb_choice} médico',
                    de: 'Mein Vater ist Arzt',
                    variables: [],
                    correctVerb: 'es',
                    wrongVerb: 'está',
                    concept: 'ser-estar-fundamental',
                    difficulty: 3,
                    hint: 'Beruf = permanente Identität → SER',
                    explanation: 'Berufe immer mit SER ausdrücken.'
                },
                {
                    es: 'El libro {verb_choice} en la mesa',
                    de: 'Das Buch ist auf dem Tisch',
                    variables: [],
                    correctVerb: 'está',
                    wrongVerb: 'es',
                    concept: 'ser-estar-fundamental',
                    difficulty: 3,
                    hint: 'Position = vorübergehend → ESTAR',
                    explanation: 'Positionen und Orte immer mit ESTAR.'
                },
                {
                    es: 'La comida {verb_choice} rica',
                    de: 'Das Essen ist lecker',
                    variables: [],
                    correctVerb: 'está',
                    wrongVerb: 'es',
                    concept: 'ser-estar-contrast',
                    difficulty: 4,
                    hint: '⚠️ "rico" mit ESTAR = lecker (Geschmack jetzt)',
                    explanation: 'estar rico = schmeckt gut (momentan). ser rico = ist reich (Person).'
                },
                {
                    es: 'Juan {verb_choice} listo',
                    de: 'Juan ist bereit',
                    variables: [],
                    correctVerb: 'está',
                    wrongVerb: 'es',
                    concept: 'ser-estar-contrast',
                    difficulty: 4,
                    hint: 'estar listo = bereit sein (jetzt). ser listo = intelligent sein',
                    explanation: 'estar listo = bereit. ser listo = klug/intelligent.'
                },
                {
                    es: 'María {verb_choice} lista',
                    de: 'María ist intelligent',
                    variables: [],
                    correctVerb: 'es',
                    wrongVerb: 'está',
                    concept: 'ser-estar-contrast',
                    difficulty: 4,
                    hint: 'ser lista = intelligent sein (Charaktereigenschaft)',
                    explanation: 'ser lista = intelligent. estar lista = bereit sein.'
                },
                {
                    es: 'La película {verb_choice} aburrida',
                    de: 'Der Film ist langweilig',
                    variables: [],
                    correctVerb: 'es',
                    wrongVerb: 'está',
                    concept: 'ser-estar-contrast',
                    difficulty: 4,
                    hint: 'ser aburrido = langweilig sein (Eigenschaft des Films)',
                    explanation: 'ser aburrido = langweilig (Eigenschaft). estar aburrido = sich langweilen (Gefühl).'
                },
                {
                    es: 'Yo {verb_choice} aburrido',
                    de: 'Mir ist langweilig',
                    variables: [],
                    correctVerb: 'estoy',
                    wrongVerb: 'soy',
                    concept: 'ser-estar-contrast',
                    difficulty: 4,
                    hint: 'estar aburrido = sich langweilen (momentanes Gefühl)',
                    explanation: 'estar aburrido = gelangweilt sein. ser aburrido = eine langweilige Person sein.'
                },
                {
                    es: 'Mi hermana {verb_choice} alta',
                    de: 'Meine Schwester ist groß',
                    variables: [],
                    correctVerb: 'es',
                    wrongVerb: 'está',
                    concept: 'ser-estar-fundamental',
                    difficulty: 3,
                    hint: 'Körpergröße = dauerhafte Eigenschaft → SER',
                    explanation: 'Physische Eigenschaften wie Größe sind permanent → SER.'
                },
                {
                    es: 'La puerta {verb_choice} abierta',
                    de: 'Die Tür ist offen',
                    variables: [],
                    correctVerb: 'está',
                    wrongVerb: 'es',
                    concept: 'ser-estar-fundamental',
                    difficulty: 3,
                    hint: 'Zustand (offen/geschlossen) = vorübergehend → ESTAR',
                    explanation: 'Zustände wie offen/geschlossen sind veränderbar → ESTAR.'
                },
                {
                    es: 'Nosotros {verb_choice} de España',
                    de: 'Wir sind aus Spanien',
                    variables: [],
                    correctVerb: 'somos',
                    wrongVerb: 'estamos',
                    concept: 'ser-estar-fundamental',
                    difficulty: 3,
                    hint: 'Herkunft = permanent → SER',
                    explanation: 'Herkunft und Nationalität mit SER ausdrücken.'
                },
                {
                    es: 'Nosotros {verb_choice} en España',
                    de: 'Wir sind in Spanien',
                    variables: [],
                    correctVerb: 'estamos',
                    wrongVerb: 'somos',
                    concept: 'ser-estar-fundamental',
                    difficulty: 3,
                    hint: 'Aktueller Ort → ESTAR',
                    explanation: 'Wo man gerade ist (Ort) → ESTAR. Woher man kommt (Herkunft) → SER.'
                },
                {
                    es: 'Hoy {verb_choice} lunes',
                    de: 'Heute ist Montag',
                    variables: [],
                    correctVerb: 'es',
                    wrongVerb: 'está',
                    concept: 'ser-estar-fundamental',
                    difficulty: 3,
                    hint: 'Datum, Wochentag → SER',
                    explanation: 'Zeitangaben (Datum, Wochentag, Uhrzeit) immer mit SER.'
                },
                {
                    es: 'El café {verb_choice} caliente',
                    de: 'Der Kaffee ist heiß',
                    variables: [],
                    correctVerb: 'está',
                    wrongVerb: 'es',
                    concept: 'ser-estar-fundamental',
                    difficulty: 4,
                    hint: 'Temperatur = vorübergehender Zustand → ESTAR',
                    explanation: 'Temperaturen sind veränderlich → ESTAR.'
                },
                {
                    es: 'Mi hermano {verb_choice} enfermo',
                    de: 'Mein Bruder ist krank',
                    variables: [],
                    correctVerb: 'está',
                    wrongVerb: 'es',
                    concept: 'ser-estar-emotion',
                    difficulty: 3,
                    hint: 'Gesundheitszustand = vorübergehend → ESTAR',
                    explanation: 'Krankheit ist ein temporärer Zustand → ESTAR.'
                },
                {
                    es: 'Esta casa {verb_choice} grande',
                    de: 'Dieses Haus ist groß',
                    variables: [],
                    correctVerb: 'es',
                    wrongVerb: 'está',
                    concept: 'ser-estar-fundamental',
                    difficulty: 3,
                    hint: 'Größe/Form = dauerhafte Eigenschaft → SER',
                    explanation: 'Objekteigenschaften wie Größe, Form, Farbe → SER.'
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
        const values = {};

        // First pass: Get all values
        for (const varName of variables) {
            const value = this.getVariableValue(varName);
            if (value) {
                values[varName] = value;
            }
        }

        // Second pass: Replace in text
        for (const varName of variables) {
            const value = values[varName];
            if (!value) continue;

            // Replace in Spanish text
            result = result.replace(`{${varName}}`, value.es || value);
            result = result.replace(`{${varName}_emoji}`, value.emoji || value.es);
        }

        // Determine correct answer (last content variable, not 'subject' or verbs)
        const contentVariables = variables.filter(v =>
            !v.includes('subject') &&
            !v.includes('verb_') &&
            !v.includes('_de') &&
            values[v]
        );

        if (contentVariables.length > 0) {
            const answerVar = contentVariables[contentVariables.length - 1];
            correctAnswer = values[answerVar].es || values[answerVar];
        } else if (variables.length > 0) {
            // Fallback: use last variable
            const lastVar = variables[variables.length - 1];
            correctAnswer = values[lastVar]?.es || values[lastVar] || '';
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
            'profession': () => this.vocab.getRandomFrom('nouns', 'people', 1, 2)[0], // maxDifficulty: 2
            'profession_plural': () => {
                const item = this.vocab.getRandomFrom('nouns', 'people', 1, 2)[0]; // maxDifficulty: 2
                return {
                    es: this.makePlural(item.es),
                    de: item.de,
                    en: item.en,
                    gender: item.gender
                };
            },
            'adjective': () => this.vocab.getRandomFrom('adjectives', 'descriptions', 1, 2)[0], // maxDifficulty: 2
            'adjective_plural': () => {
                const item = this.vocab.getRandomFrom('adjectives', 'descriptions', 1, 2)[0]; // maxDifficulty: 2
                return {
                    es: this.makePluralAdjective(item.es, item.gender),
                    de: item.de,
                    en: item.en
                };
            },
            'adjective2': () => this.vocab.getRandomFrom('adjectives', 'descriptions', 1, 2)[0], // maxDifficulty: 2
            'emotion': () => this.vocab.getRandomFrom('adjectives', 'emotions', 1, 2)[0], // maxDifficulty: 2
            'place': () => this.vocab.getRandomFrom('nouns', 'places', 1, 2)[0], // maxDifficulty: 2
            'noun': () => {
                const categories = ['food', 'places', 'animals'];
                const cat = categories[Math.floor(Math.random() * categories.length)];
                return this.vocab.getRandomFrom('nouns', cat, 1, 2)[0]; // maxDifficulty: 2
            },
            'noun_plural': () => {
                const categories = ['food', 'places', 'animals'];
                const cat = categories[Math.floor(Math.random() * categories.length)];
                const item = this.vocab.getRandomFrom('nouns', cat, 1, 2)[0]; // maxDifficulty: 2
                return {
                    es: this.makePlural(item.es),
                    de: item.de,
                    en: item.en,
                    gender: item.gender
                };
            },
            'food': () => this.vocab.getRandomFrom('nouns', 'food', 1, 2)[0], // maxDifficulty: 2
            'food_emoji': () => this.vocab.getRandomFrom('nouns', 'food', 1, 2)[0], // maxDifficulty: 2
            'place_emoji': () => this.vocab.getRandomFrom('nouns', 'places', 1, 2)[0], // maxDifficulty: 2
            'country': () => this.vocab.getRandomFrom('geography', 'countries', 1, 2)[0], // maxDifficulty: 2
            'city': () => this.vocab.getRandomFrom('geography', 'cities', 1, 2)[0], // maxDifficulty: 2
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
     * Make Spanish noun plural (simplified rules)
     */
    makePlural(word) {
        if (!word) return word;

        // Ends with vowel → add s
        if (/[aeiou]$/i.test(word)) {
            return word + 's';
        }
        // Ends with consonant → add es
        return word + 'es';
    }

    /**
     * Make Spanish adjective plural
     */
    makePluralAdjective(word, gender) {
        if (!word) return word;

        // Adjectives ending in -o/-a
        if (word.endsWith('o')) {
            return word.slice(0, -1) + 'os';
        }
        if (word.endsWith('a')) {
            return word.slice(0, -1) + 'as';
        }

        // Adjectives ending in vowel (e, í, ú) → add s
        if (/[eíú]$/i.test(word)) {
            return word + 's';
        }

        // Adjectives ending in consonant → add es
        if (!/[aeiou]$/i.test(word)) {
            return word + 'es';
        }

        return word + 's';
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
