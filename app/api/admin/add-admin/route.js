import { NextResponse } from 'next/server';
import { adminDb } from '../../../../src/lib/firebaseAdmin';
import { sendAdminNotificationEmail } from '../../../../src/lib/mailer';

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // 1. Find the user by email in Firestore
        // Path: artifacts/messmeal-default/users
        const usersRef = adminDb.collection('artifacts').doc('messmeal-default').collection('users');
        const snap = await usersRef.where('email', '==', email.trim()).get();

        if (snap.empty) {
            return NextResponse.json({ error: 'User not found. They must sign up first.' }, { status: 404 });
        }

        const userDoc = snap.docs[0];
        const userId = userDoc.id;

        // 2. Update the user's role to admin
        await userDoc.ref.update({
            role: 'admin',
            approved: true
        });

        // 3. Send notification email (doesn't block response)
        // We wrap in try/catch as per requirements to ensure DB update isn't reversed on email failure
        try {
            await sendAdminNotificationEmail(email.trim(), 'Admin', 'ADD_ADMIN');
        } catch (mailError) {
            console.error('Failed to send admin notification email:', mailError);
        }

        return NextResponse.json({ success: true, message: `${email} is now an admin!` });
    } catch (error) {
        console.error('Add Admin API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
