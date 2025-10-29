/**
 * German-Spanish Learning System
 *
 * Integriert alle deutschen-spezifischen Optimierungen:
 * - Contrastive Analysis
 * - German Bridge Explanations
 * - Cognitive Load Optimization
 *
 * Bietet eine einheitliche API für deutsche Lerner.
 */

class GermanSpanishLearningSystem {
    constructor() {
        // Initialisiere alle Systeme
        this.contrastiveSystem = new GermanSpanishContrastiveSystem();
        this.explanationGenerator = new GermanBridgeExplanationGenerator(this.contrastiveSystem);
        this.cognitiveOptimizer = new GermanCognitiveLoadOptimizer(this.contrastiveSystem);

        // Tracking
        this.germanErrorPatterns = {};
    }

    /**
     * Analysiere Übung aus deutscher Perspektive
     */
    analyzeExerciseForGermans(exercise, userAnswer, correctAnswer) {
        // Contrastive Analysis
        const contrastive = this.contrastiveSystem.analyzeExercise(
            exercise,
            userAnswer,
            correctAnswer
        );

        // Cognitive Load
        const cognitiveLoad = this.cognitiveOptimizer.calculateComplexityForGermans(exercise);

        // German Advantage?
        const germanAdvantage = this.cognitiveOptimizer.hasGermanAdvantage(exercise);

        return {
            contrastive: contrastive,
            cognitiveLoad: cognitiveLoad,
            germanAdvantage: germanAdvantage,
            complexity: this.cognitiveOptimizer.conceptComplexity[exercise.concept] || 5,
            recommendations: this.generateGermanSpecificRecommendations(contrastive, cognitiveLoad)
        };
    }

    /**
     * Generiere Feedback mit deutschen Brücken
     */
    generateGermanOptimizedFeedback(exercise, userAnswer, isCorrect, errorType = null) {
        let feedback = {
            isCorrect: isCorrect,
            message: '',
            explanation: '',
            germanBridge: null,
            falseFriends: [],
            transferWarnings: []
        };

        if (isCorrect) {
            feedback.message = this.getPositiveFeedback();

            // Zeige positiven Transfer wenn relevant
            const transfer = this.contrastiveSystem.detectPositiveTransfer(exercise);
            if (transfer) {
                feedback.germanBridge = `✓ Das war einfach für dich weil: ${transfer.help}`;
            }
        } else {
            feedback.message = 'Das war noch nicht ganz richtig.';

            // Generiere deutsche Brücken-Erklärung
            if (errorType || exercise.concept) {
                const concept = errorType || exercise.concept;
                feedback.explanation = this.explanationGenerator.generateExplanation(
                    concept,
                    {},
                    'beginner'
                );
            }

            // Check for false friends
            const falseFriend = this.contrastiveSystem.detectFalseFriend(exercise, userAnswer);
            if (falseFriend) {
                feedback.falseFriends.push(falseFriend);
                feedback.transferWarnings.push({
                    type: 'false-friend',
                    message: falseFriend.warning,
                    priority: 'high'
                });
            }

            // Check for negative transfer
            const negTransfer = this.contrastiveSystem.detectNegativeTransfer(
                exercise,
                userAnswer,
                exercise.correctAnswer
            );
            if (negTransfer) {
                feedback.transferWarnings.push({
                    type: 'negative-transfer',
                    concept: negTransfer.type,
                    message: `⚠️ Typischer deutscher Fehler: ${negTransfer.description}`,
                    germanPattern: negTransfer.germanPattern,
                    spanishPattern: negTransfer.spanishPattern,
                    priority: negTransfer.interference === 'very-high' ? 'critical' : 'high'
                });
            }

            // Track German-specific error
            this.trackGermanError(exercise.concept, negTransfer?.type);
        }

        return feedback;
    }

    /**
     * Optimiere Übungsreihenfolge für Deutsche
     */
    optimizeExerciseSequenceForGermans(exercises, userProgress) {
        return this.cognitiveOptimizer.optimizeExerciseSequence(exercises, userProgress);
    }

