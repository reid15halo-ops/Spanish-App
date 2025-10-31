/**
 * Unit Mastery System
 *
 * Tracks progress and determines when a unit is mastered.
 * Units unlock sequentially based on mastery of previous units.
 *
 * Mastery Criteria:
 * - Minimum 150 exercises completed
 * - 75% overall accuracy
 * - 70% mastery of individual concepts
 * - 80% concept coverage
 * - 100% accuracy in last 10 attempts
 */

class UnitMasterySystem {
    constructor() {
        this.MASTERY_CRITERIA = {
            minExercises: 150,              // Mindestens 150 Übungen absolviert
            minAccuracy: 0.75,              // 75% Gesamtgenauigkeit
            minConceptMastery: 0.70,        // 70% Konzept-Mastery bei einzelnen Konzepten
            minConceptCoverage: 0.80,       // 80% aller Konzepte müssen geübt worden sein
            minRecentAccuracy: 1.0,         // 100% Genauigkeit in den letzten 10 Versuchen
            minRecentAttempts: 10,          // Mindestens 10 Versuche für Recent Accuracy
            minDifferentConcepts: 5         // Mindestens 5 unterschiedliche Konzepte geübt
        };
    }

    /**
     * Get progress for a specific unit
     * @param {number} unitNumber - Unit number (1-7)
     * @returns {Object} Unit progress data
     */
    getUnitProgress(unitNumber) {
        try {
            const key = `unit-${unitNumber}-progress`;
            const stored = localStorage.getItem(key);

            if (stored) {
                return JSON.parse(stored);
            }

            // Return default progress structure
            return this.createDefaultProgress(unitNumber);
        } catch (error) {
            console.error(`Error loading progress for unit ${unitNumber}:`, error);
            return this.createDefaultProgress(unitNumber);
        }
    }

    /**
     * Create default progress structure
     */
    createDefaultProgress(unitNumber) {
        return {
            unitNumber: unitNumber,
            exercisesCompleted: 0,
            totalAttempts: 0,
            correctAttempts: 0,
            conceptsAttempted: {},          // { concept: { attempts: X, correct: Y } }
            recentAttempts: [],             // Last 10 attempts (boolean)
            lastActivityDate: null,
            isMastered: false,
            masteryDate: null
        };
    }

    /**
     * Save unit progress
     * @param {number} unitNumber
     * @param {Object} progress
     */
    saveUnitProgress(unitNumber, progress) {
        try {
            const key = `unit-${unitNumber}-progress`;
            progress.lastActivityDate = new Date().toISOString();
            localStorage.setItem(key, JSON.stringify(progress));

            window.Logger?.debug(`Progress saved for Unit ${unitNumber}:`, progress);
        } catch (error) {
            console.error(`Error saving progress for unit ${unitNumber}:`, error);
        }
    }

    /**
     * Record an attempt for a specific unit
     * @param {number} unitNumber
     * @param {Object} exercise - Exercise object
     * @param {boolean} isCorrect - Whether the answer was correct
     */
    recordAttempt(unitNumber, exercise, isCorrect) {
        const progress = this.getUnitProgress(unitNumber);

        // Update total attempts
        progress.totalAttempts++;

        if (isCorrect) {
            progress.correctAttempts++;
            progress.exercisesCompleted++;
        }

        // Track concept-specific progress
        const concept = exercise.concept || 'general';
        if (!progress.conceptsAttempted[concept]) {
            progress.conceptsAttempted[concept] = {
                attempts: 0,
                correct: 0
            };
        }

        progress.conceptsAttempted[concept].attempts++;
        if (isCorrect) {
            progress.conceptsAttempted[concept].correct++;
        }

        // Track recent attempts (last 10)
        progress.recentAttempts.push(isCorrect);
        if (progress.recentAttempts.length > this.MASTERY_CRITERIA.minRecentAttempts) {
            progress.recentAttempts.shift(); // Remove oldest
        }

        // Check if unit is now mastered
        const masteryStatus = this.checkUnitMastery(unitNumber, progress);

        if (masteryStatus.isMastered && !progress.isMastered) {
            // First time achieving mastery!
            progress.isMastered = true;
            progress.masteryDate = new Date().toISOString();

            // Show celebration
            this.celebrateMastery(unitNumber);
        }

        // Save progress
        this.saveUnitProgress(unitNumber, progress);

        return masteryStatus;
    }

