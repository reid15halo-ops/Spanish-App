/**
 * Tutorial System
 *
 * Provides interactive step-by-step tutorial:
 * - Spotlight on important UI elements
 * - Dark overlay with highlighted areas
 * - Step-by-step guidance
 * - Skip/Complete tracking
 */

class TutorialSystem {
    constructor() {
        this.initialized = false;
        this.currentStep = 0;
        this.isActive = false;
        this.steps = [];
        this.overlay = null;
        this.tooltip = null;
    }

    /**
     * Initialize the tutorial system
     */
    initialize() {
        if (this.initialized) return;

        // Define tutorial steps
        this.defineSteps();

        // Inject styles
        this.injectStyles();

        // Create tutorial elements
        this.createTutorialElements();

        this.initialized = true;

        window.Logger?.debug('[TutorialSystem] Initialized');
    }

    /**
     * Define tutorial steps
     */
    defineSteps() {
        this.steps = [
            {
                target: '#progress',
                title: 'Lernfortschritt',
                content: 'Hier siehst du deinen Fortschritt. Der Balken zeigt, wie viele Übungen du bereits abgeschlossen hast.',
                position: 'bottom',
                highlight: true
            },
            {
                target: '#exercise-area',
                title: 'Übungsbereich',
                content: 'Hier erscheinen deine Übungen. Du kannst Multiple Choice, Eingabe, Lückentexte und Konjugationen üben.',
                position: 'center',
                highlight: true
            },
            {
                target: '.btn-primary',
                title: 'Prüfen-Button',
                content: 'Klicke hier oder drücke <kbd>Enter</kbd>, um deine Antwort zu prüfen. Der Button passt sich dem Übungstyp an.',
                position: 'top',
                highlight: true
            },
            {
                target: '#sidebar',
                title: 'Übungsnavigation',
                content: 'In der Seitenleiste findest du alle verfügbaren Übungen. Grüne Haken zeigen abgeschlossene Übungen an.',
                position: 'right',
                highlight: true
            },
            {
                target: '#settings-btn',
                title: 'Einstellungen',
                content: 'Hier kannst du deine Lernhilfe anpassen, Daten exportieren und die App nach deinen Wünschen einstellen.',
                position: 'top',
                highlight: true
            },
            {
                target: '.help-button',
                title: 'Hilfe-Button',
                content: 'Jederzeit erreichbar! Drücke <kbd>?</kbd> für Hilfe, Tastaturkürzel und Erklärungen zum SRS-System.',
                position: 'left',
                highlight: true
            },
            {
                target: null,
                title: 'Los geht\'s! 🚀',
                content: 'Du bist bereit! Wähle eine Übung in der Seitenleiste und starte deine Spanisch-Lernreise. Viel Erfolg!',
                position: 'center',
                highlight: false
            }
        ];
    }

