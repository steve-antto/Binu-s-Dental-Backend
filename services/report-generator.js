import Payment from '../models/payment.model.js';
import Treatment from '../models/treatments.model.js';
import Appointment from '../models/appointments.model.js';

/**
 * Generate revenue report data grouped by date
 * @param {string} startDate - Optional start date (YYYY-MM-DD)
 * @param {string} endDate - Optional end date (YYYY-MM-DD)
 */
export const generateRevenueReport = async (startDate, endDate) => {
    try {
        const matchStage = {};

        if (startDate || endDate) {
            matchStage.paidAt = {};
            if (startDate) matchStage.paidAt.$gte = new Date(startDate);
            if (endDate) matchStage.paidAt.$lte = new Date(`${endDate}T23:59:59.999Z`);
        }

        const pipeline = [];
        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        pipeline.push(
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } },
                    totalRevenue: { $sum: '$amount' },
                    transactionCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        );

        return Payment.aggregate(pipeline);
    } catch (error) {
        console.error('Error generating revenue report:', error);
        throw error;
    }
};

/**
 * Generate treatment distribution report
 */
export const generateTreatmentReport = async () => {
    try {
        return Treatment.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                    totalRevenue: { $sum: '$cost' },
                    avgCost: { $avg: '$cost' }
                }
            },
            { $sort: { count: -1 } }
        ]);
    } catch (error) {
        console.error('Error generating treatment report:', error);
        throw error;
    }
};

/**
 * Generate appointment stats report
 */
export const generateAppointmentReport = async () => {
    try {
        return Appointment.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
    } catch (error) {
        console.error('Error generating appointment report:', error);
        throw error;
    }
};

export default { generateRevenueReport, generateTreatmentReport, generateAppointmentReport };
