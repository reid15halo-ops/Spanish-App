/**
 * Adaptive Practice System
 *
 * Generates personalized practice exercises based on:
 * - Level test results
 * - Weak areas identified
 * - Learning patterns
 * - German help usage
 *
 * Creates targeted practice sessions to improve weak areas
 */

class AdaptivePracticeSystem {
    constructor() {
        this.weakAreas = [];
        this.practiceHistory = [];
    }

    /**
     * Generate personalized practice session based on test results
     */
    generatePracticeSession(testResults) {
        if (!testResults || !testResults.weakAreas) {
            return null;
        }

        const session = {
            id: `practice_${Date.now()}`,
            basedOnTest: testResults.testId,
            timestamp: new Date().toISOString(),
            weakAreas: testResults.weakAreas,
            exercises: []
        };

        // Generate targeted exercises for each weak area
        testResults.weakAreas.forEach(weakArea => {
            const exercises = this.generateExercisesForWeakArea(weakArea);
            session.exercises.push(...exercises);
        });

        // Add mixed exercises to reinforce learning
        const mixedExercises = this.generateMixedExercises(testResults.weakAreas);
        session.exercises.push(...mixedExercises);

        // Shuffle exercises for variety
        session.exercises = this.shuffleArray(session.exercises);

        return session;
    }

    /**
     * Generate exercises for specific weak area
     */
    generateExercisesForWeakArea(weakArea) {
        const generators = {
            'vocabulary': () => this.generateVocabularyPractice(),
            'ser_estar': () => this.generateSerEstarPractice(),
            'tener': () => this.generateTenerPractice(),
            'reading': () => this.generateReadingPractice(),
            'practical': () => this.generatePracticalPractice()
        };

        const generator = generators[weakArea.concept];
        if (generator) {
            return generator();
        }

        return [];
    }

    /**
     * Generate vocabulary practice exercises
     */
    generateVocabularyPractice() {
        return [
            {
                id: 'practice_vocab_1',
                type: 'fill-blank',
                question: '¡____! ¿Cómo estás?',
                correctAnswer: 'Hola',
                alternateAnswers: ['Buenas', 'Buenos días'],
                concept: 'vocabulary',
                difficulty: 1
            },
            {
                id: 'practice_vocab_2',
                type: 'multiple-choice',
                question: 'Yo soy ____. Trabajo en un hospital.',
                options: ['médico', 'profesor', 'estudiante', 'ingeniero'],
                correctAnswer: 'médico',
                concept: 'vocabulary',
                difficulty: 1
            },
            {
                id: 'practice_vocab_3',
                type: 'fill-blank',
                question: '¿Cuál es tu ____?',
                correctAnswer: 'nombre',
                concept: 'vocabulary',
                difficulty: 1
            },
            {
                id: 'practice_vocab_4',
                type: 'multiple-choice',
                question: 'Yo ____ Pedro.',
                options: ['me llamo', 'soy', 'estoy', 'tengo'],
                correctAnswer: 'me llamo',
                concept: 'vocabulary',
                difficulty: 1
            },
            {
                id: 'practice_vocab_5',
                type: 'fill-blank',
                question: 'Mucho ____. Encantado.',
                correctAnswer: 'gusto',
                concept: 'vocabulary',
                difficulty: 1
            }
        ];
    }

    /**
     * Generate SER vs ESTAR practice exercises
     */
    generateSerEstarPractice() {
        return [
            {
                id: 'practice_ser_estar_1',
                type: 'fill-blank',
                question: 'María ____ profesora.',
                correctAnswer: 'es',
                concept: 'ser_estar',
                difficulty: 2,
                hint: 'Profesión permanente'
            },
            {
                id: 'practice_ser_estar_2',
                type: 'fill-blank',
                question: 'Hoy yo ____ muy feliz.',
                correctAnswer: 'estoy',
                concept: 'ser_estar',
                difficulty: 2,
                hint: 'Estado temporal'
            },
            {
                id: 'practice_ser_estar_3',
                type: 'fill-blank',
                question: 'El libro ____ en la mesa.',
                correctAnswer: 'está',
                concept: 'ser_estar',
                difficulty: 2,
                hint: 'Ubicación'
            },
            {
                id: 'practice_ser_estar_4',
                type: 'fill-blank',
                question: 'Nosotros ____ estudiantes.',
                correctAnswer: 'somos',
                concept: 'ser_estar',
                difficulty: 2
            },
            {
                id: 'practice_ser_estar_5',
                type: 'fill-blank',
                question: 'Tú ____ cansado después del trabajo.',
                correctAnswer: 'estás',
                concept: 'ser_estar',
                difficulty: 2
            },
            {
                id: 'practice_ser_estar_6',
                type: 'multiple-choice',
                question: 'Mi casa ____ grande y bonita.',
                options: ['es', 'está'],
                correctAnswer: 'es',
                concept: 'ser_estar',
                difficulty: 2
            },
            {
                id: 'practice_ser_estar_7',
                type: 'multiple-choice',
                question: 'La sopa ____ fría.',
                options: ['es', 'está'],
                correctAnswer: 'está',
                concept: 'ser_estar',
                difficulty: 2,
                hint: 'Temperatura (estado temporal)'
            }
        ];
    }

