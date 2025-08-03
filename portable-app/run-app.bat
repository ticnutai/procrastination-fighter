@echo off
echo 🎯 מערכת עזרה למאבק בדחיינות
echo ================================
echo.
echo מפעיל שרת מקומי...
echo.
echo לסגירה: לחץ Ctrl+C
echo.
echo האפליקציה תיפתח בדפדפן בכתובת:
echo http://localhost:8000/procrastination-app.html
echo.

REM בדיקה אם Python מותקן
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo שגיאה: Python לא מותקן במערכת
    echo אנא התקן Python או פתח את procrastination-app.html ישירות בדפדפן
    pause
    exit /b 1
)

REM הפעלת השרת
echo מפעיל שרת...
start http://localhost:8000/procrastination-app.html
python -m http.server 8000
