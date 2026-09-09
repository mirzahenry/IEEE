# ============================================================
# GRSS Website — Development Startup Script (PowerShell)
# ============================================================
# Usage:  ./start-dev.ps1
# ============================================================

param(
    [switch]$FrontendOnly,
    [switch]$BackendOnly
)

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   GRSS — Geosciences & Remote Sensing Society        ║" -ForegroundColor Cyan
Write-Host "║   Development Environment Startup                    ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── Pre-flight checks ─────────────────────────────────────

# Check Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅  Node.js  $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌  Node.js not found. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version 2>&1
    Write-Host "✅  npm      v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌  npm not found." -ForegroundColor Red
    exit 1
}

# Check frontend .env
if (-not (Test-Path "frontend\.env")) {
    Write-Host ""
    Write-Host "⚠️   frontend\.env not found!" -ForegroundColor Yellow
    Write-Host "    Copy .env.example and add your Supabase credentials:" -ForegroundColor Yellow
    Write-Host "    VITE_SUPABASE_URL=https://your-project.supabase.co" -ForegroundColor Gray
    Write-Host "    VITE_SUPABASE_ANON_KEY=your-anon-key" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "✅  frontend\.env found" -ForegroundColor Green
}

# Check backend .env
if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️   backend\.env not found (backend features may not work)" -ForegroundColor Yellow
} else {
    Write-Host "✅  backend\.env found" -ForegroundColor Green
}

# Check node_modules
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host ""
    Write-Host "📦  Installing frontend dependencies..." -ForegroundColor Cyan
    Set-Location frontend
    npm install
    Set-Location ..
}

if (-not (Test-Path "backend\node_modules")) {
    Write-Host "📦  Installing backend dependencies..." -ForegroundColor Cyan
    Set-Location backend
    npm install
    Set-Location ..
}

Write-Host ""
Write-Host "── Starting servers ──────────────────────────────────" -ForegroundColor Cyan
Write-Host ""

if ($FrontendOnly) {
    Write-Host "🌐  Frontend: http://localhost:5173" -ForegroundColor Green
    Write-Host ""
    Set-Location frontend
    npm run dev
    Set-Location ..
} elseif ($BackendOnly) {
    Write-Host "🔧  Backend:  http://localhost:5000" -ForegroundColor Green
    Write-Host ""
    Set-Location backend
    npm run dev
    Set-Location ..
} else {
    Write-Host "🌐  Frontend: http://localhost:5173" -ForegroundColor Green
    Write-Host "🔧  Backend:  http://localhost:5000" -ForegroundColor Green
    Write-Host "🔑  Admin:    http://localhost:5173/admin/login" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press Ctrl+C to stop all servers." -ForegroundColor Gray
    Write-Host ""

    # Start backend in new window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev" -WindowStyle Normal

    # Start frontend in current window
    Set-Location frontend
    npm run dev
    Set-Location ..
}
