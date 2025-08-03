// 💾 Backup & Restore System - מערכת גיבוי ושחזור מתקדמת
// מאפשרת גיבוי מלא של כל נתוני המשתמש ושחזור חלקי או מלא

class BackupRestoreManager {
    constructor() {
        this.version = '2.1.0';
        this.backupFormat = 'procrastination-backup';
        this.compressionEnabled = true;
    }

    // 📦 יצירת גיבוי מלא
    async createFullBackup() {
        try {
            console.log('📦 יוצר גיבוי מלא...');
            
            const backupData = {
                metadata: {
                    version: this.version,
                    format: this.backupFormat,
                    created: new Date().toISOString(),
                    deviceInfo: this.getDeviceInfo(),
                    appVersion: '2.1.0',
                    cloudProvider: localStorage.getItem('cloudProvider') || 'firebase'
                },
                userData: {
                    tasks: tasks || [],
                    completedTasks: completedTasks || 0,
                    currentStreak: currentStreak || 0,
                    totalPoints: totalPoints || 0,
                    journalEntries: journalEntries || [],
                    pomodoroCount: pomodoroCount || 0,
                    totalFocusTime: totalFocusTime || 0,
                    achievements: this.getAchievements(),
                    moduleProgress: this.getModuleProgress(),
                    customSettings: this.getCustomSettings()
                },
                settings: {
                    notifications: notificationSettings || {},
                    theme: localStorage.getItem('theme') || 'default',
                    language: 'he',
                    preferences: this.getUserPreferences()
                },
                statistics: {
                    totalSessionTime: this.getTotalSessionTime(),
                    averageProductivity: this.getAverageProductivity(),
                    bestStreak: this.getBestStreak(),
                    moduleUsage: this.getModuleUsageStats(),
                    weeklyProgress: this.getWeeklyProgress()
                },
                cloudSync: {
                    lastSync: localStorage.getItem('lastSyncTime'),
                    syncProvider: currentCloudProvider,
                    syncStatus: 'active'
                }
            };

            // דחיסה אם מופעלת
            const finalData = this.compressionEnabled ? 
                this.compressData(backupData) : backupData;

            return {
                success: true,
                data: finalData,
                size: JSON.stringify(finalData).length,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ שגיאה ביצירת גיבוי:', error);
            return { success: false, error: error.message };
        }
    }

    // 💾 שמירת גיבוי כקובץ
    async exportBackupFile(backupType = 'full') {
        try {
            let backupData;
            let filename;

            if (backupType === 'full') {
                const result = await this.createFullBackup();
                if (!result.success) throw new Error(result.error);
                backupData = result.data;
                filename = `procrastination-backup-full-${this.getDateString()}.json`;
            } else if (backupType === 'tasks') {
                backupData = await this.createTasksBackup();
                filename = `procrastination-backup-tasks-${this.getDateString()}.json`;
            } else if (backupType === 'settings') {
                backupData = await this.createSettingsBackup();
                filename = `procrastination-backup-settings-${this.getDateString()}.json`;
            }

            // יצירת קובץ להורדה
            const dataStr = JSON.stringify(backupData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = filename;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(link.href);

            showNotification('גיבוי נוצר', `גיבוי ${backupType} נשמר בהצלחה`);
            return { success: true, filename };

        } catch (error) {
            console.error('❌ שגיאה בשמירת גיבוי:', error);
            showNotification('שגיאה בגיבוי', 'לא ניתן היה ליצור קובץ גיבוי');
            return { success: false, error: error.message };
        }
    }

    // 📥 שחזור מקובץ גיבוי
    async restoreFromFile() {
        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.style.display = 'none';
            
            input.onchange = async (event) => {
                const file = event.target.files[0];
                if (!file) {
                    resolve({ success: false, error: 'לא נבחר קובץ' });
                    return;
                }

                try {
                    const text = await file.text();
                    const backupData = JSON.parse(text);
                    
                    // בדיקת תקינות הגיבוי
                    const validation = this.validateBackup(backupData);
                    if (!validation.valid) {
                        throw new Error(validation.error);
                    }

                    // הצגת אופציות שחזור
                    this.showRestoreOptions(backupData, resolve);

                } catch (error) {
                    console.error('❌ שגיאה בקריאת גיבוי:', error);
                    showNotification('שגיאה בשחזור', 'קובץ הגיבוי פגום או לא תקין');
                    resolve({ success: false, error: error.message });
                }
            };
            
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
        });
    }

