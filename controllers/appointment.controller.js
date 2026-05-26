import Appointment from '../models/appointments.model.js';
import User from '../models/user.js';

/**
 * Fetch appointments listing
 */
export const getAppointments = async (req, res) => {
    try {
        // Admins/Doctors view the entire clinic schedule; Patients view their own rows
        const query = (req.user.role === 'admin' || req.user.role === 'doctor')
            ? {}
            : { patientId: req.user._id };

        const list = await Appointment.find(query)
            .populate('patientId', 'name phone email')
            .sort({ date: 1, time: 1 });

        return res.json({ appointments: list });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return res.status(500).json({ message: 'Error fetching appointments' });
    }
};

/**
 * Create a new appointment document entry
 */
export const createAppointment = async (req, res) => {
    let targetPatientId;

    // 1. Determine permission scope context
    if (req.user.role === 'admin' || req.user.role === 'doctor') {
        targetPatientId = req.body.patientId;
        if (!targetPatientId) {
            return res.status(400).json({ message: 'Admin must provide a patientId within the payload.' });
        }
    } else if (req.user.role === 'patient') {
        // Secure self-booking match directly from the verified authorization token
        targetPatientId = req.user._id;
    } else {
        return res.status(403).json({ message: 'Unauthorized to book appointments.' });
    }

    const { date, time, service, notes } = req.body;

    try {
        // 2. Validate user identity document profile registry
        const patientExists = await User.findOne({ _id: targetPatientId, role: 'patient' });
        if (!patientExists) return res.status(404).json({ message: 'Target patient document not found.' });

        // 3. Persist record to database cluster
        const newAppointment = await Appointment.create({
            patientId: targetPatientId,
            date,
            time: time || '10:00 AM',
            service: service || 'Consultation',
            status: 'scheduled',
            notes: notes || '',
            source: req.user.role === 'patient' ? 'website' : 'admin'
        });

        return res.status(201).json({ appointment: newAppointment });
    } catch (error) {
        console.error('Error creating appointment:', error);
        return res.status(500).json({ message: 'Internal server error processing appointment booking.' });
    }
};

/**
 * Update the structural lifecycle status states of an appointment record
 */
export const updateAppointmentStatus = async (req, res) => {
    const { status } = req.body;
    const allowedStatuses = ['scheduled', 'completed', 'cancelled', 'no-show'];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` });
    }

    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('patientId', 'name phone');

        if (!appointment) return res.status(404).json({ message: 'Appointment record not found.' });

        return res.json({ appointment });
    } catch (error) {
        console.error('Error updating status context:', error);
        return res.status(500).json({ message: 'Server error updating appointment documentation state.' });
    }
};