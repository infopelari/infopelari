@echo off
echo ========================================
echo   DEPLOY INFOPELARI.ID KE PRODUCTION
echo ========================================
echo.

echo [1/4] Checking changes...
git status
echo.

echo [2/4] Adding all changes...
git add .
echo.

echo [3/4] Committing...
set /p message="Enter commit message: "
git commit -m "%message%"
echo.

echo [4/4] Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo   DONE! Vercel akan auto-deploy.
echo   Check: https://vercel.com
echo   Website live dalam 2-3 menit.
echo ========================================
pause
