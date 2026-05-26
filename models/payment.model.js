import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['Cash', 'GPay', 'Card', 'UPI', 'Bank Transfer'], required: true },
    transactionId: { type: String, default: '' },
    paidAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);