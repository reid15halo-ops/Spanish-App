/**
 * Performance Optimization System
 *
 * Provides:
 * - Lazy loading for exercises
 * - Smart caching strategies
 * - Memory management
 * - Resource optimization
 * - Performance monitoring
 */

class PerformanceOptimizer {
    private cache: Map<string, any>;
    private cacheSize: number;
    private maxCacheSize: number;
    private preloadedExercises: Set<number>;
    private initialized: boolean;
    private metrics: {
        renderTime: number[];
        cacheHits: number;
        cacheMisses: number;
        memoryUsage: any[];
    };

    constructor() {
        this.cache = new Map();
        this.cacheSize = 0;
        this.maxCacheSize = 10 * 1024 * 1024; // 10MB
        this.preloadedExercises = new Set();
        this.initialized = false;

        // Performance metrics
        this.metrics = {
            renderTime: [],
            cacheHits: 0,
            cacheMisses: 0,
            memoryUsage: []
        };
    }

    /**
     * Initialize performance optimizations
     */
    initialize() {
        if (this.initialized) {
            return;
        }

        // 1. Implement lazy loading
        this.setupLazyLoading();

        // 2. Enable smart caching
        this.enableSmartCaching();

        // 3. Setup memory management
        this.setupMemoryManagement();

        // 4. Optimize resources
        this.optimizeResources();

        // 5. Monitor performance
        this.setupPerformanceMonitoring();

        this.initialized = true;

        if (window.Logger) {
            window.Logger.info('Performance optimizations initialized');
        }
    }

    /**
     * Setup lazy loading for exercises
     */
    setupLazyLoading() {
        // Create lazy exercise loader
        (window as any).LazyExerciseLoader = new LazyExerciseLoader();

        if (window.Logger && window.__DEV__) {
            window.Logger.debug('Lazy loading enabled');
        }
    }

    /**
     * Enable smart caching for exercise data
     */
    enableSmartCaching() {
        // Cache frequently accessed data
        this.cacheExerciseData();

        // Setup cache eviction policy (LRU)
        this.setupCacheEviction();

        if (window.Logger && window.__DEV__) {
            window.Logger.debug('Smart caching enabled');
        }
    }

    /**
     * Cache exercise data intelligently
     */
    cacheExerciseData() {
        // Don't cache everything, only what's needed
        const currentExerciseIndex = window.SpanishApp?.currentExerciseIndex || 0;

        // Cache current + next 3 exercises
        this.preloadExercises(currentExerciseIndex, 3);
    }

    /**
     * Preload exercises around current index
     */
    preloadExercises(currentIndex, range = 2) {
        try {
            const allExercises = window.SpanishApp?.allExercises || [];

            const start = Math.max(0, currentIndex - 1);
            const end = Math.min(allExercises.length, currentIndex + range);

            for (let i = start; i < end; i++) {
                if (!this.preloadedExercises.has(i)) {
                    const exercise = allExercises[i];
                    if (exercise) {
                        this.cacheItem(`exercise_${i}`, exercise);
                        this.preloadedExercises.add(i);
                    }
                }
            }

            // Remove old preloaded exercises to save memory
            this.cleanupOldPreloads(currentIndex, range);

        } catch (e) {
            if (window.Logger && window.__DEV__) {
                window.Logger.error('Preload failed:', e);
            }
        }
    }

    /**
     * Cleanup old preloaded exercises
     */
    cleanupOldPreloads(currentIndex, range) {
        const toRemove = [];

        this.preloadedExercises.forEach(index => {
            if (Math.abs(index - currentIndex) > range + 2) {
                toRemove.push(index);
            }
        });

        toRemove.forEach(index => {
            this.cache.delete(`exercise_${index}`);
            this.preloadedExercises.delete(index);
        });
    }

    /**
     * Cache item with size tracking
     */
    cacheItem(key, value) {
        const serialized = JSON.stringify(value);
        const size = new Blob([serialized]).size;

        // Check if we need to evict
        if (this.cacheSize + size > this.maxCacheSize) {
            this.evictCache(size);
        }

        this.cache.set(key, {
            value: value,
            size: size,
            timestamp: Date.now(),
            accessCount: 0
        });

        this.cacheSize += size;
    }

