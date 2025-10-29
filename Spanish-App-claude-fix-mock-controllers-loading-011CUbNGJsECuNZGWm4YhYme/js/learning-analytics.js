/**
 * Learning Analytics System
 *
 * Comprehensive analytics and insights for learning performance:
 * - Progress tracking over time
 * - Learning velocity analysis
 * - Strength/weakness identification
 * - Predictive modeling for mastery
 * - Personalized recommendations
 * - Visual data preparation
 */

class LearningAnalytics {
    constructor() {
        this.sessionHistory = [];
        this.performanceHistory = {};
        this.milestones = [];

        // Learning velocity tracking
        this.velocityWindow = 7; // days

        // Prediction models
        this.masteryPrediction = {
            minDataPoints: 10,
            confidenceThreshold: 0.70
        };
    }

    /**
     * Record session for analytics
     */
    recordSession(sessionData) {
        const session = {
            timestamp: Date.now(),
            duration: sessionData.duration || 0,
            exercisesCompleted: sessionData.exercisesCompleted || 0,
            correctAnswers: sessionData.correctAnswers || 0,
            accuracy: sessionData.accuracy || 0,
            concepts: sessionData.concepts || [],
            avgResponseTime: sessionData.avgResponseTime || 0,
            errors: sessionData.errors || []
        };

        this.sessionHistory.push(session);

        // Keep only last 100 sessions
        if (this.sessionHistory.length > 100) {
            this.sessionHistory = this.sessionHistory.slice(-100);
        }

        // Update performance history
        this.updatePerformanceHistory(session);

        // Check for milestones
        this.checkMilestones(session);

        this.save();
    }

    /**
     * Update performance history by concept
     */
    updatePerformanceHistory(session) {
        session.concepts.forEach(concept => {
            if (!this.performanceHistory[concept.name]) {
                this.performanceHistory[concept.name] = {
                    name: concept.name,
                    dataPoints: []
                };
            }

            this.performanceHistory[concept.name].dataPoints.push({
                timestamp: session.timestamp,
                accuracy: concept.accuracy || 0,
                attempts: concept.attempts || 0,
                avgResponseTime: concept.avgResponseTime || 0
            });

            // Keep only last 50 data points per concept
            const history = this.performanceHistory[concept.name].dataPoints;
            if (history.length > 50) {
                this.performanceHistory[concept.name].dataPoints = history.slice(-50);
            }
        });
    }

    /**
     * Get learning velocity (progress rate)
     */
    getLearningVelocity() {
        if (this.sessionHistory.length < 2) {
            return { velocity: 0, trend: 'insufficient-data' };
        }

        const now = Date.now();
        const windowMs = this.velocityWindow * 24 * 60 * 60 * 1000;
        const recentSessions = this.sessionHistory.filter(
            s => now - s.timestamp < windowMs
        );

        if (recentSessions.length < 2) {
            return { velocity: 0, trend: 'insufficient-data' };
        }

        // Calculate metrics
        const totalExercises = recentSessions.reduce((sum, s) => sum + s.exercisesCompleted, 0);
        const avgAccuracy = recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length;
        const totalDuration = recentSessions.reduce((sum, s) => sum + s.duration, 0);

        // Learning velocity = (exercises * accuracy) / time
        const velocity = (totalExercises * avgAccuracy) / (totalDuration / (1000 * 60)); // per minute

        // Determine trend (compare to previous window)
        const previousWindowStart = now - (2 * windowMs);
        const previousSessions = this.sessionHistory.filter(
            s => s.timestamp >= previousWindowStart && s.timestamp < (now - windowMs)
        );

        let trend = 'stable';
        if (previousSessions.length >= 2) {
            const prevTotalExercises = previousSessions.reduce((sum, s) => sum + s.exercisesCompleted, 0);
            const prevAvgAccuracy = previousSessions.reduce((sum, s) => sum + s.accuracy, 0) / previousSessions.length;
            const prevTotalDuration = previousSessions.reduce((sum, s) => sum + s.duration, 0);
            const prevVelocity = (prevTotalExercises * prevAvgAccuracy) / (prevTotalDuration / (1000 * 60));

            if (velocity > prevVelocity * 1.1) {
                trend = 'improving';
            } else if (velocity < prevVelocity * 0.9) {
                trend = 'declining';
            }
        }

        return {
            velocity: velocity,
            trend: trend,
            sessionsPerWeek: recentSessions.length,
            avgAccuracy: avgAccuracy,
            totalExercises: totalExercises
        };
    }

