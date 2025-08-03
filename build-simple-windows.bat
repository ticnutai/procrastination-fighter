@echo off
echo =====================================================
echo       בונה תוכנה לווינדוס - דרך פשוטה
echo =====================================================
echo.

cd "c:\Users\jj121\OneDrive - College Of Law And Business\שולחן העבודה\chack\phd"

echo יוצר תיקיית תוכנה פשוטה...
if not exist "simple-windows-app" mkdir simple-windows-app

echo מעתיק קבצים...
copy procrastination-app.html simple-windows-app\
copy manifest.json simple-windows-app\
copy sw.js simple-windows-app\

echo יוצר קובץ הפעלה...
echo ^<!DOCTYPE html^> > simple-windows-app\launcher.html
echo ^<html^> >> simple-windows-app\launcher.html
echo ^<head^> >> simple-windows-app\launcher.html
echo     ^<title^>מאבק בדחיינות^</title^> >> simple-windows-app\launcher.html
echo     ^<style^> >> simple-windows-app\launcher.html
echo         body { margin: 0; padding: 0; overflow: hidden; } >> simple-windows-app\launcher.html
echo         iframe { width: 100vw; height: 100vh; border: none; } >> simple-windows-app\launcher.html
echo     ^</style^> >> simple-windows-app\launcher.html
echo ^</head^> >> simple-windows-app\launcher.html
echo ^<body^> >> simple-windows-app\launcher.html
echo     ^<iframe src="procrastination-app.html"^>^</iframe^> >> simple-windows-app\launcher.html
echo ^</body^> >> simple-windows-app\launcher.html
echo ^</html^> >> simple-windows-app\launcher.html

echo יוצר קובץ BAT להפעלה...
echo @echo off > simple-windows-app\הפעל-אפליקציה.bat
echo title מאבק בדחיינות >> simple-windows-app\הפעל-אפליקציה.bat
echo echo מפעיל את אפליקציית מאבק בדחיינות... >> simple-windows-app\הפעל-אפליקציה.bat
echo start "" launcher.html >> simple-windows-app\הפעל-אפליקציה.bat

echo יוצר קיצור דרך...
echo Set oWS = WScript.CreateObject("WScript.Shell") > simple-windows-app\create-shortcut.vbs
echo sLinkFile = "%USERPROFILE%\Desktop\מאבק בדחיינות.lnk" >> simple-windows-app\create-shortcut.vbs
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> simple-windows-app\create-shortcut.vbs
echo oLink.TargetPath = WScript.CreateObject("Scripting.FileSystemObject").GetAbsolutePathName("הפעל-אפליקציה.bat") >> simple-windows-app\create-shortcut.vbs
echo oLink.WorkingDirectory = WScript.CreateObject("Scripting.FileSystemObject").GetAbsolutePathName(".") >> simple-windows-app\create-shortcut.vbs
echo oLink.Description = "אפליקציית מאבק בדחיינות" >> simple-windows-app\create-shortcut.vbs
echo oLink.Save >> simple-windows-app\create-shortcut.vbs

echo יוצר חבילה סופית...
cd simple-windows-app
cscript create-shortcut.vbs
cd ..

echo יוצר ZIP...
powershell -command "Compress-Archive -Path 'simple-windows-app\*' -DestinationPath 'מאבק-בדחיינות-ווינדוס.zip' -Force"

echo.
echo =====================================================
echo            ✅ הבנייה הושלמה בהצלחה!
echo =====================================================
echo קובץ מוכן: מאבק-בדחיינות-ווינדוס.zip
echo התוכנה תעבוד על כל מחשב ווינדוס!
echo =====================================================
echo.
echo להתקנה:
echo 1. חלץ את הקובץ ZIP
echo 2. הפעל את: הפעל-אפליקציה.bat
echo 3. או לחץ פעמיים על הקיצור דרך בשולחן
echo =====================================================
pause
