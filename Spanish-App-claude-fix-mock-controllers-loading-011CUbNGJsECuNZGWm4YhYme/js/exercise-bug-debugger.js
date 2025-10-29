/**
 * Exercise Bug Debugger
 * 🐛 Automatic testing tool to detect common bugs in Spanish Learning App
 *
 * Tests:
 * - Bug #1: Options override (transformExerciseForUI ignoring provided options)
 * - Bug #2: Insufficient options (exercises with < 3 options)
 * - Bug #3: Navigation state (unit progression issues)
 *
 * Usage:
 *   const debugger = new ExerciseBugDebugger(appController);
 *   debugger.runAllTests();
 *   debugger.exportReport();
 */

class ExerciseBugDebugger {
    constructor(appController) {
        this.app = appController;
        this.results = {
            bug1_overrides: [],
            bug2_insufficient: [],
            bug3_navigation: [],
            summary: {
                totalExercises: 0,
                totalBugs: 0,
                testsRun: 0,
                timestamp: new Date().toISOString()
            }
        };
    }

    /**
     * Test Bug #1: Options Override
     * Checks if transformExerciseForUI() respects existing options
     */
    testOptionsOverride() {
        console.log('🔍 Testing Bug #1: Options Override...');

        const exercises = this.app.state.exercises;
        this.results.summary.totalExercises = exercises.length;

        exercises.forEach(exercise => {
            // Only test exercises that have predefined options
            if (exercise.options && Array.isArray(exercise.options) && exercise.options.length > 0) {

                // Transform exercise using the app's function
                const transformed = this.app.transformExerciseForUI(exercise);

                // Check if options were preserved
                const originalOptionsJson = JSON.stringify(exercise.options);
                const transformedOptionsJson = JSON.stringify(transformed.options);

                if (originalOptionsJson !== transformedOptionsJson) {
                    this.results.bug1_overrides.push({
                        id: exercise.id,
                        type: exercise.type,
                        concept: exercise.concept,
                        originalCount: exercise.options.length,
                        transformedCount: transformed.options.length,
                        reason: 'Options were modified or overridden',
                        severity: 'critical'
                    });
                }
            }
        });

        const found = this.results.bug1_overrides.length;
        console.log(found > 0
            ? `❌ Bug #1: Found ${found} exercises with overridden options`
            : `✅ Bug #1: No options override issues found`
        );
    }

    /**
     * Test Bug #2: Insufficient Options
     * Checks if all exercises have at least 3 options
     */
    testInsufficientOptions() {
        console.log('🔍 Testing Bug #2: Insufficient Options...');

        const exercises = this.app.state.exercises;

        exercises.forEach(exercise => {
            // Skip translation exercises (they don't need options)
            if (exercise.type === 'translation') {
                return;
            }

            // Transform and check option count
            const transformed = this.app.transformExerciseForUI(exercise);

            if (transformed.options.length < 3) {
                this.results.bug2_insufficient.push({
                    id: exercise.id,
                    type: exercise.type,
                    concept: exercise.concept,
                    optionCount: transformed.options.length,
                    reason: `Only ${transformed.options.length} option(s) provided (minimum 3 required)`,
                    severity: transformed.options.length === 1 ? 'critical' : 'warning'
                });
            }
        });

        const found = this.results.bug2_insufficient.length;
        console.log(found > 0
            ? `❌ Bug #2: Found ${found} exercises with < 3 options`
            : `✅ Bug #2: All exercises have sufficient options`
        );
    }

