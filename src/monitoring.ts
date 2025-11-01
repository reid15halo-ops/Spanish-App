/**
 * Consolidated Monitoring Module
 *
 * Combines error monitoring and performance monitoring
 * - ErrorMonitor: Captures and logs errors, crash reporting
 * - PerformanceMonitor: Tracks Core Web Vitals and performance metrics
 */

// ====================================================================
// TYPES & INTERFACES
// ====================================================================

type ErrorType = 'javascript' | 'promise' | 'resource' | 'custom' | 'warning';
type Severity = 'low' | 'medium' | 'high';
type Rating = 'good' | 'needs-improvement' | 'poor' | 'unknown';

interface BaseError {
    type: ErrorType;
    message: string;
    timestamp: number;
    severity?: Severity;
}

export interface JavaScriptError extends BaseError {
    type: 'javascript';
    filename?: string;
    lineno?: number;
    colno?: number;
    stack?: string;
}

export interface PromiseError extends BaseError {
    type: 'promise';
    stack?: string;
}

export interface ResourceError extends BaseError {
    type: 'resource';
    element?: string;
}

export interface CustomError extends BaseError {
    type: 'custom' | 'warning';
    context?: Record<string, unknown>;
}

export type MonitoredError = JavaScriptError | PromiseError | ResourceError | CustomError;

export interface EnhancedError {
    type: ErrorType;
    message: string;
    timestamp: number;
    severity?: Severity;
    filename?: string;
    lineno?: number;
    colno?: number;
    stack?: string;
    element?: string;
    context?: Record<string, unknown>;
    id: string;
    userAgent: string;
    url: string;
    environment: string;
    appVersion: string;
    viewport: string;
}

interface ErrorStats {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    recent: EnhancedError[];
    criticalCount: number;
}

interface PerformanceMetrics {
    pageLoad: number | null;
    timeToInteractive: number | null;
    firstPaint: number | null;
    firstContentfulPaint: number | null;
    largestContentfulPaint: number | null;
    cumulativeLayoutShift: number;
    firstInputDelay: number | null;
}

interface CustomMetric {
    name?: string;
    type?: string;
    duration?: number;
    exerciseId?: string;
    responseTime?: number;
    from?: string;
    to?: string;
    timestamp: number;
}

interface CoreWebVital {
    value: number | null;
    rating: Rating;
    threshold: {
        good: number;
        needsImprovement: number;
    };
}

interface CoreWebVitals {
    LCP: CoreWebVital;
    FID: CoreWebVital;
    CLS: CoreWebVital;
}

interface PerformanceRecommendation {
    metric: string;
    issue: string;
    suggestion: string;
}

// ====================================================================
// ERROR MONITOR
// ====================================================================

class ErrorMonitor {
    private errors: EnhancedError[] = [];
    private readonly maxErrors = 100;
    private readonly isProduction: boolean;

