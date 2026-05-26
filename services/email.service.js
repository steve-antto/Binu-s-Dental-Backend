// import nodemailer from 'nodemailer';

/**
 * Email Service
 * TODO: Replace with actual SMTP/SendGrid configuration
 */

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} html - HTML body content
 */
export const sendEmail = async (to, subject, html) => {
    try {
        // TODO: Uncomment when SMTP is configured
        // const info = await transporter.sendMail({
        //     from: `"Binu's Dental Clinic" <${process.env.EMAIL_USER}>`,
        //     to,
        //     subject,
        //     html
        // });
        // console.log(`Email sent: ${info.messageId}`);
        // return info;

        console.log(`[EMAIL SERVICE] To: ${to} | Subject: ${subject}`);
        return { success: true, to, subject };
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
};

/**
 * Send appointment confirmation email
 */
export const sendAppointmentConfirmation = async (email, patientName, date, time) => {
    const subject = 'Appointment Confirmation - Binu\'s Dental Clinic';
    const html = `
        <h2>Appointment Confirmed</h2>
        <p>Dear ${patientName},</p>
        <p>Your appointment has been confirmed for:</p>
        <ul>
            <li><strong>Date:</strong> ${date}</li>
            <li><strong>Time:</strong> ${time}</li>
        </ul>
        <p>Thank you for choosing Binu's Dental Clinic!</p>
    `;
    return sendEmail(email, subject, html);
};

/**
 * Send payment receipt email
 */
export const sendPaymentReceipt = async (email, patientName, amount, method) => {
    const subject = 'Payment Receipt - Binu\'s Dental Clinic';
    const html = `
        <h2>Payment Receipt</h2>
        <p>Dear ${patientName},</p>
        <p>We have received your payment:</p>
        <ul>
            <li><strong>Amount:</strong> Rs. ${Number(amount).toLocaleString('en-IN')}</li>
            <li><strong>Method:</strong> ${method}</li>
            <li><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</li>
        </ul>
        <p>Thank you!</p>
    `;
    return sendEmail(email, subject, html);
};

export default { sendEmail, sendAppointmentConfirmation, sendPaymentReceipt };
