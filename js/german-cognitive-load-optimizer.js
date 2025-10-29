/**
 * German Cognitive Load Optimizer
 *
 * Optimiert die kognitive Last für deutsche Muttersprachler basierend auf:
 * - Cognitive Load Theory (Sweller, 1988)
 * - Germane Load Maximization
 * - Intrinsic vs Extraneous Load Reduction
 * - Language Transfer Complexity Analysis
 *
 * Reduziert unnötige kognitive Last durch:
 * - Sequencing basierend auf deutscher Grammatik-Kenntnis
 * - Chunk-basiertes Lernen mit deutschen Ankerpunkten
 * - Progressive Complexity für schwierige Transfers
 */

class GermanCognitiveLoadOptimizer {
    constructor(contrastiveSystem) {
        this.contrastiveSystem = contrastiveSystem;

        // Komplexitäts-Scores für deutsche Lerner
        this.conceptComplexity = this.initializeComplexityScores();

        // Lernsequenzen optimiert für deutsche
        this.learningSequences = this.initializeLearningSequences();

        // Chunking-Strategien
        this.chunkingStrategies = this.initializeChunkingStrategies();
    }

    /**
     * Komplexitäts-Scores initialisieren
     * Skala: 1-10 (1 = einfach für Deutsche, 10 = sehr schwer)
     */
    initializeComplexityScores() {
        return {
            // Sehr einfach (1-3) - Deutsche haben Vorteil
            'formal-informal': 1,     // Du/Sie kennen sie bereits
            'verb-conjugation': 2,     // Kennen Konjugation
            'noun-gender': 2,          // Kennen Genus-Konzept
            'compound-words': 2,       // Machen sie selbst

            // Moderat (4-6) - Transfer mit Anpassungen
            'adjective-position': 4,   // Umgekehrte Reihenfolge
            'pronoun-dropping': 5,     // Müssen umlernen
            'reflexive-verbs': 5,      // Mehr als im Deutschen
            'continuous-tense': 6,     // Neu für Deutsche

            // Schwer (7-8) - Große Unterschiede
            'personal-a': 7,           // Gibt es nicht im Deutschen
            'double-negation': 7,      // Kontraintuitiv
            'word-order-questions': 7, // Andere Logik

            // Sehr schwer (9-10) - Größte Herausforderungen
            'ser-estar': 10,           // Nur EIN "sein" im Deutschen
            'subjunctive': 9,          // Fast ausgestorben im Deutschen
            'por-para': 8              // Beide = "für" im Deutschen
        };
    }

    /**
     * Optimale Lernsequenzen für deutsche Lerner
     */
    initializeLearningSequences() {
        return {
            // Phase 1: Nutze deutsche Vorteile
            phase1_foundation: {
                order: [
                    'formal-informal',      // ✓ Kennen sie!
                    'verb-conjugation',     // ✓ Kennen sie!
                    'noun-gender',          // ✓ Kennen sie!
                    'personal-pronouns'     // ✓ Kennen sie!
                ],
                strategy: 'leverage-existing-knowledge',
                cognitiveLoad: 'low',
                reason: 'Starte mit dem was Deutsche bereits können - baut Vertrauen auf'
            },

            // Phase 2: Einführung kleiner Unterschiede
            phase2_smalldifferences: {
                order: [
                    'adjective-position',   // ← Nur Reihenfolge umdrehen
                    'compound-words',       // ← Ähnlich, aber anders gebildet
                    'question-formation'    // ← Ähnlich zu Deutsch
                ],
                strategy: 'progressive-differentiation',
                cognitiveLoad: 'medium-low',
                reason: 'Kleine, handhabbare Unterschiede zum Deutschen'
            },

            // Phase 3: Neue Konzepte mit deutschen Anknüpfungspunkten
            phase3_newconcepts: {
                order: [
                    'reflexive-verbs',      // ← Gibt es im Deutschen, aber seltener
                    'continuous-tense',     // ← Neu, aber logisch
                    'pronoun-dropping'      // ← Erfordert Umdenken
                ],
                strategy: 'scaffolded-introduction',
                cognitiveLoad: 'medium',
                reason: 'Neue Konzepte, aber mit Verbindung zu Bekanntem'
            },

            // Phase 4: Herausfordernde Transfers
            phase4_challenges: {
                order: [
                    'personal-a',           // ← Gibt es nicht im Deutschen
                    'double-negation',      // ← Kontraintuitiv
                    'word-order-questions'  // ← Andere Logik
                ],
                strategy: 'intensive-contrast',
                cognitiveLoad: 'medium-high',
                reason: 'Erfordert bewusstes Ablegen deutscher Muster'
            },

            // Phase 5: Maximale Herausforderung
            phase5_mastery: {
                order: [
                    'ser-estar',            // ← GRÖSSTE Herausforderung!
                    'por-para',             // ← Feine Unterschiede
                    'subjunctive'           // ← Komplexes Mood-System
                ],
                strategy: 'intensive-practice-with-anchors',
                cognitiveLoad: 'high',
                reason: 'Konzepte die maximale Aufmerksamkeit erfordern - erst wenn Fundament stabil'
            }
        };
    }

