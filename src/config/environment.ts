/**
 * Environment Configuration System
 *
 * Manages different configurations for development, staging, and production
 */

type Environment = 'development' | 'staging' | 'production';
type CacheStrategy = 'network-first' | 'cache-first';
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface FeatureFlags {
    experimentalFeatures: boolean;
    betaFeatures: boolean;
    mockData: boolean;
}

interface EnvironmentConfiguration {
    environment: Environment;
    apiUrl: string;
    enableDebugMode: boolean;
    enableAnalytics: boolean;
    enableErrorReporting: boolean;
    cacheStrategy: CacheStrategy;
    logLevel: LogLevel;
    version: string;
    features: FeatureFlags;
}

class EnvironmentConfig {
    public readonly currentEnv: Environment;
    private readonly config: EnvironmentConfiguration;

    constructor() {
        this.currentEnv = this.detectEnvironment();
        this.config = this.loadConfig(this.currentEnv);
    }

    private detectEnvironment(): Environment {
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

    private loadConfig(env: Environment): EnvironmentConfiguration {
        const configs: Record<Environment, EnvironmentConfiguration> = {
            development: {
                environment: 'development',
                apiUrl: 'http://localhost:3000',
                enableDebugMode: true,
                enableAnalytics: false,
                enableErrorReporting: false,
                cacheStrategy: 'network-first',
                logLevel: 'debug',
                version: '1.0.0-dev',
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
                version: '1.0.0-beta',
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
                version: '1.0.0',
                features: {
                    experimentalFeatures: false,
                    betaFeatures: false,
                    mockData: false
                }
            }
        };

        return configs[env];
    }

    public get<K extends keyof EnvironmentConfiguration>(key: K): EnvironmentConfiguration[K] {
        return this.config[key];
    }

    public getAll(): EnvironmentConfiguration {
        return { ...this.config };
    }

    public isProduction(): boolean {
        return this.currentEnv === 'production';
    }

    public isDevelopment(): boolean {
        return this.currentEnv === 'development';
    }

    public isStaging(): boolean {
        return this.currentEnv === 'staging';
    }

    public getVersion(): string {
        return this.config.version;
    }

    public getFeatureFlag<K extends keyof FeatureFlags>(featureName: K): boolean {
        return this.config.features[featureName] || false;
    }

    public log(level: LogLevel, message: string, ...args: unknown[]): void {
        const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
        const configLevel = levels.indexOf(this.config.logLevel);
        const messageLevel = levels.indexOf(level);

        if (messageLevel >= configLevel) {
            console[level](`[${this.currentEnv.toUpperCase()}]`, message, ...args);
        }
    }
}

// Create global instance
window.ENV = new EnvironmentConfig();
