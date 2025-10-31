/**
 * @fileoverview App Core - Consolidated Module
 *
 * Combines: app.js + exercise-loader.js + exercise-renderer.js
 * Uses inlined exercise data (no fetch() calls, no CORS issues)
 */

import type {
  Exercise,
  ValidationResult,
  UserProgress,
  UserSettings
} from '../types/core.js';

import type { UnitData } from '../types/exercise-data';

// Import classes
import { TolerantAnswerValidator } from './tolerant-validator.js';
import { ImprovedFeedbackSystem } from './improved-feedback.js';
import { AdaptivePracticeSystem } from './adaptive-practice-system.js';

// ====================================================================
// Type Definitions
// ====================================================================

interface LoadedUnit {
  metadata: any;
  phases: any;
  exercises: Exercise[];
}

interface UnitInfo {
  number: number;
  title: string;
  totalExercises: number;
  estimatedTime: string;
  phases: any;
}

interface GermanHelpUsage {
  totalExercises: number;
  helpUsed: number;
  exercisesWithHelp: string[];
}

interface AppStats {
  correct: number;
  total: number;
}

interface ParsedText {
  spanish: string;
  german: string | null;
}

// ====================================================================
// EXERCISE LOADER (No fetch() - uses inlined data)
// ====================================================================

