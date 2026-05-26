import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminauth.js';

// Import the functions from the admin controller
import { getAllStaff, getAuditLogs } from '../controllers/admin.controller.js';

const adminRouter = new Router();

// Only logged-in Admins can get past these two doors
adminRouter.use(authenticate, requireAdmin);

// Map the routes to their respective controller logic
adminRouter.get('/staff', getAllStaff);
adminRouter.get('/audit-logs', getAuditLogs);

export default adminRouter;