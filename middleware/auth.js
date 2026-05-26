import admin from '../firebase/firebaseAdmin.js';
import User from '../models/user.js';

export const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // --- DEVELOPMENT BYPASS ---
    // If we are in dev mode and the token is exactly "test-admin-token", skip Firebase
    if (process.env.NODE_ENV === 'development' && token === 'test-admin-token') {
        req.user = {
            _id: '60d5ecb8b392d7001f3e9a5c',
            name: 'Test Admin',
            role: 'admin',
            email: 'admin@test.com'
        };
        return next();
    }
    // --------------------------

    try {
        // 1. Verify token with Firebase
        const decodedToken = await admin.auth().verifyIdToken(token);

        // 2. Find the user in MongoDB
        const user = await User.findOne({ email: decodedToken.email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found in database' });
        }

        // 3. Attach user to the request
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
};