    /**
     * Test Bug #3: Navigation State
     * Simulates unit navigation to detect state tracking issues
     * Note: This is a read-only test, doesn't actually change state
     */
    testNavigationState() {
        console.log('🔍 Testing Bug #3: Navigation State...');

        // Check if progress save mechanism exists
        if (typeof this.app.saveProgress !== 'function') {
            this.results.bug3_navigation.push({
                reason: 'saveProgress() function not found',
                severity: 'critical'
            });
            console.log('❌ Bug #3: saveProgress() function missing');
            return;
        }

        // Check if loadNextUnit saves progress after loading
        const loadNextUnitSource = this.app.loadNextUnit.toString();

        // Check if saveProgress is called after loadUnit
        const hasSaveProgressCall = loadNextUnitSource.includes('this.saveProgress()');
        const loadUnitIndex = loadNextUnitSource.indexOf('await this.loadUnit');
        const saveProgressIndex = loadNextUnitSource.indexOf('this.saveProgress()');

        if (!hasSaveProgressCall) {
            this.results.bug3_navigation.push({
                reason: 'loadNextUnit() does not call saveProgress()',
                expected: 'saveProgress() should be called after loadUnit()',
                severity: 'critical',
                fix: 'Add this.saveProgress() after await this.loadUnit(nextUnit)'
            });
        } else if (saveProgressIndex < loadUnitIndex) {
            this.results.bug3_navigation.push({
                reason: 'saveProgress() called BEFORE loadUnit() completes',
                expected: 'saveProgress() should be called AFTER loadUnit()',
                severity: 'critical',
                fix: 'Move this.saveProgress() to after await this.loadUnit(nextUnit)'
            });
        }

        // Check showUnitCompletion
        const showCompletionSource = this.app.showUnitCompletion.toString();
        const hasOldSaveCall = showCompletionSource.includes('this.saveProgress()') &&
                                !showCompletionSource.includes('// this.saveProgress()');

        if (hasOldSaveCall) {
            this.results.bug3_navigation.push({
                reason: 'showUnitCompletion() still saves progress (old behavior)',
                expected: 'Progress should only be saved in loadNextUnit()',
                severity: 'warning',
                fix: 'Remove or comment out this.saveProgress() in showUnitCompletion()'
            });
        }

        const found = this.results.bug3_navigation.length;
        console.log(found > 0
            ? `❌ Bug #3: Found ${found} navigation state issue(s)`
            : `✅ Bug #3: Navigation state tracking is correct`
        );
    }

    /**
     * Run all tests
     */
    runAllTests() {
        console.log('🚀 Starting Bug Detection Tests...\n');

        this.testOptionsOverride();
        this.testInsufficientOptions();
        this.testNavigationState();

        // Calculate summary
        this.results.summary.totalBugs =
            this.results.bug1_overrides.length +
            this.results.bug2_insufficient.length +
            this.results.bug3_navigation.length;
        this.results.summary.testsRun = 3;

        console.log('\n' + '='.repeat(50));
        if (this.results.summary.totalBugs === 0) {
            console.log('✅✅✅ ALLE BUGS BEHOBEN! ✅✅✅');
        } else {
            console.log(`⚠️ ${this.results.summary.totalBugs} Issues gefunden`);
        }
        console.log('='.repeat(50) + '\n');

        return this.results;
    }

    /**
     * Generate HTML report
     */
    generateHTMLReport() {
        const timestamp = new Date().toLocaleString('de-DE');
        const totalBugs = this.results.summary.totalBugs;
        const allFixed = totalBugs === 0;

        const html = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bug Detection Report - Spanish App</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 30px;
        }

        h1 {
            color: ${allFixed ? '#2E7D32' : '#C62828'};
            margin-bottom: 10px;
            font-size: 32px;
        }

        .timestamp {
            color: #666;
            font-size: 14px;
            margin-bottom: 30px;
        }

        .summary {
            background: ${allFixed ? '#E8F5E9' : '#FFEBEE'};
            border-left: 4px solid ${allFixed ? '#2E7D32' : '#C62828'};
            padding: 20px;
            margin-bottom: 30px;
            border-radius: 4px;
        }

        .summary h2 {
            font-size: 24px;
            margin-bottom: 15px;
            color: ${allFixed ? '#2E7D32' : '#C62828'};
        }

