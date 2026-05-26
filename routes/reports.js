import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminauth.js';
import { getRevenueReport, getTreatmentReport } from '../controllers/report.controller.js';

const reportsRouter = new Router();

// All report routes require authentication and admin access
reportsRouter.use(authenticate, requireAdmin);

// GET /api/v1/report/revenue - Revenue aggregation by date
reportsRouter.get('/revenue', getRevenueReport);

// GET /api/v1/report/treatments - Treatment type breakdown
reportsRouter.get('/treatments', getTreatmentReport);

export default reportsRouter;
