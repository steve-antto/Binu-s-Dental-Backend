import mongoose from 'mongoose';

const treatmentScheduleSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientName: { type: String, required: true },
    treatmentName: { type: String, required: true },
    treatmentDays: { type: Number, required: true },
    sessions: [{
        date: { type: String, required: true }, // YYYY-MM-DD
        startTime: { type: String, required: true }, // HH:mm in 24-hour format
        endTime: { type: String, required: true } // HH:mm in 24-hour format
    }],
    notes: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('TreatmentSchedule', treatmentScheduleSchema);
