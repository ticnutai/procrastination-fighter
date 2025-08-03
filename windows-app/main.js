const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        title: 'Procrastination Fighter - מאבק בדחיינות',
        show: false
    });

    mainWindow.loadFile('index.html');

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

function createMenu() {
    const template = [
        {
            label: 'קובץ',
            submenu: [
                {
                    label: 'רענן',
                    accelerator: 'F5',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.reload();
                        }
                    }
                },
                {
                    label: 'יצוא נתונים',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.executeJavaScript(`
                                if (typeof exportData === 'function') {
                                    exportData();
                                }
                            `);
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'יציאה',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'הצג',
            submenu: [
                {
                    label: 'זום הגדלה',
                    accelerator: 'CmdOrCtrl+Plus',
                    click: () => {
                        if (mainWindow) {
                            const currentZoom = mainWindow.webContents.getZoomLevel();
                            mainWindow.webContents.setZoomLevel(currentZoom + 0.5);
                        }
                    }
                },
                {
                    label: 'זום הקטנה',
                    accelerator: 'CmdOrCtrl+-',
                    click: () => {
                        if (mainWindow) {
                            const currentZoom = mainWindow.webContents.getZoomLevel();
                            mainWindow.webContents.setZoomLevel(currentZoom - 0.5);
                        }
                    }
                },
                {
                    label: 'זום רגיל',
                    accelerator: 'CmdOrCtrl+0',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.setZoomLevel(0);
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'מסך מלא',
                    accelerator: 'F11',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.setFullScreen(!mainWindow.isFullScreen());
                        }
                    }
                },
                {
                    label: 'כלי פיתוח',
                    accelerator: 'F12',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.toggleDevTools();
                        }
                    }
                }
            ]
        },
        {
            label: 'כלים',
            submenu: [
                {
                    label: 'הגדרות',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.executeJavaScript(`
                                if (typeof showModule === 'function') {
                                    showModule('settings');
                                }
                            `);
                        }
                    }
                },
                {
                    label: 'סינכרון ענן',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.executeJavaScript(`
                                if (typeof syncNow === 'function') {
                                    syncNow();
                                }
                            `);
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'גיבוי נתונים',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.executeJavaScript(`
                                if (typeof backupData === 'function') {
                                    backupData();
                                }
                            `);
                        }
                    }
                }
            ]
        },
        {
            label: 'עזרה',
            submenu: [
                {
                    label: 'מדריך שימוש',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.executeJavaScript(`
                                if (typeof showModule === 'function') {
                                    showModule('help');
                                }
                            `);
                        }
                    }
                },
                {
                    label: 'אודות',
                    click: () => {
                        const { dialog } = require('electron');
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'אודות',
                            message: 'מאבק בדחיינות',
                            detail: 'אפליקציית ניהול זמן ומאבק בדחיינות\nגירסה 2.0\n\nפותח עם ❤️ לעזרה בפרודוקטיביות',
                            buttons: ['סגור']
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// אירועי האפליקציה
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// הגדרות אבטחה נוספות
app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
        shell.openExternal(navigationUrl);
    });
});