    /**
     * Analyze strengths and weaknesses
     */
    analyzeStrengthsWeaknesses(knowledgeTracker) {
        const analysis = {
            strengths: [],
            weaknesses: [],
            recommendations: []
        };

        if (!knowledgeTracker) return analysis;

        // Analyze vocabulary
        const vocabSummary = knowledgeTracker.getTypeStats(knowledgeTracker.vocabularyKnowledge);
        if (vocabSummary.averageAccuracy >= 0.80) {
            analysis.strengths.push({
                area: 'Vokabular',
                level: 'strong',
                accuracy: vocabSummary.averageAccuracy,
                message: 'Dein Vokabular-Wissen ist sehr gut!'
            });
        } else if (vocabSummary.averageAccuracy < 0.60) {
            analysis.weaknesses.push({
                area: 'Vokabular',
                level: 'weak',
                accuracy: vocabSummary.averageAccuracy,
                message: 'Vokabeln brauchen mehr Übung.'
            });
            analysis.recommendations.push({
                type: 'practice',
                area: 'vocabulary',
                message: 'Übe täglich 10-15 Vokabeln mit Karteikarten.'
            });
        }

        // Analyze grammar
        const grammarSummary = knowledgeTracker.getTypeStats(knowledgeTracker.grammarKnowledge);
        if (grammarSummary.averageAccuracy >= 0.75) {
            analysis.strengths.push({
                area: 'Grammatik',
                level: 'strong',
                accuracy: grammarSummary.averageAccuracy,
                message: 'Deine Grammatik-Kenntnisse sind solide!'
            });
        } else if (grammarSummary.averageAccuracy < 0.55) {
            analysis.weaknesses.push({
                area: 'Grammatik',
                level: 'weak',
                accuracy: grammarSummary.averageAccuracy,
                message: 'Grammatik bereitet noch Schwierigkeiten.'
            });
            analysis.recommendations.push({
                type: 'review',
                area: 'grammar',
                message: 'Wiederhole die Grammatikregeln und mache Kontrastübungen.'
            });
        }

        // Analyze specific concepts
        const strugglingItems = knowledgeTracker.getStrugglingItems('grammar');
        if (strugglingItems.length > 0) {
            strugglingItems.slice(0, 3).forEach(item => {
                analysis.weaknesses.push({
                    area: item.concept || item.itemId,
                    level: 'critical',
                    accuracy: item.correct / item.attempts,
                    message: `${item.concept || item.itemId} braucht intensive Übung.`
                });
            });
        }

        // Response time analysis
        if (knowledgeTracker.vocabularyKnowledge) {
            const items = Object.values(knowledgeTracker.vocabularyKnowledge);
            const itemsWithTime = items.filter(i => i.avgResponseTime);

            if (itemsWithTime.length > 0) {
                const avgTime = itemsWithTime.reduce((sum, i) => sum + i.avgResponseTime, 0) / itemsWithTime.length;

                if (avgTime < 5) {
                    analysis.strengths.push({
                        area: 'Reaktionsgeschwindigkeit',
                        level: 'strong',
                        value: avgTime,
                        message: 'Du antwortest schnell und sicher!'
                    });
                } else if (avgTime > 12) {
                    analysis.weaknesses.push({
                        area: 'Reaktionsgeschwindigkeit',
                        level: 'moderate',
                        value: avgTime,
                        message: 'Du brauchst Zeit zum Nachdenken - das ist normal beim Lernen.'
                    });
                }
            }
        }

        return analysis;
    }