    /**
     * Chunking-Strategien für besseres Lernen
     */
    initializeChunkingStrategies() {
        return {
            'ser-estar': {
                // Teile das komplexe Konzept in handhabbare Chunks
                chunks: [
                    {
                        name: 'SER für Identität',
                        complexity: 3,
                        germanConnection: 'Wie "Ich BIN Deutscher"',
                        examples: ['Soy profesor', 'Eres alemán'],
                        practice: 10 // Übungen
                    },
                    {
                        name: 'ESTAR für Ort',
                        complexity: 4,
                        germanConnection: 'Wie "Ich bin ZU HAUSE"',
                        examples: ['Estoy en casa', 'Estás aquí'],
                        practice: 15
                    },
                    {
                        name: 'ESTAR für Emotionen',
                        complexity: 5,
                        germanConnection: 'Wie "Ich bin GLÜCKLICH" (temporär)',
                        examples: ['Estoy feliz', 'Estás triste'],
                        practice: 15
                    },
                    {
                        name: 'SER vs ESTAR Kontrast',
                        complexity: 8,
                        germanConnection: 'Entscheide: permanent oder temporär?',
                        examples: ['Soy vs Estoy', 'Eres vs Estás'],
                        practice: 30
                    },
                    {
                        name: 'Bedeutungswechsel (listo, rico, etc.)',
                        complexity: 9,
                        germanConnection: 'Gleiches Wort, andere Bedeutung!',
                        examples: ['Es listo vs Está listo'],
                        practice: 20
                    }
                ],
                totalPractice: 90,
                estimatedDays: 14,
                sequencing: 'Must complete each chunk before next'
            },

            'personal-a': {
                chunks: [
                    {
                        name: 'Regel erkennen',
                        complexity: 3,
                        germanConnection: 'Im Deutschen gibt es das nicht',
                        practice: 5
                    },
                    {
                        name: 'Mit "ver" (sehen)',
                        complexity: 4,
                        germanConnection: 'Veo A Maria (nicht wie Deutsch)',
                        practice: 10
                    },
                    {
                        name: 'Mit "conocer" (kennen)',
                        complexity: 4,
                        germanConnection: 'Conozco A Pedro',
                        practice: 10
                    },
                    {
                        name: 'Automatisierung',
                        complexity: 6,
                        germanConnection: 'Automatisch "a" setzen',
                        practice: 20
                    }
                ],
                totalPractice: 45,
                estimatedDays: 7
            }
        };
    }

    /**
     * Optimiere Übungsreihenfolge basierend auf deutscher Perspektive
     */
    optimizeExerciseSequence(exercises, userProgress) {
        // Sortiere nach Komplexität für deutsche Lerner
        const scored = exercises.map(ex => ({
            exercise: ex,
            complexity: this.calculateComplexityForGermans(ex),
            germanAdvantage: this.hasGermanAdvantage(ex),
            cognitiveLoad: this.calculateCognitiveLoad(ex, userProgress)
        }));

        // Strategie: Einfache zuerst (nutze deutsche Vorteile)
        scored.sort((a, b) => {
            // Deutsche Vorteile zuerst
            if (a.germanAdvantage && !b.germanAdvantage) return -1;
            if (!a.germanAdvantage && b.germanAdvantage) return 1;

            // Dann nach kognitiver Last
            return a.cognitiveLoad - b.cognitiveLoad;
        });

        return scored.map(s => s.exercise);
    }

    /**
     * Berechne Komplexität für deutsche Lerner
     */
    calculateComplexityForGermans(exercise) {
        const concept = exercise.concept || 'general';
        const baseComplexity = this.conceptComplexity[concept] || 5;

        // Reduziere Komplexität wenn positiver Transfer möglich
        const transfer = this.contrastiveSystem?.positiveTransfers[concept];
        if (transfer) {
            return baseComplexity * (1 - transfer.similarity * 0.3);
        }

        // Erhöhe Komplexität bei negativem Transfer
        const negTransfer = this.contrastiveSystem?.negativeTransfers[concept];
        if (negTransfer && negTransfer.interference === 'very-high') {
            return baseComplexity * 1.5;
        }

        return baseComplexity;
    }

