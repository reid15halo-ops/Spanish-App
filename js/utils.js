/**
 * Consolidated Utilities Module
 *
 * Combines all utility modules into a single file:
 * - Logger (production-aware logging)
 * - LoadingManager (loading spinners)
 * - ErrorBoundary (error handling)
 * - DataBackupSystem (data export/import)
 * - GDPRCompliance (privacy compliance)
 * - TouchGestureManager (mobile gestures)
 * - AccessibilityManager (WCAG AAA compliance)
 * - SpanishKeyboardHelper (Spanish character input)
 * - HapticFeedbackManager (mobile haptic feedback)
 *
 * Generated: 2025-10-30T08:40:15.805Z
 */


// ====================================================================
// GLOBAL NAMESPACE
// ====================================================================

/**
 * Central namespace for Spanish Learning App
 * Reduces global pollution by organizing all globals under one object
 *
 * Usage:
 *   - window.SpanishApp.app - Main app instance
 *   - window.SpanishApp.utils - Utilities (Logger, ModalDialog, etc.)
 *   - window.SpanishApp.services - Services (DataBackup, ErrorMonitor, etc.)
 *   - window.SpanishApp.data - Exercise data and constants
 *   - window.SpanishApp.config - Configuration and environment
 *   - window.SpanishApp.features - Feature modules (Haptics, A11y, etc.)
 *
 * Note: For backward compatibility, utilities are also available at window.Logger, etc.
 */
window.SpanishApp = window.SpanishApp || {
    // Core app instance (set by app-core.js)
    app: null,

    // Utilities
    utils: {},

    // Services
    services: {},

    // Data/Constants (exercise data)
    data: {},

    // Configuration
    config: {},

    // Features
    features: {},

    // Version info
    version: '1.1.0',

    /**
     * Register a module in the namespace
     * @param {string} category - Category (utils, services, data, config, features)
     * @param {string} name - Module name
     * @param {any} module - Module instance
     */
    register(category, name, module) {
        if (!this[category]) {
            this[category] = {};
        }
        this[category][name] = module;
        window.Logger?.debug(`[SpanishApp] Registered ${category}.${name}`);
    },

    /**
     * Get a registered module
     * @param {string} category - Category
     * @param {string} name - Module name
     * @returns {any} - Module instance
     */
    get(category, name) {
        return this[category]?.[name];
    }
};


// ====================================================================
// LOGGER
// ====================================================================

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

// Register in namespace
window.SpanishApp.utils.Logger = window.Logger;


// ====================================================================
// HTML SECURITY UTILITIES
// ====================================================================

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} - Escaped HTML
 */
function escapeHtml(text) {
    if (text == null) return '';

    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

/**
 * Sanitize HTML by allowing only safe tags
 * @param {string} html - HTML to sanitize
 * @param {Array} allowedTags - Array of allowed tag names
 * @returns {string} - Sanitized HTML
 */
function sanitizeHtml(html, allowedTags = ['b', 'strong', 'i', 'em', 'u', 'br', 'p', 'span']) {
    if (html == null) return '';

    const div = document.createElement('div');
    div.innerHTML = html;

    // Remove all disallowed tags
    const allElements = div.getElementsByTagName('*');
    for (let i = allElements.length - 1; i >= 0; i--) {
        const element = allElements[i];
        if (!allowedTags.includes(element.tagName.toLowerCase())) {
            element.replaceWith(element.textContent);
        } else {
            // Remove all attributes except class
            const attrs = Array.from(element.attributes);
            attrs.forEach(attr => {
                if (attr.name !== 'class') {
                    element.removeAttribute(attr.name);
                }
            });
        }
    }

    return div.innerHTML;
}

/**
 * Create DOM element from HTML string safely
 * @param {string} html - HTML string
 * @returns {Node} - DOM node
 */
function createElementFromHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
}

// Make available globally
window.escapeHtml = escapeHtml;
window.sanitizeHtml = sanitizeHtml;
window.createElementFromHTML = createElementFromHTML;

// Register in namespace
window.SpanishApp.utils.escapeHtml = escapeHtml;
window.SpanishApp.utils.sanitizeHtml = sanitizeHtml;
window.SpanishApp.utils.createElementFromHTML = createElementFromHTML;


// ====================================================================
// LOADING
// ====================================================================

class LoadingManager {
    constructor() {
        this.activeLoaders = new Set();
    }

