Set oWS = WScript.CreateObject("WScript.Shell") 
sLinkFile = "C:\Users\jj121\Desktop\מאבק בדחיינות.lnk" 
Set oLink = oWS.CreateShortcut(sLinkFile) 
oLink.TargetPath = WScript.CreateObject("Scripting.FileSystemObject").GetAbsolutePathName("הפעל-אפליקציה.bat") 
oLink.WorkingDirectory = WScript.CreateObject("Scripting.FileSystemObject").GetAbsolutePathName(".") 
oLink.Description = "אפליקציית מאבק בדחיינות" 
oLink.Save 
