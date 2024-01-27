@echo off

set "current_dir=%cd%"

start "Flask Server" cmd /k "cd %current_dir%\flask_backend && call venv\Scripts\activate.bat && flask run"

start "Backend Server" cmd /k "cd %current_dir%\backend && npm start"

start "Frontend Server" cmd /k "cd %current_dir%\frontend && npm start"
