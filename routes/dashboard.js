import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminauth.js';

// Import the function from the dashboard controller
import { getDashboardStats } from '../controllers/dashboard.controller.js';

const dashboardRouter = new Router();

// Protect the dashboard route (assuming only admins/doctors should see the main stats)
dashboardRouter.use(authenticate, requireAdmin);

// Map the route to the controller logic
dashboardRouter.get('/', getDashboardStats);

export default dashboardRouter;