// Example imports if you install these later:
// import nodemailer from 'nodemailer';
// import twilio from 'twilio';

export const sendEmail = async (to, subject, body) => {
    // TODO: Implement Nodemailer or SendGrid logic here
    console.log(`[EMAIL SENT] To: ${to} | Subject: ${subject}`);
    console.log(`[CONTENT]: ${body}`);
    return true;
};

export const sendSMS = async (phone, message) => {
    // TODO: Implement Twilio or MSG91 logic here
    console.log(`[SMS SENT] To: ${phone} | Message: ${message}`);
    return true;
};

export const sendWhatsApp = async (phone, message) => {
    // TODO: Implement WhatsApp Business API logic here
    console.log(`[WHATSAPP SENT] To: ${phone} | Message: ${message}`);
    return true;
};

/**
 * Smart router that sends the message to the patient's preferred channels
 */
export const notifyPatient = async (patient, subject, message) => {
    const channels = patient.reminderChannels || ['whatsapp'];

    if (channels.includes('email') && patient.userId?.email) {
        await sendEmail(patient.userId.email, subject, message);
    }
    if (channels.includes('sms') && patient.phone) {
        await sendSMS(patient.phone, message);
    }
    if (channels.includes('whatsapp') && patient.phone) {
        await sendWhatsApp(patient.phone, message);
    }
};