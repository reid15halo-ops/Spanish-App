# Adaptive Learning System - Quick Start Guide

Schnelleinstieg in das optimierte adaptive Lernsystem.

## Installation

### 1. Module einbinden

```html
<!-- Core dependencies (must be included first) -->
<script src="js/adaptive-knowledge-tracker-v2.js"></script>
<script src="js/interleaved-practice-system.js"></script>
<script src="js/learning-analytics.js"></script>
<script src="js/adaptive-learning-orchestrator.js"></script>
```

### 2. Orchestrator initialisieren

```javascript
// Create orchestrator (bundles all systems)
const adaptiveLearning = new AdaptiveLearningOrchestrator();

// Load saved data
adaptiveLearning.load();
```

## Basis-Verwendung

### Session starten

```javascript
// Start new session
adaptiveLearning.startSession();
```

### Übung abrufen

```javascript
// Get all available exercises
const availableExercises = [
    { id: 'v1_001', es: 'hola', de: 'hallo', concept: 'greetings' },
    { id: 'v1_002', es: 'adiós', de: 'tschüss', concept: 'greetings' },
    // ... more exercises
];

// Get next optimized exercise
const exercise = adaptiveLearning.getNextOptimizedExercise(
    availableExercises,
    currentUnit,
    userProgress
);

// Display exercise to user
displayExercise(exercise);
```

### Antwort verarbeiten

```javascript
// Measure response time
const startTime = Date.now();
const userAnswer = await getUserAnswer();
const responseTime = Date.now() - startTime;

// Check answer
const isCorrect = checkAnswer(exercise, userAnswer);

// Record attempt (with response time!)
adaptiveLearning.recordExerciseAttempt(
    exercise,
    userAnswer,
    isCorrect,
    responseTime  // Important for confidence calculation
);
```

### Session beenden

```javascript
// End session and get summary
const sessionSummary = adaptiveLearning.endSession();

// Display summary
console.log('Exercises:', sessionSummary.summary.exercisesCompleted);
console.log('Accuracy:', sessionSummary.summary.accuracy);
console.log('New Milestones:', sessionSummary.newMilestones);

// Show interleaving analysis
if (sessionSummary.interleavingAnalysis) {
    console.log('Discrimination:', sessionSummary.interleavingAnalysis.discrimination);
    console.log('Recommendations:', sessionSummary.interleavingAnalysis.recommendation);
}
```

## Fortgeschrittene Features

### Insights abrufen

```javascript
// Get learning insights
const insights = adaptiveLearning.getLearningInsights();

console.log('Knowledge:', insights.knowledgeSummary);
console.log('Velocity:', insights.learningVelocity);
console.log('Strengths:', insights.strengthsWeaknesses.strengths);
console.log('Weaknesses:', insights.strengthsWeaknesses.weaknesses);
```

### Empfehlungen anzeigen

```javascript
// Get personalized recommendations
const recommendations = adaptiveLearning.generateRecommendations();

recommendations.forEach(rec => {
    if (rec.priority === 'high') {
        displayUrgentRecommendation(rec);
    }
});
```

### Übungsplan erstellen

```javascript
// Get practice plan for next session
const plan = adaptiveLearning.getPracticePlan(availableItems, 20);

console.log(`Heute: ${plan.exercises.length} Übungen`);
console.log(`Schwerpunkte: ${plan.focus.map(f => f.area).join(', ')}`);
console.log(`Geschätzte Zeit: ${plan.estimatedTime} Minuten`);
console.log(`Schwierigkeit: ${plan.difficulty}`);
```

### Mastery vorhersagen

```javascript
// Predict when concept will be mastered
const prediction = adaptiveLearning.predictMastery('ser-conjugation', 'grammar');

if (prediction.prediction === 'projected') {
    console.log(`Noch ${prediction.daysNeeded} Tage bis zur Meisterschaft!`);
    console.log(`${prediction.attemptsNeeded} Übungen nötig`);
    console.log(`Konfidenz: ${(prediction.confidence * 100).toFixed(0)}%`);
}
```

### Statistiken abrufen

```javascript
// Get current statistics
const stats = adaptiveLearning.getStatistics();

console.log('Vocabulary:');
console.log('  Total:', stats.vocabulary.total);
console.log('  Mastered:', stats.vocabulary.mastered);
console.log('  Accuracy:', (stats.vocabulary.averageAccuracy * 100).toFixed(1) + '%');

console.log('Overall:');
console.log('  Mastery Rate:', (stats.overall.masteryRate * 100).toFixed(1) + '%');
console.log('  Learning Velocity:', stats.overall.learningVelocity.toFixed(2));
console.log('  Trend:', stats.overall.velocityTrend);
```

