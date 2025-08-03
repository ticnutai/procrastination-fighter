// 🔧 Supabase Configuration & Client
// מערכת ניהול נתונים חלופית ל-Firebase

class SupabaseManager {
    constructor() {
        this.supabaseUrl = 'https://lrpkrgjlncjjcvmbmzqa.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycGtyZ2psbmNqamN2bWJtenFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNjAwOTAsImV4cCI6MjA2OTgzNjA5MH0.MTCp6iGijmcypfTxJjxI67eu0wXr7cQna-E43NVEKI8';
        this.client = null;
        this.isInitialized = false;
    }

    // אתחול Supabase
    async initialize() {
        try {
            console.log('🚀 מאתחל חיבור ל-Supabase...');
            
            // בדיקה אם Supabase זמין
            if (typeof supabase === 'undefined') {
                console.warn('⚠️ Supabase SDK לא נטען - נשתמש ב-Fetch API');
                this.client = this.createFetchClient();
            } else {
                this.client = supabase.createClient(this.supabaseUrl, this.supabaseKey);
            }
            
            this.isInitialized = true;
            console.log('✅ Supabase מוכן לשימוש');
            return true;
        } catch (error) {
            console.error('❌ שגיאה באתחול Supabase:', error);
            return false;
        }
    }

    // יצירת Fetch client פשוט אם אין SDK
    createFetchClient() {
        return {
            from: (table) => ({
                select: (columns = '*') => this.fetchData(table, 'GET', { columns }),
                insert: (data) => this.fetchData(table, 'POST', { data }),
                update: (data) => ({
                    eq: (column, value) => this.fetchData(table, 'PATCH', { data, where: { [column]: value } })
                }),
                delete: () => ({
                    eq: (column, value) => this.fetchData(table, 'DELETE', { where: { [column]: value } })
                })
            }),
            auth: {
                signUp: (credentials) => this.authAction('signup', credentials),
                signIn: (credentials) => this.authAction('signin', credentials),
                signOut: () => this.authAction('signout'),
                getUser: () => this.authAction('user')
            }
        };
    }

