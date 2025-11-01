"use strict";
/**
 * App Core - Consolidated Module - TypeScript Version
 *
 * Combines: app.js + exercise-loader.js + exercise-renderer.js
 * Uses inlined exercise data (no fetch() calls, no CORS issues)
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ====================================================================
// EXERCISE LOADER (No fetch() - uses inlined data)
// ====================================================================
class ExerciseLoader {
    constructor() {
        this.units = {
            1: window.UNIT_1_PRONOUNS,
            2: window.UNIT_2_SER,
            3: window.UNIT_3_ESTAR,
            4: window.UNIT_4_SER_ESTAR_CONTRAST,
            5: window.UNIT_5_TENER,
            6: window.UNIT_6_VOCABULARY,
            7: window.UNIT_7_INTEGRATION
        };
    }
    /**
     * Load exercises for a specific unit
     */
    async loadUnit(unitNumber) {
        const data = this.units[unitNumber];
        if (!data) {
            throw new Error(`Unit ${unitNumber} not found. Available units: 1-7`);
        }
        window.Logger?.info(`📚 Loading Unit ${unitNumber}...`);
        if (!data.exercises || !Array.isArray(data.exercises)) {
            throw new Error(`Invalid data format for Unit ${unitNumber}`);
        }
        window.Logger?.success(`✅ Loaded ${data.exercises.length} exercises for Unit ${unitNumber}`);
        window.Logger?.debug(`   Title: ${data.metadata?.title || 'N/A'}`);
        return {
            metadata: data.metadata,
            phases: data.learningPhases,
            exercises: data.exercises
        };
    }
    /**
     * Get unit metadata without loading full exercises
     */
    async getUnitInfo(unitNumber) {
        const data = await this.loadUnit(unitNumber);
        return {
            number: unitNumber,
            title: data.metadata.title,
            totalExercises: data.metadata.totalExercises,
            estimatedTime: data.metadata.estimatedTime,
            phases: data.phases
        };
    }
}
// ====================================================================
// EXERCISE RENDERER
// ====================================================================
class ExerciseRenderer {
    constructor(container) {
        this.container = container;
    }
    /**
     * Extract German translation from text (text in parentheses)
     */
    extractGermanTranslation(text) {
        const match = text.match(/\(([^)]+)\)/);
        if (match) {
            return {
                spanish: text.replace(/\s*\([^)]+\)/, '').trim(),
                german: match[1].trim()
            };
        }
        return { spanish: text, german: null };
    }
    /**
     * Render German help section (hidden by default, with toggle)
     */
    renderGermanHelp(germanTranslation, germanBridge, example) {
        const hasAnyHelp = germanTranslation || germanBridge || example;
        if (!hasAnyHelp)
            return '';
        return `
            <button class="btn-toggle-translation" onclick="app.toggleGermanHelp(this)">
                <span class="toggle-icon">▶</span>
                <span class="toggle-text">Deutsche Hilfe anzeigen</span>
            </button>
            <div class="german-help-area hidden">
                ${germanTranslation ? `
                    <div class="german-translation">
                        <strong>🇩🇪 Übersetzung:</strong> ${germanTranslation}
                    </div>
                ` : ''}
                ${germanBridge ? `
                    <div class="german-bridge">${germanBridge}</div>
                ` : ''}
                ${example ? `
                    <p class="example-hint"><em>Beispiel: ${example}</em></p>
                ` : ''}
            </div>
        `;
    }
    /**
     * Render an exercise based on its type
     */
    render(exercise, onAnswer) {
        this.container.innerHTML = '';
        // Add phase badge
        if (exercise.phase) {
            const phaseBadge = this.renderPhaseBadge(exercise.phase);
            this.container.innerHTML += phaseBadge;
        }
        // Render based on type
        let html = '';
        switch (exercise.type) {
            case 'vocabulary-card':
                html = this.renderVocabularyCard(exercise, onAnswer);
                break;
            case 'vocabulary-in-context':
                html = this.renderVocabularyInContext(exercise, onAnswer);
                break;
            case 'reading-comprehension':
                html = this.renderReadingComprehension(exercise, onAnswer);
                break;
            case 'fill-blank':
                html = this.renderFillBlank(exercise, onAnswer);
                break;
            case 'conjugation':
                html = this.renderConjugation(exercise, onAnswer);
                break;
            case 'multiple-choice':
                html = this.renderMultipleChoice(exercise, onAnswer);
                break;
            case 'translation':
                html = this.renderTranslation(exercise, onAnswer);
                break;
            case 'sentence-building':
                html = this.renderSentenceBuilding(exercise, onAnswer);
                break;
            // All other text-input based exercises
            case 'meaning-change':
            case 'error-correction':
            case 'conversation':
            case 'comprehensive':
            case 'practical-scenario':
            case 'mixed-grammar':
            case 'comprehensive-translation':
            case 'final-mastery':
            case 'correction':
            case 'mastery-check':
            case 'final-certification':
            case 'error-identification':
            case 'contrast-sentence':
            case 'contrast-pair':
            case 'contrast-intro':
            case 'advanced-application':
                html = this.renderGenericTextInput(exercise, onAnswer);
                break;
            default:
                html = `<p>Unknown exercise type: ${exercise.type}</p>`;
        }
        this.container.innerHTML += html;
    }
    /**
     * Render phase badge
     */
    renderPhaseBadge(phase) {
        const phaseNames = {
            'prep': '🎯 Vorbereitung',
            'input': '📖 Input',
            'guided': '✏️ Geführt',
            'free': '🗣️ Frei'
        };
        return `<div class="phase-badge">${phaseNames[phase] || phase}</div>`;
    }
    /**
     * Render vocabulary card (passive learning)
     */
    renderVocabularyCard(exercise, onNext) {
        return `
            <div class="vocab-card">
                <div class="vocab-word-display">
                    ${exercise.emoji ? `<div class="emoji">${exercise.emoji}</div>` : ''}
                    <div class="word">${exercise.word}</div>
                    <div class="translation">${exercise.translation}</div>
                </div>

                ${exercise.germanBridge ? `
                    <div class="german-bridge">${exercise.germanBridge}</div>
                ` : ''}

                ${exercise.explanation ? `
                    <p class="explanation">${exercise.explanation}</p>
                ` : ''}

                ${exercise.mnemonic ? `
                    <p class="mnemonic"><strong>💡 Merkhilfe:</strong> ${exercise.mnemonic}</p>
                ` : ''}

                ${exercise.exampleSentence ? `
                    <div class="example">
                        <div class="example-es">"${exercise.exampleSentence}"</div>
                        ${exercise.exampleTranslation ? `
                            <div class="example-de">${exercise.exampleTranslation}</div>
                        ` : ''}
                    </div>
                ` : ''}

                <button class="btn-primary" onclick="app.next()">Weiter →</button>
            </div>
        `;
    }
    /**
     * Render vocabulary in context
     */
    renderVocabularyInContext(exercise, onNext) {
        const examples = exercise.exampleSentences || [];
        return `
            <div class="vocab-context">
                <div class="vocab-word-display">
                    ${exercise.emoji ? `<div class="emoji">${exercise.emoji}</div>` : ''}
                    <div class="word">${exercise.word}</div>
                    <div class="translation">= ${exercise.translation}</div>
                </div>

                <div class="examples-title">📚 Verwendung in Sätzen:</div>
                <div class="examples-list">
                    ${examples.map((ex, i) => `
                        <div class="example-item">
                            <div class="example-number">${i + 1}.</div>
                            <div class="example-content">
                                <div class="example-es">${ex.es}</div>
                                <div class="example-de">→ ${ex.de}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                ${exercise.usage ? `
                    <p class="usage-tip"><strong>💡 Tipp:</strong> ${exercise.usage}</p>
                ` : ''}

                <button class="btn-primary" onclick="app.next()">Verstanden, weiter →</button>
            </div>
        `;
    }
    /**
     * Render reading comprehension
     */
    renderReadingComprehension(exercise, onAnswer) {
        const parsed = this.extractGermanTranslation(exercise.question || '');
        const dialog = exercise.dialog || [];
        const translation = exercise.translation || [];
        const comprehensionCheck = exercise.comprehensionCheck;
        return `
            <div class="reading-comprehension">
                <p class="question">${parsed.spanish}</p>

                <div class="dialog-box">
                    <div class="dialog-title">📖 Dialog:</div>
                    ${dialog.map((line) => `
                        <p class="dialog-line">
                            <strong>${line.speaker}:</strong> <em>${line.text}</em>
                        </p>
                    `).join('')}
                </div>

                <button class="btn-toggle-translation" onclick="app.toggleGermanHelp(this)">
                    <span class="toggle-icon">▶</span>
                    <span class="toggle-text">Übersetzung anzeigen</span>
                </button>

                <div class="german-help-area hidden">
                    ${parsed.german ? `
                        <div class="german-translation">
                            <strong>🇩🇪 Frage:</strong> ${parsed.german}
                        </div>
                    ` : ''}

                    <div class="translation-title">🇩🇪 Dialog-Übersetzung:</div>
                    ${translation.map((line) => `
                        <p class="translation-line">
                            <strong>${line.speaker}:</strong> ${line.text}
                        </p>
                    `).join('')}
                </div>

                ${exercise.newVocabulary ? `
                    <div class="vocab-highlight">
                        <strong>📝 Neue Wörter:</strong> ${exercise.newVocabulary.join(', ')}
                    </div>
                ` : ''}

                <div class="comprehension-check">
                    <p class="check-question">${comprehensionCheck?.question || ''}</p>
                    <div class="options">
                        ${(comprehensionCheck?.options || []).map((opt, i) => `
                            <button class="btn-option" data-answer="${opt}">
                                ${opt}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div id="hint-area" class="hint-area hidden">
                    <p class="hint"><strong>💡 Hinweis:</strong> ${exercise.hint || ''}</p>
                </div>

                <div id="feedback-area" class="feedback-area hidden"></div>
            </div>
        `;
    }
    /**
     * Render fill-blank exercise
     */
    renderFillBlank(exercise, onAnswer) {
        const parsed = this.extractGermanTranslation(exercise.question || '');
        return `
            <div class="fill-blank">
                <p class="question">${parsed.spanish}</p>

                ${this.renderGermanHelp(parsed.german, exercise.germanBridge, exercise.example)}

                <div class="input-group">
                    <input type="text" id="answer-input" class="text-input"
                           placeholder="Deine Antwort..." autocomplete="off">
                    <button class="btn-primary" onclick="app.checkAnswer()">Prüfen</button>
                </div>

                <div id="hint-area" class="hint-area hidden">
                    <p class="hint"><strong>💡 Hinweis:</strong> ${exercise.hint || ''}</p>
                </div>

                <div id="feedback-area" class="feedback-area hidden"></div>
            </div>
        `;
    }
    /**
     * Render conjugation exercise
     */
    renderConjugation(exercise, onAnswer) {
        const examples = exercise.examples || [];
        return `
            <div class="conjugation">
                <p class="question">${exercise.question}</p>

                ${exercise.germanBridge ? `
                    <div class="german-bridge">${exercise.germanBridge}</div>
                ` : ''}

                ${exercise.note ? `
                    <p class="note"><strong>📌 Hinweis:</strong> ${exercise.note}</p>
                ` : ''}

                <div class="input-group">
                    <input type="text" id="answer-input" class="text-input"
                           placeholder="Deine Antwort..." autocomplete="off">
                    <button class="btn-primary" onclick="app.checkAnswer()">Prüfen</button>
                </div>

                ${exercise.mnemonic ? `
                    <div id="hint-area" class="hint-area hidden">
                        <p class="hint"><strong>💡 Merkhilfe:</strong> ${exercise.mnemonic}</p>
                    </div>
                ` : ''}

                <div id="feedback-area" class="feedback-area hidden"></div>

                ${examples.length > 0 ? `
                    <div class="examples-box hidden" id="examples-box">
                        <strong>📚 Beispiele:</strong>
                        ${examples.map((ex) => `<p class="example">${ex}</p>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
    /**
     * Render generic text-input exercise (used for many exercise types)
     */
    renderGenericTextInput(exercise, onAnswer) {
        const typeLabels = {
            'meaning-change': 'Bedeutungsänderung',
            'error-correction': 'Fehlerkorrektur',
            'conversation': 'Konversation',
            'comprehensive': 'Umfassende Übung',
            'practical-scenario': 'Praxisszenario',
            'mixed-grammar': 'Gemischte Grammatik',
            'comprehensive-translation': 'Umfassende Übersetzung',
            'final-mastery': 'Abschlussprüfung',
            'correction': 'Korrektur',
            'mastery-check': 'Meisterschaftstest',
            'final-certification': 'Abschlusszertifizierung',
            'error-identification': 'Fehleridentifikation',
            'contrast-sentence': 'Kontrastsatz',
            'contrast-pair': 'Kontrastpaar',
            'contrast-intro': 'Kontrasteinführung',
            'advanced-application': 'Erweiterte Anwendung'
        };
        const typeLabel = typeLabels[exercise.type || ''] || exercise.type;
        const examples = exercise.examples || [];
        return `
            <div class="generic-text-input ${exercise.type}">
                <div class="exercise-type-badge">${typeLabel}</div>

                <p class="question">${exercise.question}</p>

                ${exercise.germanBridge ? `
                    <div class="german-bridge">${exercise.germanBridge}</div>
                ` : ''}

                ${exercise.note ? `
                    <p class="note"><strong>📌 Hinweis:</strong> ${exercise.note}</p>
                ` : ''}

                ${exercise.warning ? `
                    <p class="warning"><strong>${exercise.warning}</strong></p>
                ` : ''}

                ${exercise.rule ? `
                    <p class="rule"><strong>📏 Regel:</strong> ${exercise.rule}</p>
                ` : ''}

                ${exercise.context ? `
                    <p class="context"><em>${exercise.context}</em></p>
                ` : ''}

                <div class="input-group">
                    <textarea id="answer-input" class="text-input-area"
                           placeholder="Deine Antwort..." rows="3" autocomplete="off"></textarea>
                    <button class="btn-primary" onclick="app.checkAnswer()">Prüfen</button>
                </div>

                ${exercise.mnemonic ? `
                    <div id="hint-area" class="hint-area hidden">
                        <p class="hint"><strong>💡 Merkhilfe:</strong> ${exercise.mnemonic}</p>
                    </div>
                ` : ''}

                ${exercise.hint ? `
                    <div id="hint-area" class="hint-area hidden">
                        <p class="hint"><strong>💡 Hinweis:</strong> ${exercise.hint}</p>
                    </div>
                ` : ''}

                <div id="feedback-area" class="feedback-area hidden"></div>

                ${examples.length > 0 ? `
                    <div class="examples-box hidden" id="examples-box">
                        <strong>📚 Beispiele:</strong>
                        ${examples.map((ex) => `<p class="example">${ex}</p>`).join('')}
                    </div>
                ` : ''}

                ${exercise.breakdown ? `
                    <div class="breakdown-box hidden" id="breakdown-box">
                        <strong>🔍 Analyse:</strong>
                        ${Object.entries(exercise.breakdown).map(([key, value]) => `<p class="breakdown-item"><strong>${key}:</strong> ${value}</p>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
    /**
     * Render multiple-choice exercise
     */
    renderMultipleChoice(exercise, onAnswer) {
        const parsed = this.extractGermanTranslation(exercise.question || '');
        const options = exercise.options || [];
        return `
            <div class="multiple-choice">
                <p class="question">${parsed.spanish}</p>

                ${this.renderGermanHelp(parsed.german, exercise.germanBridge, undefined)}

                <div class="options">
                    ${options.map((opt, i) => `
                        <button class="btn-option" data-answer="${opt}">
                            ${opt}
                        </button>
                    `).join('')}
                </div>

                <div id="hint-area" class="hint-area hidden">
                    <p class="hint"><strong>💡 Hinweis:</strong> ${exercise.hint || ''}</p>
                </div>

                <div id="feedback-area" class="feedback-area hidden"></div>
            </div>
        `;
    }
    /**
     * Render translation exercise
     */
    renderTranslation(exercise, onAnswer) {
        const parsed = this.extractGermanTranslation(exercise.question || '');
        return `
            <div class="translation">
                <p class="question">${parsed.spanish}</p>

                ${this.renderGermanHelp(parsed.german, exercise.germanBridge, undefined)}

                <div class="input-group">
                    <input type="text" id="answer-input" class="text-input"
                           placeholder="Deine Übersetzung..." autocomplete="off">
                    <button class="btn-primary" onclick="app.checkAnswer()">Prüfen</button>
                </div>

                <div id="hint-area" class="hint-area hidden">
                    <p class="hint"><strong>💡 Hinweis:</strong> ${exercise.hint || ''}</p>
                </div>

                <div id="feedback-area" class="feedback-area hidden"></div>
            </div>
        `;
    }
    /**
     * Render sentence-building exercise
     */
    renderSentenceBuilding(exercise, onAnswer) {
        const parsed = this.extractGermanTranslation(exercise.question || '');
        const words = exercise.words || [];
        return `
            <div class="sentence-building">
                <p class="question">${parsed.spanish}</p>

                ${this.renderGermanHelp(parsed.german, exercise.germanBridge, undefined)}

                <p class="instruction">Verwende die Wörter: ${words.join(', ')}</p>

                <div class="input-group">
                    <input type="text" id="answer-input" class="text-input"
                           placeholder="Bilde den Satz..." autocomplete="off">
                    <button class="btn-primary" onclick="app.checkAnswer()">Prüfen</button>
                </div>

                <div id="hint-area" class="hint-area hidden">
                    <p class="hint"><strong>💡 Hinweis:</strong> ${exercise.hint || ''}</p>
                </div>

                <div id="feedback-area" class="feedback-area hidden"></div>
            </div>
        `;
    }
    /**
     * Show feedback (correct or incorrect)
     */
    showFeedback(isCorrect, message, correctAnswer = null) {
        const feedbackArea = document.getElementById('feedback-area');
        if (!feedbackArea)
            return;
        feedbackArea.className = `feedback-area ${isCorrect ? 'correct' : 'incorrect'}`;
        let html = `<p class="feedback-message">${message}</p>`;
        if (!isCorrect && correctAnswer) {
            html += `<p class="correct-answer">Richtige Antwort: <strong>${correctAnswer}</strong></p>`;
        }
        feedbackArea.innerHTML = html;
        feedbackArea.classList.remove('hidden');
    }
    /**
     * Show hint
     */
    showHint() {
        const hintArea = document.getElementById('hint-area');
        if (hintArea) {
            hintArea.classList.remove('hidden');
        }
    }
    /**
     * Clear feedback and hints
     */
    clearFeedback() {
        const feedbackArea = document.getElementById('feedback-area');
        const hintArea = document.getElementById('hint-area');
        if (feedbackArea) {
            feedbackArea.classList.add('hidden');
            feedbackArea.innerHTML = '';
        }
        if (hintArea) {
            hintArea.classList.add('hidden');
        }
    }
}
// ====================================================================
// MAIN APP
// ====================================================================
class App {
    constructor() {
        this.loader = new ExerciseLoader();
        this.renderer = null;
        this.adaptiveSystem = new window.AdaptiveLearningSystem();
        this.currentUnit = 1;
        this.exercises = [];
        this.currentIndex = 0;
        this.attempts = 0;
        this.settings = this.loadSettings();
        this.stats = {
            correct: 0,
            total: 0
        };
        this.germanHelpUsage = {
            totalExercises: 0,
            helpUsed: 0,
            exercisesWithHelp: []
        };
        this.autoAdvanceTimeout = null;
        this.isNavigating = false;
        this.validator = new window.TolerantAnswerValidator();
        this.feedbackSystem = new window.ImprovedFeedbackSystem();
        this.levelTestSystem = new window.LevelTestSystem();
        this.adaptivePracticeSystem = new window.AdaptivePracticeSystem();
    }
    /**
     * Initialize and start the app
     */
    async init() {
        window.Logger?.debug('Starting Spanish Learning App...');
        const loaderId = window.LoadingManager?.show('exercise-area', 'Uebungen werden geladen...');
        try {
            const container = document.getElementById('exercise-area');
            if (!container) {
                throw new Error('Exercise container not found');
            }
            this.renderer = new ExerciseRenderer(container);
            await this.loadUnit(1);
            this.buildSidebar();
            this.loadGermanHelpUsage();
            const savedProgress = this.loadProgress();
            let startIndex = 0;
            if (savedProgress && savedProgress.unit === this.currentUnit) {
                startIndex = savedProgress.index;
                this.stats = savedProgress.stats;
                window.Logger?.info(`Continuing from exercise ${startIndex + 1}/${this.exercises.length}`);
            }
            else {
                window.Logger?.debug('Starting fresh');
            }
            window.LoadingManager?.hide(loaderId);
            this.showExercise(startIndex);
            this.setupNavigationButtons();
            this.setupSettingsButton();
            this.setupSidebarToggle();
            window.Logger?.success('App ready!');
        }
        catch (error) {
            window.LoadingManager?.hide(loaderId);
            window.ErrorBoundary?.handleError(error, { context: 'App initialization' });
        }
    }
    /**
     * Setup navigation buttons
     */
    setupNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previous());
        }
    }
    /**
     * Setup sidebar toggle (desktop and mobile)
     */
    setupSidebarToggle() {
        const toggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        if (toggle && sidebar) {
            const savedState = localStorage.getItem('sidebar-collapsed');
            if (savedState === 'true') {
                sidebar.classList.add('collapsed');
                document.body.classList.add('sidebar-collapsed');
            }
            toggle.addEventListener('click', () => {
                const isCollapsed = sidebar.classList.toggle('collapsed');
                document.body.classList.toggle('sidebar-collapsed', isCollapsed);
                localStorage.setItem('sidebar-collapsed', String(isCollapsed));
                toggle.textContent = isCollapsed ? '☰' : '✕';
            });
            toggle.textContent = sidebar.classList.contains('collapsed') ? '☰' : '✕';
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    const exerciseItem = e.target.closest('.exercise-item');
                    if (exerciseItem) {
                        sidebar.classList.add('collapsed');
                        document.body.classList.add('sidebar-collapsed');
                        toggle.textContent = '☰';
                    }
                }
            });
        }
    }
    /**
     * Toggle German help visibility and track usage
     */
    toggleGermanHelp(button) {
        const helpArea = button.nextElementSibling;
        if (!helpArea)
            return;
        const isOpening = helpArea.classList.contains('hidden');
        helpArea.classList.toggle('hidden');
        button.classList.toggle('active');
        const textSpan = button.querySelector('.toggle-text');
        if (textSpan) {
            textSpan.textContent = isOpening ? 'Deutsche Hilfe ausblenden' : 'Deutsche Hilfe anzeigen';
        }
        if (isOpening) {
            this.trackGermanHelpUsage();
        }
    }
    /**
     * Track German help usage for adaptive learning
     */
    trackGermanHelpUsage() {
        const exercise = this.exercises[this.currentIndex];
        if (!exercise)
            return;
        this.germanHelpUsage.helpUsed++;
        if (!this.germanHelpUsage.exercisesWithHelp.includes(exercise.id || '')) {
            this.germanHelpUsage.exercisesWithHelp.push(exercise.id || '');
        }
        this.saveGermanHelpUsage();
        if (window.Logger && window.__DEV__) {
            const usagePercent = Math.round((this.germanHelpUsage.helpUsed / Math.max(this.germanHelpUsage.totalExercises, 1)) * 100);
            window.Logger.debug(`German help used: ${this.germanHelpUsage.helpUsed}/${this.germanHelpUsage.totalExercises} (${usagePercent}%)`);
        }
    }
    /**
     * Load a unit
     */
    async loadUnit(unitNumber) {
        try {
            window.Logger?.info(`Loading Unit ${unitNumber} (Adaptive Mode)...`);
            const allExercises = [];
            for (let unit = 1; unit <= 7; unit++) {
                const data = await this.loader.loadUnit(unit);
                data.exercises.forEach(ex => {
                    allExercises.push({
                        ...ex,
                        unitNumber: unit,
                        unitName: data.metadata?.title || `Unit ${unit}`
                    });
                });
            }
            window.Logger?.info(`Loaded ${allExercises.length} total exercises from all units`);
            this.exercises = this.adaptiveSystem.createAdaptiveSequence(allExercises, 50);
            window.Logger?.success(`Created adaptive sequence: ${this.exercises.length} exercises`);
            this.currentUnit = unitNumber;
            this.currentIndex = 0;
            this.attempts = 0;
            this.updateProgress();
            this.showAdaptiveRecommendations();
        }
        catch (error) {
            window.Logger?.error('Error loading adaptive exercises:', error);
            window.ErrorBoundary?.handleError(error, { context: `Loading Unit ${unitNumber}` });
            throw error;
        }
    }
    /**
     * Show exercise at index
     */
    showExercise(index) {
        if (index < 0 || index >= this.exercises.length) {
            window.Logger?.debug('Unit complete!');
            this.showCompletion();
            return;
        }
        this.currentIndex = index;
        this.attempts = 0;
        const exercise = this.exercises[index];
        this.germanHelpUsage.totalExercises++;
        window.Logger?.debug(`Exercise ${index + 1}/${this.exercises.length}: ${exercise.type} (${exercise.id})`);
        if (this.renderer) {
            this.renderer.clearFeedback();
            this.renderer.render(exercise, (answer) => this.handleAnswer(answer));
        }
        this.setupAnswerButtons();
        const input = document.getElementById('answer-input');
        if (input) {
            input.focus();
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkAnswer();
                }
            });
        }
        this.updateProgress();
    }
    /**
     * Setup answer buttons
     */
    setupAnswerButtons() {
        const buttons = document.querySelectorAll('.btn-option');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const answer = btn.dataset.answer;
                if (answer) {
                    this.handleAnswer(answer);
                }
            });
        });
    }
    /**
     * Check answer (for text input exercises)
     */
    checkAnswer() {
        const input = document.getElementById('answer-input');
        if (!input)
            return;
        const answer = input.value.trim();
        if (!answer) {
            alert('Bitte gib eine Antwort ein!');
            return;
        }
        this.handleAnswer(answer);
    }
    /**
     * Handle user answer
     */
    handleAnswer(userAnswer) {
        console.log('[App] handleAnswer called with:', userAnswer);
        const exercise = this.exercises[this.currentIndex];
        console.log('[App] Current exercise:', exercise.type, exercise.id);
        let correctAnswer;
        if (exercise.type === 'reading-comprehension' && exercise.comprehensionCheck) {
            correctAnswer = exercise.comprehensionCheck.correctAnswer;
        }
        else {
            correctAnswer = exercise.answer || '';
        }
        console.log('[App] Correct answer:', correctAnswer);
        const validationResult = this.validator.validateAnswer(userAnswer, correctAnswer, exercise);
        console.log('[App] Validation result:', validationResult);
        this.stats.total++;
        if (validationResult.isCorrect) {
            this.stats.correct++;
        }
        else {
            this.attempts++;
            const maxAttempts = this.getMaxAttemptsBeforeHint();
            if (this.attempts >= maxAttempts && exercise.hint && this.renderer) {
                this.renderer.showHint();
            }
        }
        this.adaptiveSystem.recordAttempt(exercise, validationResult.isCorrect);
        this.saveProgress();
        console.log('[App] About to call feedbackSystem.showValidationResult');
        this.feedbackSystem.showValidationResult(validationResult, exercise);
        console.log('[App] After feedbackSystem.showValidationResult');
        this.disableInput();
    }
    /**
     * Disable input and buttons after answer submission
     */
    disableInput() {
        const input = document.getElementById('answer-input');
        if (input) {
            input.disabled = true;
        }
        const buttons = document.querySelectorAll('.btn-option, .btn-primary');
        buttons.forEach(btn => btn.disabled = true);
    }
    /**
     * Show next button with context-aware label
     */
    showNextButton() {
        const feedbackArea = document.getElementById('feedback-area');
        if (!feedbackArea)
            return;
        if (document.getElementById('next-btn'))
            return;
        const isLastExercise = this.currentIndex >= this.exercises.length - 1;
        const buttonText = isLastExercise ? 'Lektion abschliessen →' : 'Naechste Uebung →';
        const nextBtn = document.createElement('button');
        nextBtn.id = 'next-btn';
        nextBtn.className = 'btn-primary';
        nextBtn.textContent = buttonText;
        nextBtn.onclick = () => this.next();
        feedbackArea.appendChild(nextBtn);
        nextBtn.focus();
    }
    /**
     * Go to next exercise
     */
    next() {
        if (this.isNavigating)
            return;
        if (this.autoAdvanceTimeout) {
            clearTimeout(this.autoAdvanceTimeout);
            this.autoAdvanceTimeout = null;
        }
        this.isNavigating = true;
        this.showExercise(this.currentIndex + 1);
        this.saveProgress();
        setTimeout(() => {
            this.isNavigating = false;
        }, 100);
    }
    /**
     * Go to previous exercise
     */
    previous() {
        if (this.isNavigating)
            return;
        if (this.currentIndex > 0) {
            if (this.autoAdvanceTimeout) {
                clearTimeout(this.autoAdvanceTimeout);
                this.autoAdvanceTimeout = null;
            }
            this.isNavigating = true;
            this.showExercise(this.currentIndex - 1);
            this.saveProgress();
            setTimeout(() => {
                this.isNavigating = false;
            }, 100);
        }
    }
    /**
     * Jump to specific exercise
     */
    jumpToExercise(index) {
        if (this.isNavigating)
            return;
        if (index >= 0 && index < this.exercises.length) {
            if (this.autoAdvanceTimeout) {
                clearTimeout(this.autoAdvanceTimeout);
                this.autoAdvanceTimeout = null;
            }
            this.isNavigating = true;
            this.showExercise(index);
            this.saveProgress();
            setTimeout(() => {
                this.isNavigating = false;
            }, 100);
        }
    }
    /**
     * Update progress display with enhanced visual indicators
     */
    updateProgress() {
        const progressEl = document.getElementById('progress');
        if (!progressEl)
            return;
        const currentEx = this.currentIndex + 1;
        const totalEx = this.exercises.length;
        const percentage = Math.round((currentEx / totalEx) * 100);
        const currentExercise = this.exercises[this.currentIndex];
        const conceptLabel = currentExercise ? this.getConceptLabel(currentExercise.concept || '') : '';
        const conceptDisplay = conceptLabel && conceptLabel !== 'Allgemein' ? ` • ${conceptLabel}` : '';
        progressEl.innerHTML = `
            <span class="progress-text">
                Lektion ${this.currentUnit}${conceptDisplay} • Uebung ${currentEx}/${totalEx} (${percentage}%)
            </span>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
        `;
        this.updateSidebar();
        this.updateNavigationButtons();
    }
    /**
     * Build sidebar navigation
     */
    buildSidebar() {
        const nav = document.getElementById('exercise-nav');
        if (!nav)
            return;
        nav.innerHTML = '';
        const unitSelector = document.createElement('div');
        unitSelector.className = 'unit-selector';
        unitSelector.style.cssText = `
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid var(--border);
        `;
        const selectLabel = document.createElement('div');
        selectLabel.textContent = 'Lektion auswählen:';
        selectLabel.style.cssText = `
            font-size: 12px;
            color: var(--text-muted);
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        `;
        unitSelector.appendChild(selectLabel);
        const select = document.createElement('select');
        select.style.cssText = `
            width: 100%;
            padding: 8px 12px;
            border: 2px solid var(--border);
            border-radius: 6px;
            background: var(--bg);
            color: var(--text);
            font-family: inherit;
            font-size: 14px;
            cursor: pointer;
        `;
        for (let i = 1; i <= 7; i++) {
            const option = document.createElement('option');
            option.value = String(i);
            option.textContent = `Lektion ${i}`;
            if (i === this.currentUnit) {
                option.selected = true;
            }
            select.appendChild(option);
        }
        select.addEventListener('change', async (e) => {
            const newUnit = parseInt(e.target.value);
            if (newUnit !== this.currentUnit) {
                if (confirm(`Möchtest du zu Lektion ${newUnit} wechseln? Dein Fortschritt wird gespeichert.`)) {
                    await this.switchToUnit(newUnit);
                }
                else {
                    e.target.value = String(this.currentUnit);
                }
            }
        });
        unitSelector.appendChild(select);
        nav.appendChild(unitSelector);
        const groupedExercises = this.groupExercisesByConcept();
        for (const [concept, exercises] of Object.entries(groupedExercises)) {
            const section = document.createElement('div');
            section.className = 'unit-section';
            const firstEx = exercises[0]?.exercise;
            const conceptKey = firstEx?.concept || 'general';
            const mastery = this.adaptiveSystem.getConceptMastery(conceptKey);
            const masteryPercent = Math.round(mastery * 100);
            const title = document.createElement('div');
            title.className = 'unit-title';
            title.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';
            const conceptName = document.createElement('span');
            conceptName.textContent = concept;
            const masteryBadge = document.createElement('span');
            masteryBadge.style.cssText = `
                font-size: 11px;
                padding: 2px 8px;
                border-radius: 12px;
                background: ${mastery >= 0.8 ? '#4CAF50' : mastery >= 0.5 ? '#FF9800' : '#f44336'};
                color: white;
            `;
            masteryBadge.textContent = `${masteryPercent}%`;
            title.appendChild(conceptName);
            title.appendChild(masteryBadge);
            section.appendChild(title);
            const list = document.createElement('ul');
            list.className = 'exercise-list';
            exercises.forEach(({ exercise, index }) => {
                const item = document.createElement('li');
                item.className = 'exercise-item';
                item.dataset.index = String(index);
                const number = document.createElement('span');
                number.className = 'exercise-number';
                number.textContent = `${index + 1}.`;
                const label = document.createElement('span');
                label.textContent = this.getExerciseLabel(exercise);
                item.appendChild(number);
                item.appendChild(label);
                item.addEventListener('click', () => {
                    this.jumpToExercise(index);
                });
                list.appendChild(item);
            });
            section.appendChild(list);
            nav.appendChild(section);
        }
    }
    /**
     * Switch to a different unit
     */
    async switchToUnit(unitNumber) {
        try {
            this.saveProgress();
            this.stats = { correct: 0, total: 0 };
            await this.loadUnit(unitNumber);
            this.buildSidebar();
            this.showExercise(0);
            this.saveProgress();
            window.Logger?.success(`Zu Lektion ${unitNumber} gewechselt!`);
        }
        catch (error) {
            window.Logger?.error('Error switching unit:', error);
            alert(`Fehler beim Wechseln zu Lektion ${unitNumber}. Bitte versuche es erneut.`);
        }
    }
    /**
     * Group exercises by concept for sidebar
     */
    groupExercisesByConcept() {
        const groups = {};
        this.exercises.forEach((exercise, index) => {
            const concept = exercise.concept || 'Allgemein';
            const groupName = this.getConceptLabel(concept);
            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push({ exercise, index });
        });
        return groups;
    }
    /**
     * Get label for exercise in sidebar
     */
    getExerciseLabel(exercise) {
        if (exercise.question) {
            return exercise.question.substring(0, 30) + (exercise.question.length > 30 ? '...' : '');
        }
        return exercise.type || 'Übung';
    }
    /**
     * Get readable label for concept
     */
    getConceptLabel(concept) {
        const labels = {
            'ser-conjugation': 'SER Konjugation',
            'estar-conjugation': 'ESTAR Konjugation',
            'tener': 'TENER',
            'ser-estar-contrast': 'SER vs ESTAR',
            'vocabulary': 'Vokabeln',
            'integration': 'Integration'
        };
        for (const [key, label] of Object.entries(labels)) {
            if (concept.includes(key)) {
                return label;
            }
        }
        return concept;
    }
    /**
     * Update sidebar to highlight current exercise
     */
    updateSidebar() {
        const items = document.querySelectorAll('.exercise-item');
        items.forEach(item => {
            const index = parseInt(item.dataset.index || '0');
            item.classList.remove('active', 'completed');
            if (index === this.currentIndex) {
                item.classList.add('active');
            }
            else if (index < this.currentIndex) {
                item.classList.add('completed');
            }
        });
        const activeItem = document.querySelector('.exercise-item.active');
        if (activeItem) {
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    /**
     * Update navigation button states
     */
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        if (prevBtn) {
            if (this.currentIndex > 0) {
                prevBtn.style.display = 'block';
                prevBtn.disabled = false;
            }
            else {
                prevBtn.disabled = true;
            }
        }
    }
    /**
     * Show completion screen
     */
    showCompletion() {
        const accuracy = Math.round((this.stats.correct / this.stats.total) * 100);
        const emoji = accuracy >= 90 ? '🎉' : accuracy >= 70 ? '👍' : '💪';
        const hasNextUnit = this.currentUnit < 7;
        const completedA1 = this.currentUnit === 7;
        const container = document.getElementById('exercise-area');
        if (!container)
            return;
        container.innerHTML = `
            <div class="completion">
                <div class="completion-emoji">${emoji}</div>
                <h2>Lektion ${this.currentUnit} abgeschlossen!</h2>
                <div class="completion-stats">
                    <p class="score">${this.stats.correct}/${this.stats.total} richtig</p>
                    <p class="accuracy">${accuracy}% Genauigkeit</p>
                </div>

                ${completedA1 ? `
                    <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white;">
                        <h3 style="margin: 0 0 15px 0; font-size: 24px;">🎓 ¡Felicidades!</h3>
                        <p style="margin: 0 0 20px 0; font-size: 16px;">
                            ¡Has completado todas las lecciones de nivel A1!
                        </p>
                        <button class="btn-primary" onclick="app.startLevelTest('A1')"
                                style="background: white; color: #667eea; margin-bottom: 10px;">
                            📝 Hacer Examen de Nivel A1
                        </button>
                    </div>
                    <button class="btn-primary" onclick="app.restartCurrentUnit()"
                            style="background: var(--bg); color: var(--text); border: 2px solid var(--border); margin-top: 10px;">
                        Repetir Lektion 7
                    </button>
                ` : hasNextUnit ? `
                    <button class="btn-primary" onclick="app.loadNextUnit()" style="margin-bottom: 10px;">
                        Weiter zu Lektion ${this.currentUnit + 1} →
                    </button>
                    <button class="btn-primary" onclick="app.restartCurrentUnit()"
                            style="background: var(--bg); color: var(--text); border: 2px solid var(--border);">
                        Lektion ${this.currentUnit} wiederholen
                    </button>
                ` : `
                    <p style="margin: 20px 0; font-size: 18px; color: var(--text-muted);">
                        🎓 Du hast alle verfügbaren Lektionen abgeschlossen!
                    </p>
                    <button class="btn-primary" onclick="location.reload()">
                        Nochmal üben
                    </button>
                `}
            </div>
        `;
        if (completedA1) {
            this.markUnitComplete(7);
        }
    }
    /**
     * Mark unit as completed
     */
    markUnitComplete(unitNumber) {
        try {
            const progress = JSON.parse(localStorage.getItem('spanish-app-progress') || '{}');
            if (!progress.completedUnits) {
                progress.completedUnits = [];
            }
            if (!progress.completedUnits.includes(unitNumber)) {
                progress.completedUnits.push(unitNumber);
            }
            localStorage.setItem('spanish-app-progress', JSON.stringify(progress));
        }
        catch (error) {
            console.error('Error marking unit complete:', error);
        }
    }
    /**
     * Start level test
     */
    async startLevelTest(level) {
        try {
            window.Logger?.info(`Starting ${level} level test...`);
            const test = this.levelTestSystem.getTestById(level);
            if (!test) {
                alert('Test not found!');
                return;
            }
            const proceed = confirm(`Examen de Nivel ${level}\n\n` +
                `${test.description}\n\n` +
                `Tiempo: ${test.timeLimit} minutos\n` +
                `Puntuación mínima: ${test.passingScore}%\n\n` +
                `IMPORTANTE: El examen está completamente en español sin ayuda en alemán.\n\n` +
                `¿Estás listo para comenzar?`);
            if (!proceed)
                return;
            alert('Test-System wird implementiert! Dies ist eine Vorschau der Funktion.');
        }
        catch (error) {
            window.Logger?.error('Error starting level test:', error);
            alert('Fehler beim Starten des Tests');
        }
    }
    /**
     * Load next unit
     */
    async loadNextUnit() {
        const nextUnit = this.currentUnit + 1;
        if (nextUnit > 7) {
            alert('Du hast bereits alle Lektionen abgeschlossen!');
            return;
        }
        try {
            this.stats = { correct: 0, total: 0 };
            await this.loadUnit(nextUnit);
            this.buildSidebar();
            this.showExercise(0);
            this.saveProgress();
            window.Logger?.success(`Lektion ${nextUnit} gestartet!`);
        }
        catch (error) {
            window.Logger?.error('Error loading next unit:', error);
            alert(`Fehler beim Laden von Lektion ${nextUnit}. Bitte versuche es erneut.`);
        }
    }
    /**
     * Restart current unit
     */
    async restartCurrentUnit() {
        try {
            this.stats = { correct: 0, total: 0 };
            await this.loadUnit(this.currentUnit);
            this.buildSidebar();
            this.showExercise(0);
            this.saveProgress();
            window.Logger?.success(`Lektion ${this.currentUnit} neu gestartet!`);
        }
        catch (error) {
            window.Logger?.error('Error restarting unit:', error);
            alert('Fehler beim Neustarten. Bitte versuche es erneut.');
        }
    }
    /**
     * Load settings from localStorage
     */
    loadSettings() {
        try {
            const stored = localStorage.getItem('spanish-app-settings');
            if (stored) {
                return JSON.parse(stored);
            }
        }
        catch (error) {
            window.Logger?.error('Error loading settings:', error);
        }
        return { helpLevel: 'normal' };
    }
    /**
     * Save settings to localStorage
     */
    saveSettings() {
        try {
            localStorage.setItem('spanish-app-settings', JSON.stringify(this.settings));
            window.Logger?.debug('Settings saved:', this.settings);
        }
        catch (error) {
            window.Logger?.error('Error saving settings:', error);
        }
    }
    /**
     * Save progress to localStorage
     */
    saveProgress() {
        try {
            const progress = {
                unit: this.currentUnit,
                index: this.currentIndex,
                stats: {
                    correct: this.stats.correct,
                    total: this.stats.total
                }
            };
            localStorage.setItem('spanish-app-progress', JSON.stringify(progress));
            window.Logger?.debug('Progress saved:', progress);
        }
        catch (error) {
            window.Logger?.error('Error saving progress:', error);
        }
    }
    /**
     * Load progress from localStorage
     */
    loadProgress() {
        try {
            const stored = localStorage.getItem('spanish-app-progress');
            if (stored) {
                const progress = JSON.parse(stored);
                window.Logger?.debug('Progress loaded:', progress);
                return progress;
            }
        }
        catch (error) {
            window.Logger?.error('Error loading progress:', error);
        }
        return null;
    }
    /**
     * Save German help usage to localStorage
     */
    saveGermanHelpUsage() {
        try {
            localStorage.setItem('spanish-app-german-help', JSON.stringify(this.germanHelpUsage));
            window.Logger?.debug('German help usage saved:', this.germanHelpUsage);
        }
        catch (error) {
            window.Logger?.error('Error saving German help usage:', error);
        }
    }
    /**
     * Load German help usage from localStorage
     */
    loadGermanHelpUsage() {
        try {
            const stored = localStorage.getItem('spanish-app-german-help');
            if (stored) {
                this.germanHelpUsage = JSON.parse(stored);
                window.Logger?.debug('German help usage loaded:', this.germanHelpUsage);
            }
        }
        catch (error) {
            window.Logger?.error('Error loading German help usage:', error);
        }
    }
    /**
     * Get max attempts before showing hint
     */
    getMaxAttemptsBeforeHint() {
        const mapping = {
            'keine': 999,
            'normal': 3,
            'viel': 1
        };
        return mapping[this.settings.helpLevel] || 3;
    }
    /**
     * Setup settings button
     */
    setupSettingsButton() {
        const settingsBtn = document.getElementById('settings-btn');
        if (!settingsBtn)
            return;
        settingsBtn.addEventListener('click', () => {
            this.showSettingsModal();
        });
    }
    /**
     * Show settings modal
     */
    showSettingsModal() {
        const modal = document.getElementById('settings-modal');
        if (!modal)
            return;
        modal.classList.remove('hidden');
        const radio = document.querySelector(`input[name="help"][value="${this.settings.helpLevel}"]`);
        if (radio) {
            radio.checked = true;
        }
        const saveBtn = document.getElementById('save-settings');
        if (saveBtn) {
            saveBtn.onclick = () => {
                const selected = document.querySelector('input[name="help"]:checked');
                if (selected) {
                    this.settings.helpLevel = selected.value;
                    this.saveSettings();
                    alert('✅ Einstellungen gespeichert!');
                    modal.classList.add('hidden');
                }
            };
        }
        const closeBtn = document.getElementById('close-settings');
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.classList.add('hidden');
            };
        }
    }
    /**
     * Show adaptive learning recommendations
     */
    showAdaptiveRecommendations() {
        const recommendations = this.adaptiveSystem.getRecommendations();
        const stats = this.adaptiveSystem.getStatistics();
        console.log('🎯 Adaptive Learning Recommendations:', recommendations);
        console.log('📊 Learning Statistics:', stats);
        const sidebar = document.getElementById('sidebar');
        if (!sidebar)
            return;
        let adaptivePanel = document.getElementById('adaptive-panel');
        if (!adaptivePanel) {
            adaptivePanel = document.createElement('div');
            adaptivePanel.id = 'adaptive-panel';
            adaptivePanel.style.cssText = `
                background: rgba(32, 178, 170, 0.1);
                border: 2px solid var(--primary);
                border-radius: 8px;
                padding: 15px;
                margin: 15px 0;
            `;
            const sidebarHeader = sidebar.querySelector('.sidebar-header');
            if (sidebarHeader && sidebarHeader.nextSibling) {
                sidebar.insertBefore(adaptivePanel, sidebarHeader.nextSibling);
            }
        }
        let html = '<div style="font-size: 14px;">';
        const masteryPercent = Math.round(recommendations.overallMastery * 100);
        html += `<div style="margin-bottom: 10px;">
            <strong>🎯 Gesamtfortschritt:</strong> ${masteryPercent}%
            <div style="background: #ddd; height: 8px; border-radius: 4px; margin-top: 5px;">
                <div style="background: var(--primary); height: 100%; width: ${masteryPercent}%; border-radius: 4px;"></div>
            </div>
        </div>`;
        if (recommendations.weakConcepts.length > 0) {
            html += '<div style="margin-bottom: 10px;"><strong>⚠️ Schwache Bereiche:</strong><ul style="margin: 5px 0; padding-left: 20px;">';
            recommendations.weakConcepts.slice(0, 3).forEach((weak) => {
                const percent = Math.round(weak.mastery * 100);
                html += `<li style="font-size: 12px;">${weak.concept}: ${percent}%</li>`;
            });
            html += '</ul></div>';
        }
        html += `<div style="margin-bottom: 10px;">
            <strong>📈 Empfohlene Schwierigkeit:</strong> Level ${recommendations.nextDifficulty}/5
        </div>`;
        if (recommendations.reviewExercises.length > 0) {
            html += `<div>
                <strong>🔄 Zu wiederholen:</strong> ${recommendations.reviewExercises.length} Übungen
            </div>`;
        }
        html += '</div>';
        adaptivePanel.innerHTML = html;
    }
}
// ====================================================================
// INITIALIZATION
// ====================================================================
window.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    window.app = app;
    app.init();
});
// Make classes available globally for backwards compatibility
window.ExerciseLoader = ExerciseLoader;
window.ExerciseRenderer = ExerciseRenderer;
window.App = App;
//# sourceMappingURL=app-core.js.map