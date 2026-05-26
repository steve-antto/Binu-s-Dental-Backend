import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accessLevel: { type: String, enum: ['superadmin', 'manager'], default: 'manager' },
    department: { type: String, default: 'Management' }
}, { timestamps: true });

export default mongoose.model('Admin', adminSchema);