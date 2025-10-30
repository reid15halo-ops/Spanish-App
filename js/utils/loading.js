/**
 * Loading State Manager
 *
 * Handles loading spinners and states during async operations
 */

class LoadingManager {
    constructor() {
        this.activeLoaders = new Set();
    }

    /**
     * Show loading spinner in a container
     * @param {string|HTMLElement} container - Container ID or element
     * @param {string} message - Optional loading message
     * @returns {string} Loader ID for removal
     */
    show(container, message = 'Laedt...') {
        const loaderId = 'loader-' + Date.now();
        const containerEl = typeof container === 'string'
            ? document.getElementById(container)
            : container;

        if (!containerEl) {
            window.Logger?.warn('Loading container not found:', container);
            return loaderId;
        }

        // Create loader element
        const loader = document.createElement('div');
        loader.id = loaderId;
        loader.className = 'loading-overlay';
        loader.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p class="loading-message">${message}</p>
            </div>
        `;

        containerEl.appendChild(loader);
        this.activeLoaders.add(loaderId);

        return loaderId;
    }

    /**
     * Hide loading spinner
     * @param {string} loaderId - ID returned from show()
     */
    hide(loaderId) {
        if (!loaderId) return;

        const loader = document.getElementById(loaderId);
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.remove();
                this.activeLoaders.delete(loaderId);
            }, 300);
        }
    }

    /**
     * Show inline loading indicator (smaller, for buttons)
     * @param {string|HTMLElement} container
     * @param {string} message
     */
    showInline(container, message = 'Bitte warten...') {
        const containerEl = typeof container === 'string'
            ? document.getElementById(container)
            : container;

        if (!containerEl) return;

        const originalContent = containerEl.innerHTML;
        containerEl.dataset.originalContent = originalContent;
        containerEl.disabled = true;
        containerEl.innerHTML = `
            <span class="inline-spinner"></span>
            <span>${message}</span>
        `;
    }

    /**
     * Hide inline loading indicator
     * @param {string|HTMLElement} container
     */
    hideInline(container) {
        const containerEl = typeof container === 'string'
            ? document.getElementById(container)
            : container;

        if (!containerEl) return;

        const originalContent = containerEl.dataset.originalContent;
        if (originalContent) {
            containerEl.innerHTML = originalContent;
            delete containerEl.dataset.originalContent;
        }
        containerEl.disabled = false;
    }

    /**
     * Hide all active loaders
     */
    hideAll() {
        this.activeLoaders.forEach(loaderId => {
            this.hide(loaderId);
        });
    }

    /**
     * Check if any loaders are active
     */
    isLoading() {
        return this.activeLoaders.size > 0;
    }
}

// Add CSS styles for loading components
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        animation: fadeIn 0.2s ease;
    }

    .loading-overlay.fade-out {
        animation: fadeOut 0.3s ease;
    }

    .loading-spinner {
        text-align: center;
    }

    .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid #E0E0E0;
        border-top-color: #20B2AA;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 15px;
    }

    .loading-message {
        color: #666;
        font-size: 14px;
        margin: 0;
    }

    .inline-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-right: 8px;
        vertical-align: middle;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    /* Make containers relative for absolute positioning */
    #exercise-area {
        position: relative;
        min-height: 200px;
    }
`;

document.head.appendChild(loadingStyles);

// Create global loading manager instance
window.LoadingManager = new LoadingManager();
