import nodemailer from 'nodemailer';

/**
 * Reusable utility for sending professional HTML emails via Gmail SMTP.
 * Requires EMAIL_USER and EMAIL_APP_PASSWORD environment variables.
 */

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

/**
 * Sends a notification email to a user about admin/ownership changes.
 * @param {string} toEmail - Recipient email
 * @param {string} role - The user's role (e.g., 'Admin', 'Super Admin')
 * @param {string} actionType - 'ADD_ADMIN' | 'TRANSFER_OWNERSHIP'
 */
export const sendAdminNotificationEmail = async (toEmail, role, actionType) => {
    let subject = '';
    let htmlContent = '';

    const baseStyle = `
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #eee;
        border-radius: 10px;
    `;

    const headerStyle = `
        background-color: #0057FF;
        color: white;
        padding: 15px;
        text-align: center;
        border-radius: 10px 10px 0 0;
        margin: -20px -20px 20px -20px;
    `;

    const buttonStyle = `
        display: inline-block;
        padding: 12px 24px;
        background-color: #0057FF;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        margin-top: 20px;
    `;

    switch (actionType) {
        case 'ADD_ADMIN':
            subject = 'Welcome to the MESSMATE Admin Team! 🍽️';
            htmlContent = `
                <div style="${baseStyle}">
                    <div style="${headerStyle}">
                        <h1>MESSMATE</h1>
                    </div>
                    <h2>Hello Admin,</h2>
                    <p>We are excited to welcome you to the <strong>MESSMATE</strong> admin team!</p>
                    <p>Your account has been granted <strong>Admin</strong> privileges. You can now manage menus, view feedback, and help streamline the mess system.</p>
                    <p>Log in to your dashboard to get started:</p>
                    <a href="https://messmate-vitap.vercel.app/admin" style="${buttonStyle}">Go to Admin Dashboard</a>
                    <p style="margin-top: 30px; font-size: 0.9em; color: #777;">
                        If you have any questions, please contact the Super Admin team.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="text-align: center; font-size: 0.8em; color: #999;">
                        © ${new Date().getFullYear()} MESSMATE | Built with ❤️ for VIT-AP
                    </p>
                </div>
            `;
            break;

        case 'TRANSFER_OWNERSHIP':
            subject = 'MESSMATE Ownership Transfer Alert 🛡️';
            htmlContent = `
                <div style="${baseStyle}">
                    <div style="${headerStyle}">
                        <h1>MESSMATE</h1>
                    </div>
                    <h2>Ownership Transferred</h2>
                    <p>This is an important notification regarding your MESSMATE account.</p>
                    <p>You have been appointed as the <strong>Super Admin</strong> for the mess system.</p>
                    <p>As Super Admin, you now have full control over the mess configuration, admin team management, and critical system settings.</p>
                    <a href="https://messmate-vitap.vercel.app/admin" style="${buttonStyle}">Manage System</a>
                    <p style="margin-top: 30px; font-size: 0.9em; color: #777; background: #fff8e1; padding: 10px; border-left: 4px solid #ffc107;">
                        <strong>Note:</strong> Please ensure your account security is up to date, as you now hold the highest level of system access.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="text-align: center; font-size: 0.8em; color: #999;">
                        © ${new Date().getFullYear()} MESSMATE | Secure Mess Management
                    </p>
                </div>
            `;
            break;

        default:
            console.error('Invalid actionType for email notification');
            return;
    }

    try {
        await transporter.sendMail({
            from: `"MESSMATE Notifications" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: subject,
            html: htmlContent,
        });
        console.log(`Notification email sent to ${toEmail} for ${actionType}`);
    } catch (error) {
        console.error('Nodemailer Error:', error);
        // We don't throw the error so that the app doesn't crash if email fails
    }
};
