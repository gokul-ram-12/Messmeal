// MessMeal Service Worker — handles push events and offline notifications

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  self.clients.claim();
});

// Handle push messages from FCM
self.addEventListener('push', event => {
  let data = { title: 'MessMeal', body: 'You have a new notification.' };
  try { data = event.data.json(); } catch { /* ignore */ }

  event.waitUntil(
    self.registration.showNotification(data.title || 'MessMeal', {
      body: data.body || '',
      icon: data.icon || '/pwa-512x512.png',
      badge: '/pwa-192x192.png',
      tag: data.tag || 'messmeal',
      renotify: false,
      data: data.url ? { url: data.url } : {},
      vibrate: [200, 100, 200],
    })
  );
});

// Handle notification click — focus or open app
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});