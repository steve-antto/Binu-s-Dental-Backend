import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminauth.js';
import { getDocuments, uploadDocumentRecord } from '../controllers/document.controller.js';

const documentsRouter = new Router();

// All document routes require authentication
documentsRouter.use(authenticate);

// GET /api/v1/documents - Fetch documents (admin sees all, patients see their own)
documentsRouter.get('/', getDocuments);

// POST /api/v1/documents - Upload a new document record (admin only)
documentsRouter.post('/', requireAdmin, uploadDocumentRecord);

export default documentsRouter;
