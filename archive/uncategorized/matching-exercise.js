/**
 * Matching Exercise Module
 *
 * Click-based matching (Mobile-friendly)
 * User clicks left item, then right item to create connection
 */

class MatchingExercise {
    constructor(pairs) {
        this.pairs = pairs; // [{left: 'soy', right: 'ich bin', id: 1}, ...]
        this.connections = new Map(); // left id -> right id
        this.selectedLeft = null;
        this.selectedRight = null;
        this.isComplete = false;
    }

    /**
     * Generate matching exercise
     */
    static generate(vocab, count = 5, type = 'verb-conjugation') {
        const pairs = [];

        if (type === 'verb-conjugation') {
            // SER/ESTAR/TENER conjugations
            const verbs = ['ser', 'estar', 'tener'];
            const persons = ['yo', 'tu', 'el'];

            for (let i = 0; i < Math.min(count, 9); i++) {
                const verb = verbs[i % verbs.length];
                const person = persons[Math.floor(i / verbs.length)];
                const verbData = vocab.getVerb(verb, person);

                pairs.push({
                    id: i,
                    left: verbData.conjugated,
                    right: verbData.german,
                    leftLang: 'es',
                    rightLang: 'de'
                });
            }
        } else if (type === 'vocabulary') {
            // Random vocabulary matching
            const items = vocab.getWithEmoji(2).slice(0, count);

            items.forEach((item, i) => {
                pairs.push({
                    id: i,
                    left: item.es,
                    right: item.de,
                    leftLang: 'es',
                    rightLang: 'de',
                    emoji: item.emoji
                });
            });
        } else if (type === 'emoji-word') {
            // Emoji to Spanish word
            const items = vocab.getWithEmoji(2).slice(0, count);

            items.forEach((item, i) => {
                pairs.push({
                    id: i,
                    left: item.emoji,
                    right: item.es,
                    leftLang: 'emoji',
                    rightLang: 'es'
                });
            });
        }

        // Shuffle right side
        const rightItems = pairs.map(p => ({ id: p.id, right: p.right }));
        for (let i = rightItems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [rightItems[i], rightItems[j]] = [rightItems[j], rightItems[i]];
        }

        return new MatchingExercise(pairs.map((p, i) => ({
            ...p,
            rightShuffled: rightItems[i].right,
            rightId: rightItems[i].id
        })));
    }

    /**
     * Handle click on left item
     */
    selectLeft(itemId) {
        this.selectedLeft = itemId;
        this.selectedRight = null;
    }

    /**
     * Handle click on right item
     */
    selectRight(itemId) {
        if (this.selectedLeft === null) {
            // Must select left first
            return { error: 'Select left item first' };
        }

        this.selectedRight = itemId;

        // Create connection
        this.connections.set(this.selectedLeft, this.selectedRight);

        // Reset selection
        const leftId = this.selectedLeft;
        const rightId = this.selectedRight;
        this.selectedLeft = null;
        this.selectedRight = null;

        // Check if complete
        if (this.connections.size === this.pairs.length) {
            this.isComplete = true;
        }

        return {
            connected: true,
            leftId,
            rightId,
            isComplete: this.isComplete
        };
    }

    /**
     * Remove a connection
     */
    removeConnection(leftId) {
        this.connections.delete(leftId);
        this.isComplete = false;
    }

    /**
     * Validate all connections
     */
    validate() {
        let correct = 0;
        let wrong = 0;
        const results = [];

        for (const [leftId, rightId] of this.connections.entries()) {
            const isCorrect = leftId === rightId;
            if (isCorrect) {
                correct++;
            } else {
                wrong++;
            }

            results.push({
                leftId,
                rightId,
                isCorrect
            });
        }

        return {
            correct,
            wrong,
            total: this.pairs.length,
            accuracy: correct / this.pairs.length,
            results
        };
    }

    /**
     * Get current state
     */
    getState() {
        return {
            pairs: this.pairs,
            connections: Array.from(this.connections.entries()).map(([left, right]) => ({ left, right })),
            selectedLeft: this.selectedLeft,
            selectedRight: this.selectedRight,
            isComplete: this.isComplete
        };
    }
}

/**
 * Matching Exercise Renderer
 */
class MatchingExerciseRenderer {
    constructor(container, matchingExercise) {
        this.container = container;
        this.matching = matchingExercise;
        this.onComplete = null;
    }

