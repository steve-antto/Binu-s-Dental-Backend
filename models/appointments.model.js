import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientName: { type: String, default: '' },
    patientPhone: { type: String, default: '' },
    patientEmail: { type: String, default: '' },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    service: { type: String, default: 'Consultation' },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'no-show'], default: 'scheduled' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'partial'], default: 'pending' },
    paymentAmount: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    prescription: { type: String, default: '' },
    medicalHistory: { type: String, default: '' },
    photos: [{ filename: String, url: String, caption: { type: String, default: '' }, uploadedAt: { type: Date, default: Date.now } }],
    scans: [{ filename: String, url: String, uploadedAt: { type: Date, default: Date.now } }],
    reports: [{ filename: String, url: String, uploadedAt: { type: Date, default: Date.now } }],
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
    source: { type: String, enum: ['website', 'admin', 'walk-in'], default: 'admin' }
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);