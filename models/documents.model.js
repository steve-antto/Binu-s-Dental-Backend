import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    type: { type: String, enum: ['xray', 'prescription', 'consent_form', 'other'], default: 'other' }
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);