    /**
     * Check if a unit meets mastery criteria
     * @param {number} unitNumber
     * @param {Object} progress - Optional progress object (will load if not provided)
     * @returns {Object} Mastery status and detailed breakdown
     */
    checkUnitMastery(unitNumber, progress = null) {
        if (!progress) {
            progress = this.getUnitProgress(unitNumber);
        }

        const criteria = this.MASTERY_CRITERIA;
        const status = {
            isMastered: false,
            details: {},
            percentComplete: 0
        };

        // 1. Check minimum exercises
        const hasMinExercises = progress.exercisesCompleted >= criteria.minExercises;
        status.details.exercisesCompleted = {
            met: hasMinExercises,
            value: progress.exercisesCompleted,
            required: criteria.minExercises,
            label: `${progress.exercisesCompleted}/${criteria.minExercises} Übungen`
        };

        // 2. Check overall accuracy
        const overallAccuracy = progress.totalAttempts > 0
            ? progress.correctAttempts / progress.totalAttempts
            : 0;
        const hasMinAccuracy = overallAccuracy >= criteria.minAccuracy;
        status.details.overallAccuracy = {
            met: hasMinAccuracy,
            value: overallAccuracy,
            required: criteria.minAccuracy,
            label: `${Math.round(overallAccuracy * 100)}% Genauigkeit`
        };

        // 3. Check concept mastery
        const concepts = Object.keys(progress.conceptsAttempted);
        const masteredConcepts = concepts.filter(concept => {
            const data = progress.conceptsAttempted[concept];
            const accuracy = data.attempts > 0 ? data.correct / data.attempts : 0;
            return accuracy >= criteria.minConceptMastery;
        });

        const conceptMasteryRate = concepts.length > 0
            ? masteredConcepts.length / concepts.length
            : 0;
        const hasMinConceptMastery = conceptMasteryRate >= criteria.minConceptCoverage;
        status.details.conceptMastery = {
            met: hasMinConceptMastery,
            value: conceptMasteryRate,
            required: criteria.minConceptCoverage,
            label: `${masteredConcepts.length}/${concepts.length} Konzepte gemeistert`
        };

        // 4. Check different concepts attempted
        const differentConcepts = concepts.length;
        const hasMinConcepts = differentConcepts >= criteria.minDifferentConcepts;
        status.details.conceptCoverage = {
            met: hasMinConcepts,
            value: differentConcepts,
            required: criteria.minDifferentConcepts,
            label: `${differentConcepts} Konzepte geübt`
        };

        // 5. Check recent accuracy (100% in last 10 attempts)
        const recentAttempts = progress.recentAttempts.length;
        const recentCorrect = progress.recentAttempts.filter(Boolean).length;
        const recentAccuracy = recentAttempts > 0 ? recentCorrect / recentAttempts : 0;

        const hasMinRecentAttempts = recentAttempts >= criteria.minRecentAttempts;
        const hasMinRecentAccuracy = hasMinRecentAttempts && recentAccuracy >= criteria.minRecentAccuracy;

        status.details.recentAccuracy = {
            met: hasMinRecentAccuracy,
            value: recentAccuracy,
            required: criteria.minRecentAccuracy,
            attemptsMet: hasMinRecentAttempts,
            label: hasMinRecentAttempts
                ? `${Math.round(recentAccuracy * 100)}% in letzten ${recentAttempts} Versuchen`
                : `Nur ${recentAttempts}/${criteria.minRecentAttempts} Versuche`
        };

        // Calculate overall mastery
        const criteriaChecks = [
            hasMinExercises,
            hasMinAccuracy,
            hasMinConceptMastery,
            hasMinConcepts,
            hasMinRecentAccuracy
        ];

        const metCount = criteriaChecks.filter(Boolean).length;
        status.percentComplete = Math.round((metCount / criteriaChecks.length) * 100);
        status.isMastered = criteriaChecks.every(Boolean);

        return status;
    }

