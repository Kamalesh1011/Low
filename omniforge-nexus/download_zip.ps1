# ============================================================
#  OmniForge Nexus – Clean Code Zip Exporter
#  Creates omniforge-nexus-clean.zip on your Desktop.
#  Excludes: node_modules, __pycache__, .git, *.pyc, dist, build
#  Usage: .\download_zip.ps1
# ============================================================

$Root = $PSScriptRoot
$Desktop = [Environment]::GetFolderPath("Desktop")
$ZipName = "omniforge-nexus-clean.zip"
$ZipPath = Join-Path $Desktop $ZipName
$TempDir = Join-Path $env:TEMP "omniforge_zip_tmp_$(Get-Random)"

# Directories/patterns to exclude
$Excludes = @(
    "node_modules",
    "__pycache__",
    ".git",
    "dist",
    "build",
    ".venv",
    "venv",
    "*.pyc",
    "*.pyo",
    "*.egg-info",
    ".mypy_cache",
    ".pytest_cache",
    "coverage"
)

Write-Host ""
Write-Host "  OmniForge Nexus - Code Zip Exporter" -ForegroundColor Cyan
Write-Host "  ----------------------------------------" -ForegroundColor DarkGray
Write-Host "  Source : $Root"
Write-Host "  Output : $ZipPath"
Write-Host ""

# Remove old zip if exists
if (Test-Path $ZipPath) {
    Remove-Item $ZipPath -Force
    Write-Host "  Removed old zip" -ForegroundColor DarkGray
}

# -- Copy to temp, then zip -----------------------------------
Write-Host "  Collecting files (excluding build artifacts)..." -ForegroundColor Yellow

New-Item -ItemType Directory -Path $TempDir -Force | Out-Null
$DestRoot = Join-Path $TempDir "omniforge-nexus"
New-Item -ItemType Directory -Path $DestRoot -Force | Out-Null

# Robocopy with exclusions (Windows native, very fast)
$ExcludeDirs = $Excludes | Where-Object { $_ -notlike "*.*" }
$ExcludeFiles = $Excludes | Where-Object { $_ -like "*.*" }

$robocopyArgs = @(
    $Root, $DestRoot,
    "/E",       # Include subdirectories
    "/NFL",     # No file list in output
    "/NDL",     # No dir list
    "/NJH",     # No job header
    "/NJS"      # No job summary
) + ($ExcludeDirs | ForEach-Object { "/XD"; $_ }) + ($ExcludeFiles | ForEach-Object { "/XF"; $_ })

& robocopy @robocopyArgs | Out-Null

# -- Create zip -----------------------------------
Write-Host "  Creating zip archive..." -ForegroundColor Yellow
Compress-Archive -Path $DestRoot -DestinationPath $ZipPath -CompressionLevel Optimal

# Cleanup temp
Remove-Item $TempDir -Recurse -Force -ErrorAction SilentlyContinue

# -- Report -----------------------------------
$ZipSizeMB = [math]::Round((Get-Item $ZipPath).Length / 1MB, 2)
Write-Host ""
Write-Host "  Done!" -ForegroundColor Green
Write-Host "  File : $ZipPath"
Write-Host "  Size : ${ZipSizeMB} MB"
Write-Host ""

# Open Desktop folder
explorer $Desktop
