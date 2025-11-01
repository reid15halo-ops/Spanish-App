/**
 * Enhanced Data Management System
 *
 * Provides:
 * - Multi-layer storage strategy (localStorage + fallback)
 * - Automatic periodic backups
 * - Data integrity checking
 * - Recovery from corruption
 * - Export/import functionality
 */

class DataManager {
    constructor() {
        this.version = '1.0.0';
        this.storageKey = 'spanish-app-data';
        this.backupPrefix = 'spanish-app-backup';
        this.backupInterval = 10; // Backup every 10 exercises
        this.maxBackups = 5;
        this.exerciseCount = 0;
        this.initialized = false;

        // Storage layers
        this.storage = {
            primary: null,
            fallback: null,
            backup: null
        };
    }

    /**
     * Initialize data manager
     */
    initialize() {
        if (this.initialized) {
            return;
        }

        // Setup storage layers
        this.setupStorageLayers();

        // Setup automatic backups
        this.setupAutomaticBackups();

        // Check data integrity
        this.checkDataIntegrity();

        // Setup event listeners
        this.setupEventListeners();

        this.initialized = true;

        if (window.Logger) {
            window.Logger.info('DataManager initialized');
        }
    }

    /**
     * Setup storage layers
     */
    setupStorageLayers() {
        // Primary: localStorage
        this.storage.primary = {
            available: this.testLocalStorage(),
            save: (key, data) => this.saveToLocalStorage(key, data),
            load: (key) => this.loadFromLocalStorage(key),
            remove: (key) => this.removeFromLocalStorage(key)
        };

        // Fallback: sessionStorage
        this.storage.fallback = {
            available: this.testSessionStorage(),
            save: (key, data) => this.saveToSessionStorage(key, data),
            load: (key) => this.loadFromSessionStorage(key),
            remove: (key) => this.removeFromSessionStorage(key)
        };

        // Backup: Automatic periodic backups
        this.storage.backup = {
            save: (data) => this.createAutomaticBackup(data),
            restore: () => this.restoreFromBackup(),
            list: () => this.listBackups(),
            clear: () => this.clearBackups()
        };
    }

