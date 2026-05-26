/**
 * Invoice request validators
 */

const ALLOWED_METHODS = ['Cash', 'GPay', 'Card', 'UPI', 'Bank Transfer'];

export const validateCreateInvoice = (req, res, next) => {
    const { patientId, totalAmount } = req.body;

    if (!patientId) {
        return res.status(400).json({ message: 'patientId is required.' });
    }

    if (!totalAmount || Number(totalAmount) <= 0) {
        return res.status(400).json({ message: 'A positive totalAmount is required.' });
    }

    next();
};

export const validateProcessPayment = (req, res, next) => {
    const { amount, method } = req.body;

    if (!amount || Number(amount) <= 0) {
        return res.status(400).json({ message: 'A positive payment amount is required.' });
    }

    if (method && !ALLOWED_METHODS.includes(method)) {
        return res.status(400).json({
            message: `Invalid payment method. Must be one of: ${ALLOWED_METHODS.join(', ')}`
        });
    }

    next();
};

export default { validateCreateInvoice, validateProcessPayment };