    /**
     * Predict mastery timeline for a concept
     */
    predictMasteryTimeline(conceptName, knowledgeTracker) {
        if (!knowledgeTracker) {
            return { prediction: 'unavailable', reason: 'no-tracker' };
        }

        const concept = knowledgeTracker.grammarKnowledge[conceptName] ||
                       knowledgeTracker.vocabularyKnowledge[conceptName];

        if (!concept) {
            return { prediction: 'unavailable', reason: 'concept-not-found' };
        }

        // Check if already mastered
        if (concept.knowledgeLevel === 'mastered') {
            return {
                prediction: 'achieved',
                message: 'Bereits gemeistert! 🎉',
                confidence: 1.0
            };
        }

        // Need enough data points
        if (concept.attempts < this.masteryPrediction.minDataPoints) {
            return {
                prediction: 'insufficient-data',
                message: `Noch ${this.masteryPrediction.minDataPoints - concept.attempts} Übungen nötig für Vorhersage.`,
                confidence: 0
            };
        }

        // Calculate improvement rate from performance history
        const history = this.performanceHistory[conceptName];
        if (!history || history.dataPoints.length < 5) {
            return this.calculateBasicPrediction(concept);
        }

        // Calculate trend from history
        const recentPoints = history.dataPoints.slice(-10);
        const improvementRate = this.calculateImprovementRate(recentPoints);

        // Current accuracy
        const currentAccuracy = concept.correct / concept.attempts;

        // Predict how many more attempts needed to reach mastery (0.90 accuracy)
        const targetAccuracy = 0.90;
        const accuracyGap = targetAccuracy - currentAccuracy;

        if (improvementRate <= 0) {
            return {
                prediction: 'plateau',
                message: 'Dein Fortschritt hat sich verlangsamt. Versuche andere Übungsmethoden.',
                confidence: 0.60,
                suggestion: 'Wechsle die Übungsart oder mache eine Pause und komme später zurück.'
            };
        }

        // Estimate attempts needed
        const attemptsNeeded = Math.ceil(accuracyGap / improvementRate);

        // Estimate days based on current practice frequency
        const daysNeeded = this.estimateDaysFromAttempts(attemptsNeeded, conceptName);

        const confidence = this.calculatePredictionConfidence(recentPoints);

        return {
            prediction: 'projected',
            attemptsNeeded: attemptsNeeded,
            daysNeeded: daysNeeded,
            currentAccuracy: currentAccuracy,
            targetAccuracy: targetAccuracy,
            improvementRate: improvementRate,
            confidence: confidence,
            message: `Voraussichtlich in ${daysNeeded} Tagen gemeistert (${attemptsNeeded} Übungen).`,
            suggestion: confidence < 0.70 ?
                'Übe regelmäßiger für genauere Vorhersagen.' :
                'Bleib dran! Du bist auf einem guten Weg.'
        };
    }

    /**
     * Calculate improvement rate from data points
     */
    calculateImprovementRate(dataPoints) {
        if (dataPoints.length < 2) return 0;

        // Simple linear regression
        const n = dataPoints.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

        dataPoints.forEach((point, index) => {
            sumX += index;
            sumY += point.accuracy;
            sumXY += index * point.accuracy;
            sumXX += index * index;
        });

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        return slope;
    }

    /**
     * Calculate prediction confidence
     */
    calculatePredictionConfidence(dataPoints) {
        if (dataPoints.length < 5) return 0.40;

        // Calculate variance in recent performance
        const accuracies = dataPoints.map(p => p.accuracy);
        const mean = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
        const variance = accuracies.reduce((sum, acc) => sum + Math.pow(acc - mean, 2), 0) / accuracies.length;
        const stdDev = Math.sqrt(variance);

        // Low variance = high confidence
        const confidence = Math.max(0.40, Math.min(0.95, 1 - (stdDev * 2)));

        return confidence;
    }

