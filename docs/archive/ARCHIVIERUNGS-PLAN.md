# ?? ARCHIVIERUNGS-PLAN für Spanish Learning App

## ?? Ziel
Archivierung aller nicht mehr benötigten Dateien zur Vereinfachung der Projektstruktur.

---

## ?? ARCHIVIERUNGS-STRATEGIE

### **Aktive Dateien (BEHALTEN)**:
```
? index.html                    - Hauptversion (komplex)
? index-simple.html             - Vereinfachte Version
? index-guided.html             - Geführte Version
? test.html                     - Test-Suite
? start.bat                     - Haupt-Launcher
? manifest.webmanifest          - PWA Manifest
? sw.js                         - Service Worker
? README.md                     - Hauptdokumentation
? SCHNELLSTART.md               - Quick Start Guide
? package.json                  - NPM Config
```

### **JavaScript Core (BEHALTEN)**:
```
? js/app.js                     - Main Application
? js/srs.js                     - SRS System
? js/conjugator.js              - Konjugator
? js/normalize-es.js            - Spanish Normalizer
? js/editor.js                  - Editor
? js/test-runner.js             - Test Runner
? js/utils/ascii.js             - ASCII Utils
```

### **CSS (BEHALTEN)**:
```
? css/style.css                 - Haupt-Styles
? css/style-simplified.css      - Simplified Styles
```

### **Data (BEHALTEN)**:
```
? data/verbs.json               - Verb Database
? data/verbs.csv                - Verb CSV
? data/items.json               - Vocabulary (if exists)
? data/items.csv                - Vocabulary CSV (if exists)
? data/grammar-examples.csv     - Grammar Examples
```

### **Tools (BEHALTEN)**:
```
? tools/build.ps1               - Build Script
? tools/convert-utf8.ps1        - UTF-8 Converter
? tools/build-simple.js         - Simple Builder
```

---

## ??? ZU ARCHIVIEREN

### **1. Entwicklungs-/Test-HTML** ? `archive/dev/html/`
```
? zeiten-workbench.html
? zeiten-quick-start.html
? zeiten-uebungen.html
? zeiten-validator.html
? explain-test.html
? sentence-analyzer-test.html
? verb-pack-test.html
? periphrastic-test.html
? periphrastic-final-validation.html
? timeline-view.html
? timeline-view-test.html
? diagnostic-test.html
? csv-import-export.html
? a11y-perf-test.html
? qa-automated.html
```

### **2. Entwicklungs-JavaScript** ? `archive/dev/js/`
```
? js/zeiten-data.js
? js/zeiten-workbench.js
? js/zeiten-validation.js
? js/zeiten-exercises.js
? js/zeiten-exercise-validator.js
? js/explain.js
? js/explain-ui.js
? js/explain-tester.js
? js/sentence-analyzer.js
? js/sentence-analyzer-tester.js
? js/verb-pack-system.js
? js/verb-pack-tester.js
? js/periphrastic-system.js
? js/periphrastic-tester.js
? js/periphrastic-final-validation.js
? js/timeline-view.js
? js/timeline-view-tester.js
? js/diagnostic-test.js
? js/csv-importer.js
? js/qa-automated.js
```

### **3. Entwicklungs-CSS** ? `archive/dev/css/`
```
? css/zeiten-workbench.css
```

### **4. Utilities (Entwicklung)** ? `archive/dev/utils/`
```
? js/utils/validate-conjugator-nodejs.js
? js/utils/verb-build-reporter.js
? js/utils/final-verification.js
? js/utils/migrate-nodejs.js
? js/utils/migrator.js
? js/utils/a11y-perf-hardening.js
? js/utils/performance.js
```

### **5. Test-Dateien** ? `archive/tests/`
```
? test/nogame-db-spec.js
? test/nogame-dom-spec.js
? test/noumlaut-data-spec.js
? test-periphrastic.js
```

### **6. Lint/QA Tools** ? `archive/tools/`
```
? js/no-gamification.lint.js
? tools/nogame-lint.js
? tools/noumlaut-lint.js
? tools/build.js (alt)
? tools/optimize.js
? tools/production-build.js
? tools/smart-optimize.js
```

### **7. Alte Launcher** ? `archive/launchers/`
```
? launch.bat
? launch.ps1
? create-shortcut.bat
? launch-simple.bat
```