    // 🔍 בדיקת תקינות גיבוי
    validateBackup(backupData) {
        try {
            // בדיקות בסיסיות
            if (!backupData || typeof backupData !== 'object') {
                return { valid: false, error: 'פורמט גיבוי לא תקין' };
            }

            // בדיקת metadata
            if (!backupData.metadata || !backupData.metadata.format) {
                return { valid: false, error: 'חסרים נתוני metadata' };
            }

            if (backupData.metadata.format !== this.backupFormat) {
                return { valid: false, error: 'פורמט גיבוי לא נתמך' };
            }

            // בדיקת גרסה
            const backupVersion = backupData.metadata.version;
            if (backupVersion && this.isVersionCompatible(backupVersion)) {
                return { valid: true, version: backupVersion };
            }

            return { valid: true, warning: 'גרסה ישנה - ייתכנו בעיות תאימות' };

        } catch (error) {
            return { valid: false, error: 'שגיאה בבדיקת תקינות: ' + error.message };
        }
    }

    // 🎯 הצגת אופציות שחזור
    showRestoreOptions(backupData, callback) {
        const modal = document.createElement('div');
        modal.className = 'backup-restore-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>🔄 אפשרויות שחזור</h3>
                <div class="backup-info">
                    <p><strong>תאריך יצירה:</strong> ${new Date(backupData.metadata.created).toLocaleString('he-IL')}</p>
                    <p><strong>גרסה:</strong> ${backupData.metadata.version}</p>
                    <p><strong>ספק ענן:</strong> ${backupData.metadata.cloudProvider}</p>
                </div>
                
                <div class="restore-options">
                    <h4>מה לשחזר?</h4>
                    <label><input type="checkbox" id="restore-tasks" checked> 📝 משימות (${backupData.userData?.tasks?.length || 0})</label>
                    <label><input type="checkbox" id="restore-stats" checked> 📊 סטטיסטיקות</label>
                    <label><input type="checkbox" id="restore-journal" checked> 📖 יומן (${backupData.userData?.journalEntries?.length || 0} רשומות)</label>
                    <label><input type="checkbox" id="restore-pomodoro" checked> 🍅 פומודורו</label>
                    <label><input type="checkbox" id="restore-settings" checked> ⚙️ הגדרות</label>
                    <label><input type="checkbox" id="restore-achievements"> 🏆 הישגים</label>
                </div>

                <div class="restore-mode">
                    <h4>אופן שחזור:</h4>
                    <label><input type="radio" name="restore-mode" value="merge" checked> 🔄 מיזוג עם הנתונים הקיימים</label>
                    <label><input type="radio" name="restore-mode" value="replace"> 🔃 החלפה מלאה של הנתונים</label>
                </div>

                <div class="modal-actions">
                    <button class="restore-btn" onclick="this.parentElement.parentElement.parentElement.executeRestore()">🔄 בצע שחזור</button>
                    <button class="cancel-btn" onclick="this.parentElement.parentElement.parentElement.remove()">❌ ביטול</button>
                </div>
            </div>
        `;

        // הוספת CSS למודל
        const style = document.createElement('style');
        style.textContent = `
            .backup-restore-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                direction: rtl;
            }
            .modal-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            .backup-info {
                background: #f5f5f5;
                padding: 15px;
                border-radius: 10px;
                margin: 15px 0;
            }
            .restore-options label, .restore-mode label {
                display: block;
                margin: 10px 0;
                cursor: pointer;
            }
            .restore-options input, .restore-mode input {
                margin-left: 10px;
            }
            .modal-actions {
                margin-top: 20px;
                text-align: center;
            }
            .restore-btn {
                background: #4CAF50;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                margin: 0 10px;
                font-size: 16px;
            }
            .cancel-btn {
                background: #f44336;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                margin: 0 10px;
                font-size: 16px;
            }
        `;

        modal.executeRestore = async () => {
            const options = {
                tasks: document.getElementById('restore-tasks').checked,
                stats: document.getElementById('restore-stats').checked,
                journal: document.getElementById('restore-journal').checked,
                pomodoro: document.getElementById('restore-pomodoro').checked,
                settings: document.getElementById('restore-settings').checked,
                achievements: document.getElementById('restore-achievements').checked,
                mode: document.querySelector('input[name="restore-mode"]:checked').value
            };

            const result = await this.executeRestore(backupData, options);
            modal.remove();
            callback(result);
        };

        document.head.appendChild(style);
        document.body.appendChild(modal);
    }

    // ⚡ ביצוע שחזור
    async executeRestore(backupData, options) {
        try {
            console.log('🔄 מבצע שחזור...', options);
            let restored = [];

            // שחזור משימות
            if (options.tasks && backupData.userData?.tasks) {
                if (options.mode === 'replace') {
                    tasks = backupData.userData.tasks;
                } else {
                    // מיזוג משימות
                    const existingIds = new Set(tasks.map(t => t.id));
                    const newTasks = backupData.userData.tasks.filter(t => !existingIds.has(t.id));
                    tasks = [...tasks, ...newTasks];
                }
                renderTasks();
                restored.push('משימות');
            }

            // שחזור סטטיסטיקות
            if (options.stats && backupData.userData) {
                if (options.mode === 'replace') {
                    completedTasks = backupData.userData.completedTasks || 0;
                    currentStreak = backupData.userData.currentStreak || 0;
                    totalPoints = backupData.userData.totalPoints || 0;
                } else {
                    // מיזוג סטטיסטיקות
                    completedTasks = Math.max(completedTasks, backupData.userData.completedTasks || 0);
                    currentStreak = Math.max(currentStreak, backupData.userData.currentStreak || 0);
                    totalPoints += backupData.userData.totalPoints || 0;
                }
                updateStats();
                restored.push('סטטיסטיקות');
            }

            // שחזור יומן
            if (options.journal && backupData.userData?.journalEntries) {
                if (options.mode === 'replace') {
                    journalEntries = backupData.userData.journalEntries;
                } else {
                    // מיזוג יומן
                    const existingDates = new Set(journalEntries.map(j => j.date));
                    const newEntries = backupData.userData.journalEntries.filter(j => !existingDates.has(j.date));
                    journalEntries = [...journalEntries, ...newEntries];
                }
                displayJournalHistory();
                restored.push('יומן');
            }

            // שחזור פומודורו
            if (options.pomodoro && backupData.userData) {
                if (options.mode === 'replace') {
                    pomodoroCount = backupData.userData.pomodoroCount || 0;
                    totalFocusTime = backupData.userData.totalFocusTime || 0;
                } else {
                    pomodoroCount += backupData.userData.pomodoroCount || 0;
                    totalFocusTime += backupData.userData.totalFocusTime || 0;
                }
                updatePomodoroStats();
                restored.push('פומודורו');
            }

            // שחזור הגדרות
            if (options.settings && backupData.settings) {
                if (backupData.settings.notifications) {
                    notificationSettings = { ...notificationSettings, ...backupData.settings.notifications };
                    loadNotificationSettings();
                }
                if (backupData.settings.theme) {
                    localStorage.setItem('theme', backupData.settings.theme);
                }
                restored.push('הגדרות');
            }

            // שמירת כל הנתונים
            saveData();
            updateProgress();

            // סינכרון עם ענן אם זמין
            if (typeof syncNow === 'function') {
                await syncNow();
            }

            const message = `שחזור הושלם בהצלחה!\nנשחזרו: ${restored.join(', ')}`;
            showNotification('שחזור הושלם', message);

            return { 
                success: true, 
                restored,
                message,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ שגיאה בשחזור:', error);
            showNotification('שגיאה בשחזור', 'לא ניתן היה לשחזר את הנתונים');
            return { success: false, error: error.message };
        }
    }

    // 🔧 פונקציות עזר
    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            timestamp: Date.now()
        };
    }

    getDateString() {
        return new Date().toISOString().split('T')[0];
    }

    getAchievements() {
        // מחזיר רשימת הישגים שהושגו
        return JSON.parse(localStorage.getItem('achievements') || '[]');
    }

    getModuleProgress() {
        // מחזיר התקדמות במודולים
        return JSON.parse(localStorage.getItem('moduleProgress') || '{}');
    }

    getCustomSettings() {
        // מחזיר הגדרות מותאמות אישית
        return {
            theme: localStorage.getItem('theme'),
            language: localStorage.getItem('language'),
            cloudProvider: localStorage.getItem('cloudProvider')
        };
    }

    getUserPreferences() {
        return JSON.parse(localStorage.getItem('userPreferences') || '{}');
    }

    getTotalSessionTime() {
        return parseInt(localStorage.getItem('totalSessionTime') || '0');
    }

    getAverageProductivity() {
        return parseFloat(localStorage.getItem('avgProductivity') || '0');
    }

    getBestStreak() {
        return parseInt(localStorage.getItem('bestStreak') || currentStreak.toString());
    }

    getModuleUsageStats() {
        return JSON.parse(localStorage.getItem('moduleUsage') || '{}');
    }

    getWeeklyProgress() {
        return JSON.parse(localStorage.getItem('weeklyProgress') || '[]');
    }

    createTasksBackup() {
        return {
            type: 'tasks-only',
            version: this.version,
            created: new Date().toISOString(),
            data: {
                tasks: tasks || [],
                completedTasks: completedTasks || 0
            }
        };
    }

    createSettingsBackup() {
        return {
            type: 'settings-only',
            version: this.version,
            created: new Date().toISOString(),
            data: {
                notifications: notificationSettings || {},
                theme: localStorage.getItem('theme'),
                preferences: this.getUserPreferences()
            }
        };
    }

    compressData(data) {
        // דחיסה פשוטה - הסרת רווחים מיותרים
        return JSON.parse(JSON.stringify(data));
    }

    isVersionCompatible(version) {
        // בדיקת תאימות גרסאות
        const [major, minor] = version.split('.').map(Number);
        const [currentMajor, currentMinor] = this.version.split('.').map(Number);
        
        return major === currentMajor && minor <= currentMinor;
    }

    // 📅 גיבוי אוטומטי יומי
    async scheduleAutoBackup() {
        const lastBackup = localStorage.getItem('lastAutoBackup');
        const today = this.getDateString();
        
        if (lastBackup !== today) {
            console.log('📅 מבצע גיבוי אוטומטי יומי...');
            const backup = await this.createFullBackup();
            
            if (backup.success) {
                localStorage.setItem('lastAutoBackup', today);
                localStorage.setItem('autoBackupData', JSON.stringify(backup.data));
                console.log('✅ גיבוי אוטומטי הושלם');
            }
        }
    }

    // 🔄 שחזור מגיבוי אוטומטי
    async restoreFromAutoBackup() {
        const autoBackupData = localStorage.getItem('autoBackupData');
        if (!autoBackupData) {
            return { success: false, error: 'אין גיבוי אוטומטי זמין' };
        }

        try {
            const backupData = JSON.parse(autoBackupData);
            const options = {
                tasks: true,
                stats: true,
                journal: true,
                pomodoro: true,
                settings: true,
                achievements: true,
                mode: 'merge'
            };

            return await this.executeRestore(backupData, options);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// יצירת instance גלובלי
window.backupManager = new BackupRestoreManager();

// אתחול גיבוי אוטומטי
document.addEventListener('DOMContentLoaded', () => {
    if (window.backupManager) {
        window.backupManager.scheduleAutoBackup();
    }
});
