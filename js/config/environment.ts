/**
 * Environment Configuration System
 *
 * Manages different configurations for development, staging, and production
 * Migrated to TypeScript for type safety and better developer experience
 */

import type { EnvironmentConfig as IEnvironmentConfig, LogLevel } from '../../types/core';

/**
 * Environment type
 */
type Environment = 'development' | 'staging' | 'production';

/**
 * Feature flags configuration
 */
interface FeatureFlags {
  experimentalFeatures: boolean;
  betaFeatures: boolean;
  mockData: boolean;
}

/**
 * Cache strategy for Service Worker
 */
type CacheStrategy = 'network-first' | 'cache-first' | 'network-only' | 'cache-only';

/**
 * Complete environment configuration object
 */
interface EnvConfig {
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

/**
 * Environment Configuration Class
 * Provides environment-specific configuration and utilities
 */
class EnvironmentConfig {
  public readonly currentEnv: Environment;
  private readonly config: EnvConfig;

  constructor() {
    this.currentEnv = this.detectEnvironment();
    this.config = this.loadConfig(this.currentEnv);
  }

  /**
   * Detect current environment based on hostname
   */
  private detectEnvironment(): Environment {
    const hostname = window.location.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    } else if (hostname.includes('staging') || hostname.includes('preview')) {
      return 'staging';
    } else {
      return 'production';
    }
  }

  /**
   * Load configuration for specific environment
   */
  private loadConfig(env: Environment): EnvConfig {
    const configs: Record<Environment, EnvConfig> = {
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

    return configs[env] || configs.production;
  }

  /**
   * Get specific configuration value by key
   */
  public get<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
    return this.config[key];
  }

  /**
   * Get all configuration as a new object (defensive copy)
   */
  public getAll(): EnvConfig {
    return { ...this.config };
  }

  /**
   * Check if running in production
   */
  public isProduction(): boolean {
    return this.currentEnv === 'production';
  }

  /**
   * Check if running in development
   */
  public isDevelopment(): boolean {
    return this.currentEnv === 'development';
  }

  /**
   * Check if running in staging
   */
  public isStaging(): boolean {
    return this.currentEnv === 'staging';
  }

  /**
   * Get current version string
   */
  public getVersion(): string {
    return this.config.version;
  }

  /**
   * Get feature flag value
   */
  public getFeatureFlag(featureName: keyof FeatureFlags): boolean {
    return this.config.features[featureName] || false;
  }

  /**
   * Log message with environment-specific log level filtering
   */
  public log(level: LogLevel, message: string, ...args: any[]): void {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const configLevel = levels.indexOf(this.config.logLevel);
    const messageLevel = levels.indexOf(level);

    if (messageLevel >= configLevel) {
      const consoleMethod = level === 'success' ? 'info' : level;
      if (consoleMethod in console) {
        (console as any)[consoleMethod](`[${this.currentEnv.toUpperCase()}]`, message, ...args);
      }
    }
  }
}

// Create global instance and attach to window
const envInstance = new EnvironmentConfig();

// Declare global type for window.ENV
declare global {
  interface Window {
    ENV: EnvironmentConfig;
  }
}

// Attach to window for backwards compatibility
window.ENV = envInstance;

// Export for ES modules
export { EnvironmentConfig, type EnvConfig, type FeatureFlags, type Environment, type CacheStrategy };
export default envInstance;
