/**
 * Core Type Definitions for Spanish Learning App
 *
 * This file contains all base interfaces and types used throughout the application.
 * These types provide IntelliSense, type safety, and documentation.
 *
 * Migration Strategy: Start with these core types, then gradually apply them to modules.
 */

// ====================================================================
// EXERCISE TYPES
// ====================================================================

/**
 * All possible exercise types in the application
 */
export type ExerciseType =
  | 'multiple-choice'
  | 'fill-blank'
  | 'translation'
  | 'vocabulary'
  | 'reading-comprehension'
  | 'dialog'
  | 'conjugation'
  | 'word-order';

/**
 * Difficulty levels for exercises
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Learning phases within a unit
 */
export type LearningPhase = 'introduction' | 'practice' | 'mastery' | 'review';

/**
 * Knowledge level tracking for spaced repetition
 */
export type KnowledgeLevel =
  | 'new'          // Never seen before
  | 'learning'     // Currently being learned
  | 'familiar'     // Seen multiple times, getting better
  | 'mastered'     // Consistently correct
  | 'struggling'   // Multiple recent failures
  | 'critical';    // Needs immediate attention

/**
 * Main Exercise interface - represents a single learning exercise
 */
export interface Exercise {
  id: string;
  type: ExerciseType;
  unit: number;
  concept: string;
  question: string;
  correctAnswer: string;
  options?: string[];          // For multiple-choice exercises
  hint?: string;               // Hint shown after failures
  explanation?: string;        // Detailed explanation
  germanBridge?: string;       // German mnemonic bridge
  difficulty?: DifficultyLevel;
  tags?: string[];
  phase?: LearningPhase;
  metadata?: ExerciseMetadata;
}

/**
 * Additional metadata for exercises
 */
export interface ExerciseMetadata {
  estimatedTime: number;       // Seconds
  focusArea: string;           // Main learning focus
  prerequisites?: string[];    // Required concepts
  relatedConcepts?: string[];  // Related learning topics
  audioUrl?: string;           // Optional audio pronunciation
  imageUrl?: string;           // Optional visual aid
}

// ====================================================================
// VALIDATION & FEEDBACK
// ====================================================================

/**
 * Result of answer validation
 */
export interface ValidationResult {
  isCorrect: boolean;          // Core validation (words + grammar)
  isAcceptable: boolean;       // Tolerant validation
  coreErrors: string[];        // Serious errors (blocking)
  styleImprovements: StyleImprovement[];  // Non-blocking suggestions
  feedback: ValidationFeedback;
  correctAnswer?: string;      // Shown if answer is wrong
}

/**
 * Style improvement suggestion (accents, punctuation, capitalization)
 */
export interface StyleImprovement {
  type: 'accent' | 'punctuation' | 'capitalization';
  userVersion: string;
  correctVersion: string;
  explanation: string;
  severity: 'info' | 'warning';
}

/**
 * Feedback provided to the user
 */
export interface ValidationFeedback {
  primary: string;             // Main feedback message
  secondary?: string;          // Additional context
  severity: 'info' | 'warning' | 'error' | 'success';
}

// ====================================================================
// USER PROGRESS & STATE
// ====================================================================

/**
 * Complete user progress state
 */
export interface UserProgress {
  currentUnit: number;
  currentIndex: number;
  completedExercises: string[];  // Exercise IDs
  stats: ProgressStats;
  knowledgeState: Record<string, KnowledgeItem>;
  settings: UserSettings;
  lastActivity: string;          // ISO date string
  sessionHistory: SessionRecord[];
}

/**
 * Progress statistics
 */
export interface ProgressStats {
  correct: number;
  total: number;
  accuracy: number;
  totalTimeSpent: number;        // Seconds
  streak: number;                // Consecutive days
  longestStreak: number;
}

/**
 * Knowledge tracking for a specific concept/exercise
 */
export interface KnowledgeItem {
  level: KnowledgeLevel;
  accuracy: number;              // 0-1
  confidence: number;            // 0-1
  memoryStrength: number;        // 0-1 (for spaced repetition)
  lastReview: string;            // ISO date string
  nextReview?: string;           // ISO date string
  reviewCount: number;
  easeFactor: number;            // SM-2 algorithm ease factor
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
}

/**
 * User settings and preferences
 */
export interface UserSettings {
  helpLevel: 'keine' | 'normal' | 'viel';
  language: 'de' | 'en';
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  autoAdvance: boolean;
  showGermanHelp: boolean;
}

/**
 * Session record for history tracking
 */
export interface SessionRecord {
  sessionId: string;
  startTime: string;             // ISO date string
  endTime: string;               // ISO date string
  duration: number;              // Seconds
  exercisesCompleted: number;
  accuracy: number;
  unit: number;
}

// ====================================================================
// UNIT & CURRICULUM STRUCTURE
// ====================================================================

/**
 * Metadata about a learning unit
 */
export interface UnitMetadata {
  id: number;
  title: string;
  description: string;
  totalExercises: number;
  estimatedTime: number;         // Minutes
  concepts: string[];
  prerequisites: number[];       // Unit IDs
  difficulty: DifficultyLevel;
  icon?: string;
}

