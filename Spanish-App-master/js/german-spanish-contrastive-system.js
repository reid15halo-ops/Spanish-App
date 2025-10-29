/**
 * German-Spanish Contrastive Analysis System
 *
 * Optimiert für deutsche Muttersprachler basierend auf:
 * - Lado's Contrastive Analysis Hypothesis (1957)
 * - Odlin's Language Transfer Theory (1989)
 * - VanPatten's Input Processing Theory (1996)
 *
 * Kernfunktionen:
 * - Identifizierung von positiven Transfers (Deutsch → Spanisch)
 * - Warnung vor negativen Transfers und Interferenzen
 * - Falsche Freunde (False Friends) Detektion
 * - Sprachspezifische Erklärungen mit deutschen Grammatik-Referenzen
 */

class GermanSpanishContrastiveSystem {
    constructor() {
        // Positive Transfers (Deutsch hilft beim Spanischen)
        this.positiveTransfers = this.initializePositiveTransfers();

        // Negative Transfers (Deutsch führt zu Fehlern)
        this.negativeTransfers = this.initializeNegativeTransfers();

        // Falsche Freunde (False Friends)
        this.falseFriends = this.initializeFalseFriends();

        // Grammatik-Vergleiche
        this.grammarComparisons = this.initializeGrammarComparisons();

        // Kognate (Cognates) - ähnliche Wörter
        this.cognates = this.initializeCognates();

        // Typische Fehler deutscher Lerner
        this.typicalErrors = this.initializeTypicalErrors();
    }

    /**
     * Positive Transfers initialisieren
     */
    initializePositiveTransfers() {
        return {
            // Grammatik-Strukturen
            'noun-gender': {
                type: 'grammar',
                description: 'Deutsch hat auch Genus (der/die/das) - hilft beim Verständnis von el/la',
                similarity: 0.7,
                help: 'Wie im Deutschen gibt es maskulin, feminin (und im Spanischen nur selten neutral)',
                example: {
                    de: 'der Tisch → masculino',
                    es: 'el libro (maskulin) - ähnlich wie "der"'
                }
            },

            'formal-informal': {
                type: 'grammar',
                description: 'Du/Sie-Unterscheidung existiert auch im Spanischen (tú/usted)',
                similarity: 0.9,
                help: 'Deutsche kennen bereits formelle/informelle Anrede',
                example: {
                    de: 'Du gehst / Sie gehen',
                    es: 'Tú vas / Usted va'
                }
            },

            'compound-words': {
                type: 'vocabulary',
                description: 'Beide Sprachen bilden zusammengesetzte Wörter',
                similarity: 0.6,
                help: 'Im Deutschen: Handschuh, im Spanischen: paraguas (para + aguas)',
                example: {
                    de: 'Regenschirm = Regen + Schirm',
                    es: 'paraguas = para (für) + aguas (Wasser)'
                }
            },

            'verb-conjugation': {
                type: 'grammar',
                description: 'Beide Sprachen konjugieren Verben nach Person',
                similarity: 0.8,
                help: 'Deutsche kennen: ich gehe, du gehst, er geht...',
                example: {
                    de: 'ich gehe, du gehst, er geht',
                    es: 'yo voy, tú vas, él va'
                }
            },

            'prepositions-with-cases': {
                type: 'grammar',
                description: 'Präpositionen regieren Fälle (im Deutschen stärker)',
                similarity: 0.5,
                help: 'Deutsche sind an komplexe Präpositionen gewöhnt',
                note: 'Spanisch ist einfacher - keine Fälle!'
            }
        };
    }

