/**
 * Interactive Timeline View for Spanish Tenses
 * SVG-based visualization with comparison and mini-quiz
 * ASCII-compliant, No-Gamification
 */

class TimelineView {
    constructor() {
        this.tenses = [
            {
                id: 'pluscuamperfecto',
                name: 'Pluscuamperfecto',
                nameDE: 'Vorvergangenheit',
                position: 1,
                color: '#8b4513',
                usage: 'Handlung vor einem Punkt in der Vergangenheit',
                signals: ['ya', 'antes', 'nunca', 'todavia no'],
                example: 'Habia comido cuando llegaste',
                exampleDE: 'Ich hatte gegessen, als du ankamst',
                formation: 'haber (imperfecto) + participio'
            },
            {
                id: 'preterito',
                name: 'Preterito Indefinido',
                nameDE: 'Einfache Vergangenheit',
                position: 2,
                color: '#d62728',
                usage: 'Abgeschlossene Handlung in der Vergangenheit',
                signals: ['ayer', 'anteayer', 'el ano pasado', 'hace...'],
                example: 'Comi ayer',
                exampleDE: 'Ich ass gestern',
                formation: 'Stamm + Endungen (-e, -aste, -o...)'
            },
            {
                id: 'imperfecto',
                name: 'Imperfecto',
                nameDE: 'Unvollendete Vergangenheit',
                position: 3,
                color: '#ff7f0e',
                usage: 'Gewohnheiten, Beschreibungen in der Vergangenheit',
                signals: ['siempre', 'a menudo', 'todos los dias', 'mientras'],
                example: 'Comia todos los dias',
                exampleDE: 'Ich ass jeden Tag',
                formation: 'Stamm + Endungen (-aba/-ia...)'
            },
            {
                id: 'perfecto',
                name: 'Preterito Perfecto',
                nameDE: 'Vollendete Gegenwart',
                position: 4,
                color: '#2ca02c',
                usage: 'Handlung mit Bezug zur Gegenwart',
                signals: ['hoy', 'esta semana', 'este ano', 'ya', 'todavia'],
                example: 'He comido hoy',
                exampleDE: 'Ich habe heute gegessen',
                formation: 'haber (presente) + participio'
            },
            {
                id: 'presente',
                name: 'Presente',
                nameDE: 'Gegenwart',
                position: 5,
                color: '#1f77b4',
                usage: 'Gegenwärtige Handlung, Gewohnheiten, Fakten',
                signals: ['ahora', 'hoy', 'actualmente', 'siempre'],
                example: 'Como ahora',
                exampleDE: 'Ich esse jetzt',
                formation: 'Stamm + Endungen (-o, -as, -a...)'
            },
            {
                id: 'futuro',
                name: 'Futuro Simple',
                nameDE: 'Einfache Zukunft',
                position: 6,
                color: '#9467bd',
                usage: 'Zukünftige Handlung, Vermutung',
                signals: ['manana', 'el proximo ano', 'en el futuro'],
                example: 'Comare manana',
                exampleDE: 'Ich werde morgen essen',
                formation: 'Infinitiv + Endungen (-e, -as, -a...)'
            },
            {
                id: 'condicional',
                name: 'Condicional',
                nameDE: 'Konditional',
                position: 7,
                color: '#e377c2',
                usage: 'Hypothetische Situationen, Höflichkeit',
                signals: ['si...', 'en ese caso', 'probablemente'],
                example: 'Comeria si tuviera hambre',
                exampleDE: 'Ich würde essen, wenn ich Hunger hätte',
                formation: 'Infinitiv + Endungen (-ia, -ias...)'
            }
        ];

        this.selectedTenses = [];
        this.currentComparison = null;
        this.conjugator = null;
    }

    /**
     * Initialize timeline with conjugator
     */
    initialize(conjugator) {
        this.conjugator = conjugator;
    }

