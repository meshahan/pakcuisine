@echo off
echo ===========================================
echo   Setting up Transactional Emails (Resend)
echo ===========================================

echo 1. Deploying the 'send-email' function...
call npx supabase functions deploy send-email --no-verify-jwt
if %errorlevel% neq 0 (
    echo Deployment failed! Please make sure you are logged in to Supabase.
    echo Try running: npx supabase login
    pause
    exit /b %errorlevel%
)

echo.
echo 2. Setting RESEND_API_KEY...
set /p key="Please enter your Resend API Key: "
call npx supabase secrets set RESEND_API_KEY=%key%
if %errorlevel% neq 0 (
    echo Failed to set secret!
    pause
    exit /b %errorlevel%
)

echo.
echo ===========================================
echo   SUCCESS! Customer emails are now active.
echo ===========================================
pause
