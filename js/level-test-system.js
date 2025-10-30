/**
 * Level Test System
 *
 * Comprehensive testing system for assessing learner proficiency:
 * - A1 Level Test (after Unit 7)
 * - A2 Level Test (future)
 * - B1 Level Test (future)
 * - B2 Level Test (future)
 *
 * Features:
 * - Analyzes weak areas
 * - Provides detailed feedback
 * - Generates personalized practice recommendations
 */

class LevelTestSystem {
    constructor() {
        this.currentTest = null;
        this.testResults = {};
        this.weakAreas = [];
    }

    /**
     * Get appropriate level test based on completed units
     */
    getRecommendedTest() {
        // Check which units have been completed
        const progress = this.loadProgress();

        if (progress && progress.completedUnits && progress.completedUnits.includes(7)) {
            return 'A1';
        }

        return null; // No test recommended yet
    }

    /**
     * Generate A1 Level Test - COMPLETAMENTE EN ESPAÑOL
     */
    generateA1Test() {
        return {
            level: 'A1',
            title: 'Examen de Nivel A1',
            description: 'Evaluación completa del nivel A1',
            timeLimit: 30, // minutes
            passingScore: 70, // percentage
            fullSpanish: true, // NO German help available
            sections: [
                {
                    id: 'vocabulary',
                    name: 'Vocabulario',
                    weight: 25,
                    exercises: this.generateVocabularyTestExercises()
                },
                {
                    id: 'ser_estar',
                    name: 'SER vs ESTAR',
                    weight: 25,
                    exercises: this.generateSerEstarTestExercises()
                },
                {
                    id: 'tener',
                    name: 'Verbo TENER',
                    weight: 15,
                    exercises: this.generateTenerTestExercises()
                },
                {
                    id: 'reading',
                    name: 'Comprensión Lectora',
                    weight: 20,
                    exercises: this.generateReadingTestExercises()
                },
                {
                    id: 'practical',
                    name: 'Aplicación Práctica',
                    weight: 15,
                    exercises: this.generatePracticalTestExercises()
                }
            ]
        };
    }

    /**
     * Generate vocabulary test exercises - EN ESPAÑOL
     */
    generateVocabularyTestExercises() {
        return [
            {
                id: 'test_vocab_1',
                type: 'multiple-choice',
                question: '¿Cómo te llamas?',
                options: ['Me llamo Juan', 'Estoy bien', 'Tengo 25 años', 'Soy de España'],
                correctAnswer: 'Me llamo Juan',
                concept: 'greetings'
            },
            {
                id: 'test_vocab_2',
                type: 'fill-blank',
                question: 'Hola, ____ Juan. Mucho gusto.',
                correctAnswer: 'soy',
                alternateAnswers: ['me llamo'],
                concept: 'introductions'
            },
            {
                id: 'test_vocab_3',
                type: 'multiple-choice',
                question: '¿De dónde eres?',
                options: ['Soy de México', 'Soy médico', 'Tengo hambre', 'Estoy cansado'],
                correctAnswer: 'Soy de México',
                concept: 'origin'
            },
            {
                id: 'test_vocab_4',
                type: 'fill-blank',
                question: '¿Cuál es tu ____? - Soy ingeniero.',
                correctAnswer: 'profesión',
                alternateAnswers: ['trabajo', 'ocupación'],
                concept: 'professions'
            },
            {
                id: 'test_vocab_5',
                type: 'multiple-choice',
                question: '¿Qué significa "adiós"?',
                options: ['Despedida', 'Saludo', 'Pregunta', 'Nombre'],
                correctAnswer: 'Despedida',
                concept: 'vocabulary'
            }
        ];
    }

    /**
     * Generate SER vs ESTAR test exercises - EN ESPAÑOL
     */
    generateSerEstarTestExercises() {
        return [
            {
                id: 'test_ser_estar_1',
                type: 'fill-blank',
                question: 'Yo ____ médico.',
                correctAnswer: 'soy',
                concept: 'ser_profession'
            },
            {
                id: 'test_ser_estar_2',
                type: 'fill-blank',
                question: 'Yo ____ cansado.',
                correctAnswer: 'estoy',
                concept: 'estar_state'
            },
            {
                id: 'test_ser_estar_3',
                type: 'fill-blank',
                question: 'La mesa ____ en la cocina.',
                correctAnswer: 'está',
                concept: 'estar_location'
            },
            {
                id: 'test_ser_estar_4',
                type: 'multiple-choice',
                question: 'Mi hermano ____ inteligente.',
                options: ['es', 'está'],
                correctAnswer: 'es',
                concept: 'ser_characteristics'
            },
            {
                id: 'test_ser_estar_5',
                type: 'multiple-choice',
                question: 'El café ____ frío ahora.',
                options: ['es', 'está'],
                correctAnswer: 'está',
                concept: 'estar_temporary'
            },
            {
                id: 'test_ser_estar_6',
                type: 'fill-blank',
                question: '¿De dónde ____ tú?',
                correctAnswer: 'eres',
                concept: 'ser_origin'
            },
            {
                id: 'test_ser_estar_7',
                type: 'fill-blank',
                question: 'Nosotros ____ en casa.',
                correctAnswer: 'estamos',
                concept: 'estar_location'
            }
        ];
    }

