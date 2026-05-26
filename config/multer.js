import multer from 'multer';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

const fileFilter = (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only JPEG, PNG, WebP images and PDFs are allowed.'), false);
};

const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: FILE_SIZE_LIMIT },
    fileFilter
});

export default { upload, ALLOWED_TYPES, FILE_SIZE_LIMIT };
