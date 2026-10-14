@echo off
title SentinelX Mobile - Expo Dev Server
cd /d "%~dp0\mobile"
echo ===================================================
echo   Starting SentinelX AI Mobile App (Expo Go)
echo ===================================================
echo.
echo Make sure your phone and PC are connected to the same Wi-Fi.
echo Open Expo Go app on your phone and scan the QR code below.
echo Or enter URL manually: exp://192.168.0.108:8081
echo Web Preview: http://localhost:8081
echo.
npx expo start --lan
pause