        .summary-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }

        .stat {
            background: white;
            padding: 15px;
            border-radius: 4px;
            border: 1px solid #E0E0E0;
        }

        .stat-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stat-value {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin-top: 5px;
        }

        .section {
            margin-top: 40px;
        }

        .section h2 {
            font-size: 22px;
            color: #333;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #E0E0E0;
        }

        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            margin-left: 10px;
        }

        .badge.success {
            background: #E8F5E9;
            color: #2E7D32;
        }

        .badge.error {
            background: #FFEBEE;
            color: #C62828;
        }

        .issue-list {
            list-style: none;
            margin-top: 15px;
        }

        .issue {
            background: #FAFAFA;
            border: 1px solid #E0E0E0;
            border-left: 4px solid #FFA726;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 4px;
        }

        .issue.critical {
            border-left-color: #C62828;
        }

        .issue.warning {
            border-left-color: #FFA726;
        }

        .issue-header {
            font-weight: 600;
            margin-bottom: 8px;
            color: #333;
        }

        .issue-details {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }

        .issue-detail-item {
            margin: 4px 0;
        }

        .no-issues {
            text-align: center;
            padding: 40px;
            color: #2E7D32;
            font-size: 18px;
            background: #E8F5E9;
            border-radius: 4px;
        }

        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E0E0E0;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🐛 Bug Detection Report</h1>
        <div class="timestamp">Generiert: ${timestamp}</div>

        <div class="summary">
            <h2>${allFixed ? '✅ Alle Bugs behoben!' : `⚠️ ${totalBugs} Issue(s) gefunden`}</h2>
            <div class="summary-stats">
                <div class="stat">
                    <div class="stat-label">Exercises getestet</div>
                    <div class="stat-value">${this.results.summary.totalExercises}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Tests durchgeführt</div>
                    <div class="stat-value">${this.results.summary.testsRun}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Bugs gefunden</div>
                    <div class="stat-value">${totalBugs}</div>
                </div>
            </div>
        </div>

        <!-- Bug #1: Options Override -->
        <div class="section">
            <h2>
                Bug #1: Options-Überschreibung
                ${this.results.bug1_overrides.length === 0
                    ? '<span class="badge success">✓ Behoben</span>'
                    : `<span class="badge error">${this.results.bug1_overrides.length} Issue(s)</span>`}
            </h2>
            ${this.results.bug1_overrides.length === 0
                ? '<div class="no-issues">✅ Keine Options-Überschreibungen gefunden. Alle vordefinierten Options werden korrekt verwendet!</div>'
                : `<ul class="issue-list">
                    ${this.results.bug1_overrides.map(issue => `
                        <li class="issue ${issue.severity}">
                            <div class="issue-header">Exercise: ${issue.id}</div>
                            <div class="issue-details">
                                <div class="issue-detail-item"><strong>Type:</strong> ${issue.type}</div>
                                <div class="issue-detail-item"><strong>Concept:</strong> ${issue.concept}</div>
                                <div class="issue-detail-item"><strong>Original Options:</strong> ${issue.originalCount}</div>
                                <div class="issue-detail-item"><strong>Transformed Options:</strong> ${issue.transformedCount}</div>
                                <div class="issue-detail-item"><strong>Reason:</strong> ${issue.reason}</div>
                            </div>
                        </li>
                    `).join('')}
                </ul>`}
        </div>

        <!-- Bug #2: Insufficient Options -->
        <div class="section">
            <h2>
                Bug #2: Zu wenige Options
                ${this.results.bug2_insufficient.length === 0
                    ? '<span class="badge success">✓ Behoben</span>'
                    : `<span class="badge error">${this.results.bug2_insufficient.length} Issue(s)</span>`}
            </h2>
            ${this.results.bug2_insufficient.length === 0
                ? '<div class="no-issues">✅ Alle Exercises haben mindestens 3 Options!</div>'
                : `<ul class="issue-list">
                    ${this.results.bug2_insufficient.map(issue => `
                        <li class="issue ${issue.severity}">
                            <div class="issue-header">Exercise: ${issue.id}</div>
                            <div class="issue-details">
                                <div class="issue-detail-item"><strong>Type:</strong> ${issue.type}</div>
                                <div class="issue-detail-item"><strong>Concept:</strong> ${issue.concept}</div>
                                <div class="issue-detail-item"><strong>Option Count:</strong> ${issue.optionCount}</div>
                                <div class="issue-detail-item"><strong>Reason:</strong> ${issue.reason}</div>
                            </div>
                        </li>
                    `).join('')}
                </ul>`}
        </div>

        <!-- Bug #3: Navigation State -->
        <div class="section">
            <h2>
                Bug #3: Lektionen-Navigation
                ${this.results.bug3_navigation.length === 0
                    ? '<span class="badge success">✓ Behoben</span>'
                    : `<span class="badge error">${this.results.bug3_navigation.length} Issue(s)</span>`}
            </h2>
            ${this.results.bug3_navigation.length === 0
                ? '<div class="no-issues">✅ Navigation-State wird korrekt gespeichert!</div>'
                : `<ul class="issue-list">
                    ${this.results.bug3_navigation.map(issue => `
                        <li class="issue ${issue.severity}">
                            <div class="issue-header">${issue.reason}</div>
                            <div class="issue-details">
                                ${issue.expected ? `<div class="issue-detail-item"><strong>Expected:</strong> ${issue.expected}</div>` : ''}
                                ${issue.fix ? `<div class="issue-detail-item"><strong>Fix:</strong> ${issue.fix}</div>` : ''}
                            </div>
                        </li>
                    `).join('')}
                </ul>`}
        </div>

        <div class="footer">
            Spanish Learning App - Bug Detection Tool v1.0<br>
            Generiert am ${timestamp}
        </div>
    </div>
