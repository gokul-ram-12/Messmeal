/* eslint-disable no-undef */
import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
            ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
            : null;

        if (serviceAccount) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET
            });
            console.log('Firebase Admin initialized successfully');
        } else {
            console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is missing. Admin SDK not initialized.');
        }
    } catch (error) {
        console.error('Firebase Admin initialization error:', error);
    }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();

export default admin;
