/**
 * Exercise Loader
 * Simple JSON loader for exercise units
 */

class ExerciseLoader {
    constructor() {
        this.unitFiles = {
            1: 'unit1-pronouns.json',
            2: 'unit2-ser.json',
            3: 'unit3-estar.json',
            4: 'unit4-ser-estar-contrast.json',
            5: 'unit5-tener.json',
            6: 'unit6-vocabulary.json'
        };
    }

    /**
     * Load exercises for a specific unit
     * @param {number} unitNumber - Unit number (1-6)
     * @returns {Promise<Array>} Array of exercises
     */
    async loadUnit(unitNumber) {
        const filename = this.unitFiles[unitNumber];

        if (!filename) {
            throw new Error(`Unit ${unitNumber} not found. Available units: 1-6`);
        }

        const path = `data/phase1-exercises/${filename}`;

        try {
            console.log(`📚 Loading Unit ${unitNumber} from ${path}...`);

            const response = await fetch(path);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.exercises || !Array.isArray(data.exercises)) {
                throw new Error(`Invalid data format in ${filename}`);
            }

            console.log(`✅ Loaded ${data.exercises.length} exercises for Unit ${unitNumber}`);
            console.log(`   Title: ${data.metadata.title}`);
            console.log(`   Phases:`, Object.keys(data.learningPhases || {}));

            return {
                metadata: data.metadata,
                phases: data.learningPhases,
                exercises: data.exercises
            };

        } catch (error) {
            console.error(`❌ Error loading Unit ${unitNumber}:`, error);
            throw error;
        }
    }

    /**
     * Get unit metadata without loading full exercises
     * @param {number} unitNumber
     * @returns {Promise<Object>}
     */
    async getUnitInfo(unitNumber) {
        const data = await this.loadUnit(unitNumber);
        return {
            number: unitNumber,
            title: data.metadata.title,
            totalExercises: data.metadata.totalExercises,
            estimatedTime: data.metadata.estimatedTime,
            phases: data.phases
        };
    }
}

// Make available globally
window.ExerciseLoader = ExerciseLoader;
