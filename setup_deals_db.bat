@echo off
echo ===========================================
echo   Setting up Deals ^^& Subscribers Tables
echo ===========================================

echo.
echo 1. Ensuring you are logged in to Supabase...
call npx supabase login

echo.
echo 2. Running deals_schema.sql...
echo Please enter your Supabase Project ID (get it from Dashboard -^> Settings):
set /p project_id="Project ID: "

echo.
echo Running SQL...
call npx supabase db query --project-ref %project_id% -f deals_schema.sql

if %errorlevel% neq 0 (
    echo.
    echo SQL Execution failed! 
    echo Please make sure the Project ID is correct and you have an active internet connection.
    echo Alternatively, you can copy-paste the contents of 'deals_schema.sql' into the Supabase SQL Editor.
    pause
    exit /b %errorlevel%
)

echo.
echo ===========================================
echo   SUCCESS! Deals and Subscribers are live.
echo ===========================================
pause
