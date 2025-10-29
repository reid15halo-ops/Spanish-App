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
        console.log('🚀 Starting Spanish Learning App...');

        // Get container
        const container = document.getElementById('exercise-area');
        if (!container) {
            console.error('❌ Exercise container not found!');
            return;
        }

        this.renderer = new ExerciseRenderer(container);

        // Load Unit 1
        await this.loadUnit(1);

        // Check for saved progress
        const savedProgress = this.loadProgress();
        let startIndex = 0;

        if (savedProgress && savedProgress.unit === this.currentUnit) {
            // Restore progress
            startIndex = savedProgress.index;
            this.stats = savedProgress.stats;
            console.log(`📂 Continuing from exercise ${startIndex + 1}/${this.exercises.length}`);
        } else {
            console.log('🆕 Starting fresh');
        }

        // Show exercise (either saved position or first)
        this.showExercise(startIndex);

        // Setup settings button
        this.setupSettingsButton();

        console.log('✅ App ready!');
    }

    /**
     * Load a unit
     */
    async loadUnit(unitNumber) {
        try {
            console.log(`📚 Loading Unit ${unitNumber}...`);

            const data = await this.loader.loadUnit(unitNumber);

            this.currentUnit = unitNumber;
            this.exercises = data.exercises;
            this.currentIndex = 0;
            this.attempts = 0;

            // Update progress
            this.updateProgress();

            console.log(`✅ Loaded ${this.exercises.length} exercises`);

        } catch (error) {
            console.error('❌ Error loading unit:', error);
            alert('Fehler beim Laden der Übungen. Bitte Seite neu laden.');
        }
    }

    /**
     * Show exercise at index
     */
    showExercise(index) {
        if (index < 0 || index >= this.exercises.length) {
            console.log('🎉 Unit complete!');
            this.showCompletion();
            return;
        }

        this.currentIndex = index;
        this.attempts = 0;

        const exercise = this.exercises[index];

        console.log(`📝 Exercise ${index + 1}/${this.exercises.length}: ${exercise.type} (${exercise.id})`);

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
     * Show next button
     */
    showNextButton() {
        const feedbackArea = document.getElementById('feedback-area');
        if (!feedbackArea) return;

        // Check if button already exists
        if (document.getElementById('next-btn')) return;

        const nextBtn = document.createElement('button');
        nextBtn.id = 'next-btn';
        nextBtn.className = 'btn-primary';
        nextBtn.textContent = 'Weiter →';
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
     * Update progress display
     */
    updateProgress() {
        const progressEl = document.getElementById('progress');
        if (!progressEl) return;

        const currentEx = this.currentIndex + 1;
        const totalEx = this.exercises.length;
        const percentage = Math.round((currentEx / totalEx) * 100);

        progressEl.innerHTML = `
            <span class="progress-text">Lektion ${this.currentUnit} • Übung ${currentEx}/${totalEx}</span>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
        `;
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
            console.error('Error loading settings:', error);
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
            console.log('✅ Settings saved:', this.settings);
        } catch (error) {
            console.error('Error saving settings:', error);
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
            console.log('💾 Progress saved:', progress);
        } catch (error) {
            console.error('Error saving progress:', error);
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
                console.log('📂 Progress loaded:', progress);
                return progress;
            }
        } catch (error) {
            console.error('Error loading progress:', error);
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
