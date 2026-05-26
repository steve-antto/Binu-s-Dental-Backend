import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminauth.js';
import { getAllPatients, updateReminderProfile } from '../controllers/patient.controller.js';

const patientsRouter = new Router();

// Protect all endpoints in this file - user must be logged in as an admin
patientsRouter.use(authenticate, requireAdmin);

// GET /api/v1/patients - Get all registered patients (supports query parameter ?q=)
patientsRouter.get('/', getAllPatients);

// PUT /api/v1/patients/:id/reminder-profile - Update a patient's clinic profile card
patientsRouter.put('/:id/reminder-profile', updateReminderProfile);

export default patientsRouter;