const CACHE_NAME = 'procrastination-app-v1';
const urlsToCache = [
  './',
  './procrastination-app.html',
  './manifest.json'
];

// Install event
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for data
self.addEventListener('sync', function(event) {
  if (event.tag == 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // כאן ניתן להוסיף סינכרון נתונים רקע
  return Promise.resolve();
}

// Push notifications (if needed in future)
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'זמן לחזור למשימות!',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiByeD0iMjQiIGZpbGw9InVybCgjZ3JhZGllbnQwXzBfMSkiLz4KPHN0eWxlPi5zdGFye2ZpbGw6I2ZmZn0uc3RhcjI6ZXZlbnswJX0uc3RhcjI6b2RkeyZhbmltYXRpb246Ym91bmNlIDJzIGluZmluaXRlO30uYm91bmNle0BrZXlmcmFtZXMgYm91bmNle18wJSw0MCV7dHJhbnNmb3JtOnNjYWxlKDEpfTIwJXt0cmFuc2Zvcm06c2NhbGUoMS4xKX19fTwvc3R5bGU+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MF8wXzEiIHgxPSIwIiB5MT0iMCIgeDI9IjE5MiIgeTI9IjE5MiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjNjY3ZWVhIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzc2NGJhMiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjx0ZXh0IHg9Ijk2IiB5PSIxMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjcwIiBmb250LWZhbWlseT0iQXJpYWwiPvCfjq88L3RleHQ+Cjx0ZXh0IHg9Ijk2IiB5PSIxNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE2IiBmb250LWZhbWlseT0iQXJpYWwiPtedzt7eiNee15fXlSDXkNef15XXqDwvdGV4dD4KPC9zdmc+',
    badge: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzYiIGN5PSIzNiIgcj0iMzYiIGZpbGw9IiM2NjdlZWEiLz4KPHN2ZyB4PSIyNCIgeT0iMjQiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+Cjx0ZXh0IHg9IjEyIiB5PSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCI+8J+OrzwvdGV4dD4KPC9zdmc+Cjwvc3ZnPg==',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('מאבק בדחיינות', options)
  );
});
