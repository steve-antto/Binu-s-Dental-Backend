import User from '../models/user.js';
import Staff from '../models/staff.model.js';
import Audit from '../models/auditing.model.js';

export const getAllStaff = async (req, res) => {
    try {
        const staffList = await Staff.find()
            .populate('userId', 'name email phone isActive')
            .select('-__v');
        return res.json({ staff: staffList });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching staff', error: error.message });
    }
};

export const getAuditLogs = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 50;
        const logs = await Audit.find()
            .populate('userId', 'name role')
            .sort({ createdAt: -1 })
            .limit(limit);
        return res.json({ logs });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching audit logs', error: error.message });
    }
};