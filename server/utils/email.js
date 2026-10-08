const nodemailer = require('nodemailer');
require('dotenv').config();

function getTransporter() {
    const user = (process.env.EMAIL_USER || '').trim();
    const pass = (process.env.EMAIL_PASS || '').trim().replace(/\s+/g, '');

    if (!user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user, pass }
    });
}

async function sendEmail({ to, subject, html, text }) {
    const transporter = getTransporter();
    const sender = (process.env.EMAIL_USER || '').trim();

    if (!transporter || !to) {
        console.log(`[Email Skipped/Mock] To: ${to} | Subject: ${subject}`);
        return { success: true, mocked: true };
    }

    try {
        const info = await transporter.sendMail({
            from: `"Fire Equipment Maintenance System" <${sender}>`,
            to: to.trim(),
            subject,
            text,
            html
        });
        console.log(`[Email Sent] MessageId: ${info.messageId} to ${to}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending error:', error.message);
        return { success: false, error: error.message };
    }
}

module.exports = {
    sendEmail
};