    /**
     * Prüfe ob Deutsche einen Vorteil haben
     */
    hasGermanAdvantage(exercise) {
        const concept = exercise.concept || '';

        const advantages = [
            'formal-informal',
            'verb-conjugation',
            'noun-gender',
            'compound-words'
        ];

        return advantages.some(adv => concept.includes(adv));
    }

    /**
     * Berechne kognitive Last
     */
    calculateCognitiveLoad(exercise, userProgress) {
        let load = 0;

        // Intrinsische Last (Konzept-Komplexität)
        const complexity = this.calculateComplexityForGermans(exercise);
        load += complexity * 10;

        // Extraneous Load (unnötige Schwierigkeit)
        // Reduziere durch deutsche Verbindungen
        if (this.hasGermanAdvantage(exercise)) {
            load *= 0.7; // 30% Reduktion
        }

        // Germane Load (produktive Last)
        // Erhöhe wenn Nutzer bereit für Herausforderung
        if (userProgress && userProgress.overallAccuracy > 0.80) {
            load *= 1.2; // Kann mehr verarbeiten
        }

        return load;
    }

    /**
     * Generiere optimale Lerneinheit für deutsche
     */
    generateOptimizedLearningUnit(concept, targetExercises = 20) {
        const chunks = this.chunkingStrategies[concept];

        if (!chunks) {
            return this.generateDefaultUnit(concept, targetExercises);
        }

        const unit = {
            concept: concept,
            chunks: [],
            totalExercises: 0,
            estimatedDays: chunks.estimatedDays,
            strategy: 'chunked-progressive'
        };

        // Füge jeden Chunk hinzu
        chunks.chunks.forEach((chunk, index) => {
            unit.chunks.push({
                chunkNumber: index + 1,
                name: chunk.name,
                germanConnection: chunk.germanConnection,
                exercises: this.generateExercisesForChunk(chunk),
                complexity: chunk.complexity,
                requiredAccuracy: this.calculateRequiredAccuracy(chunk.complexity),
                mustCompleteBefore: index < chunks.chunks.length - 1 ? index + 2 : null
            });

            unit.totalExercises += chunk.practice;
        });

        return unit;
    }

    /**
     * Generiere Übungen für einen Chunk
     */
    generateExercisesForChunk(chunk) {
        return {
            introduction: Math.ceil(chunk.practice * 0.2),  // 20% Einführung
            practice: Math.ceil(chunk.practice * 0.5),      // 50% Übung
            mastery: Math.ceil(chunk.practice * 0.3)        // 30% Meisterschaft
        };
    }

    /**
     * Berechne erforderliche Genauigkeit basierend auf Komplexität
     */
    calculateRequiredAccuracy(complexity) {
        // Höhere Komplexität = niedrigere erforderliche Genauigkeit (realistisch)
        if (complexity <= 3) return 0.85;      // Einfach: 85%
        if (complexity <= 5) return 0.80;      // Mittel: 80%
        if (complexity <= 7) return 0.75;      // Schwer: 75%
        return 0.70;                            // Sehr schwer: 70%
    }

    /**
     * Generiere Standard-Einheit
     */
    generateDefaultUnit(concept, targetExercises) {
        const complexity = this.conceptComplexity[concept] || 5;

        return {
            concept: concept,
            exercises: targetExercises,
            complexity: complexity,
            requiredAccuracy: this.calculateRequiredAccuracy(complexity),
            estimatedDays: Math.ceil(targetExercises / 10), // ~10 Übungen/Tag
            germanAdvantage: this.hasGermanAdvantage({ concept }),
            strategy: 'standard'
        };
    }