    /**
     * Show loading spinner in a container
     * @param {string|HTMLElement} container - Container ID or element
     * @param {string} message - Optional loading message
     * @returns {string} Loader ID for removal
     */
    show(container, message = 'Laedt...') {
        const loaderId = 'loader-' + Date.now();
        const containerEl = typeof container === 'string'
            ? document.getElementById(container)
            : container;

        if (!containerEl) {
            window.Logger?.warn('Loading container not found:', container);
            return loaderId;
        }

        // Create loader element
        const loader = document.createElement('div');
        loader.id = loaderId;
        loader.className = 'loading-overlay';
        loader.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p class="loading-message">${message}</p>
            </div>
        `;

        containerEl.appendChild(loader);
        this.activeLoaders.add(loaderId);

        return loaderId;
    }

    /**
     * Hide loading spinner
     * @param {string} loaderId - ID returned from show()
     */
    hide(loaderId) {
        if (!loaderId) return;

        const loader = document.getElementById(loaderId);
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.remove();
                this.activeLoaders.delete(loaderId);
            }, 300);
        }
    }

    /**
     * Show inline loading indicator (smaller, for buttons)
     * @param {string|HTMLElement} container
     * @param {string} message
     */
    showInline(container, message = 'Bitte warten...') {
        const containerEl = typeof container === 'string'
            ? document.getElementById(container)
            : container;

        if (!containerEl) return;

        const originalContent = containerEl.innerHTML;
        containerEl.dataset.originalContent = originalContent;
        containerEl.disabled = true;
        containerEl.innerHTML = `
            <span class="inline-spinner"></span>
            <span>${message}</span>
        `;
    }

    /**
     * Hide inline loading indicator
     * @param {string|HTMLElement} container
     */
    hideInline(container) {
        const containerEl = typeof container === 'string'
            ? document.getElementById(container)
            : container;

        if (!containerEl) return;

        const originalContent = containerEl.dataset.originalContent;
        if (originalContent) {
            containerEl.innerHTML = originalContent;
            delete containerEl.dataset.originalContent;
        }
        containerEl.disabled = false;
    }

    /**
     * Hide all active loaders
     */
    hideAll() {
        this.activeLoaders.forEach(loaderId => {
            this.hide(loaderId);
        });
    }

    /**
     * Check if any loaders are active
     */
    isLoading() {
        return this.activeLoaders.size > 0;
    }
}

// Add CSS styles for loading components
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        animation: fadeIn 0.2s ease;
    }

    .loading-overlay.fade-out {
        animation: fadeOut 0.3s ease;
    }

    .loading-spinner {
        text-align: center;
    }

    .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid #E0E0E0;
        border-top-color: #20B2AA;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 15px;
    }

    .loading-message {
        color: #666;
        font-size: 14px;
        margin: 0;
    }

    .inline-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-right: 8px;
        vertical-align: middle;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    /* Make containers relative for absolute positioning */
    #exercise-area {
        position: relative;
        min-height: 200px;
    }
`;

document.head.appendChild(loadingStyles);

// Create global loading manager instance
window.LoadingManager = new LoadingManager();

// Register in namespace
window.SpanishApp.services.LoadingManager = window.LoadingManager;



// ====================================================================
// ERROR BOUNDARY
// ====================================================================

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

// Register in namespace
window.SpanishApp.services.ErrorBoundary = window.ErrorBoundary;



// ====================================================================
// DATA BACKUP
// ====================================================================

class DataBackupSystem {
    constructor() {
        this.version = '1.0.0';
        this.backupPrefix = 'spanish-app-backup';
    }

    /**
     * Create complete backup of user data
     */
    async createBackup() {
        const backup = {
            version: this.version,
            timestamp: Date.now(),
            appVersion: window.ENV?.getVersion() || '1.0.0',
            data: {
                // Adaptive learning data
                knowledgeTracker: this.getLocalStorageData('adaptive-knowledge'),
                learningProgress: this.getLocalStorageData('learning-progress'),
                sessionHistory: this.getLocalStorageData('session-history'),

                // User settings
                settings: this.getLocalStorageData('spanish-app-settings'),

                // Exercise progress
                exerciseProgress: this.getLocalStorageData('spanish-app-progress'),

                // Statistics
                stats: this.getLocalStorageData('learning-stats'),

                // Personal patterns
                personalPatterns: this.getLocalStorageData('personal-patterns'),

                // Sidebar state
                uiState: this.getLocalStorageData('sidebar-collapsed')
            },
            checksum: null
        };

        // Calculate checksum for integrity
        backup.checksum = await this.calculateChecksum(backup.data);

        return backup;
    }

    /**
     * Export backup to JSON file
     */
    async exportBackup(encrypt = false, password = null) {
        const backup = await this.createBackup();

        let dataToExport = backup;

        if (encrypt && password) {
            dataToExport = await this.encryptBackup(backup, password);
        }

        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
            type: 'application/json'
        });

        const filename = `${this.backupPrefix}-${new Date().toISOString().split('T')[0]}.json`;
        this.downloadBlob(blob, filename);

        return {
            success: true,
            filename,
            size: blob.size,
            encrypted: encrypt
        };
    }

    /**
     * Import backup from file
     */
    async importBackup(file, password = null) {
        try {
            const text = await file.text();
            let backup = JSON.parse(text);

            // Check if encrypted
            if (backup.encrypted && password) {
                backup = await this.decryptBackup(backup, password);
            }

            // Validate backup
            const isValid = await this.validateBackup(backup);
            if (!isValid) {
                throw new Error('Invalid backup file or corrupted data');
            }

            // Check version compatibility
            if (!this.isCompatibleVersion(backup.version)) {
                throw new Error(`Incompatible backup version: ${backup.version}`);
            }

            return {
                backup,
                valid: true,
                version: backup.version,
                timestamp: backup.timestamp
            };
        } catch (error) {
            return {
                valid: false,
                error: error.message
            };
        }
    }

