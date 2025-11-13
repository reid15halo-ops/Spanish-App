/**
 * Loading State System
 *
 * Provides loading indicators for async operations with:
 * - Spinner animations
 * - Contextual loading messages
 * - Skeleton screens for exercise containers
 * - Auto-hide after operations complete
 */

class LoadingSystem {
    constructor() {
        this.overlay = null;
        this.initialized = false;
        this.activeLoaders = new Set();
    }

    /**
     * Initialize the loading system
     */
    initialize() {
        if (this.initialized) return;

        // Create loading overlay
        this.createOverlay();
        this.initialized = true;

        window.Logger?.debug('[LoadingSystem] Initialized');
    }

    /**
     * Create the loading overlay element
     */
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'loading-overlay';
        this.overlay.className = 'loading-overlay hidden';
        this.overlay.setAttribute('role', 'status');
        this.overlay.setAttribute('aria-live', 'polite');
        this.overlay.setAttribute('aria-label', 'Lädt...');

        this.overlay.innerHTML = `
            <div class="loading-content">
                <div class="spinner" aria-hidden="true"></div>
                <p class="loading-text" id="loading-text">Lädt...</p>
            </div>
        `;

        // Add to DOM when ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(this.overlay);
            });
        } else {
            document.body.appendChild(this.overlay);
        }

        // Add styles
        this.injectStyles();
    }

    /**
     * Inject loading system styles
     */
    injectStyles() {
        if (document.getElementById('loading-system-styles')) return;

        const style = document.createElement('style');
        style.id = 'loading-system-styles';
        style.textContent = `
            /* Loading Overlay */
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 1;
                transition: opacity 0.3s ease;
            }

            .loading-overlay.hidden {
                opacity: 0;
                pointer-events: none;
            }

            .loading-content {
                text-align: center;
                padding: 30px;
            }

            /* Spinner */
            .spinner {
                border: 4px solid rgba(32, 178, 170, 0.2);
                border-left-color: var(--primary, #20B2AA);
                border-radius: 50%;
                width: 50px;
                height: 50px;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Loading Text */
            .loading-text {
                font-size: 16px;
                font-weight: 600;
                color: var(--text, #1A1A1A);
                margin: 0;
            }

            /* Inline Loader (for specific sections) */
            .inline-loader {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 40px 20px;
                opacity: 1;
                transition: opacity 0.3s ease;
            }

            .inline-loader.hidden {
                opacity: 0;
                display: none;
            }

            .inline-loader .spinner {
                width: 40px;
                height: 40px;
                border-width: 3px;
                margin: 0 15px 0 0;
            }

            .inline-loader .loading-text {
                font-size: 14px;
                margin: 0;
            }

            /* Skeleton Screens */
            .skeleton-exercise {
                background: var(--bg, #FFFFFF);
                padding: 30px;
                border-radius: var(--radius, 8px);
                animation: pulse 1.5s ease-in-out infinite;
            }

            .skeleton-line {
                height: 20px;
                background: linear-gradient(
                    90deg,
                    #f0f0f0 25%,
                    #e0e0e0 50%,
                    #f0f0f0 75%
                );
                background-size: 200% 100%;
                animation: shimmer 1.5s ease-in-out infinite;
                border-radius: 4px;
                margin-bottom: 15px;
            }

            .skeleton-line.wide {
                width: 100%;
            }

            .skeleton-line.medium {
                width: 70%;
            }

            .skeleton-line.short {
                width: 40%;
            }

            .skeleton-line.tall {
                height: 40px;
            }

            @keyframes pulse {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.8;
                }
            }

            @keyframes shimmer {
                0% {
                    background-position: -200% 0;
                }
                100% {
                    background-position: 200% 0;
                }
            }

            /* Respect reduced motion preferences */
            @media (prefers-reduced-motion: reduce) {
                .spinner {
                    animation: none;
                    border: 4px solid var(--primary, #20B2AA);
                }

                .skeleton-line {
                    animation: none;
                    background: #e0e0e0;
                }

                .loading-overlay,
                .inline-loader {
                    transition: none;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * Show loading overlay with optional message
     * @param {string} message - Loading message to display
     * @param {string} loaderId - Optional unique ID for this loader
     * @returns {string} loaderId
     */
    show(message = 'Lädt...', loaderId = null) {
        if (!this.initialized) {
            this.initialize();
        }

        // Generate loader ID if not provided
        if (!loaderId) {
            loaderId = `loader_${Date.now()}`;
        }

        // Add to active loaders
        this.activeLoaders.add(loaderId);

        // Update text
        const textElement = document.getElementById('loading-text');
        if (textElement) {
            textElement.textContent = message;
        }

        // Update aria-label
        if (this.overlay) {
            this.overlay.setAttribute('aria-label', message);
        }

        // Show overlay
        if (this.overlay) {
            this.overlay.classList.remove('hidden');
        }

        window.Logger?.debug(`[LoadingSystem] Show: "${message}" (${loaderId})`);

        return loaderId;
    }

    /**
     * Hide loading overlay
     * @param {string} loaderId - Optional loader ID to remove
     */
    hide(loaderId = null) {
        if (!this.initialized) return;

        // Remove specific loader ID
        if (loaderId) {
            this.activeLoaders.delete(loaderId);
        } else {
            // Clear all loaders if no ID provided
            this.activeLoaders.clear();
        }

        // Only hide if no active loaders remain
        if (this.activeLoaders.size === 0 && this.overlay) {
            this.overlay.classList.add('hidden');
            window.Logger?.debug('[LoadingSystem] Hide');
        } else {
            window.Logger?.debug(`[LoadingSystem] Still ${this.activeLoaders.size} active loader(s)`);
        }
    }

    /**
     * Show inline loader in a specific container
     * @param {HTMLElement} container - Container element
     * @param {string} message - Loading message
     */
    showInline(container, message = 'Lädt...') {
        if (!container) return;

        // Create inline loader
        const loader = document.createElement('div');
        loader.className = 'inline-loader';
        loader.setAttribute('role', 'status');
        loader.setAttribute('aria-live', 'polite');
        loader.setAttribute('aria-label', message);

        loader.innerHTML = `
            <div class="spinner" aria-hidden="true"></div>
            <p class="loading-text">${message}</p>
        `;

        // Clear container and add loader
        container.innerHTML = '';
        container.appendChild(loader);
    }

    /**
     * Hide inline loader in a specific container
     * @param {HTMLElement} container - Container element
     */
    hideInline(container) {
        if (!container) return;

        const loader = container.querySelector('.inline-loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 300);
        }
    }

    /**
     * Show skeleton screen in container
     * @param {HTMLElement} container - Container element
     * @param {string} type - Skeleton type ('exercise', 'list', 'simple')
     */
    showSkeleton(container, type = 'exercise') {
        if (!container) return;

        const skeletons = {
            exercise: `
                <div class="skeleton-exercise">
                    <div class="skeleton-line wide tall"></div>
                    <div style="height: 20px;"></div>
                    <div class="skeleton-line wide"></div>
                    <div class="skeleton-line medium"></div>
                    <div style="height: 30px;"></div>
                    <div class="skeleton-line wide tall"></div>
                    <div class="skeleton-line wide tall"></div>
                </div>
            `,
            list: `
                <div class="skeleton-exercise">
                    <div class="skeleton-line medium"></div>
                    <div class="skeleton-line wide"></div>
                    <div class="skeleton-line wide"></div>
                    <div class="skeleton-line short"></div>
                </div>
            `,
            simple: `
                <div class="skeleton-exercise">
                    <div class="skeleton-line wide"></div>
                    <div class="skeleton-line medium"></div>
                </div>
            `
        };

        container.innerHTML = skeletons[type] || skeletons.simple;
    }

    /**
     * Wrap an async function with loading state
     * @param {Function} asyncFn - Async function to wrap
     * @param {string} message - Loading message
     * @returns {Function} Wrapped async function
     */
    wrap(asyncFn, message = 'Lädt...') {
        return async (...args) => {
            const loaderId = this.show(message);
            try {
                const result = await asyncFn(...args);
                return result;
            } finally {
                this.hide(loaderId);
            }
        };
    }

    /**
     * Execute async function with loading state
     * @param {Function} asyncFn - Async function to execute
     * @param {string} message - Loading message
     * @returns {Promise} Result of async function
     */
    async execute(asyncFn, message = 'Lädt...') {
        const loaderId = this.show(message);
        try {
            return await asyncFn();
        } finally {
            this.hide(loaderId);
        }
    }
}

// Create global instance
window.LoadingSystem = new LoadingSystem();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LoadingSystem };
}