    /**
     * Calculate basic prediction without history
     */
    calculateBasicPrediction(concept) {
        const currentAccuracy = concept.correct / concept.attempts;
        const targetAccuracy = 0.90;

        // Assume average improvement rate of 0.02 per attempt
        const assumedRate = 0.02;
        const attemptsNeeded = Math.ceil((targetAccuracy - currentAccuracy) / assumedRate);

        return {
            prediction: 'basic',
            attemptsNeeded: attemptsNeeded,
            daysNeeded: Math.ceil(attemptsNeeded / 3), // Assume 3 attempts per day
            confidence: 0.50,
            message: `Grob geschätzt: ${attemptsNeeded} Übungen noch nötig.`,
            suggestion: 'Übe regelmäßig weiter für genauere Vorhersagen.'
        };
    }

    /**
     * Estimate days from attempts based on practice frequency
     */
    estimateDaysFromAttempts(attempts, conceptName) {
        // Look at recent practice frequency for this concept
        const recentSessions = this.sessionHistory.slice(-14); // Last 14 sessions

        const conceptAttempts = recentSessions.reduce((sum, session) => {
            const concept = session.concepts.find(c => c.name === conceptName);
            return sum + (concept ? concept.attempts : 0);
        }, 0);

        const days = recentSessions.length > 0 ?
            (recentSessions[recentSessions.length - 1].timestamp - recentSessions[0].timestamp) / (1000 * 60 * 60 * 24) :
            7;

        const avgAttemptsPerDay = days > 0 ? conceptAttempts / days : 3;

        return Math.ceil(attempts / Math.max(1, avgAttemptsPerDay));
    }

    /**
     * Check for milestones
     */
    checkMilestones(session) {
        const newMilestones = [];

        // Accuracy milestones
        if (session.accuracy >= 0.90 && !this.hasMilestone('accuracy-90')) {
            newMilestones.push({
                id: 'accuracy-90',
                type: 'accuracy',
                name: '90% Genauigkeit',
                description: 'Du hast 90% Genauigkeit in einer Session erreicht!',
                icon: '🎯',
                timestamp: session.timestamp
            });
        }

        // Streak milestones
        if (this.sessionHistory.length >= 7 && !this.hasMilestone('streak-7')) {
            const last7Days = Date.now() - (7 * 24 * 60 * 60 * 1000);
            const sessionsLast7Days = this.sessionHistory.filter(s => s.timestamp >= last7Days);

            if (sessionsLast7Days.length >= 7) {
                newMilestones.push({
                    id: 'streak-7',
                    type: 'consistency',
                    name: '7-Tage-Streak',
                    description: 'Du hast 7 Tage hintereinander geübt!',
                    icon: '🔥',
                    timestamp: session.timestamp
                });
            }
        }

        // Exercise count milestones
        const totalExercises = this.sessionHistory.reduce((sum, s) => sum + s.exercisesCompleted, 0);

        if (totalExercises >= 100 && !this.hasMilestone('exercises-100')) {
            newMilestones.push({
                id: 'exercises-100',
                type: 'volume',
                name: '100 Übungen',
                description: 'Du hast 100 Übungen abgeschlossen!',
                icon: '💯',
                timestamp: session.timestamp
            });
        }

        if (totalExercises >= 500 && !this.hasMilestone('exercises-500')) {
            newMilestones.push({
                id: 'exercises-500',
                type: 'volume',
                name: '500 Übungen',
                description: 'Wow! 500 Übungen abgeschlossen!',
                icon: '🏆',
                timestamp: session.timestamp
            });
        }

        this.milestones.push(...newMilestones);
        return newMilestones;
    }

    /**
     * Check if milestone already achieved
     */
    hasMilestone(id) {
        return this.milestones.some(m => m.id === id);
    }

    /**
     * Get visual data for charts
     */
    getChartData() {
        return {
            accuracyOverTime: this.getAccuracyOverTimeData(),
            conceptPerformance: this.getConceptPerformanceData(),
            responseTimeDistribution: this.getResponseTimeData(),
            learningVelocity: this.getLearningVelocityData(),
            sessionActivity: this.getSessionActivityData()
        };
    }

    /**
     * Get accuracy over time data
     */
    getAccuracyOverTimeData() {
        return this.sessionHistory.map(session => ({
            timestamp: session.timestamp,
            date: new Date(session.timestamp).toLocaleDateString('de-DE'),
            accuracy: session.accuracy,
            exercises: session.exercisesCompleted
        }));
    }

