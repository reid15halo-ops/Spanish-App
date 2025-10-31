/**
 * @fileoverview Consolidated Monitoring Module
 * Combines ErrorMonitor and PerformanceMonitor for comprehensive application monitoring
 * - ErrorMonitor: Captures and logs errors, crash reporting
 * - PerformanceMonitor: Tracks Core Web Vitals and performance metrics
 */

// ============================================================================
// Type Definitions
// ============================================================================

interface ErrorLogEntry {
  id: string;
  type: 'javascript' | 'promise' | 'resource' | 'api' | 'custom';
  message: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
  element?: string;
  timestamp: number;
  userAgent: string;
  url: string;
  environment: string;
  appVersion: string;
  viewport: string;
}

interface PerformanceEntry {
  name: string;
  duration: number;
  startTime: number;
  timestamp: number;
}

interface WebVitals {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
}

// ============================================================================
// ERROR MONITOR
// ============================================================================

class ErrorMonitor {
  private errors: ErrorLogEntry[] = [];
  private readonly maxErrors = 100;
  private readonly isProduction: boolean;

  constructor() {
    this.isProduction = (window as any).ENV?.isProduction() || false;
    this.init();
  }

  private init(): void {
    // Global error handler
    window.addEventListener('error', (event: ErrorEvent) => {
      this.logError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now()
      } as Partial<ErrorLogEntry>);
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      this.logError({
        type: 'promise',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        timestamp: Date.now()
      } as Partial<ErrorLogEntry>);
    });

    // Resource loading errors
    window.addEventListener('error', (event: Event) => {
      if (event.target !== window) {
        const target = event.target as HTMLElement & { src?: string; href?: string };
        this.logError({
          type: 'resource',
          message: `Failed to load: ${target.src || target.href}`,
          element: target.tagName,
          timestamp: Date.now()
        } as Partial<ErrorLogEntry>, true);
      }
    }, true);

    // Load existing errors
    this.loadErrors();

    console.log('[ErrorMonitor] Initialized');
  }

  /**
   * Log an error
   */
  logError(error: Partial<ErrorLogEntry>, capture = true): void {
    // Enhance error with context
    const enhancedError: ErrorLogEntry = {
      ...error,
      id: this.generateErrorId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      environment: (window as any).ENV?.currentEnv || 'unknown',
      appVersion: (window as any).ENV?.getVersion() || 'unknown',
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      type: error.type || 'custom',
      message: error.message || 'Unknown error',
      timestamp: error.timestamp || Date.now()
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

    // Notify user of critical errors
    if (this.isCritical(error)) {
      this.notifyUser(error);
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isCritical(error: Partial<ErrorLogEntry>): boolean {
    const criticalKeywords = ['crash', 'fatal', 'critical', 'cannot load'];
    return criticalKeywords.some(keyword =>
      error.message?.toLowerCase().includes(keyword) ?? false
    );
  }

  private notifyUser(error: Partial<ErrorLogEntry>): void {
    console.warn('Critical error occurred:', error);
    // Could show user-friendly error message here
  }

  private saveErrors(): void {
    try {
      localStorage.setItem('app_errors', JSON.stringify(this.errors));
    } catch (e) {
      console.warn('Failed to save errors:', e);
    }
  }

  private loadErrors(): void {
    try {
      const stored = localStorage.getItem('app_errors');
      if (stored) {
        this.errors = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load errors:', e);
    }
  }

  /**
   * Get all logged errors
   */
  getErrors(): ErrorLogEntry[] {
    return [...this.errors];
  }

  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.errors = [];
    localStorage.removeItem('app_errors');
  }

  /**
   * Get error statistics
   */
  getStatistics(): {
    total: number;
    byType: Record<string, number>;
    recent: number;
  } {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);

    return {
      total: this.errors.length,
      byType: this.errors.reduce((acc, err) => {
        acc[err.type] = (acc[err.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recent: this.errors.filter(e => e.timestamp > oneHourAgo).length
    };
  }
}

// ============================================================================
// PERFORMANCE MONITOR
// ============================================================================

class PerformanceMonitor {
  private metrics: PerformanceEntry[] = [];
  private vitals: WebVitals = {};
  private readonly isProduction: boolean;

  constructor() {
    this.isProduction = (window as any).ENV?.isProduction() || false;
    this.init();
  }

  private init(): void {
    if (!('performance' in window)) {
      console.warn('[PerformanceMonitor] Performance API not available');
      return;
    }

    // Track page load metrics
    window.addEventListener('load', () => {
      setTimeout(() => this.recordPageLoadMetrics(), 0);
    });

    // Track Core Web Vitals
    this.trackWebVitals();

    console.log('[PerformanceMonitor] Initialized');
  }

  private recordPageLoadMetrics(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (!navigation) return;

    this.metrics.push({
      name: 'page_load',
      duration: navigation.loadEventEnd - navigation.fetchStart,
      startTime: navigation.fetchStart,
      timestamp: Date.now()
    });

    // Record detailed timings
    this.vitals.TTFB = navigation.responseStart - navigation.fetchStart;

    if (!this.isProduction) {
      console.log('[PerformanceMonitor] Page load metrics:', {
        total: navigation.loadEventEnd - navigation.fetchStart,
        DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
        TCP: navigation.connectEnd - navigation.connectStart,
        TTFB: this.vitals.TTFB,
        DOM: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        Load: navigation.loadEventEnd - navigation.loadEventStart
      });
    }
  }

  private trackWebVitals(): void {
    // First Contentful Paint (FCP)
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.vitals.FCP = entry.startTime;
          if (!this.isProduction) {
            console.log('[PerformanceMonitor] FCP:', entry.startTime);
          }
        }
      }
    });

    try {
      paintObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('Paint observer not supported');
    }

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      this.vitals.LCP = lastEntry.renderTime || lastEntry.loadTime || 0;
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as PerformanceEventTiming;
        this.vitals.FID = fidEntry.processingStart - fidEntry.startTime;
        if (!this.isProduction) {
          console.log('[PerformanceMonitor] FID:', this.vitals.FID);
        }
      }
    });

    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observer not supported');
    }

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShift = entry as any; // LayoutShift is not in standard lib yet
        if (!layoutShift.hadRecentInput) {
          clsValue += layoutShift.value;
          this.vitals.CLS = clsValue;
        }
      }
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observer not supported');
    }
  }

  /**
   * Mark performance measurement start
   */
  mark(name: string): void {
    performance.mark(`${name}_start`);
  }

  /**
   * Mark performance measurement end and record
   */
  measure(name: string): void {
    try {
      performance.mark(`${name}_end`);
      performance.measure(name, `${name}_start`, `${name}_end`);

      const measure = performance.getEntriesByName(name)[0];
      if (measure) {
        this.metrics.push({
          name,
          duration: measure.duration,
          startTime: measure.startTime,
          timestamp: Date.now()
        });

        if (!this.isProduction) {
          console.log(`[PerformanceMonitor] ${name}: ${measure.duration.toFixed(2)}ms`);
        }
      }

      // Cleanup
      performance.clearMarks(`${name}_start`);
      performance.clearMarks(`${name}_end`);
      performance.clearMeasures(name);
    } catch (e) {
      console.warn(`Failed to measure ${name}:`, e);
    }
  }

  /**
   * Get Web Vitals
   */
  getVitals(): WebVitals {
    return { ...this.vitals };
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceEntry[] {
    return [...this.metrics];
  }

  /**
   * Get metrics statistics
   */
  getStatistics(): {
    totalMeasurements: number;
    averageDuration: number;
    byName: Record<string, { count: number; avgDuration: number }>;
  } {
    const byName: Record<string, { count: number; avgDuration: number }> = {};

    this.metrics.forEach(metric => {
      if (!byName[metric.name]) {
        byName[metric.name] = { count: 0, avgDuration: 0 };
      }
      byName[metric.name].count++;
      byName[metric.name].avgDuration =
        (byName[metric.name].avgDuration * (byName[metric.name].count - 1) + metric.duration) /
        byName[metric.name].count;
    });

    return {
      totalMeasurements: this.metrics.length,
      averageDuration: this.metrics.reduce((sum, m) => sum + m.duration, 0) / this.metrics.length || 0,
      byName
    };
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

// Create singleton instances
export const errorMonitor = new ErrorMonitor();
export const performanceMonitor = new PerformanceMonitor();

// Export classes for testing
export { ErrorMonitor, PerformanceMonitor };

// Export types
export type { ErrorLogEntry, PerformanceEntry, WebVitals };
