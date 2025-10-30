/**
 * Micro-Break Suggestion System
 *
 * Suggests strategic breaks to optimize learning and prevent burnout.
 *
 * SCIENTIFIC BASIS:
 * - Ultradian Rhythms (Rossi & Nimmons, 1991)
 * - Pomodoro Technique (Cirillo, 2006)
 * - Strategic Breaks for Memory Consolidation (Dewar et al., 2012)
 * - Rest-Activity Cycles (Kleitman, 1963)
 *
 * @references
 * - Rossi, E. L., & Nimmons, D. (1991). The 20-Minute Break
 * - Dewar, M., et al. (2012). Brief wakeful resting boosts memory
 * - Ariga, A., & Lleras, A. (2011). Brief breaks maintain performance
 */

class MicroBreakSystem {
    constructor() {
        this.breakTypes = {
            micro: { duration: 60000, label: '1 Minute', icon: '☕' },
            short: { duration: 300000, label: '5 Minuten', icon: '🧘' },
            medium: { duration: 600000, label: '10 Minuten', icon: '🚶' },
            long: { duration: 900000, label: '15 Minuten', icon: '🌳' }
        };

        this.lastBreakTime = Date.now();
        this.breakHistory = [];
        this.breaksDue = [];
    }

    shouldSuggestBreak(context) {
        const { sessionDuration, cognitiveLoad, frustration, accuracy } = context;

        // Pomodoro: 25-minute intervals
        if (sessionDuration >= 25 && sessionDuration % 25 === 0) {
            return { suggest: true, type: 'short', reason: 'Pomodoro interval' };
        }

        // High cognitive load
        if (cognitiveLoad >= 70) {
            return { suggest: true, type: 'micro', reason: 'High cognitive load' };
        }

        // High frustration
        if (frustration >= 60) {
            return { suggest: true, type: 'short', reason: 'Frustration detected' };
        }

        // Performance declining
        if (accuracy < 0.5) {
            return { suggest: true, type: 'medium', reason: 'Performance decline' };
        }

        return { suggest: false };
    }

    getBreakActivities(breakType) {
        const activities = {
            micro: ['Stretch your arms', 'Take 3 deep breaths', 'Look away from screen'],
            short: ['Short walk', 'Water break', 'Simple stretches', 'Eye exercises'],
            medium: ['Walk outside', 'Light snack', 'Meditation', 'Fresh air'],
            long: ['Longer walk', 'Exercise', 'Meal break', 'Power nap']
        };

        return activities[breakType] || activities.short;
    }
}

if (typeof window !== 'undefined') window.MicroBreakSystem = MicroBreakSystem;
if (typeof module !== 'undefined' && module.exports) module.exports = { MicroBreakSystem };
