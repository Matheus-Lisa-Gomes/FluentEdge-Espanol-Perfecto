@echo off
title FluentEdge: Espanol Perfecto (A1-C2 MCER / DELE) Launcher
echo ===============================================================
echo    Starting FluentEdge: Espanol Perfecto (A1-C2 MCER / DELE)
echo ===============================================================
echo.
start http://localhost:8080
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause

