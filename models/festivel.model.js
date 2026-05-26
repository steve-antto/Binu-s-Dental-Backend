import mongoose from 'mongoose';

const festivalSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., 'Diwali', 'Christmas'
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    isClinicClosed: { type: Boolean, default: true },
    description: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Festival', festivalSchema);