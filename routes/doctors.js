import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminauth.js';
import {
    getAllDoctors,
    createDoctorProfile,
    updateDoctorProfile,
    deleteDoctorProfile
} from '../controllers/doctor.controller.js';

const doctorsRouter = new Router();

// File upload configuration for Doctor Profile Photos
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp|gif/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        cb(null, ext || mime);
    }
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
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
});

export default doctorsRouter;
