@echo off
echo ==================================================
echo    יוצר תוכנה לווינדוס - אפליקציית מאבק בדחיינות
echo ==================================================
echo.

REM בדיקה אם Electron קיים
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo שגיאה: Node.js לא מותקן במערכת
    echo אנא התקן Node.js מ: https://nodejs.org
    pause
    exit /b 1
)

echo מתקין Electron...
npm install -g electron-builder
npm install -g electron

echo יוצר תיקיית פרויקט...
if not exist "windows-app" mkdir windows-app
cd windows-app

echo יוצר package.json...
echo {> package.json
echo   "name": "procrastination-fighter",>> package.json
echo   "version": "1.0.0",>> package.json
echo   "description": "אפליקציית מאבק בדחיינות לווינדוס",>> package.json
echo   "main": "main.js",>> package.json
echo   "scripts": {>> package.json
echo     "start": "electron .",>> package.json
echo     "build": "electron-builder",>> package.json
echo     "dist": "electron-builder --publish=never">> package.json
echo   },>> package.json
echo   "build": {>> package.json
echo     "appId": "com.procrastination.fighter",>> package.json
echo     "productName": "מאבק בדחיינות",>> package.json
echo     "directories": {>> package.json
echo       "output": "dist">> package.json
echo     },>> package.json
echo     "files": [>> package.json
echo       "**/*",>> package.json
echo       "!README.md">> package.json
echo     ],>> package.json
echo     "win": {>> package.json
echo       "target": "nsis",>> package.json
echo       "icon": "icon.ico">> package.json
echo     },>> package.json
echo     "nsis": {>> package.json
echo       "oneClick": false,>> package.json
echo       "allowToChangeInstallationDirectory": true>> package.json
echo     }>> package.json
echo   },>> package.json
echo   "devDependencies": {>> package.json
echo     "electron": "latest",>> package.json
echo     "electron-builder": "latest">> package.json
echo   }>> package.json
echo }>> package.json

echo מעתיק קבצים...
copy "..\procrastination-app.html" "index.html"
copy "..\manifest.json" "manifest.json"
copy "..\sw.js" "sw.js"

echo יוצר main.js...
echo const { app, BrowserWindow, Menu } = require('electron');> main.js
echo const path = require('path');>> main.js
echo.>> main.js
echo function createWindow() {>> main.js
echo   const win = new BrowserWindow({>> main.js
echo     width: 1200,>> main.js
echo     height: 800,>> main.js
echo     webPreferences: {>> main.js
echo       nodeIntegration: true,>> main.js
echo       contextIsolation: false>> main.js
echo     },>> main.js
echo     icon: path.join(__dirname, 'icon.ico'),>> main.js
echo     title: 'מאבק בדחיינות',>> main.js
echo     show: false>> main.js
echo   });>> main.js
echo.>> main.js
echo   win.loadFile('index.html');>> main.js
echo   win.once('ready-to-show', () =^> {>> main.js
echo     win.show();>> main.js
echo   });>> main.js
echo }>> main.js
echo.>> main.js
echo app.whenReady().then(createWindow);>> main.js
echo.>> main.js
echo app.on('window-all-closed', () =^> {>> main.js
echo   if (process.platform !== 'darwin') {>> main.js
echo     app.quit();>> main.js
echo   }>> main.js
echo });>> main.js
echo.>> main.js
echo app.on('activate', () =^> {>> main.js
echo   if (BrowserWindow.getAllWindows().length === 0) {>> main.js
echo     createWindow();>> main.js
echo   }>> main.js
echo });>> main.js

echo מתקין תלויות...
npm install

echo בונה תוכנה לווינדוס...
npm run dist

echo.
echo ==================================================
echo              ✅ הבנייה הושלמה בהצלחה!
echo ==================================================
echo התוכנה נמצאת בתיקייה: windows-app\dist
echo קובץ ההתקנה: Setup.exe
echo ==================================================
pause
