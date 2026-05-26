import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    treatmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment' },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, required: true },
    paymentHistory: [{
        amount: { type: Number, required: true },
        method: { type: String, enum: ['Cash', 'GPay', 'Card', 'UPI', 'Bank Transfer'], default: 'Cash' },
        paidAt: { type: Date, default: Date.now }
    }],
    status: { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
