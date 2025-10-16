/**
 * Spanish Learning App - Main Application (ASCII-ONLY Version + Conjugator)
 * Implements lessons, exercises, vocabulary learning, and verb conjugation
 * IMPORTANT: All German text is ASCII-only (umlauts normalized)
 */

// ============================================================================
// UTILITY FUNCTIONS - Must be at the top
// ============================================================================

/**
 * UTF-8 fetch for CSV import
 * Ensures proper UTF-8 decoding when loading external files
 */
async function fetchTextUtf8(url) {
    const response = await fetch(url, { cache: 'no-store' });
    const buffer = await response.arrayBuffer();
    return new TextDecoder('utf-8', { fatal: false }).decode(buffer);
}

/**
 * German ASCII-only mapping
 * Normalizes German umlauts to ASCII equivalents
 * ä?ae, ö?oe, ü?ue, ß?ss
 */
function toAsciiDe(s = '') {
    return s
        .replaceAll('Ä', 'Ae').replaceAll('Ö', 'Oe').replaceAll('Ü', 'Ue')
        .replaceAll('ä', 'ae').replaceAll('ö', 'oe').replaceAll('ü', 'ue')
        .replaceAll('ß', 'ss');
}

/**
 * Spanish normalization for tolerant comparison
 * Removes accents and normalizes case for comparison
 * Preserves original Spanish for display
 */
