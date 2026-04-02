@echo off
echo.
echo ╔══════════════════════════════════════════════╗
echo ║          RYANAIR EXPLORER — DÉMARRAGE        ║
echo ╚══════════════════════════════════════════════╝
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo ❌ Node.js n'est pas installe.
  echo    Telechargez-le sur : https://nodejs.org
  pause
  exit /b 1
)

echo ✅ Node.js détecté
echo.
echo 🚀 Démarrage du serveur...
echo    → Ouvrez votre navigateur sur : http://localhost:3000
echo.

start "" "http://localhost:3000"
node server.js
pause
