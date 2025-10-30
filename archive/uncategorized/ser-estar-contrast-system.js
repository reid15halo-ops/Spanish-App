/**
 * SER vs ESTAR Contrast System
 *
 * Specialized system for teaching and practicing the fundamental
 * difference between SER and ESTAR - the most important concept in Phase 1
 */

class SerEstarContrastSystem {
    constructor() {
        this.rules = this.initializeRules();
        this.contrastExamples = this.initializeContrastExamples();
        this.meaningChanges = this.initializeMeaningChanges();
    }

    /**
     * Initialize the core rules for SER vs ESTAR
     */
    initializeRules() {
        return {
            ser: {
                name: 'SER',
                usage: 'Permanent characteristics, essence, definition',
                mnemonic_de: 'DOCTOR',
                mnemonic_explanation: {
                    D: 'Description (permanent) - Beschreibung',
                    O: 'Occupation - Beruf',
                    C: 'Characteristic - Eigenschaft',
                    T: 'Time - Zeit',
                    O2: 'Origin - Herkunft',
                    R: 'Relationship - Beziehung'
                },
                examples: [
                    { es: 'Soy profesor', de: 'Ich bin Lehrer', category: 'occupation' },
                    { es: 'Eres alemán', de: 'Du bist Deutscher', category: 'origin' },
                    { es: 'Es inteligente', de: 'Er ist intelligent', category: 'characteristic' },
                    { es: 'Son las tres', de: 'Es ist drei Uhr', category: 'time' },
                    { es: 'Es mi amigo', de: 'Er ist mein Freund', category: 'relationship' }
                ]
            },
            estar: {
                name: 'ESTAR',
                usage: 'Temporary states, location, conditions',
                mnemonic_de: 'PLACE',
                mnemonic_explanation: {
                    P: 'Position - Position/Ort',
                    L: 'Location - Ort',
                    A: 'Action - Progressive Form',
                    C: 'Condition - Zustand (temporär)',
                    E: 'Emotion - Gefühle (temporär)'
                },
                examples: [
                    { es: 'Estoy en casa', de: 'Ich bin zu Hause', category: 'location' },
                    { es: 'Estás cansado', de: 'Du bist müde', category: 'condition' },
                    { es: 'Está feliz hoy', de: 'Er ist heute glücklich', category: 'emotion' },
                    { es: 'Estamos aquí', de: 'Wir sind hier', category: 'position' },
                    { es: 'Estoy comiendo', de: 'Ich esse gerade', category: 'action' }
                ]
            }
        };
    }

