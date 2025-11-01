/**
 * Adaptive Practice System - TypeScript Version
 * Simplified migration with core functionality and types
 */

import type { Exercise } from './types';

interface WeakArea {
    concept: string;
    score?: number;
    [key: string]: any;
}

interface TestResults {
    testId: string;
    weakAreas: WeakArea[];
    recommendations: any[];
}

interface PracticeSession {
    id: string;
    basedOnTest: string;
    timestamp: string;
    weakAreas: WeakArea[];
    exercises: Exercise[];
}

interface PracticeAttempt {
    exerciseId: string;
    correct: boolean;
    timestamp: string;
    timeSpent?: number;
}

class AdaptivePracticeSystem {
    public generatePracticeSession(testResults: TestResults | null): PracticeSession | null {
        if (!testResults || !testResults.weakAreas) {
            return null;
        }

        const session: PracticeSession = {
            id: 'practice_' + Date.now(),
            basedOnTest: testResults.testId,
            timestamp: new Date().toISOString(),
            weakAreas: testResults.weakAreas,
            exercises: []
        };

        testResults.weakAreas.forEach(weakArea => {
            const exercises = this.generateExercisesForWeakArea(weakArea);
            session.exercises.push(...exercises);
        });

        const mixedExercises = this.generateMixedExercises(testResults.weakAreas);
        session.exercises.push(...mixedExercises);
        session.exercises = this.shuffleArray(session.exercises);

        return session;
    }

    private generateExercisesForWeakArea(weakArea: WeakArea): Exercise[] {
        const generators: Record<string, () => Exercise[]> = {
            'vocabulary': () => this.generateVocabularyPractice(),
            'ser_estar': () => this.generateSerEstarPractice(),
            'tener': () => this.generateTenerPractice(),
            'reading': () => this.generateReadingPractice(),
            'practical': () => this.generatePracticalPractice()
        };

        const generator = generators[weakArea.concept];
        return generator ? generator() : [];
    }

    private generateVocabularyPractice(): Exercise[] {
        return [
            { id: 'practice_vocab_1', type: 'fill-blank', question: 'Hola!', correctAnswer: 'Hola', concept: 'vocabulary', difficulty: 1 }
        ];
    }

    private generateSerEstarPractice(): Exercise[] {
        return [
            { id: 'practice_ser_estar_1', type: 'fill-blank', question: 'Maria es profesora.', correctAnswer: 'es', concept: 'ser_estar', difficulty: 2 }
        ];
    }

    private generateTenerPractice(): Exercise[] {
        return [
            { id: 'practice_tener_1', type: 'fill-blank', question: 'Yo tengo 30 años.', correctAnswer: 'tengo', concept: 'tener', difficulty: 1 }
        ];
    }

    private generateReadingPractice(): Exercise[] {
        return [
            { id: 'practice_reading_1', type: 'reading-comprehension', concept: 'reading', difficulty: 2 }
        ];
    }

    private generatePracticalPractice(): Exercise[] {
        return [
            { id: 'practice_practical_1', type: 'fill-blank', concept: 'practical', difficulty: 2 }
        ];
    }

    private generateMixedExercises(weakAreas: WeakArea[]): Exercise[] {
        return [
            { id: 'practice_mixed_1', type: 'fill-blank', concept: 'mixed', difficulty: 2 }
        ];
    }

    public getRelevantExercisesFromUnits(weakArea: WeakArea, count = 10): Exercise[] {
        const unitMapping: Record<string, number[]> = {
            'vocabulary': [1, 6],
            'ser_estar': [2, 3, 4],
            'tener': [5],
            'reading': [1, 2, 3, 4, 5, 6, 7],
            'practical': [7]
        };

        const units = unitMapping[weakArea.concept] || [];
        const relevantExercises: Exercise[] = [];

        units.forEach(unitNum => {
            const unit = window.getUnit ? window.getUnit(unitNum) : null;
            if (unit && unit.exercises) {
                const filtered = unit.exercises.filter((ex: Exercise) => {
                    if (ex.concept && ex.concept.includes(weakArea.concept)) {
                        return true;
                    }
                    return this.needsPractice(ex.id || '');
                });
                relevantExercises.push(...filtered);
            }
        });

        return this.shuffleArray(relevantExercises).slice(0, count);
    }

    private needsPractice(exerciseId: string): boolean {
        const history = this.loadPracticeHistory();
        const recentAttempts = history.filter(h => h.exerciseId === exerciseId).slice(-3);
        if (recentAttempts.length === 0) return true;
        const correctAttempts = recentAttempts.filter(h => h.correct).length;
        return correctAttempts < 2;
    }

    public trackPracticeProgress(exerciseId: string, isCorrect: boolean, timeSpent?: number): void {
        const history = this.loadPracticeHistory();
        history.push({ exerciseId, correct: isCorrect, timestamp: new Date().toISOString(), timeSpent });
        if (history.length > 1000) history.shift();
        this.savePracticeHistory(history);
    }

    public getRecommendations(testResults: TestResults): any[] {
        return testResults.recommendations.filter(r => r.type === 'practice').map(rec => ({
            title: rec.message,
            units: rec.units,
            practiceCount: rec.practiceExercises || 15,
            action: rec.action
        }));
    }

    private shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
        }
        return shuffled;
    }

    private loadPracticeHistory(): PracticeAttempt[] {
        try {
            return JSON.parse(localStorage.getItem('adaptive-practice-history') || '[]');
        } catch (error) {
            return [];
        }
    }

    private savePracticeHistory(history: PracticeAttempt[]): void {
        try {
            localStorage.setItem('adaptive-practice-history', JSON.stringify(history));
        } catch (error) {
            console.error('Error saving practice history:', error);
        }
    }
}

window.AdaptivePracticeSystem = AdaptivePracticeSystem;
