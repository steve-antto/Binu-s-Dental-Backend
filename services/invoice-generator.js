import Invoice from '../models/invoice.model.js';
import User from '../models/user.js';
import Treatment from '../models/treatments.model.js';

/**
 * Generate an invoice object with all related data populated
 * @param {string} invoiceId - MongoDB ObjectId of the invoice
 * @returns {Object} Fully populated invoice data ready for PDF generation
 */
export const generateInvoiceData = async (invoiceId) => {
    try {
        const invoice = await Invoice.findById(invoiceId)
            .populate('patientId', 'name email phone')
            .populate('treatmentId', 'treatmentName type cost');

        if (!invoice) throw new Error('Invoice not found');

        const patient = await User.findById(invoice.patientId);

        return {
            invoiceNumber: `INV-${invoice._id.toString().slice(-8).toUpperCase()}`,
            date: invoice.createdAt,
            clinicName: "Binu's Dental Clinic",
            clinicAddress: 'Your Clinic Address Here',
            clinicPhone: 'Your Clinic Phone Here',
            patient: {
                name: patient?.name || 'N/A',
                email: patient?.email || 'N/A',
                phone: patient?.phone || 'N/A'
            },
            treatment: invoice.treatmentId ? {
                name: invoice.treatmentId.treatmentName,
                type: invoice.treatmentId.type,
                cost: invoice.treatmentId.cost
            } : null,
            totalAmount: invoice.totalAmount,
            paidAmount: invoice.paidAmount,
            balanceAmount: invoice.balanceAmount,
            status: invoice.status,
            paymentHistory: invoice.paymentHistory || []
        };
    } catch (error) {
        console.error('Error generating invoice data:', error);
        throw error;
    }
};

export default { generateInvoiceData };