    /**
     * Generate TENER test exercises - EN ESPAÑOL
     */
    generateTenerTestExercises() {
        return [
            {
                id: 'test_tener_1',
                type: 'fill-blank',
                question: 'Yo ____ 25 años.',
                correctAnswer: 'tengo',
                concept: 'tener_age'
            },
            {
                id: 'test_tener_2',
                type: 'fill-blank',
                question: '____ hambre y necesito comer.',
                correctAnswer: 'Tengo',
                concept: 'tener_expressions'
            },
            {
                id: 'test_tener_3',
                type: 'fill-blank',
                question: '¿____ tú un coche?',
                correctAnswer: 'Tienes',
                concept: 'tener_possession'
            },
            {
                id: 'test_tener_4',
                type: 'multiple-choice',
                question: 'Ellos ____ dos hijos.',
                options: ['tienen', 'son', 'están', 'tenemos'],
                correctAnswer: 'tienen',
                concept: 'tener_possession'
            }
        ];
    }

    /**
     * Generate reading comprehension test exercises - EN ESPAÑOL
     */
    generateReadingTestExercises() {
        return [
            {
                id: 'test_reading_1',
                type: 'reading-comprehension',
                question: 'Lee el diálogo y responde:',
                dialog: [
                    { speaker: 'María', text: 'Hola, me llamo María. Soy de España y soy profesora.' },
                    { speaker: 'Pedro', text: 'Mucho gusto, María. Yo soy Pedro. Soy médico y soy de México.' }
                ],
                comprehensionCheck: {
                    question: '¿De dónde es María?',
                    options: ['España', 'México', 'Alemania', 'Italia'],
                    correctAnswer: 'España'
                },
                concept: 'reading_comprehension'
            },
            {
                id: 'test_reading_2',
                type: 'reading-comprehension',
                question: 'Lee el texto y responde:',
                dialog: [
                    { speaker: 'Juan', text: 'Estoy muy cansado hoy. Tengo mucho trabajo.' },
                    { speaker: 'Ana', text: '¿Por qué no descansas un poco?' }
                ],
                comprehensionCheck: {
                    question: '¿Cómo está Juan?',
                    options: ['Cansado', 'Feliz', 'Enfermo', 'Hambriento'],
                    correctAnswer: 'Cansado'
                },
                concept: 'reading_comprehension'
            }
        ];
    }

    /**
     * Generate practical application test exercises - EN ESPAÑOL
     */
    generatePracticalTestExercises() {
        return [
            {
                id: 'test_practical_1',
                type: 'fill-blank',
                question: 'Completa la presentación: Me ____ Ana, ____ de Colombia y ____ estudiante.',
                correctAnswer: 'llamo soy soy',
                alternateAnswers: ['llamo soy estoy'],
                concept: 'self_introduction'
            },
            {
                id: 'test_practical_2',
                type: 'fill-blank',
                question: '¿Cómo estás? - ____ muy bien, gracias.',
                correctAnswer: 'Estoy',
                concept: 'practical_conversation'
            },
            {
                id: 'test_practical_3',
                type: 'multiple-choice',
                question: 'Elige la respuesta correcta: ¿Cuántos años tienes?',
                options: ['Tengo 30 años', 'Soy 30 años', 'Estoy 30 años', 'Hay 30 años'],
                correctAnswer: 'Tengo 30 años',
                concept: 'practical_age'
            }
        ];
    }

    /**
     * Grade test results
     */
    gradeTest(testId, userAnswers) {
        const test = this.getTestById(testId);
        if (!test) {
            return { error: 'Test not found' };
        }

        const results = {
            testId,
            level: test.level,
            totalQuestions: 0,
            correctAnswers: 0,
            scorePercentage: 0,
            passed: false,
            sectionResults: [],
            weakAreas: [],
            strengths: [],
            recommendations: []
        };

        // Grade each section
        test.sections.forEach(section => {
            const sectionResult = {
                id: section.id,
                name: section.name,
                weight: section.weight,
                totalQuestions: section.exercises.length,
                correctAnswers: 0,
                percentage: 0,
                details: []
            };

            section.exercises.forEach(exercise => {
                const userAnswer = userAnswers[exercise.id];
                const isCorrect = this.checkAnswer(exercise, userAnswer);

                sectionResult.details.push({
                    exerciseId: exercise.id,
                    userAnswer,
                    correctAnswer: exercise.correctAnswer,
                    isCorrect,
                    concept: exercise.concept
                });

                if (isCorrect) {
                    sectionResult.correctAnswers++;
                    results.correctAnswers++;
                }

                results.totalQuestions++;
            });

            sectionResult.percentage = Math.round(
                (sectionResult.correctAnswers / sectionResult.totalQuestions) * 100
            );

            // Identify weak areas (< 60%)
            if (sectionResult.percentage < 60) {
                results.weakAreas.push({
                    section: section.name,
                    percentage: sectionResult.percentage,
                    concept: section.id
                });
            }

            // Identify strengths (>= 80%)
            if (sectionResult.percentage >= 80) {
                results.strengths.push(section.name);
            }

            results.sectionResults.push(sectionResult);
        });

        // Calculate overall score
        results.scorePercentage = Math.round(
            (results.correctAnswers / results.totalQuestions) * 100
        );

        results.passed = results.scorePercentage >= test.passingScore;

        // Generate recommendations
        results.recommendations = this.generateRecommendations(results);

        // Save results
        this.saveTestResults(results);

        return results;
    }

