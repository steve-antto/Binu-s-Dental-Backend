import multer from 'multer';

// Keep the file in memory instead of saving to the local disk.
// This is required if you are uploading directly to Firebase/AWS.
const storage = multer.memoryStorage();

// Set limits and file type filters
export const uploadMiddleware = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images and PDFs only
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false);
        }
    }
});

// Example export for a single file upload named 'document'
export const uploadSingleDocument = uploadMiddleware.single('document');