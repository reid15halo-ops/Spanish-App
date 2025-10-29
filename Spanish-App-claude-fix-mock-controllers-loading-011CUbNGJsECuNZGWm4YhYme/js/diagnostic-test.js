/**
 * Diagnostic Test System
 * Pure diagnostic test with 20-40 exercises across all tenses
 * NO points, NO goals - only analysis and recommendations
 * ASCII-compliant, No-Gamification
 */

class DiagnosticTest {
    constructor(conjugator) {
        this.conjugator = conjugator;
        
        // Tense categories for testing
        this.tenseCategories = {
            'presente': {
                name: 'Presente',
                nameDE: 'Gegenwart',
                weight: 2
            },
            'preterito': {
                name: 'PretÈrito',
                nameDE: 'Einfache Vergangenheit',
                weight: 2
            },
            'imperfecto': {
                name: 'Imperfecto',
                nameDE: 'Unvollendete Vergangenheit',
                weight: 2
            },
            'perfecto': {
                name: 'PretÈrito Perfecto',
                nameDE: 'Vollendete Gegenwart',
                weight: 1
            },
            'pluscuamperfecto': {
                name: 'Pluscuamperfecto',
                nameDE: 'Vorvergangenheit',
                weight: 1
            },
            'futuro': {
                name: 'Futuro',
                nameDE: 'Zukunft',
                weight: 1
            },
            'condicional': {
                name: 'Condicional',
                nameDE: 'Konditional',
                weight: 1
            }
        };

        // Error categories
        this.errorCategories = {
            'stem': 'Stammbildung',
            'ending': 'Endungen',
            'auxiliary': 'Hilfsverb',
            'irregular': 'Unregelmaessige Form',
            'accent': 'Akzent',
            'spelling': 'Rechtschreibung'
        };

        this.results = null;
    }

    /**
     * Generate diagnostic test with 20-40 exercises
     */
    generateTest(count = 30) {
        const exercises = [];
        const tenses = Object.keys(this.tenseCategories);
        
        // Calculate exercises per tense based on weight
        const totalWeight = Object.values(this.tenseCategories)
            .reduce((sum, cat) => sum + cat.weight, 0);
        
        const exercisesPerTense = {};
        tenses.forEach(tense => {
            const weight = this.tenseCategories[tense].weight;
            exercisesPerTense[tense] = Math.round((weight / totalWeight) * count);
        });

        // Adjust to exact count
        const actualTotal = Object.values(exercisesPerTense).reduce((a, b) => a + b, 0);
        if (actualTotal < count) {
            exercisesPerTense['presente'] += (count - actualTotal);
        }

        // Generate exercises for each tense
        let id = 1;
        tenses.forEach(tense => {
            const numExercises = exercisesPerTense[tense];
            
            for (let i = 0; i < numExercises; i++) {
                const exercise = this.createExercise(id, tense);
                if (exercise) {
                    exercises.push(exercise);
                    id++;
                }
            }
        });

        return exercises.slice(0, count); // Ensure exact count
    }

