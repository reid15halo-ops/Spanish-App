/**
 * Zeiten Workbench - Main Application
 * Interactive Spanish tenses learning environment
 * ASCII-compliant, No-Gamification
 */

class ZeitenWorkbench {
    constructor() {
        this.conjugator = null;
        this.currentTense = 'presente';
        this.selectedVerb = null;
        this.initialized = false;
    }

    async initialize() {
        console.log('?? Initializing Zeiten Workbench...');
        
        try {
            // Initialize conjugator
            this.conjugator = new SpanishConjugator();
            await this.conjugator.initialize();
            
            // Setup navigation
            this.setupNavigation();
            
            // Load default tense
            await this.loadTense(this.currentTense);
            
            this.initialized = true;
            console.log('? Zeiten Workbench initialized successfully');
            
        } catch (error) {
            console.error('? Initialization failed:', error);
            this.showError('Initialisierung fehlgeschlagen: ' + error.message);
        }
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const tense = e.target.dataset.tense;
                
                // Update active state
                navButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Load tense
                await this.loadTense(tense);
            });
        });
    }

    async loadTense(tense) {
        console.log(`?? Loading tense: ${tense}`);
        
        this.currentTense = tense;
        const tenseData = ZEITEN_DATA[tense];
        
        if (!tenseData) {
            this.showError(`Zeitform "${tense}" nicht gefunden`);
            return;
        }

        const content = document.getElementById('tense-content');
        content.innerHTML = this.renderTenseContent(tenseData);
        
        // Setup interactivity
        this.setupExampleAnalysis();
        this.setupConjugationTable(tense);
        this.setupMiniTest(tense);
    }

    renderTenseContent(data) {
        return `
            <div class="tense-section active">
                <!-- Tense Header -->
                <div class="tense-header">
                    <h2>
                        <span class="tense-name-es">${data.nameES}</span>
                        <span>${data.nameDE}</span>
                    </h2>
                </div>

                <!-- Information Grid -->
                <div class="info-grid">
                    <!-- Rule Card -->
                    <div class="info-card">
                        <h3>?? Regel</h3>
                        <p><strong>ES:</strong> ${data.rule.es}</p>
                        <p><strong>DE:</strong> ${data.rule.de}</p>
                    </div>

                    <!-- Explanation Card -->
                    <div class="info-card">
                        <h3>?? Verwendung</h3>
                        <ul>
                            ${data.explanation.map(exp => `<li>${exp}</li>`).join('')}
                        </ul>
                    </div>

                    <!-- Signal Words Card -->
                    <div class="info-card">
                        <h3>?? Signalwoerter</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${data.signalWords.map(word => 
                                `<span class="signal-word">${word}</span>`
                            ).join('')}
                        </div>
                    </div>

                    <!-- Formation Card -->
                    <div class="info-card">
                        <h3>?? Bildung</h3>
                        <ul>
                            ${Object.entries(data.formation).map(([key, value]) => 
                                `<li><strong>${key}:</strong> ${value}</li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>

                <!-- Timeline -->
                ${this.renderTimeline(data.timelinePosition, data.nameDE)}

                <!-- Examples Section -->
                <div class="examples-section">
                    <h3>?? Beispiele</h3>
                    ${data.examples.map((example, index) => 
                        this.renderExample(example, index)
                    ).join('')}
                </div>

                <!-- Conjugation Table -->
                <div class="conjugation-section" id="conjugation-section">
                    <h3>?? Konjugationstabelle</h3>
                    <div class="verb-selector">
                        <select id="verb-select">
                            <option value="">Verb auswaehlen...</option>
                        </select>
                    </div>
                    <div id="conjugation-table-container"></div>
                </div>

                <!-- Mini Test -->
                <div class="mini-test-section">
                    <h3>?? Mini-Test</h3>
                    <p>Teste dein Wissen ueber diese Zeitform!</p>
                    <div id="mini-test-container"></div>
                </div>
            </div>
        `;
    }

    renderTimeline(position, tenseName) {
        const markers = {
            past: '25%',
            present: '50%',
            future: '75%'
        };

        const markerPosition = markers[position] || '50%';

        return `
            <div class="timeline">
                <h3>?? Zeitstrahl</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #666;">
                    <span>Vergangenheit</span>
                    <span>Gegenwart</span>
                    <span>Zukunft</span>
                </div>
                <div class="timeline-bar">
                    <div class="timeline-marker" style="left: ${markerPosition};" 
                         title="${tenseName}">
                        <div class="timeline-label">${tenseName}</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderExample(example, index) {
        return `
            <div class="example-card" data-example-index="${index}">
                <div class="example-es">${this.highlightVerb(example.es, example.verb)}</div>
                <div class="example-de">${example.de}</div>
                <div class="example-analysis" id="example-analysis-${index}">
                    ${this.renderAnalysis(example.analysis)}
                </div>
            </div>
        `;
    }

    highlightVerb(sentence, verb) {
        return sentence.replace(verb, `<span class="verb-highlight">${verb}</span>`);
    }

    renderAnalysis(analysis) {
        return `
            <div class="analysis-item">
                <span class="analysis-label">Zeitform:</span>
                <span>${analysis.tiempo}</span>
            </div>
            <div class="analysis-item">
                <span class="analysis-label">Person:</span>
                <span>${analysis.persona}</span>
            </div>
            <div class="analysis-item">
                <span class="analysis-label">Modus:</span>
                <span>${analysis.modo}</span>
            </div>
            <div class="analysis-item">
                <span class="analysis-label">Aspekt:</span>
                <span>${analysis.aspecto || analysis.aspekt}</span>
            </div>
            ${analysis.stamm ? `
                <div class="analysis-item">
                    <span class="analysis-label">Stamm:</span>
                    <span>${analysis.stamm}</span>
                </div>
            ` : ''}
            ${analysis.endung ? `
                <div class="analysis-item">
                    <span class="analysis-label">Endung:</span>
                    <span>${analysis.endung}</span>
                </div>
            ` : ''}
            ${analysis.auxiliar ? `
                <div class="analysis-item">
                    <span class="analysis-label">Hilfsverb:</span>
                    <span>${analysis.auxiliar}</span>
                </div>
            ` : ''}
            ${analysis.participio ? `
                <div class="analysis-item">
                    <span class="analysis-label">Partizip:</span>
                    <span>${analysis.participio}</span>
                </div>
            ` : ''}
            ${analysis.gerundio ? `
                <div class="analysis-item">
                    <span class="analysis-label">Gerundium:</span>
                    <span>${analysis.gerundio}</span>
                </div>
            ` : ''}
            ${analysis.infinitivo ? `
                <div class="analysis-item">
                    <span class="analysis-label">Infinitiv:</span>
                    <span>${analysis.infinitivo}</span>
                </div>
            ` : ''}
        `;
    }

    setupExampleAnalysis() {
        const exampleCards = document.querySelectorAll('.example-card');
        exampleCards.forEach(card => {
            card.addEventListener('click', () => {
                const index = card.dataset.exampleIndex;
                const analysis = document.getElementById(`example-analysis-${index}`);
                analysis.classList.toggle('show');
            });
        });
    }

    async setupConjugationTable(tense) {
        if (!this.conjugator) return;

        const verbSelect = document.getElementById('verb-select');
        const tableContainer = document.getElementById('conjugation-table-container');

        // Populate verb select with common verbs
        const commonVerbs = this.getCommonVerbs();
        verbSelect.innerHTML = '<option value="">Verb auswaehlen...</option>';
        commonVerbs.forEach(verb => {
            const option = document.createElement('option');
            option.value = verb.infinitivo;
            option.textContent = `${verb.infinitivo} (${verb.traduccion})`;
            verbSelect.appendChild(option);
        });

        // Handle verb selection
        verbSelect.addEventListener('change', async (e) => {
            const infinitivo = e.target.value;
            if (!infinitivo) {
                tableContainer.innerHTML = '';
                return;
            }

            try {
                await this.renderConjugationTable(infinitivo, tense, tableContainer);
            } catch (error) {
                console.error('Error rendering conjugation table:', error);
                tableContainer.innerHTML = `
                    <div class="error-message">
                        Fehler beim Laden der Konjugation: ${error.message}
                    </div>
                `;
            }
        });
    }

    async renderConjugationTable(infinitivo, tense, container) {
        const verb = this.conjugator.findVerb(infinitivo);
        if (!verb) {
            container.innerHTML = '<p>Verb nicht gefunden</p>';
            return;
        }

        // Map tense names
        const tenseMap = {
            'preterito': 'preterito',
            'perfecto': 'presente', // Will use haber + participio
            'pluscuamperfecto': 'imperfecto', // Will use haber + participio
            'progresivo': 'presente', // Will use estar + gerundio
            'perifrasis': 'presente' // Will use ir a + infinitivo
        };

        const conjugationTense = tenseMap[tense] || tense;
        const pronouns = ['yo', 'tu', 'el', 'nosotros', 'vosotros', 'ellos'];

        let tableHTML = `
            <table class="conjugation-table">
                <thead>
                    <tr>
                        <th>Person</th>
                        <th>Konjugierte Form</th>
                    </tr>
                </thead>
                <tbody>
        `;

        pronouns.forEach(persona => {
            try {
                let conjugated;
                
                if (tense === 'progresivo') {
                    const estar = this.conjugator.conjugate('estar', 'presente', persona);
                    conjugated = `${estar} ${verb.gerundio}`;
                } else if (tense === 'perifrasis') {
                    const ir = this.conjugator.conjugate('ir', 'presente', persona);
                    conjugated = `${ir} a ${infinitivo}`;
                } else {
                    conjugated = this.conjugator.conjugate(infinitivo, conjugationTense, persona);
                }

                tableHTML += `
                    <tr>
                        <td class="pronoun">${persona}</td>
                        <td class="conjugated-form">${conjugated}</td>
                    </tr>
                `;
            } catch (error) {
                tableHTML += `
                    <tr>
                        <td class="pronoun">${persona}</td>
                        <td class="conjugated-form" style="color: #dc3545;">Fehler</td>
                    </tr>
                `;
            }
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
    }

    setupMiniTest(tense) {
        const testContainer = document.getElementById('mini-test-container');
        
        // Generate a test question
        const question = this.generateTestQuestion(tense);
        
        testContainer.innerHTML = `
            <div class="test-question">
                <p><strong>Frage:</strong> ${question.prompt}</p>
                <input type="text" 
                       class="test-input" 
                       id="test-answer" 
                       placeholder="Deine Antwort...">
                <button class="test-btn" id="test-submit">Ueberpruefen</button>
                <div class="test-feedback" id="test-feedback"></div>
            </div>
        `;

        // Setup test submission
        const submitBtn = document.getElementById('test-submit');
        const answerInput = document.getElementById('test-answer');
        const feedbackDiv = document.getElementById('test-feedback');

        submitBtn.addEventListener('click', () => {
            const userAnswer = answerInput.value.trim();
            if (!userAnswer) {
                feedbackDiv.className = 'test-feedback show incorrect';
                feedbackDiv.textContent = 'Bitte gib eine Antwort ein!';
                return;
            }

            const isCorrect = this.checkTestAnswer(userAnswer, question.correctAnswer);
            
            feedbackDiv.className = `test-feedback show ${isCorrect ? 'correct' : 'incorrect'}`;
            if (isCorrect) {
                feedbackDiv.textContent = `? Richtig! Die Antwort ist: ${question.correctAnswer}`;
            } else {
                feedbackDiv.textContent = `? Falsch. Die richtige Antwort ist: ${question.correctAnswer}`;
            }
        });

        // Allow Enter key
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });
    }

    generateTestQuestion(tense) {
        const tenseData = ZEITEN_DATA[tense];
        if (!tenseData || !tenseData.examples || tenseData.examples.length === 0) {
            return {
                prompt: 'Keine Frage verfuegbar',
                correctAnswer: '-'
            };
        }

        // Pick a random example
        const example = tenseData.examples[Math.floor(Math.random() * tenseData.examples.length)];
        
        return {
            prompt: `Konjugiere "${example.infinitivo}" (${example.infinitivo === 'hablar' ? 'sprechen' : 
                     example.infinitivo === 'comer' ? 'essen' : 
                     example.infinitivo === 'vivir' ? 'leben' : 
                     example.infinitivo === 'estudiar' ? 'lernen' : 
                     example.infinitivo === 'jugar' ? 'spielen' : 
                     example.infinitivo === 'hacer' ? 'machen' : 
                     example.infinitivo === 'salir' ? 'ausgehen' : 
                     example.infinitivo === 'terminar' ? 'beenden' : 
                     example.infinitivo === 'gustar' ? 'gefallen' : 
                     example.infinitivo === 'poder' ? 'koennen' : 
                     example.infinitivo === 'deber' ? 'sollen' : 
                     example.infinitivo === 'viajar' ? 'reisen' : 'Verb'}) 
                     in ${tenseData.nameDE} fuer "${example.persona}"`,
            correctAnswer: example.verb,
            infinitivo: example.infinitivo,
            persona: example.persona
        };
    }

    checkTestAnswer(userAnswer, correctAnswer) {
        const normalized1 = this.normalizeSpanish(userAnswer);
        const normalized2 = this.normalizeSpanish(correctAnswer);
        return normalized1 === normalized2;
    }

    normalizeSpanish(text) {
        return text.toLowerCase().trim();
    }

    getCommonVerbs() {
        // Return a list of common verbs for the conjugation table
        return [
            { infinitivo: 'hablar', traduccion: 'sprechen' },
            { infinitivo: 'comer', traduccion: 'essen' },
            { infinitivo: 'vivir', traduccion: 'leben' },
            { infinitivo: 'estar', traduccion: 'sein (Zustand)' },
            { infinitivo: 'ser', traduccion: 'sein (Eigenschaft)' },
            { infinitivo: 'tener', traduccion: 'haben' },
            { infinitivo: 'hacer', traduccion: 'machen' },
            { infinitivo: 'ir', traduccion: 'gehen' },
            { infinitivo: 'poder', traduccion: 'koennen' },
            { infinitivo: 'querer', traduccion: 'wollen' },
            { infinitivo: 'decir', traduccion: 'sagen' },
            { infinitivo: 'dar', traduccion: 'geben' },
            { infinitivo: 'ver', traduccion: 'sehen' },
            { infinitivo: 'saber', traduccion: 'wissen' },
            { infinitivo: 'poner', traduccion: 'setzen' },
            { infinitivo: 'venir', traduccion: 'kommen' },
            { infinitivo: 'salir', traduccion: 'ausgehen' },
            { infinitivo: 'trabajar', traduccion: 'arbeiten' },
            { infinitivo: 'estudiar', traduccion: 'lernen' },
            { infinitivo: 'jugar', traduccion: 'spielen' }
        ];
    }

    showError(message) {
        const content = document.getElementById('tense-content');
        content.innerHTML = `
            <div class="error-message">
                <strong>Fehler:</strong> ${message}
            </div>
        `;
    }
}

// Initialize workbench when page loads
let workbench;

document.addEventListener('DOMContentLoaded', async () => {
    workbench = new ZeitenWorkbench();
    await workbench.initialize();
});

// Export for debugging
if (typeof window !== 'undefined') {
    window.ZeitenWorkbench = ZeitenWorkbench;
    window.workbench = workbench;
}