    /**
     * Restore data from backup
     */
    async restoreBackup(backup, options = {}) {
        const {
            overwrite = true,
            merge = false,
            confirm = true
        } = options;

        if (confirm) {
            const confirmRestore = await window.ModalDialog.confirm(
                'This will restore your data from the backup. Continue?',
                'Restore',
                'Cancel'
            );
            if (!confirmRestore) {
                return { success: false, cancelled: true };
            }
        }

        try {
            // Backup current data first (safety)
            const safetyBackup = await this.createBackup();
            sessionStorage.setItem('safety-backup', JSON.stringify(safetyBackup));

            // Restore data
            for (const [key, value] of Object.entries(backup.data)) {
                if (value !== null) {
                    if (merge && this.getLocalStorageData(key)) {
                        // Merge with existing data
                        const existing = this.getLocalStorageData(key);
                        const merged = { ...existing, ...value };
                        localStorage.setItem(this.getStorageKey(key), JSON.stringify(merged));
                    } else {
                        // Overwrite
                        localStorage.setItem(this.getStorageKey(key), JSON.stringify(value));
                    }
                }
            }

            return {
                success: true,
                restoredAt: Date.now(),
                itemsRestored: Object.keys(backup.data).length
            };
        } catch (error) {
            // Attempt to restore safety backup
            const safetyBackup = sessionStorage.getItem('safety-backup');
            if (safetyBackup) {
                window.Logger?.error('Restore failed, reverting to safety backup');
                // Could implement automatic revert here
            }

            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get localStorage data safely
     */
    getLocalStorageData(key) {
        try {
            const data = localStorage.getItem(this.getStorageKey(key));
            return data ? JSON.parse(data) : null;
        } catch (error) {
            window.Logger?.error(`Error reading ${key}:`, error);
            return null;
        }
    }

    /**
     * Get storage key (add prefix if needed)
     */
    getStorageKey(key) {
        // Some keys already have prefixes
        if (key.startsWith('spanish-app') || key.startsWith('adaptive') ||
            key.startsWith('learning') || key.startsWith('session')) {
            return key;
        }
        return key;
    }

    /**
     * Calculate checksum for data integrity
     */
    async calculateChecksum(data) {
        const str = JSON.stringify(data);
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(str);

        if (window.crypto && window.crypto.subtle) {
            const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        // Fallback simple checksum
        return this.simpleChecksum(str);
    }

    /**
     * Simple checksum fallback
     */
    simpleChecksum(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(16);
    }

    /**
     * Validate backup integrity
     */
    async validateBackup(backup) {
        if (!backup.version || !backup.timestamp || !backup.data) {
            return false;
        }

        // Verify checksum if present
        if (backup.checksum) {
            const calculatedChecksum = await this.calculateChecksum(backup.data);
            if (calculatedChecksum !== backup.checksum) {
                window.Logger?.error('Checksum mismatch - data may be corrupted');
                return false;
            }
        }

        return true;
    }

    /**
     * Check version compatibility
     */
    isCompatibleVersion(backupVersion) {
        // For now, accept all 1.x.x versions
        const major = backupVersion.split('.')[0];
        return major === '1';
    }

    /**
     * Encrypt backup (simple AES-GCM)
     */
    async encryptBackup(backup, password) {
        if (!window.crypto || !window.crypto.subtle) {
            window.Logger?.warn('Encryption not available, saving unencrypted');
            return backup;
        }

        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(JSON.stringify(backup));

            // Derive key from password
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                encoder.encode(password),
                { name: 'PBKDF2' },
                false,
                ['deriveKey']
            );

            const salt = crypto.getRandomValues(new Uint8Array(16));
            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt']
            );

            const iv = crypto.getRandomValues(new Uint8Array(12));
            const encrypted = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                data
            );

            return {
                encrypted: true,
                version: this.version,
                salt: Array.from(salt),
                iv: Array.from(iv),
                data: Array.from(new Uint8Array(encrypted))
            };
        } catch (error) {
            window.Logger?.error('Encryption failed:', error);
            return backup;
        }
    }

    /**
     * Decrypt backup
     */
    async decryptBackup(encryptedBackup, password) {
        if (!window.crypto || !window.crypto.subtle) {
            throw new Error('Decryption not available');
        }

        try {
            const encoder = new TextEncoder();
            const decoder = new TextDecoder();

            // Derive key from password
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                encoder.encode(password),
                { name: 'PBKDF2' },
                false,
                ['deriveKey']
            );

            const salt = new Uint8Array(encryptedBackup.salt);
            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['decrypt']
            );

            const iv = new Uint8Array(encryptedBackup.iv);
            const data = new Uint8Array(encryptedBackup.data);

            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                data
            );

            const decryptedText = decoder.decode(decrypted);
            return JSON.parse(decryptedText);
        } catch (error) {
            throw new Error('Decryption failed - wrong password?');
        }
    }

    /**
     * Download blob as file
     */
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Auto-backup to localStorage (weekly)
     */
    async autoBackup() {
        const lastBackup = localStorage.getItem('last-auto-backup');
        const now = Date.now();
        const weekInMs = 7 * 24 * 60 * 60 * 1000;

        if (!lastBackup || (now - parseInt(lastBackup)) > weekInMs) {
            const backup = await this.createBackup();
            localStorage.setItem('auto-backup', JSON.stringify(backup));
            localStorage.setItem('last-auto-backup', now.toString());
            window.Logger?.info('Auto-backup created');
        }
    }

    /**
     * Clear all user data (GDPR right to deletion)
     */
    async clearAllData(confirm = true) {
        if (confirm) {
            const confirmDelete = await window.ModalDialog.confirm(
                'This will permanently delete all your learning data. This cannot be undone. Continue?',
                'Delete',
                'Cancel'
            );
            if (!confirmDelete) {
                return { success: false, cancelled: true };
            }

            // Double confirmation by typing "DELETE"
            const doubleConfirm = await window.ModalDialog.prompt(
                'Type "DELETE" to confirm permanent data deletion:',
                'Type DELETE here'
            );
            if (doubleConfirm !== 'DELETE') {
                return { success: false, cancelled: true };
            }
        }

        // Create final backup before deletion
        const finalBackup = await this.exportBackup(false);

        // Clear all Spanish app data
        const keys = Object.keys(localStorage);
        const appKeys = keys.filter(key =>
            key.startsWith('spanish-app') ||
            key.startsWith('adaptive') ||
            key.startsWith('learning') ||
            key.startsWith('session') ||
            key.includes('sidebar')
        );

        appKeys.forEach(key => localStorage.removeItem(key));

        // Clear IndexedDB if used
        if (window.indexedDB) {
            indexedDB.deleteDatabase('spanish-app-db');
        }

        return {
            success: true,
            deletedKeys: appKeys.length,
            finalBackup: finalBackup
        };
    }
}

// Create global instance
window.DataBackup = new DataBackupSystem();

// Register in namespace
window.SpanishApp.services.DataBackup = window.DataBackup;

// Auto-backup on page load
if (window.ENV && !window.ENV.isDevelopment()) {
    window.addEventListener('load', () => {
        window.DataBackup.autoBackup();
    });
}



// ====================================================================
// GDPR COMPLIANCE
// ====================================================================

class GDPRCompliance {
    constructor() {
        this.consentGiven = this.loadConsent();
        this.init();
    }

    init() {
        // Show consent banner if not given
        if (!this.consentGiven) {
            this.showConsentBanner();
        }
    }