    constructor() {
        this.isProduction = window.ENV?.isProduction() || false;
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
            });
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
            this.logError({
                type: 'promise',
                message: event.reason?.message || String(event.reason),
                stack: event.reason?.stack,
                timestamp: Date.now()
            });
        });

        // Resource loading errors
        window.addEventListener('error', (event: Event | ErrorEvent) => {
            const target = event.target as HTMLElement & { src?: string; href?: string };
            if (target && target !== window as unknown as EventTarget) {
                this.logError({
                    type: 'resource',
                    message: `Failed to load: ${target.src || target.href}`,
                    element: target.tagName,
                    timestamp: Date.now()
                });
            }
        }, true);

        // Load existing errors
        this.loadErrors();

        console.log('[ErrorMonitor] Initialized');
    }

    /**
     * Log an error
     */
    public logError(error: MonitoredError): void {
        // Enhance error with context
        const enhancedError: EnhancedError = {
            ...error,
            id: this.generateErrorId(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            environment: window.ENV?.currentEnv || 'unknown',
            appVersion: window.ENV?.getVersion() || 'unknown',
            viewport: `${window.innerWidth}x${window.innerHeight}`
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

    /**
     * Manually log custom error
     */
    public capture(message: string, context: Record<string, unknown> = {}): void {
        this.logError({
            type: 'custom',
            message,
            context,
            timestamp: Date.now()
        });
    }

    /**
     * Log warning (not an error, but noteworthy)
     */
    public warn(message: string, context: Record<string, unknown> = {}): void {
        this.logError({
            type: 'warning',
            severity: 'low',
            message,
            context,
            timestamp: Date.now()
        });
    }

    /**
     * Generate unique error ID
     */
    private generateErrorId(): string {
        return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Check if error is critical
     */
    private isCritical(error: MonitoredError): boolean {
        const criticalPatterns = [
            /Cannot read property/,
            /is not a function/,
            /undefined is not/,
            /Failed to fetch/,
            /NetworkError/
        ];

        return criticalPatterns.some(pattern =>
            pattern.test(error.message)
        );
    }

    /**
     * Notify user of critical error
     */
    private notifyUser(error: MonitoredError): void {
        // Don't spam users
        const lastNotification = localStorage.getItem('last-error-notification');
        if (lastNotification && (Date.now() - parseInt(lastNotification)) < 60000) {
            return;
        }

        localStorage.setItem('last-error-notification', Date.now().toString());
    }

    /**
     * Get error statistics
     */
    public getStats(): ErrorStats {
        const stats: ErrorStats = {
            total: this.errors.length,
            byType: {},
            bySeverity: {},
            recent: this.errors.slice(-10),
            criticalCount: 0
        };

        this.errors.forEach(error => {
            // By type
            stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;

            // By severity
            const severity = error.severity || 'medium';
            stats.bySeverity[severity] = (stats.bySeverity[severity] || 0) + 1;

            // Critical count
            if (this.isCritical(error)) {
                stats.criticalCount++;
            }
        });

        return stats;
    }

    /**
     * Get errors from specific time period
     */
    public getErrorsSince(timestamp: number): EnhancedError[] {
        return this.errors.filter(error => error.timestamp >= timestamp);
    }

    /**
     * Export errors for analysis
     */
    public exportErrors(): void {
        const data = {
            exported: new Date().toISOString(),
            appVersion: window.ENV?.getVersion() || 'unknown',
            environment: window.ENV?.currentEnv || 'unknown',
            stats: this.getStats(),
            errors: this.errors
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `error-log-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Clear all errors
     */
    public clearErrors(): void {
        this.errors = [];
        this.saveErrors();
    }

    /**
     * Save errors to localStorage
     */
    private saveErrors(): void {
        try {
            localStorage.setItem('error-log', JSON.stringify(this.errors));
        } catch (error) {
            console.error('[ErrorMonitor] Failed to save errors:', error);
        }
    }

    /**
     * Load errors from localStorage
     */
    private loadErrors(): void {
        try {
            const stored = localStorage.getItem('error-log');
            if (stored) {
                this.errors = JSON.parse(stored) as EnhancedError[];
            }
        } catch (error) {
            console.error('[ErrorMonitor] Failed to load errors:', error);
            this.errors = [];
        }
    }
}

// ====================================================================
// PERFORMANCE MONITOR
// ====================================================================

class PerformanceMonitor {
    private metrics: PerformanceMetrics = {
        pageLoad: null,
        timeToInteractive: null,
        firstPaint: null,
        firstContentfulPaint: null,
        largestContentfulPaint: null,
        cumulativeLayoutShift: 0,
        firstInputDelay: null
    };

    private customMetrics: CustomMetric[] = [];

    constructor() {
        this.init();
    }

    private init(): void {
        // Wait for page to load
        if (document.readyState === 'complete') {
            this.captureMetrics();
        } else {
            window.addEventListener('load', () => this.captureMetrics());
        }

        // Observe layout shifts (CLS)
        this.observeLayoutShifts();

        // Observe largest contentful paint (LCP)
        this.observeLCP();

        // Observe first input delay (FID)
        this.observeFID();

        console.log('[PerformanceMonitor] Initialized');
    }

    /**
     * Capture core web vitals and performance metrics
     */
    private captureMetrics(): void {
        if (!window.performance) return;

        // Navigation timing
        const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        const navigation = navigationEntries[0];
        if (navigation) {
            this.metrics.pageLoad = navigation.loadEventEnd - navigation.fetchStart;
            this.metrics.timeToInteractive = navigation.domInteractive - navigation.fetchStart;
        }

        // Paint timing
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach(entry => {
            if (entry.name === 'first-paint') {
                this.metrics.firstPaint = entry.startTime;
            } else if (entry.name === 'first-contentful-paint') {
                this.metrics.firstContentfulPaint = entry.startTime;
            }
        });

        this.saveMetrics();
        console.log('[PerformanceMonitor] Metrics captured:', this.metrics);
    }

    /**
     * Observe Cumulative Layout Shift (CLS)
     */
    private observeLayoutShifts(): void {
        if (!('PerformanceObserver' in window)) return;

        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const layoutShift = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
                    if (!layoutShift.hadRecentInput && layoutShift.value) {
                        this.metrics.cumulativeLayoutShift += layoutShift.value;
                    }
                }
                this.saveMetrics();
            });

            observer.observe({ type: 'layout-shift', buffered: true });
        } catch (error) {
            console.warn('[PerformanceMonitor] CLS observation failed:', error);
        }
    }

    /**
     * Observe Largest Contentful Paint (LCP)
     */
    private observeLCP(): void {
        if (!('PerformanceObserver' in window)) return;

        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
                if (lastEntry) {
                    this.metrics.largestContentfulPaint = lastEntry.renderTime || lastEntry.loadTime || 0;
                    this.saveMetrics();
                }
            });

            observer.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (error) {
            console.warn('[PerformanceMonitor] LCP observation failed:', error);
        }
    }

    /**
     * Observe First Input Delay (FID)
     */
    private observeFID(): void {
        if (!('PerformanceObserver' in window)) return;

        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const firstInput = entries[0] as PerformanceEntry & { processingStart?: number };
                if (firstInput && firstInput.processingStart) {
                    this.metrics.firstInputDelay = firstInput.processingStart - firstInput.startTime;
                    this.saveMetrics();
                }
            });

            observer.observe({ type: 'first-input', buffered: true });
        } catch (error) {
            console.warn('[PerformanceMonitor] FID observation failed:', error);
        }
    }

    /**
     * Mark a custom timing point
     */
    public mark(name: string): void {
        if (window.performance && performance.mark) {
            performance.mark(name);
        }
    }

    /**
     * Measure time between two marks
     */
    public measure(name: string, startMark: string, endMark: string): number | null {
        if (window.performance && performance.measure) {
            try {
                performance.measure(name, startMark, endMark);
                const measure = performance.getEntriesByName(name)[0];

                if (measure) {
                    this.customMetrics.push({
                        name,
                        duration: measure.duration,
                        timestamp: Date.now()
                    });

                    this.saveMetrics();
                    return measure.duration;
                }
            } catch (error) {
                console.warn('[PerformanceMonitor] Measure failed:', error);
            }
        }
        return null;
    }

    /**
     * Track exercise response time
     */
    public trackExerciseResponseTime(exerciseId: string, responseTime: number): void {
        this.customMetrics.push({
            type: 'exercise_response',
            exerciseId,
            responseTime,
            timestamp: Date.now()
        });

        this.saveMetrics();
    }

    /**
     * Track navigation timing
     */
    public trackNavigation(from: string, to: string, duration: number): void {
        this.customMetrics.push({
            type: 'navigation',
            from,
            to,
            duration,
            timestamp: Date.now()
        });

        this.saveMetrics();
    }

    /**
     * Get Core Web Vitals assessment
     */
    public getCoreWebVitals(): CoreWebVitals {
        return {
            LCP: {
                value: this.metrics.largestContentfulPaint,
                rating: this.rateLCP(this.metrics.largestContentfulPaint),
                threshold: { good: 2500, needsImprovement: 4000 }
            },
            FID: {
                value: this.metrics.firstInputDelay,
                rating: this.rateFID(this.metrics.firstInputDelay),
                threshold: { good: 100, needsImprovement: 300 }
            },
            CLS: {
                value: this.metrics.cumulativeLayoutShift,
                rating: this.rateCLS(this.metrics.cumulativeLayoutShift),
                threshold: { good: 0.1, needsImprovement: 0.25 }
            }
        };
    }

    private rateLCP(value: number | null): Rating {
        if (value === null) return 'unknown';
        if (value <= 2500) return 'good';
        if (value <= 4000) return 'needs-improvement';
        return 'poor';
    }

    private rateFID(value: number | null): Rating {
        if (value === null) return 'unknown';
        if (value <= 100) return 'good';
        if (value <= 300) return 'needs-improvement';
        return 'poor';
    }

    private rateCLS(value: number | null): Rating {
        if (value === null) return 'unknown';
        if (value <= 0.1) return 'good';
        if (value <= 0.25) return 'needs-improvement';
        return 'poor';
    }

    /**
     * Get performance summary
     */
    public getSummary() {
        const vitals = this.getCoreWebVitals();

        return {
            coreWebVitals: vitals,
            metrics: this.metrics,
            customMetrics: {
                total: this.customMetrics.length,
                byType: this.groupCustomMetrics(),
                recent: this.customMetrics.slice(-10)
            },
            recommendations: this.getRecommendations(vitals)
        };
    }

    /**
     * Group custom metrics by type
     */
    private groupCustomMetrics(): Record<string, CustomMetric[]> {
        const grouped: Record<string, CustomMetric[]> = {};
        this.customMetrics.forEach(metric => {
            const type = metric.type || 'other';
            if (!grouped[type]) {
                grouped[type] = [];
            }
            grouped[type]!.push(metric);
        });
        return grouped;
    }

    /**
     * Get performance recommendations
     */
    private getRecommendations(vitals: CoreWebVitals): PerformanceRecommendation[] {
        const recommendations: PerformanceRecommendation[] = [];

        if (vitals.LCP.rating === 'poor') {
            recommendations.push({
                metric: 'LCP',
                issue: 'Slow largest contentful paint',
                suggestion: 'Optimize images, reduce render-blocking resources'
            });
        }

        if (vitals.FID.rating === 'poor') {
            recommendations.push({
                metric: 'FID',
                issue: 'Slow first input delay',
                suggestion: 'Reduce JavaScript execution time, split long tasks'
            });
        }

        if (vitals.CLS.rating === 'poor') {
            recommendations.push({
                metric: 'CLS',
                issue: 'High cumulative layout shift',
                suggestion: 'Add size attributes to images, avoid dynamic content injection'
            });
        }

        if (this.metrics.pageLoad && this.metrics.pageLoad > 3000) {
            recommendations.push({
                metric: 'Page Load',
                issue: 'Slow page load time',
                suggestion: 'Enable compression, minimize CSS/JS, use service worker caching'
            });
        }

        return recommendations;
    }

    /**
     * Export performance report
     */
    public exportReport(): void {
        const report = {
            exported: new Date().toISOString(),
            appVersion: window.ENV?.getVersion() || 'unknown',
            userAgent: navigator.userAgent,
            summary: this.getSummary()
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Save metrics to localStorage
     */
    private saveMetrics(): void {
        try {
            localStorage.setItem('performance-metrics', JSON.stringify({
                metrics: this.metrics,
                customMetrics: this.customMetrics.slice(-100) // Keep last 100
            }));
        } catch (error) {
            console.error('[PerformanceMonitor] Failed to save metrics:', error);
        }
    }

    /**
     * Load metrics from localStorage
     */
    private loadMetrics(): void {
        try {
            const stored = localStorage.getItem('performance-metrics');
            if (stored) {
                const data = JSON.parse(stored);
                this.customMetrics = data.customMetrics || [];
            }
        } catch (error) {
            console.error('[PerformanceMonitor] Failed to load metrics:', error);
        }
    }
}

// ====================================================================
// GLOBAL INSTANCES
// ====================================================================

// Create global instances
window.ErrorMonitor = Object.assign(new ErrorMonitor(), { ErrorMonitor });
window.PerformanceMonitor = Object.assign(new PerformanceMonitor(), { PerformanceMonitor });
