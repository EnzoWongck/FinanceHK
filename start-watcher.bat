@echo off
title Finance HK — Auto Push
echo Watching for changes to index.html...
echo Press Ctrl+C to stop.
echo.
node "%~dp0watch.js"
pause
