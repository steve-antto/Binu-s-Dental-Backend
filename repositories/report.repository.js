import Payment from '../models/payment.model.js';
import Treatment from '../models/treatments.model.js';

export const getRevenueByDate = async () => Payment.aggregate([
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } }, totalRevenue: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
]);

export const getTreatmentBreakdown = async () => Treatment.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 }, totalValue: { $sum: '$cost' } } },
    { $sort: { count: -1 } }
]);

export default { getRevenueByDate, getTreatmentBreakdown };
