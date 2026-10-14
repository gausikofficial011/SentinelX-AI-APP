@echo off
title SentinelX Mobile - Expo Tunnel Server
cd /d "%~dp0\mobile"
echo ===================================================
echo   Starting SentinelX Mobile (Tunnel / Remote Mode)
echo ===================================================
echo.
echo Tunnel mode allows connecting even over mobile data or different Wi-Fi networks.
echo Open Expo Go app on your phone and scan the QR code that appears below.
echo.
npx expo start --tunnel
pause