class ExerciseLoader {
    private units: Record<number, UnitData>;

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
    async loadUnit(unitNumber: number): Promise<LoadedUnit> {
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
    async getUnitInfo(unitNumber: number): Promise<UnitInfo> {
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
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    /**
     * Extract German translation from text (text in parentheses)
     */
    extractGermanTranslation(text: string): ParsedText {
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
    renderGermanHelp(germanTranslation?: string | null, germanBridge?: string | null, example?: string | null): string {
        const hasAnyHelp = germanTranslation || germanBridge || example;
        if (!hasAnyHelp) return '';

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
    render(exercise: Exercise, onAnswer?: (answer: string) => void): void {
        this.container.innerHTML = '';

        // Add phase badge
        if (exercise.phase) {
            const phaseBadge = this.renderPhaseBadge(exercise.phase);
            this.container.innerHTML += phaseBadge;
        }

        // Render based on type
        let html = '';

        // Use string type for switch since exercise types may extend beyond ExerciseType enum
        switch (exercise.type as string) {
            case 'vocabulary-card':
                html = this.renderVocabularyCard(exercise);
                break;
            case 'vocabulary-in-context':
                html = this.renderVocabularyInContext(exercise);
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
    renderPhaseBadge(phase: string): string {
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
    renderVocabularyCard(exercise: Exercise, onNext?: () => void): string {
        const ex = exercise as any; // Extended properties not in base Exercise type
        return `
            <div class="vocab-card">
                <div class="vocab-word-display">
                    ${ex.emoji ? `<div class="emoji">${ex.emoji}</div>` : ''}
                    <div class="word">${ex.word}</div>
                    <div class="translation">${ex.translation}</div>
                </div>

                ${ex.germanBridge ? `
                    <div class="german-bridge">${ex.germanBridge}</div>
                ` : ''}

                ${ex.explanation ? `
                    <p class="explanation">${ex.explanation}</p>
                ` : ''}

                ${ex.mnemonic ? `
                    <p class="mnemonic"><strong>💡 Merkhilfe:</strong> ${ex.mnemonic}</p>
                ` : ''}

                ${ex.exampleSentence ? `
                    <div class="example">
                        <div class="example-es">"${ex.exampleSentence}"</div>
                        ${ex.exampleTranslation ? `
                            <div class="example-de">${ex.exampleTranslation}</div>
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
    renderVocabularyInContext(exercise: Exercise, onNext?: () => void): string {
        const ex = exercise as any; // Extended properties not in base Exercise type
        return `
            <div class="vocab-context">
                <div class="vocab-word-display">
                    ${ex.emoji ? `<div class="emoji">${ex.emoji}</div>` : ''}
                    <div class="word">${ex.word}</div>
                    <div class="translation">= ${ex.translation}</div>
                </div>

                <div class="examples-title">📚 Verwendung in Sätzen:</div>
                <div class="examples-list">
                    ${ex.exampleSentences.map((ex, i) => `
                        <div class="example-item">
                            <div class="example-number">${i + 1}.</div>
                            <div class="example-content">
                                <div class="example-es">${ex.es}</div>
                                <div class="example-de">→ ${ex.de}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                ${ex.usage ? `
                    <p class="usage-tip"><strong>💡 Tipp:</strong> ${ex.usage}</p>
                ` : ''}

                <button class="btn-primary" onclick="app.next()">Verstanden, weiter →</button>
            </div>
        `;
    }

    /**
     * Render reading comprehension
     */
    renderReadingComprehension(exercise: Exercise, onAnswer?: (answer: string) => void): string {
        const ex = exercise as any; // Extended properties not in base Exercise type
        const parsed = this.extractGermanTranslation(exercise.question);

        return `
            <div class="reading-comprehension">
                <p class="question">${parsed.spanish}</p>

                <div class="dialog-box">
                    <div class="dialog-title">📖 Dialog:</div>
                    ${ex.dialog.map(line => `
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
                    ${ex.translation.map(line => `
                        <p class="translation-line">
                            <strong>${line.speaker}:</strong> ${line.text}
                        </p>
                    `).join('')}
                </div>

                ${ex.newVocabulary ? `
                    <div class="vocab-highlight">
                        <strong>📝 Neue Wörter:</strong> ${ex.newVocabulary.join(', ')}
                    </div>
                ` : ''}

                <div class="comprehension-check">
                    <p class="check-question">${ex.comprehensionCheck.question}</p>
                    <div class="options">
                        ${ex.comprehensionCheck.options.map((opt, i) => `
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
    renderFillBlank(exercise: Exercise, onAnswer?: (answer: string) => void): string {
        const ex = exercise as any;
        const parsed = this.extractGermanTranslation(exercise.question);

        return `
            <div class="fill-blank">
                <p class="question">${parsed.spanish}</p>

                ${this.renderGermanHelp(parsed.german, exercise.germanBridge, ex.example)}

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
    renderConjugation(exercise: Exercise, onAnswer?: (answer: string) => void): string {
        const ex = exercise as any;
        return `
            <div class="conjugation">
                <p class="question">${exercise.question}</p>

                ${exercise.germanBridge ? `
                    <div class="german-bridge">${exercise.germanBridge}</div>
                ` : ''}

                ${ex.note ? `
                    <p class="note"><strong>📌 Hinweis:</strong> ${ex.note}</p>
                ` : ''}

                <div class="input-group">
                    <input type="text" id="answer-input" class="text-input"
                           placeholder="Deine Antwort..." autocomplete="off">
                    <button class="btn-primary" onclick="app.checkAnswer()">Prüfen</button>
                </div>

                ${ex.mnemonic ? `
                    <div id="hint-area" class="hint-area hidden">
                        <p class="hint"><strong>💡 Merkhilfe:</strong> ${ex.mnemonic}</p>
                    </div>
                ` : ''}

                <div id="feedback-area" class="feedback-area hidden"></div>

                ${ex.examples && ex.examples.length > 0 ? `
                    <div class="examples-box hidden" id="examples-box">
                        <strong>📚 Beispiele:</strong>
                        ${ex.examples.map(ex => `<p class="example">${ex}</p>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render generic text-input exercise (used for many exercise types)
     */
    renderGenericTextInput(exercise: Exercise, onAnswer?: (answer: string) => void): string {
        const ex = exercise as any;
        // Get exercise type label for display
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

        const typeLabel = typeLabels[exercise.type] || exercise.type;

        return `
            <div class="generic-text-input ${exercise.type}">
                <div class="exercise-type-badge">${typeLabel}</div>

                <p class="question">${exercise.question}</p>

                ${exercise.germanBridge ? `
                    <div class="german-bridge">${exercise.germanBridge}</div>
                ` : ''}

                ${ex.note ? `
                    <p class="note"><strong>📌 Hinweis:</strong> ${ex.note}</p>
                ` : ''}

                ${ex.warning ? `
                    <p class="warning"><strong>${ex.warning}</strong></p>
                ` : ''}

                ${ex.rule ? `
                    <p class="rule"><strong>📏 Regel:</strong> ${ex.rule}</p>
                ` : ''}

                ${ex.context ? `
                    <p class="context"><em>${ex.context}</em></p>
                ` : ''}

                <div class="input-group">
                    <textarea id="answer-input" class="text-input-area"
                           placeholder="Deine Antwort..." rows="3" autocomplete="off"></textarea>
                    <button class="btn-primary" onclick="app.checkAnswer()">Prüfen</button>
                </div>

                ${ex.mnemonic ? `
                    <div id="hint-area" class="hint-area hidden">
                        <p class="hint"><strong>💡 Merkhilfe:</strong> ${ex.mnemonic}</p>
                    </div>
                ` : ''}

                ${exercise.hint ? `
                    <div id="hint-area" class="hint-area hidden">
                        <p class="hint"><strong>💡 Hinweis:</strong> ${exercise.hint}</p>
                    </div>
                ` : ''}

                <div id="feedback-area" class="feedback-area hidden"></div>

                ${ex.examples && ex.examples.length > 0 ? `
                    <div class="examples-box hidden" id="examples-box">
                        <strong>📚 Beispiele:</strong>
                        ${ex.examples.map(ex => `<p class="example">${ex}</p>`).join('')}
                    </div>
                ` : ''}

                ${ex.breakdown ? `
                    <div class="breakdown-box hidden" id="breakdown-box">
                        <strong>🔍 Analyse:</strong>
                        ${Object.entries(ex.breakdown).map(([key, value]) =>
                            `<p class="breakdown-item"><strong>${key}:</strong> ${value}</p>`
                        ).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render multiple-choice exercise
     */
    renderMultipleChoice(exercise: Exercise, onAnswer?: (answer: string) => void): string {
        const ex = exercise as any;
        const parsed = this.extractGermanTranslation(exercise.question);

        return `
            <div class="multiple-choice">
                <p class="question">${parsed.spanish}</p>

                ${this.renderGermanHelp(parsed.german, exercise.germanBridge, null)}

                <div class="options">
                    ${ex.options.map((opt, i) => `
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
    renderTranslation(exercise: Exercise, onAnswer?: (answer: string) => void): string {
        const parsed = this.extractGermanTranslation(exercise.question);

        return `
            <div class="translation">
                <p class="question">${parsed.spanish}</p>

                ${this.renderGermanHelp(parsed.german, exercise.germanBridge, null)}

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
    renderSentenceBuilding(exercise: Exercise, onAnswer?: (answer: string) => void): string {
        const ex = exercise as any;
        const parsed = this.extractGermanTranslation(exercise.question);

        return `
            <div class="sentence-building">
                <p class="question">${parsed.spanish}</p>

                ${this.renderGermanHelp(parsed.german, exercise.germanBridge, null)}

                <p class="instruction">Verwende die Wörter: ${ex.words.join(', ')}</p>

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
    showFeedback(isCorrect: boolean, message: string, correctAnswer: string | null = null): void {
        const feedbackArea = document.getElementById('feedback-area');
        if (!feedbackArea) return;

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
    showHint(): void {
        const hintArea = document.getElementById('hint-area');
        if (hintArea) {
            hintArea.classList.remove('hidden');
        }
    }

    /**
     * Clear feedback and hints
     */
    clearFeedback(): void {
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
    private loader: ExerciseLoader;
    private renderer: ExerciseRenderer | null;
    private adaptiveSystem: any;
    private currentUnit: number;
    private exercises: Exercise[];
    private currentIndex: number;
    private attempts: number;
    private settings: UserSettings;
    private stats: AppStats;
    private germanHelpUsage: GermanHelpUsage;
    public autoAdvanceTimeout: number | null;
    private isNavigating: boolean;
    private validator: any;
    private feedbackSystem: any;
    private levelTestSystem: any;
    private adaptivePracticeSystem: any;

    constructor() {
        this.loader = new ExerciseLoader();
        this.renderer = null; // Will be set when container is ready

        // Initialize Adaptive Learning System
        this.adaptiveSystem = new window.AdaptiveLearningSystem();

        this.currentUnit = 1;
        this.exercises = [];
        this.currentIndex = 0;
        this.attempts = 0; // Attempts for current exercise

        this.settings = this.loadSettings();

        this.stats = {
            correct: 0,
            total: 0
        };

        // Track German help usage for adaptive learning
        this.germanHelpUsage = {
            totalExercises: 0,
            helpUsed: 0,
            exercisesWithHelp: []
        };

        // Prevent double-navigation race conditions
        this.autoAdvanceTimeout = null;
        this.isNavigating = false;

        // Initialize tolerant validator and improved feedback system
        this.validator = new TolerantAnswerValidator();
        this.feedbackSystem = new ImprovedFeedbackSystem();

        // Initialize level test and adaptive practice systems
        this.levelTestSystem = new LevelTestSystem();
        this.adaptivePracticeSystem = new AdaptivePracticeSystem();
    }

    /**
     * Initialize and start the app
     */
    async init(): Promise<void> {
        window.Logger?.debug('Starting Spanish Learning App...');

        // Show loading state
        const loaderId = window.LoadingManager?.show('exercise-area', 'Uebungen werden geladen...');

        try {
            // Get container
            const container = document.getElementById('exercise-area');
            if (!container) {
                throw new Error('Exercise container not found');
            }

            this.renderer = new ExerciseRenderer(container);

            // Load Unit 1
            await this.loadUnit(1);

            // Build sidebar navigation
            this.buildSidebar();

            // Load German help usage tracking
            this.loadGermanHelpUsage();

            // Check for saved progress
            const savedProgress = this.loadProgress() as any;
            let startIndex = 0;

            if (savedProgress && savedProgress.unit === this.currentUnit) {
                // Restore progress
                startIndex = savedProgress.index;
                this.stats = savedProgress.stats;
                window.Logger?.info(`Continuing from exercise ${startIndex + 1}/${this.exercises.length}`);
            } else {
                window.Logger?.debug('Starting fresh');
            }

            // Hide loading state
            window.LoadingManager?.hide(loaderId);

            // Show exercise (either saved position or first)
            this.showExercise(startIndex);

            // Setup navigation buttons
            this.setupNavigationButtons();

            // Setup settings button
            this.setupSettingsButton();

            // Setup mobile sidebar toggle
            this.setupSidebarToggle();

            window.Logger?.success('App ready!');
        } catch (error) {
            window.LoadingManager?.hide(loaderId);
            window.ErrorBoundary?.handleError(error, { context: 'App initialization' });
        }
    }

    /**
     * Setup navigation buttons
     */
    setupNavigationButtons(): void {
        const prevBtn = document.getElementById('prev-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previous());
        }
    }

    /**
     * Setup sidebar toggle (desktop and mobile)
     */
    setupSidebarToggle(): void {
        const toggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');

        if (toggle && sidebar) {
            // Load saved sidebar state
            const savedState = localStorage.getItem('sidebar-collapsed');
            if (savedState === 'true') {
                sidebar.classList.add('collapsed');
                document.body.classList.add('sidebar-collapsed');
            }

            // Toggle sidebar
            toggle.addEventListener('click', () => {
                const isCollapsed = sidebar.classList.toggle('collapsed');
                document.body.classList.toggle('sidebar-collapsed', isCollapsed);

                // Save state
                localStorage.setItem("sidebar-collapsed", String(isCollapsed));

                // Update toggle icon
                toggle.textContent = isCollapsed ? '☰' : '✕';
            });

            // Set initial toggle icon
            toggle.textContent = sidebar.classList.contains('collapsed') ? '☰' : '✕';

            // Close sidebar when clicking on exercise on mobile
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    const exerciseItem = (e.target as HTMLElement).closest('.exercise-item');
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
    toggleGermanHelp(button: HTMLElement): void {
        const helpArea = button.nextElementSibling;
        if (!helpArea) return;

        const isOpening = helpArea.classList.contains('hidden');

        // Toggle visibility
        helpArea.classList.toggle('hidden');
        button.classList.toggle('active');

        // Update button text
        const textSpan = button.querySelector('.toggle-text');
        if (textSpan) {
            textSpan.textContent = isOpening ? 'Deutsche Hilfe ausblenden' : 'Deutsche Hilfe anzeigen';
        }

        // Track usage for adaptive learning (only when opening)
        if (isOpening) {
            this.trackGermanHelpUsage();
        }
    }

    /**
     * Track German help usage for adaptive learning
     */
    trackGermanHelpUsage(): void {
        const exercise = this.exercises[this.currentIndex];
        if (!exercise) return;

        this.germanHelpUsage.helpUsed++;

        // Track which exercises required help
        if (!this.germanHelpUsage.exercisesWithHelp.includes(exercise.id)) {
            this.germanHelpUsage.exercisesWithHelp.push(exercise.id);
        }

        // Save usage data
        this.saveGermanHelpUsage();

        // Log for analytics (only in debug mode)
        if (window.Logger && window.__DEV__) {
            const usagePercent = Math.round(
                (this.germanHelpUsage.helpUsed / Math.max(this.germanHelpUsage.totalExercises, 1)) * 100
            );
            window.Logger.debug(
                `German help used: ${this.germanHelpUsage.helpUsed}/${this.germanHelpUsage.totalExercises} (${usagePercent}%)`
            );
        }
    }

    /**
     * Load a unit
     */
    async loadUnit(unitNumber: number): Promise<void> {
        try {
            window.Logger?.info(`Loading Unit ${unitNumber} (Adaptive Mode)...`);

            // Load all exercises from all units for adaptive selection
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

            // Create adaptive sequence based on performance
            this.exercises = this.adaptiveSystem.createAdaptiveSequence(allExercises, 50);

            window.Logger?.success(`Created adaptive sequence: ${this.exercises.length} exercises`);

            this.currentUnit = unitNumber;
            this.currentIndex = 0;
            this.attempts = 0;

            // Update progress
            this.updateProgress();

            // Show adaptive recommendations
            this.showAdaptiveRecommendations();

        } catch (error) {
            window.Logger?.error('Error loading adaptive exercises:', error);
            window.ErrorBoundary?.handleError(error, { context: `Loading Unit ${unitNumber}` });
            throw error;
        }
    }

    /**
     * Show exercise at index
     */
    showExercise(index: number): void {
        if (index < 0 || index >= this.exercises.length) {
            window.Logger?.debug('Unit complete!');
            this.showCompletion();
            return;
        }

        this.currentIndex = index;
        this.attempts = 0;

        const exercise = this.exercises[index];

        // Track total exercises for German help usage stats
        this.germanHelpUsage.totalExercises++;

        window.Logger?.debug(`Exercise ${index + 1}/${this.exercises.length}: ${exercise.type} (${exercise.id})`);

        // Clear previous feedback
        this.renderer.clearFeedback();

        // Render exercise
        this.renderer.render(exercise, (answer) => this.handleAnswer(answer));

        // Setup answer buttons if they exist
        this.setupAnswerButtons();

        // Setup Enter key for text input
        const input = document.getElementById('answer-input');
        if (input) {
            input.focus();
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkAnswer();
                }
            });
        }

        // Update progress
        this.updateProgress();
    }

    /**
     * Setup answer buttons
     */
    setupAnswerButtons(): void {
        const buttons = document.querySelectorAll('.btn-option');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const answer = (btn as HTMLElement).dataset.answer;
                this.handleAnswer(answer);
            });
        });
    }

    /**
     * Check answer (for text input exercises)
     */
    checkAnswer(): void {
        const input = document.getElementById('answer-input');
        if (!input) return;

        const answer = (input as HTMLInputElement | HTMLTextAreaElement).value.trim();
        if (!answer) {
            alert('Bitte gib eine Antwort ein!');
            return;
        }

        this.handleAnswer(answer);
    }

    /**
     * Handle user answer
     */
    handleAnswer(userAnswer: string): void {
        console.log('[App] handleAnswer called with:', userAnswer);

        const exercise = this.exercises[this.currentIndex];
        console.log('[App] Current exercise:', exercise.type, exercise.id);

        // Get correct answer (different location for reading-comprehension)
        let correctAnswer;
        if (exercise.type === 'reading-comprehension' && (exercise as any).comprehensionCheck) {
            correctAnswer = (exercise as any).comprehensionCheck.correctAnswer;
        } else {
            correctAnswer = exercise.correctAnswer;
        }

        console.log('[App] Correct answer:', correctAnswer);

        // Use tolerant validator for improved feedback
        const validationResult = this.validator.validateAnswer(
            userAnswer,
            correctAnswer,
            exercise
        );

        console.log('[App] Validation result:', validationResult);

        // Update stats (only based on core correctness)
        this.stats.total++;
        if (validationResult.isCorrect) {
            this.stats.correct++;
        } else {
            this.attempts++;

            // Show hint based on settings (only for incorrect answers)
            const maxAttempts = this.getMaxAttemptsBeforeHint();
            if (this.attempts >= maxAttempts && exercise.hint) {
                this.renderer.showHint();
            }
        }

        // Record attempt in adaptive learning system
        this.adaptiveSystem.recordAttempt(exercise, validationResult.isCorrect);

        // Save progress after updating stats
        this.saveProgress();

        console.log('[App] About to call feedbackSystem.showValidationResult');

        // Show improved feedback
        this.feedbackSystem.showValidationResult(validationResult, exercise);

        console.log('[App] After feedbackSystem.showValidationResult');

        // Disable input/buttons to prevent multiple submissions
        this.disableInput();
    }

    /**
     * Disable input and buttons after answer submission
     */
    disableInput(): void {
        const input = document.getElementById('answer-input');
        if (input) {
            (input as HTMLInputElement | HTMLButtonElement).disabled = true;
        }

        const buttons = document.querySelectorAll('.btn-option, .btn-primary');
        buttons.forEach(btn => ((btn as HTMLButtonElement).disabled = true));
    }

    /**
     * Normalize answer for comparison
     */
    normalizeAnswer(answer: string): string {
        return String(answer)
            .trim()
            .toLowerCase()
            .replace(/[¿?¡!.,;:]/g, '')  // Remove punctuation
            .replace(/[áàâä]/g, 'a')     // Remove accents
            .replace(/[éèêë]/g, 'e')
            .replace(/[íìîï]/g, 'i')
            .replace(/[óòôö]/g, 'o')
            .replace(/[úùûü]/g, 'u')
            .replace(/ñ/g, 'n')
            .replace(/\s+/g, ' ');        // Normalize whitespace
    }

    /**
     * Show next button with context-aware label
     */
    showNextButton(): void {
        const feedbackArea = document.getElementById('feedback-area');
        if (!feedbackArea) return;

        // Check if button already exists
        if (document.getElementById('next-btn')) return;

        // Determine context-aware button label
        const isLastExercise = this.currentIndex >= this.exercises.length - 1;
        const buttonText = isLastExercise
            ? 'Lektion abschliessen →'
            : 'Naechste Uebung →';

        const nextBtn = document.createElement('button');
        nextBtn.id = 'next-btn';
        nextBtn.className = 'btn-primary';
        nextBtn.textContent = buttonText;
        nextBtn.onclick = () => this.next();

        feedbackArea.appendChild(nextBtn);
        nextBtn.focus();
    }

    /**
     * Submit answer (alias for checkAnswer for backward compatibility)
     */
    submit(answer: string): void {
        this.handleAnswer(answer);
    }

    /**
     * Go to next exercise
     */
    next(): void {
        // Prevent race condition: ignore if already navigating
        if (this.isNavigating) {
            return;
        }

        // Clear any pending auto-advance
        if (this.autoAdvanceTimeout) {
            clearTimeout(this.autoAdvanceTimeout);
            this.autoAdvanceTimeout = null;
        }

        this.isNavigating = true;
        this.showExercise(this.currentIndex + 1);
        this.saveProgress();

        // Reset navigation flag after a short delay
        setTimeout(() => {
            this.isNavigating = false;
        }, 100);
    }

    /**
     * Go to previous exercise
     */
    previous(): void {
        if (this.isNavigating) {
            return;
        }

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
    jumpToExercise(index: number): void {
        if (this.isNavigating) {
            return;
        }

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
    updateProgress(): void {
        const progressEl = document.getElementById('progress');
        if (!progressEl) return;

        const currentEx = this.currentIndex + 1;
        const totalEx = this.exercises.length;
        const percentage = Math.round((currentEx / totalEx) * 100);

        // Get current exercise info for context
        const currentExercise = this.exercises[this.currentIndex];
        const conceptLabel = currentExercise ? this.getConceptLabel(currentExercise.concept || '') : '';

        // Show concept if available
        const conceptDisplay = conceptLabel && conceptLabel !== 'Allgemein'
            ? ` • ${conceptLabel}`
            : '';

        progressEl.innerHTML = `
            <span class="progress-text">
                Lektion ${this.currentUnit}${conceptDisplay} • Uebung ${currentEx}/${totalEx} (${percentage}%)
            </span>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
        `;

        // Update sidebar
        this.updateSidebar();

        // Update prev button state
        this.updateNavigationButtons();
    }

    /**
     * Build sidebar navigation
     */
    buildSidebar(): void {
        const nav = document.getElementById('exercise-nav');
        if (!nav) return;

        nav.innerHTML = '';

        // Add unit selector at the top
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
            const newUnit = parseInt(((e.target as HTMLInputElement).value));
            if (newUnit !== this.currentUnit) {
                if (confirm(`Möchtest du zu Lektion ${newUnit} wechseln? Dein Fortschritt wird gespeichert.`)) {
                    await this.switchToUnit(newUnit);
                } else {
                    // Reset selection
                    ((e.target as HTMLInputElement).value) = String(this.currentUnit);
                }
            }
        });

        unitSelector.appendChild(select);
        nav.appendChild(unitSelector);

        // Group exercises by concept if available
        const groupedExercises = this.groupExercisesByConcept();

        for (const [concept, exercises] of Object.entries(groupedExercises)) {
            const section = document.createElement('div');
            section.className = 'unit-section';

            // Get mastery level for this concept
            const firstEx = (exercises[0] as any)?.exercise;
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

            exercises.forEach(({ exercise, index }: any) => {
                const item = document.createElement('li');
                item.className = 'exercise-item';
                (item as HTMLElement).dataset.index = index;

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
            // Save current progress
            this.saveProgress();

            // Reset stats for new unit
            this.stats = {
                correct: 0,
                total: 0
            };

            // Load new unit
            await this.loadUnit(unitNumber);

            // Rebuild sidebar
            this.buildSidebar();

            // Show first exercise
            this.showExercise(0);

            // Save new progress
            this.saveProgress();

            window.Logger?.success(`Zu Lektion ${unitNumber} gewechselt!`);
        } catch (error) {
            window.Logger?.error('Error switching unit:', error);
            alert(`Fehler beim Wechseln zu Lektion ${unitNumber}. Bitte versuche es erneut.`);
        }
    }

    /**
     * Group exercises by concept for sidebar
     */
    groupExercisesByConcept(): Record<string, Exercise[]> {
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
    getExerciseLabel(exercise: Exercise): string {
        if (exercise.question) {
            return exercise.question.substring(0, 30) + (exercise.question.length > 30 ? '...' : '');
        }
        return exercise.type || 'Übung';
    }

    /**
     * Get readable label for concept
     */
    getConceptLabel(concept: string): string {
        const labels = {
            'ser-conjugation': 'SER Konjugation',
            'estar-conjugation': 'ESTAR Konjugation',
            'tener': 'TENER',
            'ser-estar-contrast': 'SER vs ESTAR',
            'vocabulary': 'Vokabeln',
            'integration': 'Integration'
        };

        // Try to find match
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
    updateSidebar(): void {
        const items = document.querySelectorAll('.exercise-item');
        items.forEach(item => {
            const index = parseInt((item as HTMLElement).dataset.index);
            item.classList.remove('active', 'completed');

            if (index === this.currentIndex) {
                item.classList.add('active');
            } else if (index < this.currentIndex) {
                item.classList.add('completed');
            }
        });

        // Scroll active item into view
        const activeItem = document.querySelector('.exercise-item.active');
        if (activeItem) {
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    /**
     * Update navigation button states
     */
    updateNavigationButtons(): void {
        const prevBtn = document.getElementById('prev-btn');
        if (prevBtn) {
            if (this.currentIndex > 0) {
                prevBtn.style.display = 'block';
                (prevBtn as HTMLButtonElement).disabled = false;
            } else {
                (prevBtn as HTMLButtonElement).disabled = true;
            }
        }
    }

    /**
     * Show completion screen
     */
    showCompletion(): void {
        const accuracy = Math.round((this.stats.correct / this.stats.total) * 100);
        const emoji = accuracy >= 90 ? '🎉' : accuracy >= 70 ? '👍' : '💪';

        // Check if there's a next unit
        const hasNextUnit = this.currentUnit < 7; // We have 7 units total

        // Check if user completed Unit 7 (A1 complete)
        const completedA1 = this.currentUnit === 7;

        const container = document.getElementById('exercise-area');
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

        // Mark Unit 7 as completed for level test system
        if (completedA1) {
            this.markUnitComplete(7);
        }
    }

    /**
     * Mark unit as completed
     */
    markUnitComplete(unitNumber: number): void {
        try {
            const progress = JSON.parse(localStorage.getItem('spanish-app-progress') || '{}');
            if (!progress.completedUnits) {
                progress.completedUnits = [];
            }
            if (!progress.completedUnits.includes(unitNumber)) {
                progress.completedUnits.push(unitNumber);
            }
            localStorage.setItem('spanish-app-progress', JSON.stringify(progress));
        } catch (error) {
            console.error('Error marking unit complete:', error);
        }
    }

    /**
     * Start level test
     */
    async startLevelTest(level) {
        try {
            window.Logger?.info(`Starting ${level} level test...`);

            // Get the test
            const test = this.levelTestSystem.getTestById(level);
            if (!test) {
                alert('Test not found!');
                return;
            }

            // Show test instructions
            const proceed = confirm(
                `Examen de Nivel ${level}\n\n` +
                `${test.description}\n\n` +
                `Tiempo: ${test.timeLimit} minutos\n` +
                `Puntuación mínima: ${test.passingScore}%\n\n` +
                `IMPORTANTE: El examen está completamente en español sin ayuda en alemán.\n\n` +
                `¿Estás listo para comenzar?`
            );

            if (!proceed) return;

            // TODO: Implement test UI and flow
            alert('Test-System wird implementiert! Dies ist eine Vorschau der Funktion.');

        } catch (error) {
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
            // Reset stats for new unit
            this.stats = {
                correct: 0,
                total: 0
            };

            // Load next unit
            await this.loadUnit(nextUnit);

            // Rebuild sidebar
            this.buildSidebar();

            // Show first exercise
            this.showExercise(0);

            // Save progress
            this.saveProgress();

            window.Logger?.success(`Lektion ${nextUnit} gestartet!`);
        } catch (error) {
            window.Logger?.error('Error loading next unit:', error);
            alert(`Fehler beim Laden von Lektion ${nextUnit}. Bitte versuche es erneut.`);
        }
    }

    /**
     * Restart current unit
     */
    async restartCurrentUnit() {
        try {
            // Reset stats
            this.stats = {
                correct: 0,
                total: 0
            };

            // Reload current unit
            await this.loadUnit(this.currentUnit);

            // Rebuild sidebar
            this.buildSidebar();

            // Show first exercise
            this.showExercise(0);

            // Save progress
            this.saveProgress();

            window.Logger?.success(`Lektion ${this.currentUnit} neu gestartet!`);
        } catch (error) {
            window.Logger?.error('Error restarting unit:', error);
            alert('Fehler beim Neustarten. Bitte versuche es erneut.');
        }
    }

    /**
     * Load settings from localStorage
     */
    loadSettings(): UserSettings {
        try {
            const stored = localStorage.getItem('spanish-app-settings');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            window.Logger?.error('Error loading settings:', error);
        }

        // Default settings
        return {
            language: 'de',
            theme: 'light',
            soundEnabled: true,
            autoAdvance: true,
            showGermanHelp: true,
            helpLevel: 'normal' // 'keine', 'normal', 'viel'
        } as UserSettings;
    }

    /**
     * Save settings to localStorage
     */
    saveSettings(): void {
        try {
            localStorage.setItem('spanish-app-settings', JSON.stringify(this.settings));
            window.Logger?.debug('Settings saved:', this.settings);
        } catch (error) {
            window.Logger?.error('Error saving settings:', error);
        }
    }

    /**
     * Save progress to localStorage
     */
    saveProgress(): void {
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
        } catch (error) {
            window.Logger?.error('Error saving progress:', error);
        }
    }

    /**
     * Load progress from localStorage
     */
    loadProgress(): UserProgress | null {
        try {
            const stored = localStorage.getItem('spanish-app-progress');
            if (stored) {
                const progress = JSON.parse(stored);
                window.Logger?.debug('Progress loaded:', progress);
                return progress;
            }
        } catch (error) {
            window.Logger?.error('Error loading progress:', error);
        }
        return null;
    }

    /**
     * Save German help usage to localStorage
     */
    saveGermanHelpUsage(): void {
        try {
            localStorage.setItem('spanish-app-german-help', JSON.stringify(this.germanHelpUsage));
            window.Logger?.debug('German help usage saved:', this.germanHelpUsage);
        } catch (error) {
            window.Logger?.error('Error saving German help usage:', error);
        }
    }

    /**
     * Load German help usage from localStorage
     */
    loadGermanHelpUsage(): void {
        try {
            const stored = localStorage.getItem('spanish-app-german-help');
            if (stored) {
                this.germanHelpUsage = JSON.parse(stored);
                window.Logger?.debug('German help usage loaded:', this.germanHelpUsage);
            }
        } catch (error) {
            window.Logger?.error('Error loading German help usage:', error);
        }
    }

    /**
     * Get max attempts before showing hint
     */
    getMaxAttemptsBeforeHint() {
        const mapping = {
            'keine': 999,    // Never show hints
            'normal': 3,     // Show after 3 attempts
            'viel': 1        // Show after 1 attempt
        };

        return mapping[this.settings.helpLevel] || 3;
    }

    /**
     * Setup settings button
     */
    setupSettingsButton(): void {
        const settingsBtn = document.getElementById('settings-btn');
        if (!settingsBtn) return;

        settingsBtn.addEventListener('click', () => {
            this.showSettingsModal();
        });
    }

    /**
     * Show settings modal
     */
    showSettingsModal(): void {
        const modal = document.getElementById('settings-modal');
        if (!modal) return;

        modal.classList.remove('hidden');

        // Set current value
        const radio = document.querySelector(`input[name="help"][value="${this.settings.helpLevel}"]`);
        if (radio) {
            (radio as HTMLInputElement).checked = true;
        }

        // Setup save button
        const saveBtn = document.getElementById('save-settings');
        if (saveBtn) {
            saveBtn.onclick = () => {
                const selected = document.querySelector('input[name="help"]:checked');
                if (selected) {
                    this.settings.helpLevel = (selected as HTMLInputElement).value as any;
                    this.saveSettings();
                    alert('✅ Einstellungen gespeichert!');
                    modal.classList.add('hidden');
                }
            };
        }

        // Setup close button
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

        // Log recommendations to console
        console.log('🎯 Adaptive Learning Recommendations:', recommendations);
        console.log('📊 Learning Statistics:', stats);

        // Update sidebar with adaptive info
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        // Create adaptive info panel
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

            // Insert after sidebar header
            const sidebarHeader = sidebar.querySelector('.sidebar-header');
            if (sidebarHeader && sidebarHeader.nextSibling) {
                sidebar.insertBefore(adaptivePanel, sidebarHeader.nextSibling);
            }
        }

        // Build adaptive info HTML
        let html = '<div style="font-size: 14px;">';

        // Overall mastery
        const masteryPercent = Math.round(recommendations.overallMastery * 100);
        html += `<div style="margin-bottom: 10px;">
            <strong>🎯 Gesamtfortschritt:</strong> ${masteryPercent}%
            <div style="background: #ddd; height: 8px; border-radius: 4px; margin-top: 5px;">
                <div style="background: var(--primary); height: 100%; width: ${masteryPercent}%; border-radius: 4px;"></div>
            </div>
        </div>`;

        // Weak concepts
        if (recommendations.weakConcepts.length > 0) {
            html += '<div style="margin-bottom: 10px;"><strong>⚠️ Schwache Bereiche:</strong><ul style="margin: 5px 0; padding-left: 20px;">';
            recommendations.weakConcepts.slice(0, 3).forEach(weak => {
                const percent = Math.round(weak.mastery * 100);
                html += `<li style="font-size: 12px;">${weak.concept}: ${percent}%</li>`;
            });
            html += '</ul></div>';
        }

        // Next difficulty
        html += `<div style="margin-bottom: 10px;">
            <strong>📈 Empfohlene Schwierigkeit:</strong> Level ${recommendations.nextDifficulty}/5
        </div>`;

        // Exercises for review
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
// EXPORTS
// ====================================================================

// Export classes
export { ExerciseLoader, ExerciseRenderer, App };

// Export types
export type { LoadedUnit, UnitInfo, GermanHelpUsage, AppStats, ParsedText };

// ====================================================================
// INITIALIZATION
// ====================================================================

// Make classes available globally for backward compatibility
declare global {
  interface Window {
    ExerciseLoader: typeof ExerciseLoader;
    ExerciseRenderer: typeof ExerciseRenderer;
    App: typeof App;
  }
}

if (typeof window !== 'undefined') {
  window.ExerciseLoader = ExerciseLoader;
  window.ExerciseRenderer = ExerciseRenderer;
  window.App = App;

  // Initialize app when page loads
  window.addEventListener('DOMContentLoaded', () => {
    const app = new App();

    // Make app available globally BEFORE init
    window.app = app;

    app.init();
  });
}
