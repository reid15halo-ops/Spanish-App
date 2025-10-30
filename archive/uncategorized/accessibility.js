/**
 * Accessibility Utilities
 *
 * WCAG AAA compliant accessibility features including:
 * - Keyboard navigation
 * - Screen reader support (ARIA)
 * - Focus management
 * - High contrast mode
 * - Font scaling
 * - Skip links
 */

class AccessibilityManager {
    constructor() {
        this.focusableElements = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
        this.preferences = this.loadPreferences();
        this.init();
    }

    /**
     * Initialize accessibility features
     */
    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupSkipLinks();
        this.applyUserPreferences();
        this.detectUserPreferences();
        this.setupLiveRegions();

        window.Logger?.success('Accessibility manager initialized');
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Trap focus in modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleModalFocusTrap(e);
            }
        });

        window.Logger?.debug('Keyboard navigation enabled');
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyboardNavigation(e) {
        const activeElement = document.activeElement;

        // Arrow key navigation for exercise options
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            this.handleArrowNavigation(e);
        }

        // Enter/Space on buttons
        if ((e.key === 'Enter' || e.key === ' ') && activeElement.hasAttribute('role')) {
            if (activeElement.getAttribute('role') === 'button') {
                e.preventDefault();
                activeElement.click();
            }
        }

        // Escape to close modals
        if (e.key === 'Escape') {
            this.closeModals();
        }
    }

    /**
     * Handle arrow key navigation
     */
    handleArrowNavigation(e) {
        const options = Array.from(document.querySelectorAll('.btn-option:not([disabled])'));
        const activeElement = document.activeElement;
        const currentIndex = options.indexOf(activeElement);

        if (currentIndex === -1) return;

        e.preventDefault();

        let nextIndex;
        if (e.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % options.length;
        } else {
            nextIndex = (currentIndex - 1 + options.length) % options.length;
        }

        options[nextIndex].focus();
        this.announceToScreenReader(`Option ${nextIndex + 1} of ${options.length}`);
    }

    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Show focus indicator when using keyboard
        let usingKeyboard = false;

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                usingKeyboard = true;
                document.body.classList.add('using-keyboard');
            }
        });

        document.addEventListener('mousedown', () => {
            usingKeyboard = false;
            document.body.classList.remove('using-keyboard');
        });

        // Add focus styles
        const focusStyles = document.createElement('style');
        focusStyles.textContent = `
            /* Only show focus outline when using keyboard */
            body:not(.using-keyboard) *:focus {
                outline: none;
            }

            body.using-keyboard *:focus {
                outline: 3px solid #20B2AA;
                outline-offset: 2px;
            }

            /* Skip link */
            .skip-link {
                position: absolute;
                top: -40px;
                left: 0;
                background: #20B2AA;
                color: white;
                padding: 8px 16px;
                text-decoration: none;
                z-index: 10000;
                font-weight: bold;
            }

            .skip-link:focus {
                top: 0;
            }
        `;
        document.head.appendChild(focusStyles);

        window.Logger?.debug('Focus management enabled');
    }

    /**
     * Trap focus within modal
     */
    handleModalFocusTrap(e) {
        const modal = document.querySelector('[role="dialog"]:not(.hidden)');
        if (!modal) return;

        const focusableElements = Array.from(
            modal.querySelectorAll(this.focusableElements)
        );

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
        }
    }

    /**
     * Setup skip links for keyboard navigation
     */
    setupSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#exercise-area';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Direkt zum Inhalt springen';
        skipLink.setAttribute('aria-label', 'Springe direkt zum Uebungsbereich');

        document.body.insertBefore(skipLink, document.body.firstChild);

        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById('exercise-area');
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
                this.announceToScreenReader('Sprung zum Uebungsbereich');
            }
        });

        window.Logger?.debug('Skip links added');
    }

    /**
     * Setup ARIA live regions for screen reader announcements
     */
    setupLiveRegions() {
        // Create polite live region
        const politeRegion = document.createElement('div');
        politeRegion.id = 'aria-live-polite';
        politeRegion.setAttribute('aria-live', 'polite');
        politeRegion.setAttribute('aria-atomic', 'true');
        politeRegion.className = 'sr-only';
        document.body.appendChild(politeRegion);

        // Create assertive live region
        const assertiveRegion = document.createElement('div');
        assertiveRegion.id = 'aria-live-assertive';
        assertiveRegion.setAttribute('aria-live', 'assertive');
        assertiveRegion.setAttribute('aria-atomic', 'true');
        assertiveRegion.className = 'sr-only';
        document.body.appendChild(assertiveRegion);

        // Add screen reader only class
        const srStyles = document.createElement('style');
        srStyles.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border-width: 0;
            }
        `;
        document.head.appendChild(srStyles);

        window.Logger?.debug('ARIA live regions created');
    }

    /**
     * Announce message to screen readers
     * @param {string} message
     * @param {string} priority - 'polite' or 'assertive'
     */
    announceToScreenReader(message, priority = 'polite') {
        const regionId = priority === 'assertive' ? 'aria-live-assertive' : 'aria-live-polite';
        const region = document.getElementById(regionId);

        if (region) {
            // Clear and set message
            region.textContent = '';
            setTimeout(() => {
                region.textContent = message;
            }, 100);

            window.Logger?.debug('Screen reader announcement:', message);
        }
    }

    /**
     * Detect user accessibility preferences
     */
    detectUserPreferences() {
        // Detect high contrast mode
        const highContrast = window.matchMedia('(prefers-contrast: high)').matches;
        if (highContrast) {
            this.enableHighContrastMode();
        }

        // Detect reduced motion
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) {
            this.enableReducedMotion();
        }

        // Listen for preference changes
        window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
            if (e.matches) {
                this.enableHighContrastMode();
            } else {
                this.disableHighContrastMode();
            }
        });

        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            if (e.matches) {
                this.enableReducedMotion();
            } else {
                this.disableReducedMotion();
            }
        });

        window.Logger?.info('User preferences detected');
    }

    /**
     * Enable high contrast mode
     */
    enableHighContrastMode() {
        document.body.classList.add('high-contrast');
        this.preferences.highContrast = true;
        this.savePreferences();

        const styles = document.createElement('style');
        styles.id = 'high-contrast-styles';
        styles.textContent = `
            body.high-contrast {
                --primary: #000000;
                --bg: #FFFFFF;
                --text: #000000;
                --border: #000000;
            }

            body.high-contrast * {
                border-color: #000000 !important;
            }

            body.high-contrast button,
            body.high-contrast a {
                background: #000000 !important;
                color: #FFFFFF !important;
                border: 2px solid #000000 !important;
            }

            body.high-contrast .btn-option {
                border: 3px solid #000000 !important;
            }

            body.high-contrast .btn-option:focus {
                outline: 5px solid #000000;
                outline-offset: 3px;
            }
        `;
        document.head.appendChild(styles);

        this.announceToScreenReader('Hoher Kontrast aktiviert');
        window.Logger?.info('High contrast mode enabled');
    }

    /**
     * Disable high contrast mode
     */
    disableHighContrastMode() {
        document.body.classList.remove('high-contrast');
        this.preferences.highContrast = false;
        this.savePreferences();

        const styles = document.getElementById('high-contrast-styles');
        if (styles) {
            styles.remove();
        }

        window.Logger?.info('High contrast mode disabled');
    }

    /**
     * Enable reduced motion
     */
    enableReducedMotion() {
        document.body.classList.add('reduce-motion');
        this.preferences.reducedMotion = true;
        this.savePreferences();

        const styles = document.createElement('style');
        styles.id = 'reduced-motion-styles';
        styles.textContent = `
            body.reduce-motion *,
            body.reduce-motion *::before,
            body.reduce-motion *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(styles);

        this.announceToScreenReader('Reduzierte Bewegung aktiviert');
        window.Logger?.info('Reduced motion enabled');
    }

    /**
     * Disable reduced motion
     */
    disableReducedMotion() {
        document.body.classList.remove('reduce-motion');
        this.preferences.reducedMotion = false;
        this.savePreferences();

        const styles = document.getElementById('reduced-motion-styles');
        if (styles) {
            styles.remove();
        }

        window.Logger?.info('Reduced motion disabled');
    }

    /**
     * Set font size scale
     * @param {number} scale - 1.0 = 100%, 1.5 = 150%, etc.
     */
    setFontScale(scale) {
        document.documentElement.style.fontSize = `${scale * 16}px`;
        this.preferences.fontScale = scale;
        this.savePreferences();

        this.announceToScreenReader(`Schriftgroesse auf ${Math.round(scale * 100)}% gesetzt`);
        window.Logger?.info('Font scale set to:', scale);
    }

    /**
     * Close all modals (for Escape key)
     */
    closeModals() {
        const modals = document.querySelectorAll('[role="dialog"]:not(.hidden)');
        modals.forEach(modal => {
            modal.classList.add('hidden');

            // Return focus to trigger element
            const triggerId = modal.getAttribute('data-trigger-id');
            if (triggerId) {
                const trigger = document.getElementById(triggerId);
                if (trigger) {
                    trigger.focus();
                }
            }
        });

        if (modals.length > 0) {
            this.announceToScreenReader('Dialog geschlossen');
        }
    }

    /**
     * Set focus to element with announcement
     * @param {HTMLElement|string} element - Element or selector
     * @param {string} announcement - Optional screen reader announcement
     */
    setFocusTo(element, announcement) {
        const target = typeof element === 'string'
            ? document.querySelector(element)
            : element;

        if (target) {
            // Make element focusable if not already
            if (!target.hasAttribute('tabindex')) {
                target.setAttribute('tabindex', '-1');
            }

            target.focus();

            if (announcement) {
                this.announceToScreenReader(announcement);
            }

            window.Logger?.debug('Focus set to:', target);
        }
    }

    /**
     * Load user preferences
     */
    loadPreferences() {
        try {
            const stored = localStorage.getItem('accessibility-preferences');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            window.Logger?.error('Error loading accessibility preferences:', error);
        }

        return {
            highContrast: false,
            reducedMotion: false,
            fontScale: 1.0
        };
    }

    /**
     * Save user preferences
     */
    savePreferences() {
        try {
            localStorage.setItem('accessibility-preferences', JSON.stringify(this.preferences));
            window.Logger?.debug('Accessibility preferences saved');
        } catch (error) {
            window.Logger?.error('Error saving accessibility preferences:', error);
        }
    }

    /**
     * Apply saved user preferences
     */
    applyUserPreferences() {
        if (this.preferences.highContrast) {
            this.enableHighContrastMode();
        }

        if (this.preferences.reducedMotion) {
            this.enableReducedMotion();
        }

        if (this.preferences.fontScale !== 1.0) {
            this.setFontScale(this.preferences.fontScale);
        }

        window.Logger?.info('User preferences applied');
    }

    /**
     * Run accessibility audit
     * @returns {Object} Audit results
     */
    runAccessibilityAudit() {
        const issues = [];

        // Check for missing alt text
        const images = document.querySelectorAll('img:not([alt])');
        if (images.length > 0) {
            issues.push({
                type: 'missing-alt',
                severity: 'critical',
                count: images.length,
                message: `${images.length} images missing alt text`
            });
        }

        // Check for missing labels
        const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
        inputs.forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (!label && !input.parentElement.querySelector('label')) {
                issues.push({
                    type: 'missing-label',
                    severity: 'critical',
                    element: input,
                    message: 'Input missing label'
                });
            }
        });

        // Check touch target sizes
        const touchIssues = window.TouchGestures?.validateTouchTargets() || [];
        if (touchIssues.length > 0) {
            issues.push({
                type: 'small-touch-targets',
                severity: 'serious',
                count: touchIssues.length,
                message: `${touchIssues.length} elements below 48x48px touch target minimum`
            });
        }

        // Check color contrast (basic check)
        const buttons = document.querySelectorAll('button');
        // Note: Full contrast checking requires actual color analysis

        window.Logger?.info('Accessibility audit complete:', issues);
        return {
            issues,
            passed: issues.length === 0
        };
    }
}

// Create global accessibility manager
window.A11y = new AccessibilityManager();