    /**
     * Negative Transfers initialisieren
     */
    initializeNegativeTransfers() {
        return {
            'word-order-questions': {
                type: 'syntax',
                interference: 'high',
                germanPattern: 'Verb an Position 2',
                spanishPattern: 'Verb-Subjekt-Inversion bei Fragen',
                description: 'Deutsche stellen Fragen anders',
                examples: [
                    {
                        wrong: '¿Tú hablas español?',
                        correct: '¿Hablas español?',
                        germanInfluence: 'Du sprichst Spanisch? (Subjekt vor Verb)',
                        explanation: 'Im Spanischen: Bei Fragen steht das Verb oft VOR dem Subjekt oder Subjekt wird weggelassen'
                    },
                    {
                        wrong: '¿Dónde du vas?',
                        correct: '¿Dónde vas?',
                        germanInfluence: 'Wo gehst du? (Subjekt-Verb-Muster)',
                        explanation: 'Subjekt wird im Spanischen oft weggelassen - steht in der Verbform!'
                    }
                ]
            },

            'double-negation': {
                type: 'syntax',
                interference: 'high',
                germanPattern: 'Einfache Negation',
                spanishPattern: 'Doppelte Negation ist korrekt',
                description: 'Im Deutschen: keine doppelte Verneinung',
                examples: [
                    {
                        wrong: 'Yo tengo algo',
                        correct: 'Yo no tengo nada',
                        germanInfluence: 'Ich habe nichts (eine Negation)',
                        explanation: 'Im Spanischen: "no" + "nada" ist korrekt! Deutsche denken: doppelte Verneinung = positiv'
                    },
                    {
                        wrong: 'Yo veo alguien',
                        correct: 'Yo no veo a nadie',
                        germanInfluence: 'Ich sehe niemanden (eine Negation)',
                        explanation: 'no + nadie ist KORREKT im Spanischen'
                    }
                ]
            },

            'continuous-tense': {
                type: 'grammar',
                interference: 'medium',
                germanPattern: 'Keine Verlaufsform wie im Englischen',
                spanishPattern: 'estar + gerundio für laufende Handlungen',
                description: 'Deutsche übersetzen oft falsch aus dem Englischen',
                examples: [
                    {
                        wrong: 'Yo hablo ahora',
                        correct: 'Estoy hablando ahora',
                        germanInfluence: 'Ich spreche jetzt (Präsens reicht im Deutschen)',
                        explanation: 'Für "gerade dabei sein" nutzt Spanisch estar + -ndo (wie Englisch -ing)'
                    }
                ]
            },

            'personal-a': {
                type: 'grammar',
                interference: 'very-high',
                germanPattern: 'Kein "a" vor Personen-Objekt',
                spanishPattern: 'Persönliches "a" vor Personen-Objekt',
                description: 'Gibt es im Deutschen nicht!',
                examples: [
                    {
                        wrong: 'Veo Maria',
                        correct: 'Veo a Maria',
                        germanInfluence: 'Ich sehe Maria (kein "a")',
                        explanation: 'Im Spanischen MUSS ein "a" vor Personen-Objekt: Veo A Maria'
                    },
                    {
                        wrong: 'Conozco Pedro',
                        correct: 'Conozco a Pedro',
                        germanInfluence: 'Ich kenne Pedro',
                        explanation: 'Immer: conocer/ver/buscar + A + Person'
                    }
                ]
            },

            'subject-pronoun-dropping': {
                type: 'syntax',
                interference: 'medium',
                germanPattern: 'Subjekt-Pronomen meist notwendig',
                spanishPattern: 'Pronomen oft weggelassen',
                description: 'Deutsche setzen zu oft "yo, tú, él"',
                examples: [
                    {
                        redundant: 'Yo hablo español',
                        better: 'Hablo español',
                        germanInfluence: 'ICH spreche Spanisch (Subjekt betont)',
                        explanation: 'Im Spanischen ist "hablo" eindeutig = ich. "Yo" nur zur Betonung!'
                    }
                ]
            },

            'adjective-position': {
                type: 'syntax',
                interference: 'medium',
                germanPattern: 'Adjektiv VOR Nomen',
                spanishPattern: 'Adjektiv meist NACH Nomen',
                description: 'Reihenfolge ist umgekehrt',
                examples: [
                    {
                        wrong: 'El rojo coche',
                        correct: 'El coche rojo',
                        germanInfluence: 'Das rote Auto (Adjektiv vor Nomen)',
                        explanation: 'Im Spanischen: Nomen zuerst, dann Adjektiv!'
                    },
                    {
                        wrong: 'Una grande casa',
                        correct: 'Una casa grande',
                        germanInfluence: 'Ein großes Haus',
                        explanation: 'Ausnahmen: bueno, malo, grande (verkürzt) können vorangestehen'
                    }
                ]
            },

            'reflexive-verbs': {
                type: 'grammar',
                interference: 'medium',
                germanPattern: 'Weniger reflexive Verben',
                spanishPattern: 'Viele reflexive Verben',
                description: 'Spanisch nutzt reflexive Verben häufiger',
                examples: [
                    {
                        german: 'Ich heiße Peter',
                        spanish: 'Me llamo Pedro',
                        note: 'Wörtlich: "Ich nenne MICH Peter" - im Deutschen nicht reflexiv!'
                    },
                    {
                        german: 'Ich setze mich',
                        spanish: 'Me siento',
                        note: 'Hier sind beide reflexiv - aber viele sind es im Spanischen exklusiv'
                    }
                ]
            },

            'ser-estar-confusion': {
                type: 'grammar',
                interference: 'very-high',
                germanPattern: 'Nur ein Verb "sein"',
                spanishPattern: 'Zwei verschiedene Verben: ser/estar',
                description: 'GRÖSSTE HERAUSFORDERUNG für Deutsche!',
                examples: [
                    {
                        wrong: 'Yo soy en casa',
                        correct: 'Yo estoy en casa',
                        germanInfluence: 'Ich BIN zu Hause (ein Verb)',
                        explanation: 'Ort → IMMER estar! Ser ist für Identität/Eigenschaften'
                    },
                    {
                        wrong: 'Yo estoy alemán',
                        correct: 'Yo soy alemán',
                        germanInfluence: 'Ich bin Deutscher',
                        explanation: 'Nationalität/Identität → IMMER ser!'
                    }
                ]
            }
        };
    }

