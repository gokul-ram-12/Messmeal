import { NextResponse } from 'next/server';
import { adminDb } from '../../../../src/lib/firebaseAdmin';
import { sendAdminNotificationEmail } from '../../../../src/lib/mailer';

export async function POST(request) {
    try {
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
