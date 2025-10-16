@echo off
setlocal enabledelayedexpansion
REM ============================================================================
REM Spanish Learning App - Modern UI Quick Start
REM Startet direkt die neue moderne Version
REM ============================================================================

title Spanish Learning App - Modern

cls
echo.
echo ============================================================
echo     SPANISH LEARNING APP - MODERN UI
echo ============================================================
echo.
echo   Starte moderne Version...
echo.

REM Check if file exists
if not exist "index-modern.html" (
    echo   FEHLER: index-modern.html nicht gefunden!
    echo.
    echo   Bitte stelle sicher, dass die Datei existiert.
    echo.
    pause
    exit /b 1
)

echo   Datei gefunden: index-modern.html
echo   Oeffne im Browser...
echo.

REM Try Chrome first
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    echo   Browser: Google Chrome
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "index-modern.html"
    goto success
)

if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    echo   Browser: Google Chrome
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "index-modern.html"
    goto success
)

REM Try Edge
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    echo   Browser: Microsoft Edge
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" "index-modern.html"
    goto success
)

if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    echo   Browser: Microsoft Edge
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" "index-modern.html"
    goto success
)

REM Fallback to default browser
echo   Browser: Standard-Browser
start "" "index-modern.html"

:success
echo.
echo ============================================================
echo   Modern UI gestartet!
echo   Viel Spass mit dem neuen Interface! :)
echo ============================================================
echo.
timeout /t 2 >nul
endlocal
exit /b 0
