@echo off
cd /d C:\Users\os509\Downloads\Programming\HomeRenovationWebsite\Frontend
node node_modules\typescript\bin\tsc --noEmit --pretty false > C:\Users\os509\Downloads\Programming\HomeRenovationWebsite\tsc-result.txt 2>&1
echo TSC_EXIT=%ERRORLEVEL% >> C:\Users\os509\Downloads\Programming\HomeRenovationWebsite\tsc-result.txt