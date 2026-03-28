// src/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
    getFirestore,
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager
} from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with persistent local cache (multi-tab safe)
let dbInstance;
try {
    dbInstance = initializeFirestore(app, {
        localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager()
        })
    });
} catch {
    // Fallback to non-configured instance if environment does not support this API
    dbInstance = getFirestore(app);
}
export const db = dbInstance;
export const appId = 'messmeal-default';

// Initialize Messaging conditionally (not supported in all browsers)
// Keep messaging internal - don't export to avoid initialization issues
let messagingInstance = null;

(async () => {
  try {
    const supported = await isSupported();
    if (supported) {
      messagingInstance = getMessaging(app);
    }
  } catch (err) {
    console.warn('Messaging not supported:', err);
  }
})();

// Safe exports
export const getMessagingInstance = () => messagingInstance;
