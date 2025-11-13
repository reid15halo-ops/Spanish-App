/**
 * Onboarding System
 *
 * Provides welcome dialog and first-time user experience:
 * - Welcome modal for first-time visitors
 * - Feature highlights
 * - Tutorial integration
 * - User preference storage
 */

class OnboardingSystem {
    constructor() {
        this.initialized = false;
        this.hasSeenWelcome = false;
        this.hasCompletedTutorial = false;
        this.storageKey = 'spanish-app-onboarding';
    }

    /**
     * Initialize the onboarding system
     */
    initialize() {
        if (this.initialized) return;

        // Load user's onboarding state
        this.loadState();

        // Inject styles
        this.injectStyles();

        // Create welcome modal
        this.createWelcomeModal();

        this.initialized = true;

        window.Logger?.debug('[OnboardingSystem] Initialized');

        // Show welcome on first visit (after a short delay)
        if (!this.hasSeenWelcome) {
            setTimeout(() => {
                this.showWelcome();
            }, 500);
        }
    }

    /**
     * Load onboarding state from localStorage
     */
    loadState() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const state = JSON.parse(stored);
                this.hasSeenWelcome = state.hasSeenWelcome || false;
                this.hasCompletedTutorial = state.hasCompletedTutorial || false;
            }
        } catch (e) {
            window.Logger?.warn('[OnboardingSystem] Failed to load state:', e);
        }
    }

    /**
     * Save onboarding state to localStorage
     */
    saveState() {
        try {
            const state = {
                hasSeenWelcome: this.hasSeenWelcome,
                hasCompletedTutorial: this.hasCompletedTutorial,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(state));
        } catch (e) {
            window.Logger?.warn('[OnboardingSystem] Failed to save state:', e);
        }
    }

    /**
     * Inject onboarding styles
     */
    injectStyles() {
        if (document.getElementById('onboarding-system-styles')) return;

        const style = document.createElement('style');
        style.id = 'onboarding-system-styles';
        style.textContent = `
            /* Welcome Modal */
            .welcome-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }

            .welcome-modal.show {
                opacity: 1;
                pointer-events: all;
            }

            .welcome-content {
                background: var(--bg, #FFFFFF);
                border-radius: var(--radius, 8px);
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                padding: 40px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            }

            .welcome-modal.show .welcome-content {
                transform: scale(1);
            }

            .welcome-header {
                text-align: center;
                margin-bottom: 30px;
            }

            .welcome-icon {
                font-size: 64px;
                margin-bottom: 15px;
                display: block;
            }

            .welcome-title {
                font-size: 28px;
                font-weight: 700;
                color: var(--primary, #20B2AA);
                margin: 0 0 10px 0;
            }

            .welcome-subtitle {
                font-size: 16px;
                color: var(--text-muted, #666666);
                margin: 0;
            }

            .welcome-features {
                margin: 30px 0;
            }

            .welcome-feature {
                display: flex;
                align-items: flex-start;
                gap: 15px;
                padding: 20px;
                margin-bottom: 15px;
                background: var(--bg-secondary, #F5F5F5);
                border-radius: var(--radius, 8px);
                border-left: 4px solid var(--primary, #20B2AA);
                transition: transform 0.2s ease;
            }

            .welcome-feature:hover {
                transform: translateX(5px);
            }

            .feature-icon {
                font-size: 32px;
                flex-shrink: 0;
                line-height: 1;
            }

            .feature-content {
                flex: 1;
            }

            .feature-title {
                font-size: 18px;
                font-weight: 600;
                color: var(--text, #1A1A1A);
                margin: 0 0 8px 0;
            }

            .feature-description {
                font-size: 14px;
                color: var(--text-muted, #666666);
                margin: 0;
                line-height: 1.5;
            }

            .welcome-actions {
                display: flex;
                gap: 12px;
                margin-top: 30px;
            }

            .welcome-actions button {
                flex: 1;
                padding: 15px 24px;
                font-size: 16px;
                font-weight: 600;
                border-radius: var(--radius, 8px);
                border: none;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .btn-tutorial {
                background: var(--primary, #20B2AA);
                color: white;
            }

            .btn-tutorial:hover {
                background: var(--primary-hover, #1A9993);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(32, 178, 170, 0.3);
            }

            .btn-skip {
                background: var(--bg-secondary, #F5F5F5);
                color: var(--text, #1A1A1A);
                border: 2px solid var(--border, #E0E0E0);
            }

            .btn-skip:hover {
                background: var(--bg, #FFFFFF);
                border-color: var(--primary, #20B2AA);
            }

            .welcome-footer {
                text-align: center;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid var(--border, #E0E0E0);
            }

            .welcome-footer-text {
                font-size: 12px;
                color: var(--text-muted, #666666);
                margin: 0;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .welcome-content {
                    padding: 30px 20px;
                }

                .welcome-title {
                    font-size: 24px;
                }

                .welcome-subtitle {
                    font-size: 14px;
                }

                .welcome-feature {
                    padding: 15px;
                }

                .feature-icon {
                    font-size: 28px;
                }

                .feature-title {
                    font-size: 16px;
                }

                .feature-description {
                    font-size: 13px;
                }

                .welcome-actions {
                    flex-direction: column;
                }

                .welcome-actions button {
                    width: 100%;
                }
            }

            /* Animations */
            @keyframes slideInFromBottom {
                from {
                    transform: translateY(30px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            .welcome-feature {
                animation: slideInFromBottom 0.4s ease backwards;
            }

            .welcome-feature:nth-child(1) {
                animation-delay: 0.1s;
            }

            .welcome-feature:nth-child(2) {
                animation-delay: 0.2s;
            }

            .welcome-feature:nth-child(3) {
                animation-delay: 0.3s;
            }

            .welcome-feature:nth-child(4) {
                animation-delay: 0.4s;
            }

            /* Respect reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .welcome-modal,
                .welcome-content,
                .welcome-feature {
                    animation: none !important;
                    transition: none !important;
                }

                .welcome-feature:hover {
                    transform: none;
                }

                .btn-tutorial:hover,
                .btn-skip:hover {
                    transform: none;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * Create welcome modal DOM
     */
    createWelcomeModal() {
        // Check if already exists
        if (document.getElementById('welcome-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'welcome-modal';
        modal.className = 'welcome-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'welcome-title');
        modal.setAttribute('aria-describedby', 'welcome-description');

        modal.innerHTML = `
            <div class="welcome-content">
                <div class="welcome-header">
                    <span class="welcome-icon" aria-hidden="true">🎓</span>
                    <h2 class="welcome-title" id="welcome-title">
                        Willkommen bei deiner Spanisch-Lern-App!
                    </h2>
                    <p class="welcome-subtitle" id="welcome-description">
                        Lerne Spanisch effektiv mit intelligenten Übungen und adaptivem Lernsystem
                    </p>
                </div>

                <div class="welcome-features">
                    <div class="welcome-feature">
                        <div class="feature-icon" aria-hidden="true">📚</div>
                        <div class="feature-content">
                            <h3 class="feature-title">Vielfältige Übungstypen</h3>
                            <p class="feature-description">
                                Multiple Choice, Eingabe-Übungen, Lückentexte und Konjugationen -
                                abwechslungsreiches Lernen für nachhaltigen Erfolg.
                            </p>
                        </div>
                    </div>

                    <div class="welcome-feature">
                        <div class="feature-icon" aria-hidden="true">🧠</div>
                        <div class="feature-content">
                            <h3 class="feature-title">Intelligentes SRS-System</h3>
                            <p class="feature-description">
                                Spaced Repetition: Vokabeln werden genau dann wiederholt,
                                wenn du sie am besten behältst - wissenschaftlich optimiert.
                            </p>
                        </div>
                    </div>

                    <div class="welcome-feature">
                        <div class="feature-icon" aria-hidden="true">🎯</div>
                        <div class="feature-content">
                            <h3 class="feature-title">Adaptives Lernen</h3>
                            <p class="feature-description">
                                Die App passt sich deinem Niveau an: detaillierte Hilfe für Anfänger,
                                knackige Herausforderungen für Fortgeschrittene.
                            </p>
                        </div>
                    </div>

                    <div class="welcome-feature">
                        <div class="feature-icon" aria-hidden="true">💾</div>
                        <div class="feature-content">
                            <h3 class="feature-title">Offline & Privat</h3>
                            <p class="feature-description">
                                Lerne ohne Internetverbindung. Alle Daten bleiben lokal auf deinem Gerät -
                                100% DSGVO-konform.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="welcome-actions">
                    <button class="btn-tutorial" id="start-tutorial-btn" aria-label="Interaktives Tutorial starten">
                        📖 Tutorial starten
                    </button>
                    <button class="btn-skip" id="skip-tutorial-btn" aria-label="Tutorial überspringen und direkt loslegen">
                        🚀 Direkt loslegen
                    </button>
                </div>

                <div class="welcome-footer">
                    <p class="welcome-footer-text">
                        Du kannst das Tutorial jederzeit über das Hilfe-Menü (?) erneut starten.
                    </p>
                </div>
            </div>
        `;

        // Add to DOM when ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(modal);
                this.attachWelcomeEventListeners();
            });
        } else {
            document.body.appendChild(modal);
            this.attachWelcomeEventListeners();
        }
    }

    /**
     * Attach event listeners to welcome modal
     */
    attachWelcomeEventListeners() {
        const modal = document.getElementById('welcome-modal');
        if (!modal) return;

        const startTutorialBtn = document.getElementById('start-tutorial-btn');
        const skipTutorialBtn = document.getElementById('skip-tutorial-btn');

        if (startTutorialBtn) {
            startTutorialBtn.addEventListener('click', () => {
                this.startTutorial();
            });
        }

        if (skipTutorialBtn) {
            skipTutorialBtn.addEventListener('click', () => {
                this.skipTutorial();
            });
        }

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                this.skipTutorial();
            }
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.skipTutorial();
            }
        });
    }

    /**
     * Show welcome modal
     */
    showWelcome() {
        const modal = document.getElementById('welcome-modal');
        if (!modal) return;

        modal.classList.add('show');

        // Focus first button
        setTimeout(() => {
            const firstBtn = document.getElementById('start-tutorial-btn');
            if (firstBtn) firstBtn.focus();
        }, 100);

        window.Logger?.info('[OnboardingSystem] Welcome modal shown');
    }

    /**
     * Hide welcome modal
     */
    hideWelcome() {
        const modal = document.getElementById('welcome-modal');
        if (!modal) return;

        modal.classList.remove('show');

        // Mark as seen
        this.hasSeenWelcome = true;
        this.saveState();

        window.Logger?.info('[OnboardingSystem] Welcome modal hidden');
    }

    /**
     * Start interactive tutorial
     */
    startTutorial() {
        this.hideWelcome();

        // Start tutorial if available
        if (window.TutorialSystem) {
            window.TutorialSystem.start();
        } else {
            window.Logger?.warn('[OnboardingSystem] TutorialSystem not available');
            // Fallback: just close welcome
        }

        window.Logger?.info('[OnboardingSystem] Tutorial started');
    }

    /**
     * Skip tutorial and go straight to app
     */
    skipTutorial() {
        this.hideWelcome();

        window.Logger?.info('[OnboardingSystem] Tutorial skipped');
    }

    /**
     * Reset onboarding state (for testing)
     */
    reset() {
        this.hasSeenWelcome = false;
        this.hasCompletedTutorial = false;
        this.saveState();

        window.Logger?.info('[OnboardingSystem] State reset');
    }

    /**
     * Show welcome again (for debugging)
     */
    showWelcomeAgain() {
        this.hasSeenWelcome = false;
        this.showWelcome();
    }
}

// Create global instance
window.OnboardingSystem = new OnboardingSystem();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { OnboardingSystem };
}
