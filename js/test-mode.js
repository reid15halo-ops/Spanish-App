/**
 * Test Mode - Complete Testing System
 * Features: 30-minute timer, question navigation, submission, results dashboard
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
        this.renderer = null;

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

    async init() {
        try {
            // Load exercises
            await this.loadExercises();

            // Initialize renderer
            this.renderer = new window.ExerciseRenderer(this.elements.questionContent);

            // Setup event listeners
            this.setupEventListeners();

            // Build question navigation
            this.buildQuestionNavigation();

            // Show first question
            this.showQuestion(0);

            // Start timer
            this.startTimer();

            // Hide loading overlay
            this.elements.loadingOverlay.style.display = 'none';
        } catch (error) {
            console.error('Failed to initialize test mode:', error);
            alert('Fehler beim Laden des Tests. Bitte versuchen Sie es erneut.');
        }
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

        // Select a diverse subset of exercises (40 questions for a 30-min test)
        this.exercises = this.selectDiverseExercises(allExercises, 40);

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

            if (e.key === 'ArrowLeft') this.navigateQuestion(-1);
            if (e.key === 'ArrowRight') this.navigateQuestion(1);
        });
    }

    buildQuestionNavigation() {
        this.elements.questionGrid.innerHTML = '';

        this.exercises.forEach((exercise, index) => {
            const btn = document.createElement('button');
            btn.className = 'question-btn';
            btn.textContent = index + 1;
            btn.dataset.index = index;
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
        if (this.renderer && typeof this.renderer.render === 'function') {
            // Use the existing renderer
            this.renderer.render(exercise, (answer) => this.handleAnswer(index, answer));
        } else {
            // Fallback rendering
            this.renderFallback(exerciseDiv, exercise, index);
        }

        // Restore saved answer if exists
        if (this.userAnswers.has(index)) {
            this.restoreAnswer(index);
        }
    }

    renderFallback(container, exercise, index) {
        const type = exercise.type;

        // Question text
        if (exercise.question) {
            const questionP = document.createElement('p');
            questionP.className = 'exercise-question';
            questionP.textContent = exercise.question;
            container.appendChild(questionP);
        }

        // Render based on type
        if (type === 'multiple-choice') {
            this.renderMultipleChoice(container, exercise, index);
        } else if (type === 'fill-blank' || type === 'translation') {
            this.renderTextInput(container, exercise, index);
        } else if (type === 'vocabulary-card') {
            this.renderVocabularyCard(container, exercise, index);
        } else {
            // Generic rendering
            this.renderGeneric(container, exercise, index);
        }

        this.elements.questionContent.appendChild(container);
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

        // Auto-save on change
        input.addEventListener('input', (e) => {
            this.handleAnswer(index, e.target.value);
        });

        // Submit on Enter
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.navigateQuestion(1);
            }
        });

        container.appendChild(input);
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

        this.renderTextInput(card, exercise, index);
        container.appendChild(card);
    }

    renderGeneric(container, exercise, index) {
        // Generic text input for unknown types
        const p = document.createElement('p');
        p.textContent = exercise.question || 'Bitte beantworten Sie diese Frage:';
        container.appendChild(p);

        this.renderTextInput(container, exercise, index);
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
            .find(btn => btn.textContent === answer);
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
    }

    navigateQuestion(direction) {
        const newIndex = this.currentIndex + direction;
        if (newIndex >= 0 && newIndex < this.exercises.length) {
            this.showQuestion(newIndex);
        }
    }

    startTimer() {
        this.startTime = Date.now();

        this.timerInterval = setInterval(() => {
            this.timeRemaining--;

            if (this.timeRemaining <= 0) {
                this.timeRemaining = 0;
                clearInterval(this.timerInterval);
                this.submitTest();
                return;
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
        }
        this.endTime = Date.now();

        // Calculate results
        const results = this.calculateResults();

        // Show results
        this.showResults(results);
    }

    calculateResults() {
        const results = {
            totalQuestions: this.exercises.length,
            answeredCount: this.userAnswers.size,
            correctCount: 0,
            incorrectCount: 0,
            score: 0,
            percentage: 0,
            timeTaken: this.startTime ? (this.endTime - this.startTime) / 1000 : 0,
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
        const width = canvas.parentElement.clientWidth;
        const height = 300;

        canvas.width = width;
        canvas.height = height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        if (data.length === 0) return;

        const barWidth = width / data.length - 10;
        const maxHeight = height - 60;

        data.forEach((item, index) => {
            const x = index * (barWidth + 10);
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
            ctx.fillText(label.toString().substring(0, 15), 0, 0);
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
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const testMode = new TestMode();
    testMode.init();
});
