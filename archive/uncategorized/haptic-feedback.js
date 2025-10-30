/**
 * Haptic Feedback System
 *
 * Provides tactile feedback for correct/incorrect answers on mobile devices
 * Respects user preferences and accessibility settings
 */

class HapticFeedbackManager {
    constructor() {
        this.supported = this.checkSupport();
        this.enabled = this.loadPreference();
        this.patterns = {
            success: [50, 30, 50],           // Short-pause-short for correct answers
            error: [100, 50, 100, 50, 100],  // Triple pulse for errors
            warning: [80],                    // Single medium pulse
            notification: [30],               // Quick tap
            selection: [10]                   // Very quick tap for selections
        };

        window.Logger?.info('Haptic feedback:', this.supported ? 'Supported' : 'Not supported');
    }

    /**
     * Check if haptic feedback is supported
     */
    checkSupport() {
        // Check for Vibration API
        return 'vibrate' in navigator;
    }

    /**
     * Vibrate with pattern
     * @param {string} patternName - 'success', 'error', 'warning', 'notification', 'selection'
     */
    vibrate(patternName) {
        if (!this.supported || !this.enabled) {
            return;
        }

        // Check if reduced motion is enabled
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            window.Logger?.debug('Haptic feedback skipped - reduced motion enabled');
            return;
        }

        const pattern = this.patterns[patternName];
        if (!pattern) {
            window.Logger?.warn('Unknown haptic pattern:', patternName);
            return;
        }

        try {
            navigator.vibrate(pattern);
            window.Logger?.debug('Haptic feedback:', patternName);
        } catch (error) {
            window.Logger?.error('Haptic feedback error:', error);
        }
    }

    /**
     * Provide feedback for correct answer
     */
    correctAnswer() {
        this.vibrate('success');
    }

    /**
     * Provide feedback for incorrect answer
     */
    incorrectAnswer() {
        this.vibrate('error');
    }

    /**
     * Provide feedback for button tap
     */
    buttonTap() {
        this.vibrate('selection');
    }

    /**
     * Provide feedback for notification
     */
    notify() {
        this.vibrate('notification');
    }

    /**
     * Provide feedback for warning
     */
    warn() {
        this.vibrate('warning');
    }

    /**
     * Enable haptic feedback
     */
    enable() {
        this.enabled = true;
        this.savePreference();
        window.A11y?.announceToScreenReader('Haptisches Feedback aktiviert');
        window.Logger?.info('Haptic feedback enabled');
    }

    /**
     * Disable haptic feedback
     */
    disable() {
        this.enabled = false;
        this.savePreference();
        window.A11y?.announceToScreenReader('Haptisches Feedback deaktiviert');
        window.Logger?.info('Haptic feedback disabled');
    }

    /**
     * Toggle haptic feedback
     */
    toggle() {
        if (this.enabled) {
            this.disable();
        } else {
            this.enable();
        }
        return this.enabled;
    }

    /**
     * Load user preference
     */
    loadPreference() {
        try {
            const stored = localStorage.getItem('haptic-feedback-enabled');
            // Default to enabled if supported
            return stored === null ? this.supported : stored === 'true';
        } catch (error) {
            window.Logger?.error('Error loading haptic preference:', error);
            return this.supported;
        }
    }

    /**
     * Save user preference
     */
    savePreference() {
        try {
            localStorage.setItem('haptic-feedback-enabled', String(this.enabled));
            window.Logger?.debug('Haptic preference saved:', this.enabled);
        } catch (error) {
            window.Logger?.error('Error saving haptic preference:', error);
        }
    }

    /**
     * Test haptic feedback
     */
    test() {
        if (!this.supported) {
            alert('Haptisches Feedback wird auf diesem Geraet nicht unterstuetzt.');
            return;
        }

        if (!this.enabled) {
            alert('Haptisches Feedback ist deaktiviert. Bitte aktivieren in den Einstellungen.');
            return;
        }

        // Test each pattern
        const patterns = Object.keys(this.patterns);
        let index = 0;

        const testNext = () => {
            if (index < patterns.length) {
                const pattern = patterns[index];
                this.vibrate(pattern);
                window.A11y?.announceToScreenReader(`Test: ${pattern}`);
                index++;
                setTimeout(testNext, 1000);
            } else {
                window.A11y?.announceToScreenReader('Test abgeschlossen');
            }
        };

        testNext();
    }

    /**
     * Add haptic feedback toggle to settings
     */
    addToSettings() {
        const settingsModal = document.getElementById('settings-modal');
        if (!settingsModal) return;

        const modalContent = settingsModal.querySelector('.modal-content');
        if (!modalContent) return;

        // Check if already added
        if (document.getElementById('haptic-settings')) return;

        // Create haptic settings section
        const section = document.createElement('div');
        section.id = 'haptic-settings';
        section.style.marginBottom = '30px';
        section.style.paddingTop = '20px';
        section.style.borderTop = '2px solid var(--border)';

        section.innerHTML = `
            <h3 style="margin-bottom: 15px; font-size: 16px; color: var(--primary);">
                Haptisches Feedback
            </h3>
            <p style="margin-bottom: 15px; color: var(--text-muted); font-size: 14px;">
                Vibrationen fuer richtige und falsche Antworten
                ${!this.supported ? '(Nicht unterstuetzt auf diesem Geraet)' : ''}
            </p>
            <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox"
                       id="haptic-toggle"
                       ${this.enabled ? 'checked' : ''}
                       ${!this.supported ? 'disabled' : ''}
                       style="margin-right: 10px; width: 20px; height: 20px; cursor: pointer;">
                <span>Haptisches Feedback aktivieren</span>
            </label>
            ${this.supported && this.enabled ? `
                <button onclick="window.Haptics.test()"
                        style="width: 100%; margin-top: 10px; background: var(--bg); border: 2px solid var(--border); color: var(--text); padding: 10px;">
                    Test ausführen
                </button>
            ` : ''}
        `;

        // Insert before app info section
        const appInfoSection = modalContent.querySelector('div[style*="margin-bottom: 20px; padding-top: 20px"]');
        if (appInfoSection) {
            modalContent.insertBefore(section, appInfoSection);
        } else {
            modalContent.appendChild(section);
        }

        // Add event listener
        const toggle = document.getElementById('haptic-toggle');
        if (toggle) {
            toggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.enable();
                    this.notify(); // Give immediate feedback
                } else {
                    this.disable();
                }
            });
        }

        window.Logger?.debug('Haptic settings added to settings modal');
    }
}

// Create global haptic feedback manager
window.Haptics = new HapticFeedbackManager();

// Add to settings when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.Haptics.addToSettings();
    });
} else {
    window.Haptics.addToSettings();
}
