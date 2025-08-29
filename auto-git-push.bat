@echo off
cd /d %~dp0

git add .
git commit -m "auto-commit: %date% %time%"
git push origin main
