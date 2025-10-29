# ============================================================================
# GitHub Upload Script - Spanish Learning App
# Strukturierter Upload aller Updates mit Archivierung
# ============================================================================

param(
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Spanish Learning App - GitHub Upload" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "MODE: DRY RUN (keine Änderungen)" -ForegroundColor Yellow
} else {
    Write-Host "MODE: LIVE (Änderungen werden committet)" -ForegroundColor Green
}

Write-Host ""

# ============================================================================
# 1. Status prüfen
# ============================================================================

Write-Host "1. Git Status prüfen..." -ForegroundColor Cyan
git status --short

Write-Host ""
Write-Host "Möchtest du fortfahren? (J/N): " -ForegroundColor Yellow -NoNewline
if (-not $DryRun) {
    $confirm = Read-Host
    if ($confirm -ne "J" -and $confirm -ne "j") {
        Write-Host "Abgebrochen." -ForegroundColor Red
        exit 0
    }
}

# ============================================================================
# 2. Archiv-Ordner erstellen (falls nicht vorhanden)
# ============================================================================

Write-Host ""
Write-Host "2. Archiv-Ordner vorbereiten..." -ForegroundColor Cyan

if (-not (Test-Path "archive")) {
    if (-not $DryRun) {
        New-Item -ItemType Directory -Path "archive" -Force | Out-Null
        Write-Host "   Archiv-Ordner erstellt" -ForegroundColor Green
    } else {
        Write-Host "   [DRY] Würde Archiv-Ordner erstellen" -ForegroundColor Yellow
    }
}

# ============================================================================
# 3. Staging - Alle neuen Dateien
# ============================================================================

Write-Host ""
Write-Host "3. Neue Dateien hinzufügen..." -ForegroundColor Cyan

