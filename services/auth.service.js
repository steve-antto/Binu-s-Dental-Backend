import admin from '../firebase/firebaseAdmin.js';

/**
 * Verifies a Firebase ID token and returns the decoded payload.
 */
export const verifyFirebaseToken = async (idToken) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        console.error('Service Error - Token Verification Failed:', error.message);
        throw new Error('Invalid or expired token');
    }
};

/**
 * Revokes all refresh tokens for a user (forces them to log out of all devices).
 */
export const revokeUserTokens = async (firebaseUid) => {
    try {
        await admin.auth().revokeRefreshTokens(firebaseUid);
        return true;
    } catch (error) {
        console.error('Service Error - Token Revocation Failed:', error.message);
        throw error;
    }
};