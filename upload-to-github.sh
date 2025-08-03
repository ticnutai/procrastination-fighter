#!/bin/bash
# 🚀 סקריפט העלאה מהירה ל-GitHub

echo "🎯 מכין את הפרויקט להעלאה ל-GitHub..."

# בדיקה אם יש remote
if git remote -v | grep -q origin; then
    echo "✅ Git remote כבר קיים"
    git remote -v
else
    echo "⚠️  יש להוסיף remote manually:"
    echo "git remote add origin https://github.com/[USERNAME]/procrastination-fighter.git"
fi

# הוספת קבצים חדשים
echo "📁 מוסיף קבצים חדשים..."
git add .

# בדיקת שינויים
if git diff --cached --quiet; then
    echo "ℹ️  אין שינויים חדשים להעלאה"
else
    echo "📝 קבצים שישודרגו:"
    git diff --cached --name-only
    
    echo "💾 יוצר commit..."
    git commit -m "Update: $(date '+%Y-%m-%d %H:%M')"
fi

echo ""
echo "🚀 לְהעְלאָה ל-GitHub:"
echo "git push origin main"
echo ""
echo "🏷️ ליצירת גרסה חדשה:"
echo "git tag -a v2.0.1 -m 'תיאור השינויים'"
echo "git push origin v2.0.1"
echo ""
echo "✨ הפרויקט מוכן!"
