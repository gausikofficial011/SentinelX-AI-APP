@echo off
title SentinelX AI - Master Launcher
echo ========================================================
echo   🛡️  SENTINELX AI — STARTING ALL SERVICES & SERVERS
echo ========================================================
echo.

:: 1. Start Python FastAPI AI Engine
echo [1/3] Launching Python FastAPI AI Engine (Port 8000)...
start "SentinelX - Python AI Engine :8000" cmd /k "cd /d %~dp0\backend\python-ai && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

:: 2. Start Node.js REST API Server
echo [2/3] Launching Node.js Backend API (Port 3000)...
start "SentinelX - Node API Server :3000" cmd /k "cd /d %~dp0\backend\node-api && npm run dev"

:: 3. Start Expo Dev Server (LAN & Expo Go)
echo [3/3] Launching Expo Dev Server & Expo Go (Port 8081)...
start "SentinelX - Expo Mobile Dev Server :8081" cmd /k "cd /d %~dp0\mobile && npx expo start --lan"

echo.
echo ========================================================
echo   ✅ ALL 3 TERMINALS LAUNCHED!
echo.
echo   • Python AI Engine:  http://localhost:8000
echo   • Node.js API:       http://localhost:3000
echo   • Web Preview:       http://localhost:8081
echo   • Expo Go (LAN):     exp://192.168.0.108:8081
echo.
echo   For remote / cellular data connection, run:
echo   start-expo-tunnel.bat
echo ========================================================
pause
