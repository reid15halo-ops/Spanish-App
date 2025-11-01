/**
 * Global type definitions for window object extensions
 */

declare global {
    interface Window {
        ENV: any;
        ErrorMonitor: any;
        PerformanceMonitor: any;
        Logger: any;
        LoadingManager: any;
        DataManager: any;
        DataBackup: any;
        GDPR: any;
        app: any;
        TolerantAnswerValidator: any;
        ImprovedFeedbackSystem: any;
        AdaptiveLearning: any;
        AdaptiveLearningSystem: any;
        AdaptivePracticeSystem: any;
        LevelTestSystem: any;
        ErrorHandler: any;
        ExerciseData: any;
        ProductionConfig: any;
        PerformanceOptimizer: any;
        getUnit?: (unitNumber: number) => any;
        __DEV__?: boolean;
    }
}

export {};
