import express from 'express';
import { createTreatmentSchedule, getTreatmentSchedules } from '../controllers/treatmentSchedule.controller.js';
import { verifyToken, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', restrictTo('admin', 'doctor'), createTreatmentSchedule);
router.get('/', restrictTo('admin', 'doctor'), getTreatmentSchedules);

export default router;