/**
 * Complete unit data with exercises
 */
export interface UnitData {
  metadata: UnitMetadata;
  learningPhases?: PhaseConfig[];
  exercises: Exercise[];
}

/**
 * Configuration for a learning phase within a unit
 */
export interface PhaseConfig {
  name: string;
  type: LearningPhase;
  description: string;
  exerciseCount: number;
}

// ====================================================================
// ADAPTIVE LEARNING SYSTEM
// ====================================================================

/**
 * Configuration for adaptive learning system
 */
export interface AdaptiveLearningConfig {
  enableInterleaving: boolean;
  enableResponseTimeTracking: boolean;
  adaptiveDifficulty: boolean;
  minExercisesBeforeAdaptation: number;
  confidenceThreshold: number;
  interleavingProbability: number;
  reviewThresholdDays: number;
}

/**
 * Session summary provided by adaptive system
 */
export interface SessionSummary {
  sessionId: string;
  duration: number;              // Seconds
  exercisesCompleted: number;
  accuracy: number;
  averageResponseTime: number;   // Seconds
  conceptsStudied: string[];
  newMilestones: string[];
  interleavingAnalysis?: InterleavingAnalysis;
  recommendations: string[];
}

/**
 * Analysis of interleaving effectiveness
 */
export interface InterleavingAnalysis {
  interleavedExercises: number;
  sequentialExercises: number;
  interleavedAccuracy: number;
  sequentialAccuracy: number;
  effectivenessScore: number;
}

/**
 * Learning insights generated by adaptive system
 */
export interface LearningInsights {
  strengths: string[];           // Concepts mastered
  weaknesses: string[];          // Concepts struggling with
  recommendations: string[];     // What to focus on next
  nextFocus: string;
  estimatedTimeToMastery: number; // Minutes
  progressRate: number;          // Exercises per day
}

/**
 * Recommendation for next learning activity
 */
export interface Recommendation {
  type: 'review' | 'practice' | 'new-content' | 'rest';
  concept?: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;         // Minutes
}

// ====================================================================
// PERFORMANCE MONITORING
// ====================================================================

/**
 * Performance metric
 */
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;             // ISO date string
  category: 'load' | 'render' | 'interaction' | 'memory';
}

/**
 * Error log entry
 */
export interface ErrorLog {
  errorId: string;
  timestamp: string;             // ISO date string
  message: string;
  stack?: string;
  context?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userAgent?: string;
}

// ====================================================================
// DATA MANAGEMENT
// ====================================================================

/**
 * Backup data structure
 */
export interface BackupData {
  version: string;
  timestamp: string;             // ISO date string
  progress: UserProgress;
  knowledgeState: Record<string, KnowledgeItem>;
  settings: UserSettings;
}

/**
 * GDPR data export structure
 */
export interface GDPRDataExport {
  exportDate: string;            // ISO date string
  userData: {
    progress: UserProgress;
    settings: UserSettings;
    sessionHistory: SessionRecord[];
    errorLogs: ErrorLog[];
  };
  dataCategories: string[];
  retentionPeriod: string;
}

// ====================================================================
// UI COMPONENT TYPES
// ====================================================================

/**
 * Exercise renderer options
 */
export interface RendererOptions {
  showHints: boolean;
  showGermanHelp: boolean;
  animationsEnabled: boolean;
  autoAdvance: boolean;
}

/**
 * Feedback display configuration
 */
export interface FeedbackConfig {
  showStyleImprovements: boolean;
  showDetailedExplanations: boolean;
  playSound: boolean;
  autoAdvanceDelay: number;      // Milliseconds
}

// ====================================================================
// UTILITY TYPES
// ====================================================================

/**
 * Normalization options for Spanish text
 */
export interface NormalizationOptions {
  removeAccents?: boolean;
  removePunctuation?: boolean;
  toLowerCase?: boolean;
  normalizeWhitespace?: boolean;
}

/**
 * Logger levels
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

/**
 * Environment configuration
 */
export interface EnvironmentConfig {
  currentEnv: 'development' | 'production' | 'test';
  version: string;
  enableDebugMode: boolean;
  enablePerformanceMonitoring: boolean;
  enableErrorReporting: boolean;
}

// ====================================================================
// TYPE GUARDS
// ====================================================================

/**
 * Type guard to check if value is an Exercise
 */
export function isExercise(value: any): value is Exercise {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.type === 'string' &&
    typeof value.question === 'string' &&
    typeof value.correctAnswer === 'string'
  );
}

/**
 * Type guard to check if value is a ValidationResult
 */
export function isValidationResult(value: any): value is ValidationResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.isCorrect === 'boolean' &&
    typeof value.isAcceptable === 'boolean' &&
    Array.isArray(value.coreErrors) &&
    Array.isArray(value.styleImprovements)
  );
}

// ====================================================================
// EXPORTS
// ====================================================================

// All types are already exported via 'export interface' declarations above
// No need for re-export
