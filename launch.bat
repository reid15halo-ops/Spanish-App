@echo off
setlocal enabledelayedexpansion
REM Spanish Learning App Launcher
REM Version 0.0 - Windows Browser Launcher

title Spanish Learning App Launcher

echo.
echo ================================================
echo   Spanish Learning App - Browser Launcher
echo   Version 0.0
echo ================================================
echo.

REM Check if app files exist
if not exist "index.html" (
    echo ERROR: index.html not found!
    echo Please run this launcher from the app directory.
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo [1/3] Checking for browsers...
echo.

REM Try to find installed browsers
set BROWSER_FOUND=0
set CHROME_PATH=
set EDGE_PATH=
set FIREFOX_PATH=

REM Check for Chrome
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
    set BROWSER_FOUND=1
    echo   [OK] Google Chrome found
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
    set BROWSER_FOUND=1
    echo   [OK] Google Chrome found
)

REM Check for Edge
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    set "EDGE_PATH=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
    set BROWSER_FOUND=1
    echo   [OK] Microsoft Edge found
)
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    set "EDGE_PATH=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
    set BROWSER_FOUND=1
    echo   [OK] Microsoft Edge found
)

REM Check for Firefox
if exist "%ProgramFiles%\Mozilla Firefox\firefox.exe" (
    set "FIREFOX_PATH=%ProgramFiles%\Mozilla Firefox\firefox.exe"
    set BROWSER_FOUND=1
    echo   [OK] Mozilla Firefox found
)
if exist "%ProgramFiles(x86)%\Mozilla Firefox\firefox.exe" (
    set "FIREFOX_PATH=%ProgramFiles(x86)%\Mozilla Firefox\firefox.exe"
    set BROWSER_FOUND=1
    echo   [OK] Mozilla Firefox found
)

if %BROWSER_FOUND%==0 (
    echo   [!] No supported browser found
    echo   Opening with default browser...
    start "" "index.html"
    goto :end
)

echo.
echo [2/3] Select your browser:
echo.

REM Only show options for found browsers
if defined CHROME_PATH echo   1^) Google Chrome ^(recommended^)
if defined EDGE_PATH echo   2^) Microsoft Edge
if defined FIREFOX_PATH echo   3^) Mozilla Firefox
echo   4^) Default Browser
echo   5^) Start local server ^(Python^)
echo   0^) Exit
echo.
set /p CHOICE="Enter your choice: "

echo.
echo [3/3] Starting app...
echo.

if "%CHOICE%"=="1" (
    if defined CHROME_PATH (
        echo Starting Chrome...
        set "APP_PATH=%CD%\index.html"
        start "" "!CHROME_PATH!" --new-window "!APP_PATH!"
    ) else (
        echo Chrome not found. Using default browser.
        start "" "index.html"
    )
    goto :end
)

if "%CHOICE%"=="2" (
    if defined EDGE_PATH (
        echo Starting Edge...
        set "APP_PATH=%CD%\index.html"
        start "" "!EDGE_PATH!" --new-window "!APP_PATH!"
    ) else (
        echo Edge not found. Using default browser.
        start "" "index.html"
    )
    goto :end
)

if "%CHOICE%"=="3" (
    if defined FIREFOX_PATH (
        echo Starting Firefox...
        set "APP_PATH=%CD%\index.html"
        start "" "!FIREFOX_PATH!" -new-window "!APP_PATH!"
    ) else (
        echo Firefox not found. Using default browser.
        start "" "index.html"
    )
    goto :end
)

if "%CHOICE%"=="4" (
    echo Starting with default browser...
    start "" "index.html"
    goto :end
)

if "%CHOICE%"=="5" (
    echo Starting local server...
    echo.
    echo Checking for Python...
    
    REM Check for Python 3
    python --version >nul 2>&1
    if !errorlevel!==0 (
        echo Python 3 found. Starting server on port 8000...
        echo.
        echo ================================================
        echo   Server URL: http://localhost:8000
        echo   Press Ctrl+C to stop server
        echo ================================================
        echo.
        
        REM Open browser after 2 seconds
        start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:8000"
        
        REM Start Python server
        python -m http.server 8000
        goto :end
    ) else (
        echo Python not found. Please install Python 3.
        echo Or choose another browser option.
        pause
        goto :end
    )
)

if "%CHOICE%"=="0" (
    echo Exiting...
    goto :end
)

echo Invalid choice. Opening with default browser...
start "" "index.html"

:end
echo.
echo ================================================
echo   App launched successfully!
echo   Enjoy learning Spanish! :)
echo ================================================
echo.
timeout /t 3 /nobreak >nul
endlocal
