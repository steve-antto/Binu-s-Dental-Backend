import mongoose from 'mongoose';

const treatmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    treatmentName: { type: String, required: true },
    type: { type: String, enum: ['rootcanal', 'dental_crown', 'implants', 'extraction_impaction', 'cleaning', 'other'], default: 'other' },
    notes: { type: String, default: '' },
    cost: { type: Number, default: 0, required: true },
    status: { type: String, enum: ['planned', 'in-progress', 'completed'], default: 'planned' }
}, { timestamps: true });

export default mongoose.model('Treatment', treatmentSchema);