    /**
     * Generiere Lernplan für deutschen Lerner
     */
    generateGermanLearningPlan(currentLevel, targetLevel, timeframe) {
        const plan = {
            phases: [],
            totalWeeks: 0,
            estimatedHoursPerWeek: 5,
            germanAdvantages: [],
            criticalChallenges: []
        };

        // Phase 1: Deutsche Vorteile nutzen
        plan.phases.push({
            number: 1,
            name: 'Fundament mit deutschen Vorteilen',
            duration: '2 Wochen',
            concepts: this.cognitiveOptimizer.learningSequences.phase1_foundation.order,
            focus: 'Nutze was du schon kennst!',
            germanAdvantage: true,
            cognitiveLoad: 'low'
        });

        // Phase 2: Kleine Unterschiede
        plan.phases.push({
            number: 2,
            name: 'Kleine Anpassungen',
            duration: '2 Wochen',
            concepts: this.cognitiveOptimizer.learningSequences.phase2_smalldifferences.order,
            focus: 'Unterschiede zum Deutschen verstehen',
            cognitiveLoad: 'medium-low'
        });

        // Phase 3: Neue Konzepte
        plan.phases.push({
            number: 3,
            name: 'Neue Strukturen',
            duration: '3 Wochen',
            concepts: this.cognitiveOptimizer.learningSequences.phase3_newconcepts.order,
            focus: 'Erweitere dein Wissen',
            cognitiveLoad: 'medium'
        });

        // Phase 4: Herausforderungen
        plan.phases.push({
            number: 4,
            name: 'Deutsche Interferenzen überwinden',
            duration: '3 Wochen',
            concepts: this.cognitiveOptimizer.learningSequences.phase4_challenges.order,
            focus: 'Lerne was im Deutschen anders ist',
            germanChallenge: true,
            cognitiveLoad: 'medium-high'
        });

        // Phase 5: Meisterschaft
        plan.phases.push({
            number: 5,
            name: 'Meisterschaft der schwierigen Konzepte',
            duration: '4 Wochen',
            concepts: this.cognitiveOptimizer.learningSequences.phase5_mastery.order,
            focus: 'SER/ESTAR und komplexe Strukturen',
            germanChallenge: true,
            cognitiveLoad: 'high',
            warning: 'Diese Phase braucht besonders viel Übung!'
        });

        plan.totalWeeks = 14;

        // Identifiziere deutsche Vorteile
        plan.germanAdvantages = [
            'Du/Sie-Unterscheidung (tú/usted)',
            'Verb-Konjugation kennst du bereits',
            'Genus-System (el/la) ist vertraut',
            'Keine Fälle! (viel einfacher als Deutsch)'
        ];

        // Kritische Herausforderungen
        plan.criticalChallenges = [
            {
                concept: 'SER vs ESTAR',
                difficulty: 10,
                reason: 'Deutsch hat nur "sein"',
                estimatedPractice: '90 Übungen über 14 Tage'
            },
            {
                concept: 'Persönliches "a"',
                difficulty: 7,
                reason: 'Gibt es im Deutschen nicht',
                estimatedPractice: '45 Übungen über 7 Tage'
            },
            {
                concept: 'Doppelte Verneinung',
                difficulty: 7,
                reason: 'Im Deutschen falsch, im Spanischen richtig',
                estimatedPractice: '30 Übungen über 5 Tage'
            }
        ];

        return plan;
    }

    /**
     * Empfehlung für nächsten Schritt
     */
    recommendNextStepForGerman(currentConcept, userProgress) {
        return this.cognitiveOptimizer.recommendNextStep(currentConcept, userProgress);
    }

    /**
     * Track German-specific errors
     */
    trackGermanError(concept, errorType) {
        if (!concept) return;

        const key = errorType || concept;

        if (!this.germanErrorPatterns[key]) {
            this.germanErrorPatterns[key] = {
                count: 0,
                lastOccurrence: null,
                isGermanInterference: errorType !== null
            };
        }

        this.germanErrorPatterns[key].count++;
        this.germanErrorPatterns[key].lastOccurrence = Date.now();
    }

    /**
     * Get German error report
     */
    getGermanErrorReport() {
        const errors = Object.entries(this.germanErrorPatterns)
            .map(([type, data]) => ({
                errorType: type,
                count: data.count,
                isGermanInterference: data.isGermanInterference,
                lastOccurrence: data.lastOccurrence
            }))
            .sort((a, b) => b.count - a.count);

        const report = {
            totalGermanInterferences: errors.filter(e => e.isGermanInterference).length,
            mostCommonErrors: errors.slice(0, 5),
            recommendations: []
        };

        // Generate recommendations
        errors.slice(0, 3).forEach(error => {
            if (error.isGermanInterference) {
                const rec = this.generateRecommendationForError(error.errorType);
                if (rec) report.recommendations.push(rec);
            }
        });

        return report;
    }

