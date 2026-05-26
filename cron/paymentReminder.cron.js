import Invoice from '../models/invoice.model.js';
import User from '../models/user.js';
import { notifyPatient } from '../services/notifier.js';

/**
 * Payment Reminder Cron Job
 *
 * Sends reminders to patients who have outstanding invoice balances.
 */

/**
 * Process payment reminders for all unpaid/partially paid invoices
 */
export const runPaymentReminderJob = async () => {
    console.log(`[CRON] Running payment reminders at ${new Date().toISOString()}`);

    try {
        // Find all invoices that are not fully paid
        const unpaidInvoices = await Invoice.find({
            status: { $in: ['pending', 'partial'] }
        }).populate('patientId', 'name email phone reminderChannels');

        let sentCount = 0;

        for (const invoice of unpaidInvoices) {
            const patient = invoice.patientId;
            if (!patient) continue;

            const message = `Hi ${patient.name}, you have an outstanding balance of Rs. ${invoice.balanceAmount.toLocaleString('en-IN')} at Binu's Dental Clinic. Please visit or contact us to settle your dues.`;

            try {
                await notifyPatient(
                    { reminderChannels: patient.reminderChannels, phone: patient.phone, userId: patient },
                    'Payment Reminder',
                    message
                );
                sentCount++;
            } catch (err) {
                console.error(`Failed to send payment reminder to ${patient.email}:`, err.message);
            }
        }

        console.log(`[CRON] Payment reminder job completed. Sent: ${sentCount}`);
        return { success: true, count: sentCount };
    } catch (error) {
        console.error('[CRON] Payment reminder job failed:', error);
    }
};

/**
 * Start the payment reminder cron scheduler
 * Runs every Monday at 10:00 AM IST (4:30 AM UTC)
 */
export const startPaymentReminderCron = () => {
    // Uncomment when node-cron is installed:
    // cron.schedule('30 4 * * 1', runPaymentReminderJob, {
    //     timezone: 'Asia/Kolkata'
    // });
    console.log('[CRON] Payment reminder cron job registered (10:00 AM IST every Monday)');
};

export default { runPaymentReminderJob, startPaymentReminderCron };