    /**
     * Falsche Freunde initialisieren
     */
    initializeFalseFriends() {
        return [
            {
                spanish: 'embarazada',
                german: 'schwanger',
                falseFriend: 'embarrassed (verlegen)',
                warning: '⚠️ NICHT "embarrassed"! Bedeutet SCHWANGER!',
                mnemonic: 'Eine Frau mit Baby im Bauch - embarazada',
                riskLevel: 'very-high'
            },
            {
                spanish: 'constipado',
                german: 'erkältet',
                falseFriend: 'verstopft (constipated)',
                warning: '⚠️ NICHT verstopft! Bedeutet ERKÄLTET!',
                mnemonic: 'Nase zu - constipado',
                riskLevel: 'high'
            },
            {
                spanish: 'actualmente',
                german: 'derzeit, gegenwärtig',
                falseFriend: 'aktuell (klingt ähnlich)',
                warning: '⚠️ Bedeutet "derzeit/momentan", NICHT "aktuell im Sinne von modern"',
                riskLevel: 'medium'
            },
            {
                spanish: 'eventual',
                german: 'vorübergehend, möglich',
                falseFriend: 'eventuell',
                warning: '⚠️ NICHT "eventuell/vielleicht"! Bedeutet "vorübergehend"',
                riskLevel: 'medium'
            },
            {
                spanish: 'largo',
                german: 'lang',
                falseFriend: 'large (groß)',
                warning: '⚠️ NICHT "groß"! Bedeutet LANG!',
                note: 'groß = grande',
                riskLevel: 'medium'
            },
            {
                spanish: 'éxito',
                german: 'Erfolg',
                falseFriend: 'Exit (Ausgang)',
                warning: '⚠️ NICHT "Ausgang"! Bedeutet ERFOLG!',
                note: 'Ausgang = salida',
                riskLevel: 'medium'
            },
            {
                spanish: 'sensible',
                german: 'empfindlich, sensibel',
                falseFriend: 'sensible (vernünftig)',
                warning: '⚠️ Bedeutet "empfindlich", NICHT "vernünftig"',
                note: 'vernünftig = sensato',
                riskLevel: 'low'
            },
            {
                spanish: 'simpático',
                german: 'sympathisch, nett',
                falseFriend: 'sympathisch (klingt gleich)',
                warning: '✓ Gleiche Bedeutung! Einer der wenigen echten Freunde',
                riskLevel: 'none',
                trueF friend: true
            }
        ];
    }

