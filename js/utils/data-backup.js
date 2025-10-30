/**
 * Data Backup and Restore System
 *
 * Handles user data backup, export, import with encryption
 * GDPR-compliant with user control over their data
 */

class DataBackupSystem {
    constructor() {
        this.version = '1.0.0';
        this.backupPrefix = 'spanish-app-backup';
    }

    /**
     * Create complete backup of user data
     */
    async createBackup() {
        const backup = {
            version: this.version,
            timestamp: Date.now(),
            appVersion: window.ENV?.getVersion() || '1.0.0',
            data: {
                // Adaptive learning data
                knowledgeTracker: this.getLocalStorageData('adaptive-knowledge'),
                learningProgress: this.getLocalStorageData('learning-progress'),
                sessionHistory: this.getLocalStorageData('session-history'),

                // User settings
                settings: this.getLocalStorageData('spanish-app-settings'),

                // Exercise progress
                exerciseProgress: this.getLocalStorageData('spanish-app-progress'),

                // Statistics
                stats: this.getLocalStorageData('learning-stats'),

                // Personal patterns
                personalPatterns: this.getLocalStorageData('personal-patterns'),

                // Sidebar state
                uiState: this.getLocalStorageData('sidebar-collapsed')
            },
            checksum: null
        };

        // Calculate checksum for integrity
        backup.checksum = await this.calculateChecksum(backup.data);

        return backup;
    }

