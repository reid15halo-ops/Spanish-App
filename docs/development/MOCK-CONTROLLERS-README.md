# Mock Controllers für UI Testing

## Problem

Die originalen JavaScript-Module (`phase1-controller.js`, `adaptive-learning-orchestrator.js`, etc.) sind für Node.js/Modul-Systeme konzipiert und funktionieren nicht direkt im Browser via `file://` Protokoll.

## Lösung

Mock-Controller wurden erstellt, die:
- ✅ Im Browser ohne Build-Step funktionieren
- ✅ 10 Test-Übungen bereitstellen (SER, ESTAR, TENER, Integration)
- ✅ Alle UI-Features demonstrieren
- ✅ Deutsche Brücken und Erklärungen enthalten

---

## Verwendung

### Option 1: Mit Mock-Controllern (Standard)

**Für**: Schnelles UI-Testing, keine Server nötig

```html
<!-- In index.html (aktuell aktiv) -->
<script src="js/mock-phase1-controller.js"></script>
<script src="js/mock-adaptive-learning.js"></script>
<script src="js/mock-german-system.js"></script>
```

**Start:**
```bash
# Einfach öffnen
open index.html
# oder
start index.html  # Windows
```

**Vorteile:**
- ✅ Funktioniert sofort (kein Server nötig)
- ✅ 10 vorgefertigte Übungen
- ✅ Alle UI-Features funktionieren
- ✅ Kein Build-Prozess

**Nachteile:**
- ❌ Nur 10 Test-Übungen (statt 225)
- ❌ Keine echte Adaptive Learning Logic
- ❌ Keine echte German-Spanish Analyse

---

### Option 2: Mit echten Controllern

**Für**: Volle Funktionalität mit 225 Übungen

**Schritt 1:** Echte Controller für Browser exportieren

```javascript
// Am Ende jeder Controller-Datei hinzufügen:

// js/phase1-controller.js
if (typeof window !== 'undefined') {
    window.Phase1Controller = Phase1Controller;
}

// js/adaptive-learning-orchestrator.js
if (typeof window !== 'undefined') {
    window.AdaptiveLearningOrchestrator = AdaptiveLearningOrchestrator;
}

// js/german-spanish-learning-system.js
if (typeof window !== 'undefined') {
    window.GermanSpanishLearningSystem = GermanSpanishLearningSystem;
}
```

**Schritt 2:** index.html aktualisieren

```html
<!-- Ersetze Mock-Controller mit echten -->
<script src="js/phase1-controller.js"></script>
<script src="js/adaptive-learning-orchestrator.js"></script>
<script src="js/german-spanish-learning-system.js"></script>

<!-- Entferne/kommentiere Mock-Dateien -->
<!-- <script src="js/mock-phase1-controller.js"></script> -->
<!-- <script src="js/mock-adaptive-learning.js"></script> -->
<!-- <script src="js/mock-german-system.js"></script> -->
```

**Schritt 3:** Mit lokalem Server starten

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# Dann öffnen:
open http://localhost:8000
```

**Vorteile:**
- ✅ Volle 225 Übungen (alle 7 Units)
- ✅ Echte Adaptive Learning Algorithmen
- ✅ German-Spanish Contrastive Analysis
- ✅ Alle fortgeschrittenen Features

**Nachteile:**
- ❌ Braucht lokalen Server (CORS)
- ❌ Möglicherweise mehr Dependencies

---

## Mock Controller Übersicht

### mock-phase1-controller.js

**Enthält 10 Test-Übungen:**
1. SER yo-Konjugation
2. SER tú-Konjugation
3. SER für Beruf (Ich bin Student)
4. ESTAR yo-Konjugation
5. ESTAR für Ort (Ich bin in Madrid)
6. SER/ESTAR Kontrast - Beruf
7. SER/ESTAR Kontrast - Emotion
8. TENER für Alter (Ich bin 25)
9. Integration - Alle drei Verben
10. (weitere können hinzugefügt werden)

**Features:**
- Multiple Choice Optionen mit deutschen Übersetzungen
- German Bridge Erklärungen
- 3-Level Progressive Hints
- Detaillierte Erklärungen
- DOCTOR & LECH Regeln

### mock-adaptive-learning.js

**Simuliert:**
- Session Management
- Attempt Tracking
- Basic Statistics

### mock-german-system.js

**Simuliert:**
- German Bridge Generation
- German-specific Feedback
- Common German mistakes (SER/ESTAR, TENER age)

---

## Entwicklung

### Neue Mock-Übungen hinzufügen

```javascript
// In mock-phase1-controller.js, generateMockExercises():

