@echo off

set /p install_flask=Do you want to install Flask? (y/n): 
if /i "%install_flask%"=="y" (
    echo ****************** INSTALLING FLASK *************************
    cd flask_backend
    pip install virtualenv
    python -m virtualenv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    call deactivate
    echo **************** FLASK INSTALLATION DONE ********************
) else (
    echo Skipped Flask installation.
)

set /p install_backend=Do you want to install the backend? (y/n): 
if /i "%install_backend%"=="y" (
    echo ****************** INSTALLING BACKEND *************************
    cd ..
    cd backend
    call npm install
    echo **************** BACKEND INSTALLATION DONE ******************
) else (
    echo Skipped backend installation.
)

set /p install_frontend=Do you want to install the frontend? (y/n): 
if /i "%install_frontend%"=="y" (
    echo ****************** INSTALLING FRONTEND ************************
    cd ..
    cd frontend
    call npm install
    echo **************** FRONTEND INSTALLATION DONE ****************
) else (
    echo Skipped frontend installation.
)

cd ..
echo Now you can run 'startup.bat'
