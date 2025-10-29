/**
 * Diagnostic Tool: Find exercises missing required fields
 */

const fs = require('fs');
const path = require('path');

const requiredFields = [
    'id', 'type', 'difficulty', 'concept',
    'prerequisites', 'relatedConcepts', 'discriminationPairs', 'categoryTags',
    'estimatedResponseTime', 'memoryComplexity', 'interferenceRisk', 'spacingMultiplier',
    'transferType', 'falseFriendRisk', 'contrastiveElements',
    'expectedAccuracy', 'milestone', 'certificationRequired'
];

const exercisesDir = path.join(__dirname, '..', 'data', 'phase1-exercises');
const units = [
    'unit1-pronouns.json',
    'unit2-ser.json',
    'unit3-estar.json',
    'unit4-ser-estar-contrast.json',
    'unit5-tener.json',
    'unit6-vocabulary.json',
    'unit7-integration.json'
];

let totalExercises = 0;
let completeExercises = 0;
const incompleteExercises = [];

for (const unitFile of units) {
    const filePath = path.join(exercisesDir, unitFile);
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    for (const exercise of data.exercises) {
        totalExercises++;
        const missingFields = requiredFields.filter(field => exercise[field] === undefined);

        if (missingFields.length === 0) {
            completeExercises++;
        } else {
            incompleteExercises.push({
                unit: unitFile,
                id: exercise.id,
                missingFields: missingFields
            });
        }
    }
}

console.log(`\n📊 Diagnostic Results:`);
console.log(`Total exercises: ${totalExercises}`);
console.log(`Complete: ${completeExercises}`);
console.log(`Incomplete: ${incompleteExercises.length}\n`);

if (incompleteExercises.length > 0) {
    console.log(`❌ Exercises missing fields:\n`);

    // Group by unit
    const byUnit = {};
    incompleteExercises.forEach(ex => {
        if (!byUnit[ex.unit]) byUnit[ex.unit] = [];
        byUnit[ex.unit].push(ex);
    });

    for (const [unit, exercises] of Object.entries(byUnit)) {
        console.log(`\n${unit}: ${exercises.length} incomplete`);
        exercises.forEach(ex => {
            console.log(`  - ${ex.id}: missing [${ex.missingFields.join(', ')}]`);
        });
    }
}

// Save detailed report
const reportPath = path.join(__dirname, '..', 'MISSING-FIELDS-REPORT.json');
fs.writeFileSync(reportPath, JSON.stringify(incompleteExercises, null, 2));
console.log(`\n📄 Full report saved to: ${reportPath}`);
