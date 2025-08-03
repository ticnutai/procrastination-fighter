# 🎯 Procrastination Fighter - מערכת מאבק בדחיינות

![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Windows%20%7C%20Android-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📖 תיאור הפרויקט

מערכת מקיפה למאבק בדחיינות הכוללת 8 מודולים מתקדמים, מערכת הישגים, פומודורו, וסינכרון ענן מלא. התוכנה זמינה כ-PWA, אפליקציית Electron, ואפליקציה נייחת.

### ✨ תכונות עיקריות

- 🧠 **8 מודולים טיפוליים מתקדמים**
- 🏆 **מערכת הישגים ומוטיבציה**
- ⏱️ **טכניקת פומודורו משולבת**
- 📊 **מעקב סטטיסטיקות מתקדם**
- ☁️ **סינכרון ענן בין כל המכשירים**
- 📱 **תמיכה מלאה ב-PWA**
- 🖥️ **גרסת דסקטופ Electron**
- 🌐 **עבודה בלי אינטרנט**

## 🚀 התקנה מהירה

### אפשרות 1: PWA (מומלץ!)
```bash
1. פתח את procrastination-app.html בדפדפן Chrome
2. לחץ על אייקון ההתקנה (+) בשורת הכתובות
3. בחר "התקן"
```

### אפשרות 2: Electron Desktop
```powershell
cd windows-app
npm install
npm start
npm run build
```

### אפשרות 3: אפליקציה נייחת
```bash
1. הורד את Procrastination-Fighter-Windows.zip
2. חלץ את הקבצים
3. הפעל את launcher.html
```

## 📁 מבנה הפרויקט

```
📦 Procrastination Fighter
├── 🎯 procrastination-app.html      # קובץ ראשי PWA
├── 📱 manifest.json                 # הגדרות PWA
├── ⚙️ sw.js                        # Service Worker
├── 📦 windows-app/                  # גרסת Electron
│   ├── package.json
│   ├── main.js
│   └── dist/
├── 💼 simple-windows-app/           # גרסה נייחת
├── 📦 Procrastination-Fighter-Desktop/  # גרסה מובנית
└── 📚 docs/                         # תיעוד
```

## 🔧 טכנולוגיות

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **PWA**: Service Worker, Web App Manifest
- **Desktop**: Electron.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Build Tools**: npm, electron-builder

## 🎮 המודולים הטיפוליים

### 1. 🎯 מודול זיהוי הדחיינות
- זיהוי דפוסי דחיינות אישיים
- ניתוח סיבות עמוקות
- תובנות פסיכולוגיות

### 2. 🧘 מודול מיינדפולנס
- תרגילי נשימה מונחים
- מדיטציות קצרות
- הקלת חרדה ולחץ

### 3. 🎪 מודול גמיפיקציה
- מערכת נקודות ורמות
- הישגים ותגים
- תחרותיות בריאה

### 4. ⏰ מודול פומודורו
- טכניקת 25+5 דקות
- מעקב פרודוקטיביות
- התאמה אישית

### 5. 🎨 מודול ויזואליזציה
- דמיון מודרך
- ויזואליזציית מטרות
- חיזוק מוטיבציה

### 6. 🔄 מודול שינוי הרגלים
- בניית הרגלים חיוביים
- שבירת דפוסים שליליים
- מעקב התקדמות

### 7. 📈 מודול מעקב
- סטטיסטיקות מפורטות
- גרפים ודוחות
- מגמות והישגים

### 8. 🎯 מודול מטרות
- הגדרת מטרות SMART
- פירוק למשימות קטנות
- מעקב השלמה

## 📊 נתונים וסטטיסטיקות

המערכת עוקבת אחר:
- ⏱️ זמן פרודוקטיביות יומי
- 📈 מגמות התקדמות
- 🏆 הישגים שהושגו
- 📝 משימות שהושלמו
- 🎯 יעדים שהושגו

## 🌐 תמיכה בפלטפורמות

| פלטפורמה | PWA | Electron | נייח |
|-----------|-----|----------|------|
| 🖥️ Windows | ✅ | ✅ | ✅ |
| 🍎 macOS | ✅ | ✅ | ✅ |
| 🐧 Linux | ✅ | ✅ | ✅ |
| 📱 Android | ✅ | ❌ | ✅ |
| 🍎 iOS | ✅ | ❌ | ✅ |

## ⚡ ביצועים

- 📦 **גודל אפליקציה**: 2.5MB (PWA) / 205MB (Electron)
- ⚡ **זמן טעינה**: <3 שניות
- 💾 **שימוש בזכרון**: 50MB (PWA) / 150MB (Electron)
- 🔋 **צריכת סוללה**: נמוכה

## 🔒 פרטיות ואבטחה

- 🔐 **הצפנת נתונים**: AES-256
- 🌐 **סינכרון מאובטח**: Firebase Security Rules
- 👤 **אימות משתמש**: Firebase Auth
- 📱 **נתונים מקומיים**: IndexedDB מוצפן

## 🤝 תרומה לפרויקט

1. Fork את הפרויקט
2. צור branch חדש (`git checkout -b feature/amazing-feature`)
3. Commit את השינויים (`git commit -m 'Add amazing feature'`)
4. Push ל-branch (`git push origin feature/amazing-feature`)
5. פתח Pull Request

## 📄 רישיון

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 פיתוח

פותח על ידי [Your Name]

## 🆘 תמיכה

יש לך שאלות? פתח Issue או צור קשר:
- 📧 Email: your.email@example.com
- 💬 Discussions: GitHub Discussions
- 🐛 Bug Reports: GitHub Issues

## 🙏 תודות

תודה מיוחדת לקהילת הפיתוח וכל התורמים לפרויקט!

---

⭐ אם הפרויקט עזר לך, אל תשכח לתת כוכב!
