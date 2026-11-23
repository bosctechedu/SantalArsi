@echo off
setlocal EnableDelayedExpansion
title Santalarsi - GitHub 1-Click Push System

echo ========================================================
echo   Santal आ़रसी (santalarsi) - GitHub Push System
echo   Target Live Site: https://santalarsi.pages.dev
echo ========================================================
echo.

cd /d "%~dp0"

where git >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git is not installed on this PC.
    echo Please install Git from: https://git-scm.com/download/win
    echo Then double-click push.bat again.
    pause
    exit /b 1
)

if not exist ".git" (
    echo [1/5] Initializing new Git repository...
    git init
    git branch -M main
)

for /f "delims=" %%a in ('git config user.name 2^>nul') do set "GIT_NAME=%%a"
if "%GIT_NAME%"=="" (
    set /p "INPUT_NAME=Enter your Name for Git (e.g. BOSC Tech): "
    if "!INPUT_NAME!"=="" set "INPUT_NAME=BOSC Tech & Edu"
    git config user.name "!INPUT_NAME!"
)

for /f "delims=" %%a in ('git config user.email 2^>nul') do set "GIT_EMAIL=%%a"
if "%GIT_EMAIL%"=="" (
    set /p "INPUT_EMAIL=Enter your GitHub Email (default bosctechedu@gmail.com): "
    if "!INPUT_EMAIL!"=="" set "INPUT_EMAIL=bosctechedu@gmail.com"
    git config user.email "!INPUT_EMAIL!"
)

for /f "delims=" %%a in ('git remote get-url origin 2^>nul') do set "REMOTE_URL=%%a"
if "%REMOTE_URL%"=="" (
    echo.
    echo [2/5] Connect your GitHub Repository (First-time setup only):
    echo Example: https://github.com/YOUR-USERNAME/santalarsi.git
    set /p "NEW_REMOTE=Paste GitHub Repository URL: "
    if "!NEW_REMOTE!"=="" (
        echo [ERROR] Repository URL cannot be empty.
        pause
        exit /b 1
    )
    git remote add origin "!NEW_REMOTE!"
    set "REMOTE_URL=!NEW_REMOTE!"
) else (
    echo [2/5] Connected Repo: %REMOTE_URL%
)

echo.
echo [3/5] Checking changed files...
git status -s

echo.
set "COMMIT_MSG="
set /p "COMMIT_MSG=Enter Update Note (or press Enter for auto message): "
if "%COMMIT_MSG%"=="" (
    for /f "delims=" %%t in ('powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm'" 2^>nul') do set "NOW_TS=%%t"
    if "!NOW_TS!"=="" set "NOW_TS=Auto Update"
    set "COMMIT_MSG=Update santalarsi - !NOW_TS!"
)

echo.
echo [4/5] Staging and committing files...
git add -A
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "%COMMIT_MSG%"
    if errorlevel 1 (
        echo [ERROR] Commit failed. Please check the message above.
        pause
        exit /b 1
    )
) else (
    echo No new local changes to commit. Checking pending push...
)

echo.
echo [5/5] Pushing code to GitHub (branch: main)...
git branch -M main
git push -u origin main
if errorlevel 1 (
    echo.
    echo [INFO] Remote GitHub repo already has files not on this PC (e.g. README).
    set /p "DO_REBASE=Pull remote changes and push again? (Y/N): "
    if /I "!DO_REBASE!"=="Y" (
        git pull --rebase origin main
        git push -u origin main
        if errorlevel 1 (
            echo [ERROR] Push still failed. Resolve any conflicts or verify GitHub login.
            pause
            exit /b 1
        )
    ) else (
        echo Push cancelled.
        pause
        exit /b 1
    )
)

echo.
echo ========================================================
echo   SUCCESS! Code pushed to GitHub.
echo   Cloudflare Pages will auto-deploy in 1-2 minutes:
echo   https://santalarsi.pages.dev
echo ========================================================
echo.
pause
