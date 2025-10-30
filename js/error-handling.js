/**
 * Enhanced Error Handling & Recovery System
 *
 * Provides:
 * - Global error catching and handling
 * - User-friendly error messages
 * - Automatic recovery strategies
 * - Error logging and reporting
 * - Graceful degradation
 */

class ErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 100;
        this.recoveryAttempts = {};
        this.maxRecoveryAttempts = 3;
        this.initialized = false;

        // Error categories
        this.errorCategories = {
            DATA_LOAD_ERROR: 'data_load_error',
            STORAGE_ERROR: 'storage_error',
            RENDER_ERROR: 'render_error',
            NETWORK_ERROR: 'network_error',
            UNKNOWN_ERROR: 'unknown_error'
        };

        // Recovery strategies
        this.recoveryStrategies = {
            [this.errorCategories.DATA_LOAD_ERROR]: () => this.recoverDataLoading(),
            [this.errorCategories.STORAGE_ERROR]: () => this.recoverStorage(),
            [this.errorCategories.RENDER_ERROR]: () => this.recoverRendering(),
            [this.errorCategories.NETWORK_ERROR]: () => this.recoverNetwork(),
            [this.errorCategories.UNKNOWN_ERROR]: () => this.recoverGeneric()
        };
    }

    /**
     * Initialize error handling system
     */
    initialize() {
        if (this.initialized) {
            return;
        }

        // Global error handler
        window.addEventListener('error', (event) => this.handleError(event));

        // Promise rejection handler
        window.addEventListener('unhandledrejection', (event) => this.handlePromiseError(event));

        // App-specific error recovery
        this.setupAppErrorRecovery();

        this.initialized = true;

        if (window.Logger) {
            window.Logger.info('ErrorHandler initialized');
        }
    }

    /**
     * Handle global errors
     */
    handleError(event) {
        const error = {
            type: 'error',
            message: event.message || 'Unknown error',
            filename: event.filename || 'unknown',
            line: event.lineno || 0,
            column: event.colno || 0,
            stack: event.error ? event.error.stack : null,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Store error
        this.storeError(error);

        // Categorize error
        const category = this.categorizeError(error);

        // Attempt recovery
        const recovered = this.attemptRecovery(category, error);

        // Show user message if not recovered
        if (!recovered) {
            this.showUserError(
                'Ein unerwarteter Fehler ist aufgetreten.',
                'Bitte lade die Seite neu oder versuche es später erneut.'
            );
        }

        // Log error (only in development)
        if (window.Logger && window.__DEV__) {
            window.Logger.error('App Error:', error);
        }

        // Prevent default error handling
        event.preventDefault();
    }

    /**
     * Handle promise rejection errors
     */
    handlePromiseError(event) {
        const error = {
            type: 'unhandledRejection',
            message: event.reason ? event.reason.message || String(event.reason) : 'Promise rejected',
            stack: event.reason ? event.reason.stack : null,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Store error
        this.storeError(error);

        // Categorize error
        const category = this.categorizeError(error);

        // Attempt recovery
        const recovered = this.attemptRecovery(category, error);

        // Show user message if not recovered
        if (!recovered) {
            this.showUserError(
                'Ein Problem ist beim Laden der Daten aufgetreten.',
                'Bitte überprüfe deine Internetverbindung und lade die Seite neu.'
            );
        }

        // Log error (only in development)
        if (window.Logger && window.__DEV__) {
            window.Logger.error('Promise Error:', error);
        }

        // Prevent default error handling
        event.preventDefault();
    }

    /**
     * Store error for debugging
     */
    storeError(error) {
        this.errors.push(error);

        // Keep only last N errors
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }

        // Also store in localStorage for persistence
        try {
            const storedErrors = JSON.parse(localStorage.getItem('app-errors') || '[]');
            storedErrors.push(error);

            if (storedErrors.length > this.maxErrors) {
                storedErrors.shift();
            }

            localStorage.setItem('app-errors', JSON.stringify(storedErrors));
        } catch (e) {
            // Silently fail if localStorage is full
        }
    }

    /**
     * Categorize error based on message and context
     */
    categorizeError(error) {
        const message = (error.message || '').toLowerCase();
        const stack = (error.stack || '').toLowerCase();

        // Data loading errors
        if (message.includes('fetch') || message.includes('load') ||
            message.includes('json') || message.includes('parse')) {
            return this.errorCategories.DATA_LOAD_ERROR;
        }

        // Storage errors
        if (message.includes('storage') || message.includes('quota') ||
            message.includes('localstorage') || message.includes('indexeddb')) {
            return this.errorCategories.STORAGE_ERROR;
        }

        // Render errors
        if (message.includes('render') || message.includes('dom') ||
            message.includes('element') || stack.includes('render')) {
            return this.errorCategories.RENDER_ERROR;
        }

        // Network errors
        if (message.includes('network') || message.includes('offline') ||
            message.includes('connection')) {
            return this.errorCategories.NETWORK_ERROR;
        }

        return this.errorCategories.UNKNOWN_ERROR;
    }

    /**
     * Attempt automatic recovery
     */
    attemptRecovery(category, error) {
        // Check if we've already tried too many times
        if (!this.recoveryAttempts[category]) {
            this.recoveryAttempts[category] = 0;
        }

        if (this.recoveryAttempts[category] >= this.maxRecoveryAttempts) {
            return false;
        }

        // Increment attempts
        this.recoveryAttempts[category]++;

        // Get recovery strategy
        const strategy = this.recoveryStrategies[category];

        if (!strategy) {
            return false;
        }

        try {
            // Execute recovery strategy
            const result = strategy(error);

            // Reset attempts if successful
            if (result) {
                this.recoveryAttempts[category] = 0;
                return true;
            }

            return false;
        } catch (recoveryError) {
            if (window.Logger && window.__DEV__) {
                window.Logger.error('Recovery failed:', recoveryError);
            }
            return false;
        }
    }

    /**
     * Recover from data loading errors
     */
    recoverDataLoading() {
        try {
            // Check if exercise data is available
            if (!window.ExerciseData || !window.UNIT_1_PRONOUNS) {
                // Reload the page to retry data loading
                this.showUserError(
                    'Daten konnten nicht geladen werden.',
                    'Die Seite wird automatisch neu geladen...'
                );

                setTimeout(() => {
                    window.location.reload();
                }, 2000);

                return true;
            }

            return false;
        } catch (e) {
            return false;
        }
    }

    /**
     * Recover from storage errors
     */
    recoverStorage() {
        try {
            // Clear old data to free up space
            const keysToRemove = [];

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);

                // Remove old backups and temporary data
                if (key && (key.includes('backup-') || key.includes('temp-') ||
                           key.includes('cache-'))) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(key => {
                try {
                    localStorage.removeItem(key);
                } catch (e) {
                    // Continue even if individual removal fails
                }
            });

            this.showUserError(
                'Speicherplatz wurde freigegeben.',
                'Versuche die Aktion erneut.'
            );

            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Recover from rendering errors
     */
    recoverRendering() {
        try {
            // Clear exercise area and retry
            const exerciseArea = document.getElementById('exercise-area');
            if (exerciseArea) {
                exerciseArea.innerHTML = '<p>Lade Übung neu...</p>';

                // Trigger re-render if app is available
                if (window.SpanishApp && window.SpanishApp.currentExerciseIndex !== undefined) {
                    setTimeout(() => {
                        window.SpanishApp.renderCurrentExercise();
                    }, 500);

                    return true;
                }
            }

            return false;
        } catch (e) {
            return false;
        }
    }

    /**
     * Recover from network errors
     */
    recoverNetwork() {
        try {
            // Check if we're offline
            if (!navigator.onLine) {
                this.showUserError(
                    'Keine Internetverbindung',
                    'Die App funktioniert offline. Einige Funktionen könnten eingeschränkt sein.'
                );

                return true;
            }

            return false;
        } catch (e) {
            return false;
        }
    }

    /**
     * Generic recovery strategy
     */
    recoverGeneric() {
        // Log error for debugging
        if (window.Logger && window.__DEV__) {
            window.Logger.warn('Attempting generic recovery');
        }

        // Show reload option
        this.showUserError(
            'Ein Problem ist aufgetreten.',
            'Möchtest du die Seite neu laden?',
            true // Show reload button
        );

        return true;
    }

    /**
     * Show user-friendly error message
     */
    showUserError(title, message, showReloadButton = false) {
        // Remove existing error overlay
        const existingOverlay = document.getElementById('error-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Create error overlay
        const overlay = document.createElement('div');
        overlay.id = 'error-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        const errorBox = document.createElement('div');
        errorBox.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;

        errorBox.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
            <h2 style="color: #C62828; margin-bottom: 15px; font-size: 20px;">${title}</h2>
            <p style="color: #666; margin-bottom: 25px; line-height: 1.6;">${message}</p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                ${showReloadButton ? `
                    <button id="reload-btn" style="
                        background: #20B2AA;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                    ">Seite neu laden</button>
                ` : ''}
                <button id="dismiss-error-btn" style="
                    background: #f5f5f5;
                    color: #333;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                ">Schließen</button>
            </div>
        `;

        overlay.appendChild(errorBox);
        document.body.appendChild(overlay);

        // Add event listeners
        const dismissBtn = document.getElementById('dismiss-error-btn');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                overlay.remove();
            });
        }

        const reloadBtn = document.getElementById('reload-btn');
        if (reloadBtn) {
            reloadBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }

        // Auto-dismiss after 10 seconds if no reload button
        if (!showReloadButton) {
            setTimeout(() => {
                if (overlay && overlay.parentNode) {
                    overlay.remove();
                }
            }, 10000);
        }
    }

    /**
     * Setup app-specific error recovery
     */
    setupAppErrorRecovery() {
        // Monitor app state and recover if needed
        setInterval(() => {
            this.checkAppHealth();
        }, 30000); // Check every 30 seconds
    }

    /**
     * Check app health and recover if needed
     */
    checkAppHealth() {
        try {
            // Check if exercise data is still available
            if (!window.ExerciseData && !window.UNIT_1_PRONOUNS) {
                if (window.Logger) {
                    window.Logger.warn('Exercise data missing, attempting recovery');
                }
                this.recoverDataLoading();
                return;
            }

            // Check if main app elements exist
            const exerciseArea = document.getElementById('exercise-area');
            const sidebar = document.getElementById('sidebar');

            if (!exerciseArea || !sidebar) {
                if (window.Logger) {
                    window.Logger.warn('Main app elements missing, page needs reload');
                }
                this.showUserError(
                    'App-Struktur beschädigt',
                    'Die Seite muss neu geladen werden.',
                    true
                );
                return;
            }

            // All checks passed
            return true;
        } catch (e) {
            if (window.Logger && window.__DEV__) {
                window.Logger.error('Health check failed:', e);
            }
            return false;
        }
    }

    /**
     * Get all stored errors
     */
    getErrors() {
        return this.errors;
    }

    /**
     * Clear stored errors
     */
    clearErrors() {
        this.errors = [];
        this.recoveryAttempts = {};

        try {
            localStorage.removeItem('app-errors');
        } catch (e) {
            // Silently fail
        }
    }

    /**
     * Export errors for debugging
     */
    exportErrors() {
        const data = {
            errors: this.errors,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            appVersion: window.ENV?.getVersion() || '1.0.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `error-log-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Create global instance
window.ErrorHandler = new ErrorHandler();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.ErrorHandler.initialize();
    });
} else {
    window.ErrorHandler.initialize();
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ErrorHandler };
}
