@echo off
cd /d C:\Users\os509\Downloads\Programming\HomeRenovationWebsite\Frontend
call node node_modules\vite\bin\vite.js build > C:\Users\os509\Downloads\Programming\HomeRenovationWebsite\build-result.txt 2>&1
echo BUILD_EXIT=%ERRORLEVEL% >> C:\Users\os509\Downloads\Programming\HomeRenovationWebsite\build-result.txt