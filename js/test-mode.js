/**
 * Test Mode - Complete Testing System (FINALIZED VERSION)
 * Features:
 * - Configurable timer and question count
 * - State persistence (survives page reload)
 * - Pause/Resume functionality
 * - Sound notifications
 * - Test history
 * - Enhanced rendering
 * - Mobile optimized
 */

class TestMode {
    constructor() {
        this.exercises = [];
        this.currentIndex = 0;
        this.userAnswers = new Map();
        this.startTime = null;
        this.endTime = null;
        this.timerInterval = null;
        this.timeRemaining = 30 * 60; // 30 minutes in seconds
        this.isPaused = false;
        this.testId = null;

        // Configuration
        this.config = {
            questionCount: 40,
            timeLimitMinutes: 30,
            soundEnabled: true,
            autoSave: true
        };

        // Load config from localStorage
        this.loadConfig();

        // DOM elements
        this.elements = {
            timer: document.getElementById('timer'),
            progressFill: document.getElementById('progressFill'),
            questionNav: document.getElementById('questionNav'),
            questionGrid: document.getElementById('questionGrid'),
            questionNumber: document.getElementById('questionNumber'),
            questionDifficulty: document.getElementById('questionDifficulty'),
            questionPhase: document.getElementById('questionPhase'),
            questionContent: document.getElementById('questionContent'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            submitTestBtn: document.getElementById('submitTestBtn'),
            loadingOverlay: document.getElementById('loadingOverlay'),
            confirmModal: document.getElementById('confirmModal'),
            confirmMessage: document.getElementById('confirmMessage'),
            confirmSubmitBtn: document.getElementById('confirmSubmitBtn'),
            cancelSubmitBtn: document.getElementById('cancelSubmitBtn'),
            toggleNav: document.getElementById('toggleNav'),
            resultsContainer: document.getElementById('resultsContainer')
        };
    }

    loadConfig() {
        try {
            const saved = localStorage.getItem('test-mode-config');
            if (saved) {
                this.config = { ...this.config, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error('Failed to load config:', e);
        }
    }

    saveConfig() {
        try {
            localStorage.setItem('test-mode-config', JSON.stringify(this.config));
        } catch (e) {
            console.error('Failed to save config:', e);
        }
    }

    async init() {
        try {
            // Check for existing test in progress
            const savedState = this.loadTestState();

            if (savedState && confirm('Möchten Sie Ihren vorherigen Test fortsetzen?')) {
                await this.restoreTestState(savedState);
            } else {
                // Start new test
                this.clearTestState();
                await this.loadExercises();
                this.testId = this.generateTestId();
            }

            // Setup event listeners
            this.setupEventListeners();

            // Build question navigation
            this.buildQuestionNavigation();

            // Show first question
            this.showQuestion(this.currentIndex);

            // Start timer
            this.startTimer();

            // Setup auto-save
            if (this.config.autoSave) {
                this.setupAutoSave();
            }

            // Hide loading overlay
            this.elements.loadingOverlay.style.display = 'none';

            // Show welcome message
            this.showToast('Test gestartet! Viel Erfolg!', 'success');
        } catch (error) {
            console.error('Failed to initialize test mode:', error);
            this.showToast('Fehler beim Laden des Tests', 'error');
            alert('Fehler beim Laden des Tests. Bitte versuchen Sie es erneut.');
        }
    }

    generateTestId() {
        return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    async loadExercises() {
        // Load a mix of exercises from all units
        const allExercises = [];

        // Get exercises from all available units
        const units = [
            window.UNIT_1_PRONOUNS,
            window.UNIT_2_SER,
            window.UNIT_3_ESTAR,
            window.UNIT_4_SER_ESTAR_CONTRAST,
            window.UNIT_5_TENER,
            window.UNIT_6_VOCABULARY,
            window.UNIT_7_INTEGRATION
        ];

        units.forEach((unit, index) => {
            if (unit && unit.exercises) {
                // Add unit number to each exercise
                unit.exercises.forEach(ex => {
                    allExercises.push({
                        ...ex,
                        unitNumber: index + 1,
                        unitName: unit.metadata?.title || `Unit ${index + 1}`
                    });
                });
            }
        });

        // Select a diverse subset of exercises
        this.exercises = this.selectDiverseExercises(allExercises, this.config.questionCount);

        console.log(`Loaded ${this.exercises.length} exercises for test`);
    }

    selectDiverseExercises(allExercises, count) {
        // Ensure diversity across units, phases, and difficulties
        const selected = [];
        const byUnit = new Map();

        // Group by unit
        allExercises.forEach(ex => {
            const unit = ex.unitNumber || 1;
            if (!byUnit.has(unit)) {
                byUnit.set(unit, []);
            }
            byUnit.get(unit).push(ex);
        });

        // Select proportionally from each unit
        const perUnit = Math.ceil(count / byUnit.size);

        byUnit.forEach((exercises, unit) => {
            // Shuffle and take
            const shuffled = exercises.sort(() => Math.random() - 0.5);
            selected.push(...shuffled.slice(0, perUnit));
        });

        // Shuffle final selection and trim to exact count
        return selected.sort(() => Math.random() - 0.5).slice(0, count);
    }

    setupEventListeners() {
        // Navigation buttons
        this.elements.prevBtn.addEventListener('click', () => this.navigateQuestion(-1));
        this.elements.nextBtn.addEventListener('click', () => this.navigateQuestion(1));

        // Submit button
        this.elements.submitTestBtn.addEventListener('click', () => this.confirmSubmit());

        // Modal buttons
        this.elements.confirmSubmitBtn.addEventListener('click', () => this.submitTest());
        this.elements.cancelSubmitBtn.addEventListener('click', () => this.hideModal());

        // Toggle navigation
        this.elements.toggleNav.addEventListener('click', () => {
            this.elements.questionNav.classList.toggle('collapsed');
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.elements.resultsContainer.style.display !== 'none') return;
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key === 'ArrowLeft') this.navigateQuestion(-1);
            if (e.key === 'ArrowRight') this.navigateQuestion(1);
            if (e.key === 'p' || e.key === 'P') this.togglePause();
        });

        // Prevent accidental page close
        window.addEventListener('beforeunload', (e) => {
            if (this.timerInterval && !this.endTime) {
                e.preventDefault();
                e.returnValue = 'Test läuft noch. Wirklich verlassen?';
                return e.returnValue;
            }
        });

        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.config.soundEnabled) {
                // Don't pause timer when tab is hidden, just save state
                this.saveTestState();
            }
        });
    }

    buildQuestionNavigation() {
        this.elements.questionGrid.innerHTML = '';

        this.exercises.forEach((exercise, index) => {
            const btn = document.createElement('button');
            btn.className = 'question-btn';
            btn.textContent = index + 1;
            btn.dataset.index = index;
            btn.title = `Frage ${index + 1}`;
            btn.addEventListener('click', () => this.showQuestion(index));
            this.elements.questionGrid.appendChild(btn);
        });
    }

    updateQuestionNavigation() {
        const buttons = this.elements.questionGrid.querySelectorAll('.question-btn');
        buttons.forEach((btn, index) => {
            btn.classList.remove('current', 'answered');

            if (index === this.currentIndex) {
                btn.classList.add('current');
            } else if (this.userAnswers.has(index)) {
                btn.classList.add('answered');
            }
        });

        // Update progress bar
        const answeredCount = this.userAnswers.size;
        const percentage = (answeredCount / this.exercises.length) * 100;
        this.elements.progressFill.style.width = `${percentage}%`;
    }

    showQuestion(index) {
        if (index < 0 || index >= this.exercises.length) return;

        this.currentIndex = index;
        const exercise = this.exercises[index];

        // Update question header
        this.elements.questionNumber.textContent = `Frage ${index + 1} von ${this.exercises.length}`;

        // Update difficulty
        const difficulty = exercise.difficulty || 1;
        this.elements.questionDifficulty.textContent = `Schwierigkeit ${difficulty}/5`;
        this.elements.questionDifficulty.className = `question-difficulty diff-${difficulty}`;

        // Update phase
        const phase = exercise.phase || 'guided';
        this.elements.questionPhase.textContent = this.getPhaseLabel(phase);

        // Render exercise
        this.renderExercise(exercise, index);

        // Update navigation
        this.updateQuestionNavigation();

        // Update nav buttons
        this.elements.prevBtn.disabled = index === 0;
        this.elements.nextBtn.disabled = false;

        // Save state
        if (this.config.autoSave) {
            this.saveTestState();
        }
    }

    getPhaseLabel(phase) {
        const labels = {
            'prep': 'Vorbereitung',
            'input': 'Input',
            'guided': 'Geführt',
            'free': 'Frei'
        };
        return labels[phase] || 'Übung';
    }

    renderExercise(exercise, index) {
        const container = this.elements.questionContent;
        container.innerHTML = '';

        // Create exercise container
        const exerciseDiv = document.createElement('div');
        exerciseDiv.className = 'exercise-container';

        // Render based on type
        const type = exercise.type;

        // Question text
        if (exercise.question) {
            const questionP = document.createElement('p');
            questionP.className = 'exercise-question';
            questionP.textContent = exercise.question;
            exerciseDiv.appendChild(questionP);
        }

        // Render based on type
        if (type === 'multiple-choice') {
            this.renderMultipleChoice(exerciseDiv, exercise, index);
        } else if (type === 'fill-blank' || type === 'translation' || type === 'conjugation') {
            this.renderTextInput(exerciseDiv, exercise, index);
        } else if (type === 'vocabulary-card') {
            this.renderVocabularyCard(exerciseDiv, exercise, index);
        } else if (type === 'reading-comprehension') {
            this.renderReadingComprehension(exerciseDiv, exercise, index);
        } else {
            // Generic rendering
            this.renderTextInput(exerciseDiv, exercise, index);
        }

        container.appendChild(exerciseDiv);

        // Restore saved answer if exists
        if (this.userAnswers.has(index)) {
            this.restoreAnswer(index);
        }
    }

    renderMultipleChoice(container, exercise, index) {
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options-container';

        const options = exercise.options || [];
        options.forEach((option, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option;
            btn.dataset.index = i;
            btn.dataset.option = option;
            btn.addEventListener('click', () => {
                // Remove previous selection
                optionsDiv.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.handleAnswer(index, option);
            });
            optionsDiv.appendChild(btn);
        });

        container.appendChild(optionsDiv);
    }

    renderTextInput(container, exercise, index) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'answer-input';
        input.placeholder = 'Ihre Antwort...';
        input.dataset.questionIndex = index;
        input.autocomplete = 'off';

        // Add German keyboard helper
        if (exercise.type === 'translation' || exercise.type === 'fill-blank') {
            const helperDiv = document.createElement('div');
            helperDiv.className = 'keyboard-helper';
            helperDiv.innerHTML = `
                <small style="color: #666; margin-top: 0.5rem; display: block;">
                    Sonderzeichen:
                    <button type="button" class="char-btn" data-char="ä">ä</button>
                    <button type="button" class="char-btn" data-char="ö">ö</button>
                    <button type="button" class="char-btn" data-char="ü">ü</button>
                    <button type="button" class="char-btn" data-char="ß">ß</button>
                    <button type="button" class="char-btn" data-char="á">á</button>
                    <button type="button" class="char-btn" data-char="é">é</button>
                    <button type="button" class="char-btn" data-char="í">í</button>
                    <button type="button" class="char-btn" data-char="ó">ó</button>
                    <button type="button" class="char-btn" data-char="ú">ú</button>
                    <button type="button" class="char-btn" data-char="ñ">ñ</button>
                    <button type="button" class="char-btn" data-char="¿">¿</button>
                    <button type="button" class="char-btn" data-char="¡">¡</button>
                </small>
            `;

            // Add click handlers for character buttons
            helperDiv.querySelectorAll('.char-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const char = btn.dataset.char;
                    const cursorPos = input.selectionStart;
                    const textBefore = input.value.substring(0, cursorPos);
                    const textAfter = input.value.substring(input.selectionEnd);
                    input.value = textBefore + char + textAfter;
                    input.focus();
                    input.setSelectionRange(cursorPos + 1, cursorPos + 1);
                    this.handleAnswer(index, input.value);
                });
            });

            container.appendChild(input);
            container.appendChild(helperDiv);
        } else {
            container.appendChild(input);
        }

        // Auto-save on change
        let debounceTimer;
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.handleAnswer(index, e.target.value);
            }, 300);
        });

        // Submit on Enter
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAnswer(index, input.value);
                this.navigateQuestion(1);
            }
        });

        // Focus input
        setTimeout(() => input.focus(), 100);
    }

    renderVocabularyCard(container, exercise, index) {
        const card = document.createElement('div');
        card.className = 'vocab-card';

        if (exercise.emoji) {
            const emoji = document.createElement('div');
            emoji.className = 'vocab-emoji';
            emoji.textContent = exercise.emoji;
            card.appendChild(emoji);
        }

        if (exercise.word) {
            const word = document.createElement('div');
            word.className = 'vocab-word';
            word.textContent = exercise.word;
            card.appendChild(word);
        }

        // Add a question for testing
        const question = document.createElement('p');
        question.textContent = 'Was bedeutet dieses Wort auf Deutsch?';
        question.style.marginTop = '2rem';
        card.appendChild(question);

        container.appendChild(card);
        this.renderTextInput(container, exercise, index);
    }

    renderReadingComprehension(container, exercise, index) {
        // Show dialog or text
        if (exercise.dialog) {
            const dialogBox = document.createElement('div');
            dialogBox.className = 'dialog-box';
            dialogBox.style.cssText = 'background: #f5f5f5; padding: 1rem; border-radius: 8px; margin: 1rem 0;';

            exercise.dialog.forEach(line => {
                const p = document.createElement('p');
                p.innerHTML = `<strong>${line.speaker}:</strong> <em>${line.text}</em>`;
                p.style.marginBottom = '0.5rem';
                dialogBox.appendChild(p);
            });

            container.appendChild(dialogBox);
        }

        // Show comprehension question
        if (exercise.comprehensionCheck) {
            const checkDiv = document.createElement('div');
            checkDiv.style.marginTop = '1.5rem';

            const question = document.createElement('p');
            question.textContent = exercise.comprehensionCheck.question;
            question.style.fontWeight = '600';
            question.style.marginBottom = '1rem';
            checkDiv.appendChild(question);

            container.appendChild(checkDiv);

            // Render as multiple choice
            this.renderMultipleChoice(checkDiv, {
                ...exercise,
                options: exercise.comprehensionCheck.options
            }, index);
        } else {
            // Fallback to text input
            this.renderTextInput(container, exercise, index);
        }
    }

    restoreAnswer(index) {
        const answer = this.userAnswers.get(index);
        if (!answer) return;

        // Find and restore the answer in the UI
        const input = this.elements.questionContent.querySelector('.answer-input');
        if (input) {
            input.value = answer;
        }

        const selectedBtn = Array.from(this.elements.questionContent.querySelectorAll('.option-btn'))
            .find(btn => btn.dataset.option === answer || btn.textContent === answer);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
    }

    handleAnswer(index, answer) {
        // Save user answer
        if (answer && answer.trim()) {
            this.userAnswers.set(index, answer.trim());
        } else {
            this.userAnswers.delete(index);
        }

        // Update navigation to show answered state
        this.updateQuestionNavigation();

        // Auto-save state
        if (this.config.autoSave) {
            this.saveTestState();
        }
    }

    navigateQuestion(direction) {
        const newIndex = this.currentIndex + direction;
        if (newIndex >= 0 && newIndex < this.exercises.length) {
            this.showQuestion(newIndex);
        }
    }

    togglePause() {
        if (this.isPaused) {
            this.resumeTest();
        } else {
            this.pauseTest();
        }
    }

    pauseTest() {
        if (this.isPaused || !this.timerInterval) return;

        this.isPaused = true;
        clearInterval(this.timerInterval);
        this.timerInterval = null;

        // Show pause overlay
        const overlay = document.createElement('div');
        overlay.id = 'pause-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 4000;
            color: white;
        `;
        overlay.innerHTML = `
            <h2 style="font-size: 3rem; margin-bottom: 1rem;">⏸️ Pause</h2>
            <p style="font-size: 1.5rem; margin-bottom: 2rem;">Test pausiert</p>
            <button id="resume-btn" style="
                padding: 1rem 2rem;
                font-size: 1.2rem;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
            ">Fortsetzen</button>
        `;
        document.body.appendChild(overlay);

        document.getElementById('resume-btn').addEventListener('click', () => {
            this.resumeTest();
        });

        this.saveTestState();
    }

    resumeTest() {
        if (!this.isPaused) return;

        this.isPaused = false;
        const overlay = document.getElementById('pause-overlay');
        if (overlay) {
            overlay.remove();
        }

        this.startTimer();
    }

    startTimer() {
        if (this.timerInterval) return;

        if (!this.startTime) {
            this.startTime = Date.now();
        }

        this.updateTimerDisplay();

        this.timerInterval = setInterval(() => {
            if (this.isPaused) return;

            this.timeRemaining--;

            if (this.timeRemaining <= 0) {
                this.timeRemaining = 0;
                clearInterval(this.timerInterval);
                this.playSound('timeup');
                this.showToast('Zeit abgelaufen! Test wird abgegeben...', 'warning');
                setTimeout(() => this.submitTest(), 2000);
                return;
            }

            // Sound warnings
            if (this.config.soundEnabled) {
                if (this.timeRemaining === 300) { // 5 minutes
                    this.playSound('warning');
                    this.showToast('Noch 5 Minuten!', 'warning');
                } else if (this.timeRemaining === 60) { // 1 minute
                    this.playSound('warning');
                    this.showToast('Noch 1 Minute!', 'error');
                }
            }

            this.updateTimerDisplay();
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        this.elements.timer.textContent = display;

        // Add warning classes
        this.elements.timer.classList.remove('warning', 'danger');
        if (this.timeRemaining <= 300) { // 5 minutes
            this.elements.timer.classList.add('warning');
        }
        if (this.timeRemaining <= 60) { // 1 minute
            this.elements.timer.classList.add('danger');
        }
    }

    playSound(type) {
        if (!this.config.soundEnabled) return;

        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            let frequency, duration;
            if (type === 'warning') {
                frequency = 800;
                duration = 200;
            } else if (type === 'timeup') {
                frequency = 400;
                duration = 500;
            } else {
                frequency = 600;
                duration = 150;
            }

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        } catch (e) {
            console.warn('Sound playback failed:', e);
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 5000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    confirmSubmit() {
        const unanswered = this.exercises.length - this.userAnswers.size;

        if (unanswered > 0) {
            this.elements.confirmMessage.textContent =
                `Sie haben noch ${unanswered} Frage(n) nicht beantwortet. Möchten Sie den Test trotzdem abgeben?`;
        } else {
            this.elements.confirmMessage.textContent =
                'Möchten Sie den Test jetzt abgeben?';
        }

        this.elements.confirmModal.style.display = 'flex';
    }

    hideModal() {
        this.elements.confirmModal.style.display = 'none';
    }

    submitTest() {
        this.hideModal();

        // Stop timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.endTime = Date.now();

        // Calculate results
        const results = this.calculateResults();

        // Save to history
        this.saveTestHistory(results);

        // Clear current test state
        this.clearTestState();

        // Show results
        this.showResults(results);

        // Play completion sound
        this.playSound('complete');
    }

    calculateResults() {
        const results = {
            testId: this.testId,
            date: new Date().toISOString(),
            totalQuestions: this.exercises.length,
            answeredCount: this.userAnswers.size,
            correctCount: 0,
            incorrectCount: 0,
            score: 0,
            percentage: 0,
            timeTaken: this.startTime ? (this.endTime - this.startTime) / 1000 : 0,
            timeLimit: this.config.timeLimitMinutes * 60,
            details: [],
            byCategory: new Map(),
            byDifficulty: new Map(),
            byUnit: new Map(),
            byType: new Map(),
            byPhase: new Map()
        };

        // Check each answer
        this.exercises.forEach((exercise, index) => {
            const userAnswer = this.userAnswers.get(index);
            const correctAnswer = this.getCorrectAnswer(exercise);
            const isCorrect = this.checkAnswer(userAnswer, correctAnswer);

            if (isCorrect) {
                results.correctCount++;
            } else if (userAnswer) {
                results.incorrectCount++;
            }

            // Store details
            const detail = {
                index: index + 1,
                exercise,
                userAnswer: userAnswer || '(keine Antwort)',
                correctAnswer,
                isCorrect,
                category: exercise.category || 'Allgemein',
                difficulty: exercise.difficulty || 1,
                unit: exercise.unitNumber || 1,
                unitName: exercise.unitName || 'Unit 1',
                type: exercise.type || 'unknown',
                phase: exercise.phase || 'guided'
            };
            results.details.push(detail);

            // Aggregate by category
            const category = detail.category;
            if (!results.byCategory.has(category)) {
                results.byCategory.set(category, { total: 0, correct: 0 });
            }
            const catStats = results.byCategory.get(category);
            catStats.total++;
            if (isCorrect) catStats.correct++;

            // Aggregate by difficulty
            const difficulty = detail.difficulty;
            if (!results.byDifficulty.has(difficulty)) {
                results.byDifficulty.set(difficulty, { total: 0, correct: 0 });
            }
            const diffStats = results.byDifficulty.get(difficulty);
            diffStats.total++;
            if (isCorrect) diffStats.correct++;

            // Aggregate by unit
            const unit = detail.unitName;
            if (!results.byUnit.has(unit)) {
                results.byUnit.set(unit, { total: 0, correct: 0 });
            }
            const unitStats = results.byUnit.get(unit);
            unitStats.total++;
            if (isCorrect) unitStats.correct++;

            // Aggregate by type
            const type = detail.type;
            if (!results.byType.has(type)) {
                results.byType.set(type, { total: 0, correct: 0 });
            }
            const typeStats = results.byType.get(type);
            typeStats.total++;
            if (isCorrect) typeStats.correct++;

            // Aggregate by phase
            const phase = detail.phase;
            if (!results.byPhase.has(phase)) {
                results.byPhase.set(phase, { total: 0, correct: 0 });
            }
            const phaseStats = results.byPhase.get(phase);
            phaseStats.total++;
            if (isCorrect) phaseStats.correct++;
        });

        // Calculate score (only count answered questions)
        if (results.answeredCount > 0) {
            results.score = Math.round((results.correctCount / results.answeredCount) * 100);
            results.percentage = results.score;
        }

        return results;
    }

    getCorrectAnswer(exercise) {
        if (exercise.correctAnswer) return exercise.correctAnswer;
        if (exercise.translation) return exercise.translation;
        if (exercise.answer) return exercise.answer;

        // For reading comprehension
        if (exercise.comprehensionCheck && exercise.comprehensionCheck.correctAnswer) {
            return exercise.comprehensionCheck.correctAnswer;
        }

        return '';
    }

    checkAnswer(userAnswer, correctAnswer) {
        if (!userAnswer || !correctAnswer) return false;

        // Normalize answers for comparison
        const normalize = (str) => {
            return str.toString()
                .toLowerCase()
                .trim()
                .replace(/[áàäâ]/g, 'a')
                .replace(/[éèëê]/g, 'e')
                .replace(/[íìïî]/g, 'i')
                .replace(/[óòöô]/g, 'o')
                .replace(/[úùüû]/g, 'u')
                .replace(/ñ/g, 'n')
                .replace(/ß/g, 'ss')
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
                .replace(/\s+/g, ' ');
        };

        return normalize(userAnswer) === normalize(correctAnswer);
    }

    // State persistence methods
    saveTestState() {
        try {
            const state = {
                testId: this.testId,
                exercises: this.exercises,
                currentIndex: this.currentIndex,
                userAnswers: Array.from(this.userAnswers.entries()),
                startTime: this.startTime,
                timeRemaining: this.timeRemaining,
                config: this.config,
                savedAt: Date.now()
            };
            localStorage.setItem('test-mode-state', JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save test state:', e);
        }
    }

    loadTestState() {
        try {
            const saved = localStorage.getItem('test-mode-state');
            if (!saved) return null;

            const state = JSON.parse(saved);

            // Check if state is recent (less than 24 hours old)
            const age = Date.now() - state.savedAt;
            if (age > 24 * 60 * 60 * 1000) {
                this.clearTestState();
                return null;
            }

            return state;
        } catch (e) {
            console.error('Failed to load test state:', e);
            return null;
        }
    }

    async restoreTestState(state) {
        this.testId = state.testId;
        this.exercises = state.exercises;
        this.currentIndex = state.currentIndex;
        this.userAnswers = new Map(state.userAnswers);
        this.startTime = state.startTime;
        this.timeRemaining = state.timeRemaining;
        this.config = state.config;

        console.log('Test state restored');
    }

    clearTestState() {
        try {
            localStorage.removeItem('test-mode-state');
        } catch (e) {
            console.error('Failed to clear test state:', e);
        }
    }

    setupAutoSave() {
        // Save every 30 seconds
        setInterval(() => {
            if (this.timerInterval && !this.endTime) {
                this.saveTestState();
            }
        }, 30000);
    }

    // Test history methods
    saveTestHistory(results) {
        try {
            let history = [];
            const saved = localStorage.getItem('test-mode-history');
            if (saved) {
                history = JSON.parse(saved);
            }

            // Convert Maps to objects for JSON serialization
            const serializable = {
                ...results,
                byCategory: Object.fromEntries(results.byCategory),
                byDifficulty: Object.fromEntries(results.byDifficulty),
                byUnit: Object.fromEntries(results.byUnit),
                byType: Object.fromEntries(results.byType),
                byPhase: Object.fromEntries(results.byPhase)
            };

            history.unshift(serializable);

            // Keep only last 10 tests
            if (history.length > 10) {
                history = history.slice(0, 10);
            }

            localStorage.setItem('test-mode-history', JSON.stringify(history));
        } catch (e) {
            console.error('Failed to save test history:', e);
        }
    }

    showResults(results) {
        // Hide test interface
        document.querySelector('.test-header').style.display = 'none';
        document.querySelector('.test-container').style.display = 'none';

        // Show results container
        this.elements.resultsContainer.style.display = 'block';

        // Populate summary
        document.getElementById('scoreValue').textContent = results.score;
        document.getElementById('scorePercentage').textContent = `${results.percentage}%`;

        const minutes = Math.floor(results.timeTaken / 60);
        const seconds = Math.floor(results.timeTaken % 60);
        document.getElementById('timeDisplay').textContent =
            `${minutes}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById('correctCount').textContent = results.correctCount;
        document.getElementById('incorrectCount').textContent = results.incorrectCount;

        // Render charts and breakdowns
        this.renderCategoryAnalysis(results);
        this.renderDifficultyAnalysis(results);
        this.renderUnitAnalysis(results);
        this.renderTypeAnalysis(results);
        this.renderQuestionReview(results);

        // Setup results event listeners
        this.setupResultsListeners(results);

        // Scroll to top
        window.scrollTo(0, 0);

        // Show success message
        this.showToast('Test abgeschlossen!', 'success');
    }

    renderCategoryAnalysis(results) {
        const container = document.getElementById('categoryList');
        container.innerHTML = '';

        // Sort by accuracy (worst first - these are weaknesses)
        const sorted = Array.from(results.byCategory.entries())
            .map(([category, stats]) => ({
                category,
                ...stats,
                percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
            }))
            .sort((a, b) => a.percentage - b.percentage);

        sorted.forEach(item => {
            const div = document.createElement('div');
            div.className = 'breakdown-item';

            // Mark weaknesses (< 70%)
            if (item.percentage < 70) {
                div.classList.add('weakness');
            } else if (item.percentage >= 90) {
                div.classList.add('strength');
            }

            div.innerHTML = `
                <span class="breakdown-label">${item.category}</span>
                <div class="breakdown-stats">
                    <span class="breakdown-percentage">${item.percentage}%</span>
                    <span class="breakdown-count">${item.correct}/${item.total}</span>
                </div>
            `;

            container.appendChild(div);
        });

        // Render simple bar chart
        this.renderBarChart('categoryChart', sorted, 'category');
    }

    renderDifficultyAnalysis(results) {
        const container = document.getElementById('difficultyBreakdown');
        container.innerHTML = '';

        const sorted = Array.from(results.byDifficulty.entries())
            .map(([difficulty, stats]) => ({
                difficulty,
                ...stats,
                percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
            }))
            .sort((a, b) => a.difficulty - b.difficulty);

        sorted.forEach(item => {
            const div = document.createElement('div');
            div.className = 'breakdown-item';

            if (item.percentage < 70) {
                div.classList.add('weakness');
            } else if (item.percentage >= 90) {
                div.classList.add('strength');
            }

            div.innerHTML = `
                <span class="breakdown-label">Schwierigkeit ${item.difficulty}/5</span>
                <div class="breakdown-stats">
                    <span class="breakdown-percentage">${item.percentage}%</span>
                    <span class="breakdown-count">${item.correct}/${item.total}</span>
                </div>
            `;

            container.appendChild(div);
        });

        this.renderBarChart('difficultyChart', sorted, 'difficulty');
    }

    renderUnitAnalysis(results) {
        const container = document.getElementById('unitBreakdown');
        container.innerHTML = '';

        const sorted = Array.from(results.byUnit.entries())
            .map(([unit, stats]) => ({
                unit,
                ...stats,
                percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
            }))
            .sort((a, b) => a.percentage - b.percentage);

        sorted.forEach(item => {
            const div = document.createElement('div');
            div.className = 'breakdown-item';

            if (item.percentage < 70) {
                div.classList.add('weakness');
            } else if (item.percentage >= 90) {
                div.classList.add('strength');
            }

            div.innerHTML = `
                <span class="breakdown-label">${item.unit}</span>
                <div class="breakdown-stats">
                    <span class="breakdown-percentage">${item.percentage}%</span>
                    <span class="breakdown-count">${item.correct}/${item.total}</span>
                </div>
            `;

            container.appendChild(div);
        });

        this.renderBarChart('unitChart', sorted, 'unit');
    }

    renderTypeAnalysis(results) {
        const container = document.getElementById('typeBreakdown');
        container.innerHTML = '';

        const sorted = Array.from(results.byType.entries())
            .map(([type, stats]) => ({
                type,
                ...stats,
                percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
            }))
            .sort((a, b) => a.percentage - b.percentage);

        sorted.forEach(item => {
            const div = document.createElement('div');
            div.className = 'breakdown-item';

            if (item.percentage < 70) {
                div.classList.add('weakness');
            } else if (item.percentage >= 90) {
                div.classList.add('strength');
            }

            div.innerHTML = `
                <span class="breakdown-label">${this.formatTypeName(item.type)}</span>
                <div class="breakdown-stats">
                    <span class="breakdown-percentage">${item.percentage}%</span>
                    <span class="breakdown-count">${item.correct}/${item.total}</span>
                </div>
            `;

            container.appendChild(div);
        });
    }

    formatTypeName(type) {
        const names = {
            'multiple-choice': 'Multiple Choice',
            'fill-blank': 'Lückentext',
            'translation': 'Übersetzung',
            'vocabulary-card': 'Vokabel',
            'conjugation': 'Konjugation',
            'reading-comprehension': 'Leseverstehen'
        };
        return names[type] || type;
    }

    renderBarChart(canvasId, data, labelKey) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const parent = canvas.parentElement;
        const width = parent.clientWidth;
        const height = 300;

        canvas.width = width;
        canvas.height = height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        if (data.length === 0) return;

        const barWidth = Math.min((width / data.length) - 10, 80);
        const maxHeight = height - 60;

        data.forEach((item, index) => {
            const x = (width / data.length) * index + ((width / data.length) - barWidth) / 2;
            const barHeight = (item.percentage / 100) * maxHeight;
            const y = height - 40 - barHeight;

            // Determine color based on percentage
            let color = '#4CAF50'; // green
            if (item.percentage < 70) {
                color = '#f44336'; // red
            } else if (item.percentage < 90) {
                color = '#ff9800'; // orange
            }

            // Draw bar
            ctx.fillStyle = color;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw percentage on top
            ctx.fillStyle = '#333';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`${item.percentage}%`, x + barWidth / 2, y - 5);

            // Draw label at bottom
            ctx.font = '10px sans-serif';
            ctx.save();
            ctx.translate(x + barWidth / 2, height - 20);
            ctx.rotate(-Math.PI / 4);
            const label = item[labelKey] || `Item ${index + 1}`;
            ctx.fillText(label.toString().substring(0, 20), 0, 0);
            ctx.restore();
        });
    }

    renderQuestionReview(results) {
        const container = document.getElementById('reviewList');
        container.innerHTML = '';

        results.details.forEach(detail => {
            const div = document.createElement('div');
            div.className = `review-item ${detail.isCorrect ? 'correct' : 'incorrect'}`;
            div.dataset.filter = detail.isCorrect ? 'correct' : 'incorrect';

            const question = detail.exercise.question ||
                detail.exercise.word ||
                `Frage ${detail.index}`;

            div.innerHTML = `
                <div class="review-header">
                    <span class="review-number">Frage ${detail.index}</span>
                    <span class="review-result ${detail.isCorrect ? 'correct' : 'incorrect'}">
                        ${detail.isCorrect ? '✓ Richtig' : '✗ Falsch'}
                    </span>
                </div>
                <div class="review-question">${question}</div>
                <div class="review-answers">
                    <div class="answer-line">
                        <span class="answer-label">Ihre Antwort:</span>
                        <span class="answer-value ${detail.isCorrect ? 'correct' : 'incorrect'}">
                            ${detail.userAnswer}
                        </span>
                    </div>
                    ${!detail.isCorrect ? `
                        <div class="answer-line">
                            <span class="answer-label">Richtige Antwort:</span>
                            <span class="answer-value correct">${detail.correctAnswer}</span>
                        </div>
                    ` : ''}
                    <div class="answer-line">
                        <span class="answer-label">Kategorie:</span>
                        <span class="answer-value">${detail.category}</span>
                    </div>
                    <div class="answer-line">
                        <span class="answer-label">Schwierigkeit:</span>
                        <span class="answer-value">${detail.difficulty}/5</span>
                    </div>
                </div>
            `;

            container.appendChild(div);
        });
    }

    setupResultsListeners(results) {
        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                const items = document.querySelectorAll('.review-item');

                items.forEach(item => {
                    if (filter === 'all' || item.dataset.filter === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Close results
        document.getElementById('closeResultsBtn').addEventListener('click', () => {
            if (confirm('Möchten Sie die Ergebnisse wirklich schließen?')) {
                location.reload();
            }
        });

        // Retry test
        document.getElementById('retryTestBtn').addEventListener('click', () => {
            if (confirm('Möchten Sie einen neuen Test starten?')) {
                location.reload();
            }
        });

        // Export results
        document.getElementById('exportResultsBtn').addEventListener('click', () => {
            this.exportResults(results);
        });

        // Back to main
        document.getElementById('backToMainBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        // Print results
        const printBtn = document.createElement('button');
        printBtn.className = 'btn-action btn-print';
        printBtn.textContent = '🖨️ Drucken';
        printBtn.style.background = '#9C27B0';
        printBtn.style.color = 'white';
        printBtn.addEventListener('click', () => this.printResults());
        document.querySelector('.results-actions').insertBefore(printBtn, document.getElementById('backToMainBtn'));
    }

    exportResults(results) {
        const exportData = {
            date: new Date().toISOString(),
            score: results.score,
            percentage: results.percentage,
            correctCount: results.correctCount,
            incorrectCount: results.incorrectCount,
            totalQuestions: results.totalQuestions,
            timeTaken: results.timeTaken,
            details: results.details.map(d => ({
                index: d.index,
                question: d.exercise.question || d.exercise.word,
                userAnswer: d.userAnswer,
                correctAnswer: d.correctAnswer,
                isCorrect: d.isCorrect,
                category: d.category,
                difficulty: d.difficulty,
                unit: d.unitName
            }))
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `spanish-test-results-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Ergebnisse exportiert!', 'success');
    }

    printResults() {
        window.print();
    }
}

// Add print styles
const printStyles = document.createElement('style');
printStyles.textContent = `
    @media print {
        .test-header,
        .results-actions,
        .btn-close,
        .filter-btn,
        .chart-container {
            display: none !important;
        }

        .results-container {
            display: block !important;
        }

        .review-item {
            page-break-inside: avoid;
        }
    }

    .char-btn {
        padding: 0.25rem 0.5rem;
        margin: 0 0.125rem;
        border: 1px solid #ddd;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .char-btn:hover {
        background: #f0f0f0;
        border-color: #2196F3;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(printStyles);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const testMode = new TestMode();
    testMode.init();
});