## Vollständiges Beispiel

```javascript
// ===== Setup =====
const adaptiveLearning = new AdaptiveLearningOrchestrator();
adaptiveLearning.load();

// ===== Learning Loop =====
async function startLearningSession() {
    // Start session
    adaptiveLearning.startSession();

    // Get available exercises
    const allExercises = loadExercises();

    // Session loop
    for (let i = 0; i < 20; i++) {
        // Get next optimized exercise
        const exercise = adaptiveLearning.getNextOptimizedExercise(
            allExercises,
            currentUnit,
            userProgress
        );

        // Display exercise
        displayExercise(exercise);

        // Measure response time
        const startTime = Date.now();
        const userAnswer = await getUserAnswer();
        const responseTime = Date.now() - startTime;

        // Check answer
        const isCorrect = checkAnswer(exercise, userAnswer);

        // Record attempt
        adaptiveLearning.recordExerciseAttempt(
            exercise,
            userAnswer,
            isCorrect,
            responseTime
        );

        // Show feedback
        displayFeedback(isCorrect, exercise.correctAnswer);

        // Show insights every 5 exercises
        if ((i + 1) % 5 === 0) {
            const insights = adaptiveLearning.getLearningInsights();
            displayInsights(insights);
        }
    }

    // End session
    const summary = adaptiveLearning.endSession();

    // Display session summary
    displaySessionSummary(summary);

    // Show recommendations
    const recommendations = adaptiveLearning.generateRecommendations();
    displayRecommendations(recommendations);

    // Show new milestones
    if (summary.newMilestones.length > 0) {
        celebrateMilestones(summary.newMilestones);
    }
}

// Start learning
startLearningSession();
```

## Configuration

### Standardkonfiguration anpassen

```javascript
adaptiveLearning.updateConfig({
    enableInterleaving: true,       // Interleaved practice
    enableAnalytics: true,          // Track analytics
    trackResponseTime: true,        // Track response times
    adaptiveDifficulty: true,       // Adjust difficulty
    minExercisesBeforeAdaptation: 5 // Min exercises before adapting
});
```

### Für Anfänger optimieren

```javascript
adaptiveLearning.updateConfig({
    enableInterleaving: false,  // Deaktiviere Interleaving
    minExercisesBeforeAdaptation: 3  // Schnellere Adaptation
});
```

### Für Fortgeschrittene optimieren

```javascript
adaptiveLearning.updateConfig({
    enableInterleaving: true,   // Volle Interleaving-Power
    minExercisesBeforeAdaptation: 10  // Mehr Daten vor Adaptation
});
```

## Data Management

### Daten speichern

```javascript
// Automatic save after each action
// Manual save:
adaptiveLearning.save();
```

### Daten laden

```javascript
// Load on init
adaptiveLearning.load();
```

### Daten exportieren (Backup)

```javascript
const backup = adaptiveLearning.exportData();

// Save to file
const json = JSON.stringify(backup, null, 2);
downloadFile('learning-data-backup.json', json);
```

### Daten importieren (Restore)

```javascript
// Load from file
const json = await loadFile('learning-data-backup.json');
const backup = JSON.parse(json);

// Import
adaptiveLearning.importData(backup);
```

### Daten zurücksetzen

```javascript
// CAUTION: Deletes all progress!
if (confirm('Alle Fortschritte löschen?')) {
    adaptiveLearning.reset();
}
```

## UI Integration

### Dashboard anzeigen

```javascript
function renderDashboard() {
    const stats = adaptiveLearning.getStatistics();
    const insights = adaptiveLearning.getLearningInsights();

    // Render statistics
    document.getElementById('total-items').textContent = stats.overall.totalItems;
    document.getElementById('mastery-rate').textContent =
        (stats.overall.masteryRate * 100).toFixed(0) + '%';
    document.getElementById('velocity').textContent =
        stats.overall.learningVelocity.toFixed(2);

    // Render velocity trend
    const trendIcon = {
        'improving': '📈',
        'declining': '📉',
        'stable': '➡️'
    }[stats.overall.velocityTrend];
    document.getElementById('trend').textContent = trendIcon;

    // Render recommendations
    const recommendations = insights.strengthsWeaknesses.recommendations;
    const recList = document.getElementById('recommendations');
    recList.innerHTML = recommendations
        .slice(0, 3)
        .map(rec => `<li>${rec.message}</li>`)
        .join('');
}
```