    /**
     * Get item from cache
     */
    getCachedItem(key) {
        const item = this.cache.get(key);

        if (item) {
            item.accessCount++;
            item.timestamp = Date.now();
            this.metrics.cacheHits++;
            return item.value;
        }

        this.metrics.cacheMisses++;
        return null;
    }

    /**
     * Evict cache items to make space (LRU policy)
     */
    evictCache(requiredSpace) {
        const entries = Array.from(this.cache.entries());

        // Sort by least recently used
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

        let freedSpace = 0;

        for (const [key, item] of entries) {
            if (freedSpace >= requiredSpace) {
                break;
            }

            this.cache.delete(key);
            this.cacheSize -= item.size;
            freedSpace += item.size;

            // Remove from preloaded set if it's an exercise
            if (key.startsWith('exercise_')) {
                const index = parseInt(key.split('_')[1]);
                this.preloadedExercises.delete(index);
            }
        }
    }

    /**
     * Setup cache eviction policy
     */
    setupCacheEviction() {
        // Periodically check cache size and evict if needed
        setInterval(() => {
            if (this.cacheSize > this.maxCacheSize * 0.8) {
                // Evict 20% of cache when reaching 80% capacity
                this.evictCache(this.maxCacheSize * 0.2);
            }
        }, 60000); // Check every minute
    }

    /**
     * Setup memory management
     */
    setupMemoryManagement() {
        // Monitor memory usage
        if ((performance as any).memory) {
            setInterval(() => {
                this.checkMemoryUsage();
            }, 30000); // Check every 30 seconds
        }

        // Clear cache on visibility change (when tab is hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.reduceCacheSize();
            }
        });
    }

    /**
     * Check memory usage
     */
    checkMemoryUsage() {
        const perfMemory = (performance as any).memory;
        if (!perfMemory) {
            return;
        }

        const usage = {
            used: perfMemory.usedJSHeapSize,
            total: perfMemory.totalJSHeapSize,
            limit: perfMemory.jsHeapSizeLimit,
            percentage: (perfMemory.usedJSHeapSize / perfMemory.jsHeapSizeLimit) * 100,
            timestamp: Date.now()
        };

        this.metrics.memoryUsage.push(usage);

        // Keep only last 100 measurements
        if (this.metrics.memoryUsage.length > 100) {
            this.metrics.memoryUsage.shift();
        }

        // If memory usage is high (>70%), reduce cache
        if (usage.percentage > 70) {
            this.reduceCacheSize();

            if (window.Logger && window.__DEV__) {
                window.Logger.warn('High memory usage detected, reducing cache');
            }
        }
    }

    /**
     * Reduce cache size to free memory
     */
    reduceCacheSize() {
        // Evict 50% of cache
        this.evictCache(this.maxCacheSize * 0.5);
    }

    /**
     * Optimize resources
     */
    optimizeResources() {
        // 1. Defer non-critical scripts (if any)
        this.deferNonCriticalScripts();

        // 2. Optimize images (if any)
        this.optimizeImages();

        // 3. Enable resource hints
        this.enableResourceHints();
    }

    /**
     * Defer non-critical scripts
     */
    deferNonCriticalScripts() {
        // Mark scripts as defer if they're not critical
        const scripts = document.querySelectorAll('script[data-defer="true"]');

        scripts.forEach(script => {
            (script as HTMLScriptElement).defer = true;
        });
    }

    /**
     * Optimize images
     */
    optimizeImages() {
        // Add loading="lazy" to images
        const images = document.querySelectorAll('img:not([loading])');

        images.forEach(img => {
            (img as HTMLImageElement).loading = 'lazy';
        });

        // Use IntersectionObserver for better lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target as HTMLImageElement;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Enable resource hints
     */
    enableResourceHints() {
        // Add preconnect for external resources (if any)
        const preconnects = [
            // Add external domains here if needed
        ];

        preconnects.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            document.head.appendChild(link);
        });
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor exercise render time
        this.monitorRenderPerformance();

        // Monitor navigation timing
        this.monitorNavigationTiming();

        // Report performance metrics periodically
        if (window.__DEV__) {
            setInterval(() => {
                this.reportMetrics();
            }, 60000); // Report every minute in dev
        }
    }

    /**
     * Monitor render performance
     */
    monitorRenderPerformance() {
        // Wrap the render function to measure performance
        if (window.SpanishApp && window.SpanishApp.renderCurrentExercise) {
            const originalRender = window.SpanishApp.renderCurrentExercise;

            window.SpanishApp.renderCurrentExercise = function(...args) {
                const startTime = performance.now();

                const result = originalRender.apply(this, args);

                const endTime = performance.now();
                const renderTime = endTime - startTime;

                window.PerformanceOptimizer?.recordRenderTime(renderTime);

                return result;
            };
        }
    }

    /**
     * Record render time
     */
    recordRenderTime(time) {
        this.metrics.renderTime.push(time);

        // Keep only last 100 measurements
        if (this.metrics.renderTime.length > 100) {
            this.metrics.renderTime.shift();
        }

        // Warn if render time is slow
        if (time > 100 && window.Logger && window.__DEV__) {
            window.Logger.warn(`Slow render detected: ${time.toFixed(2)}ms`);
        }
    }

    /**
     * Monitor navigation timing
     */
    monitorNavigationTiming() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

                if (timing) {
                    const metrics = {
                        domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
                        loadComplete: timing.loadEventEnd - timing.loadEventStart,
                        domInteractive: timing.domInteractive - timing.fetchStart,
                        totalTime: timing.loadEventEnd - timing.fetchStart
                    };

                    if (window.Logger && window.__DEV__) {
                        window.Logger.info('Navigation Timing:', metrics);
                    }
                }
            }, 0);
        });
    }

    /**
     * Report performance metrics
     */
    reportMetrics() {
        const avgRenderTime = this.metrics.renderTime.length > 0
            ? this.metrics.renderTime.reduce((a, b) => a + b, 0) / this.metrics.renderTime.length
            : 0;

        const cacheHitRate = this.metrics.cacheHits + this.metrics.cacheMisses > 0
            ? (this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses)) * 100
            : 0;

        const perfMemory = (performance as any).memory;
        const report = {
            averageRenderTime: avgRenderTime.toFixed(2) + 'ms',
            cacheHitRate: cacheHitRate.toFixed(1) + '%',
            cacheSize: (this.cacheSize / 1024).toFixed(2) + 'KB',
            cachedItems: this.cache.size,
            memoryUsage: perfMemory ? {
                used: (perfMemory.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB',
                total: (perfMemory.totalJSHeapSize / 1024 / 1024).toFixed(2) + 'MB',
                percentage: ((perfMemory.usedJSHeapSize / perfMemory.jsHeapSizeLimit) * 100).toFixed(1) + '%'
            } : 'Not available'
        };

        if (window.Logger) {
            window.Logger.info('Performance Metrics:', report);
        }

        return report;
    }

    /**
     * Get current metrics
     */
    getMetrics() {
        return this.reportMetrics();
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        this.cacheSize = 0;
        this.preloadedExercises.clear();

        if (window.Logger) {
            window.Logger.info('Cache cleared');
        }
    }
}