    /**
     * Kognate initialisieren (ähnliche Wörter)
     */
    initializeCognates() {
        return {
            // Leichte Kognate (fast identisch)
            'easy': [
                { es: 'hotel', de: 'Hotel', similarity: 1.0 },
                { es: 'museo', de: 'Museum', similarity: 0.9 },
                { es: 'universidad', de: 'Universität', similarity: 0.9 },
                { es: 'teatro', de: 'Theater', similarity: 0.9 },
                { es: 'música', de: 'Musik', similarity: 0.9 },
                { es: 'teléfono', de: 'Telefon', similarity: 0.95 },
                { es: 'familia', de: 'Familie', similarity: 0.9 },
                { es: 'problema', de: 'Problem', similarity: 0.95 }
            ],

            // Moderate Kognate (erkennbar)
            'moderate': [
                { es: 'importante', de: 'wichtig', similarity: 0.7, note: 'important/importante' },
                { es: 'posible', de: 'möglich', similarity: 0.7, note: 'possible/posible' },
                { es: 'necesario', de: 'notwendig', similarity: 0.6, note: 'necessary/necesario' },
                { es: 'información', de: 'Information', similarity: 0.85 }
            ],

            // Lateinische Wurzeln (helfen gebildeten Deutschen)
            'latin-roots': [
                { es: 'agua', de: 'Wasser', latinRoot: 'aqua', note: 'Aquarium!' },
                { es: 'casa', de: 'Haus', latinRoot: 'casa', note: 'Casa (Latein)' },
                { es: 'sol', de: 'Sonne', latinRoot: 'sol', note: 'Solar!' },
                { es: 'luna', de: 'Mond', latinRoot: 'luna', note: 'Lunar!' },
                { es: 'tierra', de: 'Erde', latinRoot: 'terra', note: 'terrestrisch!' }
            ]
        };
    }

    /**
     * Grammatik-Vergleiche initialisieren
     */
    initializeGrammarComparisons() {
        return {
            'verb-conjugation': {
                german: {
                    system: '6 Personen, regelmäßige Endungen',
                    example: 'machen: ich mache, du machst, er macht, wir machen, ihr macht, sie machen'
                },
                spanish: {
                    system: '6 Personen, regelmäßige Endungen',
                    example: 'hablar: hablo, hablas, habla, hablamos, habláis, hablan'
                },
                similarity: 0.8,
                note: 'Sehr ähnlich! Deutsche kennen Konjugation.',
                advantage: 'Deutsche haben großen Vorteil!'
            },

            'gender-system': {
                german: {
                    system: '3 Genera: maskulin, feminin, neutral',
                    example: 'der Mann, die Frau, das Kind'
                },
                spanish: {
                    system: '2 Genera: maskulin, feminin (neutral selten)',
                    example: 'el hombre, la mujer'
                },
                similarity: 0.7,
                note: 'Spanisch einfacher - nur 2 Genera!',
                advantage: 'Deutsche verstehen das Konzept bereits'
            },

            'case-system': {
                german: {
                    system: '4 Fälle: Nominativ, Akkusativ, Dativ, Genitiv',
                    example: 'der Mann (Nom), den Mann (Akk), dem Mann (Dat), des Mannes (Gen)'
                },
                spanish: {
                    system: 'KEINE Fälle! Nur Präpositionen',
                    example: 'el hombre (immer gleich)'
                },
                similarity: 0.0,
                note: 'RIESIGER VORTEIL: Spanisch hat keine Fälle!',
                advantage: 'Deutsche finden Spanisch viel einfacher als Deutsch!'
            },

            'word-order': {
                german: {
                    system: 'Strenge Regeln, Verb an Position 2',
                    example: 'Ich esse einen Apfel. / Heute esse ich einen Apfel.'
                },
                spanish: {
                    system: 'Flexibler, meist Subjekt-Verb-Objekt',
                    example: 'Yo como una manzana. / Como una manzana.'
                },
                similarity: 0.6,
                note: 'Spanisch flexibler und einfacher'
            },

            'formal-informal': {
                german: {
                    system: 'du (informal) vs Sie (formal)',
                    example: 'Du gehst / Sie gehen'
                },
                spanish: {
                    system: 'tú (informal) vs usted (formal)',
                    example: 'Tú vas / Usted va'
                },
                similarity: 0.95,
                note: 'Fast identisch! Deutsche verstehen das sofort.',
                advantage: 'Perfekter Transfer!'
            }
        };
    }