### Charts zeichnen

```javascript
function renderCharts() {
    const report = adaptiveLearning.getAnalyticsReport();
    const chartData = report.chartData;

    // Accuracy over time
    drawLineChart('accuracy-chart', chartData.accuracyOverTime, {
        x: 'date',
        y: 'accuracy',
        title: 'Genauigkeit über Zeit'
    });

    // Concept performance
    drawBarChart('concept-chart', chartData.conceptPerformance, {
        x: 'concept',
        y: 'currentAccuracy',
        title: 'Konzept-Performance'
    });

    // Learning velocity
    drawLineChart('velocity-chart', chartData.learningVelocity.history, {
        x: 'session',
        y: 'velocity',
        title: 'Lerngeschwindigkeit'
    });
}
```

### Progress Bar

```javascript
function renderProgressBar(concept) {
    const prediction = adaptiveLearning.predictMastery(concept, 'grammar');

    if (prediction.prediction === 'projected') {
        const progress = 1 - (prediction.daysNeeded / 30); // Assume 30 days total
        const progressPercent = Math.max(0, Math.min(100, progress * 100));

        document.getElementById('progress-bar').style.width = progressPercent + '%';
        document.getElementById('progress-text').textContent =
            `${prediction.daysNeeded} Tage bis zur Meisterschaft`;
    } else if (prediction.prediction === 'achieved') {
        document.getElementById('progress-bar').style.width = '100%';
        document.getElementById('progress-text').textContent = 'Gemeistert! 🎉';
    }
}
```

## Debugging

### Debug-Modus aktivieren

```javascript
localStorage.setItem('adaptive_debug', 'true');

// Now all actions will log to console
```

### Knowledge-State inspizieren

```javascript
// Get underlying tracker
const tracker = adaptiveLearning.knowledgeTracker;

// Inspect specific item
const knowledge = tracker.getKnowledge('vocabulary', 'v1_001');
console.log('Knowledge State:', {
    level: knowledge.knowledgeLevel,
    accuracy: knowledge.correct / knowledge.attempts,
    confidence: knowledge.confidence,
    memoryStrength: knowledge.memoryStrength,
    easeFactor: knowledge.easeFactor,
    frequency: knowledge.frequency,
    nextReview: new Date(knowledge.nextReview).toLocaleString()
});
```

### Analytics inspizieren

```javascript
// Get underlying analytics
const analytics = adaptiveLearning.analytics;

// View session history
console.log('Last 5 sessions:', analytics.sessionHistory.slice(-5));

// View milestones
console.log('Milestones:', analytics.milestones);

// View performance history
console.log('Performance by concept:', analytics.performanceHistory);
```

## Häufige Probleme

### Problem: Keine Übungen werden empfohlen

```javascript
// Lösung: Prüfen ob Items vorhanden
const stats = adaptiveLearning.getStatistics();
if (stats.overall.totalItems === 0) {
    console.log('Keine Items getrackt. Füge Items hinzu!');
}
```

### Problem: Alle Übungen sind zu schwer

```javascript
// Lösung: Deaktiviere temporär adaptive Schwierigkeit
adaptiveLearning.updateConfig({
    adaptiveDifficulty: false
});
```

### Problem: Zu viele Wiederholungen

```javascript
// Lösung: Reduziere Frequency-Multiplier
const tracker = adaptiveLearning.knowledgeTracker;
Object.values(tracker.vocabularyKnowledge).forEach(item => {
    item.frequency = Math.min(item.frequency, 2.0);  // Max 2x
});
tracker.save();
```

## Nächste Schritte

1. **Volle Dokumentation**: [ADAPTIVE-LEARNING-OPTIMIZATIONS.md](ADAPTIVE-LEARNING-OPTIMIZATIONS.md)
2. **Phase 1 Integration**: [PHASE-1-USAGE-GUIDE.md](PHASE-1-USAGE-GUIDE.md)
3. **API Referenz**: Siehe Kommentare in den JavaScript-Dateien

## Support

Bei Fragen oder Problemen:
1. Prüfe die Konsole auf Fehler
2. Aktiviere Debug-Modus
3. Inspiziere Knowledge State
4. Siehe Troubleshooting-Sektion in der vollen Dokumentation

Viel Erfolg beim Lernen! 🚀
