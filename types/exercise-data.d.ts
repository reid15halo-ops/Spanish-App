/**
 * @fileoverview Type Declarations for Exercise Data
 *
 * Declares types for the large exercise-data.js file (581 KB)
 * which is too large to migrate to TypeScript directly.
 *
 * This file provides type safety for all unit data structures.
 */

import type { Exercise } from './core';

// ============================================================================
// Unit Metadata
// ============================================================================

interface UnitMetadata {
  unit: number;
  phase: number;
  level: string;
  concept: string;
  title: string;
  title_es: string;
  description: string;
  totalExercises: number;
  estimatedTime: string;
  learningApproach: string;
  communicativeGoal: string;
  germanAdvantage?: boolean;
  germanAdvantageNote?: string;
  version: string;
}

// ============================================================================
// Learning Phases
// ============================================================================

interface LearningPhase {
  exercises: string;
  goal: string;
  time: string;
  exerciseCount: number;
}

interface LearningPhases {
  phase0_prep?: LearningPhase;
  phase1_input?: LearningPhase;
  phase2_guided?: LearningPhase;
  phase3_free?: LearningPhase;
  [key: string]: LearningPhase | undefined;
}

// ============================================================================
// Unit Data Structure
// ============================================================================

interface UnitData {
  metadata: UnitMetadata;
  learningPhases: LearningPhases;
  exercises: Exercise[];
}

// ============================================================================
// Global Declarations
// ============================================================================

declare global {
  interface Window {
    // Unit 1: Pronouns (Introducing Yourself)
    UNIT_1_PRONOUNS: UnitData;

    // Unit 2: Ser (To Be - Permanent States)
    UNIT_2_SER: UnitData;

    // Unit 3: Estar (To Be - Temporary States)
    UNIT_3_ESTAR: UnitData;

    // Unit 4: Ser/Estar Contrast
    UNIT_4_SER_ESTAR_CONTRAST: UnitData;

    // Unit 5: Tener (To Have)
    UNIT_5_TENER: UnitData;

    // Unit 6: Vocabulary Expansion
    UNIT_6_VOCABULARY: UnitData;

    // Unit 7: Integration Practice
    UNIT_7_INTEGRATION: UnitData;

    // Phase 1 Vocabulary (if exists)
    PHASE_1_VOCABULARY?: Exercise[];
  }
}

// ============================================================================
// Named Exports
// ============================================================================

export type {
  UnitMetadata,
  LearningPhase,
  LearningPhases,
  UnitData
};
