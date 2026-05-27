import { Router } from 'express';
import multer from 'multer';
import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminauth.js';
import Appointment from '../models/appointments.model.js';

const medicalRouter = new Router();

// ─── File Upload Setup (Memory Storage) ───
const upload = multer({
    storage: multer.memoryStorage(),
});

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "medical_files",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

medicalRouter.use(authenticate);

// ─── Admin: Upload scan file ───
medicalRouter.post('/appointments/:id/upload-scan', requireAdmin, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    try {
        const result = await uploadToCloudinary(req.file.buffer);
        const fileUrl = result.secure_url;
        const appt = await Appointment.findByIdAndUpdate(req.params.id,
            { $push: { scans: { filename: req.file.originalname, url: fileUrl } } }, { returnDocument: 'after' });
        res.json({ success: true, appointment: appt });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
});

// ─── Admin: Upload report file ───
medicalRouter.post('/appointments/:id/upload-report', requireAdmin, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    try {
        const result = await uploadToCloudinary(req.file.buffer);
        const fileUrl = result.secure_url;
        const appt = await Appointment.findByIdAndUpdate(req.params.id,
            { $push: { reports: { filename: req.file.originalname, url: fileUrl } } }, { returnDocument: 'after' });
        res.json({ success: true, appointment: appt });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
});

// ─── Admin: Upload patient photo ───
medicalRouter.post('/appointments/:id/upload-photo', requireAdmin, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    try {
        const result = await uploadToCloudinary(req.file.buffer);
        const fileUrl = result.secure_url;
        const caption = req.body.caption || '';
        const appt = await Appointment.findByIdAndUpdate(req.params.id,
            { $push: { photos: { filename: req.file.originalname, url: fileUrl, caption } } }, { returnDocument: 'after' });
        res.json({ success: true, appointment: appt });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
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
        res.json({ success: true, appointment: appt });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting file' });
    }
});

// ─── Admin: Delete single report by its ID ───
medicalRouter.delete("/report/:id", authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      "reports._id": req.params.id,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    appointment.reports =
      appointment.reports.filter(
        (r) => r._id.toString() !== req.params.id
      );

    await appointment.save();

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
    });
  }
});

// ─── Admin: Delete single scan by its ID ───
medicalRouter.delete("/scan/:id", authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      "scans._id": req.params.id,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Scan not found",
      });
    }

    appointment.scans = appointment.scans.filter(
      (scan) => scan._id.toString() !== req.params.id
    );

    await appointment.save();

    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Delete failed",
    });
  }
});

export default medicalRouter;
