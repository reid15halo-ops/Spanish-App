/**
 * Environment Configuration System
 *
 * Manages different configurations for development, staging, and production
 */

class EnvironmentConfig {
    constructor() {
        this.currentEnv = this.detectEnvironment();
        this.config = this.loadConfig(this.currentEnv);
    }

    detectEnvironment() {
        // Detect based on hostname
        const hostname = window.location.hostname;

        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'development';
        } else if (hostname.includes('staging') || hostname.includes('preview')) {
            return 'staging';
        } else {
            return 'production';
        }
    }

    loadConfig(env) {
        const configs = {
            development: {
                environment: 'development',
                apiUrl: 'http://localhost:3000',
                enableDebugMode: true,
                enableAnalytics: false,
                enableErrorReporting: false,
                cacheStrategy: 'network-first',
                logLevel: 'debug',
                version: '1.2.1-dev',
                features: {
                    experimentalFeatures: true,
                    betaFeatures: true,
                    mockData: true
                }
            },
            staging: {
                environment: 'staging',
                apiUrl: 'https://staging-api.spanish-app.com',
                enableDebugMode: true,
                enableAnalytics: true,
                enableErrorReporting: true,
                cacheStrategy: 'cache-first',
                logLevel: 'info',
                version: '1.2.1-beta',
                features: {
                    experimentalFeatures: true,
                    betaFeatures: true,
                    mockData: false
                }
            },
            production: {
                environment: 'production',
                apiUrl: 'https://api.spanish-app.com',
                enableDebugMode: false,
                enableAnalytics: true,
                enableErrorReporting: true,
                cacheStrategy: 'cache-first',
                logLevel: 'error',
                version: '1.2.1',
                features: {
                    experimentalFeatures: false,
                    betaFeatures: false,
                    mockData: false
                }
            }
        };

        return configs[env] || configs.production;
    }

    get(key) {
        return this.config[key];
    }

    getAll() {
        return { ...this.config };
    }

    isProduction() {
        return this.currentEnv === 'production';
    }

    isDevelopment() {
        return this.currentEnv === 'development';
    }

    isStaging() {
        return this.currentEnv === 'staging';
    }

    getVersion() {
        return this.config.version;
    }

    getFeatureFlag(featureName) {
        return this.config.features[featureName] || false;
    }

    log(level, message, ...args) {
        const levels = ['debug', 'info', 'warn', 'error'];
        const configLevel = levels.indexOf(this.config.logLevel);
        const messageLevel = levels.indexOf(level);

        if (messageLevel >= configLevel) {
            console[level](`[${this.currentEnv.toUpperCase()}]`, message, ...args);
        }
    }
}

// Create global instance
window.ENV = new EnvironmentConfig();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EnvironmentConfig };
}
