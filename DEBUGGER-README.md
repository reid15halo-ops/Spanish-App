# 🔍 Spanish App Debugger

Automatisches Test-Tool zur Erkennung aller 3 Bug-Kategorien (PROMPT 1-3).

## Features

### ✅ **4 Automatische Tests:**

1. **Options Count Test** (PROMPT 2)
   - Prüft: Alle Übungen haben ≥3 Optionen
   - Findet: Übungen mit zu wenigen Auswahlmöglichkeiten

2. **Options Preservation Test** (PROMPT 1)
   - Prüft: `transformExerciseForUI()` behält originale Options
   - Findet: Options die versehentlich überschrieben wurden

3. **Options Consistency Test** (PROMPT 1)
   - Prüft: Keine Mischung von vollständigen Sätzen mit einzelnen Wörtern
   - Findet: Inkonsistente Formatierung (zu offensichtliche Antworten)

4. **Navigation Test** (PROMPT 3)
   - Prüft: `saveProgress()` existiert und wird aufgerufen
   - Findet: Fehlende Progress-Speicherung nach Unit-Wechsel

---

## 🚀 Verwendung

### Methode 1: Browser HTML

```bash
# Starte Webserver
python3 -m http.server 8000

# Öffne im Browser
http://localhost:8000/debugger-test.html
```

**Buttons:**
- **🚀 Debugger starten** - Führt alle 4 Tests aus
- **⚡ Quick Check** - Nur kritische Tests (schneller)
- **📥 Export JSON** - Speichert Report als JSON
- **🗑️ Clear** - Output löschen

---

### Methode 2: JavaScript Console

```javascript
// Im Browser DevTools Console:

// 1. Initialisiere Controllers
const mockController = new Phase1Controller();
const uiController = new UIController();
const appController = new AppController(uiController);

// 2. Erstelle Debugger
const debugger = new SpanishAppDebugger(appController, mockController);

// 3. Generiere Report
const report = debugger.generateReport();
console.log(report);

// 4. Export als JSON
const json = debugger.getIssuesJSON();
console.log(JSON.stringify(json, null, 2));
```

---

### Methode 3: Programmatisch

```javascript
// In deinem Code
const debuggerTool = new SpanishAppDebugger(appController, mockController);

// Nur bestimmte Tests
debuggerTool.testOptionsCount();
debuggerTool.testOptionsConsistency();

// Prüfe Ergebnisse
if (debuggerTool.issues.length === 0) {
    console.log('✅ All tests passed!');
} else {
    console.warn(`⚠️ ${debuggerTool.issues.length} issues found`);
}

// Detaillierter Report
const report = debuggerTool.formatReport();
document.getElementById('output').textContent = report;
```

---

## 📊 Report Format

### Bei allen Tests bestanden:
```
═══════════════════════════════════════════════════════
          SPANISH APP DEBUGGER REPORT
═══════════════════════════════════════════════════════

✅✅✅ ALLE BUGS BEHOBEN! ✅✅✅

✅ 14/14 Tests passed
🎉 No issues found!

📊 TEST RESULTS:
─────────────────────────────────────────────────────
✅ Options Count: 7 passed, 0 failed
✅ Options Preservation: 5 passed, 0 failed
✅ Options Consistency: 0 passed, 0 failed
✅ Navigation: 2 passed, 0 failed
```

### Bei Problemen:
```
⚠️  3 ISSUES GEFUNDEN

✅ 11/14 Tests passed
❌ 3/14 Tests failed

📋 DETAILED ISSUES:
─────────────────────────────────────────────────────

❌ Issue #1: Options Count
   Exercise: mock_contrast_1
   Problem: Only 2 option(s) - Need at least 3
   Expected: ≥ 3 options
   Actual: 2 options
   Fix: Add more options (correct + common mistake + distractor)

❌ Issue #2: Format Consistency
   Exercise: mock_estar_2
   Problem: Mixing full sentences with single words - Too obvious!
   Expected: All same format (all sentences OR all single words)
   Actual: tengo | Yo estoy en Madrid | soy
   Fix: Use fill-in-the-blank format with single words only

⚠️ Issue #3: Navigation
   Exercise: N/A
   Problem: loadNextUnit() does not call saveProgress()
   Expected: saveProgress() called after loading new unit
   Actual: saveProgress() not found in function
   Fix: Add this.saveProgress() call in loadNextUnit() after loadUnit()

💡 EMPFEHLUNGEN:
─────────────────────────────────────────────────────
❌ 2 kritische Fehler müssen behoben werden
⚠️  1 Warnungen sollten überprüft werden

🔧 Options Count: 1 issue(s)
   • Add more options (correct + common mistake + distractor)

🔧 Format Consistency: 1 issue(s)
   • Use fill-in-the-blank format with single words only

🔧 Navigation: 1 issue(s)
   • Add this.saveProgress() call in loadNextUnit() after loadUnit()
```