    /**
     * Generate TENER practice exercises
     */
    generateTenerPractice() {
        return [
            {
                id: 'practice_tener_1',
                type: 'fill-blank',
                question: 'Yo ____ 30 años.',
                correctAnswer: 'tengo',
                concept: 'tener',
                difficulty: 1
            },
            {
                id: 'practice_tener_2',
                type: 'fill-blank',
                question: '¿____ tú hambre?',
                correctAnswer: 'Tienes',
                concept: 'tener',
                difficulty: 1
            },
            {
                id: 'practice_tener_3',
                type: 'fill-blank',
                question: 'Ellos ____ dos hijos.',
                correctAnswer: 'tienen',
                concept: 'tener',
                difficulty: 1
            },
            {
                id: 'practice_tener_4',
                type: 'multiple-choice',
                question: 'Nosotros ____ mucho trabajo.',
                options: ['tenemos', 'somos', 'estamos', 'hay'],
                correctAnswer: 'tenemos',
                concept: 'tener',
                difficulty: 2
            },
            {
                id: 'practice_tener_5',
                type: 'fill-blank',
                question: '¿Cuántos años ____ tu hermano?',
                correctAnswer: 'tiene',
                concept: 'tener',
                difficulty: 2
            }
        ];
    }

    /**
     * Generate reading practice exercises
     */
    generateReadingPractice() {
        return [
            {
                id: 'practice_reading_1',
                type: 'reading-comprehension',
                question: 'Lee el texto:',
                dialog: [
                    { speaker: 'Carlos', text: 'Hola Ana, ¿cómo estás hoy?' },
                    { speaker: 'Ana', text: 'Estoy bien, gracias. Tengo mucho trabajo pero estoy contenta.' }
                ],
                comprehensionCheck: {
                    question: '¿Cómo está Ana?',
                    options: ['Bien', 'Mal', 'Cansada', 'Enferma'],
                    correctAnswer: 'Bien'
                },
                concept: 'reading',
                difficulty: 2
            },
            {
                id: 'practice_reading_2',
                type: 'reading-comprehension',
                question: 'Lee el texto:',
                dialog: [
                    { speaker: 'Luis', text: 'Me llamo Luis. Soy médico y trabajo en Madrid.' },
                    { speaker: 'Luis', text: 'Tengo 35 años y soy de Barcelona.' }
                ],
                comprehensionCheck: {
                    question: '¿Cuál es la profesión de Luis?',
                    options: ['Médico', 'Profesor', 'Ingeniero', 'Estudiante'],
                    correctAnswer: 'Médico'
                },
                concept: 'reading',
                difficulty: 2
            }
        ];
    }

    /**
     * Generate practical application practice
     */
    generatePracticalPractice() {
        return [
            {
                id: 'practice_practical_1',
                type: 'fill-blank',
                question: 'Presentación: Me ____ Ana, ____ de España y ____ 25 años.',
                correctAnswer: 'llamo soy tengo',
                concept: 'practical',
                difficulty: 2
            },
            {
                id: 'practice_practical_2',
                type: 'fill-blank',
                question: 'Completa: ____ estudiante y ____ en la universidad.',
                correctAnswer: 'Soy estoy',
                alternateAnswers: ['soy trabajo'],
                concept: 'practical',
                difficulty: 2
            },
            {
                id: 'practice_practical_3',
                type: 'multiple-choice',
                question: '¿Cómo respondes a "¿Cómo estás?"?',
                options: ['Estoy bien, gracias', 'Soy bien, gracias', 'Tengo bien, gracias', 'Hay bien, gracias'],
                correctAnswer: 'Estoy bien, gracias',
                concept: 'practical',
                difficulty: 1
            }
        ];
    }

