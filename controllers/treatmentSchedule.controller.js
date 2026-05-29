import TreatmentSchedule from '../models/treatmentSchedule.model.js';

export const createTreatmentSchedule = async (req, res) => {
    try {
        const { patientId, patientName, treatmentName, treatmentDays, sessions, notes } = req.body;
        
        if (!patientId || !patientName || !treatmentName || !treatmentDays || !sessions || !sessions.length) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newSchedule = await TreatmentSchedule.create({
            patientId,
            patientName,
            treatmentName,
            treatmentDays,
            sessions,
            notes
        });

        res.status(201).json({ schedule: newSchedule });
    } catch (error) {
        console.error('Error creating treatment schedule:', error);
        res.status(500).json({ message: 'Server error creating treatment schedule' });
    }
};

export const getTreatmentSchedules = async (req, res) => {
    try {
        const schedules = await TreatmentSchedule.find().sort({ createdAt: -1 });
        res.json({ schedules });
    } catch (error) {
        console.error('Error fetching treatment schedules:', error);
        res.status(500).json({ message: 'Server error fetching treatment schedules' });
    }
};
