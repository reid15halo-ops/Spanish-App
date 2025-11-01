/**
 * Enhanced Data Management System - TypeScript Version
 *
 * Multi-layer storage with backups and data integrity
 */

// ====================================================================
// TYPES & INTERFACES
// ====================================================================

interface VersionedData<T = any> {
    version: string;
    timestamp: string;
    data: T;
}

interface StorageResult {
    success: boolean;
    method?: string;
    timestamp?: string;
    error?: string;
    data?: any;
}

interface StorageLayer {
    available: boolean;
    save: (key: string, data: any) => StorageResult;
    load: (key: string) => any;
    remove: (key: string) => StorageResult;
}

interface BackupLayer {
    save: (data: any) => void;
    restore: () => any;
    list: () => string[];
    clear: () => void;
}

interface StorageLayers {
    primary: StorageLayer | null;
    fallback: StorageLayer | null;
    backup: BackupLayer | null;
}

// ====================================================================
// DATA MANAGER
// ====================================================================

class DataManager {
    private readonly version = '1.0.0';
    private readonly storageKey = 'spanish-app-data';
    private readonly backupPrefix = 'spanish-app-backup';
    private readonly backupInterval = 10;
    private readonly maxBackups = 5;
    private exerciseCount = 0;
    private initialized = false;

    private storage: StorageLayers = {
        primary: null,
        fallback: null,
        backup: null
    };

    public initialize(): void {
        if (this.initialized) return;

        this.setupStorageLayers();
        this.setupAutomaticBackups();
        this.checkDataIntegrity();
        this.setupEventListeners();

        this.initialized = true;

        if (window.Logger) {
            window.Logger.info('DataManager initialized');
        }
    }

    private setupStorageLayers(): void {
        this.storage.primary = {
            available: this.testLocalStorage(),
            save: (key, data) => this.saveToLocalStorage(key, data),
            load: (key) => this.loadFromLocalStorage(key),
            remove: (key) => this.removeFromLocalStorage(key)
        };

        this.storage.fallback = {
            available: this.testSessionStorage(),
            save: (key, data) => this.saveToSessionStorage(key, data),
            load: (key) => this.loadFromSessionStorage(key),
            remove: (key) => this.removeFromSessionStorage(key)
        };

        this.storage.backup = {
            save: (data) => this.createAutomaticBackup(data),
            restore: () => this.restoreFromBackup(),
            list: () => this.listBackups(),
            clear: () => this.clearBackups()
        };
    }

