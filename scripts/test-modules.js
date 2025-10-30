/**
 * Module Loading Test
 *
 * Simulates browser environment and tests if modules load correctly
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

class ModuleTester {
    constructor(rootDir) {
        this.rootDir = rootDir;
        this.jsDir = path.join(rootDir, 'js');
        this.context = this.createBrowserContext();
    }

    /**
     * Create a simulated browser environment
     */
    createBrowserContext() {
        const context = {
            window: {},
            document: {
                addEventListener: () => {},
                getElementById: () => null,
                createElement: () => ({}),
                querySelectorAll: () => [],
                querySelector: () => null,
                body: { appendChild: () => {} },
                readyState: 'complete'
            },
            navigator: {
                userAgent: 'Test/1.0',
                vibrate: () => false
            },
            localStorage: {
                _data: {},
                getItem(key) { return this._data[key] || null; },
                setItem(key, value) { this._data[key] = String(value); },
                removeItem(key) { delete this._data[key]; }
            },
            sessionStorage: {
                _data: {},
                getItem(key) { return this._data[key] || null; },
                setItem(key, value) { this._data[key] = String(value); }
            },
            console: console,
            setTimeout: setTimeout,
            setInterval: setInterval,
            clearTimeout: clearTimeout,
            clearInterval: clearInterval,
            Date: Date,
            Math: Math,
            JSON: JSON,
            performance: {
                now: () => Date.now(),
                getEntriesByType: () => [],
                getEntriesByName: () => [],
                mark: () => {},
                measure: () => {}
            },
            URL: {
                createObjectURL: () => 'blob:mock',
                revokeObjectURL: () => {}
            },
            Blob: class Blob { constructor() {} },
            alert: (msg) => console.log('[Alert]', msg),
            confirm: () => true,
            prompt: () => null
        };

        // Make window reference itself
        context.window = context;
        context.self = context;
        context.globalThis = context;

        return context;
    }

    /**
     * Load a JavaScript file into the context
     */
    loadModule(filename) {
        const filePath = path.join(this.jsDir, filename);

        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const code = fs.readFileSync(filePath, 'utf-8');

        try {
            vm.runInNewContext(code, this.context, {
                filename: filename,
                timeout: 5000
            });
            return true;
        } catch (error) {
            console.error(`❌ Error loading ${filename}:`);
            console.error(`   ${error.message}`);
            if (error.stack) {
                console.error(`   Stack: ${error.stack.split('\n')[1]}`);
            }
            return false;
        }
    }

    /**
     * Test module loading
     */
    async testModules() {
        console.log('🧪 Testing module loading...\n');

        const modules = [
            'config/environment.js',
            'monitoring.js',
            'utils.js',
            'exercise-data.js',
            'app-core.js'
        ];

        let passedCount = 0;
        let failedCount = 0;

        for (const module of modules) {
            process.stdout.write(`  Testing ${module.padEnd(30)} ... `);

            const success = this.loadModule(module);

            if (success) {
                console.log('✅ Loaded');
                passedCount++;
            } else {
                console.log('❌ Failed');
                failedCount++;
            }
        }

        console.log('\n📊 Module Loading Results:');
        console.log(`  ✅ Passed: ${passedCount}/${modules.length}`);
        console.log(`  ❌ Failed: ${failedCount}/${modules.length}`);

        // Test global variables
        console.log('\n🔍 Testing global variables:');
        this.testGlobals();

        return failedCount === 0;
    }

    /**
     * Test that expected globals are defined
     */
    testGlobals() {
        const expectedGlobals = [
            // From exercise-data.js
            'UNIT_1_PRONOUNS',
            'UNIT_2_SER',
            'UNIT_3_ESTAR',
            'UNIT_4_SER_ESTAR_CONTRAST',
            'UNIT_5_TENER',
            'UNIT_6_VOCABULARY',
            'UNIT_7_INTEGRATION',
            'PHASE1_VOCABULARY',
            'VERBS',
            'ITEMS',
            'ITEMS_ASCII',
            'DATA_INFO',
            'ExerciseData',

            // From app-core.js
            'ExerciseLoader',
            'ExerciseRenderer',
            'App',

            // From monitoring.js
            'ErrorMonitor',
            'PerformanceMonitor',

            // From utils.js
            'Logger',
            'LoadingManager',
            'ErrorBoundary',
            'DataBackup',
            'GDPR',
            'TouchGestureManager',
            'AccessibilityManager',
            'SpanishKeyboardHelper',
            'HapticFeedbackManager'
        ];

        let foundCount = 0;
        let missingCount = 0;

        for (const global of expectedGlobals) {
            const exists = this.context.window[global] !== undefined;

            if (exists) {
                console.log(`  ✅ window.${global}`);
                foundCount++;
            } else {
                console.log(`  ❌ window.${global} (missing)`);
                missingCount++;
            }
        }

        console.log(`\n  Total: ${foundCount}/${expectedGlobals.length} globals found`);

        if (missingCount > 0) {
            console.log(`  ⚠️  ${missingCount} globals missing`);
        }

        // Test data integrity
        this.testDataIntegrity();
    }

    /**
     * Test exercise data integrity
     */
    testDataIntegrity() {
        console.log('\n📚 Testing exercise data integrity:');

        const units = [
            'UNIT_1_PRONOUNS',
            'UNIT_2_SER',
            'UNIT_3_ESTAR',
            'UNIT_4_SER_ESTAR_CONTRAST',
            'UNIT_5_TENER',
            'UNIT_6_VOCABULARY',
            'UNIT_7_INTEGRATION'
        ];

        let totalExercises = 0;

        for (const unitName of units) {
            const unit = this.context.window[unitName];

            if (unit && unit.exercises && Array.isArray(unit.exercises)) {
                const count = unit.exercises.length;
                totalExercises += count;
                console.log(`  ✅ ${unitName}: ${count} exercises`);
            } else {
                console.log(`  ❌ ${unitName}: No exercises found`);
            }
        }

        console.log(`\n  📊 Total exercises: ${totalExercises}`);

        if (totalExercises > 0) {
            console.log(`  ✅ Data integrity check passed`);
        } else {
            console.log(`  ❌ Data integrity check failed`);
        }
    }
}

// Run tests
if (require.main === module) {
    const tester = new ModuleTester(process.cwd());

    tester.testModules()
        .then((success) => {
            console.log('\n' + '='.repeat(60));
            if (success) {
                console.log('✅ All tests passed!');
                console.log('\n🎉 The app is ready to use!');
                console.log('   Open index.html in a browser to test.');
                process.exit(0);
            } else {
                console.log('❌ Some tests failed.');
                console.log('   Check the errors above.');
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('❌ Test failed with error:', error);
            process.exit(1);
        });
}

module.exports = ModuleTester;
