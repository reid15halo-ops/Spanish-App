/**
 * DPI Awareness System
 *
 * Handles per-monitor DPI scaling for Windows 11 and high-DPI displays:
 * - Detects device pixel ratio (100%, 125%, 150%, 200%, 250%, 300%)
 * - Applies appropriate scaling
 * - Monitors DPI changes (window moved between monitors)
 * - Ensures crisp text and icons on all displays
 */

class DPIAwarenessSystem {
    constructor() {
        this.initialized = false;
        this.currentDPI = window.devicePixelRatio || 1;
        this.scalingFactor = 1;
        this.baseValues = {
            fontSize: 14,
            iconSize: 24,
            buttonPadding: 12,
            spacing: 8
        };
    }

    /**
     * Initialize DPI awareness
     */
    initialize() {
        if (this.initialized) return;

        // Inject DPI styles
        this.injectDPIStyles();

        // Apply current DPI scaling
        this.applyScaling();

        // Watch for DPI changes
        this.watchDPIChanges();

        // Watch for window resize/move
        this.watchWindowChanges();

        this.initialized = true;

        window.Logger?.info(`[DPIAwareness] Initialized (DPI: ${this.currentDPI}, Scaling: ${this.scalingFactor})`);
    }

    /**
     * Inject DPI-aware CSS
     */
    injectDPIStyles() {
        if (document.getElementById('dpi-awareness-styles')) return;

        const style = document.createElement('style');
        style.id = 'dpi-awareness-styles';
        style.textContent = `
            /* DPI-Aware Scaling */
            :root {
                --dpi-scale: 1;
                --base-font-size: 14px;
                --base-icon-size: 24px;
                --base-spacing: 8px;
                --base-button-padding: 12px;
            }

            /* Scaled Values */
            body.dpi-scaled {
                font-size: calc(var(--base-font-size) * var(--dpi-scale));
            }

            .dpi-scaled .icon,
            .dpi-scaled .help-button,
            .dpi-scaled .sidebar-toggle {
                width: calc(var(--base-icon-size) * var(--dpi-scale));
                height: calc(var(--base-icon-size) * var(--dpi-scale));
            }

            .dpi-scaled button {
                padding: calc(var(--base-button-padding) * var(--dpi-scale));
            }

            .dpi-scaled .spacing {
                margin: calc(var(--base-spacing) * var(--dpi-scale));
                padding: calc(var(--base-spacing) * var(--dpi-scale));
            }

            /* High-DPI Image Rendering */
            .dpi-scaled img {
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
            }

            /* Font Rendering for High-DPI */
            .dpi-scaled {
                -webkit-font-smoothing: subpixel-antialiased;
                -moz-osx-font-smoothing: auto;
                text-rendering: optimizeLegibility;
            }

            /* Specific DPI Presets */

            /* 125% DPI (1.25x) */
            [data-dpi="125"] {
                --dpi-scale: 1.1;
            }

            /* 150% DPI (1.5x) */
            [data-dpi="150"] {
                --dpi-scale: 1.25;
            }

            /* 175% DPI (1.75x) */
            [data-dpi="175"] {
                --dpi-scale: 1.35;
            }

            /* 200% DPI (2x) - Retina */
            [data-dpi="200"] {
                --dpi-scale: 1.5;
            }

            /* 250% DPI (2.5x) */
            [data-dpi="250"] {
                --dpi-scale: 1.75;
            }

            /* 300% DPI (3x) - 4K/8K */
            [data-dpi="300"] {
                --dpi-scale: 2;
            }

            /* Ensure minimum touch target size (44x44px) on high-DPI */
            @media (min-resolution: 2dppx) {
                .dpi-scaled button,
                .dpi-scaled .btn-option,
                .dpi-scaled .exercise-item {
                    min-height: 44px;
                    min-width: 44px;
                }
            }

            /* 4K/8K Display optimizations */
            @media (min-resolution: 3dppx) {
                .dpi-scaled {
                    --dpi-scale: 2;
                }

                .dpi-scaled h1 {
                    font-size: calc(32px * var(--dpi-scale));
                }

                .dpi-scaled h2 {
                    font-size: calc(24px * var(--dpi-scale));
                }

                .dpi-scaled h3 {
                    font-size: calc(20px * var(--dpi-scale));
                }
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * Apply DPI scaling
     */
    applyScaling() {
        const dpi = this.currentDPI;

        // Calculate scaling factor based on DPI
        if (dpi >= 3) {
            // 300% (4K/8K displays)
            this.scalingFactor = 2;
            document.documentElement.setAttribute('data-dpi', '300');
        } else if (dpi >= 2.5) {
            // 250%
            this.scalingFactor = 1.75;
            document.documentElement.setAttribute('data-dpi', '250');
        } else if (dpi >= 2) {
            // 200% (Retina)
            this.scalingFactor = 1.5;
            document.documentElement.setAttribute('data-dpi', '200');
        } else if (dpi >= 1.75) {
            // 175%
            this.scalingFactor = 1.35;
            document.documentElement.setAttribute('data-dpi', '175');
        } else if (dpi >= 1.5) {
            // 150%
            this.scalingFactor = 1.25;
            document.documentElement.setAttribute('data-dpi', '150');
        } else if (dpi >= 1.25) {
            // 125%
            this.scalingFactor = 1.1;
            document.documentElement.setAttribute('data-dpi', '125');
        } else {
            // 100% (Standard)
            this.scalingFactor = 1;
            document.documentElement.setAttribute('data-dpi', '100');
        }

        // Apply to CSS variable
        document.documentElement.style.setProperty('--dpi-scale', this.scalingFactor);

        // Add class to body
        document.body.classList.add('dpi-scaled');

        window.Logger?.debug(`[DPIAwareness] Applied scaling: ${this.scalingFactor}x (DPI: ${dpi})`);
    }

    /**
     * Watch for DPI changes (monitor switching)
     */
    watchDPIChanges() {
        // Create a media query for current DPI
        const updateDPI = () => {
            const newDPI = window.devicePixelRatio || 1;

            if (newDPI !== this.currentDPI) {
                this.currentDPI = newDPI;
                this.applyScaling();
                window.Logger?.info(`[DPIAwareness] DPI changed to ${newDPI} (moved to different monitor?)`);
            }
        };

        // Watch for resolution changes
        const resolutions = [1, 1.25, 1.5, 1.75, 2, 2.5, 3];
        resolutions.forEach(dpi => {
            const media = matchMedia(`(resolution: ${dpi}dppx)`);
            media.addEventListener('change', updateDPI);
        });
    }

    /**
     * Watch for window changes (resize/move)
     */
    watchWindowChanges() {
        let resizeTimeout;

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newDPI = window.devicePixelRatio || 1;
                if (newDPI !== this.currentDPI) {
                    this.currentDPI = newDPI;
                    this.applyScaling();
                }
            }, 250);
        });
    }

    /**
     * Get DPI info
     */
    getDPIInfo() {
        return {
            dpi: this.currentDPI,
            scaling: this.scalingFactor,
            percentage: Math.round(this.currentDPI * 100) + '%',
            category: this.getDPICategory()
        };
    }

    /**
     * Get DPI category
     */
    getDPICategory() {
        if (this.currentDPI >= 3) return '4K/8K Display';
        if (this.currentDPI >= 2) return 'Retina/2K Display';
        if (this.currentDPI >= 1.5) return 'High DPI Display';
        if (this.currentDPI >= 1.25) return 'Medium DPI Display';
        return 'Standard Display';
    }

    /**
     * Force specific DPI (for testing)
     */
    forceDPI(dpi) {
        this.currentDPI = dpi;
        this.applyScaling();
        window.Logger?.info(`[DPIAwareness] Forced DPI to ${dpi}`);
    }

    /**
     * Reset to auto-detection
     */
    resetDPI() {
        this.currentDPI = window.devicePixelRatio || 1;
        this.applyScaling();
        window.Logger?.info(`[DPIAwareness] Reset to auto-detected DPI: ${this.currentDPI}`);
    }

    /**
     * Enable DPI scaling
     */
    enable() {
        if (!this.initialized) {
            this.initialize();
        } else {
            document.body.classList.add('dpi-scaled');
            this.applyScaling();
        }
    }

    /**
     * Disable DPI scaling
     */
    disable() {
        document.body.classList.remove('dpi-scaled');
        document.documentElement.removeAttribute('data-dpi');
        document.documentElement.style.removeProperty('--dpi-scale');
    }
}

// Create global instance
window.DPIAwarenessSystem = new DPIAwarenessSystem();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DPIAwarenessSystem };
}
