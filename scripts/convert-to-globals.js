/**
 * Convert ES6 Modules to Global Variables
 *
 * Converts ES6 import/export syntax to window.* globals
 * This allows the app to work with file:// URLs without a module server
 */

const fs = require('fs');
const path = require('path');

class ES6ToGlobalsConverter {
    constructor(rootDir) {
        this.rootDir = rootDir;
        this.jsDir = path.join(rootDir, 'js');
    }

    /**
     * Convert exercise-data.js from ES6 exports to window globals
     */
    convertExerciseData() {
        console.log('📦 Converting exercise-data.js to global variables...\n');

        const filePath = path.join(this.jsDir, 'exercise-data.js');
        let content = fs.readFileSync(filePath, 'utf-8');

        // Replace all "export const X = " with "window.X = " or "const X = "
        // We'll use window for the main exports and keep const for helper functions

        // Main data exports -> window.*
        content = content.replace(/^export const (UNIT_\d+_\w+|PHASE1_VOCABULARY|VERBS|ITEMS|ITEMS_ASCII) = /gm, 'window.$1 = ');

        // Helper function exports -> window.ExerciseData.*
        content = content.replace(/^export function (getAllPhase1Units|getAllPhase1Exercises|getUnit|getExerciseById|getVocabularyByCategory|getAllVocabularyWords)\(/gm, 'window.ExerciseData.$1 = function(');

        // Export DATA_INFO -> window.*
        content = content.replace(/^export const DATA_INFO = /gm, 'window.DATA_INFO = ');

        // Add ExerciseData namespace at the top (after the comment block)
        const headerEnd = content.indexOf('// ====================================================================');
        if (headerEnd !== -1) {
            content = content.slice(0, headerEnd) +
                '// Initialize ExerciseData namespace\nwindow.ExerciseData = {};\n\n' +
                content.slice(headerEnd);
        }

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('✅ Converted exercise-data.js to global variables');
    }

    /**
     * Convert app-core.js to remove ES6 imports and use globals
     */
    convertAppCore() {
        console.log('📦 Converting app-core.js to use global variables...\n');

        const filePath = path.join(this.jsDir, 'app-core.js');
        let content = fs.readFileSync(filePath, 'utf-8');

        // Remove the entire import block at the top
        content = content.replace(/\/\/ ====================================================================\n\/\/ IMPORT EXERCISE DATA\n\/\/ ====================================================================\n\nimport \{[\s\S]*?\} from '\.\/exercise-data\.js';\n\n/g, '');

        // Update the constructor to use window globals instead of imported constants
        content = content.replace(/this\.units = \{[\s\S]*?\};/m, `this.units = {
            1: window.UNIT_1_PRONOUNS,
            2: window.UNIT_2_SER,
            3: window.UNIT_3_ESTAR,
            4: window.UNIT_4_SER_ESTAR_CONTRAST,
            5: window.UNIT_5_TENER,
            6: window.UNIT_6_VOCABULARY,
            7: window.UNIT_7_INTEGRATION
        };`);

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('✅ Converted app-core.js to use global variables');
    }

    /**
     * Run all conversions
     */
    run() {
        console.log('🔄 Converting ES6 modules to global variables...\n');

        try {
            this.convertExerciseData();
            this.convertAppCore();

            console.log('\n✅ All conversions complete!');
            console.log('\n📝 Changes made:');
            console.log('  - exercise-data.js: ES6 exports → window.* globals');
            console.log('  - app-core.js: Removed imports, uses window.* globals');
            console.log('\n🎯 Next step: Update index.html to load the new modules');
        } catch (error) {
            console.error('❌ Error during conversion:', error);
            throw error;
        }
    }
}

// Run if called directly
if (require.main === module) {
    const converter = new ES6ToGlobalsConverter(process.cwd());
    converter.run();
}

module.exports = ES6ToGlobalsConverter;
