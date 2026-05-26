import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminauth.js';

// Import the specific logic from your controller
import { getTreatments, createTreatment } from '../controllers/treatment.controller.js';

const treatmentsRouter = new Router();

// 1. Authenticate ALL routes in this file (User must be logged in)
treatmentsRouter.use(authenticate);

// 2. GET /api/v1/treatments
// Accessible by logged-in users (Admins see all, patients see their own based on controller logic)
treatmentsRouter.get('/', getTreatments);

// 3. POST /api/v1/treatments
// Only Admins (and Doctors, if you want to add that middleware) can create treatments
treatmentsRouter.post('/', requireAdmin, createTreatment);

/* Note: If you plan to add the update or invoice-suggestion features
  from your old code, you would add them here like this:

  import { updateTreatment, getInvoiceSuggestion } from '../controllers/treatment.controller.js';
  treatmentsRouter.patch('/:id', requireAdmin, updateTreatment);
  treatmentsRouter.get('/:id/invoice-suggestion', requireAdmin, getInvoiceSuggestion);
*/

export default treatmentsRouter;