# ?? GITHUB UPLOAD - ANLEITUNG

## ?? Übersicht

Dieses Dokument erklärt, wie du das komplette Spanish Learning App Projekt auf GitHub hochlädst und archivierst.

---

## ?? SCHNELLSTART

### **Option 1: Automatisches Script** (EMPFOHLEN)
```powershell
# Test (Dry Run)
.\tools\github-upload.ps1 -DryRun

# Live Upload
.\tools\github-upload.ps1
```

### **Option 2: Manuell**
```bash
# Alle Dateien hinzufügen
git add .

# Commit erstellen
git commit -m "Major Update: Modern UI + Archivierung"

# Push zu GitHub
git push origin master
```

---

## ?? WAS WIRD HOCHGELADEN?

### **Neue Dateien** ?
```
? index-modern.html          - Neues modernes UI
? index-simple.html          - Vereinfachte Version
? index-guided.html          - Geführte Version
? start.bat                  - Neuer Universal Launcher
? start-modern.bat           - Quick Start Modern UI
? test-app.html              - Test Suite UI
? js/app.js                  - Überarbeitete Haupt-App
? tools/*.ps1                - Build & Upload Scripts
? test/app-spec.js           - Unit Tests
? Viele neue README-Dateien
```

### **Aktualisierte Dateien** ??
```
?? index.html                 - Haupt-HTML
?? css/style.css              - Styles
?? js/srs.js                  - SRS System
?? manifest.webmanifest       - PWA Manifest
?? sw.js                      - Service Worker
?? .gitignore                 - Git Ignore Rules
```

### **Gelöschte Dateien** ?
```
? DEBUG-BUILD-COMPLETE.md
? FEHLERKORREKTUR.md
? QUICK-START.md
? RESUMEN-ESPAÑOL.md
? editor.html
? js/editor.js
? data/perf-report.json
```

### **Zur Archivierung vorgesehen** ??
```
?? Alte Launcher (launch.bat, launch-simple.bat, etc.)
?? Entwicklungs-HTML (zeiten-*.html, etc.)
?? Entwicklungs-JS (zeiten-*.js, explain-*.js, etc.)
?? Alte Dokumentation (viele *-COMPLETE.md Dateien)
```

---

## ?? UPLOAD-PROZESS

### **Phase 1: Vorbereitung**
```powershell
# 1. Git Status prüfen
git status

# 2. Dry Run ausführen
.\tools\github-upload.ps1 -DryRun

# 3. Prüfen was hochgeladen wird
```

### **Phase 2: Upload**
```powershell
# 1. Live Upload
.\tools\github-upload.ps1

# 2. Bestätigen (J)
# 3. Push bestätigen (J)

# Oder manuell:
git add .
git commit -m "Major Update"
git push origin master
```

### **Phase 3: Archivierung**
```powershell
# 1. Alte Dateien archivieren
.\tools\archive-old-files.ps1

# 2. Archiv committen
git add archive/
git commit -m "Archivierung alter Dateien"

# 3. Push
git push origin master
```

---

## ?? COMMIT-MESSAGE

Das Script erstellt automatisch eine ausführliche Commit-Message:

```
?? Major Update: Moderne UI + Archivierung + Vereinfachung

## ? Neue Features:
- Modern UI (index-modern.html)
- Vereinfachte Versionen
- Intelligente Launcher
- Vollständige Tests

## ?? UI/UX Verbesserungen:
- Material Design System
- Dashboard mit Statistiken
- Responsive Navigation
...
```

Oder erstelle deine eigene:
```bash
git commit -m "Deine Message hier"
```

---

## ??? PROJEKTSTRUKTUR AUF GITHUB

### **Nach Upload**:
```
Spanish-App/
??? index.html              ? Hauptversion
??? index-modern.html       ? Modern UI (NEU)
??? index-simple.html       ? Simple (NEU)
??? index-guided.html       ? Guided (NEU)
??? start.bat               ? Universal Launcher
??? start-modern.bat        ? Quick Start (NEU)
??? test.html               ? Tests
??? test-app.html           ? Test UI (NEU)
?
??? js/
?   ??? app.js              ? Überarbeitet
?   ??? srs.js              ? Aktualisiert
?   ??? conjugator.js       ? Neu
?   ??? ...
?
??? css/
?   ??? style.css           ? Aktualisiert
?   ??? style-simplified.css ? Neu
?
??? data/
?   ??? verbs.json          ? Verben
?   ??? items.json          ? Vokabeln
?   ??? ...
?
??? tools/
?   ??? build.ps1           ? Build
?   ??? github-upload.ps1   ? Upload (NEU)
?   ??? archive-old-files.ps1 ? Archiv (NEU)
?   ??? ...
?
??? test/
?   ??? app-spec.js         ? Tests (NEU)
?
??? README.md               ? Projekt-README
??? package.json            ? NPM Package
??? manifest.webmanifest    ? PWA Manifest
??? sw.js                   ? Service Worker
```

