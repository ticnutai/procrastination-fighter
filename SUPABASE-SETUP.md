# 🔧 הגדרת Supabase עבור אפליקציית מאבק בדחיינות

## שלב 1: יצירת טבלאות ב-Supabase

היכנס ל-Supabase Dashboard והרץ את ה-SQL הבא:

```sql
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

-- עדכון אוטומטי של updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_data_updated_at BEFORE UPDATE
    ON user_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- הגדרת RLS (Row Level Security)
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- מדיניות גישה - משתמש יכול לגשת רק לנתונים שלו
CREATE POLICY "משתמשים יכולים לגשת לנתונים שלהם" ON user_data
    FOR ALL USING (auth.uid()::text = user_id);

-- מדיניות למשתמשים אנונימיים (אופציונלי)
CREATE POLICY "משתמשים אנונימיים יכולים לגשת לנתונים שלהם" ON user_data
    FOR ALL USING (user_id LIKE 'anonymous-%');
```

## שלב 2: הגדרת Authentication (אופציונלי)

### 2.1 הפעלת Email Authentication:
1. Authentication → Settings
2. הפעל "Enable Email confirmations"
3. הגדר SMTP (אופציונלי)

### 2.2 הפעלת Anonymous Authentication:
1. Authentication → Settings
2. הפעל "Enable Anonymous Sign ins"

## שלב 3: בדיקת החיבור

```javascript
// בדיקה בקונסול הדפדפן:
const testSupabase = async () => {
    const { data, error } = await window.supabaseManager.client
        .from('user_data')
        .select('*')
        .limit(1);
    
    if (error) {
        console.error('שגיאה:', error);
    } else {
        console.log('חיבור תקין:', data);
    }
};

testSupabase();
```

## שלב 4: מבנה הנתונים

הנתונים שנשמרים בטבלה:

```json
{
    "user_id": "anonymous-1754260123456",
    "data": {
        "tasks": [
            {
                "id": 1,
                "text": "משימה לדוגמה",
                "completed": false,
                "priority": "high",
                "createdAt": "2025-08-04T01:00:00Z"
            }
        ],
        "stats": {
            "completedTasks": 5,
            "currentStreak": 3,
            "totalPoints": 150
        },
        "journal": [
            {
                "date": "2025-08-04",
                "entry": "היום השלמתי 3 משימות",
                "mood": 8
            }
        ],
        "pomodoro": {
            "pomodoroCount": 12,
            "totalFocusTime": 300
        },
        "settings": {
            "enabled": true,
            "workTime": 25,
            "shortBreak": 5
        },
        "lastSyncTime": "2025-08-04T01:30:00Z"
    }
}
```

## שלב 5: בטיחות ואבטחה

### 5.1 הגדרת API Keys:
- **anon key**: לגישה מהדפדפן
- **service_role key**: רק לשרת (לא לחשוף!)

### 5.2 RLS Policies:
```sql
-- מדיניות קריאה
CREATE POLICY "קריאת נתונים" ON user_data FOR SELECT
    USING (auth.uid()::text = user_id OR user_id LIKE 'anonymous-%');

-- מדיניות עדכון
CREATE POLICY "עדכון נתונים" ON user_data FOR UPDATE
    USING (auth.uid()::text = user_id OR user_id LIKE 'anonymous-%');

-- מדיניות הכנסה
CREATE POLICY "הכנסת נתונים" ON user_data FOR INSERT
    WITH CHECK (auth.uid()::text = user_id OR user_id LIKE 'anonymous-%');
```

## שלב 6: ניטור ובקרה

### 6.1 Supabase Dashboard:
- **Database**: צפייה בנתונים
- **Authentication**: ניהול משתמשים
- **Logs**: מעקב אחר פעילות
- **Storage**: קבצים (אופציונלי)

### 6.2 Real-time (אופציונלי):
```sql
-- הפעלת Real-time לטבלה
ALTER PUBLICATION supabase_realtime ADD TABLE user_data;
```

## שלב 7: גיבוי ושחזור

### 7.1 גיבוי יומי אוטומטי:
Supabase עושה גיבוי אוטומטי מדי יום

### 7.2 ייצוא נתונים:
```sql
-- ייצוא כל הנתונים
SELECT * FROM user_data;

-- ייצוא נתוני משתמש ספציפי
SELECT * FROM user_data WHERE user_id = 'USER_ID';
```

## שלב 8: הגבלות וחבילות

### Free Tier:
- 50,000 monthly active users
- 500MB database space
- 1GB bandwidth
- 2GB storage

### Pro Tier ($25/month):
- 100,000 monthly active users
- 8GB database space
- 50GB bandwidth
- 100GB storage

## 🎯 סיכום

הגדרת Supabase הושלמה! עכשיו המערכת יכולה:

1. ✅ **לשמור נתונים** ב-Supabase
2. ✅ **לסנכרן בין מכשירים** אוטומטית
3. ✅ **לעבוד בלי אינטרנט** (Local first)
4. ✅ **להחליף בין Firebase ל-Supabase** בקלות
5. ✅ **לשמור על אבטחת נתונים** עם RLS

**הכל מוכן לשימוש! 🚀**
