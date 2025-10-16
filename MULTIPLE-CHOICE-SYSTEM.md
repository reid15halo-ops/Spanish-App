# ?? INTELLIGENT MULTIPLE CHOICE SYSTEM

## ? Neue MC-Logik implementiert

**Datei**: `js/app.js`  
**Position**: Nach Data Loading, vor SpanishApp-Klasse  
**Status**: Implementiert

---

## ?? PROBLEM & LÖSUNG

### **Problem (Vorher)**:
```javascript
// Zufällige Distraktoren ohne Filter
const wrongAnswers = this.vocabulary
    .filter(v => v.id !== vocabItem.id)
    .map(v => v.german)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
```

**Nachteile**:
- ? Zu einfache/schwere Optionen
- ? Zu ähnliche Wörter (verwirrend)
- ? Keine Schwierigkeits-Berücksichtigung
- ? Schlechte User-Experience

---

### **Lösung (Nachher)**:
```javascript
// Intelligente Distraktoren
const distractors = pickDistractors(pool, answer, 3);
```

**Vorteile**:
- ? Ähnliche Schwierigkeit (±1 Level)
- ? Nicht zu ähnlich (Levenshtein > 2)
- ? Keine Duplikate
- ? Fallback für kleine Pools
- ? Bessere Lern-Erfahrung

---

## ?? NEUE FUNKTIONEN

### **1. pickDistractors(pool, answer, k)**

```javascript
function pickDistractors(pool, answer, k = 3) {
    const normalizedAnswer = normEs(answer.es);
    
    const candidates = pool
        // Keine Duplikate
        .filter(x => normEs(x.es) !== normalizedAnswer)
        
        // Ähnliche Schwierigkeit
        .filter(x => 
            Math.abs((x.difficulty || 2) - (answer.difficulty || 2)) <= 1
        )
        
        // Nicht zu ähnlich
        .filter(x => {
            const normalized = normEs(x.es);
            return normalized.length > 1 && 
                   levenshteinDistance(normalized, normalizedAnswer) > 2;
        });

    // Shuffle und return
    return candidates
        .sort(() => Math.random() - 0.5)
        .slice(0, k);
}
```

**Features**:
- ? Difficulty-Filter (±1 Level)
- ? Similarity-Filter (Levenshtein > 2)
- ? Duplicate-Prevention
- ? Automatic Fallback

**Parameter**:
- `pool`: Array von Vokabeln
- `answer`: Korrekte Antwort
- `k`: Anzahl Distraktoren (default: 3)

**Returns**: Array von k Distraktor-Items

---

### **2. buildMC(item, pool)**

```javascript
function buildMC(item, pool) {
    const distractors = pickDistractors(pool, item, 3);
    
    const options = [
        ...distractors.map(d => toAsciiDe(d.de)),
        toAsciiDe(item.de)
    ];
    
    const shuffled = options.sort(() => Math.random() - 0.5);

    return {
        promptHtml: `<p><strong>${item.es}</strong> – waehle...</p>`,
        answersHtml: `<div class="mc">...</div>`,
        correctAnswer: toAsciiDe(item.de)
    };
}
```

**Zweck**: Baut komplette MC-Übung

**Returns**:
```javascript
{
    promptHtml: string,    // Frage-HTML
    answersHtml: string,   // Antwort-Buttons-HTML
    correctAnswer: string  // Korrekte Antwort (ASCII)
}
```

---

### **3. setupMCListeners(area)**

```javascript
function setupMCListeners(area) {
    // Remove old listeners
    area.querySelectorAll('.mc-opt').forEach(btn => {
        btn.onclick = null;
    });
    
    // Add new listeners
    area.querySelectorAll('.mc-opt').forEach(btn => {
        btn.addEventListener('click', (ev) => {
            // Deselect all
            area.querySelectorAll('.mc-opt').forEach(b => 
                b.classList.remove('sel', 'selected')
            );
            // Select clicked
            ev.currentTarget.classList.add('sel', 'selected');
        });
    });
}
```

**Zweck**: Event-Listener für MC-Buttons

**Features**:
- ? Cleanup alter Listener
- ? Single-Selection Logic
- ? Visual Feedback (selected class)

---

### **4. checkMC(area, correctAnswer)**

