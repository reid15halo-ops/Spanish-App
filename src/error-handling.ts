/**
 * Enhanced Error Handling & Recovery System - TypeScript Version
 *
 * Simplified migration with core error handling and recovery strategies
 */

// ====================================================================
// TYPES & INTERFACES
// ====================================================================

type ErrorCategory = 'data_load_error' | 'storage_error' | 'render_error' | 'network_error' | 'unknown_error';

interface StoredError {
    type: string;
    message: string;
    filename?: string;
    line?: number;
    column?: number;
    stack?: string | null;
    timestamp: string;
    userAgent: string;
    url: string;
}

interface ErrorCategories {
    DATA_LOAD_ERROR: ErrorCategory;
    STORAGE_ERROR: ErrorCategory;
    RENDER_ERROR: ErrorCategory;
    NETWORK_ERROR: ErrorCategory;
    UNKNOWN_ERROR: ErrorCategory;
}

type RecoveryStrategy = (error?: StoredError) => boolean;

// ====================================================================
// ERROR HANDLER
// ====================================================================

class ErrorHandler {
    private errors: StoredError[] = [];
    private readonly maxErrors = 100;
    private recoveryAttempts: Record<string, number> = {};
    private readonly maxRecoveryAttempts = 3;
    private initialized = false;

    private readonly errorCategories: ErrorCategories = {
        DATA_LOAD_ERROR: 'data_load_error',
        STORAGE_ERROR: 'storage_error',
        RENDER_ERROR: 'render_error',
        NETWORK_ERROR: 'network_error',
        UNKNOWN_ERROR: 'unknown_error'
    };

    private readonly recoveryStrategies: Record<ErrorCategory, RecoveryStrategy>;

    constructor() {
        this.recoveryStrategies = {
            'data_load_error': () => this.recoverDataLoading(),
            'storage_error': () => this.recoverStorage(),
            'render_error': () => this.recoverRendering(),
            'network_error': () => this.recoverNetwork(),
            'unknown_error': () => this.recoverGeneric()
        };
    }

    public initialize(): void {
        if (this.initialized) return;

        window.addEventListener('error', (event: ErrorEvent) => this.handleError(event));
        window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => this.handlePromiseError(event));
        this.setupAppErrorRecovery();

        this.initialized = true;

