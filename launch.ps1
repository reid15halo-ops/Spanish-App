# Spanish Learning App Launcher (PowerShell)
# Version 0.0 - Advanced Windows Launcher

param(
    [string]$Browser = "",
    [switch]$Server = $false,
    [int]$Port = 8000,
    [switch]$Debug = $false,
    [switch]$Help = $false
)

$AppVersion = "0.0"
$AppName = "Spanish Learning App"

# Color scheme
$ColorSuccess = "Green"
$ColorWarning = "Yellow"
$ColorError = "Red"
$ColorInfo = "Cyan"
$ColorTitle = "Magenta"

function Write-Banner {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor $ColorTitle
    Write-Host "  $AppName - Browser Launcher" -ForegroundColor $ColorTitle
    Write-Host "  Version $AppVersion" -ForegroundColor $ColorTitle
    Write-Host "================================================" -ForegroundColor $ColorTitle
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-Host "  [OK] $Message" -ForegroundColor $ColorSuccess
}

function Write-Warning {
    param([string]$Message)
    Write-Host "  [!] $Message" -ForegroundColor $ColorWarning
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "  [X] $Message" -ForegroundColor $ColorError
}

function Write-Info {
    param([string]$Message)
    Write-Host "  [i] $Message" -ForegroundColor $ColorInfo
}

function Show-Help {
    Write-Banner
    Write-Host "Usage: .\launch.ps1 [OPTIONS]" -ForegroundColor $ColorInfo
    Write-Host ""
    Write-Host "Options:" -ForegroundColor $ColorInfo
    Write-Host "  -Browser <name>    Launch with specific browser (chrome, edge, firefox)" -ForegroundColor Gray
    Write-Host "  -Server            Start local HTTP server (Python required)" -ForegroundColor Gray
    Write-Host "  -Port <number>     Server port (default: 8000)" -ForegroundColor Gray
    Write-Host "  -Debug             Enable debug mode" -ForegroundColor Gray
    Write-Host "  -Help              Show this help message" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor $ColorInfo
    Write-Host "  .\launch.ps1                    # Interactive mode" -ForegroundColor Gray
    Write-Host "  .\launch.ps1 -Browser chrome    # Launch in Chrome" -ForegroundColor Gray
    Write-Host "  .\launch.ps1 -Server            # Start local server" -ForegroundColor Gray
    Write-Host "  .\launch.ps1 -Server -Port 3000 # Server on port 3000" -ForegroundColor Gray
    Write-Host ""
    exit
}

function Test-AppFiles {
    if (-not (Test-Path "index.html")) {
        Write-Error-Custom "index.html not found!"
        Write-Warning "Please run this launcher from the app directory."
        exit 1
    }
    
    if (-not (Test-Path "manifest.webmanifest")) {
        Write-Warning "manifest.webmanifest not found (optional)"
    }
    
    if (-not (Test-Path "sw.js")) {
        Write-Warning "sw.js not found (offline mode unavailable)"
    }
    
    Write-Success "App files validated"
}

function Find-Browsers {
    $browsers = @{}
    
    # Chrome paths
    $chromePaths = @(
        "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe",
        "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
        "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
    )
    
    foreach ($path in $chromePaths) {
        if (Test-Path $path) {
            $browsers["chrome"] = $path
            Write-Success "Google Chrome found"
            break
        }
    }
    
    # Edge paths
    $edgePaths = @(
        "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
        "${env:ProgramFiles}\Microsoft\Edge\Application\msedge.exe"
    )
    
    foreach ($path in $edgePaths) {
        if (Test-Path $path) {
            $browsers["edge"] = $path
            Write-Success "Microsoft Edge found"
            break
        }
    }
    
    # Firefox paths
    $firefoxPaths = @(
        "${env:ProgramFiles}\Mozilla Firefox\firefox.exe",
        "${env:ProgramFiles(x86)}\Mozilla Firefox\firefox.exe"
    )
    
    foreach ($path in $firefoxPaths) {
        if (Test-Path $path) {
            $browsers["firefox"] = $path
            Write-Success "Mozilla Firefox found"
            break
        }
    }
    
    if ($browsers.Count -eq 0) {
        Write-Warning "No supported browsers found"
    }
    
    return $browsers
}

function Start-Browser {
    param(
        [string]$BrowserName,
        [hashtable]$Browsers
    )
    
    $appPath = (Get-Location).Path
    $fileUrl = "file:///$($appPath.Replace('\', '/'))/index.html"
    
    if ($Debug) {
        $fileUrl += "?debug=1"
    }
    
    switch ($BrowserName.ToLower()) {
        "chrome" {
            if ($Browsers.ContainsKey("chrome")) {
                Write-Info "Starting Chrome..."
                Start-Process $Browsers["chrome"] -ArgumentList "--new-window", "--app=$fileUrl"
                Write-Success "Chrome launched successfully!"
            } else {
                Write-Error-Custom "Chrome not found"
                return $false
            }
        }
        "edge" {
            if ($Browsers.ContainsKey("edge")) {
                Write-Info "Starting Edge..."
                Start-Process $Browsers["edge"] -ArgumentList "--new-window", "--app=$fileUrl"
                Write-Success "Edge launched successfully!"
            } else {
                Write-Error-Custom "Edge not found"
                return $false
            }
        }
        "firefox" {
            if ($Browsers.ContainsKey("firefox")) {
                Write-Info "Starting Firefox..."
                Start-Process $Browsers["firefox"] -ArgumentList "-new-window", $fileUrl
                Write-Success "Firefox launched successfully!"
            } else {
                Write-Error-Custom "Firefox not found"
                return $false
            }
        }
        "default" {
            Write-Info "Starting with default browser..."
            Start-Process "index.html"
            Write-Success "Default browser launched!"
        }
        default {
            Write-Error-Custom "Unknown browser: $BrowserName"
            return $false
        }
    }
    
    return $true
}