function normEs(s = '') {
    return s
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

/**
 * Enhanced ASCII normalization for German text
 * Wraps existing asciiNormalizer if available
 */
function normalizeAsciiDe(text) {
    if (typeof asciiNormalizer !== 'undefined' && asciiNormalizer.normalize) {
        return asciiNormalizer.normalize(text);
    }
    return toAsciiDe(text);
}

/**
 * ASCII compliance guard
 * Throws error if German umlauts are found
 */
function asciiGuard(text, context = 'text') {
    if (typeof text !== 'string') return;
    
    const violations = text.match(/[äöüÄÖÜß]/g);
    if (violations && violations.length > 0) {
        console.warn(`ASCII violation in ${context}:`, violations);
        // Don't throw in production, just warn
        if (window.location.hostname === 'localhost') {
            // Only throw in development
            // throw new Error(`ASCII violation in ${context}: ${violations.join(', ')}`);
        }
    }
}

/**
 * Spanish answer validation
 * Tolerant comparison for Spanish text with accents
 */
function validateSpanishAnswer(userAnswer, correctAnswer, options = {}) {
    const {
        strictAccents = false,
        allowTypos = true,
        minConfidence = 0.7
    } = options;

    // Normalize both answers
    const normalizedUser = normEs(userAnswer);
    const normalizedCorrect = normEs(correctAnswer);

    // Exact match (after normalization)
    if (normalizedUser === normalizedCorrect) {
        return {
            correct: true,
            score: 1.0,
            feedback: 'Perfekt!'
        };
    }

    // Check for typos if allowed
    if (allowTypos) {
        const distance = levenshteinDistance(normalizedUser, normalizedCorrect);
        const maxDistance = Math.ceil(normalizedCorrect.length * 0.2); // 20% error tolerance
        
        if (distance <= maxDistance) {
            const score = 1 - (distance / normalizedCorrect.length);
            
            if (score >= minConfidence) {
                return {
                    correct: true,
                    score,
                    feedback: 'Fast richtig! (Kleine Fehler)',
                    suggestion: correctAnswer
                };
            }
        }
    }

    return {
        correct: false,
        score: 0,
        feedback: 'Nicht ganz richtig',
        suggestion: correctAnswer
    };
}

/**
 * Levenshtein distance for fuzzy matching
 */
function levenshteinDistance(str1, str2) {
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;

    for (let i = 0; i <= len2; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= len1; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len2; i++) {
        for (let j = 1; j <= len1; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[len2][len1];
}

// ============================================================================
// DATA LOADING - Dataset management
// ============================================================================

/**
 * Global dataset storage
 */
let DATA = [];

/**
 * Load items from JSON or CSV
 * Prefers JSON, falls back to CSV if needed
 * Automatically normalizes German text to ASCII
 */
async function loadItems() {
    try {
        // Try JSON first (preferred)
        const response = await fetch('data/items.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('JSON not found');
        
        const items = await response.json();
        DATA = items.map(item => ({
            ...item,
            de: toAsciiDe(item.de || ''),
            category: toAsciiDe(item.category || 'Allgemein')
        }));
        
        console.log(`? Loaded ${DATA.length} items from JSON`);
        
    } catch (error) {
        console.warn('JSON loading failed, trying CSV fallback:', error.message);
        
        try {
            // Fallback to CSV
            const csvText = await fetchTextUtf8('data/items.csv');
            const rows = csvText.split(/\r?\n/).slice(1).filter(Boolean);
            
            DATA = rows.map(line => {
                const [src, es, de, type, examples, tags, difficulty] = line.split(',');
                return {
                    src: src || '',
                    es: es || '',
                    de: toAsciiDe(de || ''),
                    type: type || 'word',
                    examples: (examples || '').split(';').filter(Boolean),
                    tags: (tags || '').split('|').filter(Boolean),
                    difficulty: Number(difficulty || '2')
                };
            });
            
            console.log(`? Loaded ${DATA.length} items from CSV`);
            
        } catch (csvError) {
            console.error('Failed to load data from both JSON and CSV:', csvError);
            DATA = [];
        }
    }
    
    // Validate ASCII compliance for all loaded data
    DATA.forEach((item, index) => {
        try {
            asciiGuard(item.de, `item ${index} German text`);
            if (item.category) {
                asciiGuard(item.category, `item ${index} category`);
            }
        } catch (error) {
            console.warn(`ASCII violation in loaded item ${index}:`, error);
        }
    });
    
    return DATA;
}

// ============================================================================
// MULTIPLE CHOICE LOGIC - Intelligent distractor selection
// ============================================================================

/**
 * Pick intelligent distractors for multiple choice
 * Filters by difficulty and similarity to avoid confusion
 * 
 * @param {Array} pool - Available vocabulary items
 * @param {Object} answer - Correct answer item
 * @param {number} k - Number of distractors to pick (default: 3)
 * @returns {Array} Selected distractor items
 */
function pickDistractors(pool, answer, k = 3) {
    const normalizedAnswer = normEs(answer.es || answer.spanish);
    
    const candidates = pool
        // No duplicates
        .filter(x => normEs(x.es || x.spanish) !== normalizedAnswer)
        // Similar difficulty (±1 level)
        .filter(x => Math.abs((x.difficulty || 2) - (answer.difficulty || 2)) <= 1)
        // Not too similar (avoid confusion)
        .filter(x => {
            const normalized = normEs(x.es || x.spanish);
            return normalized.length > 1 && levenshteinDistance(normalized, normalizedAnswer) > 2;
        });

    // Fallback if too few candidates: use any item except answer
    if (candidates.length < k) {
        const fallback = pool
            .filter(x => normEs(x.es || x.spanish) !== normalizedAnswer)
            .slice(0, k);
        return fallback.sort(() => Math.random() - 0.5).slice(0, k);
    }

    // Shuffle and return k items
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, k);
}

/**
 * Build Multiple Choice exercise HTML
 * 
 * @param {Object} item - Vocabulary item for the question
 * @param {Array} pool - Available vocabulary pool
 * @returns {string} HTML for the exercise
 */
function buildMC(item, pool) {
    const distractors = pickDistractors(pool, item, 3);
    
    // Combine correct answer with distractors
    const options = [
        ...distractors.map(d => toAsciiDe(d.de || d.german)),
        toAsciiDe(item.de || item.german)
    ];
    
    // Shuffle options
    const shuffled = options.sort(() => Math.random() - 0.5);

    const prompt = `
        <div class="q">
            <p><strong>${item.es || item.spanish}</strong> – waehle die Uebersetzung</p>
        </div>
    `;
    
    const answersHtml = shuffled.map(txt => 
        `<button class="mc-opt" data-val="${encodeURIComponent(txt)}">${txt}</button>`
    ).join('');

    return {
        promptHtml: prompt,
        answersHtml: `<div class="mc">${answersHtml}</div>`,
        correctAnswer: toAsciiDe(item.de || item.german)
    };
}

/**
 * Setup Multiple Choice event listeners
 * Attaches click handlers to MC options
 * 
 * @param {HTMLElement} area - Answer area element
 */
function setupMCListeners(area) {
    // Remove old listeners
    area.querySelectorAll('.mc-opt').forEach(btn => {
        btn.onclick = null;
    });
    
    // Add new listeners
    area.querySelectorAll('.mc-opt').forEach(btn => {
        btn.addEventListener('click', (ev) => {
            // Deselect all
            area.querySelectorAll('.mc-opt').forEach(b => b.classList.remove('sel', 'selected'));
            // Select clicked
            ev.currentTarget.classList.add('sel', 'selected');
        });
    });
}

/**
 * Check Multiple Choice answer
 * 
 * @param {HTMLElement} area - Answer area element
 * @param {string} correctAnswer - Correct answer text
 * @returns {Object} Result object with correct flag and selected answer
 */
function checkMC(area, correctAnswer) {
    const selected = area.querySelector('.mc-opt.sel, .mc-opt.selected');
    
    if (!selected) {
        return {
            correct: false,
            error: 'no-selection',
            message: 'Bitte waehle eine Antwort.'
        };
    }
    
    const selectedValue = decodeURIComponent(selected.dataset.val || '');
    const normalizedSelected = toAsciiDe(selectedValue);
    const normalizedCorrect = toAsciiDe(correctAnswer);
    
    return {
        correct: normalizedSelected === normalizedCorrect,
        selectedValue,
        correctAnswer
    };
}

// ============================================================================
// MAIN APPLICATION CLASS
// ============================================================================

class SpanishApp {
    constructor() {
        this.db = null;
        this.currentExercise = null;
        this.currentSession = [];
        this.sessionIndex = 0;
        this.mode = 'learn'; // 'learn', 'srs', 'free-pick', 'conjugation'
        this.srsSystem = new LeitnerSystem();
        this.vocabulary = [];
        
        // Conjugation system
        this.conjugator = new SpanishConjugator();
        this.conjugatorLoaded = false;
        
        // UI Elements
        this.exerciseContainer = document.getElementById('exercise-container');
        this.feedbackContainer = document.getElementById('feedback-container');
        this.statusBar = document.getElementById('status-bar');
        this.checkBtn = document.getElementById('check-btn');
        this.repeatItemBtn = document.getElementById('repeat-item-btn');
        this.repeatRoundBtn = document.getElementById('repeat-round-btn');
        
        // Debug elements
        this.debugModeSelect = document.getElementById('debug-mode-select');
        this.debugForceTypeSelect = document.getElementById('debug-force-type-select');
        this.debugSrsToggle = document.getElementById('debug-srs-toggle');
        this.debugSrsResetBox = document.getElementById('debug-srs-reset-box');
        this.debugSrsDueNow = document.getElementById('debug-srs-due-now');
        this.debugDbReimport = document.getElementById('debug-db-reimport');
        
        this.initializeApp();
    }

    async initializeApp() {
        try {
            await this.initializeDatabase();
            await this.loadVocabulary();
            await this.initializeConjugator();
            this.setupEventListeners();
            this.setupDebugControls();
            this.updateStatusBar();
            this.startLearningSession();
            
            console.log('?? Spanish Learning App with Conjugator initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            // ASCII-only error message
            this.showError('App-Initialisierung fehlgeschlagen: ' + error.message);
        }
    }

    async initializeConjugator() {
        try {
            await this.conjugator.initialize();
            this.conjugatorLoaded = true;
            console.log('?? Conjugator system loaded successfully');
        } catch (error) {
            console.warn('Conjugator failed to load:', error);
            this.conjugatorLoaded = false;
        }
    }

    async initializeDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('SpanishLearningApp', 1);
            
            request.onerror = () => reject(request.error);
            
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create vocabulary store
                if (!db.objectStoreNames.contains('vocabulary')) {
                    const vocabStore = db.createObjectStore('vocabulary', { keyPath: 'id', autoIncrement: true });
                    vocabStore.createIndex('spanish', 'spanish', { unique: false });
                    vocabStore.createIndex('german', 'german', { unique: false });
                    vocabStore.createIndex('category', 'category', { unique: false });
                    vocabStore.createIndex('srsBox', 'srsBox', { unique: false });
                }
                
                // Create user progress store
                if (!db.objectStoreNames.contains('progress')) {
                    const progressStore = db.createObjectStore('progress', { keyPath: 'id' });
                }
                
                // Mark database as no-gamification compliant
                localStorage.setItem('SpanishLearningApp_schema', 'vNoGame1');
            };
        });
    }

    async loadVocabulary() {
        // Try to load from data/items.json first
        try {
            const response = await fetch('data/items.json');
            if (response.ok) {
                const items = await response.json();
                await this.importItemsFromJson(items);
                console.log(`?? Loaded ${items.length} items from data/items.json`);
            } else {
                throw new Error('items.json not found');
            }
        } catch (error) {
            console.warn('Could not load items.json, using fallback vocabulary');
            // Check if vocabulary exists in database
            const existingVocab = await this.getAllVocabulary();
            
            if (existingVocab.length === 0) {
                // Load initial vocabulary (ASCII-normalized)
                await this.importInitialVocabulary();
            }
        }
        
        this.vocabulary = await this.getAllVocabulary();
        console.log(`?? Loaded ${this.vocabulary.length} vocabulary items`);
    }

    async importItemsFromJson(items) {
        const transaction = this.db.transaction(['vocabulary'], 'readwrite');
        const store = transaction.objectStore('vocabulary');
        
        // Clear existing data
        await store.clear();
        
        for (const item of items) {
            // Ensure German text is ASCII-normalized
            const vocabularyItem = {
                spanish: item.es || item.spanish,
                german: normalizeAsciiDe(item.de || item.german),
                category: normalizeAsciiDe(item.category || 'Allgemein'),
                difficulty: item.difficulty || 1,
                srsBox: 0,
                nextReview: Date.now(),
                examples: item.examples || [],
                tags: item.tags || [],
                src: item.src || ''
            };
            
            // Validate ASCII compliance for German text
            asciiGuard(vocabularyItem.german, 'vocabulary item German field');
            asciiGuard(vocabularyItem.category, 'vocabulary item category');
            
            await store.add(vocabularyItem);
        }
        
        console.log('? Items imported from JSON with ASCII normalization');
    }

    async importInitialVocabulary() {
        const initialVocabulary = [
            // Basic Greetings - ASCII-normalized German
            { spanish: 'hola', german: 'hallo', category: 'Begruessung', difficulty: 1, srsBox: 0, nextReview: Date.now() },
            { spanish: 'adiós', german: 'auf Wiedersehen', category: 'Begruessung', difficulty: 1, srsBox: 0, nextReview: Date.now() },
            { spanish: 'gracias', german: 'danke', category: 'Hoeflichkeit', difficulty: 1, srsBox: 0, nextReview: Date.now() },
            { spanish: 'por favor', german: 'bitte', category: 'Hoeflichkeit', difficulty: 1, srsBox: 0, nextReview: Date.now() },
            { spanish: 'disculpe', german: 'entschuldigung', category: 'Hoeflichkeit', difficulty: 2, srsBox: 0, nextReview: Date.now() },
            
            // Numbers
            { spanish: 'uno', german: 'eins', category: 'Zahlen', difficulty: 1, srsBox: 0, nextReview: Date.now() },
            { spanish: 'dos', german: 'zwei', category: 'Zahlen', difficulty: 1, srsBox: 0, nextReview: Date.now() },
            { spanish: 'tres', german: 'drei', category: 'Zahlen', difficulty: 1, srsBox: 0, nextReview: Date.now() },
            { spanish: 'cuatro', german: 'vier', category: 'Zahlen', difficulty: 1, srsBox: 0, nextReview: Date.now() },
            { spanish: 'cinco', german: 'fuenf', category: 'Zahlen', difficulty: 1, srsBox: 0, nextReview: Date.now() },
            
            // Family - ASCII-normalized
            { spanish: 'familia', german: 'Familie', category: 'Familie', difficulty: 2, srsBox: 0, nextReview: Date.now() },
            { spanish: 'padre', german: 'Vater', category: 'Familie', difficulty: 2, srsBox: 0, nextReview: Date.now() },
            { spanish: 'madre', german: 'Mutter', category: 'Familie', difficulty: 2, srsBox: 0, nextReview: Date.now() },
            { spanish: 'hijo', german: 'Sohn', category: 'Familie', difficulty: 2, srsBox: 0, nextReview: Date.now() },
            { spanish: 'hija', german: 'Tochter', category: 'Familie', difficulty: 2, srsBox: 0, nextReview: Date.now() },
            
            // Colors
            { spanish: 'rojo', german: 'rot', category: 'Farben', difficulty: 1, srsBox: 0, nextReview: Date.now() },
            { spanish: 'azul', german: 'blau', category: 'Farben', difficulty: 1, srsBox: 0, nextReview: Date.now() },
            { spanish: 'verde', german: 'gruen', category: 'Farben', difficulty: 1, srsBox: 0, nextReview: Date.now() },
            { spanish: 'amarillo', german: 'gelb', category: 'Farben', difficulty: 2, srsBox: 0, nextReview: Date.now() },
            { spanish: 'negro', german: 'schwarz', category: 'Farben', difficulty: 1, srsBox: 0, nextReview: Date.now() },
            
            // Food
            { spanish: 'comida', german: 'Essen', category: 'Essen', difficulty: 2, srsBox: 0, nextReview: Date.now() },
            { spanish: 'agua', german: 'Wasser', category: 'Essen', difficulty: 1, srsBox: 0, nextReview: Date.now() },
            { spanish: 'pan', german: 'Brot', category: 'Essen', difficulty: 1, srsBox: 0, nextReview: Date.now() },
            { spanish: 'carne', german: 'Fleisch', category: 'Essen', difficulty: 2, srsBox: 0, nextReview: Date.now() },
            { spanish: 'fruta', german: 'Obst', category: 'Essen', difficulty: 2, srsBox: 0, nextReview: Date.now() },
            
            // Common Verbs
            { spanish: 'ser', german: 'sein', category: 'Verben', difficulty: 3, srsBox: 0, nextReview: Date.now() },
            { spanish: 'estar', german: 'sich befinden', category: 'Verben', difficulty: 3, srsBox: 0, nextReview: Date.now() },
            { spanish: 'tener', german: 'haben', category: 'Verben', difficulty: 3, srsBox: 0, nextReview: Date.now() },
            { spanish: 'hacer', german: 'machen', category: 'Verben', difficulty: 3, srsBox: 0, nextReview: Date.now() },
            { spanish: 'ir', german: 'gehen', category: 'Verben', difficulty: 3, srsBox: 0, nextReview: Date.now() },
            
            // Time
            { spanish: 'hoy', german: 'heute', category: 'Zeit', difficulty: 2, srsBox: 0, nextReview: Date.now() },
            { spanish: 'mañana', german: 'morgen', category: 'Zeit', difficulty: 2, srsBox: 0, nextReview: Date.now() },
            { spanish: 'ayer', german: 'gestern', category: 'Zeit', difficulty: 2, srsBox: 0, nextReview: Date.now() },
            { spanish: 'ahora', german: 'jetzt', category: 'Zeit', difficulty: 2, srsBox: 0, nextReview: Date.now() },
            { spanish: 'después', german: 'spaeter', category: 'Zeit', difficulty: 3, srsBox: 0, nextReview: Date.now() }
        ];

        const transaction = this.db.transaction(['vocabulary'], 'readwrite');
        const store = transaction.objectStore('vocabulary');
        
        for (const item of initialVocabulary) {
            // Validate ASCII compliance
            asciiGuard(item.german, 'initial vocabulary German field');
            asciiGuard(item.category, 'initial vocabulary category');
            
            await store.add(item);
        }
        
        console.log('? Initial vocabulary imported (ASCII-normalized)');
    }

    async getAllVocabulary() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['vocabulary'], 'readonly');
            const store = transaction.objectStore('vocabulary');
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async updateVocabularyItem(item) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['vocabulary'], 'readwrite');
            const store = transaction.objectStore('vocabulary');
            const request = store.put(item);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    setupEventListeners() {
        this.checkBtn.addEventListener('click', () => this.checkAnswer());
        this.repeatItemBtn.addEventListener('click', () => this.repeatCurrentItem());
        this.repeatRoundBtn.addEventListener('click', () => this.restartSession());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.checkAnswer();
            }
        });
    }

    setupDebugControls() {
        this.debugModeSelect.addEventListener('change', () => {
            this.mode = this.debugModeSelect.value;
            this.startLearningSession();
        });

        this.debugSrsResetBox.addEventListener('click', async () => {
            await this.resetAllToBox0();
            this.startLearningSession();
        });

        this.debugSrsDueNow.addEventListener('click', async () => {
            await this.makeAllDueNow();
            this.startLearningSession();
        });

        this.debugDbReimport.addEventListener('click', async () => {
            await this.reimportDatabase();
            this.startLearningSession();
        });
    }

    async startLearningSession() {
        try {
            this.vocabulary = await this.getAllVocabulary();
            
            if (this.vocabulary.length === 0 && !this.conjugatorLoaded) {
                // ASCII-only message
                this.showMessage('Keine Vokabeln verfuegbar. Importiere zuerst Inhalte.');
                return;
            }

            // Handle conjugation mode
            if (this.mode === 'conjugation' && this.conjugatorLoaded) {
                this.startConjugationSession();
                return;
            }

            // Get practice queue based on mode
            if (this.mode === 'srs' && this.debugSrsToggle.checked) {
                this.currentSession = this.srsSystem.getPracticeQueue(this.vocabulary, 10);
            } else {
                // Learning mode: focus on new and low-box items
                this.currentSession = this.vocabulary
                    .filter(item => item.srsBox <= 2)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 10);
            }

            if (this.currentSession.length === 0) {
                // ASCII-only message
                this.showMessage('Alle Vokabeln sind gelernt! ??');
                return;
            }

            this.sessionIndex = 0;
            this.nextExercise();
            
        } catch (error) {
            console.error('Failed to start learning session:', error);
            this.showError('Fehler beim Starten der Lernsession: ' + error.message);
        }
    }

    startConjugationSession() {
        try {
            // Generate 10 conjugation exercises
            this.currentSession = [];
            
            for (let i = 0; i < 10; i++) {
                const exercise = this.conjugator.generateExercise({
                    tenseFilter: ['presente', 'preterito', 'imperfecto', 'futuro'],
                    maxFrecuencia: 2
                });
                this.currentSession.push(exercise);
            }

            this.sessionIndex = 0;
            this.nextExercise();
            
        } catch (error) {
            console.error('Failed to start conjugation session:', error);
            this.showError('Fehler beim Starten der Konjugationssession: ' + error.message);
        }
    }

    nextExercise() {
        if (this.sessionIndex >= this.currentSession.length) {
            this.endSession();
            return;
        }

        if (this.mode === 'conjugation') {
            this.currentExercise = this.createConjugationExercise(this.currentSession[this.sessionIndex]);
        } else {
            const vocabItem = this.currentSession[this.sessionIndex];
            this.currentExercise = this.createExercise(vocabItem);
        }
        
        this.renderExercise();
        this.updateStatusBar();
    }

    createConjugationExercise(conjugationData) {
        return {
            type: 'conjugation',
            infinitivo: conjugationData.infinitivo,
            traduccion: conjugacionData.traduccion,
            tiempo: conjugationData.tiempo,
            tiempoName: conjugacionData.tiempoName,
            persona: conjugacionData.persona,
            correctAnswer: conjugacionData.correctAnswer,
            prompt: conjugacionData.prompt,
            userAnswer: null
        };
    }

    createExercise(vocabItem) {
        const exerciseTypes = ['choice', 'typing', 'match'];
        const forceType = this.debugForceTypeSelect.value;
        const exerciseType = forceType || this.getRandomExerciseType(exerciseTypes);
        
        switch (exerciseType) {
            case 'choice':
                return this.createChoiceExercise(vocabItem);
            case 'typing':
                return this.createTypingExercise(vocabItem);
            case 'match':
                return this.createMatchExercise(vocabItem);
            default:
                return this.createChoiceExercise(vocabItem);
        }
    }

    getRandomExerciseType(types) {
        return types[Math.floor(Math.random() * types.length)];
    }

    createChoiceExercise(vocabItem) {
        const isSpanishToGerman = Math.random() > 0.5;
        const question = isSpanishToGerman ? vocabItem.spanish : vocabItem.german;
        const correctAnswer = isSpanishToGerman ? vocabItem.german : vocabItem.spanish;
        
        // Generate wrong answers from other vocabulary
        const wrongAnswers = this.vocabulary
            .filter(v => v.id !== vocabItem.id)
            .map(v => isSpanishToGerman ? v.german : v.spanish)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
        
        const allChoices = [correctAnswer, ...wrongAnswers]
            .sort(() => Math.random() - 0.5);

        return {
            type: 'choice',
            vocabItem,
            question,
            correctAnswer,
            choices: allChoices,
            direction: isSpanishToGerman ? 'es-de' : 'de-es',
            userAnswer: null
        };
    }

    createTypingExercise(vocabItem) {
        const isSpanishToGerman = Math.random() > 0.5;
        const question = isSpanishToGerman ? vocabItem.spanish : vocabItem.german;
        const correctAnswer = isSpanishToGerman ? vocabItem.german : vocabItem.spanish;

        return {
            type: 'typing',
            vocabItem,
            question,
            correctAnswer,
            direction: isSpanishToGerman ? 'es-de' : 'de-es',
            userAnswer: null
        };
    }

    createMatchExercise(vocabItem) {
        // Create pairs to match
        const pairs = [vocabItem];
        const additionalPairs = this.vocabulary
            .filter(v => v.id !== vocabItem.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
        
        pairs.push(...additionalPairs);
        
        const leftSide = pairs.map(p => ({ text: p.spanish, id: p.id }));
        const rightSide = pairs.map(p => ({ text: p.german, id: p.id }))
            .sort(() => Math.random() - 0.5);

        return {
            type: 'match',
            vocabItem,
            leftSide,
            rightSide,
            matches: {},
            correctMatches: pairs.reduce((acc, p) => {
                acc[p.spanish] = p.german;
                return acc;
            }, {})
        };
    }

    renderExercise() {
        if (!this.currentExercise) return;

        const exercise = this.currentExercise;
        let html = '';

        switch (exercise.type) {
            case 'choice':
                html = this.renderChoiceExercise(exercise);
                break;
            case 'typing':
                html = this.renderTypingExercise(exercise);
                break;
            case 'match':
                html = this.renderMatchExercise(exercise);
                break;
            case 'conjugation':
                html = this.renderConjugationExercise(exercise);
                break;
        }

        this.exerciseContainer.innerHTML = html;
        this.feedbackContainer.innerHTML = '';
        this.checkBtn.style.display = 'inline-block';
        this.repeatItemBtn.style.display = 'none';
        this.setupExerciseEventListeners();
    }

    renderConjugationExercise(exercise) {
        return `
            <div class="exercise conjugation-exercise">
                <div class="exercise-header">
                    <span class="exercise-type">Konjugation</span>
                    <span class="tense">${exercise.tiempoName}</span>
                </div>
                <div class="conjugation-prompt">
                    <h2>${exercise.prompt}</h2>
                </div>
                <div class="conjugation-details">
                    <div class="verb-info">
                        <span class="infinitive">${exercise.infinitivo}</span>
                        <span class="translation">(${exercise.traduccion})</span>
                    </div>
                    <div class="person-indicator">
                        <strong>${exercise.persona}</strong>
                    </div>
                </div>
                <div class="answer-input">
                    <input type="text" id="conjugation-input" placeholder="Konjugierte Form..." autocomplete="off">
                </div>
            </div>
        `;
    }

    renderChoiceExercise(exercise) {
        // ASCII-only direction text
        const directionText = exercise.direction === 'es-de' ? 'Spanisch ? Deutsch' : 'Deutsch ? Spanisch';
        
        return `
            <div class="exercise choice-exercise">
                <div class="exercise-header">
                    <span class="exercise-type">Multiple Choice</span>
                    <span class="direction">${directionText}</span>
                </div>
                <div class="question">
                    <h2>${exercise.question}</h2>
                </div>
                <div class="choices">
                    ${exercise.choices.map((choice, index) => `
                        <button class="choice-btn" data-choice="${choice}">
                            ${choice}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderTypingExercise(exercise) {
        // ASCII-only direction text
        const directionText = exercise.direction === 'es-de' ? 'Spanisch ? Deutsch' : 'Deutsch ? Spanisch';
        
        return `
            <div class="exercise typing-exercise">
                <div class="exercise-header">
                    <span class="exercise-type">Eingabe</span>
                    <span class="direction">${directionText}</span>
                </div>
                <div class="question">
                    <h2>${exercise.question}</h2>
                </div>
                <div class="answer-input">
                    <input type="text" id="typing-input" placeholder="Deine Antwort..." autocomplete="off">
                </div>
            </div>
        `;
    }

    renderMatchExercise(exercise) {
        return `
            <div class="exercise match-exercise">
                <div class="exercise-header">
                    <span class="exercise-type">Zuordnung</span>
                    <span class="direction">Spanisch ? Deutsch</span>
                </div>
                <div class="match-container">
                    <div class="match-left">
                        ${exercise.leftSide.map(item => `
                            <div class="match-item" data-id="${item.id}" data-text="${item.text}">
                                ${item.text}
                            </div>
                        `).join('')}
                    </div>
                    <div class="match-right">
                        ${exercise.rightSide.map(item => `
                            <div class="match-item" data-id="${item.id}" data-text="${item.text}">
                                ${item.text}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    setupExerciseEventListeners() {
        const exercise = this.currentExercise;

        if (exercise.type === 'choice') {
            document.querySelectorAll('.choice-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    exercise.userAnswer = btn.dataset.choice;
                });
            });
        } else if (exercise.type === 'typing') {
            const input = document.getElementById('typing-input');
            input.focus();
            input.addEventListener('input', () => {
                exercise.userAnswer = input.value.trim();
            });
        } else if (exercise.type === 'conjugation') {
            const input = document.getElementById('conjugation-input');
            input.focus();
            input.addEventListener('input', () => {
                exercise.userAnswer = input.value.trim();
            });
        } else if (exercise.type === 'match') {
            this.setupMatchingLogic();
        } else if (exercise.type === 'mc') {
            // Multiple Choice setup
            setupMCListeners(this.exerciseContainer);
        }
    }

    setupMatchingLogic() {
        let selectedLeft = null;
        let selectedRight = null;

        document.querySelectorAll('.match-left .match-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.match-left .match-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                selectedLeft = item;
                this.tryMatch(selectedLeft, selectedRight);
            });
        });

        document.querySelectorAll('.match-right .match-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.match-right .match-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                selectedRight = item;
                this.tryMatch(selectedLeft, selectedRight);
            });
        });
    }

    tryMatch(left, right) {
        if (!left || !right) return;

        const exercise = this.currentExercise;
        const leftText = left.dataset.text;
        const rightText = right.dataset.text;
        
        exercise.matches[leftText] = rightText;
        
        left.classList.add('matched');
        right.classList.add('matched');
        left.classList.remove('selected');
        right.classList.remove('selected');
        
        // Check if all matches are made
        if (Object.keys(exercise.matches).length === exercise.leftSide.length) {
            // Auto-check when all matches are made
            setTimeout(() => this.checkAnswer(), 500);
        }
    }

    async checkAnswer() {
        if (!this.currentExercise) return;

        const exercise = this.currentExercise;
        let isCorrect = false;
        let validationResult = null;

        switch (exercise.type) {
            case 'choice':
                isCorrect = exercise.userAnswer === exercise.correctAnswer;
                break;
            case 'typing':
                isCorrect = this.checkTypingAnswer(exercise);
                break;
            case 'conjugation':
                validationResult = this.checkConjugationAnswer(exercise);
                isCorrect = validationResult.correct;
                break;
            case 'match':
                isCorrect = this.checkMatchExercise(exercise);
                break;
            case 'mc':
                // Multiple Choice check
                const mcResult = checkMC(this.exerciseContainer, exercise.correctAnswer);
                isCorrect = mcResult.correct;
                exercise.userAnswer = mcResult.selectedValue;
                break;
        }

        // Update SRS for vocabulary items
        if (exercise.vocabItem) {
            if (isCorrect) {
                this.srsSystem.promote(exercise.vocabItem);
            } else {
                this.srsSystem.demote(exercise.vocabItem);
            }
            await this.updateVocabularyItem(exercise.vocabItem);
        }

        // Show feedback
        this.showFeedback(isCorrect, exercise, validationResult);

        // Update UI
        this.checkBtn.style.display = 'none';
        this.repeatItemBtn.style.display = 'inline-block';
        
        // Auto-advance after 2 seconds for correct answers
        if (isCorrect) {
            setTimeout(() => {
                this.sessionIndex++;
                this.nextExercise();
            }, 2000);
        }
    }

    checkConjugationAnswer(exercise) {
        if (!exercise.userAnswer) {
            return {
                correct: false,
                score: 0,
                feedback: 'Keine Antwort eingegeben'
            };
        }

        // Use Spanish normalizer for validation
        return validateSpanishAnswer(exercise.userAnswer, exercise.correctAnswer, {
            strictAccents: false,
            allowTypos: true,
            minConfidence: 0.7
        });
    }

    /**
     * Enhanced typing answer check with ASCII normalization
     */
    checkTypingAnswer(exercise) {
        const userAnswer = exercise.userAnswer;
        const correctAnswer = exercise.correctAnswer;
        
        if (!userAnswer) return false;
        
        // For German answers, normalize both user input and correct answer
        if (exercise.direction === 'es-de') {
            const normalizedUser = asciiNormalizer.normalizeForMatching(userAnswer);
            const normalizedCorrect = asciiNormalizer.normalizeForMatching(correctAnswer);
            
            // Exact match after normalization
            if (normalizedUser === normalizedCorrect) return true;
            
            // Fuzzy match with Levenshtein distance ? 2
            return this.levenshteinDistance(normalizedUser, normalizedCorrect) <= 2;
        } else {
            // For Spanish answers, use Spanish normalization
            const validation = validateSpanishAnswer(userAnswer, correctAnswer, {
                strictAccents: false,
                allowTypos: true,
                minConfidence: 0.7
            });
            return validation.correct;
        }
    }

    /**
     * Levenshtein distance calculation for fuzzy matching
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];
        const len1 = str1.length;
        const len2 = str2.length;

        for (let i = 0; i <= len2; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= len1; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= len2; i++) {
            for (let j = 1; j <= len1; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[len2][len1];
    }

    normalizeText(text) {
        if (!text) return '';
        return text.toLowerCase()
            .replace(/[áàäâ]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöô]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/ñ/g, 'n')
            .replace(/ß/g, 'ss')
            .trim();
    }

    checkMatchExercise(exercise) {
        const correctMatches = exercise.correctMatches;
        const userMatches = exercise.matches;
        
        if (Object.keys(userMatches).length !== Object.keys(correctMatches).length) {
            return false;
        }
        
        for (const [left, right] of Object.entries(userMatches)) {
            if (correctMatches[left] !== right) {
                return false;
            }
        }
        
        return true;
    }

    showFeedback(isCorrect, exercise, validationResult = null) {
        const feedbackClass = isCorrect ? 'correct' : 'incorrect';
        const feedbackIcon = isCorrect ? '?' : '?';
        const feedbackText = isCorrect ? 'Richtig!' : 'Falsch!';
        
        let detailsHtml = '';
        
        if (!isCorrect) {
            let correctAnswerText = exercise.correctAnswer || 'Siehe Zuordnung oben';
            
            if (validationResult && validationResult.suggestion) {
                correctAnswerText = validationResult.suggestion;
            }
            
            detailsHtml = `
                <div class="correct-answer">
                    <strong>Richtige Antwort:</strong> ${correctAnswerText}
                </div>
            `;
            
            if (validationResult && validationResult.feedback) {
                detailsHtml += `
                    <div class="validation-feedback">
                        ${validationResult.feedback}
                    </div>
                `;
            }
        }

        let extraInfo = '';
        
        if (exercise.type === 'conjugation') {
            extraInfo = `
                <div class="conjugation-info">
                    <div class="verb-details">
                        <span class="infinitive">${exercise.infinitivo}</span>
                        <span class="translation">(${exercise.traduccion})</span>
                    </div>
                    <div class="conjugation-details">
                        <span class="tense">${exercise.tiempoName}</span>
                        <span class="person">${exercise.persona}</span>
                    </div>
                </div>
            `;
        } else if (exercise.vocabItem) {
            extraInfo = `
                <div class="vocab-info">
                    <div class="vocab-pair">
                        <span class="spanish">${exercise.vocabItem.spanish}</span>
                        <span class="separator">?</span>
                        <span class="german">${exercise.vocabItem.german}</span>
                    </div>
                    <div class="category">Kategorie: ${exercise.vocabItem.category}</div>
                    <div class="srs-info">SRS Box: ${exercise.vocabItem.srsBox}</div>
                </div>
            `;
        }

        // ASCII-only status text
        const statusText = `
            <div class="feedback ${feedbackClass}">
                <div class="feedback-header">
                    <span class="feedback-icon">${feedbackIcon}</span>
                    <span class="feedback-text">${feedbackText}</span>
                </div>
                ${detailsHtml}
                ${extraInfo}
            </div>
        `;

        // Validate ASCII compliance of feedback
        try {
            asciiGuard(statusText, 'feedback message');
        } catch (error) {
            console.warn('ASCII violation in feedback:', error);
        }

        this.feedbackContainer.innerHTML = statusText;
    }

    repeatCurrentItem() {
        this.renderExercise();
    }

    restartSession() {
        this.startLearningSession();
        this.repeatRoundBtn.style.display = 'none';
    }

    endSession() {
        let sessionType = 'Vokabeln';
        if (this.mode === 'conjugation') {
            sessionType = 'Konjugationen';
        }

        // ASCII-only session complete message
        const sessionCompleteHtml = `
            <div class="session-complete">
                <h2>?? Session abgeschlossen!</h2>
                <p>Du hast ${this.currentSession.length} ${sessionType} bearbeitet.</p>
                <button onclick="app.startLearningSession()" class="restart-btn">Neue Session starten</button>
            </div>
        `;

        try {
            asciiGuard(sessionCompleteHtml, 'session complete message');
        } catch (error) {
            console.warn('ASCII violation in session complete:', error);
        }

        this.exerciseContainer.innerHTML = sessionCompleteHtml;
        this.checkBtn.style.display = 'none';
        this.repeatRoundBtn.style.display = 'inline-block';
    }

    updateStatusBar() {
        let statusText = '';
        
        if (!this.currentSession || this.currentSession.length === 0) {
            statusText = 'Bereit zum Lernen';
        } else {
            const progress = `${this.sessionIndex + 1}/${this.currentSession.length}`;
            let modeText = 'Lern-Modus';
            
            switch (this.mode) {
                case 'srs':
                    modeText = 'SRS-Modus';
                    break;
                case 'conjugation':
                    modeText = 'Konjugations-Modus';
                    break;
                case 'free-pick':
                    modeText = 'Freie-Wahl-Modus';
                    break;
            }
            
            statusText = `${modeText} | ${progress}`;
        }

        // Validate ASCII compliance
        try {
            asciiGuard(statusText, 'status bar');
        } catch (error) {
            console.warn('ASCII violation in status bar:', error);
            statusText = 'Learning Mode Active'; // Fallback ASCII
        }

        this.statusBar.textContent = statusText;
    }

    // Debug functions
    async resetAllToBox0() {
        for (const item of this.vocabulary) {
            item.srsBox = 0;
            item.nextReview = Date.now();
            await this.updateVocabularyItem(item);
        }
        console.log('?? All vocabulary reset to Box 0');
    }

    async makeAllDueNow() {
        for (const item of this.vocabulary) {
            item.nextReview = Date.now() - 1000;
            await this.updateVocabularyItem(item);
        }
        console.log('? All vocabulary made due now');
    }

    async reimportDatabase() {
        // Clear existing vocabulary
        const transaction = this.db.transaction(['vocabulary'], 'readwrite');
        const store = transaction.objectStore('vocabulary');
        await store.clear();
        
        // Reimport
        await this.importInitialVocabulary();
        console.log('?? Database reimported (ASCII-normalized)');
    }

    showMessage(message) {
        try {
            asciiGuard(message, 'message display');
        } catch (error) {
            console.warn('ASCII violation in message:', error);
        }

        this.exerciseContainer.innerHTML = `
            <div class="message">
                <h2>${message}</h2>
            </div>
        `;
    }

    showError(error) {
        try {
            asciiGuard(error, 'error message');
        } catch (error) {
            console.warn('ASCII violation in error message:', error);
        }

        this.exerciseContainer.innerHTML = `
            <div class="error">
                <h2>? Fehler</h2>
                <p>${error}</p>
            </div>
        `;
    }

    // Conjugator API methods
    async getConjugation(infinitivo, tiempo, persona) {
        if (!this.conjugatorLoaded) {
            throw new Error('Conjugator not loaded');
        }
        return this.conjugator.conjugate(infinitivo, tiempo, persona);
    }

    async analyzeVerb(form) {
        if (!this.conjugatorLoaded) {
            throw new Error('Conjugator not loaded');
        }
        return this.conjugator.analyze(form);
    }

    getConjugatorStats() {
        if (!this.conjugatorLoaded) {
            return { error: 'Conjugator not loaded' };
        }
        return this.conjugator.getStats();
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    // Wait for all dependencies to be available
    if (typeof LeitnerSystem !== 'undefined' && 
        typeof SpanishConjugator !== 'undefined' && 
        typeof asciiNormalizer !== 'undefined' &&
        typeof spanishNormalizer !== 'undefined') {
        app = new SpanishApp();
    } else {
        console.error('Missing dependencies! Check that all scripts are loaded.');
    }
});

// Load items on app start
loadItems().then(items => {
    console.log(`?? Initial items loaded: ${items.length}`);
    // Optionally, start the app here if not already started
    if (!app) {
        app = new SpanishApp();
    }
}).catch(error => {
    console.error('Error loading items:', error);
});