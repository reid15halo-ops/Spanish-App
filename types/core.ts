/**
 * Core Type Definitions for Spanish Learning App
 *
 * This file contains all fundamental types used throughout the application.
 * All modules should import from this file for consistency.
 */

// ============================================================================
// EXERCISE TYPES
// ============================================================================

/**
 * All possible exercise types in the application
 */
export type ExerciseType =
  | 'vocabulary-card'
  | 'vocabulary-in-context'
  | 'reading-comprehension'
  | 'fill-blank'
  | 'conjugation'
  | 'multiple-choice'
  | 'translation'
  | 'sentence-building'
  | 'meaning-change'
  | 'error-correction'
  | 'conversation'
  | 'comprehensive'
  | 'practical-scenario'
  | 'mixed-grammar'
  | 'comprehensive-translation'
  | 'final-mastery'
  | 'correction'
  | 'mastery-check'
  | 'final-certification'
  | 'error-identification'
  | 'contrast-sentence'
  | 'contrast-pair'
  | 'contrast-intro'
  | 'advanced-application'
  | 'ser-vs-estar';

/**
 * Difficulty levels
 */
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Learning phases
 */
export type LearningPhase = 'prep' | 'input' | 'guided' | 'free';

/**
 * Interference risk levels
 */
export type InterferenceRisk = 'low' | 'medium' | 'high' | 'very-high';

/**
 * Main exercise interface
 */
export interface Exercise {
  id: string;
  type: ExerciseType;
  difficulty: DifficultyLevel;
  concept: string;
  question: string;
  correctAnswer: string;

  // Optional fields
  options?: string[];
  hint?: string;
  explanation?: string;
  germanBridge?: string;
  example?: string;
  examples?: string[] | ExampleSentence[];
  mnemonic?: string;
  note?: string;
  warning?: string;
  rule?: string;
  context?: string;
  breakdown?: Record<string, string>;

  // Vocabulary-specific
  word?: string;
  translation?: string;
  emoji?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  exampleSentences?: ExampleSentence[];
  usage?: string;

  // Reading comprehension
  dialog?: DialogLine[];
  translation_dialog?: DialogLine[];
  newVocabulary?: string[];
  comprehensionCheck?: ComprehensionCheck;

  // Sentence building
  words?: string[];

  // Metadata
  phase?: LearningPhase;
  categoryTags?: string[];
  estimatedResponseTime?: number;
  memoryComplexity?: DifficultyLevel;
  interferenceRisk?: InterferenceRisk;
  spacingMultiplier?: number;
  falseFriendRisk?: boolean;
  discriminationPairs?: string[];
  useCase?: string;

  // For adaptive system
  unitNumber?: number;
  unitName?: string;
}

/**
 * Example sentence with translation
 */
export interface ExampleSentence {
  es?: string;
  spanish?: string;
  de?: string;
  german?: string;
  note?: string;
}

/**
 * Dialog line for reading comprehension
 */
export interface DialogLine {
  speaker: string;
  text: string;
}

/**
 * Comprehension check for reading exercises
 */
