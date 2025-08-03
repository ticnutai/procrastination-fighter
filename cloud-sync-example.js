// דוגמה לקוד סנכרון ענן פשוט
function saveToCloud(data) {
    // שמירה ל-Google Drive, Dropbox או שירות אחר
    const jsonData = JSON.stringify(data);
    
    // דוגמה לשמירה לקובץ JSON
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // העלאה אוטומטית או ידנית
    uploadToCloud(blob);
}

function loadFromCloud() {
    // טעינה מהענן
    fetch('https://your-cloud-service/user-data.json')
        .then(response => response.json())
        .then(data => {
            // עדכון הנתונים המקומיים
            updateLocalData(data);
        });
}

// סנכרון אוטומטי כל 5 דקות
setInterval(() => {
    if (navigator.onLine) {
        syncWithCloud();
    }
}, 5 * 60 * 1000);
