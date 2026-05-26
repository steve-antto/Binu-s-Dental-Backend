import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roleDesignation: { type: String, enum: ['Nurse', 'Receptionist', 'Hygienist', 'Technician'], required: true },
    shift: { type: String, enum: ['Morning', 'Evening', 'Night'], default: 'Morning' },
    salary: { type: Number }
}, { timestamps: true });

export default mongoose.model('Staff', staffSchema);