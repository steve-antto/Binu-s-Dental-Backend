import Payment from '../models/payment.model.js';
import Invoice from '../models/invoice.model.js';

export const getPaymentHistory = async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { patientId: req.user._id };
        const payments = await Payment.find(query)
            .populate('invoiceId', 'totalAmount balanceAmount status')
            .sort({ paidAt: -1 });
        return res.json({ payments });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching payments', error: error.message });
    }
};

export const processPayment = async (req, res) => {
    const { invoiceId, patientId, amount, method, transactionId } = req.body;

    try {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found.' });
        if (amount > invoice.balanceAmount) return res.status(400).json({ message: 'Payment exceeds balance.' });

        // 1. Record the payment
        const payment = await Payment.create({
            invoiceId,
            patientId,
            amount: Number(amount),
            method: method || 'Cash',
            transactionId: transactionId || ''
        });

        // 2. Update the invoice balance and status
        invoice.paidAmount += Number(amount);
        invoice.balanceAmount -= Number(amount);
        invoice.status = invoice.balanceAmount <= 0 ? 'paid' : 'partial';
        await invoice.save();

        return res.status(201).json({ payment, invoice });
    } catch (error) {
        return res.status(500).json({ message: 'Error processing payment', error: error.message });
    }
};