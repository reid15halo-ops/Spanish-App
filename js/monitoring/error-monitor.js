/**
 * Error Monitoring and Crash Reporting System
 *
 * Captures errors, logs them, and provides insights
 * Privacy-first: All data stored locally by default
 */

class ErrorMonitor {
    constructor() {
        this.errors = [];
        this.maxErrors = 100; // Keep last 100 errors
        this.isProduction = window.ENV?.isProduction() || false;

        this.init();
    }

    init() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.logError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack,
                timestamp: Date.now()
            });
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError({
                type: 'promise',
                message: event.reason?.message || String(event.reason),
                stack: event.reason?.stack,
                timestamp: Date.now()
            });
        });

        // Resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.logError({
                    type: 'resource',
                    message: `Failed to load: ${event.target.src || event.target.href}`,
                    element: event.target.tagName,
                    timestamp: Date.now()
                }, true);
            }
        }, true);

        // Load existing errors
        this.loadErrors();

        console.log('[ErrorMonitor] Initialized');
    }

    /**
     * Log an error
     */
    logError(error, capture = true) {
        // Enhance error with context
        const enhancedError = {
            ...error,
            id: this.generateErrorId(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            environment: window.ENV?.currentEnv || 'unknown',
            appVersion: window.ENV?.getVersion() || 'unknown',
            viewport: `${window.innerWidth}x${window.innerHeight}`
        };

        this.errors.push(enhancedError);

        // Keep only last N errors
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }

        // Save to localStorage
        this.saveErrors();

        // Log to console in development
        if (!this.isProduction) {
            console.error('[ErrorMonitor]', enhancedError);
        }

        // Send to remote service if configured
        if (this.isProduction && window.ENV?.get('enableErrorReporting')) {
            this.sendToRemote(enhancedError);
        }

        // Notify user of critical errors
        if (this.isCritical(error)) {
            this.notifyUser(error);
        }
    }

    /**
     * Manually log custom error
     */
    capture(message, context = {}) {
        this.logError({
            type: 'custom',
            message,
            context,
            timestamp: Date.now()
        });
    }

    /**
     * Log warning (not an error, but noteworthy)
     */
    warn(message, context = {}) {
        this.logError({
            type: 'warning',
            severity: 'low',
            message,
            context,
            timestamp: Date.now()
        });
    }

    /**
     * Generate unique error ID
     */
    generateErrorId() {
        return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Check if error is critical
     */
    isCritical(error) {
        const criticalPatterns = [
            /Cannot read property/,
            /is not a function/,
            /undefined is not/,
            /Failed to fetch/,
            /NetworkError/
        ];

        return criticalPatterns.some(pattern =>
            pattern.test(error.message)
        );
    }

    /**
     * Notify user of critical error
     */
    notifyUser(error) {
        // Don't spam users
        const lastNotification = localStorage.getItem('last-error-notification');
        if (lastNotification && (Date.now() - parseInt(lastNotification)) < 60000) {
            return;
        }

        // Show non-intrusive notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Spanish App Error', {
                body: 'The app encountered an error. Your data is safe.',
                icon: '/icons/icon-96x96.png'
            });
        }

        localStorage.setItem('last-error-notification', Date.now().toString());
    }

    /**
     * Send error to remote service
     */
    async sendToRemote(error) {
        const endpoint = window.ENV?.get('errorReportingEndpoint');
        if (!endpoint) return;

        try {
            await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(error)
            });
        } catch (err) {
            console.error('[ErrorMonitor] Failed to send error:', err);
        }
    }

    /**
     * Get error statistics
     */
    getStats() {
        const stats = {
            total: this.errors.length,
            byType: {},
            bySeverity: {},
            recent: this.errors.slice(-10),
            criticalCount: 0
        };

        this.errors.forEach(error => {
            // By type
            stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;

            // By severity
            const severity = error.severity || 'medium';
            stats.bySeverity[severity] = (stats.bySeverity[severity] || 0) + 1;

            // Critical count
            if (this.isCritical(error)) {
                stats.criticalCount++;
            }
        });

        return stats;
    }

    /**
     * Get errors from specific time period
     */
    getErrorsSince(timestamp) {
        return this.errors.filter(error => error.timestamp >= timestamp);
    }

    /**
     * Export errors for analysis
     */
    exportErrors() {
        const data = {
            exported: new Date().toISOString(),
            appVersion: window.ENV?.getVersion() || 'unknown',
            environment: window.ENV?.currentEnv || 'unknown',
            stats: this.getStats(),
            errors: this.errors
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `error-log-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Clear all errors
     */
    clearErrors() {
        this.errors = [];
        this.saveErrors();
    }

    /**
     * Save errors to localStorage
     */
    saveErrors() {
        try {
            localStorage.setItem('error-log', JSON.stringify(this.errors));
        } catch (error) {
            console.error('[ErrorMonitor] Failed to save errors:', error);
        }
    }

    /**
     * Load errors from localStorage
     */
    loadErrors() {
        try {
            const stored = localStorage.getItem('error-log');
            if (stored) {
                this.errors = JSON.parse(stored);
            }
        } catch (error) {
            console.error('[ErrorMonitor] Failed to load errors:', error);
            this.errors = [];
        }
    }
}

// Create global instance
window.ErrorMonitor = new ErrorMonitor();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ErrorMonitor };
}
