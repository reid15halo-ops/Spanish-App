@echo off
REM Simple Launcher - Opens index.html directly

echo Starting Spanish Learning App...
echo.

if not exist "index.html" (
    echo ERROR: index.html not found!
    echo Current directory: %CD%
    pause
    exit /b 1
)

REM Just open with default browser
start "" "index.html"

echo App started in your default browser.
echo.
timeout /t 2 >nul
