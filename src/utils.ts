/**
 * Consolidated Utilities Module - TypeScript Version
 *
 * Core utility classes with type safety:
 * - Logger
 * - LoadingManager
 * - DataBackupSystem
 * - GDPRCompliance
 * - TouchGestureManager
 * - AccessibilityManager
 * - SpanishKeyboardHelper
 * - HapticFeedbackManager
 */

import type { LogLevel } from './types';

// ====================================================================
// TYPES & INTERFACES
// ====================================================================

interface LogLevels {
    debug: number;
    info: number;
    warn: number;
    error: number;
}

interface EnvInterface {
    isDevelopment?: () => boolean;
    get: (key: string) => any;
}

// ====================================================================
// LOGGER
// ====================================================================

class Logger {
    private env: EnvInterface;
    private logLevel: string;
    private levels: LogLevels = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
    };

    constructor() {
        this.env = window.ENV || { isDevelopment: () => false, get: () => 'error' };
        this.logLevel = this.env.get('logLevel') || 'error';
    }

    private shouldLog(level: LogLevel): boolean {
        const currentLevel = this.levels[this.logLevel as LogLevel] || this.levels.error;
        const messageLevel = this.levels[level] || this.levels.error;
        return messageLevel >= currentLevel;
    }

    public debug(...args: any[]): void {
        if (this.shouldLog('debug')) {
            console.log('[DEBUG]', ...args);
        }
    }

    public info(...args: any[]): void {
        if (this.shouldLog('info')) {
            console.log('[INFO]', ...args);
        }
    }

    public warn(...args: any[]): void {
        if (this.shouldLog('warn')) {
            console.warn('[WARN]', ...args);
        }
    }

    public error(...args: any[]): void {
        if (this.shouldLog('error')) {
            console.error('[ERROR]', ...args);
        }
    }

    public success(...args: any[]): void {
        if (this.env.isDevelopment && this.env.isDevelopment()) {
            console.log('[SUCCESS]', '✅', ...args);
        }
    }

    public group(label: string): void {
        if (this.env.isDevelopment && this.env.isDevelopment()) {
            console.group(label);
        }
    }

    public groupEnd(): void {
        if (this.env.isDevelopment && this.env.isDevelopment()) {
            console.groupEnd();
        }
    }

    public table(data: any): void {
        if (this.env.isDevelopment && this.env.isDevelopment()) {
            console.table(data);
        }
    }

    public time(label: string): void {
        if (this.env.isDevelopment && this.env.isDevelopment()) {
            console.time(label);
        }
    }

    public timeEnd(label: string): void {
        if (this.env.isDevelopment && this.env.isDevelopment()) {
            console.timeEnd(label);
        }
    }
}

// ====================================================================
// LOADING MANAGER
// ====================================================================

class LoadingManager {
    private activeLoaders: Set<string> = new Set();

