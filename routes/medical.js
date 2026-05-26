import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminauth.js';
import Appointment from '../models/appointments.model.js';

const medicalRouter = new Router();

// ─── File Upload Setup ───
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
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|pdf|webp|bmp|tiff/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        cb(null, ext || mime);
    }
});

medicalRouter.use(authenticate);

// ─── Admin: Upload scan file ───
medicalRouter.post('/appointments/:id/upload-scan', requireAdmin, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    const appt = await Appointment.findByIdAndUpdate(req.params.id,
        { $push: { scans: { filename: req.file.originalname, url: fileUrl } } }, { returnDocument: 'after' });
    res.json({ success: true, appointment: appt });
});

// ─── Admin: Upload report file ───
medicalRouter.post('/appointments/:id/upload-report', requireAdmin, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    const appt = await Appointment.findByIdAndUpdate(req.params.id,
        { $push: { reports: { filename: req.file.originalname, url: fileUrl } } }, { returnDocument: 'after' });
    res.json({ success: true, appointment: appt });
});

// ─── Admin: Upload patient photo ───
medicalRouter.post('/appointments/:id/upload-photo', requireAdmin, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    const caption = req.body.caption || '';
    const appt = await Appointment.findByIdAndUpdate(req.params.id,
        { $push: { photos: { filename: req.file.originalname, url: fileUrl, caption } } }, { returnDocument: 'after' });
    res.json({ success: true, appointment: appt });
});

// ─── Admin: Update prescription ───
medicalRouter.patch('/appointments/:id/prescription', requireAdmin, async (req, res) => {
    const { prescription } = req.body;
    const appt = await Appointment.findByIdAndUpdate(req.params.id, { prescription }, { returnDocument: 'after' });
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ success: true, appointment: appt });
});

// ─── Admin: Update medical history ───
medicalRouter.patch('/appointments/:id/medical-history', requireAdmin, async (req, res) => {
    const { medicalHistory } = req.body;
    const appt = await Appointment.findByIdAndUpdate(req.params.id, { medicalHistory }, { returnDocument: 'after' });
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ success: true, appointment: appt });
});

// ─── Admin: Add scan/report/photo via URL ───
medicalRouter.post('/appointments/:id/scans', requireAdmin, async (req, res) => {
    const { filename, url } = req.body;
    const appt = await Appointment.findByIdAndUpdate(req.params.id,
        { $push: { scans: { filename, url } } }, { returnDocument: 'after' });
    res.json({ success: true, appointment: appt });
});

medicalRouter.post('/appointments/:id/reports', requireAdmin, async (req, res) => {
    const { filename, url } = req.body;
    const appt = await Appointment.findByIdAndUpdate(req.params.id,
        { $push: { reports: { filename, url } } }, { returnDocument: 'after' });
    res.json({ success: true, appointment: appt });
});

medicalRouter.post('/appointments/:id/photos', requireAdmin, async (req, res) => {
    const { filename, url, caption } = req.body;
    const appt = await Appointment.findByIdAndUpdate(req.params.id,
        { $push: { photos: { filename, url, caption: caption || '' } } }, { returnDocument: 'after' });
    res.json({ success: true, appointment: appt });
});

// ─── Patient: Get their own appointments ───
medicalRouter.get('/my-appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user._id }).sort({ date: -1 });
        res.json({ appointments });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching appointments' });
    }
});

// ─── Admin: Get all appointments ───
medicalRouter.get('/all-appointments', requireAdmin, async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ date: -1 }).populate('patientId', 'name email phone');
        res.json({ appointments });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching appointments' });
    }
});

// ─── Admin: Delete scan/report/photo file ───
medicalRouter.delete('/appointments/:id/files', requireAdmin, async (req, res) => {
    const { type, url } = req.body;
    if (type !== 'scan' && type !== 'report' && type !== 'photo') return res.status(400).json({ message: 'Invalid file type' });
    const field = type === 'scan' ? 'scans' : type === 'report' ? 'reports' : 'photos';
    try {
        const appt = await Appointment.findByIdAndUpdate(
            req.params.id,
            { $pull: { [field]: { url: url } } },
            { returnDocument: 'after' }
        );
        if (!appt) return res.status(404).json({ message: 'Appointment not found' });
        if (url.startsWith('/uploads/')) {
            const filePath = path.join(process.cwd(), url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        res.json({ success: true, appointment: appt });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting file' });
    }
});

export default medicalRouter;
