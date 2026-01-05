@echo off
echo ===========================================
echo   Deploying Email System (Resend)
echo ===========================================

echo 1. Deploying the 'send-email' function...
call npx supabase functions deploy send-email --no-verify-jwt
if %errorlevel% neq 0 (
    echo Deployment failed! You might need to login first.
    echo Try running: npx supabase login
    pause
    exit /b %errorlevel%
)

echo.
echo 2. Setting RESEND_API_KEY...
echo Please enter your Resend API Key (starts with re_):
set /p RESEND_KEY=
call npx supabase secrets set RESEND_API_KEY=%RESEND_KEY%
if %errorlevel% neq 0 (
    echo Failed to set secrets!
    pause
    exit /b %errorlevel%
)

echo.
echo ===========================================
echo   SUCCESS! Email system is live.
echo ===========================================
pause
