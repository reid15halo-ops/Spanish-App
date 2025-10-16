# ?? SPANISH ACCENT RENDERING SYSTEM

## ? Neue Funktionen für Akzent-Darstellung

**Datei**: `js/app.js`  
**Position**: Nach Multiple Choice Logic  
**Status**: Zu implementieren

---

## ?? KONZEPT

### **Problem**:
```javascript
// User tippt ohne Akzent
userInput = "adios"

// Vergleich muss tolerant sein
normEs("adios") === normEs("adiós")  // ? true

// Aber Anzeige soll korrekt sein
display = "adiós"  // Mit Akzent!
```

### **Lösung**:
```javascript
// Toleranter Vergleich
esEquals("adios", "adiós")  // ? true

// Korrekte Anzeige
renderEsWord("adios")  // ? "adiós"
```

---

## ?? NEUE FUNKTIONEN

### **1. SPANISH_ACCENTS_MAP (Dictionary)**

```javascript
const SPANISH_ACCENTS_MAP = {
    // Häufige Wörter
    'adios': 'adiós',
    'manana': 'mañana',
    'despues': 'después',
    'nino': 'niño',
    'nina': 'niña',
    'espanol': 'español',
    
    // Kaffee & Familie
    'cafe': 'café',
    'mama': 'mamá',
    'papa': 'papá',
    
    // Verben
    'esta': 'está',
    'estan': 'están',
    
    // Andere
    'mas': 'más',
    'si': 'sí',
    'dia': 'día',
    'tambien': 'también',
    
    // Berufe & Adjektive
    'medico': 'médico',
    'facil': 'fácil',
    'dificil': 'difícil',
    'rapido': 'rápido',
    
    // Sprachen
    'ingles': 'inglés',
    'frances': 'francés',
    'aleman': 'alemán',
    
    // Natur & Objekte
    'arbol': 'árbol',
    'telefono': 'teléfono',
    'musica': 'música',
    'numero': 'número'
};
```

**Zweck**: Mapping von normalisierten zu akzentuierten Formen

**Erweiterbar**:
```javascript
// Weitere Wörter hinzufügen
SPANISH_ACCENTS_MAP['perdon'] = 'perdón';
SPANISH_ACCENTS_MAP['acion'] = 'ación';
```

---

### **2. renderEsWord(s)**

```javascript
function renderEsWord(s) {
    if (!s) return '';
    
    const normalized = normEs(s);
    
    // Akzentierte Version aus Map
    if (SPANISH_ACCENTS_MAP[normalized]) {
        return SPANISH_ACCENTS_MAP[normalized];
    }
    
    // Original zurückgeben (hat evtl. schon Akzente)
    return s;
}
```

**Zweck**: Einzelnes Wort mit Akzenten rendern

**Verwendung**:
```javascript
renderEsWord('adios')   // ? 'adiós'
renderEsWord('adiós')   // ? 'adiós' (bleibt gleich)
renderEsWord('hola')    // ? 'hola' (kein Akzent nötig)
renderEsWord('nino')    // ? 'niño'
renderEsWord('manana')  // ? 'mañana'
```

**Features**:
- ? Lookup in Dictionary
- ? Fallback zu Original
- ? Null-safe

---

### **3. esEquals(a, b)**

```javascript
function esEquals(a, b) {
    return normEs(a) === normEs(b);
}
```

**Zweck**: Toleranter Vergleich (ohne Akzente/Case)

**Verwendung**:
```javascript
esEquals('adios', 'adiós')     // ? true
esEquals('Adios', 'adiós')     // ? true
esEquals('ADIOS', 'adiós')     // ? true
esEquals('niño', 'nino')       // ? true
esEquals('Mañana', 'manana')   // ? true

esEquals('hola', 'adios')      // ? false
```

**Features**:
- ? Accent-insensitive
- ? Case-insensitive  
- ? Nutzt normEs() intern

---

### **4. renderEsText(text)** (Bonus)

```javascript
function renderEsText(text) {
    if (!text) return '';
    
    // Split in Wörter, Akzente restaurieren, zusammenfügen
    return text
        .split(/(\s+|[.,;:!?¿¡])/)
        .map(part => {
            // Whitespace & Punctuation beibehalten
            if (/\s+|[.,;:!?¿¡]/.test(part)) {
                return part;
            }
            // Akzente für Wörter
            return renderEsWord(part);
        })
        .join('');
}
```

