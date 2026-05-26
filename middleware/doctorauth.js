export const requireDoctor = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: Please log in.' });
    }

    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
        // We usually let admins override and access doctor routes too,
        // but you can remove the admin check if you want it strictly for doctors.
        return res.status(403).json({ message: 'Forbidden: Doctor access required.' });
    }

    next();
};