    /**
     * Render timeline SVG
     */
    renderTimeline(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container ${containerId} not found`);
        }

        const width = container.clientWidth || 1000;
        const height = 400;
        const margin = { top: 50, right: 50, bottom: 50, left: 50 };
        const innerWidth = width - margin.left - margin.right;

        // Create SVG
        let svg = `
            <svg width="${width}" height="${height}" style="background: #f8f9fa; border-radius: 8px;">
                <!-- Title -->
                <text x="${width / 2}" y="30" text-anchor="middle" 
                      style="font-size: 20px; font-weight: bold; fill: #333;">
                    Spanische Zeiten - Zeitachse
                </text>
                
                <!-- Timeline line -->
                <line x1="${margin.left}" y1="${height / 2}" 
                      x2="${width - margin.right}" y2="${height / 2}" 
                      stroke="#333" stroke-width="3" />
                
                <!-- Arrow -->
                <polygon points="${width - margin.right},${height / 2} 
                                 ${width - margin.right - 10},${height / 2 - 5} 
                                 ${width - margin.right - 10},${height / 2 + 5}"
                         fill="#333" />
                
                <!-- Past label -->
                <text x="${margin.left + 20}" y="${height / 2 - 20}" 
                      style="font-size: 14px; fill: #666;">
                    Vergangenheit
                </text>
                
                <!-- Future label -->
                <text x="${width - margin.right - 80}" y="${height / 2 - 20}" 
                      style="font-size: 14px; fill: #666;">
                    Zukunft
                </text>
                
                <!-- Present marker -->
                <line x1="${width / 2}" y1="${height / 2 - 30}" 
                      x2="${width / 2}" y2="${height / 2 + 30}" 
                      stroke="#1f77b4" stroke-width="2" stroke-dasharray="5,5" />
                <text x="${width / 2}" y="${height / 2 - 35}" text-anchor="middle"
                      style="font-size: 12px; fill: #1f77b4;">
                    JETZT
                </text>
        `;

        // Add tense blocks
        const blockWidth = innerWidth / (this.tenses.length + 1);
        
        this.tenses.forEach((tense, index) => {
            const x = margin.left + (index + 1) * blockWidth - blockWidth / 2;
            const y = height / 2;
            const rectWidth = blockWidth * 0.8;
            const rectHeight = 80;

            svg += `
                <!-- Tense: ${tense.name} -->
                <g class="tense-block" data-tense-id="${tense.id}" 
                   style="cursor: pointer;" 
                   onmouseover="this.querySelector('rect').setAttribute('opacity', '0.8')"
                   onmouseout="this.querySelector('rect').setAttribute('opacity', '1')"
                   onclick="window.timelineView.selectTense('${tense.id}')">
                    
                    <rect x="${x - rectWidth / 2}" y="${y - rectHeight / 2}" 
                          width="${rectWidth}" height="${rectHeight}" 
                          fill="${tense.color}" opacity="1" 
                          rx="8" ry="8" 
                          stroke="#333" stroke-width="2" />
                    
                    <text x="${x}" y="${y - 15}" text-anchor="middle" 
                          style="font-size: 12px; font-weight: bold; fill: white; pointer-events: none;">
                        ${tense.name}
                    </text>
                    
                    <text x="${x}" y="${y + 5}" text-anchor="middle" 
                          style="font-size: 10px; fill: white; pointer-events: none;">
                        ${tense.nameDE}
                    </text>
                    
                    <text x="${x}" y="${y + 20}" text-anchor="middle" 
                          style="font-size: 9px; fill: white; font-style: italic; pointer-events: none;">
                        ${tense.signals[0]}
                    </text>
                </g>
            `;
        });

        svg += '</svg>';
        container.innerHTML = svg;
    }

    /**
     * Select a tense for comparison
     */
    selectTense(tenseId) {
        const tense = this.tenses.find(t => t.id === tenseId);
        if (!tense) return;

        // Add to selection
        if (this.selectedTenses.length < 2) {
            if (!this.selectedTenses.find(t => t.id === tenseId)) {
                this.selectedTenses.push(tense);
                this.highlightTense(tenseId, true);
            }
        }

        // If two selected, show comparison
        if (this.selectedTenses.length === 2) {
            this.showComparison();
        }
    }

    /**
     * Highlight selected tense
     */
    highlightTense(tenseId, highlight) {
        const block = document.querySelector(`[data-tense-id="${tenseId}"]`);
        if (!block) return;

        const rect = block.querySelector('rect');
        if (highlight) {
            rect.setAttribute('stroke', '#ffd700');
            rect.setAttribute('stroke-width', '4');
        } else {
            rect.setAttribute('stroke', '#333');
            rect.setAttribute('stroke-width', '2');
        }
    }

    /**
     * Clear selection
     */
    clearSelection() {
        this.selectedTenses.forEach(tense => {
            this.highlightTense(tense.id, false);
        });
        this.selectedTenses = [];
        this.currentComparison = null;
    }

    /**
     * Show comparison between two tenses
     */
    showComparison() {
        if (this.selectedTenses.length !== 2) return;

        const [tense1, tense2] = this.selectedTenses;
        
        this.currentComparison = {
            tense1: tense1,
            tense2: tense2,
            forms: this.compareForms(tense1, tense2),
            usage: this.compareUsage(tense1, tense2),
            signals: this.compareSignals(tense1, tense2),
            examples: this.compareExamples(tense1, tense2)
        };

        this.renderComparison();
    }

    /**
     * Compare verb forms
     */
    compareForms(tense1, tense2) {
        if (!this.conjugator) {
            return {
                tense1: { formation: tense1.formation },
                tense2: { formation: tense2.formation }
            };
        }

        const verb = 'hablar';
        const persona = 'yo';

        try {
            const form1 = this.conjugator.conjugate(verb, tense1.id, persona);
            const form2 = this.conjugator.conjugate(verb, tense2.id, persona);

            return {
                tense1: {
                    formation: tense1.formation,
                    example: form1
                },
                tense2: {
                    formation: tense2.formation,
                    example: form2
                }
            };
        } catch (error) {
            return {
                tense1: { formation: tense1.formation },
                tense2: { formation: tense2.formation }
            };
        }
    }

    /**
     * Compare usage rules
     */
    compareUsage(tense1, tense2) {
        return {
            tense1: {
                usage: tense1.usage,
                when: this.getUsageContext(tense1)
            },
            tense2: {
                usage: tense2.usage,
                when: this.getUsageContext(tense2)
            }
        };
    }

    /**
     * Get usage context
     */
    getUsageContext(tense) {
        const contexts = {
            'pluscuamperfecto': 'Verwende für Handlungen vor einem Zeitpunkt in der Vergangenheit',
            'preterito': 'Verwende für abgeschlossene, einmalige Handlungen',
            'imperfecto': 'Verwende für Gewohnheiten, Beschreibungen, andauernde Handlungen',
            'perfecto': 'Verwende für Handlungen mit Bezug zur Gegenwart',
            'presente': 'Verwende für gegenwärtige Handlungen, Fakten, Gewohnheiten',
            'futuro': 'Verwende für zukünftige Handlungen, Vermutungen',
            'condicional': 'Verwende für hypothetische Situationen, Höflichkeit'
        };
        return contexts[tense.id] || tense.usage;
    }

    /**
     * Compare signal words
     */
    compareSignals(tense1, tense2) {
        return {
            tense1: tense1.signals,
            tense2: tense2.signals,
            unique1: tense1.signals.filter(s => !tense2.signals.includes(s)),
            unique2: tense2.signals.filter(s => !tense1.signals.includes(s))
        };
    }

    /**
     * Compare examples
     */
    compareExamples(tense1, tense2) {
        return {
            tense1: {
                spanish: tense1.example,
                german: tense1.exampleDE
            },
            tense2: {
                spanish: tense2.example,
                german: tense2.exampleDE
            }
        };
    }

    /**
     * Render comparison view
     */
    renderComparison() {
        const comparisonDiv = document.getElementById('comparison-view');
        if (!comparisonDiv) return;

        comparisonDiv.style.display = 'block';

        const { tense1, tense2, forms, usage, signals, examples } = this.currentComparison;

        let html = `
            <div class="comparison-header">
                <h2>Vergleich: ${tense1.nameDE} vs. ${tense2.nameDE}</h2>
                <button class="btn-clear" onclick="window.timelineView.clearComparison()">
                    Auswahl zurücksetzen
                </button>
            </div>

            <div class="comparison-grid">
                <!-- Column Headers -->
                <div class="comparison-column">
                    <div class="tense-header" style="background: ${tense1.color};">
                        <h3>${tense1.name}</h3>
                        <p>${tense1.nameDE}</p>
                    </div>
                </div>

                <div class="comparison-column">
                    <div class="tense-header" style="background: ${tense2.color};">
                        <h3>${tense2.name}</h3>
                        <p>${tense2.nameDE}</p>
                    </div>
                </div>

                <!-- Formation -->
                <div class="comparison-section">
                    <h4>Bildung</h4>
                </div>
                <div class="comparison-content">
                    <p><strong>Bildung:</strong> ${forms.tense1.formation}</p>
                    ${forms.tense1.example ? `<p><strong>Beispiel:</strong> ${forms.tense1.example}</p>` : ''}
                </div>
                <div class="comparison-content">
                    <p><strong>Bildung:</strong> ${forms.tense2.formation}</p>
                    ${forms.tense2.example ? `<p><strong>Beispiel:</strong> ${forms.tense2.example}</p>` : ''}
                </div>

                <!-- Usage -->
                <div class="comparison-section">
                    <h4>Verwendung</h4>
                </div>
                <div class="comparison-content">
                    <p>${usage.tense1.usage}</p>
                    <p class="usage-when">${usage.tense1.when}</p>
                </div>
                <div class="comparison-content">
                    <p>${usage.tense2.usage}</p>
                    <p class="usage-when">${usage.tense2.when}</p>
                </div>

                <!-- Signal Words -->
                <div class="comparison-section">
                    <h4>Signalwoerter</h4>
                </div>
                <div class="comparison-content">
                    <ul>
                        ${signals.tense1.map(s => `
                            <li${signals.unique1.includes(s) ? ' class="unique"' : ''}>${s}</li>
                        `).join('')}
                    </ul>
                </div>
                <div class="comparison-content">
                    <ul>
                        ${signals.tense2.map(s => `
                            <li${signals.unique2.includes(s) ? ' class="unique"' : ''}>${s}</li>
                        `).join('')}
                    </ul>
                </div>

                <!-- Examples -->
                <div class="comparison-section">
                    <h4>Beispiele</h4>
                </div>
                <div class="comparison-content">
                    <p class="example-es">${examples.tense1.spanish}</p>
                    <p class="example-de">${examples.tense1.german}</p>
                </div>
                <div class="comparison-content">
                    <p class="example-es">${examples.tense2.spanish}</p>
                    <p class="example-de">${examples.tense2.german}</p>
                </div>
            </div>

            <div class="mini-quiz-section">
                <button class="btn-quiz" onclick="window.timelineView.generateMiniQuiz()">
                    Mini-Quiz generieren (5 Aufgaben)
                </button>
            </div>
        `;

        comparisonDiv.innerHTML = html;
    }

    /**
     * Clear comparison
     */
    clearComparison() {
        this.clearSelection();
        const comparisonDiv = document.getElementById('comparison-view');
        if (comparisonDiv) {
            comparisonDiv.style.display = 'none';
            comparisonDiv.innerHTML = '';
        }
    }

    /**
     * Generate mini quiz for comparison
     */
    generateMiniQuiz() {
        if (!this.currentComparison || !this.conjugator) {
            alert('Bitte wählen Sie erst zwei Zeiten aus.');
            return;
        }

        const { tense1, tense2 } = this.currentComparison;
        const exercises = [];

        const verbs = ['hablar', 'comer', 'vivir', 'ser', 'estar'];
        const personas = ['yo', 'tu', 'el', 'nosotros', 'ellos'];

        // Generate 5 exercises
        for (let i = 0; i < 5; i++) {
            const tense = i % 2 === 0 ? tense1 : tense2;
            const verb = verbs[Math.floor(Math.random() * verbs.length)];
            const persona = personas[Math.floor(Math.random() * personas.length)];

            try {
                const answer = this.conjugator.conjugate(verb, tense.id, persona);
                
                exercises.push({
                    id: i + 1,
                    verb: verb,
                    tense: tense.name,
                    tenseDE: tense.nameDE,
                    persona: persona,
                    answer: answer,
                    question: `${verb} (${tense.nameDE}, ${persona})`
                });
            } catch (error) {
                // Skip on error, try again
                i--;
            }
        }

        this.renderMiniQuiz(exercises);
    }

    /**
     * Render mini quiz
     */
    renderMiniQuiz(exercises) {
        const quizDiv = document.getElementById('mini-quiz');
        if (!quizDiv) return;

        quizDiv.style.display = 'block';

        let html = `
            <div class="quiz-header">
                <h3>Mini-Quiz: ${this.currentComparison.tense1.nameDE} vs. ${this.currentComparison.tense2.nameDE}</h3>
                <p>Konjugiere die folgenden Verben in der richtigen Zeit.</p>
            </div>

            <div class="quiz-exercises">
        `;

        exercises.forEach((ex, i) => {
            html += `
                <div class="quiz-item" data-exercise-id="${i}">
                    <div class="quiz-question">
                        <span class="quiz-number">${ex.id}.</span>
                        <span class="quiz-text">${ex.question}</span>
                    </div>
                    <input type="text" 
                           id="quiz-answer-${i}" 
                           class="quiz-input" 
                           placeholder="Deine Antwort..."
                           data-correct="${ex.answer}">
                    <div id="quiz-feedback-${i}" class="quiz-feedback"></div>
                </div>
            `;
        });

        html += `
            </div>

            <div class="quiz-actions">
                <button class="btn-check" onclick="window.timelineView.checkMiniQuiz()">
                    Alle pruefen
                </button>
                <button class="btn-new" onclick="window.timelineView.generateMiniQuiz()">
                    Neues Quiz
                </button>
            </div>

            <div id="quiz-results" class="quiz-results" style="display: none;"></div>
        `;

        quizDiv.innerHTML = html;
        quizDiv.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Check mini quiz answers
     */
    checkMiniQuiz() {
        const inputs = document.querySelectorAll('.quiz-input');
        let correct = 0;
        let total = inputs.length;

        inputs.forEach((input, i) => {
            const userAnswer = input.value.trim().toLowerCase();
            const correctAnswer = input.dataset.correct.toLowerCase();
            const feedbackDiv = document.getElementById(`quiz-feedback-${i}`);

            if (userAnswer === correctAnswer) {
                correct++;
                feedbackDiv.innerHTML = '<span class="correct">? Richtig!</span>';
                input.style.borderColor = '#28a745';
            } else {
                feedbackDiv.innerHTML = `
                    <span class="incorrect">? Falsch</span>
                    <span class="correct-answer">Richtig: ${input.dataset.correct}</span>
                `;
                input.style.borderColor = '#dc3545';
            }
        });

        // Show results
        const resultsDiv = document.getElementById('quiz-results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            const percentage = ((correct / total) * 100).toFixed(0);
            resultsDiv.innerHTML = `
                <h4>Ergebnis</h4>
                <div class="result-stats">
                    <div class="stat-box">
                        <div class="stat-number">${correct}/${total}</div>
                        <div class="stat-label">Richtig</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number">${percentage}%</div>
                        <div class="stat-label">Erfolgsrate</div>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Get all tenses
     */
    getTenses() {
        return this.tenses;
    }

    /**
     * Get tense by ID
     */
    getTense(tenseId) {
        return this.tenses.find(t => t.id === tenseId);
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.TimelineView = TimelineView;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimelineView;
}
