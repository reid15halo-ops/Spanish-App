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
        // Fallback to inlined data if available
        // Use expanded lesson 1 if available, otherwise fall back to old unit
        this.units = {
            1: window.LESSON_1_EXPANDED || window.UNIT_1_PRONOUNS,
            2: window.UNIT_2_SER,
            3: window.UNIT_3_ESTAR,
            4: window.UNIT_4_SER_ESTAR_CONTRAST,
            5: window.UNIT_5_TENER,
            6: window.UNIT_6_VOCABULARY,
            7: window.UNIT_7_INTEGRATION
        };

        // Cache for loaded units
        this.cache = {};

        // Mapping of unit numbers to JSON file names
        this.unitFiles = {
            1: 'unit1-pronouns.json',
            2: 'unit2-ser.json',
            3: 'unit3-estar.json',
            4: 'unit4-ser-estar-contrast.json',
            5: 'unit5-tener.json',
            6: 'unit6-vocabulary.json',
            7: 'unit7-integration.json'
        };
    }

    /**
     * Load exercises for a specific unit
     * Progressive enhancement: Try JSON first, fallback to inlined data
     * @param {number} unitNumber - Unit number (1-7)
     * @returns {Promise<Object>} Unit data with exercises
     */
    async loadUnit(unitNumber) {
        // Check cache first
        if (this.cache[unitNumber]) {
            window.Logger?.debug(`📦 Using cached data for Unit ${unitNumber}`);
            return this.cache[unitNumber];
        }

        window.Logger?.info(`📚 Loading Unit ${unitNumber}...`);

        let data = null;

        // Strategy 1: Try loading from JSON file (optimal - lazy loading)
        try {
            data = await this.loadUnitFromJSON(unitNumber);
            window.Logger?.success(`✅ Loaded Unit ${unitNumber} from JSON (lazy loading)`);
        } catch (jsonError) {
            window.Logger?.debug(`JSON load failed for Unit ${unitNumber}:`, jsonError.message);

            // Strategy 2: Fallback to inlined data (for offline/file:// URLs)
            data = this.units[unitNumber];

            if (data) {
                window.Logger?.info(`✅ Using inlined data for Unit ${unitNumber} (fallback)`);
            } else {
                throw new Error(`Unit ${unitNumber} not found. Available units: 1-7`);
            }
        }

        // Validate data structure
        if (!data || !data.exercises || !Array.isArray(data.exercises)) {
            throw new Error(`Invalid data format for Unit ${unitNumber}`);
        }

        // Merge expanded vocabulary cards if available
        data = this.mergeExpandedVocabulary(unitNumber, data);

        // Cache the result
        this.cache[unitNumber] = {
            metadata: data.metadata,
            phases: data.learningPhases,
            exercises: data.exercises
        };

        window.Logger?.success(`✅ Unit ${unitNumber} ready (${data.exercises.length} exercises)`);
        window.Logger?.debug(`   Title: ${data.metadata?.title || 'N/A'}`);

        return this.cache[unitNumber];
    }

    /**
     * Merge expanded vocabulary cards into unit data
     * Replaces basic vocabulary-card exercises with enhanced versions that include practices
     * @param {number} unitNumber
     * @param {Object} data - Unit data
     * @returns {Object} Merged data
     */
    mergeExpandedVocabulary(unitNumber, data) {
        const expandedData = {
            2: window.UNIT2_VOCABULARY_EXPANDED,
            3: window.UNIT3_VOCABULARY_EXPANDED,
            4: window.UNIT4_VOCABULARY_EXPANDED,
            5: window.UNIT5_VOCABULARY_EXPANDED,
            6: window.UNIT6_VOCABULARY_EXPANDED
        };

        const expanded = expandedData[unitNumber];
        if (!expanded || !expanded.vocabularyCards) {
            // No expanded vocabulary for this unit
            return data;
        }

        window.Logger?.info(`🔄 Merging ${expanded.vocabularyCards.length} expanded vocabulary cards for Unit ${unitNumber}`);

        // Create a map of vocabulary card IDs to expanded cards
        const expandedMap = new Map();
        expanded.vocabularyCards.forEach(card => {
            expandedMap.set(card.id, card);
        });

        // Replace vocabulary-card exercises with expanded versions
        data.exercises = data.exercises.map(exercise => {
            if (exercise.type === 'vocabulary-card' && expandedMap.has(exercise.id)) {
                const expandedCard = expandedMap.get(exercise.id);
                window.Logger?.debug(`   ↳ Replacing ${exercise.id} with expanded version (${expandedCard.practices?.length || 0} practices)`);
                return expandedCard;
            }
            return exercise;
        });

        return data;
    }

    /**
     * Load unit data from JSON file
     * @param {number} unitNumber
     * @returns {Promise<Object>}
     */
    async loadUnitFromJSON(unitNumber) {
        const fileName = this.unitFiles[unitNumber];

        if (!fileName) {
            throw new Error(`No JSON file mapped for unit ${unitNumber}`);
        }

        const url = `/data/phase1-exercises/${fileName}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
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
            case 'grammar-explanation':
                html = this.renderGrammarExplanation(exercise);
                break;
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
            case 'conjugation':
                html = this.renderConjugation(exercise, onAnswer);
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
            case 'sentence-scramble':
                html = this.renderSentenceScramble(exercise, onAnswer);
                break;
            case 'cultural-insight':
                html = this.renderCulturalInsight(exercise);
                break;

            // All other text-input based exercises
            case 'meaning-change':
            case 'error-correction':
            case 'conversation':
            case 'comprehensive':
            case 'practical-scenario':
            case 'mixed-grammar':
            case 'comprehensive-translation':
            case 'final-mastery':
            case 'correction':
            case 'mastery-check':
            case 'final-certification':
            case 'error-identification':
            case 'contrast-sentence':
            case 'contrast-pair':
            case 'contrast-intro':
            case 'advanced-application':
                html = this.renderGenericTextInput(exercise, onAnswer);
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
     * Render vocabulary card with active practice
     */
    renderVocabularyCard(exercise, onNext) {
        // Initialize practice mode if not exists
        if (!exercise.practiceMode) {
            exercise.practiceMode = {
                currentPracticeIndex: -1, // -1 = intro screen, 0+ = practice exercises
                practices: exercise.practices || [],
                attempts: 0
            };
        }

        const mode = exercise.practiceMode;
        const currentIndex = mode.currentPracticeIndex;

        // INTRO SCREEN: Show word, explanation, mnemonic
        if (currentIndex === -1) {
            return `
                <div class="vocab-card vocab-intro">
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

                    <div class="practice-info">
                        <p>📝 Jetzt üben wir mit <strong>${mode.practices.length}</strong> Übersetzungsübungen!</p>
                    </div>

                    <button class="btn-primary" onclick="app.startVocabPractice()">Los geht's! →</button>
                </div>
            `;
        }

        // PRACTICE SCREENS: Active translation input
        if (currentIndex >= 0 && currentIndex < mode.practices.length) {
            const practice = mode.practices[currentIndex];
            const directionIcon = practice.direction === 'es-de' ? '🇪🇸 → 🇩🇪' : '🇩🇪 → 🇪🇸';
            const progress = `${currentIndex + 1}/${mode.practices.length}`;

            return `
                <div class="vocab-card vocab-practice">
                    <div class="practice-header">
                        <span class="practice-direction">${directionIcon}</span>
                        <span class="practice-progress">${progress}</span>
                    </div>

                    <div class="practice-question">
                        <p class="question-text">${practice.question}</p>
                    </div>

                    <div class="practice-input-area">
                        <label for="practice-input">Deine Übersetzung:</label>
                        <textarea
                            id="practice-input"
                            class="practice-input"
                            placeholder="Tippe hier deine Übersetzung..."
                            rows="2"
                        ></textarea>
                        ${practice.hint ? `
                            <p class="practice-hint">💡 Tipp: ${practice.hint}</p>
                        ` : ''}
                    </div>

                    <div id="practice-feedback" class="practice-feedback"></div>

                    <button class="btn-primary" onclick="app.checkVocabPractice()">Prüfen</button>
                </div>
            `;
        }

        // COMPLETE SCREEN: All practices done
        return `
            <div class="vocab-card vocab-complete">
                <div class="complete-icon">✅</div>
                <h3>Super! Wort gemeistert!</h3>
                <p>Du hast alle ${mode.practices.length} Übungen abgeschlossen.</p>
                <div class="complete-summary">
                    <div class="word-recap">
                        ${exercise.emoji ? `<div class="emoji">${exercise.emoji}</div>` : ''}
                        <div class="word">${exercise.word}</div>
                        <div class="translation">${exercise.translation}</div>
                    </div>
                </div>
                <button class="btn-primary" onclick="app.next()">Nächstes Wort →</button>
            </div>
        `;
    }

    /**
     * Render grammar explanation screen
     */
    renderGrammarExplanation(exercise) {
        let html = `
            <div class="grammar-explanation">
                <div class="grammar-header">
                    <span class="grammar-icon">${exercise.icon || '📚'}</span>
                    <h2 class="grammar-title">${exercise.title}</h2>
                </div>
        `;

        // Render all sections
        if (exercise.sections) {
            exercise.sections.forEach(section => {
                html += `
                    <div class="grammar-section">
                        <h3 class="section-heading">${section.heading}</h3>
                        <p class="section-content">${section.content}</p>
                `;

                // Bullet points
                if (section.bulletPoints) {
                    html += '<ul class="bullet-list">';
                    section.bulletPoints.forEach(point => {
                        html += `<li>${point}</li>`;
                    });
                    html += '</ul>';
                }

                // Examples
                if (section.examples) {
                    html += '<div class="examples-box">';
                    section.examples.forEach(ex => {
                        html += `<div class="example-item">${ex}</div>`;
                    });
                    html += '</div>';
                }

                // Table
                if (section.table) {
                    html += '<div class="grammar-table-wrapper"><table class="grammar-table">';
                    html += '<thead><tr>';
                    section.table.headers.forEach(header => {
                        html += `<th>${header}</th>`;
                    });
                    html += '</tr></thead><tbody>';
                    section.table.rows.forEach(row => {
                        html += '<tr>';
                        row.forEach(cell => {
                            html += `<td>${cell}</td>`;
                        });
                        html += '</tr>';
                    });
                    html += '</tbody></table></div>';
                }

                // Comparison
                if (section.comparison) {
                    html += '<div class="comparison-box">';
                    section.comparison.forEach(item => {
                        html += `
                            <div class="comparison-item">
                                <div class="comparison-verb"><strong>${item.verb.toUpperCase()}</strong></div>
                                <div class="comparison-usage">${item.usage}</div>
                                <div class="comparison-examples">
                                    ${item.examples.map(ex => `<div class="comp-example">• ${ex}</div>`).join('')}
                                </div>
                                ${item.note ? `<div class="comparison-note">${item.note}</div>` : ''}
                            </div>
                        `;
                    });
                    html += '</div>';
                }

                // Summary
                if (section.summary) {
                    html += '<div class="summary-box">';
                    section.summary.forEach(point => {
                        html += `<div class="summary-point">${point}</div>`;
                    });
                    html += '</div>';
                }

                // Note
                if (section.note) {
                    html += `<div class="grammar-note">📌 ${section.note}</div>`;
                }

                // Mnemonic
                if (section.mnemonic) {
                    html += `<div class="mnemonic-box">💡 ${section.mnemonic}</div>`;
                }

                // Encouragement
                if (section.encouragement) {
                    html += `<div class="encouragement">${section.encouragement}</div>`;
                }

                html += `</div>`; // close grammar-section
            });
        }

        // Continue button
        html += `
                <div class="grammar-actions">
                    <button class="btn-primary btn-large" onclick="app.next()">
                        ${exercise.checkButton ? exercise.checkButton.text : 'Verstanden, weiter! →'}
                    </button>
                </div>
            </div>
        `;

        return html;
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

        // Build complete sentence from the blank question and correct answer
        let completeSentence = parsed.spanish;
        if (completeSentence.includes('____')) {
            // Replace blanks with the correct answer to show the complete sentence
            const answers = exercise.correctAnswer.split(';');
            answers.forEach(answer => {
                completeSentence = completeSentence.replace('____', answer.trim());
            });
        }

        // Store the complete sentence as the expected answer for this exercise
        if (!exercise._fullSentenceAnswer) {
            exercise._fullSentenceAnswer = completeSentence
                .replace(/\s*\([^)]*\)/g, '') // Remove (German translation) if present
                .replace(/\s+/g, ' ')
                .trim();

            // Generate alternative answers (with/without punctuation, different cases)
            if (!exercise._fullSentenceAlternatives) {
                const baseAnswer = exercise._fullSentenceAnswer;
                exercise._fullSentenceAlternatives = [
                    baseAnswer,
                    baseAnswer + '.',
                    baseAnswer.toLowerCase(),
                    baseAnswer.toLowerCase() + '.',
                    // Capitalize first letter
                    baseAnswer.charAt(0).toUpperCase() + baseAnswer.slice(1),
                    baseAnswer.charAt(0).toUpperCase() + baseAnswer.slice(1) + '.'
                ];
            }
        }

        return `
            <div class="fill-blank">
                <p class="instruction">✍️ <strong>Schreibe den ganzen Satz:</strong></p>
                <p class="question">${parsed.spanish}</p>

                ${this.renderGermanHelp(parsed.german, exercise.germanBridge, exercise.example)}

                <div class="input-group">
                    <textarea id="answer-input" class="text-input" rows="2"
                           placeholder="Schreibe den kompletten spanischen Satz..." autocomplete="off"></textarea>
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
     * Render conjugation exercise
     */
    renderConjugation(exercise, onAnswer) {
        return `
            <div class="conjugation">
                <p class="question">${exercise.question}</p>

                ${exercise.germanBridge ? `
                    <div class="german-bridge">${exercise.germanBridge}</div>
                ` : ''}

                ${exercise.note ? `
                    <p class="note"><strong>📌 Hinweis:</strong> ${exercise.note}</p>
                ` : ''}

                <div class="input-group">
                    <input type="text" id="answer-input" class="text-input"
                           placeholder="Deine Antwort..." autocomplete="off">
                    <button class="btn-primary" onclick="app.checkAnswer()">Prüfen</button>
                </div>

                ${exercise.mnemonic ? `
                    <div id="hint-area" class="hint-area hidden">
                        <p class="hint"><strong>💡 Merkhilfe:</strong> ${exercise.mnemonic}</p>
                    </div>
                ` : ''}

                <div id="feedback-area" class="feedback-area hidden"></div>

                ${exercise.examples && exercise.examples.length > 0 ? `
                    <div class="examples-box hidden" id="examples-box">
                        <strong>📚 Beispiele:</strong>
                        ${exercise.examples.map(ex => `<p class="example">${ex}</p>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render generic text-input exercise (used for many exercise types)
     */
    renderGenericTextInput(exercise, onAnswer) {
        // Get exercise type label for display
        const typeLabels = {
            'meaning-change': 'Bedeutungsänderung',
            'error-correction': 'Fehlerkorrektur',
            'conversation': 'Konversation',
            'comprehensive': 'Umfassende Übung',
            'practical-scenario': 'Praxisszenario',
            'mixed-grammar': 'Gemischte Grammatik',
            'comprehensive-translation': 'Umfassende Übersetzung',
            'final-mastery': 'Abschlussprüfung',
            'correction': 'Korrektur',
            'mastery-check': 'Meisterschaftstest',
            'final-certification': 'Abschlusszertifizierung',
            'error-identification': 'Fehleridentifikation',
            'contrast-sentence': 'Kontrastsatz',
            'contrast-pair': 'Kontrastpaar',
            'contrast-intro': 'Kontrasteinführung',
            'advanced-application': 'Erweiterte Anwendung'
        };

        const typeLabel = typeLabels[exercise.type] || exercise.type;

        return `
            <div class="generic-text-input ${exercise.type}">
                <div class="exercise-type-badge">${typeLabel}</div>

                <p class="question">${exercise.question}</p>

                ${exercise.germanBridge ? `
                    <div class="german-bridge">${exercise.germanBridge}</div>
                ` : ''}

                ${exercise.note ? `
                    <p class="note"><strong>📌 Hinweis:</strong> ${exercise.note}</p>
                ` : ''}

                ${exercise.warning ? `
                    <p class="warning"><strong>${exercise.warning}</strong></p>
                ` : ''}

                ${exercise.rule ? `
                    <p class="rule"><strong>📏 Regel:</strong> ${exercise.rule}</p>
                ` : ''}

                ${exercise.context ? `
                    <p class="context"><em>${exercise.context}</em></p>
                ` : ''}

                <div class="input-group">
                    <textarea id="answer-input" class="text-input-area"
                           placeholder="Deine Antwort..." rows="3" autocomplete="off"></textarea>
                    <button class="btn-primary" onclick="app.checkAnswer()">Prüfen</button>
                </div>

                ${exercise.mnemonic ? `
                    <div id="hint-area" class="hint-area hidden">
                        <p class="hint"><strong>💡 Merkhilfe:</strong> ${exercise.mnemonic}</p>
                    </div>
                ` : ''}

                ${exercise.hint ? `
                    <div id="hint-area" class="hint-area hidden">
                        <p class="hint"><strong>💡 Hinweis:</strong> ${exercise.hint}</p>
                    </div>
                ` : ''}

                <div id="feedback-area" class="feedback-area hidden"></div>

                ${exercise.examples && exercise.examples.length > 0 ? `
                    <div class="examples-box hidden" id="examples-box">
                        <strong>📚 Beispiele:</strong>
                        ${exercise.examples.map(ex => `<p class="example">${ex}</p>`).join('')}
                    </div>
                ` : ''}

                ${exercise.breakdown ? `
                    <div class="breakdown-box hidden" id="breakdown-box">
                        <strong>🔍 Analyse:</strong>
                        ${Object.entries(exercise.breakdown).map(([key, value]) =>
                            `<p class="breakdown-item"><strong>${key}:</strong> ${value}</p>`
                        ).join('')}
                    </div>
                ` : ''}
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
     * Render sentence scramble exercise (click-to-add interface)
     */
    renderSentenceScramble(exercise, onAnswer) {
        // Initialize scramble state if not exists
        if (!exercise.scrambleState) {
            exercise.scrambleState = {
                userAnswer: [],
                availableWords: [...exercise.words] // Clone array
            };
        }

        const state = exercise.scrambleState;
        const translation = exercise.translation || '';
        const hint = exercise.hint || '';

        return `
            <div class="sentence-scramble">
                <div class="scramble-instruction">
                    <p class="instruction-title">🔀 Ordne die Wörter zum richtigen Satz:</p>
                    <p class="translation">"${translation}"</p>
                </div>

                <div class="scramble-answer-area">
                    <div class="answer-label">Deine Antwort:</div>
                    <div id="scramble-answer" class="scramble-answer">
                        ${state.userAnswer.length === 0
                            ? '<span class="empty-placeholder">Klicke auf die Wörter unten...</span>'
                            : state.userAnswer.map((word, index) =>
                                `<button class="word-chip selected" onclick="app.removeWordFromScramble(${index})">${word}</button>`
                              ).join('')
                        }
                    </div>
                </div>

                <div class="scramble-words-area">
                    <div class="words-label">Verfügbare Wörter:</div>
                    <div id="scramble-words" class="scramble-words">
                        ${state.availableWords.length === 0
                            ? '<span class="all-used">✓ Alle Wörter verwendet</span>'
                            : state.availableWords.map((word, index) =>
                                `<button class="word-chip" onclick="app.addWordToScramble(${index})">${word}</button>`
                              ).join('')
                        }
                    </div>
                </div>

                ${hint ? `
                    <div id="hint-area" class="hint-area hidden">
                        <p class="hint"><strong>💡 Hinweis:</strong> ${hint}</p>
                    </div>
                ` : ''}

                <div class="scramble-actions">
                    <button class="btn-secondary" onclick="app.resetScramble()"
                            ${state.userAnswer.length === 0 ? 'disabled' : ''}>
                        🔄 Zurücksetzen
                    </button>
                    <button class="btn-primary" onclick="app.checkScrambleAnswer()"
                            ${state.userAnswer.length === 0 ? 'disabled' : ''}>
                        Prüfen
                    </button>
                </div>

                <div id="feedback-area" class="feedback-area hidden"></div>
            </div>
        `;
    }

    /**
     * Render cultural insight (info card)
     */
    renderCulturalInsight(exercise) {
        const emoji = exercise.emoji || '💡';
        const title = exercise.title || 'Wusstest du?';
        const content = exercise.content || '';

        return `
            <div class="cultural-insight">
                <div class="insight-header">
                    <span class="insight-emoji">${emoji}</span>
                    <h3 class="insight-title">${title}</h3>
                </div>

                <div class="insight-content">
                    <p>${content}</p>
                </div>

                <div class="insight-footer">
                    <button class="btn-primary" onclick="app.next()">Weiter lernen →</button>
                </div>
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

        // Escape user-facing content to prevent XSS
        const safeMessage = window.escapeHtml ? window.escapeHtml(message) : message;
        const safeAnswer = window.escapeHtml ? window.escapeHtml(correctAnswer) : correctAnswer;

        let html = `<p class="feedback-message">${safeMessage}</p>`;

        if (!isCorrect && correctAnswer) {
            html += `<p class="correct-answer">Richtige Antwort: <strong>${safeAnswer}</strong></p>`;
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

        // Initialize Adaptive Learning System
        this.adaptiveSystem = new window.AdaptiveLearningSystem();

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

        // Prevent double-navigation race conditions
        this.autoAdvanceTimeout = null;
        this.isNavigating = false;

        // Initialize tolerant validator and improved feedback system
        this.validator = new TolerantAnswerValidator();
        this.feedbackSystem = new ImprovedFeedbackSystem();

        // Initialize level test and adaptive practice systems
        this.levelTestSystem = new LevelTestSystem();
        this.adaptivePracticeSystem = new AdaptivePracticeSystem();
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
            const learningMode = this.settings.learningMode || 'linear';

            if (learningMode === 'adaptive') {
                await this.loadUnitAdaptive(unitNumber);
            } else {
                await this.loadUnitLinear(unitNumber);
            }
        } catch (error) {
            window.Logger?.error('Error loading unit:', error);
            window.ErrorBoundary?.handleError(error, { context: `Loading Unit ${unitNumber}` });
            throw error;
        }
    }

    /**
     * Load unit in linear mode (original behavior)
     */
    async loadUnitLinear(unitNumber) {
        window.Logger?.info(`Loading Unit ${unitNumber} (Linear Mode)...`);

        const data = await this.loader.loadUnit(unitNumber);

        this.exercises = data.exercises;

        // Insert cultural insights after every 10th exercise
        this.insertCulturalInsights(unitNumber);

        this.currentUnit = unitNumber;
        this.currentIndex = 0;
        this.attempts = 0;

        window.Logger?.success(`Unit ${unitNumber} loaded: ${this.exercises.length} exercises (with insights)`);

        // Update progress
        this.updateProgress();
    }

    /**
     * Load unit in adaptive mode (all units, personalized sequence)
     */
    async loadUnitAdaptive(unitNumber) {
        window.Logger?.info(`Loading Unit ${unitNumber} (Adaptive Mode)...`);

        // Load all exercises from all units for adaptive selection
        const allExercises = [];

        for (let unit = 1; unit <= 7; unit++) {
            const data = await this.loader.loadUnit(unit);
            data.exercises.forEach(ex => {
                allExercises.push({
                    ...ex,
                    unitNumber: unit,
                    unitName: data.metadata?.title || `Unit ${unit}`
                });
            });
        }

        window.Logger?.info(`Loaded ${allExercises.length} total exercises from all units`);

        // Create adaptive sequence based on performance
        this.exercises = this.adaptiveSystem.createAdaptiveSequence(allExercises, 50);

        window.Logger?.success(`Created adaptive sequence: ${this.exercises.length} exercises`);

        this.currentUnit = unitNumber;
        this.currentIndex = 0;
        this.attempts = 0;

        // Update progress
        this.updateProgress();

        // Show adaptive recommendations
        this.showAdaptiveRecommendations();
    }

    /**
     * Insert cultural insights after every N exercises
     */
    insertCulturalInsights(unitNumber, interval = 10) {
        if (!window.CULTURAL_INSIGHTS) {
            window.Logger?.warn('Cultural Insights not loaded');
            return;
        }

        const newExercises = [];
        const usedInsightIds = new Set();

        for (let i = 0; i < this.exercises.length; i++) {
            // Add the regular exercise
            newExercises.push(this.exercises[i]);

            // Insert insight after every Nth exercise (but not after the last one)
            if ((i + 1) % interval === 0 && i < this.exercises.length - 1) {
                let insight = null;
                let attempts = 0;

                // Try to get a unique insight (max 10 attempts to avoid infinite loop)
                do {
                    insight = window.CULTURAL_INSIGHTS.getRandomInsight(unitNumber);
                    attempts++;
                } while (usedInsightIds.has(insight.id) && attempts < 10);

                if (insight) {
                    usedInsightIds.add(insight.id);

                    // Create exercise object from insight
                    const insightExercise = {
                        id: `insight_${insight.id}_u${unitNumber}_pos${i}`,
                        type: 'cultural-insight',
                        emoji: insight.emoji,
                        title: insight.title,
                        content: insight.content,
                        category: insight.category,
                        difficulty: 0, // Insights have no difficulty
                        concept: 'cultural-knowledge'
                    };

                    newExercises.push(insightExercise);
                    window.Logger?.debug(`Inserted cultural insight "${insight.title}" after exercise ${i + 1}`);
                }
            }
        }

        this.exercises = newExercises;
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
            window.ModalDialog.alert('Bitte gib eine Antwort ein!', 'warning');
            return;
        }

        this.handleAnswer(answer);
    }

    /**
     * Handle user answer
     */
    handleAnswer(userAnswer) {
        window.Logger?.debug('[App] handleAnswer called with:', userAnswer);

        const exercise = this.exercises[this.currentIndex];
        window.Logger?.debug('[App] Current exercise:', exercise.type, exercise.id);

        // Get correct answer (different location for reading-comprehension)
        let correctAnswer;
        let alternativeAnswers = exercise.alternativeAnswers || [];

        if (exercise.type === 'reading-comprehension' && exercise.comprehensionCheck) {
            correctAnswer = exercise.comprehensionCheck.correctAnswer;
        } else if (exercise.type === 'fill-blank') {
            // For fill-blank exercises, build the complete sentence if not already done
            if (!exercise._fullSentenceAnswer) {
                // Extract Spanish from question
                const questionMatch = exercise.question.match(/^(.*?)(\s*\(|$)/);
                let spanishQuestion = questionMatch ? questionMatch[1].trim() : exercise.question;

                // Replace blanks with correct answers
                if (spanishQuestion.includes('____')) {
                    const answers = exercise.correctAnswer.split(';');
                    answers.forEach(answer => {
                        spanishQuestion = spanishQuestion.replace('____', answer.trim());
                    });
                }

                exercise._fullSentenceAnswer = spanishQuestion.trim();

                // Generate alternatives
                const baseAnswer = exercise._fullSentenceAnswer;
                exercise._fullSentenceAlternatives = [
                    baseAnswer,
                    baseAnswer + '.',
                    baseAnswer.toLowerCase(),
                    baseAnswer.toLowerCase() + '.',
                    baseAnswer.charAt(0).toUpperCase() + baseAnswer.slice(1),
                    baseAnswer.charAt(0).toUpperCase() + baseAnswer.slice(1) + '.'
                ];
            }

            // Use the complete sentence
            correctAnswer = exercise._fullSentenceAnswer;
            // Include generated alternatives
            if (exercise._fullSentenceAlternatives) {
                alternativeAnswers = [...alternativeAnswers, ...exercise._fullSentenceAlternatives];
            }
        } else {
            correctAnswer = exercise.correctAnswer;
        }

        window.Logger?.debug('[App] Correct answer:', correctAnswer);

        // Create modified exercise with alternatives for validator
        const exerciseForValidation = {
            ...exercise,
            alternativeAnswers: alternativeAnswers
        };

        // Use tolerant validator for improved feedback
        const validationResult = this.validator.validateAnswer(
            userAnswer,
            correctAnswer,
            exerciseForValidation
        );

        window.Logger?.debug('[App] Validation result:', validationResult);

        // Update stats (only based on core correctness)
        this.stats.total++;
        if (validationResult.isCorrect) {
            this.stats.correct++;
        } else {
            this.attempts++;

            // Show hint based on settings (only for incorrect answers)
            const maxAttempts = this.getMaxAttemptsBeforeHint();
            if (this.attempts >= maxAttempts && exercise.hint) {
                this.renderer.showHint();
            }
        }

        // Record attempt in adaptive learning system
        this.adaptiveSystem.recordAttempt(exercise, validationResult.isCorrect);

        // Save progress after updating stats
        this.saveProgress();

        window.Logger?.debug('[App] About to call feedbackSystem.showValidationResult');

        // Show improved feedback
        this.feedbackSystem.showValidationResult(validationResult, exercise);

        window.Logger?.debug('[App] After feedbackSystem.showValidationResult');

        // Disable input/buttons to prevent multiple submissions
        this.disableInput();
    }

    /**
     * Disable input and buttons after answer submission
     */
    disableInput() {
        const input = document.getElementById('answer-input');
        if (input) {
            input.disabled = true;
        }

        const buttons = document.querySelectorAll('.btn-option, .btn-primary');
        buttons.forEach(btn => btn.disabled = true);
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
        // Prevent race condition: ignore if already navigating
        if (this.isNavigating) {
            return;
        }

        // Clear any pending auto-advance
        if (this.autoAdvanceTimeout) {
            clearTimeout(this.autoAdvanceTimeout);
            this.autoAdvanceTimeout = null;
        }

        this.isNavigating = true;
        this.showExercise(this.currentIndex + 1);
        this.saveProgress();

        // Reset navigation flag after a short delay
        setTimeout(() => {
            this.isNavigating = false;
        }, 100);
    }

    /**
     * Go to previous exercise
     */
    previous() {
        if (this.isNavigating) {
            return;
        }

        if (this.currentIndex > 0) {
            if (this.autoAdvanceTimeout) {
                clearTimeout(this.autoAdvanceTimeout);
                this.autoAdvanceTimeout = null;
            }

            this.isNavigating = true;
            this.showExercise(this.currentIndex - 1);
            this.saveProgress();

            setTimeout(() => {
                this.isNavigating = false;
            }, 100);
        }
    }

    /**
     * Start vocabulary practice mode (move from intro to first practice)
     */
    startVocabPractice() {
        const exercise = this.units[this.currentUnit].exercises[this.currentIndex];

        if (exercise.type === 'vocabulary-card' && exercise.practiceMode) {
            exercise.practiceMode.currentPracticeIndex = 0;
            this.render();

            // Focus on input field after render
            setTimeout(() => {
                const input = document.getElementById('practice-input');
                if (input) input.focus();
            }, 100);
        }
    }

    /**
     * Check vocabulary practice answer
     */
    checkVocabPractice() {
        const exercise = this.units[this.currentUnit].exercises[this.currentIndex];

        if (exercise.type !== 'vocabulary-card' || !exercise.practiceMode) {
            return;
        }

        const mode = exercise.practiceMode;
        const currentIndex = mode.currentPracticeIndex;

        if (currentIndex < 0 || currentIndex >= mode.practices.length) {
            return;
        }

        const practice = mode.practices[currentIndex];
        const input = document.getElementById('practice-input');
        const feedback = document.getElementById('practice-feedback');

        if (!input || !feedback) return;

        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = practice.answer.toLowerCase();

        // Normalize for comparison (remove punctuation, extra spaces)
        const normalize = (str) => str.replace(/[¿?¡!.,;:]/g, '').replace(/\s+/g, ' ').trim();
        const normalizedUser = normalize(userAnswer);
        const normalizedCorrect = normalize(correctAnswer);

        // Check if answer is correct (allow some flexibility)
        const isCorrect = normalizedUser === normalizedCorrect ||
                         normalizedCorrect.includes(normalizedUser) ||
                         this.calculateSimilarity(normalizedUser, normalizedCorrect) > 0.85;

        if (isCorrect) {
            // Correct answer
            feedback.innerHTML = `
                <div class="feedback-correct">
                    ✅ <strong>Richtig!</strong> ${practice.answer}
                </div>
            `;
            feedback.className = 'practice-feedback correct';

            // Move to next practice after delay
            setTimeout(() => {
                mode.currentPracticeIndex++;
                this.render();

                // Focus on next input if exists
                setTimeout(() => {
                    const nextInput = document.getElementById('practice-input');
                    if (nextInput) nextInput.focus();
                }, 100);
            }, 6000);
        } else {
            // Incorrect answer
            mode.attempts++;

            if (mode.attempts >= 2) {
                // Show correct answer after 2 attempts with "Weiter" button
                feedback.innerHTML = `
                    <div class="feedback-show-answer">
                        ℹ️ <strong>Die richtige Antwort ist:</strong><br>
                        ${practice.answer}
                        <button id="vocab-next-btn" class="vocab-next-button">Weiter →</button>
                    </div>
                `;
                feedback.className = 'practice-feedback show-answer';

                // Add click handler for "Weiter" button
                setTimeout(() => {
                    const nextBtn = document.getElementById('vocab-next-btn');
                    if (nextBtn) {
                        nextBtn.addEventListener('click', () => {
                            mode.currentPracticeIndex++;
                            mode.attempts = 0;
                            this.render();

                            setTimeout(() => {
                                const nextInput = document.getElementById('practice-input');
                                if (nextInput) nextInput.focus();
                            }, 100);
                        });
                        nextBtn.focus(); // Focus on button so user can press Enter
                    }
                }, 100);
            } else {
                // Give hint, allow retry
                feedback.innerHTML = `
                    <div class="feedback-incorrect">
                        ❌ <strong>Nicht ganz.</strong> Versuch es nochmal!
                        ${practice.hint ? `<br><small>💡 ${practice.hint}</small>` : ''}
                    </div>
                `;
                feedback.className = 'practice-feedback incorrect';
                input.select();
            }
        }
    }

    /**
     * Calculate string similarity (for flexible answer checking)
     */
    calculateSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;

        if (longer.length === 0) return 1.0;

        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }

    /**
     * Calculate Levenshtein distance (for similarity checking)
     */
    levenshteinDistance(str1, str2) {
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
    }

    /**
     * Add word to scramble answer
     */
    addWordToScramble(index) {
        const exercise = this.exercises[this.currentIndex];
        if (!exercise || exercise.type !== 'sentence-scramble') return;

        const state = exercise.scrambleState;
        const word = state.availableWords[index];

        // Add to user answer
        state.userAnswer.push(word);

        // Remove from available words
        state.availableWords.splice(index, 1);

        // Re-render
        this.render();
    }

    /**
     * Remove word from scramble answer (click on selected word)
     */
    removeWordFromScramble(index) {
        const exercise = this.exercises[this.currentIndex];
        if (!exercise || exercise.type !== 'sentence-scramble') return;

        const state = exercise.scrambleState;
        const word = state.userAnswer[index];

        // Remove from user answer
        state.userAnswer.splice(index, 1);

        // Add back to available words
        state.availableWords.push(word);

        // Re-render
        this.render();
    }

    /**
     * Reset scramble exercise (clear all selections)
     */
    resetScramble() {
        const exercise = this.exercises[this.currentIndex];
        if (!exercise || exercise.type !== 'sentence-scramble') return;

        // Reset state
        exercise.scrambleState = {
            userAnswer: [],
            availableWords: [...exercise.words] // Reset to original words
        };

        // Re-render
        this.render();
    }

    /**
     * Check scramble answer
     */
    checkScrambleAnswer() {
        const exercise = this.exercises[this.currentIndex];
        if (!exercise || exercise.type !== 'sentence-scramble') return;

        const state = exercise.scrambleState;
        const userSentence = state.userAnswer.join(' ');
        const correctAnswer = exercise.correctAnswer;

        // Normalize both for comparison
        const normalizedUser = this.normalizeAnswer(userSentence);
        const normalizedCorrect = this.normalizeAnswer(correctAnswer);

        const isCorrect = normalizedUser === normalizedCorrect;

        // Update stats
        this.stats.total++;
        if (isCorrect) {
            this.stats.correct++;
        } else {
            this.attempts++;

            // Show hint after max attempts
            const maxAttempts = this.getMaxAttemptsBeforeHint();
            if (this.attempts >= maxAttempts && exercise.hint) {
                this.showHint();
            }
        }

        // Record attempt in adaptive learning
        this.adaptiveSystem.recordAttempt(exercise, isCorrect);

        // Save progress
        this.saveProgress();

        // Show feedback
        const feedbackArea = document.getElementById('feedback-area');
        if (feedbackArea) {
            feedbackArea.className = `feedback-area ${isCorrect ? 'correct' : 'incorrect'}`;

            let html = '';
            if (isCorrect) {
                html = `<p class="feedback-message">✅ <strong>Richtig!</strong> Perfekte Wortstellung!</p>`;
            } else {
                html = `
                    <p class="feedback-message">❌ <strong>Nicht ganz richtig.</strong></p>
                    <p class="correct-answer">Richtige Antwort: <strong>${correctAnswer}</strong></p>
                `;
            }

            feedbackArea.innerHTML = html;
            feedbackArea.classList.remove('hidden');

            // Show next button after a delay
            if (isCorrect) {
                setTimeout(() => this.showNextButton(), 800);
            } else {
                this.showNextButton();
            }
        }

        // Disable buttons after checking
        const checkBtn = document.querySelector('.scramble-actions .btn-primary');
        const resetBtn = document.querySelector('.scramble-actions .btn-secondary');
        if (checkBtn) checkBtn.disabled = true;
        if (resetBtn) resetBtn.disabled = true;

        // Disable word chips
        const wordChips = document.querySelectorAll('.word-chip');
        wordChips.forEach(chip => chip.disabled = true);
    }

    /**
     * Jump to specific exercise
     */
    jumpToExercise(index) {
        if (this.isNavigating) {
            return;
        }

        if (index >= 0 && index < this.exercises.length) {
            if (this.autoAdvanceTimeout) {
                clearTimeout(this.autoAdvanceTimeout);
                this.autoAdvanceTimeout = null;
            }

            this.isNavigating = true;
            this.showExercise(index);
            this.saveProgress();

            setTimeout(() => {
                this.isNavigating = false;
            }, 100);
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

            // Get progress for this unit from localStorage
            let progressText = `Lektion ${i}`;
            try {
                const savedProgress = localStorage.getItem('exerciseProgress');
                if (savedProgress) {
                    const progressData = JSON.parse(savedProgress);
                    if (progressData.unit === i && progressData.index !== undefined) {
                        // Calculate percentage based on current unit's exercises
                        // If this is the current unit, use current data
                        if (i === this.currentUnit && this.exercises && this.exercises.length > 0) {
                            const currentEx = this.currentIndex + 1;
                            const totalEx = this.exercises.length;
                            const percentage = Math.round((currentEx / totalEx) * 100);
                            progressText = `Lektion ${i} (${percentage}%)`;
                        } else if (i === progressData.unit) {
                            // For saved progress, we need to estimate
                            progressText = `Lektion ${i} (in Progress)`;
                        }
                    } else if (i < (progressData.unit || 1)) {
                        // Units before current are considered complete
                        progressText = `Lektion ${i} (✓)`;
                    }
                }
            } catch (e) {
                // If localStorage fails, just show unit number
                window.Logger?.warn('Could not load progress for unit', i, e);
            }

            option.textContent = progressText;
            if (i === this.currentUnit) {
                option.selected = true;
            }
            select.appendChild(option);
        }

        select.addEventListener('change', async (e) => {
            const newUnit = parseInt(e.target.value);
            if (newUnit !== this.currentUnit) {
                const confirmed = await window.ModalDialog.confirm(
                    `Möchtest du zu Lektion ${newUnit} wechseln? Dein Fortschritt wird gespeichert.`,
                    'Wechseln',
                    'Abbrechen'
                );
                if (confirmed) {
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

            // Get mastery level for this concept
            const firstEx = exercises[0]?.exercise;
            const conceptKey = firstEx?.concept || 'general';
            const mastery = this.adaptiveSystem.getConceptMastery(conceptKey);
            const masteryPercent = Math.round(mastery * 100);

            const title = document.createElement('div');
            title.className = 'unit-title';
            title.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';

            const conceptName = document.createElement('span');
            conceptName.textContent = concept;

            const masteryBadge = document.createElement('span');
            masteryBadge.style.cssText = `
                font-size: 11px;
                padding: 2px 8px;
                border-radius: 12px;
                background: ${mastery >= 0.8 ? '#4CAF50' : mastery >= 0.5 ? '#FF9800' : '#f44336'};
                color: white;
            `;
            masteryBadge.textContent = `${masteryPercent}%`;

            title.appendChild(conceptName);
            title.appendChild(masteryBadge);
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
            window.ModalDialog.alert(`Fehler beim Wechseln zu Lektion ${unitNumber}. Bitte versuche es erneut.`, 'error');
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

        // Update unit selector progress for current unit
        const unitSelector = document.querySelector('.unit-selector select');
        if (unitSelector && this.exercises && this.exercises.length > 0) {
            const currentOption = unitSelector.querySelector(`option[value="${this.currentUnit}"]`);
            if (currentOption) {
                const currentEx = this.currentIndex + 1;
                const totalEx = this.exercises.length;
                const percentage = Math.round((currentEx / totalEx) * 100);
                currentOption.textContent = `Lektion ${this.currentUnit} (${percentage}%)`;
            }
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

        // Check if user completed Unit 7 (A1 complete)
        const completedA1 = this.currentUnit === 7;

        const container = document.getElementById('exercise-area');
        container.innerHTML = `
            <div class="completion">
                <div class="completion-emoji">${emoji}</div>
                <h2>Lektion ${this.currentUnit} abgeschlossen!</h2>
                <div class="completion-stats">
                    <p class="score">${this.stats.correct}/${this.stats.total} richtig</p>
                    <p class="accuracy">${accuracy}% Genauigkeit</p>
                </div>

                ${completedA1 ? `
                    <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white;">
                        <h3 style="margin: 0 0 15px 0; font-size: 24px;">🎓 ¡Felicidades!</h3>
                        <p style="margin: 0 0 20px 0; font-size: 16px;">
                            ¡Has completado todas las lecciones de nivel A1!
                        </p>
                        <button class="btn-primary" onclick="app.startLevelTest('A1')"
                                style="background: white; color: #667eea; margin-bottom: 10px;">
                            📝 Hacer Examen de Nivel A1
                        </button>
                    </div>
                    <button class="btn-primary" onclick="app.restartCurrentUnit()"
                            style="background: var(--bg); color: var(--text); border: 2px solid var(--border); margin-top: 10px;">
                        Repetir Lektion 7
                    </button>
                ` : hasNextUnit ? `
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

        // Mark Unit 7 as completed for level test system
        if (completedA1) {
            this.markUnitComplete(7);
        }
    }

    /**
     * Mark unit as completed
     */
    markUnitComplete(unitNumber) {
        try {
            const progress = JSON.parse(localStorage.getItem('spanish-app-progress') || '{}');
            if (!progress.completedUnits) {
                progress.completedUnits = [];
            }
            if (!progress.completedUnits.includes(unitNumber)) {
                progress.completedUnits.push(unitNumber);
            }
            localStorage.setItem('spanish-app-progress', JSON.stringify(progress));
        } catch (error) {
            console.error('Error marking unit complete:', error);
        }
    }

    /**
     * Start level test
     */
    async startLevelTest(level) {
        try {
            window.Logger?.info(`Starting ${level} level test...`);

            // Get the test
            const test = this.levelTestSystem.getTestById(level);
            if (!test) {
                await window.ModalDialog.alert('Test not found!', 'error');
                return;
            }

            // Show test instructions
            const proceed = await window.ModalDialog.confirm(
                `Examen de Nivel ${level}\n\n` +
                `${test.description}\n\n` +
                `Tiempo: ${test.timeLimit} minutos\n` +
                `Puntuación mínima: ${test.passingScore}%\n\n` +
                `IMPORTANTE: El examen está completamente en español sin ayuda en alemán.\n\n` +
                `¿Estás listo para comenzar?`,
                'Comenzar',
                'Cancelar'
            );

            if (!proceed) return;

            // Note: Test UI flow is planned but not yet implemented
            // Future implementation will include:
            // - Full-screen test mode with timer
            // - Question navigation and review
            // - Automatic grading with detailed feedback
            // - Certificate generation on passing
            await window.ModalDialog.alert('Test-System wird implementiert! Dies ist eine Vorschau der Funktion.', 'info');

        } catch (error) {
            window.Logger?.error('Error starting level test:', error);
            await window.ModalDialog.alert('Fehler beim Starten des Tests', 'error');
        }
    }

    /**
     * Load next unit
     */
    async loadNextUnit() {
        const nextUnit = this.currentUnit + 1;

        if (nextUnit > 7) {
            await window.ModalDialog.alert('Du hast bereits alle Lektionen abgeschlossen!', 'success');
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
            await window.ModalDialog.alert(`Fehler beim Laden von Lektion ${nextUnit}. Bitte versuche es erneut.`, 'error');
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
            await window.ModalDialog.alert('Fehler beim Neustarten. Bitte versuche es erneut.', 'error');
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
            helpLevel: 'normal', // 'keine', 'normal', 'viel'
            learningMode: 'linear' // 'linear', 'adaptive'
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

        // Set current help level value
        const helpRadio = document.querySelector(`input[name="help"][value="${this.settings.helpLevel}"]`);
        if (helpRadio) {
            helpRadio.checked = true;
        }

        // Set current learning mode value
        const modeRadio = document.querySelector(`input[name="learningMode"][value="${this.settings.learningMode || 'linear'}"]`);
        if (modeRadio) {
            modeRadio.checked = true;
        }

        // Setup save button
        const saveBtn = document.getElementById('save-settings');
        if (saveBtn) {
            saveBtn.onclick = async () => {
                const selectedHelp = document.querySelector('input[name="help"]:checked');
                const selectedMode = document.querySelector('input[name="learningMode"]:checked');

                const oldMode = this.settings.learningMode;

                if (selectedHelp) {
                    this.settings.helpLevel = selectedHelp.value;
                }

                if (selectedMode) {
                    this.settings.learningMode = selectedMode.value;
                }

                this.saveSettings();

                // If learning mode changed, reload current unit
                if (selectedMode && oldMode !== selectedMode.value) {
                    window.ModalDialog.toast('Lernmodus geändert! Unit wird neu geladen...', 'info');
                    modal.classList.add('hidden');

                    // Reload current unit with new mode
                    await this.loadUnit(this.currentUnit);
                    this.buildSidebar();
                    this.showExercise(0);

                    window.ModalDialog.toast(
                        selectedMode.value === 'adaptive'
                            ? '🎯 Adaptiver Modus aktiviert!'
                            : '📚 Linearer Modus aktiviert!',
                        'success'
                    );
                } else {
                    window.ModalDialog.toast('Einstellungen gespeichert!', 'success');
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

    /**
     * Show adaptive learning recommendations
     */
    showAdaptiveRecommendations() {
        const recommendations = this.adaptiveSystem.getRecommendations();
        const stats = this.adaptiveSystem.getStatistics();

        // Log recommendations to console
        window.Logger?.debug('🎯 Adaptive Learning Recommendations:', recommendations);
        window.Logger?.debug('📊 Learning Statistics:', stats);

        // Update sidebar with adaptive info
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        // Create adaptive info panel
        let adaptivePanel = document.getElementById('adaptive-panel');
        if (!adaptivePanel) {
            adaptivePanel = document.createElement('div');
            adaptivePanel.id = 'adaptive-panel';
            adaptivePanel.style.cssText = `
                background: rgba(32, 178, 170, 0.1);
                border: 2px solid var(--primary);
                border-radius: 8px;
                padding: 15px;
                margin: 15px 0;
            `;

            // Insert after sidebar header
            const sidebarHeader = sidebar.querySelector('.sidebar-header');
            if (sidebarHeader && sidebarHeader.nextSibling) {
                sidebar.insertBefore(adaptivePanel, sidebarHeader.nextSibling);
            }
        }

        // Build adaptive info HTML
        let html = '<div style="font-size: 14px;">';

        // Overall mastery
        const masteryPercent = Math.round(recommendations.overallMastery * 100);
        html += `<div style="margin-bottom: 10px;">
            <strong>🎯 Gesamtfortschritt:</strong> ${masteryPercent}%
            <div style="background: #ddd; height: 8px; border-radius: 4px; margin-top: 5px;">
                <div style="background: var(--primary); height: 100%; width: ${masteryPercent}%; border-radius: 4px;"></div>
            </div>
        </div>`;

        // Weak concepts
        if (recommendations.weakConcepts.length > 0) {
            html += '<div style="margin-bottom: 10px;"><strong>⚠️ Schwache Bereiche:</strong><ul style="margin: 5px 0; padding-left: 20px;">';
            recommendations.weakConcepts.slice(0, 3).forEach(weak => {
                const percent = Math.round(weak.mastery * 100);
                html += `<li style="font-size: 12px;">${weak.concept}: ${percent}%</li>`;
            });
            html += '</ul></div>';
        }

        // Next difficulty
        html += `<div style="margin-bottom: 10px;">
            <strong>📈 Empfohlene Schwierigkeit:</strong> Level ${recommendations.nextDifficulty}/5
        </div>`;

        // Exercises for review
        if (recommendations.reviewExercises.length > 0) {
            html += `<div>
                <strong>🔄 Zu wiederholen:</strong> ${recommendations.reviewExercises.length} Übungen
            </div>`;
        }

        html += '</div>';

        adaptivePanel.innerHTML = html;
    }
}

// ====================================================================
// INITIALIZATION
// ====================================================================

// Initialize app when page loads
window.addEventListener('DOMContentLoaded', () => {
    const app = new App();

    // Make app available globally BEFORE init
    window.app = app;

    app.init();
});

// Also make classes available globally for backwards compatibility
window.ExerciseLoader = ExerciseLoader;
window.ExerciseRenderer = ExerciseRenderer;
window.App = App;