    /**
     * Render the matching exercise
     */
    render() {
        const state = this.matching.getState();

        const html = `
            <div class="matching-exercise">
                <div class="matching-instructions">
                    <p>Verbinde die passenden Begriffe:</p>
                    <p class="matching-hint">1. Klicke links, 2. Klicke rechts</p>
                </div>

                <div class="matching-container">
                    <div class="matching-column matching-left">
                        ${state.pairs.map(pair => this.renderLeftItem(pair, state)).join('')}
                    </div>

                    <div class="matching-connections">
                        ${this.renderConnections(state)}
                    </div>

                    <div class="matching-column matching-right">
                        ${state.pairs.map((pair, i) => this.renderRightItem(pair, i, state)).join('')}
                    </div>
                </div>

                <div class="matching-actions">
                    <button class="matching-clear" id="matching-clear">
                        🔄 Neu starten
                    </button>
                    <button class="matching-submit" id="matching-submit" ${state.isComplete ? '' : 'disabled'}>
                        ✓ Prüfen
                    </button>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
        this.attachEventListeners();
    }

    /**
     * Render left item
     */
    renderLeftItem(pair, state) {
        const isSelected = state.selectedLeft === pair.id;
        const isConnected = state.connections.some(c => c.left === pair.id);
        const classes = [
            'matching-item',
            'matching-item-left',
            isSelected ? 'selected' : '',
            isConnected ? 'connected' : ''
        ].filter(Boolean).join(' ');

        return `
            <div class="${classes}" data-id="${pair.id}" data-side="left">
                <div class="matching-item-content">
                    ${pair.emoji ? `<span class="matching-emoji">${pair.emoji}</span>` : ''}
                    <span class="matching-text">${pair.left}</span>
                </div>
            </div>
        `;
    }

    /**
     * Render right item
     */
    renderRightItem(pair, index, state) {
        const actualPair = state.pairs.find(p => p.rightId === pair.id);
        const rightText = pair.rightShuffled;
        const isSelected = state.selectedRight === pair.id;
        const isConnected = state.connections.some(c => c.right === pair.id);
        const classes = [
            'matching-item',
            'matching-item-right',
            isSelected ? 'selected' : '',
            isConnected ? 'connected' : ''
        ].filter(Boolean).join(' ');

        return `
            <div class="${classes}" data-id="${pair.rightId}" data-side="right">
                <div class="matching-item-content">
                    <span class="matching-text">${rightText}</span>
                </div>
            </div>
        `;
    }

    /**
     * Render connections (visual lines)
     */
    renderConnections(state) {
        // Simple implementation: just show count
        return `
            <div class="connection-info">
                <p>${state.connections.length}/${state.pairs.length}</p>
            </div>
        `;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Left items
        this.container.querySelectorAll('.matching-item-left').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                this.matching.selectLeft(id);
                this.render();
            });
        });

        // Right items
        this.container.querySelectorAll('.matching-item-right').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                const result = this.matching.selectRight(id);

                if (result.connected) {
                    this.render();

                    if (result.isComplete && this.onComplete) {
                        setTimeout(() => {
                            this.onComplete();
                        }, 300);
                    }
                }
            });
        });

        // Clear button
        const clearBtn = this.container.querySelector('#matching-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.matching.connections.clear();
                this.matching.selectedLeft = null;
                this.matching.selectedRight = null;
                this.matching.isComplete = false;
                this.render();
            });
        }

        // Submit button
        const submitBtn = this.container.querySelector('#matching-submit');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const results = this.matching.validate();
                this.showResults(results);
            });
        }
    }

    /**
     * Show validation results
     */
    showResults(results) {
        const state = this.matching.getState();

        // Mark correct/incorrect
        this.container.querySelectorAll('.matching-item-left').forEach(item => {
            const id = parseInt(item.dataset.id);
            const result = results.results.find(r => r.leftId === id);

            if (result) {
                item.classList.remove('connected');
                item.classList.add(result.isCorrect ? 'correct' : 'incorrect');
            }
        });

        // Show feedback
        const accuracy = Math.round(results.accuracy * 100);
        const emoji = accuracy >= 90 ? '🎉' : accuracy >= 70 ? '👍' : '💪';

        const feedbackHtml = `
            <div class="matching-feedback">
                <div class="feedback-score">${emoji}</div>
                <h3>${results.correct}/${results.total} richtig (${accuracy}%)</h3>
                <p>${accuracy >= 80 ? '¡Muy bien!' : 'Weiter üben!'}</p>
            </div>
        `;

        const existingFeedback = this.container.querySelector('.matching-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        const actionsDiv = this.container.querySelector('.matching-actions');
        actionsDiv.insertAdjacentHTML('beforebegin', feedbackHtml);
    }
}

// Export
if (typeof window !== 'undefined') {
    window.MatchingExercise = MatchingExercise;
    window.MatchingExerciseRenderer = MatchingExerciseRenderer;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MatchingExercise, MatchingExerciseRenderer };
}
