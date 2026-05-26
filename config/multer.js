import multer from 'multer';
import path from 'path';

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';
        if (file.fieldname === 'scan' || file.fieldname === 'xray') uploadPath += 'scans/xray/';
        else if (file.fieldname === 'ctScan') uploadPath += 'scans/ct-scan/';
        else if (file.fieldname === 'beforeAfter') uploadPath += 'scans/before-after/';
        else if (file.fieldname === 'report') uploadPath += 'reports/';
        else if (file.fieldname === 'prescription') uploadPath += 'prescriptions/';
        else if (file.fieldname === 'invoice') uploadPath += 'invoices/';
        else if (file.fieldname === 'profile') uploadPath += 'profile/';
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const memoryStorage = multer.memoryStorage();

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

const fileFilter = (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only JPEG, PNG, WebP images and PDFs are allowed.'), false);
};

const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

export const uploadDisk = multer({ storage: diskStorage, limits: { fileSize: FILE_SIZE_LIMIT }, fileFilter });
export const uploadMemory = multer({ storage: memoryStorage, limits: { fileSize: FILE_SIZE_LIMIT }, fileFilter });

export default { uploadDisk, uploadMemory, ALLOWED_TYPES, FILE_SIZE_LIMIT };
