import mongoose from 'mongoose';

const medicalHistorySchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    allergies: { type: [String], default: [] },
    chronicConditions: { type: [String], default: [] }, // e.g., Diabetes, Hypertension
    pastSurgeries: { type: [String], default: [] },
    currentMedications: { type: [String], default: [] },
    notes: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('MedicalHistory', medicalHistorySchema);