/**
 * App Controller - Integration Layer
 *
 * Coordinates between UI (UIController) and Business Logic (Phase1Controller, etc.)
 * This is the brain of the application
 */

class AppController {
    constructor(uiController) {
        this.ui = uiController;
        this.phase1 = null;
        this.adaptiveLearning = null;
        this.germanSystem = null;

        // Dynamic exercise system
        this.vocab = null;
        this.templateEngine = null;
        this.dynamicGenerator = null;
        this.progressTracker = null;
        this.useDynamicExercises = false; // Toggle for dynamic vs static

        this.state = {
            currentUnit: 1,
            currentExerciseIndex: 0,
            exercises: [],
            sessionStats: {
                correct: 0,
                total: 0,
                startTime: null
            }
        };

        // Bind UI callbacks
        this.ui.onAnswerSelected = this.handleAnswer.bind(this);
        this.ui.onHintRequested = this.getHint.bind(this);
        this.ui.onNextExercise = this.loadNextExercise.bind(this);
    }

    /**
     * Initialize the app
     */
    async initialize() {
        console.log('🚀 Initializing App Controller...');

        try {
            // Show loading
            this.ui.showLoading();

            // Initialize Phase 1 Controller
            await this.initializePhase1Controller();

            // Initialize Adaptive Learning (if available)
            this.initializeAdaptiveLearning();

            // Initialize German-Spanish System (if available)
            this.initializeGermanSystem();

            // Initialize Dynamic Exercise System (if available)
            this.useDynamicExercises = this.initializeDynamicSystem();

            // Load first unit
            await this.loadUnit(1);

            // Start session
            this.startSession();

            console.log('✅ App initialized successfully');

        } catch (error) {
            console.error('❌ Initialization error:', error);
            this.ui.showError('Fehler beim Laden der Übungen. Bitte Seite neu laden.');
        }
    }

    /**
     * Initialize Phase 1 Controller
     */
    async initializePhase1Controller() {
        if (typeof Phase1Controller === 'undefined') {
            throw new Error('Phase1Controller not found');
        }

        this.phase1 = new Phase1Controller();

        // Check if controller needs initialization
        if (typeof this.phase1.initialize === 'function') {
            await this.phase1.initialize();
        }

        console.log('✅ Phase 1 Controller initialized');
    }

    /**
     * Initialize Adaptive Learning System
     */
    initializeAdaptiveLearning() {
        if (typeof AdaptiveLearningOrchestrator !== 'undefined') {
            this.adaptiveLearning = new AdaptiveLearningOrchestrator();
            console.log('✅ Adaptive Learning initialized');
        } else {
            console.warn('⚠️ Adaptive Learning not available');
        }
    }

    /**
     * Initialize German-Spanish System
     */
    initializeGermanSystem() {
        if (typeof GermanSpanishLearningSystem !== 'undefined') {
            this.germanSystem = new GermanSpanishLearningSystem();
            console.log('✅ German-Spanish System initialized');
        } else {
            console.warn('⚠️ German-Spanish System not available');
        }
    }

    /**
     * Initialize Dynamic Exercise Generation System
     */
    initializeDynamicSystem() {
        // Check if dynamic modules are loaded
        if (typeof VocabularyDatabase === 'undefined' ||
            typeof SentenceTemplateEngine === 'undefined' ||
            typeof DynamicExerciseGenerator === 'undefined' ||
            typeof UserProgressTracker === 'undefined') {
            console.warn('⚠️ Dynamic exercise system not available');
            return false;
        }

        try {
            // Initialize components
            this.vocab = new VocabularyDatabase();
            this.templateEngine = new SentenceTemplateEngine(this.vocab);
            this.progressTracker = new UserProgressTracker();
            this.dynamicGenerator = new DynamicExerciseGenerator(
                this.vocab,
                this.templateEngine,
                this.progressTracker
            );

            console.log('✅ Dynamic Exercise System initialized');
            console.log('📊 User Progress:', this.progressTracker.getStats());

            return true;
        } catch (error) {
            console.error('❌ Error initializing dynamic system:', error);
            return false;
        }
    }