        if (window.Logger) {
            window.Logger.info('ErrorHandler initialized');
        }
    }

    private handleError(event: ErrorEvent): void {
        const error: StoredError = {
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

        this.storeError(error);
        const category = this.categorizeError(error);
        const recovered = this.attemptRecovery(category, error);

        if (!recovered) {
            this.showUserError(
                'Ein unerwarteter Fehler ist aufgetreten.',
                'Bitte lade die Seite neu oder versuche es später erneut.'
            );
        }

        event.preventDefault();
    }

    private handlePromiseError(event: PromiseRejectionEvent): void {
        const error: StoredError = {
            type: 'unhandledRejection',
            message: event.reason ? event.reason.message || String(event.reason) : 'Promise rejected',
            stack: event.reason ? event.reason.stack : null,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        this.storeError(error);
        const category = this.categorizeError(error);
        const recovered = this.attemptRecovery(category, error);

        if (!recovered) {
            this.showUserError(
                'Ein Problem ist beim Laden der Daten aufgetreten.',
                'Bitte überprüfe deine Internetverbindung und lade die Seite neu.'
            );
        }

        event.preventDefault();
    }

    private storeError(error: StoredError): void {
        this.errors.push(error);
        if (this.errors.length > this.maxErrors) this.errors.shift();

        try {
            const storedErrors: StoredError[] = JSON.parse(localStorage.getItem('app-errors') || '[]');
            storedErrors.push(error);
            if (storedErrors.length > this.maxErrors) storedErrors.shift();
            localStorage.setItem('app-errors', JSON.stringify(storedErrors));
        } catch (e) {
            // Silently fail if localStorage is full
        }
    }

    private categorizeError(error: StoredError): ErrorCategory {
        const message = (error.message || '').toLowerCase();
        const stack = (error.stack || '').toLowerCase();

        if (message.includes('fetch') || message.includes('load') || message.includes('json') || message.includes('parse')) {
            return this.errorCategories.DATA_LOAD_ERROR;
        }

        if (message.includes('storage') || message.includes('quota') || message.includes('localstorage')) {
            return this.errorCategories.STORAGE_ERROR;
        }

        if (message.includes('render') || message.includes('dom') || message.includes('element') || stack.includes('render')) {
            return this.errorCategories.RENDER_ERROR;
        }

        if (message.includes('network') || message.includes('offline') || message.includes('connection')) {
            return this.errorCategories.NETWORK_ERROR;
        }

        return this.errorCategories.UNKNOWN_ERROR;
    }

    private attemptRecovery(category: ErrorCategory, error: StoredError): boolean {
        if (!this.recoveryAttempts[category]) {
            this.recoveryAttempts[category] = 0;
        }

        if (this.recoveryAttempts[category]! >= this.maxRecoveryAttempts) {
            return false;
        }

        this.recoveryAttempts[category]!++;
        const strategy = this.recoveryStrategies[category];

        if (!strategy) return false;

        try {
            const result = strategy(error);
            if (result) {
                this.recoveryAttempts[category] = 0;
                return true;
            }
            return false;
        } catch (recoveryError) {
            return false;
        }
    }

    private recoverDataLoading(): boolean {
        try {
            if (!window.ExerciseData && !(window as any).UNIT_1_PRONOUNS) {
                this.showUserError(
                    'Daten konnten nicht geladen werden.',
                    'Die Seite wird automatisch neu geladen...'
                );
                setTimeout(() => window.location.reload(), 2000);
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    private recoverStorage(): boolean {
        try {
            const keysToRemove: string[] = [];

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes('backup-') || key.includes('temp-') || key.includes('cache-'))) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(key => {
                try {
                    localStorage.removeItem(key);
                } catch (e) {
                    // Continue
                }
            });

            this.showUserError('Speicherplatz wurde freigegeben.', 'Versuche die Aktion erneut.');
            return true;
        } catch (e) {
            return false;
        }
    }

    private recoverRendering(): boolean {
        try {
            const exerciseArea = document.getElementById('exercise-area');
            if (exerciseArea) {
                exerciseArea.innerHTML = '<p>Lade Übung neu...</p>';

                if ((window as any).SpanishApp && (window as any).SpanishApp.currentExerciseIndex !== undefined) {
                    setTimeout(() => {
                        (window as any).SpanishApp.renderCurrentExercise();
                    }, 500);
                    return true;
                }
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    private recoverNetwork(): boolean {
        try {
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

    private recoverGeneric(): boolean {
        this.showUserError(
            'Ein Problem ist aufgetreten.',
            'Möchtest du die Seite neu laden?',
            true
        );
        return true;
    }

    public showUserError(title: string, message: string, showReloadButton = false): void {
        const existingOverlay = document.getElementById('error-overlay');
        if (existingOverlay) existingOverlay.remove();

        const overlay = document.createElement('div');
        overlay.id = 'error-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.8); display: flex;
            align-items: center; justify-content: center; z-index: 10000;
        `;

        const errorBox = document.createElement('div');
        errorBox.style.cssText = `
            background: white; padding: 30px; border-radius: 10px;
            max-width: 400px; width: 90%; text-align: center;
        `;

        errorBox.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
            <h2 style="color: #C62828; margin-bottom: 15px;">${title}</h2>
            <p style="color: #666; margin-bottom: 25px;">${message}</p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                ${showReloadButton ? '<button id="reload-btn" style="background: #20B2AA; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer;">Seite neu laden</button>' : ''}
                <button id="dismiss-error-btn" style="background: #f5f5f5; color: #333; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer;">Schließen</button>
            </div>
        `;

        overlay.appendChild(errorBox);
        document.body.appendChild(overlay);

        const dismissBtn = document.getElementById('dismiss-error-btn');
        dismissBtn?.addEventListener('click', () => overlay.remove());

        const reloadBtn = document.getElementById('reload-btn');
        reloadBtn?.addEventListener('click', () => window.location.reload());

        if (!showReloadButton) {
            setTimeout(() => overlay.parentNode && overlay.remove(), 10000);
        }
    }

    private setupAppErrorRecovery(): void {
        setInterval(() => this.checkAppHealth(), 30000);
    }

    private checkAppHealth(): boolean {
        try {
            if (!window.ExerciseData && !(window as any).UNIT_1_PRONOUNS) {
                this.recoverDataLoading();
                return false;
            }

            const exerciseArea = document.getElementById('exercise-area');
            const sidebar = document.getElementById('sidebar');

            if (!exerciseArea || !sidebar) {
                this.showUserError('App-Struktur beschädigt', 'Die Seite muss neu geladen werden.', true);
                return false;
            }

            return true;
        } catch (e) {
            return false;
        }
    }

    public getErrors(): StoredError[] {
        return this.errors;
    }

    public clearErrors(): void {
        this.errors = [];
        this.recoveryAttempts = {};
        try {
            localStorage.removeItem('app-errors');
        } catch (e) {
            // Silent
        }
    }

    public exportErrors(): void {
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

// Create alias for backward compatibility (app-core uses ErrorBoundary)
(window as any).ErrorBoundary = window.ErrorHandler;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.ErrorHandler.initialize();
    });
} else {
    window.ErrorHandler.initialize();
}