    /**
     * Initialize contrast examples (same adjective, different meaning)
     */
    initializeContrastExamples() {
        return [
            {
                adjective: 'feliz',
                ser: {
                    es: 'Soy feliz',
                    de: 'Ich bin glücklich (als Persönlichkeit)',
                    meaning: 'Glücklicher Charakter, optimistische Person',
                    permanent: true
                },
                estar: {
                    es: 'Estoy feliz',
                    de: 'Ich bin glücklich (gerade jetzt)',
                    meaning: 'Momentanes Glücksgefühl',
                    temporary: true
                },
                difficulty: 2
            },
            {
                adjective: 'listo',
                ser: {
                    es: 'Es listo',
                    de: 'Er ist schlau/intelligent',
                    meaning: 'Intelligente Person',
                    permanent: true
                },
                estar: {
                    es: 'Está listo',
                    de: 'Er ist bereit',
                    meaning: 'Bereit für etwas',
                    temporary: true
                },
                difficulty: 3
            },
            {
                adjective: 'bueno (con comida)',
                ser: {
                    es: 'La sopa es buena',
                    de: 'Die Suppe ist gut (Qualität)',
                    meaning: 'Gute Qualität allgemein',
                    permanent: true
                },
                estar: {
                    es: 'La sopa está buena',
                    de: 'Die Suppe schmeckt gut (jetzt)',
                    meaning: 'Schmeckt gerade gut',
                    temporary: true
                },
                difficulty: 3
            },
            {
                adjective: 'aburrido',
                ser: {
                    es: 'Soy aburrido',
                    de: 'Ich bin langweilig (als Person)',
                    meaning: 'Langweilige Persönlichkeit',
                    permanent: true
                },
                estar: {
                    es: 'Estoy aburrido',
                    de: 'Ich bin gelangweilt',
                    meaning: 'Fühle mich gelangweilt',
                    temporary: true
                },
                difficulty: 2
            },
            {
                adjective: 'rico',
                ser: {
                    es: 'Es rico',
                    de: 'Er ist reich (viel Geld)',
                    meaning: 'Wohlhabende Person',
                    permanent: true
                },
                estar: {
                    es: 'Está rico',
                    de: 'Es schmeckt lecker',
                    meaning: 'Schmackhaft',
                    temporary: true
                },
                difficulty: 3
            },
            {
                adjective: 'vivo',
                ser: {
                    es: 'Es vivo',
                    de: 'Er ist clever/gerissen',
                    meaning: 'Schlaue, gerissene Person',
                    permanent: true
                },
                estar: {
                    es: 'Está vivo',
                    de: 'Er ist am Leben',
                    meaning: 'Lebt noch',
                    temporary: true
                },
                difficulty: 4
            },
            {
                adjective: 'malo',
                ser: {
                    es: 'Es malo',
                    de: 'Er ist böse/schlecht (Charakter)',
                    meaning: 'Schlechter Charakter',
                    permanent: true
                },
                estar: {
                    es: 'Está malo',
                    de: 'Er ist krank / es schmeckt schlecht',
                    meaning: 'Krank oder schmeckt nicht gut',
                    temporary: true
                },
                difficulty: 3
            },
            {
                adjective: 'nervioso',
                ser: {
                    es: 'Soy nervioso',
                    de: 'Ich bin eine nervöse Person',
                    meaning: 'Nervöse Persönlichkeit',
                    permanent: true
                },
                estar: {
                    es: 'Estoy nervioso',
                    de: 'Ich bin nervös (jetzt)',
                    meaning: 'Momentan nervös',
                    temporary: true
                },
                difficulty: 2
            }
        ];
    }

    /**
     * Initialize meaning changes reference
     */
    initializeMeaningChanges() {
        return {
            'listo': { ser: 'schlau', estar: 'bereit' },
            'rico': { ser: 'reich', estar: 'lecker' },
            'aburrido': { ser: 'langweilig', estar: 'gelangweilt' },
            'vivo': { ser: 'clever', estar: 'am Leben' },
            'malo': { ser: 'böse/schlecht', estar: 'krank' },
            'bueno': { ser: 'gut (Qualität)', estar: 'gut (Geschmack)' },
            'verde': { ser: 'grün (Farbe)', estar: 'unreif' },
            'seguro': { ser: 'sicher (Person)', estar: 'sicher (überzeugt)' }
        };
    }

    /**
     * Determine if SER or ESTAR should be used
     */
    determineCorrectVerb(context) {
        // Location → ESTAR
        if (context.type === 'location' || context.hasPreposition === 'en') {
            return {
                verb: 'estar',
                reason: 'Ortsangaben verwenden immer ESTAR',
                rule: 'PLACE - Location'
            };
        }

        // Profession → SER
        if (context.type === 'profession') {
            return {
                verb: 'ser',
                reason: 'Berufe verwenden immer SER',
                rule: 'DOCTOR - Occupation'
            };
        }

        // Nationality/Origin → SER
        if (context.type === 'nationality' || context.type === 'origin') {
            return {
                verb: 'ser',
                reason: 'Nationalität und Herkunft verwenden SER',
                rule: 'DOCTOR - Origin'
            };
        }

        // Time → SER
        if (context.type === 'time') {
            return {
                verb: 'ser',
                reason: 'Uhrzeiten verwenden SER',
                rule: 'DOCTOR - Time'
            };
        }

        // Temporary state/emotion → ESTAR
        if (context.type === 'state' || context.type === 'emotion') {
            return {
                verb: 'estar',
                reason: 'Temporäre Zustände und Gefühle verwenden ESTAR',
                rule: 'PLACE - Condition/Emotion'
            };
        }

        // Material → SER
        if (context.type === 'material') {
            return {
                verb: 'ser',
                reason: 'Material verwendet SER',
                rule: 'DOCTOR - Description'
            };
        }

        // Permanent characteristic → SER
        if (context.isPermanent) {
            return {
                verb: 'ser',
                reason: 'Permanente Eigenschaften verwenden SER',
                rule: 'DOCTOR - Characteristic'
            };
        }

        // Temporary condition → ESTAR
        if (context.isTemporary) {
            return {
                verb: 'estar',
                reason: 'Temporäre Bedingungen verwenden ESTAR',
                rule: 'PLACE - Condition'
            };
        }

        // Default to SER for descriptions
        return {
            verb: 'ser',
            reason: 'Standard für Beschreibungen',
            rule: 'DOCTOR - Description'
        };
    }