    /**
     * Typische Fehler deutscher Lerner
     */
    initializeTypicalErrors() {
        return [
            {
                error: 'ser/estar Verwechslung',
                frequency: 'very-high',
                reason: 'Deutsch hat nur "sein"',
                solution: 'DOCTOR (ser) vs PLACE (estar) Eselsbrücke',
                practice: 'Intensive Kontrastübungen'
            },
            {
                error: 'Personalpronomen zu oft verwendet',
                frequency: 'high',
                reason: 'Im Deutschen notwendig, im Spanischen redundant',
                solution: 'Pronomen nur zur Betonung verwenden',
                practice: 'Bewusst weglassen üben'
            },
            {
                error: 'Persönliches "a" vergessen',
                frequency: 'very-high',
                reason: 'Gibt es im Deutschen nicht',
                solution: 'Regel: Person als Objekt → immer "a"',
                practice: 'Drill mit Personen-Objekten'
            },
            {
                error: 'Adjektiv vor Nomen',
                frequency: 'high',
                reason: 'Deutsche Wortstellung übertragen',
                solution: 'Regel: Im Spanischen Nomen zuerst!',
                practice: 'Bewusst umstellen üben'
            },
            {
                error: 'Keine doppelte Verneinung',
                frequency: 'medium',
                reason: 'Im Deutschen ist doppelte Verneinung falsch',
                solution: 'Im Spanischen: no + nada/nadie ist RICHTIG',
                practice: 'Negation-Drills'
            },
            {
                error: 'Subjekt-Verb-Objekt in Fragen',
                frequency: 'medium',
                reason: 'Deutsche Fragestruktur übertragen',
                solution: 'Spanisch: Verb zuerst oder Subjekt weglassen',
                practice: 'Frage-Drills'
            }
        ];
    }

    /**
     * Analyse einer Übung auf Transfer-Möglichkeiten
     */
    analyzeExercise(exercise, userAnswer, correctAnswer) {
        const analysis = {
            positiveTransfers: [],
            negativeTransfers: [],
            falseFriends: [],
            cognates: [],
            recommendations: []
        };

        // Check for false friends
        const falseFriend = this.detectFalseFriend(exercise, userAnswer);
        if (falseFriend) {
            analysis.falseFriends.push(falseFriend);
            analysis.recommendations.push({
                type: 'warning',
                priority: 'high',
                message: `⚠️ Falscher Freund: ${falseFriend.spanish}`,
                explanation: falseFriend.warning
            });
        }

        // Check for negative transfers
        const negativeTransfer = this.detectNegativeTransfer(exercise, userAnswer, correctAnswer);
        if (negativeTransfer) {
            analysis.negativeTransfers.push(negativeTransfer);
            analysis.recommendations.push({
                type: 'interference',
                priority: 'high',
                message: `⚠️ Deutsche Interferenz: ${negativeTransfer.type}`,
                explanation: negativeTransfer.explanation,
                germanPattern: negativeTransfer.germanPattern,
                spanishPattern: negativeTransfer.spanishPattern
            });
        }

        // Check for positive transfers
        const positiveTransfer = this.detectPositiveTransfer(exercise);
        if (positiveTransfer) {
            analysis.positiveTransfers.push(positiveTransfer);
            analysis.recommendations.push({
                type: 'advantage',
                priority: 'low',
                message: `✓ Vorteil aus dem Deutschen: ${positiveTransfer.description}`,
                explanation: positiveTransfer.help
            });
        }

        // Check for cognates
        const cognate = this.detectCognate(exercise);
        if (cognate) {
            analysis.cognates.push(cognate);
            analysis.recommendations.push({
                type: 'cognate',
                priority: 'low',
                message: `💡 Ähnlich wie im Deutschen: ${cognate.de}`,
                explanation: cognate.note || 'Nutze die Ähnlichkeit!'
            });
        }

        return analysis;
    }

    /**
     * Detect false friend
     */
    detectFalseFriend(exercise, userAnswer) {
        const words = (exercise.es || exercise.question || '').toLowerCase().split(/\s+/);

        for (const word of words) {
            const falseFriend = this.falseFriends.find(ff =>
                ff.spanish.toLowerCase() === word
            );

            if (falseFriend && falseFriend.riskLevel !== 'none') {
                return falseFriend;
            }
        }

        return null;
    }

