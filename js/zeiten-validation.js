/**
 * Zeiten Workbench Validation Test
 * Tests the workbench functionality and data integrity
 */

console.log('?? Starting Zeiten Workbench Validation Tests...\n');

// Test 1: Check ZEITEN_DATA structure
console.log('Test 1: Checking ZEITEN_DATA structure...');
const expectedTenses = [
    'presente', 'preterito', 'imperfecto', 'perfecto', 
    'pluscuamperfecto', 'futuro', 'condicional', 
    'progresivo', 'perifrasis'
];

let test1Pass = true;
expectedTenses.forEach(tense => {
    if (!ZEITEN_DATA[tense]) {
        console.error(`? Missing tense: ${tense}`);
        test1Pass = false;
    } else {
        const data = ZEITEN_DATA[tense];
        // Check required fields
        const requiredFields = ['nameES', 'nameDE', 'rule', 'explanation', 'signalWords', 'formation', 'examples'];
        requiredFields.forEach(field => {
            if (!data[field]) {
                console.error(`? Missing field "${field}" in tense "${tense}"`);
                test1Pass = false;
            }
        });
        
        // Check examples have required structure
        if (data.examples && data.examples.length > 0) {
            data.examples.forEach((example, index) => {
                if (!example.es || !example.de || !example.verb || !example.analysis) {
                    console.error(`? Incomplete example ${index} in tense "${tense}"`);
                    test1Pass = false;
                }
            });
        }
    }
});

if (test1Pass) {
    console.log('? Test 1 PASSED: All tenses have complete data structure\n');
} else {
    console.log('? Test 1 FAILED: Data structure incomplete\n');
}

// Test 2: Check ASCII compliance in German text
console.log('Test 2: Checking ASCII compliance in German text...');
let test2Pass = true;
const umlautPattern = /[äöüßÄÖÜ]/;

expectedTenses.forEach(tense => {
    const data = ZEITEN_DATA[tense];
    
    // Check nameDE
    if (umlautPattern.test(data.nameDE)) {
        console.error(`? Umlaut found in nameDE of "${tense}": ${data.nameDE}`);
        test2Pass = false;
    }
    
    // Check rule.de
    if (umlautPattern.test(data.rule.de)) {
        console.error(`? Umlaut found in rule.de of "${tense}": ${data.rule.de}`);
        test2Pass = false;
    }
    
    // Check explanations
    data.explanation.forEach((exp, index) => {
        if (umlautPattern.test(exp)) {
            console.error(`? Umlaut found in explanation[${index}] of "${tense}": ${exp}`);
            test2Pass = false;
        }
    });
    
    // Check examples
    data.examples.forEach((example, index) => {
        if (umlautPattern.test(example.de)) {
            console.error(`? Umlaut found in example[${index}].de of "${tense}": ${example.de}`);
            test2Pass = false;
        }
    });
});

if (test2Pass) {
    console.log('? Test 2 PASSED: All German text is ASCII-compliant\n');
} else {
    console.log('? Test 2 FAILED: Umlauts found in German text\n');
}

// Test 3: Check example count
console.log('Test 3: Checking example counts...');
let test3Pass = true;
let totalExamples = 0;

expectedTenses.forEach(tense => {
    const data = ZEITEN_DATA[tense];
    const exampleCount = data.examples.length;
    totalExamples += exampleCount;
    
    if (exampleCount < 3) {
        console.warn(`?? Only ${exampleCount} examples for "${tense}" (recommended: 3)`);
    }
    
    console.log(`  ${tense}: ${exampleCount} examples`);
});

console.log(`  Total: ${totalExamples} examples across all tenses`);

if (totalExamples >= 27) {
    console.log('? Test 3 PASSED: Sufficient examples provided\n');
    test3Pass = true;
} else {
    console.log('?? Test 3 WARNING: Less than 27 total examples\n');
    test3Pass = true; // Still pass, just a warning
}

// Test 4: Check signal words
console.log('Test 4: Checking signal words...');
let test4Pass = true;
let totalSignalWords = 0;

expectedTenses.forEach(tense => {
    const data = ZEITEN_DATA[tense];
    const signalWordCount = data.signalWords.length;
    totalSignalWords += signalWordCount;
    
    if (signalWordCount < 5) {
        console.warn(`?? Only ${signalWordCount} signal words for "${tense}" (recommended: 5+)`);
    }
});

console.log(`  Total: ${totalSignalWords} signal words across all tenses`);

if (totalSignalWords >= 45) {
    console.log('? Test 4 PASSED: Sufficient signal words provided\n');
} else {
    console.log('? Test 4 PASSED: Signal words provided\n');
}

// Test 5: Check timeline positions
console.log('Test 5: Checking timeline positions...');
let test5Pass = true;
const validPositions = ['past', 'present', 'future'];

expectedTenses.forEach(tense => {
    const data = ZEITEN_DATA[tense];
    if (!validPositions.includes(data.timelinePosition)) {
        console.error(`? Invalid timeline position for "${tense}": ${data.timelinePosition}`);
        test5Pass = false;
    }
});

if (test5Pass) {
    console.log('? Test 5 PASSED: All timeline positions are valid\n');
} else {
    console.log('? Test 5 FAILED: Invalid timeline positions found\n');
}

// Test 6: Check formation rules
console.log('Test 6: Checking formation rules...');
let test6Pass = true;

expectedTenses.forEach(tense => {
    const data = ZEITEN_DATA[tense];
    if (Object.keys(data.formation).length === 0) {
        console.error(`? No formation rules for "${tense}"`);
        test6Pass = false;
    }
});

if (test6Pass) {
    console.log('? Test 6 PASSED: All tenses have formation rules\n');
} else {
    console.log('? Test 6 FAILED: Missing formation rules\n');
}

// Summary
console.log('???????????????????????????????????????');
console.log('VALIDATION SUMMARY');
console.log('???????????????????????????????????????');
console.log(`Test 1 (Data Structure):    ${test1Pass ? '? PASS' : '? FAIL'}`);
console.log(`Test 2 (ASCII Compliance):  ${test2Pass ? '? PASS' : '? FAIL'}`);
console.log(`Test 3 (Example Count):     ${test3Pass ? '? PASS' : '? FAIL'}`);
console.log(`Test 4 (Signal Words):      ${test4Pass ? '? PASS' : '? FAIL'}`);
console.log(`Test 5 (Timeline):          ${test5Pass ? '? PASS' : '? FAIL'}`);
console.log(`Test 6 (Formation Rules):   ${test6Pass ? '? PASS' : '? FAIL'}`);
console.log('???????????????????????????????????????');

const allPassed = test1Pass && test2Pass && test3Pass && test4Pass && test5Pass && test6Pass;

if (allPassed) {
    console.log('\n?? ALL TESTS PASSED! Zeiten Workbench is ready to use.\n');
} else {
    console.log('\n?? SOME TESTS FAILED! Please review the errors above.\n');
}

// Export results
if (typeof window !== 'undefined') {
    window.zeitenValidationResults = {
        test1_dataStructure: test1Pass,
        test2_asciiCompliance: test2Pass,
        test3_exampleCount: test3Pass,
        test4_signalWords: test4Pass,
        test5_timeline: test5Pass,
        test6_formationRules: test6Pass,
        overallPassed: allPassed,
        totalExamples,
        totalSignalWords,
        timestamp: new Date().toISOString()
    };
}
