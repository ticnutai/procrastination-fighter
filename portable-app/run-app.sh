#!/bin/bash

echo "🎯 מערכת עזרה למאבק בדחיינות"
echo "================================"
echo ""
echo "מפעיל שרת מקומי..."
echo ""
echo "לסגירה: לחץ Ctrl+C"
echo ""
echo "האפליקציה תיפתח בדפדפן בכתובת:"
echo "http://localhost:8000/procrastination-app.html"
echo ""

# בדיקה אם Python מותקן
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "שגיאה: Python לא מותקן במערכת"
        echo "אנא התקן Python או פתח את procrastination-app.html ישירות בדפדפן"
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

# הפעלת השרת
echo "מפעיל שרת..."

# פתיחת הדפדפן (אם זמין)
if command -v open &> /dev/null; then
    # macOS
    open http://localhost:8000/procrastination-app.html
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:8000/procrastination-app.html
fi

# הפעלת השרת
$PYTHON_CMD -m http.server 8000