    /**
     * Generate mixed exercises to reinforce multiple concepts
     */
    generateMixedExercises(weakAreas) {
        const concepts = weakAreas.map(w => w.concept);

        return [
            {
                id: 'practice_mixed_1',
                type: 'fill-blank',
                question: '¿De dónde ____ tú? - ____ de México.',
                correctAnswer: 'eres Soy',
                concept: 'mixed',
                difficulty: 2
            },
            {
                id: 'practice_mixed_2',
                type: 'fill-blank',
                question: 'Yo ____ médico y ____ 35 años.',
                correctAnswer: 'soy tengo',
                concept: 'mixed',
                difficulty: 2
            },
            {
                id: 'practice_mixed_3',
                type: 'fill-blank',
                question: 'Nosotros ____ cansados porque ____ mucho trabajo.',
                correctAnswer: 'estamos tenemos',
                concept: 'mixed',
                difficulty: 3
            }
        ];
    }

    /**
     * Get exercises from existing units that match weak areas
     */
    getRelevantExercisesFromUnits(weakArea, count = 10) {
        const unitMapping = {
            'vocabulary': [1, 6],
            'ser_estar': [2, 3, 4],
            'tener': [5],
            'reading': [1, 2, 3, 4, 5, 6, 7],
            'practical': [7]
        };

        const units = unitMapping[weakArea.concept] || [];
        const relevantExercises = [];

        units.forEach(unitNum => {
            const unit = window.getUnit ? window.getUnit(unitNum) : null;
            if (unit && unit.exercises) {
                // Filter exercises by concept if possible
                const filtered = unit.exercises.filter(ex => {
                    if (ex.concept && ex.concept.includes(weakArea.concept)) {
                        return true;
                    }
                    // Also include exercises that haven't been mastered
                    return this.needsPractice(ex.id);
                });

                relevantExercises.push(...filtered);
            }
        });

        // Shuffle and return requested count
        const shuffled = this.shuffleArray(relevantExercises);
        return shuffled.slice(0, count);
    }

    /**
     * Check if exercise needs practice (based on history)
     */
    needsPractice(exerciseId) {
        // Check if exercise was answered incorrectly recently
        const history = this.loadPracticeHistory();
        const recentAttempts = history
            .filter(h => h.exerciseId === exerciseId)
            .slice(-3); // Last 3 attempts

        if (recentAttempts.length === 0) return true; // Never attempted

        const correctAttempts = recentAttempts.filter(h => h.correct).length;
        return correctAttempts < 2; // Needs practice if less than 2 correct
    }

    /**
     * Track practice session progress
     */
    trackPracticeProgress(exerciseId, isCorrect, timeSpent) {
        const history = this.loadPracticeHistory();

        history.push({
            exerciseId,
            correct: isCorrect,
            timestamp: new Date().toISOString(),
            timeSpent
        });

        // Keep only last 1000 attempts
        if (history.length > 1000) {
            history.shift();
        }

        this.savePracticeHistory(history);
    }

    /**
     * Get practice recommendations
     */
    getRecommendations(testResults) {
        const recommendations = [];

        testResults.recommendations.forEach(rec => {
            if (rec.type === 'practice' && rec.units) {
                recommendations.push({
                    title: rec.message,
                    units: rec.units,
                    practiceCount: rec.practiceExercises || 15,
                    action: rec.action
                });
            }
        });

        return recommendations;
    }

    /**
     * Shuffle array (Fisher-Yates algorithm)
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Load practice history from localStorage
     */
    loadPracticeHistory() {
        try {
            return JSON.parse(localStorage.getItem('adaptive-practice-history') || '[]');
        } catch (error) {
            window.Logger?.error('Error loading practice history:', error);
            return [];
        }
    }

    /**
     * Save practice history to localStorage
     */
    savePracticeHistory(history) {
        try {
            localStorage.setItem('adaptive-practice-history', JSON.stringify(history));
        } catch (error) {
            window.Logger?.error('Error saving practice history:', error);
        }
    }
}

// Make available globally
window.AdaptivePracticeSystem = AdaptivePracticeSystem;
