/**
 * Windows 11 Fluent Design System
 *
 * Implements Microsoft Fluent Design System for Windows 11:
 * - Fluent colors and typography
 * - Acrylic/Mica background effects
 * - Rounded corners and shadows
 * - Smooth animations
 */

class FluentDesignSystem {
    constructor() {
        this.initialized = false;
        this.isWindows = this.detectWindows();
        this.theme = 'light';
    }

    /**
     * Detect if running on Windows
     */
    detectWindows() {
        return navigator.platform.toLowerCase().includes('win') ||
               navigator.userAgent.toLowerCase().includes('windows');
    }

    /**
     * Initialize Fluent Design System
     */
    initialize() {
        if (this.initialized) return;

        // Only apply on Windows (or force for testing)
        const forceEnable = window.location.search.includes('fluent=true');

        if (!this.isWindows && !forceEnable) {
            window.Logger?.debug('[FluentDesign] Not on Windows, skipping initialization');
            return;
        }

        // Inject Fluent Design styles
        this.injectFluentStyles();

        // Apply theme
        this.applyTheme();

        // Listen for theme changes
        this.watchThemeChanges();

        this.initialized = true;

        window.Logger?.info('[FluentDesign] Initialized (Windows 11 mode)');
    }

    /**
     * Inject Fluent Design styles
     */
    injectFluentStyles() {
        if (document.getElementById('fluent-design-styles')) return;

        const style = document.createElement('style');
        style.id = 'fluent-design-styles';
        style.textContent = `
            /* ===== FLUENT DESIGN COLOR SYSTEM ===== */
            :root {
                /* Fluent Design Colors - Light Theme */
                --fluent-bg-primary: #F3F3F3;
                --fluent-bg-secondary: #FAFAFA;
                --fluent-bg-tertiary: #FFFFFF;
                --fluent-bg-overlay: rgba(255, 255, 255, 0.7);

                /* Accent (System accent color - default to Teal) */
                --fluent-accent: #0078D4;
                --fluent-accent-hover: #106EBE;
                --fluent-accent-pressed: #005A9E;
                --fluent-accent-light: rgba(0, 120, 212, 0.1);

                /* Text Colors */
                --fluent-text-primary: rgba(0, 0, 0, 0.9);
                --fluent-text-secondary: rgba(0, 0, 0, 0.6);
                --fluent-text-tertiary: rgba(0, 0, 0, 0.4);
                --fluent-text-disabled: rgba(0, 0, 0, 0.25);

                /* Border & Divider */
                --fluent-border: rgba(0, 0, 0, 0.08);
                --fluent-divider: rgba(0, 0, 0, 0.06);

                /* Shadows (Fluent Design elevation) */
                --fluent-shadow-low: 0 2px 4px rgba(0, 0, 0, 0.08);
                --fluent-shadow-medium: 0 4px 8px rgba(0, 0, 0, 0.12);
                --fluent-shadow-high: 0 8px 16px rgba(0, 0, 0, 0.16);
                --fluent-shadow-flyout: 0 8px 32px rgba(0, 0, 0, 0.24);

                /* Border Radius (Windows 11 standard) */
                --fluent-radius-small: 4px;
                --fluent-radius-medium: 8px;
                --fluent-radius-large: 12px;

                /* Typography */
                --fluent-font-family: 'Segoe UI Variable', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            /* Dark Theme */
            [data-theme="dark"] {
                --fluent-bg-primary: #202020;
                --fluent-bg-secondary: #2C2C2C;
                --fluent-bg-tertiary: #282828;
                --fluent-bg-overlay: rgba(44, 44, 44, 0.7);

                --fluent-text-primary: rgba(255, 255, 255, 0.9);
                --fluent-text-secondary: rgba(255, 255, 255, 0.6);
                --fluent-text-tertiary: rgba(255, 255, 255, 0.4);
                --fluent-text-disabled: rgba(255, 255, 255, 0.25);

                --fluent-border: rgba(255, 255, 255, 0.08);
                --fluent-divider: rgba(255, 255, 255, 0.06);

                --fluent-shadow-low: 0 2px 4px rgba(0, 0, 0, 0.24);
                --fluent-shadow-medium: 0 4px 8px rgba(0, 0, 0, 0.32);
                --fluent-shadow-high: 0 8px 16px rgba(0, 0, 0, 0.40);
                --fluent-shadow-flyout: 0 8px 32px rgba(0, 0, 0, 0.56);
            }

            /* ===== FLUENT TYPOGRAPHY ===== */
            body.fluent-enabled {
                font-family: var(--fluent-font-family);
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }

            .fluent-enabled .text-display {
                font-size: 28px;
                font-weight: 600;
                line-height: 36px;
                color: var(--fluent-text-primary);
            }

            .fluent-enabled .text-title {
                font-size: 20px;
                font-weight: 600;
                line-height: 28px;
                color: var(--fluent-text-primary);
            }

            .fluent-enabled .text-subtitle {
                font-size: 16px;
                font-weight: 600;
                line-height: 22px;
                color: var(--fluent-text-secondary);
            }

            .fluent-enabled .text-body {
                font-size: 14px;
                font-weight: 400;
                line-height: 20px;
                color: var(--fluent-text-primary);
            }

            .fluent-enabled .text-caption {
                font-size: 12px;
                font-weight: 400;
                line-height: 16px;
                color: var(--fluent-text-secondary);
            }

            /* ===== FLUENT CONTROLS ===== */
            .fluent-enabled button {
                font-family: var(--fluent-font-family);
                border-radius: var(--fluent-radius-small);
                transition: all 0.1s cubic-bezier(0.4, 0.0, 0.2, 1);
            }

            .fluent-enabled .btn-primary {
                background: var(--fluent-accent);
                color: white;
                box-shadow: var(--fluent-shadow-low);
            }

            .fluent-enabled .btn-primary:hover {
                background: var(--fluent-accent-hover);
                box-shadow: var(--fluent-shadow-medium);
            }

            .fluent-enabled .btn-primary:active {
                background: var(--fluent-accent-pressed);
                box-shadow: var(--fluent-shadow-low);
            }

            /* ===== ACRYLIC EFFECT ===== */
            .fluent-acrylic {
                background: var(--fluent-bg-overlay);
                backdrop-filter: blur(30px) saturate(150%);
                -webkit-backdrop-filter: blur(30px) saturate(150%);
                border: 1px solid rgba(255, 255, 255, 0.15);
                box-shadow: var(--fluent-shadow-medium);
            }

            [data-theme="dark"] .fluent-acrylic {
                background: rgba(44, 44, 44, 0.7);
                border: 1px solid rgba(255, 255, 255, 0.08);
            }

            /* Fallback for browsers without backdrop-filter */
            @supports not (backdrop-filter: blur(30px)) {
                .fluent-acrylic {
                    background: var(--fluent-bg-tertiary);
                    box-shadow: var(--fluent-shadow-high);
                }
            }

            /* ===== MICA EFFECT (subtler) ===== */
            .fluent-mica {
                background: linear-gradient(
                    135deg,
                    var(--fluent-bg-secondary) 0%,
                    var(--fluent-bg-tertiary) 100%
                );
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border-bottom: 1px solid var(--fluent-divider);
            }

            @supports not (backdrop-filter: blur(10px)) {
                .fluent-mica {
                    background: var(--fluent-bg-secondary);
                }
            }

            /* ===== APPLY TO COMPONENTS ===== */

            /* Modals */
            .fluent-enabled .modal-content,
            .fluent-enabled .welcome-content,
            .fluent-enabled .help-content,
            .fluent-enabled .summary-content {
                background: var(--fluent-bg-tertiary) !important;
                border-radius: var(--fluent-radius-large);
                box-shadow: var(--fluent-shadow-flyout);
            }

            /* Make welcome/help modals acrylic */
            .fluent-enabled #welcome-modal .welcome-content,
            .fluent-enabled #help-modal .help-content {
                background: var(--fluent-bg-overlay) !important;
                backdrop-filter: blur(30px) saturate(150%);
                -webkit-backdrop-filter: blur(30px) saturate(150%);
                border: 1px solid rgba(255, 255, 255, 0.15);
            }

            /* Header/Toolbar - Mica */
            .fluent-enabled #progress,
            .fluent-enabled .sidebar-header {
                background: linear-gradient(
                    135deg,
                    var(--fluent-bg-secondary) 0%,
                    var(--fluent-bg-tertiary) 100%
                );
                border-bottom: 1px solid var(--fluent-divider);
            }

            /* Cards */
            .fluent-enabled .exercise-item,
            .fluent-enabled .stat-card,
            .fluent-enabled .welcome-feature,
            .fluent-enabled .help-section,
            .fluent-enabled .summary-section {
                background: var(--fluent-bg-tertiary);
                border-radius: var(--fluent-radius-medium);
                box-shadow: var(--fluent-shadow-low);
                border: 1px solid var(--fluent-border);
            }

            .fluent-enabled .exercise-item:hover,
            .fluent-enabled .stat-card:hover {
                box-shadow: var(--fluent-shadow-medium);
                transform: translateY(-1px);
            }

            /* Sidebar */
            .fluent-enabled #sidebar {
                background: var(--fluent-bg-secondary);
                border-right: 1px solid var(--fluent-divider);
                box-shadow: none;
            }

            /* Exercise Area */
            .fluent-enabled #exercise-area {
                background: var(--fluent-bg-tertiary);
                border-radius: var(--fluent-radius-large);
                box-shadow: var(--fluent-shadow-low);
            }

            /* Buttons - Fluent style */
            .fluent-enabled .btn-option {
                background: var(--fluent-bg-tertiary);
                border: 1px solid var(--fluent-border);
                border-radius: var(--fluent-radius-small);
            }

            .fluent-enabled .btn-option:hover {
                background: var(--fluent-accent-light);
                border-color: var(--fluent-accent);
            }

            /* Inputs */
            .fluent-enabled input,
            .fluent-enabled textarea,
            .fluent-enabled select {
                font-family: var(--fluent-font-family);
                background: var(--fluent-bg-tertiary);
                border: 1px solid var(--fluent-border);
                border-radius: var(--fluent-radius-small);
                color: var(--fluent-text-primary);
            }

            .fluent-enabled input:focus,
            .fluent-enabled textarea:focus {
                border-color: var(--fluent-accent);
                outline: none;
                box-shadow: 0 0 0 2px var(--fluent-accent-light);
            }

            /* Progress Bar */
            .fluent-enabled .progress-bar {
                background: var(--fluent-bg-secondary);
                border-radius: var(--fluent-radius-small);
            }

            .fluent-enabled .progress-fill {
                background: var(--fluent-accent);
                border-radius: var(--fluent-radius-small);
            }

            /* Help Button */
            .fluent-enabled .help-button {
                background: var(--fluent-accent);
                box-shadow: var(--fluent-shadow-medium);
            }

            .fluent-enabled .help-button:hover {
                background: var(--fluent-accent-hover);
                box-shadow: var(--fluent-shadow-high);
            }

            /* Tooltips */
            .fluent-enabled .custom-tooltip {
                background: var(--fluent-bg-overlay);
                backdrop-filter: blur(30px) saturate(150%);
                -webkit-backdrop-filter: blur(30px) saturate(150%);
                border: 1px solid rgba(255, 255, 255, 0.15);
                box-shadow: var(--fluent-shadow-flyout);
                border-radius: var(--fluent-radius-small);
            }

            /* Respect reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .fluent-enabled * {
                    transition: none !important;
                    animation: none !important;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * Apply Fluent Design theme
     */
    applyTheme() {
        // Add fluent-enabled class to body
        document.body.classList.add('fluent-enabled');

        // Detect system theme preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.theme = prefersDark ? 'dark' : 'light';

        // Apply theme
        document.documentElement.setAttribute('data-theme', this.theme);

        window.Logger?.debug(`[FluentDesign] Applied ${this.theme} theme`);
    }

    /**
     * Watch for theme changes
     */
    watchThemeChanges() {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        darkModeQuery.addEventListener('change', (e) => {
            this.theme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', this.theme);
            window.Logger?.debug(`[FluentDesign] Theme changed to ${this.theme}`);
        });
    }

    /**
     * Toggle theme manually
     */
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        window.Logger?.info(`[FluentDesign] Theme toggled to ${this.theme}`);
    }

    /**
     * Enable Fluent Design
     */
    enable() {
        if (!this.initialized) {
            this.initialize();
        } else {
            document.body.classList.add('fluent-enabled');
        }
    }

    /**
     * Disable Fluent Design
     */
    disable() {
        document.body.classList.remove('fluent-enabled');
    }
}

// Create global instance
window.FluentDesignSystem = new FluentDesignSystem();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FluentDesignSystem };
}