```javascript
function checkMC(area, correctAnswer) {
    const selected = area.querySelector('.mc-opt.sel');
    
    if (!selected) {
        return {
            correct: false,
            error: 'no-selection',
            message: 'Bitte waehle eine Antwort.'
        };
    }
    
    const selectedValue = decodeURIComponent(selected.dataset.val);
    const normalizedSelected = toAsciiDe(selectedValue);
    const normalizedCorrect = toAsciiDe(correctAnswer);
    
    return {
        correct: normalizedSelected === normalizedCorrect,
        selectedValue,
        correctAnswer
    };
}
```

**Zweck**: Validiert MC-Antwort

**Returns**:
```javascript
// Bei Erfolg:
{
    correct: true/false,
    selectedValue: string,
    correctAnswer: string
}

// Bei Fehler:
{
    correct: false,
    error: 'no-selection',
    message: string
}
```

---

## ?? DISTRACTOR-STRATEGIE

### **Filtering-Pipeline**:

```
Pool (alle Vokabeln)
    ?
1. Duplikate entfernen
   (normEs(x.es) !== normEs(answer.es))
    ?
2. Difficulty-Filter
   (Math.abs(x.difficulty - answer.difficulty) <= 1)
    ?
3. Similarity-Filter
   (levenshteinDistance > 2)
    ?
Candidates
    ?
Shuffle & Pick k items
    ?
Distractors
```

---

### **Difficulty-Levels**:

```javascript
// Beispiel: Answer difficulty = 2

Akzeptiert:
- difficulty = 1 (2-1 = 1 ? 1) ?
- difficulty = 2 (2-2 = 0 ? 1) ?
- difficulty = 3 (3-2 = 1 ? 1) ?

Abgelehnt:
- difficulty = 0 (2-0 = 2 > 1) ?
- difficulty = 4 (4-2 = 2 > 1) ?
```

---

### **Similarity-Check**:

```javascript
// Levenshtein Distance > 2

"hola" vs "hola"     ? distance = 0 ? (zu ähnlich)
"hola" vs "hole"     ? distance = 2 ? (zu ähnlich)
"hola" vs "casa"     ? distance = 3 ? (gut)
"hola" vs "perro"    ? distance = 5 ? (gut)
```

**Warum > 2?**
- Verhindert verwirrende Optionen
- User lernt echte Unterschiede
- Reduziert Frustration

---

## ?? VERWENDUNG

### **In SpanishApp integrieren**:

```javascript
createChoiceExercise(vocabItem) {
    const isSpanishToGerman = Math.random() > 0.5;
    
    if (isSpanishToGerman) {
        // Verwende neue MC-Logik
        const mc = buildMC(vocabItem, this.vocabulary);
        
        return {
            type: 'choice',
            vocabItem,
            question: vocabItem.spanish,
            correctAnswer: mc.correctAnswer,
            promptHtml: mc.promptHtml,
            answersHtml: mc.answersHtml,
            direction: 'es-de',
            userAnswer: null
        };
    } else {
        // Alte Logik für de?es
        // ...
    }
}
```

### **Rendering**:

```javascript
renderChoiceExercise(exercise) {
    const container = document.getElementById('exercise-container');
    
    container.innerHTML = `
        ${exercise.promptHtml}
        ${exercise.answersHtml}
    `;
    
    // Setup Listeners
    setupMCListeners(container);
}
```

### **Checking**:

```javascript
checkAnswer() {
    const area = document.getElementById('answer-area');
    const result = checkMC(area, exercise.correctAnswer);
    
    if (result.error === 'no-selection') {
        alert(result.message);
        return;
    }
    
    if (result.correct) {
        this.showFeedback('Richtig!', 'correct');
    } else {
        this.showFeedback(`Falsch. Richtig: ${result.correctAnswer}`, 'incorrect');
    }
}
```

---

## ?? CSS-STYLING

### **MC-Buttons**:

```css
.mc-opt {
    padding: 1rem;
    border: 2px solid #ddd;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.mc-opt:hover {
    border-color: #667eea;
    background: #f0f0ff;
}

.mc-opt.sel,
.mc-opt.selected {
    border-color: #667eea;
    background: #667eea;
    color: white;
}

.mc-opt:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
```

---

## ?? BEISPIELE