/**
 * Lazy Exercise Loader
 * Loads only current and nearby exercises
 */
class LazyExerciseLoader {
    private preloadRange: number;

    constructor() {
        this.preloadRange = 2; // Preload 2 exercises ahead
    }

    /**
     * Load exercises for current index
     */
    loadExercises(currentIndex, allExercises) {
        if (!allExercises || allExercises.length === 0) {
            return [];
        }

        const start = Math.max(0, currentIndex - 1);
        const end = Math.min(allExercises.length, currentIndex + this.preloadRange + 1);

        return allExercises.slice(start, end);
    }

    /**
     * Get current exercise
     */
    getCurrentExercise(currentIndex, allExercises) {
        if (!allExercises || currentIndex < 0 || currentIndex >= allExercises.length) {
            return null;
        }

        return allExercises[currentIndex];
    }

    /**
     * Preload next exercises
     */
    preloadNext(currentIndex, allExercises) {
        const exercises = [];
        const end = Math.min(allExercises.length, currentIndex + this.preloadRange + 1);

        for (let i = currentIndex + 1; i < end; i++) {
            exercises.push(allExercises[i]);
        }

        return exercises;
    }

    /**
     * Set preload range
     */
    setPreloadRange(range) {
        this.preloadRange = Math.max(1, Math.min(5, range));
    }
}

// Create global instance
window.PerformanceOptimizer = new PerformanceOptimizer();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.PerformanceOptimizer.initialize();
    });
} else {
    window.PerformanceOptimizer.initialize();
}

// Export for modules
export { PerformanceOptimizer, LazyExerciseLoader };
export default PerformanceOptimizer;
