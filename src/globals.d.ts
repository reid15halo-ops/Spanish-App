/**
 * Global type definitions for window object extensions
 */

declare global {
    interface Window {
        ENV: any;
        ErrorMonitor: any;
        PerformanceMonitor: any;
        Logger: any;
        DataManager: any;
        DataBackup: any;
        GDPR: any;
        app: any;
    }
}

export {};