    /**
     * Create single exercise
     */
    createExercise(id, tense) {
        const verbs = [
            'hablar', 'comer', 'vivir', 'ser', 'estar', 'tener', 'hacer',
            'poder', 'decir', 'ir', 'ver', 'dar', 'saber', 'querer',
            'venir', 'salir', 'poner', 'traer'
        ];
        
        const personas = ['yo', 'tu', 'el', 'nosotros', 'vosotros', 'ellos'];
        
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const persona = personas[Math.floor(Math.random() * personas.length)];

        try {
            const answer = this.conjugator.conjugate(verb, tense, persona);
            const verbData = this.conjugator.getVerb(verb);

            return {
                id: id,
                verb: verb,
                verbData: verbData,
                tense: tense,
                tenseName: this.tenseCategories[tense].name,
                tenseNameDE: this.tenseCategories[tense].nameDE,
                persona: persona,
                answer: answer,
                question: `${verb} (${this.tenseCategories[tense].nameDE}, ${persona})`,
                userAnswer: null,
                isCorrect: null,
                errors: []
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * Validate test answers
     */
    validateTest(exercises, userAnswers) {
        const results = {
            timestamp: new Date().toISOString(),
            totalExercises: exercises.length,
            correct: 0,
            incorrect: 0,
            byTense: {},
            byErrorCategory: {},
            exercises: []
        };

        // Initialize tense results
        Object.keys(this.tenseCategories).forEach(tense => {
            results.byTense[tense] = {
                total: 0,
                correct: 0,
                incorrect: 0,
                errors: []
            };
        });

        // Initialize error category results
        Object.keys(this.errorCategories).forEach(category => {
            results.byErrorCategory[category] = {
                count: 0,
                tenses: {}
            };
        });

        // Validate each exercise
        exercises.forEach((exercise, index) => {
            const userAnswer = userAnswers[index];
            const correctAnswer = exercise.answer;

            const validation = this.validateAnswer(
                userAnswer,
                correctAnswer,
                exercise
            );

            exercise.userAnswer = userAnswer;
            exercise.isCorrect = validation.correct;
            exercise.errors = validation.errors;

            results.exercises.push({
                id: exercise.id,
                verb: exercise.verb,
                tense: exercise.tense,
                tenseName: exercise.tenseName,
                persona: exercise.persona,
                userAnswer: userAnswer,
                correctAnswer: correctAnswer,
                isCorrect: validation.correct,
                errors: validation.errors
            });

            // Update counts
            if (validation.correct) {
                results.correct++;
                results.byTense[exercise.tense].correct++;
            } else {
                results.incorrect++;
                results.byTense[exercise.tense].incorrect++;
                
                // Categorize errors
                validation.errors.forEach(error => {
                    results.byTense[exercise.tense].errors.push(error);
                    
                    if (!results.byErrorCategory[error.category].tenses[exercise.tense]) {
                        results.byErrorCategory[error.category].tenses[exercise.tense] = 0;
                    }
                    results.byErrorCategory[error.category].count++;
                    results.byErrorCategory[error.category].tenses[exercise.tense]++;
                });
            }

            results.byTense[exercise.tense].total++;
        });

        this.results = results;
        return results;
    }

    /**
     * Validate single answer
     */
    validateAnswer(userAnswer, correctAnswer, exercise) {
        const result = {
            correct: false,
            errors: []
        };

        if (!userAnswer || userAnswer.trim() === '') {
            result.errors.push({
                category: 'spelling',
                message: 'Keine Antwort gegeben',
                severity: 'high'
            });
            return result;
        }

        const userNorm = userAnswer.toLowerCase().trim();
        const correctNorm = correctAnswer.toLowerCase().trim();

        // Exact match
        if (userNorm === correctNorm) {
            result.correct = true;
            return result;
        }

        // Analyze errors
        const errors = this.analyzeErrors(userNorm, correctNorm, exercise);
        result.errors = errors;

        return result;
    }

    /**
     * Analyze errors in detail
     */
    analyzeErrors(userAnswer, correctAnswer, exercise) {
        const errors = [];

        // Check for compound tense errors (auxiliary)
        if (exercise.tense === 'perfecto' || exercise.tense === 'pluscuamperfecto') {
            const userParts = userAnswer.split(' ');
            const correctParts = correctAnswer.split(' ');

            if (userParts.length !== correctParts.length) {
                errors.push({
                    category: 'auxiliary',
                    message: 'Zusammengesetzte Zeit: Hilfsverb fehlt oder falsch',
                    severity: 'high',
                    detail: `Erwartete: ${correctParts[0]} (haber)`
                });
            } else if (userParts[0] !== correctParts[0]) {
                errors.push({
                    category: 'auxiliary',
                    message: 'Hilfsverb "haber" falsch konjugiert',
                    severity: 'high',
                    detail: `Erwartete: ${correctParts[0]}, Deine: ${userParts[0]}`
                });
            }

            if (userParts.length > 1 && correctParts.length > 1 && userParts[1] !== correctParts[1]) {
                errors.push({
                    category: 'irregular',
                    message: 'Participio falsch',
                    severity: 'medium',
                    detail: `Erwartete: ${correctParts[1]}, Deine: ${userParts[1]}`
                });
            }

            return errors;
        }

        // Check for irregular verb
        if (exercise.verbData?.clase === 'irregular') {
            errors.push({
                category: 'irregular',
                message: 'Unregelmaessige Form nicht korrekt',
                severity: 'high',
                detail: `${exercise.verb} ist unregelmaessig in ${exercise.tenseName}`
            });
            return errors;
        }

        // Analyze stem and ending
        const verbClass = exercise.verbData?.clase || '-ar';
        const stem = this.getStem(exercise.verb, verbClass);
        const expectedEnding = correctAnswer.substring(stem.length);
        const userStem = userAnswer.substring(0, stem.length);
        const userEnding = userAnswer.substring(stem.length);

        // Check stem
        if (userStem !== stem) {
            errors.push({
                category: 'stem',
                message: 'Stamm falsch',
                severity: 'high',
                detail: `Erwarteter Stamm: "${stem}", Deine: "${userStem}"`
            });
        }

        // Check ending
        if (userEnding !== expectedEnding) {
            errors.push({
                category: 'ending',
                message: `Endung falsch fuer ${exercise.tenseName}`,
                severity: 'high',
                detail: `Erwartete Endung: "${expectedEnding}", Deine: "${userEnding}"`
            });
        }

        // Check for accent errors
        const userNoAccents = this.removeAccents(userAnswer);
        const correctNoAccents = this.removeAccents(correctAnswer);

        if (userNoAccents === correctNoAccents && userAnswer !== correctAnswer) {
            errors.push({
                category: 'accent',
                message: 'Akzent fehlt oder falsch',
                severity: 'low',
                detail: 'Rechtschreibung korrekt, aber Akzent fehlt'
            });
        }

        // If no specific error found, mark as spelling
        if (errors.length === 0) {
            errors.push({
                category: 'spelling',
                message: 'Rechtschreibfehler',
                severity: 'medium',
                detail: `Erwartete: "${correctAnswer}", Deine: "${userAnswer}"`
            });
        }

        return errors;
    }

    /**
     * Generate recommendations based on results
     */
    generateRecommendations() {
        if (!this.results) {
            throw new Error('No test results available. Run validateTest first.');
        }

        const recommendations = [];

        // Analyze each tense
        Object.keys(this.results.byTense).forEach(tense => {
            const tenseResults = this.results.byTense[tense];
            
            if (tenseResults.total === 0) return;

            const errorRate = (tenseResults.incorrect / tenseResults.total) * 100;

            if (errorRate >= 50) {
                recommendations.push({
                    priority: 'high',
                    tense: tense,
                    tenseName: this.tenseCategories[tense].nameDE,
                    message: `Uebe ${this.tenseCategories[tense].nameDE}`,
                    detail: `Fehlerrate: ${errorRate.toFixed(0)}% (${tenseResults.incorrect}/${tenseResults.total})`,
                    focus: this.getTopErrors(tenseResults.errors),
                    exercises: this.generateExerciseList(tense, tenseResults.errors)
                });
            } else if (errorRate >= 30) {
                recommendations.push({
                    priority: 'medium',
                    tense: tense,
                    tenseName: this.tenseCategories[tense].nameDE,
                    message: `Wiederhole ${this.tenseCategories[tense].nameDE}`,
                    detail: `Fehlerrate: ${errorRate.toFixed(0)}% (${tenseResults.incorrect}/${tenseResults.total})`,
                    focus: this.getTopErrors(tenseResults.errors),
                    exercises: this.generateExerciseList(tense, tenseResults.errors)
                });
            }
        });

        // Analyze error categories
        Object.keys(this.results.byErrorCategory).forEach(category => {
            const categoryResults = this.results.byErrorCategory[category];
            
            if (categoryResults.count >= 3) {
                const affectedTenses = Object.keys(categoryResults.tenses)
                    .filter(t => categoryResults.tenses[t] > 0)
                    .map(t => this.tenseCategories[t].nameDE);

                recommendations.push({
                    priority: categoryResults.count >= 5 ? 'high' : 'medium',
                    category: category,
                    categoryName: this.errorCategories[category],
                    message: `Fokus: ${this.errorCategories[category]}`,
                    detail: `${categoryResults.count} Fehler in: ${affectedTenses.join(', ')}`,
                    focus: [this.errorCategories[category]],
                    exercises: this.generateCategoryExercises(category, categoryResults)
                });
            }
        });

        // Sort by priority
        recommendations.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        return recommendations;
    }

    /**
     * Get top error types for a tense
     */
    getTopErrors(errors) {
        const errorCounts = {};
        
        errors.forEach(error => {
            errorCounts[error.category] = (errorCounts[error.category] || 0) + 1;
        });

        return Object.entries(errorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([category, count]) => `${this.errorCategories[category]} (${count}x)`);
    }

    /**
     * Generate exercise list for recommendations
     */
    generateExerciseList(tense, errors) {
        const exercises = [];
        const errorCategories = [...new Set(errors.map(e => e.category))];

        // Generate specific exercises based on error types
        errorCategories.forEach(category => {
            switch (category) {
                case 'ending':
                    exercises.push(`Uebe ${this.tenseCategories[tense].nameDE} Endungen`);
                    break;
                case 'stem':
                    exercises.push(`Stammvokal‰nderungen in ${this.tenseCategories[tense].nameDE}`);
                    break;
                case 'auxiliary':
                    exercises.push(`Hilfsverb "haber" in ${this.tenseCategories[tense].nameDE}`);
                    break;
                case 'irregular':
                    exercises.push(`Unregelmaessige Verben in ${this.tenseCategories[tense].nameDE}`);
                    break;
                case 'accent':
                    exercises.push(`Akzentsetzung in ${this.tenseCategories[tense].nameDE}`);
                    break;
            }
        });

        return exercises;
    }

    /**
     * Generate category-specific exercises
     */
    generateCategoryExercises(category, categoryResults) {
        const exercises = [];
        const affectedTenses = Object.keys(categoryResults.tenses)
            .filter(t => categoryResults.tenses[t] > 0);

        switch (category) {
            case 'ending':
                affectedTenses.forEach(tense => {
                    exercises.push(`Endungen ${this.tenseCategories[tense].nameDE}`);
                });
                break;
            case 'stem':
                exercises.push('Stammvokal‰nderungen e>ie, o>ue, e>i');
                break;
            case 'auxiliary':
                exercises.push('Konjugation von "haber" in allen Zeiten');
                exercises.push('Bildung zusammengesetzter Zeiten');
                break;
            case 'irregular':
                exercises.push('Unregelmaessige Verben: ser, estar, ir, tener, hacer');
                break;
            case 'accent':
                exercises.push('Akzentregeln Spanisch');
                break;
        }

        return exercises;
    }

    /**
     * Create practice session from recommendations
     */
    createPracticeSession(recommendations, count = 20) {
        const exercises = [];
        let id = 1;

        // Create exercises for each high-priority recommendation
        recommendations
            .filter(rec => rec.priority === 'high')
            .forEach(rec => {
                const numExercises = Math.ceil(count / recommendations.length);
                
                for (let i = 0; i < numExercises && id <= count; i++) {
                    const exercise = rec.tense 
                        ? this.createExercise(id, rec.tense)
                        : this.createExerciseForCategory(id, rec.category);
                    
                    if (exercise) {
                        exercises.push(exercise);
                        id++;
                    }
                }
            });

        // Fill remaining with medium-priority
        recommendations
            .filter(rec => rec.priority === 'medium')
            .forEach(rec => {
                while (id <= count) {
                    const exercise = rec.tense 
                        ? this.createExercise(id, rec.tense)
                        : this.createExerciseForCategory(id, rec.category);
                    
                    if (exercise) {
                        exercises.push(exercise);
                        id++;
                    } else {
                        break;
                    }
                }
            });

        return exercises.slice(0, count);
    }

    /**
     * Create exercise for specific error category
     */
    createExerciseForCategory(id, category) {
        // Select appropriate tense and verb based on category
        let tense, verb;

        switch (category) {
            case 'auxiliary':
                tense = Math.random() > 0.5 ? 'perfecto' : 'pluscuamperfecto';
                verb = ['hablar', 'comer', 'vivir'][Math.floor(Math.random() * 3)];
                break;
            case 'irregular':
                tense = ['presente', 'preterito', 'futuro'][Math.floor(Math.random() * 3)];
                verb = ['ser', 'estar', 'ir', 'tener', 'hacer'][Math.floor(Math.random() * 5)];
                break;
            case 'stem':
                tense = 'presente';
                verb = ['querer', 'poder', 'venir', 'pensar'][Math.floor(Math.random() * 4)];
                break;
            default:
                tense = Object.keys(this.tenseCategories)[Math.floor(Math.random() * 7)];
                verb = ['hablar', 'comer', 'vivir'][Math.floor(Math.random() * 3)];
        }

        return this.createExercise(id, tense);
    }

    /**
     * Save report to file
     */
    saveReport(recommendations) {
        const report = {
            timestamp: this.results.timestamp,
            summary: {
                totalExercises: this.results.totalExercises,
                correct: this.results.correct,
                incorrect: this.results.incorrect,
                successRate: ((this.results.correct / this.results.totalExercises) * 100).toFixed(1) + '%'
            },
            byTense: this.results.byTense,
            byErrorCategory: this.results.byErrorCategory,
            recommendations: recommendations,
            exercises: this.results.exercises
        };

        return JSON.stringify(report, null, 2);
    }

    // Helper methods
    getStem(infinitivo, clase) {
        return infinitivo.slice(0, -2);
    }

    removeAccents(text) {
        return text
            .replace(/[·‡‰‚]/g, 'a')
            .replace(/[ÈËÎÍ]/g, 'e')
            .replace(/[ÌÏÔÓ]/g, 'i')
            .replace(/[ÛÚˆÙ]/g, 'o')
            .replace(/[˙˘¸˚]/g, 'u')
            .replace(/Ò/g, 'n');
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.DiagnosticTest = DiagnosticTest;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiagnosticTest;
}
