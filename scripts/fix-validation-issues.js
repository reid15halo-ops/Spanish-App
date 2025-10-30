/**
 * Fix Validation Issues
 *
 * Automatically fixes issues found in validation:
 * - Adds missing German bridges
 * - Removes German umlauts from Spanish content
 * - Normalizes difficulty levels (1-5 scale)
 * - Adds learningPhases where missing
 */

const fs = require('fs');
const path = require('path');

class ValidationFixer {
    constructor(rootDir) {
        this.rootDir = rootDir;
        this.dataDir = path.join(rootDir, 'data', 'phase1-exercises');
        this.reportPath = path.join(rootDir, 'validation-report.json');

        this.fixCount = {
            germanBridges: 0,
            umlauts: 0,
            difficulty: 0,
            learningPhases: 0
        };
    }

    /**
     * Run all fixes
     */
    async fixAll() {
        console.log('🔧 Starting validation fixes...\n');

        // Load validation report
        if (!fs.existsSync(this.reportPath)) {
            console.error('❌ validation-report.json not found. Run validate-phase1.js first.');
            return;
        }

        const report = JSON.parse(fs.readFileSync(this.reportPath, 'utf-8'));

        // Fix missing German bridges
        this.fixGermanBridges(report.germanBridges.enhanced);

        // Fix German umlauts in Spanish content
        this.fixUmlauts(report.warnings);

        // Normalize difficulty levels
        this.normalizeDifficulty(report.warnings);

        // Add missing learning phases
        this.addLearningPhases(report.warnings);

        this.printSummary();
    }

    /**
     * Add missing German bridges
     */
    fixGermanBridges(enhanced) {
        console.log('🇩🇪 Adding missing German bridges...');

        const byUnit = {};
        enhanced.forEach(item => {
            if (!byUnit[item.unit]) {
                byUnit[item.unit] = [];
            }
            byUnit[item.unit].push(item);
        });

        Object.entries(byUnit).forEach(([unit, items]) => {
            const filePath = path.join(this.dataDir, unit);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            items.forEach(item => {
                const exercise = data.exercises[item.exercise - 1];
                if (exercise && exercise.id === item.id && !exercise.germanBridge) {
                    exercise.germanBridge = item.suggested;
                    this.fixCount.germanBridges++;
                    console.log(`  ✅ Added to ${item.id}: ${item.suggested}`);
                }
            });

            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        });

        console.log(`  Total: ${this.fixCount.germanBridges} German bridges added\n`);
    }

    /**
     * Fix German umlauts in Spanish content
     */
    fixUmlauts(warnings) {
        console.log('🔤 Fixing German umlauts in Spanish content...');

        const umlautWarnings = warnings.filter(w => w.warning && w.warning.includes('German umlauts'));

        const byUnit = {};
        umlautWarnings.forEach(warn => {
            if (!byUnit[warn.unit]) {
                byUnit[warn.unit] = [];
            }
            byUnit[warn.unit].push(warn);
        });

        Object.entries(byUnit).forEach(([unit, items]) => {
            const filePath = path.join(this.dataDir, unit);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            items.forEach(item => {
                const exercise = data.exercises[item.exercise - 1];
                if (exercise && exercise.id === item.id) {
                    // Fix correctAnswer
                    if (exercise.correctAnswer) {
                        const original = exercise.correctAnswer;
                        exercise.correctAnswer = this.replaceUmlauts(exercise.correctAnswer);
                        if (original !== exercise.correctAnswer) {
                            this.fixCount.umlauts++;
                            console.log(`  ✅ Fixed ${item.id}: "${original}" → "${exercise.correctAnswer}"`);
                        }
                    }

                    // Fix alternative answers
                    if (exercise.alternativeAnswers) {
                        exercise.alternativeAnswers = exercise.alternativeAnswers.map(ans =>
                            this.replaceUmlauts(ans)
                        );
                    }

                    // Fix options
                    if (exercise.options) {
                        exercise.options = exercise.options.map(opt =>
                            this.replaceUmlauts(opt)
                        );
                    }
                }
            });

            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        });

        console.log(`  Total: ${this.fixCount.umlauts} umlauts fixed\n`);
    }

    /**
     * Replace German umlauts with Spanish equivalents
     */
    replaceUmlauts(text) {
        return text
            .replace(/ä/g, 'a')
            .replace(/ö/g, 'o')
            .replace(/ü/g, 'u')
            .replace(/Ä/g, 'A')
            .replace(/Ö/g, 'O')
            .replace(/Ü/g, 'U')
            .replace(/ß/g, 'ss');
    }

