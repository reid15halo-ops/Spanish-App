/**
 * Session Summary System
 *
 * Provides end-of-session statistics and summary:
 * - Session stats (total, correct, incorrect, accuracy)
 * - SRS updates (promotions, demotions, mastered)
 * - Category breakdown
 * - Time tracking
 * - Motivational messages
 * - Action buttons (New Session, Review Mistakes, Done)
 */

class SessionSummarySystem {
    constructor() {
        this.initialized = false;
        this.currentSession = null;
        this.sessionStats = this.createEmptyStats();
    }

    /**
     * Initialize the session summary system
     */
    initialize() {
        if (this.initialized) return;

        // Inject styles
        this.injectStyles();

        // Create summary modal
        this.createSummaryModal();

        this.initialized = true;

        window.Logger?.debug('[SessionSummarySystem] Initialized');
    }

    /**
     * Create empty stats object
     */
    createEmptyStats() {
        return {
            total: 0,
            correct: 0,
            incorrect: 0,
            skipped: 0,
            accuracy: 0,
            startTime: null,
            endTime: null,
            duration: 0,
            srsPromotions: 0,
            srsDemotions: 0,
            masteredItems: 0,
            categories: {},
            exerciseTypes: {}
        };
    }

    /**
     * Start a new session
     */
    startSession() {
        this.sessionStats = this.createEmptyStats();
        this.sessionStats.startTime = Date.now();

        window.Logger?.info('[SessionSummarySystem] Session started');
    }

    /**
     * Record an answer
     */
    recordAnswer(isCorrect, item, srsChange = null) {
        this.sessionStats.total++;

        if (isCorrect) {
            this.sessionStats.correct++;
        } else {
            this.sessionStats.incorrect++;
        }

        // Calculate accuracy
        this.sessionStats.accuracy = Math.round(
            (this.sessionStats.correct / this.sessionStats.total) * 100
        );

        // SRS updates
        if (srsChange === 'promoted') {
            this.sessionStats.srsPromotions++;
        } else if (srsChange === 'demoted') {
            this.sessionStats.srsDemotions++;
        }

        // Check if mastered
        if (item && item.srsBox === 5) {
            this.sessionStats.masteredItems++;
        }

        // Category tracking
        if (item && item.category) {
            if (!this.sessionStats.categories[item.category]) {
                this.sessionStats.categories[item.category] = {
                    total: 0,
                    correct: 0
                };
            }
            this.sessionStats.categories[item.category].total++;
            if (isCorrect) {
                this.sessionStats.categories[item.category].correct++;
            }
        }

        // Exercise type tracking
        if (item && item.type) {
            if (!this.sessionStats.exerciseTypes[item.type]) {
                this.sessionStats.exerciseTypes[item.type] = {
                    total: 0,
                    correct: 0
                };
            }
            this.sessionStats.exerciseTypes[item.type].total++;
            if (isCorrect) {
                this.sessionStats.exerciseTypes[item.type].correct++;
            }
        }
    }

    /**
     * End session and show summary
     */
    endSession() {
        this.sessionStats.endTime = Date.now();
        this.sessionStats.duration = this.sessionStats.endTime - this.sessionStats.startTime;

        // Show summary
        this.showSummary();

        window.Logger?.info('[SessionSummarySystem] Session ended', this.sessionStats);
    }