    /**
     * Generate explanation for SER vs ESTAR choice
     */
    explainChoice(userChoice, correctChoice, context) {
        if (userChoice === correctChoice) {
            return {
                correct: true,
                message: '¡Perfecto! Richtige Wahl.',
                explanation: this.determineCorrectVerb(context).reason
            };
        }

        const correctInfo = this.determineCorrectVerb(context);

        let detailedExplanation = `
            <div class="ser-estar-explanation">
                <h4>❌ ${userChoice.toUpperCase()} ist hier falsch</h4>
                <h4>✅ ${correctChoice.toUpperCase()} ist richtig</h4>

                <div class="reason">
                    <strong>Warum?</strong> ${correctInfo.reason}
                </div>

                <div class="rule">
                    <strong>Regel:</strong> ${correctInfo.rule}
                </div>
        `;

        // Add specific tips based on error type
        if (context.type === 'location' && userChoice === 'ser') {
            detailedExplanation += `
                <div class="tip">
                    <strong>Merkhilfe:</strong> "Wo bist du?" → immer ESTAR!<br>
                    en casa, en Madrid, en la escuela → alle mit ESTAR
                </div>
            `;
        }

        if (context.type === 'profession' && userChoice === 'estar') {
            detailedExplanation += `
                <div class="tip">
                    <strong>Merkhilfe:</strong> "Was bist du (von Beruf)?" → immer SER!<br>
                    Soy profesor, eres doctor, es ingeniero
                </div>
            `;
        }

        if ((context.type === 'state' || context.type === 'emotion') && userChoice === 'ser') {
            detailedExplanation += `
                <div class="tip">
                    <strong>Merkhilfe:</strong> "Wie fühlst du dich JETZT?" → ESTAR!<br>
                    Temporäre Gefühle: estoy cansado, estás feliz, está triste
                </div>
            `;
        }

        detailedExplanation += '</div>';

        return {
            correct: false,
            message: `Leider falsch. Hier brauchst du ${correctChoice.toUpperCase()}.`,
            explanation: detailedExplanation
        };
    }

    /**
     * Generate a contrast exercise
     */
    generateContrastExercise() {
        const example = this.contrastExamples[
            Math.floor(Math.random() * this.contrastExamples.length)
        ];

        const useSer = Math.random() > 0.5;
        const selected = useSer ? example.ser : example.estar;
        const other = useSer ? example.estar : example.ser;

        return {
            type: 'meaning-interpretation',
            adjective: example.adjective,
            sentence: selected.es,
            correctMeaning: selected.de,
            wrongMeaning: other.de,
            explanation: selected.meaning,
            difficulty: example.difficulty
        };
    }

    /**
     * Get all contrast examples for an adjective
     */
    getContrastPair(adjective) {
        return this.contrastExamples.find(ex =>
            ex.adjective.includes(adjective) || adjective.includes(ex.adjective.split(' ')[0])
        );
    }

