/**
 * Performance Utilities
 * Debounce, throttle, lazy loading, and preloading helpers
 */

/**
 * Debounce function - delays execution until after wait time has elapsed
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds (default: 300ms)
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function - limits execution to once per wait period
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum time between executions in ms
 * @returns {Function} Throttled function
 */
function throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Request Idle Callback polyfill
 */
window.requestIdleCallback = window.requestIdleCallback || function(cb) {
    const start = Date.now();
    return setTimeout(function() {
        cb({
            didTimeout: false,
            timeRemaining: function() {
                return Math.max(0, 50 - (Date.now() - start));
            }
        });
    }, 1);
};

window.cancelIdleCallback = window.cancelIdleCallback || function(id) {
    clearTimeout(id);
};

/**
 * Preload next items during idle time
 * @param {Function} getNextItems - Function that returns next items to preload
 */
function preloadNextItems(getNextItems) {
    requestIdleCallback(() => {
        try {
            const items = getNextItems();
            if (items && items.length > 0) {
                console.log(`? Preloaded ${items.length} items during idle time`);
            }
        } catch (error) {
            console.warn('Preload failed:', error);
        }
    }, { timeout: 2000 });
}

/**
 * Lazy load images
 * @param {HTMLImageElement} img - Image element to lazy load
 */
function lazyLoadImage(img) {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.removeAttribute('data-src');
                        observer.unobserve(lazyImage);
                    }
                }
            });
        });
        observer.observe(img);
    } else {
        // Fallback for browsers without IntersectionObserver
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    }
}

/**
 * Initialize lazy loading for all images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => lazyLoadImage(img));
}

/**
 * ARIA Announcer - announce messages to screen readers
 */
class AriaAnnouncer {
    constructor() {
        this.liveRegion = document.getElementById('aria-live-region');
        if (!this.liveRegion) {
            this.liveRegion = document.createElement('div');
            this.liveRegion.id = 'aria-live-region';
            this.liveRegion.setAttribute('role', 'status');
            this.liveRegion.setAttribute('aria-live', 'polite');
            this.liveRegion.setAttribute('aria-atomic', 'true');
            this.liveRegion.style.position = 'absolute';
            this.liveRegion.style.left = '-10000px';
            this.liveRegion.style.width = '1px';
            this.liveRegion.style.height = '1px';
            this.liveRegion.style.overflow = 'hidden';
            document.body.appendChild(this.liveRegion);
        }
    }

    /**
     * Announce a message to screen readers
     * @param {string} message - Message to announce
     * @param {string} priority - 'polite' or 'assertive'
     */
    announce(message, priority = 'polite') {
        if (this.liveRegion) {
            this.liveRegion.setAttribute('aria-live', priority);
            
            // Clear first to ensure announcement
            this.liveRegion.textContent = '';
            
            // Announce after a small delay
            setTimeout(() => {
                this.liveRegion.textContent = message;
            }, 100);
        }
    }

    /**
     * Announce feedback (correct/incorrect)
     * @param {boolean} isCorrect - Whether answer was correct
     * @param {string} correctAnswer - The correct answer
     */
    announceFeedback(isCorrect, correctAnswer = '') {
        if (isCorrect) {
            this.announce('Richtig! Gut gemacht.', 'polite');
        } else {
            const message = correctAnswer 
                ? `Falsch. Die richtige Antwort ist: ${correctAnswer}`
                : 'Falsch. Versuche es nochmal.';
            this.announce(message, 'polite');
        }
    }

    /**
     * Announce exercise type
     * @param {string} type - Exercise type
     */
    announceExerciseType(type) {
        const typeNames = {
            'choice': 'Multiple Choice Aufgabe',
            'typing': 'Lückentext Aufgabe',
            'sentence': 'Satzübersetzung',
            'match': 'Zuordnungsaufgabe',
            'conjugation': 'Konjugationsaufgabe'
        };
        
        const name = typeNames[type] || 'Neue Aufgabe';
        this.announce(name, 'polite');
    }
}

/**
 * Performance Monitor
 */
class PerformanceMonitor {
    constructor() {
        this.marks = new Map();
        this.measures = new Map();
    }

    /**
     * Mark a performance point
     * @param {string} name - Mark name
     */
    mark(name) {
        if (window.performance && performance.mark) {
            performance.mark(name);
            this.marks.set(name, performance.now());
        }
    }

    /**
     * Measure between two marks
     * @param {string} name - Measure name
     * @param {string} startMark - Start mark name
     * @param {string} endMark - End mark name
     */
    measure(name, startMark, endMark) {
        if (window.performance && performance.measure) {
            try {
                performance.measure(name, startMark, endMark);
                const measure = performance.getEntriesByName(name)[0];
                this.measures.set(name, measure.duration);
                console.log(`? ${name}: ${measure.duration.toFixed(2)}ms`);
            } catch (error) {
                console.warn('Measure failed:', error);
            }
        }
    }

    /**
     * Get all measurements
     */
    getReport() {
        return {
            marks: Object.fromEntries(this.marks),
            measures: Object.fromEntries(this.measures)
        };
    }
}

// Global instances
window.ariaAnnouncer = new AriaAnnouncer();
window.performanceMonitor = new PerformanceMonitor();
window.debounce = debounce;
window.throttle = throttle;
window.preloadNextItems = preloadNextItems;
window.lazyLoadImage = lazyLoadImage;
window.initLazyLoading = initLazyLoading;

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
    initLazyLoading();
}

console.log('? Performance utilities loaded');
