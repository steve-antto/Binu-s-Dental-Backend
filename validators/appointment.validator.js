/**
 * Appointment request validators
 */

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD

export const validateCreateAppointment = (req, res, next) => {
    const { date, time } = req.body;

    if (!date) {
        return res.status(400).json({ message: 'Appointment date is required.' });
    }

    if (!DATE_REGEX.test(date)) {
        return res.status(400).json({ message: 'Date must be in YYYY-MM-DD format.' });
    }

    // Ensure date is not in the past
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
        return res.status(400).json({ message: 'Appointment date cannot be in the past.' });
    }

    if (time && typeof time !== 'string') {
        return res.status(400).json({ message: 'Time must be a string (e.g., "10:00 AM").' });
    }

    next();
};

export const validateUpdateStatus = (req, res, next) => {
    const { status } = req.body;
    const allowedStatuses = ['scheduled', 'completed', 'cancelled', 'no-show'];

    if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
    }

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
        });
    }

    next();
};

export default { validateCreateAppointment, validateUpdateStatus };
