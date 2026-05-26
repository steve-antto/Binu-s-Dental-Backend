import Appointment from '../models/appointments.model.js';
import Reminder from '../models/remainder.model.js';
import { notifyPatient } from './notifier.js';

/**
 * Checks for appointments happening tomorrow and sends reminders.
 */
export const processDailyReminders = async () => {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateString = tomorrow.toISOString().split('T')[0];

        // Find all scheduled appointments for tomorrow
        const upcomingAppointments = await Appointment.find({ date: dateString, status: 'scheduled' })
            .populate({
                path: 'patientId',
                populate: { path: 'userId', select: 'email name' } // Get email from User model
            });

        let sentCount = 0;

        for (const appointment of upcomingAppointments) {
            const patient = appointment.patientId;
            const message = `Hi ${patient.userId.name}, this is a reminder for your dental appointment tomorrow at ${appointment.time}.`;

            // Send Notification
            await notifyPatient(patient, 'Appointment Reminder', message);

            // Log it in the Reminders collection
            await Reminder.create({
                patientId: patient._id,
                appointmentId: appointment._id,
                type: 'upcoming_appointment',
                message: message,
                scheduledFor: new Date(),
                status: 'sent',
                channelUsed: patient.reminderChannels[0] || 'whatsapp'
            });

            sentCount++;
        }

        console.log(`Processed ${sentCount} reminders for ${dateString}`);
        return { success: true, count: sentCount };

    } catch (error) {
        console.error('Error processing reminders:', error);
        throw error;
    }
};