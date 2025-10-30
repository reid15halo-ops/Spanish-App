/**
 * Production-Aware Logger
 *
 * Provides conditional logging based on environment configuration.
 * In production, only errors and warnings are logged.
 */

class Logger {
    constructor() {
        this.env = window.ENV || { isDevelopment: () => false, get: () => 'error' };
        this.logLevel = this.env.get('logLevel') || 'error';

        // Log level hierarchy: debug < info < warn < error
        this.levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3
        };
    }

    /**
     * Check if a log level should be output
     */
    shouldLog(level) {
        const currentLevel = this.levels[this.logLevel] || this.levels.error;
        const messageLevel = this.levels[level] || this.levels.error;
        return messageLevel >= currentLevel;
    }

    /**
     * Debug logging (only in development)
     */
    debug(...args) {
        if (this.shouldLog('debug')) {
            console.log('[DEBUG]', ...args);
        }
    }

    /**
     * Info logging (development and staging)
     */
    info(...args) {
        if (this.shouldLog('info')) {
            console.log('[INFO]', ...args);
        }
    }

    /**
     * Warning logging (all environments)
     */
    warn(...args) {
        if (this.shouldLog('warn')) {
            console.warn('[WARN]', ...args);
        }
    }

    /**
     * Error logging (all environments)
     */
    error(...args) {
        if (this.shouldLog('error')) {
            console.error('[ERROR]', ...args);
        }
    }

    /**
     * Success message (only in development)
     */
    success(...args) {
        if (this.env.isDevelopment && this.env.isDevelopment()) {
            console.log('[SUCCESS]', '✅', ...args);
        }
    }

    /**
     * Group logging (only in development)
     */
    group(label) {
        if (this.env.isDevelopment && this.env.isDevelopment()) {
            console.group(label);
        }
    }

    groupEnd() {
        if (this.env.isDevelopment && this.env.isDevelopment()) {
            console.groupEnd();
        }
    }

    /**
     * Table logging (only in development)
     */
    table(data) {
        if (this.env.isDevelopment && this.env.isDevelopment()) {
            console.table(data);
        }
    }

    /**
     * Time tracking (only in development)
     */
    time(label) {
        if (this.env.isDevelopment && this.env.isDevelopment()) {
            console.time(label);
        }
    }

    timeEnd(label) {
        if (this.env.isDevelopment && this.env.isDevelopment()) {
            console.timeEnd(label);
        }
    }
}

// Create global logger instance
window.Logger = new Logger();
