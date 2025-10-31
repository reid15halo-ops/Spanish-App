/**
 * @fileoverview Centralized Error Handling System
 * Provides error recovery, user feedback, and error reporting capabilities
 */

import { errorMonitor } from './monitoring.js';

// ============================================================================
// Type Definitions
// ============================================================================

interface ErrorHandlerOptions {
  showToUser?: boolean;
  logToConsole?: boolean;
  reportToMonitor?: boolean;
  recoveryAction?: () => void | Promise<void>;
  retryable?: boolean;
  maxRetries?: number;
}

interface RecoveryStrategy {
  name: string;
  action: () => void | Promise<void>;
  condition?: () => boolean;
}

interface ErrorContext {
  component?: string;
  action?: string;
  user?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// ERROR CLASSES
// ============================================================================

export class AppError extends Error {
  public readonly code: string;
  public readonly context?: ErrorContext;
  public readonly isRecoverable: boolean;
  public readonly timestamp: number;

  constructor(
    message: string,
    code = 'UNKNOWN_ERROR',
    context?: ErrorContext,
    isRecoverable = true
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
    this.isRecoverable = isRecoverable;
    this.timestamp = Date.now();

    // Maintains proper stack trace for where error was thrown
    if ('captureStackTrace' in Error) {
      (Error as any).captureStackTrace(this, AppError);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'VALIDATION_ERROR', context, true);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'NETWORK_ERROR', context, true);
    this.name = 'NetworkError';
  }
}

export class StorageError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'STORAGE_ERROR', context, true);
    this.name = 'StorageError';
  }
}

export class ExerciseError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'EXERCISE_ERROR', context, true);
    this.name = 'ExerciseError';
  }
}

// ============================================================================
// ERROR HANDLER CLASS
// ============================================================================

class ErrorHandler {
  private recoveryStrategies: Map<string, RecoveryStrategy> = new Map();
  private retryAttempts: Map<string, number> = new Map();

  constructor() {
    this.registerDefaultStrategies();
  }

  /**
   * Handle an error with specified options
   */
  async handleError(
    error: Error | AppError,
    options: ErrorHandlerOptions = {}
  ): Promise<void> {
    const {
      showToUser = true,
      logToConsole = true,
      reportToMonitor = true,
      recoveryAction,
      retryable = false,
      maxRetries = 3
    } = options;

    // Log to console in development
    if (logToConsole && !(window as any).ENV?.isProduction()) {
      console.error('[ErrorHandler]', error);
    }

    // Report to error monitor
    if (reportToMonitor) {
      errorMonitor.logError({
        type: 'custom',
        message: error.message,
        stack: error.stack,
        timestamp: Date.now()
      } as any);
    }

    // Show user-friendly message
    if (showToUser) {
      this.showUserMessage(error);
    }

    // Attempt recovery
    if (recoveryAction) {
      try {
        await recoveryAction();
      } catch (recoveryError) {
        console.error('Recovery action failed:', recoveryError);
      }
    }

    // Retry if applicable
    if (retryable && error instanceof AppError) {
      await this.handleRetry(error, maxRetries);
    }

    // Try registered recovery strategies
    await this.attemptRecovery(error);
  }

  /**
   * Show user-friendly error message
   */
  private showUserMessage(error: Error | AppError): void {
    const message = this.getUserFriendlyMessage(error);
    const feedbackDiv = document.getElementById('feedback');

    if (feedbackDiv) {
      feedbackDiv.className = 'feedback error show';
      feedbackDiv.innerHTML = `
        <div class="feedback-icon">⚠️</div>
        <div class="feedback-content">
          <div class="feedback-message">${message}</div>
        </div>
      `;

      // Auto-hide after 5 seconds
      setTimeout(() => {
        feedbackDiv.classList.remove('show');
      }, 5000);
    } else {
      // Fallback to alert if no feedback element
      alert(message);
    }
  }

  /**
   * Get user-friendly error message
   */
  private getUserFriendlyMessage(error: Error | AppError): string {
    if (error instanceof AppError) {
      switch (error.code) {
        case 'NETWORK_ERROR':
          return 'Netzwerkfehler. Bitte überprüfe deine Internetverbindung.';
        case 'STORAGE_ERROR':
          return 'Fehler beim Speichern der Daten. Bitte überprüfe den verfügbaren Speicherplatz.';
        case 'VALIDATION_ERROR':
          return error.message; // Validation errors are usually user-friendly
        case 'EXERCISE_ERROR':
          return 'Fehler beim Laden der Übung. Bitte versuche es erneut.';
        default:
          return 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
      }
    }

    // Generic error
    return 'Ein unerwarteter Fehler ist aufgetreten. Bitte lade die Seite neu.';
  }

  /**
   * Register a recovery strategy
   */
  registerRecoveryStrategy(strategy: RecoveryStrategy): void {
    this.recoveryStrategies.set(strategy.name, strategy);
  }

