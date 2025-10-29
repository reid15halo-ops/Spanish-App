/**
 * UI Controller - Zero-Friction UI State Management
 *
 * Manages all UI state, rendering, and user interactions
 * Pure presentation layer - no business logic
 */

class UIController {
    constructor() {
        this.elements = {};
        this.state = {
            currentExercise: null,
            userAnswer: null,
            isAnswered: false,
            hintLevel: 0,
            exerciseType: null
        };

        this.initElements();
        this.attachEventListeners();
    }

    /**
     * Initialize all DOM element references
     */
    initElements() {
        // Main containers
        this.elements.loading = document.getElementById('loading');
        this.elements.error = document.getElementById('error');
        this.elements.exerciseCard = document.getElementById('exercise-card');

        // Header
        this.elements.unitStatus = document.getElementById('unit-status');
        this.elements.exerciseStatus = document.getElementById('exercise-status');

        // Exercise components
        this.elements.germanBridge = document.getElementById('german-bridge');
        this.elements.bridgeText = document.getElementById('bridge-text');
        this.elements.questionText = document.getElementById('question-text');
        this.elements.answerContainer = document.getElementById('answer-container');

        // Feedback
        this.elements.feedback = document.getElementById('feedback');
        this.elements.feedbackText = document.getElementById('feedback-text');

        // Hints
        this.elements.hintContainer = document.getElementById('hint-container');
        this.elements.hintBtn = document.getElementById('hint-btn');
        this.elements.hintContent = document.getElementById('hint-content');
        this.elements.hintLevel = document.getElementById('hint-level');
        this.elements.hintText = document.getElementById('hint-text');

        // Explanation
        this.elements.explanation = document.getElementById('explanation');
        this.elements.explanationContent = document.getElementById('explanation-content');

        // Progress
        this.elements.progressFill = document.getElementById('progress-fill');
        this.elements.progressText = document.getElementById('progress-text');
    }

    /**
     * Attach global event listeners
     */
    attachEventListeners() {
        // Hint button
        this.elements.hintBtn.addEventListener('click', () => {
            this.showNextHint();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcut(e);
        });
    }

    /**
     * Show loading state
     */
    showLoading() {
        this.elements.loading.classList.remove('hidden');
        this.elements.error.classList.add('hidden');
        this.elements.exerciseCard.classList.add('hidden');
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        this.elements.loading.classList.add('hidden');
    }

    /**
     * Show error message
     */
    showError(message) {
        this.elements.error.querySelector('p').textContent = message;
        this.elements.error.classList.remove('hidden');
        this.elements.loading.classList.add('hidden');
        this.elements.exerciseCard.classList.add('hidden');
    }

    /**
     * Update status bar
     */
    updateStatus(unitNumber, totalUnits, currentEx, totalEx, unitName = '') {
        // Unit names mapping
        const unitNames = {
            1: 'Pronomen',
            2: 'SER',
            3: 'ESTAR',
            4: 'SER/ESTAR',
            5: 'TENER',
            6: 'Vokabular',
            7: 'Integration'
        };

        const name = unitName || unitNames[unitNumber] || '';
        this.elements.unitStatus.textContent = name
            ? `Lektion ${unitNumber}/${totalUnits}: ${name}`
            : `Lektion ${unitNumber}/${totalUnits}`;
        this.elements.exerciseStatus.textContent = `${currentEx}/${totalEx}`;
    }

    /**
     * Update progress bar
     */
    updateProgress(percentage) {
        this.elements.progressFill.style.width = `${percentage}%`;
        this.elements.progressText.textContent = `${Math.round(percentage)}% abgeschlossen`;
    }

    /**
     * Render an exercise
     * @param {Object} exercise - Exercise object
     */
    renderExercise(exercise) {
        this.state.currentExercise = exercise;
        this.state.userAnswer = null;
        this.state.isAnswered = false;
        this.state.hintLevel = 0;
        this.state.exerciseType = exercise.type;

        // Show exercise card
        this.hideLoading();
        this.elements.exerciseCard.classList.remove('hidden');

        // Render German bridge if available
        this.renderGermanBridge(exercise);

        // Render question
        this.renderQuestion(exercise);

        // Render answer options based on type
        this.renderAnswerOptions(exercise);

        // Reset feedback and hints
        this.hideFeedback();
        this.hideHints();
        this.hideExplanation();
    }

    /**
     * Render German bridge
     */
    renderGermanBridge(exercise) {
        if (exercise.germanBridge && exercise.germanBridge.trim()) {
            this.elements.bridgeText.textContent = exercise.germanBridge;
            this.elements.germanBridge.classList.remove('hidden');
        } else {
            this.elements.germanBridge.classList.add('hidden');
        }
    }

