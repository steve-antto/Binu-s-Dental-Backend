import Doctor from '../models/doctor.model.js';

// Get all doctors (no populate needed since it has direct fields now, but supports userId if populated)
export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find()
            .populate('userId', 'name email phone isActive')
            .select('-__v')
            .sort({ createdAt: 1 });
        return res.json({ doctors });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching doctors', error: error.message });
    }
};

// Create a new doctor profile
export const createDoctorProfile = async (req, res) => {
    const { name, qualifications, bio, patientsTreated, experienceYears, image, specialties, consultationFee, availableDays } = req.body;

    if (!name || !qualifications || !bio) {
        return res.status(400).json({ message: 'Name, qualifications, and bio are required.' });
    }

    try {
        const doctor = new Doctor({
            name,
            qualifications,
            bio,
            patientsTreated,
            experienceYears,
            image,
            specialties,
            consultationFee,
            availableDays
        });

        await doctor.save();
        return res.status(201).json({ success: true, doctor });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating doctor profile', error: error.message });
    }
};

// Update an existing doctor profile
export const updateDoctorProfile = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const doctor = await Doctor.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!doctor) return res.status(404).json({ message: 'Doctor not found.' });

        return res.json({ success: true, doctor });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating doctor profile', error: error.message });
    }
};

// Delete a doctor profile
export const deleteDoctorProfile = async (req, res) => {
    const { id } = req.params;

    try {
        const doctor = await Doctor.findByIdAndDelete(id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found.' });

        return res.json({ success: true, message: 'Doctor profile deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting doctor profile', error: error.message });
    }
};