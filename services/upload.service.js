import admin from '../firebase/firebaseAdmin.js';
import multer from 'multer';

// Configure Multer to store files in memory temporarily before uploading to Firebase
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * Uploads a file buffer to Firebase Cloud Storage and returns the public URL.
 */
export const uploadFileToStorage = async (file, folderPath = 'documents') => {
    if (!file) throw new Error('No file provided');

    try {
        const bucket = admin.storage().bucket(); // Uses the bucket defined in your Firebase config
        const uniqueFilename = `${folderPath}/${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
        const fileRef = bucket.file(uniqueFilename);

        // Upload the file to Firebase
        await fileRef.save(file.buffer, {
            metadata: {
                contentType: file.mimetype,
            },
        });

        // Make the file public (optional, depending on your privacy needs)
        await fileRef.makePublic();

        // Get the public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFilename}`;

        return publicUrl;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('File upload failed');
    }
};