    /**
     * Test if localStorage is available
     */
    testLocalStorage() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Test if sessionStorage is available
     */
    testSessionStorage() {
        try {
            const test = '__storage_test__';
            sessionStorage.setItem(test, test);
            sessionStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Save progress with multi-layer strategy
     */
    saveProgress(data) {
        const timestamp = new Date().toISOString();
        const versionedData = {
            version: this.version,
            timestamp: timestamp,
            data: data
        };

        try {
            // Try primary storage (localStorage)
            if (this.storage.primary.available) {
                const result = this.storage.primary.save(this.storageKey, versionedData);

                if (result.success) {
                    // Increment exercise count for backup trigger
                    this.exerciseCount++;

                    // Trigger backup if needed
                    if (this.exerciseCount % this.backupInterval === 0) {
                        this.storage.backup.save(versionedData);
                    }

                    return { success: true, method: 'localStorage', timestamp };
                }
            }

            // Fallback to sessionStorage
            if (this.storage.fallback.available) {
                const result = this.storage.fallback.save(this.storageKey, versionedData);

                if (result.success) {
                    if (window.Logger) {
                        window.Logger.warn('Using sessionStorage fallback (data will be lost on tab close)');
                    }

                    return { success: true, method: 'sessionStorage', timestamp };
                }
            }

            // No storage available
            throw new Error('No storage method available');

        } catch (error) {
            if (window.Logger) {
                window.Logger.error('Failed to save progress:', error);
            }

            // Try to create downloadable backup as last resort
            this.createDownloadableBackup(versionedData);

            return { success: false, error: error.message };
        }
    }

    /**
     * Load progress with fallback
     */
    loadProgress() {
        try {
            // Try primary storage
            if (this.storage.primary.available) {
                const data = this.storage.primary.load(this.storageKey);

                if (data && data.data) {
                    // Validate data
                    if (this.validateData(data)) {
                        return { success: true, data: data.data, method: 'localStorage' };
                    } else {
                        if (window.Logger) {
                            window.Logger.warn('Data validation failed, attempting recovery');
                        }
                    }
                }
            }

            // Try fallback storage
            if (this.storage.fallback.available) {
                const data = this.storage.fallback.load(this.storageKey);

                if (data && data.data) {
                    if (this.validateData(data)) {
                        return { success: true, data: data.data, method: 'sessionStorage' };
                    }
                }
            }

            // Try to restore from backup
            const backup = this.storage.backup.restore();
            if (backup) {
                if (window.Logger) {
                    window.Logger.info('Restored from automatic backup');
                }
                return { success: true, data: backup.data, method: 'backup' };
            }

            // No data found
            return { success: false, data: null, method: 'none' };

        } catch (error) {
            if (window.Logger) {
                window.Logger.error('Failed to load progress:', error);
            }

            return { success: false, error: error.message };
        }
    }

    /**
     * Save to localStorage
     */
    saveToLocalStorage(key, data) {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(key, serialized);
            return { success: true };
        } catch (error) {
            // Check if quota exceeded
            if (error.name === 'QuotaExceededError') {
                // Try to free up space
                this.cleanupOldData();

                // Retry
                try {
                    const serialized = JSON.stringify(data);
                    localStorage.setItem(key, serialized);
                    return { success: true };
                } catch (retryError) {
                    return { success: false, error: retryError.message };
                }
            }

            return { success: false, error: error.message };
        }
    }

    /**
     * Load from localStorage
     */
    loadFromLocalStorage(key) {
        try {
            const serialized = localStorage.getItem(key);
            if (!serialized) {
                return null;
            }
            return JSON.parse(serialized);
        } catch (error) {
            if (window.Logger) {
                window.Logger.error('Failed to load from localStorage:', error);
            }
            return null;
        }
    }

    /**
     * Remove from localStorage
     */
    removeFromLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Save to sessionStorage
     */
    saveToSessionStorage(key, data) {
        try {
            const serialized = JSON.stringify(data);
            sessionStorage.setItem(key, serialized);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Load from sessionStorage
     */
    loadFromSessionStorage(key) {
        try {
            const serialized = sessionStorage.getItem(key);
            if (!serialized) {
                return null;
            }
            return JSON.parse(serialized);
        } catch (error) {
            return null;
        }
    }

    /**
     * Remove from sessionStorage
     */
    removeFromSessionStorage(key) {
        try {
            sessionStorage.removeItem(key);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Create automatic backup
     */
    createAutomaticBackup(data) {
        try {
            const backupKey = `${this.backupPrefix}-${Date.now()}`;
            const serialized = JSON.stringify(data);
            localStorage.setItem(backupKey, serialized);

            // Cleanup old backups
            this.cleanupOldBackups();

            if (window.Logger && window.__DEV__) {
                window.Logger.debug('Automatic backup created:', backupKey);
            }

            return { success: true, key: backupKey };
        } catch (error) {
            if (window.Logger) {
                window.Logger.error('Failed to create backup:', error);
            }
            return { success: false, error: error.message };
        }
    }

    /**
     * Restore from most recent backup
     */
    restoreFromBackup() {
        const backups = this.listBackups();

        if (backups.length === 0) {
            return null;
        }

        // Get most recent backup
        const latestBackup = backups[0];

        try {
            const data = JSON.parse(localStorage.getItem(latestBackup.key));
            return data;
        } catch (error) {
            if (window.Logger) {
                window.Logger.error('Failed to restore from backup:', error);
            }
            return null;
        }
    }

    /**
     * List all backups
     */
    listBackups() {
        const backups = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (key && key.startsWith(this.backupPrefix)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    backups.push({
                        key: key,
                        timestamp: data.timestamp,
                        version: data.version
                    });
                } catch (e) {
                    // Skip invalid backups
                }
            }
        }

        // Sort by timestamp (newest first)
        backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return backups;
    }

    /**
     * Cleanup old backups (keep only max number)
     */
    cleanupOldBackups() {
        const backups = this.listBackups();

        if (backups.length > this.maxBackups) {
            // Remove oldest backups
            const toRemove = backups.slice(this.maxBackups);

            toRemove.forEach(backup => {
                try {
                    localStorage.removeItem(backup.key);
                } catch (e) {
                    // Silently fail
                }
            });
        }
    }

    /**
     * Clear all backups
     */
    clearBackups() {
        const backups = this.listBackups();

        backups.forEach(backup => {
            try {
                localStorage.removeItem(backup.key);
            } catch (e) {
                // Silently fail
            }
        });

        return { success: true, removed: backups.length };
    }

    /**
     * Create downloadable backup
     */
    createDownloadableBackup(data) {
        try {
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json'
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `spanish-app-backup-${new Date().toISOString()}.json`;
            a.click();
            URL.revokeObjectURL(url);

            return { success: true };
        } catch (error) {
            if (window.Logger) {
                window.Logger.error('Failed to create downloadable backup:', error);
            }
            return { success: false, error: error.message };
        }
    }

    /**
     * Validate data integrity
     */
    validateData(data) {
        // Check version
        if (!data.version || typeof data.version !== 'string') {
            return false;
        }

        // Check timestamp
        if (!data.timestamp) {
            return false;
        }

        // Check data structure
        if (!data.data || typeof data.data !== 'object') {
            return false;
        }

        return true;
    }

    /**
     * Check data integrity on startup
     */
    checkDataIntegrity() {
        const result = this.loadProgress();

        if (!result.success) {
            if (window.Logger) {
                window.Logger.warn('Data integrity check failed, starting with clean state');
            }
            return false;
        }

        if (window.Logger && window.__DEV__) {
            window.Logger.info('Data integrity check passed');
        }

        return true;
    }

    /**
     * Cleanup old data to free space
     */
    cleanupOldData() {
        const keysToRemove = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (key && (key.includes('temp-') || key.includes('cache-') ||
                       key.includes('old-'))) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                // Continue even if removal fails
            }
        });

        if (window.Logger && keysToRemove.length > 0) {
            window.Logger.info(`Cleaned up ${keysToRemove.length} old items`);
        }
    }

