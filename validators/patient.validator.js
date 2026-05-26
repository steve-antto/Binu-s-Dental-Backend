/**
 * Patient request validators
 */

const VALID_CHANNELS = ['sms', 'telegram', 'whatsapp', 'email'];
const VALID_GENDERS = ['Male', 'Female', 'Other', ''];

export const validateUpdateReminderProfile = (req, res, next) => {
    const { reminderChannels, gender } = req.body;

    // Validate reminder channels if provided
    if (reminderChannels && Array.isArray(reminderChannels)) {
        const invalid = reminderChannels.filter(c => !VALID_CHANNELS.includes(String(c).toLowerCase()));
        if (invalid.length > 0) {
            return res.status(400).json({
                message: `Invalid reminder channels: ${invalid.join(', ')}. Allowed: ${VALID_CHANNELS.join(', ')}`
            });
        }
    }

    // Validate gender if provided
    if (gender !== undefined && !VALID_GENDERS.includes(gender)) {
        return res.status(400).json({
            message: `Invalid gender. Allowed values: ${VALID_GENDERS.filter(g => g).join(', ')}`
        });
    }

    next();
};

export default { validateUpdateReminderProfile };
