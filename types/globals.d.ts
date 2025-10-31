/**
 * Global Type Declarations
 *
 * Declares types for global window objects and third-party libraries
 * This enables TypeScript to understand the runtime environment
 */

import type {
  Exercise,
  ValidationResult,
  UserProgress,
  UserSettings,
  LogLevel,
  PerformanceMetric,
  ErrorLog,
  BackupData,
  GDPRDataExport
} from './core';

// ====================================================================
// WINDOW GLOBAL OBJECTS
// ====================================================================

declare global {
  interface Window {
    // Environment Configuration (already declared in environment.ts, but include here for completeness)
    ENV: {
      currentEnv: 'development' | 'staging' | 'production';
      get<T = any>(key: string): T;
      getAll(): Record<string, any>;
      isProduction(): boolean;
      isDevelopment(): boolean;
      isStaging(): boolean;
      getVersion(): string;
      getFeatureFlag(featureName: string): boolean;
      log(level: LogLevel, message: string, ...args: any[]): void;
    };

    // Logger System
    Logger: {
      debug(message: string, ...args: any[]): void;
      info(message: string, ...args: any[]): void;
      warn(message: string, ...args: any[]): void;
      error(message: string, ...args: any[]): void;
      success(message: string, ...args: any[]): void;
      setLevel(level: LogLevel): void;
      getLevel(): LogLevel;
    };

    // Main App Instance (class constructor)
    App: {
      init(): Promise<void>;
      loadUnit(unitNumber: number): Promise<void>;
      showExercise(index: number): void;
      handleAnswer(answer: string): void;
      nextExercise(): void;
      previousExercise(): void;
      getProgress(): UserProgress;
      saveProgress(): void;
      loadProgress(): UserProgress | null;
    };

    // Main app instance (lowercase - the actual running instance)
    app?: {
      next(): void;
      previous(): void;
      submit(answer: string): void;
      autoAdvanceTimeout?: number;
      // Add other methods as needed
    };

    // Exercise Loader
    ExerciseLoader: {
      new(): ExerciseLoader;
      loadUnit(unitNumber: number): Promise<{
        metadata: any;
        exercises: Exercise[];
        phases?: any[];
      }>;
      getUnitInfo(unitNumber: number): Promise<any>;
    };

    // Exercise Renderer
    ExerciseRenderer: {
      new(container: HTMLElement): ExerciseRenderer;
      render(exercise: Exercise): void;
      clear(): void;
    };

    // Tolerant Answer Validator
    TolerantAnswerValidator: {
      new(): TolerantAnswerValidator;
      validateAnswer(
        userAnswer: string,
        correctAnswer: string,
        exercise: Exercise
      ): ValidationResult;
    };

    // Improved Feedback System
    ImprovedFeedbackSystem: {
      new(): ImprovedFeedbackSystem;
      showValidationResult(result: ValidationResult, exercise: Exercise): void;
      clear(): void;
    };

    // Adaptive Learning Orchestrator
    AdaptiveLearningOrchestrator: {
      new(): AdaptiveLearningOrchestrator;
      startSession(): void;
      getNextOptimizedExercise(
        exercises: Exercise[],
        currentUnit: number,
        userProgress: UserProgress
      ): Exercise | null;
      recordExerciseAttempt(
        exercise: Exercise,
        userAnswer: string,
        isCorrect: boolean,
        responseTime: number
      ): void;
      endSession(): any;
      getLearningInsights(): any;
      generateRecommendations(): any[];
    };

    // Data Backup System
    DataBackup: {
      exportBackup(): void;
      importBackup(event: Event): void;
      clearAllData(): void;
      createBackup(): BackupData;
      restoreBackup(backup: BackupData): boolean;
    };

    // GDPR Compliance
    GDPR: {
      exerciseRightToAccess(): void;
      exerciseRightToDeletion(): void;
      exportData(): GDPRDataExport;
      showPrivacyPolicy(): void;
    };

    // Performance Monitor
    PerformanceMonitor: {
      recordMetric(metric: PerformanceMetric): void;
      getMetrics(): PerformanceMetric[];
      clearMetrics(): void;
      reportToConsole(): void;
    };

    // Error Handler
    ErrorHandler: {
      captureError(error: Error, context?: Record<string, any>): void;
      getErrors(): ErrorLog[];
      clearErrors(): void;
    };

    // Unit Data (Inlined from exercise-data.js)
    UNIT_1_PRONOUNS: {
      metadata: any;
      learningPhases: any[];
      exercises: Exercise[];
    };
    UNIT_2_SER: {
      metadata: any;
      learningPhases: any[];
      exercises: Exercise[];
    };
    UNIT_3_ESTAR: {
      metadata: any;
      learningPhases: any[];
      exercises: Exercise[];
    };
    UNIT_4_SER_ESTAR_CONTRAST: {
      metadata: any;
      learningPhases: any[];
      exercises: Exercise[];
    };
    UNIT_5_TENER: {
      metadata: any;
      learningPhases: any[];
      exercises: Exercise[];
    };
    UNIT_6_VOCABULARY: {
      metadata: any;
      learningPhases: any[];
      exercises: Exercise[];
    };
    UNIT_7_INTEGRATION: {
      metadata: any;
      learningPhases: any[];
      exercises: Exercise[];
    };
    PHASE_1_VOCABULARY: any;

    // Loading Spinner
    LoadingSpinner?: {
      show(message?: string): void;
      hide(): void;
    };

    // Loading Manager
    LoadingManager?: {
      show(container: string, message?: string): string | number;
      hide(id?: string | number): void;
    };

    // Error Boundary
    ErrorBoundary?: {
      handleError(error: Error, context?: Record<string, any>): void;
    };

    // Adaptive Learning System
    AdaptiveLearningSystem: new () => any;

    // Level Test System
    LevelTestSystem: new () => any;

    // Adaptive Practice System
    AdaptivePracticeSystem: new () => any;

    // Unit Getter Function
    getUnit?: (unitNumber: number) => any;

    // Lazy Exercise Loader
    LazyExerciseLoader?: new () => any;

    // Spanish App Instance
    SpanishApp?: {
      currentExerciseIndex?: number;
      allExercises?: any[];
      renderCurrentExercise?: (...args: any[]) => any;
    };

    // Performance Optimizer
    PerformanceOptimizer?: any;

    // Production Config
    ProductionConfig?: any;

    // React DevTools Hook (for future React integration)
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;

    // Development flag
    __DEV__?: boolean;
    __PRODUCTION__?: boolean;
  }

  // Class interfaces (for constructor types)
  interface ExerciseLoader {
    loadUnit(unitNumber: number): Promise<{
      metadata: any;
      exercises: Exercise[];
      phases?: any[];
    }>;
    getUnitInfo(unitNumber: number): Promise<any>;
  }

  interface ExerciseRenderer {
    render(exercise: Exercise): void;
    clear(): void;
  }

  interface TolerantAnswerValidator {
    validateAnswer(
      userAnswer: string,
      correctAnswer: string,
      exercise: Exercise
    ): ValidationResult;
  }

  interface ImprovedFeedbackSystem {
    showValidationResult(result: ValidationResult, exercise: Exercise): void;
    clear(): void;
  }

  interface AdaptiveLearningOrchestrator {
    startSession(): void;
    getNextOptimizedExercise(
      exercises: Exercise[],
      currentUnit: number,
      userProgress: UserProgress
    ): Exercise | null;
    recordExerciseAttempt(
      exercise: Exercise,
      userAnswer: string,
      isCorrect: boolean,
      responseTime: number
    ): void;
    endSession(): any;
    getLearningInsights(): any;
    generateRecommendations(): any[];
  }
}

// ====================================================================
// THIRD-PARTY LIBRARIES
// ====================================================================

// Service Worker API (already included in lib.dom, but for reference)
interface ServiceWorkerGlobalScope {
  addEventListener(type: string, listener: EventListener): void;
}

// ====================================================================
// MODULE AUGMENTATION
// ====================================================================

// Augment console to include 'success' method (custom)
interface Console {
  success?(message?: any, ...optionalParams: any[]): void;
}

// Augment Performance to include Chrome's memory API
interface Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

export {};