    /**
     * Setup automatic backups
     */
    setupAutomaticBackups() {
        // Automatic backups are triggered in saveProgress()
        // This method can setup additional periodic backups if needed

        // Example: Backup every 5 minutes
        setInterval(() => {
            const data = this.loadProgress();
            if (data.success && data.data) {
                this.storage.backup.save({
                    version: this.version,
                    timestamp: new Date().toISOString(),
                    data: data.data
                });
            }
        }, 5 * 60 * 1000); // 5 minutes
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Save data before page unload
        window.addEventListener('beforeunload', () => {
            // Trigger final backup
            const data = this.loadProgress();
            if (data.success && data.data) {
                this.storage.backup.save({
                    version: this.version,
                    timestamp: new Date().toISOString(),
                    data: data.data
                });
            }
        });

        // Handle storage events (for sync across tabs)
        window.addEventListener('storage', (event) => {
            if (event.key === this.storageKey) {
                if (window.Logger && window.__DEV__) {
                    window.Logger.info('Data changed in another tab');
                }

                // Optionally reload data or notify user
                // For now, just log it
            }
        });
    }

    /**
     * Export all data
     */
    exportData() {
        const result = this.loadProgress();

        if (!result.success) {
            return { success: false, error: 'No data to export' };
        }

        return this.createDownloadableBackup({
            version: this.version,
            timestamp: new Date().toISOString(),
            data: result.data
        });
    }

    /**
     * Import data from file
     */
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);

                    // Validate imported data
                    if (!this.validateData(data)) {
                        reject(new Error('Invalid data format'));
                        return;
                    }

                    // Save imported data
                    const result = this.saveProgress(data.data);

                    if (result.success) {
                        resolve({ success: true, timestamp: data.timestamp });
                    } else {
                        reject(new Error('Failed to save imported data'));
                    }
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };

            reader.readAsText(file);
        });
    }

    /**
     * Clear all data
     */
    clearAllData() {
        // Clear main data
        this.storage.primary.remove(this.storageKey);
        this.storage.fallback.remove(this.storageKey);

        // Clear backups
        this.clearBackups();

        // Reset counter
        this.exerciseCount = 0;

        return { success: true };
    }

    /**
     * Get storage info
     */
    getStorageInfo() {
        const info = {
            primaryAvailable: this.storage.primary.available,
            fallbackAvailable: this.storage.fallback.available,
            backupCount: this.listBackups().length,
            exerciseCount: this.exerciseCount,
            hasData: false
        };

        const data = this.loadProgress();
        info.hasData = data.success && data.data !== null;

        return info;
    }
}

// Create global instance
window.DataManager = new DataManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.DataManager.initialize();
    });
} else {
    window.DataManager.initialize();
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DataManager };
}