    /**
     * Show GDPR consent banner
     */
    showConsentBanner() {
        const banner = document.createElement('div');
        banner.id = 'gdpr-banner';
        banner.innerHTML = `
            <div style="position: fixed; bottom: 0; left: 0; right: 0; background: #333; color: white; padding: 20px; z-index: 10000;">
                <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
                    <div style="flex: 1; min-width: 300px;">
                        <p style="margin: 0; font-size: 14px;">
                            Diese App speichert Lerndaten lokal auf deinem Gerät. Wir sammeln keine persönlichen Daten.
                            <a href="#" id="gdpr-details" style="color: #20B2AA; text-decoration: underline;">Mehr erfahren</a>
                        </p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button id="gdpr-accept" style="background: #20B2AA; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                            Akzeptieren
                        </button>
                        <button id="gdpr-decline" style="background: transparent; color: white; border: 1px solid white; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                            Ablehnen
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        document.getElementById('gdpr-accept').addEventListener('click', () => {
            this.giveConsent();
            banner.remove();
        });

        document.getElementById('gdpr-decline').addEventListener('click', () => {
            this.declineConsent();
            banner.remove();
        });

        document.getElementById('gdpr-details').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPrivacyPolicy();
        });
    }

    /**
     * Give consent
     */
    giveConsent() {
        localStorage.setItem('gdpr-consent', JSON.stringify({
            given: true,
            timestamp: Date.now()
        }));
        this.consentGiven = true;
    }

    /**
     * Decline consent
     */
    declineConsent() {
        localStorage.setItem('gdpr-consent', JSON.stringify({
            given: false,
            timestamp: Date.now()
        }));
        this.consentGiven = false;
    }

    /**
     * Load consent
     */
    loadConsent() {
        try {
            const stored = localStorage.getItem('gdpr-consent');
            if (stored) {
                const consent = JSON.parse(stored);
                return consent.given;
            }
        } catch (error) {
            window.Logger?.error('Failed to load consent:', error);
        }
        return false;
    }

    /**
     * Right to access - Export all user data
     */
    async exerciseRightToAccess() {
        const userData = {
            exportDate: new Date().toISOString(),
            dataSubject: 'User',
            data: {
                settings: this.getStoredData('spanish-app-settings'),
                progress: this.getStoredData('spanish-app-progress'),
                adaptiveData: this.getStoredData('adaptive-knowledge'),
                learningProgress: this.getStoredData('learning-progress'),
                sessionHistory: this.getStoredData('session-history'),
                stats: this.getStoredData('learning-stats'),
                personalPatterns: this.getStoredData('personal-patterns')
            }
        };

        // Create downloadable file
        const blob = new Blob([JSON.stringify(userData, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `my-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        return userData;
    }

    /**
     * Right to deletion - Delete all user data
     */
    async exerciseRightToDeletion() {
        if (window.DataBackup) {
            return await window.DataBackup.clearAllData(true);
        }

        // Fallback
        const confirm = await window.ModalDialog.confirm(
            'Delete all your data permanently?',
            'Delete',
            'Cancel'
        );
        if (!confirm) return { cancelled: true };

        const keys = Object.keys(localStorage);
        keys.forEach(key => localStorage.removeItem(key));

        return { success: true, message: 'All data deleted' };
    }

    /**
     * Right to data portability
     */
    async exerciseRightToPortability() {
        if (window.DataBackup) {
            return await window.DataBackup.exportBackup(false);
        }

        return await this.exerciseRightToAccess();
    }

    /**
     * Get stored data safely
     */
    getStoredData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Show privacy policy
     */
    showPrivacyPolicy() {
        window.open('privacy-policy.html', '_blank');
    }
}

window.GDPR = new GDPRCompliance();

// Register in namespace
window.SpanishApp.services.GDPR = window.GDPR;



// ====================================================================
// TOUCH GESTURES
// ====================================================================

class TouchGestureManager {
    constructor(options = {}) {
        this.options = {
            minSwipeDistance: options.minSwipeDistance || 50,
            maxSwipeTime: options.maxSwipeTime || 300,
            touchTargetSize: 48, // WCAG AAA minimum
            ...options
        };

        this.touchStart = null;
        this.touchEnd = null;
        this.handlers = {
            swipeLeft: [],
            swipeRight: [],
            swipeUp: [],
            swipeDown: []
        };

        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    /**
     * Initialize touch event listeners
     */
    init() {
        // Listen for reduced motion preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            window.Logger?.info('Reduced motion preference changed:', e.matches);
        });

