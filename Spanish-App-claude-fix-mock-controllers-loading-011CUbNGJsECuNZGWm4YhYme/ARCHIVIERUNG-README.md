# ?? ARCHIVIERUNG - ANLEITUNG

## ?? �bersicht

Dieses Script archiviert nicht mehr ben�tigte Entwicklungs-Dateien, um die Projektstruktur zu vereinfachen.

---

## ?? SCHNELLSTART

### **Dry Run (Test ohne �nderungen)**:
```powershell
.\tools\archive-old-files.ps1 -DryRun
```

### **Live Run (tats�chlich archivieren)**:
```powershell
.\tools\archive-old-files.ps1
```

### **Mit Verbose-Output**:
```powershell
.\tools\archive-old-files.ps1 -Verbose
```

---

## ?? VOR DER AUSF�HRUNG

### **1. Git Commit (aktueller Stand)**:
```bash
git add .
git commit -m "Pre-archivierung commit"
```

### **2. Backup erstellen** (optional):
```bash
# Gesamtes Projekt kopieren
Copy-Item -Path . -Destination ../Spanish-Backup -Recurse
```

### **3. App testen**:
```bash
# Sicherstellen dass alles funktioniert
start.bat
```

---

## ?? WAS WIRD ARCHIVIERT?

### **Entwicklungs-Dateien** ? `archive/dev/`
- HTML-Test-Seiten (zeiten-workbench.html, etc.)
- JavaScript-Test-Module (zeiten-*.js, etc.)
- CSS-Test-Styles
- Entwicklungs-Utils

### **Test-Dateien** ? `archive/tests/`
- Spec-Dateien
- Test-Scripts

### **Alte Tools** ? `archive/tools/`
- Veraltete Build-Scripts
- Lint-Tools
- Optimization-Scripts

### **Alte Launcher** ? `archive/launchers/`
- launch.bat
- launch-simple.bat
- etc.

### **Dokumentation** ? `archive/docs/`
- Entwicklungs-Dokumentation
- System-Reports
- Patch-Dokumentation

### **Data Reports** ? `archive/data/`
- a11y-report.json
- perf-report.json

---

## ? WAS BLEIBT AKTIV?

### **Core Files**:
```
index.html
index-simple.html
index-guided.html
test.html
start.bat
manifest.webmanifest
sw.js
README.md
SCHNELLSTART.md
package.json
```

### **JavaScript**:
```
js/app.js
js/srs.js
js/conjugator.js
js/normalize-es.js
js/editor.js
js/test-runner.js
js/utils/ascii.js
```

### **CSS**:
```
css/style.css
css/style-simplified.css
```

### **Data**:
```
data/verbs.json
data/verbs.csv
data/items.json
data/items.csv
data/grammar-examples.csv
```

### **Tools**:
```
tools/build.ps1
tools/convert-utf8.ps1
tools/build-simple.js
tools/archive-old-files.ps1
```

---

## ?? AUSF�HRUNG

### **Schritt 1: Dry Run**
```powershell
# Test ohne �nderungen
.\tools\archive-old-files.ps1 -DryRun

# Ausgabe pr�fen:
# - Welche Dateien werden verschoben?
# - Gibt es Fehler?
```

### **Schritt 2: Live Run**
```powershell
# Tats�chlich archivieren
.\tools\archive-old-files.ps1

# Warten auf Fertigstellung
# Pr�fen der Summary
```

### **Schritt 3: Testen**
```powershell
# App starten
.\start.bat

# Alle Versionen testen:
# - index.html (komplex)
# - index-simple.html (einfach)
# - index-guided.html (gef�hrt)
# - test.html (tests)
```

### **Schritt 4: Git Commit**
```bash
# �nderungen committen
git add .
git commit -m "Archivierung nicht mehr ben�tigter Dateien"
git push
```

---

## ?? ERWARTETE AUSGABE

### **Dry Run**:
```
???????????????????????????????????????????????????????????????
  Spanish Learning App - Archivierungs-Script
???????????????????????????????????????????????????????????????

Root: C:\Users\reid1\Documents\Spanish
Mode: DRY RUN (keine �nderungen)

Erstelle Archiv-Struktur...

1. Entwicklungs-HTML...
  [DRY] zeiten-workbench.html ? archive/dev/html/zeiten-workbench.html
  [DRY] zeiten-quick-start.html ? archive/dev/html/zeiten-quick-start.html
  ...

???????????????????????????????????????????????????????????????
  ZUSAMMENFASSUNG
???????????????????????????????????????????????????????????????

DRY RUN - Keine Dateien wurden verschoben

Verschoben: 150
�bersprungen: 10
Fehler: 0
```