    /**
     * Inject summary styles
     */
    injectStyles() {
        if (document.getElementById('session-summary-styles')) return;

        const style = document.createElement('style');
        style.id = 'session-summary-styles';
        style.textContent = `
            /* Session Summary Modal */
            .session-summary-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10005;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }

            .session-summary-modal.show {
                opacity: 1;
                pointer-events: all;
            }

            .summary-content {
                background: var(--bg, #FFFFFF);
                border-radius: 12px;
                max-width: 700px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                padding: 40px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            }

            .session-summary-modal.show .summary-content {
                transform: scale(1);
            }

            .summary-header {
                text-align: center;
                margin-bottom: 35px;
            }

            .summary-icon {
                font-size: 80px;
                margin-bottom: 15px;
                display: block;
                animation: celebrationBounce 0.6s ease;
            }

            @keyframes celebrationBounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }

            .summary-title {
                font-size: 32px;
                font-weight: 700;
                color: var(--primary, #20B2AA);
                margin: 0 0 10px 0;
            }

            .summary-subtitle {
                font-size: 16px;
                color: var(--text-muted, #666666);
                margin: 0;
            }

            /* Stats Grid */
            .summary-stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                gap: 15px;
                margin-bottom: 30px;
            }

            .stat-card {
                background: var(--bg-secondary, #F5F5F5);
                border-radius: 10px;
                padding: 20px;
                text-align: center;
                border: 2px solid transparent;
                transition: all 0.2s ease;
            }

            .stat-card:hover {
                border-color: var(--primary, #20B2AA);
                transform: translateY(-3px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .stat-card.highlight-success {
                background: rgba(46, 125, 50, 0.1);
                border-color: var(--success, #2E7D32);
            }

            .stat-card.highlight-error {
                background: rgba(198, 40, 40, 0.1);
                border-color: var(--error, #C62828);
            }

            .stat-card.highlight-primary {
                background: rgba(32, 178, 170, 0.1);
                border-color: var(--primary, #20B2AA);
            }

            .stat-value {
                font-size: 36px;
                font-weight: 700;
                color: var(--text, #1A1A1A);
                margin-bottom: 8px;
                line-height: 1;
            }

            .stat-card.highlight-success .stat-value {
                color: var(--success, #2E7D32);
            }

            .stat-card.highlight-error .stat-value {
                color: var(--error, #C62828);
            }

            .stat-card.highlight-primary .stat-value {
                color: var(--primary, #20B2AA);
            }

            .stat-label {
                font-size: 12px;
                color: var(--text-muted, #666666);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-weight: 600;
            }

            /* Sections */
            .summary-section {
                margin-bottom: 25px;
                padding: 20px;
                background: var(--bg-secondary, #F5F5F5);
                border-radius: 10px;
            }

            .summary-section-title {
                font-size: 18px;
                font-weight: 700;
                color: var(--primary, #20B2AA);
                margin: 0 0 15px 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .summary-section-icon {
                font-size: 22px;
            }

            .summary-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .summary-list-item {
                padding: 10px 15px;
                margin-bottom: 8px;
                background: var(--bg, #FFFFFF);
                border-radius: 6px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
            }

            .summary-list-item .icon {
                font-size: 18px;
            }

            /* Category Bars */
            .category-breakdown {
                margin-top: 15px;
            }

            .category-item {
                margin-bottom: 15px;
            }

            .category-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }

            .category-name {
                font-weight: 600;
                font-size: 14px;
                color: var(--text, #1A1A1A);
            }

            .category-stats {
                font-size: 13px;
                color: var(--text-muted, #666666);
            }

            .category-progress {
                width: 100%;
                height: 8px;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 4px;
                overflow: hidden;
            }

            .category-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--primary, #20B2AA), var(--primary-hover, #1A9993));
                border-radius: 4px;
                transition: width 0.5s ease;
            }

            /* Motivational Message */
            .motivational-message {
                text-align: center;
                padding: 20px;
                background: linear-gradient(135deg, #E8F5E9 0%, #E3F2FD 100%);
                border-radius: 10px;
                margin-bottom: 25px;
                border-left: 4px solid var(--success, #2E7D32);
            }

            .motivational-message p {
                font-size: 16px;
                font-weight: 600;
                color: var(--text, #1A1A1A);
                margin: 0;
            }

            .motivational-message .emoji {
                font-size: 24px;
                margin-right: 10px;
            }

            /* Actions */
            .summary-actions {
                display: flex;
                gap: 12px;
                margin-top: 30px;
            }

            .summary-actions button {
                flex: 1;
                padding: 15px 20px;
                font-size: 16px;
                font-weight: 600;
                border-radius: 8px;
                border: none;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .btn-new-session {
                background: var(--primary, #20B2AA);
                color: white;
            }

            .btn-new-session:hover {
                background: var(--primary-hover, #1A9993);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(32, 178, 170, 0.3);
            }

            .btn-done {
                background: var(--bg-secondary, #F5F5F5);
                color: var(--text, #1A1A1A);
                border: 2px solid var(--border, #E0E0E0);
            }

            .btn-done:hover {
                border-color: var(--primary, #20B2AA);
            }

            /* Responsive */
            @media (max-width: 768px) {
                .summary-content {
                    padding: 25px 20px;
                }

                .summary-icon {
                    font-size: 60px;
                }

                .summary-title {
                    font-size: 26px;
                }

                .summary-stats-grid {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }

                .stat-card {
                    padding: 15px;
                }

                .stat-value {
                    font-size: 28px;
                }

                .summary-actions {
                    flex-direction: column;
                }

                .summary-actions button {
                    width: 100%;
                }
            }

            /* Respect reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .session-summary-modal,
                .summary-content,
                .stat-card,
                .summary-icon {
                    animation: none !important;
                    transition: none !important;
                }

                .stat-card:hover,
                .btn-new-session:hover {
                    transform: none;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * Create summary modal DOM
     */
    createSummaryModal() {
        const modal = document.createElement('div');
        modal.id = 'session-summary-modal';
        modal.className = 'session-summary-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'summary-title');

        modal.innerHTML = `
            <div class="summary-content">
                <div id="summary-container"></div>
            </div>
        `;

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(modal);
            });
        } else {
            document.body.appendChild(modal);
        }
    }

    /**
     * Show summary modal with stats
     */
    showSummary() {
        const modal = document.getElementById('session-summary-modal');
        const container = document.getElementById('summary-container');

        if (!modal || !container) return;

        // Generate summary HTML
        container.innerHTML = this.generateSummaryHTML();

        // Show modal
        modal.classList.add('show');

        // Attach event listeners
        this.attachSummaryEventListeners();

        // Focus first button
        setTimeout(() => {
            const firstBtn = document.getElementById('new-session-btn');
            if (firstBtn) firstBtn.focus();
        }, 100);
    }

    /**
     * Generate summary HTML
     */
    generateSummaryHTML() {
        const stats = this.sessionStats;
        const message = this.getMotivationalMessage(stats.accuracy);
        const duration = this.formatDuration(stats.duration);

        let html = `
            <div class="summary-header">
                <span class="summary-icon" aria-hidden="true">${this.getPerformanceEmoji(stats.accuracy)}</span>
                <h2 class="summary-title" id="summary-title">Session beendet!</h2>
                <p class="summary-subtitle">
                    ${stats.total} Übungen in ${duration}
                </p>
            </div>

            <div class="summary-stats-grid">
                <div class="stat-card highlight-primary">
                    <div class="stat-value">${stats.total}</div>
                    <div class="stat-label">Übungen</div>
                </div>
                <div class="stat-card highlight-success">
                    <div class="stat-value">${stats.correct}</div>
                    <div class="stat-label">Richtig</div>
                </div>
                <div class="stat-card highlight-error">
                    <div class="stat-value">${stats.incorrect}</div>
                    <div class="stat-label">Falsch</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.accuracy}%</div>
                    <div class="stat-label">Genauigkeit</div>
                </div>
            </div>

