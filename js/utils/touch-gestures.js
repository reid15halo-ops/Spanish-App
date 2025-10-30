/**
 * Touch Gesture System
 *
 * Provides swipe gestures for mobile navigation with configurable sensitivity
 * WCAG AAA compliant - respects prefers-reduced-motion
 */

class TouchGestureManager {
    constructor(options = {}) {
        this.options = {
            minSwipeDistance: options.minSwipeDistance || 50,
            maxSwipeTime: options.maxSwipeTime || 300,
            touchTargetSize: 48, // WCAG AAA minimum
            ...options
        };

        this.touchStart = null;
        this.touchEnd = null;
        this.handlers = {
            swipeLeft: [],
            swipeRight: [],
            swipeUp: [],
            swipeDown: []
        };

        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    /**
     * Initialize touch event listeners
     */
    init() {
        // Listen for reduced motion preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            window.Logger?.info('Reduced motion preference changed:', e.matches);
        });

        // Add touch event listeners
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });

        window.Logger?.debug('Touch gesture system initialized');
    }

    /**
     * Handle touch start
     */
    handleTouchStart(e) {
        const touch = e.touches[0];
        this.touchStart = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now()
        };
    }

    /**
     * Handle touch end
     */
    handleTouchEnd(e) {
        if (!this.touchStart) return;

        const touch = e.changedTouches[0];
        this.touchEnd = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now()
        };

        this.detectSwipe();
    }

    /**
     * Detect swipe direction
     */
    detectSwipe() {
        const { touchStart, touchEnd, options } = this;

        if (!touchStart || !touchEnd) return;

        const deltaX = touchEnd.x - touchStart.x;
        const deltaY = touchEnd.y - touchStart.y;
        const deltaTime = touchEnd.time - touchStart.time;

        // Check if swipe is fast enough
        if (deltaTime > options.maxSwipeTime) {
            return;
        }

        // Check if swipe is long enough
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX < options.minSwipeDistance && absY < options.minSwipeDistance) {
            return;
        }

        // Determine direction
        let direction;
        if (absX > absY) {
            // Horizontal swipe
            direction = deltaX > 0 ? 'swipeRight' : 'swipeLeft';
        } else {
            // Vertical swipe
            direction = deltaY > 0 ? 'swipeDown' : 'swipeUp';
        }

        // Trigger handlers
        this.trigger(direction, {
            deltaX,
            deltaY,
            deltaTime,
            startX: touchStart.x,
            startY: touchStart.y,
            endX: touchEnd.x,
            endY: touchEnd.y
        });

        // Reset
        this.touchStart = null;
        this.touchEnd = null;
    }

    /**
     * Register a swipe handler
     * @param {string} direction - 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown'
     * @param {Function} callback
     */
    on(direction, callback) {
        if (this.handlers[direction]) {
            this.handlers[direction].push(callback);
            window.Logger?.debug(`Registered ${direction} handler`);
        } else {
            window.Logger?.warn(`Unknown gesture direction: ${direction}`);
        }
    }

    /**
     * Unregister a swipe handler
     */
    off(direction, callback) {
        if (this.handlers[direction]) {
            const index = this.handlers[direction].indexOf(callback);
            if (index > -1) {
                this.handlers[direction].splice(index, 1);
            }
        }
    }

    /**
     * Trigger handlers for a direction
     */
    trigger(direction, data) {
        // Respect reduced motion preference
        if (this.reducedMotion) {
            window.Logger?.debug('Swipe ignored - reduced motion enabled');
            return;
        }

        if (this.handlers[direction]) {
            this.handlers[direction].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    window.Logger?.error('Error in gesture handler:', error);
                }
            });
        }
    }

    /**
     * Check if element meets touch target size requirements (WCAG AAA)
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    isAccessibleTouchTarget(element) {
        const rect = element.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height);
        return size >= this.options.touchTargetSize;
    }

    /**
     * Make element meet touch target size requirements
     * @param {HTMLElement} element
     */
    ensureAccessibleTouchTarget(element) {
        const isAccessible = this.isAccessibleTouchTarget(element);

        if (!isAccessible) {
            // Add padding to meet minimum size
            element.style.minWidth = `${this.options.touchTargetSize}px`;
            element.style.minHeight = `${this.options.touchTargetSize}px`;
            element.style.display = 'inline-flex';
            element.style.alignItems = 'center';
            element.style.justifyContent = 'center';

            window.Logger?.debug('Enhanced touch target for accessibility:', element);
        }

        return isAccessible;
    }

    /**
     * Validate all interactive elements meet touch target requirements
     */
    validateTouchTargets() {
        const interactiveElements = document.querySelectorAll('button, a, input, [role="button"]');
        const issues = [];

        interactiveElements.forEach(element => {
            if (!this.isAccessibleTouchTarget(element)) {
                issues.push({
                    element: element,
                    current: element.getBoundingClientRect(),
                    required: this.options.touchTargetSize
                });
            }
        });

        if (issues.length > 0) {
            window.Logger?.warn(`Found ${issues.length} elements below minimum touch target size`);
        }

        return issues;
    }

    /**
     * Enable swipe navigation for exercises
     * @param {Object} callbacks
     */
    enableExerciseNavigation(callbacks) {
        // Swipe right to go to previous exercise
        this.on('swipeRight', () => {
            if (callbacks.onPrevious) {
                window.Logger?.debug('Swipe right: Previous exercise');
                callbacks.onPrevious();
            }
        });

        // Swipe left to go to next exercise
        this.on('swipeLeft', () => {
            if (callbacks.onNext) {
                window.Logger?.debug('Swipe left: Next exercise');
                callbacks.onNext();
            }
        });

        window.Logger?.info('Exercise swipe navigation enabled');
    }
}

// Create global touch gesture manager
window.TouchGestures = new TouchGestureManager();
