import express from 'express';
import { createTreatmentSchedule, getTreatmentSchedules } from '../controllers/treatmentSchedule.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRoles } from '../middleware/roleauth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', requireRoles(['admin', 'doctor']), createTreatmentSchedule);
router.get('/', requireRoles(['admin', 'doctor']), getTreatmentSchedules);

export default router;
