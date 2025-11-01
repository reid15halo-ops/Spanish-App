/**
 * Performance Optimization System - TypeScript Version
 *
 * Simplified migration with core performance optimization features
 */

// ====================================================================
// TYPES & INTERFACES
// ====================================================================

interface PerformanceMetrics {
    renderTime: number[];
    cacheHits: number;
    cacheMisses: number;
    memoryUsage: number[];
}

interface CacheEntry {
    value: any;
    size: number;
    lastAccessed: number;
}

// ====================================================================
// PERFORMANCE OPTIMIZER
// ====================================================================

class PerformanceOptimizer {
    private cache: Map<string, CacheEntry> = new Map();
    private cacheSize = 0;
    private readonly maxCacheSize = 10 * 1024 * 1024; // 10MB
    private preloadedExercises: Set<number> = new Set();
    private initialized = false;

    private metrics: PerformanceMetrics = {
        renderTime: [],
        cacheHits: 0,
        cacheMisses: 0,
        memoryUsage: []
    };

    public initialize(): void {
        if (this.initialized) return;

        this.setupLazyLoading();
        this.enableSmartCaching();
        this.setupMemoryManagement();
        this.optimizeResources();
        this.setupPerformanceMonitoring();

        this.initialized = true;

        if (window.Logger) {
            window.Logger.info('Performance optimizations initialized');
        }
    }

    private setupLazyLoading(): void {
        (window as any).LazyExerciseLoader = new LazyExerciseLoader();

        if (window.Logger && window.__DEV__) {
            window.Logger.debug('Lazy loading enabled');
        }
    }

    private enableSmartCaching(): void {
        this.cacheExerciseData();
        this.setupCacheEviction();

        if (window.Logger && window.__DEV__) {
            window.Logger.debug('Smart caching enabled');
        }
    }

    private cacheExerciseData(): void {
        const currentExerciseIndex = (window as any).SpanishApp?.currentExerciseIndex || 0;
        this.preloadExercises(currentExerciseIndex, 3);
    }

    public preloadExercises(currentIndex: number, range = 2): void {
        try {
            const allExercises = (window as any).SpanishApp?.allExercises || [];

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

            this.cleanupOldPreloads(currentIndex, range);

        } catch (e) {
            if (window.Logger && window.__DEV__) {
                window.Logger.error('Preload failed:', e);
            }
        }
    }

    private cleanupOldPreloads(currentIndex: number, range: number): void {
        const toRemove: number[] = [];

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

    public cacheItem(key: string, value: any): void {
        const serialized = JSON.stringify(value);
        const size = new Blob([serialized]).size;

        if (this.cacheSize + size > this.maxCacheSize) {
            this.evictLRU();
        }

        this.cache.set(key, {
            value,
            size,
            lastAccessed: Date.now()
        });

        this.cacheSize += size;
    }

    public getCachedItem(key: string): any {
        const entry = this.cache.get(key);

        if (entry) {
            entry.lastAccessed = Date.now();
            this.metrics.cacheHits++;
            return entry.value;
        }

        this.metrics.cacheMisses++;
        return null;
    }

    private evictLRU(): void {
        let oldestKey: string | null = null;
        let oldestTime = Date.now();

        this.cache.forEach((entry, key) => {
            if (entry.lastAccessed < oldestTime) {
                oldestTime = entry.lastAccessed;
                oldestKey = key;
            }
        });

        if (oldestKey) {
            const entry = this.cache.get(oldestKey);
            if (entry) {
                this.cacheSize -= entry.size;
                this.cache.delete(oldestKey);
            }
        }
    }

    private setupCacheEviction(): void {
        setInterval(() => {
            this.evictStaleItems();
        }, 60000); // Every minute
    }

    private evictStaleItems(): void {
        const now = Date.now();
        const staleTime = 5 * 60 * 1000; // 5 minutes

        const toRemove: string[] = [];

        this.cache.forEach((entry, key) => {
            if (now - entry.lastAccessed > staleTime) {
                toRemove.push(key);
            }
        });

        toRemove.forEach(key => {
            const entry = this.cache.get(key);
            if (entry) {
                this.cacheSize -= entry.size;
                this.cache.delete(key);
            }
        });
    }

    private setupMemoryManagement(): void {
        if ('performance' in window && (performance as any).memory) {
            setInterval(() => {
                this.checkMemoryUsage();
            }, 30000);
        }
    }

    private checkMemoryUsage(): void {
        if ((performance as any).memory) {
            const memoryUsage = (performance as any).memory.usedJSHeapSize;
            this.metrics.memoryUsage.push(memoryUsage);

            if (this.metrics.memoryUsage.length > 100) {
                this.metrics.memoryUsage.shift();
            }

            if (memoryUsage > 50 * 1024 * 1024) { // > 50MB
                this.clearCache();
            }
        }
    }

    public clearCache(): void {
        this.cache.clear();
        this.cacheSize = 0;
        this.preloadedExercises.clear();
    }

    private optimizeResources(): void {
        // Resource optimization placeholder
    }

    private setupPerformanceMonitoring(): void {
        // Performance monitoring placeholder
    }

    public getMetrics(): PerformanceMetrics {
        return { ...this.metrics };
    }

    public getCacheStats(): { size: number; items: number; hitRate: number } {
        const total = this.metrics.cacheHits + this.metrics.cacheMisses;
        return {
            size: this.cacheSize,
            items: this.cache.size,
            hitRate: total > 0 ? (this.metrics.cacheHits / total) * 100 : 0
        };
    }
}

// ====================================================================
// LAZY EXERCISE LOADER
// ====================================================================

class LazyExerciseLoader {
    public loadExercise(exerciseId: string): any {
        // Lazy loading logic placeholder
        return null;
    }

    public preloadNextExercises(count: number): void {
        // Preload logic placeholder
    }
}

// Create global instance
window.PerformanceOptimizer = new PerformanceOptimizer();
