@echo off
cd /d "%~dp0"
title Maatje
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Start-Maatje.ps1"
echo.
pause
