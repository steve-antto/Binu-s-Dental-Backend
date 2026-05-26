import User from '../models/user.js';
import Patient from '../models/patients.model.js';

/**
 * Fetch all users with the 'patient' role
 * Supports optional search filter via query parameter: ?q=name_or_phone
 */
export const getAllPatients = async (req, res) => {
    const q = String(req.query.q || '').trim();

    try {
        // Core query ensures we only retrieve accounts belonging to patients
        let query = { role: 'patient' };

        // If a search term is provided, use regex for case-insensitive matching
        if (q) {
            query.$or = [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-__v') // Exclude internal mongoose version key
            .sort({ createdAt: -1 }); // Newest registrations first

        return res.json({ patients: users });
    } catch (error) {
        console.error('Error fetching patients list:', error);
        return res.status(500).json({ message: 'Server error fetching patient records.', error: error.message });
    }
};

/**
 * Update a patient's core information and reminder delivery options
 */
export const updateReminderProfile = async (req, res) => {
    const { id } = req.params; // Expects User ObjectId
    const { phone, dob, gender, bloodGroup, address, reminderChannels } = req.body;

    try {
        // 1. Sanitize input channels to match allowed notification types
        const validChannels = ['sms', 'telegram', 'whatsapp', 'email'];
        const channels = Array.isArray(reminderChannels)
            ? [...new Set(reminderChannels.map(c => String(c).toLowerCase()).filter(c => validChannels.includes(c)))]
            : ['whatsapp'];

        // 2. Locate and update the master profile document in the Patient collection
        let patientProfile = await Patient.findOne({ userId: id });

        if (!patientProfile) {
            // Fallback: If profile tracking record doesn't exist yet, construct it inline
            patientProfile = new Patient({ userId: id });
        }

        patientProfile.phone = phone !== undefined ? phone : patientProfile.phone;
        patientProfile.dob = dob !== undefined ? dob : patientProfile.dob;
        patientProfile.gender = gender !== undefined ? gender : patientProfile.gender;
        patientProfile.bloodGroup = bloodGroup !== undefined ? bloodGroup : patientProfile.bloodGroup;
        patientProfile.address = address !== undefined ? address : patientProfile.address;
        patientProfile.reminderChannels = channels;

        await patientProfile.save();

        // 3. Populate related account data before responding to the frontend client
        const populatedProfile = await Patient.findById(patientProfile._id)
            .populate('userId', 'name email isActive')
            .select('-__v');

        return res.json({
            message: 'Patient profile registry updated successfully',
            patient: populatedProfile
        });
    } catch (error) {
        console.error('Error updating patient profile data:', error);
        return res.status(500).json({ message: 'Internal server error processing profile save operation.', error: error.message });
    }
};