/**
 * Performance Monitoring System
 *
 * Tracks key performance metrics and user experience
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoad: null,
            timeToInteractive: null,
            firstPaint: null,
            firstContentfulPaint: null,
            largestContentfulPaint: null,
            cumulativeLayoutShift: 0,
            firstInputDelay: null
        };

        this.customMetrics = [];
        this.init();
    }

    init() {
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
    captureMetrics() {
        if (!window.performance) return;

        // Navigation timing
        const navigation = performance.getEntriesByType('navigation')[0];
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
    observeLayoutShifts() {
        if (!('PerformanceObserver' in window)) return;

        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        this.metrics.cumulativeLayoutShift += entry.value;
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
    observeLCP() {
        if (!('PerformanceObserver' in window)) return;

        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.largestContentfulPaint = lastEntry.renderTime || lastEntry.loadTime;
                this.saveMetrics();
            });

            observer.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (error) {
            console.warn('[PerformanceMonitor] LCP observation failed:', error);
        }
    }

    /**
     * Observe First Input Delay (FID)
     */
    observeFID() {
        if (!('PerformanceObserver' in window)) return;

        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const firstInput = entries[0];
                this.metrics.firstInputDelay = firstInput.processingStart - firstInput.startTime;
                this.saveMetrics();
            });

            observer.observe({ type: 'first-input', buffered: true });
        } catch (error) {
            console.warn('[PerformanceMonitor] FID observation failed:', error);
        }
    }

    /**
     * Mark a custom timing point
     */
    mark(name) {
        if (window.performance && performance.mark) {
            performance.mark(name);
        }
    }

    /**
     * Measure time between two marks
     */
    measure(name, startMark, endMark) {
        if (window.performance && performance.measure) {
            try {
                performance.measure(name, startMark, endMark);
                const measure = performance.getEntriesByName(name)[0];

                this.customMetrics.push({
                    name,
                    duration: measure.duration,
                    timestamp: Date.now()
                });

                this.saveMetrics();
                return measure.duration;
            } catch (error) {
                console.warn('[PerformanceMonitor] Measure failed:', error);
            }
        }
        return null;
    }

    /**
     * Track exercise response time
     */
    trackExerciseResponseTime(exerciseId, responseTime) {
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
    trackNavigation(from, to, duration) {
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
    getCoreWebVitals() {
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

    rateLCP(value) {
        if (value === null) return 'unknown';
        if (value <= 2500) return 'good';
        if (value <= 4000) return 'needs-improvement';
        return 'poor';
    }

    rateFID(value) {
        if (value === null) return 'unknown';
        if (value <= 100) return 'good';
        if (value <= 300) return 'needs-improvement';
        return 'poor';
    }

    rateCLS(value) {
        if (value === null) return 'unknown';
        if (value <= 0.1) return 'good';
        if (value <= 0.25) return 'needs-improvement';
        return 'poor';
    }

    /**
     * Get performance summary
     */
    getSummary() {
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
    groupCustomMetrics() {
        const grouped = {};
        this.customMetrics.forEach(metric => {
            const type = metric.type || 'other';
            if (!grouped[type]) {
                grouped[type] = [];
            }
            grouped[type].push(metric);
        });
        return grouped;
    }

    /**
     * Get performance recommendations
     */
    getRecommendations(vitals) {
        const recommendations = [];

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

        if (this.metrics.pageLoad > 3000) {
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
    exportReport() {
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
    saveMetrics() {
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
    loadMetrics() {
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

// Create global instance
window.PerformanceMonitor = new PerformanceMonitor();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PerformanceMonitor };
}
