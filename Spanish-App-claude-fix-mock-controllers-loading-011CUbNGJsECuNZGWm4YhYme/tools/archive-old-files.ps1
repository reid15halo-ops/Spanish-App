# ============================================================================
# Archivierungs-Script für Spanish Learning App
# ============================================================================
# Verschiebt nicht mehr benötigte Dateien in archive/-Ordner
#
# Usage:
#   .\tools\archive-old-files.ps1
#   .\tools\archive-old-files.ps1 -DryRun
#   .\tools\archive-old-files.ps1 -Verbose
# ============================================================================

param(
    [switch]$DryRun = $false,
    [switch]$Verbose = $false
)

# Change to project root
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host "???????????????????????????????????????????????????????????????" -ForegroundColor Cyan
Write-Host "  Spanish Learning App - Archivierungs-Script" -ForegroundColor Cyan
Write-Host "???????????????????????????????????????????????????????????????" -ForegroundColor Cyan
Write-Host ""
Write-Host "Root: $((Get-Location).Path)" -ForegroundColor Gray

if ($DryRun) {
    Write-Host "Mode: DRY RUN (keine Änderungen)" -ForegroundColor Yellow
} else {
    Write-Host "Mode: LIVE (Dateien werden verschoben)" -ForegroundColor Green
}

Write-Host ""

# Counters
$moved = 0
$skipped = 0
$errors = 0

# Helper function to move files
function Move-ToArchive {
    param(
        [string]$Source,
        [string]$DestinationFolder
    )
    
    if (-not (Test-Path $Source)) {
        if ($Verbose) {
            Write-Host "  ? Nicht gefunden: $Source" -ForegroundColor Gray
        }
        $script:skipped++
        return
    }
    
    try {
        $fileName = Split-Path -Leaf $Source
        $destination = Join-Path $DestinationFolder $fileName
        
        # Create destination folder if needed
        if (-not (Test-Path $DestinationFolder)) {
            if (-not $DryRun) {
                New-Item -ItemType Directory -Path $DestinationFolder -Force | Out-Null
            }
            if ($Verbose) {
                Write-Host "  ?? Erstelle: $DestinationFolder" -ForegroundColor Blue
            }
        }
        
        # Move file
        if ($DryRun) {
            Write-Host "  [DRY] $Source ? $destination" -ForegroundColor Yellow
        } else {
            Move-Item -Path $Source -Destination $destination -Force
            Write-Host "  ? $fileName" -ForegroundColor Green
        }
        
        $script:moved++
        
    } catch {
        Write-Host "  ? Error: $Source - $($_.Exception.Message)" -ForegroundColor Red
        $script:errors++
    }
}

# ============================================================================
# ARCHIVIERUNG STARTEN
# ============================================================================

Write-Host "Erstelle Archiv-Struktur..." -ForegroundColor Cyan
Write-Host ""

# Create archive folders
$archiveFolders = @(
    "archive/dev/html",
    "archive/dev/js",
    "archive/dev/css",
    "archive/dev/utils",
    "archive/tests",
    "archive/tools",
    "archive/launchers",
    "archive/docs/dev",
    "archive/docs/patches",
    "archive/data"
)

foreach ($folder in $archiveFolders) {
    if (-not (Test-Path $folder)) {
        if (-not $DryRun) {
            New-Item -ItemType Directory -Path $folder -Force | Out-Null
        }
        if ($Verbose) {
            Write-Host "?? Erstelle: $folder" -ForegroundColor Blue
        }
    }
}

Write-Host ""

# ============================================================================
# 1. HTML-Dateien (Entwicklung)
# ============================================================================

Write-Host "1. Entwicklungs-HTML..." -ForegroundColor Cyan

$htmlFiles = @(
    "zeiten-workbench.html",
    "zeiten-quick-start.html",
    "zeiten-uebungen.html",
    "zeiten-validator.html",
    "explain-test.html",
    "sentence-analyzer-test.html",
    "verb-pack-test.html",
    "periphrastic-test.html",
    "periphrastic-final-validation.html",
    "timeline-view.html",
    "timeline-view-test.html",
    "diagnostic-test.html",
    "csv-import-export.html",
    "a11y-perf-test.html",
    "qa-automated.html"
)

foreach ($file in $htmlFiles) {
    Move-ToArchive -Source $file -DestinationFolder "archive/dev/html"
}

Write-Host ""

# ============================================================================
# 2. JavaScript-Dateien (Entwicklung)
# ============================================================================

Write-Host "2. Entwicklungs-JavaScript..." -ForegroundColor Cyan

