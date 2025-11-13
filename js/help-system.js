/**
 * Help System
 *
 * Provides comprehensive help and documentation:
 * - Help button in header
 * - Help modal with sections
 * - Keyboard shortcuts reference
 * - Exercise types explanation
 * - SRS system explanation
 */

class HelpSystem {
    constructor() {
        this.initialized = false;
        this.helpModal = null;
        this.helpButton = null;
    }

    /**
     * Initialize the help system
     */
    initialize() {
        if (this.initialized) return;

        // Inject styles
        this.injectStyles();

        // Create help button
        this.createHelpButton();

        // Create help modal
        this.createHelpModal();

        // Register keyboard shortcut
        this.registerKeyboardShortcut();

        this.initialized = true;

        window.Logger?.debug('[HelpSystem] Initialized');
    }

    /**
     * Inject help system styles
     */
    injectStyles() {
        if (document.getElementById('help-system-styles')) return;

        const style = document.createElement('style');
        style.id = 'help-system-styles';
        style.textContent = `
            /* Help Button */
            .help-button {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: var(--primary, #20B2AA);
                color: white;
                border: none;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(32, 178, 170, 0.3);
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .help-button:hover {
                background: var(--primary-hover, #1A9993);
                transform: scale(1.1);
                box-shadow: 0 6px 16px rgba(32, 178, 170, 0.4);
            }

            .help-button:active {
                transform: scale(0.95);
            }

            /* Help Modal */
            .help-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }

            .help-modal.show {
                opacity: 1;
                pointer-events: all;
            }

            .help-content {
                background: var(--bg, #FFFFFF);
                border-radius: var(--radius, 8px);
                max-width: 800px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                padding: 40px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            }

            .help-modal.show .help-content {
                transform: scale(1);
            }

            .help-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 3px solid var(--primary, #20B2AA);
            }

            .help-title-group {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .help-icon {
                font-size: 48px;
            }

            .help-title {
                font-size: 28px;
                font-weight: 700;
                color: var(--primary, #20B2AA);
                margin: 0;
            }

            .help-close-btn {
                background: var(--bg-secondary, #F5F5F5);
                border: 2px solid var(--border, #E0E0E0);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                font-size: 24px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-muted, #666666);
                transition: all 0.2s ease;
            }

            .help-close-btn:hover {
                background: var(--error, #C62828);
                color: white;
                border-color: var(--error, #C62828);
            }

            .help-section {
                margin-bottom: 35px;
            }

            .help-section-title {
                font-size: 22px;
                font-weight: 700;
                color: var(--primary, #20B2AA);
                margin: 0 0 15px 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .help-section-icon {
                font-size: 24px;
            }

            .help-section-content {
                font-size: 15px;
                line-height: 1.6;
                color: var(--text, #1A1A1A);
            }

            .help-list {
                list-style: none;
                padding: 0;
                margin: 15px 0;
            }

            .help-list-item {
                padding: 12px 15px;
                margin-bottom: 10px;
                background: var(--bg-secondary, #F5F5F5);
                border-radius: var(--radius, 8px);
                border-left: 4px solid var(--primary, #20B2AA);
            }

            .help-list-item strong {
                color: var(--primary, #20B2AA);
                font-weight: 600;
            }

            .shortcuts-table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
            }

            .shortcuts-table th,
            .shortcuts-table td {
                padding: 12px 15px;
                text-align: left;
                border-bottom: 1px solid var(--border, #E0E0E0);
            }

            .shortcuts-table th {
                background: var(--bg-secondary, #F5F5F5);
                font-weight: 600;
                color: var(--primary, #20B2AA);
            }

            .shortcuts-table tbody tr:hover {
                background: var(--bg-secondary, #F5F5F5);
            }

            .shortcuts-table kbd {
                display: inline-block;
                padding: 4px 10px;
                background: var(--text, #1A1A1A);
                color: white;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                font-size: 13px;
                font-weight: 600;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            .srs-box-example {
                display: flex;
                gap: 10px;
                margin: 15px 0;
                flex-wrap: wrap;
            }

            .srs-box {
                flex: 1;
                min-width: 100px;
                padding: 12px;
                background: var(--bg-secondary, #F5F5F5);
                border-radius: var(--radius, 8px);
                text-align: center;
                border: 2px solid var(--border, #E0E0E0);
            }

            .srs-box-number {
                font-size: 24px;
                font-weight: 700;
                color: var(--primary, #20B2AA);
                margin-bottom: 5px;
            }

            .srs-box-label {
                font-size: 11px;
                color: var(--text-muted, #666666);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .help-tip {
                background: #E3F2FD;
                border-left: 4px solid #2196F3;
                padding: 15px 20px;
                border-radius: var(--radius, 8px);
                margin: 20px 0;
            }

            .help-tip-icon {
                font-size: 20px;
                margin-right: 10px;
            }

            .help-tip-text {
                font-size: 14px;
                color: #1565C0;
                margin: 0;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .help-button {
                    top: 15px;
                    right: 15px;
                    width: 44px;
                    height: 44px;
                    font-size: 20px;
                }

                .help-content {
                    padding: 25px 20px;
                }

                .help-title {
                    font-size: 22px;
                }

                .help-section-title {
                    font-size: 18px;
                }

                .srs-box-example {
                    flex-direction: column;
                }

                .srs-box {
                    min-width: auto;
                }

                .shortcuts-table {
                    font-size: 14px;
                }

                .shortcuts-table th,
                .shortcuts-table td {
                    padding: 10px 12px;
                }
            }

            /* Respect reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .help-modal,
                .help-content,
                .help-button {
                    animation: none !important;
                    transition: none !important;
                }

                .help-button:hover {
                    transform: none;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * Create help button
     */
    createHelpButton() {
        // Check if already exists
        if (document.getElementById('help-button')) return;

        this.helpButton = document.createElement('button');
        this.helpButton.id = 'help-button';
        this.helpButton.className = 'help-button';
        this.helpButton.setAttribute('aria-label', 'Hilfe öffnen (Taste: ?)');
        this.helpButton.setAttribute('title', 'Hilfe & Tastaturkürzel (?)');
        this.helpButton.innerHTML = '?';

        this.helpButton.addEventListener('click', () => {
            this.showHelp();
        });

        // Add to DOM when ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(this.helpButton);
            });
        } else {
            document.body.appendChild(this.helpButton);
        }
    }

    /**
     * Create help modal
     */
    createHelpModal() {
        // Check if already exists
        if (document.getElementById('help-modal')) return;

        this.helpModal = document.createElement('div');
        this.helpModal.id = 'help-modal';
        this.helpModal.className = 'help-modal';
        this.helpModal.setAttribute('role', 'dialog');
        this.helpModal.setAttribute('aria-modal', 'true');
        this.helpModal.setAttribute('aria-labelledby', 'help-title');

        this.helpModal.innerHTML = `
            <div class="help-content">
                <div class="help-header">
                    <div class="help-title-group">
                        <span class="help-icon" aria-hidden="true">📖</span>
                        <h2 class="help-title" id="help-title">Hilfe & Tastaturkürzel</h2>
                    </div>
                    <button class="help-close-btn" id="help-close-btn" aria-label="Hilfe schließen">
                        ×
                    </button>
                </div>

                <section class="help-section">
                    <h3 class="help-section-title">
                        <span class="help-section-icon" aria-hidden="true">📚</span>
                        Übungstypen
                    </h3>
                    <div class="help-section-content">
                        <ul class="help-list">
                            <li class="help-list-item">
                                <strong>Multiple Choice:</strong> Wähle die richtige Übersetzung aus mehreren Optionen.
                                Ideal zum Einstieg in neue Vokabeln.
                            </li>
                            <li class="help-list-item">
                                <strong>Eingabe:</strong> Gib die Übersetzung selbst ein.
                                Trainiert aktives Erinnern und Schreibweise.
                            </li>
                            <li class="help-list-item">
                                <strong>Lückentext:</strong> Ergänze fehlende Wörter in spanischen Sätzen.
                                Übt Grammatik und Kontext-Verständnis.
                            </li>
                            <li class="help-list-item">
                                <strong>Konjugation:</strong> Konjugiere Verben in verschiedenen Personen und Zeiten.
                                Perfekt für Verb-Training.
                            </li>
                        </ul>
                    </div>
                </section>

                <section class="help-section">
                    <h3 class="help-section-title">
                        <span class="help-section-icon" aria-hidden="true">🧠</span>
                        SRS-System (Spaced Repetition)
                    </h3>
                    <div class="help-section-content">
                        <p>
                            Das <strong>Spaced Repetition System</strong> hilft dir, Vokabeln optimal zu wiederholen.
                            Jede Vokabel durchläuft 5 Boxen:
                        </p>
                        <div class="srs-box-example">
                            <div class="srs-box">
                                <div class="srs-box-number">Box 1</div>
                                <div class="srs-box-label">Täglich</div>
                            </div>
                            <div class="srs-box">
                                <div class="srs-box-number">Box 2</div>
                                <div class="srs-box-label">3 Tage</div>
                            </div>
                            <div class="srs-box">
                                <div class="srs-box-number">Box 3</div>
                                <div class="srs-box-label">7 Tage</div>
                            </div>
                            <div class="srs-box">
                                <div class="srs-box-number">Box 4</div>
                                <div class="srs-box-label">14 Tage</div>
                            </div>
                            <div class="srs-box">
                                <div class="srs-box-number">Box 5</div>
                                <div class="srs-box-label">30 Tage</div>
                            </div>
                        </div>
                        <ul class="help-list">
                            <li class="help-list-item">
                                <strong>Richtige Antwort:</strong> Vokabel steigt eine Box höher → seltener wiederholen
                            </li>
                            <li class="help-list-item">
                                <strong>Falsche Antwort:</strong> Vokabel zurück zu Box 1 → öfter üben
                            </li>
                            <li class="help-list-item">
                                <strong>Box 5 = Gemeistert:</strong> Du hast die Vokabel langfristig gelernt! 🎉
                            </li>
                        </ul>
                    </div>
                </section>

                <section class="help-section">
                    <h3 class="help-section-title">
                        <span class="help-section-icon" aria-hidden="true">⌨️</span>
                        Tastaturkürzel
                    </h3>
                    <div class="help-section-content">
                        <table class="shortcuts-table">
                            <thead>
                                <tr>
                                    <th>Taste</th>
                                    <th>Aktion</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><kbd>Enter</kbd></td>
                                    <td>Antwort prüfen / Weiter zur nächsten Übung</td>
                                </tr>
                                <tr>
                                    <td><kbd>?</kbd></td>
                                    <td>Hilfe öffnen/schließen</td>
                                </tr>
                                <tr>
                                    <td><kbd>Esc</kbd></td>
                                    <td>Modal/Dialog schließen</td>
                                </tr>
                                <tr>
                                    <td><kbd>Tab</kbd></td>
                                    <td>Zwischen Elementen navigieren</td>
                                </tr>
                                <tr>
                                    <td><kbd>1</kbd> - <kbd>4</kbd></td>
                                    <td>Multiple-Choice Antwort wählen (wenn verfügbar)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <div class="help-tip">
                    <span class="help-tip-icon" aria-hidden="true">💡</span>
                    <strong>Tipp:</strong>
                    <p class="help-tip-text">
                        Lerne regelmäßig 10-15 Minuten pro Tag statt einmal pro Woche mehrere Stunden.
                        Spaced Repetition funktioniert am besten mit konstanter Wiederholung!
                    </p>
                </div>
            </div>
        `;

        // Add to DOM when ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(this.helpModal);
                this.attachHelpEventListeners();
            });
        } else {
            document.body.appendChild(this.helpModal);
            this.attachHelpEventListeners();
        }
    }

    /**
     * Attach event listeners to help modal
     */
    attachHelpEventListeners() {
        const modal = this.helpModal || document.getElementById('help-modal');
        if (!modal) return;

        const closeBtn = document.getElementById('help-close-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideHelp();
            });
        }

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                this.hideHelp();
            }
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideHelp();
            }
        });
    }

    /**
     * Register keyboard shortcut (?)
     */
    registerKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            // Ignore if in input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // Open help on '?' key
            if (e.key === '?' || e.key === '/') {
                e.preventDefault();
                this.toggleHelp();
            }
        });
    }

    /**
     * Show help modal
     */
    showHelp() {
        const modal = this.helpModal || document.getElementById('help-modal');
        if (!modal) return;

        modal.classList.add('show');

        // Focus close button
        setTimeout(() => {
            const closeBtn = document.getElementById('help-close-btn');
            if (closeBtn) closeBtn.focus();
        }, 100);

        window.Logger?.info('[HelpSystem] Help modal shown');
    }

    /**
     * Hide help modal
     */
    hideHelp() {
        const modal = this.helpModal || document.getElementById('help-modal');
        if (!modal) return;

        modal.classList.remove('show');

        // Return focus to help button
        if (this.helpButton) {
            this.helpButton.focus();
        }

        window.Logger?.info('[HelpSystem] Help modal hidden');
    }

    /**
     * Toggle help modal
     */
    toggleHelp() {
        const modal = this.helpModal || document.getElementById('help-modal');
        if (!modal) return;

        if (modal.classList.contains('show')) {
            this.hideHelp();
        } else {
            this.showHelp();
        }
    }
}

// Create global instance
window.HelpSystem = new HelpSystem();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HelpSystem };
}