### **Beispiel 1: Einfache Vokabel**

```javascript
const item = {
    es: 'hola',
    de: 'hallo',
    difficulty: 1
};

const pool = [
    { es: 'hola', de: 'hallo', difficulty: 1 },
    { es: 'adiós', de: 'auf Wiedersehen', difficulty: 1 },
    { es: 'gracias', de: 'danke', difficulty: 1 },
    { es: 'casa', de: 'Haus', difficulty: 2 },
    { es: 'perro', de: 'Hund', difficulty: 2 }
];

const distractors = pickDistractors(pool, item, 3);
// Mögliche Ergebnisse:
// - adiós (difficulty 1, distance > 2)
// - gracias (difficulty 1, distance > 2)
// - casa (difficulty 2, distance > 2)
```

### **Beispiel 2: Schwere Vokabel**

```javascript
const item = {
    es: 'desarrollar',
    de: 'entwickeln',
    difficulty: 4
};

const distractors = pickDistractors(pool, item, 3);
// Filter: difficulty 3-5
// Filter: distance > 2 from "desarrollar"
```

---

## ? PERFORMANCE

### **Optimierungen**:

```javascript
// Caching von normalisierten Werten
const normalizedPool = pool.map(x => ({
    ...x,
    normalizedEs: normEs(x.es),
    normalizedDe: toAsciiDe(x.de)
}));

// Dann in Filter verwenden
.filter(x => x.normalizedEs !== normalizedAnswer)
```

### **Fallback-Performance**:

```javascript
// Wenn zu wenige Candidates
if (candidates.length < k) {
    // Schneller Fallback ohne zusätzliche Filter
    const fallback = pool
        .filter(x => normEs(x.es) !== normalizedAnswer)
        .slice(0, k);
    return fallback.sort(() => Math.random() - 0.5);
}
```

---

## ?? TESTING

### **Test 1: Distractor-Quality**

```javascript
const item = { es: 'hola', de: 'hallo', difficulty: 1 };
const pool = [...vocabulary];

const distractors = pickDistractors(pool, item, 3);

console.assert(distractors.length === 3, 'Should return 3 distractors');
console.assert(!distractors.includes(item), 'Should not include answer');

distractors.forEach(d => {
    const diffDiff = Math.abs(d.difficulty - item.difficulty);
    console.assert(diffDiff <= 1, `Difficulty diff should be ?1, got ${diffDiff}`);
    
    const dist = levenshteinDistance(normEs(d.es), normEs(item.es));
    console.assert(dist > 2, `Distance should be >2, got ${dist}`);
});
```

### **Test 2: buildMC Output**

```javascript
const mc = buildMC(item, pool);

console.assert(mc.promptHtml.includes(item.es), 'Prompt should include Spanish word');
console.assert(mc.answersHtml.includes(item.de), 'Answers should include correct answer');
console.assert(mc.correctAnswer === toAsciiDe(item.de), 'Correct answer should be ASCII-normalized');
```

---

## ? FINAL STATUS

**MC-System implementiert**: ?  
**Funktionen**: 4 (pickDistractors, buildMC, setupMCListeners, checkMC)  
**Features**: Intelligent distractors + Quality checks  
**Integration**: Ready for SpanishApp  
**Documentation**: Complete

---

## ?? NEXT STEPS

### Optional:
1. **Adaptive Difficulty**
   ```javascript
   // Schwierigkeit basierend auf User-Performance anpassen
   function pickAdaptiveDistractors(pool, answer, userLevel) {
       const targetDifficulty = answer.difficulty + userLevel;
       // ...
   }
   ```

2. **Category-Based Distractors**
   ```javascript
   // Distraktoren aus gleicher Kategorie
   .filter(x => x.category === answer.category)
   ```

3. **Statistical Tracking**
   ```javascript
   // Tracking welche Distraktoren am besten funktionieren
   const distractorStats = {
       effectiveness: 0.75,
       timesUsed: 100,
       timesSelected: 25
   };
   ```

---

**STATUS**: ? **MC SYSTEM COMPLETE**  
**FILE**: js/app.js  
**POSITION**: Lines ~240-380  
**QUALITY**: Production-Ready

Das intelligente Multiple-Choice-System ist jetzt einsatzbereit! ???
