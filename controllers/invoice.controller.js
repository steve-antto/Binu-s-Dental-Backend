import Invoice from '../models/invoice.model.js';
import User from '../models/user.js';
import Treatment from '../models/treatments.model.js';
import { addTimelineEvent } from '../services/timeline.service.js';

/**
 * Helper: Formats and recalculates invoice financial states safely.
 * This guarantees the status matches the remaining balance perfectly.
 */
const normalizeInvoice = (invoiceDoc) => {
    const invoice = invoiceDoc.toObject ? invoiceDoc.toObject() : invoiceDoc;
    const totalAmount = Number(invoice.totalAmount || 0);
    const paidAmount = Number(invoice.paidAmount || 0);
    const balanceAmount = Math.max(0, totalAmount - paidAmount);

    let status = 'pending';
    if (balanceAmount === 0 && totalAmount > 0) status = 'paid';
    else if (paidAmount > 0 && balanceAmount > 0) status = 'partial';

    delete invoice.__v;

    return {
        ...invoice,
        totalAmount,
        paidAmount,
        balanceAmount,
        status,
        paymentHistory: Array.isArray(invoice.paymentHistory) ? invoice.paymentHistory : []
    };
};

/**
 * Helper: Aggregates metrics for the billing stats display cards.
 */
const calculateBillingSummary = (invoices) => {
    return invoices.reduce((acc, inv) => {
        const normalized = normalizeInvoice(inv);
        acc.totalBilled += normalized.totalAmount;
        acc.totalPaid += normalized.paidAmount;
        acc.pendingAmount += normalized.balanceAmount;
        acc.invoiceCount += 1;

        if (normalized.status === 'paid') acc.paidCount += 1;
        if (normalized.status === 'partial') acc.partialCount += 1;
        if (normalized.status === 'pending') acc.pendingCount += 1;
        return acc;
    }, {
        totalBilled: 0,
        totalPaid: 0,
        pendingAmount: 0,
        invoiceCount: 0,
        paidCount: 0,
        partialCount: 0,
        pendingCount: 0
    });
};

/**
 * Fetch invoices listing
 * - Admins and Doctors see everything.
 * - Patients can only access their own records.
 */
export const getInvoices = async (req, res) => {
    try {
        const query = (req.user.role === 'admin' || req.user.role === 'doctor')
            ? {}
            : { patientId: req.user._id };

        const list = await Invoice.find(query)
            .populate('patientId', 'name phone email')
            .sort({ createdAt: -1 });

        return res.json({ invoices: list.map(normalizeInvoice) });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return res.status(500).json({ message: 'Error fetching invoices' });
    }
};

/**
 * Fetch financial statistics summaries
 * - Used to render billing overview cards on the frontend dashboard.
 */
export const getInvoiceSummary = async (req, res) => {
    try {
        let targetPatientId = req.query.patientId;

        // Security check: patients cannot view summaries belonging to other IDs
        if (req.user.role === 'patient') {
            targetPatientId = req.user._id;
        }

        const query = targetPatientId ? { patientId: targetPatientId } : {};
        const invoices = await Invoice.find(query);
        const summary = calculateBillingSummary(invoices);

        return res.json({ patientId: targetPatientId || null, summary });
    } catch (error) {
        console.error('Error compiling invoice summary:', error);
        return res.status(500).json({ message: 'Error compiling summary statistics' });
    }
};

/**
 * Create a new billing ledger invoice entry
 */
export const createInvoice = async (req, res) => {
    const { patientId, totalAmount, treatmentId } = req.body;

    if (!patientId || !totalAmount || Number(totalAmount) <= 0) {
        return res.status(400).json({ message: 'Valid patientId and positive totalAmount are required.' });
    }

    try {
        // 1. Verify target patient profile exists
        const patient = await User.findOne({ _id: patientId, role: 'patient' });
        if (!patient) return res.status(404).json({ message: 'Patient document not found.' });

        // 2. If a treatment is linked, verify it belongs to this patient
        if (treatmentId) {
            const treatment = await Treatment.findOne({ _id: treatmentId, patientId });
            if (!treatment) return res.status(404).json({ message: 'Linked treatment record invalid for this patient.' });
        }

        // 3. Create the invoice
        const invoice = await Invoice.create({
            patientId,
            treatmentId: treatmentId || null,
            totalAmount: Number(totalAmount),
            paidAmount: 0,
            balanceAmount: Number(totalAmount),
            status: 'pending',
            paymentHistory: []
        });

        // 4. Log creation milestone to the patient's record timeline
        await addTimelineEvent(
            patientId,
            'billing',
            `Invoice Rs. ${Number(totalAmount).toLocaleString('en-IN')} generated`,
            { invoiceId: invoice._id, treatmentId: treatmentId || '', status: 'pending' }
        );

        return res.status(201).json({ invoice: normalizeInvoice(invoice) });
    } catch (error) {
        console.error('Error generating invoice:', error);
        return res.status(500).json({ message: 'Internal server error processing invoice allocation.' });
    }
};

/**
 * Record a payment collection against a outstanding invoice balance
 */
export const processInvoicePayment = async (req, res) => {
    const invoiceId = req.params.id;
    const amount = Number(req.body.amount);
    const method = String(req.body.method || 'Cash').trim();
    const paidAt = req.body.paidAt || new Date().toISOString();

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Positive numerical payment amount is required.' });
    }

    const allowedMethods = ['Cash', 'GPay', 'Card', 'UPI', 'Bank Transfer'];
    if (!allowedMethods.includes(method)) {
        return res.status(400).json({ message: `Method must be one of: ${allowedMethods.join(', ')}` });
    }

    try {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found.' });

        const currentSnapshot = normalizeInvoice(invoice);
        if (amount > currentSnapshot.balanceAmount) {
            return res.status(400).json({ message: `Payment cannot exceed outstanding balance of Rs. ${currentSnapshot.balanceAmount}` });
        }

        // Generate a localized tracking sub-record object for the sub-document list
        const newPaymentRecord = {
            amount,
            method,
            paidAt
        };

        // Mutate properties and re-evaluate overall payment state definitions
        invoice.paymentHistory.push(newPaymentRecord);
        invoice.paidAmount += amount;
        invoice.balanceAmount = Math.max(0, invoice.totalAmount - invoice.paidAmount);
        invoice.status = invoice.balanceAmount === 0 ? 'paid' : 'partial';

        await invoice.save();

        // Broadcast transaction confirmation onto user tracking dashboards
        await addTimelineEvent(
            invoice.patientId,
            'payment',
            `Rs. ${Number(amount).toLocaleString('en-IN')} paid via ${method}`,
            { invoiceId: invoice._id, method }
        );

        return res.json({ invoice: normalizeInvoice(invoice) });
    } catch (error) {
        console.error('Error capturing invoice settlement:', error);
        return res.status(500).json({ message: 'Server error processing transaction balance clearing.' });
    }
};