    /**
     * Normalize difficulty levels to 1-5 scale
     */
    normalizeDifficulty(warnings) {
        console.log('📊 Normalizing difficulty levels...');

        const diffWarnings = warnings.filter(w => w.warning && w.warning.includes('Difficulty'));

        const byUnit = {};
        diffWarnings.forEach(warn => {
            if (!byUnit[warn.unit]) {
                byUnit[warn.unit] = [];
            }
            byUnit[warn.unit].push(warn);
        });

        Object.entries(byUnit).forEach(([unit, items]) => {
            const filePath = path.join(this.dataDir, unit);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            items.forEach(item => {
                const exercise = data.exercises[item.exercise - 1];
                if (exercise && exercise.id === item.id) {
                    const original = exercise.difficulty;
                    // Normalize: 1-2→1, 3-4→2, 5-6→3, 7-8→4, 9-10→5
                    exercise.difficulty = Math.ceil(original / 2);
                    exercise.difficulty = Math.min(5, Math.max(1, exercise.difficulty));

                    this.fixCount.difficulty++;
                    console.log(`  ✅ Normalized ${item.id}: difficulty ${original} → ${exercise.difficulty}`);
                }
            });

            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        });

        console.log(`  Total: ${this.fixCount.difficulty} difficulty levels normalized\n`);
    }

    /**
     * Add missing learning phases
     */
    addLearningPhases(warnings) {
        console.log('📚 Adding missing learning phases...');

        const phaseWarnings = warnings.filter(w => w.warning === 'Missing learningPhases');

        phaseWarnings.forEach(warn => {
            const filePath = path.join(this.dataDir, warn.unit);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            if (!data.learningPhases) {
                // Create basic learning phases structure
                data.learningPhases = this.createLearningPhases(data);
                this.fixCount.learningPhases++;
                console.log(`  ✅ Added learningPhases to ${warn.unit}`);

                fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
            }
        });

        console.log(`  Total: ${this.fixCount.learningPhases} learningPhases added\n`);
    }

    /**
     * Create learning phases structure
     */
    createLearningPhases(data) {
        const totalExercises = data.exercises?.length || 0;
        const unit = data.metadata?.unit || 1;

        // Distribute exercises across phases
        const prepCount = Math.floor(totalExercises * 0.25);
        const inputCount = Math.floor(totalExercises * 0.15);
        const guidedCount = Math.floor(totalExercises * 0.40);
        const freeCount = totalExercises - prepCount - inputCount - guidedCount;

        return {
            phase0_prep: {
                exercises: `u${unit}_vocab001 - u${unit}_vocab${String(prepCount).padStart(3, '0')}`,
                goal: "Grundwortschatz aufbauen",
                time: "5-10 Minuten",
                exerciseCount: prepCount
            },
            phase1_input: {
                exercises: `u${unit}_input001 - u${unit}_input${String(inputCount).padStart(3, '0')}`,
                goal: "Verstehen durch authentische Beispiele",
                time: "10-15 Minuten",
                exerciseCount: inputCount
            },
            phase2_guided: {
                exercises: `u${unit}_guided001 - u${unit}_guided${String(guidedCount).padStart(3, '0')}`,
                goal: "Mit Hilfe produzieren",
                time: "15-20 Minuten",
                exerciseCount: guidedCount
            },
            phase3_free: {
                exercises: `u${unit}_free001 - u${unit}_free${String(freeCount).padStart(3, '0')}`,
                goal: "Selbstständig anwenden",
                time: "10-15 Minuten",
                exerciseCount: freeCount
            }
        };
    }

    /**
     * Print summary
     */
    printSummary() {
        console.log('='.repeat(60));
        console.log('FIX SUMMARY');
        console.log('='.repeat(60));
        console.log(`\n🇩🇪 German bridges added: ${this.fixCount.germanBridges}`);
        console.log(`🔤 Umlauts fixed: ${this.fixCount.umlauts}`);
        console.log(`📊 Difficulty levels normalized: ${this.fixCount.difficulty}`);
        console.log(`📚 Learning phases added: ${this.fixCount.learningPhases}`);
        console.log(`\n✅ Total fixes applied: ${Object.values(this.fixCount).reduce((a, b) => a + b, 0)}`);
    }
}

// Run fixes
if (require.main === module) {
    const fixer = new ValidationFixer(process.cwd());

    fixer.fixAll()
        .then(() => {
            console.log('\n✅ All fixes applied!');
            console.log('\n💡 Run validate-phase1.js again to verify fixes.');
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Fix failed:', error);
            process.exit(1);
        });
}

module.exports = ValidationFixer;
