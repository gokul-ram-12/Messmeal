import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Template IDs — create these in EmailJS dashboard
const TEMPLATES = {
  ADD_ADMIN: import.meta.env.VITE_EMAILJS_TEMPLATE_ADD_ADMIN,
  TRANSFER_OWNERSHIP: import.meta.env.VITE_EMAILJS_TEMPLATE_TRANSFER_OWNERSHIP,
};

export const sendAdminNotificationEmail = async (toEmail, role, actionType) => {
  try {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY) {
      console.warn(
        'EmailJS not configured. ' +
        'Add VITE_EMAILJS_SERVICE_ID and ' +
        'VITE_EMAILJS_PUBLIC_KEY to ' +
        'Vercel environment variables.'
      );
      return;
    }

    const templateId = TEMPLATES[actionType];
    if (!templateId) {
      console.warn(`No template found for action: ${actionType}`);
      return;
    }

    const templateParams = {
      to_email: toEmail,
      to_name: toEmail.split('@')[0],
      role: role,
      action_type: actionType,
      app_url: 'https://messmeal4students.vercel.app',
      year: new Date().getFullYear(),
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      templateId,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log(`Email sent to ${toEmail} for ${actionType}`);
  } catch (error) {
    console.error('EmailJS error:', error);
  }
};
