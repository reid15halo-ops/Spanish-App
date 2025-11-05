/**
 * Main entry point for Spanish Learning App
 *
 * This file orchestrates the loading of all modules in the correct order
 * for both development and production builds.
 */

// 1. Environment & Configuration (must be first)
import './config/environment.js';

// 2. Monitoring (Error + Performance tracking)
import './monitoring.js';

// 3. Consolidated Utilities (Logger, Loading, ErrorBoundary, DataBackup, GDPR, Accessibility, etc.)
import './utils.js';

// 4. Exercise Data (can be lazy loaded in future)
import './exercise-data.js';

// Note: module-structure.js and lesson1-expanded.js are loaded via script tags
// because they use window.X pattern for compatibility with both ES6 and non-ES6 contexts

// 5. Adaptive Learning System
import './adaptive-learning.js';

// 6. Tolerant Validation & Improved Feedback
import './tolerant-validator.js';
import './improved-feedback.js';

// 7. Level Test & Adaptive Practice System
import './level-test-system.js';
import './adaptive-practice-system.js';

// 8. Core App (App + Loader + Renderer) - must be last
import './app-core.js';

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                window.Logger?.info('Service Worker registered:', registration.scope);

                // Check for updates every hour
                setInterval(() => {
                    registration.update();
                }, 60 * 60 * 1000);

                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            if (window.ModalDialog) {
                                window.ModalDialog.confirm(
                                    'Eine neue Version ist verfügbar. Jetzt aktualisieren?',
                                    'Aktualisieren',
                                    'Später'
                                ).then(confirmed => {
                                    if (confirmed) {
                                        newWorker.postMessage({ type: 'SKIP_WAITING' });
                                        window.location.reload();
                                    }
                                });
                            } else if (confirm('Eine neue Version ist verfügbar. Jetzt aktualisieren?')) {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch(error => {
                window.Logger?.error('Service Worker registration failed:', error);
            });
    });
}

// Log app initialization (production-aware)
window.Logger?.info('Spanish Learning App v' + (window.ENV?.getVersion() || '1.2.0'));
window.Logger?.debug('Environment:', window.ENV?.currentEnv || 'unknown');
window.Logger?.debug('Debug mode:', window.ENV?.get('enableDebugMode') || false);

// Update app info in settings modal
if (window.ENV) {
    const versionEl = document.getElementById('app-version');
    const envEl = document.getElementById('app-env');

    if (versionEl) versionEl.textContent = window.ENV.getVersion();
    if (envEl) envEl.textContent = window.ENV.currentEnv;
}
