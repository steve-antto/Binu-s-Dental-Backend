import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminauth.js';
import { getReminders, createReminder } from '../controllers/reminder.controller.js';

const remindersRouter = new Router();

// All reminder routes require authentication and admin access
remindersRouter.use(authenticate, requireAdmin);

// GET /api/v1/remainders - Fetch all reminders
remindersRouter.get('/', getReminders);

// POST /api/v1/remainders - Create a new reminder
remindersRouter.post('/', createReminder);

export default remindersRouter;
