/**
 * App Core - Consolidated Module
 *
 * Combines: app.js + exercise-loader.js + exercise-renderer.js
 * Uses inlined exercise data (no fetch() calls, no CORS issues)
 *
 * Generated: ${new Date().toISOString()}
 */

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
     * @param {number} unitNumber - Unit number (1-7)
     * @returns {Promise<Object>} Unit data with exercises
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
     * @param {number} unitNumber
     * @returns {Promise<Object>}
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
     * @param {Object} exercise - Exercise data
     * @param {Function} onAnswer - Callback when user submits answer
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
            case 'multiple-choice':
                html = this.renderMultipleChoice(exercise, onAnswer);
                break;
            case 'translation':
                html = this.renderTranslation(exercise, onAnswer);
                break;
            case 'sentence-building':
                html = this.renderSentenceBuilding(exercise, onAnswer);
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
        return `
            <div class="vocab-context">
                <div class="vocab-word-display">
                    ${exercise.emoji ? `<div class="emoji">${exercise.emoji}</div>` : ''}
                    <div class="word">${exercise.word}</div>
                    <div class="translation">= ${exercise.translation}</div>
                </div>

                <div class="examples-title">📚 Verwendung in Sätzen:</div>
                <div class="examples-list">
                    ${exercise.exampleSentences.map((ex, i) => `
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
        const parsed = this.extractGermanTranslation(exercise.question);

        return `
            <div class="reading-comprehension">
                <p class="question">${parsed.spanish}</p>

                <div class="dialog-box">
                    <div class="dialog-title">📖 Dialog:</div>
                    ${exercise.dialog.map(line => `
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
                    ${exercise.translation.map(line => `
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
                    <p class="check-question">${exercise.comprehensionCheck.question}</p>
                    <div class="options">
                        ${exercise.comprehensionCheck.options.map((opt, i) => `
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
        const parsed = this.extractGermanTranslation(exercise.question);

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
     * Render multiple-choice exercise
     */
    renderMultipleChoice(exercise, onAnswer) {
        const parsed = this.extractGermanTranslation(exercise.question);

        return `
            <div class="multiple-choice">
                <p class="question">${parsed.spanish}</p>

                ${this.renderGermanHelp(parsed.german, exercise.germanBridge, null)}

                <div class="options">
                    ${exercise.options.map((opt, i) => `
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
    renderSentenceBuilding(exercise, onAnswer) {
        const parsed = this.extractGermanTranslation(exercise.question);

        return `
            <div class="sentence-building">
                <p class="question">${parsed.spanish}</p>

                ${this.renderGermanHelp(parsed.german, exercise.germanBridge, null)}

                <p class="instruction">Verwende die Wörter: ${exercise.words.join(', ')}</p>

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
        this.renderer = null; // Will be set when container is ready

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
    }

    /**
     * Initialize and start the app
     */
    async init() {
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
            const savedProgress = this.loadProgress();
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
                localStorage.setItem('sidebar-collapsed', isCollapsed);

                // Update toggle icon
                toggle.textContent = isCollapsed ? '☰' : '✕';
            });

            // Set initial toggle icon
            toggle.textContent = sidebar.classList.contains('collapsed') ? '☰' : '✕';

            // Close sidebar when clicking on exercise on mobile
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
    trackGermanHelpUsage() {
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
    async loadUnit(unitNumber) {
        try {
            window.Logger?.info(`Loading Unit ${unitNumber}...`);

            const data = await this.loader.loadUnit(unitNumber);

            this.currentUnit = unitNumber;
            this.exercises = data.exercises;
            this.currentIndex = 0;
            this.attempts = 0;

            // Update progress
            this.updateProgress();

            window.Logger?.success(`Loaded ${this.exercises.length} exercises`);

        } catch (error) {
            window.Logger?.error('Error loading unit:', error);
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
    setupAnswerButtons() {
        const buttons = document.querySelectorAll('.btn-option');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const answer = btn.dataset.answer;
                this.handleAnswer(answer);
            });
        });
    }

    /**
     * Check answer (for text input exercises)
     */
    checkAnswer() {
        const input = document.getElementById('answer-input');
        if (!input) return;

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
        const exercise = this.exercises[this.currentIndex];

        // Get correct answer (different location for reading-comprehension)
        let correctAnswer;
        if (exercise.type === 'reading-comprehension' && exercise.comprehensionCheck) {
            correctAnswer = exercise.comprehensionCheck.correctAnswer;
        } else {
            correctAnswer = exercise.correctAnswer;
        }

        // Normalize answers for comparison
        const normalizedUserAnswer = this.normalizeAnswer(userAnswer);
        const normalizedCorrectAnswer = this.normalizeAnswer(correctAnswer);

        const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

        // Update stats
        this.stats.total++;
        if (isCorrect) {
            this.stats.correct++;
        } else {
            this.attempts++;
        }

        // Save progress after updating stats
        this.saveProgress();

        // Show feedback
        if (isCorrect) {
            this.renderer.showFeedback(true, '✅ Richtig! Sehr gut!');

            // Show explanation if available
            if (exercise.explanation) {
                setTimeout(() => {
                    alert(`💡 ${exercise.explanation}`);
                }, 500);
            }

            // Auto-advance after delay
            setTimeout(() => {
                this.next();
            }, 1500);

        } else {
            this.renderer.showFeedback(false, '❌ Leider falsch. Versuch es nochmal!', correctAnswer);

            // Show hint based on settings
            const maxAttempts = this.getMaxAttemptsBeforeHint();
            if (this.attempts >= maxAttempts && exercise.hint) {
                this.renderer.showHint();
            }

            // Disable input/buttons
            const input = document.getElementById('answer-input');
            if (input) {
                input.disabled = true;
            }

            const buttons = document.querySelectorAll('.btn-option, .btn-primary');
            buttons.forEach(btn => btn.disabled = true);

            // Show "Next" button
            this.showNextButton();
        }
    }

    /**
     * Normalize answer for comparison
     */
    normalizeAnswer(answer) {
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
    showNextButton() {
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
     * Go to next exercise
     */
    next() {
        this.showExercise(this.currentIndex + 1);
        this.saveProgress();
    }

    /**
     * Go to previous exercise
     */
    previous() {
        if (this.currentIndex > 0) {
            this.showExercise(this.currentIndex - 1);
            this.saveProgress();
        }
    }

    /**
     * Jump to specific exercise
     */
    jumpToExercise(index) {
        if (index >= 0 && index < this.exercises.length) {
            this.showExercise(index);
            this.saveProgress();
        }
    }

    /**
     * Update progress display with enhanced visual indicators
     */
    updateProgress() {
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
    buildSidebar() {
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
            option.value = i;
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
                } else {
                    // Reset selection
                    e.target.value = this.currentUnit;
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

            const title = document.createElement('div');
            title.className = 'unit-title';
            title.textContent = concept;
            section.appendChild(title);

            const list = document.createElement('ul');
            list.className = 'exercise-list';

            exercises.forEach(({ exercise, index }) => {
                const item = document.createElement('li');
                item.className = 'exercise-item';
                item.dataset.index = index;

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
    updateSidebar() {
        const items = document.querySelectorAll('.exercise-item');
        items.forEach(item => {
            const index = parseInt(item.dataset.index);
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
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        if (prevBtn) {
            if (this.currentIndex > 0) {
                prevBtn.style.display = 'block';
                prevBtn.disabled = false;
            } else {
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

        // Check if there's a next unit
        const hasNextUnit = this.currentUnit < 7; // We have 7 units total

        const container = document.getElementById('exercise-area');
        container.innerHTML = `
            <div class="completion">
                <div class="completion-emoji">${emoji}</div>
                <h2>Lektion ${this.currentUnit} abgeschlossen!</h2>
                <div class="completion-stats">
                    <p class="score">${this.stats.correct}/${this.stats.total} richtig</p>
                    <p class="accuracy">${accuracy}% Genauigkeit</p>
                </div>

                ${hasNextUnit ? `
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
    loadSettings() {
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
            helpLevel: 'normal' // 'keine', 'normal', 'viel'
        };
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
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
        } catch (error) {
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
        } catch (error) {
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
        } catch (error) {
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
    setupSettingsButton() {
        const settingsBtn = document.getElementById('settings-btn');
        if (!settingsBtn) return;

        settingsBtn.addEventListener('click', () => {
            this.showSettingsModal();
        });
    }

    /**
     * Show settings modal
     */
    showSettingsModal() {
        const modal = document.getElementById('settings-modal');
        if (!modal) return;

        modal.classList.remove('hidden');

        // Set current value
        const radio = document.querySelector(`input[name="help"][value="${this.settings.helpLevel}"]`);
        if (radio) {
            radio.checked = true;
        }

        // Setup save button
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

        // Setup close button
        const closeBtn = document.getElementById('close-settings');
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.classList.add('hidden');
            };
        }
    }
}

// ====================================================================
// INITIALIZATION
// ====================================================================

// Initialize app when page loads
let app;

window.addEventListener('DOMContentLoaded', () => {
    app = new App();
    app.init();
});

// Make app available globally
window.app = app;

// Also make classes available globally for backwards compatibility
window.ExerciseLoader = ExerciseLoader;
window.ExerciseRenderer = ExerciseRenderer;
window.App = App;
