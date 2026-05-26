import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ['patient', 'admin', 'doctor'],
        default: 'patient'
    },
    phone: { type: String, default: '' },
    dob: { type: String, default: '' },
    gender: { type: String, default: '' },
    language: { type: String, default: 'en' },
    reminderChannels: { type: [String], default: ['whatsapp'] }
}, {
    timestamps: true // Automatically creates 'createdAt' and 'updatedAt'
});

const User = mongoose.model('User', userSchema);

export default User;