$jsFiles = @(
    "js/zeiten-data.js",
    "js/zeiten-workbench.js",
    "js/zeiten-validation.js",
    "js/zeiten-exercises.js",
    "js/zeiten-exercise-validator.js",
    "js/explain.js",
    "js/explain-ui.js",
    "js/explain-tester.js",
    "js/sentence-analyzer.js",
    "js/sentence-analyzer-tester.js",
    "js/verb-pack-system.js",
    "js/verb-pack-tester.js",
    "js/periphrastic-system.js",
    "js/periphrastic-tester.js",
    "js/periphrastic-final-validation.js",
    "js/timeline-view.js",
    "js/timeline-view-tester.js",
    "js/diagnostic-test.js",
    "js/csv-importer.js",
    "js/qa-automated.js"
)

foreach ($file in $jsFiles) {
    Move-ToArchive -Source $file -DestinationFolder "archive/dev/js"
}

Write-Host ""

# ============================================================================
# 3. CSS-Dateien (Entwicklung)
# ============================================================================

Write-Host "3. Entwicklungs-CSS..." -ForegroundColor Cyan

Move-ToArchive -Source "css/zeiten-workbench.css" -DestinationFolder "archive/dev/css"

Write-Host ""

# ============================================================================
# 4. Utils (Entwicklung)
# ============================================================================

Write-Host "4. Entwicklungs-Utils..." -ForegroundColor Cyan

$utilFiles = @(
    "js/utils/validate-conjugator-nodejs.js",
    "js/utils/verb-build-reporter.js",
    "js/utils/final-verification.js",
    "js/utils/migrate-nodejs.js",
    "js/utils/migrator.js",
    "js/utils/a11y-perf-hardening.js",
    "js/utils/performance.js"
)

foreach ($file in $utilFiles) {
    Move-ToArchive -Source $file -DestinationFolder "archive/dev/utils"
}

Write-Host ""

# ============================================================================
# 5. Test-Dateien
# ============================================================================

Write-Host "5. Test-Dateien..." -ForegroundColor Cyan

$testFiles = @(
    "test/nogame-db-spec.js",
    "test/nogame-dom-spec.js",
    "test/noumlaut-data-spec.js",
    "test-periphrastic.js"
)

foreach ($file in $testFiles) {
    Move-ToArchive -Source $file -DestinationFolder "archive/tests"
}

Write-Host ""

# ============================================================================
# 6. Alte Tools
# ============================================================================

Write-Host "6. Alte Tools..." -ForegroundColor Cyan

$toolFiles = @(
    "js/no-gamification.lint.js",
    "tools/nogame-lint.js",
    "tools/noumlaut-lint.js",
    "tools/build.js",
    "tools/optimize.js",
    "tools/production-build.js",
    "tools/smart-optimize.js"
)

foreach ($file in $toolFiles) {
    Move-ToArchive -Source $file -DestinationFolder "archive/tools"
}

Write-Host ""

# ============================================================================
# 7. Alte Launcher
# ============================================================================

Write-Host "7. Alte Launcher..." -ForegroundColor Cyan

$launcherFiles = @(
    "launch.bat",
    "launch.ps1",
    "create-shortcut.bat",
    "launch-simple.bat"
)

foreach ($file in $launcherFiles) {
    Move-ToArchive -Source $file -DestinationFolder "archive/launchers"
}

Write-Host ""

# ============================================================================
# 8. Entwicklungs-Dokumentation
# ============================================================================

Write-Host "8. Entwicklungs-Dokumentation..." -ForegroundColor Cyan

$devDocs = @(
    "KONJUGATOR-SYSTEM-COMPLETE.md",
    "ASCII-REFACTORING-COMPLETE.md",
    "NO-GAMIFICATION-SYSTEM-REPORT.md",
    "FEHLERKORREKTUR.md",
    "RESUMEN-ESPAÑOL.md",
    "DUOLINGO-MVP-README.md",
    "ABSCHLUSS-BERICHT.md",
    "DEBUG-BUILD-COMPLETE.md",
    "ZEITEN-WORKBENCH-README.md",
    "ZEITEN-WORKBENCH-ABSCHLUSS.md",
    "ZEITEN-UEBUNGEN-README.md",
    "ZEITEN-UEBUNGEN-ABSCHLUSS.md",
    "FEHLERERKLAER-SYSTEM-README.md",
    "FEHLERERKLAER-SYSTEM-ABSCHLUSS.md",
    "SATZANALYSE-SYSTEM-README.md",
    "SATZANALYSE-SYSTEM-ABSCHLUSS.md",
    "VERB-PACK-SYSTEM-README.md",
    "VERB-PACK-SYSTEM-ABSCHLUSS.md",
    "PERIPHRASTIC-SYSTEM-README.md",
    "PERIPHRASTIC-SYSTEM-ABSCHLUSS.md",
    "PERIPHRASTIC-STATUS-FINAL.md",
    "PERIPHRASTIC-FINAL-OVERVIEW.md",
    "TIMELINE-VIEW-README.md",
    "TIMELINE-VIEW-COMPLETE.md",
    "DIAGNOSTIC-TEST-README.md",
    "DIAGNOSTIC-TEST-COMPLETE.md",
    "CSV-IMPORT-EXPORT-README.md",
    "CSV-IMPORT-EXPORT-COMPLETE.md",
    "APP-VERSION-0.0-STATUS-REPORT.md",
    "A11Y-PERF-HARDENING-REPORT.md",
    "GUARDRAILS-SYSTEM-COMPLETE.md",
    "GUARDRAILS-QUICK-START.md",
    "QA-AUTOMATED-SYSTEM-COMPLETE.md",
    "QA-QUICK-START.md",
    "DEPLOYMENT-PACKAGE-v0.0-COMPLETE.md",
    "DEPLOYMENT-VERIFICATION-v0.0.md",
    "RELEASE_NOTES_v0.0.md",
    "LAUNCHER-WINDOWS-README.md",
    "LAUNCHER-WINDOWS-COMPLETE.md",
    "OPTIMIZATION-GUIDE.md",
    "OPTIMIZATION-COMPLETE.md",
    "BUILD-FINAL-PACKAGE.md",
    "PROJEKT-ABSCHLUSS-v0.0.md",
    "LAUNCHER-TROUBLESHOOTING.md",
    "SIMPLIFICATION-COMPLETE.md",
    "APP-SIMPLIFIED-FINAL.md",
    "BUGFIX-SIMPLE-APP.md",
    "GUIDED-VERSION-COMPLETE.md",
    "GUIDED-VERSION-FINAL.md",
    "CSS-SIMPLIFIED-COMPLETE.md"
)

