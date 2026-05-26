import Payment from '../models/payment.model.js';
import Treatment from '../models/treatments.model.js';

export const getRevenueReport = async (req, res) => {
    try {
        // Groups payments by date (YYYY-MM-DD) and sums the amounts
        const revenueByDate = await Payment.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
                    totalRevenue: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return res.json({ report: revenueByDate });
    } catch (error) {
        return res.status(500).json({ message: 'Error generating revenue report', error: error.message });
    }
};

export const getTreatmentReport = async (req, res) => {
    try {
        // Counts how many times each treatment type was performed
        const treatmentCounts = await Treatment.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 },
                    totalValue: { $sum: "$cost" }
                }
            },
            { $sort: { count: -1 } }
        ]);

        return res.json({ report: treatmentCounts });
    } catch (error) {
        return res.status(500).json({ message: 'Error generating treatment report', error: error.message });
    }
};