export interface ComprehensionCheck {
  question: string;
  options: string[];
  correctAnswer: string;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

/**
 * Validation result from answer checking
 */
export interface ValidationResult {
  isCorrect: boolean;
  isAcceptable: boolean;
  userAnswer: string;
  correctAnswer: string;
  normalizedUserAnswer: string;
  normalizedCorrectAnswer: string;
  coreErrors: CoreError[];
  styleImprovements: StyleImprovement[];
  feedback: FeedbackMessage;
}

/**
 * Core errors in answer
 */
export interface CoreError {
  type: 'wrong-word' | 'grammar' | 'conjugation' | 'vocabulary' | 'structure';
  description: string;
  severity: 'critical' | 'major' | 'minor';
}

/**
 * Style improvements (not errors, but better alternatives)
 */
export interface StyleImprovement {
  type: 'accent' | 'punctuation' | 'capitalization' | 'spacing';
  userVersion: string;
  correctVersion: string;
  explanation: string;
  severity: 'info' | 'suggestion';
}

/**
 * Feedback message structure
 */
export interface FeedbackMessage {
  primary: string;
  secondary?: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  showContinueButton?: boolean;
}

// ============================================================================
// USER PROGRESS TYPES
// ============================================================================

/**
 * Knowledge level for a concept
 */
export type KnowledgeLevel =
  | 'new'           // Never seen
  | 'learning'      // Seen 1-2 times
  | 'familiar'      // Seen 3-5 times, some errors
  | 'mastered'      // 90%+ accuracy
  | 'struggling'    // <50% accuracy after 3+ attempts
  | 'critical';     // Needs immediate review

/**
 * Individual knowledge item tracking
 */
export interface KnowledgeItem {
  exerciseId: string;
  concept: string;
  level: KnowledgeLevel;
  accuracy: number;
  confidence: number;
  memoryStrength: number;
  lastReview: string; // ISO date string
  reviewCount: number;
  correctStreak: number;
  easeFactor: number;
  nextReviewDate: string; // ISO date string
  totalAttempts: number;
  correctAttempts: number;
}

/**
 * Complete user progress
 */
export interface UserProgress {
  currentUnit: number;
  currentIndex: number;
  stats: UserStats;
  knowledgeState: Record<string, KnowledgeItem>;
  settings: UserSettings;
  completedUnits?: number[];
  lastActivity?: string; // ISO date string
}

/**
 * User statistics
 */
export interface UserStats {
  correct: number;
  total: number;
  accuracy: number;
  averageResponseTime?: number;
  totalStudyTime?: number;
  sessionsCompleted?: number;
}

/**
 * User settings
 */
export interface UserSettings {
  helpLevel: 'keine' | 'normal' | 'viel';
  language?: 'de' | 'en';
  theme?: 'light' | 'dark' | 'auto';
  soundEnabled?: boolean;
  animationsEnabled?: boolean;
}

// ============================================================================
// UNIT & METADATA TYPES
// ============================================================================

/**
 * Unit metadata
 */
export interface UnitMetadata {
  id: number;
  title: string;
  description: string;
  totalExercises: number;
  estimatedTime: string;
  version: string;
  concepts?: string[];
  prerequisites?: number[];
  targetLevel?: string;
}

/**
 * Learning phases distribution
 */
export interface LearningPhases {
  prep?: PhaseInfo;
  input?: PhaseInfo;
  guided?: PhaseInfo;
  free?: PhaseInfo;
}

/**
 * Phase information
 */
export interface PhaseInfo {
  name: string;
  description: string;
  exerciseCount: number;
  estimatedTime: string;
}

/**
 * Unit introduction structure
 */
export interface UnitIntroduction {
  title: string;
  subtitle?: string;
  readingTime: string;
  preview: IntroductionPreview;
  sections: IntroductionSection[];
}

/**
 * Introduction preview (Progressive Disclosure)
 */
export interface IntroductionPreview {
  summary: string;
  keyPoints: string[];
  whyImportant: string;
  learningGoals: string[];
  estimatedPreviewTime: string;
}

/**
 * Introduction section
 */
export interface IntroductionSection {
  heading: string;
  content: string;
  examples?: ExampleSentence[];
}

/**
 * Complete unit data
 */
export interface UnitData {
  metadata: UnitMetadata;
  learningPhases: LearningPhases;
  exercises: Exercise[];
  introduction?: UnitIntroduction;
}

// ============================================================================
// ADAPTIVE LEARNING TYPES
// ============================================================================

/**
 * Adaptive learning configuration
 */
export interface AdaptiveLearningConfig {
  enableInterleaving: boolean;
  enableResponseTimeTracking: boolean;
  adaptiveDifficulty: boolean;
  minExercisesBeforeAdaptation: number;
  confidenceThreshold: number;
  spacingAlgorithm: 'sm2' | 'fsrs' | 'leitner';
}

/**
 * Concept mastery information
 */
export interface ConceptMastery {
  concept: string;
  mastery: number; // 0-1
  attempts: number;
  correct: number;
  lastPracticed: string; // ISO date string
}

/**
 * Weak concept for recommendations
 */
export interface WeakConcept {
  concept: string;
  mastery: number;
  needsReview: boolean;
}

/**
 * Learning recommendations
 */
export interface LearningRecommendations {
  overallMastery: number;
  weakConcepts: WeakConcept[];
  nextDifficulty: DifficultyLevel;
  reviewExercises: string[];
  suggestedFocus: string[];
}

/**
 * Session summary
 */
export interface SessionSummary {
  duration: number;
  exercisesCompleted: number;
  accuracy: number;
  averageResponseTime: number;
  conceptsStudied: string[];
  newMilestones: string[];
  startTime: string; // ISO date string
  endTime: string; // ISO date string
}

/**
 * Learning insights
 */
export interface LearningInsights {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  nextFocus: string;
  estimatedTimeToMastery: number;
  conceptProgress: ConceptProgress[];
}

/**
 * Concept progress tracking
 */
export interface ConceptProgress {
  concept: string;
  progress: number; // 0-100
  status: 'not-started' | 'learning' | 'mastered';
  exercisesCompleted: number;
  totalExercises: number;
}

// ============================================================================
// MASTERY SYSTEM TYPES
// ============================================================================

/**
 * Mastery criteria configuration
 */
export interface MasteryCriteria {
  minExercises: number;
  minAccuracy: number;
  minConceptMastery: number;
  minConceptCoverage: number;
  minRecentAccuracy: number;
  minRecentAttempts: number;
  minDifferentConcepts: number;
}

/**
 * Unit mastery progress
 */
export interface UnitProgress {
  unitNumber: number;
  exercisesCompleted: number;
  totalAttempts: number;
  correctAttempts: number;
  conceptsAttempted: Record<string, ConceptAttempts>;
  recentAttempts: boolean[]; // Last N attempts
  lastActivityDate: string | null;
  isMastered: boolean;
  masteryDate: string | null;
}

/**
 * Concept attempts tracking
 */
export interface ConceptAttempts {
  attempts: number;
  correct: number;
}

/**
 * Mastery status
 */
export interface MasteryStatus {
  isMastered: boolean;
  details: MasteryDetails;
  percentComplete: number;
}

/**
 * Detailed mastery breakdown
 */
export interface MasteryDetails {
  exercisesCompleted: MasteryCheckItem;
  overallAccuracy: MasteryCheckItem;
  conceptMastery: MasteryCheckItem;
  conceptCoverage: MasteryCheckItem;
  recentAccuracy: MasteryCheckItem & { attemptsMet: boolean };
}

/**
 * Individual mastery check item
 */
export interface MasteryCheckItem {
  met: boolean;
  value: number;
  required: number;
  label: string;
}

/**
 * Unit status information
 */
export interface UnitStatus {
  unitNumber: number;
  isUnlocked: boolean;
  isMastered: boolean;
  masteryPercent: number;
  exercisesCompleted: number;
  progress: UnitProgress;
  masteryDetails: MasteryStatus;
}

// ============================================================================
// RENDERER TYPES
// ============================================================================

/**
 * Render options for exercises
 */
export interface RenderOptions {
  showHint?: boolean;
  showExamples?: boolean;
  enableGermanHelp?: boolean;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Application error
 */
export interface AppError {
  code: string;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
  stack?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

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
 * Callback function type
 */
export type Callback<T = void> = (result: T) => void;

/**
 * Async callback type
 */
export type AsyncCallback<T = void> = (result: T) => Promise<void>;

/**
 * Generic result type
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// ============================================================================
// EXPORTS FOR CONVENIENCE
// ============================================================================

/**
 * Re-export all types for easy importing
 */
export type {
  Exercise as ExerciseData,
  ValidationResult as AnswerValidation,
  UserProgress as Progress,
  UnitData as Unit
};
