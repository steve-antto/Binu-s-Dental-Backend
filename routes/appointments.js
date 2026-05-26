import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminauth.js';
import Appointment from '../models/appointments.model.js';
import User from '../models/user.js';

import { getAppointments, createAppointment, updateAppointmentStatus } from '../controllers/appointment.controller.js';

const appointmentsRouter = new Router();

// ─── PUBLIC: Get booked slots for a date ───
appointmentsRouter.get('/booked-slots', async (req, res) => {
    const { date } = req.query;
    if (!date) return res.json({ bookedSlots: [] });
    try {
        const appointments = await Appointment.find({ date, status: { $ne: 'cancelled' } }).select('time');
        const bookedSlots = appointments.map(a => a.time);
        return res.json({ bookedSlots });
    } catch (err) {
        return res.json({ bookedSlots: [] });
    }
});

// ─── PUBLIC PATIENT BOOKING ───
appointmentsRouter.post('/public-book', async (req, res) => {
    const { patientName, phone, email, service, date, time, notes } = req.body;
    if (!patientName || !phone || !date || !time) return res.status(400).json({ message: 'Name, phone, date, and time are required.' });

    // Block Sundays
    if (new Date(date).getDay() === 0) return res.status(400).json({ message: 'Sundays are holidays. Please choose another day.' });

    // Check if slot is already booked
    const existing = await Appointment.findOne({ date, time, status: { $ne: 'cancelled' } });
    if (existing) return res.status(400).json({ message: 'This time slot is already booked. Please choose another.' });

    try {
        // Try to link booking to an existing user account by email
        let patientId = null;
        if (email) {
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) patientId = existingUser._id;
        }

        const newAppointment = await Appointment.create({
            patientId, patientName, patientPhone: phone, patientEmail: email || '',
            date, time, service: service || 'Consultation', status: 'scheduled', notes: notes || '', source: 'website'
        });

        return res.status(201).json({ success: true, message: 'Appointment booked successfully!', appointment: newAppointment });
    } catch (error) {
        console.error('Booking error:', error);
        return res.status(500).json({ message: 'Failed to book appointment.' });
    }
});

// ─── AUTHENTICATED ROUTES ───
appointmentsRouter.use(authenticate);
appointmentsRouter.get('/', getAppointments);
appointmentsRouter.post('/', createAppointment);
appointmentsRouter.patch('/:id/status', requireAdmin, updateAppointmentStatus);

// ─── ADMIN: Update payment status ───
appointmentsRouter.patch('/:id/payment', requireAdmin, async (req, res) => {
    const { paymentStatus, paymentAmount } = req.body;
    const updated = await Appointment.findByIdAndUpdate(req.params.id, { paymentStatus, paymentAmount }, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ message: 'Appointment not found' });
    return res.json({ success: true, appointment: updated });
});

// ─── ADMIN: Delete appointment ───
appointmentsRouter.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const deleted = await Appointment.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Appointment not found' });
        return res.json({ success: true, message: 'Appointment deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to delete appointment', error: err.message });
    }
});

export default appointmentsRouter;