            <div class="motivational-message">
                <p>
                    <span class="emoji" aria-hidden="true">${message.emoji}</span>
                    ${message.text}
                </p>
            </div>
        `;

        // SRS Updates section
        if (stats.srsPromotions > 0 || stats.srsDemotions > 0 || stats.masteredItems > 0) {
            html += `
                <div class="summary-section">
                    <h3 class="summary-section-title">
                        <span class="summary-section-icon" aria-hidden="true">🧠</span>
                        SRS-Updates
                    </h3>
                    <ul class="summary-list">
                        ${stats.srsPromotions > 0 ? `
                            <li class="summary-list-item">
                                <span class="icon">📈</span>
                                <span>${stats.srsPromotions} ${stats.srsPromotions === 1 ? 'Vokabel' : 'Vokabeln'} aufgestiegen</span>
                            </li>
                        ` : ''}
                        ${stats.srsDemotions > 0 ? `
                            <li class="summary-list-item">
                                <span class="icon">📉</span>
                                <span>${stats.srsDemotions} ${stats.srsDemotions === 1 ? 'Vokabel' : 'Vokabeln'} abgestiegen</span>
                            </li>
                        ` : ''}
                        ${stats.masteredItems > 0 ? `
                            <li class="summary-list-item">
                                <span class="icon">🎯</span>
                                <span>${stats.masteredItems} ${stats.masteredItems === 1 ? 'Vokabel' : 'Vokabeln'} gemeistert (Box 5)</span>
                            </li>
                        ` : ''}
                    </ul>
                </div>
            `;
        }

        // Category breakdown
        if (Object.keys(stats.categories).length > 0) {
            html += `
                <div class="summary-section">
                    <h3 class="summary-section-title">
                        <span class="summary-section-icon" aria-hidden="true">📊</span>
                        Kategorien
                    </h3>
                    <div class="category-breakdown">
            `;

            for (const [category, data] of Object.entries(stats.categories)) {
                const percentage = Math.round((data.correct / data.total) * 100);
                html += `
                    <div class="category-item">
                        <div class="category-header">
                            <span class="category-name">${category}</span>
                            <span class="category-stats">${data.correct}/${data.total} (${percentage}%)</span>
                        </div>
                        <div class="category-progress">
                            <div class="category-progress-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
            }

            html += `
                    </div>
                </div>
            `;
        }

        // Actions
        html += `
            <div class="summary-actions">
                <button class="btn-new-session" id="new-session-btn" aria-label="Neue Lernsession starten">
                    🚀 Neue Session
                </button>
                <button class="btn-done" id="done-btn" aria-label="Zusammenfassung schließen">
                    ✓ Fertig
                </button>
            </div>
        `;

        return html;
    }

    /**
     * Get motivational message based on accuracy
     */
    getMotivationalMessage(accuracy) {
        if (accuracy === 100) {
            return {
                emoji: '🎉',
                text: 'Perfekt! Du hast alle Übungen richtig gelöst!'
            };
        } else if (accuracy >= 90) {
            return {
                emoji: '🌟',
                text: 'Ausgezeichnet! Du machst großartige Fortschritte!'
            };
        } else if (accuracy >= 75) {
            return {
                emoji: '👍',
                text: 'Sehr gut! Du bist auf dem richtigen Weg!'
            };
        } else if (accuracy >= 60) {
            return {
                emoji: '💪',
                text: 'Gut gemacht! Weiter so!'
            };
        } else if (accuracy >= 40) {
            return {
                emoji: '📚',
                text: 'Nicht aufgeben! Übung macht den Meister!'
            };
        } else {
            return {
                emoji: '🌱',
                text: 'Jeder fängt mal klein an. Du schaffst das!'
            };
        }
    }

    /**
     * Get performance emoji based on accuracy
     */
    getPerformanceEmoji(accuracy) {
        if (accuracy === 100) return '🏆';
        if (accuracy >= 90) return '🌟';
        if (accuracy >= 75) return '🎯';
        if (accuracy >= 60) return '👍';
        return '📚';
    }

    /**
     * Format duration in ms to readable string
     */
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    /**
     * Attach event listeners to summary buttons
     */
    attachSummaryEventListeners() {
        const newSessionBtn = document.getElementById('new-session-btn');
        const doneBtn = document.getElementById('done-btn');
        const modal = document.getElementById('session-summary-modal');

        if (newSessionBtn) {
            newSessionBtn.addEventListener('click', () => {
                this.hideSummary();
                // Trigger new session (app-specific)
                if (window.App && window.App.startNewSession) {
                    window.App.startNewSession();
                }
            });
        }

        if (doneBtn) {
            doneBtn.addEventListener('click', () => {
                this.hideSummary();
            });
        }

        // ESC to close
        const escHandler = (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                this.hideSummary();
            }
        };
        document.addEventListener('keydown', escHandler);

        // Store for cleanup
        this._escHandler = escHandler;
    }

    /**
     * Hide summary modal
     */
    hideSummary() {
        const modal = document.getElementById('session-summary-modal');
        if (!modal) return;

        modal.classList.remove('show');

        // Cleanup
        if (this._escHandler) {
            document.removeEventListener('keydown', this._escHandler);
            this._escHandler = null;
        }
    }

    /**
     * Get current session stats
     */
    getStats() {
        return { ...this.sessionStats };
    }
}

// Create global instance
window.SessionSummarySystem = new SessionSummarySystem();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SessionSummarySystem };
}
