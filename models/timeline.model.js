import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    eventType: { type: String, enum: ['appointment', 'treatment', 'billing', 'payment', 'document', 'note'], required: true },
    description: { type: String, required: true },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }, // Flexible object for storing IDs (like invoiceId)
    eventDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Timeline', timelineSchema);