import mongoose from 'mongoose';

const scanReportSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' }, // Link to the actual image file
    scanType: { type: String, required: true }, // e.g., OPG, CBCT
    findings: { type: String, required: true },
    dentistRemarks: { type: String, default: '' },
    scanDate: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('ScanReport', scanReportSchema);