    /**
     * Detect negative transfer
     */
    detectNegativeTransfer(exercise, userAnswer, correctAnswer) {
        const concept = exercise.concept || '';

        // SER/ESTAR confusion
        if (concept.includes('ser') || concept.includes('estar')) {
            if (userAnswer.includes('soy') && correctAnswer.includes('estoy') ||
                userAnswer.includes('estoy') && correctAnswer.includes('soy')) {
                return {
                    type: 'ser-estar-confusion',
                    ...this.negativeTransfers['ser-estar-confusion']
                };
            }
        }

        // Personal 'a' missing
        if (concept.includes('personal-a') || exercise.type === 'sentence') {
            if (correctAnswer.includes(' a ') && !userAnswer.includes(' a ')) {
                return {
                    type: 'personal-a',
                    ...this.negativeTransfers['personal-a']
                };
            }
        }

        // Word order in questions
        if (exercise.type === 'question' || (exercise.question && exercise.question.includes('¿'))) {
            // Detect if user put subject before verb German-style
            const hasSubjectBeforeVerb = /\b(yo|tú|él|ella|usted)\s+(soy|eres|es|estoy|estás|está|hablo|hablas|habla)/i.test(userAnswer);
            if (hasSubjectBeforeVerb && !correctAnswer.match(/\b(yo|tú|él|ella|usted)\s+/i)) {
                return {
                    type: 'word-order-questions',
                    ...this.negativeTransfers['word-order-questions']
                };
            }
        }

        return null;
    }

    /**
     * Detect positive transfer
     */
    detectPositiveTransfer(exercise) {
        const concept = exercise.concept || '';

        if (concept.includes('formal') || concept.includes('usted')) {
            return this.positiveTransfers['formal-informal'];
        }

        if (concept.includes('conjugat')) {
            return this.positiveTransfers['verb-conjugation'];
        }

        if (concept.includes('gender') || exercise.type === 'gender') {
            return this.positiveTransfers['noun-gender'];
        }

        return null;
    }

    /**
     * Detect cognate
     */
    detectCognate(exercise) {
        const text = (exercise.es || exercise.question || '').toLowerCase();

        // Check easy cognates
        for (const cognate of this.cognates.easy) {
            if (text.includes(cognate.es.toLowerCase())) {
                return cognate;
            }
        }

        // Check moderate cognates
        for (const cognate of this.cognates.moderate) {
            if (text.includes(cognate.es.toLowerCase())) {
                return cognate;
            }
        }

        return null;
    }

    /**
     * Generate German-optimized explanation
     */
    generateGermanOptimizedExplanation(errorType, details = {}) {
        const templates = {
            'ser-estar-location': `
                <div class="german-explanation">
                    <h4>SER vs ESTAR: Ort</h4>
                    <div class="comparison">
                        <div class="german">
                            <strong>🇩🇪 Deutsch:</strong> Nur EIN Verb "sein"<br>
                            "Ich bin zu Hause" - einfach!
                        </div>
                        <div class="spanish">
                            <strong>🇪🇸 Spanisch:</strong> ZWEI Verben!<br>
                            "Estoy en casa" - ESTAR für Orte!
                        </div>
                    </div>
                    <div class="rule">
                        <strong>Regel:</strong> Bei Ortsangaben IMMER estar!
                    </div>
                    <div class="why">
                        <strong>Warum?</strong> ESTAR = temporärer Zustand/Ort<br>
                        SER = permanente Eigenschaft/Identität
                    </div>
                    <div class="mnemonic">
                        <strong>Eselsbrücke:</strong> ESTAR hat "ESTAN" → "STAN"d"ort"
                    </div>
                </div>
            `,

            'personal-a': `
                <div class="german-explanation">
                    <h4>Persönliches "a" - gibt es im Deutschen NICHT!</h4>
                    <div class="comparison">
                        <div class="german">
                            <strong>🇩🇪 Deutsch:</strong><br>
                            "Ich sehe Maria" - KEIN "a"!
                        </div>
                        <div class="spanish">
                            <strong>🇪🇸 Spanisch:</strong><br>
                            "Veo A Maria" - MIT "a"!
                        </div>
                    </div>
                    <div class="rule">
                        <strong>Regel:</strong> Person als Objekt → immer "a" davor!
                    </div>
                    <div class="examples">
                        ✅ Veo <strong>a</strong> Pedro<br>
                        ✅ Conozco <strong>a</strong> tu madre<br>
                        ✅ Busco <strong>a</strong> mi hermano
                    </div>
                    <div class="mnemonic">
                        <strong>Merkhilfe:</strong> Verben wie ver, conocer, buscar + Person = immer "a"!
                    </div>
                </div>
            `,

            'double-negation': `
                <div class="german-explanation">
                    <h4>Doppelte Verneinung - im Spanischen RICHTIG!</h4>
                    <div class="comparison">
                        <div class="german">
                            <strong>🇩🇪 Deutsch:</strong> FALSCH!<br>
                            "Ich habe nicht nichts" = positiv 😕
                        </div>
                        <div class="spanish">
                            <strong>🇪🇸 Spanisch:</strong> RICHTIG!<br>
                            "No tengo nada" = "Ich habe nichts" ✓
                        </div>
                    </div>
                    <div class="rule">
                        <strong>Wichtig:</strong> Im Spanischen ist "no" + "nada/nadie/ningún" korrekt!
                    </div>
                    <div class="examples">
                        ✅ No veo <strong>nada</strong> - Ich sehe nichts<br>
                        ✅ No conozco a <strong>nadie</strong> - Ich kenne niemanden<br>
                        ✅ No tengo <strong>ningún</strong> problema - Ich habe kein Problem
                    </div>
                </div>
            `
        };

        return templates[errorType] || null;
    }

