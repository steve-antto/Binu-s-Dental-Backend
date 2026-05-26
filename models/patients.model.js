import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    phone: { type: String, default: '' },
    dob: { type: String, default: '' },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
    bloodGroup: { type: String, default: '' },
    address: { type: String, default: '' },
    reminderChannels: { type: [String], default: ['whatsapp'] }
}, { timestamps: true });

export default mongoose.model('Patient', patientSchema);