        // Add touch event listeners
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });

        window.Logger?.debug('Touch gesture system initialized');
    }

    /**
     * Handle touch start
     */
    handleTouchStart(e) {
        const touch = e.touches[0];
        this.touchStart = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now()
        };
    }

    /**
     * Handle touch end
     */
    handleTouchEnd(e) {
        if (!this.touchStart) return;

        const touch = e.changedTouches[0];
        this.touchEnd = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now()
        };

        this.detectSwipe();
    }

    /**
     * Detect swipe direction
     */
    detectSwipe() {
        const { touchStart, touchEnd, options } = this;

        if (!touchStart || !touchEnd) return;

        const deltaX = touchEnd.x - touchStart.x;
        const deltaY = touchEnd.y - touchStart.y;
        const deltaTime = touchEnd.time - touchStart.time;

        // Check if swipe is fast enough
        if (deltaTime > options.maxSwipeTime) {
            return;
        }

        // Check if swipe is long enough
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX < options.minSwipeDistance && absY < options.minSwipeDistance) {
            return;
        }

        // Determine direction
        let direction;
        if (absX > absY) {
            // Horizontal swipe
            direction = deltaX > 0 ? 'swipeRight' : 'swipeLeft';
        } else {
            // Vertical swipe
            direction = deltaY > 0 ? 'swipeDown' : 'swipeUp';
        }

        // Trigger handlers
        this.trigger(direction, {
            deltaX,
            deltaY,
            deltaTime,
            startX: touchStart.x,
            startY: touchStart.y,
            endX: touchEnd.x,
            endY: touchEnd.y
        });

        // Reset
        this.touchStart = null;
        this.touchEnd = null;
    }

    /**
     * Register a swipe handler
     * @param {string} direction - 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown'
     * @param {Function} callback
     */
    on(direction, callback) {
        if (this.handlers[direction]) {
            this.handlers[direction].push(callback);
            window.Logger?.debug(`Registered ${direction} handler`);
        } else {
            window.Logger?.warn(`Unknown gesture direction: ${direction}`);
        }
    }

    /**
     * Unregister a swipe handler
     */
    off(direction, callback) {
        if (this.handlers[direction]) {
            const index = this.handlers[direction].indexOf(callback);
            if (index > -1) {
                this.handlers[direction].splice(index, 1);
            }
        }
    }

    /**
     * Trigger handlers for a direction
     */
    trigger(direction, data) {
        // Respect reduced motion preference
        if (this.reducedMotion) {
            window.Logger?.debug('Swipe ignored - reduced motion enabled');
            return;
        }

        if (this.handlers[direction]) {
            this.handlers[direction].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    window.Logger?.error('Error in gesture handler:', error);
                }
            });
        }
    }

    /**
     * Check if element meets touch target size requirements (WCAG AAA)
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    isAccessibleTouchTarget(element) {
        const rect = element.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height);
        return size >= this.options.touchTargetSize;
    }

    /**
     * Make element meet touch target size requirements
     * @param {HTMLElement} element
     */
    ensureAccessibleTouchTarget(element) {
        const isAccessible = this.isAccessibleTouchTarget(element);

        if (!isAccessible) {
            // Add padding to meet minimum size
            element.style.minWidth = `${this.options.touchTargetSize}px`;
            element.style.minHeight = `${this.options.touchTargetSize}px`;
            element.style.display = 'inline-flex';
            element.style.alignItems = 'center';
            element.style.justifyContent = 'center';

            window.Logger?.debug('Enhanced touch target for accessibility:', element);
        }

        return isAccessible;
    }

    /**
     * Validate all interactive elements meet touch target requirements
     */
    validateTouchTargets() {
        const interactiveElements = document.querySelectorAll('button, a, input, [role="button"]');
        const issues = [];

        interactiveElements.forEach(element => {
            if (!this.isAccessibleTouchTarget(element)) {
                issues.push({
                    element: element,
                    current: element.getBoundingClientRect(),
                    required: this.options.touchTargetSize
                });
            }
        });

        if (issues.length > 0) {
            window.Logger?.warn(`Found ${issues.length} elements below minimum touch target size`);
        }

        return issues;
    }

    /**
     * Enable swipe navigation for exercises
     * @param {Object} callbacks
     */
    enableExerciseNavigation(callbacks) {
        // Swipe right to go to previous exercise
        this.on('swipeRight', () => {
            if (callbacks.onPrevious) {
                window.Logger?.debug('Swipe right: Previous exercise');
                callbacks.onPrevious();
            }
        });

        // Swipe left to go to next exercise
        this.on('swipeLeft', () => {
            if (callbacks.onNext) {
                window.Logger?.debug('Swipe left: Next exercise');
                callbacks.onNext();
            }
        });

        window.Logger?.info('Exercise swipe navigation enabled');
    }
}

// Create global touch gesture manager
window.TouchGestures = new TouchGestureManager();



// ====================================================================
// ACCESSIBILITY
// ====================================================================

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

// Register in namespace
window.SpanishApp.features.A11y = window.A11y;



// ====================================================================
// SPANISH KEYBOARD
// ====================================================================

class SpanishKeyboardHelper {
    constructor() {
        this.specialChars = [
            { char: 'á', label: 'a mit Akzent', alt: 'a+' },
            { char: 'é', label: 'e mit Akzent', alt: 'e+' },
            { char: 'í', label: 'i mit Akzent', alt: 'i+' },
            { char: 'ó', label: 'o mit Akzent', alt: 'o+' },
            { char: 'ú', label: 'u mit Akzent', alt: 'u+' },
            { char: 'ñ', label: 'n mit Tilde', alt: 'n+' },
            { char: '¿', label: 'Umgekehrtes Fragezeichen', alt: '?+' },
            { char: '¡', label: 'Umgekehrtes Ausrufezeichen', alt: '!+' }
        ];

        this.currentInput = null;
        this.keyboardVisible = false;
    }

    /**
     * Attach Spanish keyboard to an input field
     * @param {HTMLInputElement} input
     */
    attachToInput(input) {
        if (!input || input.tagName !== 'INPUT') {
            window.Logger?.warn('Cannot attach keyboard to non-input element');
            return;
        }

        // Don't attach if native Spanish keyboard is available
        if (this.hasNativeSpanishKeyboard()) {
            window.Logger?.debug('Native Spanish keyboard detected, helper not needed');
            return;
        }

        this.createKeyboard(input);
    }

    /**
     * Check if device has native Spanish keyboard
     */
    hasNativeSpanishKeyboard() {
        // Check for iOS/Android with international keyboard support
        const userAgent = navigator.userAgent.toLowerCase();
        const hasInternationalKeyboard =
            /iphone|ipad|ipod/.test(userAgent) ||
            /android/.test(userAgent);

        // Always show helper on desktop for consistency
        return false; // Always provide helper for better UX
    }

