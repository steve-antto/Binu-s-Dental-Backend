import Appointment from '../models/appointments.model.js';
import Invoice from '../models/invoice.model.js';
import User from '../models/user.js';

export const getDashboardStats = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Run all DB queries in parallel for maximum speed
        const [patientsCount, todaysAppointments, totalRevenueData] = await Promise.all([
            User.countDocuments({ role: 'patient' }),
            Appointment.find({ date: today }).countDocuments(),
            Invoice.aggregate([
                { $group: { _id: null, totalCollected: { $sum: '$paidAmount' } } }
            ])
        ]);

        const totalRevenue = totalRevenueData.length > 0 ? totalRevenueData[0].totalCollected : 0;

        return res.json({
            stats: {
                totalPatients: patientsCount,
                appointmentsToday: todaysAppointments,
                totalRevenueCollected: totalRevenue
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
    }
};