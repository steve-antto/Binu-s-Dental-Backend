import express from 'express';

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        const { name, email, message } = req.body;
        
        if (!name || !message) {
            return res.status(400).json({ message: "Name and message are required." });
        }

        console.log(`📬 [New Contact Message] Name: ${name} | Email: ${email || 'Not provided'} | Message: "${message}"`);

        return res.status(200).json({ message: "Message received successfully!" });
    } catch (error) {
        next(error);
    }
});

export default router;
