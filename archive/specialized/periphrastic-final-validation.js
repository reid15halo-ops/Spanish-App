/**
 * Final Validation Check for Periphrastic System
 * Ensures all acceptance criteria are met
 */

async function runFinalValidation() {
    console.log('???????????????????????????????????????????????????????????');
    console.log('PERIPHRASTISCHES ZEITEN SYSTEM - FINALE VALIDIERUNG');
    console.log('???????????????????????????????????????????????????????????');
    console.log('\n');

    const results = {
        timestamp: new Date().toISOString(),
        tests: {},
        summary: {
            allPassed: true,
            criticalIssues: []
        }
    };

    // Test 1: System Initialization
    console.log('1. SYSTEM INITIALISIERUNG');
    console.log('?????????????????????????????????????????????????????????');
    try {
        const conjugator = new SpanishConjugator();
        await conjugator.initialize();
        console.log('? Conjugator initialisiert');
        
        const periphrastic = new PeriphrasticSystem(conjugator);
        console.log('? PeriphrasticSystem initialisiert');
        
        results.tests.initialization = {
            passed: true,
            conjugator: true,
            periphrastic: true
        };
    } catch (error) {
        console.error('? Initialisierung fehlgeschlagen:', error.message);
        results.tests.initialization = {
            passed: false,
            error: error.message
        };
        results.summary.allPassed = false;
        results.summary.criticalIssues.push('System initialization failed');
        return results;
    }

    const conjugator = new SpanishConjugator();
    await conjugator.initialize();
    const periphrastic = new PeriphrasticSystem(conjugator);

    // Test 2: buildPeriphrasis Methode
    console.log('\n2. BUILD PERIPHRASIS METHODE');
    console.log('?????????????????????????????????????????????????????????');
    const buildTests = [
        { inf: 'hablar', pattern: 'ir-a-infinitivo', persona: 'yo', tiempo: 'presente', expected: 'voy a hablar' },
        { inf: 'comer', pattern: 'estar-gerundio', persona: 'tu', tiempo: 'presente', expected: 'estas comiendo' },
        { inf: 'salir', pattern: 'acabar-de-infinitivo', persona: 'el', tiempo: 'presente', expected: 'acaba de salir' }
    ];

    let buildPassed = 0;
    let buildFailed = 0;

    buildTests.forEach(test => {
        try {
            const result = periphrastic.buildPeriphrasis(test.inf, test.pattern, test.persona, test.tiempo);
            if (result === test.expected) {
                console.log(`? ${test.pattern}: "${result}"`);
                buildPassed++;
            } else {
                console.log(`? ${test.pattern}: Expected "${test.expected}", got "${result}"`);
                buildFailed++;
            }
        } catch (error) {
            console.log(`? ${test.pattern}: ${error.message}`);
            buildFailed++;
        }
    });

    results.tests.buildPeriphrasis = {
        passed: buildFailed === 0,
        total: buildTests.length,
        passed_count: buildPassed,
        failed_count: buildFailed
    };

    if (buildFailed > 0) {
        results.summary.allPassed = false;
        results.summary.criticalIssues.push('buildPeriphrasis method has failures');
    }

    // Test 3: 30 Random Exercises
    console.log('\n3. 30 ZUFALLSAUFGABEN GENERIEREN');
    console.log('?????????????????????????????????????????????????????????');
    try {
        const exercises = periphrastic.generateExercises(30);
        console.log(`? ${exercises.length} Übungen generiert`);

        let validExercises = 0;
        let invalidExercises = 0;

        exercises.forEach((ex, i) => {
            try {
                // Validate that answer can be analyzed
                const analysis = periphrastic.analyzePeriphrasis(ex.answer);
                if (analysis.detected) {
                    validExercises++;
                } else {
                    invalidExercises++;
                    if (i < 5) {
                        console.log(`?? Exercise ${i + 1} not detected: ${ex.answer}`);
                    }
                }
            } catch (error) {
                invalidExercises++;
            }
        });

        const successRate = (validExercises / exercises.length) * 100;
        console.log(`? Valide: ${validExercises}/${exercises.length} (${successRate.toFixed(1)}%)`);
        console.log(`${invalidExercises > 0 ? '??' : '?'} Invalide: ${invalidExercises}/${exercises.length}`);

        results.tests.randomExercises = {
            passed: successRate >= 90,
            total: exercises.length,
            valid: validExercises,
            invalid: invalidExercises,
            successRate: successRate
        };

        if (successRate < 90) {
            results.summary.allPassed = false;
            results.summary.criticalIssues.push(`Exercise success rate too low: ${successRate.toFixed(1)}%`);
        }
    } catch (error) {
        console.error('? Exercise generation failed:', error.message);
        results.tests.randomExercises = {
            passed: false,
            error: error.message
        };
        results.summary.allPassed = false;
        results.summary.criticalIssues.push('Exercise generation failed');
    }

    // Test 4: Validator mit Aux vs. Form Unterscheidung
    console.log('\n4. VALIDATOR - AUX VS. FORM FEHLER');
    console.log('?????????????????????????????????????????????????????????');
    const validationTests = [
        {
            name: 'Aux-Fehler: Falsche Konjugation',
            user: 'va a hablar',
            correct: 'voy a hablar',
            expectedErrorType: 'auxiliary-conjugation'
        },
        {
            name: 'Form-Fehler: Infinitiv statt Gerundio',
            user: 'estoy hablar',
            correct: 'estoy hablando',
            expectedErrorType: 'main-verb-form'
        },
        {
            name: 'Präposition fehlt',
            user: 'voy hablar',
            correct: 'voy a hablar',
            expectedErrorType: 'wrong-preposition'
        }
    ];

    let validationPassed = 0;
    let validationFailed = 0;

    validationTests.forEach(test => {
        const result = periphrastic.validatePeriphrasis(test.user, test.correct);
        
        if (!result.correct) {
            const hasExpectedError = result.errors.some(e => e.type === test.expectedErrorType);
            
            if (hasExpectedError) {
                console.log(`? ${test.name}: ${test.expectedErrorType} erkannt`);
                validationPassed++;
            } else {
                console.log(`? ${test.name}: Erwarteter Fehler ${test.expectedErrorType} nicht erkannt`);
                console.log(`   Gefundene Fehler:`, result.errors.map(e => e.type));
                validationFailed++;
            }
        } else {
            console.log(`? ${test.name}: Kein Fehler erkannt (sollte Fehler sein!)`);
            validationFailed++;
        }
    });

    results.tests.validator = {
        passed: validationFailed === 0,
        total: validationTests.length,
        passed_count: validationPassed,
        failed_count: validationFailed
    };

    if (validationFailed > 0) {
        results.summary.allPassed = false;
        results.summary.criticalIssues.push('Validator error detection has failures');
    }

    // Test 5: Conjugator Extensions
    console.log('\n5. CONJUGATOR ERWEITERUNGEN');
    console.log('?????????????????????????????????????????????????????????');
    const conjugatorTests = {
        buildGerundio: false,
        getVerb: false,
        analyzeForm: false
    };

    try {
        const gerundio = conjugator.buildGerundio('hablar');
        if (gerundio === 'hablando') {
            console.log('? buildGerundio: "hablar" ? "hablando"');
            conjugatorTests.buildGerundio = true;
        } else {
            console.log(`? buildGerundio: Expected "hablando", got "${gerundio}"`);
        }
    } catch (error) {
        console.log(`? buildGerundio: ${error.message}`);
    }

    try {
        const verb = conjugator.getVerb('hablar');
        if (verb && verb.infinitivo === 'hablar') {
            console.log('? getVerb: "hablar" gefunden');
            conjugatorTests.getVerb = true;
        } else {
            console.log('? getVerb: Verb nicht gefunden');
        }
    } catch (error) {
        console.log(`? getVerb: ${error.message}`);
    }

    try {
        const analysis = conjugator.analyzeForm('estoy');
        if (analysis && analysis.infinitivo === 'estar') {
            console.log('? analyzeForm: "estoy" ? "estar"');
            conjugatorTests.analyzeForm = true;
        } else {
            console.log('? analyzeForm: Falsche Analyse');
        }
    } catch (error) {
        console.log(`? analyzeForm: ${error.message}`);
    }

    const conjugatorPassed = Object.values(conjugatorTests).every(v => v);
    results.tests.conjugatorExtensions = {
        passed: conjugatorPassed,
        ...conjugatorTests
    };

    if (!conjugatorPassed) {
        results.summary.allPassed = false;
        results.summary.criticalIssues.push('Conjugator extensions missing or broken');
    }

    // Final Summary
    console.log('\n');
    console.log('???????????????????????????????????????????????????????????');
    console.log('ZUSAMMENFASSUNG');
    console.log('???????????????????????????????????????????????????????????');
    console.log('\n');

    console.log('Akzeptanzkriterien:');
    console.log('\n1. 30 Zufallsaufgaben periphrastisch lauffähig:');
    if (results.tests.randomExercises?.passed) {
        console.log('   ? ERFÜLLT');
        console.log(`   - ${results.tests.randomExercises.valid}/${results.tests.randomExercises.total} valide`);
        console.log(`   - Erfolgsrate: ${results.tests.randomExercises.successRate.toFixed(1)}%`);
    } else {
        console.log('   ? NICHT ERFÜLLT');
        if (results.tests.randomExercises?.error) {
            console.log(`   - Fehler: ${results.tests.randomExercises.error}`);
        } else {
            console.log(`   - Erfolgsrate zu niedrig: ${results.tests.randomExercises?.successRate?.toFixed(1) || 0}%`);
        }
    }

    console.log('\n2. Fehler-Erklärer greift (Aux vs. Form):');
    if (results.tests.validator?.passed) {
        console.log('   ? ERFÜLLT');
        console.log(`   - ${results.tests.validator.passed_count}/${results.tests.validator.total} Fehlertypen korrekt erkannt`);
        console.log('   - auxiliary-conjugation: Hilfsverb-Fehler ?');
        console.log('   - main-verb-form: Hauptverb-Fehler ?');
    } else {
        console.log('   ? NICHT ERFÜLLT');
        console.log(`   - Nur ${results.tests.validator?.passed_count || 0}/${results.tests.validator?.total || 0} erkannt`);
    }

    console.log('\n');
    console.log('?????????????????????????????????????????????????????????');
    if (results.summary.allPassed) {
        console.log('? ALLE TESTS BESTANDEN');
        console.log('? SYSTEM PRODUKTIONSREIF');
    } else {
        console.log('? EINIGE TESTS FEHLGESCHLAGEN');
        console.log('\nKritische Probleme:');
        results.summary.criticalIssues.forEach(issue => {
            console.log(`   - ${issue}`);
        });
    }
    console.log('?????????????????????????????????????????????????????????');
    console.log('\n');

    return results;
}

// Export for use
if (typeof window !== 'undefined') {
    window.runFinalValidation = runFinalValidation;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runFinalValidation };
}