    public show(container: string | HTMLElement, message = 'Lädt...'): string {
        const loaderId = 'loader-' + Date.now();
        const containerEl = typeof container === 'string'
            ? document.getElementById(container)
            : container;

        if (!containerEl) {
            window.Logger?.warn('Loading container not found:', container);
            return loaderId;
        }

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

    public hide(loaderId: string): void {
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

    public showInline(container: string | HTMLElement, message = 'Lädt...'): string {
        const loaderId = 'inline-loader-' + Date.now();
        const containerEl = typeof container === 'string'
            ? document.getElementById(container)
            : container;

        if (!containerEl) return loaderId;

        const loader = document.createElement('span');
        loader.id = loaderId;
        loader.className = 'inline-loader';
        loader.innerHTML = `<span class="spinner-small"></span> ${message}`;

        containerEl.appendChild(loader);
        this.activeLoaders.add(loaderId);

        return loaderId;
    }

    public hideAll(): void {
        this.activeLoaders.forEach(loaderId => {
            this.hide(loaderId);
        });
    }
}

// ====================================================================
// DATA BACKUP SYSTEM
// ====================================================================

class DataBackupSystem {
    public exportToJSON(): void {
        const data = window.DataManager?.loadProgress();

        if (data && data.success) {
            const exportData = {
                version: '1.0.0',
                exportDate: new Date().toISOString(),
                data: data.data
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `spanish-app-backup-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    public importFromJSON(file: File): Promise<boolean> {
        return new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target?.result as string);

                    if (data && data.data) {
                        const result = window.DataManager?.saveProgress(data.data);
                        resolve(result?.success || false);
                    } else {
                        resolve(false);
                    }
                } catch (error) {
                    resolve(false);
                }
            };

            reader.readAsText(file);
        });
    }
}

// ====================================================================
// GDPR COMPLIANCE
// ====================================================================

class GDPRCompliance {
    private readonly storageKey = 'gdpr-consent';

    public hasConsent(): boolean {
        try {
            const consent = localStorage.getItem(this.storageKey);
            return consent === 'true';
        } catch {
            return false;
        }
    }

    public grantConsent(): void {
        try {
            localStorage.setItem(this.storageKey, 'true');
        } catch (error) {
            window.Logger?.error('Failed to save consent:', error);
        }
    }

    public revokeConsent(): void {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            window.Logger?.error('Failed to revoke consent:', error);
        }
    }

    public showConsentBanner(): void {
        if (this.hasConsent()) return;

        const banner = document.createElement('div');
        banner.id = 'gdpr-banner';
        banner.className = 'gdpr-banner';
        banner.innerHTML = `
            <div class="gdpr-content">
                <p>Diese App verwendet lokalen Speicher, um deinen Fortschritt zu speichern.</p>
                <div class="gdpr-buttons">
                    <button id="gdpr-accept" class="btn-primary">Akzeptieren</button>
                    <button id="gdpr-decline" class="btn-secondary">Ablehnen</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        document.getElementById('gdpr-accept')?.addEventListener('click', () => {
            this.grantConsent();
            banner.remove();
        });

        document.getElementById('gdpr-decline')?.addEventListener('click', () => {
            banner.remove();
        });
    }
}

// ====================================================================
// TOUCH GESTURE MANAGER
// ====================================================================

class TouchGestureManager {
    private touchStartX = 0;
    private touchStartY = 0;
    private swipeThreshold = 50;

    public enableSwipeNavigation(
        onSwipeLeft?: () => void,
        onSwipeRight?: () => void
    ): void {
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0]?.clientX || 0;
            this.touchStartY = e.touches[0]?.clientY || 0;
        });

        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0]?.clientX || 0;
            const touchEndY = e.changedTouches[0]?.clientY || 0;

            const deltaX = touchEndX - this.touchStartX;
            const deltaY = touchEndY - this.touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > this.swipeThreshold && onSwipeRight) {
                    onSwipeRight();
                } else if (deltaX < -this.swipeThreshold && onSwipeLeft) {
                    onSwipeLeft();
                }
            }
        });
    }
}

// ====================================================================
// ACCESSIBILITY MANAGER
// ====================================================================

class AccessibilityManager {
    public initialize(): void {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupFocusManagement();
    }

    private setupKeyboardNavigation(): void {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }

    private setupScreenReaderSupport(): void {
        // Add ARIA labels where needed
    }

    private setupFocusManagement(): void {
        // Manage focus for modals and overlays
    }

    public announceToScreenReader(message: string): void {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => announcement.remove(), 1000);
    }
}

// ====================================================================
// SPANISH KEYBOARD HELPER
// ====================================================================

class SpanishKeyboardHelper {
    private readonly specialChars: Record<string, string> = {
        'á': 'á', 'é': 'é', 'í': 'í', 'ó': 'ó', 'ú': 'ú',
        'ñ': 'ñ', '¿': '¿', '¡': '¡'
    };

    public insertCharacter(input: HTMLInputElement, char: string): void {
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        const text = input.value;

        input.value = text.substring(0, start) + char + text.substring(end);
        input.selectionStart = input.selectionEnd = start + char.length;
        input.focus();
    }

    public createKeyboard(targetInput: HTMLInputElement): HTMLElement {
        const keyboard = document.createElement('div');
        keyboard.className = 'spanish-keyboard';

        Object.entries(this.specialChars).forEach(([key, char]) => {
            const btn = document.createElement('button');
            btn.textContent = char;
            btn.className = 'spanish-char-btn';
            btn.onclick = () => this.insertCharacter(targetInput, char);
            keyboard.appendChild(btn);
        });

        return keyboard;
    }
}

// ====================================================================
// HAPTIC FEEDBACK MANAGER
// ====================================================================

class HapticFeedbackManager {
    private supported: boolean;

    constructor() {
        this.supported = 'vibrate' in navigator;
    }

    public light(): void {
        if (this.supported) {
            navigator.vibrate(10);
        }
    }

    public medium(): void {
        if (this.supported) {
            navigator.vibrate(20);
        }
    }

    public heavy(): void {
        if (this.supported) {
            navigator.vibrate(50);
        }
    }

    public success(): void {
        if (this.supported) {
            navigator.vibrate([10, 50, 10]);
        }
    }

    public error(): void {
        if (this.supported) {
            navigator.vibrate([50, 100, 50]);
        }
    }
}

// ====================================================================
// CREATE GLOBAL INSTANCES
// ====================================================================

window.Logger = new Logger();
window.DataBackup = new DataBackupSystem();
window.GDPR = new GDPRCompliance();