    /**
     * Export backup to JSON file
     */
    async exportBackup(encrypt = false, password = null) {
        const backup = await this.createBackup();

        let dataToExport = backup;

        if (encrypt && password) {
            dataToExport = await this.encryptBackup(backup, password);
        }

        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
            type: 'application/json'
        });

        const filename = `${this.backupPrefix}-${new Date().toISOString().split('T')[0]}.json`;
        this.downloadBlob(blob, filename);

        return {
            success: true,
            filename,
            size: blob.size,
            encrypted: encrypt
        };
    }

    /**
     * Import backup from file
     */
    async importBackup(file, password = null) {
        try {
            const text = await file.text();
            let backup = JSON.parse(text);

            // Check if encrypted
            if (backup.encrypted && password) {
                backup = await this.decryptBackup(backup, password);
            }

            // Validate backup
            const isValid = await this.validateBackup(backup);
            if (!isValid) {
                throw new Error('Invalid backup file or corrupted data');
            }

            // Check version compatibility
            if (!this.isCompatibleVersion(backup.version)) {
                throw new Error(`Incompatible backup version: ${backup.version}`);
            }

            return {
                backup,
                valid: true,
                version: backup.version,
                timestamp: backup.timestamp
            };
        } catch (error) {
            return {
                valid: false,
                error: error.message
            };
        }
    }

    /**
     * Restore data from backup
     */
    async restoreBackup(backup, options = {}) {
        const {
            overwrite = true,
            merge = false,
            confirm = true
        } = options;

        if (confirm) {
            const confirmRestore = window.confirm(
                'This will restore your data from the backup. Continue?'
            );
            if (!confirmRestore) {
                return { success: false, cancelled: true };
            }
        }

        try {
            // Backup current data first (safety)
            const safetyBackup = await this.createBackup();
            sessionStorage.setItem('safety-backup', JSON.stringify(safetyBackup));

            // Restore data
            for (const [key, value] of Object.entries(backup.data)) {
                if (value !== null) {
                    if (merge && this.getLocalStorageData(key)) {
                        // Merge with existing data
                        const existing = this.getLocalStorageData(key);
                        const merged = { ...existing, ...value };
                        localStorage.setItem(this.getStorageKey(key), JSON.stringify(merged));
                    } else {
                        // Overwrite
                        localStorage.setItem(this.getStorageKey(key), JSON.stringify(value));
                    }
                }
            }

            return {
                success: true,
                restoredAt: Date.now(),
                itemsRestored: Object.keys(backup.data).length
            };
        } catch (error) {
            // Attempt to restore safety backup
            const safetyBackup = sessionStorage.getItem('safety-backup');
            if (safetyBackup) {
                console.error('Restore failed, reverting to safety backup');
                // Could implement automatic revert here
            }

            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get localStorage data safely
     */
    getLocalStorageData(key) {
        try {
            const data = localStorage.getItem(this.getStorageKey(key));
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error reading ${key}:`, error);
            return null;
        }
    }

    /**
     * Get storage key (add prefix if needed)
     */
    getStorageKey(key) {
        // Some keys already have prefixes
        if (key.startsWith('spanish-app') || key.startsWith('adaptive') ||
            key.startsWith('learning') || key.startsWith('session')) {
            return key;
        }
        return key;
    }

    /**
     * Calculate checksum for data integrity
     */
    async calculateChecksum(data) {
        const str = JSON.stringify(data);
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(str);

        if (window.crypto && window.crypto.subtle) {
            const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        // Fallback simple checksum
        return this.simpleChecksum(str);
    }

    /**
     * Simple checksum fallback
     */
    simpleChecksum(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(16);
    }

    /**
     * Validate backup integrity
     */
    async validateBackup(backup) {
        if (!backup.version || !backup.timestamp || !backup.data) {
            return false;
        }

        // Verify checksum if present
        if (backup.checksum) {
            const calculatedChecksum = await this.calculateChecksum(backup.data);
            if (calculatedChecksum !== backup.checksum) {
                console.error('Checksum mismatch - data may be corrupted');
                return false;
            }
        }

        return true;
    }

    /**
     * Check version compatibility
     */
    isCompatibleVersion(backupVersion) {
        // For now, accept all 1.x.x versions
        const major = backupVersion.split('.')[0];
        return major === '1';
    }

    /**
     * Encrypt backup (simple AES-GCM)
     */
    async encryptBackup(backup, password) {
        if (!window.crypto || !window.crypto.subtle) {
            console.warn('Encryption not available, saving unencrypted');
            return backup;
        }

        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(JSON.stringify(backup));

            // Derive key from password
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                encoder.encode(password),
                { name: 'PBKDF2' },
                false,
                ['deriveKey']
            );

            const salt = crypto.getRandomValues(new Uint8Array(16));
            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt']
            );

            const iv = crypto.getRandomValues(new Uint8Array(12));
            const encrypted = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                data
            );

            return {
                encrypted: true,
                version: this.version,
                salt: Array.from(salt),
                iv: Array.from(iv),
                data: Array.from(new Uint8Array(encrypted))
            };
        } catch (error) {
            console.error('Encryption failed:', error);
            return backup;
        }
    }

    /**
     * Decrypt backup
     */
    async decryptBackup(encryptedBackup, password) {
        if (!window.crypto || !window.crypto.subtle) {
            throw new Error('Decryption not available');
        }

        try {
            const encoder = new TextEncoder();
            const decoder = new TextDecoder();

            // Derive key from password
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                encoder.encode(password),
                { name: 'PBKDF2' },
                false,
                ['deriveKey']
            );

            const salt = new Uint8Array(encryptedBackup.salt);
            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['decrypt']
            );

            const iv = new Uint8Array(encryptedBackup.iv);
            const data = new Uint8Array(encryptedBackup.data);

            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                data
            );

            const decryptedText = decoder.decode(decrypted);
            return JSON.parse(decryptedText);
        } catch (error) {
            throw new Error('Decryption failed - wrong password?');
        }
    }

    /**
     * Download blob as file
     */
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Auto-backup to localStorage (weekly)
     */
    async autoBackup() {
        const lastBackup = localStorage.getItem('last-auto-backup');
        const now = Date.now();
        const weekInMs = 7 * 24 * 60 * 60 * 1000;

        if (!lastBackup || (now - parseInt(lastBackup)) > weekInMs) {
            const backup = await this.createBackup();
            localStorage.setItem('auto-backup', JSON.stringify(backup));
            localStorage.setItem('last-auto-backup', now.toString());
            console.log('Auto-backup created');
        }
    }

    /**
     * Clear all user data (GDPR right to deletion)
     */
    async clearAllData(confirm = true) {
        if (confirm) {
            const confirmDelete = window.confirm(
                'This will permanently delete all your learning data. This cannot be undone. Continue?'
            );
            if (!confirmDelete) {
                return { success: false, cancelled: true };
            }

            const doubleConfirm = window.prompt(
                'Type "DELETE" to confirm permanent data deletion:'
            );
            if (doubleConfirm !== 'DELETE') {
                return { success: false, cancelled: true };
            }
        }

        // Create final backup before deletion
        const finalBackup = await this.exportBackup(false);

        // Clear all Spanish app data
        const keys = Object.keys(localStorage);
        const appKeys = keys.filter(key =>
            key.startsWith('spanish-app') ||
            key.startsWith('adaptive') ||
            key.startsWith('learning') ||
            key.startsWith('session') ||
            key.includes('sidebar')
        );

        appKeys.forEach(key => localStorage.removeItem(key));

        // Clear IndexedDB if used
        if (window.indexedDB) {
            indexedDB.deleteDatabase('spanish-app-db');
        }

        return {
            success: true,
            deletedKeys: appKeys.length,
            finalBackup: finalBackup
        };
    }
}

// Create global instance
window.DataBackup = new DataBackupSystem();

// Auto-backup on page load
if (window.ENV && !window.ENV.isDevelopment()) {
    window.addEventListener('load', () => {
        window.DataBackup.autoBackup();
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DataBackupSystem };
}
