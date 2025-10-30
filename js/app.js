/**
 * Main App
 * Coordinates loading, rendering, and answer checking
 */

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

        const container = document.getElementById('exercise-area');
        container.innerHTML = `
            <div class="completion">
                <div class="completion-emoji">${emoji}</div>
                <h2>Lektion ${this.currentUnit} abgeschlossen!</h2>
                <div class="completion-stats">
                    <p class="score">${this.stats.correct}/${this.stats.total} richtig</p>
                    <p class="accuracy">${accuracy}% Genauigkeit</p>
                </div>
                <button class="btn-primary" onclick="location.reload()">
                    Nochmal üben
                </button>
            </div>
        `;
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

// Initialize app when page loads
let app;

window.addEventListener('DOMContentLoaded', () => {
    app = new App();
    app.init();
});

// Make app available globally
window.app = app;