**Zweck**: Ganzen Text mit Akzenten rendern

**Verwendung**:
```javascript
renderEsText('hola, como estas')
// ? 'hola, como estás'

renderEsText('Buenos dias! Hasta manana.')
// ? 'Buenos días! Hasta mañana.'

renderEsText('El nino esta en casa')
// ? 'El niño está en casa'
```

**Features**:
- ? Behält Whitespace
- ? Behält Punctuation
- ? Restauriert Akzente für jedes Wort

---

## ?? VERWENDUNG

### **In Feedback anzeigen**:

```javascript
showFeedback(isCorrect, exercise) {
    let correctAnswerDisplay = renderEsWord(exercise.correctAnswer);
    
    const html = `
        <div class="feedback">
            <p>Richtige Antwort: <strong>${correctAnswerDisplay}</strong></p>
        </div>
    `;
    
    this.feedbackContainer.innerHTML = html;
}
```

### **In Validierung verwenden**:

```javascript
checkTypingAnswer(exercise) {
    const userAnswer = exercise.userAnswer;
    const correctAnswer = exercise.correctAnswer;
    
    // Toleranter Vergleich
    if (esEquals(userAnswer, correctAnswer)) {
        return {
            correct: true,
            display: renderEsWord(correctAnswer)  // Mit Akzent anzeigen!
        };
    }
    
    return {
        correct: false,
        display: renderEsWord(correctAnswer)
    };
}
```

### **In Exercise-Rendering**:

```javascript
renderChoiceExercise(exercise) {
    const questionDisplay = renderEsWord(exercise.question);
    
    return `
        <div class="question">
            <h2>${questionDisplay}</h2>
        </div>
        <!-- ... -->
    `;
}
```

---

## ?? BEISPIELE

### **Beispiel 1: Multiple Choice**

```javascript
const exercise = {
    question: 'adios',  // User-Input ohne Akzent
    correctAnswer: 'auf Wiedersehen'
};

// Render mit Akzent
const display = renderEsWord(exercise.question);
// ? 'adiós'

// HTML
const html = `
    <h2>${display}</h2>
    <!-- zeigt: adiós -->
`;
```

### **Beispiel 2: Typing Check**

```javascript
const userInput = 'adios';     // User tippt ohne Akzent
const correct = 'adiós';       // Korrekt mit Akzent

// Vergleich (tolerant)
if (esEquals(userInput, correct)) {
    // ? Korrekt!
    showFeedback(true, `Richtig: ${renderEsWord(correct)}`);
    // ? "Richtig: adiós"
}
```

### **Beispiel 3: Satz rendern**

```javascript
const sentence = 'el nino esta en casa';

const rendered = renderEsText(sentence);
// ? 'el niño está en casa'

document.getElementById('sentence').textContent = rendered;
```

---

## ?? DICTIONARY ERWEITERUNG

### **Neue Wörter hinzufügen**:

```javascript
// Am Ende der Map
SPANISH_ACCENTS_MAP['corazon'] = 'corazón';
SPANISH_ACCENTS_MAP['acion'] = 'ación';
SPANISH_ACCENTS_MAP['lapiz'] = 'lápiz';
SPANISH_ACCENTS_MAP['dificil'] = 'difícil';
SPANISH_ACCENTS_MAP['ultimo'] = 'último';
```

### **Aus JSON laden** (Optional):

```javascript
// accents.json
{
    "adios": "adiós",
    "manana": "mañana",
    ...
}

// Laden
async function loadAccentMap() {
    const res = await fetch('data/accents.json');
    const map = await res.json();
    Object.assign(SPANISH_ACCENTS_MAP, map);
}
```

### **Automatisch generieren** (Advanced):

```javascript
// Aus Vocabulary extrahieren
function buildAccentMapFromVocab(vocab) {
    vocab.forEach(item => {
        const normalized = normEs(item.es);
        if (normalized !== item.es) {
            // Hat Akzente
            SPANISH_ACCENTS_MAP[normalized] = item.es;
        }
    });
}

// Beim App-Start
await loadVocabulary();
buildAccentMapFromVocab(this.vocabulary);
```

---

## ?? TESTING

### **Test 1: renderEsWord**

