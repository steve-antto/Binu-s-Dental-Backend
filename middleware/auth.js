import admin from '../firebase/firebaseAdmin.js';
import User from '../models/user.js';

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

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
        // 1. Verify Firebase token
        const decodedToken = await admin.auth().verifyIdToken(token);

        // 2. Check 20-minute session expiry
        const loginTime = decodedToken.auth_time * 1000;
        const currentTime = Date.now();
        const TWENTY_MINUTES = 20 * 60 * 1000;

        if (currentTime - loginTime > TWENTY_MINUTES) {
            return res.status(401).json({
                message: "Session expired after 20 minutes. Please login again.",
            });
        }

        // 3. Find user in MongoDB
        const user = await User.findOne({
            email: decodedToken.email.toLowerCase(),
        });

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized: User not found in database",
            });
        }

        // 4. Attach user
        req.user = user;
        next();
    } catch (error) {
        console.error("Firebase Auth Verification Error:", error);
        return res.status(401).json({
            message: "Session expired. Please login again."
        });
    }
};