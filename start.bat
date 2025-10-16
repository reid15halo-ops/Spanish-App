@echo off
setlocal enabledelayedexpansion
REM ============================================================================
REM Spanish Learning App - Universal Launcher
REM Vereinfachter Launcher mit Menü-Auswahl
REM ============================================================================

title Spanish Learning App

:menu
cls
echo.
echo ============================================================
echo              SPANISH LEARNING APP - LAUNCHER
echo ============================================================
echo.
echo   Waehle deine Version:
echo.
echo   1. Modern UI        (NEU - Empfohlen!)
echo   2. Guided Version   (Gefuehrt, einfach)
echo   3. Simple Version   (Minimalistisch)
echo   4. Full Version     (Alle Features)
echo   5. Test Suite       (Entwickler)
echo.
echo   0. Beenden
echo.
echo ============================================================
echo.

set /p choice="Deine Wahl (1-5, 0=Exit): "

if "%choice%"=="1" goto modern
if "%choice%"=="2" goto guided
if "%choice%"=="3" goto simple
if "%choice%"=="4" goto full
if "%choice%"=="5" goto test
if "%choice%"=="0" goto end

echo.
echo   Ungueltige Eingabe! Bitte 0-5 waehlen.
timeout /t 2 >nul
goto menu

:modern
set "APP_FILE=index-modern.html"
set "APP_NAME=Modern UI"
goto launch

:guided
set "APP_FILE=index-guided.html"
set "APP_NAME=Guided Version"
goto launch

:simple
set "APP_FILE=index-simple.html"
set "APP_NAME=Simple Version"
goto launch

:full
set "APP_FILE=index.html"
set "APP_NAME=Full Version"
goto launch

:test
set "APP_FILE=test.html"
set "APP_NAME=Test Suite"
goto launch

:launch
cls
echo.
echo ============================================================
echo   Starte: %APP_NAME%
echo ============================================================
echo.

REM Check if file exists
if not exist "%APP_FILE%" (
    echo   FEHLER: %APP_FILE% nicht gefunden!
    echo.
    echo   Bitte stelle sicher, dass die Datei existiert.
    echo.
    pause
    goto menu
)

echo   Datei gefunden: %APP_FILE%
echo   Oeffne im Browser...
echo.

REM Try Chrome first
set "BROWSER_FOUND="

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    echo   Browser: Google Chrome
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%APP_FILE%"
    set "BROWSER_FOUND=1"
    goto success
)

if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    echo   Browser: Google Chrome
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "%APP_FILE%"
    set "BROWSER_FOUND=1"
    goto success
)

REM Try Edge
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    echo   Browser: Microsoft Edge
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" "%APP_FILE%"
    set "BROWSER_FOUND=1"
    goto success
)

if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    echo   Browser: Microsoft Edge
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" "%APP_FILE%"
    set "BROWSER_FOUND=1"
    goto success
)

REM Try Firefox
if exist "%ProgramFiles%\Mozilla Firefox\firefox.exe" (
    echo   Browser: Mozilla Firefox
    start "" "%ProgramFiles%\Mozilla Firefox\firefox.exe" "%APP_FILE%"
    set "BROWSER_FOUND=1"
    goto success
)

if exist "%ProgramFiles(x86)%\Mozilla Firefox\firefox.exe" (
    echo   Browser: Mozilla Firefox
    start "" "%ProgramFiles(x86)%\Mozilla Firefox\firefox.exe" "%APP_FILE%"
    set "BROWSER_FOUND=1"
    goto success
)

REM Fallback to default browser
echo   Browser: Standard-Browser
start "" "%APP_FILE%"
set "BROWSER_FOUND=1"

:success
if defined BROWSER_FOUND (
    echo.
    echo ============================================================
    echo   App gestartet!
    echo   Viel Erfolg beim Lernen! :)
    echo ============================================================
    echo.
    echo   Druecke eine Taste zum Beenden...
    pause >nul
) else (
    echo.
    echo   FEHLER: Kein Browser gefunden!
    echo.
    pause
    goto menu
)

goto end

:end
endlocal
exit /b 0
