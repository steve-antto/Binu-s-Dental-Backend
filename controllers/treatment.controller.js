import Treatment from '../models/treatments.model.js';

export const getTreatments = async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { patientId: req.user._id };
        const treatments = await Treatment.find(query).populate('patientId', 'name phone');
        return res.json({ treatments });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching treatments' });
    }
};

export const createTreatment = async (req, res) => {
    const { patientId, appointmentId, treatmentName, type, notes, cost, status } = req.body;

    try {
        const newTreatment = await Treatment.create({
            patientId,
            appointmentId,
            treatmentName,
            type: type || 'other',
            notes,
            cost: Number(cost) || 0,
            status: status || 'planned'
        });

        return res.status(201).json({ treatment: newTreatment });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating treatment' });
    }
};