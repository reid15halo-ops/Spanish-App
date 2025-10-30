/**
 * JSON Data Inlining Script
 *
 * Converts all JSON files to a single exercise-data.js JavaScript module
 * Eliminates CORS issues with file:// URLs
 */

const fs = require('fs');
const path = require('path');

class DataInliner {
    constructor(rootDir) {
        this.rootDir = rootDir;
        this.dataDir = path.join(rootDir, 'data');
        this.phase1Dir = path.join(this.dataDir, 'phase1-exercises');
        this.outputFile = path.join(rootDir, 'js', 'exercise-data.js');
    }

    /**
     * Read and parse a JSON file
     */
    readJSON(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            console.error(`❌ Error reading ${filePath}:`, error.message);
            return null;
        }
    }

    /**
     * Convert JSON object to JavaScript code
     */
    jsonToJS(obj, indent = 0) {
        const spaces = '  '.repeat(indent);

        if (obj === null) return 'null';
        if (obj === undefined) return 'undefined';
        if (typeof obj === 'string') return JSON.stringify(obj);
        if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);

        if (Array.isArray(obj)) {
            if (obj.length === 0) return '[]';
            const items = obj.map(item => `${spaces}  ${this.jsonToJS(item, indent + 1)}`).join(',\n');
            return `[\n${items}\n${spaces}]`;
        }

        if (typeof obj === 'object') {
            const keys = Object.keys(obj);
            if (keys.length === 0) return '{}';
            const props = keys.map(key => {
                const value = this.jsonToJS(obj[key], indent + 1);
                return `${spaces}  ${JSON.stringify(key)}: ${value}`;
            }).join(',\n');
            return `{\n${props}\n${spaces}}`;
        }

        return 'null';
    }

    /**
     * Generate the exercise-data.js file
     */
    async generateDataModule() {
        console.log('📦 Inlining JSON data to JavaScript module...\n');

        // Read all unit files
        const units = {};
        const unitFiles = [
            'unit1-pronouns.json',
            'unit2-ser.json',
            'unit3-estar.json',
            'unit4-ser-estar-contrast.json',
            'unit5-tener.json',
            'unit6-vocabulary.json',
            'unit7-integration.json'
        ];

        for (const file of unitFiles) {
            const filePath = path.join(this.phase1Dir, file);
            const unitName = file.replace('.json', '').replace(/-/g, '_');
            console.log(`📄 Reading ${file}...`);
            units[unitName] = this.readJSON(filePath);
        }

        // Read vocabulary file
        console.log(`📄 Reading phase1-vocabulary.json...`);
        const vocabulary = this.readJSON(path.join(this.dataDir, 'phase1-vocabulary.json'));

        // Read verbs file
        console.log(`📄 Reading verbs.json...`);
        const verbs = this.readJSON(path.join(this.dataDir, 'verbs.json'));

        // Read items files
        console.log(`📄 Reading items.json...`);
        const items = this.readJSON(path.join(this.dataDir, 'items.json'));

        console.log(`📄 Reading items_ascii.json...`);
        const itemsAscii = this.readJSON(path.join(this.dataDir, 'items_ascii.json'));

        // Generate JavaScript module
        console.log('\n✍️  Generating exercise-data.js...\n');

        const moduleContent = `/**
 * Exercise Data Module
 *
 * All exercise data inlined as JavaScript objects
 * Generated from JSON files to avoid CORS issues with file:// URLs
 *
 * Generated: ${new Date().toISOString()}
 */

// ====================================================================
// PHASE 1 UNITS
// ====================================================================

export const UNIT_1_PRONOUNS = ${this.jsonToJS(units.unit1_pronouns, 0)};

export const UNIT_2_SER = ${this.jsonToJS(units.unit2_ser, 0)};

export const UNIT_3_ESTAR = ${this.jsonToJS(units.unit3_estar, 0)};

export const UNIT_4_SER_ESTAR_CONTRAST = ${this.jsonToJS(units.unit4_ser_estar_contrast, 0)};

export const UNIT_5_TENER = ${this.jsonToJS(units.unit5_tener, 0)};

export const UNIT_6_VOCABULARY = ${this.jsonToJS(units.unit6_vocabulary, 0)};

export const UNIT_7_INTEGRATION = ${this.jsonToJS(units.unit7_integration, 0)};

// ====================================================================
// VOCABULARY & VERBS
// ====================================================================

export const PHASE1_VOCABULARY = ${this.jsonToJS(vocabulary, 0)};

export const VERBS = ${this.jsonToJS(verbs, 0)};

export const ITEMS = ${this.jsonToJS(items, 0)};

export const ITEMS_ASCII = ${this.jsonToJS(itemsAscii, 0)};

// ====================================================================
// HELPER FUNCTIONS
// ====================================================================

/**
 * Get all Phase 1 units
 */
export function getAllPhase1Units() {
  return [
    UNIT_1_PRONOUNS,
    UNIT_2_SER,
    UNIT_3_ESTAR,
    UNIT_4_SER_ESTAR_CONTRAST,
    UNIT_5_TENER,
    UNIT_6_VOCABULARY,
    UNIT_7_INTEGRATION
  ];
}

/**
 * Get all Phase 1 exercises
 */
export function getAllPhase1Exercises() {
  const units = getAllPhase1Units();
  return units.flatMap(unit => unit.exercises || []);
}

/**
 * Get unit by number
 */
export function getUnit(unitNumber) {
  const units = getAllPhase1Units();
  return units[unitNumber - 1] || null;
}

/**
 * Get exercise by ID
 */
export function getExerciseById(exerciseId) {
  const exercises = getAllPhase1Exercises();
  return exercises.find(ex => ex.id === exerciseId) || null;
}

/**
 * Get vocabulary by category
 */
export function getVocabularyByCategory(categoryId) {
  return PHASE1_VOCABULARY.categories[categoryId] || null;
}

/**
 * Get all vocabulary words
 */
export function getAllVocabularyWords() {
  const categories = Object.values(PHASE1_VOCABULARY.categories);
  return categories.flatMap(cat => cat.words || []);
}

/**
 * Data source info
 */
export const DATA_INFO = {
  generated: '${new Date().toISOString()}',
  totalUnits: 7,
  totalExercises: ${Object.values(units).reduce((sum, unit) => sum + (unit?.exercises?.length || 0), 0)},
  totalVocabularyWords: ${vocabulary ? (Object.values(vocabulary.categories || {}).reduce((sum, cat) => sum + (cat?.words?.length || 0), 0)) : 0},
  format: 'inline-javascript',
  version: '1.0'
};
`;

        // Write to file
        fs.writeFileSync(this.outputFile, moduleContent, 'utf-8');

        console.log(`✅ Generated: ${this.outputFile}`);
        const stats = fs.statSync(this.outputFile);
        console.log(`📊 File size: ${(stats.size / 1024).toFixed(1)} KB`);
        console.log(`📝 Total exercises: ${Object.values(units).reduce((sum, unit) => sum + (unit?.exercises?.length || 0), 0)}`);
        console.log(`📚 Total vocabulary: ${vocabulary ? (Object.values(vocabulary.categories || {}).reduce((sum, cat) => sum + (cat?.words?.length || 0), 0)) : 0} words`);

        return this.outputFile;
    }
}

// Run if called directly
if (require.main === module) {
    const inliner = new DataInliner(process.cwd());

    inliner.generateDataModule()
        .then((outputFile) => {
            console.log('\n✅ Data inlining complete!');
            console.log(`\nNext steps:`);
            console.log(`1. Update exercise-loader.js to import from exercise-data.js`);
            console.log(`2. Remove all fetch() calls for JSON files`);
            console.log(`3. Test that app works with inlined data`);
        })
        .catch(error => {
            console.error('❌ Error:', error);
            process.exit(1);
        });
}

module.exports = DataInliner;