    /**
     * Empfehle nächsten Lernschritt
     */
    recommendNextStep(currentConcept, userProgress) {
        const currentComplexity = this.conceptComplexity[currentConcept] || 5;
        const userLevel = this.determineUserLevel(userProgress);

        // Finde passende Phase
        let recommendedPhase = null;

        if (userLevel === 'beginner' || currentComplexity <= 3) {
            recommendedPhase = this.learningSequences.phase1_foundation;
        } else if (currentComplexity <= 5) {
            recommendedPhase = this.learningSequences.phase2_smalldifferences;
        } else if (currentComplexity <= 7) {
            recommendedPhase = this.learningSequences.phase3_newconcepts;
        } else if (currentComplexity <= 8) {
            recommendedPhase = this.learningSequences.phase4_challenges;
        } else {
            recommendedPhase = this.learningSequences.phase5_mastery;
        }

        // Finde nächstes Konzept in der Phase
        const currentIndex = recommendedPhase.order.indexOf(currentConcept);
        const nextConcept = currentIndex >= 0 && currentIndex < recommendedPhase.order.length - 1
            ? recommendedPhase.order[currentIndex + 1]
            : recommendedPhase.order[0];

        return {
            nextConcept: nextConcept,
            phase: recommendedPhase,
            reason: recommendedPhase.reason,
            estimatedDifficulty: this.conceptComplexity[nextConcept] || 5,
            germanAdvantage: this.hasGermanAdvantage({ concept: nextConcept }),
            preparation: this.getPreparationTips(nextConcept)
        };
    }

    /**
     * Bestimme Benutzer-Level
     */
    determineUserLevel(userProgress) {
        if (!userProgress || userProgress.totalExercises < 20) {
            return 'beginner';
        }

        if (userProgress.overallAccuracy >= 0.80) {
            return 'advanced';
        } else if (userProgress.overallAccuracy >= 0.65) {
            return 'intermediate';
        }

        return 'beginner';
    }

    /**
     * Vorbereitungstipps für Konzept
     */
    getPreparationTips(concept) {
        const tips = {
            'ser-estar': [
                'Wiederhole die Konjugation von "sein" im Deutschen',
                'Mache dir bewusst: Deutsch hat nur EIN "sein"',
                'Bereite dich mental vor: Spanisch teilt "sein" in ZWEI Verben'
            ],
            'personal-a': [
                'Akzeptiere: Das gibt es im Deutschen nicht',
                'Präge dir ein: Person als Objekt → "a"',
                'Übe mit einfachen Sätzen: "Ich sehe Maria" → "Veo A Maria"'
            ],
            'double-negation': [
                'Vergiss die deutsche Regel: "Doppelte Verneinung = positiv"',
                'Im Spanischen gilt: Doppelte Verneinung = negativ!',
                'Akzeptiere die neue Logik'
            ]
        };

        return tips[concept] || [
            'Schaue dir deutsche Beispiele an',
            'Vergleiche mit spanischer Struktur',
            'Notiere Unterschiede'
        ];
    }

    /**
     * Reduziere kognitive Last für Übung
     */
    reduceCognitiveLoad(exercise, userLevel = 'beginner') {
        const optimized = { ...exercise };

        // Füge deutschen Kontext hinzu
        optimized.germanContext = this.addGermanContext(exercise);

        // Vereinfache für Anfänger
        if (userLevel === 'beginner') {
            // Füge Hilfestellung hinzu
            optimized.germanHint = this.generateGermanHint(exercise);

            // Reduziere Optionen bei Multiple Choice
            if (exercise.type === 'multiple-choice' && exercise.options.length > 3) {
                optimized.options = exercise.options.slice(0, 3);
            }
        }

        // Füge positive Transfer-Hinweise hinzu
        const transfer = this.contrastiveSystem?.detectPositiveTransfer(exercise);
        if (transfer) {
            optimized.germanAdvantage = transfer.help;
        }

        return optimized;
    }

    /**
     * Füge deutschen Kontext hinzu
     */
    addGermanContext(exercise) {
        const concept = exercise.concept || '';

        if (concept.includes('ser') || concept.includes('estar')) {
            return 'Im Deutschen gibt es nur "sein" - pass auf die Unterschiede auf!';
        }

        if (concept.includes('personal-a')) {
            return 'Das "a" gibt es im Deutschen nicht - ist aber wichtig!';
        }

        return 'Vergleiche mit dem Deutschen und achte auf Unterschiede.';
    }

    /**
     * Generiere deutschen Hint
     */
    generateGermanHint(exercise) {
        const concept = exercise.concept || '';

        const hints = {
            'ser-conjugation': 'Denk an "ich BIN Lehrer" (permanent)',
            'estar-conjugation': 'Denk an "ich bin ZU HAUSE" (Ort)',
            'personal-a': 'Person als Objekt? Dann "a" davor!',
            'double-negation': 'Doppelte Verneinung ist hier RICHTIG!',
            'adjective-position': 'Nomen zuerst, dann Adjektiv!'
        };

        return hints[concept] || 'Überlege wie es im Deutschen wäre.';
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GermanCognitiveLoadOptimizer };
}