    /**
     * Get comparison for grammar concept
     */
    getGrammarComparison(concept) {
        return this.grammarComparisons[concept] || null;
    }

    /**
     * Get typical errors for concept
     */
    getTypicalErrors(concept) {
        return this.typicalErrors.filter(err =>
            err.error.toLowerCase().includes(concept.toLowerCase())
        );
    }

    /**
     * Generate study recommendations for German learners
     */
    generateGermanLearnerRecommendations(errorHistory) {
        const recommendations = [];

        // Analyze error patterns
        const errorCounts = {};
        errorHistory.forEach(err => {
            errorCounts[err.type] = (errorCounts[err.type] || 0) + 1;
        });

        // SER/ESTAR errors
        if (errorCounts['ser-estar'] >= 3) {
            recommendations.push({
                priority: 'critical',
                topic: 'SER vs ESTAR',
                message: 'Du verwechselst oft SER und ESTAR',
                reason: 'Im Deutschen gibt es nur "sein" - das ist die größte Herausforderung!',
                solution: 'Übe täglich mit der DOCTOR/PLACE Eselsbrücke',
                exercises: ['ser-estar-contrast', 'ser-estar-drill'],
                germanConnection: 'Denk dran: Deutsch hat nur EIN "sein", Spanisch hat ZWEI!'
            });
        }

        // Personal 'a' errors
        if (errorCounts['personal-a'] >= 2) {
            recommendations.push({
                priority: 'high',
                topic: 'Persönliches "a"',
                message: 'Du vergisst oft das persönliche "a"',
                reason: 'Gibt es im Deutschen nicht - daher schwer zu merken',
                solution: 'Regel einprägen: Person als Objekt → immer "a"!',
                exercises: ['personal-a-drill'],
                germanConnection: 'Im Deutschen: "Ich sehe Maria" - im Spanischen: "Veo A Maria"'
            });
        }

        // Word order errors
        if (errorCounts['word-order'] >= 2) {
            recommendations.push({
                priority: 'medium',
                topic: 'Wortstellung',
                message: 'Du überträgst die deutsche Wortstellung',
                reason: 'Deutsche Satzbau-Regeln funktionieren nicht 1:1 im Spanischen',
                solution: 'Übe spanische Wortstellung bewusst',
                exercises: ['word-order-practice'],
                germanConnection: 'Spanisch ist flexibler als Deutsch!'
            });
        }

        return recommendations.sort((a, b) => {
            const priorities = { critical: 3, high: 2, medium: 1, low: 0 };
            return priorities[b.priority] - priorities[a.priority];
        });
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GermanSpanishContrastiveSystem };
}