    /**
     * Inject tutorial styles
     */
    injectStyles() {
        if (document.getElementById('tutorial-system-styles')) return;

        const style = document.createElement('style');
        style.id = 'tutorial-system-styles';
        style.textContent = `
            /* Tutorial Overlay */
            .tutorial-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10002;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }

            .tutorial-overlay.active {
                opacity: 1;
                pointer-events: all;
            }

            /* Spotlight Effect */
            .tutorial-spotlight {
                position: absolute;
                border: 3px solid var(--primary, #20B2AA);
                border-radius: var(--radius, 8px);
                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.8),
                            0 0 20px rgba(32, 178, 170, 0.5),
                            inset 0 0 20px rgba(32, 178, 170, 0.3);
                transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
                pointer-events: none;
                z-index: 10003;
            }

            /* Tutorial Tooltip */
            .tutorial-tooltip {
                position: fixed;
                background: white;
                border-radius: var(--radius, 8px);
                padding: 25px;
                max-width: 400px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                z-index: 10004;
                opacity: 0;
                transform: scale(0.9);
                transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            }

            .tutorial-tooltip.show {
                opacity: 1;
                transform: scale(1);
            }

            .tutorial-tooltip-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 15px;
            }

            .tutorial-step-number {
                background: var(--primary, #20B2AA);
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 14px;
                flex-shrink: 0;
            }

            .tutorial-tooltip-title {
                font-size: 20px;
                font-weight: 700;
                color: var(--text, #1A1A1A);
                margin: 0;
            }

            .tutorial-tooltip-content {
                font-size: 15px;
                line-height: 1.6;
                color: var(--text, #1A1A1A);
                margin-bottom: 20px;
            }

            .tutorial-tooltip-content kbd {
                display: inline-block;
                padding: 3px 8px;
                background: var(--text, #1A1A1A);
                color: white;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                font-size: 13px;
                font-weight: 600;
            }

            .tutorial-tooltip-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 15px;
                padding-top: 15px;
                border-top: 1px solid var(--border, #E0E0E0);
            }

            .tutorial-progress {
                font-size: 13px;
                color: var(--text-muted, #666666);
                font-weight: 600;
            }

            .tutorial-actions {
                display: flex;
                gap: 10px;
            }

            .tutorial-btn {
                padding: 10px 20px;
                border-radius: var(--radius, 8px);
                border: none;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .tutorial-btn-skip {
                background: var(--bg-secondary, #F5F5F5);
                color: var(--text-muted, #666666);
            }

            .tutorial-btn-skip:hover {
                background: var(--bg, #FFFFFF);
                border: 2px solid var(--border, #E0E0E0);
            }

            .tutorial-btn-next {
                background: var(--primary, #20B2AA);
                color: white;
            }

            .tutorial-btn-next:hover {
                background: var(--primary-hover, #1A9993);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(32, 178, 170, 0.3);
            }

            .tutorial-btn-back {
                background: var(--bg-secondary, #F5F5F5);
                color: var(--text, #1A1A1A);
                border: 2px solid var(--border, #E0E0E0);
            }

            .tutorial-btn-back:hover {
                border-color: var(--primary, #20B2AA);
            }

            /* Responsive */
            @media (max-width: 768px) {
                .tutorial-tooltip {
                    max-width: 90%;
                    padding: 20px;
                }

                .tutorial-tooltip-title {
                    font-size: 18px;
                }

                .tutorial-tooltip-content {
                    font-size: 14px;
                }

                .tutorial-tooltip-footer {
                    flex-direction: column;
                    align-items: stretch;
                }

                .tutorial-actions {
                    width: 100%;
                }

                .tutorial-btn {
                    flex: 1;
                }
            }

            /* Respect reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .tutorial-overlay,
                .tutorial-spotlight,
                .tutorial-tooltip {
                    animation: none !important;
                    transition: none !important;
                }

                .tutorial-btn-next:hover {
                    transform: none;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * Create tutorial DOM elements
     */
    createTutorialElements() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'tutorial-overlay';
        this.overlay.id = 'tutorial-overlay';

        // Create spotlight
        this.spotlight = document.createElement('div');
        this.spotlight.className = 'tutorial-spotlight';
        this.spotlight.id = 'tutorial-spotlight';

        // Create tooltip
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tutorial-tooltip';
        this.tooltip.id = 'tutorial-tooltip';

        // Add to DOM when ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(this.overlay);
                document.body.appendChild(this.spotlight);
                document.body.appendChild(this.tooltip);
            });
        } else {
            document.body.appendChild(this.overlay);
            document.body.appendChild(this.spotlight);
            document.body.appendChild(this.tooltip);
        }
    }

    /**
     * Start the tutorial
     */
    start() {
        if (!this.initialized) {
            this.initialize();
        }

        this.isActive = true;
        this.currentStep = 0;

        // Show overlay
        this.overlay.classList.add('active');

        // Show first step
        this.showStep(0);

        window.Logger?.info('[TutorialSystem] Tutorial started');
    }

    /**
     * Show a specific step
     */
    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.steps.length) {
            return;
        }

        this.currentStep = stepIndex;
        const step = this.steps[stepIndex];

        // Update spotlight
        if (step.target && step.highlight) {
            this.highlightElement(step.target);
        } else {
            this.spotlight.style.display = 'none';
        }

        // Update tooltip
        this.showTooltip(step, stepIndex);

        window.Logger?.debug(`[TutorialSystem] Showing step ${stepIndex + 1}/${this.steps.length}`);
    }

    /**
     * Highlight an element
     */
    highlightElement(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            window.Logger?.warn(`[TutorialSystem] Element not found: ${selector}`);
            this.spotlight.style.display = 'none';
            return;
        }

        const rect = element.getBoundingClientRect();

        this.spotlight.style.display = 'block';
        this.spotlight.style.top = (rect.top - 10) + 'px';
        this.spotlight.style.left = (rect.left - 10) + 'px';
        this.spotlight.style.width = (rect.width + 20) + 'px';
        this.spotlight.style.height = (rect.height + 20) + 'px';
    }

    /**
     * Show tooltip with step content
     */
    showTooltip(step, stepIndex) {
        const isFirstStep = stepIndex === 0;
        const isLastStep = stepIndex === this.steps.length - 1;

        this.tooltip.innerHTML = `
            <div class="tutorial-tooltip-header">
                <div class="tutorial-step-number">${stepIndex + 1}</div>
                <h3 class="tutorial-tooltip-title">${step.title}</h3>
            </div>
            <div class="tutorial-tooltip-content">
                ${step.content}
            </div>
            <div class="tutorial-tooltip-footer">
                <div class="tutorial-progress">
                    Schritt ${stepIndex + 1} von ${this.steps.length}
                </div>
                <div class="tutorial-actions">
                    ${!isFirstStep ? '<button class="tutorial-btn tutorial-btn-back" id="tutorial-back-btn">← Zurück</button>' : ''}
                    <button class="tutorial-btn tutorial-btn-skip" id="tutorial-skip-btn">
                        Überspringen
                    </button>
                    <button class="tutorial-btn tutorial-btn-next" id="tutorial-next-btn">
                        ${isLastStep ? 'Fertig ✓' : 'Weiter →'}
                    </button>
                </div>
            </div>
        `;

        // Position tooltip
        this.positionTooltip(step);

        // Show tooltip
        setTimeout(() => {
            this.tooltip.classList.add('show');
        }, 50);

        // Attach event listeners
        this.attachTooltipEventListeners(isLastStep);
    }

    /**
     * Position tooltip based on step
     */
    positionTooltip(step) {
        if (!step.target || step.position === 'center') {
            // Center on screen
            this.tooltip.style.top = '50%';
            this.tooltip.style.left = '50%';
            this.tooltip.style.transform = 'translate(-50%, -50%)';
            return;
        }

        const element = document.querySelector(step.target);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();

        switch (step.position) {
            case 'top':
                this.tooltip.style.top = (rect.top - tooltipRect.height - 20) + 'px';
                this.tooltip.style.left = (rect.left + rect.width / 2) + 'px';
                this.tooltip.style.transform = 'translateX(-50%)';
                break;
            case 'bottom':
                this.tooltip.style.top = (rect.bottom + 20) + 'px';
                this.tooltip.style.left = (rect.left + rect.width / 2) + 'px';
                this.tooltip.style.transform = 'translateX(-50%)';
                break;
            case 'left':
                this.tooltip.style.top = (rect.top + rect.height / 2) + 'px';
                this.tooltip.style.left = (rect.left - tooltipRect.width - 20) + 'px';
                this.tooltip.style.transform = 'translateY(-50%)';
                break;
            case 'right':
                this.tooltip.style.top = (rect.top + rect.height / 2) + 'px';
                this.tooltip.style.left = (rect.right + 20) + 'px';
                this.tooltip.style.transform = 'translateY(-50%)';
                break;
            default:
                // Center
                this.tooltip.style.top = '50%';
                this.tooltip.style.left = '50%';
                this.tooltip.style.transform = 'translate(-50%, -50%)';
        }
    }

    /**
     * Attach event listeners to tooltip buttons
     */
    attachTooltipEventListeners(isLastStep) {
        const nextBtn = document.getElementById('tutorial-next-btn');
        const backBtn = document.getElementById('tutorial-back-btn');
        const skipBtn = document.getElementById('tutorial-skip-btn');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (isLastStep) {
                    this.complete();
                } else {
                    this.next();
                }
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.previous();
            });
        }

        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                this.skip();
            });
        }

        // Keyboard shortcuts
        const keyHandler = (e) => {
            if (!this.isActive) return;

            if (e.key === 'ArrowRight' || e.key === 'Enter') {
                e.preventDefault();
                if (isLastStep) {
                    this.complete();
                } else {
                    this.next();
                }
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previous();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.skip();
            }
        };

        document.addEventListener('keydown', keyHandler);

        // Store handler for cleanup
        this._keyHandler = keyHandler;
    }

    /**
     * Go to next step
     */
    next() {
        if (this.currentStep < this.steps.length - 1) {
            this.showStep(this.currentStep + 1);
        }
    }

    /**
     * Go to previous step
     */
    previous() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    /**
     * Skip tutorial
     */
    skip() {
        this.end();
        window.Logger?.info('[TutorialSystem] Tutorial skipped');
    }

    /**
     * Complete tutorial
     */
    complete() {
        this.end();

        // Mark as completed in onboarding
        if (window.OnboardingSystem) {
            window.OnboardingSystem.hasCompletedTutorial = true;
            window.OnboardingSystem.saveState();
        }

        window.Logger?.info('[TutorialSystem] Tutorial completed');
    }

    /**
     * End tutorial (cleanup)
     */
    end() {
        this.isActive = false;

        // Hide elements
        this.overlay.classList.remove('active');
        this.tooltip.classList.remove('show');
        this.spotlight.style.display = 'none';

        // Remove key handler
        if (this._keyHandler) {
            document.removeEventListener('keydown', this._keyHandler);
            this._keyHandler = null;
        }

        // Reset
        this.currentStep = 0;
    }
}

// Create global instance
window.TutorialSystem = new TutorialSystem();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TutorialSystem };
}
