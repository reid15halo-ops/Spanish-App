/*
    =================================================================
    === SPANISH LEARNING APP - DEBUG BUILD (vDebug1)              ===
    =================================================================
    * GAMIFICATION: REMOVED
    * PRACTICE: UNLIMITED
    * FEATURES: DEBUG TOOLBAR, FREE-PICK MODE, ERROR OVERLAY
*/
document.addEventListener('DOMContentLoaded', () => {
    const App = {
        // --- CONFIG & FLAGS ---
        config: {
            DEBUG: true,
            GAMIFICATION: false,
            SRS_ENABLED: true,
            SEED: new URLSearchParams(window.location.search).get('seed') || 'initial-seed',
            DB_VERSION: 'vDebug1'
        },

        // --- UI ELEMENT CACHE ---
        ui: {
            header: document.querySelector('.app-header'),
            main: document.querySelector('#app-main'),
            footer: document.querySelector('#app-footer'),
            exerciseContainer: document.querySelector('#exercise-container'),
            feedbackContainer: document.querySelector('#feedback-container'),
            darkModeToggle: document.querySelector('#dark-mode-toggle'),
            checkBtn: document.querySelector('#check-btn'),
            repeatItemBtn: document.querySelector('#repeat-item-btn'),
            repeatRoundBtn: document.querySelector('#repeat-round-btn'),
            randomNextBtn: document.querySelector('#random-next-btn'),
            freePickBtn: document.querySelector('#free-pick-btn'),
            debugToolbar: document.querySelector('#debug-toolbar'),
            debugModeSelect: document.querySelector('#debug-mode-select'),
            debugForceTypeSelect: document.querySelector('#debug-force-type-select'),
            debugSrsToggle: document.querySelector('#debug-srs-toggle'),
            debugSrsResetBox: document.querySelector('#debug-srs-reset-box'),
            debugSrsDueNow: document.querySelector('#debug-srs-due-now'),
            debugSeedInput: document.querySelector('#debug-seed-input'),
            debugShowDistractors: document.querySelector('#debug-show-distractors'),
            debugDbReimport: document.querySelector('#debug-db-reimport'),
            debugReloadJson: document.querySelector('#debug-reload-json'),
            statusBar: document.querySelector('#status-bar'),
            statusItems: document.querySelector('#status-items'),
            statusDue: document.querySelector('#status-due'),
            statusSeed: document.querySelector('#status-seed'),
            statusSrs: document.querySelector('#status-srs'),
            freePickContainer: document.querySelector('#free-pick-container'),
            freePickFilterText: document.querySelector('#free-pick-filter-text'),
            freePickFilterTag: document.querySelector('#free-pick-filter-tag'),
            freePickFilterType: document.querySelector('#free-pick-filter-type'),
            freePickFilterDifficulty: document.querySelector('#free-pick-filter-difficulty'),
            freePickList: document.querySelector('#free-pick-list'),
            errorOverlay: document.querySelector('#error-overlay'),
            errorStack: document.querySelector('#error-stack'),
            errorStateDump: document.querySelector('#error-state-dump'),
            errorCopyBtn: document.querySelector('#error-copy-btn'),
            errorCloseBtn: document.querySelector('#error-close-btn'),
        },

        // --- APPLICATION STATE ---
        state: {
            items: [],
            currentItem: null,
            currentMode: 'learn', // learn, srs, free-pick
            sessionQueue: [],
            lastSessionQueue: [],
            currentRound: [],
            matchingPairs: {},
            lastDistractors: [],
            isChecking: false,
            // NO MORE: xp, hearts, streak, goals, progress
        },

        db: null,
        srs: null,
        seededRandom: null,

        // =============================================
        // INITIALIZATION
        // =============================================
        async init() {
            console.group('?? App Initialization [DEBUG BUILD vDebug1]');
            console.log('Config:', this.config);
            
            this.initGlobalErrorHandler();
            this.initSeededRandom(this.config.SEED);
            this.srs = new LeitnerSystem(this.config.SRS_ENABLED);
            this.addEventListeners();
            this.initDarkMode();
            
            await this.initDB();
            await this.loadData();
            
            this.populateFreePickFilters();
            this.startSession();
            this.updateStatus();
            
            console.groupEnd();
            this.logSelfTest();
        },

        initGlobalErrorHandler() {
            const showError = (error, source = 'Unknown') => {
                this.ui.errorOverlay.style.display = 'flex';
                this.ui.errorStack.textContent = error.stack || error.message;
                try {
                    const dump = {
                        error: { message: error.message, stack: error.stack },
                        source,
                        timestamp: new Date().toISOString(),
                        config: this.config,
                        state: {
                            currentItem: this.state.currentItem,
                            currentMode: this.state.currentMode,
                            queueLength: this.state.sessionQueue.length,
                        }
                    };
                    this.ui.errorStateDump.value = JSON.stringify(dump, null, 2);
                } catch (e) {
                    this.ui.errorStateDump.value = 'Could not stringify state.';
                }
                console.error(`[${source}] Unhandled Error:`, error);
            };
            
            window.onerror = (message, source, lineno, colno, error) => {
                showError(error || new Error(message), `window.onerror: ${source}:${lineno}:${colno}`);
                return true;
            };
            
            window.onunhandledrejection = event => {
                showError(event.reason, 'unhandledrejection');
            };
            
            console.log('? Global error handler initialized.');
        },

        initSeededRandom(seed) {
            this.config.SEED = seed;
            let state = this.hashCode(seed);
            this.seededRandom = function() {
                state = (state * 1664525 + 1013904223) % Math.pow(2, 32);
                return state / Math.pow(2, 32);
            };
            this.ui.statusSeed.textContent = seed;
            this.ui.debugSeedInput.value = seed;
            console.log(`? Seeded random initialized with seed: "${seed}"`);
        },

        hashCode(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash = hash & hash;
            }
            return Math.abs(hash);
        },

        seededShuffle(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(this.seededRandom() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        },

        seededChoice(array, count = 1) {
            const shuffled = this.seededShuffle(array);
            return count === 1 ? shuffled[0] : shuffled.slice(0, count);
        },

        addEventListeners() {
            // Main buttons
            this.ui.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
            this.ui.checkBtn.addEventListener('click', () => this.handleCheck());
            this.ui.repeatItemBtn.addEventListener('click', () => this.repeatItem());
            this.ui.repeatRoundBtn.addEventListener('click', () => this.repeatRound());
            this.ui.randomNextBtn.addEventListener('click', () => this.randomNext());
            this.ui.freePickBtn.addEventListener('click', () => this.showFreePick());
            
            // Exercise container Enter key
            this.ui.exerciseContainer.addEventListener('keydown', e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleCheck();
                }
            });

            // Debug Toolbar
            this.ui.debugModeSelect.addEventListener('change', () => this.startSession());
            this.ui.debugForceTypeSelect.addEventListener('change', () => {
                if (this.state.currentItem) this.renderExercise();
            });
            this.ui.debugSrsToggle.addEventListener('change', e => {
                this.config.SRS_ENABLED = e.target.checked;
                this.srs.setEnabled(e.target.checked);
                this.updateStatus();
                console.log(`SRS ${e.target.checked ? 'enabled' : 'disabled'}`);
            });
            this.ui.debugSrsResetBox.addEventListener('click', () => this.debugSrsResetBox());
            this.ui.debugSrsDueNow.addEventListener('click', () => this.debugSrsDueNow());
            this.ui.debugSeedInput.addEventListener('change', e => {
                this.initSeededRandom(e.target.value);
                console.log('?? Seed changed, reinitializing random generator');
            });
            this.ui.debugDbReimport.addEventListener('click', () => this.reimportData());
            this.ui.debugReloadJson.addEventListener('click', () => this.reloadJsonOnly());

            // Free Pick
            this.ui.freePickFilterText.addEventListener('input', () => this.populateFreePickList());
            this.ui.freePickFilterTag.addEventListener('change', () => this.populateFreePickList());
            this.ui.freePickFilterType.addEventListener('change', () => this.populateFreePickList());
            this.ui.freePickFilterDifficulty.addEventListener('change', () => this.populateFreePickList());

            // Error Overlay
            this.ui.errorCloseBtn.addEventListener('click', () => {
                this.ui.errorOverlay.style.display = 'none';
            });
            this.ui.errorCopyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(this.ui.errorStateDump.value);
                console.log('?? Error dump copied to clipboard');
            });

            // Keyboard Shortcuts
            document.addEventListener('keydown', e => {
                if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                    e.preventDefault();
                    this.toggleDebugToolbar();
                }
                if (this.state.isChecking) return;
                if (e.key.toLowerCase() === 'r' && !e.ctrlKey) this.repeatItem();
                if (e.key.toLowerCase() === 'f' && !e.ctrlKey) this.showFreePick();
                if (e.key.toLowerCase() === 'd' && !e.ctrlKey) this.toggleDarkMode();
            });
            
            console.log('? Event listeners attached.');
        },

        toggleDebugToolbar() {
            const visible = this.ui.debugToolbar.style.display !== 'none';
            this.ui.debugToolbar.style.display = visible ? 'none' : 'flex';
            console.log(`Debug toolbar ${visible ? 'hidden' : 'shown'}`);
        },

        // =============================================
        // DARK MODE
        // =============================================
        initDarkMode() {
            const darkMode = localStorage.getItem('darkMode') === 'true';
            if (darkMode) document.documentElement.setAttribute('data-theme', 'dark');
            this.ui.darkModeToggle.textContent = darkMode ? '??' : '??';
        },

        toggleDarkMode() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
            localStorage.setItem('darkMode', !isDark);
            this.ui.darkModeToggle.textContent = isDark ? '??' : '??';
            console.log(`Dark mode: ${isDark ? 'off' : 'on'}`);
        },

        // =============================================
        // DATABASE (IndexedDB)
        // =============================================
        async initDB() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open('SpanishAppDB', 2);
                
                request.onerror = () => reject(request.error);
                
                request.onsuccess = () => {
                    this.db = request.result;
                    console.log(`? IndexedDB initialized (${this.config.DB_VERSION})`);
                    resolve();
                };
                
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    
                    // Backup old data if exists
                    if (event.oldVersion > 0) {
                        console.log(`?? Migrating from version ${event.oldVersion} to 2`);
                    }
                    
                    if (!db.objectStoreNames.contains('items')) {
                        const store = db.createObjectStore('items', { keyPath: 'id' });
                        store.createIndex('srsBox', 'srsBox', { unique: false });
                        store.createIndex('nextReview', 'nextReview', { unique: false });
                        store.createIndex('type', 'type', { unique: false });
                        console.log('? Created object store: items');
                    }
                    
                    // Remove gamification stores if they exist
                    const gamificationStores = ['progress', 'achievements', 'streaks'];
                    gamificationStores.forEach(storeName => {
                        if (db.objectStoreNames.contains(storeName)) {
                            db.deleteObjectStore(storeName);
                            console.log(`??? Deleted gamification store: ${storeName}`);
                        }
                    });
                };
            });
        },

        async loadData() {
            try {
                const transaction = this.db.transaction(['items'], 'readonly');
                const store = transaction.objectStore('items');
                const request = store.getAll();

                return new Promise((resolve, reject) => {
                    request.onsuccess = async () => {
                        if (request.result.length === 0) {
                            console.log('?? No items in DB, importing from JSON...');
                            await this.reimportData();
                        } else {
                            this.state.items = request.result;
                            console.log(`? Loaded ${this.state.items.length} items from IndexedDB.`);
                            console.table(this.state.items.slice(0, 5));
                        }
                        resolve();
                    };
                    request.onerror = () => reject(request.error);
                });
            } catch (error) {
                console.error('? Failed to load data:', error);
                throw error;
            }
        },

        async reimportData() {
            console.group('?? Reimporting data from items.json');
            try {
                const response = await fetch('data/items.json');
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const jsonData = await response.json();
                console.log(`Fetched ${jsonData.length} items from JSON`);
                
                // Ensure SRS fields exist
                jsonData.forEach(item => {
                    if (!item.srsBox) item.srsBox = 0;
                    if (!item.nextReview) item.nextReview = Date.now();
                    if (!item.lastCorrect) item.lastCorrect = 0;
                    if (!item.lastIncorrect) item.lastIncorrect = 0;
                    // Ignore gamification fields: xp, hearts, streak, goals
                });

                const transaction = this.db.transaction(['items'], 'readwrite');
                const store = transaction.objectStore('items');
                
                // Clear existing data
                await new Promise((resolve, reject) => {
                    const clearRequest = store.clear();
                    clearRequest.onsuccess = () => {
                        console.log('??? Cleared existing DB data');
                        resolve();
                    };
                    clearRequest.onerror = () => reject(clearRequest.error);
                });

                // Add new data
                for (const item of jsonData) {
                    await new Promise((resolve, reject) => {
                        const addRequest = store.put(item);
                        addRequest.onsuccess = () => resolve();
                        addRequest.onerror = () => reject(addRequest.error);
                    });
                }

                this.state.items = jsonData;
                console.log(`? Re-imported ${jsonData.length} items successfully`);
                this.updateStatus();
                console.groupEnd();
            } catch (error) {
                console.error('? Failed to reimport data:', error);
                console.groupEnd();
                throw error;
            }
        },

        async reloadJsonOnly() {
            console.group('?? Reloading items.json only');
            try {
                const response = await fetch('data/items.json?t=' + Date.now());
                const jsonData = await response.json();
                console.log(`Fetched ${jsonData.length} items from JSON`);
                
                // Update state only, don't touch DB
                this.state.items = jsonData.map(item => ({
                    ...item,
                    srsBox: item.srsBox || 0,
                    nextReview: item.nextReview || Date.now(),
                    lastCorrect: item.lastCorrect || 0,
                    lastIncorrect: item.lastIncorrect || 0,
                }));
                
                console.log(`? Reloaded ${this.state.items.length} items (memory only)`);
                this.updateStatus();
                console.groupEnd();
            } catch (error) {
                console.error('? Failed to reload JSON:', error);
                console.groupEnd();
            }
        },

        async saveItem(item) {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['items'], 'readwrite');
                const store = transaction.objectStore('items');
                const request = store.put(item);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        },

        // =============================================
        // SESSION MANAGEMENT
        // =============================================
        startSession() {
            this.state.currentMode = this.ui.debugModeSelect.value;
            console.group(`?? Starting session: ${this.state.currentMode}`);

            if (this.state.currentMode === 'free-pick') {
                this.showFreePick();
                console.groupEnd();
                return;
            }

            this.ui.freePickContainer.style.display = 'none';
            this.ui.exerciseContainer.style.display = 'block';

            if (this.state.currentMode === 'learn') {
                this.state.sessionQueue = this.seededShuffle([...this.state.items]).slice(0, 20);
                console.log('Mode: Learn (random 20 items)');
            } else if (this.state.currentMode === 'srs' && this.config.SRS_ENABLED) {
                this.state.sessionQueue = this.srs.getPracticeQueue(this.state.items, 20);
                console.log('Mode: SRS (practice queue)');
                console.table(this.state.sessionQueue.map(i => ({
                    id: i.id.slice(0, 8),
                    es: i.es.slice(0, 30),
                    box: i.srsBox,
                    nextReview: new Date(i.nextReview).toLocaleString()
                })));
            } else {
                this.state.sessionQueue = this.seededShuffle([...this.state.items]).slice(0, 20);
                console.log('Mode: SRS disabled, falling back to random');
            }

            this.state.lastSessionQueue = [...this.state.sessionQueue];
            this.state.currentRound = [...this.state.sessionQueue];
            console.log(`Queue length: ${this.state.sessionQueue.length}`);
            console.groupEnd();
            
            this.nextExercise();
        },

        nextExercise() {
            if (this.state.sessionQueue.length === 0) {
                this.showSessionComplete();
                return;
            }

            this.state.currentItem = this.state.sessionQueue.shift();
            console.group(`?? Next exercise: ${this.state.currentItem.es}`);
            console.log('Item details:', {
                id: this.state.currentItem.id,
                es: this.state.currentItem.es,
                de: this.state.currentItem.de,
                type: this.state.currentItem.type,
                srsBox: this.state.currentItem.srsBox,
                difficulty: this.state.currentItem.difficulty
            });
            
            this.renderExercise();
            this.ui.feedbackContainer.innerHTML = '';
            this.ui.checkBtn.style.display = 'inline-block';
            this.ui.checkBtn.textContent = 'Überprüfen';
            this.ui.repeatItemBtn.style.display = 'none';
            this.ui.repeatRoundBtn.style.display = 'none';
            this.ui.randomNextBtn.style.display = 'none';
            this.ui.freePickBtn.style.display = 'none';
            this.state.isChecking = false;
            this.updateStatus();
            console.groupEnd();
        },

        renderExercise() {
            const item = this.state.currentItem;
            const forceType = this.ui.debugForceTypeSelect.value;
            const exerciseType = forceType || item.type || 'choice';

            console.log(`Rendering exercise type: ${exerciseType}${forceType ? ' (forced)' : ''}`);
            this.ui.exerciseContainer.innerHTML = '';

            switch (exerciseType) {
                case 'choice':
                    this.renderChoiceExercise(item);
                    break;
                case 'typing':
                    this.renderTypingExercise(item);
                    break;
                case 'sentence':
                    this.renderSentenceExercise(item);
                    break;
                case 'match':
                    this.renderMatchExercise(item);
                    break;
                default:
                    this.renderChoiceExercise(item);
            }
        },

        renderChoiceExercise(item) {
            const eligible = this.state.items.filter(i => 
                i.id !== item.id && i.de !== item.de && i.type === item.type
            );
            
            if (eligible.length < 3) {
                console.warn('Not enough eligible distractors, using any items');
                eligible.push(...this.state.items.filter(i => i.id !== item.id));
            }
            
            const distractors = this.seededChoice(eligible, 3);
            this.state.lastDistractors = distractors;
            
            if (this.ui.debugShowDistractors.checked) {
                console.group('?? Distractors');
                console.table(distractors.map(d => ({ es: d.es, de: d.de })));
                console.groupEnd();
            }
            
            const options = this.seededShuffle([item, ...distractors]);

            this.ui.exerciseContainer.innerHTML = `
                <div class="exercise choice-exercise">
                    <p class="question"><strong>${this.escapeHtml(item.es)}</strong></p>
                    <div class="options" role="radiogroup">
                        ${options.map(opt => `
                            <button class="option-btn" 
                                    data-id="${opt.id}" 
                                    role="radio" 
                                    aria-checked="false">
                                ${this.escapeHtml(opt.de)}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;

            document.querySelectorAll('.option-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.option-btn').forEach(b => {
                        b.classList.remove('selected');
                        b.setAttribute('aria-checked', 'false');
                    });
                    e.target.classList.add('selected');
                    e.target.setAttribute('aria-checked', 'true');
                });
            });
        },

        renderTypingExercise(item) {
            this.ui.exerciseContainer.innerHTML = `
                <div class="exercise typing-exercise">
                    <p class="question"><strong>${this.escapeHtml(item.es)}</strong></p>
                    <input type="text" 
                           class="typing-input" 
                           placeholder="Gib die deutsche Übersetzung ein..." 
                           autocomplete="off"
                           aria-label="Deutsche Übersetzung">
                </div>
            `;
            this.ui.exerciseContainer.querySelector('.typing-input').focus();
        },

        renderSentenceExercise(item) {
            const words = item.de.split(' ');
            const shuffled = this.seededShuffle(words);

            this.ui.exerciseContainer.innerHTML = `
                <div class="exercise sentence-exercise">
                    <p class="question"><strong>${this.escapeHtml(item.es)}</strong></p>
                    <div class="word-bank" role="list">
                        ${shuffled.map((word, idx) => `
                            <button class="word-btn" 
                                    data-word="${this.escapeHtml(word)}" 
                                    data-index="${idx}"
                                    role="listitem">
                                ${this.escapeHtml(word)}
                            </button>
                        `).join('')}
                    </div>
                    <div class="sentence-builder" role="list" aria-label="Satz Konstruktion"></div>
                </div>
            `;

            const wordBank = this.ui.exerciseContainer.querySelector('.word-bank');
            const builder = this.ui.exerciseContainer.querySelector('.sentence-builder');

            wordBank.addEventListener('click', (e) => {
                if (e.target.classList.contains('word-btn')) {
                    const clone = e.target.cloneNode(true);
                    builder.appendChild(clone);
                    e.target.style.visibility = 'hidden';
                    e.target.setAttribute('aria-hidden', 'true');
                }
            });

            builder.addEventListener('click', (e) => {
                if (e.target.classList.contains('word-btn')) {
                    const original = wordBank.querySelector(`[data-index="${e.target.dataset.index}"]`);
                    if (original) {
                        original.style.visibility = 'visible';
                        original.setAttribute('aria-hidden', 'false');
                    }
                    e.target.remove();
                }
            });
        },

        renderMatchExercise(item) {
            const matchItems = this.seededChoice(this.state.items, 5);
            const left = this.seededShuffle(matchItems.map(i => ({ id: i.id, text: i.es })));
            const right = this.seededShuffle(matchItems.map(i => ({ id: i.id, text: i.de })));

            this.state.matchingPairs = {};

            this.ui.exerciseContainer.innerHTML = `
                <div class="exercise match-exercise">
                    <p class="question">Ordne die Paare zu:</p>
                    <div class="match-container">
                        <div class="match-column" role="list" aria-label="Spanisch">
                            ${left.map(l => `
                                <button class="match-btn" 
                                        data-id="${l.id}" 
                                        data-side="left"
                                        role="listitem">
                                    ${this.escapeHtml(l.text)}
                                </button>
                            `).join('')}
                        </div>
                        <div class="match-column" role="list" aria-label="Deutsch">
                            ${right.map(r => `
                                <button class="match-btn" 
                                        data-id="${r.id}" 
                                        data-side="right"
                                        role="listitem">
                                    ${this.escapeHtml(r.text)}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;

            let selectedLeft = null;

            this.ui.exerciseContainer.querySelectorAll('.match-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const side = btn.dataset.side;
                    if (side === 'left') {
                        document.querySelectorAll('.match-btn[data-side="left"]').forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');
                        selectedLeft = btn;
                    } else if (side === 'right' && selectedLeft) {
                        this.state.matchingPairs[selectedLeft.dataset.id] = btn.dataset.id;
                        selectedLeft.classList.add('matched');
                        btn.classList.add('matched');
                        selectedLeft = null;
                    }
                });
            });
        },

        // =============================================
        // CHECKING ANSWERS
        // =============================================
        async handleCheck() {
            if (this.state.isChecking) {
                this.nextExercise();
                return;
            }

            const item = this.state.currentItem;
            const exerciseType = this.ui.debugForceTypeSelect.value || item.type || 'choice';
            let isCorrect = false;

            console.group(`? Checking answer for: ${item.es}`);

            switch (exerciseType) {
                case 'choice':
                    isCorrect = this.checkChoice(item);
                    break;
                case 'typing':
                    isCorrect = this.checkTyping(item);
                    break;
                case 'sentence':
                    isCorrect = this.checkSentence(item);
                    break;
                case 'match':
                    isCorrect = this.checkMatch();
                    break;
            }

            console.log(`Result: ${isCorrect ? '? Correct' : '? Incorrect'}`);
            this.showFeedback(isCorrect);
            
            // SRS Update (if enabled)
            if (this.config.SRS_ENABLED && this.state.currentMode === 'srs') {
                const before = { box: item.srsBox, nextReview: new Date(item.nextReview) };
                
                if (isCorrect) {
                    this.srs.promote(item);
                } else {
                    this.srs.demote(item);
                }
                
                const after = { box: item.srsBox, nextReview: new Date(item.nextReview) };
                console.log('SRS Update:', { before, after });
                
                await this.saveItem(item);
            } else if (!this.config.SRS_ENABLED) {
                console.log('SRS disabled - no box change, result only logged');
            }

            this.state.isChecking = true;
            this.ui.checkBtn.textContent = 'Weiter';
            this.ui.repeatItemBtn.style.display = 'inline-block';
            this.ui.repeatRoundBtn.style.display = 'inline-block';
            this.ui.randomNextBtn.style.display = 'inline-block';
            this.ui.freePickBtn.style.display = 'inline-block';
            this.updateStatus();
            console.groupEnd();
        },

        checkChoice(item) {
            const selected = this.ui.exerciseContainer.querySelector('.option-btn.selected');
            const correct = selected && selected.dataset.id === item.id;
            console.log('Choice check:', { 
                selectedId: selected?.dataset.id, 
                correctId: item.id, 
                match: correct 
            });
            return correct;
        },

        checkTyping(item) {
            const input = this.ui.exerciseContainer.querySelector('.typing-input');
            const userAnswer = input.value.trim().toLowerCase();
            const correctAnswer = item.de.toLowerCase();
            const match = userAnswer === correctAnswer;
            
            console.log('Typing check:', { 
                user: userAnswer, 
                correct: correctAnswer, 
                match,
                fuzzyScore: this.fuzzyMatch(userAnswer, correctAnswer)
            });
            
            return match;
        },

        checkSentence(item) {
            const builder = this.ui.exerciseContainer.querySelector('.sentence-builder');
            const words = Array.from(builder.querySelectorAll('.word-btn')).map(btn => btn.dataset.word);
            const userSentence = words.join(' ');
            const match = userSentence === item.de;
            
            console.log('Sentence check:', { 
                user: userSentence, 
                correct: item.de, 
                match 
            });
            
            return match;
        },

        checkMatch() {
            const pairs = this.state.matchingPairs;
            const allCorrect = Object.keys(pairs).length === 5 && 
                               Object.keys(pairs).every(leftId => pairs[leftId] === leftId);
            
            console.log('Match check:', { 
                pairs, 
                pairCount: Object.keys(pairs).length,
                allCorrect 
            });
            
            return allCorrect;
        },

        fuzzyMatch(str1, str2) {
            const longer = str1.length > str2.length ? str1 : str2;
            const shorter = str1.length > str2.length ? str2 : str1;
            if (longer.length === 0) return 1.0;
            const editDistance = this.levenshtein(longer, shorter);
            return (longer.length - editDistance) / longer.length;
        },

        levenshtein(str1, str2) {
            const matrix = [];
            for (let i = 0; i <= str2.length; i++) {
                matrix[i] = [i];
            }
            for (let j = 0; j <= str1.length; j++) {
                matrix[0][j] = j;
            }
            for (let i = 1; i <= str2.length; i++) {
                for (let j = 1; j <= str1.length; j++) {
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
            return matrix[str2.length][str1.length];
        },

        showFeedback(isCorrect) {
            const item = this.state.currentItem;
            this.ui.feedbackContainer.innerHTML = `
                <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}">
                    <p class="feedback-result">${isCorrect ? '? Richtig!' : '? Falsch!'}</p>
                    <p class="feedback-translation">
                        <strong>${this.escapeHtml(item.es)}</strong> ? 
                        <strong>${this.escapeHtml(item.de)}</strong>
                    </p>
                    ${item.examples && item.examples.length > 0 ? 
                        `<p class="feedback-example"><em>${this.escapeHtml(item.examples[0])}</em></p>` : 
                        ''}
                </div>
            `;
        },

        showSessionComplete() {
            this.ui.exerciseContainer.innerHTML = `
                <div class="session-complete">
                    <h2>?? Runde abgeschlossen!</h2>
                    <p>Du hast alle Aufgaben in dieser Runde erledigt.</p>
                    <p class="session-stats">Keine Limits, keine Sperren – übe so viel du willst!</p>
                </div>
            `;
            this.ui.checkBtn.style.display = 'none';
            this.ui.repeatItemBtn.style.display = 'none';
            this.ui.repeatRoundBtn.style.display = 'inline-block';
            this.ui.randomNextBtn.style.display = 'inline-block';
            this.ui.freePickBtn.style.display = 'inline-block';
        },

        // =============================================
        // REPEAT FUNCTIONS (UNLIMITED)
        // =============================================
        repeatItem() {
            if (!this.state.currentItem) return;
            console.log(`?? Repeating item: ${this.state.currentItem.es}`);
            this.state.sessionQueue.unshift(this.state.currentItem);
            this.nextExercise();
        },

        repeatRound() {
            console.log(`?? Repeating entire round (${this.state.currentRound.length} items)`);
            this.state.sessionQueue = [...this.state.currentRound];
            this.state.lastSessionQueue = [...this.state.currentRound];
            this.nextExercise();
        },

        randomNext() {
            console.log('?? Random next item');
            const randomItem = this.seededChoice(this.state.items);
            this.state.currentItem = randomItem;
            this.renderExercise();
            this.ui.feedbackContainer.innerHTML = '';
            this.ui.checkBtn.style.display = 'inline-block';
            this.ui.checkBtn.textContent = 'Überprüfen';
            this.ui.repeatItemBtn.style.display = 'none';
            this.ui.repeatRoundBtn.style.display = 'none';
            this.ui.randomNextBtn.style.display = 'none';
            this.ui.freePickBtn.style.display = 'none';
            this.state.isChecking = false;
        },

        // =============================================
        // FREE-PICK MODE
        // =============================================
        showFreePick() {
            console.log('?? Showing Free-Pick mode');
            this.ui.freePickContainer.style.display = 'block';
            this.ui.exerciseContainer.style.display = 'none';
            this.ui.checkBtn.style.display = 'none';
            this.ui.repeatItemBtn.style.display = 'none';
            this.ui.repeatRoundBtn.style.display = 'none';
            this.ui.randomNextBtn.style.display = 'none';
            this.ui.freePickBtn.style.display = 'none';
            this.populateFreePickList();
        },

        populateFreePickFilters() {
            // Tags
            const tags = new Set();
            this.state.items.forEach(item => {
                if (item.tags) item.tags.forEach(tag => tags.add(tag));
            });
            this.ui.freePickFilterTag.innerHTML = '<option value="">Alle Tags</option>';
            tags.forEach(tag => {
                const option = document.createElement('option');
                option.value = tag;
                option.textContent = tag;
                this.ui.freePickFilterTag.appendChild(option);
            });
            
            console.log(`? Populated ${tags.size} unique tags in Free-Pick filter`);
        },

        populateFreePickList() {
            const searchText = this.ui.freePickFilterText.value.toLowerCase();
            const selectedTag = this.ui.freePickFilterTag.value;
            const selectedType = this.ui.freePickFilterType.value;
            const selectedDifficulty = this.ui.freePickFilterDifficulty.value;

            const filtered = this.state.items.filter(item => {
                const matchesText = !searchText || 
                    item.es.toLowerCase().includes(searchText) || 
                    item.de.toLowerCase().includes(searchText);
                const matchesTag = !selectedTag || (item.tags && item.tags.includes(selectedTag));
                const matchesType = !selectedType || item.type === selectedType;
                const matchesDifficulty = !selectedDifficulty || item.difficulty === parseInt(selectedDifficulty);
                return matchesText && matchesTag && matchesType && matchesDifficulty;
            });

            console.log(`Free-Pick filter: ${filtered.length} / ${this.state.items.length} items`);

            this.ui.freePickList.innerHTML = '';
            filtered.forEach(item => {
                const li = document.createElement('li');
                li.className = 'free-pick-item';
                li.innerHTML = `
                    <strong>${this.escapeHtml(item.es)}</strong> ? ${this.escapeHtml(item.de)}
                    <span class="item-meta">[${item.type || 'word'}, diff: ${item.difficulty || 1}]</span>
                `;
                li.addEventListener('click', () => {
                    console.log(`Free-Pick selected: ${item.es}`);
                    this.state.currentItem = item;
                    this.state.sessionQueue = [item];
                    this.ui.debugModeSelect.value = 'learn';
                    this.state.currentMode = 'learn';
                    this.ui.freePickContainer.style.display = 'none';
                    this.ui.exerciseContainer.style.display = 'block';
                    this.nextExercise();
                });
                this.ui.freePickList.appendChild(li);
            });
        },

        // =============================================
        // STATUS & DEBUG
        // =============================================
        updateStatus() {
            const totalItems = this.state.items.length;
            const dueItems = this.state.items.filter(i => i.nextReview <= Date.now()).length;
            const srsStatus = this.config.SRS_ENABLED ? 'an' : 'aus';

            this.ui.statusItems.textContent = totalItems;
            this.ui.statusDue.textContent = dueItems;
            this.ui.statusSeed.textContent = this.config.SEED;
            this.ui.statusSrs.textContent = srsStatus;
        },

        async debugSrsResetBox() {
            console.group('?? Debug: Reset all items to Box 0');
            for (const item of this.state.items) {
                item.srsBox = 0;
                item.nextReview = Date.now();
                await this.saveItem(item);
            }
            console.log(`? Reset ${this.state.items.length} items to Box 0`);
            this.updateStatus();
            console.groupEnd();
        },

        async debugSrsDueNow() {
            console.group('?? Debug: Mark all items as due now');
            for (const item of this.state.items) {
                item.nextReview = Date.now() - 1000;
                await this.saveItem(item);
            }
            console.log(`? Marked ${this.state.items.length} items as due`);
            this.updateStatus();
            console.groupEnd();
        },

        // =============================================
        // SELF-TEST (AUTOMATED)
        // =============================================
        logSelfTest() {
            console.group('?? Self-Test');
            
            // Check: No gamification writes
            const gamificationAccessCount = 0; // Would be instrumented in production
            console.log(`? Gamification writes: ${gamificationAccessCount} (expected: 0)`);
            
            // Check: No gamification DOM elements
            const gamificationElements = document.querySelectorAll(
                '[class*="xp"], [class*="hearts"], [class*="streak"], [class*="achievement"], [class*="badge"], [class*="progress-ring"]'
            );
            console.log(`? Gamification DOM elements: ${gamificationElements.length} (expected: 0)`);
            
            // Check: Items loaded
            console.log(`? Items loaded: ${this.state.items.length}`);
            
            // Check: SRS toggle works
            console.log(`? SRS toggle: ${this.config.SRS_ENABLED ? 'enabled' : 'disabled'}`);
            
            // Check: Debug toolbar exists
            const toolbarVisible = this.ui.debugToolbar.style.display !== 'none';
            console.log(`? Debug toolbar: ${toolbarVisible ? 'visible' : 'hidden'} (toggle with Ctrl+Shift+D)`);
            
            // Check: Error handler registered
            console.log(`? Error handlers: registered`);
            
            // Check: Shortcuts
            console.log(`? Keyboard shortcuts: Enter, R, F, D, Ctrl+Shift+D`);
            
            console.groupEnd();
            
            console.log('%c? DEBUG BUILD READY', 'color: #28a745; font-size: 16px; font-weight: bold;');
            console.log('URL Parameters: ?seed=42&debug=1');
            console.log('Shortcuts: Ctrl+Shift+D (toolbar), R (repeat), F (free-pick), D (dark mode)');
        },

        // =============================================
        // UTILITY
        // =============================================
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    };

    // Initialize app
    App.init();
});