</body>
</html>
        `.trim();

        return html;
    }

    /**
     * Export report as downloadable HTML file
     */
    exportReport() {
        const html = this.generateHTMLReport();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bug-report-${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('📥 Report exported as HTML file');
    }

    /**
     * Display results in console (formatted)
     */
    displayConsoleReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 BUG DETECTION REPORT');
        console.log('='.repeat(60));
        console.log(`Timestamp: ${new Date().toLocaleString('de-DE')}`);
        console.log(`Exercises tested: ${this.results.summary.totalExercises}`);
        console.log(`Total bugs found: ${this.results.summary.totalBugs}`);
        console.log('='.repeat(60) + '\n');

        console.log('Bug #1: Options Override');
        console.log(`  Issues: ${this.results.bug1_overrides.length}`);
        if (this.results.bug1_overrides.length > 0) {
            this.results.bug1_overrides.forEach(issue => {
                console.log(`  - ${issue.id}: ${issue.reason}`);
            });
        }
        console.log('');

        console.log('Bug #2: Insufficient Options');
        console.log(`  Issues: ${this.results.bug2_insufficient.length}`);
        if (this.results.bug2_insufficient.length > 0) {
            this.results.bug2_insufficient.forEach(issue => {
                console.log(`  - ${issue.id}: ${issue.optionCount} options (need 3)`);
            });
        }
        console.log('');

        console.log('Bug #3: Navigation State');
        console.log(`  Issues: ${this.results.bug3_navigation.length}`);
        if (this.results.bug3_navigation.length > 0) {
            this.results.bug3_navigation.forEach(issue => {
                console.log(`  - ${issue.reason}`);
            });
        }
        console.log('\n' + '='.repeat(60) + '\n');
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.ExerciseBugDebugger = ExerciseBugDebugger;

    // Helper function to run tests quickly
    window.debugExercises = function() {
        if (!window.appController) {
            console.error('❌ appController not found! Make sure the app is loaded.');
            return;
        }

        const debugger = new ExerciseBugDebugger(window.appController);
        debugger.runAllTests();
        debugger.displayConsoleReport();

        console.log('💡 Tip: Run debugger.exportReport() to download HTML report');

        return debugger;
    };
}
