import mongoose from 'mongoose';

const auditingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who performed the action
    action: { type: String, required: true }, // e.g., 'DELETED_INVOICE', 'UPDATED_PATIENT'
    collectionName: { type: String, required: true }, // Which table was affected
    targetId: { type: mongoose.Schema.Types.ObjectId }, // ID of the affected document
    details: { type: mongoose.Schema.Types.Mixed }, // What exactly changed
    ipAddress: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Audit', auditingSchema);