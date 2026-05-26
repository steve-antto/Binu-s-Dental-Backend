import Audit from '../models/auditing.model.js';

export const createAuditLog = async ({ userId, action, collectionName, targetId, details, ipAddress }) => {
    return Audit.create({ userId, action, collectionName, targetId, details, ipAddress: ipAddress || '' });
};

export const getAuditLogs = async (limit = 50) => Audit.find().populate('userId', 'name role').sort({ createdAt: -1 }).limit(limit);
export const getAuditLogsByUser = async (userId, limit = 50) => Audit.find({ userId }).sort({ createdAt: -1 }).limit(limit);

export default { createAuditLog, getAuditLogs, getAuditLogsByUser };
