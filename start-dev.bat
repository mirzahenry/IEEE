@echo off
title GRSS Development Servers
color 0B

echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║   GRSS — Geosciences ^& Remote Sensing Society        ║
echo  ║   Development Environment Startup                    ║
echo  ╚══════════════════════════════════════════════════════╝
echo.

:: Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)
for /f %%i in ('node --version') do echo  [OK] Node.js %%i

:: Check frontend .env
if not exist "frontend\.env" (
    echo.
    echo  [WARN] frontend\.env not found!
    echo         Copy .env.example and fill in your Supabase credentials.
    echo.
) else (
    echo  [OK] frontend\.env found
)

:: Install dependencies if needed
if not exist "frontend\node_modules" (
    echo.
    echo  [INFO] Installing frontend dependencies...
    cd frontend && npm install && cd ..
)
if not exist "backend\node_modules" (
    echo  [INFO] Installing backend dependencies...
    cd backend && npm install && cd ..
)

echo.
echo  Starting servers...
echo.
echo  Frontend : http://localhost:5173
echo  Backend  : http://localhost:5000
echo  Admin    : http://localhost:5173/admin/login
echo.
echo  Press Ctrl+C in either window to stop.
echo.

:: Launch backend in a separate window
start "GRSS Backend" cmd /k "cd /d %~dp0backend && npm run dev"

:: Launch frontend in current window
cd frontend
npm run dev
cd ..

pause