    /**
     * Generate recommendation for error
     */
    generateRecommendationForError(errorType) {
        const recommendations = {
            'ser-estar-confusion': {
                title: 'SER vs ESTAR üben',
                message: 'Du verwechselst oft SER und ESTAR - das ist normal für Deutsche!',
                action: 'Übe täglich 10 SER/ESTAR Kontrastübungen',
                resource: 'Nutze die DOCTOR/PLACE Eselsbrücke'
            },
            'personal-a': {
                title: 'Persönliches "a" automatisieren',
                message: 'Das "a" vor Personen vergisst du oft - gibt es im Deutschen nicht!',
                action: 'Präge dir ein: Person als Objekt → immer "a"',
                resource: 'Drill mit "ver a", "conocer a", "buscar a"'
            },
            'double-negation': {
                title: 'Doppelte Verneinung akzeptieren',
                message: 'Im Spanischen ist "no + nada" richtig!',
                action: 'Vergiss die deutsche Regel - Spanisch funktioniert anders',
                resource: 'Übe: "no tengo nada", "no veo a nadie"'
            }
        };

        return recommendations[errorType] || null;
    }

    /**
     * Generate positive feedback messages
     */
    getPositiveFeedback() {
        const messages = [
            '¡Muy bien! Das war richtig! 👍',
            '¡Perfecto! Du hast es verstanden! ✓',
            '¡Excelente! Weiter so! 🎉',
            '¡Correcto! Super gemacht! ⭐',
            'Richtig! Du machst Fortschritte! 📈'
        ];

        return messages[Math.floor(Math.random() * messages.length)];
    }

    /**
     * Generate German-specific recommendations
     */
    generateGermanSpecificRecommendations(contrastive, cognitiveLoad) {
        const recommendations = [];

        // False friends warning
        if (contrastive.falseFriends.length > 0) {
            contrastive.falseFriends.forEach(ff => {
                recommendations.push({
                    type: 'false-friend',
                    priority: 'high',
                    message: ff.warning,
                    mnemonic: ff.mnemonic
                });
            });
        }

        // Negative transfer warning
        if (contrastive.negativeTransfers.length > 0) {
            contrastive.negativeTransfers.forEach(nt => {
                recommendations.push({
                    type: 'negative-transfer',
                    priority: 'high',
                    message: `Achtung: ${nt.description}`,
                    explanation: nt.explanation
                });
            });
        }

        // Positive transfer encouragement
        if (contrastive.positiveTransfers.length > 0) {
            contrastive.positiveTransfers.forEach(pt => {
                recommendations.push({
                    type: 'advantage',
                    priority: 'low',
                    message: `✓ Vorteil: ${pt.description}`,
                    encouragement: pt.help
                });
            });
        }

        // Cognitive load warning
        if (cognitiveLoad > 70) {
            recommendations.push({
                type: 'difficulty',
                priority: 'medium',
                message: 'Das ist ein schwieriges Konzept - nimm dir Zeit!',
                tip: 'Mache Pausen und wiederhole öfter.'
            });
        }

        return recommendations;
    }

    /**
     * Optimize exercise for German learner
     */
    optimizeExerciseForGerman(exercise, userLevel = 'beginner') {
        return this.cognitiveOptimizer.reduceCognitiveLoad(exercise, userLevel);
    }

    /**
     * Get grammar comparison
     */
    getGrammarComparison(concept) {
        return this.contrastiveSystem.getGrammarComparison(concept);
    }

    /**
     * Get typical German errors for concept
     */
    getTypicalGermanErrors(concept) {
        return this.contrastiveSystem.getTypicalErrors(concept);
    }

    /**
     * Generate chunked learning unit
     */
    generateChunkedUnit(concept, targetExercises = 20) {
        return this.cognitiveOptimizer.generateOptimizedLearningUnit(concept, targetExercises);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GermanSpanishLearningSystem };
}
