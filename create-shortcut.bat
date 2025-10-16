@echo off
REM Desktop Shortcut Creator for Spanish Learning App

title Spanish Learning App - Shortcut Creator

echo.
echo ================================================
echo   Spanish Learning App - Shortcut Creator
echo ================================================
echo.

REM Check if running in app directory
if not exist "index.html" (
    echo ERROR: index.html not found!
    echo Please run this from the app directory.
    pause
    exit /b 1
)

echo Creating desktop shortcut...
echo.

REM Get current directory
set APP_DIR=%CD%
set SHORTCUT_NAME=Spanish Learning App.lnk

REM Create VBScript to make shortcut
set VBS_FILE=%TEMP%\create_shortcut.vbs
echo Set oWS = WScript.CreateObject("WScript.Shell") > %VBS_FILE%
echo sLinkFile = oWS.SpecialFolders("Desktop") ^& "\%SHORTCUT_NAME%" >> %VBS_FILE%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %VBS_FILE%
echo oLink.TargetPath = "%APP_DIR%\launch.bat" >> %VBS_FILE%
echo oLink.WorkingDirectory = "%APP_DIR%" >> %VBS_FILE%
echo oLink.Description = "Spanish Learning App - Vocabulary Trainer" >> %VBS_FILE%
echo oLink.IconLocation = "%APP_DIR%\icons\icon-512x512.png" >> %VBS_FILE%
echo oLink.Save >> %VBS_FILE%

REM Execute VBScript
cscript //nologo %VBS_FILE%

REM Clean up
del %VBS_FILE%

if %errorlevel%==0 (
    echo   [OK] Desktop shortcut created successfully!
    echo.
    echo Shortcut location: Desktop\%SHORTCUT_NAME%
    echo.
    echo You can now launch the app from your desktop!
) else (
    echo   [X] Failed to create shortcut
    echo.
    echo Please create a shortcut manually:
    echo   1. Right-click on launch.bat
    echo   2. Select "Create shortcut"
    echo   3. Move shortcut to Desktop
)

echo.
echo ================================================
echo   Setup complete!
echo ================================================
echo.
pause
