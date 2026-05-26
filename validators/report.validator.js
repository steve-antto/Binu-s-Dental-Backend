/**
 * Report request validators
 */

export const validateDateRange = (req, res, next) => {
    const { startDate, endDate } = req.query;
    const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

    if (startDate && !DATE_REGEX.test(startDate)) {
        return res.status(400).json({ message: 'startDate must be in YYYY-MM-DD format.' });
    }

    if (endDate && !DATE_REGEX.test(endDate)) {
        return res.status(400).json({ message: 'endDate must be in YYYY-MM-DD format.' });
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({ message: 'startDate cannot be after endDate.' });
    }

    next();
};

export default { validateDateRange };