function Start-LocalServer {
    param([int]$ServerPort)
    
    Write-Info "Starting local HTTP server..."
    Write-Host ""
    
    # Check for Python
    $pythonCommand = $null
    
    try {
        $pythonVersion = python --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            $pythonCommand = "python"
            Write-Success "Python found: $pythonVersion"
        }
    } catch {
        try {
            $pythonVersion = python3 --version 2>&1
            if ($LASTEXITCODE -eq 0) {
                $pythonCommand = "python3"
                Write-Success "Python 3 found: $pythonVersion"
            }
        } catch {
            Write-Error-Custom "Python not found"
            Write-Warning "Please install Python 3 from python.org"
            return $false
        }
    }
    
    if (-not $pythonCommand) {
        return $false
    }
    
    Write-Host ""
    Write-Host "================================================" -ForegroundColor $ColorTitle
    Write-Host "  Server URL: http://localhost:$ServerPort" -ForegroundColor $ColorTitle
    Write-Host "  Press Ctrl+C to stop server" -ForegroundColor $ColorTitle
    Write-Host "================================================" -ForegroundColor $ColorTitle
    Write-Host ""
    
    # Open browser after 2 seconds
    Start-Job -ScriptBlock {
        param($Port, $Debug)
        Start-Sleep -Seconds 2
        
        $url = "http://localhost:$Port"
        if ($Debug) {
            $url += "?debug=1"
        }
        
        Start-Process $url
    } -ArgumentList $ServerPort, $Debug | Out-Null
    
    # Start server
    Write-Info "Server starting on port $ServerPort..."
    & $pythonCommand -m http.server $ServerPort
    
    return $true
}

function Show-InteractiveMenu {
    param([hashtable]$Browsers)
    
    Write-Host ""
    Write-Host "Select launch option:" -ForegroundColor $ColorInfo
    Write-Host ""
    
    $menuIndex = 1
    $menuOptions = @()
    
    if ($Browsers.ContainsKey("chrome")) {
        Write-Host "  $menuIndex) Google Chrome (recommended)" -ForegroundColor Gray
        $menuOptions += "chrome"
        $menuIndex++
    }
    
    if ($Browsers.ContainsKey("edge")) {
        Write-Host "  $menuIndex) Microsoft Edge" -ForegroundColor Gray
        $menuOptions += "edge"
        $menuIndex++
    }
    
    if ($Browsers.ContainsKey("firefox")) {
        Write-Host "  $menuIndex) Mozilla Firefox" -ForegroundColor Gray
        $menuOptions += "firefox"
        $menuIndex++
    }
    
    Write-Host "  $menuIndex) Default Browser" -ForegroundColor Gray
    $menuOptions += "default"
    $menuIndex++
    
    Write-Host "  $menuIndex) Start Local Server (Python)" -ForegroundColor Gray
    $menuOptions += "server"
    $menuIndex++
    
    Write-Host "  $menuIndex) Exit" -ForegroundColor Gray
    Write-Host ""
    
    $choice = Read-Host "Enter your choice (1-$menuIndex)"
    
    try {
        $choiceNum = [int]$choice
        if ($choiceNum -ge 1 -and $choiceNum -le $menuOptions.Count) {
            return $menuOptions[$choiceNum - 1]
        } elseif ($choiceNum -eq $menuIndex) {
            Write-Host ""
            Write-Info "Exiting launcher..."
            exit 0
        } else {
            Write-Warning "Invalid choice. Using default browser."
            return "default"
        }
    } catch {
        Write-Warning "Invalid input. Using default browser."
        return "default"
    }
}

# Main execution
try {
    if ($Help) {
        Show-Help
    }
    
    Write-Banner
    
    Write-Host "[Step 1/3] Validating app files..." -ForegroundColor $ColorInfo
    Test-AppFiles
    Write-Host ""
    
    Write-Host "[Step 2/3] Detecting browsers..." -ForegroundColor $ColorInfo
    $browsers = Find-Browsers
    Write-Host ""
    
    Write-Host "[Step 3/3] Launching app..." -ForegroundColor $ColorInfo
    Write-Host ""
    
    if ($Server) {
        $success = Start-LocalServer -ServerPort $Port
    } elseif ($Browser -ne "") {
        $success = Start-Browser -BrowserName $Browser -Browsers $browsers
    } else {
        $selectedBrowser = Show-InteractiveMenu -Browsers $browsers
        
        if ($selectedBrowser -eq "server") {
            $success = Start-LocalServer -ServerPort $Port
        } else {
            $success = Start-Browser -BrowserName $selectedBrowser -Browsers $browsers
        }
    }
    
    if ($success) {
        Write-Host ""
        Write-Host "================================================" -ForegroundColor $ColorSuccess
        Write-Host "  App launched successfully!" -ForegroundColor $ColorSuccess
        Write-Host "  Enjoy learning Spanish! :)" -ForegroundColor $ColorSuccess
        Write-Host "================================================" -ForegroundColor $ColorSuccess
        Write-Host ""
    }
    
} catch {
    Write-Host ""
    Write-Error-Custom "An error occurred: $_"
    Write-Host ""
    exit 1
}