    /**
     * Check if answer is correct (using tolerant validation)
     */
    checkAnswer(exercise, userAnswer) {
        if (!userAnswer) return false;

        // Use TolerantAnswerValidator if available
        if (typeof window.TolerantAnswerValidator === 'function') {
            const validator = new window.TolerantAnswerValidator();
            const result = validator.validateAnswer(
                userAnswer,
                exercise.correctAnswer,
                exercise
            );
            return result.isCorrect;
        }

        // Fallback to simple comparison
        const normalize = (str) => String(str).toLowerCase().trim();
        return normalize(userAnswer) === normalize(exercise.correctAnswer);
    }

    /**
     * Generate personalized recommendations
     */
    generateRecommendations(results) {
        const recommendations = [];

        if (!results.passed) {
            recommendations.push({
                type: 'overall',
                message: `Du hast ${results.scorePercentage}% erreicht. Die Bestehensgrenze liegt bei 70%.`,
                action: 'Wiederhole die schwächeren Bereiche und versuche den Test erneut.'
            });
        } else {
            recommendations.push({
                type: 'overall',
                message: `Glückwunsch! Du hast ${results.scorePercentage}% erreicht und den Test bestanden!`,
                action: 'Du bist bereit für die nächste Stufe!'
            });
        }

        // Recommendations for weak areas
        results.weakAreas.forEach(area => {
            const recommendation = this.getRecommendationForWeakArea(area);
            recommendations.push(recommendation);
        });

        return recommendations;
    }

    /**
     * Get specific recommendation for weak area
     */
    getRecommendationForWeakArea(weakArea) {
        const recommendations = {
            'vocabulary': {
                type: 'practice',
                message: `Vokabular (${weakArea.percentage}%) braucht mehr Übung`,
                action: 'Wiederhole Unit 1 und Unit 6',
                units: [1, 6],
                practiceExercises: 20
            },
            'ser_estar': {
                type: 'practice',
                message: `SER vs ESTAR (${weakArea.percentage}%) braucht mehr Übung`,
                action: 'Wiederhole Units 2, 3 und 4',
                units: [2, 3, 4],
                practiceExercises: 30
            },
            'tener': {
                type: 'practice',
                message: `TENER (${weakArea.percentage}%) braucht mehr Übung`,
                action: 'Wiederhole Unit 5',
                units: [5],
                practiceExercises: 15
            },
            'reading': {
                type: 'practice',
                message: `Leseverständnis (${weakArea.percentage}%) braucht mehr Übung`,
                action: 'Übe mehr Lese-Übungen aus allen Units',
                units: [1, 2, 3, 4, 5, 6, 7],
                practiceExercises: 10
            },
            'practical': {
                type: 'practice',
                message: `Praktische Anwendung (${weakArea.percentage}%) braucht mehr Übung`,
                action: 'Wiederhole Unit 7 und übe freies Sprechen',
                units: [7],
                practiceExercises: 20
            }
        };

        return recommendations[weakArea.concept] || {
            type: 'practice',
            message: `${weakArea.section} braucht mehr Übung`,
            action: 'Wiederhole die entsprechenden Units',
            practiceExercises: 15
        };
    }

    /**
     * Get test by ID
     */
    getTestById(testId) {
        if (testId === 'A1' || testId === 'a1') {
            return this.generateA1Test();
        }
        // Future: A2, B1, B2 tests
        return null;
    }

    /**
     * Save test results
     */
    saveTestResults(results) {
        try {
            const key = `level-test-${results.testId}`;
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            existing.push({
                ...results,
                timestamp: new Date().toISOString()
            });

            // Keep only last 10 attempts
            if (existing.length > 10) {
                existing.shift();
            }

            localStorage.setItem(key, JSON.stringify(existing));
        } catch (error) {
            console.error('Error saving test results:', error);
        }
    }

    /**
     * Get test history
     */
    getTestHistory(testId) {
        try {
            const key = `level-test-${testId}`;
            return JSON.parse(localStorage.getItem(key) || '[]');
        } catch (error) {
            console.error('Error loading test history:', error);
            return [];
        }
    }

    /**
     * Load progress
     */
    loadProgress() {
        try {
            return JSON.parse(localStorage.getItem('spanish-app-progress') || '{}');
        } catch (error) {
            return {};
        }
    }
}

// Make available globally
window.LevelTestSystem = LevelTestSystem;