### **Live Run**:
```
???????????????????????????????????????????????????????????????
  Spanish Learning App - Archivierungs-Script
???????????????????????????????????????????????????????????????

Root: C:\Users\reid1\Documents\Spanish
Mode: LIVE (Dateien werden verschoben)

1. Entwicklungs-HTML...
  ? zeiten-workbench.html
  ? zeiten-quick-start.html
  ...

???????????????????????????????????????????????????????????????
  ZUSAMMENFASSUNG
???????????????????????????????????????????????????????????????

Archivierung abgeschlossen!

Verschoben: 150
�bersprungen: 10
Fehler: 0

WICHTIG:
  1. Teste die App: start.bat
  2. Pr�fe index.html, index-simple.html, index-guided.html
  3. Committe die �nderungen: git add . && git commit
```

---

## ?? R�CKG�NGIG MACHEN

### **Wenn etwas schief geht**:

```powershell
# Option 1: Git Reset
git reset --hard HEAD

# Option 2: Manuell zur�ckkopieren
Copy-Item -Path archive/dev/html/* -Destination . -Recurse

# Option 3: Aus Backup wiederherstellen
Copy-Item -Path ../Spanish-Backup/* -Destination . -Recurse
```

---

## ?? NEUE PROJEKTSTRUKTUR

### **Vorher** (~200+ Dateien):
```
Spanish/
??? index.html
??? zeiten-workbench.html
??? zeiten-quick-start.html
??? zeiten-uebungen.html
??? ... (viele weitere)
??? js/
?   ??? app.js
?   ??? zeiten-data.js
?   ??? zeiten-workbench.js
?   ??? ... (viele weitere)
??? ...
```

### **Nachher** (~40 aktive Dateien):
```
Spanish/
??? index.html              ? Haupt-App
??? index-simple.html       ? Vereinfacht
??? index-guided.html       ? Gef�hrt
??? test.html               ? Tests
??? start.bat               ? Launcher
??? README.md
??? SCHNELLSTART.md
?
??? js/
?   ??? app.js              ? Main
?   ??? srs.js
?   ??? conjugator.js
?   ??? ...
?
??? css/
?   ??? style.css
?   ??? style-simplified.css
?
??? data/
?   ??? verbs.json
?   ??? ...
?
??? tools/
?   ??? build.ps1
?   ??? ...
?
??? archive/                ? ARCHIV
    ??? dev/
    ??? tests/
    ??? tools/
    ??? launchers/
    ??? docs/
```

---

## ? VORTEILE

```
? �bersichtlichere Struktur
? Schnelleres Laden (weniger Dateien)
? Einfacheres Deployment
? Klare Trennung (aktiv/archiviert)
? Historie bleibt erhalten
? Einfacher zu warten
? Weniger Verwirrung
```

---

## ?? TROUBLESHOOTING

### **Problem: Script findet Dateien nicht**
```powershell
# L�sung: Pr�fe ob du im richtigen Ordner bist
Get-Location

# Sollte sein: C:\Users\reid1\Documents\Spanish
```

### **Problem: Keine Berechtigung**
```powershell
# L�sung: Als Administrator ausf�hren
# Rechtsklick auf PowerShell ? Als Administrator ausf�hren
```

### **Problem: Execution Policy**
```powershell
# L�sung: Policy tempor�r �ndern
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\tools\archive-old-files.ps1
```

---

## ?? NACH DER ARCHIVIERUNG

### **Checklist**:
```
? start.bat funktioniert
? index.html l�dt
? index-simple.html l�dt
? index-guided.html l�dt
? test.html l�dt
? Konjugator funktioniert
? SRS funktioniert
? Vokabeln laden
```

### **Git Commit**:
```bash
git add .
git commit -m "Archivierung: Entwicklungs-Dateien in archive/ verschoben"
git push
```

---

## ?? STATISTIK

### **Dateien**:
```
Vorher: ~200 Dateien
Nachher: ~40 aktive + ~160 archiviert
Reduktion: 80% weniger aktive Dateien
```

### **Ordner**:
```
Vorher: Gemischt (alles durcheinander)
Nachher: Klar strukturiert
  - Aktive Dateien im Root
  - Archiv in archive/
```

---

## ?? EMPFEHLUNG

### **Wann archivieren?**
- ? **Jetzt**: Projekt aufr�umen
- ? **Nach Major-�nderungen**: Alte Versionen archivieren
- ? **Vor Deployment**: Production-ready machen

### **Wann NICHT archivieren?**
- ? **Mitten in Entwicklung**: Warten bis Features fertig sind
- ? **Ohne Backup**: Immer erst Git commit
- ? **Ohne Tests**: Immer erst testen

---

**STATUS**: ? **SCRIPT BEREIT**  
**NEXT**: Dry Run ? Live Run ? Test ? Commit

Das Archivierungs-System ist einsatzbereit! ???