  /**
   * Attempt recovery using registered strategies
   */
  private async attemptRecovery(error: Error | AppError): Promise<boolean> {
    for (const [name, strategy] of this.recoveryStrategies) {
      // Check if strategy is applicable
      if (strategy.condition && !strategy.condition()) {
        continue;
      }

      try {
        console.log(`[ErrorHandler] Attempting recovery strategy: ${name}`);
        await strategy.action();
        console.log(`[ErrorHandler] Recovery strategy succeeded: ${name}`);
        return true;
      } catch (recoveryError) {
        console.warn(`[ErrorHandler] Recovery strategy failed: ${name}`, recoveryError);
      }
    }

    return false;
  }

  /**
   * Handle retry logic
   */
  private async handleRetry(
    error: AppError,
    maxRetries: number
  ): Promise<void> {
    const key = `${error.code}_${error.context?.component || 'unknown'}`;
    const attempts = this.retryAttempts.get(key) || 0;

    if (attempts < maxRetries) {
      this.retryAttempts.set(key, attempts + 1);
      console.log(`[ErrorHandler] Retry attempt ${attempts + 1}/${maxRetries} for ${key}`);

      // Exponential backoff
      const delay = Math.pow(2, attempts) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));

      // The caller should implement the actual retry logic
    } else {
      this.retryAttempts.delete(key);
      console.error(`[ErrorHandler] Max retries (${maxRetries}) exceeded for ${key}`);
    }
  }

  /**
   * Register default recovery strategies
   */
  private registerDefaultStrategies(): void {
    // Reload page strategy
    this.registerRecoveryStrategy({
      name: 'reload-page',
      action: () => {
        const confirmed = confirm(
          'Ein schwerwiegender Fehler ist aufgetreten. Seite neu laden?'
        );
        if (confirmed) {
          window.location.reload();
        }
      },
      condition: () => {
        // Only offer reload for critical errors
        return false; // Don't auto-trigger
      }
    });

    // Clear cache strategy
    this.registerRecoveryStrategy({
      name: 'clear-cache',
      action: () => {
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }
        localStorage.clear();
        sessionStorage.clear();
      },
      condition: () => {
        // Only clear cache for storage errors
        return false; // Don't auto-trigger
      }
    });

    // Reset to home strategy
    this.registerRecoveryStrategy({
      name: 'reset-to-home',
      action: () => {
        window.location.hash = '#/';
      }
    });
  }

  /**
   * Wrap async function with error handling
   */
  wrapAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    options: ErrorHandlerOptions = {}
  ): T {
    return (async (...args: Parameters<T>) => {
      try {
        return await fn(...args);
      } catch (error) {
        await this.handleError(error as Error, options);
        throw error; // Re-throw after handling
      }
    }) as T;
  }

  /**
   * Wrap sync function with error handling
   */
  wrap<T extends (...args: any[]) => any>(
    fn: T,
    options: ErrorHandlerOptions = {}
  ): T {
    return ((...args: Parameters<T>) => {
      try {
        return fn(...args);
      } catch (error) {
        this.handleError(error as Error, options);
        throw error; // Re-throw after handling
      }
    }) as T;
  }

  /**
   * Create error boundary for a code block
   */
  async withErrorBoundary<T>(
    fn: () => T | Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T | undefined> {
    try {
      return await fn();
    } catch (error) {
      await this.handleError(error as Error, options);
      return undefined;
    }
  }

  /**
   * Assert condition or throw error
   */
  assert(
    condition: boolean,
    message: string,
    code = 'ASSERTION_ERROR',
    context?: ErrorContext
  ): asserts condition {
    if (!condition) {
      throw new AppError(message, code, context, false);
    }
  }

  /**
   * Validate and throw ValidationError if invalid
   */
  validate(
    condition: boolean,
    message: string,
    context?: ErrorContext
  ): asserts condition {
    if (!condition) {
      throw new ValidationError(message, context);
    }
  }
}

// ============================================================================
// ERROR RECOVERY HELPERS
// ============================================================================

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * Execute function with timeout
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  timeoutMessage = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    )
  ]);
}

/**
 * Safe execution wrapper
 */
export async function tryCatch<T>(
  fn: () => T | Promise<T>,
  fallbackValue: T,
  onError?: (error: Error) => void
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (onError) {
      onError(error as Error);
    }
    return fallbackValue;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

// Create singleton instance
export const errorHandler = new ErrorHandler();

// Export class for testing
export { ErrorHandler };

// Convenience exports
export const handleError = (error: Error, options?: ErrorHandlerOptions) =>
  errorHandler.handleError(error, options);

export const registerRecoveryStrategy = (strategy: RecoveryStrategy) =>
  errorHandler.registerRecoveryStrategy(strategy);

export const wrapAsync = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: ErrorHandlerOptions
) => errorHandler.wrapAsync(fn, options);

export const withErrorBoundary = <T>(
  fn: () => T | Promise<T>,
  options?: ErrorHandlerOptions
) => errorHandler.withErrorBoundary(fn, options);

// Export types
export type { ErrorHandlerOptions, RecoveryStrategy, ErrorContext };
