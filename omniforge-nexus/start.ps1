# ============================================================
#  OmniForge Nexus – One-Click Dev Launcher
#  Starts backend + frontend with zero external dependencies.
#  Usage: .\start.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$Root   = $PSScriptRoot
$Back   = Join-Path $Root "backend"
$Front  = Join-Path $Root "frontend"

Write-Host ""
Write-Host "  ╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "  ║       OmniForge Nexus  –  Dev Launcher       ║" -ForegroundColor Cyan
Write-Host "  ╠══════════════════════════════════════════════╣" -ForegroundColor Cyan
Write-Host "  ║  Frontend  →  http://localhost:5173           ║" -ForegroundColor Green
Write-Host "  ║  Backend   →  http://localhost:8000           ║" -ForegroundColor Yellow
Write-Host "  ║  API Docs  →  http://localhost:8000/docs      ║" -ForegroundColor Yellow
Write-Host "  ╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── Detect Python ───────────────────────────────────────────
$PythonCmd = $null
foreach ($cmd in @("python", "python3", "py")) {
    if (Get-Command $cmd -ErrorAction SilentlyContinue) {
        $PythonCmd = $cmd
        break
    }
}
if (-not $PythonCmd) {
    Write-Host "  ❌  Python not found. Install Python 3.10+ and retry." -ForegroundColor Red
    exit 1
}
Write-Host "  ✅  Python: $PythonCmd" -ForegroundColor Green

# ── Check pip packages ──────────────────────────────────────
Write-Host "  🔍  Checking dependencies..." -ForegroundColor Cyan
$pipCheck = & $PythonCmd -c "import fastapi, uvicorn, structlog, orjson, prometheus_client, pydantic_settings" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  📦  Installing Python packages..." -ForegroundColor Yellow
    & $PythonCmd -m pip install -r "$Back\requirements.txt" --quiet
}

# ── Check node_modules ──────────────────────────────────────
if (-not (Test-Path "$Front\node_modules")) {
    Write-Host "  📦  Installing npm packages (first time only)..." -ForegroundColor Yellow
    Push-Location $Front
    npm install --silent
    Pop-Location
}

Write-Host ""
Write-Host "  🚀  Starting servers..." -ForegroundColor Cyan

# ── Launch Backend ──────────────────────────────────────────
$backendJob = Start-Job -ScriptBlock {
    param($back, $py)
    Set-Location $back
    & $py dev_server.py
} -ArgumentList $Back, $PythonCmd

# ── Launch Frontend ─────────────────────────────────────────
$frontendJob = Start-Job -ScriptBlock {
    param($front)
    Set-Location $front
    npm run dev
} -ArgumentList $Front

Write-Host "  ✅  Backend  job started (PID tracking via job)" -ForegroundColor Green
Write-Host "  ✅  Frontend job started" -ForegroundColor Green
Write-Host ""

# ── Wait then open browser ──────────────────────────────────
Start-Sleep -Seconds 3
Write-Host "  🌐  Opening browser..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "  ┌─────────────────────────────────────────────┐" -ForegroundColor DarkGray
Write-Host "  │  Press Ctrl+C to stop all servers           │" -ForegroundColor DarkGray
Write-Host "  └─────────────────────────────────────────────┘" -ForegroundColor DarkGray
Write-Host ""

# ── Stream output & keep alive ──────────────────────────────
try {
    while ($true) {
        # Print any new output from backend
        Receive-Job $backendJob -ErrorAction SilentlyContinue |
            ForEach-Object { Write-Host "  [API] $_" -ForegroundColor Yellow }
        # Print any new output from frontend
        Receive-Job $frontendJob -ErrorAction SilentlyContinue |
            ForEach-Object { Write-Host "  [WEB] $_" -ForegroundColor Green }
        Start-Sleep -Milliseconds 500
    }
} finally {
    Write-Host ""
    Write-Host "  🛑  Stopping servers..." -ForegroundColor Red
    Stop-Job $backendJob,  $frontendJob  -ErrorAction SilentlyContinue
    Remove-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Write-Host "  ✅  All servers stopped." -ForegroundColor Green
}
