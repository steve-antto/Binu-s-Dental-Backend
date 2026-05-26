import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminauth.js';
import {
    getAllDoctors,
    createDoctorProfile,
    updateDoctorProfile,
    deleteDoctorProfile
} from '../controllers/doctor.controller.js';

const doctorsRouter = new Router();

// File upload configuration for Doctor Profile Photos (memory storage for Vercel)
const upload = multer({
    storage: multer.memoryStorage(),
});

// GET /api/v1/doctors - List all doctors (PUBLIC - accessible by everyone)
doctorsRouter.get('/', getAllDoctors);

// All other modification routes require authentication and admin privileges
doctorsRouter.post('/', authenticate, requireAdmin, createDoctorProfile);
doctorsRouter.put('/:id', authenticate, requireAdmin, updateDoctorProfile);
doctorsRouter.delete('/:id', authenticate, requireAdmin, deleteDoctorProfile);

// Admin: Upload doctor photo
doctorsRouter.post('/upload-photo', authenticate, requireAdmin, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No photo uploaded' });
    const fileUrl = null;
    res.json({ success: true, url: fileUrl });
});

export default doctorsRouter;
