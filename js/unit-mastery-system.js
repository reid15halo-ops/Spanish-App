/**
 * Unit Mastery System
 * Determines when a user has mastered a unit and is ready for the next one
 * Based on performance data and adaptive learning metrics
 */

class UnitMasterySystem {
  constructor(adaptiveSystem) {
    this.adaptiveSystem = adaptiveSystem;
    this.storageKey = 'unit-mastery-progress';

    // Mastery Criteria Configuration
    this.masteryConfig = {
      // Minimum overall accuracy required to master a unit
      minAccuracy: 0.75,  // 75%

      // Minimum mastery level for individual concepts
      minConceptMastery: 0.70,  // 70%

      // Percentage of concepts that must meet minConceptMastery
      minConceptCoverage: 0.80,  // 80% of concepts

      // Minimum number of exercises that must be attempted
      minExercisesAttempted: 150,  // At least 150 exercises

      // Minimum number of unique concepts practiced
      minUniqueConcepts: 5,

      // Days of consistent practice (optional, for advanced gating)
      consistencyDays: 3,

      // Minimum accuracy in last N attempts (recent performance)
      recentAttemptsCount: 10,
      minRecentAccuracy: 1.0  // 100% in recent attempts
    };

    this.loadMasteryData();
  }

  /**
   * Load mastery progress from localStorage
   */
  loadMasteryData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      this.masteryData = stored ? JSON.parse(stored) : {
        unlockedUnits: [1],  // Unit 1 always unlocked
        masteredUnits: [],   // Units that have been mastered
        unitProgress: {},    // Detailed progress per unit
        lastUpdated: Date.now()
      };
    } catch (error) {
      console.error('Error loading mastery data:', error);
      this.masteryData = {
        unlockedUnits: [1],
        masteredUnits: [],
        unitProgress: {},
        lastUpdated: Date.now()
      };
    }
  }

  /**
   * Save mastery progress to localStorage
   */
  saveMasteryData() {
    try {
      this.masteryData.lastUpdated = Date.now();
      localStorage.setItem(this.storageKey, JSON.stringify(this.masteryData));
    } catch (error) {
      console.error('Error saving mastery data:', error);
    }
  }

  /**
   * Check if a unit is unlocked for the user
   */
  isUnitUnlocked(unitNumber) {
    return this.masteryData.unlockedUnits.includes(unitNumber);
  }

  /**
   * Check if a unit has been mastered
   */
  isUnitMastered(unitNumber) {
    return this.masteryData.masteredUnits.includes(unitNumber);
  }

  /**
   * Get all unlocked units
   */
  getUnlockedUnits() {
    return [...this.masteryData.unlockedUnits].sort((a, b) => a - b);
  }

  /**
   * Get all mastered units
   */
  getMasteredUnits() {
    return [...this.masteryData.masteredUnits].sort((a, b) => a - b);
  }

  /**
   * Analyze unit performance based on adaptive learning data
   */
  analyzeUnitPerformance(unitNumber) {
    const performanceData = this.adaptiveSystem.performanceData;
    const unitData = performanceData.units[unitNumber];

    if (!unitData || !unitData.attempts) {
      return {
        ready: false,
        reason: 'Insufficient data',
        criteria: {}
      };
    }

    // Get concepts for this unit
    const unitConcepts = this.getUnitConcepts(unitNumber);

    // Calculate overall accuracy
    const overallAccuracy = unitData.correct / unitData.attempts;

    // Calculate concept mastery
    const conceptMasteryData = this.calculateConceptMastery(unitConcepts);

    // Calculate recent performance
    const recentPerformance = this.calculateRecentPerformance(unitNumber);

    // Check exercises attempted
    const exercisesAttempted = unitData.attempts;

    // Evaluate all criteria
    const criteria = {
      overallAccuracy: {
        value: overallAccuracy,
        required: this.masteryConfig.minAccuracy,
        passed: overallAccuracy >= this.masteryConfig.minAccuracy
      },
      conceptMastery: {
        value: conceptMasteryData.coverage,
        required: this.masteryConfig.minConceptCoverage,
        passed: conceptMasteryData.coverage >= this.masteryConfig.minConceptCoverage,
        details: conceptMasteryData
      },
      exercisesAttempted: {
        value: exercisesAttempted,
        required: this.masteryConfig.minExercisesAttempted,
        passed: exercisesAttempted >= this.masteryConfig.minExercisesAttempted
      },
      uniqueConcepts: {
        value: conceptMasteryData.uniqueConcepts,
        required: this.masteryConfig.minUniqueConcepts,
        passed: conceptMasteryData.uniqueConcepts >= this.masteryConfig.minUniqueConcepts
      },
      recentPerformance: {
        value: recentPerformance.accuracy,
        required: this.masteryConfig.minRecentAccuracy,
        passed: recentPerformance.accuracy >= this.masteryConfig.minRecentAccuracy,
        attemptsCount: recentPerformance.count
      }
    };

    // Check if all criteria are met
    const allPassed = Object.values(criteria).every(c => c.passed);

    return {
      ready: allPassed,
      reason: allPassed ? 'All mastery criteria met' : 'Some criteria not yet met',
      criteria: criteria,
      overallAccuracy: overallAccuracy,
      conceptMastery: conceptMasteryData,
      recentPerformance: recentPerformance
    };
  }

  /**
   * Get concepts associated with a unit
   * (In a real implementation, this would map exercises to units)
   */
  getUnitConcepts(unitNumber) {
    // This is a simplified version - in production, you'd map actual exercise concepts to units
    const performanceData = this.adaptiveSystem.performanceData;
    const allConcepts = Object.keys(performanceData.concepts);

    // For now, return all concepts (you'd filter by unit in production)
    return allConcepts;
  }

  /**
   * Calculate concept mastery metrics
   */
  calculateConceptMastery(concepts) {
    const performanceData = this.adaptiveSystem.performanceData;
    let masteredCount = 0;
    let totalConcepts = concepts.length;
    const conceptDetails = [];

    concepts.forEach(concept => {
      const data = performanceData.concepts[concept];
      if (data && data.attempts > 0) {
        const mastery = data.correct / data.attempts;
        const isMastered = mastery >= this.masteryConfig.minConceptMastery;

        if (isMastered) {
          masteredCount++;
        }

        conceptDetails.push({
          concept: concept,
          mastery: mastery,
          isMastered: isMastered,
          attempts: data.attempts,
          correct: data.correct
        });
      }
    });

    const coverage = totalConcepts > 0 ? masteredCount / totalConcepts : 0;

    return {
      masteredCount: masteredCount,
      totalConcepts: totalConcepts,
      coverage: coverage,
      uniqueConcepts: concepts.length,
      details: conceptDetails.sort((a, b) => a.mastery - b.mastery)  // Sort by mastery (weakest first)
    };
  }

  /**
   * Calculate recent performance (last N attempts)
   */
  calculateRecentPerformance(unitNumber) {
    // This would ideally track the last N attempts chronologically
    // For now, we use the overall unit data as a proxy
    const performanceData = this.adaptiveSystem.performanceData;
    const unitData = performanceData.units[unitNumber];

    if (!unitData || !unitData.attempts) {
      return {
        accuracy: 0,
        count: 0
      };
    }

    // In a full implementation, you'd track individual attempt timestamps
    // and calculate accuracy for the most recent attempts
    const accuracy = unitData.correct / unitData.attempts;

    return {
      accuracy: accuracy,
      count: unitData.attempts
    };
  }

  /**
   * Check mastery and unlock next unit if criteria are met
   */
  checkAndUnlockNextUnit(currentUnit) {
    // Don't check if already mastered
    if (this.isUnitMastered(currentUnit)) {
      return {
        alreadyMastered: true,
        unlockedNew: false
      };
    }

    // Analyze performance
    const analysis = this.analyzeUnitPerformance(currentUnit);

    if (analysis.ready) {
      // Mark unit as mastered
      if (!this.masteryData.masteredUnits.includes(currentUnit)) {
        this.masteryData.masteredUnits.push(currentUnit);
      }

      // Unlock next unit
      const nextUnit = currentUnit + 1;
      if (!this.masteryData.unlockedUnits.includes(nextUnit)) {
        this.masteryData.unlockedUnits.push(nextUnit);
      }

      // Save progress
      this.saveMasteryData();

      return {
        alreadyMastered: false,
        unlockedNew: true,
        masteredUnit: currentUnit,
        unlockedUnit: nextUnit,
        analysis: analysis
      };
    }

    return {
      alreadyMastered: false,
      unlockedNew: false,
      analysis: analysis
    };
  }

  /**
   * Get detailed progress report for a unit
   */
  getUnitProgressReport(unitNumber) {
    const analysis = this.analyzeUnitPerformance(unitNumber);
    const isUnlocked = this.isUnitUnlocked(unitNumber);
    const isMastered = this.isUnitMastered(unitNumber);

    return {
      unitNumber: unitNumber,
      isUnlocked: isUnlocked,
      isMastered: isMastered,
      analysis: analysis,
      nextSteps: this.getNextSteps(analysis)
    };
  }

  /**
   * Generate recommendations for what to practice next
   */
  getNextSteps(analysis) {
    if (analysis.ready) {
      return ['Congratulations! You\'ve mastered this unit. Move to the next unit!'];
    }

    const steps = [];
    const criteria = analysis.criteria;

    if (!criteria.overallAccuracy.passed) {
      steps.push(`Increase overall accuracy to ${(criteria.overallAccuracy.required * 100).toFixed(0)}% (currently ${(criteria.overallAccuracy.value * 100).toFixed(0)}%)`);
    }

    if (!criteria.conceptMastery.passed) {
      const weakConcepts = criteria.conceptMastery.details.details
        .filter(c => !c.isMastered)
        .slice(0, 3);  // Show top 3 weak concepts

      if (weakConcepts.length > 0) {
        steps.push(`Practice weak concepts: ${weakConcepts.map(c => c.concept).join(', ')}`);
      }
    }

    if (!criteria.exercisesAttempted.passed) {
      const remaining = criteria.exercisesAttempted.required - criteria.exercisesAttempted.value;
      steps.push(`Complete at least ${remaining} more exercises`);
    }

    if (!criteria.recentPerformance.passed) {
      steps.push(`Improve recent performance to ${(criteria.recentPerformance.required * 100).toFixed(0)}%`);
    }

    return steps;
  }

  /**
   * Reset mastery data (for testing or user request)
   */
  resetMastery() {
    this.masteryData = {
      unlockedUnits: [1],
      masteredUnits: [],
      unitProgress: {},
      lastUpdated: Date.now()
    };
    this.saveMasteryData();
  }

  /**
   * Get progress percentage for a unit (0-100)
   */
  getUnitProgressPercentage(unitNumber) {
    const analysis = this.analyzeUnitPerformance(unitNumber);

    if (!analysis.criteria) {
      return 0;
    }

    const criteria = analysis.criteria;
    const weights = {
      overallAccuracy: 0.30,
      conceptMastery: 0.30,
      exercisesAttempted: 0.20,
      uniqueConcepts: 0.10,
      recentPerformance: 0.10
    };

    let totalProgress = 0;

    Object.keys(weights).forEach(key => {
      const criterion = criteria[key];
      if (criterion) {
        const progress = Math.min(1, criterion.value / criterion.required);
        totalProgress += progress * weights[key];
      }
    });

    return Math.round(totalProgress * 100);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UnitMasterySystem;
}