    /**
     * Check if a unit is unlocked (previous unit mastered or first unit)
     * @param {number} unitNumber
     * @returns {boolean}
     */
    isUnitUnlocked(unitNumber) {
        // Unit 1 is always unlocked
        if (unitNumber === 1) {
            return true;
        }

        // Check if previous unit is mastered
        const previousUnit = unitNumber - 1;
        const previousProgress = this.getUnitProgress(previousUnit);

        return previousProgress.isMastered;
    }

    /**
     * Get all units with their status
     * @returns {Array} Array of unit status objects
     */
    getAllUnitsStatus() {
        const units = [];

        for (let i = 1; i <= 7; i++) {
            const progress = this.getUnitProgress(i);
            const mastery = this.checkUnitMastery(i, progress);

            units.push({
                unitNumber: i,
                isUnlocked: this.isUnitUnlocked(i),
                isMastered: progress.isMastered,
                masteryPercent: mastery.percentComplete,
                exercisesCompleted: progress.exercisesCompleted,
                progress: progress,
                masteryDetails: mastery
            });
        }

        return units;
    }

    /**
     * Celebrate mastery achievement
     * @param {number} unitNumber
     */
    celebrateMastery(unitNumber) {
        // Create celebration modal
        const modal = document.createElement('div');
        modal.id = 'mastery-celebration-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            color: white;
            max-width: 500px;
            animation: slideIn 0.5s ease;
        `;

        content.innerHTML = `
            <div style="font-size: 80px; margin-bottom: 20px;">🎉</div>
            <h2 style="font-size: 32px; margin-bottom: 15px;">¡Felicidades!</h2>
            <p style="font-size: 18px; margin-bottom: 25px;">
                Du hast Unit ${unitNumber} gemeistert!
            </p>
            <p style="font-size: 16px; margin-bottom: 30px; opacity: 0.9;">
                Alle Mastery-Kriterien erfüllt:<br>
                ✓ 150+ Übungen absolviert<br>
                ✓ 75%+ Gesamtgenauigkeit<br>
                ✓ 100% Genauigkeit in den letzten 10 Versuchen
            </p>
            <button onclick="this.closest('#mastery-celebration-modal').remove()"
                    style="background: white; color: #667eea; border: none; padding: 15px 30px;
                           border-radius: 10px; font-size: 18px; font-weight: 600; cursor: pointer;">
                Weiter zum nächsten Unit! →
            </button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Auto-remove after 10 seconds if not manually closed
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 10000);
    }

    /**
     * Reset all progress (for testing or fresh start)
     */
    resetAllProgress() {
        if (confirm('Alle Fortschritte löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
            for (let i = 1; i <= 7; i++) {
                localStorage.removeItem(`unit-${i}-progress`);
            }

            window.Logger?.warn('All unit progress has been reset');
            alert('✅ Alle Fortschritte wurden zurückgesetzt!');
            location.reload();
        }
    }

    /**
     * Get summary statistics across all units
     * @returns {Object} Summary stats
     */
    getSummaryStats() {
        const allUnits = this.getAllUnitsStatus();

        const totalExercises = allUnits.reduce((sum, unit) => sum + unit.exercisesCompleted, 0);
        const masteredUnits = allUnits.filter(unit => unit.isMastered).length;
        const unlockedUnits = allUnits.filter(unit => unit.isUnlocked).length;

        return {
            totalExercises,
            masteredUnits,
            unlockedUnits,
            totalUnits: 7,
            overallProgress: Math.round((masteredUnits / 7) * 100)
        };
    }
}

// Make globally available
window.UnitMasterySystem = UnitMasterySystem;
