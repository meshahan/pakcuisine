@echo off
echo ===========================================
echo   Deploying Stripe Payment (Fixing 401)
echo ===========================================

echo 1. Deploying the 'payment' function with NO JWT VERIFY...
echo    This fixes the "Unauthorized" error for public users.
call npx supabase functions deploy payment --no-verify-jwt
if %errorlevel% neq 0 (
    echo Deployment failed! You might need to login first.
    echo Try running: npx supabase login
    pause
    exit /b %errorlevel%
)

echo.
echo Please enter your Stripe Secret Key (starts with sk_test_):
set /p STRIPE_KEY=
call npx supabase secrets set STRIPE_SECRET_KEY=%STRIPE_KEY%
if %errorlevel% neq 0 (
    echo Failed to set secrets!
    pause
    exit /b %errorlevel%
)

echo.
echo ===========================================
echo   SUCCESS! Payment system is live.
echo ===========================================
pause