    private testLocalStorage(): boolean {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    private testSessionStorage(): boolean {
        try {
            const test = '__storage_test__';
            sessionStorage.setItem(test, test);
            sessionStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    public saveProgress(data: any): StorageResult {
        const timestamp = new Date().toISOString();
        const versionedData: VersionedData = {
            version: this.version,
            timestamp: timestamp,
            data: data
        };

        try {
            if (this.storage.primary?.available) {
                const result = this.storage.primary.save(this.storageKey, versionedData);

                if (result.success) {
                    this.exerciseCount++;

                    if (this.exerciseCount % this.backupInterval === 0) {
                        this.storage.backup?.save(versionedData);
                    }

                    return { success: true, method: 'localStorage', timestamp };
                }
            }

            if (this.storage.fallback?.available) {
                const result = this.storage.fallback.save(this.storageKey, versionedData);

                if (result.success) {
                    if (window.Logger) {
                        window.Logger.warn('Using sessionStorage fallback (data will be lost on tab close)');
                    }

                    return { success: true, method: 'sessionStorage', timestamp };
                }
            }

            throw new Error('No storage method available');

        } catch (error: any) {
            if (window.Logger) {
                window.Logger.error('Failed to save progress:', error);
            }

            this.createDownloadableBackup(versionedData);

            return { success: false, error: error.message };
        }
    }

    public loadProgress(): StorageResult {
        try {
            if (this.storage.primary?.available) {
                const data = this.storage.primary.load(this.storageKey);

                if (data && data.data) {
                    if (this.validateData(data)) {
                        return { success: true, data: data.data, method: 'localStorage' };
                    } else {
                        if (window.Logger) {
                            window.Logger.warn('Data validation failed, attempting recovery');
                        }
                    }
                }
            }

            if (this.storage.fallback?.available) {
                const data = this.storage.fallback.load(this.storageKey);

                if (data && data.data) {
                    if (this.validateData(data)) {
                        return { success: true, data: data.data, method: 'sessionStorage' };
                    }
                }
            }

            const backup = this.storage.backup?.restore();
            if (backup) {
                if (window.Logger) {
                    window.Logger.info('Restored from automatic backup');
                }
                return { success: true, data: backup.data, method: 'backup' };
            }

            return { success: false, data: null, method: 'none' };

        } catch (error: any) {
            if (window.Logger) {
                window.Logger.error('Failed to load progress:', error);
            }

            return { success: false, error: error.message };
        }
    }

    private saveToLocalStorage(key: string, data: any): StorageResult {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(key, serialized);
            return { success: true };
        } catch (error: any) {
            if (error.name === 'QuotaExceededError') {
                this.cleanupOldData();

                try {
                    const serialized = JSON.stringify(data);
                    localStorage.setItem(key, serialized);
                    return { success: true };
                } catch (retryError: any) {
                    return { success: false, error: retryError.message };
                }
            }

            return { success: false, error: error.message };
        }
    }

    private loadFromLocalStorage(key: string): any {
        try {
            const serialized = localStorage.getItem(key);
            if (!serialized) return null;
            return JSON.parse(serialized);
        } catch (error) {
            if (window.Logger) {
                window.Logger.error('Failed to load from localStorage:', error);
            }
            return null;
        }
    }

    private removeFromLocalStorage(key: string): StorageResult {
        try {
            localStorage.removeItem(key);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    private saveToSessionStorage(key: string, data: any): StorageResult {
        try {
            const serialized = JSON.stringify(data);
            sessionStorage.setItem(key, serialized);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    private loadFromSessionStorage(key: string): any {
        try {
            const serialized = sessionStorage.getItem(key);
            if (!serialized) return null;
            return JSON.parse(serialized);
        } catch (error) {
            return null;
        }
    }

    private removeFromSessionStorage(key: string): StorageResult {
        try {
            sessionStorage.removeItem(key);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    private createAutomaticBackup(data: any): void {
        try {
            const backupKey = `${this.backupPrefix}-${Date.now()}`;
            localStorage.setItem(backupKey, JSON.stringify(data));

            const backups = this.listBackups();
            if (backups.length > this.maxBackups) {
                const oldestBackup = backups[0];
                if (oldestBackup) {
                    localStorage.removeItem(oldestBackup);
                }
            }
        } catch (error) {
            if (window.Logger) {
                window.Logger.error('Failed to create backup:', error);
            }
        }
    }

    private restoreFromBackup(): any {
        try {
            const backups = this.listBackups();
            if (backups.length === 0) return null;

            const latestBackup = backups[backups.length - 1];
            if (!latestBackup) return null;

            const serialized = localStorage.getItem(latestBackup);
            if (!serialized) return null;

            return JSON.parse(serialized);
        } catch (error) {
            return null;
        }
    }

    private listBackups(): string[] {
        const backups: string[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.backupPrefix)) {
                backups.push(key);
            }
        }

        return backups.sort();
    }

    private clearBackups(): void {
        const backups = this.listBackups();
        backups.forEach(key => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                // Continue
            }
        });
    }

    private validateData(data: any): boolean {
        return data && data.version && data.timestamp && data.data !== undefined;
    }

    private cleanupOldData(): void {
        const keysToRemove: string[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (key && (key.includes('temp-') || key.includes('cache-') || key.includes('old-'))) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                // Continue
            }
        });
    }

    private checkDataIntegrity(): void {
        const result = this.loadProgress();
        if (result.success && result.data) {
            if (window.Logger) {
                window.Logger.info('Data integrity check passed');
            }
        }
    }

    private setupAutomaticBackups(): void {
        // Automatic backup is triggered in saveProgress
    }

    private setupEventListeners(): void {
        window.addEventListener('beforeunload', () => {
            // Final save before unload
        });
    }

    private createDownloadableBackup(data: any): void {
        try {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            if (window.Logger) {
                window.Logger.error('Failed to create downloadable backup:', error);
            }
        }
    }

    public exportData(): void {
        const result = this.loadProgress();
        if (result.success && result.data) {
            this.createDownloadableBackup({
                version: this.version,
                timestamp: new Date().toISOString(),
                data: result.data
            });
        }
    }

    public importData(jsonString: string): StorageResult {
        try {
            const imported = JSON.parse(jsonString);

            if (this.validateData(imported)) {
                return this.saveProgress(imported.data);
            }

            return { success: false, error: 'Invalid data format' };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    public clearAllData(): void {
        this.storage.primary?.remove(this.storageKey);
        this.storage.fallback?.remove(this.storageKey);
        this.clearBackups();
    }
}

// Create global instance
window.DataManager = new DataManager();