{
    id: 'mock_new_1',
    type: 'multiple-choice',
    concept: 'concept-name',
    difficulty: 1-10,
    question: 'Frage auf Deutsch',
    correctAnswer: 'respuesta correcta',
    german: 'Deutsche Übersetzung',
    germanBridge: '💡 Hinweis für Deutsche',
    options: [
        { spanish: 'Antwort 1', german: '(Übersetzung)', value: 'antwort1' },
        { spanish: 'Antwort 2', german: '(Übersetzung)', value: 'antwort2' }
    ],
    hints: [
        'Level 1 Hint',
        'Level 2 Hint',
        'Level 3 Hint mit Antwort'
    ],
    explanation: '<p>HTML-formatierte Erklärung</p>'
}
```

### Testing

```bash
# 1. Öffne index.html im Browser
open index.html

# 2. Öffne Developer Console (F12)
# 3. Prüfe auf Fehler

# 4. Test Checklist:
# - Übungen laden?
# - Antworten funktionieren?
# - Feedback wird angezeigt?
# - Hints funktionieren? (H-Taste)
# - Erklärungen funktionieren? (E-Taste)
# - Keyboard Shortcuts? (1-4, Enter, Spacebar)
# - Sidebar funktioniert? (☰)
# - Responsive? (Resize Browser)
```

---

## Migration zu echten Controllern

### Schritt-für-Schritt

1. **Prüfe Dependencies:**
   ```bash
   # Welche Dateien werden gebraucht?
   grep -r "require\|import" js/phase1-controller.js
   ```

2. **Füge Browser-Export hinzu:**
   ```javascript
   // Am Ende jeder Datei
   if (typeof window !== 'undefined') {
       window.ClassName = ClassName;
   }
   ```

3. **Teste mit lokalem Server:**
   ```bash
   python -m http.server 8000
   open http://localhost:8000
   ```

4. **Prüfe Browser Console:**
   - Sind alle Klassen verfügbar?
   - Gibt es Fehler beim Laden?
   - Funktionieren die Übungen?

5. **Fallback zu Mock bei Fehlern:**
   ```javascript
   // In index.html
   if (typeof Phase1Controller === 'undefined') {
       console.warn('Using mock controller');
       // Load mock script dynamically
   }
   ```

---

## Troubleshooting

### Problem: "Phase1Controller is not defined"

**Lösung 1:** Stelle sicher, dass Mock-Dateien geladen sind
```html
<script src="js/mock-phase1-controller.js"></script>
```

**Lösung 2:** Prüfe Browser Console auf Load-Fehler
```
F12 → Console Tab → Prüfe auf 404 Fehler
```

**Lösung 3:** Prüfe Dateipfade
```bash
ls js/mock-*.js
# Sollte zeigen:
# js/mock-adaptive-learning.js
# js/mock-german-system.js
# js/mock-phase1-controller.js
```

### Problem: "Cannot read property 'exercises' of undefined"

**Lösung:** Mock-Controller hat keine Übungen generiert
```javascript
// Prüfe in Browser Console:
const controller = new Phase1Controller();
console.log(controller.exercises); // Sollte Array zeigen
```

### Problem: CORS Error beim Laden von JSON

**Lösung:** Verwende lokalen Server statt `file://`
```bash
python -m http.server 8000
```

---

## Performance

### Mock vs. Real

| Metrik | Mock | Real |
|--------|------|------|
| **Load Time** | < 1s | 2-3s |
| **Exercises** | 10 | 225 |
| **File Size** | 15KB | 150KB+ |
| **Dependencies** | 0 | 20+ |
| **Offline** | ✅ Ja | ⚠️ Partial |

---

## Nächste Schritte

1. **UI Testing mit Mock:**
   - ✅ Alle UI-Features testen
   - ✅ Responsive Behavior prüfen
   - ✅ Keyboard Shortcuts testen

2. **Migration zu Real:**
   - Export-Statements hinzufügen
   - Dependencies auflösen
   - Mit lokalem Server testen

3. **Production Build:**
   - Webpack/Vite Setup
   - Module bundling
   - Optimierung

---

## Support

**Mock-Controller Problem?**
- Öffne index.html und prüfe Browser Console
- Prüfe, ob alle 3 Mock-Dateien geladen sind
- Teste mit einem einfachen `console.log` in mock-phase1-controller.js

**Real Controller Problem?**
- Stelle sicher, dass lokaler Server läuft
- Prüfe CORS-Fehler in Browser Console
- Teste einzelne Module isoliert

---

**Status:** Mock-Controller sind produktionsbereit für UI-Testing
**Version:** 1.0
**Datum:** October 29, 2025