foreach ($file in $devDocs) {
    Move-ToArchive -Source $file -DestinationFolder "archive/docs/dev"
}

Write-Host ""

# ============================================================================
# 9. Patch-Dokumentation
# ============================================================================

Write-Host "9. Patch-Dokumentation..." -ForegroundColor Cyan

$patchDocs = @(
    "UTILITY-FUNCTIONS-PATCH.md",
    "DATA-LOADING-SYSTEM.md",
    "MULTIPLE-CHOICE-SYSTEM.md",
    "SPANISH-ACCENT-RENDERING.md",
    "ROUTER-NAVIGATION-SYSTEM.md",
    "UTF8-CONVERTER-README.md"
)

foreach ($file in $patchDocs) {
    Move-ToArchive -Source $file -DestinationFolder "archive/docs/patches"
}

Write-Host ""

# ============================================================================
# 10. Data Reports
# ============================================================================

Write-Host "10. Data Reports..." -ForegroundColor Cyan

$dataFiles = @(
    "data/a11y-report.json",
    "data/perf-report.json"
)

foreach ($file in $dataFiles) {
    Move-ToArchive -Source $file -DestinationFolder "archive/data"
}

Write-Host ""

# ============================================================================
# ZUSAMMENFASSUNG
# ============================================================================

Write-Host "???????????????????????????????????????????????????????????????" -ForegroundColor Cyan
Write-Host "  ZUSAMMENFASSUNG" -ForegroundColor Cyan
Write-Host "???????????????????????????????????????????????????????????????" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "DRY RUN - Keine Dateien wurden verschoben" -ForegroundColor Yellow
} else {
    Write-Host "Archivierung abgeschlossen!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Verschoben: $moved" -ForegroundColor Green
Write-Host "Übersprungen: $skipped" -ForegroundColor Yellow

if ($errors -gt 0) {
    Write-Host "Fehler: $errors" -ForegroundColor Red
}

Write-Host ""
Write-Host "Archiv-Ordner:" -ForegroundColor Cyan
Write-Host "  archive/dev/html     - Entwicklungs-HTML" -ForegroundColor Gray
Write-Host "  archive/dev/js       - Entwicklungs-JavaScript" -ForegroundColor Gray
Write-Host "  archive/dev/css      - Entwicklungs-CSS" -ForegroundColor Gray
Write-Host "  archive/dev/utils    - Entwicklungs-Utils" -ForegroundColor Gray
Write-Host "  archive/tests        - Test-Dateien" -ForegroundColor Gray
Write-Host "  archive/tools        - Alte Tools" -ForegroundColor Gray
Write-Host "  archive/launchers    - Alte Launcher" -ForegroundColor Gray
Write-Host "  archive/docs/dev     - Entwicklungs-Doku" -ForegroundColor Gray
Write-Host "  archive/docs/patches - Patch-Doku" -ForegroundColor Gray
Write-Host "  archive/data         - Reports" -ForegroundColor Gray

Write-Host ""

if (-not $DryRun) {
    Write-Host "WICHTIG:" -ForegroundColor Yellow
    Write-Host "  1. Teste die App: start.bat" -ForegroundColor White
    Write-Host "  2. Prüfe index.html, index-simple.html, index-guided.html" -ForegroundColor White
    Write-Host "  3. Committe die Änderungen: git add . && git commit" -ForegroundColor White
}

Write-Host ""
Write-Host "???????????????????????????????????????????????????????????????" -ForegroundColor Cyan

# Exit with appropriate code
if ($errors -gt 0) {
    exit 1
} else {
    exit 0
}