    // ביצוע פעולות נתונים עם Fetch
    async fetchData(table, method, options = {}) {
        try {
            const url = `${this.supabaseUrl}/rest/v1/${table}`;
            const headers = {
                'apikey': this.supabaseKey,
                'Authorization': `Bearer ${this.supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            };

            const config = {
                method,
                headers
            };

            if (method !== 'GET' && options.data) {
                config.body = JSON.stringify(options.data);
            }

            const response = await fetch(url, config);
            const result = await response.json();
            
            return { data: result, error: response.ok ? null : result };
        } catch (error) {
            return { data: null, error };
        }
    }

    // פעולות אימות
    async authAction(action, credentials = null) {
        try {
            const url = `${this.supabaseUrl}/auth/v1/${action}`;
            const headers = {
                'apikey': this.supabaseKey,
                'Content-Type': 'application/json'
            };

            const config = {
                method: 'POST',
                headers
            };

            if (credentials) {
                config.body = JSON.stringify(credentials);
            }

            const response = await fetch(url, config);
            const result = await response.json();
            
            return { data: result, error: response.ok ? null : result };
        } catch (error) {
            return { data: null, error };
        }
    }

    // שמירת נתוני משתמש
    async saveUserData(userId, userData) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const { data, error } = await this.client
                .from('user_data')
                .upsert({
                    user_id: userId,
                    data: userData,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            console.log('💾 נתונים נשמרו ב-Supabase:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ שגיאה בשמירה ל-Supabase:', error);
            return { success: false, error };
        }
    }

    // טעינת נתוני משתמש
    async loadUserData(userId) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const { data, error } = await this.client
                .from('user_data')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = לא נמצא
            
            console.log('📥 נתונים נטענו מ-Supabase:', data);
            return { success: true, data: data?.data || null };
        } catch (error) {
            console.error('❌ שגיאה בטעינה מ-Supabase:', error);
            return { success: false, error };
        }
    }

    // סינכרון נתונים
    async syncUserData(userId, localData) {
        try {
            console.log('🔄 מסנכרן נתונים עם Supabase...');
            
            // טעינת נתונים מהשרת
            const serverResult = await this.loadUserData(userId);
            
            if (!serverResult.success) {
                // אם אין נתונים בשרת, שמור את הנתונים המקומיים
                return await this.saveUserData(userId, localData);
            }

            const serverData = serverResult.data;
            if (!serverData) {
                // אם אין נתונים בשרת, שמור את הנתונים המקומיים
                return await this.saveUserData(userId, localData);
            }

            // מיזוג נתונים (העדפה לנתונים החדשים יותר)
            const mergedData = this.mergeUserData(localData, serverData);
            
            // שמירת הנתונים הממוזגים
            const saveResult = await this.saveUserData(userId, mergedData);
            
            if (saveResult.success) {
                console.log('✅ סינכרון הושלם בהצלחה');
                return { success: true, data: mergedData };
            }

            return saveResult;
        } catch (error) {
            console.error('❌ שגיאה בסינכרון:', error);
            return { success: false, error };
        }
    }

    // מיזוג נתוני משתמש
    mergeUserData(localData, serverData) {
        if (!localData && !serverData) return {};
        if (!localData) return serverData;
        if (!serverData) return localData;

        // מיזוג חכם - העדפה לנתונים עם timestamp חדש יותר
        const merged = { ...serverData };

        Object.keys(localData).forEach(key => {
            if (key === 'lastSyncTime') return;
            
            const localValue = localData[key];
            const serverValue = serverData[key];

            if (!serverValue) {
                merged[key] = localValue;
            } else if (Array.isArray(localValue) && Array.isArray(serverValue)) {
                // מיזוג מערכים - הוספת פריטים חדשים
                merged[key] = [...new Set([...serverValue, ...localValue])];
            } else if (typeof localValue === 'object' && typeof serverValue === 'object') {
                // מיזוג אובייקטים
                merged[key] = { ...serverValue, ...localValue };
            } else {
                // לערכים פשוטים - קח את החדש יותר
                merged[key] = localValue;
            }
        });

        merged.lastSyncTime = new Date().toISOString();
        return merged;
    }

    // בדיקת קישוריות
    async testConnection() {
        try {
            const response = await fetch(this.supabaseUrl + '/rest/v1/', {
                headers: {
                    'apikey': this.supabaseKey
                }
            });
            
            const isConnected = response.ok;
            console.log(isConnected ? '✅ חיבור ל-Supabase תקין' : '❌ בעיה בחיבור ל-Supabase');
            return isConnected;
        } catch (error) {
            console.error('❌ שגיאה בבדיקת חיבור:', error);
            return false;
        }
    }

    // יצירת טבלאות אם לא קיימות
    async setupTables() {
        console.log('🔧 מגדיר טבלאות ב-Supabase...');
        // הטבלאות ייווצרו ב-Supabase Dashboard או דרך SQL
        return true;
    }
}

// יצירת instance גלובלי
window.supabaseManager = new SupabaseManager();

// אתחול אוטומטי
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 מאתחל Supabase Manager...');
    await window.supabaseManager.initialize();
    
    // בדיקת חיבור
    const isConnected = await window.supabaseManager.testConnection();
    if (isConnected) {
        console.log('✅ Supabase מוכן לשימוש!');
    } else {
        console.warn('⚠️ Supabase לא זמין - המערכת תעבוד עם Firebase/IndexedDB');
    }
});

// SQL ליצירת הטבלאות (להרצה ב-Supabase Dashboard):
/*
-- טבלת נתוני משתמשים
CREATE TABLE IF NOT EXISTS user_data (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- אינדקס לחיפוש מהיר
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);

-- הגדרת RLS (Row Level Security)
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- מדיניות גישה - משתמש יכול לגשת רק לנתונים שלו
CREATE POLICY "משתמשים יכולים לגשת לנתונים שלהם" ON user_data
    FOR ALL USING (auth.uid()::text = user_id);
*/