### **8. Dokumentation (Entwicklung)** ? `archive/docs/dev/`
```
? KONJUGATOR-SYSTEM-COMPLETE.md
? ASCII-REFACTORING-COMPLETE.md
? NO-GAMIFICATION-SYSTEM-REPORT.md
? FEHLERKORREKTUR.md
? RESUMEN-ESPAÑOL.md
? DUOLINGO-MVP-README.md
? ABSCHLUSS-BERICHT.md
? DEBUG-BUILD-COMPLETE.md
? ZEITEN-WORKBENCH-README.md
? ZEITEN-WORKBENCH-ABSCHLUSS.md
? ZEITEN-UEBUNGEN-README.md
? ZEITEN-UEBUNGEN-ABSCHLUSS.md
? FEHLERERKLAER-SYSTEM-README.md
? FEHLERERKLAER-SYSTEM-ABSCHLUSS.md
? SATZANALYSE-SYSTEM-README.md
? SATZANALYSE-SYSTEM-ABSCHLUSS.md
? VERB-PACK-SYSTEM-README.md
? VERB-PACK-SYSTEM-ABSCHLUSS.md
? PERIPHRASTIC-SYSTEM-README.md
? PERIPHRASTIC-SYSTEM-ABSCHLUSS.md
? PERIPHRASTIC-STATUS-FINAL.md
? PERIPHRASTIC-FINAL-OVERVIEW.md
? TIMELINE-VIEW-README.md
? TIMELINE-VIEW-COMPLETE.md
? DIAGNOSTIC-TEST-README.md
? DIAGNOSTIC-TEST-COMPLETE.md
? CSV-IMPORT-EXPORT-README.md
? CSV-IMPORT-EXPORT-COMPLETE.md
? APP-VERSION-0.0-STATUS-REPORT.md
? A11Y-PERF-HARDENING-REPORT.md
? GUARDRAILS-SYSTEM-COMPLETE.md
? GUARDRAILS-QUICK-START.md
? QA-AUTOMATED-SYSTEM-COMPLETE.md
? QA-QUICK-START.md
? DEPLOYMENT-PACKAGE-v0.0-COMPLETE.md
? DEPLOYMENT-VERIFICATION-v0.0.md
? RELEASE_NOTES_v0.0.md
? LAUNCHER-WINDOWS-README.md
? LAUNCHER-WINDOWS-COMPLETE.md
? OPTIMIZATION-GUIDE.md
? OPTIMIZATION-COMPLETE.md
? BUILD-FINAL-PACKAGE.md
? PROJEKT-ABSCHLUSS-v0.0.md
? LAUNCHER-TROUBLESHOOTING.md
? SIMPLIFICATION-COMPLETE.md
? APP-SIMPLIFIED-FINAL.md
? BUGFIX-SIMPLE-APP.md
? GUIDED-VERSION-COMPLETE.md
? GUIDED-VERSION-FINAL.md
? CSS-SIMPLIFIED-COMPLETE.md
```

### **9. Dokumentation (Patches)** ? `archive/docs/patches/`
```
? UTILITY-FUNCTIONS-PATCH.md
? DATA-LOADING-SYSTEM.md
? MULTIPLE-CHOICE-SYSTEM.md
? SPANISH-ACCENT-RENDERING.md
? ROUTER-NAVIGATION-SYSTEM.md
? UTF8-CONVERTER-README.md
```

### **10. Data (Reports)** ? `archive/data/`
```
? data/a11y-report.json
? data/perf-report.json
```

---

## ?? NEUE STRUKTUR

```
Spanish/
??? index.html                      ? Hauptversion
??? index-simple.html               ? Vereinfacht
??? index-guided.html               ? Geführt
??? test.html                       ? Tests
??? start.bat                       ? Launcher
??? manifest.webmanifest
??? sw.js
??? README.md                       ? Haupt-Doku
??? SCHNELLSTART.md                 ? Quick Start
??? package.json
?
??? js/
?   ??? app.js                      ? Main App
?   ??? srs.js
?   ??? conjugator.js
?   ??? normalize-es.js
?   ??? editor.js
?   ??? test-runner.js
?   ??? utils/
?       ??? ascii.js
?
??? css/
?   ??? style.css
?   ??? style-simplified.css
?
??? data/
?   ??? verbs.json
?   ??? verbs.csv
?   ??? items.json
?   ??? items.csv
?   ??? grammar-examples.csv
?
??? tools/
?   ??? build.ps1
?   ??? convert-utf8.ps1
?   ??? build-simple.js
?
??? archive/                        ? ARCHIV
    ??? dev/                        ? Entwicklungs-Files
    ?   ??? html/
    ?   ??? js/
    ?   ??? css/
    ?   ??? utils/
    ??? tests/                      ? Test-Files
    ??? tools/                      ? Alte Tools
    ??? launchers/                  ? Alte Launcher
    ??? docs/                       ? Alte Docs
    ?   ??? dev/
    ?   ??? patches/
    ??? data/                       ? Reports
```

---

## ?? AUSFÜHRUNG

### **PowerShell Script erstellen**:
```powershell
# archive-old-files.ps1
# Siehe nächste Datei
```

### **Manuell ausführen**:
```bash
# 1. Archiv-Ordner erstellen
mkdir archive/dev/html
mkdir archive/dev/js
mkdir archive/dev/css
mkdir archive/dev/utils
mkdir archive/tests
mkdir archive/tools
mkdir archive/launchers
mkdir archive/docs/dev
mkdir archive/docs/patches
mkdir archive/data

# 2. Dateien verschieben
# (siehe PowerShell Script)
```

---

## ?? WICHTIG

### **VOR der Archivierung**:
1. ? Git commit (aktueller Stand)
2. ? Backup erstellen
3. ? Testen dass app funktioniert

### **NACH der Archivierung**:
1. ? App testen (index.html, index-simple.html, index-guided.html)
2. ? start.bat testen
3. ? Git commit (nach Archivierung)

---

## ?? STATISTIK

### **Vorher**:
```
~200+ Dateien im Root/Subfolders
Unübersichtlich
Viele veraltete Dateien
```

### **Nachher**:
```
~30-40 aktive Dateien
Klare Struktur
Archiv für Referenz
```

---

## ? VORTEILE

```
? Übersichtlichere Struktur
? Schnelleres Laden (weniger Dateien)
? Einfacheres Deployment
? Klare Trennung (aktiv/archiviert)
? Historie bleibt erhalten (in archive/)
? Einfacher zu warten
```

---

**STATUS**: ? **PLAN ERSTELLT**  
**NEXT**: PowerShell Script zur Ausführung

Die Archivierung ist geplant und dokumentiert! ???