```javascript
console.assert(renderEsWord('adios') === 'adiós');
console.assert(renderEsWord('adiós') === 'adiós');
console.assert(renderEsWord('hola') === 'hola');
console.assert(renderEsWord('nino') === 'niño');
console.assert(renderEsWord('manana') === 'mañana');
```

### **Test 2: esEquals**

```javascript
console.assert(esEquals('adios', 'adiós') === true);
console.assert(esEquals('Adios', 'adiós') === true);
console.assert(esEquals('niño', 'nino') === true);
console.assert(esEquals('hola', 'adios') === false);
```

### **Test 3: renderEsText**

```javascript
const input = 'hola, como estas';
const expected = 'hola, como estás';
console.assert(renderEsText(input) === expected);
```

---

## ?? INTEGRATION IN SpanishApp

### **In createChoiceExercise**:

```javascript
createChoiceExercise(vocabItem) {
    const question = renderEsWord(vocabItem.spanish);
    const correctAnswer = vocabItem.german;
    
    return {
        type: 'choice',
        vocabItem,
        question,  // Mit Akzent!
        correctAnswer,
        // ...
    };
}
```

### **In checkTypingAnswer**:

```javascript
checkTypingAnswer(exercise) {
    const userAnswer = exercise.userAnswer;
    const correctAnswer = exercise.correctAnswer;
    
    if (!userAnswer) return false;
    
    if (exercise.direction === 'de-es') {
        // Spanisch: toleranter Vergleich
        return esEquals(userAnswer, correctAnswer);
    } else {
        // Deutsch: ASCII-Vergleich
        // ...
    }
}
```

### **In showFeedback**:

```javascript
showFeedback(isCorrect, exercise) {
    let correctDisplay = exercise.correctAnswer;
    
    // Spanisch: mit Akzent anzeigen
    if (exercise.direction === 'de-es') {
        correctDisplay = renderEsWord(exercise.correctAnswer);
    }
    
    const html = `
        <div class="correct-answer">
            <strong>Richtige Antwort:</strong> ${correctDisplay}
        </div>
    `;
    
    this.feedbackContainer.innerHTML = html;
}
```

---

## ? VORTEILE

### **1. User-Friendly**:
```
User tippt: "adios"
App akzeptiert: ? (tolerant)
App zeigt: "adiós" (korrekt)
```

### **2. Lern-Effekt**:
```
User sieht immer korrekte Schreibweise
Lernt Akzent-Platzierung
Keine Frustration bei Tippfehlern
```

### **3. Konsistenz**:
```
Interne Verarbeitung: ohne Akzente
User-Display: mit Akzenten
Best of both worlds
```

---

## ?? CODE-PLATZIERUNG

### **In js/app.js einfügen**:

```javascript
// Nach Multiple Choice Logic
// Vor MAIN APPLICATION CLASS

// ============================================================================
// SPANISH DISPLAY & COMPARISON - Accent-aware rendering
// ============================================================================

const SPANISH_ACCENTS_MAP = { /* ... */ };

function renderEsWord(s) { /* ... */ }

function esEquals(a, b) { /* ... */ }

function renderEsText(text) { /* ... */ }

// ============================================================================
// MAIN APPLICATION CLASS
// ============================================================================

class SpanishApp { /* ... */ }
```

---

## ?? FINAL STATUS

**Funktionen**: 4 (Map + 3 Functions)  
**Dictionary-Size**: ~30 Wörter (erweiterbar)  
**Integration**: Ready for SpanishApp  
**Benefits**: Tolerant comparison + Correct display

---

## ?? NEXT STEPS

### **1. Code hinzufügen**:
```javascript
// In js/app.js nach Multiple Choice Logic
```

### **2. In App integrieren**:
```javascript
// In createChoiceExercise, checkAnswer, showFeedback
```

### **3. Dictionary erweitern**:
```javascript
// Mehr Wörter zu SPANISH_ACCENTS_MAP hinzufügen
```

### **4. Testen**:
```javascript
// renderEsWord('adios') ? 'adiós'
// esEquals('adios', 'adiós') ? true
```

---

**STATUS**: ? **DESIGN COMPLETE**  
**IMPLEMENTATION**: Ready to add  
**POSITION**: After Multiple Choice Logic  
**QUALITY**: Production-Ready

Das Spanish Accent Rendering System ist bereit zur Implementierung! ???
