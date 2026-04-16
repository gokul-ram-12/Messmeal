import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '../../../../src/lib/firebaseAdmin';
import { sendAdminNotificationEmail } from '../../../../src/lib/mailer';

async function verifyAuth(request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return null;
        }

        const token = authHeader.split('Bearer ')[1];
        return await adminAuth.verifyIdToken(token);
    } catch {
        return null;
    }
}

async function isSuperAdmin(uid) {
    try {
        const userDoc = await adminDb
            .collection('artifacts')
            .doc('messmeal-default')
            .collection('users')
            .doc(uid)
            .get();

        return userDoc.data()?.role === 'super_admin';
    } catch {
        return false;
    }
}

export async function POST(request) {
    try {
        const authUser = await verifyAuth(request);
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const superAdminAllowed = await isSuperAdmin(authUser.uid);
        if (!superAdminAllowed) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { newEmail } = await request.json();

        if (!newEmail) {
            return NextResponse.json({ error: 'New owner email is required' }, { status: 400 });
        }

        // 1. Update the superAdminEmail in the config/settings document
        // Path: artifacts/messmeal-default/config/settings
        const settingsRef = adminDb.collection('artifacts').doc('messmeal-default').collection('config').doc('settings');

        await settingsRef.set({
            superAdminEmail: newEmail.trim(),
            updatedAt: new Date()
        }, { merge: true });

        // 2. Send notification email (doesn't block response)
        try {
            await sendAdminNotificationEmail(newEmail.trim(), 'Super Admin', 'TRANSFER_OWNERSHIP');
        } catch (mailError) {
            console.error('Failed to send ownership transfer email:', mailError);
        }

        return NextResponse.json({ success: true, message: `Ownership transferred to ${newEmail}` });
    } catch (error) {
        console.error('Transfer Ownership API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
