import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    type: { type: String, enum: ['upcoming_appointment', 'follow_up', 'payment_due'], required: true },
    message: { type: String, required: true },
    scheduledFor: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    channelUsed: { type: String, enum: ['whatsapp', 'sms', 'email', 'telegram'], default: 'whatsapp' }
}, { timestamps: true });

export default mongoose.model('Reminder', reminderSchema);