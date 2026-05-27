import { Router } from 'express';
import multer from 'multer';
import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';
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
const upload = multer({
    storage: multer.memoryStorage(),
});

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "doctors",
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// GET /api/v1/doctors - List all doctors (PUBLIC - accessible by everyone)
doctorsRouter.get('/', getAllDoctors);

// All other modification routes require authentication and admin privileges
doctorsRouter.post('/', authenticate, requireAdmin, createDoctorProfile);
doctorsRouter.put('/:id', authenticate, requireAdmin, updateDoctorProfile);
doctorsRouter.delete('/:id', authenticate, requireAdmin, deleteDoctorProfile);

// Admin: Upload doctor photo
doctorsRouter.post('/upload-photo', authenticate, requireAdmin, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No photo uploaded' });
    try {
        const result = await uploadToCloudinary(req.file.buffer);
        res.json({ success: true, url: result.secure_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
});

export default doctorsRouter;
