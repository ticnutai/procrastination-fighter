// דוגמה למערכת משתמשים פשוטה
class UserSystem {
    constructor() {
        this.currentUser = localStorage.getItem('current_user') || null;
        this.users = JSON.parse(localStorage.getItem('all_users') || '{}');
    }
    
    createUser(username, password) {
        const userId = 'user_' + Date.now();
        this.users[userId] = {
            username: username,
            password: password, // בפרויקט אמיתי - להצפין!
            data: {
                tasks: [],
                stats: {},
                journal: [],
                settings: {}
            },
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('all_users', JSON.stringify(this.users));
        return userId;
    }
    
    login(username, password) {
        const user = Object.values(this.users).find(u => 
            u.username === username && u.password === password
        );
        
        if (user) {
            this.currentUser = Object.keys(this.users).find(key => 
                this.users[key] === user
            );
            localStorage.setItem('current_user', this.currentUser);
            this.loadUserData();
            return true;
        }
        return false;
    }
    
    loadUserData() {
        if (this.currentUser && this.users[this.currentUser]) {
            const userData = this.users[this.currentUser].data;
            
            // טעינת נתונים לאפליקציה
            tasks = userData.tasks || [];
            completedTasks = userData.stats?.completedTasks || 0;
            journalEntries = userData.journal || [];
            // וכו'...
            
            // עדכון התצוגה
            updateUI();
        }
    }
    
    saveUserData() {
        if (this.currentUser) {
            this.users[this.currentUser].data = {
                tasks: tasks,
                stats: { completedTasks, currentStreak, totalPoints },
                journal: journalEntries,
                settings: notificationSettings
            };
            
            localStorage.setItem('all_users', JSON.stringify(this.users));
        }
    }
}
