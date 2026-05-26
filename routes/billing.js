import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminauth.js';
import { getPaymentHistory, processPayment } from '../controllers/billing.controller.js';

const billingRouter = new Router();

// All billing routes require authentication
billingRouter.use(authenticate);

// GET /api/v1/billing - Fetch payment history
billingRouter.get('/', getPaymentHistory);

// POST /api/v1/billing/pay - Process a payment against an invoice
billingRouter.post('/pay', requireAdmin, processPayment);

export default billingRouter;
