# ============================================================================
# UTF-8 Converter Script
# ============================================================================
# Converts CSV/JSON/YAML files to UTF-8 encoding
# JSON: UTF-8 without BOM
# CSV/YAML: UTF-8 with BOM (for Excel compatibility)
#
# Usage:
#   .\tools\convert-utf8.ps1
#   .\tools\convert-utf8.ps1 -Root "C:\path\to\project"
#   .\tools\convert-utf8.ps1 -Verbose
# ============================================================================

param(
    [string]$Root = ".",
    [switch]$Verbose = $false
)

# Change to root directory
Set-Location $Root

Write-Host "UTF-8 Converter - Starting..." -ForegroundColor Cyan
Write-Host "Root: $((Get-Location).Path)" -ForegroundColor Gray
Write-Host ""

# Define target files
$targets = @(
    "data\items.csv",
    "data\items.json",
    "data\verbs.csv",
    "data\verbs.json",
    "data\grammar-examples.csv",
    "content_outline.yaml"
)

# Filter existing files
$existingFiles = $targets | Where-Object { Test-Path $_ }

if ($existingFiles.Count -eq 0) {
    Write-Host "No target files found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Expected files:" -ForegroundColor Gray
    $targets | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
    exit 1
}

Write-Host "Found $($existingFiles.Count) file(s) to process:" -ForegroundColor Green
$existingFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
Write-Host ""

# UTF-8 BOM signature
$utf8Bom = New-Object byte[] 3
$utf8Bom[0] = 0xEF
$utf8Bom[1] = 0xBB
$utf8Bom[2] = 0xBF

# Process counter
$processed = 0
$skipped = 0
$errors = 0

foreach ($filePath in $existingFiles) {
    try {
        Write-Host "Processing: $filePath..." -NoNewline
        
        # Read file as bytes
        $bytes = Get-Content -Raw -Encoding Byte -Path $filePath
        
        # Detect current encoding
        $hasUtf8Bom = $bytes.Length -ge 3 -and 
                      $bytes[0] -eq 0xEF -and 
                      $bytes[1] -eq 0xBB -and 
                      $bytes[2] -eq 0xBF
        
        if ($Verbose) {
            Write-Host ""
            Write-Host "  Current encoding: $(if($hasUtf8Bom){'UTF-8 with BOM'}else{'CP-1252 or UTF-8 without BOM'})" -ForegroundColor Gray
        }
        
        # Decode from CP-1252 (Windows default)
        $text = [System.Text.Encoding]::GetEncoding(1252).GetString($bytes)
        
        # Determine output encoding based on file type
        $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
        
        if ($extension -eq ".json") {
            # JSON: UTF-8 without BOM (for web compatibility)
            $outputBytes = [System.Text.Encoding]::UTF8.GetBytes($text)
            
            if ($Verbose) {
                Write-Host "  Output encoding: UTF-8 without BOM" -ForegroundColor Gray
            }
            
        } else {
            # CSV/YAML: UTF-8 with BOM (for Excel/text editor compatibility)
            $textBytes = [System.Text.Encoding]::UTF8.GetBytes($text)
            $outputBytes = $utf8Bom + $textBytes
            
            if ($Verbose) {
                Write-Host "  Output encoding: UTF-8 with BOM" -ForegroundColor Gray
            }
        }
        
        # Write back to file
        [System.IO.File]::WriteAllBytes($filePath, $outputBytes)
        
        # Get file size
        $fileSize = (Get-Item $filePath).Length
        $fileSizeKb = [math]::Round($fileSize / 1KB, 2)
        
        Write-Host " OK ($fileSizeKb KB)" -ForegroundColor Green
        $processed++
        
    } catch {
        Write-Host " ERROR" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""
Write-Host "Conversion complete!" -ForegroundColor Cyan
Write-Host "Processed: $processed" -ForegroundColor Green
if ($skipped -gt 0) {
    Write-Host "Skipped: $skipped" -ForegroundColor Yellow
}
if ($errors -gt 0) {
    Write-Host "Errors: $errors" -ForegroundColor Red
}

# Summary
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  JSON files: UTF-8 without BOM (web-compatible)" -ForegroundColor Gray
Write-Host "  CSV files: UTF-8 with BOM (Excel-compatible)" -ForegroundColor Gray
Write-Host "  YAML files: UTF-8 with BOM" -ForegroundColor Gray

# Exit with appropriate code
if ($errors -gt 0) {
    exit 1
} else {
    exit 0
}
