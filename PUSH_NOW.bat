@echo off
echo ========================================
echo   PUSH PERUBAHAN KE GITHUB
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Adding all changes...
git add .
echo.

echo [2/3] Committing...
git commit -m "fix: perbaiki form submit single page, fix Next.js 15 params error, tambah input jarak kustom"
echo.

echo [3/3] Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo   DONE! 
echo   Vercel sedang deploy...
echo   Check: https://vercel.com
echo   Website live dalam 2-3 menit.
echo ========================================
echo.
echo Tekan tombol apa saja untuk tutup...
pause > nul
