/**
 * UI Enhancements System
 *
 * Provides context-aware UI improvements:
 * - Context-aware button labels based on exercise type
 * - Enhanced progress bar with animations
 * - Better visual feedback throughout the app
 */

class UIEnhancements {
    constructor() {
        this.currentExerciseType = null;
        this.initialized = false;
    }

    /**
     * Initialize UI enhancements
     */
    initialize() {
        if (this.initialized) return;

        this.injectStyles();
        this.enhanceProgressBar();
        this.initialized = true;

        window.Logger?.debug('[UIEnhancements] Initialized');
    }

    /**
     * Inject enhanced UI styles
     */
    injectStyles() {
        if (document.getElementById('ui-enhancements-styles')) return;

        const style = document.createElement('style');
        style.id = 'ui-enhancements-styles';
        style.textContent = `
            /* Enhanced Progress Bar */
            #progress {
                background: var(--bg, #FFFFFF);
                padding: 20px;
                border-radius: var(--radius, 8px);
                margin-bottom: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                transition: all 0.3s ease;
            }

            #progress:hover {
                box-shadow: 0 4px 12px rgba(0,0,0,0.12);
            }

            .progress-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .progress-label {
                font-size: 14px;
                font-weight: 600;
                color: var(--text, #1A1A1A);
            }

            .progress-stats {
                font-size: 14px;
                font-weight: 600;
                color: var(--text-muted, #666666);
                background: var(--bg-secondary, #F5F5F5);
                padding: 4px 12px;
                border-radius: 12px;
            }

            .progress-bar {
                width: 100%;
                height: 10px;
                background: var(--bg-secondary, #F5F5F5);
                border-radius: 5px;
                overflow: hidden;
                position: relative;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg,
                    var(--primary, #20B2AA),
                    var(--primary-hover, #1A9993));
                transition: width 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
                border-radius: 5px;
                position: relative;
                overflow: hidden;
            }

            /* Animated shimmer effect */
            .progress-fill::after {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(255, 255, 255, 0.3),
                    transparent
                );
                animation: shimmer 2s infinite;
            }

            @keyframes shimmer {
                0% {
                    left: -100%;
                }
                100% {
                    left: 100%;
                }
            }

            .progress-percentage {
                font-size: 12px;
                font-weight: 600;
                color: var(--primary, #20B2AA);
                margin-top: 8px;
                text-align: right;
            }

            /* Context-Aware Button Enhancements */
            .btn-primary {
                position: relative;
                overflow: hidden;
                transition: all 0.2s ease;
            }

            .btn-primary::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                transform: translate(-50%, -50%);
                transition: width 0.6s, height 0.6s;
            }

            .btn-primary:active::before {
                width: 300px;
                height: 300px;
            }

            /* Button with keyboard shortcut hint */
            .btn-with-shortcut {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }

            .shortcut-hint {
                display: inline-block;
                padding: 2px 8px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;
                font-family: 'Courier New', monospace;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }

            /* Exercise Type Badges */
            .exercise-type-indicator {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: var(--primary, #20B2AA);
                color: white;
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 600;
                margin-bottom: 15px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .exercise-type-indicator .icon {
                font-size: 16px;
            }

            /* Enhanced Transitions */
            .exercise-container {
                animation: fadeInUp 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .exercise-container.leaving {
                animation: fadeOutDown 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            }

            @keyframes fadeOutDown {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(-20px);
                }
            }

            /* Improved Button States */
            .btn-option {
                transition: all 0.2s ease;
                position: relative;
            }

            .btn-option::after {
                content: '';
                position: absolute;
                left: 0;
                bottom: 0;
                width: 0;
                height: 3px;
                background: var(--primary, #20B2AA);
                transition: width 0.3s ease;
            }

            .btn-option:hover::after {
                width: 100%;
            }

            .btn-option:focus-visible {
                transform: translateX(4px);
            }

            /* Respect reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .progress-fill,
                .btn-primary,
                .btn-option,
                .exercise-container {
                    animation: none !important;
                    transition: none !important;
                }

                .progress-fill::after {
                    display: none;
                }

                .btn-option::after {
                    transition: none;
                }
            }

            /* Responsive adjustments */
            @media (max-width: 768px) {
                #progress {
                    padding: 15px;
                }

                .progress-stats {
                    font-size: 12px;
                    padding: 3px 10px;
                }

                .shortcut-hint {
                    display: none;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * Enhance the progress bar with better structure and animations
     */
    enhanceProgressBar() {
        const progressContainer = document.getElementById('progress');
        if (!progressContainer) return;

        // Check if already enhanced
        if (progressContainer.querySelector('.progress-header')) {
            return;
        }

        const progressLabel = document.getElementById('progress-label');
        const progressBar = progressContainer.querySelector('.progress-bar');

        if (!progressLabel || !progressBar) return;

        // Create enhanced structure
        const header = document.createElement('div');
        header.className = 'progress-header';

        const stats = document.createElement('span');
        stats.className = 'progress-stats';
        stats.id = 'progress-stats';
        stats.textContent = '0 / 0';

        header.appendChild(progressLabel);
        header.appendChild(stats);

        // Create percentage display
        const percentage = document.createElement('div');
        percentage.className = 'progress-percentage';
        percentage.id = 'progress-percentage';
        percentage.textContent = '0%';

        // Restructure
        progressContainer.innerHTML = '';
        progressContainer.appendChild(header);
        progressContainer.appendChild(progressBar);
        progressContainer.appendChild(percentage);

        window.Logger?.debug('[UIEnhancements] Progress bar enhanced');
    }

    /**
     * Update progress bar with current/total and percentage
     * @param {number} current - Current exercise number
     * @param {number} total - Total exercises
     * @param {string} label - Progress label
     */
    updateProgress(current, total, label = 'Fortschritt') {
        const progressLabel = document.getElementById('progress-label');
        const progressStats = document.getElementById('progress-stats');
        const progressFill = document.querySelector('.progress-fill');
        const progressPercentage = document.getElementById('progress-percentage');
        const progressBar = document.querySelector('.progress-bar');

        if (progressLabel) {
            progressLabel.textContent = label;
        }

        if (progressStats) {
            progressStats.textContent = `${current} / ${total}`;
        }

        const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }

        if (progressPercentage) {
            progressPercentage.textContent = `${percentage}%`;
        }

        if (progressBar) {
            progressBar.setAttribute('aria-valuenow', percentage);
            progressBar.setAttribute('aria-valuemin', '0');
            progressBar.setAttribute('aria-valuemax', '100');
            progressBar.setAttribute('aria-label', `${label}: ${current} von ${total} (${percentage}%)`);
        }
    }

    /**
     * Get context-aware button label based on exercise type
     * @param {string} exerciseType - Type of exercise
     * @returns {object} Button config with label and shortcut
     */
    getButtonConfig(exerciseType) {
        const configs = {
            'choice': {
                label: 'Antwort prüfen',
                shortcut: 'Enter',
                icon: '✓'
            },
            'typing': {
                label: 'Eingabe prüfen',
                shortcut: 'Enter',
                icon: '✓'
            },
            'fill-blank': {
                label: 'Satz prüfen',
                shortcut: 'Enter',
                icon: '✓'
            },
            'match': {
                label: 'Zuordnung prüfen',
                shortcut: 'Enter',
                icon: '✓'
            },
            'conjugation': {
                label: 'Konjugation prüfen',
                shortcut: 'Enter',
                icon: '✓'
            },
            'continue': {
                label: 'Weiter',
                shortcut: 'Enter',
                icon: '→'
            },
            'default': {
                label: 'Prüfen',
                shortcut: 'Enter',
                icon: '✓'
            }
        };

        return configs[exerciseType] || configs.default;
    }

    /**
     * Update button label and appearance based on exercise type
     * @param {HTMLElement} button - Button element to update
     * @param {string} exerciseType - Type of exercise
     * @param {boolean} showShortcut - Whether to show keyboard shortcut
     */
    updateButton(button, exerciseType, showShortcut = true) {
        if (!button) return;

        const config = this.getButtonConfig(exerciseType);
        this.currentExerciseType = exerciseType;

        // Create button content
        if (showShortcut) {
            button.innerHTML = `
                <span class="btn-with-shortcut">
                    <span>${config.icon} ${config.label}</span>
                    <kbd class="shortcut-hint">${config.shortcut}</kbd>
                </span>
            `;
        } else {
            button.innerHTML = `${config.icon} ${config.label}`;
        }

        // Update aria-label
        button.setAttribute('aria-label', `${config.label} (${config.shortcut})`);

        window.Logger?.debug(`[UIEnhancements] Button updated for type: ${exerciseType}`);
    }

    /**
     * Add exercise type indicator badge
     * @param {HTMLElement} container - Container to add badge to
     * @param {string} exerciseType - Type of exercise
     */
    addExerciseTypeBadge(container, exerciseType) {
        if (!container) return;

        // Remove existing badge
        const existingBadge = container.querySelector('.exercise-type-indicator');
        if (existingBadge) {
            existingBadge.remove();
        }

        const typeLabels = {
            'choice': { label: 'Multiple Choice', icon: '☑' },
            'typing': { label: 'Eingabe', icon: '⌨' },
            'fill-blank': { label: 'Lückentext', icon: '📝' },
            'match': { label: 'Zuordnung', icon: '🔗' },
            'conjugation': { label: 'Konjugation', icon: '📚' },
            'grammar': { label: 'Grammatik', icon: '📖' },
            'vocabulary': { label: 'Vokabeln', icon: '💬' },
            'default': { label: 'Übung', icon: '✏' }
        };

        const typeInfo = typeLabels[exerciseType] || typeLabels.default;

        const badge = document.createElement('div');
        badge.className = 'exercise-type-indicator';
        badge.setAttribute('role', 'status');
        badge.setAttribute('aria-label', `Übungstyp: ${typeInfo.label}`);

        badge.innerHTML = `
            <span class="icon" aria-hidden="true">${typeInfo.icon}</span>
            <span>${typeInfo.label}</span>
        `;

        container.insertBefore(badge, container.firstChild);
    }

    /**
     * Animate progress change
     * @param {number} from - Starting percentage
     * @param {number} to - Ending percentage
     * @param {number} duration - Animation duration in ms
     */
    animateProgress(from, to, duration = 500) {
        const progressFill = document.querySelector('.progress-fill');
        if (!progressFill) return;

        const startTime = Date.now();
        const diff = to - from;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = from + (diff * eased);

            progressFill.style.width = `${current}%`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }
}

// Create global instance
window.UIEnhancements = new UIEnhancements();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.UIEnhancements.initialize();
    });
} else {
    window.UIEnhancements.initialize();
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UIEnhancements };
}