    /**
     * Get concept performance data
     */
    getConceptPerformanceData() {
        return Object.entries(this.performanceHistory).map(([name, history]) => {
            const latestPoint = history.dataPoints[history.dataPoints.length - 1];
            const avgAccuracy = history.dataPoints.reduce((sum, p) => sum + p.accuracy, 0) / history.dataPoints.length;

            return {
                concept: name,
                currentAccuracy: latestPoint?.accuracy || 0,
                averageAccuracy: avgAccuracy,
                totalAttempts: history.dataPoints.reduce((sum, p) => sum + p.attempts, 0),
                trend: this.calculateImprovementRate(history.dataPoints)
            };
        });
    }

    /**
     * Get response time data
     */
    getResponseTimeData() {
        const timeBuckets = {
            'fast': 0,       // < 3s
            'medium': 0,     // 3-8s
            'slow': 0,       // 8-15s
            'very-slow': 0   // > 15s
        };

        this.sessionHistory.forEach(session => {
            const time = session.avgResponseTime;
            if (time < 3) timeBuckets.fast++;
            else if (time < 8) timeBuckets.medium++;
            else if (time < 15) timeBuckets.slow++;
            else timeBuckets['very-slow']++;
        });

        return timeBuckets;
    }

    /**
     * Get learning velocity data
     */
    getLearningVelocityData() {
        const velocity = this.getLearningVelocity();

        return {
            current: velocity.velocity,
            trend: velocity.trend,
            history: this.sessionHistory.slice(-20).map((session, index) => ({
                session: index + 1,
                velocity: (session.exercisesCompleted * session.accuracy) / (session.duration / (1000 * 60))
            }))
        };
    }

    /**
     * Get session activity data
     */
    getSessionActivityData() {
        // Group sessions by day
        const dayGroups = {};

        this.sessionHistory.forEach(session => {
            const date = new Date(session.timestamp).toLocaleDateString('de-DE');
            if (!dayGroups[date]) {
                dayGroups[date] = {
                    date: date,
                    sessions: 0,
                    exercises: 0,
                    duration: 0
                };
            }
            dayGroups[date].sessions++;
            dayGroups[date].exercises += session.exercisesCompleted;
            dayGroups[date].duration += session.duration;
        });

        return Object.values(dayGroups);
    }

    /**
     * Generate comprehensive report
     */
    generateReport(knowledgeTracker = null) {
        return {
            summary: {
                totalSessions: this.sessionHistory.length,
                totalExercises: this.sessionHistory.reduce((sum, s) => sum + s.exercisesCompleted, 0),
                averageAccuracy: this.sessionHistory.reduce((sum, s) => sum + s.accuracy, 0) / (this.sessionHistory.length || 1),
                totalTime: this.sessionHistory.reduce((sum, s) => sum + s.duration, 0),
                milestones: this.milestones.length
            },
            velocity: this.getLearningVelocity(),
            strengthsWeaknesses: this.analyzeStrengthsWeaknesses(knowledgeTracker),
            recentMilestones: this.milestones.slice(-5),
            chartData: this.getChartData()
        };
    }

    // Save/Load methods
    save() {
        localStorage.setItem('learning_analytics_sessions', JSON.stringify(this.sessionHistory));
        localStorage.setItem('learning_analytics_performance', JSON.stringify(this.performanceHistory));
        localStorage.setItem('learning_analytics_milestones', JSON.stringify(this.milestones));
    }

    load() {
        const sessions = localStorage.getItem('learning_analytics_sessions');
        const performance = localStorage.getItem('learning_analytics_performance');
        const milestones = localStorage.getItem('learning_analytics_milestones');

        if (sessions) this.sessionHistory = JSON.parse(sessions);
        if (performance) this.performanceHistory = JSON.parse(performance);
        if (milestones) this.milestones = JSON.parse(milestones);
    }

    reset() {
        this.sessionHistory = [];
        this.performanceHistory = {};
        this.milestones = [];
        this.save();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LearningAnalytics };
}
