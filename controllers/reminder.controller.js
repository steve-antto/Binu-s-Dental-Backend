import Reminder from '../models/remainder.model.js';

export const getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find()
            .populate('patientId', 'phone')
            .sort({ scheduledFor: 1 });
        return res.json({ reminders });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching reminders', error: error.message });
    }
};

export const createReminder = async (req, res) => {
    const { patientId, appointmentId, type, message, scheduledFor, channelUsed } = req.body;

    try {
        const reminder = await Reminder.create({
            patientId,
            appointmentId: appointmentId || null,
            type,
            message,
            scheduledFor,
            channelUsed: channelUsed || 'whatsapp'
        });

        return res.status(201).json({ reminder });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating reminder', error: error.message });
    }
};