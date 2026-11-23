@echo off
title Santal Arsi - Android APK Builder (Bubblewrap TWA)
echo ============================================================
echo   Santal Arsi (https://santalarsi.pages.dev) APK Builder
echo ============================================================
echo.
echo Step 1: Checking Node.js...
node -v
if errorlevel 1 (
  echo ERROR: Node.js not found. Please install Node.js LTS first.
  pause
  exit /b 1
)

if not exist android-twa (
  mkdir android-twa
)
cd android-twa

echo.
echo Step 2: Initializing TWA project from https://santalarsi.pages.dev/manifest.webmanifest
echo (First run will automatically offer to install JDK and Android SDK CLI tools!)
echo.
if not exist twa-manifest.json (
  call npx --yes @bubblewrap/cli init --manifest https://santalarsi.pages.dev/manifest.webmanifest
)

echo.
echo Step 3: Building signed Android APK (app-release-signed.apk)...
call npx --yes @bubblewrap/cli build

echo.
echo ============================================================
echo DONE! If build succeeded, your APK is located inside:
echo   %CD%\app-release-signed.apk
echo ============================================================
pause
