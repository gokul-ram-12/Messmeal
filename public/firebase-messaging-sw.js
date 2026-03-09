// Minimal Firebase Messaging service worker stub.
// This file exists so that the Firebase web SDK can successfully
// register a default service worker at `/firebase-messaging-sw.js`.
// Background push handling can be added here later if needed.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

