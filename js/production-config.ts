/**
 * Production Configuration System
 *
 * Extends the base EnvironmentConfig with production-specific optimizations:
 * - Automatic production/development detection
 * - Console logging control
 * - Debug element management
 * - Performance optimization activation
 * - Error reporting configuration
 */

class ProductionConfig {
    private env: any;
    private initialized: boolean;
    private debugElements: Element[];

    constructor() {
        this.env = window.ENV || this.createFallbackEnv();
        this.initialized = false;
        this.debugElements = [];
    }

    /**
     * Create fallback environment if ENV not available
     */
    createFallbackEnv() {
        return {
            isProduction: () => !window.location.hostname.includes('localhost') &&
                               !window.location.hostname.includes('127.0.0.1'),
            isDevelopment: () => window.location.hostname.includes('localhost') ||
                                window.location.hostname.includes('127.0.0.1'),
            get: (key) => ({ enableDebugMode: false }[key])
        };
    }

    /**
     * Enhanced production detection with multiple indicators
     */
    static isProduction() {
        const indicators = [
            // Hostname checks
            !window.location.hostname.includes('localhost'),
            !window.location.hostname.includes('127.0.0.1'),
            !window.location.hostname.includes('192.168.'),
            !window.location.hostname.includes('10.0.'),

            // Protocol checks
            !window.location.protocol.includes('file:'),

            // Debug parameter check
            !window.location.search.includes('debug=true'),
            !window.location.search.includes('dev=true'),

            // Hash check
            !window.location.hash.includes('debug')
        ];

        // All indicators must be true for production
        return indicators.filter(i => i).length >= 6;
    }

    /**
     * Initialize production configuration
     */
    initialize() {
        if (this.initialized) {
            return;
        }

        const isProduction = ProductionConfig.isProduction();

        if (isProduction) {
            this.configureProduction();
        } else {
            this.configureDevelopment();
        }

        this.initialized = true;

        // Log initialization
        if (!isProduction) {
            console.log('%c[Production Config] Initialized', 'color: #20B2AA; font-weight: bold');
            console.log('Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');
        }
    }

    /**
     * Configure for production environment
     */
    configureProduction() {
        // 1. Disable console logging (except errors)
        this.disableConsoleLogging();

        // 2. Hide debug elements
        this.hideDebugElements();

        // 3. Enable error reporting
        this.enableErrorReporting();

        // 4. Optimize performance
        this.optimizePerformance();

        // 5. Set production-specific settings
        this.setProductionSettings();
    }

    /**
     * Configure for development environment
     */
    configureDevelopment() {
        // Enable verbose logging
        this.enableVerboseLogging();

        // Show debug info
        this.showDebugInfo();

        // Enable development tools
        this.enableDevelopmentTools();
    }

    /**
     * Disable console logging in production (keep errors)
     */
    disableConsoleLogging() {
        const originalError = console.error;
        const originalWarn = console.warn;

        // Keep error and warn, disable others
        console.log = () => {};
        console.info = () => {};
        console.debug = () => {};
        console.trace = () => {};

        // Preserve error and warn for critical issues
        console.error = originalError;
        console.warn = originalWarn;
    }

    /**
     * Enable verbose logging in development
     */
    enableVerboseLogging() {
        // Add timestamp to all console logs
        const originalLog = console.log;
        const originalInfo = console.info;
        const originalDebug = console.debug;

        console.log = (...args) => {
            originalLog(`[${new Date().toISOString()}]`, ...args);
        };

        console.info = (...args) => {
            originalInfo(`[${new Date().toISOString()}]`, ...args);
        };

        console.debug = (...args) => {
            originalDebug(`[${new Date().toISOString()}]`, ...args);
        };
    }

    /**
     * Hide debug elements in production
     */
    hideDebugElements() {
        // Hide elements with data-debug attribute
        const debugElements = document.querySelectorAll('[data-debug="true"]');
        debugElements.forEach(element => {
            (element as HTMLElement).style.display = 'none';
            this.debugElements.push(element);
        });

        // Hide debug toolbar if it exists
        const debugToolbar = document.getElementById('debug-toolbar');
        if (debugToolbar) {
            debugToolbar.style.display = 'none';
        }
    }

