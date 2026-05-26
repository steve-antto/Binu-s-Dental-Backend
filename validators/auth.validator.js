/**
 * Auth request validators
 */

export const validateSyncUser = (req, res, next) => {
    const idToken = req.body.token || (req.headers.authorization ? req.headers.authorization.split('Bearer ')[1] : null);

    if (!idToken) {
        return res.status(401).json({ message: 'Firebase ID token is required.' });
    }

    next();
};

export default { validateSyncUser };
