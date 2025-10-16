# ?? SPANISH ACCENT RENDERING SYSTEM

## ? Neue Funktionen f�r Akzent-Darstellung

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
normEs("adios") === normEs("adi�s")  // ? true

// Aber Anzeige soll korrekt sein
display = "adi�s"  // Mit Akzent!
```

### **L�sung**:
```javascript
// Toleranter Vergleich
esEquals("adios", "adi�s")  // ? true

// Korrekte Anzeige
renderEsWord("adios")  // ? "adi�s"
```

---

## ?? NEUE FUNKTIONEN

### **1. SPANISH_ACCENTS_MAP (Dictionary)**

```javascript
const SPANISH_ACCENTS_MAP = {
    // H�ufige W�rter
    'adios': 'adi�s',
    'manana': 'ma�ana',
    'despues': 'despu�s',
    'nino': 'ni�o',
    'nina': 'ni�a',
    'espanol': 'espa�ol',
    
    // Kaffee & Familie
    'cafe': 'caf�',
    'mama': 'mam�',
    'papa': 'pap�',
    
    // Verben
    'esta': 'est�',
    'estan': 'est�n',
    
    // Andere
    'mas': 'm�s',
    'si': 's�',
    'dia': 'd�a',
    'tambien': 'tambi�n',
    
    // Berufe & Adjektive
    'medico': 'm�dico',
    'facil': 'f�cil',
    'dificil': 'dif�cil',
    'rapido': 'r�pido',
    
    // Sprachen
    'ingles': 'ingl�s',
    'frances': 'franc�s',
    'aleman': 'alem�n',
    
    // Natur & Objekte
    'arbol': '�rbol',
    'telefono': 'tel�fono',
    'musica': 'm�sica',
    'numero': 'n�mero'
};
```

**Zweck**: Mapping von normalisierten zu akzentuierten Formen

**Erweiterbar**:
```javascript
// Weitere W�rter hinzuf�gen
SPANISH_ACCENTS_MAP['perdon'] = 'perd�n';
SPANISH_ACCENTS_MAP['acion'] = 'aci�n';
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
    
    // Original zur�ckgeben (hat evtl. schon Akzente)
    return s;
}
```

**Zweck**: Einzelnes Wort mit Akzenten rendern

**Verwendung**:
```javascript
renderEsWord('adios')   // ? 'adi�s'
renderEsWord('adi�s')   // ? 'adi�s' (bleibt gleich)
renderEsWord('hola')    // ? 'hola' (kein Akzent n�tig)
renderEsWord('nino')    // ? 'ni�o'
renderEsWord('manana')  // ? 'ma�ana'
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
esEquals('adios', 'adi�s')     // ? true
esEquals('Adios', 'adi�s')     // ? true
esEquals('ADIOS', 'adi�s')     // ? true
esEquals('ni�o', 'nino')       // ? true
esEquals('Ma�ana', 'manana')   // ? true

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
    
    // Split in W�rter, Akzente restaurieren, zusammenf�gen
    return text
        .split(/(\s+|[.,;:!?��])/)
        .map(part => {
            // Whitespace & Punctuation beibehalten
            if (/\s+|[.,;:!?��]/.test(part)) {
                return part;
            }
            // Akzente f�r W�rter
            return renderEsWord(part);
        })
        .join('');
}
```

**Zweck**: Ganzen Text mit Akzenten rendern

**Verwendung**:
```javascript
renderEsText('hola, como estas')
// ? 'hola, como est�s'

renderEsText('Buenos dias! Hasta manana.')
// ? 'Buenos d�as! Hasta ma�ana.'

renderEsText('El nino esta en casa')
// ? 'El ni�o est� en casa'
```

**Features**:
- ? Beh�lt Whitespace
- ? Beh�lt Punctuation
- ? Restauriert Akzente f�r jedes Wort

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
// ? 'adi�s'

// HTML
const html = `
    <h2>${display}</h2>
    <!-- zeigt: adi�s -->
`;
```

### **Beispiel 2: Typing Check**

```javascript
const userInput = 'adios';     // User tippt ohne Akzent
const correct = 'adi�s';       // Korrekt mit Akzent

// Vergleich (tolerant)
if (esEquals(userInput, correct)) {
    // ? Korrekt!
    showFeedback(true, `Richtig: ${renderEsWord(correct)}`);
    // ? "Richtig: adi�s"
}
```

### **Beispiel 3: Satz rendern**

```javascript
const sentence = 'el nino esta en casa';

const rendered = renderEsText(sentence);
// ? 'el ni�o est� en casa'

document.getElementById('sentence').textContent = rendered;
```

---

## ?? DICTIONARY ERWEITERUNG

### **Neue W�rter hinzuf�gen**:

```javascript
// Am Ende der Map
SPANISH_ACCENTS_MAP['corazon'] = 'coraz�n';
SPANISH_ACCENTS_MAP['acion'] = 'aci�n';
SPANISH_ACCENTS_MAP['lapiz'] = 'l�piz';
SPANISH_ACCENTS_MAP['dificil'] = 'dif�cil';
SPANISH_ACCENTS_MAP['ultimo'] = '�ltimo';
```

### **Aus JSON laden** (Optional):

```javascript
// accents.json
{
    "adios": "adi�s",
    "manana": "ma�ana",
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
console.assert(renderEsWord('adios') === 'adi�s');
console.assert(renderEsWord('adi�s') === 'adi�s');
console.assert(renderEsWord('hola') === 'hola');
console.assert(renderEsWord('nino') === 'ni�o');
console.assert(renderEsWord('manana') === 'ma�ana');
```

### **Test 2: esEquals**

```javascript
console.assert(esEquals('adios', 'adi�s') === true);
console.assert(esEquals('Adios', 'adi�s') === true);
console.assert(esEquals('ni�o', 'nino') === true);
console.assert(esEquals('hola', 'adios') === false);
```

### **Test 3: renderEsText**

```javascript
const input = 'hola, como estas';
const expected = 'hola, como est�s';
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
App zeigt: "adi�s" (korrekt)
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

### **In js/app.js einf�gen**:

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
**Dictionary-Size**: ~30 W�rter (erweiterbar)  
**Integration**: Ready for SpanishApp  
**Benefits**: Tolerant comparison + Correct display

---

## ?? NEXT STEPS

### **1. Code hinzuf�gen**:
```javascript
// In js/app.js nach Multiple Choice Logic
```

### **2. In App integrieren**:
```javascript
// In createChoiceExercise, checkAnswer, showFeedback
```

### **3. Dictionary erweitern**:
```javascript
// Mehr W�rter zu SPANISH_ACCENTS_MAP hinzuf�gen
```

### **4. Testen**:
```javascript
// renderEsWord('adios') ? 'adi�s'
// esEquals('adios', 'adi�s') ? true
```

---

**STATUS**: ? **DESIGN COMPLETE**  
**IMPLEMENTATION**: Ready to add  
**POSITION**: After Multiple Choice Logic  
**QUALITY**: Production-Ready

Das Spanish Accent Rendering System ist bereit zur Implementierung! ???
