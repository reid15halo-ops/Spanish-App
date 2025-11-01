/**
 * Production Configuration System - TypeScript Version
 *
 * Simplified migration with core production/development detection and configuration
 */

// ====================================================================
// TYPES & INTERFACES
// ====================================================================

interface FallbackEnv {
    isProduction: () => boolean;
    isDevelopment: () => boolean;
    get: (key: string) => any;
    currentEnv?: string;
    getVersion?: () => string;
}

// ====================================================================
// PRODUCTION CONFIG
// ====================================================================

class ProductionConfig {
    private env: FallbackEnv;
    private initialized = false;
    private debugElements: Element[] = [];

    constructor() {
        this.env = window.ENV || this.createFallbackEnv();
    }

    private createFallbackEnv(): FallbackEnv {
        return {
            isProduction: () => !window.location.hostname.includes('localhost') &&
                               !window.location.hostname.includes('127.0.0.1'),
            isDevelopment: () => window.location.hostname.includes('localhost') ||
                                window.location.hostname.includes('127.0.0.1'),
            get: (key: string) => ({ enableDebugMode: false }[key])
        };
    }

    public static isProduction(): boolean {
        const indicators = [
            !window.location.hostname.includes('localhost'),
            !window.location.hostname.includes('127.0.0.1'),
            !window.location.hostname.includes('192.168.'),
            !window.location.hostname.includes('10.0.'),
            !window.location.protocol.includes('file:'),
            !window.location.search.includes('debug=true'),
            !window.location.search.includes('dev=true'),
            !window.location.hash.includes('debug')
        ];

        return indicators.filter(i => i).length >= 6;
    }

    public initialize(): void {
        if (this.initialized) return;

        const isProduction = ProductionConfig.isProduction();

        if (isProduction) {
            this.configureProduction();
        } else {
            this.configureDevelopment();
        }

        this.initialized = true;

        if (!isProduction) {
            console.log('%c[Production Config] Initialized', 'color: #20B2AA; font-weight: bold');
            console.log('Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');
        }
    }

    private configureProduction(): void {
        this.disableConsoleLogging();
        this.hideDebugElements();
        this.enableErrorReporting();
        this.optimizePerformance();
        this.setProductionSettings();
    }

    private configureDevelopment(): void {
        this.enableVerboseLogging();
        this.showDebugInfo();
        this.enableDevelopmentTools();
    }

    private disableConsoleLogging(): void {
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = () => {};
        console.info = () => {};
        console.debug = () => {};
        console.trace = () => {};

        console.error = originalError;
        console.warn = originalWarn;
    }

    private enableVerboseLogging(): void {
        const originalLog = console.log;
        const originalInfo = console.info;
        const originalDebug = console.debug;

        console.log = (...args: any[]) => {
            originalLog(`[${new Date().toISOString()}]`, ...args);
        };

        console.info = (...args: any[]) => {
            originalInfo(`[${new Date().toISOString()}]`, ...args);
        };

        console.debug = (...args: any[]) => {
            originalDebug(`[${new Date().toISOString()}]`, ...args);
        };
    }

    private hideDebugElements(): void {
        const debugElements = document.querySelectorAll('[data-debug="true"]');
        debugElements.forEach(element => {
            (element as HTMLElement).style.display = 'none';
            this.debugElements.push(element);
        });

        const debugToolbar = document.getElementById('debug-toolbar');
        if (debugToolbar) {
            debugToolbar.style.display = 'none';
        }
    }

    private showDebugInfo(): void {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.style.cssText = `
            position: fixed; bottom: 10px; right: 10px;
            background: rgba(0, 0, 0, 0.8); color: white;
            padding: 10px 15px; border-radius: 5px;
            font-size: 12px; font-family: monospace; z-index: 10000;
        `;

        debugPanel.innerHTML = `
            <div><strong>DEBUG MODE</strong></div>
            <div>Environment: ${this.env.currentEnv || 'development'}</div>
            <div>Version: ${this.env.getVersion ? this.env.getVersion() : '1.0.0'}</div>
            <div>Hostname: ${window.location.hostname}</div>
        `;

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => document.body.appendChild(debugPanel));
        } else {
            document.body.appendChild(debugPanel);
        }
    }

    private enableErrorReporting(): void {
        // Error reporting integration placeholder
    }

    private optimizePerformance(): void {
        // Performance optimizations placeholder
    }

    private setProductionSettings(): void {
        window.__DEV__ = false;
    }

    private enableDevelopmentTools(): void {
        window.__DEV__ = true;
    }
}

// Initialize automatically
const prodConfig = new ProductionConfig();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => prodConfig.initialize());
} else {
    prodConfig.initialize();
}

window.ProductionConfig = prodConfig;