if (-not $DryRun) {
    # Core files
    git add index.html index-simple.html index-guided.html index-modern.html
    git add test.html test-app.html
    
    # Scripts
    git add js/*.js
    git add js/utils/*.js
    
    # Styles
    git add css/*.css
    
    # Data
    git add data/*.json data/*.csv
    
    # Launchers
    git add *.bat
    
    # Documentation
    git add *.md
    
    # Tools
    git add tools/*.ps1 tools/*.js
    
    # Manifest & Service Worker
    git add manifest.webmanifest sw.js
    
    # Package
    git add package.json
    
    # Tests
    git add test/*.js
    
    # .gitignore
    git add .gitignore
    
    Write-Host "   Dateien staged" -ForegroundColor Green
} else {
    Write-Host "   [DRY] Würde Dateien stagen" -ForegroundColor Yellow
}

# ============================================================================
# 4. Gelöschte Dateien entfernen
# ============================================================================

Write-Host ""
Write-Host "4. Gelöschte Dateien aus Git entfernen..." -ForegroundColor Cyan

$deletedFiles = @(
    "DEBUG-BUILD-COMPLETE.md",
    "FEHLERKORREKTUR.md",
    "QUICK-START.md",
    "RESUMEN-ESPAÑOL.md",
    "data/perf-report.json",
    "editor.html",
    "js/editor.js"
)

foreach ($file in $deletedFiles) {
    if (-not $DryRun) {
        if (Test-Path $file) {
            git rm $file 2>$null
        } else {
            git rm --cached $file 2>$null
        }
    } else {
        Write-Host "   [DRY] Würde entfernen: $file" -ForegroundColor Yellow
    }
}

Write-Host "   Gelöschte Dateien behandelt" -ForegroundColor Green

# ============================================================================
# 5. Commit erstellen
# ============================================================================

Write-Host ""
Write-Host "5. Commit erstellen..." -ForegroundColor Cyan

$commitMessage = @"
?? Major Update: Moderne UI + Archivierung + Vereinfachung

## ? Neue Features:
- **Modern UI** (index-modern.html) - Komplett neues Design
- **Vereinfachte Versionen** (index-simple.html, index-guided.html)
- **Intelligente Launcher** (start.bat mit Menü-System)
- **Vollständige Tests** (test-app.html)

## ?? UI/UX Verbesserungen:
- Material Design System
- Dashboard mit Statistiken
- Responsive Navigation
- Smooth Animations
- Card-Based Layout

## ?? Technische Updates:
- app.js: Verbesserte SpanishApp Class
- Konjugator-System integriert
- SRS-System optimiert
- ASCII-Normalisierung für Deutsche Umlaute
- Fuzzy Matching für Spanisch

## ?? Launcher-System:
- start.bat: Universal Launcher mit Menü
- start-modern.bat: Quick Start für Modern UI
- Alte Launcher dokumentiert (zur Archivierung vorgesehen)

## ?? Dokumentation:
- LAUNCHER-NEU-README.md: Vollständige Anleitung
- SCHNELLSTART-NEU.md: Quick Start Guide
- ARCHIVIERUNG-*.md: Archivierungs-Plan
- Viele weitere README-Dateien

## ??? Projekt-Struktur:
- Klare Trennung: Aktiv vs. Archiv
- Vorbereitet für Archivierung alter Dateien
- Bessere Organisation

## ?? Build & Tools:
- tools/build.ps1: Build-System
- tools/convert-utf8.ps1: UTF-8 Konvertierung
- tools/archive-old-files.ps1: Archivierungs-Script

## ?? Testing:
- test/app-spec.js: Unit Tests für app.js
- test-app.html: Test Runner UI
- Verbesserte Test-Abdeckung

## ?? PWA Support:
- manifest.webmanifest: PWA Manifest
- sw.js: Service Worker für Offline-Funktionalität

Version: 1.0.0-beta
"@

if (-not $DryRun) {
    git commit -m $commitMessage
    Write-Host "   Commit erstellt" -ForegroundColor Green
} else {
    Write-Host "   [DRY] Würde Commit erstellen mit Message:" -ForegroundColor Yellow
    Write-Host $commitMessage -ForegroundColor Gray
}

# ============================================================================
# 6. Push zu GitHub
# ============================================================================

Write-Host ""
Write-Host "6. Push zu GitHub..." -ForegroundColor Cyan

if (-not $DryRun) {
    Write-Host ""
    Write-Host "Möchtest du jetzt pushen? (J/N): " -ForegroundColor Yellow -NoNewline
    $confirmPush = Read-Host
    
    if ($confirmPush -eq "J" -or $confirmPush -eq "j") {
        git push origin master
        Write-Host "   Erfolgreich zu GitHub gepusht!" -ForegroundColor Green
    } else {
        Write-Host "   Push übersprungen. Du kannst später manuell pushen mit: git push origin master" -ForegroundColor Yellow
    }
} else {
    Write-Host "   [DRY] Würde pushen zu: origin master" -ForegroundColor Yellow
}

# ============================================================================
# 7. Zusammenfassung
# ============================================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  ZUSAMMENFASSUNG" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

if (-not $DryRun) {
    Write-Host "? Upload abgeschlossen!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Nächste Schritte:" -ForegroundColor Cyan
    Write-Host "1. Prüfe GitHub Repository: https://github.com/reid15halo-ops/Spanish-App" -ForegroundColor White
    Write-Host "2. Führe Archivierung aus: .\tools\archive-old-files.ps1" -ForegroundColor White
    Write-Host "3. Committe Archivierung: git add archive/ && git commit -m 'Archivierung alter Dateien'" -ForegroundColor White
    Write-Host "4. Push Archivierung: git push origin master" -ForegroundColor White
} else {
    Write-Host "DRY RUN abgeschlossen - keine Änderungen vorgenommen" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Führe aus ohne -DryRun um tatsächlich zu committen:" -ForegroundColor Cyan
    Write-Host ".\tools\github-upload.ps1" -ForegroundColor White
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