    /**
     * Create the Spanish character keyboard
     * @param {HTMLInputElement} input
     */
    createKeyboard(input) {
        // Check if keyboard already exists
        let keyboard = input.parentElement.querySelector('.spanish-keyboard');
        if (keyboard) {
            return keyboard;
        }

        // Create keyboard container
        keyboard = document.createElement('div');
        keyboard.className = 'spanish-keyboard';
        keyboard.setAttribute('role', 'toolbar');
        keyboard.setAttribute('aria-label', 'Spanische Sonderzeichen');

        // Create buttons for each special character
        this.specialChars.forEach((charInfo, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'spanish-char-btn';
            button.textContent = charInfo.char;
            button.setAttribute('aria-label', charInfo.label);
            button.setAttribute('title', charInfo.label);
            button.setAttribute('data-char', charInfo.char);
            button.setAttribute('tabindex', index === 0 ? '0' : '-1');

            // Insert character on click
            button.addEventListener('click', () => {
                this.insertCharacter(input, charInfo.char);
            });

            // Keyboard navigation within keyboard
            button.addEventListener('keydown', (e) => {
                this.handleKeyboardNav(e, button, keyboard);
            });

            keyboard.appendChild(button);
        });

        // Add help text
        const helpText = document.createElement('div');
        helpText.className = 'spanish-keyboard-help';
        helpText.textContent = 'Tipp: Tippe auf ein Zeichen, um es einzufuegen';
        helpText.setAttribute('role', 'status');
        helpText.setAttribute('aria-live', 'polite');
        keyboard.appendChild(helpText);

        // Insert keyboard after input
        input.parentElement.insertBefore(keyboard, input.nextSibling);

        // Show/hide keyboard based on focus
        input.addEventListener('focus', () => {
            keyboard.classList.add('visible');
            this.keyboardVisible = true;
            this.currentInput = input;
        });

        input.addEventListener('blur', (e) => {
            // Don't hide if focus moved to keyboard button
            if (!keyboard.contains(e.relatedTarget)) {
                setTimeout(() => {
                    keyboard.classList.remove('visible');
                    this.keyboardVisible = false;
                }, 200);
            }
        });

        // Add styles
        this.addStyles();

        window.Logger?.debug('Spanish keyboard attached to input');
        return keyboard;
    }

    /**
     * Insert character at cursor position
     * @param {HTMLInputElement} input
     * @param {string} char
     */
    insertCharacter(input, char) {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const value = input.value;

        // Insert character at cursor position
        input.value = value.substring(0, start) + char + value.substring(end);

        // Move cursor after inserted character
        const newPos = start + char.length;
        input.setSelectionRange(newPos, newPos);

        // Return focus to input
        input.focus();

        // Announce to screen reader
        window.A11y?.announceToScreenReader(`${char} eingefuegt`);

        // Trigger input event for any listeners
        input.dispatchEvent(new Event('input', { bubbles: true }));

        window.Logger?.debug('Character inserted:', char);
    }

    /**
     * Handle keyboard navigation within Spanish keyboard
     */
    handleKeyboardNav(e, currentButton, keyboard) {
        const buttons = Array.from(keyboard.querySelectorAll('.spanish-char-btn'));
        const currentIndex = buttons.indexOf(currentButton);

        let nextButton;

        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                nextButton = buttons[currentIndex - 1] || buttons[buttons.length - 1];
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextButton = buttons[(currentIndex + 1) % buttons.length];
                break;
            case 'Home':
                e.preventDefault();
                nextButton = buttons[0];
                break;
            case 'End':
                e.preventDefault();
                nextButton = buttons[buttons.length - 1];
                break;
            case 'Escape':
                e.preventDefault();
                this.currentInput?.focus();
                return;
        }

        if (nextButton) {
            // Update tabindex
            buttons.forEach(btn => btn.setAttribute('tabindex', '-1'));
            nextButton.setAttribute('tabindex', '0');
            nextButton.focus();
        }
    }

    /**
     * Add CSS styles for Spanish keyboard
     */
    addStyles() {
        if (document.getElementById('spanish-keyboard-styles')) {
            return;
        }

        const styles = document.createElement('style');
        styles.id = 'spanish-keyboard-styles';
        styles.textContent = `
            .spanish-keyboard {
                display: none;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 10px;
                padding: 12px;
                background: #F5F5F5;
                border-radius: 8px;
                border: 2px solid #E0E0E0;
            }

            .spanish-keyboard.visible {
                display: flex;
            }

            .spanish-char-btn {
                min-width: 48px;
                min-height: 48px;
                padding: 8px 12px;
                background: white;
                border: 2px solid #20B2AA;
                border-radius: 6px;
                font-size: 20px;
                font-weight: bold;
                color: #20B2AA;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .spanish-char-btn:hover {
                background: #20B2AA;
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(32, 178, 170, 0.3);
            }

            .spanish-char-btn:active {
                transform: translateY(0);
            }

            .spanish-char-btn:focus {
                outline: 3px solid #20B2AA;
                outline-offset: 2px;
            }

            .spanish-keyboard-help {
                width: 100%;
                text-align: center;
                font-size: 12px;
                color: #666;
                margin-top: 8px;
            }

            /* Mobile optimization */
            @media (max-width: 768px) {
                .spanish-keyboard {
                    position: sticky;
                    bottom: 0;
                    z-index: 100;
                    background: white;
                    border-top: 2px solid #E0E0E0;
                    border-radius: 12px 12px 0 0;
                    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
                }

                .spanish-char-btn {
                    flex: 1;
                    min-width: 44px;
                }
            }

            /* High contrast mode */
            body.high-contrast .spanish-char-btn {
                border: 3px solid #000;
                color: #000;
            }

            body.high-contrast .spanish-char-btn:hover,
            body.high-contrast .spanish-char-btn:focus {
                background: #000;
                color: #fff;
            }

            /* Reduced motion */
            body.reduce-motion .spanish-char-btn {
                transition: none;
            }

            body.reduce-motion .spanish-char-btn:hover {
                transform: none;
            }
        `;
        document.head.appendChild(styles);
    }

    /**
     * Enable quick access shortcuts (e.g., a+ for á)
     * @param {HTMLInputElement} input
     */
    enableShortcuts(input) {
        let lastKey = '';
        let lastTime = 0;

        input.addEventListener('keyup', (e) => {
            const currentTime = Date.now();
            const timeDiff = currentTime - lastTime;

            // If + is pressed within 500ms after a letter
            if (e.key === '+' && timeDiff < 500) {
                const shortcut = lastKey + '+';
                const charInfo = this.specialChars.find(c => c.alt === shortcut);

                if (charInfo) {
                    // Remove the letter and +
                    const value = input.value;
                    input.value = value.slice(0, -2);

                    // Insert special character
                    this.insertCharacter(input, charInfo.char);

                    window.Logger?.debug('Shortcut used:', shortcut, '→', charInfo.char);
                }
            }

            lastKey = e.key;
            lastTime = currentTime;
        });

        window.Logger?.debug('Keyboard shortcuts enabled (e.g., a+ for á)');
    }

    /**
     * Attach keyboard to all text inputs in the app
     */
    attachToAllInputs() {
        const inputs = document.querySelectorAll('input[type="text"], textarea');
        inputs.forEach(input => {
            this.attachToInput(input);
            this.enableShortcuts(input);
        });

        // Observe for dynamically added inputs
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches('input[type="text"], textarea')) {
                            this.attachToInput(node);
                            this.enableShortcuts(node);
                        }

                        // Check children
                        const inputs = node.querySelectorAll?.('input[type="text"], textarea');
                        inputs?.forEach(input => {
                            this.attachToInput(input);
                            this.enableShortcuts(input);
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        window.Logger?.success('Spanish keyboard attached to all inputs');
    }
}

