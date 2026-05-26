import { Router } from 'express';
import admin from '../firebase/firebaseAdmin.js';
import User from '../models/user.js';
import { authenticate } from '../middleware/auth.js';

const authRouter = new Router();

// Utility to strip out sensitive data (like the MongoDB internal __v) before sending to frontend
const safeUser = (userDoc) => {
    const obj = userDoc.toObject();
    delete obj.__v;
    return obj;
};

// Test route
authRouter.get('/', (req, res) => res.send({ title: 'Auth Base Route' }));

/**
 * /sync-user
 * Frontend sends Firebase ID Token -> Backend verifies and syncs with MongoDB
 */
authRouter.post('/sync-user', async (req, res) => {
    const idToken = req.body.token || (req.headers.authorization ? req.headers.authorization.split('Bearer ')[1] : null);

    if (!idToken) {
        return res.status(401).json({ message: 'Firebase ID token is required.' });
    }

    try {
        // 1. Verify token with Firebase
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid: firebaseUid, email, name, phone_number } = decodedToken;

        if (!email) {
            return res.status(400).json({ message: 'Email is required from Firebase auth.' });
        }

        const normalizedEmail = email.toLowerCase();

        // 2. Find user in MongoDB using Mongoose
        let user = await User.findOne({ email: normalizedEmail });

        // 3. If they don't exist, create them in MongoDB
        if (!user) {
            user = await User.create({
                firebaseUid,
                name: name || 'Clinic Patient',
                email: normalizedEmail,
                phone: phone_number || '',
            });
        }

        // 4. Return safe user to frontend
        return res.json({
            message: 'User synced successfully',
            user: safeUser(user)
        });

    } catch (error) {
        console.error('Firebase Auth Verification Error:', error);
        return res.status(401).json({ message: 'Invalid or expired Firebase token.' });
    }
});

/**
 * /sign-out
 * Firebase handles actual sign-out on the client side. This is just an endpoint
 * if you need to clear specific backend logs or HTTP-only cookies later.
 */
authRouter.post('/sign-out', (req, res) => {
    res.send({ title: 'Sign Out Successful' });
});

/**
 * /users/:id/language
 * Update user language preference
 */
authRouter.patch('/users/:id/language', authenticate, async (req, res) => {
    try {
        const { language } = req.body;
        if (!language) {
            return res.status(400).json({ message: 'Language code is required.' });
        }

        // Only allow users to update their own language (or admin)
        if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { language },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ message: 'Language updated successfully', user: safeUser(user) });
    } catch (error) {
        console.error('Error updating language:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default authRouter;