    /**
     * Show debug info in development
     */
    showDebugInfo() {
        // Add debug info panel
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 12px;
            font-family: monospace;
            z-index: 10000;
            max-width: 300px;
        `;

        debugPanel.innerHTML = `
            <div><strong>DEBUG MODE</strong></div>
            <div>Environment: ${this.env.currentEnv || 'development'}</div>
            <div>Version: ${this.env.getVersion ? this.env.getVersion() : '1.0.0'}</div>
            <div>Hostname: ${window.location.hostname}</div>
        `;

        // Add after DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(debugPanel);
            });
        } else {
            document.body.appendChild(debugPanel);
        }
    }

    /**
     * Enable error reporting in production
     */
    enableErrorReporting() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.reportError({
                type: 'error',
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
                error: event.error,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            });
        });

        // Promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.reportError({
                type: 'unhandledRejection',
                reason: event.reason,
                promise: event.promise,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            });
        });
    }

    /**
     * Report error (in production, could send to analytics)
     */
    reportError(errorInfo) {
        // Store in localStorage for debugging
        try {
            const errors = JSON.parse(localStorage.getItem('app-errors') || '[]');
            errors.push(errorInfo);

            // Keep only last 50 errors
            if (errors.length > 50) {
                errors.shift();
            }

            localStorage.setItem('app-errors', JSON.stringify(errors));
        } catch (e) {
            // Silently fail if localStorage is full
        }

        // In production, you could send to error tracking service
        // Example: Sentry, LogRocket, etc.
        // if (window.ErrorTracker) {
        //     window.ErrorTracker.captureException(errorInfo);
        // }
    }

    /**
     * Optimize performance for production
     */
    optimizePerformance() {
        // 1. Preconnect to external resources (if any)
        // Currently none, but example:
        // const preconnect = document.createElement('link');
        // preconnect.rel = 'preconnect';
        // preconnect.href = 'https://api.example.com';
        // document.head.appendChild(preconnect);

        // 2. Set resource hints
        const dnsPrefetch = document.createElement('link');
        dnsPrefetch.rel = 'dns-prefetch';
        dnsPrefetch.href = '//fonts.googleapis.com';
        if (document.head) {
            document.head.appendChild(dnsPrefetch);
        }

        // 3. Enable passive event listeners for better scroll performance
        if ('passive' in (EventTarget.prototype.addEventListener || {})) {
            const originalAddEventListener = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                if (type === 'touchstart' || type === 'touchmove' || type === 'wheel') {
                    if (typeof options === 'boolean') {
                        options = { capture: options, passive: true };
                    } else if (typeof options === 'object' && options.passive === undefined) {
                        options.passive = true;
                    } else if (options === undefined) {
                        options = { passive: true };
                    }
                }
                return originalAddEventListener.call(this, type, listener, options);
            };
        }
    }

    /**
     * Set production-specific settings
     */
    setProductionSettings() {
        // Set production flag
        window.__PRODUCTION__ = true;
        window.__DEV__ = false;

        // Disable right-click context menu in production (optional)
        // Commented out as it might interfere with user experience
        // document.addEventListener('contextmenu', (e) => e.preventDefault());

        // Disable text selection for better app-like feel (optional)
        // Commented out as it might interfere with accessibility
        // document.body.style.userSelect = 'none';
        // document.body.style.webkitUserSelect = 'none';
    }

    /**
     * Enable development tools
     */
    enableDevelopmentTools() {
        // Set development flags
        window.__PRODUCTION__ = false;
        window.__DEV__ = true;

        // Enable React DevTools detection (if using React in future)
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
    }

    /**
     * Get current environment
     */
    getEnvironment() {
        return ProductionConfig.isProduction() ? 'production' : 'development';
    }

    /**
     * Check if feature should be enabled
     */
    isFeatureEnabled(featureName) {
        const features = {
            'debug-panel': !ProductionConfig.isProduction(),
            'verbose-logging': !ProductionConfig.isProduction(),
            'error-reporting': ProductionConfig.isProduction(),
            'analytics': ProductionConfig.isProduction(),
            'performance-monitoring': true, // Always enabled
            'offline-support': true, // Always enabled
            'pwa': true // Always enabled
        };

        return features[featureName] !== undefined ? features[featureName] : false;
    }

    /**
     * Get stored errors (for debugging)
     */
    getStoredErrors() {
        try {
            return JSON.parse(localStorage.getItem('app-errors') || '[]');
        } catch (e) {
            return [];
        }
    }

    /**
     * Clear stored errors
     */
    clearStoredErrors() {
        try {
            localStorage.removeItem('app-errors');
            return true;
        } catch (e) {
            return false;
        }
    }
}

// Create global instance
window.ProductionConfig = new ProductionConfig();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.ProductionConfig.initialize();
    });
} else {
    window.ProductionConfig.initialize();
}

// Export for modules
export { ProductionConfig };
export default ProductionConfig;