    /**
     * Practice specific rule
     */
    generateRulePractice(rule) {
        // rule can be 'location', 'profession', 'state', etc.
        const ruleExamples = {
            location: [
                { es: 'Yo _____ en casa', answer: 'estoy', translation: 'Ich bin zu Hause' },
                { es: 'Tú _____ en Madrid', answer: 'estás', translation: 'Du bist in Madrid' },
                { es: 'Ella _____ aquí', answer: 'está', translation: 'Sie ist hier' },
                { es: 'Nosotros _____ en el parque', answer: 'estamos', translation: 'Wir sind im Park' }
            ],
            profession: [
                { es: 'Yo _____ profesor', answer: 'soy', translation: 'Ich bin Lehrer' },
                { es: 'Tú _____ doctor', answer: 'eres', translation: 'Du bist Arzt' },
                { es: 'Él _____ ingeniero', answer: 'es', translation: 'Er ist Ingenieur' },
                { es: 'Ella _____ estudiante', answer: 'es', translation: 'Sie ist Studentin' }
            ],
            state: [
                { es: 'Yo _____ cansado', answer: 'estoy', translation: 'Ich bin müde' },
                { es: 'Tú _____ feliz', answer: 'estás', translation: 'Du bist glücklich' },
                { es: 'Él _____ triste', answer: 'está', translation: 'Er ist traurig' },
                { es: 'Nosotros _____ ocupados', answer: 'estamos', translation: 'Wir sind beschäftigt' }
            ],
            nationality: [
                { es: 'Yo _____ alemán', answer: 'soy', translation: 'Ich bin Deutscher' },
                { es: 'Tú _____ española', answer: 'eres', translation: 'Du bist Spanierin' },
                { es: 'Él _____ mexicano', answer: 'es', translation: 'Er ist Mexikaner' },
                { es: 'Nosotros _____ alemanes', answer: 'somos', translation: 'Wir sind Deutsche' }
            ]
        };

        const examples = ruleExamples[rule] || [];
        if (examples.length === 0) return null;

        const selected = examples[Math.floor(Math.random() * examples.length)];

        return {
            type: 'fill-blank',
            rule: rule,
            question: selected.es,
            correctAnswer: selected.answer,
            translation: selected.translation,
            verb: selected.answer.includes('so') || selected.answer.includes('er') ? 'ser' : 'estar'
        };
    }

    /**
     * Get study guide for SER vs ESTAR
     */
    getStudyGuide() {
        return {
            ser: this.rules.ser,
            estar: this.rules.estar,
            contrastExamples: this.contrastExamples,
            quickReference: {
                ser_uses: ['Beruf', 'Nationalität', 'Zeit', 'Material', 'Permanente Eigenschaften'],
                estar_uses: ['Ort', 'Temporäre Zustände', 'Gefühle', 'Progressive Form'],
                memory_tricks: [
                    'SER = Permanent (what IS something)',
                    'ESTAR = Temporary (how something IS BEING)',
                    'Location? → ESTAR',
                    'Profession? → SER',
                    'Feeling right now? → ESTAR',
                    'Personality trait? → SER'
                ]
            }
        };
    }

    /**
     * Diagnostic test - identify which rule causes most problems
     */
    analyzeDifficulties(userHistory) {
        const difficulties = {
            location: 0,
            profession: 0,
            state: 0,
            nationality: 0,
            characteristic: 0,
            time: 0
        };

        userHistory.forEach(item => {
            if (!item.correct && item.context && item.context.type) {
                difficulties[item.context.type]++;
            }
        });

        // Sort by most errors
        const sorted = Object.entries(difficulties)
            .sort((a, b) => b[1] - a[1])
            .map(([rule, errors]) => ({ rule, errors }));

        return {
            mostProblematic: sorted[0],
            allDifficulties: sorted,
            recommendation: this.getRecommendation(sorted[0].rule)
        };
    }

    /**
     * Get personalized recommendation
     */
    getRecommendation(problematicRule) {
        const recommendations = {
            location: 'Übe mehr Ortsangaben mit ESTAR. Merke: Wo bist du? → ESTAR!',
            profession: 'Übe Berufe mit SER. Merke: Was bist du? → SER!',
            state: 'Übe temporäre Zustände mit ESTAR. Merke: Wie fühlst du dich jetzt? → ESTAR!',
            nationality: 'Übe Nationalitäten mit SER. Merke: Woher kommst du? → SER!',
            characteristic: 'Übe Eigenschaften. Permanent → SER, Temporär → ESTAR',
            time: 'Uhrzeit verwendet immer SER: Son las tres'
        };

        return recommendations[problematicRule] || 'Weiter üben!';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SerEstarContrastSystem };
}
