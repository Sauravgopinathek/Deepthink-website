// Service Worker for Push Notifications
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'New notification from DeepThink',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('DeepThink', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Cache API responses for offline functionality
self.addEventListener('fetch', function(event) {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      caches.open('api-cache').then(function(cache) {
        return cache.match(event.request).then(function(response) {
          if (response) {
            // Return cached version
            fetch(event.request).then(function(fetchResponse) {
              cache.put(event.request, fetchResponse.clone());
            });
            return response;
          }
          // Fetch and cache
          return fetch(event.request).then(function(fetchResponse) {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});