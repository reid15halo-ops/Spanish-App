/**
 * Shared type definitions for the Spanish Learning App
 */

// ====================================================================
// VALIDATION TYPES
// ====================================================================

export type Severity = 'error' | 'warning' | 'info' | 'success';
export type ImprovementType = 'accent' | 'punctuation' | 'capitalization';
export type ErrorType = 'word_count' | 'word_error';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface ValidationFeedback {
    primary: string;
    secondary: string;
    severity: Severity;
}

export interface StyleImprovement {
    type: ImprovementType;
    userVersion: string;
    correctVersion: string;
    explanation: string;
    severity: Severity;
}

export interface CoreError {
    type: ErrorType;
    message: string;
    severity: Severity;
    position?: number;
    userWord?: string;
    correctWord?: string;
}

export interface ValidationResult {
    isCorrect: boolean;
    isAcceptable: boolean;
    coreErrors: CoreError[];
    styleImprovements: StyleImprovement[];
    feedback: ValidationFeedback;
    correctAnswer: string;
}

// ====================================================================
// EXERCISE TYPES
// ====================================================================

export interface Exercise {
    id?: string;
    type?: string;
    question?: string;
    answer?: string;
    [key: string]: any;
}
