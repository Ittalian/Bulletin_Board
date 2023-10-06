@echo off
echo "change directory to app"
cd %~dp0
echo "boot app"
node ./boot.js
pause