---

## 🧪 JSON Export

```javascript
{
  "summary": {
    "totalIssues": 3,
    "errors": 2,
    "warnings": 1
  },
  "tests": {
    "optionsCount": { "passed": 6, "failed": 1 },
    "optionsPreservation": { "passed": 5, "failed": 0 },
    "optionsConsistency": { "passed": 6, "failed": 1 },
    "navigation": { "passed": 1, "failed": 1 }
  },
  "issues": [
    {
      "severity": "error",
      "category": "Options Count",
      "exerciseId": "mock_contrast_1",
      "problem": "Only 2 option(s) - Need at least 3",
      "expected": "≥ 3 options",
      "actual": "2 options",
      "fix": "Add more options (correct + common mistake + distractor)"
    }
  ],
  "timestamp": 1735479600000
}
```

---

## 🔧 API Reference

### Constructor
```javascript
new SpanishAppDebugger(appController, mockController)
```

### Methods

#### `generateReport(): string`
Führt alle Tests aus und gibt formatierten Report zurück.

#### `getIssuesJSON(): object`
Gibt Issues als JSON-Objekt zurück (für programmatische Verwendung).

#### `testOptionsCount(): void`
Test 1: Prüft Options-Anzahl (≥3).

#### `testOptionsPreservation(): void`
Test 2: Prüft ob Options beim Transform erhalten bleiben.

#### `testOptionsConsistency(): void`
Test 3: Prüft Format-Konsistenz (keine gemischten Formate).

#### `testNavigationFlow(): void`
Test 4: Prüft Navigation & saveProgress().

---

## 📁 Dateien

```
js/
  spanish-app-debugger.js   - Hauptklasse (370 Zeilen)
debugger-test.html          - Browser UI zum Testen
test-debugger.js            - Node.js Test-Script (optional)
DEBUGGER-README.md          - Diese Dokumentation
```

---

## 🎯 Beispiel-Session

```
Öffne: http://localhost:8000/debugger-test.html

Klick: "🚀 Debugger starten"

Output:
  🔍 Starting Spanish App Debugger...

  📊 TEST 1: Checking options count...
    ✅ Passed: 7
    ❌ Failed: 0

  🔄 TEST 2: Checking options preservation...
    ✅ Passed: 5
    ❌ Failed: 0

  📝 TEST 3: Checking options format consistency...
    ✅ Passed: 7
    ❌ Failed: 0

  🧭 TEST 4: Checking navigation & progress saving...
    ✅ Passed: 2
    ❌ Failed: 0

  ═══════════════════════════════════════════════════
  ✅✅✅ ALLE BUGS BEHOBEN! ✅✅✅
  ═══════════════════════════════════════════════════
```

---

## 💡 Integration

### In CI/CD Pipeline

```bash
# test-ci.sh
#!/bin/bash

# Start server
python3 -m http.server 8000 &
SERVER_PID=$!

# Wait for server
sleep 2

# Run tests with Playwright/Puppeteer
npx playwright test debugger-test.spec.js

# Cleanup
kill $SERVER_PID

# Exit with test result
exit $?
```

### In Pre-commit Hook

```bash
# .git/hooks/pre-commit
#!/bin/bash

echo "🔍 Running Spanish App Debugger..."

node test-debugger.js

if [ $? -ne 0 ]; then
    echo "❌ Tests failed! Fix issues before committing."
    exit 1
fi

echo "✅ All tests passed!"
exit 0
```

---

## 🐛 Bekannte Probleme

1. **Node.js Support**: Der Debugger ist für Browser optimiert. Node.js Unterstützung benötigt JSDOM oder ähnliches.

2. **Async Tests**: Navigation-Tests simulieren den Flow, führen aber keine echten async Operationen aus.

3. **Dynamic Exercises**: Der Debugger testet nur statische Mock-Übungen, nicht dynamisch generierte.

---

## 📝 Changelog

**v1.0.0** (2024-10-29)
- Initial release
- 4 automatische Tests
- Formatierter Report mit Farben
- JSON Export
- Browser UI

---

## 🤝 Contributing

Neue Tests hinzufügen:

```javascript
testMyNewFeature() {
    console.log('🧪 TEST 5: My new feature...');

    // Test logic here

    if (problem) {
        this.tests.myFeature.failed++;
        this.issues.push({
            severity: 'error',
            category: 'My Feature',
            exerciseId: 'exercise_id',
            problem: 'Description',
            expected: 'What should happen',
            actual: 'What actually happens',
            fix: 'How to fix it'
        });
    } else {
        this.tests.myFeature.passed++;
    }
}
```

---

## 📜 Lizenz

MIT License - Teil der Spanish Learning App

---

Erstellt mit ❤️ von Claude Code
