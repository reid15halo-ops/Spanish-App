/**
 * Error Boundary System
 *
 * Provides graceful error handling and user-friendly error messages
 */

class ErrorBoundary {
    constructor() {
        this.errors = [];
        this.maxErrors = 10;
        this.setupGlobalHandlers();
    }

    /**
     * Setup global error handlers
     */
    setupGlobalHandlers() {
        // Catch JavaScript errors
        window.addEventListener('error', (event) => {
            this.handleError(event.error || event.message, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
            event.preventDefault();
        });

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, {
                type: 'Promise Rejection'
            });
            event.preventDefault();
        });
    }

    /**
     * Handle an error with user-friendly display
     */
    handleError(error, context = {}) {
        // Log error (will respect environment settings)
        window.Logger?.error('Error caught by boundary:', error, context);

        // Store error
        this.errors.push({
            error: error,
            context: context,
            timestamp: new Date().toISOString()
        });

        // Keep only last N errors
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }

        // Report to monitoring if available
        if (window.ErrorMonitor) {
            window.ErrorMonitor.logError({
                type: 'boundary',
                message: error?.message || String(error),
                stack: error?.stack,
                context: context
            });
        }

        // Show user-friendly error message
        this.showErrorUI(error, context);
    }

    /**
     * Show user-friendly error message
     */
    showErrorUI(error, context = {}) {
        const errorType = context.type || 'Error';
        const errorMessage = error?.message || String(error);

        // Create error dialog
        const dialog = document.createElement('div');
        dialog.className = 'error-boundary-dialog';
        dialog.innerHTML = `
            <div class="error-boundary-content">
                <div class="error-icon">⚠️</div>
                <h3>Ein Fehler ist aufgetreten</h3>
                <p class="error-description">
                    Die App hat einen unerwarteten Fehler festgestellt.
                    Du kannst die Seite neu laden, um fortzufahren.
                </p>
                ${window.ENV?.isDevelopment() ? `
                    <details class="error-details">
                        <summary>Technische Details</summary>
                        <pre>${errorMessage}</pre>
                        ${error?.stack ? `<pre class="error-stack">${error.stack}</pre>` : ''}
                    </details>
                ` : ''}
                <div class="error-actions">
                    <button class="btn-primary" onclick="location.reload()">
                        Seite neu laden
                    </button>
                    <button class="btn-secondary" onclick="this.closest('.error-boundary-dialog').remove()">
                        Schliessen
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // Auto-remove after 10 seconds if user doesn't interact
        setTimeout(() => {
            if (dialog.parentElement) {
                dialog.classList.add('fade-out');
                setTimeout(() => dialog.remove(), 300);
            }
        }, 10000);
    }

    /**
     * Wrap a function with error handling
     */
    wrap(fn, context = {}) {
        return (...args) => {
            try {
                const result = fn(...args);

                // Handle async functions
                if (result && typeof result.catch === 'function') {
                    return result.catch(error => {
                        this.handleError(error, {
                            ...context,
                            functionName: fn.name || 'anonymous'
                        });
                    });
                }

                return result;
            } catch (error) {
                this.handleError(error, {
                    ...context,
                    functionName: fn.name || 'anonymous'
                });
            }
        };
    }

    /**
     * Wrap an async function with error handling
     */
    wrapAsync(fn, context = {}) {
        return async (...args) => {
            try {
                return await fn(...args);
            } catch (error) {
                this.handleError(error, {
                    ...context,
                    functionName: fn.name || 'anonymous'
                });
                throw error; // Re-throw so caller can handle if needed
            }
        };
    }

    /**
     * Get error history
     */
    getErrors() {
        return [...this.errors];
    }

    /**
     * Clear error history
     */
    clearErrors() {
        this.errors = [];
    }
}

// Add CSS styles for error boundary
const errorBoundaryStyles = document.createElement('style');
errorBoundaryStyles.textContent = `
    .error-boundary-dialog {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }

    .error-boundary-dialog.fade-out {
        animation: fadeOut 0.3s ease;
    }

    .error-boundary-content {
        background: white;
        border-radius: 12px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .error-icon {
        font-size: 48px;
        text-align: center;
        margin-bottom: 15px;
    }

    .error-boundary-content h3 {
        color: #C62828;
        text-align: center;
        margin-bottom: 15px;
        font-size: 22px;
    }

    .error-description {
        text-align: center;
        color: #666;
        margin-bottom: 20px;
        line-height: 1.6;
    }

    .error-details {
        background: #f5f5f5;
        border-radius: 8px;
        padding: 15px;
        margin: 20px 0;
        font-family: monospace;
        font-size: 12px;
    }

    .error-details summary {
        cursor: pointer;
        font-weight: 600;
        color: #666;
        margin-bottom: 10px;
    }

    .error-details pre {
        margin: 10px 0;
        white-space: pre-wrap;
        word-wrap: break-word;
        color: #C62828;
    }

    .error-stack {
        font-size: 11px;
        color: #999;
        max-height: 200px;
        overflow-y: auto;
    }

    .error-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }

    .error-actions button {
        flex: 1;
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .error-actions .btn-primary {
        background: #20B2AA;
        color: white;
    }

    .error-actions .btn-primary:hover {
        background: #1A9993;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(32, 178, 170, 0.3);
    }

    .error-actions .btn-secondary {
        background: #f5f5f5;
        color: #666;
    }

    .error-actions .btn-secondary:hover {
        background: #e0e0e0;
    }
`;

document.head.appendChild(errorBoundaryStyles);

// Create global error boundary instance
window.ErrorBoundary = new ErrorBoundary();
