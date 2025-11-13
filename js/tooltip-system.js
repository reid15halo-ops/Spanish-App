/**
 * Tooltip System
 *
 * Provides contextual tooltips for UI elements:
 * - Automatic tooltip generation from data-tooltip attributes
 * - Smart positioning (top/bottom/left/right based on available space)
 * - Touch-friendly (tap to show/hide)
 * - Accessible (ARIA support)
 */

class TooltipSystem {
    constructor() {
        this.initialized = false;
        this.activeTooltip = null;
        this.touchTimeout = null;
    }

    /**
     * Initialize the tooltip system
     */
    initialize() {
        if (this.initialized) return;

        // Inject styles
        this.injectStyles();

        // Setup tooltip listeners
        this.setupTooltips();

        this.initialized = true;

        window.Logger?.debug('[TooltipSystem] Initialized');
    }

    /**
     * Inject tooltip styles
     */
    injectStyles() {
        if (document.getElementById('tooltip-system-styles')) return;

        const style = document.createElement('style');
        style.id = 'tooltip-system-styles';
        style.textContent = `
            /* Tooltip */
            .custom-tooltip {
                position: absolute;
                background: var(--text, #1A1A1A);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 13px;
                line-height: 1.4;
                max-width: 250px;
                z-index: 10000;
                pointer-events: none;
                opacity: 0;
                transform: translateY(-5px);
                transition: opacity 0.2s ease, transform 0.2s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            .custom-tooltip.show {
                opacity: 1;
                transform: translateY(0);
            }

            /* Tooltip Arrow */
            .custom-tooltip::before {
                content: '';
                position: absolute;
                width: 0;
                height: 0;
                border-style: solid;
            }

            .custom-tooltip.position-top::before {
                bottom: -6px;
                left: 50%;
                transform: translateX(-50%);
                border-width: 6px 6px 0 6px;
                border-color: var(--text, #1A1A1A) transparent transparent transparent;
            }

            .custom-tooltip.position-bottom::before {
                top: -6px;
                left: 50%;
                transform: translateX(-50%);
                border-width: 0 6px 6px 6px;
                border-color: transparent transparent var(--text, #1A1A1A) transparent;
            }

            .custom-tooltip.position-left::before {
                right: -6px;
                top: 50%;
                transform: translateY(-50%);
                border-width: 6px 0 6px 6px;
                border-color: transparent transparent transparent var(--text, #1A1A1A);
            }

            .custom-tooltip.position-right::before {
                left: -6px;
                top: 50%;
                transform: translateY(-50%);
                border-width: 6px 6px 6px 0;
                border-color: transparent var(--text, #1A1A1A) transparent transparent;
            }

            /* Touch-friendly */
            [data-tooltip] {
                position: relative;
                cursor: help;
            }

            /* Respect reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .custom-tooltip {
                    transition: none !important;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * Setup tooltips on all elements with data-tooltip
     */
    setupTooltips() {
        // Use MutationObserver to handle dynamically added elements
        const observer = new MutationObserver(() => {
            this.attachTooltipsToElements();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial setup
        this.attachTooltipsToElements();
    }

    /**
     * Attach tooltip listeners to all [data-tooltip] elements
     */
    attachTooltipsToElements() {
        const elements = document.querySelectorAll('[data-tooltip]');

        elements.forEach(element => {
            // Skip if already initialized
            if (element.hasAttribute('data-tooltip-initialized')) {
                return;
            }

            // Mark as initialized
            element.setAttribute('data-tooltip-initialized', 'true');

            // Add ARIA attributes
            element.setAttribute('aria-describedby', `tooltip-${this.generateId()}`);

            // Mouse events
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(element);
            });

            element.addEventListener('mouseleave', (e) => {
                this.hideTooltip();
            });

            // Touch events (tap to show, tap again to hide)
            element.addEventListener('touchstart', (e) => {
                if (this.activeTooltip && this.activeTooltip.element === element) {
                    // Already showing, hide it
                    this.hideTooltip();
                } else {
                    // Show tooltip
                    this.showTooltip(element);

                    // Auto-hide after 3 seconds
                    clearTimeout(this.touchTimeout);
                    this.touchTimeout = setTimeout(() => {
                        this.hideTooltip();
                    }, 3000);
                }
            });

            // Focus events (keyboard navigation)
            element.addEventListener('focus', (e) => {
                this.showTooltip(element);
            });

            element.addEventListener('blur', (e) => {
                this.hideTooltip();
            });
        });
    }

    /**
     * Show tooltip for an element
     */
    showTooltip(element) {
        // Hide any existing tooltip
        this.hideTooltip();

        const text = element.getAttribute('data-tooltip');
        if (!text) return;

        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.setAttribute('role', 'tooltip');
        tooltip.textContent = text;

        // Add to DOM
        document.body.appendChild(tooltip);

        // Calculate position
        const position = this.calculatePosition(element, tooltip);
        this.positionTooltip(tooltip, element, position);

        // Show tooltip
        setTimeout(() => {
            tooltip.classList.add('show');
        }, 10);

        // Store reference
        this.activeTooltip = {
            element: element,
            tooltip: tooltip
        };

        window.Logger?.debug('[TooltipSystem] Tooltip shown:', text.substring(0, 50));
    }

    /**
     * Hide current tooltip
     */
    hideTooltip() {
        if (!this.activeTooltip) return;

        const { tooltip } = this.activeTooltip;

        tooltip.classList.remove('show');

        setTimeout(() => {
            tooltip.remove();
        }, 200);

        this.activeTooltip = null;

        clearTimeout(this.touchTimeout);
    }

    /**
     * Calculate best position for tooltip
     */
    calculatePosition(element, tooltip) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const spaceTop = rect.top;
        const spaceBottom = viewportHeight - rect.bottom;
        const spaceLeft = rect.left;
        const spaceRight = viewportWidth - rect.right;

        // Prefer top/bottom over left/right
        if (spaceTop > tooltipRect.height + 20) {
            return 'top';
        } else if (spaceBottom > tooltipRect.height + 20) {
            return 'bottom';
        } else if (spaceLeft > tooltipRect.width + 20) {
            return 'left';
        } else if (spaceRight > tooltipRect.width + 20) {
            return 'right';
        } else {
            // Default to top if no space
            return 'top';
        }
    }

    /**
     * Position tooltip relative to element
     */
    positionTooltip(tooltip, element, position) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        tooltip.className = `custom-tooltip position-${position}`;

        let top, left;

        switch (position) {
            case 'top':
                top = rect.top - tooltipRect.height - 10;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                break;

            case 'bottom':
                top = rect.bottom + 10;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                break;

            case 'left':
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                left = rect.left - tooltipRect.width - 10;
                break;

            case 'right':
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                left = rect.right + 10;
                break;

            default:
                top = rect.top - tooltipRect.height - 10;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        }

        // Constrain to viewport
        top = Math.max(10, Math.min(top, window.innerHeight - tooltipRect.height - 10));
        left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));

        tooltip.style.top = top + window.scrollY + 'px';
        tooltip.style.left = left + window.scrollX + 'px';
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return Math.random().toString(36).substring(2, 9);
    }

    /**
     * Add tooltip to element programmatically
     */
    addTooltip(element, text) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }

        if (!element) return;

        element.setAttribute('data-tooltip', text);

        // Re-attach if system is initialized
        if (this.initialized) {
            this.attachTooltipsToElements();
        }
    }

    /**
     * Remove tooltip from element
     */
    removeTooltip(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }

        if (!element) return;

        element.removeAttribute('data-tooltip');
        element.removeAttribute('data-tooltip-initialized');
        element.removeAttribute('aria-describedby');

        // Hide if currently showing
        if (this.activeTooltip && this.activeTooltip.element === element) {
            this.hideTooltip();
        }
    }
}

// Create global instance
window.TooltipSystem = new TooltipSystem();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TooltipSystem };
}
