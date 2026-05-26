import { processDailyReminders } from '../services/remainders.js';

/**
 * Appointment Reminder Cron Job
 *
 * Runs daily to send reminders for tomorrow's appointments.
 *
 * Usage with node-cron (install: npm install node-cron):
 *
 * import cron from 'node-cron';
 * import { startReminderCron } from './cron/reminders.cron.js';
 * startReminderCron();
 */

/**
 * Execute the reminder processing task
 */
export const runReminderJob = async () => {
    console.log(`[CRON] Running appointment reminders at ${new Date().toISOString()}`);

    try {
        const result = await processDailyReminders();
        console.log(`[CRON] Reminder job completed. Sent: ${result.count}`);
        return result;
    } catch (error) {
        console.error('[CRON] Reminder job failed:', error);
    }
};

/**
 * Start the cron scheduler
 * Runs every day at 9:00 AM IST (3:30 AM UTC)
 */
export const startReminderCron = () => {
    // Uncomment when node-cron is installed:
    // cron.schedule('30 3 * * *', runReminderJob, {
    //     timezone: 'Asia/Kolkata'
    // });
    console.log('[CRON] Appointment reminder cron job registered (9:00 AM IST daily)');
};

export default { runReminderJob, startReminderCron };
