import Document from '../models/documents.model.js';

export const getDocuments = async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { patientId: req.user._id };
        const documents = await Document.find(query).sort({ createdAt: -1 });
        return res.json({ documents });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching documents', error: error.message });
    }
};

export const uploadDocumentRecord = async (req, res) => {
    const { patientId, title, fileUrl, type } = req.body;

    try {
        // Note: The actual file upload (to AWS S3, Cloudinary, or Firebase Storage)
        // should happen before this, and you pass the resulting URL here.
        const document = await Document.create({
            patientId,
            title,
            fileUrl,
            type: type || 'other'
        });

        return res.status(201).json({ document });
    } catch (error) {
        return res.status(500).json({ message: 'Error saving document record', error: error.message });
    }
};