// Create global Spanish keyboard helper
window.SpanishKeyboard = new SpanishKeyboardHelper();

// Auto-attach to inputs when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.SpanishKeyboard.attachToAllInputs();
    });
} else {
    window.SpanishKeyboard.attachToAllInputs();
}



// ====================================================================
// HAPTIC FEEDBACK
// ====================================================================

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
            window.ModalDialog.alert('Haptisches Feedback wird auf diesem Geraet nicht unterstuetzt.', 'warning');
            return;
        }

        if (!this.enabled) {
            window.ModalDialog.alert('Haptisches Feedback ist deaktiviert. Bitte aktivieren in den Einstellungen.', 'warning');
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

// Register in namespace
window.SpanishApp.features.Haptics = window.Haptics;

// Add to settings when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.Haptics.addToSettings();
    });
} else {
    window.Haptics.addToSettings();
}


// ====================================================================
// MODAL DIALOG SYSTEM
// ====================================================================

/**
 * Modern Modal Dialog System
 * Replaces alert() and confirm() with better UX
 */
class ModalDialog {
    constructor() {
        this.activeModal = null;
        this.injectStyles();
    }

    /**
     * Inject CSS styles for modals
     */
    injectStyles() {
        if (document.getElementById('modal-dialog-styles')) return;

        const style = document.createElement('style');
        style.id = 'modal-dialog-styles';
        style.textContent = `
            .modal-overlay {
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
                animation: fadeIn 0.2s forwards;
                backdrop-filter: blur(2px);
            }

            @keyframes fadeIn {
                to { opacity: 1; }
            }

            @keyframes slideIn {
                from {
                    transform: translateY(-20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            .modal-dialog-box {
                background: var(--bg, #fff);
                border-radius: 12px;
                padding: 24px;
                max-width: 90%;
                width: 400px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                animation: slideIn 0.3s ease-out;
            }

            .modal-dialog-content {
                margin-bottom: 24px;
                color: var(--text, #333);
                font-size: 16px;
                line-height: 1.5;
                white-space: pre-wrap;
                word-wrap: break-word;
            }

            .modal-dialog-buttons {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }

            .modal-dialog-button {
                padding: 10px 24px;
                border: none;
                border-radius: 8px;
                font-size: 15px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                min-width: 80px;
            }

            .modal-dialog-button:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            }

            .modal-dialog-button:active {
                transform: translateY(0);
            }

            .modal-dialog-button-primary {
                background: var(--primary, #007bff);
                color: white;
            }

            .modal-dialog-button-primary:hover {
                background: var(--primary-dark, #0056b3);
            }

            .modal-dialog-button-secondary {
                background: var(--bg-light, #f5f5f5);
                color: var(--text, #333);
                border: 2px solid var(--border, #ddd);
            }

            .modal-dialog-button-secondary:hover {
                background: var(--bg, #fff);
                border-color: var(--primary, #007bff);
            }

            .modal-dialog-icon {
                font-size: 32px;
                margin-bottom: 12px;
                text-align: center;
            }

            .modal-dialog-icon-info { color: #007bff; }
            .modal-dialog-icon-success { color: #28a745; }
            .modal-dialog-icon-warning { color: #ffc107; }
            .modal-dialog-icon-error { color: #dc3545; }
        `;
        document.head.appendChild(style);
    }

