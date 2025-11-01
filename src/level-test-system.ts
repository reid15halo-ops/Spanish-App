/**
 * Level Test System - TypeScript Version
 *
 * Comprehensive testing system for assessing learner proficiency
 * Simplified migration with core functionality
 */

import type { Exercise } from './types';

// ====================================================================
// TYPES & INTERFACES
// ====================================================================

interface Progress {
    completedUnits?: number[];
    [key: string]: any;
}

interface TestSection {
    id: string;
    name: string;
    weight: number;
    exercises: Exercise[];
}

interface LevelTest {
    level: string;
    title: string;
    description: string;
    timeLimit: number;
    passingScore: number;
    fullSpanish: boolean;
    sections: TestSection[];
}

interface SectionResult {
    sectionId: string;
    sectionName: string;
    totalQuestions: number;
    correctAnswers: number;
    percentage: number;
    weight: number;
    weightedScore: number;
}

interface WeakArea {
    section: string;
    concept: string;
    percentage: number;
    correctAnswers: number;
    totalQuestions: number;
}

interface TestResults {
    testId: string;
    level: string;
    timestamp: string;
    totalScore: number;
    maxScore: number;
    scorePercentage: number;
    passed: boolean;
    sectionResults: SectionResult[];
    weakAreas: WeakArea[];
    recommendations: Recommendation[];
}

interface Recommendation {
    type: string;
    message: string;
    action: string;
    units?: number[];
    practiceExercises?: number;
}

// ====================================================================
// LEVEL TEST SYSTEM
// ====================================================================

class LevelTestSystem {
    private currentTest: LevelTest | null = null;
    private testResults: Record<string, TestResults> = {};
    private weakAreas: WeakArea[] = [];

    /**
     * Get appropriate level test based on completed units
     */
    public getRecommendedTest(): string | null {
        const progress = this.loadProgress();

        if (progress && progress.completedUnits && progress.completedUnits.includes(7)) {
            return 'A1';
        }

        return null;
    }

    /**
     * Generate A1 Level Test - COMPLETAMENTE EN ESPAÑOL
     */
    public generateA1Test(): LevelTest {
        return {
            level: 'A1',
            title: 'Examen de Nivel A1',
            description: 'Evaluación completa del nivel A1',
            timeLimit: 30,
            passingScore: 70,
            fullSpanish: true,
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

    private generateVocabularyTestExercises(): Exercise[] {
        return [
            { id: 'test_vocab_1', type: 'multiple-choice', question: '¿Cómo te llamas?', options: ['Me llamo Juan'], correctAnswer: 'Me llamo Juan', concept: 'greetings' },
            { id: 'test_vocab_2', type: 'fill-blank', question: 'Hola, ____ Juan.', correctAnswer: 'soy', concept: 'introductions' }
        ];
    }

    private generateSerEstarTestExercises(): Exercise[] {
        return [
            { id: 'test_ser_estar_1', type: 'fill-blank', question: 'Yo ____ médico.', correctAnswer: 'soy', concept: 'ser_profession' },
            { id: 'test_ser_estar_2', type: 'fill-blank', question: 'Yo ____ cansado.', correctAnswer: 'estoy', concept: 'estar_state' }
        ];
    }

    private generateTenerTestExercises(): Exercise[] {
        return [
            { id: 'test_tener_1', type: 'fill-blank', question: 'Yo ____ 25 años.', correctAnswer: 'tengo', concept: 'tener_age' }
        ];
    }

    private generateReadingTestExercises(): Exercise[] {
        return [
            { id: 'test_reading_1', type: 'reading-comprehension', concept: 'reading' }
        ];
    }

    private generatePracticalTestExercises(): Exercise[] {
        return [
            { id: 'test_practical_1', type: 'fill-blank', concept: 'practical' }
        ];
    }

    /**
     * Analyze test results
     */
    public analyzeTestResults(test: LevelTest, userAnswers: Record<string, string>): TestResults {
        const sectionResults: SectionResult[] = [];
        let totalWeightedScore = 0;

        test.sections.forEach(section => {
            let correctAnswers = 0;
            const totalQuestions = section.exercises.length;

            section.exercises.forEach(exercise => {
                const userAnswer = userAnswers[exercise.id || ''];
                if (userAnswer && this.checkAnswer(exercise, userAnswer)) {
                    correctAnswers++;
                }
            });

            const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
            const weightedScore = (percentage / 100) * section.weight;

            sectionResults.push({
                sectionId: section.id,
                sectionName: section.name,
                totalQuestions,
                correctAnswers,
                percentage,
                weight: section.weight,
                weightedScore
            });

            totalWeightedScore += weightedScore;
        });

        const weakAreas = this.identifyWeakAreas(sectionResults);
        const passed = totalWeightedScore >= test.passingScore;

        const results: TestResults = {
            testId: test.level + '_' + Date.now(),
            level: test.level,
            timestamp: new Date().toISOString(),
            totalScore: totalWeightedScore,
            maxScore: 100,
            scorePercentage: totalWeightedScore,
            passed,
            sectionResults,
            weakAreas,
            recommendations: []
        };

        results.recommendations = this.generateRecommendations(results);

        this.testResults[results.testId] = results;
        this.saveTestResults();

        return results;
    }

    private checkAnswer(exercise: Exercise, userAnswer: string): boolean {
        if (window.TolerantAnswerValidator) {
            const validator = new window.TolerantAnswerValidator();
            const result = validator.validateAnswer(userAnswer, exercise.correctAnswer || '', exercise);
            return result.isCorrect;
        }

        const normalize = (str: string) => String(str).toLowerCase().trim();
        return normalize(userAnswer) === normalize(exercise.correctAnswer || '');
    }

    private identifyWeakAreas(sectionResults: SectionResult[]): WeakArea[] {
        return sectionResults
            .filter(section => section.percentage < 70)
            .map(section => ({
                section: section.sectionName,
                concept: section.sectionId,
                percentage: section.percentage,
                correctAnswers: section.correctAnswers,
                totalQuestions: section.totalQuestions
            }));
    }

    public generateRecommendations(results: TestResults): Recommendation[] {
        const recommendations: Recommendation[] = [];

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

        results.weakAreas.forEach(area => {
            const recommendation = this.getRecommendationForWeakArea(area);
            recommendations.push(recommendation);
        });

        return recommendations;
    }

    private getRecommendationForWeakArea(weakArea: WeakArea): Recommendation {
        const recommendations: Record<string, Recommendation> = {
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
            }
        };

        return recommendations[weakArea.concept] || {
            type: 'practice',
            message: `${weakArea.section} braucht mehr Übung`,
            action: 'Wiederhole die entsprechenden Units',
            practiceExercises: 15
        };
    }

    public getTestById(testId: string): LevelTest | null {
        if (testId === 'A1' || testId === 'a1') {
            return this.generateA1Test();
        }
        return null;
    }

    private loadProgress(): Progress {
        try {
            return JSON.parse(localStorage.getItem('progress') || '{}');
        } catch (error) {
            return {};
        }
    }

    private saveTestResults(): void {
        try {
            localStorage.setItem('test-results', JSON.stringify(this.testResults));
        } catch (error) {
            console.error('Failed to save test results:', error);
        }
    }

    public loadTestResults(): void {
        try {
            const saved = localStorage.getItem('test-results');
            if (saved) {
                this.testResults = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Failed to load test results:', error);
        }
    }
}

window.LevelTestSystem = LevelTestSystem;
