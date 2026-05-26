import admin from '../firebase/firebaseAdmin.js';
import User from '../models/user.js';

// Utility to remove sensitive mongoose data
const getSafeUser = (userDoc) => {
    const obj = typeof userDoc.toObject === 'function' ? userDoc.toObject() : userDoc;
    delete obj.__v;
    return obj;
};

export const syncUser = async (req, res) => {
    const idToken = req.body.token || (req.headers.authorization ? req.headers.authorization.split('Bearer ')[1] : null);
    if (!idToken) return res.status(401).json({ message: 'Firebase ID token is required.' });

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid: firebaseUid, email, name, phone_number } = decodedToken;

        if (!email) return res.status(400).json({ message: 'Email is required.' });

        const normalizedEmail = email.toLowerCase();
        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            user = await User.create({
                firebaseUid,
                name: name || 'Clinic Patient',
                email: normalizedEmail,
                phone: phone_number || '',
            });
        }

        return res.json({ message: 'User synced successfully', user: getSafeUser(user) });
    } catch (error) {
        console.error('Firebase Auth Error:', error);
        return res.status(401).json({ message: 'Invalid or expired Firebase token.' });
    }
};

export const getCurrentUser = (req, res) => {
    return res.json({ user: getSafeUser(req.user) });
};

export const signOut = (req, res) => {
    res.send({ message: 'Sign Out Successful' });
};