    /**
     * Render question text
     */
    renderQuestion(exercise) {
        // Handle HTML formatting in question
        const questionHTML = exercise.question
            .replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>')
            .replace(/___(.*?)___/g, '<span class="highlight">$1</span>');

        this.elements.questionText.innerHTML = questionHTML;
    }

    /**
     * Render answer options based on exercise type
     */
    renderAnswerOptions(exercise) {
        this.elements.answerContainer.innerHTML = '';

        if (exercise.type === 'matching') {
            this.renderMatching(exercise);
        } else if (exercise.type === 'emoji-guess' || exercise.type === 'emoji-fill') {
            this.renderEmojiExercise(exercise);
        } else if (exercise.type === 'multiple-choice' || exercise.type === 'conjugation') {
            this.renderMultipleChoice(exercise);
        } else if (exercise.type === 'translation' || exercise.type === 'fill-blank') {
            this.renderTextInput(exercise);
        } else {
            // Default: multiple choice
            this.renderMultipleChoice(exercise);
        }
    }

    /**
     * Render multiple choice options
     */
    renderMultipleChoice(exercise) {
        const optionsHTML = exercise.options.map((option, index) => {
            const key = index + 1;
            return `
                <button
                    class="answer-btn"
                    data-answer="${option.value || option.spanish || option}"
                    data-index="${index}"
                    role="button"
                    aria-label="Antwort ${key}: ${option.spanish || option}"
                    tabindex="0">
                    <div class="answer-text">
                        <div class="answer-es">${option.spanish || option}</div>
                        ${option.german ? `<div class="answer-de">(${option.german})</div>` : ''}
                    </div>
                    <div class="answer-key">[${key}]</div>
                </button>
            `;
        }).join('');

        this.elements.answerContainer.innerHTML = optionsHTML;

        // Attach click handlers
        const buttons = this.elements.answerContainer.querySelectorAll('.answer-btn');
        buttons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.handleAnswerSelection(btn.dataset.answer, index);
            });
        });
    }

    /**
     * Render text input
     */
    renderTextInput(exercise) {
        const inputHTML = `
            <input
                type="text"
                class="text-input"
                id="answer-input"
                placeholder="Deine Antwort..."
                aria-label="Antwort eingeben"
                autocomplete="off"
                autocorrect="off"
                spellcheck="false">
            <button class="submit-btn" id="submit-btn">
                Prüfen
            </button>
        `;

        this.elements.answerContainer.innerHTML = inputHTML;

        // Get references
        const input = document.getElementById('answer-input');
        const submitBtn = document.getElementById('submit-btn');

        // Focus input
        setTimeout(() => input.focus(), 100);

        // Submit on Enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });

        // Submit button handler
        submitBtn.addEventListener('click', () => {
            const answer = input.value.trim();
            if (answer) {
                this.handleAnswerSelection(answer);
            }
        });
    }

    /**
     * Handle answer selection (callback will be set by AppController)
     */
    handleAnswerSelection(answer, index = null) {
        if (this.state.isAnswered) return;

        this.state.userAnswer = answer;
        this.state.isAnswered = true;

        // Disable all buttons/input
        this.disableAnswerOptions();

        // Call callback if set
        if (this.onAnswerSelected) {
            this.onAnswerSelected(answer, index);
        }
    }

    /**
     * Disable answer options after selection
     */
    disableAnswerOptions() {
        const buttons = this.elements.answerContainer.querySelectorAll('.answer-btn');
        buttons.forEach(btn => btn.disabled = true);

        const input = this.elements.answerContainer.querySelector('.text-input');
        if (input) input.disabled = true;

        const submitBtn = this.elements.answerContainer.querySelector('.submit-btn');
        if (submitBtn) submitBtn.disabled = true;
    }

    /**
     * Enable answer options
     */
    enableAnswerOptions() {
        const buttons = this.elements.answerContainer.querySelectorAll('.answer-btn');
        buttons.forEach(btn => btn.disabled = false);

        const input = this.elements.answerContainer.querySelector('.text-input');
        if (input) input.disabled = false;

        const submitBtn = this.elements.answerContainer.querySelector('.submit-btn');
        if (submitBtn) submitBtn.disabled = false;
    }

    /**
     * Show feedback (correct or incorrect)
     */
    showFeedback(isCorrect, message, correctAnswer = null, hint = '', attemptsRemaining = null) {
        this.elements.feedbackText.textContent = message;
        this.elements.feedback.className = 'feedback show ' + (isCorrect ? 'feedback--success' : 'feedback--error');

        // Show feedback hint if provided
        const feedbackHint = document.getElementById('feedback-hint');
        if (feedbackHint) {
            if (hint) {
                feedbackHint.textContent = hint;
                feedbackHint.style.display = 'block';
            } else {
                feedbackHint.style.display = 'none';
            }
        }

        // Show attempts remaining if provided
        const attemptsEl = document.getElementById('attempts-remaining');
        if (attemptsEl) {
            if (attemptsRemaining !== null && attemptsRemaining > 0) {
                attemptsEl.textContent = `Noch ${attemptsRemaining} Versuch${attemptsRemaining !== 1 ? 'e' : ''} übrig`;
                attemptsEl.style.display = 'block';
            } else {
                attemptsEl.style.display = 'none';
            }
        }

        // Mark answer button/input
        if (this.state.exerciseType === 'multiple-choice' || this.state.exerciseType === 'conjugation') {
            const buttons = this.elements.answerContainer.querySelectorAll('.answer-btn');
            buttons.forEach(btn => {
                if (btn.dataset.answer === this.state.userAnswer) {
                    btn.classList.add(isCorrect ? 'correct' : 'incorrect');
                }
                // Highlight correct answer if wrong
                if (!isCorrect && correctAnswer && btn.dataset.answer === correctAnswer) {
                    btn.classList.add('correct');
                }
            });
        } else {
            const input = this.elements.answerContainer.querySelector('.text-input');
            if (input) {
                input.classList.add(isCorrect ? 'correct' : 'incorrect');
                if (!isCorrect && correctAnswer) {
                    input.value = `${input.value} → ${correctAnswer}`;
                }
            }
        }

        // Show hint button if incorrect
        if (!isCorrect) {
            this.elements.hintContainer.classList.add('show');
        }
    }

    /**
     * Hide feedback
     */
    hideFeedback() {
        this.elements.feedback.classList.remove('show');
    }

    /**
     * Show next hint level
     */
    showNextHint() {
        this.state.hintLevel++;

        if (this.onHintRequested) {
            const hint = this.onHintRequested(this.state.hintLevel);
            if (hint) {
                this.displayHint(hint, this.state.hintLevel);
            }
        }
    }

    /**
     * Display hint
     */
    displayHint(hintText, level) {
        this.elements.hintLevel.textContent = `Hinweis Level ${level}`;
        this.elements.hintText.textContent = hintText;
        this.elements.hintContent.classList.remove('hidden');

        // Hide hint button if max level reached
        if (level >= 3) {
            this.elements.hintBtn.classList.add('hidden');
        }
    }

    /**
     * Hide hints
     */
    hideHints() {
        this.elements.hintContainer.classList.remove('show');
        this.elements.hintContent.classList.add('hidden');
        this.elements.hintBtn.classList.remove('hidden');
    }

    /**
     * Show explanation
     */
    showExplanation(explanationHTML) {
        this.elements.explanationContent.innerHTML = explanationHTML;
        this.elements.explanation.classList.add('show');
    }

    /**
     * Hide explanation
     */
    hideExplanation() {
        this.elements.explanation.classList.remove('show');
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcut(e) {
        // Ignore shortcuts when typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            // Allow Enter in text inputs for submission
            if (e.key === 'Enter') {
                const submitBtn = document.getElementById('submit-btn');
                if (submitBtn) submitBtn.click();
            }
            return;
        }

        // Number keys 1-4 for multiple choice
        if (e.key >= '1' && e.key <= '4' && !this.state.isAnswered) {
            const index = parseInt(e.key) - 1;
            const buttons = this.elements.answerContainer.querySelectorAll('.answer-btn');
            if (buttons[index]) {
                buttons[index].click();
            }
        }

        // Enter or Spacebar to advance (if answered)
        if ((e.key === 'Enter' || e.key === ' ') && this.state.isAnswered) {
            e.preventDefault();
            if (this.onNextExercise) {
                this.onNextExercise();
            }
        }

        // H key to show hint
        if ((e.key === 'h' || e.key === 'H') && this.state.isAnswered) {
            e.preventDefault();
            if (this.elements.hintContainer.classList.contains('show')) {
                this.showNextHint();
            }
        }

        // E key to toggle explanation
        if ((e.key === 'e' || e.key === 'E') && this.state.isAnswered) {
            e.preventDefault();
            if (this.elements.explanation.classList.contains('show')) {
                this.hideExplanation();
            } else if (this.onShowExplanation) {
                this.onShowExplanation();
            }
        }

        // Arrow keys for navigation (if answered)
        if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && this.state.isAnswered) {
            e.preventDefault();
            if (this.onNextExercise) {
                this.onNextExercise();
            }
        }

        if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && this.state.isAnswered) {
            e.preventDefault();
            // TODO: Implement previous exercise navigation
            console.log('Previous exercise navigation not yet implemented');
        }

        // Escape to close hints/explanations
        if (e.key === 'Escape') {
            if (this.elements.hintContent.classList.contains('hidden') === false) {
                this.elements.hintContent.classList.add('hidden');
            }
            if (this.elements.explanation.classList.contains('show')) {
                this.hideExplanation();
            }
        }
    }

    /**
     * Show "Next" button after feedback
     */
    showNextButton() {
        const existingBtn = document.getElementById('next-btn');
        if (existingBtn) return;

        const nextBtn = document.createElement('button');
        nextBtn.id = 'next-btn';
        nextBtn.className = 'submit-btn mt-lg';
        nextBtn.textContent = 'Weiter →';
        nextBtn.onclick = () => {
            if (this.onNextExercise) {
                this.onNextExercise();
            }
        };

        this.elements.answerContainer.appendChild(nextBtn);
        nextBtn.focus();
    }

    /**
     * Reset for next exercise
     */
    reset() {
        this.state = {
            currentExercise: null,
            userAnswer: null,
            isAnswered: false,
            hintLevel: 0,
            exerciseType: null
        };

        this.hideFeedback();
        this.hideHints();
        this.hideExplanation();

        // Remove next button
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) nextBtn.remove();
    }

    /**
     * Show completion message
     */
    showCompletion(stats, currentUnit = 1, totalUnits = 7) {
        const accuracy = Math.round((stats.correct / stats.total) * 100);
        const emoji = accuracy >= 90 ? '🎉' : accuracy >= 70 ? '👍' : '💪';
        const hasNextUnit = currentUnit < totalUnits;

        const html = `
            <div class="text-center">
                <h2 style="font-size: 32px; margin-bottom: 24px;">${emoji}</h2>
                <h3 style="margin-bottom: 16px;">Lektion ${currentUnit} abgeschlossen!</h3>
                <p style="font-size: 24px; margin-bottom: 24px;">
                    ${stats.correct}/${stats.total} richtig (${accuracy}%)
                </p>
                ${hasNextUnit ? `
                    <button class="submit-btn" id="next-unit-btn" style="margin-bottom: 16px;">
                        Nächste Lektion (${currentUnit + 1}/${totalUnits}) →
                    </button>
                    <br>
                    <button class="submit-btn" onclick="location.reload()" style="background: var(--bg-secondary); opacity: 0.7;">
                        Diese Lektion wiederholen
                    </button>
                ` : `
                    <p style="margin-bottom: 24px; color: var(--success); font-weight: bold;">
                        🎊 Alle Lektionen abgeschlossen! 🎊
                    </p>
                    <button class="submit-btn" onclick="location.reload()">
                        Von vorne beginnen
                    </button>
                `}
            </div>
        `;

        this.elements.answerContainer.innerHTML = html;
        this.hideFeedback();
        this.hideHints();

        // Attach next unit button handler
        if (hasNextUnit) {
            const nextBtn = document.getElementById('next-unit-btn');
            if (nextBtn && this.onNextUnit) {
                nextBtn.addEventListener('click', () => {
                    this.onNextUnit();
                });
                nextBtn.focus();
            }
        }
    }

    /**
     * Render matching exercise
     */
    renderMatching(exercise) {
        if (typeof MatchingExercise === 'undefined' || typeof MatchingExerciseRenderer === 'undefined') {
            console.error('Matching exercise module not loaded');
            this.elements.answerContainer.innerHTML = '<p>Matching exercise not available</p>';
            return;
        }

        // Create matching exercise from data
        const matching = new MatchingExercise(exercise.pairs || []);
        const renderer = new MatchingExerciseRenderer(this.elements.answerContainer, matching);

        // Set completion callback
        renderer.onComplete = () => {
            // Auto-submit when complete
            const results = matching.validate();
            const accuracy = results.accuracy;

            if (this.onAnswerSelected) {
                this.onAnswerSelected(JSON.stringify(results), null);
            }
        };

        renderer.render();
    }

    /**
     * Render emoji exercise (guess or fill)
     */
    renderEmojiExercise(exercise) {
        // Emoji exercises are just text input with emoji in the question
        this.renderTextInput(exercise);
    }
}

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIController;
}