    /**
     * Show an alert dialog
     * @param {string} message - Message to display
     * @param {string} type - Type: 'info', 'success', 'warning', 'error'
     * @returns {Promise<void>}
     */
    alert(message, type = 'info') {
        return new Promise((resolve) => {
            this.closeActiveModal();

            const icons = {
                info: 'ℹ️',
                success: '✅',
                warning: '⚠️',
                error: '❌'
            };

            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.innerHTML = `
                <div class="modal-dialog-box" role="dialog" aria-modal="true" aria-labelledby="modal-message">
                    <div class="modal-dialog-icon modal-dialog-icon-${type}">
                        ${icons[type] || icons.info}
                    </div>
                    <div class="modal-dialog-content" id="modal-message">
                        ${this.escapeHtml(message)}
                    </div>
                    <div class="modal-dialog-buttons">
                        <button class="modal-dialog-button modal-dialog-button-primary" data-action="ok">
                            OK
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
            this.activeModal = overlay;

            // Handle button click
            const okButton = overlay.querySelector('[data-action="ok"]');
            okButton.addEventListener('click', () => {
                this.closeActiveModal();
                resolve();
            });

            // Handle ESC key
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    this.closeActiveModal();
                    resolve();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);

            // Handle overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeActiveModal();
                    resolve();
                }
            });

            // Focus the OK button
            setTimeout(() => okButton.focus(), 100);
        });
    }

    /**
     * Show a confirm dialog
     * @param {string} message - Message to display
     * @param {string} okText - Text for confirm button (default: "OK")
     * @param {string} cancelText - Text for cancel button (default: "Abbrechen")
     * @returns {Promise<boolean>} - true if confirmed, false if cancelled
     */
    confirm(message, okText = 'OK', cancelText = 'Abbrechen') {
        return new Promise((resolve) => {
            this.closeActiveModal();

            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.innerHTML = `
                <div class="modal-dialog-box" role="dialog" aria-modal="true" aria-labelledby="modal-message">
                    <div class="modal-dialog-icon modal-dialog-icon-warning">
                        ❓
                    </div>
                    <div class="modal-dialog-content" id="modal-message">
                        ${this.escapeHtml(message)}
                    </div>
                    <div class="modal-dialog-buttons">
                        <button class="modal-dialog-button modal-dialog-button-secondary" data-action="cancel">
                            ${this.escapeHtml(cancelText)}
                        </button>
                        <button class="modal-dialog-button modal-dialog-button-primary" data-action="ok">
                            ${this.escapeHtml(okText)}
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
            this.activeModal = overlay;

            // Handle button clicks
            const okButton = overlay.querySelector('[data-action="ok"]');
            const cancelButton = overlay.querySelector('[data-action="cancel"]');

            okButton.addEventListener('click', () => {
                this.closeActiveModal();
                resolve(true);
            });

            cancelButton.addEventListener('click', () => {
                this.closeActiveModal();
                resolve(false);
            });

            // Handle ESC key (cancel)
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    this.closeActiveModal();
                    resolve(false);
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);

            // Handle overlay click (cancel)
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeActiveModal();
                    resolve(false);
                }
            });

            // Focus the primary button
            setTimeout(() => okButton.focus(), 100);
        });
    }

    /**
     * Show a prompt dialog with text input
     * @param {string} message - Message to display
     * @param {string} placeholder - Placeholder text for input (default: "")
     * @param {string} defaultValue - Default value for input (default: "")
     * @returns {Promise<string|null>} - input value if confirmed, null if cancelled
     */
    prompt(message, placeholder = '', defaultValue = '') {
        return new Promise((resolve) => {
            this.closeActiveModal();

            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.innerHTML = `
                <div class="modal-dialog-box" role="dialog" aria-modal="true" aria-labelledby="modal-message">
                    <div class="modal-dialog-icon modal-dialog-icon-info">
                        💬
                    </div>
                    <div class="modal-dialog-content" id="modal-message">
                        ${this.escapeHtml(message)}
                    </div>
                    <input type="text"
                           id="modal-prompt-input"
                           placeholder="${this.escapeHtml(placeholder)}"
                           value="${this.escapeHtml(defaultValue)}"
                           style="width: 100%; padding: 10px; margin-bottom: 20px; border: 2px solid var(--border, #ddd); border-radius: 8px; font-size: 15px;">
                    <div class="modal-dialog-buttons">
                        <button class="modal-dialog-button modal-dialog-button-secondary" data-action="cancel">
                            Abbrechen
                        </button>
                        <button class="modal-dialog-button modal-dialog-button-primary" data-action="ok">
                            OK
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
            this.activeModal = overlay;

            const input = overlay.querySelector('#modal-prompt-input');
            const okButton = overlay.querySelector('[data-action="ok"]');
            const cancelButton = overlay.querySelector('[data-action="cancel"]');

            // Handle OK button click
            okButton.addEventListener('click', () => {
                const value = input.value.trim();
                this.closeActiveModal();
                resolve(value || null);
            });

            // Handle Cancel button click
            cancelButton.addEventListener('click', () => {
                this.closeActiveModal();
                resolve(null);
            });

            // Handle Enter key in input
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const value = input.value.trim();
                    this.closeActiveModal();
                    resolve(value || null);
                }
            });

            // Handle ESC key (cancel)
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    this.closeActiveModal();
                    resolve(null);
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);

            // Handle overlay click (cancel)
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeActiveModal();
                    resolve(null);
                }
            });

            // Focus the input field
            setTimeout(() => input.focus(), 100);
        });
    }

    /**
     * Show a toast notification (non-blocking)
     * @param {string} message - Message to display
     * @param {string} type - Type: 'info', 'success', 'warning', 'error'
     * @param {number} duration - Duration in ms (default: 3000)
     */
    toast(message, type = 'success', duration = 3000) {
        // Inject toast styles if not already present
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 10001;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    pointer-events: none;
                }

                .toast {
                    background: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    min-width: 250px;
                    max-width: 400px;
                    animation: slideInRight 0.3s ease-out;
                    pointer-events: auto;
                    border-left: 4px solid;
                }

                .toast-info { border-left-color: #007bff; }
                .toast-success { border-left-color: #28a745; }
                .toast-warning { border-left-color: #ffc107; }
                .toast-error { border-left-color: #dc3545; }

                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                .toast.toast-exit {
                    animation: slideOutRight 0.3s ease-in forwards;
                }

                @keyframes slideOutRight {
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }

                .toast-icon {
                    font-size: 20px;
                }

                .toast-message {
                    flex: 1;
                    color: #333;
                    font-size: 14px;
                }
            `;
            document.head.appendChild(style);
        }

        // Get or create toast container
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${this.escapeHtml(message)}</span>
        `;

        container.appendChild(toast);

        // Auto-remove after duration
        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => {
                toast.remove();
                // Remove container if empty
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 300);
        }, duration);
    }

    /**
     * Close the currently active modal
     */
    closeActiveModal() {
        if (this.activeModal) {
            this.activeModal.remove();
            this.activeModal = null;
        }
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Create global modal dialog instance
window.ModalDialog = new ModalDialog();

// Register in namespace
window.SpanishApp.utils.ModalDialog = window.ModalDialog;