    /**
     * Load a unit
     */
    async loadUnit(unitNumber) {
        console.log(`📚 Loading Unit ${unitNumber}...`);

        try {
            // Load unit data
            const unitData = await this.loadUnitData(unitNumber);

            if (!unitData || !unitData.exercises || unitData.exercises.length === 0) {
                throw new Error(`No exercises found for unit ${unitNumber}`);
            }

            this.state.currentUnit = unitNumber;
            this.state.exercises = unitData.exercises;
            this.state.currentExerciseIndex = 0;

            // Update UI status
            this.ui.updateStatus(unitNumber, 7, 1, this.state.exercises.length);

            // Load first exercise
            this.loadExercise(0);

            console.log(`✅ Unit ${unitNumber} loaded (${this.state.exercises.length} exercises)`);

        } catch (error) {
            console.error(`❌ Error loading unit ${unitNumber}:`, error);
            throw error;
        }
    }

    /**
     * Load unit data from file
     * MODIFIED: Use mock exercises directly if JSON files not available
     */
    async loadUnitData(unitNumber) {
        const unitFiles = {
            1: 'unit1-pronouns.json',
            2: 'unit2-ser.json',
            3: 'unit3-estar.json',
            4: 'unit4-ser-estar-contrast.json',
            5: 'unit5-tener.json',
            6: 'unit6-vocabulary.json',
            7: 'unit7-integration.json'
        };

        const filename = unitFiles[unitNumber];
        if (!filename) {
            throw new Error(`Invalid unit number: ${unitNumber}`);
        }

        const path = `data/phase1-exercises/${filename}`;

        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.warn(`⚠️ Could not load ${path}, using mock exercises instead`);
            console.log('💡 This is expected when opening index.html directly (file://)');
            console.log('💡 The mock exercises provide 10 demo exercises for testing');

            // Fallback to mock exercises from Phase1Controller
            if (this.phase1 && this.phase1.exercises) {
                return {
                    unitNumber: unitNumber,
                    unitName: this.getUnitName(unitNumber),
                    exercises: this.phase1.exercises
                };
            }

            throw new Error('No exercises available (neither JSON files nor mock exercises)');
        }
    }

    /**
     * Get unit name by number
     */
    getUnitName(unitNumber) {
        const unitNames = {
            1: 'Pronomen',
            2: 'SER',
            3: 'ESTAR',
            4: 'SER/ESTAR Kontrast',
            5: 'TENER',
            6: 'Vokabular',
            7: 'Integration'
        };
        return unitNames[unitNumber] || `Unit ${unitNumber}`;
    }

    /**
     * Load an exercise by index
     */
    loadExercise(index) {
        if (index >= this.state.exercises.length) {
            this.showUnitCompletion();
            return;
        }

        const exercise = this.state.exercises[index];
        this.state.currentExerciseIndex = index;

        // Transform exercise to UI format
        const uiExercise = this.transformExerciseForUI(exercise);

        // Render in UI
        this.ui.renderExercise(uiExercise);

        // Update status and progress
        this.ui.updateStatus(
            this.state.currentUnit,
            7,
            index + 1,
            this.state.exercises.length
        );

        const progress = ((index + 1) / this.state.exercises.length) * 100;
        this.ui.updateProgress(progress);
    }

    /**
     * Transform exercise data to UI-friendly format
     */
    transformExerciseForUI(exercise) {
        const uiExercise = {
            id: exercise.id,
            type: exercise.type || 'multiple-choice',
            question: exercise.question || exercise.spanish || '',
            correctAnswer: exercise.correctAnswer || exercise.answer,
            germanBridge: this.generateGermanBridge(exercise),
            options: []
        };

        // Generate options based on type
        if (exercise.type === 'conjugation' || exercise.type === 'multiple-choice') {
            uiExercise.options = this.generateOptions(exercise);
        } else if (exercise.type === 'translation') {
            uiExercise.type = 'translation';
            uiExercise.options = [];
        } else if (exercise.options && Array.isArray(exercise.options)) {
            uiExercise.options = exercise.options;
        } else {
            // Default: create options from answer
            uiExercise.options = [
                { spanish: exercise.correctAnswer, german: exercise.german }
            ];
        }

        return uiExercise;
    }

    /**
     * Generate German bridge explanation
     */
    generateGermanBridge(exercise) {
        // Try to get from German system
        if (this.germanSystem && typeof this.germanSystem.getGermanBridge === 'function') {
            return this.germanSystem.getGermanBridge(exercise);
        }

        // Fallback: use exercise's German field
        if (exercise.german) {
            return `Im Deutschen: "${exercise.german}"`;
        }

        // Check for contrastive elements
        if (exercise.contrastiveElements && exercise.contrastiveElements.length > 0) {
            return exercise.contrastiveElements[0];
        }

        return '';
    }

    /**
     * Generate answer options
     */
    generateOptions(exercise) {
        const options = [];

        // Add correct answer
        options.push({
            spanish: exercise.correctAnswer,
            german: exercise.german || '',
            value: exercise.correctAnswer,
            isCorrect: true
        });

        // Add distractors if available
        if (exercise.distractors && Array.isArray(exercise.distractors)) {
            exercise.distractors.forEach(distractor => {
                options.push({
                    spanish: distractor.spanish || distractor,
                    german: distractor.german || '',
                    value: distractor.spanish || distractor,
                    isCorrect: false
                });
            });
        } else {
            // Generate simple distractors based on concept
            const concept = exercise.concept || '';
            if (concept.includes('ser')) {
                options.push(
                    { spanish: 'estoy', german: '(ich stehe)', value: 'estoy' },
                    { spanish: 'tengo', german: '(ich habe)', value: 'tengo' }
                );
            } else if (concept.includes('estar')) {
                options.push(
                    { spanish: 'soy', german: '(ich bin)', value: 'soy' },
                    { spanish: 'tengo', german: '(ich habe)', value: 'tengo' }
                );
            }
        }

        // Shuffle options
        return this.shuffleArray(options);
    }

    /**
     * Handle answer submission
     */
    handleAnswer(answer, index = null) {
        const exercise = this.state.exercises[this.state.currentExerciseIndex];
        const startTime = Date.now();

        // Normalize answers for comparison
        const userAnswer = this.normalizeAnswer(answer);
        const correctAnswer = this.normalizeAnswer(exercise.correctAnswer);

        // Check if correct
        const isCorrect = userAnswer === correctAnswer;

        // Update session stats
        this.state.sessionStats.total++;
        if (isCorrect) {
            this.state.sessionStats.correct++;
        }

        // Record in adaptive learning
        if (this.adaptiveLearning) {
            const responseTime = Date.now() - startTime;
            this.adaptiveLearning.recordExerciseAttempt(
                exercise,
                answer,
                isCorrect,
                responseTime
            );
        }

        // Get feedback message
        const feedback = this.generateFeedback(exercise, answer, isCorrect);

        // Show feedback in UI
        this.ui.showFeedback(
            isCorrect,
            feedback.message,
            exercise.correctAnswer
        );

        // Show explanation if incorrect
        if (!isCorrect && feedback.explanation) {
            this.ui.showExplanation(feedback.explanation);
        }

        // Show next button after delay
        if (isCorrect) {
            setTimeout(() => {
                this.loadNextExercise();
            }, 1500);
        } else {
            this.ui.showNextButton();
        }
    }

    /**
     * Generate feedback
     */
    generateFeedback(exercise, userAnswer, isCorrect) {
        let message = '';
        let explanation = '';

        if (isCorrect) {
            const messages = [
                '¡Muy bien! ✅',
                '¡Perfecto! 🎉',
                '¡Excelente! ⭐',
                'Richtig! 👍',
                'Korrekt! ✨'
            ];
            message = messages[Math.floor(Math.random() * messages.length)];
        } else {
            message = `Leider falsch. Die richtige Antwort ist: ${exercise.correctAnswer}`;

            // Generate explanation using German system
            if (this.germanSystem && typeof this.germanSystem.generateGermanOptimizedFeedback === 'function') {
                const feedback = this.germanSystem.generateGermanOptimizedFeedback(
                    exercise,
                    userAnswer,
                    false
                );
                if (feedback && feedback.explanation) {
                    explanation = feedback.explanation;
                }
            } else if (exercise.explanation) {
                explanation = exercise.explanation;
            } else {
                // Default explanation based on concept
                explanation = this.generateDefaultExplanation(exercise);
            }
        }

        return { message, explanation };
    }

    /**
     * Generate default explanation
     */
    generateDefaultExplanation(exercise) {
        const concept = exercise.concept || '';

        if (concept.includes('ser')) {
            return `
                <p><strong>SER</strong> wird verwendet für:</p>
                <ul>
                    <li><strong>D</strong>escription (Beschreibung)</li>
                    <li><strong>O</strong>ccupation (Beruf)</li>
                    <li><strong>C</strong>haracteristic (Eigenschaft)</li>
                    <li><strong>T</strong>ime (Zeit)</li>
                    <li><strong>O</strong>rigin (Herkunft)</li>
                    <li><strong>R</strong>elationship (Beziehung)</li>
                </ul>
            `;
        } else if (concept.includes('estar')) {
            return `
                <p><strong>ESTAR</strong> wird verwendet für:</p>
                <ul>
                    <li><strong>L</strong>ocation (Ort)</li>
                    <li><strong>E</strong>motion (Gefühl)</li>
                    <li><strong>C</strong>ondition (Zustand)</li>
                    <li><strong>H</strong>ealth (Gesundheit)</li>
                </ul>
            `;
        } else if (concept.includes('tener')) {
            return `
                <p><strong>TENER</strong> wird verwendet für:</p>
                <ul>
                    <li>Besitz (Yo tengo un libro)</li>
                    <li>Alter (Tengo 25 años)</li>
                    <li>Ausdrücke (tener hambre, tener miedo)</li>
                </ul>
            `;
        }

        return '<p>Bitte achte auf die Regel für dieses Konzept.</p>';
    }

    /**
     * Get hint for current exercise
     */
    getHint(level) {
        const exercise = this.state.exercises[this.state.currentExerciseIndex];

        if (!exercise) return null;

        // Try to get hints from exercise data
        if (exercise.hints && exercise.hints[level - 1]) {
            return exercise.hints[level - 1];
        }

        // Generate default hints based on concept
        const concept = exercise.concept || '';

        if (level === 1) {
            if (concept.includes('ser')) {
                return 'Denk an die DOCTOR-Regel für SER!';
            } else if (concept.includes('estar')) {
                return 'Denk an LECH (Location, Emotion, Condition, Health) für ESTAR!';
            } else if (concept.includes('tener')) {
                return 'TENER bedeutet "haben" - wird für Besitz und Alter verwendet.';
            }
            return 'Überlege, welches Verb hier am besten passt.';
        }

        if (level === 2) {
            if (concept.includes('ser')) {
                return 'SER = dauerhafte Eigenschaften (Beruf, Herkunft, Charakter)';
            } else if (concept.includes('estar')) {
                return 'ESTAR = vorübergehende Zustände (Ort, Gefühle, Gesundheit)';
            } else if (concept.includes('tener')) {
                return `TENER wird für Alter verwendet: "Yo tengo X años"`;
            }
            return 'Beachte den Kontext der Frage genau.';
        }

        if (level === 3) {
            return `Die richtige Antwort ist: <strong>${exercise.correctAnswer}</strong><br><br>${this.generateDefaultExplanation(exercise)}`;
        }

        return null;
    }

    /**
     * Load next exercise
     */
    loadNextExercise() {
        this.ui.reset();
        this.loadExercise(this.state.currentExerciseIndex + 1);
    }

    /**
     * Show unit completion
     */
    showUnitCompletion() {
        console.log('🎉 Unit completed!');

        this.ui.showCompletion(this.state.sessionStats);

        // Save progress
        this.saveProgress();
    }

    /**
     * Start session
     */
    startSession() {
        this.state.sessionStats = {
            correct: 0,
            total: 0,
            startTime: Date.now()
        };

        if (this.adaptiveLearning && typeof this.adaptiveLearning.startSession === 'function') {
            this.adaptiveLearning.startSession();
        }

        console.log('✅ Session started');
    }

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        try {
            const progress = {
                currentUnit: this.state.currentUnit,
                stats: this.state.sessionStats,
                timestamp: Date.now()
            };

            localStorage.setItem('spanish-app-progress', JSON.stringify(progress));
            console.log('✅ Progress saved');
        } catch (error) {
            console.warn('⚠️ Could not save progress:', error);
        }
    }

    /**
     * Normalize answer for comparison
     */
    normalizeAnswer(answer) {
        if (!answer) return '';

        return answer
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''); // Remove accents
    }

    /**
     * Shuffle array (Fisher-Yates algorithm)
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppController;
}
