import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    name: { type: String, required: true },
    qualifications: { type: String, required: true },
    bio: { type: String, required: true },
    patientsTreated: { type: String, default: '100+' },
    experienceYears: { type: String, default: '5+' },
    image: { type: String, default: '' },
    specialties: { type: [String], default: [] },
    consultationFee: { type: Number, default: 500 },
    availableDays: { type: [String], default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }
}, { timestamps: true });

export default mongoose.model('Doctor', doctorSchema);