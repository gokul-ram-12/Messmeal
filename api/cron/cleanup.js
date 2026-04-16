import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
    try {
        // Fallback for local dev or if ENV is set as a stringified JSON
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
            ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
            : null;

        if (serviceAccount) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET
            });
        } else {
            // If no service account, use default credentials (works on Vercel if configured)
            admin.initializeApp();
        }
    } catch (e) {
        console.error('Firebase Admin Init Error:', e);
    }
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

const APP_ID = 'messmeal-default'; // Shared app ID based on current project patterns

export default async function handler(req, res) {
    // Only allow Vercel Cron to trigger this
    if (req.headers['x-vercel-cron'] !== 'true') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('Starting Daily Cleanup Cron Job...');
    const results = {
        usersDeleted: 0,
        noticesDeleted: 0,
        errors: []
    };

    try {
        const now = Date.now();
        const sevenMonthsAgo = now - (7 * 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = now - (60 * 24 * 60 * 60 * 1000);

        // 1. PURGE INACTIVE USERS (7 MONTHS)
        const usersRef = db.collection('artifacts').doc(APP_ID).collection('users');
        const inactiveUsersSnap = await usersRef.where('lastLoginAt', '<', admin.firestore.Timestamp.fromMillis(sevenMonthsAgo)).get();

        for (const userDoc of inactiveUsersSnap.docs) {
            const userId = userDoc.id;
            try {
                // Delete user's proofs/complaints
                const proofsRef = db.collection('artifacts').doc(APP_ID).collection('public').doc('data').collection('proofs');
                const userProofs = await proofsRef.where('studentId', '==', userId).get();

                const batch = db.batch();
                userProofs.forEach(p => batch.delete(p.ref));

                // Delete user doc
                batch.delete(userDoc.ref);
                await batch.commit();

                // Delete Auth record
                await auth.deleteUser(userId);

                results.usersDeleted++;
            } catch (err) {
                console.error(`Error deleting user ${userId}:`, err);
                results.errors.push(`User ${userId}: ${err.message}`);
            }
        }

        // 2. PURGE OLD NOTICES (60 DAYS)
        const noticesRef = db.collection('artifacts').doc(APP_ID).collection('public').doc('data').collection('notices');
        const oldNoticesSnap = await noticesRef.where('createdAt', '<', admin.firestore.Timestamp.fromMillis(sixtyDaysAgo)).get();

        if (!oldNoticesSnap.empty) {
            const batch = db.batch();
            oldNoticesSnap.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
            results.noticesDeleted = oldNoticesSnap.size;
        }

        console.log('Cleanup Complete:', results);
        return res.status(200).json(results);

    } catch (error) {
        console.error('System Cleanup Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
