export const requirePatient = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: Please log in.' });
    }

    if (req.user.role !== 'patient') {
        return res.status(403).json({ message: 'Forbidden: Patient access required.' });
    }

    next();
};