### **Nach Archivierung** (später):
```
Spanish-App/
??? ... (aktive Dateien wie oben)
?
??? archive/                ? ARCHIV (NEU)
    ??? dev/               ? Entwicklung
    ??? tests/             ? Alte Tests
    ??? tools/             ? Alte Tools
    ??? launchers/         ? Alte Launcher
    ??? docs/              ? Alte Docs
```

---

## ?? WICHTIGE HINWEISE

### **Vor Upload**:
```
? Git Status prüfen
? Dry Run ausführen
? App lokal testen
? README aktualisieren
```

### **Nach Upload**:
```
? GitHub Repository prüfen
? README auf GitHub prüfen
? Archivierung durchführen
? Tags erstellen (optional)
```

### **Nicht hochladen**:
```
? node_modules/
? dist/ (wird neu gebaut)
? *.log Dateien
? *_backup.* Dateien
? Temporäre Dateien
```

---

## ?? GITHUB AUTHENTIFIZIERUNG

### **Falls Authentifizierung fehlschlägt**:

```bash
# Option 1: HTTPS mit Personal Access Token
git remote set-url origin https://github.com/reid15halo-ops/Spanish-App.git

# Token generieren:
# GitHub ? Settings ? Developer settings ? Personal access tokens
# Scopes: repo (full control)

# Option 2: SSH
git remote set-url origin git@github.com:reid15halo-ops/Spanish-App.git

# SSH Key einrichten:
ssh-keygen -t ed25519 -C "your_email@example.com"
# Key zu GitHub hinzufügen: Settings ? SSH and GPG keys
```

---

## ??? TAGS & RELEASES (Optional)

### **Version-Tag erstellen**:
```bash
# Tag erstellen
git tag -a v1.0.0-beta -m "Version 1.0.0 Beta - Modern UI Release"

# Tag pushen
git push origin v1.0.0-beta

# Alle Tags pushen
git push origin --tags
```

### **Release auf GitHub erstellen**:
```
1. Gehe zu: https://github.com/reid15halo-ops/Spanish-App/releases
2. Klicke "Create a new release"
3. Wähle Tag: v1.0.0-beta
4. Title: "Version 1.0.0 Beta - Modern UI"
5. Description: Siehe RELEASE_NOTES_v0.0.md
6. Upload Assets (optional): dist.zip
7. "Publish release"
```

---

## ?? TROUBLESHOOTING

### **Problem: "failed to push"**
```bash
# Lösung 1: Pull zuerst
git pull origin master
git push origin master

# Lösung 2: Force Push (VORSICHT!)
git push origin master --force
```

### **Problem: "merge conflicts"**
```bash
# Lösung: Konflikte manuell lösen
git pull origin master
# Konflikte in Dateien lösen
git add .
git commit -m "Merge conflicts resolved"
git push origin master
```

### **Problem: "large files"**
```bash
# Lösung: Git LFS verwenden
git lfs install
git lfs track "*.zip"
git lfs track "*.pdf"
git add .gitattributes
git commit -m "Add Git LFS"
```

### **Problem: "permission denied"**
```bash
# Lösung: Authentifizierung prüfen
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"

# Token/SSH Key neu einrichten
```

---

## ?? CHECKLISTE

### **Vor Upload**:
```
? Git Status clean (alle Änderungen committed)
? App lokal getestet
? README aktualisiert
? Dry Run ausgeführt
? Commit Message vorbereitet
```

### **Nach Upload**:
```
? GitHub Repository aktualisiert
? README auf GitHub korrekt
? Alle Dateien vorhanden
? Links funktionieren
? Issues/PRs geprüft
```

---

## ?? LINKS

```
Repository: https://github.com/reid15halo-ops/Spanish-App
Issues: https://github.com/reid15halo-ops/Spanish-App/issues
Wiki: https://github.com/reid15halo-ops/Spanish-App/wiki
```

---

## ? FAZIT

### **Automatischer Upload**:
```powershell
# Einfach und sicher
.\tools\github-upload.ps1
```

### **Manueller Upload**:
```bash
git add .
git commit -m "Update"
git push origin master
```

### **Archivierung** (später):
```powershell
.\tools\archive-old-files.ps1
git add archive/
git commit -m "Archivierung"
git push origin master
```

---

**STATUS**: ? **UPLOAD-PROZESS DOKUMENTIERT**  
**SCRIPT**: tools/github-upload.ps1  
**READY**: Zum Upload bereit!

Führe aus: `.\tools\github-upload.ps1` ???
