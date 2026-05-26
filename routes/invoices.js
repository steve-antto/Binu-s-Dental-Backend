import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminauth.js';
import {
    getInvoices,
    getInvoiceSummary,
    createInvoice,
    processInvoicePayment
} from '../controllers/invoice.controller.js';

const invoicesRouter = new Router();

// Secure all endpoints in this file - user must be logged in to access anything here
invoicesRouter.use(authenticate);

// GET /api/v1/invoices
// Accessible by logged-in users (Admins see all records, Patients see their own)
invoicesRouter.get('/', getInvoices);

// GET /api/v1/invoices/summary
// Fetches financial aggregates (total billed, paid, pending metrics)
invoicesRouter.get('/summary', getInvoiceSummary);

// POST /api/v1/invoices
// Only Admins can register a new invoice profile entry
invoicesRouter.post('/', requireAdmin, createInvoice);

// POST /api/v1/invoices/:id/payments
// Only Admins can record an incoming payment record against an invoice balance
invoicesRouter.post('/:id/payments', requireAdmin, processInvoicePayment);

export default invoicesRouter;